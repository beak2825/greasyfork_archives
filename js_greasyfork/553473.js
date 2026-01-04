// ==UserScript==
// @name         tanks.gg坦克信息提取工具
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  提取网页中的坦克信息并转换为可复制的代码格式
// @author       SundayRX
// @match        https://tanks.gg/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/553473/tanksgg%E5%9D%A6%E5%85%8B%E4%BF%A1%E6%81%AF%E6%8F%90%E5%8F%96%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/553473/tanksgg%E5%9D%A6%E5%85%8B%E4%BF%A1%E6%81%AF%E6%8F%90%E5%8F%96%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

GM_addStyle(`
    .tank-info-float {
        position: fixed;
        top: 20px;
        right: 20px;
        width: 500px;
        max-height: 600px;
        background: white;
        border: 1px solid #ccc;
        border-radius: 5px;
        padding: 15px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        z-index: 99999;
        overflow: auto;
        color: #333;
    }
    .tank-info-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
        padding-bottom: 10px;
        border-bottom: 1px solid #eee;
    }
    .tank-info-title {
        font-weight: bold;
        font-size: 16px;
        color: #333;
    }
    .tank-info-close {
        cursor: pointer;
        color: #999;
        font-size: 18px;
    }
    .tank-info-close:hover {
        color: #333;
    }
    .tank-info-code {
        background: #f5f5f5;
        padding: 10px;
        border-radius: 4px;
        font-family: monospace;
        white-space: pre;
        overflow-x: auto;
        margin-bottom: 10px;
        color: #333;
        line-height: 1.5;
    }
    .tank-info-btn {
        background: #007bff;
        color: white;
        border: none;
        padding: 6px 12px;
        border-radius: 4px;
        cursor: pointer;
    }
    .tank-info-btn:hover {
        background: #0056b3;
    }
`);

(function() {
    'use strict';

    // 转义HTML特殊字符
    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // 创建悬浮窗
    function createFloatWindow(originalCode) {
        const existing = document.querySelector('.tank-info-float');
        if (existing) existing.remove();

        const escapedCode = escapeHtml(originalCode);

        const floatDiv = document.createElement('div');
        floatDiv.className = 'tank-info-float';

        floatDiv.innerHTML = `
            <div class="tank-info-header">
                <div class="tank-info-title">坦克信息代码</div>
                <div class="tank-info-close">×</div>
            </div>
            <div class="tank-info-code" id="tankCode">${escapedCode}</div>
            <button class="tank-info-btn" id="copyBtn">复制代码</button>
        `;

        document.body.appendChild(floatDiv);

        floatDiv.querySelector('.tank-info-close').addEventListener('click', () => {
            floatDiv.remove();
        });

        floatDiv.querySelector('#copyBtn').addEventListener('click', () => {
            const textArea = document.createElement('textarea');
            textArea.value = originalCode;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);

            const originalText = floatDiv.querySelector('#copyBtn').textContent;
            floatDiv.querySelector('#copyBtn').textContent = '复制成功!';
            setTimeout(() => {
                floatDiv.querySelector('#copyBtn').textContent = originalText;
            }, 2000);
        });
    }

    // 转换国家名称
    function convertCountry(country) {
        const countryMap = {
            'Chinese': 'China',
            'Czech': 'Czech',
            'French': 'France',
            'German': 'Germany',
            'Italian': 'Italy',
            'Japanese': 'Japan',
            'Polish': 'Poland',
            'Swedish': 'Sweden',
            'British': 'UK',
            'American': 'USA',
            'Soviet': 'USSR'
        };
        return countryMap[country] || country;
    }

    // 转换坦克等级
    function convertTier(tier) {
        const tierMap = {
            'I': 1,
            'II': 2,
            'III': 3,
            'IV': 4,
            'V': 5,
            'VI': 6,
            'VII': 7,
            'VIII': 8,
            'IX': 9,
            'X': 10,
            'XI': 11
        };
        return tierMap[tier] || tier;
    }

    // 提取元素的直接文本（排除子元素文本）
    function getDirectText(element) {
        if (!element) return '';
        let text = '';
        for (const node of element.childNodes) {
            if (node.nodeType === Node.TEXT_NODE) {
                text += node.textContent;
            }
        }
        return text.trim();
    }

    // 提取坦克信息
    function extractTankInfo() {
        const tankContainer = document.querySelector('.tank');
        if (!tankContainer) return null;

        const nameElement = tankContainer.querySelector('h1 .d-flex');
        const name = getDirectText(nameElement);

        const detailsElement = tankContainer.querySelector('h1 small');
        if (!detailsElement) return null;

        const detailsText = detailsElement.textContent.trim();
        const detailsParts = detailsText.split(' ');

        const tierText = detailsParts.find(part => /^Tier$/.test(part))
            ? detailsParts[detailsParts.indexOf('Tier') + 1]
            : '';
        const tier = convertTier(tierText);

        const isPremium = detailsParts.includes('Premium') || detailsParts.includes('Reward');

        const countryText = detailsParts.find(part =>
            ['Chinese', 'Czech', 'French', 'German', 'Italian', 'Japanese',
             'Polish', 'Swedish', 'British', 'American', 'Soviet'].includes(part)
        ) || '';
        const country = convertCountry(countryText);

        const typeText = detailsParts.find(part =>
            ['Light', 'Medium', 'Heavy', 'Destroyer', 'Artillery'].includes(part)
        ) || '';
        const type = typeText;

        return { name, country, type, tier, isPremium };
    }

    // 提取乘员信息
    function extractCrewInfo() {
        const crewContainer = document.querySelector('.crew');
        if (!crewContainer) return [];

        const crewMembers = crewContainer.querySelectorAll('div:not([class])');
        const crewList = [];

        crewMembers.forEach(member => {
            // 1. 提取主职业（第一个span）
            const majorElement = member.querySelector('span:first-child');
            if (!majorElement) return;
            const major = majorElement.textContent.trim();

            // 2. 提取副职业（仅主职业span后面的div中的span，避免误提取）
            // 结构应为：<div><span>主职业</span><div><span>副职业1</span><span>副职业2</span></div></div>
            const minorContainer = member.querySelector('span:first-child + div'); // 主职业后面的div
            const minorElements = minorContainer ? minorContainer.querySelectorAll('span') : [];
            const minor = Array.from(minorElements).map(el => el.textContent.trim());

            // 过滤掉可能和主职业重复的副职业（双重保险）
            const filteredMinor = minor.filter(job => job !== major);

            crewList.push({ major, minor: filteredMinor });
        });

        return crewList;
    }

    // 生成代码
    function generateCode(tankInfo, crewInfo) {
        if (!tankInfo || !tankInfo.name) return '未找到坦克信息';

        let crewCode = '';
        crewInfo.forEach((crew, index) => {
            const crewProps = [`Major = CrewJobEnum.${crew.major}`];

            // 只有副职业存在时才添加Minor属性
            if (crew.minor.length > 0) {
                const minorJobs = crew.minor.map(job => `CrewJobEnum.${job}`).join(', ');
                crewProps.push(`Minor = new List<CrewJobEnum> { ${minorJobs} }`);
            }

            crewCode += `            new Crew() { ${crewProps.join(', ')} }`;
            if (index < crewInfo.length - 1) {
                crewCode += ',\n';
            }
        });

        return `// ${tankInfo.name}
{
    "${tankInfo.name}",
    new Tank()
    {
        Name = "${tankInfo.name}",
        Country = CountryEnum.${tankInfo.country},
        Type = TankTypeEnum.${tankInfo.type},
        Level = ${tankInfo.tier},
        IsPremium = ${tankInfo.isPremium.toString().toLowerCase()},
        Crews = new List<Crew>()
        {
${crewCode}
        }
    }
},`;
    }

    // 添加提取按钮
    function addExtractButton() {
        const button = document.createElement('button');
        button.textContent = '提取坦克信息';
        button.style.position = 'fixed';
        button.style.top = '20px';
        button.style.left = '20px';
        button.style.zIndex = '99998';
        button.style.padding = '8px 16px';
        button.style.backgroundColor = '#28a745';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.cursor = 'pointer';
        button.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';

        button.addEventListener('click', () => {
            const tankInfo = extractTankInfo();
            const crewInfo = extractCrewInfo();
            const originalCode = generateCode(tankInfo, crewInfo);
            createFloatWindow(originalCode);
        });

        document.body.appendChild(button);
    }

    window.addEventListener('load', addExtractButton);
})();