// ==UserScript==
// @name         crack OLM Study Assistant Pro v8.1 - Cosmic (Fix q_type 21)
// @namespace    http://tampermonkey.net/
// @version      8.1
// @description  AI code goes hard (xóa auth dưới 5p lmao)
// @author       TIỆP GÀ CUI 
// @match        https://olm.vn/*
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @connect      fakemoithu.io.vn
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/559322/crack%20OLM%20Study%20Assistant%20Pro%20v81%20-%20Cosmic%20%28Fix%20q_type%2021%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559322/crack%20OLM%20Study%20Assistant%20Pro%20v81%20-%20Cosmic%20%28Fix%20q_type%2021%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ==================== 1. MODULE CẤU HÌNH (CONFIGURATION) ====================
    const Config = {
        VERSION: '8.1', // Đã cập nhật phiên bản
        API_KEYWORDS: ['get-question-of-ids', 'get-question?belongs=1']
    };

    // ==================== 2. MODULE TIỆN ÍCH (UTILITIES) ====================
    const Utils = {
        decodeBase64(base64) {
            if (!base64) return null;
            try {
                const binaryString = atob(base64);
                const bytes = new Uint8Array(binaryString.length);
                for (let i = 0; i < binaryString.length; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }
                return new TextDecoder('utf-8').decode(bytes);
            } catch (e) {
                console.error('[StudyAssistant] Lỗi decodeBase64:', e);
                return null;
            }
        },

        createElement(tag, { id, className, style, children, innerHTML, ...attrs } = {}) {
            const el = document.createElement(tag);
            if (id) el.id = id;
            if (className) el.className = className;
            if (style) Object.assign(el.style, style);
            if (innerHTML !== undefined) el.innerHTML = innerHTML;
            Object.keys(attrs).forEach(key => el.setAttribute(key, attrs[key]));
            if (children && Array.isArray(children)) {
                children.forEach(child => {
                    if (typeof child === 'string') {
                        el.appendChild(document.createTextNode(child));
                    } else if (child instanceof Node) {
                        el.appendChild(child);
                    }
                });
            }
            return el;
        },

        sleep: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

        formatNumber(num) {
            if (typeof num !== 'number') return '0';
            return num.toLocaleString('vi-VN');
        }
    };

    // ==================== 3. MODULE XÁC THỰC (AUTHENTICATION SERVICE) ====================
    // (Đã xóa bỏ xác thực)
    const AuthService = {
        isKeyValid: true, // Luôn luôn hợp lệ
        deviceId: 'unlimited_access',
        init() { },
        checkCachedKey() { return true; }
    };

    // ==================== 4. MODULE PHÂN TÍCH GỢI Ý (HINT PARSER) ====================
    // (Không thay đổi so với v8.0)
    const HintParser = {
        _extractTextFromNode(node) {
            let text = '';
            if (!node) return text;
            if (node.text) text += node.text;
            if (node.children && Array.isArray(node.children)) {
                text += node.children.map(child => this._extractTextFromNode(child)).join('');
            }
            return text;
        },

        _deepScanJsonNode(node, hints, parentNode = null, q_type = 0) {
            if (!node || typeof node !== 'object') return;

            let identified = false;

            // [FIX] Logic cho q_type: 10 (Kéo thả nhóm - 'group-list')
            if (q_type === 10 && node.name === 'group-list' && node.children) {
                node.children.forEach((listItem, index) => {
                    if (listItem.type !== 'olm-list-item' || !listItem.children) return;
                    const titleNode = listItem.children.find(c => c.type === 'group-title');
                    const title = titleNode ? this._extractTextFromNode(titleNode).trim() : 'Nhóm';
                    const answers = listItem.children
                        .filter(c => c.position === 'group')
                        .map(c => this._extractTextFromNode(c).trim())
                        .filter(Boolean);
                    if (answers.length > 0) {
                        hints.push({
                            type: 'Kéo nhóm',
                            content: `${title}: ${answers.join(', ')}`,
                            subIndex: index + 1
                        });
                    }
                });
                identified = true;
            }

            // [FIX] Logic cho q_type: 2 & 3 (Điền từ theo câu "1. ...")
            if (!identified && (q_type === 2 || q_type === 3) && node.type === 'paragraph' && node.children) {
                const firstChild = node.children[0];
                if (firstChild && firstChild.text && /^\d+\.\s/.test(firstChild.text.trim())) {
                    const questionNumberMatch = firstChild.text.trim().match(/^(\d+)\./);
                    const questionNumber = questionNumberMatch ? questionNumberMatch[1] : '0';
                    const inputs = node.children.filter(c =>
                        (c.type === 'fillme-input' || c.type === 'olm-input-text') && c.content
                    );
                    if (inputs.length > 0) {
                        inputs.forEach(input => {
                            const parts = input.content.split('||').map(s => s.trim()).filter(Boolean);
                            parts.forEach(part => {
                                hints.push({
                                    type: 'Điền từ',
                                    content: part,
                                    subIndex: questionNumber
                                });
                            });
                        });
                        identified = true;
                    }
                }
            }

            // Logic 1: Trắc nghiệm
            if (!identified && node.correct === true && (node.type === 'olm-list-item' || node.type === 'list-item')) {
                const text = this._extractTextFromNode(node).trim();
                if (text) {
                    const type = (node.name === 'true-false' || (parentNode && parentNode.name === 'true-false'))
                        ? 'Đúng/Sai'
                        : 'Trắc nghiệm';
                    hints.push({ type, content: text.replace(/^#/, '').trim(), subIndex: null });
                    identified = true;
                }
            }

            // Logic 2 & 3: Điền từ / Kéo thả (Dạng chung, không có số thứ tự)
            if (!identified && q_type !== 2 && q_type !== 3) {
                if (node.type === 'fillme-input' && node.content) {
                    const parts = node.content.split('||').map(s => s.trim()).filter(Boolean);
                    parts.forEach(part => {
                        hints.push({ type: 'Điền từ', content: part, subIndex: null });
                    });
                    identified = true;
                }

                if (!identified && node.type === 'olm-input-text' && node.name === 'dragtext' && node.content) {
                    const parts = node.content.split('||').map(s => s.trim()).filter(Boolean);
                    parts.forEach(part => {
                        hints.push({ type: 'Điền từ', content: part, subIndex: null });
                    });
                    identified = true;
                }

                if (!identified && node.type === 'drag-more-item' && node.children) {
                    const text = this._extractTextFromNode(node).trim();
                    if (text) {
                        hints.push({ type: 'Kéo thả', content: text, subIndex: null });
                        identified = true;
                    }
                }
            }

            // Logic 6: Dạng Nối (Matching - link-list)
            if (!identified && node.type === 'olm-list-item' && parentNode && parentNode.name === 'link-list' && Array.isArray(node.children)) {
                const leftNode = node.children.find(c => c.position === 'left');
                const rightNode = node.children.find(c => c.position === 'right');
                if (leftNode && rightNode) {
                    const leftText = this._extractTextFromNode(leftNode).trim();
                    const rightText = this._extractTextFromNode(rightNode).trim();
                    if (leftText && rightText) {
                        hints.push({ type: 'Nối', content: `${leftText} ➔ ${rightText}`, subIndex: null });
                        identified = true;
                    }
                }
            }

            // Logic 4B: Sắp xếp
            if (!identified && Array.isArray(node.children) && node.children.length >= 3) {
                const pieces = node.children
                    .map(ch => (ch.text || '').trim())
                    .filter(Boolean);
                const isAllWords =
                    pieces.length >= 3 &&
                    pieces.every(t =>
                        /^[A-Za-zÀ-ỹ0-9'’.,!?-]+$/.test(t)
                    );
                if (isAllWords) {
                    hints.push({
                        type: 'Sắp xếp',
                        content: pieces.join(' '),
                        subIndex: null
                    });
                    identified = true;
                }
            }

            // Logic 7: Tự luận / Chọn từ (q_type 18 hoặc 11)
            if (!identified && node.name === 'exp' && (q_type === 18 || q_type === 11) && node.children) {
                const text = this._extractTextFromNode(node).trim();
                const cleanText = text.replace(/^Hư[ơớ]ng d[ẫâ]n gi[aả]i:?/i, '').trim();
                const hintType = (q_type === 11) ? 'Chọn từ' : 'Tự luận';
                if (cleanText) {
                    hints.push({ type: hintType, content: cleanText, subIndex: null });
                    identified = true;
                }
            }

            // Logic 5: Đệ quy
            if (!identified && node.children && Array.isArray(node.children)) {
                node.children.forEach(child => this._deepScanJsonNode(child, hints, node, q_type));
            }
        },

        parse(question) {
            const hints = [];

            // Phân tích json_content
            if (question.json_content) {
                try {
                    const data = typeof question.json_content === 'string'
                        ? JSON.parse(question.json_content)
                        : question.json_content;
                    if (data && data.root) this._deepScanJsonNode(data.root, hints, null, question.q_type);
                } catch (e) {
                    console.error('[StudyAssistant] Lỗi phân tích json_content:', e);
                }
            }

            // Phân tích content (HTML cũ)
            if (question.content) {
                const htmlContent = Utils.decodeBase64(question.content);
                if (htmlContent) {
                    const tempDiv = Utils.createElement('div', { innerHTML: htmlContent });
                    const oldStyleHints = [];
                    tempDiv.querySelectorAll('.correctAnswer, .correct-answer').forEach(el => {
                        const text = el.textContent.trim();
                        if (text) oldStyleHints.push({ type: 'Gợi ý (cũ)', content: text });
                    });
                    const inputAccept = tempDiv.querySelector('input[data-accept]');
                    if (inputAccept) {
                        const raw = inputAccept.getAttribute('data-accept') || '';
                        raw.split('|').forEach(ans => {
                            const val = ans.trim();
                            if (val) oldStyleHints.push({ type: 'Điền từ (cũ)', content: val });
                        });
                    }
                    if (oldStyleHints.length > 0) {
                        oldStyleHints.forEach(h => hints.push(h));
                    }

                    // Bật lại Tự luận (HTML cũ) CHỈ KHI LÀ CÂU HỎI TỰ LUẬN hoặc CHỌN TỪ
                    if (question.q_type === 18 || question.q_type === 11) {
                        const explanationDiv = tempDiv.querySelector('.exp .exp-in');
                        if (explanationDiv) {
                            const explanationText = Array.from(explanationDiv.childNodes)
                                .map(node => (node.textContent || '').trim())
                                .filter(text => text)
                                .join('\n');

                            const hintType = (question.q_type === 11) ? 'Chọn từ' : 'Tự luận';

                            if (explanationText) {
                                hints.push({
                                    type: hintType,
                                    content: explanationText
                                });
                            }
                        }
                    }
                }
            }

            // Loại trùng
            const uniqueHints = [];
            const seen = new Set();
            for (const hint of hints) {
                const key = (hint.content || '').toLowerCase();
                if (!key || seen.has(key)) continue;
                seen.add(key);
                uniqueHints.push(hint);
            }

            return uniqueHints;
        }
    };

    // ==================== 5. MODULE QUẢN LÝ GIAO DIỆN (UI MANAGER) ====================
    class StudyPanel {
        constructor() {
            this.isCollapsed = GM_getValue('isPanelCollapsed', false);
            this.position = GM_getValue('panelPosition', {
                x: window.innerWidth - 470,
                y: 100
            });
            this.container = null;
            this.header = null;
            this.summaryBar = null;
            this.contentArea = null;
            this.footer = null;
            this.collapseButton = null;
        }

        init() {
            this.container = this._createPanelContainer();
            this._addEventListeners();
            document.body.appendChild(this.container);
            this.updateCollapseState(true);
        }

        _createPanelContainer() {
            this.contentArea = Utils.createElement('div', { id: 'study-assistant-content' });
            this.collapseButton = Utils.createElement('button', {
                className: 'study-control-btn',
                children: ['−'],
                title: 'Thu gọn/Mở rộng'
            });
            const closeButton = Utils.createElement('button', {
                className: 'study-control-btn',
                children: ['×'],
                title: 'Đóng panel'
            });
            closeButton.onclick = () => this.setVisible(false);
            const renderMathButton = Utils.createElement('button', {
                className: 'study-control-btn',
                children: ['∑'],
                title: 'Render lại công thức Toán (MathJax)'
            });
            renderMathButton.onclick = () => this.finalizeRender();
            const settingsButton = Utils.createElement('button', {
                className: 'study-control-btn',
                children: ['⚙'],
                title: 'Thông tin phiên bản & thiết bị'
            });
            settingsButton.onclick = () => {
                alert(
                    `Study Assistant Pro v${Config.VERSION}\n` +
                    `Phiên bản miễn phí đã loại bỏ xác thực.`
                );
            };
            const titleSpan = Utils.createElement('span', {
                className: 'study-header-title',
                children: [
                    '🎓 Study Assistant Pro',
                    Utils.createElement('span', {
                        className: 'study-status-badge',
                        children: ['PRO']
                    }),
                    Utils.createElement('span', {
                        className: 'study-version-pill',
                        children: [`v${Config.VERSION}`]
                    })
                ]
            });
            this.header = Utils.createElement('div', {
                className: 'study-assistant-header',
                children: [
                    titleSpan,
                    Utils.createElement('div', {
                        className: 'study-controls',
                        children: [renderMathButton, settingsButton, this.collapseButton, closeButton]
                    })
                ]
            });
            this.summaryBar = Utils.createElement('div', {
                className: 'study-summary',
                children: [
                    Utils.createElement('div', {
                        className: 'summary-pill summary-questions',
                        children: [
                            Utils.createElement('span', { className: 'summary-label', children: ['Câu hỏi'] }),
                            Utils.createElement('span', { className: 'summary-value', children: ['0'] })
                        ]
                    }),
                    Utils.createElement('div', {
                        className: 'summary-pill summary-hints',
                        children: [
                            Utils.createElement('span', { className: 'summary-label', children: ['Gợi ý'] }),
                            Utils.createElement('span', { className: 'summary-value', children: ['0'] })
                        ]
                    }),
                    Utils.createElement('div', {
                        className: 'summary-pill summary-status',
                        children: [
                            Utils.createElement('span', { className: 'summary-label', children: ['Trạng thái'] }),
                            Utils.createElement('span', { className: 'summary-value summary-status-text', children: ['Chờ dữ liệu...'] })
                        ]
                    })
                ]
            });
            this.footer = Utils.createElement('div', {
                className: 'study-footer',
                children: [
                    Utils.createElement('span', {
                        className: 'study-footer-left',
                        children: ['Tiệp Gà Cui • OLM Assistant']
                    }),
                    Utils.createElement('button', {
                        className: 'study-footer-btn',
                        children: ['🧹 Xóa panel'],
                        title: 'Xóa sạch gợi ý hiện tại',
                        onclick: () => this.clearData()
                    })
                ]
            });
            return Utils.createElement('div', {
                id: 'study-assistant-container',
                style: {
                    left: `${this.position.x}px`,
                    top: `${this.position.y}px`
                },
                children: [this.header, this.summaryBar, this.contentArea, this.footer]
            });
        }

        _addEventListeners() {
            this.collapseButton.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleCollapse();
            });
            this.header.addEventListener('dblclick', () => this.toggleCollapse());
            this.header.addEventListener('click', () => {
                if (this.isCollapsed) this.toggleCollapse();
            });
            this._setupDragEvents();
        }

        _setupDragEvents() {
            let isDragging = false;
            let startX, startY, initialX, initialY;
            const startDrag = (e) => {
                if (e.target.classList.contains('study-control-btn') || this.isCollapsed) return;
                isDragging = true;
                this.container.classList.add('dragging');
                const touch = e.touches ? e.touches[0] : e;
                startX = touch.clientX;
                startY = touch.clientY;
                const rect = this.container.getBoundingClientRect();
                initialX = rect.left;
                initialY = rect.top;
                document.addEventListener('mousemove', onDrag, { passive: false });
                document.addEventListener('touchmove', onDrag, { passive: false });
                document.addEventListener('mouseup', stopDrag);
                document.addEventListener('touchend', stopDrag);
                e.preventDefault();
            };
            const onDrag = (e) => {
                if (!isDragging) return;
                const touch = e.touches ? e.touches[0] : e;
                const dx = touch.clientX - startX;
                const dy = touch.clientY - startY;
                let newX = Math.max(10, Math.min(initialX + dx, window.innerWidth - this.container.offsetWidth - 10));
                let newY = Math.max(10, Math.min(initialY + dy, window.innerHeight - this.container.offsetHeight - 10));
                this.container.style.left = `${newX}px`;
                this.container.style.top = `${newY}px`;
                e.preventDefault();
            };
            const stopDrag = () => {
                isDragging = false;
                this.container.classList.remove('dragging');
                document.removeEventListener('mousemove', onDrag);
                document.removeEventListener('touchmove', onDrag);
                document.removeEventListener('mouseup', stopDrag);
                document.removeEventListener('touchend', stopDrag);
                this._savePosition();
            };
            this.header.addEventListener('mousedown', startDrag);
            this.header.addEventListener('touchstart', startDrag);
        }

        _savePosition() {
            const rect = this.container.getBoundingClientRect();
            this.position = { x: rect.left, y: rect.top };
            GM_setValue('panelPosition', this.position);
        }

        toggleCollapse() {
            this.isCollapsed = !this.isCollapsed;
            this.updateCollapseState();
            GM_setValue('isPanelCollapsed', this.isCollapsed);
        }

        updateCollapseState(isInitial = false) {
            if (!isInitial) this.container.style.transition = 'all 0.25s ease';
            this.container.classList.toggle('collapsed', this.isCollapsed);
            this.collapseButton.innerHTML = this.isCollapsed ? '+' : '−';
            if (!isInitial) {
                setTimeout(() => {
                    this.container.style.transition = '';
                }, 260);
            }
        }

        setVisible(isVisible) {
            if (this.container) {
                this.container.style.display = isVisible ? 'flex' : 'none';
            }
        }

        clearData() {
            if (!this.contentArea) return;
            this.contentArea.innerHTML = '';
            this.contentArea.appendChild(
                Utils.createElement('div', {
                    className: 'study-no-data',
                    children: ['🔍 Đang chờ dữ liệu câu hỏi từ OLM...']
                })
            );
            this.setSummary({
                questionCount: 0,
                hintCount: 0,
                statusText: 'Chờ dữ liệu...'
            });
        }

        setSummary({ questionCount, hintCount, statusText }) {
            if (!this.summaryBar) return;
            const qEl = this.summaryBar.querySelector('.summary-questions .summary-value');
            const hEl = this.summaryBar.querySelector('.summary-hints .summary-value');
            const sEl = this.summaryBar.querySelector('.summary-status-text');
            if (qEl) qEl.textContent = Utils.formatNumber(questionCount || 0);
            if (hEl) hEl.textContent = Utils.formatNumber(hintCount || 0);
            if (sEl) sEl.textContent = statusText || 'Đã cập nhật';
        }

        // [PATCH v8.0] CẬP NHẬT HÀM NÀY ĐỂ ẨN TAG [CHỌN TỪ]
        appendQuestion(item) {
            if (!this.contentArea) return;

            if (this.contentArea.querySelector('.study-no-data')) {
                this.contentArea.innerHTML = '';
            }

            const hintSpans = item.hints.map(hint => {
                const isMultipleChoice = (hint.type === 'Trắc nghiệm' || hint.type === 'Đúng/Sai');
                const isSubIndexFill = (hint.type === 'Điền từ' && hint.subIndex);
                const isSelectText = (hint.type === 'Chọn từ'); // [NEW]

                const label = Utils.createElement('span', {
                    className: 'hint-type-label',
                    children: [`[${hint.type}]`],
                    // Ẩn label đi
                    style: { display: (isMultipleChoice || isSubIndexFill || isSelectText) ? 'none' : 'inline-block' }
                });

                const body = Utils.createElement('span', {
                    className: 'hint-text',
                    innerHTML: (hint.content || '').replace(/\n/g, '<br>')
                });

                return Utils.createElement('li', {
                    children: [label, body],
                    // Nếu là trắc nghiệm hoặc chọn từ, đổi màu border cho đẹp
                    style: {
                        borderLeftColor: (isMultipleChoice || isSelectText) ? '#22c55e' : '#6366f1'
                    }
                });
            });

            const hintBlock = Utils.createElement('div', {
                className: 'study-reference-item',
                children: [
                    Utils.createElement('div', {
                        className: 'study-reference-title',
                        children: [`📝 ${item.title} (${item.hints.length} gợi ý)`]
                    }),
                    Utils.createElement('div', {
                        className: 'study-reference-body',
                        children: [
                            hintSpans.length > 0
                                ? Utils.createElement('ul', { children: hintSpans })
                                : Utils.createElement('div', {
                                    style: {
                                        color: '#a0aec0',
                                        textAlign: 'center',
                                        padding: '10px'
                                    },
                                    children: ['Không tìm thấy gợi ý cụ thể.']
                                })
                        ]
                    })
                ]
            });

            this.contentArea.appendChild(hintBlock);
        }


        finalizeRender() {
            const render = () => {
                try {
                    if (typeof unsafeWindow.MathJax !== 'undefined' &&
                        unsafeWindow.MathJax.typesetPromise) {
                        unsafeWindow.MathJax.typesetPromise([this.contentArea])
                            .catch((err) => console.error('Lỗi render MathJax:', err));
                    }
                } catch (e) {
                    console.error('MathJax render error:', e);
                }
            };
            if (typeof unsafeWindow.MathJax !== 'undefined') {
                render();
            } else {
                console.log('[StudyAssistant] Tự động tải thư viện MathJax...');
                unsafeWindow.MathJax = {
                    tex: {
                        inlineMath: [['$', '$'], ['\\(', '\\)']],
                        displayMath: [['$$', '$$'], ['\\[', '\\]']]
                    },
                    svg: { fontCache: 'global' }
                };
                const script = Utils.createElement('script', {
                    src: 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js',
                    async: true
                });
                script.onload = render;
                document.head.appendChild(script);
            }
        }
    }

    const UIManager = {
        isPanelEnabled: GM_getValue('isScriptEnabled', false),
        panel: null,
        toggleButton: null,

        init() {
            this._injectStyles();
            this.panel = new StudyPanel();
            this.panel.init();
            this.panel.clearData();
            this.toggleButton = this._createMasterToggle();
            this.updateUIState();
        },

        updateUIState() {
            this.toggleButton.classList.remove('valid', 'invalid');
            this.toggleButton.classList.add('valid');
            if (this.isPanelEnabled) {
                this.toggleButton.innerHTML = '�';
                this.toggleButton.title = 'Tắt hỗ trợ học tập';
            } else {
                this.toggleButton.innerHTML = '�';
                this.toggleButton.title = 'Bật hỗ trợ học tập';
            }
            this.panel.setVisible(this.isPanelEnabled);
        },

        _createMasterToggle() {
            const toggle = Utils.createElement('div', { id: 'study-master-toggle' });
            toggle.addEventListener('click', () => {
                this.isPanelEnabled = !this.isPanelEnabled;
                GM_setValue('isScriptEnabled', this.isPanelEnabled);
                this.updateUIState();
            });
            document.body.appendChild(toggle);
            return toggle;
        },

        _showKeyModal() {
            // Đã xóa modal nhập key
        },

        // [PATCH v8.1] CẬP NHẬT HÀM NÀY (FIX LỆCH CÂU q_type 21)
        highlightHintsOnPage(processedQuestions) {
            document.querySelectorAll('[data-highlighted-by-study]').forEach(el => {
                el.style.backgroundColor = '';
                el.style.border = '';
                el.style.borderRadius = '';
                el.removeAttribute('data-highlighted-by-study');
            });
            const domQuestions = Array.from(
                document.querySelectorAll(
                    '.question-item, [data-question-id], div[id^="question_"], div[id^="elm-question-"]'
                )
            );
            const getNumberFromDom = (container) => {
                if (!container) return null;
                const candidates = container.querySelectorAll('a, strong, span, div, h3, h4');
                for (const el of candidates) {
                    const txt = (el.textContent || '').trim();
                    if (!txt) continue;
                    const m = txt.match(/(?:Question|Câu)\s+(\d+)/i);
                    if (m) {
                        const num = parseInt(m[1], 10);
                        if (!isNaN(num)) return num;
                    }
                }
                return null;
            };
            const getAllNumbersFromDom = (container) => {
                const numbers = [];
                if (!container) return numbers;
                const candidates = container.querySelectorAll('a, strong, span, div, h3, h4');
                for (const el of candidates) {
                    const txt = (el.textContent || '').trim();
                    if (!txt) continue;
                    const m = txt.match(/(?:Question|Câu)\s+(\d+)/i);
                    if (m) {
                        const num = parseInt(m[1], 10);
                        if (!isNaN(num) && !numbers.includes(num)) {
                            numbers.push(num);
                        }
                    }
                }
                return numbers.sort((a, b) => a - b);
            };
            processedQuestions.forEach(item => {
                const question = item.question;
                const hints = item.hints || [];
                if (!hints.length) return;
                const stringId = question._id;
                const numericId = question.id;
                let questionElement = null;
                if (stringId) {
                    questionElement =
                        document.querySelector(`.question-item[data-id="${stringId}"]`) ||
                        document.querySelector(`div[id^="question_${stringId}"]`);
                }
                if (!questionElement && numericId) {
                    questionElement =
                        document.querySelector(`div[id="elm-question-${numericId}"]`) ||
                        document.querySelector(`div[data-id="${numericId}"]`);
                }
                if (!questionElement) return;
                const container =
                    questionElement.closest('.question-item, [data-question-id]') || questionElement;

                // [FIX v8.1] Bổ sung q_type 21 (Bài đọc trắc nghiệm)
                if (item.question.q_type === 21 || item.question.q_type === 22) {
                    const displayNumbers = getAllNumbersFromDom(container);
                    if (displayNumbers.length > 0) {
                        question._displayIndices = displayNumbers;
                    }
                } else {
                    let displayIndex = getNumberFromDom(container);
                    if (!displayIndex) {
                        const idx = domQuestions.indexOf(container);
                        if (idx !== -1) displayIndex = idx + 1;
                    }
                    if (displayIndex) {
                        question._displayIndex = displayIndex;
                    }
                }
                const hintTexts = hints.map(h => h.content).filter(Boolean);
                if (!hintTexts.length) return;
                const options = container.querySelectorAll(
                    '.answer-option, .option, li, input, textarea, .dragmore, .selecttext'
                );
                options.forEach(option => {
                    const optionTextRaw = (option.textContent || option.value || '').trim();
                    if (!optionTextRaw) return;
                    const optionText = optionTextRaw.replace(/\s+/g, ' ');
                    const cleanOptionText = optionText.replace(/\s/g, '').replace(/&nbsp;/g, '');
                    const isMatch = hintTexts.some(hint => {
                        const cleanHint = (hint || '')
                            .replace(/\\/g, '')
                            .replace(/\s/g, '')
                            .replace(/&nbsp;/g, '');
                        return (
                            cleanOptionText &&
                            (cleanOptionText.includes(cleanHint) || cleanHint.includes(cleanOptionText))
                        );
                    });
                    if (isMatch) {
                        option.style.backgroundColor = 'rgba(72, 187, 120, 0.18)';
                        option.style.border = '2px solid #48bb78';
                        option.style.borderRadius = '8px';
                        option.style.transition = 'background-color 0.2s ease, transform 0.1s ease';
                        option.setAttribute('data-highlighted-by-study', 'true');
                    }
                });
            });
        },

        // [PATCH v7.9] CẬP NHẬT HÀM NÀY (FIX LỆCH CÂU)
        async processApiData(rawQuestions) {
            if (!this.isPanelEnabled) return;

            const processed = rawQuestions.map(q => ({
                question: q,
                hints: HintParser.parse(q)
            }));

            const totalHints = processed.reduce((sum, item) => sum + (item.hints?.length || 0), 0);

            // Chạy highlight TRƯỚC để gán _displayIndex/_displayIndices
            this.highlightHintsOnPage(processed);

            this.panel.clearData();
            this.panel.setVisible(true);
            this.panel.setSummary({
                questionCount: processed.length,
                hintCount: totalHints,
                statusText: 'Đã lấy dữ liệu'
            });

            let fallbackIndex = 1;
            for (const item of processed) {
                const q = item.question;
                const baseTitle = (q.title && String(q.title).trim()) || (q._id ? `ID: ${String(q._id).slice(-4)}` : (q.id || '?'));

                // [FIX v7.9] Logic tách câu MỚI, áp dụng cho BẤT KỲ câu nào có subIndex
                const hasSubIndices = item.hints.some(h => h.subIndex);

                // 1. NẾU LÀ CÂU HỎI ĐƠN (Không có subIndex)
                if (!hasSubIndices) {
                    const displayIndex = q._displayIndex || fallbackIndex++;
                    const title = `Câu ${displayIndex}: ${baseTitle}`;
                    const dataForPanel = {
                        title,
                        hints: item.hints || []
                    };
                    if (dataForPanel.hints.length > 0) {
                        this.panel.appendQuestion(dataForPanel);
                    }
                }
                // 2. NẾU LÀ CÂU HỎI GỘP (Bài đọc, Điền từ, Kéo nhóm...)
                else {
                    // Nhóm các hint lại theo subIndex của chúng
                    const groupedHints = {};
                    item.hints.forEach(hint => {
                        const index = hint.subIndex || 'general'; // 'general' cho các hint không có số (ví dụ: Nối)
                        if (!groupedHints[index]) {
                            groupedHints[index] = [];
                        }
                        groupedHints[index].push(hint);
                    });

                    // Lấy mảng số thứ tự từ bài đọc (nếu có)
                    const displayIndices = q._displayIndices || [];
                    let subIndexCounter = 0;

                    // Lặp qua các nhóm hint đã gộp
                    for (const subIndex in groupedHints) {
                        const hintsForPanel = groupedHints[subIndex];
                        if (hintsForPanel.length === 0) continue;

                        let displayIndex;
                        // Ưu tiên 1: Dùng subIndex từ parser (cho Câu 1, 2, 3...)
                        if (subIndex !== 'general' && !isNaN(parseInt(subIndex))) {
                            displayIndex = subIndex;
                        }
                        // Ưu tiên 2: Dùng mảng số câu (cho Bài đọc)
                        else if (displayIndices.length > 0) {
                            displayIndex = displayIndices[subIndexCounter] || (displayIndices[0] + subIndexCounter);
                        }
                        // Ưu tiên 3: Dùng số fallback
                        else {
                            displayIndex = (q._displayIndex || fallbackIndex) + subIndexCounter;
                        }

                        // [FIX v7.9] Gộp các hint Điền từ lại cho gọn
                        if (hintsForPanel.length > 1 && hintsForPanel.every(h => h.type === 'Điền từ')) {
                            const combinedContent = hintsForPanel.map(h => h.content).join(' | ');
                            hintsForPanel[0].content = combinedContent;
                            hintsForPanel.splice(1); // Xóa các hint thừa
                        }

                        const title = `Câu ${displayIndex}: ${baseTitle}`;
                        const dataForPanel = {
                            title,
                            hints: hintsForPanel,
                        };
                        this.panel.appendQuestion(dataForPanel);
                        subIndexCounter++;
                    }
                    fallbackIndex += subIndexCounter;
                }
                // ===== HẾT LOGIC =====

                await Utils.sleep(8);
            }
        },


        _injectStyles() {
            GM_addStyle(`
                #study-assistant-container {
                    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Inter', sans-serif;
                    position: fixed;
                    width: 460px;
                    height: 520px;
                    min-height: 220px;
                    max-height: 80vh;
                    border-radius: 18px;
                    z-index: 10001;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    background:
                        radial-gradient(circle at top left, rgba(94, 234, 212, 0.25), transparent 55%),
                        radial-gradient(circle at bottom right, rgba(129, 140, 248, 0.3), transparent 55%),
                        linear-gradient(145deg, #020617, #020617);
                    box-shadow:
                        0 18px 45px rgba(15, 23, 42, 0.85),
                        0 0 0 1px rgba(148, 163, 184, 0.3);
                    border: 1px solid rgba(148, 163, 184, 0.65);
                    backdrop-filter: blur(14px);
                    color: #e5e7eb;
                    animation: studyFadeIn 0.35s ease-out;
                }
                #study-assistant-container::before {
                    content: '';
                    position: absolute;
                    inset: -40%;
                    background:
                        radial-gradient(circle at 0% 0%, rgba(59, 130, 246, 0.4), transparent 60%),
                        radial-gradient(circle at 100% 100%, rgba(244, 114, 182, 0.35), transparent 60%);
                    opacity: 0.35;
                    filter: blur(32px);
                    z-index: -1;
                }
                #study-assistant-container.dragging {
                    transition: none !important;
                    cursor: grabbing !important;
                }
                .study-assistant-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0 18px;
                    height: 58px;
                    cursor: move;
                    flex-shrink: 0;
                    background: linear-gradient(to right, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.6));
                    border-bottom: 1px solid rgba(148, 163, 184, 0.4);
                    user-select: none;
                    -webkit-user-select: none;
                }
                .study-header-title {
                    background: linear-gradient(135deg, #60a5fa, #a855f7);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    font-size: 14px;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }
                .study-status-badge {
                    background: #22c55e;
                    color: white;
                    padding: 2px 6px;
                    border-radius: 999px;
                    font-size: 9px;
                    font-weight: 800;
                    text-transform: uppercase;
                }
                .study-version-pill {
                    padding: 2px 7px;
                    border-radius: 999px;
                    font-size: 9px;
                    border: 1px solid rgba(148, 163, 184, 0.7);
                    color: #cbd5f5;
                    background: rgba(15, 23, 42, 0.85);
                }
                .study-controls {
                    display: flex;
                    gap: 6px;
                }
                .study-control-btn {
                    width: 30px;
                    height: 30px;
                    border-radius: 10px;
                    border: none;
                    cursor: pointer;
                    background: radial-gradient(circle at 30% 0, rgba(248, 250, 252, 0.08), transparent 60%),
                                rgba(15, 23, 42, 0.9);
                    transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
                    color: #9ca3af;
                    font-size: 15px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .study-control-btn:hover {
                    transform: translateY(-1px) scale(1.03);
                    color: #e5e7eb;
                    box-shadow: 0 0 0 1px rgba(148, 163, 184, 0.6);
                    background: radial-gradient(circle at 30% 0, rgba(248, 250, 252, 0.14), transparent 60%),
                                rgba(15, 23, 42, 1);
                }
                #study-assistant-content {
                    padding: 12px 14px 10px;
                    flex: 1;
                    overflow-y: auto;
                    scroll-behavior: smooth;
                    position: relative;
                }
                #study-assistant-content::-webkit-scrollbar {
                    width: 6px;
                }
                #study-assistant-content::-webkit-scrollbar-track {
                    background: rgba(15, 23, 42, 0.8);
                }
                #study-assistant-content::-webkit-scrollbar-thumb {
                    background: linear-gradient(135deg, #6366f1, #a855f7);
                    border-radius: 999px;
                }
                .study-summary {
                    display: flex;
                    gap: 8px;
                    padding: 8px 12px 6px;
                    background: linear-gradient(to right, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.75));
                    border-bottom: 1px solid rgba(148, 163, 184, 0.35);
                    flex-shrink: 0;
                }
                .summary-pill {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    padding: 6px 9px;
                    border-radius: 10px;
                    background: radial-gradient(circle at top left, rgba(148, 163, 184, 0.22), transparent 60%),
                                rgba(15, 23, 42, 0.9);
                    border: 1px solid rgba(148, 163, 184, 0.6);
                }
                .summary-questions { border-color: rgba(59, 130, 246, 0.75); }
                .summary-hints { border-color: rgba(16, 185, 129, 0.8); }
                .summary-status { border-style: dashed; }
                .summary-label {
                    font-size: 9px;
                    text-transform: uppercase;
                    letter-spacing: 0.06em;
                    color: #9ca3af;
                    margin-bottom: 2px;
                }
                .summary-value {
                    font-size: 13px;
                    font-weight: 600;
                    color: #e5e7eb;
                }
                .summary-status-text { font-size: 12px; }

                .study-reference-item {
                    margin-bottom: 10px;
                    padding: 11px 10px;
                    background: radial-gradient(circle at top left, rgba(55, 65, 81, 0.5), transparent 65%),
                                rgba(15, 23, 42, 0.92);
                    border-radius: 12px;
                    border: 1px solid rgba(148, 163, 184, 0.5);
                    box-shadow: 0 10px 20px rgba(15, 23, 42, 0.7);
                    position: relative;
                    overflow: hidden;
                }
                .study-reference-item::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(120deg, rgba(56, 189, 248, 0.08), transparent, rgba(168, 85, 247, 0.08));
                    opacity: 0;
                    transition: opacity 0.2s ease;
                    pointer-events: none;
                }
                .study-reference-item:hover::before { opacity: 1; }
                .study-reference-title {
                    font-weight: 600;
                    color: #e5e7eb;
                    margin-bottom: 6px;
                    font-size: 13px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
                .study-reference-body ul {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }
                .study-reference-body li {
                    display: flex;
                    gap: 6px;
                    padding: 6px 8px;
                    background: rgba(15, 23, 42, 0.9);
                    border-radius: 9px;
                    border-left: 2px solid #6366f1;
                    color: #cbd5e0;
                    font-size: 12px;
                    align-items: flex-start;
                }
                .hint-type-label {
                    font-size: 10px;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    padding: 2px 5px;
                    border-radius: 999px;
                    background: rgba(55, 65, 81, 0.9);
                    border: 1px solid rgba(148, 163, 184, 0.6);
                    flex-shrink: 0;
                    color: #e5e7eb;
                }
                .hint-text {
                    font-size: 12px;
                    line-height: 1.4;
                    color: #e5e7eb;
                }
                .study-no-data {
                    text-align: center;
                    padding: 40px 16px;
                    color: #9ca3af;
                    font-size: 13px;
                }
                .study-footer {
                    height: 32px;
                    padding: 4px 10px 6px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    border-top: 1px solid rgba(148, 163, 184, 0.4);
                    background: linear-gradient(to right, rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.8));
                    font-size: 11px;
                    color: #9ca3af;
                }
                .study-footer-btn {
                    border: none;
                    font-size: 11px;
                    padding: 4px 8px;
                    border-radius: 999px;
                    background: rgba(220, 38, 38, 0.15);
                    color: #fecaca;
                    cursor: pointer;
                    border: 1px solid rgba(248, 113, 113, 0.6);
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }
                .study-footer-btn:hover { background: rgba(220, 38, 38, 0.35); }
                #study-master-toggle {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    width: 58px;
                    height: 58px;
                    border-radius: 50%;
                    cursor: pointer;
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 26px;
                    color: white;
                    transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
                    background: radial-gradient(circle at 30% 0, rgba(248, 250, 252, 0.15), transparent 55%),
                                linear-gradient(145deg, #6366f1, #7c3aed);
                    box-shadow:
                        0 14px 28px rgba(79, 70, 229, 0.55),
                        0 0 0 1px rgba(191, 219, 254, 0.6);
                    border: 2px solid rgba(255, 255, 255, 0.2);
                }
                #study-master-toggle:hover {
                    transform: translateY(-2px) scale(1.06);
                    box-shadow:
                        0 18px 40px rgba(79, 70, 229, 0.8),
                        0 0 0 1px rgba(191, 219, 254, 0.9);
                }
                #study-master-toggle.valid {
                    background: radial-gradient(circle at 30% 0, rgba(248, 250, 252, 0.15), transparent 55%),
                                linear-gradient(145deg, #22c55e, #16a34a);
                    box-shadow:
                        0 14px 28px rgba(34, 197, 94, 0.6),
                        0 0 0 1px rgba(187, 247, 208, 0.9);
                    animation: pulseGreen 1.6s infinite;
                }
                #study-master-toggle.invalid {
                    background: radial-gradient(circle at 30% 0, rgba(248, 250, 252, 0.12), transparent 55%),
                                linear-gradient(145deg, #ef4444, #b91c1c);
                    box-shadow:
                        0 14px 28px rgba(248, 113, 113, 0.65),
                        0 0 0 1px rgba(254, 202, 202, 0.9);
                }
                #study-assistant-container.collapsed {
                    width: 60px !important;
                    height: 60px !important;
                    min-height: 0;
                    border-radius: 16px;
                    transition: all 0.25s ease;
                }
                #study-assistant-container.collapsed .study-assistant-header { cursor: pointer; }
                #study-assistant-container.collapsed .study-header-title,
                #study-assistant-container.collapsed #study-assistant-content,
                #study-assistant-container.collapsed .study-controls,
                #study-assistant-container.collapsed .study-summary,
                #study-assistant-container.collapsed .study-footer {
                    display: none;
                }
                @keyframes studyFadeIn {
                    from { opacity: 0; transform: translateY(10px) scale(0.98); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes pulseGreen {
                    0%   { box-shadow: 0 14px 28px rgba(34, 197, 94, 0.55), 0 0 0 0 rgba(34, 197, 94, 0.7); }
                    70%  { box-shadow: 0 14px 28px rgba(34, 197, 94, 0.55), 0 0 0 14px rgba(34, 197, 94, 0); }
                    100% { box-shadow: 0 14px 28px rgba(34, 197, 94, 0.55), 0 0 0 0 rgba(34, 197, 94, 0); }
                }
                @media (max-width: 768px) {
                    #study-assistant-container {
                        width: calc(100vw - 28px) !important;
                        left: 14px !important;
                        right: 14px !important;
                        height: 70vh;
                    }
                    #study-master-toggle {
                        bottom: 16px;
                        right: 16px;
                    }
                }
            `);
        }
    };

    // ==================== 6. MODULE CAN THIỆP API (API INTERCEPTOR) ====================
    // (Không thay đổi)
    const ApiInterceptor = {
        _initialized: false,
        init(callback) {
            if (this._initialized) return;
            this._initialized = true;
            this._patchFetch(callback);
            this._patchXHR(callback);
        },
        _processResponse(textData, url) {
            if (Config.API_KEYWORDS.some(k => url.includes(k))) {
                try {
                    const d = JSON.parse(textData);
                    const q = d?.questions || d;
                    if (Array.isArray(q) && q.length > 0) return q;
                } catch (e) { }
            }
            return null;
        },
        _patchFetch(callback) {
            const originalFetch = unsafeWindow.fetch;
            if (!originalFetch) return;
            unsafeWindow.fetch = async (...args) => {
                const response = await originalFetch.apply(this, args);
                const requestUrl = args[0] instanceof Request ? args[0].url : args[0];
                if (response && response.ok) {
                    response.clone().text().then(text => {
                        const qs = this._processResponse(text, requestUrl);
                        if (qs) callback(qs);
                    });
                }
                return response;
            };
        },
        _patchXHR(callback) {
            const originalSend = XMLHttpRequest.prototype.send;
            XMLHttpRequest.prototype.send = function (...args) {
                this.addEventListener('load', () => {
                    if (this.status === 200) {
                        const qs = ApiInterceptor._processResponse(this.responseText, this.responseURL || '');
                        if (qs) callback(qs);
                    }
                });
                return originalSend.apply(this, args);
            };
        }
    };

    // ==================== 7. HÀM CHÍNH (MAIN EXECUTION) ====================
    // (Không thay đổi)
    async function main() {
        try {
            AuthService.init();
            UIManager.init();
            ApiInterceptor.init(UIManager.processApiData.bind(UIManager));
        } catch (e) {
            console.error('[StudyAssistant] Lỗi khởi tạo:', e);
        }
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }

})();