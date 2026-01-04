// ==UserScript==
// @name         Smart Flow for WebNovel
// @description  A Script that lets you modify the formatting of webnovel stories. You can customise font type, font size, text width & line height. + Plus more in future updates
// @version      1.2
// @author       Grimlock7
// @license      MIT
// @namespace    smartflow-webnovel
// @match        https://www.webnovel.com/book/*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551705/Smart%20Flow%20for%20WebNovel.user.js
// @updateURL https://update.greasyfork.org/scripts/551705/Smart%20Flow%20for%20WebNovel.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let smartFlowEnabled = false;
    let dragEnabled = true;

    const defaultSettings = {
        fontFamily: 'Georgia',
        fontSize: '22px',
        lineHeight: '1.8',
        maxWidth: '1800px',
        autoEnable: false
    };

    const loadSettings = () => {
        const saved = localStorage.getItem('smartflow-settings');
        return saved ? JSON.parse(saved) : { ...defaultSettings };
    };

    const saveSettings = (settings) => {
        localStorage.setItem('smartflow-settings', JSON.stringify(settings));
    };

    const updateStyles = (settings) => {
    const style = document.getElementById('smartflow-style');
    if (style) style.remove();

    const newStyle = document.createElement('style');
    newStyle.id = 'smartflow-style';
    newStyle.textContent = `
        .smartflow-container {
            max-width: ${settings.maxWidth};
            margin: 0 auto;
            padding: 0 20px;
            font-family: ${settings.fontFamily};
        }
        .smartflow-paragraph {
            font-size: ${settings.fontSize};
            line-height: ${settings.lineHeight};
            word-break: break-word;
            hyphens: auto;
            white-space: normal;
            text-align: justify;
            margin-bottom: 1em;
        }
    `;
    document.head.appendChild(newStyle);
};
        const updateLiveStyles = (settings) => {
    updateStyles(settings);

    document.querySelectorAll('.smartflow-container').forEach(container => {
        container.style.maxWidth = settings.maxWidth;
        container.style.fontFamily = settings.fontFamily;
    });

    document.querySelectorAll('.smartflow-paragraph').forEach(p => {
        p.style.fontSize = settings.fontSize;
        p.style.lineHeight = settings.lineHeight;
        p.style.fontFamily = settings.fontFamily;
    });
};

    const detectStoryContainer = () => {
        return Array.from(document.querySelectorAll('div'))
            .find(div => div.innerText.length > 500 && div.offsetHeight > 300);
    };

    const applySmartFlow = (div, settings) => {
    if (!div || div.classList.contains('smartflow-container')) return;

    div.classList.add('smartflow-container');
    updateStyles(settings);

    const blocks = div.querySelectorAll('p, div');
    blocks.forEach(el => {
        el.classList.add('smartflow-paragraph');
        el.style.fontSize = settings.fontSize;
        el.style.lineHeight = settings.lineHeight;
        el.style.fontFamily = settings.fontFamily;
    });
};

    const removeSmartFlow = (div) => {
    if (!div) return;

    // Remove SmartFlow container class
    div.classList.remove('smartflow-container');

    // Remove SmartFlow paragraph class and inline styles
    const blocks = div.querySelectorAll('.smartflow-paragraph');
    blocks.forEach(el => {
        el.classList.remove('smartflow-paragraph');
        el.style.fontSize = '';
        el.style.lineHeight = '';
        el.style.fontFamily = '';
        el.style.maxWidth = '';
    });

    // Remove injected style block
    const style = document.getElementById('smartflow-style');
    if (style) style.remove();
};
    const updatePanelPosition = () => {
        const btn = document.getElementById('smartflow-toggle-btn');
        const panel = document.getElementById('smartflow-panel');
        if (!btn || !panel) return;

        const rect = btn.getBoundingClientRect();
        panel.style.top = rect.bottom + 10 + 'px';
        panel.style.right = (window.innerWidth - rect.right) + 'px';
    };

    const createSettingsPanel = () => {
        const settings = loadSettings();

        const panel = document.createElement('div');
        panel.id = 'smartflow-panel';
        panel.style.position = 'fixed';
        panel.style.zIndex = '9999';
        panel.style.background = '#fff';
        panel.style.border = '1px solid #ccc';
        panel.style.borderRadius = '6px';
        panel.style.padding = '12px';
        panel.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
        panel.style.display = 'none';
        panel.style.minWidth = '240px';

        panel.innerHTML = `
            <label>Font:
                <select id="sf-font">
                    <option value="Arial">Arial</option>
                    <option value="Georgia">Georgia</option>
                    <option value="sans-serif">Sans-serif</option>
                    <option value="serif">Serif</option>
                    <option value="Times New Roman">Times New Roman</option>
                </select>
            </label><br><br>
            <label>Font Size:
                <input type="range" id="sf-size" min="12" max="36" value="${parseInt(settings.fontSize)}">
                <span id="sf-size-label">${settings.fontSize}</span>
            </label><br><br>
            <label>Line Height:
                <input type="range" id="sf-line" min="1.0" max="3.0" step="0.1" value="${parseFloat(settings.lineHeight)}">
                <span id="sf-line-label">${settings.lineHeight}</span>
            </label><br><br>
            <label>Text Width:
                <input type="range" id="sf-width" min="800" max="1800" step="50" value="${parseInt(settings.maxWidth)}">
                <span id="sf-width-label">${settings.maxWidth}</span> px
            </label><br><br>
            <label>
                <input type="checkbox" id="sf-auto" ${settings.autoEnable ? 'checked' : ''}>
                Auto Enable SmartFlow
            </label><br><br>
            <button id="sf-toggle">SmartFlow OFF </button><br><br>`;

        document.body.appendChild(panel);
        document.getElementById('sf-font').value = settings.fontFamily;

        const getSettings = () => ({
            fontFamily: document.getElementById('sf-font').value,
            fontSize: document.getElementById('sf-size').value + 'px',
            lineHeight: document.getElementById('sf-line').value,
            maxWidth: document.getElementById('sf-width').value + 'px',
            autoEnable: document.getElementById('sf-auto').checked
        });
        const toggleBtn = document.getElementById('sf-toggle');
          toggleBtn.style.backgroundColor = smartFlowEnabled ? 'green' : 'red';
          toggleBtn.style.color = '#fff';
          toggleBtn.style.border = 'none';
          toggleBtn.style.padding = '6px 10px';
          toggleBtn.style.borderRadius = '4px';
          toggleBtn.style.cursor = 'pointer';


toggleBtn.addEventListener('click', () => {
    const storyDiv = detectStoryContainer();
    if (!storyDiv) return;

    smartFlowEnabled = !smartFlowEnabled;

    if (smartFlowEnabled) {
        applySmartFlow(storyDiv, loadSettings());
        toggleBtn.textContent = 'SmartFlow ON';
        toggleBtn.style.backgroundColor = 'green';
    } else {
        removeSmartFlow(storyDiv);
        toggleBtn.textContent = 'SmartFlow OFF';
        toggleBtn.style.backgroundColor = 'red';
    }
});

        const handleSettingChange = () => {
            const newSettings = getSettings();
            saveSettings(newSettings);
            if (smartFlowEnabled) {
                updateLiveStyles(newSettings);
            }
            document.getElementById('sf-size-label').textContent = document.getElementById('sf-size').value + 'px';
            document.getElementById('sf-line-label').textContent = document.getElementById('sf-line').value;
            document.getElementById('sf-width-label').textContent = document.getElementById('sf-width').value;
        };

        ['sf-font', 'sf-size', 'sf-line', 'sf-width', 'sf-auto'].forEach(id => {
            document.getElementById(id).addEventListener('input', handleSettingChange);
        });

    };

const createToggleButton = () => {
    const savedPos = {
        top: 245,
        anchor: 'right',
        offset: 0
    };

    const btn = document.createElement('button');
    btn.textContent = 'Smart\nFlow';
    btn.id = 'smartflow-toggle-btn';
    btn.style.position = 'fixed';
    btn.style.top = savedPos.top + 'px';
    btn.style.zIndex = '9999';
    btn.style.padding = 'none';
    btn.style.width = '48px';
    btn.style.height = '47.58px';
    btn.style.fontSize = '10px';
    btn.style.fontFamily = '"Segoe Script", "Lucida Handwriting", cursive';
    btn.style.textAlign = 'center';
    btn.style.background = '#212531';
    btn.style.color = '#83858e';
    btn.style.border = 'none';
    btn.style.borderRadius = '0px';
    btn.style.cursor = 'pointer';
    btn.style.boxShadow = 'none';
    btn.style.userSelect = 'none';
    btn.style.whiteSpace = 'wrap';
    btn.style.wordBreak = 'keep-all';
    btn.style.maxWidth = '48px';

    if (savedPos.anchor === 'left') {
        btn.style.left = savedPos.offset + 'px';
        btn.style.right = 'auto';
    } else {
        btn.style.right = savedPos.offset + 'px';
        btn.style.left = 'auto';
    }

    btn.addEventListener('click', () => {
        const panel = document.getElementById('smartflow-panel');
        if (panel) {
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
            updatePanelPosition();
        }
    });

    document.body.appendChild(btn);

    const hoverStyle = document.createElement('style');
hoverStyle.textContent = `
    #smartflow-toggle-btn:hover {
        background-color: #4c5fe2 !important;
        color: #fff !important;
    }
`;
document.head.appendChild(hoverStyle);

    document.addEventListener('click', (e) => {
    const panel = document.getElementById('smartflow-panel');
    const toggleBtn = document.getElementById('smartflow-toggle-btn');

    if (!panel || panel.style.display === 'none') return;

    const clickedInsidePanel = panel.contains(e.target);
    const clickedToggleBtn = toggleBtn && toggleBtn.contains(e.target);

    if (!clickedInsidePanel && !clickedToggleBtn) {
        panel.style.display = 'none';
    }
});

    updatePanelPosition();
};

    const watchUrlChange = () => {
        let lastUrl = location.href;
        setInterval(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                const storyDiv = detectStoryContainer();
                if (storyDiv && smartFlowEnabled) {
                    applySmartFlow(storyDiv, loadSettings());
                }
            }
        }, 1000);
    };

    // Initialize everything
    createSettingsPanel();
    createToggleButton();
    watchUrlChange();

    const settings = loadSettings();
    if (settings.autoEnable) {
        const storyDiv = detectStoryContainer();
        if (storyDiv) {
            smartFlowEnabled = true;
            applySmartFlow(storyDiv, settings);
            document.getElementById('smartflow-panel').style.display = 'block';
        }
    }
})();