// ==UserScript==
// @name         提取文章信息
// @namespace    http://tampermonkey.net/
// @version      0.5
// @author       reynoldxu
// @description  提取文章的信息
// @match        https://webofscience.clarivate.cn/wos/*
// @grant        GM_xmlhttpRequest
// @connect      365.kdocs.cn
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552543/%E6%8F%90%E5%8F%96%E6%96%87%E7%AB%A0%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/552543/%E6%8F%90%E5%8F%96%E6%96%87%E7%AB%A0%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 定义全局JSON数据变量：移除计数器字段
    let globalJsonData = {
        是否Artical: null, // 初始用null表示“未检查”，后续赋值为true/false（布尔类型）
        论文类型列表: [],
        出版日期: null,
        出版年份: null,
        ISSN信息: { // 新增ISSN信息字段，与extractISSN()同步
            ISSN: '',
            eISSN: ''
        }
    };
    const unitAliasMap = {
        'Shanghai Normal University': '上海师范大学',
        'Tongji University': '同济大学',
        'Donghua University': '东华大学'
    };

    // 存储上一次的数据用于比较是否变化
    let lastData = "";

    // 创建标签元素 - 带Tab和复制按钮的容器
    const createLabel = () => {
        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            bottom: 10px;
            left: 10px;
            font-size: 24px;//此处修改字体大小
            background-color: white;
            color: black;
            padding: 10px;
            z-index: 999999;
            margin: 0;
            border: 2px solid red;
            display: flex;
            align-items: flex-start;
            max-width: 80vw;
            max-height: 70vh;
        `;

        const tabContainer = document.createElement('div');
        tabContainer.style.cssText = `
            border: 1px solid #ccc;
            display: inline-flex;
            flex-direction: column;
            flex: 1;
            overflow: hidden;
        `;

        const tabHeader = document.createElement('div');
        tabHeader.style.cssText = `
            display: flex;
            border-bottom: 1px solid #ccc;
        `;

        // 原有标签
        const articleTab = document.createElement('div');
        articleTab.textContent = '文章信息';
        articleTab.style.cssText = `
            padding: 5px 10px;
            background-color: #e0e0e0;
            border-right: 1px solid #ccc;
            cursor: pointer;
        `;
        articleTab.dataset.tab = 'article';

        const jsonTab = document.createElement('div');
        jsonTab.textContent = 'Json';
        jsonTab.style.cssText = `
            padding: 5px 10px;
            background-color: #ffffff;
            border-right: 1px solid #ccc;
            cursor: pointer;
        `;
        jsonTab.dataset.tab = 'json';

        // 新增Token标签
        const tokenTab = document.createElement('div');
        tokenTab.textContent = 'Token设置';
        tokenTab.style.cssText = `
            padding: 5px 10px;
            background-color: #ffffff;
            cursor: pointer;
        `;
        tokenTab.dataset.tab = 'token';

        const tabContent = document.createElement('div');
        tabContent.style.cssText = `
            min-height: 1em;
            padding: 5px;
            overflow: auto;
            flex: 1;
            background-color: white;
        `;

        // 原有内容
        const articleContent = document.createElement('div');
        articleContent.dataset.content = 'article';
        articleContent.innerHTML = '准备中...';
        articleContent.style.overflow = 'auto';

        const jsonContent = document.createElement('div');
        jsonContent.dataset.content = 'json';
        jsonContent.innerHTML = JSON.stringify(globalJsonData, null, 2);
        jsonContent.style.display = 'none';
        jsonContent.style.whiteSpace = 'pre-wrap'; // 自动换行
        jsonContent.style.fontFamily = 'monospace'; // 使用等宽字体
        jsonContent.style.overflow = 'auto';

        // 新增Token内容区域
        const tokenContent = document.createElement('div');
        tokenContent.dataset.content = 'token';
        tokenContent.style.display = 'none';
        tokenContent.style.padding = '10px';

        // Token输入框
        const tokenInput = document.createElement('input');
        tokenInput.type = 'text';
        tokenInput.placeholder = '请输入API Token';
        tokenInput.style.width = '300px';
        tokenInput.style.marginRight = '10px';
        tokenInput.style.padding = '5px';

        // 保存按钮
        const saveTokenBtn = document.createElement('button');
        saveTokenBtn.textContent = '保存Token';
        saveTokenBtn.style.padding = '5px 10px';
        saveTokenBtn.addEventListener('click', () => {
            const token = tokenInput.value.trim();
            if (token) {
                setCookie('apiToken', token, 365);
                saveTokenBtn.textContent = '已保存!';
                setTimeout(() => saveTokenBtn.textContent = '保存Token', 1500);
            }
        });

        // 组装Token内容
        tokenContent.appendChild(tokenInput);
        tokenContent.appendChild(saveTokenBtn);

        const copyBtn = document.createElement('button');
        copyBtn.textContent = '复制';
        copyBtn.style.cssText = `
            margin-left: 10px;
            padding: 5px 10px;
            cursor: pointer;
            white-space: nowrap;
            align-self: flex-start;
        `;
        copyBtn.addEventListener('click', () => {
            const activeContent = tabContent.querySelector('div[data-content]:not([style*="display: none"])');
            const text = activeContent.textContent;
            navigator.clipboard.writeText(text).then(() => {
                const originalText = copyBtn.textContent;
                copyBtn.textContent = '已复制!';
                setTimeout(() => copyBtn.textContent = originalText, 1000);
            });
        });

        // Tab切换逻辑
        [articleTab, jsonTab, tokenTab].forEach(tab => {
            tab.addEventListener('click', () => {
                [articleTab, jsonTab, tokenTab].forEach(t => {
                    t.style.backgroundColor = t === tab ? '#e0e0e0' : '#ffffff';
                });
                [articleContent, jsonContent, tokenContent].forEach(content => {
                    content.style.display = content.dataset.content === tab.dataset.tab ? 'block' : 'none';
                });
                // 切换时调整高度
                adjustHeight();
            });
        });

        // 调整内容区域高度
        function adjustHeight() {
            const activeContent = tabContent.querySelector('div[data-content]:not([style*="display: none"])');
            if (activeContent) {
                // 基于内容自动调整高度
                activeContent.style.height = 'auto';
                const contentHeight = activeContent.scrollHeight;
                // 限制最大高度为容器的70%
                const maxHeight = Math.floor(tabContainer.offsetHeight * 0.7);
                activeContent.style.height = `${Math.min(contentHeight, maxHeight)}px`;
            }
        }

        // 组装元素
        tabHeader.appendChild(articleTab);
        tabHeader.appendChild(jsonTab);
        tabHeader.appendChild(tokenTab);
        tabContent.appendChild(articleContent);
        tabContent.appendChild(jsonContent);
        tabContent.appendChild(tokenContent);
        tabContainer.appendChild(tabHeader);
        tabContainer.appendChild(tabContent);
        container.appendChild(tabContainer);
        container.appendChild(copyBtn);

        // 暴露引用
        container.articleContent = articleContent;
        container.jsonContent = jsonContent;
        container.tokenInput = tokenInput;
        container.adjustHeight = adjustHeight;

        return container;
    };

    // 添加Cookie操作工具函数
    function setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + encodeURIComponent(value) + ";" + expires + ";path=/";
    }

    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
        }
        return null;
    }

    // 等待DOM结构就绪（无需等待资源加载完成）
    function waitForDOM() {
        return new Promise(resolve => {
            // 若DOM已就绪（interactive或complete状态），直接执行
            if (document.readyState === 'interactive' || document.readyState === 'complete') {
                resolve();
            } else {
                // 监听DOMContentLoaded事件（DOM解析完成时触发）
                window.addEventListener('DOMContentLoaded', resolve);
                // 兼容旧浏览器：若DOMContentLoaded未触发，超时后强制执行（5秒）
                setTimeout(resolve, 5000);
            }
        });
    }

    // 主逻辑
    async function main() {
        await waitForDOM();

        const displayLabel = createLabel();
        const container = document.body || document.documentElement;
        container.appendChild(displayLabel);

        let counter = 0;
        let isFenqu = false;
        let fenquText = '';
        let hasFenquCalled = false; // 新增：分区查询执行标记（默认未执行）

        // 初始化显示：先执行同步函数，异步函数初始显示"加载中"
        const initArticleResult = checkIsArticle();
        displayLabel.articleContent.innerHTML = `计数器: ${counter}<br>`;

        // 每秒更新（改为async函数，支持await异步函数）
        const timer = setInterval(async () =>
        {
            counter++;
            //globalJsonData.计数器 = counter; // 更新全局计数器

            // 1. 执行所有同步函数（直接获取结果）
            const [isArticle, articleText] = checkIsArticle();
            const [isDate, dateText] = getPublishedDateText(); // 出版日期是否成功
            const [isAffiliation, affiliationText] = getFirstAffiliation();
            const [isAuthorCount, authorCountText] = getAuthorCountText();
            const [isCorresponding, correspondingText] = getCorrespondingAuthorAndAddr();
            const [issnSuccess, issnText] = getISSN();
            //console.log('ISSN数据：', issnSuccess,issnText);
            const [eissnSuccess, eissnText] = geteISSN();
            //console.log('eISSN数据：', eissnSuccess,eissnText);

            //console.log(articleText);
            //console.log(dateText);
            //console.log(affiliationText);
            //console.log(authorCountText);
            //console.log(correspondingText);
            //console.log(issnText);

            // 2. 仅当：① 未执行过分区查询 + ② ISSN和出版日期都成功时，才执行（仅一次）
            if (!hasFenquCalled && isDate && (issnSuccess || eissnSuccess))
            {
                [isFenqu, fenquText] = await getZKYfenqu();
                hasFenquCalled = true; // 执行后标记为"已执行"，后续不再调用
                //console.log('分区查询已执行，结果：', { isFenqu, fenquText });
            }

            // 3. 收集所有成功的文本（仅返回true时追加）
            const successTexts = [];
            successTexts.push(articleText);
            successTexts.push(dateText);
            successTexts.push(affiliationText);
            successTexts.push(authorCountText);
            successTexts.push(correspondingText);
            if (issnSuccess) successTexts.push(issnText);
            //successTexts.push(issnText);
            if (eissnSuccess) successTexts.push(eissnText);
            //if (isFenqu) successTexts.push(fenquText); // 仅当分区查询成功时追加
            successTexts.push(fenquText);

            // 4. 拼接显示内容（空数组时显示"暂无有效数据"）
            const content = successTexts.length > 0
            ? `${successTexts.join('; ')}`
            : `计数器: ${counter}<br><span style="color: #999;">暂无有效数据</span>`;

            if(lastData !== content)
            {
                displayLabel.articleContent.innerHTML = content;
                displayLabel.jsonContent.innerHTML = JSON.stringify(globalJsonData, null, 2); // 同步JSON显示
                lastData = content; // 更新上次内容
            }


        }, 500);

        // 页面卸载前清理定时器
        window.addEventListener('beforeunload', () => clearInterval(timer));
    }



    //========================================================================================以下为解析函数========
    //========解析部分：检查是否为Article并更新全局JSON========
    function checkIsArticle() {
        try
        {
            // 1. 定位文档类型容器
            const docTypeContainer = document.querySelector('div.source-info-piece:has(h3[data-ta="FullRTa-doctypeLabel"])');
            if (!docTypeContainer) {
                // 无容器：标记为false，清空类型列表
                globalJsonData.是否Artical = false;
                globalJsonData.论文类型列表 = [];
                return [false, '<span style="color: red;">无Artical容器</span>'];
            }

            // 2. 获取文档类型标签
            const docTypeSpans = docTypeContainer.querySelectorAll('span[data-ta^="FullRTa-doctype-0"].value.section-label-data');
            if (docTypeSpans.length === 0) {
                // 无类型数据：标记为false，清空列表
                globalJsonData.是否Artical = false;
                globalJsonData.论文类型列表 = [];
                return [false, '<span style="color: red;">无Artical数据</span>'];
            }

            // 3. 提取并去重论文类型
            const allDocTypes = Array.from(docTypeSpans)
            .map(span => span.textContent.trim())
            .filter(type => type) // 过滤空文本
            .filter((type, index, self) => self.indexOf(type) === index); // 去重

            // 4. 判断是否为Article（不区分大小写）
            const isArticle = allDocTypes.some(type => type.toLowerCase().includes('article'));

            // 5. 更新全局JSON（统一布尔类型）
            globalJsonData.是否Artical = isArticle;
            globalJsonData.论文类型列表 = allDocTypes; // 修复字段名不一致问题

            // 6. 返回结果：[是否成功（布尔值）, 提示内容（字符串）]
            // 这里的"成功"定义为：正常获取到类型数据并完成判断（无论是否为Article）
            return [isArticle, isArticle
                    ? '<span style="color: green;">Artical</span>'
                    : `<span style="color: red;">(${allDocTypes.join('、')})</span>`
                   ];

        } catch (error)
        {
            // 异常情况：标记为false，清空列表，返回失败状态
            console.error('检查文档类型出错：', error);
            globalJsonData.是否Artical = false;
            globalJsonData.论文类型列表 = [];
            return [false, `<span style="color: red;">Artical报错：${error.message}</span>`];
            //return [false, `<span style="color: red;">Artical报错</span>`];
        }
    }

    // 获取Published日期信息，支持“月年”“月日年”格式
   function getPublishedDateText() {
       try {
           // 1. 月份缩写映射表（覆盖英文全/半缩写，不区分大小写）
           const monthMap = {
               'jan': '01', 'feb': '02', 'mar': '03', 'apr': '04',
               'may': '05', 'jun': '06', 'jul': '07', 'aug': '08',
               'sep': '09', 'sept': '09', // 兼容“sep”和“sept”两种缩写
               'oct': '10', 'nov': '11', 'dec': '12'
           };

           // 2. 定位Published容器（修复点：用JS判断文本，替代:contains选择器）
           let publishedContainer = null;
           // 先尝试精准匹配data-ta属性
           const preciseContainer = document.querySelector('div.source-info-piece:has(h3[data-ta="FullRTa-publishedLabel"])');
           if (preciseContainer) {
               publishedContainer = preciseContainer;
           } else {
               // 兜底：遍历所有可能的容器，用JS判断h3文本是否包含"Published"
               const candidateContainers = document.querySelectorAll('div.source-info-piece');
               for (const container of candidateContainers) {
                   const h3 = container.querySelector('h3');
                   if (h3 && h3.textContent.trim().toLowerCase().includes('published')) {
                       publishedContainer = container;
                       break;
                   }
               }
           }

           if (!publishedContainer) {
               globalJsonData.出版日期 = null;
               return [false, '<span style="color: red;">无Published容器</span>'];
           }

           // 3. 精准获取日期元素（冗余选择器：先data-ta精准匹配，失败则按class匹配）
           const dateElement = publishedContainer.querySelector('span[data-ta="FullRTa-pubdate"].value.section-label-data')
           || publishedContainer.querySelector('span.value.section-label-data[name="pubdate"]'); // 兜底：按name属性匹配
           if (!dateElement) {
               globalJsonData.出版日期 = null;
               return [false, '<span style="color: red;">无Published数据</span>'];
           }

           // 4. 提取并清理原始日期文本（去空格、转小写，兼容特殊字符）
           const rawDate = dateElement.textContent.trim().toLowerCase().replace(/[^a-z0-9\s]/g, ''); // 过滤非字母/数字/空格字符
           if (!rawDate) {
               globalJsonData.出版日期 = null;
               return [false, '<span style="color: orange;">Published为空</span>'];
           }

           // 5. 核心：多格式解析（按空格分割，判断是“月年”还是“月日年”）
           const dateParts = rawDate.split(/\s+/).filter(part => part); // 分割+过滤空片段
           let monthAbbr, dayStr = '01', yearStr; // 日默认01，适配“月年”格式

           // 按片段长度判断格式
           if (dateParts.length === 2) {
               // 格式1：月 年（如“feb 2023”）
               [monthAbbr, yearStr] = dateParts;
           } else if (dateParts.length === 3) {
               // 格式2：月 日 年（如“feb 1 2023”）
               [monthAbbr, dayStr, yearStr] = dateParts;
               // 日格式校验+补零（如“1”→“01”，“01”保持不变）
               const day = parseInt(dayStr, 10);
               if (isNaN(day) || day < 1 || day > 31) { // 排除无效日期（如32日）
                   globalJsonData.出版日期 = `日期异常: ${rawDate}（日需1-31）`;
                   return [false, `<span style="color: orange;">日期异常（日需1-31）：${dayStr}</span>`];
               }
               dayStr = day.toString().padStart(2, '0'); // 补零为2位
           } else {
               // 格式异常（片段长度≠2/3）
               globalJsonData.出版日期 = `原始格式异常: ${rawDate}`;
               return [false, `<span style="color: orange;">日期格式异常（需“月年”或“月日年”）：${rawDate}</span>`];
           }

           // 6. 年份校验（需4位数字，兼容“23”→“2023”的简写场景）
           let year = parseInt(yearStr, 10);
           if (isNaN(year)) {
               globalJsonData.出版日期 = `年份异常: ${rawDate}`;
               return [false, `<span style="color: orange;">年份异常（需数字）：${yearStr}</span>`];
           }
           // 处理2位年份（如“23”→“2023”，“99”→“1999”，可按需调整规则）
           if (yearStr.length === 2) {
               year = year >= 50 ? 1900 + year : 2000 + year;
           }
           yearStr = year.toString();
           if (yearStr.length !== 4) { // 确保最终为4位年份
               globalJsonData.出版日期 = `年份异常: ${rawDate}`;
               return [false, `<span style="color: orange;">年份异常（需4位数字）：${yearStr}</span>`];
           }

           // 7. 月份校验（匹配映射表，支持全/半缩写）
           const monthNum = monthMap[monthAbbr];
           if (!monthNum) {
               globalJsonData.出版日期 = `月份缩写异常: ${rawDate}`;
               return [false, `<span style="color: orange;">月份缩写异常（如JAN/FEB）：${monthAbbr}</span>`];
           }

           // 8. 统一格式为“年-月-日”（最终标准化）
           const standardDate = `${yearStr}-${monthNum}-${dayStr}`;
           globalJsonData.出版年份 = yearStr;
           globalJsonData.出版日期 = standardDate;

           // 9. 返回成功结果：[true, 标准化日期文本]
           return [true, `<span style="color: green;">${standardDate}</span>`];

       } catch (error) {
           // 全局异常捕获（兜底处理所有未预料错误）
           console.error('获取Published日期出错：', error);
           globalJsonData.出版日期 = `获取失败: ${error.message}`;
           return [false, `<span style="color: red;">Published报错：${error.message}</span>`];
       }
   }

    // 提取第一单位信息（仅依赖data-ta属性匹配，忽略易变class）
    function getFirstAffiliation() {
        try {
            // 1. 定位最外层app标签（忽略动态_ngcontent属性）
            const appOuterContainer = document.querySelector('app-full-record-addresses-data');
            //console.log("appOuterContainer",appOuterContainer);
            if (!appOuterContainer) {
                globalJsonData.第一单位 = null;
                return [false, '<span style="color: red;">无第一单位1</span>'];
            }

            // 2. 定位单位信息父容器（仅依赖核心class，保留稳定性）
            const authorInfoSection = appOuterContainer.querySelector('div.author-info-section.ng-star-inserted');
            if (!authorInfoSection) {
                globalJsonData.第一单位 = null;
                return [false, '<span style="color: red;">无第一单位2</span>'];
            }

            // 3. 核心：仅通过data-ta精准匹配第一单位（完全忽略易变的class）
            // 选择器逻辑：div标签 + 固定的data-ta属性，不依赖任何class
            const firstUnitElement = authorInfoSection.querySelector(
                'a[data-ta="FRAOrgTa-RepOrgEnhancedName-addresses-0-0"]'
            );
            //console.log("firstUnitElement",firstUnitElement);

            // 兼容处理：若精准匹配失败，尝试前缀匹配（防止data-ta后缀微小变化）
            const targetUnitElement = firstUnitElement || authorInfoSection.querySelector(
                'a[data-ta^="FRAOrgTa-RepOrgEnhancedName-addresses-0-"]'
            );

            if (!targetUnitElement) {
                // 调试日志：打印所有含目标前缀的data-ta，便于定位结构变化
                const allCandidateUnits = Array.from(
                    authorInfoSection.querySelectorAll('a[data-ta^="FRAOrgTa-RepOrgEnhancedName-addresses-"]')
                ).map(el => ({
                    dataTa: el.getAttribute('data-ta'),
                    text: el.textContent.trim()
                }));
                console.log('所有单位候选（含目标前缀）：', allCandidateUnits);

                globalJsonData.第一单位 = null;
                return [false, '<span style="color: orange;">无第一单位3</span>'];
            }

            // 4. 提取并处理单位名称
            let firstUnitName = targetUnitElement.textContent.trim();
            // 单位别名映射（可按需扩展）
            firstUnitName = unitAliasMap[firstUnitName] || firstUnitName;

            // 5. 同步更新全局JSON
            globalJsonData.第一单位 = firstUnitName;

            // 6. 根据第一单位名称判断样式，返回成功结果
            if (firstUnitName === '上海师范大学') {
                return [true, `<span style="color: green;">一单:${firstUnitName}</span>`];
            } else {
                return [true, `<span style="color: red;">一单:${firstUnitName}</span>`];
            }
        } catch (error) {
            console.error('提取第一单位出错：', error);
            globalJsonData.第一单位 = `获取失败: ${error.message}`;
            return [false, `<span style="color: red;">第一单位：提取错误 - ${error.message}</span>`];
        }
    }

    // 计算作者数量并生成文字描述（同步全局JSON）
    function getAuthorCountText() {
        try {
            // 1. 定位作者信息主容器（核心容器，id固定）
            const mainDiv = document.getElementById('SumAuthTa-MainDiv-author-en');
            if (!mainDiv) {
                globalJsonData.作者总数 = null;
                globalJsonData.第一作者 = null;
                return [false, '<span style="color: red;">无作者容器</span>'];
            }

            // 2. 统计所有作者（匹配id以"author-"开头的span标签）
            const authorSpans = mainDiv.querySelectorAll('span[id^="author-"]');
            const authorCount = authorSpans.length;

            if (authorCount === 0) {
                globalJsonData.作者总数 = 0;
                globalJsonData.第一作者 = null;
                return [false, '<span style="color: orange;">无作者数据</span>'];
            }

            // 3. 提取第一作者（id="author-0"的标签，取英文姓名）
            let firstAuthorName = '未获取到第一作者';
            const firstAuthorSpan = mainDiv.querySelector('span[id="author-0"]');
            if (firstAuthorSpan) {
                // 精准匹配英文姓名标签（lang="en"且带动态类）
                const nameElement = firstAuthorSpan.querySelector('span[lang="en"].ng-star-inserted');
                if (nameElement) {
                    firstAuthorName = nameElement.textContent.trim(); // 清理空格
                }
            }

            // 4. 同步更新全局JSON数据
            globalJsonData.作者总数 = authorCount;
            globalJsonData.第一作者 = firstAuthorName;

            // 5. 返回成功结果：[true, 格式化文本]
            return [true, `<span style="color: green;">第_____作者,共${authorCount}作者,一作:${firstAuthorName}</span>`];

        } catch (error) {
            // 异常处理：同步错误状态到JSON，返回失败结果
            console.error('提取作者信息出错：', error);
            globalJsonData.作者总数 = null;
            globalJsonData.第一作者 = `获取失败: ${error.message}`;
            return [false, `<span style="color: red;">作者提取错误 - ${error.message}</span>`];
        }
    }

    // 提取通讯作者（多个）与通讯地址（同步全局JSON）
    function getCorrespondingAuthorAndAddr() {
        try {
            // 1. 初始化JSON字段（默认空值）
            globalJsonData.通讯作者列表 = [];
            globalJsonData.通讯地址 = null;

            // 2. 定位最外层核心容器（忽略动态ng-star-inserted类，仅强依赖核心class）
            const outerContainer = document.querySelector('div.author-info-section');
            if (!outerContainer) {
                return [false, '<span style="color: red;">无通作容器</span>'];
            }

            // 3. 定位通讯作者子容器（仅依赖id前缀，不依赖class）
            const authorSubContainer = outerContainer.querySelector('div[id^="FRAiinTa-RepAddrTitle-"]');
            if (!authorSubContainer) {
                return [false, '<span style="color: orange;">无通作容器</span>'];
            }

            // 4. 提取通讯作者列表（忽略易变class，仅保留核心标识）
            const authorElements = authorSubContainer.querySelectorAll(
                'span.value.section-label-data.author-display-name'
            );
            const correspondingAuthors = Array.from(authorElements)
            .map(elem => elem.textContent.trim())
            .filter(name => name); // 过滤空值

            // 更新JSON：通讯作者列表（空数组表示无数据）
            globalJsonData.通讯作者列表 = correspondingAuthors;
            let authorsText = correspondingAuthors.length > 0
            ? `通讯:${correspondingAuthors.join('; ')}`
            : '<span style="color: red;">无通作数据</span>';

            if (correspondingAuthors.length > 1) {
                authorsText = `多通讯:${correspondingAuthors.join('/')}`;
            }

            // 5. 提取通讯地址（仅依赖data-ta前缀和标签类型，忽略易变class）
            const addrElement = outerContainer.querySelector(
                'a[data-ta^="FRAOrgTa-RepOrgEnhancedName-reprint-"]'
            );
            let addrTextContent = null;
            let addrColor = 'red'; // 默认红色
            if (addrElement)
            {
                addrTextContent = addrElement.textContent.trim();
                // 地址别名替换
                addrTextContent = unitAliasMap[addrTextContent] || addrTextContent;
                addrColor = addrTextContent === '上海师范大学' ? 'green' : 'red';
                // 包装带颜色的通讯单位文本
                addrTextContent = `<span style="color: ${addrColor};">${addrTextContent}</span>`;
            } else {
                addrTextContent = '<span style="color: orange;">无通地数据</span>';
            }


            // 6. 组合结果（绿色成功提示，支持HTML换行），返回成功状态
            const resultText = `<br><span style="color: orange;">${authorsText}</span>;通讯单位: ${addrTextContent}`;
            globalJsonData.通讯地址 = addrElement ? addrTextContent : null; // 同步地址到全局JSON
            return [true, resultText];

        } catch (error) {
            // 异常处理：同步错误信息到JSON，返回失败状态
            console.error('提取通讯作者/地址出错：', error);
            globalJsonData.通讯作者列表 = `获取失败: ${error.message}`;
            globalJsonData.通讯地址 = null;
            return [false, `<span style="color: red;">通讯作者信息：提取错误 - ${error.message}</span>`];
        }
    }

    // 提取印刷版ISSN（找到label即默认正确，不做格式校验）
    function getISSN() {
        // 初始化结果
        const issnResult = {
            ISSN: '',
            eISSN: '' // 仅关注印刷版，电子版留空
        };

        try {
            // 1. 定位核心数据容器（必须存在id为snJournalData的div）
            const snJournalData = document.getElementById('snJournalData');
            if (!snJournalData) {
                console.error('提取印刷版ISSN失败：未找到核心容器div#snJournalData');
                globalJsonData.ISSN信息 = { ...globalJsonData.ISSN信息, ...issnResult };
                return [false, `<span style="color: red;">无期刊数据</span>`];
            }

            // 2. 通用提取函数：根据标签文本找相邻的value
            const extractByLabel = (labelText) => {
                // 找到所有包含目标文本的h3标签（不区分大小写）
                const labels = snJournalData.querySelectorAll('h3.label.cdx-grid-label');

                for (const label of labels) {
                    if (label.textContent.trim().toLowerCase() === labelText.toLowerCase()) {
                        // 找到h3的下一个兄弟span元素（值容器）
                        const valueSpan = label.nextElementSibling;
                        if (valueSpan && valueSpan.matches('span.value.section-label-data.text-color')) {
                            return valueSpan.textContent.trim();
                        }
                    }
                }
                return null; // 未找到返回null
            };

            // 3. 提取印刷版ISSN（找到label并提取到值即默认正确）
            const ISSN = extractByLabel('ISSN');
            if (ISSN) {
                issnResult.ISSN = ISSN; // 提取到值则赋值
            }
            // 未找到时不处理，保持issnResult.ISSN为空字符串

            // 仅在找到有效ISSN时，才更新全局字段（未找到则不修改全局的ISSN值）
            if (issnResult.ISSN) {
                globalJsonData.ISSN信息 = {
                    ...globalJsonData.ISSN信息, // 保留原有eISSN（若有）
                    ISSN: issnResult.ISSN // 仅更新ISSN字段（仅当有有效值时）
                };
            } else {
                // 未找到ISSN：不修改全局ISSN字段，仅确保全局对象结构完整（可选）
                if (!globalJsonData.ISSN信息) {
                    globalJsonData.ISSN信息 = { eISSN: globalJsonData.ISSN信息?.eISSN || '' };
                }
            }

            // 生成带颜色的显示文本（区分"未找到"和"已找到"）
            const ISSNText = issnResult.ISSN
            ? `<span style="color: green;">${issnResult.ISSN}</span>` // 找到值：绿色显示
            : `<span style="color: orange;">无ISSN</span>`; // 未找到：橙色提示

            // 核心判断：提取到有效ISSN则返回成功
            const isSuccess = !!issnResult.ISSN;
            const resultText = `ISSN:${ISSNText}`;

            return [isSuccess, resultText];

        } catch (error) {
            console.error('ISSN报错：', error);
            issnResult.ISSN = `ISSN报错: ${error.message}`;
            // 同步错误状态到全局JSON
            globalJsonData.ISSN信息 = {
                ...globalJsonData.ISSN信息,
                ISSN: issnResult.ISSN
            };
            return [false, `<span style="color: red;">ISSN报错:${error.message}</span>`];
        }
    }

    // 提取电子版eISSN（找到label即默认正确，不做格式校验）
    function geteISSN() {
        // 初始化结果
        const eissnResult = {
            ISSN: '', // 仅关注电子版，印刷版留空
            eISSN: ''
        };

        try {
            // 1. 定位核心数据容器（必须存在id为snJournalData的div）
            const snJournalData = document.getElementById('snJournalData');
            if (!snJournalData) {
                console.error('提取电子版eISSN失败：未找到核心容器div#snJournalData');
                globalJsonData.ISSN信息 = { ...globalJsonData.ISSN信息, ...eissnResult };
                return [false, `<span style="color: red;">无期刊数据</span>`];
            }

            // 2. 通用提取函数：根据标签文本找相邻的value
            const extractByLabel = (labelText) => {
                // 找到所有包含目标文本的h3标签（不区分大小写）
                const labels = snJournalData.querySelectorAll('h3.label.cdx-grid-label');

                for (const label of labels) {
                    if (label.textContent.trim().toLowerCase() === labelText.toLowerCase()) {
                        // 找到h3的下一个兄弟span元素（值容器）
                        const valueSpan = label.nextElementSibling;
                        if (valueSpan && valueSpan.matches('span.value.section-label-data.text-color')) {
                            return valueSpan.textContent.trim();
                        }
                    }
                }
                return null; // 未找到返回null
            };

            // 3. 提取电子版eISSN（找到label并提取到值即默认正确）
            const eISSN = extractByLabel('eISSN');
            if (eISSN) {
                eissnResult.eISSN = eISSN; // 提取到值则赋值
            }
            // 未找到时不处理，保持eissnResult.eISSN为空字符串

            // 仅在找到有效eISSN时，才更新全局字段（未找到则不修改全局的eISSN值）
            if (eissnResult.eISSN) {
                globalJsonData.ISSN信息 = {
                    ...globalJsonData.ISSN信息, // 保留原有ISSN（若有）
                    eISSN: eissnResult.eISSN // 仅更新eISSN字段（仅当有有效值时）
                };
            } else {
                // 未找到eISSN：不修改全局eISSN字段，仅确保全局对象结构完整（可选）
                if (!globalJsonData.ISSN信息) {
                    globalJsonData.ISSN信息 = { ISSN: globalJsonData.ISSN信息?.ISSN || '' };
                }
            }

            // 生成带颜色的显示文本（区分"未找到"和"已找到"）
            const eISSNText = eissnResult.eISSN
            ? `<span style="color: green;">${eissnResult.eISSN}</span>` // 找到值：绿色显示
            : `<span style="color: orange;">未找到电子版eISSN</span>`; // 未找到：橙色提示

            // 核心判断：提取到有效eISSN则返回成功
            const isSuccess = !!eissnResult.eISSN;
            const resultText = `eISSN:${eISSNText}`;

            return [isSuccess, resultText];

        } catch (error) {
            console.error('eISSN报错:', error);
            eissnResult.eISSN = `eISSN报错:${error.message}`;
            // 同步错误状态到全局JSON
            globalJsonData.ISSN信息 = {
                ...globalJsonData.ISSN信息,
                eISSN: eissnResult.eISSN
            };
            return [false, `<span style="color: red;">eISSN报错:${error.message}</span>`];
        }
    }


    /**
 * 提取分区数据（异步函数，返回 Promise<[是否成功, 结果文本]>）
 * 从 globalJsonData 读取依赖：出版年份（直接使用）、ISSN信息（提取印刷版ISSN）
 */
    function getZKYfenqu() {
		return[true,`<span style="color: red;">分区获取</span>`]
    }


    // 启动脚本
    main().catch(err => {
        console.error('脚本执行出错:', err);
    });
})();