// ==UserScript==
// @name        bangumi collection export tool
// @name:zh-CN  bangumi 收藏导出工具
// @namespace   https://github.com/22earth
// @description 导出和导入 Bangumi 收藏为 Excel
// @description:en-US export or import collection on bangumi.tv
// @description:zh-CN 导出和导入 Bangumi 收藏为 Excel
// @author      22earth,Liebessprache
// @homepage    https://github.com/22earth/gm_scripts
// @include     /^https?:\/\/(bangumi|bgm|chii)\.(tv|in)\/\w+\/list\/.*$/
// @include     /^https?:\/\/(bangumi|bgm|chii)\.(tv|in)\/index\/\d+/
// @include     /^https?:\/\/(bangumi|bgm|chii)\.(tv|in)\/(anime|book|music|game|real)\/browser\/?.*$/
// @include     /^https?:\/\/(bangumi|bgm|chii)\.(tv|in)\/subject_search\/.*$/
// @version     1.2.10
// @grant       GM_xmlhttpRequest
// @connect     api.bgm.tv
// @require     https://cdn.jsdelivr.net/npm/jschardet@1.4.1/dist/jschardet.min.js
// @require     https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js
// @run-at      document-end
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/556024/bangumi%20collection%20export%20tool.user.js
// @updateURL https://update.greasyfork.org/scripts/556024/bangumi%20collection%20export%20tool.meta.js
// ==/UserScript==


function formatDate(time, fmt = 'yyyy-MM-dd') {
    const date = new Date(time);
    var o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds(),
        'q+': Math.floor((date.getMonth() + 3) / 3),
        S: date.getMilliseconds(), //毫秒
    };
    if (/(y+)/i.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp('(' + k + ')', 'i').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
        }
    }
    return fmt;
}
function dealDate(dataStr) {
    // 2019年12月19
    let l = [];
    if (/\d{4}年\d{1,2}月(\d{1,2}日?)?/.test(dataStr)) {
        l = dataStr
            .replace('日', '')
            .split(/年|月/)
            .filter((i) => i);
    }
    else if (/\d{4}\/\d{1,2}(\/\d{1,2})?/.test(dataStr)) {
        l = dataStr.split('/');
    }
    else if (/\d{4}-\d{1,2}(-\d{1,2})?/.test(dataStr)) {
        return dataStr;
    }
    else {
        return dataStr;
    }
    return l
        .map((i) => {
            if (i.length === 1) {
                return `0${i}`;
            }
            return i;
        })
        .join('-');
}
function extractDateFromText(text = '') {
    if (!text)
        return '';
    const dateMatch = text.match(/\d{4}[年\.\/-]\d{1,2}[月\.\/-]\d{1,2}/);
    if (!dateMatch)
        return '';
    const matched = dateMatch[0].replace(/\./g, '-');
    return dealDate(matched);
}
function formatExportCellValue(value) {
    if (value === undefined || value === null) {
        return 'Null';
    }
    if (typeof value === 'string') {
        if (!value.trim()) {
            return 'Null';
        }
        return value;
    }
    return value;
}
function parseImportedCell(value) {
    const isNullPlaceholder = typeof value === 'string' && value.trim().toLowerCase() === 'null';
    if (value === undefined || value === null || isNullPlaceholder) {
        return {
            value: '',
            isNullPlaceholder,
        };
    }
    return {
        value,
        isNullPlaceholder,
    };
}

// support GM_XMLHttpRequest
let retryCounter = 0;
function fetchInfo(url, type, opts = {}, TIMEOUT = 10 * 1000) {
    var _a;
    const method = ((_a = opts === null || opts === void 0 ? void 0 : opts.method) === null || _a === void 0 ? void 0 : _a.toUpperCase()) || 'GET';
    // @ts-ignore
    {
        const gmXhrOpts = Object.assign({}, opts);
        if (method === 'POST' && gmXhrOpts.body) {
            gmXhrOpts.data = gmXhrOpts.body;
        }
        if (opts.decode) {
            type = 'arraybuffer';
        }
        return new Promise((resolve, reject) => {
            // @ts-ignore
            GM_xmlhttpRequest(Object.assign({
                method, timeout: TIMEOUT, url, responseType: type, onload: function (res) {
                    if (res.status === 404) {
                        retryCounter = 0;
                        reject(404);
                    }
                    else if (res.status === 302 && retryCounter < 5) {
                        retryCounter++;
                        resolve(fetchInfo(res.finalUrl, type, opts, TIMEOUT));
                    }
                    if (opts.decode && type === 'arraybuffer') {
                        retryCounter = 0;
                        let decoder = new TextDecoder(opts.decode);
                        resolve(decoder.decode(res.response));
                    }
                    else {
                        retryCounter = 0;
                        resolve(res.response);
                    }
                }, onerror: (e) => {
                    retryCounter = 0;
                    reject(e);
                }
            }, gmXhrOpts));
        });
    }
}
function fetchText(url, opts = {}, TIMEOUT = 10 * 1000) {
    return fetchInfo(url, 'text', opts, TIMEOUT);
}

function sleep(num) {
    return new Promise((resolve) => {
        setTimeout(resolve, num);
    });
}
function randomSleep(max = 400, min = 200) {
    return sleep(randomNum(max, min));
}
function randomNum(max, min) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getCollectionRouteByUrl(url = '') {
    if (!url)
        return '';
    const match = url.match(/\/(anime|book|music|game|real)\/list\//);
    return match ? match[1] : '';
}
const CURRENT_COLLECTION_ROUTE = typeof location !== 'undefined' ? getCollectionRouteByUrl(location.href) : '';

// @TODO 听和读没有区分开
const typeIdDict = {
    dropped: {
        name: '抛弃',
        id: '5',
    },
    on_hold: {
        name: '搁置',
        id: '4',
    },
    do: {
        name: '在看',
        id: '3',
    },
    collect: {
        name: '看过',
        id: '2',
    },
    wish: {
        name: '想看',
        id: '1',
    },
};
function createInterestLabelMap(overrides = {}) {
    return Object.assign({
        dropped: '抛弃',
        on_hold: '搁置',
        do: '在看',
        collect: '看过',
        wish: '想看',
    }, overrides);
}
const INTEREST_LABELS_BY_ROUTE = {
    default: createInterestLabelMap(),
    anime: createInterestLabelMap(),
    real: createInterestLabelMap(),
    book: createInterestLabelMap({
        do: '在读',
        collect: '读过',
        wish: '想读',
    }),
    music: createInterestLabelMap({
        do: '在听',
        collect: '听过',
        wish: '想听',
    }),
    game: createInterestLabelMap({
        do: '在玩',
        collect: '玩过',
        wish: '想玩',
    }),
};
function getRouteInterestLabels(route = '') {
    if (route && INTEREST_LABELS_BY_ROUTE[route]) {
        return INTEREST_LABELS_BY_ROUTE[route];
    }
    return INTEREST_LABELS_BY_ROUTE.default;
}
function matchInterestKeyByName(name, route = '') {
    const routeMap = getRouteInterestLabels(route);
    for (const [key, label] of Object.entries(routeMap)) {
        if (label === name) {
            return key;
        }
    }
    const defaultMap = INTEREST_LABELS_BY_ROUTE.default;
    for (const [key, label] of Object.entries(defaultMap)) {
        if (label === name) {
            return key;
        }
    }
    return '';
}
function detectInterestLabelFromText(text = '', route = '') {
    const normalized = String(text || "").trim();
    if (!normalized) {
        return "";
    }
    const routeMap = getRouteInterestLabels(route);
    const routeLabels = Object.values(routeMap).filter((label) => label);
    const matched = routeLabels.filter((label) => normalized.includes(label));
    if (matched.length === 1) {
        return matched[0];
    }
    const defaultMap = getRouteInterestLabels("default");
    const defaultLabels = Object.values(defaultMap).filter((label) => label);
    const defaultMatched = defaultLabels.filter((label) => normalized.includes(label));
    if (defaultMatched.length === 1) {
        return defaultMatched[0];
    }
    const allLabels = new Set();
    Object.values(INTEREST_LABELS_BY_ROUTE).forEach((labelMap) => {
        Object.values(labelMap || {}).forEach((label) => {
            if (label) {
                allLabels.add(label);
            }
        });
    });
    const allMatched = Array.from(allLabels).filter((label) => normalized.includes(label));
    if (allMatched.length === 1) {
        return allMatched[0];
    }
    return "";
}
function getItemInterestLabel(item, route = '') {
    if (item && item.watchStatus) {
        const defaultKey = matchInterestKeyByName(item.watchStatus, "default");
        if (route && defaultKey) {
            return getInterestTypeName(defaultKey, route) || item.watchStatus;
        }
        return item.watchStatus;
    }
    const collect = item && item.collectInfo ? item.collectInfo : null;
    if (collect && collect.interestType) {
        const label = getInterestTypeName(collect.interestType, route);
        return label || collect.interestType;
    }
    return '';
}
// 默认返回 2， 表示看过
function getInterestTypeIdByName(name, route = CURRENT_COLLECTION_ROUTE) {
    let type = '2';
    if (!name)
        return type;
    const matchedKey = matchInterestKeyByName(name, route);
    if (matchedKey && typeIdDict[matchedKey]) {
        return typeIdDict[matchedKey].id;
    }
    return type;
}
function getInterestTypeName(type, route = CURRENT_COLLECTION_ROUTE) {
    const labels = getRouteInterestLabels(route);
    if (labels[type]) {
        return labels[type];
    }
    if (typeIdDict[type]) {
        return typeIdDict[type].name;
    }
    return '';
}
function getSubjectId(url) {
    const m = url.match(/(?:subject|character)\/(\d+)/);
    if (!m)
        return '';
    return m[1];
}
function insertLogInfo($sibling, txt) {
    const $log = document.createElement('div');
    $log.classList.add('e-wiki-log-info');
    // $log.setAttribute('style', 'color: tomato;');
    $log.innerHTML = txt;
    $sibling.insertAdjacentElement('afterend', $log);
    return $log;
}
function convertItemInfo($item) {
    let $subjectTitle = $item.querySelector('h3>a.l') || $item.querySelector('h3>a');
    if (!$subjectTitle) {
        return null;
    }
    const infoNode = $item.querySelector('.info') || $item.querySelector('.info.tip') || $item.querySelector('.tip');
    let itemSubject = {
        name: $subjectTitle.textContent.trim(),
        rawInfos: infoNode ? infoNode.textContent.trim() : '',
        // url 没有协议和域名
        url: $subjectTitle.getAttribute('href'),
        greyName: $item.querySelector('h3>.grey')
            ? $item.querySelector('h3>.grey').textContent.trim()
            : '',
    };
    let matchDate = (infoNode ? infoNode.textContent : '')
        .match(/\d{4}[\-\/\年]\d{1,2}[\-\/\月]\d{1,2}/);
    if (matchDate) {
        itemSubject.releaseDate = dealDate(matchDate[0]);
    }
    const $rateInfo = $item.querySelector('.rateInfo');
    if ($rateInfo) {
        const rateInfo = {};
        if ($rateInfo.querySelector('.fade')) {
            rateInfo.score = $rateInfo.querySelector('.fade').textContent;
            const tipNode = $rateInfo.querySelector('.tip_j');
            rateInfo.count = tipNode
                ? tipNode.textContent.replace(/[^0-9]/g, '')
                : '';
        }
        else {
            rateInfo.score = '0';
            rateInfo.count = '少于10';
        }
        itemSubject.rateInfo = rateInfo;
    }
    const $rank = $item.querySelector('.rank');
    if ($rank) {
        itemSubject.rank = $rank.textContent.replace('Rank', '').trim();
    }
    const $collectInfo = $item.querySelector('.collectInfo');
    const collectInfo = {};
    const $comment = $item.querySelector('#comment_box');
    if ($comment) {
        collectInfo.comment = $comment.textContent.trim();
    }
    if ($collectInfo) {
        const textArr = $collectInfo.textContent.split('/');
        collectInfo.date = textArr[0].trim();
        textArr.forEach((str) => {
            if (str.match('标签')) {
                collectInfo.tags = str.replace(/标签:/, '').trim();
            }
        });
        const $starlight = $collectInfo.querySelector('.starlight');
        if ($starlight) {
            $starlight.classList.forEach((s) => {
                if (/stars\d/.test(s)) {
                    collectInfo.score = s.replace('stars', '');
                }
            });
        }
    }
    const detectedLabel = getIndexSubjectTypeLabel($item);
    if (detectedLabel) {
        itemSubject.detectedInterestLabel = detectedLabel;
    }
    if (Object.keys(collectInfo).length) {
        itemSubject.collectInfo = collectInfo;
    }
    const $cover = $item.querySelector('.subjectCover img');
    if ($cover && $cover.tagName.toLowerCase() === 'img') {
        // 替换 cover/s --->  cover/l 是大图
        const src = $cover.getAttribute('src') || $cover.getAttribute('data-cfsrc');
        if (src) {
            itemSubject.cover = src.replace('pic/cover/s', 'pic/cover/l');
        }
    }
    return itemSubject;
}
function getCollectionListItems() {
    return document.querySelectorAll('#subject_list>li, #browserItemList>li, ul.browserFull.browser-list>li, ul.browserList>li');
}
function logDirectoryExportTypes(items, label = '') {
    try {
        const header = label ? `[目录导出][${label}]` : '[目录导出]';
        console.group(header);
        items.forEach((item, idx) => {
            var _a, _b;
            const type = ((_a = item.collectInfo) === null || _a === void 0 ? void 0 : _a.interestType) || ((_b = item.collectInfo) === null || _b === void 0 ? void 0 : _b.interestTypeLabel) || '未知';
            const key = item.name || `#${idx + 1}`;
            console.log({ [key]: type });
        });
        console.groupEnd();
    }
    catch (error) {
        console.warn('目录导出类型日志输出失败: ', error);
    }
}
function getItemInfos($doc = document) {
    const items = $doc.querySelectorAll('#browserItemList>li');
    const res = [];
    for (const item of Array.from(items)) {
        const parsed = convertItemInfo(item);
        if (parsed) {
            res.push(parsed);
        }
    }
    return res;
}
function getSectionTitleFromNode($node) {
    let current = $node.previousElementSibling;
    while (current) {
        if (current.classList && current.classList.contains('subtitle')) {
            return current.textContent.trim();
        }
        current = current.previousElementSibling;
    }
    return '';
}
function convertIndexAvatarItem($item, sectionTitle = '') {
    const $link = $item.querySelector('h3>a');
    if (!$link) {
        return null;
    }
    const infoNode = $item.querySelector('.prsn_info') || $item.querySelector('.tip') || $item.querySelector('.line_detail');
    const infoText = infoNode ? infoNode.textContent.replace(/\s+/g, ' ').trim() : '';
    const avatar = $item.querySelector('img');
    const cover = avatar ? avatar.getAttribute('src') || avatar.getAttribute('data-cfsrc') || '' : '';
    const rawInfos = [sectionTitle, infoText].filter(Boolean).join(' / ');
    const url = $link.getAttribute('href') || '';
    const commentText = extractCommonComment($item);
    return {
        name: $link.textContent.trim(),
        greyName: '',
        releaseDate: '',
        url,
        cover,
        rawInfos,
        collectInfo: {
            interestType: sectionTitle || '目录',
            comment: commentText,
            tags: '',
            date: '',
        },
    };
}
function getIndexCharacterInfos($doc = document) {
    const lists = $doc.querySelectorAll('.browserCrtList');
    const res = [];
    for (const list of Array.from(lists)) {
        const sectionTitle = getSectionTitleFromNode(list);
        const items = list.querySelectorAll('[id^="item_"]');
        for (const item of Array.from(items)) {
            const parsed = convertIndexAvatarItem(item, sectionTitle);
            if (parsed) {
                res.push(parsed);
            }
        }
    }
    return res;
}
function parseIndexDocument($doc = document) {
    const subjects = getItemInfos($doc);
    const characterInfos = getIndexCharacterInfos($doc);
    const combined = [...subjects, ...characterInfos];
    return combined.map((item) => {
        if (!item.collectInfo) {
            item.collectInfo = {};
        }
        if (!item.collectInfo.interestType) {
            if (item.subjectTypeId && SUBJECT_TYPE_LABEL_MAP[item.subjectTypeId]) {
                item.collectInfo.interestType = SUBJECT_TYPE_LABEL_MAP[item.subjectTypeId];
            }
            else if (item.detectedInterestLabel) {
                item.collectInfo.interestType = item.detectedInterestLabel;
            }
            else if (item.url && item.url.startsWith('/character')) {
                item.collectInfo.interestType = '角色';
            }
        }
        return item;
    });
}
function getIndexMainContainer($doc = document) {
    return $doc.querySelector('#columnSubjectBrowserA') || $doc;
}
function normalizeIndexText(text = '') {
    return (text || '').replace(/\s+/g, ' ').trim();
}
function extractCommonComment($item, extraSelectors = []) {
    const selectors = []
        .concat(extraSelectors || [])
        .concat([
        '.collectInfo .comment',
        '.comment_box .text',
        '.comment-box .text',
        '#comment_box',
        '.text_main_even .text',
        '.content',
        '.intro',
        '.line_detail',
        '.message',
        '.quote',
    ]);
    for (const selector of selectors) {
        if (!selector)
            continue;
        const $node = $item.querySelector(selector);
        if ($node) {
            const text = normalizeIndexText($node.textContent);
            if (text) {
                return text;
            }
        }
    }
    return '';
}
function getImageSrcFromNode($img) {
    if (!$img)
        return '';
    return $img.getAttribute('src') || $img.getAttribute('data-cfsrc') || '';
}
function parseIndexBlogDocument($doc = document) {
    const $container = getIndexMainContainer($doc);
    const result = [];
    const $items = $container.querySelectorAll('#entry_list .item');
    for (const $item of Array.from($items)) {
        const $title = $item.querySelector('h2.title a[href^="/blog/"]');
        if (!$title) {
            continue;
        }
        const $coverImg = $item.querySelector('.cover img');
        const cover = getImageSrcFromNode($coverImg);
        const $content = $item.querySelector('.content');
        const $time = $item.querySelector('.tools .time') || $item.querySelector('.info .time');
        const authorLink = $time === null || $time === void 0 ? void 0 : $time.querySelector('a[href^="/user/"]');
        const comment = extractCommonComment($item, ['.content']);
        const timeText = $time ? normalizeIndexText($time.textContent) : '';
        const rawInfos = [
            authorLink ? `作者: ${normalizeIndexText(authorLink.textContent)}` : '',
            timeText,
        ]
            .filter(Boolean)
            .join(' / ');
        const releaseDate = extractDateFromText(timeText);
        result.push({
            name: normalizeIndexText($title.textContent),
            greyName: '',
            releaseDate,
            url: $title.getAttribute('href'),
            cover,
            rawInfos,
            collectInfo: {
                interestType: '',
                comment,
                tags: '',
                date: releaseDate,
            },
        });
    }
    return result;
}
function parseIndexTopicList($doc = document, topicPrefix = '/group/topic/') {
    const $container = getIndexMainContainer($doc);
    const result = [];
    const $items = $container.querySelectorAll('ul.topic-list li');
    for (const $item of Array.from($items)) {
        const $title = $item.querySelector(`.inner a[href^="${topicPrefix}"]`);
        if (!$title) {
            continue;
        }
        const $coverImg = $item.querySelector('.avatar img');
        const cover = getImageSrcFromNode($coverImg);
        const $info = $item.querySelector('.info');
        const authorText = $info && $info.querySelector('.author') ? normalizeIndexText($info.querySelector('.author').textContent) : '';
        const relatedText = $info && $info.querySelector('.related') ? normalizeIndexText($info.querySelector('.related').textContent) : '';
        const timeText = $info && $info.querySelector('.time') ? normalizeIndexText($info.querySelector('.time').textContent) : '';
        const releaseDate = extractDateFromText(timeText);
        const rawInfos = [
            authorText ? `作者: ${authorText}` : '',
            relatedText ? `关联: ${relatedText}` : '',
            timeText,
        ]
            .filter(Boolean)
            .join(' / ');
        const typeLabel = topicPrefix.includes('subject') ? '条目话题' : '小组话题';
        const comment = extractCommonComment($item, ['.inner .quote', '.inner .line', '.inner .row']);
        result.push({
            name: normalizeIndexText($title.textContent),
            greyName: '',
            releaseDate,
            url: $title.getAttribute('href'),
            cover,
            rawInfos,
            collectInfo: {
                interestType: typeLabel,
                comment,
                tags: '',
                date: releaseDate,
            },
        });
    }
    return result;
}
function parseIndexGroupTopicDocument($doc = document) {
    return parseIndexTopicList($doc, '/group/topic/');
}
function parseIndexSubjectTopicDocument($doc = document) {
    return parseIndexTopicList($doc, '/subject/topic/');
}
function parseIndexEpisodeDocument($doc = document) {
    const $container = getIndexMainContainer($doc);
    const result = [];
    const $items = $container.querySelectorAll('ul.browserList li, #browserItemList li');
    for (const $item of Array.from($items)) {
        const $episodeLink = $item.querySelector('h3 a[href^="/ep/"]');
        if (!$episodeLink) {
            continue;
        }
        const $coverImg = $item.querySelector('.avatar img, .subjectCover img');
        const cover = getImageSrcFromNode($coverImg);
        const $subjectLink = $item.querySelector('a[href^="/subject/"] span, a[href^="/subject/"]');
        const subjectName = $subjectLink ? normalizeIndexText($subjectLink.textContent) : '';
        const comment = extractCommonComment($item, ['.comment_box .text']);
        const $time = $item.querySelector('.tools .time, .time.tip_j');
        const timeText = $time ? normalizeIndexText($time.textContent) : '';
        const releaseDate = extractDateFromText(timeText);
        const rawInfos = [
            subjectName ? `所属条目: ${subjectName}` : '',
            timeText,
        ]
            .filter(Boolean)
            .join(' / ');
        const typeLabel = getIndexSubjectTypeLabel($item) || '条目';
        result.push({
            name: normalizeIndexText($episodeLink.textContent),
            greyName: '',
            releaseDate,
            url: $episodeLink.getAttribute('href'),
            cover,
            rawInfos,
            collectInfo: {
                interestType: typeLabel,
                comment,
                tags: '',
                date: releaseDate,
            },
        });
    }
    return result;
}
function getIndexCategoryKey(url) {
    const fallback = 'default';
    const targetUrl = url || (typeof location !== 'undefined' ? location.href : '');
    if (!targetUrl) {
        return fallback;
    }
    try {
        const parsedUrl = new URL(targetUrl, (typeof location !== 'undefined' ? location.origin : 'https://bgm.tv'));
        const rawCat = (parsedUrl.searchParams.get('cat') || '').trim();
        if (rawCat) {
            return rawCat.toLowerCase();
        }
        const segments = parsedUrl.pathname.split('/').filter(Boolean);
        const lastSegment = segments[segments.length - 1] || '';
        if (lastSegment && !/^\d+$/.test(lastSegment)) {
            return lastSegment.toLowerCase();
        }
    }
    catch (error) {
        console.warn('无法解析目录分类 Key: ', error);
    }
    return fallback;
}
function getIndexCategoryLabel(url) {
    const key = getIndexCategoryKey(url);
    return INDEX_CATEGORY_LABEL_MAP[key] || INDEX_CATEGORY_LABEL_MAP.default;
}
function getIndexParserByUrl(url) {
    const key = getIndexCategoryKey(url);
    if (key && INDEX_PARSER_MAP[key]) {
        return INDEX_PARSER_MAP[key];
    }
    return INDEX_PARSER_MAP.default;
}
function getTotalPageNum($doc = document) {
    const extractPageNum = ($container) => {
        if (!$container)
            return 1;
        const links = $container.querySelectorAll('.p');
        if (links && links.length) {
            const parseNum = (node) => {
                if (!node || !node.getAttribute)
                    return 0;
                const href = node.getAttribute('href') || '';
                const match = href.match(/page=(\d+)/);
                if (!match)
                    return 0;
                const num = parseInt(match[1], 10);
                return Number.isNaN(num) ? 0 : num;
            };
            let tailNum = parseNum(links[links.length - 1]);
            if (!tailNum && links.length > 1) {
                tailNum = parseNum(links[links.length - 2]);
            }
            if (tailNum)
                return tailNum;
        }
        const $cur = $container.querySelector('.p_cur');
        if ($cur) {
            const num = parseInt($cur.textContent.trim(), 10);
            if (!Number.isNaN(num)) {
                return num;
            }
        }
        return 1;
    };
    const multipage = $doc.querySelector('#multipage');
    const totalFromMultipage = extractPageNum(multipage === null || multipage === void 0 ? void 0 : multipage.querySelector('.page_inner') || multipage);
    if (totalFromMultipage > 1) {
        return totalFromMultipage;
    }
    const pageInner = $doc.querySelector('.page_inner');
    const totalFromPageInner = extractPageNum(pageInner);
    return totalFromPageInner > 1 ? totalFromPageInner : 1;
}
const updateFormCache = new Map();
function extractFormEntries($form, includeUncheckedRadios = false) {
    const entries = [];
    const elements = $form.querySelectorAll('input, select, textarea');
    elements.forEach((element) => {
        const name = element.getAttribute('name');
        if (!name || element.disabled)
            return;
        const type = (element.getAttribute('type') || '').toLowerCase();
        if (['checkbox', 'radio'].includes(type) && !element.checked) {
            if (type === 'radio' && includeUncheckedRadios) {
                entries.push([name, element.value || '']);
            }
            return;
        }
        entries.push([name, element.value || '']);
    });
    return entries;
}
async function fetchUpdateFormMeta(subjectId) {
    if (updateFormCache.has(subjectId)) {
        return updateFormCache.get(subjectId);
    }
    const html = await fetchText(`/update/${subjectId}`);
    const doc = sharedDomParser.parseFromString(html, 'text/html');
    const $form = doc.querySelector('#collectBoxForm');
    if (!$form) {
        throw new Error('未获取到收藏表单');
    }
    const actionAttr = $form.getAttribute('action') || '';
    const action = new URL(actionAttr, location.origin).toString();
    const entries = extractFormEntries($form, true);
    const meta = {
        action,
        entries,
    };
    updateFormCache.set(subjectId, meta);
    return meta;
}
const IMPORT_MAX_CONCURRENT_REQUESTS = 3;
const IMPORT_MIN_REQUEST_INTERVAL = 400;
const IMPORT_MAX_REQUEST_INTERVAL = 2000;
const IMPORT_MAX_RETRY_TIMES = 3;
let lastInterestRequestTime = 0;
let currentInterestInterval = IMPORT_MIN_REQUEST_INTERVAL;
async function ensureInterestRequestInterval() {
    const now = Date.now();
    const diff = now - lastInterestRequestTime;
    if (diff < currentInterestInterval) {
        await sleep(currentInterestInterval - diff);
    }
    lastInterestRequestTime = Date.now();
}
function adjustInterestInterval(success) {
    if (success) {
        currentInterestInterval = Math.max(IMPORT_MIN_REQUEST_INTERVAL, Math.floor(currentInterestInterval * 0.8));
    }
    else {
        currentInterestInterval = Math.min(IMPORT_MAX_REQUEST_INTERVAL, Math.floor(currentInterestInterval * 1.5));
    }
}
function buildFormDataFromEntries(entries) {
    const formData = new FormData();
    entries.forEach(([key, value]) => {
        formData.append(key, value);
    });
    return formData;
}
/**
 * 更新用户收藏
 * @param subjectId 条目 id
 * @param data 更新数据
 */
async function updateInterest(subjectId, data) {
    const { action, entries } = await fetchUpdateFormMeta(subjectId);
    const formData = buildFormDataFromEntries(entries);
    const obj = Object.assign({ referer: 'ajax', tags: '', comment: '', update: '保存' }, data);
    for (let [key, val] of Object.entries(obj)) {
        if (!formData.has(key)) {
            formData.append(key, val);
        }
        else {
            // 标签和吐槽可以直接清空
            if (['tags', 'comment', 'rating'].includes(key)) {
                formData.set(key, val);
            }
            else if (!formData.get(key) && val) {
                formData.set(key, val);
            }
        }
    }
    if (data && data.interest !== undefined && data.interest !== null) {
        formData.set('interest', String(data.interest));
    }
    await ensureInterestRequestInterval();
    const response = await fetch(action, {
        method: 'POST',
        body: formData,
        credentials: 'include',
    });
    if (!response.ok) {
        adjustInterestInterval(false);
        throw new Error(`HTTP ${response.status}`);
    }
    adjustInterestInterval(true);
}
function getInterestTypeIdBySlug(slug) {
    if (!slug) {
        return '';
    }
    const config = typeIdDict[slug];
    if (config && config.id) {
        return config.id;
    }
    return '';
}
function normalizeTagsValue(value) {
    if (!value)
        return '';
    return value
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean)
        .sort()
        .join(',');
}
function normalizeCollectionFieldValue(key, value) {
    if (value === undefined || value === null) {
        return undefined;
    }
    if (key === 'tags') {
        return normalizeTagsValue(String(value));
    }
    if (key === 'comment') {
        return String(value).trim();
    }
    if (key === 'rating') {
        return String(value).trim();
    }
    if (key === 'interest') {
        return String(value).trim();
    }
    return String(value).trim();
}
function buildCollectionSnapshotMap(items) {
    const map = new Map();
    for (const item of items) {
        const subjectId = getSubjectId(item.url);
        if (!subjectId)
            continue;
        const collect = item.collectInfo || {};
        const record = {
            interest: normalizeCollectionFieldValue('interest', getInterestTypeIdBySlug(collect.interestType)),
            rating: normalizeCollectionFieldValue('rating', collect.score),
            tags: normalizeCollectionFieldValue('tags', collect.tags),
            comment: normalizeCollectionFieldValue('comment', collect.comment),
        };
        map.set(subjectId, record);
    }
    return map;
}
let collectionSnapshotPromise = null;
async function getCurrentCollectionSnapshot() {
    if (collectionSnapshotPromise) {
        return collectionSnapshotPromise;
    }
    const meta = getListPageMeta(typeof location !== 'undefined' ? location.href : '');
    if (!meta) {
        collectionSnapshotPromise = Promise.resolve(null);
        return collectionSnapshotPromise;
    }
    collectionSnapshotPromise = (async () => {
        try {
            const data = await fetchCollectionsViaApi(meta);
            if (!Array.isArray(data)) {
                return null;
            }
            return buildCollectionSnapshotMap(data);
        }
        catch (error) {
            console.warn('获取现有收藏信息失败: ', error);
            return null;
        }
    })();
    return collectionSnapshotPromise;
}
function shouldSkipCollectionUpdate(subjectId, info, snapshot) {
    if (!snapshot || !subjectId || !snapshot.has(subjectId)) {
        return false;
    }
    const current = snapshot.get(subjectId);
    if (!current) {
        return false;
    }
    for (const [key, rawValue] of Object.entries(info)) {
        const normalized = normalizeCollectionFieldValue(key, rawValue);
        if (normalized === undefined) {
            continue;
        }
        const currentValue = current[key] || '';
        if (normalized !== currentValue) {
            return false;
        }
    }
    return true;
}

/**
 * 为页面添加样式
 * @param style
 */
/**
 * dollar 选择单个
 * @param {string} selector
 */
function $q(selector) {
    if (window._parsedEl) {
        return window._parsedEl.querySelector(selector);
    }
    return document.querySelector(selector);
}
/**
 * @param {String} HTML 字符串
 * @return {Element}
 */
function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim();
    template.innerHTML = html;
    // template.content.childNodes;
    return template.content.firstChild;
}
function ensureButtonHoverStyle() {
    const styleId = 'e-userjs-btn-style';
    if (document.getElementById(styleId)) {
        return;
    }
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
.e-userjs-btn {
  display: inline-block;
  transition: transform 0.2s ease, filter 0.2s ease;
}
.e-userjs-btn:hover {
  transform: translateY(-1px);
  filter: brightness(1.05);
}
.e-userjs-btn a {
  position: relative;
  padding-bottom: 2px;
}
.e-userjs-btn a::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 2px;
  background: rgba(255, 99, 71, 0.6);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.2s ease;
}
.e-userjs-btn:hover a::after {
  transform: scaleX(1);
}
.e-userjs-btn span {
  transition: color 0.2s ease;
}
.e-userjs-btn:hover span {
  color: #ff765a !important;
}
`;
    document.head.appendChild(style);
}
function decorateButtonNode($node) {
    ensureButtonHoverStyle();
    $node.classList.add('e-userjs-btn');
    return $node;
}
function createExportButton(options) {
    const { label, progressText = '导出中...', completeText = '导出完成', onClick } = options;
    const btnStr = `<li><a href="javascript:void(0);"><span style="color:tomato;">${label}</span></a></li>`;
    const $node = decorateButtonNode(htmlToElement(btnStr));
    const $text = $node.querySelector('span');
    $node.addEventListener('click', async () => {
        if (!$text || typeof onClick !== 'function')
            return;
        const originText = $text.innerText;
        $text.innerText = progressText;
        $node.style.pointerEvents = 'none';
        try {
            await onClick();
            $text.innerText = completeText;
        }
        catch (error) {
            $text.innerText = '导出失败';
            console.error('导出错误: ', error);
            setTimeout(() => {
                $text.innerText = originText;
            }, 1500);
        }
        finally {
            $node.style.pointerEvents = 'auto';
        }
    });
    return $node;
}

// 目前写死
const CSV_HEADER = '名称,别名,发行日期,地址,封面地址,类型,收藏日期,我的评分,标签,吐槽,其它信息';
const CSV_HEADER_COLUMNS = CSV_HEADER.split(',');
const DIRECTORY_EXPORT_EXCLUDED_COLUMNS = ['收藏日期', '我的评分', '标签', '别名'];
const INDEX_CATEGORY_LABEL_MAP = {
    default: '条目',
    '1': '书籍',
    '2': '动画',
    '3': '音乐',
    '4': '游戏',
    '6': '三次元',
    character: '角色',
    person: '人物',
    persons: '人物',
    people: '人物',
    ep: '章节',
    blog: '日志',
    group_topic: '小组话题',
    subject_topic: '条目话题',
};
const INDEX_PARSER_MAP = {
    default: parseIndexDocument,
    ep: parseIndexEpisodeDocument,
    blog: parseIndexBlogDocument,
    group_topic: parseIndexGroupTopicDocument,
    subject_topic: parseIndexSubjectTopicDocument,
};
const INDEX_DYNAMIC_CATEGORY_KEYS = new Set(['ep', 'blog', 'group_topic', 'subject_topic']);
const DIRECTORY_TYPE_CONFIG_TEMPLATE = {
    书籍: { sectionId: "related_0", cat: "0", pattern: /subject\/(\d+)/i, path: "subject" },
    动画: { sectionId: "related_0", cat: "0", pattern: /subject\/(\d+)/i, path: "subject" },
    音乐: { sectionId: "related_0", cat: "0", pattern: /subject\/(\d+)/i, path: "subject" },
    游戏: { sectionId: "related_0", cat: "0", pattern: /subject\/(\d+)/i, path: "subject" },
    三次元: { sectionId: "related_0", cat: "0", pattern: /subject\/(\d+)/i, path: "subject" },
    条目: { sectionId: "related_0", cat: "0", pattern: /subject\/(\d+)/i, path: "subject" },
    角色: { sectionId: "related_1", cat: "1", pattern: /character\/(\d+)/i, path: "character" },
    人物: { sectionId: "related_2", cat: "2", pattern: /person\/(\d+)/i, path: "person" },
    章节: { sectionId: "related_3", cat: "3", pattern: /ep\/(\d+)/i, path: "ep" },
    日志: { sectionId: "related_4", cat: "4", pattern: /blog\/(\d+)/i, path: "blog" },
    小组话题: { sectionId: "related_5", cat: "5", pattern: /group\/topic\/(\d+)/i, path: "group/topic" },
    条目话题: { sectionId: "related_6", cat: "6", pattern: /subject\/topic\/(\d+)/i, path: "subject/topic" },
};
const BROWSER_SELECTION_STORAGE_KEY = "bangumi-browser-selection";
const BROWSER_PANEL_MIN_KEY = "bangumi-browser-panel-minimized";
const BROWSER_EXPORT_COLUMNS_KEY = "bangumi-browser-export-columns";
const COLLECTION_SELECTION_STORAGE_PREFIX = "bangumi-collection-selection:";
const COLLECTION_PANEL_MIN_PREFIX = "bangumi-collection-panel-minimized:";
const COLLECTION_EXPORT_COLUMNS_PREFIX = "bangumi-collection-export-columns:";
const BROWSER_EXPORT_COLUMNS_VERSION = 3;
const BROWSER_EXPORT_COLUMNS_RESET_KEYS = ["score", "scoreCount", "rank"];
const BROWSER_EXPORT_FIELDS = [
    { key: "name", label: "名称", required: true },
    { key: "url", label: "地址", required: true },
    { key: "score", label: "评分" },
    { key: "scoreCount", label: "评分人数" },
    { key: "rank", label: "综合排名" },
    { key: "watchStatus", label: "观看状态" },
    { key: "type", label: "类型" },
    { key: "releaseDate", label: "发行日期" },
    { key: "cover", label: "封面地址" },
    { key: "rawInfos", label: "其它信息" },
];
const COLLECTION_EXPORT_FIELDS = CSV_HEADER_COLUMNS.map((label) => ({
    key: label,
    label,
    required: label === "名称" || label === "地址",
}));
const BROWSER_ROUTE_LABEL_MAP = {
    book: "书籍",
    anime: "动画",
    music: "音乐",
    game: "游戏",
    real: "三次元",
};
BROWSER_ROUTE_LABEL_MAP.subject = "条目";
function isBrowserPage() {
    return /^\/(book|anime|music|game|real)\/browser/.test(location.pathname) || /^\/subject_search\//.test(location.pathname);
}
function isCollectionListPage() {
    return /^\/(anime|book|music|game|real)\/list\//.test(location.pathname);
}
function getBrowserRoute() {
    if (/^\/subject_search\//.test(location.pathname)) {
        try {
            const cat = new URL(location.href).searchParams.get("cat") || "";
            if (cat && BROWSER_ROUTE_LABEL_MAP[cat]) {
                return cat;
            }
            if (cat === "all") {
                return "subject";
            }
        }
        catch (error) {
            console.warn("解析 subject_search cat 参数失败: ", error);
        }
        return "subject";
    }
    const match = location.pathname.match(/^\/(book|anime|music|game|real)\//);
    return match ? match[1] : "";
}
function getBrowserTypeLabel(route = getBrowserRoute()) {
    return BROWSER_ROUTE_LABEL_MAP[route] || "";
}
function loadBrowserSelections() {
    try {
        const stored = localStorage.getItem(BROWSER_SELECTION_STORAGE_KEY);
        if (!stored)
            return {};
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === "object") {
            return parsed;
        }
    }
    catch (error) {
        console.warn("读取浏览页选中缓存失败: ", error);
    }
    return {};
}
function saveBrowserSelections(map) {
    try {
        localStorage.setItem(BROWSER_SELECTION_STORAGE_KEY, JSON.stringify(map));
    }
    catch (error) {
        console.warn("保存浏览页选中缓存失败: ", error);
    }
}
function getCollectionSelectionStorageKey() {
    const path = (location && location.pathname) ? location.pathname : "";
    return `${COLLECTION_SELECTION_STORAGE_PREFIX}${path}`;
}
function loadCollectionSelections() {
    return loadBrowserSelections();
}
function saveCollectionSelections(map) {
    saveBrowserSelections(map);
}
function loadCollectionPanelMinimized() {
    try {
        const path = (location && location.pathname) ? location.pathname : "";
        const key = `${COLLECTION_PANEL_MIN_PREFIX}${path}`;
        const stored = localStorage.getItem(key);
        if (stored === null) {
            return true;
        }
        return stored === "1";
    }
    catch (error) {
        return false;
    }
}
function saveCollectionPanelMinimized(flag) {
    try {
        const path = (location && location.pathname) ? location.pathname : "";
        const key = `${COLLECTION_PANEL_MIN_PREFIX}${path}`;
        localStorage.setItem(key, flag ? "1" : "0");
    }
    catch (error) {
        console.warn("保存收藏页面板最小化状态失败: ", error);
    }
}
function getCollectionExportColumnsKey() {
    const path = (location && location.pathname) ? location.pathname : "";
    return `${COLLECTION_EXPORT_COLUMNS_PREFIX}${path}`;
}
function getDefaultCollectionColumnSelection() {
    const selection = {};
    for (const field of COLLECTION_EXPORT_FIELDS) {
        selection[field.key] = true;
    }
    return selection;
}
function normalizeCollectionColumnSelection(selection) {
    const normalized = Object.assign(getDefaultCollectionColumnSelection(), selection || {});
    for (const field of COLLECTION_EXPORT_FIELDS) {
        if (field.required) {
            normalized[field.key] = true;
        }
    }
    return normalized;
}
function loadCollectionColumnSelection() {
    try {
        const stored = localStorage.getItem(getCollectionExportColumnsKey());
        if (!stored)
            return getDefaultCollectionColumnSelection();
        const parsed = JSON.parse(stored);
        return normalizeCollectionColumnSelection(parsed);
    }
    catch (error) {
        console.warn("加载收藏列选择失败: ", error);
        return getDefaultCollectionColumnSelection();
    }
}
function saveCollectionColumnSelection(selection) {
    try {
        localStorage.setItem(getCollectionExportColumnsKey(), JSON.stringify(normalizeCollectionColumnSelection(selection)));
    }
    catch (error) {
        console.warn("保存收藏列选择失败: ", error);
    }
}
function loadPanelMinimized() {
    try {
        const stored = localStorage.getItem(BROWSER_PANEL_MIN_KEY);
        if (stored === null) {
            return true;
        }
        return stored === "1";
    }
    catch (error) {
        return false;
    }
}
function savePanelMinimized(flag) {
    try {
        localStorage.setItem(BROWSER_PANEL_MIN_KEY, flag ? "1" : "0");
    }
    catch (error) {
        console.warn("保存面板最小化状态失败: ", error);
    }
}
function getDefaultBrowserColumnSelection() {
    const defaultSelection = {};
    for (const field of BROWSER_EXPORT_FIELDS) {
        const shouldSelect =
            field.required ||
            !BROWSER_EXPORT_COLUMNS_RESET_KEYS.includes(field.key);
        defaultSelection[field.key] = shouldSelect;
    }
    return defaultSelection;
}
function normalizeBrowserColumnSelection(selection) {
    const normalized = Object.assign(getDefaultBrowserColumnSelection(), selection || {});
    for (const field of BROWSER_EXPORT_FIELDS) {
        if (field.required) {
            normalized[field.key] = true;
        }
    }
    const selectionVersion = (selection && selection.__version) || 1;
    if (selectionVersion < BROWSER_EXPORT_COLUMNS_VERSION) {
        for (const key of BROWSER_EXPORT_COLUMNS_RESET_KEYS) {
            normalized[key] = false;
        }
    }
    normalized.__version = BROWSER_EXPORT_COLUMNS_VERSION;
    return normalized;
}
function loadBrowserColumnSelection() {
    try {
        const stored = localStorage.getItem(BROWSER_EXPORT_COLUMNS_KEY);
        if (!stored)
            return getDefaultBrowserColumnSelection();
        const parsed = JSON.parse(stored);
        return normalizeBrowserColumnSelection(parsed);
    }
    catch (error) {
        console.warn("加载浏览器列选择失败: ", error);
        return getDefaultBrowserColumnSelection();
    }
}
function saveBrowserColumnSelection(selection) {
    try {
        localStorage.setItem(BROWSER_EXPORT_COLUMNS_KEY, JSON.stringify(normalizeBrowserColumnSelection(selection)));
    }
    catch (error) {
        console.warn("保存浏览器列选择失败: ", error);
    }
}
function ensureBrowserPanelStyle() {
    if (document.getElementById("bangumi-browser-panel-style")) {
        return;
    }
    const style = document.createElement("style");
    style.id = "bangumi-browser-panel-style";
    style.textContent = `
.bangumi-browser-fade-in {
  animation: bangumi-browser-pop 220ms ease-out forwards;
  opacity: 0;
  transform: translateY(6px) scale(0.98);
}
.bangumi-browser-item {
  position: relative;
}
.bangumi-select-checkbox {
  position: absolute;
  top: 30px;
  right: 10px;
  width: 18px;
  height: 18px;
  cursor: pointer;
}
.bangumi-column-filter {
  position: relative;
  margin-left: auto;
}
.bangumi-column-filter button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  background: #f3f6fa;
  border: 1px solid #dfe6ef;
  border-radius: 6px;
  color: #4a5568;
  cursor: pointer;
  transition: all 0.15s ease;
}
.bangumi-column-filter button:hover {
  background: #e9eef5;
  border-color: #cfd9e8;
}
.bangumi-column-filter .menu {
  position: absolute;
  right: 0;
  top: 36px;
  min-width: 170px;
  background: #ffffff;
  border: 1px solid #dfe6ef;
  border-radius: 8px;
  box-shadow: 0 10px 28px rgba(26, 46, 86, 0.12);
  padding: 8px 10px;
  z-index: 1000;
}
.bangumi-column-filter .menu label {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 2px;
  font-size: 12px;
  color: #2d3748;
  cursor: pointer;
}
.bangumi-column-filter .menu input[type="checkbox"][disabled] {
  cursor: not-allowed;
}
.bangumi-browser-panel {
  position: fixed;
  top: 80px;
  right: 20px;
  width: 300px;
  min-width: 300px;
  max-height: 420px;
  background: #ffffff;
  border: 1px solid #dfe6ef;
  box-shadow: 0 10px 28px rgba(26, 46, 86, 0.12);
  border-radius: 12px;
  padding: 12px;
  z-index: 999;
  display: flex;
  flex-direction: column;
  gap: 8px;
  backdrop-filter: blur(4px);
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}
.bangumi-browser-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
}
.bangumi-browser-panel h4 {
  margin: 0;
  font-size: 14px;
  color: #0f172a;
  letter-spacing: 0.3px;
}
.bangumi-minimize-btn {
  border: none;
  background: transparent;
  color: #94a3b8;
  cursor: pointer;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: grid;
  place-items: center;
  transition: background 0.16s ease, color 0.16s ease;
}
.bangumi-minimize-btn:hover {
  background: #f1f5f9;
  color: #4f46e5;
}
.bangumi-browser-badge {
  min-width: 72px;
  text-align: center;
  padding: 6px 10px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 12px;
  color: #4a5cff;
  background: #eef1ff;
  transition: transform 0.25s ease;
}
.bangumi-browser-badge.pulse {
  animation: badge-pulse 0.35s ease;
}
.bangumi-selected-list {
  flex: 1;
  min-height: 250px;
  max-height: 300px;
  overflow-y: auto;
  padding: 8px 10px;
  background: #f8fafc;
  border-radius: 12px;
  color: #2f384e;
  font-size: 12px;
  line-height: 1.6;
}
.bangumi-selected-empty {
  padding: 18px 8px;
  text-align: center;
  color: #94a3b8;
  font-size: 12px;
}
.bangumi-selected-row {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 8px;
}
.bangumi-selected-row::before,
.bangumi-selected-row::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  border-top: 1px solid #e5e7eb;
}
.bangumi-selected-row::before { top: 0; }
.bangumi-selected-row::after { bottom: 0; }
.bangumi-selected-name {
  flex: 1;
  font-size: 13px;
  color: #0f172a;
  line-height: 1.4;
}
.bangumi-selected-remove {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 1px solid #e2e8f0;
  background: #fff;
  color: #94a3b8;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: all 0.18s ease;
}
.bangumi-selected-remove:hover {
  color: #e11d48;
  border-color: #fecdd3;
  box-shadow: 0 6px 14px rgba(225, 29, 72, 0.16);
  transform: translateY(-1px);
}
.bangumi-selected-item {
  margin-bottom: 4px;
  word-break: break-all;
}
.bangumi-browser-panel .bangumi-panel-actions {
  display: flex;
  gap: 6px;
  justify-content: center;
  flex-wrap: nowrap;
  width: 100%;
}
.bangumi-browser-panel .bangumi-pill-btn {
  border: 1.5px solid transparent;
  border-radius: 8px;
  padding: 9px 12px;
  font-size: 12px;
  cursor: pointer;
  background: #ffffff;
  color: #0f172a;
  box-shadow: 0 10px 18px rgba(148, 163, 184, 0.16);
  transition: transform 0.12s ease, box-shadow 0.12s ease, filter 0.12s ease, border 0.12s ease;
  min-width: 0;
  flex: 1 1 0;
  position: relative;
  overflow: hidden;
}
.bangumi-browser-panel .bangumi-pill-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 22px rgba(148, 163, 184, 0.2);
  filter: brightness(1.01);
}
.bangumi-browser-panel .bangumi-pill-btn:active {
  transform: translateY(0);
  box-shadow: 0 6px 14px rgba(148, 163, 184, 0.18);
}
.bangumi-browser-panel .bangumi-pill-btn.ghost {
  flex: 0 0 40px;
  border-color: transparent;
  background: transparent;
  color: #8b96ab;
  box-shadow: none;
  position: relative;
}
.bangumi-browser-panel .bangumi-pill-btn.ghost:hover {
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.08);
  background: #FEF2F2;
  color: #e11d48;
  filter: none;
}
.bangumi-browser-panel .bangumi-pill-btn.secondary {
  flex: 1 1 0;
  border-color: #e5e7eb;
  background: #ffffff;
  color: #0f172a;
  box-shadow: 0 12px 22px rgba(148, 163, 184, 0.14);
}
.bangumi-browser-panel .bangumi-pill-btn.secondary:hover {
  box-shadow: 0 16px 26px rgba(148, 163, 184, 0.22);
}
.bangumi-browser-panel .bangumi-pill-btn.primary {
  flex: 1 1 0;
  background: linear-gradient(135deg, #4f46e5 0%, #4a4de8 100%);
  color: #fff;
  box-shadow: 0 18px 44px rgba(79, 70, 229, 0.32);
}
.bangumi-browser-panel .bangumi-pill-btn.primary:hover {
  box-shadow: 0 18px 42px rgba(77, 92, 255, 0.38);
  filter: brightness(1.02);
}
.bangumi-browser-panel .bangumi-pill-btn.primary .spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255,255,255,0.45);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-right: 8px;
  display: inline-block;
  vertical-align: middle;
}
.bangumi-browser-panel .bangumi-pill-btn.primary .label {
  vertical-align: middle;
}
.bangumi-browser-mini-btn {
  position: fixed;
  right: 16px;
  bottom: 32px;
  display: none;
  align-items: center;
  gap: 6px;
  padding: 10px 12px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.18);
  color: #0f172a;
  font-size: 12px;
  cursor: pointer;
  z-index: 999;
}
.bangumi-browser-mini-btn:hover {
  box-shadow: 0 18px 36px rgba(15, 23, 42, 0.22);
}
.bangumi-browser-mini-btn .mini-icon {
  font-size: 14px;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
@keyframes badge-pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.14); }
  100% { transform: scale(1); }
}
@keyframes bangumi-browser-pop {
  0% { opacity: 0; transform: translateY(6px) scale(0.98); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}
`;
    document.head.appendChild(style);
}
function normalizeBrowserItemUrl(url = "") {
    try {
        const parsed = new URL(url, location.origin);
        return parsed.pathname.replace(/\/+$/, "");
    }
    catch (error) {
        return url;
    }
}
function parseBrowserItemData($item) {
    const $link = $item.querySelector("h3>a.l");
    if (!$link) {
        return null;
    }
    const name = $link.textContent.trim();
    const rawUrl = $link.getAttribute("href") || "";
    const url = normalizeBrowserItemUrl(rawUrl);
    const id = getSubjectId(url) || url || name;
    const $rate = $item.querySelector(".rateInfo .fade");
    const score = $rate ? $rate.textContent.trim() : "";
    const $rank = $item.querySelector(".rank");
    const rank = $rank ? $rank.textContent.replace("Rank", "").trim() : "";
    const infoNode = $item.querySelector(".info") || $item.querySelector(".info.tip") || $item.querySelector(".tip");
    const infoText = normalizeIndexText(infoNode ? infoNode.textContent : "");
    const releaseDate = extractDateFromText(infoText);
    const $cover = $item.querySelector(".subjectCover img, .cover img, img");
    const cover = getImageSrcFromNode($cover);
    const collectBlock = $item.querySelector(".collectBlock");
    const statusText = collectBlock ? collectBlock.textContent : "";
    let itemRoute = getItemRouteFromNode($item) || getBrowserRoute();
    const interestLabel = detectInterestLabelFromText(statusText, itemRoute);
    const labelRoute = getRouteByInterestLabel(interestLabel);
    if (!getItemRouteFromNode($item) && labelRoute) {
        itemRoute = labelRoute;
    }
    const interestKey = interestLabel ? matchInterestKeyByName(interestLabel, itemRoute) : '';
    const collectInfo = interestKey ? { interestType: interestKey } : null;
    return {
        id,
        name,
        url,
        score,
        watchStatus: interestLabel || "",
        type: getBrowserTypeLabel(itemRoute),
        rank,
        scoreCount: "",
        releaseDate,
        cover,
        rawInfos: infoText,
        collectionRoute: itemRoute,
        collectInfo: collectInfo || undefined,
    };
}
async function fetchSubjectScoreViaApi(subjectId) {
    if (!subjectId) {
        return null;
    }
    const apiUrl = `${BGM_API_BASE}/subjects/${subjectId}`;
    let payloadText;
    try {
        payloadText = await fetchText(apiUrl, {
            headers: {
                "User-Agent": API_USER_AGENT,
            },
        });
    }
    catch (error) {
        console.warn("请求 API 失败: ", error);
        return null;
    }
    try {
        const data = JSON.parse(payloadText);
        if (data && data.rating) {
            return {
                score: data.rating.score,
                scoreCount: typeof data.rating.total === "number"
                    ? data.rating.total
                    : (data.rating.count ? Object.values(data.rating.count).reduce((sum, n) => sum + (Number(n) || 0), 0) : 0),
                rank: data.rank || "",
                subjectTypeId: data.type || "",
            };
        }
    }
    catch (error) {
        console.warn("请求 API 失败: ", error);
    }
    return null;
}
async function enrichSelectionsWithApiScores(items, concurrency = 3) {
    const tasks = items.slice();
    await runTasksWithConcurrency(tasks, async (item) => {
        const subjectId = /^\d+$/.test(item.id) ? item.id : getSubjectId(item.url);
        if (!subjectId) {
            return;
        }
        const rating = await fetchSubjectScoreViaApi(subjectId);
        if (!rating) {
            return;
        }
        if (rating.score !== null && rating.score !== undefined && rating.score !== "") {
            item.score = item.score || rating.score;
        }
        if (rating.scoreCount !== null && rating.scoreCount !== undefined) {
            item.scoreCount = rating.scoreCount;
        }
        if (rating.rank !== null && rating.rank !== undefined && rating.rank !== "") {
            item.rank = item.rank || rating.rank;
        }
        if (!item.collectionRoute && rating.subjectTypeId && SUBJECT_TYPE_ROUTE_MAP[rating.subjectTypeId]) {
            item.collectionRoute = SUBJECT_TYPE_ROUTE_MAP[rating.subjectTypeId];
        }
        if (!item.subjectTypeId && rating.subjectTypeId) {
            item.subjectTypeId = rating.subjectTypeId;
        }
    }, concurrency);
    return items;
}
function createMiniButton(onRestore) {
    const btn = document.createElement("button");
    btn.className = "bangumi-browser-mini-btn";
    const icon = document.createElement("span");
    icon.className = "mini-icon";
    icon.textContent = "⤢";
    const label = document.createElement("span");
    label.textContent = "展开条目面板";
    btn.appendChild(icon);
    btn.appendChild(label);
    btn.addEventListener("click", (e) => {
        e.preventDefault();
        onRestore && onRestore();
    });
    document.body.appendChild(btn);
    return btn;
}
function createColumnFilterControl(options) {
    const normalizeSelection = options.normalizeSelection || ((value) => value || {});
    const selection = normalizeSelection(options.selection);
    const fields = options.fields || BROWSER_EXPORT_FIELDS;
    const wrapper = document.createElement("div");
    wrapper.className = "bangumi-column-filter";
    const btn = document.createElement("button");
    const label = document.createElement("span");
    label.textContent = "导出列选择";
    const caret = document.createElement("span");
    caret.textContent = "▾";
    btn.appendChild(label);
    btn.appendChild(caret);
    const menu = document.createElement("div");
    menu.className = "menu";
    menu.style.display = "none";
    function renderMenu() {
        menu.innerHTML = "";
        for (const field of fields) {
            const item = document.createElement("label");
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = !!selection[field.key];
            checkbox.disabled = !!field.required;
            checkbox.addEventListener("change", () => {
                selection[field.key] = true;
                if (!field.required) {
                    selection[field.key] = checkbox.checked;
                }
                options.onChange && options.onChange(normalizeSelection(selection));
                renderMenu();
            });
            const text = document.createElement("span");
            text.textContent = field.label;
            item.appendChild(checkbox);
            item.appendChild(text);
            menu.appendChild(item);
        }
    }
    renderMenu();
    function toggleMenu(show) {
        menu.style.display = show ? "block" : "none";
    }
    btn.addEventListener("click", (e) => {
        e.preventDefault();
        const isOpen = menu.style.display === "block";
        toggleMenu(!isOpen);
    });
    document.addEventListener("click", (e) => {
        if (!wrapper.contains(e.target)) {
            toggleMenu(false);
        }
    });
    wrapper.appendChild(btn);
    wrapper.appendChild(menu);
    return wrapper;
}
function buildBrowserPanelActions(state) {
    const actions = document.createElement("div");
    actions.className = "bangumi-panel-actions";
    const selectAllBtn = document.createElement("button");
    selectAllBtn.className = "bangumi-pill-btn secondary";
    selectAllBtn.textContent = "全选条目";
    selectAllBtn.addEventListener("click", state.selectAllVisible);
    const clearBtn = document.createElement("button");
    clearBtn.className = "bangumi-pill-btn ghost";
    clearBtn.textContent = "🗑️";
    clearBtn.title = "清除选中";
    clearBtn.addEventListener("click", state.clearSelections);
    const exportBtn = document.createElement("button");
    exportBtn.className = "bangumi-pill-btn primary";
    const exportSpinner = document.createElement("span");
    exportSpinner.className = "spinner";
    exportSpinner.style.display = "none";
    const exportLabel = document.createElement("span");
    exportLabel.className = "label";
    exportLabel.textContent = "导出条目";
    exportBtn.appendChild(exportSpinner);
    exportBtn.appendChild(exportLabel);
    exportBtn.addEventListener("click", async () => {
        if (exportBtn.disabled) return;
        exportBtn.disabled = true;
        exportSpinner.style.display = "inline-block";
        exportLabel.textContent = "处理中...";
        try {
            await state.exportSelections();
            exportLabel.textContent = "导出成功!";
            setTimeout(() => {
                exportLabel.textContent = "导出条目";
            }, 1200);
        }
        catch (error) {
            exportLabel.textContent = "导出失败";
            setTimeout(() => {
                exportLabel.textContent = "导出条目";
            }, 1200);
        }
        finally {
            exportBtn.disabled = false;
            exportSpinner.style.display = "none";
        }
    });
    actions.appendChild(clearBtn);
    actions.appendChild(selectAllBtn);
    actions.appendChild(exportBtn);
    return actions;
}
function createBrowserPanel(state) {
    ensureBrowserPanelStyle();
    let panel = document.querySelector(".bangumi-browser-panel");
    if (panel) {
        const badge = panel.querySelector(".bangumi-browser-badge");
        const list = panel.querySelector(".bangumi-selected-list");
        const header = panel.querySelector(".bangumi-browser-panel-header");
        const actions = panel.querySelector(".bangumi-panel-actions");
        const enableColumnFilter = state.enableColumnFilter !== false;
        const columnFilterFactory = state.createColumnFilter || createColumnFilterControl;
        let columnFilter = panel.querySelector(".bangumi-column-filter");
        if (header) {
            if (columnFilter) {
                columnFilter.remove();
                columnFilter = null;
            }
            if (enableColumnFilter) {
                columnFilter = columnFilterFactory({
                    selection: state.columnSelection,
                    onChange: state.onColumnSelectionChange,
                    fields: state.columnFields,
                    normalizeSelection: state.normalizeColumnSelection,
                });
                header.appendChild(columnFilter);
            }
        }
        const nextActions = buildBrowserPanelActions(state);
        if (actions) {
            actions.replaceWith(nextActions);
        }
        else {
            panel.appendChild(nextActions);
        }
        return { panel, badge, list, columnFilter };
    }
    panel = document.createElement("div");
    panel.className = "bangumi-browser-panel bangumi-browser-fade-in";
    const header = document.createElement("div");
    header.className = "bangumi-browser-panel-header";
    const title = document.createElement("h4");
    title.textContent = "条目选择";
    const badge = document.createElement("span");
    badge.className = "bangumi-browser-badge";
    badge.textContent = "0 已选";
    const minimizeBtn = document.createElement("button");
    minimizeBtn.className = "bangumi-minimize-btn";
    minimizeBtn.title = "最小化";
    minimizeBtn.textContent = "⤡";
    header.appendChild(title);
    header.appendChild(badge);
    header.appendChild(minimizeBtn);
    const enableColumnFilter = state.enableColumnFilter !== false;
    const columnFilterFactory = state.createColumnFilter || createColumnFilterControl;
    let columnFilter = null;
    if (enableColumnFilter) {
        columnFilter = columnFilterFactory({
            selection: state.columnSelection,
            onChange: state.onColumnSelectionChange,
            fields: state.columnFields,
            normalizeSelection: state.normalizeColumnSelection,
        });
        header.appendChild(columnFilter);
    }
    const list = document.createElement("div");
    list.className = "bangumi-selected-list";
    const actions = buildBrowserPanelActions(state);
    panel.appendChild(header);
    panel.appendChild(list);
    panel.appendChild(actions);
    document.body.appendChild(panel);
    return { panel, badge, list, minimizeBtn, columnFilter };
}
function renderBrowserPanelList(panel, selections, badge, saveSelections = saveBrowserSelections) {
    const list = panel.querySelector(".bangumi-selected-list");
    list.innerHTML = "";
    const entries = Object.values(selections);
    if (badge) {
        badge.textContent = `${entries.length} 已选`;
        badge.classList.remove("pulse");
        void badge.offsetWidth;
        badge.classList.add("pulse");
    }
    if (!entries.length) {
        const empty = document.createElement("div");
        empty.className = "bangumi-selected-empty";
        empty.textContent = "暂无选中条目，试试全选吧";
        list.appendChild(empty);
        return;
    }
    entries.forEach((item, idx) => {
        const row = document.createElement("div");
        row.className = "bangumi-selected-row";
        row.style.animationDelay = `${idx * 50}ms`;
        const name = document.createElement("div");
        name.className = "bangumi-selected-name";
        name.textContent = item.name;
        const remove = document.createElement("button");
        remove.className = "bangumi-selected-remove";
        remove.type = "button";
        remove.title = "移除";
        remove.textContent = "×";
        remove.addEventListener("click", () => {
            delete selections[item.id];
            saveSelections(selections);
            renderBrowserPanelList(panel, selections, badge, saveSelections);
            const checkbox = document.querySelector(`.bangumi-select-checkbox[value="${item.id}"]`);
            if (checkbox) {
                checkbox.checked = false;
            }
        });
        row.appendChild(name);
        row.appendChild(remove);
        list.appendChild(row);
    });
}
function toggleBrowserItemCheckbox($item, selections, onChange) {
    if (!$item || $item.querySelector(".bangumi-select-checkbox")) {
        return;
    }
    $item.classList.add("bangumi-browser-item");
    const data = parseBrowserItemData($item);
    if (!data) {
        return;
    }
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "bangumi-select-checkbox";
    checkbox.setAttribute("value", data.id);
    checkbox.title = "选中以加入导出";
    checkbox.checked = !!selections[data.id];
    checkbox.addEventListener("change", () => {
        onChange(data, checkbox.checked);
    });
    const target = $item.querySelector(".collectBlock") || $item;
    target.appendChild(checkbox);
}
function parseCollectionListItemData($item) {
    if (!$item) {
        return null;
    }
    const $title = $item.querySelector("h3>a.l");
    if (!$title) {
        return null;
    }
    const data = convertItemInfo($item);
    if (!data) {
        return null;
    }
    const route = getCollectionRouteByUrl(location.href);
    const interestKey = getInterestTypeByUrl(location.href);
    if (interestKey) {
        if (!data.collectInfo) {
            data.collectInfo = {};
        }
        if (!data.collectInfo.interestType) {
            data.collectInfo.interestType = interestKey;
        }
        if (!data.watchStatus) {
            data.watchStatus = getInterestTypeName(interestKey, route);
        }
        if (!data.collectionRoute) {
            data.collectionRoute = route;
        }
    }
    const id = getSubjectId(data.url) || data.url || data.name;
    return Object.assign({ id }, data);
}
function toggleCollectionItemCheckbox($item, selections, onChange) {
    if (!$item || $item.querySelector(".bangumi-select-checkbox")) {
        return;
    }
    $item.classList.add("bangumi-browser-item");
    const data = parseCollectionListItemData($item);
    if (!data) {
        return;
    }
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "bangumi-select-checkbox";
    checkbox.setAttribute("value", data.id);
    checkbox.title = "选中以加入导出";
    checkbox.checked = !!selections[data.id];
    checkbox.addEventListener("change", () => {
        onChange(data, checkbox.checked);
    });
    const target = $item.querySelector(".collectBlock") || $item;
    target.appendChild(checkbox);
}
function scanCollectionList(selections, onChange) {
    const $items = getCollectionListItems();
    for (const $item of Array.from($items)) {
        toggleCollectionItemCheckbox($item, selections, onChange);
    }
}
function scanBrowserList(selections, onChange) {
    const $items = document.querySelectorAll("#browserItemList>li, ul.browserFull.browser-list>li");
    for (const $item of Array.from($items)) {
        toggleBrowserItemCheckbox($item, selections, onChange);
    }
}
async function exportBrowserSelections(selections, columnSelection = getDefaultBrowserColumnSelection()) {
    const items = Object.values(selections || {});
    if (!items.length) {
        alert("没有选中的条目");
        return;
    }
    await enrichSelectionsWithApiScores(items);
    const normalizedSelection = normalizeBrowserColumnSelection(columnSelection);
    const header = [];
    const rows = items.map((item) => {
        const row = {};
        for (const field of BROWSER_EXPORT_FIELDS) {
            const enabled = field.required || normalizedSelection[field.key];
            if (!enabled) {
                continue;
            }
            header.push(field.label);
            if (field.key === "name") {
                row[field.label] = item.name;
            }
            else if (field.key === "url") {
                row[field.label] = item.url;
            }
            else if (field.key === "score") {
                row[field.label] = item.score || "";
            }
            else if (field.key === "scoreCount") {
                row[field.label] = item.scoreCount || "";
            }
            else if (field.key === "rank") {
                row[field.label] = item.rank || "";
            }
            else if (field.key === "watchStatus") {
                const route = getItemRouteFromData(item) || getBrowserRoute();
                const watchStatus = getItemInterestLabel(item, route);
                row[field.label] = watchStatus || "Null";
            }
            else if (field.key === "type") {
                row[field.label] = item.type || "";
            }
            else if (field.key === "releaseDate") {
                row[field.label] = item.releaseDate || "";
            }
            else if (field.key === "cover") {
                row[field.label] = item.cover || "";
            }
            else if (field.key === "rawInfos") {
                row[field.label] = item.rawInfos || "";
            }
        }
        return row;
    });
    const uniqueHeader = Array.from(new Set(header));
    const worksheet = XLSX.utils.json_to_sheet(rows, {
        header: uniqueHeader,
    });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "选中条目");
    const filename = `选中条目-${formatDate(new Date())}.xlsx`;
    XLSX.writeFile(workbook, filename);
}
function initBrowserSelectionFeature() {
    if (!isBrowserPage()) {
        return;
    }
    ensureBrowserPanelStyle();
    let selections = loadBrowserSelections();
    let columnSelection = loadBrowserColumnSelection();
    let badge = null;
    let panelEl = null;
    let miniBtn = null;
    let columnFilter = null;
    function setPanelMinimized(flag) {
        if (!panelEl || !miniBtn)
            return;
        panelEl.style.display = flag ? "none" : "flex";
        miniBtn.style.display = flag ? "flex" : "none";
        savePanelMinimized(flag);
    }
    function handleColumnSelectionChange(nextSelection) {
        columnSelection = normalizeBrowserColumnSelection(nextSelection);
        saveBrowserColumnSelection(columnSelection);
    }
    function handleChange(data, checked) {
        if (checked) {
            selections[data.id] = data;
        }
        else {
            delete selections[data.id];
        }
        saveBrowserSelections(selections);
        renderBrowserPanelList(panelEl, selections, badge);
    }
    function handleClear() {
        selections = {};
        saveBrowserSelections(selections);
        renderBrowserPanelList(panelEl, selections, badge);
        const checkboxes = document.querySelectorAll(".bangumi-select-checkbox");
        checkboxes.forEach((box) => {
            box.checked = false;
        });
    }
    function handleSelectAll() {
        const $items = document.querySelectorAll("#browserItemList>li, ul.browserFull.browser-list>li");
        for (const $item of Array.from($items)) {
            const data = parseBrowserItemData($item);
            if (!data) {
                continue;
            }
            selections[data.id] = data;
            const checkbox = $item.querySelector(".bangumi-select-checkbox");
            if (checkbox) {
                checkbox.checked = true;
            }
        }
        saveBrowserSelections(selections);
        renderBrowserPanelList(panelEl, selections, badge);
    }
    const panelRes = createBrowserPanel({
        exportSelections: () => exportBrowserSelections(selections, columnSelection),
        clearSelections: handleClear,
        selectAllVisible: handleSelectAll,
        columnSelection,
        onColumnSelectionChange: handleColumnSelectionChange,
        columnFields: BROWSER_EXPORT_FIELDS,
        normalizeColumnSelection: normalizeBrowserColumnSelection,
        enableColumnFilter: true,
    });
    panelEl = panelRes.panel;
    badge = panelRes.badge;
    columnFilter = panelRes.columnFilter;
    miniBtn = createMiniButton(() => setPanelMinimized(false));
    if (panelRes.minimizeBtn) {
        panelRes.minimizeBtn.addEventListener("click", () => setPanelMinimized(true));
    }
    setPanelMinimized(loadPanelMinimized());
    renderBrowserPanelList(panelEl, selections, badge);
    scanBrowserList(selections, handleChange);
    const listContainer = document.querySelector("#browserItemList") || document.querySelector(".browserFull.browser-list");
    if (listContainer) {
        const observer = new MutationObserver(() => {
            scanBrowserList(selections, handleChange);
        });
        observer.observe(listContainer, { childList: true, subtree: false });
    }
}
async function exportCollectionSelections(selections, columnSelection) {
    const items = Object.values(selections || {});
    if (!items.length) {
        alert("没有选中的条目");
        return;
    }
    const interestType = getInterestTypeByUrl(location.href);
    items.forEach((item) => {
        if (!item.collectInfo) {
            item.collectInfo = {};
        }
        if (!item.collectInfo.interestType) {
            item.collectInfo.interestType = interestType;
        }
    });
    const normalizedSelection = normalizeCollectionColumnSelection(columnSelection);
    const excludedColumns = CSV_HEADER_COLUMNS.filter((label) => !normalizedSelection[label]);
    const filename = `选中收藏-${formatDate(new Date())}.xlsx`;
    downloadExcel(filename, items, { excludedColumns });
}
function initCollectionSelectionFeature() {
    if (!isCollectionListPage()) {
        return;
    }
    ensureBrowserPanelStyle();
    let selections = loadCollectionSelections();
    let columnSelection = loadCollectionColumnSelection();
    let badge = null;
    let panelEl = null;
    let miniBtn = null;
    function setPanelMinimized(flag) {
        if (!panelEl || !miniBtn)
            return;
        panelEl.style.display = flag ? "none" : "flex";
        miniBtn.style.display = flag ? "flex" : "none";
        saveCollectionPanelMinimized(flag);
    }
    function handleChange(data, checked) {
        if (checked) {
            selections[data.id] = data;
        }
        else {
            delete selections[data.id];
        }
        saveCollectionSelections(selections);
        renderBrowserPanelList(panelEl, selections, badge, saveCollectionSelections);
    }
    function handleColumnSelectionChange(nextSelection) {
        columnSelection = normalizeCollectionColumnSelection(nextSelection);
        saveCollectionColumnSelection(columnSelection);
    }
    function handleClear() {
        selections = {};
        saveCollectionSelections(selections);
        renderBrowserPanelList(panelEl, selections, badge, saveCollectionSelections);
        const checkboxes = document.querySelectorAll(".bangumi-select-checkbox");
        checkboxes.forEach((box) => {
            box.checked = false;
        });
    }
    function handleSelectAll() {
        const $items = getCollectionListItems();
        for (const $item of Array.from($items)) {
            const data = parseCollectionListItemData($item);
            if (!data) {
                continue;
            }
            selections[data.id] = data;
            const checkbox = $item.querySelector(".bangumi-select-checkbox");
            if (checkbox) {
                checkbox.checked = true;
            }
        }
        saveCollectionSelections(selections);
        renderBrowserPanelList(panelEl, selections, badge, saveCollectionSelections);
    }
    const panelRes = createBrowserPanel({
        exportSelections: () => exportCollectionSelections(selections, columnSelection),
        clearSelections: handleClear,
        selectAllVisible: handleSelectAll,
        enableColumnFilter: true,
        columnSelection,
        onColumnSelectionChange: handleColumnSelectionChange,
        columnFields: COLLECTION_EXPORT_FIELDS,
        normalizeColumnSelection: normalizeCollectionColumnSelection,
    });
    panelEl = panelRes.panel;
    badge = panelRes.badge;
    miniBtn = createMiniButton(() => setPanelMinimized(false));
    if (panelRes.minimizeBtn) {
        panelRes.minimizeBtn.addEventListener("click", () => setPanelMinimized(true));
    }
    setPanelMinimized(loadCollectionPanelMinimized());
    renderBrowserPanelList(panelEl, selections, badge, saveCollectionSelections);
    scanCollectionList(selections, handleChange);
    const listContainer = document.querySelector("#browserItemList") || document.querySelector(".browserFull.browser-list");
    if (listContainer) {
        const observer = new MutationObserver(() => {
            scanCollectionList(selections, handleChange);
        });
        observer.observe(listContainer, { childList: true, subtree: false });
    }
}
function getDirectoryTypeConfig(label = '') {
    const key = (label || '').trim();
    if (!key || !DIRECTORY_TYPE_CONFIG_TEMPLATE[key])
        return null;
    return Object.assign({}, DIRECTORY_TYPE_CONFIG_TEMPLATE[key]);
}
function normalizeDirectoryAddress(address = '') {
    if (!address)
        return '';
    const value = String(address).trim();
    if (!value)
        return '';
    try {
        const origin = typeof location !== 'undefined' ? location.origin : 'https://bgm.tv';
        const parsed = new URL(value, origin);
        return parsed.pathname.replace(/\/+$/, '');
    }
    catch (error) {
        return value;
    }
}
function extractDirectoryId(address = '', config = {}) {
    if (!address)
        return '';
    const original = String(address).trim();
    const normalized = normalizeDirectoryAddress(address);
    if (!normalized)
        return '';
    if (config.pattern) {
        const match = normalized.match(config.pattern);
        if (match && match[1]) {
            return match[1];
        }
    }
    if (/^\d+$/.test(normalized)) {
        return normalized;
    }
    return original;
}
function buildDirectoryTargetHref(address = '', config = {}) {
    const normalized = normalizeDirectoryAddress(address);
    if (!normalized)
        return '';
    if (normalized.startsWith('http')) {
        try {
            const origin = typeof location !== 'undefined' ? location.origin : 'https://bgm.tv';
            const parsed = new URL(normalized, origin);
            return parsed.pathname.replace(/\/+$/, '');
        }
        catch (error) {
            return normalized;
        }
    }
    if (normalized.startsWith('/')) {
        return normalized.replace(/\/+$/, '');
    }
    if (/^(subject|character|person|ep|blog|group\/topic|subject\/topic)\//.test(normalized)) {
        return `/${normalized.replace(/\/+$/, '')}`;
    }
    if (/^\d+$/.test(normalized)) {
        const path = config.path || 'subject';
        return `/${path}/${normalized}`;
    }
    return `/${normalized.replace(/\/+$/, '')}`;
}
function getDirectoryFormhash() {
    const selectors = [
        '#ModifyRelatedForm input[name="formhash"]',
        '#newIndexRelatedForm input[name="formhash"]',
        'input[name="formhash"]',
    ];
    for (const selector of selectors) {
        const $input = document.querySelector(selector);
        if ($input && $input.value) {
            return $input.value;
        }
    }
    return '';
}
function getModifySubmitMeta() {
    const $form = document.querySelector('#ModifyRelatedForm');
    const defaultMeta = {
        name: 'submit',
        value: '提交',
    };
    if (!$form)
        return defaultMeta;
    const $submit = $form.querySelector('input[type="submit"][name]') || $form.querySelector('input[type="submit"]');
    if (!$submit) {
        return defaultMeta;
    }
    const name = $submit.getAttribute('name') || defaultMeta.name;
    const value = $submit.getAttribute('value') || $submit.value || defaultMeta.value;
    return {
        name,
        value,
    };
}
function findRelationIdFromHtml(html = '', targetHref = '') {
    if (!html || !targetHref)
        return '';
    try {
        const $doc = sharedDomParser.parseFromString(html, 'text/html');
        const $link = $doc.querySelector(`[href="${targetHref}"]`);
        if (!$link)
            return '';
        const $item = $link.closest('[id^="item_"], [attr-index-related], .indexItem');
        if (!$item)
            return '';
        const $rltLink = $item.querySelector('a.tb_idx_rlt');
        if (!$rltLink || !$rltLink.id)
            return '';
        const parts = $rltLink.id.split('_');
        return parts[1] || '';
    }
    catch (error) {
        console.warn('解析目录新增 HTML 失败: ', error);
    }
    return '';
}
async function updateDirectoryRelationComment(relationId, comment, order = '') {
    if (!relationId || !comment)
        return;
    const formhash = getDirectoryFormhash();
    if (!formhash) {
        throw new Error('缺少 formhash，无法更新评价');
    }
    const { name: submitName, value: submitValue } = getModifySubmitMeta();
    const params = new URLSearchParams();
    params.set('formhash', formhash);
    params.set('content', comment);
    params.set('order', order || '');
    params.set(submitName || 'submit', submitValue);
    const response = await fetch(`/index/related/${relationId}/modify`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'X-Requested-With': 'XMLHttpRequest',
        },
        body: params.toString(),
    });
    if (!response.ok) {
        throw new Error(`更新评价失败 HTTP ${response.status}`);
    }
}
function buildIndexCategoryUrl(url, categoryKey) {
    try {
        const origin = typeof location !== 'undefined' ? location.origin : 'https://bgm.tv';
        const parsedUrl = new URL(url, origin);
        parsedUrl.searchParams.set('cat', categoryKey);
        parsedUrl.searchParams.delete('page');
        parsedUrl.hash = '';
        return parsedUrl.toString();
    }
    catch (error) {
        console.warn('目录分类跳转生成失败: ', error);
    }
    const delimiter = url.includes('?') ? '&' : '?';
    return `${url}${delimiter}cat=${categoryKey}`;
}
async function fetchIndexDynamicCategoryItems(url) {
    const items = [];
    for (const categoryKey of INDEX_DYNAMIC_CATEGORY_KEYS) {
        const parser = INDEX_PARSER_MAP[categoryKey];
        if (typeof parser !== 'function') {
            continue;
        }
        const targetUrl = buildIndexCategoryUrl(url, categoryKey);
        try {
            const result = await getCollectionInfoFromHtml(targetUrl, parser);
            result.forEach((item) => {
                if (!item.collectInfo) {
                    item.collectInfo = {};
                }
                if (!item.collectInfo.interestType) {
                    item.collectInfo.interestType = INDEX_CATEGORY_LABEL_MAP[categoryKey] || categoryKey;
                }
            });
            items.push(...result);
        }
        catch (error) {
            console.warn(`目录附加分类[${categoryKey}]抓取失败: `, error);
        }
    }
    return items;
}
const WATCH_STATUS_STR = '观看状态';
const IMPORT_FIELD_CONFIGS = [
    {
        column: WATCH_STATUS_STR,
        key: 'interest',
        requireValue: true,
        transform: (value) => getInterestTypeIdByName(String(value)),
    },
    { column: '我的评分', key: 'rating' },
    { column: '吐槽', key: 'comment' },
    { column: '标签', key: 'tags' },
];
const interestTypeArr = [
    'wish',
    'collect',
    'do',
    'on_hold',
    'dropped',
];
const SUBJECT_TYPE_MAP = {
    book: 1,
    anime: 2,
    music: 3,
    game: 4,
    real: 6,
};
const SUBJECT_TYPE_LABEL_MAP = {
    1: '书籍',
    2: '动画',
    3: '音乐',
    4: '游戏',
    6: '三次元',
};
const SUBJECT_TYPE_ROUTE_MAP = {
    1: "book",
    2: "anime",
    3: "music",
    4: "game",
    6: "real",
};
const SUBJECT_LABEL_TO_ROUTE_MAP = {
  书籍: "book",
  动画: "anime",
  音乐: "music",
  游戏: "game",
  三次元: "real",
};
const SUBJECT_TYPE_TEXT_KEYWORDS = [
    { keyword: '动画', label: '动画' },
    { keyword: '书籍', label: '书籍' },
    { keyword: '图书', label: '书籍' },
    { keyword: '小说', label: '书籍' },
    { keyword: '音乐', label: '音乐' },
    { keyword: '游戏', label: '游戏' },
    { keyword: '三次元', label: '三次元' },
];
const COLLECTION_SLUG_TO_API = {
    wish: 1,
    collect: 2,
    do: 3,
    on_hold: 4,
    dropped: 5,
};
const COLLECTION_API_TO_SLUG = {
    1: 'wish',
    2: 'collect',
    3: 'do',
    4: 'on_hold',
    5: 'dropped',
};
const API_USER_AGENT = 'Bangumi Collection Export Tool (+https://github.com/22earth/gm_scripts)';
const BGM_API_BASE = 'https://api.bgm.tv/v0';
const sharedDomParser = new DOMParser();
function genListUrl(t) {
    let u = location.href.replace(/[^\/]+?$/, '');
    return u + t;
}
// 通过 URL 获取收藏的状态
function getInterestTypeByUrl(url) {
    let m = url.match(/[^\/]+?$/);
    if (!m)
        return '';
    const lastSegment = m[0];
    return lastSegment.split('#')[0].split('?')[0];
}
function getListPageMeta(url) {
    const m = url.match(/\/(anime|book|music|game|real)\/list\/([^\/]+)\/([^\/?#]+)/);
    if (!m)
        return null;
    const route = m[1];
    const username = decodeURIComponent(m[2]);
    const slug = m[3];
    const subjectType = SUBJECT_TYPE_MAP[route];
    const collectionType = COLLECTION_SLUG_TO_API[slug];
    if (!username || !subjectType || !collectionType) {
        return null;
    }
    return {
        username,
        subjectType,
        collectionSlug: slug,
        collectionType,
    };
}
function convertApiCollectionItem(item) {
    var _a, _b, _c, _d;
    const subject = item.subject || {};
    const rawInfoParts = [];
    if (subject.date) {
        rawInfoParts.push(subject.date);
    }
    if (subject.eps) {
        rawInfoParts.push(`eps: ${subject.eps}`);
    }
    if (subject.rank) {
        rawInfoParts.push(`Rank ${subject.rank}`);
    }
    const cover = ((_b = (_a = subject.images) === null || _a === void 0 ? void 0 : _a.large) !== null && _b !== void 0 ? _b : ((_d = (_c = subject.images) === null || _c === void 0 ? void 0 : _c.common) !== null && _d !== void 0 ? _d : (subject.images ? subject.images.medium || subject.images.small : ''))) || '';
    const tags = Array.isArray(item.tags) ? item.tags.join(',') : '';
    const interestType = COLLECTION_API_TO_SLUG[item.type] || '';
    return {
        name: subject.name || '',
        greyName: subject.name_cn || '',
        releaseDate: subject.date || '',
        url: subject.id ? `/subject/${subject.id}` : '',
        cover,
        rawInfos: rawInfoParts.filter(Boolean).join(' / '),
        collectInfo: {
            date: item.updated_at ? formatDate(item.updated_at) : '',
            score: item.rate || '',
            tags,
            comment: item.comment || '',
            interestType,
        },
    };
}
async function fetchCollectionsViaApi(meta) {
    if (!meta)
        return null;
    const { username, subjectType, collectionType } = meta;
    const limit = 50;
    let offset = 0;
    const result = [];
    while (true) {
        const params = new URLSearchParams({
            subject_type: String(subjectType),
            type: String(collectionType),
            limit: String(limit),
            offset: String(offset),
        });
        const apiUrl = `${BGM_API_BASE}/users/${encodeURIComponent(username)}/collections?${params.toString()}`;
        let payloadText;
        try {
            payloadText = await fetchText(apiUrl, {
                headers: {
                    'User-Agent': API_USER_AGENT,
                },
            });
        }
        catch (error) {
            throw error;
        }
        let payload;
        try {
            payload = JSON.parse(payloadText);
        }
        catch (error) {
            throw error;
        }
        if ((payload === null || payload === void 0 ? void 0 : payload.title) && (payload === null || payload === void 0 ? void 0 : payload.description)) {
            throw new Error(payload.description || payload.title);
        }
        const data = payload === null || payload === void 0 ? void 0 : payload.data;
        if (!Array.isArray(data) || !data.length) {
            break;
        }
        result.push(...data.map((item) => convertApiCollectionItem(item)));
        if (data.length < limit) {
            break;
        }
        offset += data.length;
    }
    return result;
}
async function getCollectionInfo(url) {
    const meta = getListPageMeta(url);
    if (meta) {
        try {
            const apiResult = await fetchCollectionsViaApi(meta);
            if (Array.isArray(apiResult)) {
                return apiResult;
            }
        }
        catch (error) {
            console.warn('API 导出失败，使用旧版抓取逻辑: ', error);
        }
    }
    return getCollectionInfoFromHtml(url);
}
async function getCollectionInfoFromHtml(url, parser = getItemInfos) {
    const rawText = await fetchText(url);
    const $doc = sharedDomParser.parseFromString(rawText, 'text/html');
    const totalPageNum = getTotalPageNum($doc);
    const res = [...parser($doc)];
    let page = 2;
    while (page <= totalPageNum) {
        let reqUrl = url;
        const m = url.match(/page=(\d*)/);
        if (m) {
            reqUrl = reqUrl.replace(m[0], `page=${page}`);
        }
        else {
            reqUrl = `${reqUrl}?page=${page}`;
        }
        await sleep(500);
        console.info('fetch info: ', reqUrl);
        const rawText = await fetchText(reqUrl);
        const $doc = sharedDomParser.parseFromString(rawText, 'text/html');
        res.push(...parser($doc));
        page += 1;
    }
    return res;
}
async function getIndexCollectionInfo(url) {
    const parser = getIndexParserByUrl(url);
    const categoryKey = getIndexCategoryKey(url);
    if (INDEX_DYNAMIC_CATEGORY_KEYS.has(categoryKey)) {
        return parser(document);
    }
    let items = await getCollectionInfoFromHtml(url, parser);
    if (!categoryKey || categoryKey === 'default') {
        try {
            const extraItems = await fetchIndexDynamicCategoryItems(url);
            if (extraItems.length) {
                items = items.concat(extraItems);
            }
        }
        catch (error) {
            console.warn('目录扩展抓取失败: ', error);
        }
    }
    return items;
}
function getRowItem(item, options = {}) {
    const { excludedColumnsSet = null, interestTypeLabel = WATCH_STATUS_STR } = options;
    const dict = {
        name: '名称',
        greyName: '别名',
        releaseDate: '发行日期',
        url: '地址',
        cover: '封面地址',
        type: '类型',
        rawInfos: '其它信息',
    };
    const dictCollection = {
        date: '收藏日期',
        score: '我的评分',
        tags: '标签',
        comment: '吐槽',
        interestType: interestTypeLabel,
    };
    const res = {};
    const hasExcludedColumns = !!(excludedColumnsSet && excludedColumnsSet.size);
    for (const [key, value] of Object.entries(dict)) {
        if (hasExcludedColumns && excludedColumnsSet.has(value)) {
            continue;
        }
        if (key === 'type') {
            const itemRoute = getItemRouteFromData(item) || CURRENT_COLLECTION_ROUTE;
            res[value] = formatExportCellValue(item.type || getBrowserTypeLabel(itemRoute));
            continue;
        }
        // @ts-ignore
        res[value] = formatExportCellValue(item[key]);
    }
    for (const [key, value] of Object.entries(dictCollection)) {
        if (hasExcludedColumns && excludedColumnsSet.has(value)) {
            continue;
        }
        const collect = item.collectInfo || {};
        let cellValue;
        if (key === 'interestType') {
            const interestType = collect.interestType;
            if (!interestType) {
                cellValue = '';
            }
            else if (typeIdDict[interestType]) {
                const itemRoute = getItemRouteFromData(item) || CURRENT_COLLECTION_ROUTE;
                cellValue = getInterestTypeName(interestType, itemRoute);
            }
            else {
                cellValue = interestType;
            }
        }
        else if (key === 'score') {
            const scoreValue = collect[key];
            if (scoreValue === undefined || scoreValue === null || String(scoreValue).trim() === '') {
                cellValue = '';
            }
            else {
                cellValue = scoreValue;
            }
        }
        else {
            // @ts-ignore
            cellValue = collect[key];
        }
        res[value] = cellValue === '' ? '' : formatExportCellValue(cellValue);
    }
    return res;
}
function getExportHeader(excludedColumns = []) {
    if (!excludedColumns.length) {
        return CSV_HEADER_COLUMNS.slice();
    }
    const excludedSet = new Set(excludedColumns);
    return CSV_HEADER_COLUMNS.filter((column) => !excludedSet.has(column));
}
function downloadExcel(filename, items, options = {}) {
    const excludedColumns = options.excludedColumns || [];
    const interestTypeLabel = options.interestTypeLabel || WATCH_STATUS_STR;
    const excludedColumnsSet = excludedColumns.length ? new Set(excludedColumns) : null;
    const rowOptions = {
        excludedColumnsSet,
        interestTypeLabel,
    };
    const rows = items.map((item) => getRowItem(item, rowOptions));
    // @TODO 采用分步写入的方式
    const header = getExportHeader(excludedColumns);
    if (!excludedColumnsSet || !excludedColumnsSet.has(interestTypeLabel)) {
        header.push(interestTypeLabel);
    }
    const worksheet = XLSX.utils.json_to_sheet(rows, {
        header,
    });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '用户收藏');
    XLSX.writeFile(workbook, filename);
}
function genAllExportBtn(filename) {
    return createExportButton({
        label: '导出所有收藏',
        completeText: '完成所有导出',
        onClick: async () => {
            let infos = [];
            for (const t of interestTypeArr) {
                let res = [];
                try {
                    res = await getCollectionInfo(genListUrl(t));
                }
                catch (error) {
                    console.error('抓取错误: ', error);
                }
                infos = infos.concat(res.map((item) => {
                    item.collectInfo.interestType = t;
                    return item;
                }));
            }
            downloadExcel(filename, infos);
        },
    });
}
function genExportBtn(filename) {
    return createExportButton({
        label: '导出收藏',
        onClick: async () => {
            let res = [];
            try {
                res = await getCollectionInfo(location.href);
            }
            catch (error) {
                console.error('抓取错误: ', error);
            }
            const interestType = getInterestTypeByUrl(location.href);
            downloadExcel(filename, res.map((item) => {
                item.collectInfo.interestType = interestType;
                return item;
            }));
        },
    });
}

function genIndexExportBtn(filename) {
    const btnStr = '<span><a href="javascript:void(0);"><span style="color:tomato;">导出目录</span></a></span>';
    const $node = decorateButtonNode(htmlToElement(btnStr));
    $node.style.marginLeft = '10px';
    $node.addEventListener('click', async () => {
        const $text = $node.querySelector('span');
        if (!$text) {
            return;
        }
        const originText = $text.innerText;
        $text.innerText = '导出中...';
        $node.style.pointerEvents = 'none';
        const indexCategoryLabel = getIndexCategoryLabel(location.href);
        try {
            let res = await getIndexCollectionInfo(location.href);
            res = res.map((item) => {
                if (!item.collectInfo) {
                    item.collectInfo = {};
                }
                if (!item.collectInfo.interestType) {
                    item.collectInfo.interestType = indexCategoryLabel;
                }
                return item;
            });
            logDirectoryExportTypes(res, indexCategoryLabel);
            downloadExcel(filename, res, {
                excludedColumns: DIRECTORY_EXPORT_EXCLUDED_COLUMNS,
                interestTypeLabel: '类型',
            });
            $text.innerText = '导出完成';
        }
        catch (error) {
            $text.innerText = '导出失败';
            console.error('目录导出失败: ', error);
        }
        finally {
            setTimeout(() => {
                $text.innerText = originText;
            }, 1500);
            $node.style.pointerEvents = 'auto';
        }
    });
    return $node;
}
function getDirectoryImportLogTarget() {
    const $form = document.querySelector('#newIndexRelatedForm');
    if (!$form)
        return null;
    const $submitWrapper = $form.querySelector('#submitBtnO');
    if ($submitWrapper)
        return $submitWrapper;
    return $form;
}
function getDirectorySectionForm(sectionId) {
    if (!sectionId) {
        return document.querySelector('#newIndexRelatedForm');
    }
    const $section = document.getElementById(sectionId);
    if ($section) {
        const $form = $section.querySelector('form#newIndexRelatedForm') || $section.querySelector('form');
        if ($form) {
            return $form;
        }
    }
    return document.querySelector('#newIndexRelatedForm');
}
function buildDirectoryFormBody($form, config, value, comment = '') {
    var _a, _b;
    const entryValue = value === undefined || value === null ? '' : String(value).trim();
    const commentValue = comment === undefined || comment === null ? '' : String(comment);
    const $titleInput = $form.querySelector('input[name="add_related"], #title');
    if ($titleInput) {
        $titleInput.value = entryValue;
    }
    const $catInput = $form.querySelector('input[name="cat"]');
    if ($catInput && config.cat !== undefined) {
        $catInput.value = config.cat;
    }
    const $reply = $form.querySelector('textarea[name="content"], #modify_content, textarea.reply');
    if ($reply) {
        $reply.value = commentValue;
    }
    const formData = new FormData($form);
    formData.set('add_related', entryValue);
    if (config.cat !== undefined) {
        formData.set('cat', config.cat);
    }
    if ($reply && $reply.name) {
        formData.set($reply.name, commentValue);
    }
    else {
        formData.set('content', commentValue);
    }
    const $submit = $form.querySelector('input[type="submit"][name]');
    if ($submit && $submit.name) {
        formData.set($submit.name, ((_a = $submit.getAttribute('value')) === null || _a === void 0 ? void 0 : _a.toString()) || $submit.value || '');
    }
    const params = new URLSearchParams();
    formData.forEach((formValue, key) => {
        if (typeof formValue === 'string') {
            params.append(key, formValue);
        }
    });
    const action = (_b = $form.getAttribute('action')) !== null && _b !== void 0 ? _b : location.href;
    return {
        body: params.toString(),
        method: ($form.getAttribute('method') || 'POST').toUpperCase(),
        url: new URL(action, location.origin).toString(),
    };
}
async function submitDirectoryImportItem(item) {
    const { config, entryValue, comment } = item;
    const $form = getDirectorySectionForm(config.sectionId);
    if (!$form) {
        throw new Error(`未找到 ${config.sectionId} 表单`);
    }
    const request = buildDirectoryFormBody($form, config, entryValue, comment);
    const response = await fetch(request.url, {
        method: request.method,
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'X-Requested-With': 'XMLHttpRequest',
        },
        body: request.body,
    });
    const responseText = await response.text();
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }
    if (comment) {
        const relationId = findRelationIdFromHtml(responseText, item.targetHref);
        if (!relationId) {
            throw new Error('未找到关联 ID，无法更新评价');
        }
        await updateDirectoryRelationComment(relationId, comment);
    }
}
function convertDirectoryRow(row) {
    const { value: typeLabel } = parseImportedCell(row['类型']);
    const { value: address } = parseImportedCell(row['地址']);
    if (!typeLabel || !address)
        return null;
    const config = getDirectoryTypeConfig(String(typeLabel));
    if (!config) {
        console.warn('未知的目录类型: ', typeLabel);
        return null;
    }
    const entryValue = extractDirectoryId(String(address), config);
    if (!entryValue) {
        console.warn('未能从地址解析条目: ', address);
        return null;
    }
    const targetHref = buildDirectoryTargetHref(String(address), config);
    const { value: comment } = parseImportedCell(row['吐槽']);
    const { value: name } = parseImportedCell(row['名称']);
    return {
        config,
        entryValue,
        comment: comment || '',
        name: name || entryValue,
        typeLabel,
        rawAddress: address,
        targetHref,
    };
}
async function processDirectoryImportTasks(tasks, $logTarget) {
    for (const task of tasks) {
        const label = `「${task.name}」(${task.typeLabel})`;
        try {
            await submitDirectoryImportItem(task);
            if ($logTarget) {
                insertLogInfo($logTarget, `${label} 导入成功`);
            }
        }
        catch (error) {
            console.error('目录导入错误: ', error);
            if ($logTarget) {
                const message = (error && error.message) || error;
                insertLogInfo($logTarget, `${label} 导入失败: ${message}`);
            }
        }
        await randomSleep(1800, 800);
    }
}
async function handleIndexImportFile(e) {
    const input = e.target;
    const file = input.files && input.files[0];
    if (!file)
        return;
    const $wrapper = input.closest('.e-userjs-btn') || input.parentElement;
    const $text = $wrapper ? $wrapper.querySelector('a>span') : null;
    const originText = $text ? $text.innerText : '';
    if ($text) {
        $text.innerText = '导入目录中...';
    }
    input.disabled = true;
    try {
        const rows = await parseWorkbookToJson(file);
        const tasks = rows
            .map((row) => convertDirectoryRow(row))
            .filter((item) => !!item);
        if (!tasks.length) {
            throw new Error('没有可导入的数据');
        }
        const $logTarget = getDirectoryImportLogTarget();
        if ($logTarget) {
            insertLogInfo($logTarget, `准备导入 ${tasks.length} 条目录关联`);
        }
        await processDirectoryImportTasks(tasks, $logTarget);
        if ($text) {
            $text.innerText = '导入完成';
        }
        alert('目录导入完成');
        location.reload();
    }
    catch (error) {
        console.error('目录导入失败: ', error);
        if ($text) {
            $text.innerText = '导入失败';
        }
        const message = (error && error.message) || error;
        alert(`目录导入失败: ${message || '未知错误'}`);
    }
    finally {
        input.disabled = false;
        input.value = '';
        setTimeout(() => {
            if ($text) {
                $text.innerText = originText || '导入目录';
            }
        }, 1500);
    }
}
function genIndexImportControl() {
    if (!document.querySelector('#newIndexRelatedForm')) {
        return null;
    }
    const btnStr = '<span><a href="javascript:void(0);"><span style="color:tomato;">导入目录</span></a><input type="file" accept=".xlsx,.xls,.csv" style="display:none" /></span>';
    const $node = decorateButtonNode(htmlToElement(btnStr));
    $node.style.marginLeft = '10px';
    const $link = $node.querySelector('a');
    const $file = $node.querySelector('input[type="file"]');
    if ($link && $file) {
        $link.addEventListener('click', (event) => {
            event.preventDefault();
            $file.click();
        });
        $file.addEventListener('change', handleIndexImportFile);
    }
    return $node;
}

async function updateUserInterest(subject, data, $infoDom) {
    const nameStr = `<span style="color:tomato">《${subject.name}》</span>`;
    try {
        const subjectId = getSubjectId(subject.url);
        if (!subjectId) {
            throw new Error('条目地址无效');
        }
        insertLogInfo($infoDom, `更新收藏 ${nameStr} …`);
        await updateInterest(subjectId, data);
        insertLogInfo($infoDom, `更新收藏 ${nameStr} 成功`);
    }
    catch (error) {
        insertLogInfo($infoDom, `导入 ${nameStr} 错误: ${error}`);
        console.error('导入错误: ', error);
    }
}
function readCSV(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        const detectReader = new FileReader();
        detectReader.readAsBinaryString(file);
        detectReader.onload = function (e) {
            const contents = this.result;
            const arr = contents.split(/\r\n|\n/);
            // 检测文件编码
            reader.readAsText(file, jschardet.detect(arr[0].toString()).encoding);
        };
        reader.onload = function (e) {
            resolve(this.result);
        };
        reader.onerror = function (e) {
            reject(e);
        };
    });
}
async function parseWorkbookToJson(file) {
    let workbook;
    if (file.name.includes('.csv')) {
        const data = await readCSV(file);
        workbook = XLSX.read(data, { type: 'string' });
    }
    else {
        const data = await file.arrayBuffer();
        workbook = XLSX.read(data);
    }
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    return XLSX.utils.sheet_to_json(worksheet);
}
function ensureImportProgressStyle() {
    const styleId = 'bangumi-import-progress-style';
    if (document.getElementById(styleId)) {
        return;
    }
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
.bangumi-import-progress-panel {
  margin-top: 10px;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid rgba(255, 99, 71, 0.4);
  background: rgba(255, 99, 71, 0.08);
  font-size: 12px;
  line-height: 1.6;
}
.bangumi-import-progress-summary {
  font-weight: bold;
  color: #ff7043;
}
.bangumi-import-progress-note {
  margin-top: 4px;
  color: #555;
}
.bangumi-import-progress-log {
  margin-top: 6px;
  max-height: 160px;
  overflow-y: auto;
}
.bangumi-import-progress-log .bangumi-log-entry {
  margin-bottom: 4px;
  color: #444;
}
.bangumi-import-progress-log .bangumi-log-warn {
  color: #d97706;
}
.bangumi-import-progress-log .bangumi-log-error {
  color: #dc2626;
}
`;
    document.head.appendChild(style);
}
function createImportProgressTracker(options = {}) {
    ensureImportProgressStyle();
    const container = options.container || document.body;
    const existing = container.querySelector('#bangumi-import-progress-panel');
    if (existing) {
        existing.remove();
    }
    const panel = document.createElement('div');
    panel.id = 'bangumi-import-progress-panel';
    panel.className = 'bangumi-import-progress-panel';
    const summaryEl = document.createElement('div');
    summaryEl.className = 'bangumi-import-progress-summary';
    const noteEl = document.createElement('div');
    noteEl.className = 'bangumi-import-progress-note';
    const logEl = document.createElement('div');
    logEl.className = 'bangumi-import-progress-log';
    panel.appendChild(summaryEl);
    panel.appendChild(noteEl);
    panel.appendChild(logEl);
    container.appendChild(panel);
    const state = {
        fileTotal: options.fileTotal || 0,
        total: options.total || 0,
        completed: 0,
        skipped: options.skipped || 0,
        failed: 0,
        retries: 0,
    };
    const failureSet = new Set();
    const getTaskKey = (task) => {
        if (!task)
            return '';
        const subject = task.subject || {};
        return subject.url || subject.name || '';
    };
    function render() {
        summaryEl.textContent = `共 ${state.fileTotal} 条，需更新 ${state.total} 条，已完成 ${state.completed}/${state.total}，跳过 ${state.skipped}，失败 ${state.failed}`;
        if (state.total === 0) {
            summaryEl.textContent = `共 ${state.fileTotal} 条，全部已最新或被跳过`;
        }
        noteEl.textContent = state.message || '';
    }
    function addLog(message, level = 'info') {
        if (!message)
            return;
        const entry = document.createElement('div');
        entry.className = `bangumi-log-entry ${level === 'warn'
            ? 'bangumi-log-warn'
            : level === 'error'
                ? 'bangumi-log-error'
                : ''}`;
        entry.textContent = message;
        logEl.appendChild(entry);
        logEl.scrollTop = logEl.scrollHeight;
    }
    render();
    return {
        addLog,
        markSuccess(task) {
            state.completed += 1;
            const key = getTaskKey(task);
            if (key && failureSet.has(key)) {
                failureSet.delete(key);
                state.failed = failureSet.size;
            }
            render();
        },
        markFailure(task, error) {
            const key = getTaskKey(task);
            if (key) {
                failureSet.add(key);
                state.failed = failureSet.size;
            }
            const subjectName = (task === null || task === void 0 ? void 0 : task.subject) ? task.subject.name : '';
            addLog(`${subjectName || '未知条目'} 更新失败: ${(error && error.message) || error}`, 'error');
            render();
        },
        markRetry(remain, attempt) {
            state.retries += 1;
            addLog(`第 ${attempt} 轮失败 ${remain} 条，准备重试`, 'warn');
        },
        setMessage(msg) {
            state.message = msg;
            render();
        },
        getState() {
            return Object.assign({}, state);
        },
        finish({ failedCount = 0, message = '' } = {}) {
            state.failed = failedCount;
            state.message = message || state.message;
            render();
        },
    };
}
async function runTasksWithConcurrency(items, iterator, concurrency = IMPORT_MAX_CONCURRENT_REQUESTS) {
    if (!items.length) {
        return;
    }
    const workerCount = Math.max(1, Math.min(concurrency, items.length));
    let currentIndex = 0;
    const workers = Array.from({ length: workerCount }, async () => {
        while (true) {
            const nextIndex = currentIndex;
            currentIndex += 1;
            if (nextIndex >= items.length) {
                break;
            }
            await iterator(items[nextIndex], nextIndex);
        }
    });
    await Promise.all(workers);
}
async function processImportTasksWithRetry(tasks, options = {}) {
    const { concurrency = IMPORT_MAX_CONCURRENT_REQUESTS, maxAttempts = IMPORT_MAX_RETRY_TIMES, hooks = {} } = options;
    const failedTasks = [];
    let pending = tasks.slice();
    if (!pending.length) {
        return failedTasks;
    }
    for (let attempt = 1; attempt <= maxAttempts && pending.length; attempt++) {
        hooks.onAttemptStart && hooks.onAttemptStart({ attempt, remainingCount: pending.length });
        const attemptFailed = [];
        await runTasksWithConcurrency(pending, async (task) => {
            try {
                await updateUserInterest(task.subject, task.info, task.$infoDom);
                hooks.onTaskSuccess && hooks.onTaskSuccess({ attempt, task });
            }
            catch (error) {
                task.lastError = error;
                attemptFailed.push(task);
                hooks.onTaskFail && hooks.onTaskFail({ attempt, task, error });
            }
        }, concurrency);
        if (!attemptFailed.length) {
            break;
        }
        if (attempt === maxAttempts) {
            failedTasks.push(...attemptFailed);
        }
        else {
            pending = attemptFailed;
            hooks.onRetryScheduled &&
                hooks.onRetryScheduled({ nextAttempt: attempt + 1, remainingCount: pending.length });
            await sleep(Math.min(3000, 1000 * attempt));
        }
    }
    return failedTasks;
}
async function handleFileAsync(e) {
    const target = e.target;
    const $parent = target.closest('li');
    const $label = $parent ? $parent.querySelector('a > span') : null;
    const file = target.files[0];
    if (!file) {
        return;
    }
    if ($label) {
        $label.innerHTML = '导入中…';
    }
    if ($parent) {
        $parent.style.pointerEvents = 'none';
    }
    const $menu = document.querySelector('#columnSubjectBrowserB .menu_inner');
    const logContainer = $menu || document.querySelector('#columnSubjectBrowserB') || document.body;
    let progressTracker = null;
    let jsonData = [];
    try {
        jsonData = await parseWorkbookToJson(file);
        const parsedTasks = [];
        const invalidRecords = [];
        for (const item of jsonData) {
            try {
                const { value: subjectName } = parseImportedCell(item['名称']);
                const { value: subjectUrl } = parseImportedCell(item['地址']);
                const subject = {
                    name: subjectName,
                    url: subjectUrl,
                };
                if (!subject.name || !subject.url) {
                    throw new Error('没有条目信息');
                }
                const info = {};
                for (const config of IMPORT_FIELD_CONFIGS) {
                    const cell = parseImportedCell(item[config.column]);
                    if (cell.isNullPlaceholder)
                        continue;
                    if (config.requireValue && !cell.value)
                        continue;
                    const mappedValue = config.transform ? config.transform(cell.value) : cell.value;
                    if (mappedValue !== undefined) {
                        info[config.key] = mappedValue;
                    }
                }
                parsedTasks.push({ subject, info, $infoDom: logContainer });
            }
            catch (error) {
                console.error('导入错误: ', error);
                invalidRecords.push(error);
            }
        }
        const snapshot = await getCurrentCollectionSnapshot();
        if (!snapshot) {
            console.warn('未能获取现有收藏快照，差分跳过不可用');
        }
        const pendingTasks = [];
        let diffSkipped = 0;
        for (const task of parsedTasks) {
            const subjectId = getSubjectId(task.subject.url);
            if (subjectId && shouldSkipCollectionUpdate(subjectId, task.info, snapshot)) {
                diffSkipped += 1;
                continue;
            }
            pendingTasks.push(task);
        }
        const initialSkipped = diffSkipped + invalidRecords.length;
        progressTracker = createImportProgressTracker({
            container: logContainer,
            fileTotal: jsonData.length,
            total: pendingTasks.length,
            skipped: initialSkipped,
        });
        if (invalidRecords.length) {
            progressTracker.addLog(`${invalidRecords.length} 条记录缺少有效条目信息，已跳过`, 'warn');
        }
        if (diffSkipped) {
            progressTracker.addLog(`${diffSkipped} 条记录与现有收藏一致，自动跳过`);
        }
        if (!snapshot) {
            progressTracker.addLog('未能获取现有收藏信息，无法进行差分比对', 'warn');
        }
        if (!pendingTasks.length) {
            if ($label) {
                $label.innerHTML = '无需更新';
            }
            progressTracker.setMessage('全部条目已是最新，无需导入');
            alert('所有条目均与现有收藏一致或数据无效，无需更新');
            return;
        }
        const hooks = {
            onAttemptStart: ({ attempt, remainingCount }) => {
                progressTracker.addLog(`开始第 ${attempt} 轮导入，剩余 ${remainingCount} 条`);
            },
            onTaskSuccess: ({ task }) => {
                progressTracker.markSuccess(task);
            },
            onTaskFail: ({ task, error }) => {
                progressTracker.markFailure(task, error);
            },
            onRetryScheduled: ({ nextAttempt, remainingCount }) => {
                progressTracker.markRetry(remainingCount, nextAttempt);
            },
        };
        const failedTasks = await processImportTasksWithRetry(pendingTasks, {
            concurrency: IMPORT_MAX_CONCURRENT_REQUESTS,
            maxAttempts: IMPORT_MAX_RETRY_TIMES,
            hooks,
        });
        const state = progressTracker.getState();
        if (failedTasks.length) {
            progressTracker.finish({
                failedCount: failedTasks.length,
                message: '导入完成，但仍有条目失败，请查看日志后重试。',
            });
            if ($label) {
                $label.innerHTML = '导入完成(有失败)';
            }
            alert(`导入完成，但 ${failedTasks.length} 条条目多次重试仍失败。成功 ${state.completed} 条，跳过 ${state.skipped} 条。`);
        }
        else {
            progressTracker.finish({
                failedCount: 0,
                message: '导入完成',
            });
            if ($label) {
                $label.innerHTML = '导入完成';
            }
            alert(`导入完成：成功 ${state.completed} 条，跳过 ${state.skipped} 条。`);
            location.reload();
        }
    }
    catch (error) {
        console.error('导入错误: ', error);
        if ($label) {
            $label.innerHTML = '导入失败';
        }
        if (progressTracker) {
            progressTracker.addLog(`导入过程中发生错误: ${(error && error.message) || error}`, 'error');
            progressTracker.setMessage('导入失败，请稍后重试');
        }
        alert(`导入失败: ${(error && error.message) || error}`);
    }
    finally {
        if ($parent) {
            $parent.style.pointerEvents = 'auto';
        }
        target.value = '';
    }
}
function genImportControl() {
    const btnStr = `<li title="支持和导出表头相同的 csv 和 xlsx 文件">
  <a href="javascript:void(0);"><span style="color:tomato;"><label for="e-userjs-import-csv-file">导入收藏</label></span></a>
  <input type="file" id="e-userjs-import-csv-file" style="display:none" />
</li>`;
    const $node = decorateButtonNode(htmlToElement(btnStr));
    const $file = $node.querySelector('#e-userjs-import-csv-file');
    // $file.addEventListener('change', handleInputChange);
    $file.addEventListener('change', handleFileAsync);
    return $node;
}
function addExportBtn(ext = 'xlsx') {
    var _a;
    const $nav = $q('#headerProfile .navSubTabs');
    if (!$nav)
        return;
    const type = ((_a = $nav.querySelector('.focus')) === null || _a === void 0 ? void 0 : _a.textContent) || '';
    const $username = $q('.nameSingle .inner>a');
    let name = '导出收藏';
    if ($username) {
        name = $username.textContent;
    }
    const dateStamp = formatDate(new Date());
    const filename = `${name}-${type}-${dateStamp}.${ext}`;
    $nav.appendChild(genAllExportBtn(`${name}-${dateStamp}.${ext}`));
    // 判断是否在单个分类页面
    const interestType = getInterestTypeByUrl(location.href);
    if (interestTypeArr.includes(interestType)) {
        $nav.appendChild(genExportBtn(filename));
    }
    $nav.appendChild(genImportControl());
}
initBrowserSelectionFeature();
initCollectionSelectionFeature();
// 索引
if (location.href.match(/index\/\d+/)) {
    const $header = $q('#header');
    if ($header) {
        const titleNode = $header.querySelector('h1');
        const baseName = (titleNode === null || titleNode === void 0 ? void 0 : titleNode.textContent.trim()) || '导出目录';
        let filename = `${baseName}.xlsx`;
        try {
            const currentUrl = new URL(location.href);
            const cat = currentUrl.searchParams.get('cat');
            if (cat) {
                filename = `${baseName}-${cat}.xlsx`;
            }
        }
        catch (error) {
            console.warn('生成目录文件名失败: ', error);
        }
        const $exportBtn = genIndexExportBtn(filename);
        if ($exportBtn) {
            $header.appendChild($exportBtn);
        }
        const $importBtn = genIndexImportControl();
        if ($importBtn) {
            $header.appendChild($importBtn);
        }
    }
}
if (location.href.match(/\w+\/list\//)) {
    addExportBtn();
}
function getIndexSubjectTypeLabelByIcon(item) {
    const icon = item.querySelector('.ico_subject_type[class*="subject_type_"], [class*="subject_type_"]');
    if (!icon)
        return '';
    const match = icon.className.match(/subject_type_(\d+)/);
    if (!match)
        return '';
    const label = SUBJECT_TYPE_LABEL_MAP[match[1]];
    return label || '';
}
function getIndexSubjectTypeLabelByText(item) {
    const selectors = ['.info', '.info.tip', '.type', '.badge', '.subjectType'];
    const texts = [];
    for (const selector of selectors) {
        const nodeList = item.querySelectorAll(selector);
        for (const node of Array.from(nodeList)) {
            const text = normalizeIndexText(node.textContent);
            if (text)
                texts.push(text);
        }
    }
    if (!texts.length) {
        const fallbackText = normalizeIndexText(item.textContent || '');
        texts.push(fallbackText);
    }
    const combined = texts.join(' / ');
    for (const { keyword, label } of SUBJECT_TYPE_TEXT_KEYWORDS) {
        const regex = new RegExp(`(^|\\s|/|,|·)${keyword}($|\\s|/|,|·)`);
        if (regex.test(combined)) {
            return label;
        }
    }
    return '';
}
function getIndexSubjectTypeLabel(item) {
    const iconLabel = getIndexSubjectTypeLabelByIcon(item);
    if (iconLabel) {
        return iconLabel;
    }
    return getIndexSubjectTypeLabelByText(item);
}
function getRouteBySubjectLabel(label = "") {
  return SUBJECT_LABEL_TO_ROUTE_MAP[label] || "";
}
function getRouteByInterestLabel(label = "") {
    if (!label) {
        return "";
    }
    const routes = [];
    Object.entries(INTEREST_LABELS_BY_ROUTE).forEach(([route, map]) => {
        if (route === "default") {
            return;
        }
        if (Object.values(map || {}).includes(label)) {
            routes.push(route);
        }
    });
    if (routes.length === 1) {
        return routes[0];
    }
    return "";
}
function getRouteBySubjectTypeId(subjectTypeId) {
    return SUBJECT_TYPE_ROUTE_MAP[subjectTypeId] || "";
}
function getItemRouteFromData(item) {
    if (!item) {
        return "";
    }
    if (item.collectionRoute) {
        return item.collectionRoute;
    }
    if (item.subjectTypeId) {
        return getRouteBySubjectTypeId(item.subjectTypeId);
    }
    if (item.type) {
        return getRouteBySubjectLabel(item.type);
    }
    return "";
}
function getItemRouteFromNode($item) {
  const label = getIndexSubjectTypeLabel($item);
  return getRouteBySubjectLabel(label);
}



