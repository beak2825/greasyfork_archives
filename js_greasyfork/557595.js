// ==UserScript==
// @name         豆瓣读书评分增强
// @namespace    https://okjk.co/VJQF62
// @version      0.9.1
// @description  在豆瓣读书页面添加Goodreads、Amazon和微信读书的评分
// @match        https://book.douban.com/subject/*
// @icon         https://img3.doubanio.com/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @author       moyuguy
// @homepage     https://github.com/moyuguy
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557595/%E8%B1%86%E7%93%A3%E8%AF%BB%E4%B9%A6%E8%AF%84%E5%88%86%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/557595/%E8%B1%86%E7%93%A3%E8%AF%BB%E4%B9%A6%E8%AF%84%E5%88%86%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let ISBN, bookTitle, originalTitle, author;
    let pendingRequests = 0;
    let allRequestsFailed = true;

    function init() {
        try {
            const infoElement = document.querySelector('#info');
            const titleElement = document.querySelector('h1');

            if (!infoElement || !titleElement) {
                throw new Error('无法找到包含信息的元素');
            }

            const isbnMatch = infoElement.textContent.match(/ISBN:\s*(\d+)/);
            ISBN = isbnMatch ? isbnMatch[1] : null;

            bookTitle = titleElement.textContent.trim();

            const originalTitleMatch = infoElement.textContent.match(/原作名:\s*(.+)/);
            originalTitle = originalTitleMatch ? originalTitleMatch[1].trim() : null;

            // 提取作者信息
            const authorSpan = Array.from(infoElement.querySelectorAll('span.pl')).find(span => 
                span.textContent.trim().includes('作者')
            );
            if (authorSpan) {
                const authorLink = authorSpan.nextElementSibling;
                if (authorLink && authorLink.tagName === 'A') {
                    author = authorLink.textContent.trim();
                } else {
                    const authorText = authorSpan.nextSibling ? authorSpan.nextSibling.textContent.trim() : '';
                    author = authorText ? authorText : null;
                }
            } else {
                throw new Error('无法找到作者信息');
            }

            // 检查所有必要信息是否都已提取
            const missingInfo = [];
            if (!ISBN) missingInfo.push('ISBN');
            if (!bookTitle) missingInfo.push('书名');
            if (!author) missingInfo.push('作者');

            if (missingInfo.length > 0) {
                throw new Error(`无法从元素中提取以下信息：${missingInfo.join('、')}`);
            }

            console.log('提取的图书信息:', { ISBN, bookTitle, originalTitle, author });

            const loadingSpan = document.createElement('span');
            loadingSpan.id = 'custom_rating_loading';
            loadingSpan.className = 'custom_rating';
            loadingSpan.textContent = '第三方评分加载中...';
            const targetElement = document.querySelector('#interest_sectl');
            if (targetElement) {
                targetElement.appendChild(loadingSpan);
            }

            fetchRating('Goodreads');
            fetchRating('Amazon');
            fetchRating('WeRead');
        } catch (error) {
            console.error('初始化错误:', error);
        }
    }

    function updateLoadingStatus() {
        pendingRequests--;
        if (pendingRequests === 0) {
            const loadingSpan = document.getElementById('custom_rating_loading');
            if (loadingSpan) {
                if (allRequestsFailed) {
                    loadingSpan.textContent = '暂未查到第三方评分';
                } else {
                    loadingSpan.remove();
                }
            }
        }
    }

    function fetchRating(platform) {
        console.log(`正在获取${platform}评分...`);
        pendingRequests++;

        let searchOrder;
        switch (platform) {
            case 'WeRead':
                searchOrder = [{ type: '书名', term: bookTitle }];
                break;
            case 'Goodreads':
                searchOrder = [
                    { type: 'ISBN', term: ISBN },
                    { type: '原作名', term: originalTitle },
                    { type: '书名', term: bookTitle }
                ];
                break;
            case 'Amazon':
                searchOrder = [
                    { type: 'ISBN', term: ISBN },
                    { type: '原作名', term: originalTitle },
                    { type: '书名作者', term: `${bookTitle} ${author}` }
                ];
                break;
        }

        function tryNextSearch(index) {
            if (index >= searchOrder.length) {
                console.error(`在${platform}上未找到匹配的书籍`);
                updateLoadingStatus();
                return;
            }

            const { type, term } = searchOrder[index];
            if (!term) {
                tryNextSearch(index + 1);
                return;
            }

            console.log(`在${platform}上使用${type}搜索: ${term}`);
            performSearch(platform, term, type, (success) => {
                if (!success) tryNextSearch(index + 1);
            });
        }

        tryNextSearch(0);
    }

    function performSearch(platform, term, searchType, callback) {
        const urls = {
            Goodreads: `https://www.goodreads.com/search?q=${encodeURIComponent(term)}`,
            Amazon: `https://www.amazon.com/s?k=${encodeURIComponent(term)}`,
            WeRead: `https://weread.qq.com/web/search/global?keyword=${encodeURIComponent(term)}`
        };

        const requestConfig = {
            method: "GET",
            url: urls[platform],
            onload: function(response) {
                console.log(`${platform}请求成功，状态码:`, response.status);
                try {
                    switch(platform) {
                        case 'Goodreads':
                            handleGoodreadsSearch(response, callback);
                            break;
                        case 'Amazon':
                            handleAmazonSearch(response, callback, searchType);
                            break;
                        case 'WeRead':
                            handleWeReadSearch(response, callback);
                            break;
                    }
                } catch (error) {
                    console.error(`处理${platform}搜索结果时出错:`, error);
                    callback(false);
                }
            },
            onerror: function(error) {
                console.error(`获取${platform}评分失败:`, error);
                callback(false);
            }
        };

        // 为微信读书和Amazon添加特殊的请求头
        if (platform === 'WeRead') {
            requestConfig.headers = {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Referer': 'https://weread.qq.com/',
                'Accept': 'application/json, text/plain, */*',
                'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
            };
        } else if (platform === 'Amazon') {
            requestConfig.headers = {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Accept-Encoding': 'gzip, deflate, br',
                'DNT': '1',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1'
            };
        }

        GM_xmlhttpRequest(requestConfig);
    }

    function handleGoodreadsSearch(response, callback) {
        if (response.finalUrl.includes('/book/show/')) {
            parseGoodreadsPage(response.responseText, response.finalUrl);
            callback(true);
        } else {
            const parser = new DOMParser();
            const doc = parser.parseFromString(response.responseText, "text/html");
            const bookLink = doc.querySelector('a.bookTitle');
            if (bookLink) {
                const bookUrl = 'https://www.goodreads.com' + bookLink.getAttribute('href');
                GM_xmlhttpRequest({
                    method: "GET",
                    url: bookUrl,
                    onload: function(bookResponse) {
                        parseGoodreadsPage(bookResponse.responseText, bookUrl);
                        callback(true);
                    }
                });
            } else {
                callback(false);
            }
        }
    }

    function handleAmazonSearch(response, callback, searchType) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(response.responseText, "text/html");

        const noResultsElement = doc.querySelector('.s-no-outline');
        if (noResultsElement && noResultsElement.textContent.includes('No results for')) {
            console.log('Amazon搜索无结果');
            callback(false);
            return;
        }

        // 使用新的选择器查找搜索结果
        const results = doc.querySelectorAll('[data-component-type="s-search-result"]');
        console.log(`Amazon找到 ${results.length} 个搜索结果`);
        
        for (let result of results) {
            // 更新标题选择器
            const titleElement = result.querySelector('h2 span');
            
            // 更新作者选择器 - 查找包含 'by ' 的文本
            let resultAuthor = '';
            const authorSpans = result.querySelectorAll('.a-size-base');
            for (let span of authorSpans) {
                if (span.textContent.includes('by ')) {
                    const authorText = span.parentElement.textContent;
                    const byIndex = authorText.indexOf('by ');
                    if (byIndex !== -1) {
                        resultAuthor = authorText.substring(byIndex + 3).trim();
                        // 清理作者信息，移除日期等额外信息
                        resultAuthor = resultAuthor.split('|')[0].trim();
                        break;
                    }
                }
            }
            
            if (titleElement && (searchType === 'ISBN' || resultAuthor)) {
                const resultTitle = titleElement.textContent.trim();
                console.log(`Amazon检查书籍: "${resultTitle}" 作者: "${resultAuthor}"`);
                
                if (isMatchingBook(resultTitle, resultAuthor, searchType)) {
                    // 获取书籍链接
                    const linkElement = result.querySelector('h2 a') || result.querySelector('a[href*="/dp/"]');
                    if (linkElement) {
                        let bookLink = linkElement.getAttribute('href');
                        // 确保链接是完整的Amazon URL
                        if (bookLink.startsWith('/')) {
                            bookLink = 'https://www.amazon.com' + bookLink;
                        } else if (!bookLink.startsWith('http')) {
                            bookLink = 'https://www.amazon.com/' + bookLink;
                        }
                        // 如果链接不是Amazon域名，跳过
                        if (!bookLink.includes('amazon.com')) {
                            console.log('跳过非Amazon链接:', bookLink);
                            continue;
                        }
                        console.log(`Amazon找到匹配书籍，链接: ${bookLink}`);
                        fetchAmazonRatingFromLink(bookLink);
                        callback(true);
                        return;
                    }
                }
            }
        }
        console.log('Amazon搜索未找到匹配结果');
        callback(false);
    }

    function handleWeReadSearch(response, callback) {
        try {
            const data = JSON.parse(response.responseText);
            console.log('微信读书搜索返回数据:', data);
            
            const books = data.books;
            if (books && books.length > 0) {
                console.log('找到书籍数量:', books.length);
                console.log('搜索的书名:', bookTitle);
                
                const matchedBook = findMatchingBook(books);
                if (matchedBook) {
                    console.log('匹配到的书籍:', matchedBook.bookInfo.title);
                    const book = matchedBook.bookInfo;
                    const ratingPercentage = book.newRating ? (book.newRating / 10).toFixed(1) + '%' : 'N/A';
                    const ratingCount = book.newRatingCount || 0;
                    addRating('微信读书', ratingPercentage, ratingCount, `https://weread.qq.com/web/search/books?keyword=${encodeURIComponent(bookTitle)}`, true);
                    callback(true);
                } else {
                    console.log('未找到匹配的书籍，尝试使用第一个结果');
                    // 如果精确匹配失败，尝试使用第一个搜索结果
                    const firstBook = books[0].bookInfo;
                    const ratingPercentage = firstBook.newRating ? (firstBook.newRating / 10).toFixed(1) + '%' : 'N/A';
                    const ratingCount = firstBook.newRatingCount || 0;
                    addRating('微信读书', ratingPercentage, ratingCount, `https://weread.qq.com/web/search/books?keyword=${encodeURIComponent(bookTitle)}`, true);
                    callback(true);
                }
            } else {
                console.log('微信读书搜索无结果');
                callback(false);
            }
        } catch (error) {
            console.error('处理微信读书搜索结果时出错:', error);
            callback(false);
        }
    }

    function isMatchingBook(resultTitle, resultAuthor, searchType) {
        const cleanStr = (s) => s.toLowerCase().replace(/[^\w\s]/g, '');
        const cleanResultTitle = cleanStr(resultTitle);
        const cleanResultAuthor = cleanStr(resultAuthor);
        
        console.log(`匹配检查 - 搜索类型: ${searchType}`);
        console.log(`结果标题: "${cleanResultTitle}"`);
        console.log(`结果作者: "${cleanResultAuthor}"`);
        
        switch (searchType) {
            case 'ISBN':
                const cleanISBN = cleanStr(ISBN);
                console.log(`ISBN匹配检查: "${cleanISBN}"`);
                return cleanResultTitle.includes(cleanISBN);
            case '原作名':
                const cleanOriginalTitle = cleanStr(originalTitle);
                console.log(`原作名匹配检查: "${cleanOriginalTitle}"`);
                // 修复原作名匹配逻辑：检查结果标题是否包含在原作名中，或者原作名的主要部分是否包含在结果标题中
                const isResultInOriginal = cleanOriginalTitle.includes(cleanResultTitle);
                const isOriginalInResult = cleanResultTitle.includes(cleanOriginalTitle);
                // 提取原作名的主要部分（冒号前的部分）
                const mainTitle = cleanOriginalTitle.split(' ').slice(0, 4).join(' '); // 取前4个词作为主要标题
                const isMainTitleMatch = cleanResultTitle.includes(mainTitle) || mainTitle.includes(cleanResultTitle);
                console.log(`匹配结果: isResultInOriginal=${isResultInOriginal}, isOriginalInResult=${isOriginalInResult}, isMainTitleMatch=${isMainTitleMatch}`);
                return isResultInOriginal || isOriginalInResult || isMainTitleMatch;
            case '书名作者':
                const cleanBookTitle = cleanStr(bookTitle);
                const cleanAuthor = cleanStr(author);
                console.log(`书名作者匹配检查: 书名="${cleanBookTitle}", 作者="${cleanAuthor}"`);
                const titleMatch = cleanResultTitle.includes(cleanBookTitle);
                const authorMatch = cleanResultAuthor.includes(cleanAuthor);
                console.log(`匹配结果: titleMatch=${titleMatch}, authorMatch=${authorMatch}`);
                return titleMatch && authorMatch;
            default:
                return false;
        }
    }

    function parseGoodreadsPage(html, url) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const ratingElement = doc.querySelector('.RatingStatistics__rating');
        const countElement = doc.querySelector('[data-testid="ratingsCount"]');

        if (!ratingElement || !countElement) {
            throw new Error('无法在Goodreads页面找到评分元素');
        }

        const rating = ratingElement.textContent.trim();
        const count = countElement.textContent.trim().replace(/,/g, '').replace(/\s+ratings$/, '');
        addRating('Goodreads', rating, count, url);
    }

    function fetchAmazonRatingFromLink(link) {
        GM_xmlhttpRequest({
            method: "GET",
            url: link,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Accept-Encoding': 'gzip, deflate, br',
                'DNT': '1',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1'
            },
            onload: function(response) {
                try {
                    console.log('Amazon评分页面请求成功，状态码:', response.status);
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, "text/html");
                    
                    // 尝试多种评分选择器
                    let ratingElement = doc.querySelector('[data-hook="rating-out-of-text"]');
                    if (!ratingElement) {
                        // 备用选择器：查找包含评分的星级元素
                        const starElement = doc.querySelector('.a-icon-alt');
                        if (starElement && starElement.textContent.includes('out of 5 stars')) {
                            ratingElement = starElement;
                        }
                    }
                    
                    // 尝试多种评论数量选择器
                    let reviewCountElement = doc.querySelector('#acrCustomerReviewText');
                    if (!reviewCountElement) {
                        // 备用选择器
                        reviewCountElement = doc.querySelector('[data-hook="total-review-count"]');
                    }
                    if (!reviewCountElement) {
                        // 再次备用：查找包含"ratings"的文本
                        const elements = doc.querySelectorAll('.a-size-base');
                        for (let el of elements) {
                            if (el.textContent.includes('ratings') || el.textContent.includes('reviews')) {
                                reviewCountElement = el;
                                break;
                            }
                        }
                    }

                    if (!ratingElement) {
                        console.log('Amazon页面HTML片段:', response.responseText.substring(0, 1000));
                        throw new Error('无法在Amazon页面找到评分元素');
                    }

                    // 提取评分
                    let rating;
                    const ratingText = ratingElement.textContent.trim();
                    if (ratingText.includes('out of 5')) {
                        rating = ratingText.split(' ')[0];
                    } else {
                        rating = ratingText;
                    }
                    
                    // 提取评论数量
                    let reviewCount = 'N/A';
                    if (reviewCountElement) {
                        const countText = reviewCountElement.textContent.trim();
                        const match = countText.match(/([\d,]+)/);
                        if (match) {
                            reviewCount = match[1].replace(/,/g, '');
                        }
                    }
                    
                    console.log('Amazon评分提取成功:', rating, '评论数:', reviewCount);
                    addRating('Amazon', rating, reviewCount, link);
                } catch (error) {
                    console.error('处理Amazon评分时出错:', error);
                    updateLoadingStatus();
                }
            },
            onerror: function(error) {
                console.error('获取Amazon评分失败:', error);
                updateLoadingStatus();
            }
        });
    }

    function findMatchingBook(books) {
        const cleanTitle = (title) => title.toLowerCase().replace(/[^\w\s\u4e00-\u9fff]/g, "").replace(/\s+/g, " ").trim();
        const cleanBookTitle = cleanTitle(bookTitle);
        const cleanOriginalTitle = originalTitle ? cleanTitle(originalTitle) : null;
        const cleanAuthor = author ? cleanTitle(author) : null;

        console.log('清理后的搜索书名:', cleanBookTitle);
        console.log('清理后的原作名:', cleanOriginalTitle);
        console.log('清理后的作者:', cleanAuthor);

        // 首先尝试精确匹配
        let matchedBook = books.find(book => {
            const cleanBookInfoTitle = cleanTitle(book.bookInfo.title);
            const cleanBookInfoAuthor = book.bookInfo.author ? cleanTitle(book.bookInfo.author) : null;
            
            console.log('比较书籍:', cleanBookInfoTitle, '作者:', cleanBookInfoAuthor);
            
            // 精确匹配书名
            if (cleanBookInfoTitle === cleanBookTitle) {
                return true;
            }
            
            // 精确匹配原作名
            if (cleanOriginalTitle && cleanBookInfoTitle === cleanOriginalTitle) {
                return true;
            }
            
            return false;
        });

        // 如果精确匹配失败，尝试部分匹配
        if (!matchedBook) {
            console.log('精确匹配失败，尝试部分匹配');
            matchedBook = books.find(book => {
                const cleanBookInfoTitle = cleanTitle(book.bookInfo.title);
                const cleanBookInfoAuthor = book.bookInfo.author ? cleanTitle(book.bookInfo.author) : null;
                
                // 书名包含匹配
                if (cleanBookInfoTitle.includes(cleanBookTitle) || cleanBookTitle.includes(cleanBookInfoTitle)) {
                    // 如果有作者信息，也要匹配作者
                    if (cleanAuthor && cleanBookInfoAuthor) {
                        return cleanBookInfoAuthor.includes(cleanAuthor) || cleanAuthor.includes(cleanBookInfoAuthor);
                    }
                    return true;
                }
                
                // 原作名包含匹配
                if (cleanOriginalTitle && (cleanBookInfoTitle.includes(cleanOriginalTitle) || cleanOriginalTitle.includes(cleanBookInfoTitle))) {
                    if (cleanAuthor && cleanBookInfoAuthor) {
                        return cleanBookInfoAuthor.includes(cleanAuthor) || cleanAuthor.includes(cleanBookInfoAuthor);
                    }
                    return true;
                }
                
                return false;
            });
        }

        if (matchedBook) {
            console.log('找到匹配书籍:', matchedBook.bookInfo.title);
        } else {
            console.log('未找到匹配书籍');
        }

        return matchedBook;
    }

    function addRating(site, rating, ratingCount, url, isPercentage = false) {
        try {
            allRequestsFailed = false;
            const ratingSpan = document.createElement('span');
            ratingSpan.className = 'custom_rating';
            const tooltipText = isPercentage ? `推荐值 ${rating} ${ratingCount}人评价` : `${rating}/5.0 ${ratingCount}人评价`;
            ratingSpan.innerHTML = `
                <span class="rating_wrapper">
                    <a href="${url}" target="_blank" class="site_name" data-tooltip="${tooltipText}">${site}</a>
                    <span class="custom_rating_num" data-tooltip="${tooltipText}">${rating}</span>
                </span>
            `;

            const targetElement = document.querySelector('#interest_sectl');
            if (!targetElement) {
                throw new Error('无法找到目标元素来插入评分');
            }
            targetElement.appendChild(ratingSpan);
        } catch (error) {
            console.error(`添加 ${site} 评分时出错:`, error);
        } finally {
            updateLoadingStatus();
        }
    }

    function addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .custom_rating {
                display: block;
                margin-bottom: 5px;
                font-size: 12px;
            }
            .rating_wrapper {
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 100%;
            }
            .custom_rating .site_name {
                color: #37a;
                text-decoration: none;
                transition: color 0.3s ease, background-color 0.3s ease;
                border-radius: 3px;
            }
            .custom_rating .site_name:hover {
                color: #fff;
                background-color: #37a;
            }
            .custom_rating .custom_rating_num {
                color: #333;
                font-weight: bold;
            }
            [data-tooltip] {
                position: relative;
            }
            [data-tooltip]:hover::after {
                content: attr(data-tooltip);
                position: absolute;
                bottom: 100%;
                left: 50%;
                transform: translateX(-50%);
                background-color: #333;
                color: #fff;
                padding: 5px 10px;
                border-radius: 4px;
                font-size: 14px;
                white-space: nowrap;
                z-index: 1000;
                margin-bottom: 5px;
            }
        `;
        document.head.appendChild(style);
    }

    window.addEventListener('load', init);
    addStyles();
})();