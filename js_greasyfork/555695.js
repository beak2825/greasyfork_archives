// ==UserScript==
// @name         Scope Tagger
// @namespace    http://tampermonkey.net/
// @version      0.21
// @description  **
// @match        https://arxiv.org/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/555695/Scope%20Tagger.user.js
// @updateURL https://update.greasyfork.org/scripts/555695/Scope%20Tagger.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ---------------------------
    // 1. 多期刊配置
    // ---------------------------

    const JOURNAL_CONFIG = {
        environments: {
            name: 'Environments',
            strongKeywords: [
                'environment', 'environmental', 'ecosystem', 'ecosystems',
                'ecosystem service', 'ecosystem services',
                'pollution', 'air quality', 'water quality', 'soil quality',
                'air pollution', 'water pollution', 'soil pollution',
                'wastewater', 'sewage',
                'risk assessment', 'environmental impact',
                'biodiversity', 'habitat', 'conservation',
                'greenhouse gas', 'greenhouse gases',
                'climate change', 'global warming',
                'environmental management',
                'environmental monitoring',
                'environmental modeling', 'environmental modelling',
                'environmental economics',
                'environmental policy', 'environmental policymaking',
                'urban environment', 'urban systems',
                'ecosystem resilience'
            ],
            softKeywords: [
                'coastal pollution', 'marine pollution',
                'waste management', 'water management',
                'soil conservation', 'land use',
                'forestry', 'agriculture',
                'energy efficiency', 'sustainable energy',
                'circular economy',
                'urban sustainability', 'sustainable city', 'sustainable cities',
                'natural capital',
                'environmental systems', 'environmental system'
            ],
            // 负向词，尽量只放非常明显偏 CS/天体物理的
            negativeKeywords: [
                'quantum computing', 'black hole', 'string theory',
                'galaxy', 'galaxies', 'cosmology',
                'blockchain', 'cryptography',
                'neural network', 'large language model',
                'image classification', 'object detection',
                'robot', 'robotics'
            ]
        },

        entropy: {
            name: 'Entropy',
            // 高度相关：标题里出现这些基本可以认为是 Entropy 范围内
            strongKeywords: [
                'entropy', 'entropic',
                'information theory', 'information-theoretic', 'information theoretic',
                'mutual information',
                'relative entropy', 'kl divergence', 'kullback-leibler',
                'shannon entropy', 'von neumann entropy',
                'renyi entropy', 'rényi entropy', 'tsallis entropy',
                'statistical mechanics', 'statistical mechanic',
                'thermodynamics', 'thermostatistics',
                'nonequilibrium thermodynamics', 'non-equilibrium thermodynamics',
                'stochastic thermodynamics',
                'fluctuation theorem', 'fluctuation theorems',
                'large deviation', 'large deviations',
                'landauer', "maxwell's demon",
                'thermodynamic uncertainty relation', 'thermodynamic uncertainty relations',
                'complex systems', 'complex system',
                'complexity measure', 'complexity measures',
                'self-organization', 'self organisation', 'self organization',
                'quantum information', 'quantum entropy',
                'entanglement entropy',
                'entropy production'
            ],
            // 一般相关：本身不一定非要投稿 Entropy，但多命中几个可以当 possible
            softKeywords: [
                'complexity', 'chaos', 'chaotic', 'nonlinear dynamics',
                'non-linear dynamics',
                'fractal', 'multifractal', 'multi-fractal',
                'markov chain', 'markov process',
                'bayesian inference', 'bayesian network',
                'coding theory', 'channel capacity',
                'error-correcting code', 'error correcting code',
                'data compression', 'source coding',
                'compressive sensing',
                'time series analysis', 'time-series analysis',
                'stochastic process', 'random walk'
            ],
            // 负向词：主要用于避免纯环境、生态类文章在完全没有“熵/信息论”时被误判
            negativeKeywords: [
                'environmental', 'ecology', 'biodiversity', 'pollution'
            ]
        }
    };

    // 当前模式：environments | entropy | both
    let currentMode = localStorage.getItem('mdpiScopeHelper.mode') || 'environments';

    // ---------------------------
    // 2. 标题分类函数（按期刊）
    // ---------------------------

    function classifyTitleForJournal(rawTitle, journalKey) {
        const cfg = JOURNAL_CONFIG[journalKey];
        if (!cfg || !rawTitle) return 'unknown';

        const title = rawTitle.toLowerCase();

        let strongScore = 0;
        for (const kw of cfg.strongKeywords) {
            if (title.includes(kw)) {
                strongScore++;
            }
        }

        let softScore = 0;
        for (const kw of cfg.softKeywords) {
            if (title.includes(kw)) {
                softScore++;
            }
        }

        let negativeHits = 0;
        for (const kw of cfg.negativeKeywords) {
            if (title.includes(kw)) {
                negativeHits++;
            }
        }

        const totalScore = strongScore * 2 + softScore - negativeHits;

        // 判定逻辑：
        // 1）只要命中强关键词 => likely
        // 2）否则看总分：>=3 => likely；>=1 => possible；<1 => unlikely
        if (strongScore >= 1) {
            return 'in';
        } else if (totalScore >= 3) {
            return 'in';
        } else if (totalScore >= 1) {
            return 'maybe';
        } else {
            return 'out';
        }
    }

    // ---------------------------
    // 3. UI 样式
    // ---------------------------

    function injectStyles() {
        if (document.getElementById('mdpi-scope-style')) return;
        const style = document.createElement('style');
        style.id = 'mdpi-scope-style';
        style.textContent = `
            .mdpi-scope-tag {
                font-size: 0.75rem;
                margin-left: 0.4em;
                padding: 0.1em 0.5em;
                border-radius: 999px;
                border: 1px solid #dadce0;
                display: inline-flex;
                align-items: center;
                gap: 0.3em;
                vertical-align: middle;
                white-space: nowrap;
            }
            .mdpi-scope-tag span.mdpi-scope-dot {
                width: 0.6em;
                height: 0.6em;
                border-radius: 50%;
                display: inline-block;
            }
            .mdpi-scope-in {
                background: #e6f4ea;
                border-color: #34a853;
                color: #196127;
            }
            .mdpi-scope-in span.mdpi-scope-dot {
                background: #34a853;
            }
            .mdpi-scope-maybe {
                background: #fff7e6;
                border-color: #fbbc04;
                color: #8c6d00;
            }
            .mdpi-scope-maybe span.mdpi-scope-dot {
                background: #fbbc04;
            }
            .mdpi-scope-out {
                background: #f1f3f4;
                border-color: #dadce0;
                color: #5f6368;
            }
            .mdpi-scope-out span.mdpi-scope-dot {
                background: #9aa0a6;
            }

            #mdpi-scope-panel {
                position: fixed;
                right: 12px;
                bottom: 12px;
                background: #ffffff;
                border-radius: 999px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                font-size: 12px;
                padding: 6px 10px;
                z-index: 99999;
                color: #202124;
                display: flex;
                align-items: center;
                gap: 8px;
                max-width: 90vw;
            }
            #mdpi-scope-panel-title {
                font-weight: 600;
                margin-right: 4px;
            }
            #mdpi-scope-panel label {
                margin-right: 4px;
                cursor: pointer;
                white-space: nowrap;
            }
            #mdpi-scope-panel input[type="radio"] {
                vertical-align: middle;
                margin-right: 2px;
            }
            @media (max-width: 600px) {
                #mdpi-scope-panel {
                    font-size: 11px;
                    bottom: 8px;
                    right: 8px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    function createTag(journalKey, status) {
        const cfg = JOURNAL_CONFIG[journalKey];
        const journalName = cfg ? cfg.name : journalKey;

        const span = document.createElement('span');
        span.classList.add('mdpi-scope-tag');
        span.dataset.journal = journalKey;

        let text;
        switch (status) {
            case 'in':
                span.classList.add('mdpi-scope-in');
                text = `${journalName}: likely`;
                break;
            case 'maybe':
                span.classList.add('mdpi-scope-maybe');
                text = `${journalName}: possible`;
                break;
            case 'out':
                span.classList.add('mdpi-scope-out');
                text = `${journalName}: unlikely`;
                break;
            default:
                span.classList.add('mdpi-scope-out');
                text = `${journalName}: unknown`;
        }

        const dot = document.createElement('span');
        dot.className = 'mdpi-scope-dot';

        const label = document.createElement('span');
        label.textContent = text;

        span.appendChild(dot);
        span.appendChild(label);
        return span;
    }

    // ---------------------------
    // 4. 标题提取 & 处理
    // ---------------------------

    function extractTitleFromElement(el) {
        if (!el) return '';
        let text = el.textContent || '';
        text = text.replace(/\s+/g, ' ');
        text = text.replace(/^Title:\s*/i, '');
        return text.trim();
    }

    function processTitleElement(el) {
        if (!el) return;
        if (el.dataset.mdpiScopeChecked === '1') return;

        const title = extractTitleFromElement(el);
        if (!title) {
            el.dataset.mdpiScopeChecked = '1';
            return;
        }

        let journalKeys;
        if (currentMode === 'both') {
            journalKeys = Object.keys(JOURNAL_CONFIG);
        } else {
            journalKeys = [currentMode];
        }

        journalKeys.forEach(journalKey => {
            const status = classifyTitleForJournal(title, journalKey);
            const tag = createTag(journalKey, status);
            el.appendChild(tag);
        });

        el.dataset.mdpiScopeChecked = '1';
    }

    function scanPage() {
        const selectors = [
            // 列表页
            'dd .list-title',
            'div.list-title',
            // 详情页 /abs/...
            'h1.title',
            // 搜索页
            'li.arxiv-result p.title',
            'li.arxiv-result .title'
        ];

        const seen = new Set();
        selectors.forEach(sel => {
            document.querySelectorAll(sel).forEach(el => {
                if (!seen.has(el)) {
                    seen.add(el);
                    processTitleElement(el);
                }
            });
        });
    }

    function clearAllTags() {
        document.querySelectorAll('.mdpi-scope-tag').forEach(el => el.remove());
        document.querySelectorAll('[data-mdpi-scope-checked]').forEach(el => {
            delete el.dataset.mdpiScopeChecked;
        });
    }

    function rescanAll() {
        clearAllTags();
        scanPage();
    }

    // ---------------------------
    // 5. 控制面板（右下角切换期刊）
    // ---------------------------

    function createControlPanel() {
        if (document.getElementById('mdpi-scope-panel')) return;

        const panel = document.createElement('div');
        panel.id = 'mdpi-scope-panel';
        panel.innerHTML = `
            <span id="mdpi-scope-panel-title">MDPI Scope:</span>
            <label><input type="radio" name="mdpiScopeMode" value="environments"> Environments</label>
            <label><input type="radio" name="mdpiScopeMode" value="entropy"> Entropy</label>
            <label><input type="radio" name="mdpiScopeMode" value="both"> Both</label>
        `;

        document.body.appendChild(panel);

        const radios = panel.querySelectorAll('input[name="mdpiScopeMode"]');
        radios.forEach(r => {
            if (r.value === currentMode) {
                r.checked = true;
            }
            r.addEventListener('change', (e) => {
                if (!e.target.checked) return;
                currentMode = e.target.value;
                localStorage.setItem('mdpiScopeHelper.mode', currentMode);
                rescanAll();
            });
        });
    }

    // ---------------------------
    // 6. MutationObserver 支持动态加载
    // ---------------------------

    function observeMutations() {
        const observer = new MutationObserver(mutations => {
            for (const m of mutations) {
                if (m.addedNodes && m.addedNodes.length > 0) {
                    scanPage();
                    break;
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // ---------------------------
    // 7. 启动
    // ---------------------------

    function init() {
        injectStyles();
        createControlPanel();
        scanPage();
        observeMutations();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
