// ==UserScript==
// @name         JavBus女优备注
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      1.0
// @description  在网页上的JAV女优名字后面添加信息备注。
// @note         备注格式：[出生年份][出演年龄][身高][三围]，如[1999][26岁][⭐172][B80-W58-H85]。
// @note         解释：
// @note         出生年份较早，拍摄时间较早的作品，不能因此就说这是“熟女片”。如果只备注出生年份，很容易忽视女优拍片时的实际年龄，因此需要额外备注出演年龄；
// @note         身高168cm及以上会⭐标显示。
// @note         由于日本的罩杯计算相比国内大一到两号，因此备注罩杯大小无意义。用胸围数据替代罩杯大小，更准确。而且腰围和臀围可以得到得到腰臀比；
// @note         多个数据来源，但偶尔也可能收录了错误的信息，哪个数据是正确的只能靠人工判断。当发现数据不对劲后，可对该女优信息自行补全更正。这份已知信息名单（预设数据），由使用者自行补全。即当查找的女优在这份名单里，会直接使用其数据，不再查询。
// @note         信息未知的部分用[?]备注。
// @note         实用功能：在素人片或共演片的“暫無出演者資訊”的下方显示实际出演女优及信息。如果搜寻结果出现 (≥o≤) 或 ＊＊＊ ，表示此女优信息暂未收录。
// @note         最后，不局限JavBus，有能力可自行扩展更多网站。
// @author       youziv6
// @include      /^https?:\/\/(?:[A-Za-z0-9]+\.)*(?:javbus|busjav|busfan|fanbus|buscdn|cdnbus|dmmsee|seedmm|busdmm|dmmbus|javsee|seejav){1}(?:\.[A-Za-z0-9]+)?\/*
// @exclude      /^https?:\/\/(?:[A-Za-z0-9]+\.)*(?:javbus|busjav|busfan|fanbus|buscdn|cdnbus|dmmsee|seedmm|busdmm|dmmbus|javsee|seejav){1}(?:\.[A-Za-z0-9]+)?\/(?:forum|actresses|genre|series|studio|page){1,}\/?\S*$/
// @icon         https://www.javbus.com/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      av2ch.net
// @connect      av-wiki.net
// @connect      wikipedia.org
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/547803/JavBus%E5%A5%B3%E4%BC%98%E5%A4%87%E6%B3%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/547803/JavBus%E5%A5%B3%E4%BC%98%E5%A4%87%E6%B3%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let actressName, ID = '';
    const host = window.location.host;
    const actressUrl = window.location.href;

    // 资料不全或数据不对，可在此手动添加预设数据
    const actressInfos = {
        '宮瀬リコ': '[1989][⭐173][B80-W59-H88]', // TokyoHot 官方数据
        '松本ななえ': '[1993][⭐172][B86-W57-H86]',
        '小谷舞花': '[1994][⭐170][?]',
        '高千穂すず': '[1996][⭐172][B87-W58-H89]',
        'みなと羽琉': '[1996][⭐175][B108-W62-H91]',
        '泉ゆり': '[1998][⭐175][B82-W54-H81]', // 出生年份由 https://xslist.org/ 的数据补全
        '深田えいみ': '[1998][158][B87.8-W63.5-H91.9]',
        '滝冬ひかり': '[2004][⭐170][B85-W56-H88]', // 根据 https://www.bilibili.com/opus/883159328946651157 推测
        '本庄鈴': '[1996][165][B80-W60-H86]', // 根据 https://www.south-plus.net/read.php?tid-2641300.html 分享的试镜资料
    }

    // 可自行扩展更多站点
    switch (true) {
        case /www\..*(jav|bus|dmm).*\..*/.test(host):
            if (actressUrl.includes('/star/')) {
                GM_addStyle(`.photo-info p {display: none;}`);
                actressName = $('.avatar-box .photo-info>span').text().trim();
                fetchData($('.avatar-box .photo-info>span'), actressName);
            } else {
                const releaseYear = $('.info p:nth-of-type(2)').text().match(/(\d{4})/)?.[1];
                $('.info .genre[onmouseover]>a').each(function () {
                    actressName = $(this).text().trim();
                    fetchData($(this), actressName, releaseYear);
                });
                // 对“暫無出演者資訊”作品的实际演员进行查询
                if (document.querySelector('.info .star-show+span').nextSibling.textContent.trim() === '暫無出演者資訊') {
                    ID = $('.info p:first span').text().trim().replace('識別碼:', '')
                    const targetElement = document.querySelector('.info .star-show + span');
                    const targetText = targetElement.nextSibling;
                    const newElement = document.createElement('p');
                    newElement.setAttribute('class', 'searched-star-show');
                    newElement.innerHTML = '<span><b>搜尋到出演女優：</b></span>';
                    targetElement.parentNode.insertBefore(newElement, targetText.nextSibling);
                    GM_xmlhttpRequest({
                        url: `https://av-wiki.net/?s=${ID}&post_type=product`,
                        method: 'GET',
                        onload: function (response) {
                            const parser = new DOMParser();
                            const doc = parser.parseFromString(response.responseText, 'text/html');
                            const xpath = `//li[text()='${ID}']`;
                            const result = doc.evaluate(
                                xpath,
                                doc,
                                null,
                                XPathResult.FIRST_ORDERED_NODE_TYPE,
                                null
                            );
                            const element = result.singleNodeValue;
                            if (element) {
                                $(element.previousSibling.previousSibling).find('a').each(function (index) {
                                    actressName = $(this).text().trim();
                                    $('.info .searched-star-show').after(`<p><span class="searched${index + 1}"><a href="https://www.javbus.com/searchstar/${actressName}" target="_blank">${actressName}</a></span></p>`);
                                    fetchData($(`.info .searched${index + 1}`), actressName, releaseYear);
                                })
                            }
                        }
                    })
                }
            }
            break;
    }

    function gmFetchAv2chInfo(actressName, releaseYear) {
        let matched = false;
        const pendingRequests = [];
        const targetNames = actressName.match(/[^（）]+/g);
        return new Promise((resolve) => {
            targetNames.forEach((targetName) => {
                if (matched) return;
                const req = GM_xmlhttpRequest({
                    url: 'https://av2ch.net/avsearch/avs.php',
                    method: 'POST',
                    data: `keyword=${targetName}&gte_height=min&lte_height=max&gte_bust=min&lte_bust=max&gte_waist=min&lte_waist=max&gte_hip=min&lte_hip=max&gte_cup=min&lte_cup=max&gte_age=min&lte_age=max&genre_01=&genre_02=`,
                    headers: {
                        'Content-type': 'application/x-www-form-urlencoded',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'
                    },
                    onload: function (response) {
                        if (matched) return;
                        $(response.responseText).find('.box_actress>h2').each(function () {
                            const resultNames = $(this).text().trim().match(/[^（）]+/g);
                            const text = $(this).nextAll('.text_actress').find('p').text();
                            resultNames.forEach((resultName) => {
                                if (resultName === targetName) {
                                    if (matched) return;
                                    const links = $(this).nextAll('.text_actress').find('p>.link_actress_genre_waku');
                                    if (links.length !== 0) {
                                        matched = true;
                                        pendingRequests.forEach(request => {
                                            if (request.readyState !== 4) {
                                                request.abort();
                                            }
                                        });
                                        pendingRequests.length = 0;
                                        const result = text.split('\n').slice(3, 5).join(' ');
                                        const info = formatPersonalInfo(result, releaseYear);
                                        resolve(info);
                                    }
                                }
                            })
                        })
                    },
                    onabort: function () {
                        console.log('请求被中止'); // 如果存在别名，会显示此信息
                    }
                });
                pendingRequests.push(req);
            })
        })
    }

    function gmFetchWikipediaInfo(actressName, releaseYear) {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                url: `https://ja.wikipedia.org/wiki/${actressName}`,
                method: 'GET',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36',
                },
                onload: function (response) {
                    const birthday = $(response.responseText).find('.infobox tbody tr:contains("生年月日")>td').text().trim();
                    const birthYear = parseInt(birthday.match(/(\d{4})年/)?.[1]);
                    // 出生年份小于1980年，直接返回undefined，防止碰巧重名
                    if (birthYear < 1980) {
                        const info = '[undefined][undefined][Bundefined-Wundefined-Hundefined]';
                        resolve(info);
                    }
                    const height = $(response.responseText).find('.infobox tbody tr:contains("身長 / 体重"):first>td').text().trim().split('/')[0].replace(/(\d{3}) cm/, 'T$1').trim();
                    const measurements = $(response.responseText).find('.infobox tbody tr:contains("スリーサイズ"):first>td').text().trim().replace(/(\d{2,3}) - (\d{2}) - (\d{2,3}) cm/, 'B$1-W$2-H$3');
                    const info = formatPersonalInfo([birthday, height, measurements].join(' '), releaseYear);
                    resolve(info);
                }
            });
        });
    }

    function gmFetchAvWikiInfo(actressName, releaseYear) {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                url: `https://av-wiki.net/?s=${actressName}&post_type=product`,
                method: 'GET',
                headers: {
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Encoding': 'gzip, deflate, br, zstd',
                    'Cookie': '_lscache_vary=5253ad7591e7079be24731efae29a1eb',
                    'Referer': 'https://av-wiki.net/',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36',
                },
                onload: function (response) {
                    if ($(response.responseText).find(`a[rel='tag']:contains('${actressName}')`)[0] == undefined) {
                        const info = '[undefined][undefined][Bundefined-Wundefined-Hundefined]';
                        resolve(info);
                    }
                    const url = $(response.responseText).find(`a[rel='tag']:contains('${actressName}')`)[0].href;
                    GM_xmlhttpRequest({
                        url: url,
                        method: 'GET',
                        onload: function (response) {
                            let info = $(response.responseText).find('.actress-data dd:nth-of-type(n+3):nth-of-type(-n+4)').text();
                            info = formatPersonalInfo(info, releaseYear);
                            resolve(info);
                        }
                    });
                }
            });
        });
    }

    async function fetchData($element, actressName, releaseYear) {
        // 女优跳槽换事务所或引退后又复出改名不被识别，需要自行添加，用之前艺名检索
        switch (actressName) {
            case '河北彩伽':
                actressName = '河北彩花';
                break;
        }
        // 使用预设数据
        if (actressName in actressInfos) {
            if (actressUrl.includes('/star/')) {
                $element.append(`<br>${actressInfos[actressName]}`);
                return;
            }
            const year = actressInfos[actressName].match(/(\d{4})/)?.[1];
            const ageText = calculateAge(year, releaseYear);
            const result = actressInfos[actressName].replace(/^(\[[^\]]+\])/, '$1' + `[${ageText}]`);
            $element.append(`<br>${result}`);
            return;
        }
        try {
            if (actressName != undefined) showToast(`正在查找「${actressName}」...`, 3000);
            const response = await gmFetchAv2chInfo(actressName, releaseYear);
            console.log('「' + actressName + '」' + 'from Av2chInfo: ' + response);
            if (!response.includes('undefined')) {
                $element.append(`<br>${response}`);
                return;
            }
            const response2 = await gmFetchWikipediaInfo(actressName, releaseYear);
            console.log('「' + actressName + '」' + 'from WikipediaInfo: ' + response2);
            if (!response2.includes('undefined')) {
                $element.append(`<br>${response2}`);
                return;
            }
            const response3 = await gmFetchAvWikiInfo(actressName, releaseYear);
            console.log('「' + actressName + '」' + 'from AvWikiInfo: ' + response3);
            if (!response3.includes('undefined')) {
                $element.append(`<br>${response3}`);
                return;
            }
            const data = {
                av2chInfo: response.split('][').map(item => item.replace(/[\[\]]/g, '')),
                wikipediaInfo: response2.split('][').map(item => item.replace(/[\[\]]/g, '')),
                avWikiInfo: response3.split('][').map(item => item.replace(/[\[\]]/g, ''))
            };
            const formattedResult = processInfo(data);
            $element.append(`${formattedResult}<br>`);
        } finally {
            if (actressName != undefined) showToast(`✓ 已获取「${actressName}」的全部信息`, 3000);
        }
    }

    fetchData();

    function processInfo(data) {
        const mergedValues = [
            [data.av2chInfo[0], data.wikipediaInfo[0], data.avWikiInfo[0]], // 出生年份位置
            [data.av2chInfo[1], data.wikipediaInfo[1], data.avWikiInfo[1]], // 出演年龄位置
            [data.av2chInfo[2], data.wikipediaInfo[2], data.avWikiInfo[2]], // 身高位置
            [data.av2chInfo[3], data.wikipediaInfo[3], data.avWikiInfo[3]], // 三围位置
        ];
        const result = mergedValues.map(valueArray =>
            valueArray.find(value => value !== undefined && !value.includes('undefined') && value !== '?岁') || '?');
        console.table(result);
        if (actressUrl.includes('/star/')) return `[${result[0]}][${result[2]}][${result[3]}]`;
        return `[${result[0]}][${result[1]}][${result[2]}][${result[3]}]`;
    }

    function calculateAge(year, releaseYear) {
        let ageText = '?岁';
        if (year !== undefined && releaseYear) {
            const age = parseInt(releaseYear) - parseInt(year);
            ageText = `${age}岁`;
            return ageText;
        }
        return ageText;
    }

    function formatPersonalInfo(str, releaseYear) {
        const year = str.match(/(\d{4})年/)?.[1];
        const height = str.match(/[身長|T](\d{3})/)?.[1];
        const bust = str.match(/[Ｂ|B](\d{2,3})/)?.[1];
        const waist = str.match(/[Ｗ|W](\d{2,3})/)?.[1];
        const hips = str.match(/[Ｈ|H](\d{2,3})/)?.[1];
        if (actressUrl.includes('/star/')) return `[${year}][${height >= 168 ? '⭐' + height : height}][B${bust}-W${waist}-H${hips}]`;
        const ageText = calculateAge(year, releaseYear);
        return `[${year}][${ageText}][${height >= 168 ? '⭐' + height : height}][B${bust}-W${waist}-H${hips}]`;
    }

    let css = `
        .toast-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .toast-message {
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 10px 20px;
            border-radius: 4px;
            opacity: 0;
            transition: all 0.3s ease-in-out;
        }
    `;
    GM_addStyle(css);

    function showToast(message, duration = 3000) {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
        const toast = document.createElement('div');
        toast.className = 'toast-message';
        toast.textContent = message;
        container.appendChild(toast);
        requestAnimationFrame(() => {
            toast.style.opacity = '1';
        });
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                container.removeChild(toast);
                if (container.children.length === 0) {
                    document.body.removeChild(container);
                }
            }, 300);
        }, duration);
    }

})();