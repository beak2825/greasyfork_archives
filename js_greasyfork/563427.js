// ==UserScript==
// @name         LIMS Due Date 표시기
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  QC 상세 화면에서 Due Date 남은 일수 표시
// @author       김재형
// @match        https://lims3.macrogen.com/ngs/library/retrieveQcWorkDetailForm.do*
// @match        https://lims3.macrogen.com/ngs/sample/retrieveQcWorkDetailForm.do*
// @match        https://lims3.macrogen.com/ngs/library/retrieveExomeWorkDetailForm.do*
// @match        https://lims3qas.macrogen.com/ngs/library/retrieveQcWorkDetailForm.do*
// @match        https://lims3qas.macrogen.com/ngs/sample/retrieveQcWorkDetailForm.do*
// @match        https://lims3qas.macrogen.com/ngs/library/retrieveExomeWorkDetailForm.do*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/563427/LIMS%20Due%20Date%20%ED%91%9C%EC%8B%9C%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/563427/LIMS%20Due%20Date%20%ED%91%9C%EC%8B%9C%EA%B8%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const DUE_BADGE_ID = 'p50_due_badge';
    const GUARD_ATTR = 'data-p50-due-date-display';
    if (document.body.getAttribute(GUARD_ATTR)) return;
    document.body.setAttribute(GUARD_ATTR, '1');

    // Exome 페이지는 IBSheet 로딩이 오래 걸림
    const isExomePage = location.pathname.includes('ExomeWorkDetailForm');

    const CONFIG = {
        orderApiMenuCd: 'NGS100301',
        ordNoStabilizeMs: 150,
        retryDelayMs: 1000,
        observerThrottleMs: 200,
        maxFetchAttempts: 3,
        startDelayMs: isExomePage ? 1500 : 300,
        fetchTimeoutMs: 8000
    };

    const state = {
        dueDate: '',
        dueDateSource: '',
        dueDateOrdNo: '',
        dueBadgePending: false,
        ordNoSeenAt: 0,
        pendingOrdNo: '',
        nextRetryAt: 0,
        fetchAttempt: 0,
        fetchOrdNo: ''
    };

    let retryTimer = null;
    let refreshTimer = null;

    const style = document.createElement('style');
    style.textContent = `
        #${DUE_BADGE_ID}.p50-due-badge {
            position: fixed;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 4px 8px;
            border-radius: 8px;
            border: 1px solid #74c0fc;
            background: #e7f5ff;
            color: #1c7ed6;
            font-size: 12px;
            font-weight: 600;
            white-space: nowrap;
            pointer-events: auto;
            z-index: 10000;
            transform: translateY(-50%);
            box-sizing: border-box;
            cursor: pointer;
            transition: none;
            will-change: left, top;
        }
        #${DUE_BADGE_ID}[data-level="warn"] {
            border-color: #fcc419;
            background: #fff3bf;
            color: #e67700;
        }
        #${DUE_BADGE_ID}[data-level="today"] {
            border-color: #ffa94d;
            background: #fff4e6;
            color: #d9480f;
        }
        #${DUE_BADGE_ID}[data-level="overdue"] {
            border-color: #ff8787;
            background: #fff5f5;
            color: #c92a2a;
        }
        #${DUE_BADGE_ID}[data-level="unknown"] {
            border-color: #ced4da;
            background: #f8f9fa;
            color: #495057;
        }
    `;
    document.head.appendChild(style);

    function getOrderApiMenuCd() {
        return CONFIG.orderApiMenuCd;
    }

    function normalizeDate(text) {
        if (!text) return '';
        const trimmed = text.replace(/\s+/g, ' ').trim();
        const match = trimmed.match(/\b(20\d{2})[./-](\d{1,2})[./-](\d{1,2})\b/);
        if (match) {
            const [, y, m, d] = match;
            return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
        }
        const ymd = trimmed.match(/\b(20\d{2})(\d{2})(\d{2})\b/);
        if (ymd) {
            const [, y, m, d] = ymd;
            return `${y}-${m}-${d}`;
        }
        return trimmed;
    }

    function parseYmdDate(text) {
        const normalized = normalizeDate(text);
        const match = normalized.match(/\b(20\d{2})-(\d{2})-(\d{2})\b/);
        if (!match) return null;
        const [, y, m, d] = match.map(Number);
        const date = new Date(y, m - 1, d);
        if (Number.isNaN(date.getTime())) return null;
        return date;
    }

    // 2026년 대한민국 공휴일 (대체공휴일 포함)
    const HOLIDAYS_2026 = new Set([
        '2026-01-01', // 신정
        '2026-02-16', '2026-02-17', '2026-02-18', // 설날 연휴
        '2026-03-01', '2026-03-02', // 삼일절 및 대체공휴일
        '2026-05-05', // 어린이날
        '2026-05-24', '2026-05-25', // 부처님오신날 및 대체공휴일
        '2026-06-03', // 지방선거
        '2026-06-06', // 현충일
        '2026-08-15', '2026-08-17', // 광복절 및 대체공휴일
        '2026-09-24', '2026-09-25', '2026-09-26', // 추석 연휴
        '2026-10-03', '2026-10-05', // 개천절 및 대체공휴일
        '2026-10-09', // 한글날
        '2026-12-25'  // 크리스마스
    ]);

    function isBusinessDay(date) {
        const day = date.getDay();
        // 주말 체크 (0: 일요일, 6: 토요일)
        if (day === 0 || day === 6) return false;
        // 공휴일 체크
        const dateStr = date.toISOString().slice(0, 10);
        return !HOLIDAYS_2026.has(dateStr);
    }

    function countBusinessDays(startDate, endDate) {
        // startDate ~ endDate 사이의 영업일 수 계산 (startDate 제외, endDate 포함)
        const start = new Date(startDate);
        const end = new Date(endDate);
        let count = 0;
        const current = new Date(start);
        current.setDate(current.getDate() + 1); // startDate 다음날부터 시작

        while (current <= end) {
            if (isBusinessDay(current)) count++;
            current.setDate(current.getDate() + 1);
        }
        return count;
    }

    function countBusinessDaysReverse(startDate, endDate) {
        // endDate ~ startDate 사이의 영업일 수 계산 (역방향, 둘 다 제외하고 사이만)
        const start = new Date(startDate);
        const end = new Date(endDate);
        let count = 0;
        const current = new Date(end);
        current.setDate(current.getDate() + 1); // endDate 다음날부터 시작

        while (current < start) {
            if (isBusinessDay(current)) count++;
            current.setDate(current.getDate() + 1);
        }
        return count;
    }

    function formatDueCountdown(dueDate) {
        const due = parseYmdDate(dueDate);
        if (!due) {
            return { text: `Due date ${dueDate}`.trim(), level: 'unknown' };
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        due.setHours(0, 0, 0, 0);

        const diffMs = due - today;
        if (diffMs > 0) {
            // 남은 영업일 계산
            const businessDays = countBusinessDays(today, due);
            return {
                text: `Due date까지 ${businessDays}영업일`,
                level: businessDays <= 5 ? 'warn' : 'good'
            };
        }
        if (diffMs === 0) {
            return { text: 'Due date 오늘', level: 'today' };
        }
        // 지난 영업일 계산
        const businessDays = countBusinessDaysReverse(today, due);
        return { text: `Due date 지남 ${businessDays}영업일`, level: 'overdue' };
    }

    function scheduleRetry() {
        if (retryTimer) return;
        retryTimer = setTimeout(() => {
            retryTimer = null;
            refreshDueBadge();
        }, CONFIG.retryDelayMs);
    }

    function scheduleRefresh(delayMs = CONFIG.observerThrottleMs) {
        if (refreshTimer) return;
        refreshTimer = setTimeout(() => {
            refreshTimer = null;
            refreshDueBadge();
        }, delayMs);
    }

    function isElementVisible(element) {
        if (!element) return false;
        return element.offsetParent !== null || getComputedStyle(element).position === 'fixed';
    }

    function getTextValue(element) {
        if (!element) return '';
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.tagName === 'SELECT') {
            return (element.value || '').trim();
        }
        return (element.textContent || '').trim();
    }

    function isValidOrdNo(value) {
        return /^HN\d{8,10}$/.test(value) && !value.startsWith('HN00000');
    }

    function extractOrdNoFromDoc(doc) {
        const direct = doc.querySelector('#ordNo_t');
        if (direct && isValidOrdNo(direct.textContent.trim())) return direct.textContent.trim();

        const input = doc.querySelector('input[name="ordNo"], input#ordNo, input[name="ordNo_t"]');
        if (input && isValidOrdNo(input.value.trim())) return input.value.trim();

        return '';
    }

    function extractDueDateFromApi(result) {
        if (!result || typeof result !== 'object') return '';
        // API 응답에서 Due Date 관련 필드 우선순위
        // cmplPrearngeDtView: "2025-12-31" 형태 (표시용)
        // cmplPrearngeDt: "20251231" 형태 (원본)
        const candidates = [
            result.cmplPrearngeDtView,
            result.cmplPrearngeDt,
            result.goalOtdDtView,
            result.goalOtdDt
        ];
        for (const value of candidates) {
            if (!value) continue;
            const normalized = normalizeDate(String(value));
            if (normalized) return normalized;
        }
        return '';
    }

    function findActionButton() {
        const candidates = Array.from(document.querySelectorAll('button, input[type="button"], input[type="submit"], a'));
        const visible = candidates.filter(isElementVisible);
        const matchByKeywords = (keywords) => visible.find(el => {
            const text = getTextValue(el).toLowerCase();
            return keywords.some(keyword => text.includes(keyword));
        });

        const compl = matchByKeywords(['compl']);
        if (compl) return { el: compl, type: 'compl' };

        const report = matchByKeywords(['report']);
        if (report) return { el: report, type: 'report' };

        return null;
    }

    function findLogRegisterButton() {
        const candidates = Array.from(document.querySelectorAll('button, input[type="button"], input[type="submit"], a'));
        const visible = candidates.filter(isElementVisible);
        return visible.find(el => {
            const text = getTextValue(el).toLowerCase();
            return text.includes('log regist') || text.includes('log register') || text.includes('요청 사항');
        }) || null;
    }

    function bindBadgeClick(badge) {
        if (!badge || badge.dataset.p50Bound === '1') return;
        badge.dataset.p50Bound = '1';
        badge.addEventListener('click', (event) => {
            const logButton = findLogRegisterButton();
            if (!logButton) return;
            event.preventDefault();
            event.stopPropagation();
            logButton.click();
        });
    }

    function findLeftmostButton(anchor) {
        if (!anchor) return null;
        let current = anchor;
        for (let depth = 0; current && depth < 6; depth += 1) {
            const buttons = Array.from(current.querySelectorAll('button, input[type="button"], input[type="submit"], a'))
                .filter(isElementVisible);
            if (buttons.length >= 2) {
                return buttons.reduce((leftmost, btn) => {
                    const leftRect = leftmost.getBoundingClientRect();
                    const btnRect = btn.getBoundingClientRect();
                    return btnRect.left < leftRect.left ? btn : leftmost;
                }, buttons[0]);
            }
            current = current.parentElement;
        }
        return anchor;
    }

    function positionBadge(anchor, badge) {
        if (!anchor || !badge) return;
        const leftmost = findLeftmostButton(anchor);
        const rect = leftmost.getBoundingClientRect();
        const top = Math.round(rect.top + rect.height / 2);
        const badgeWidth = badge.offsetWidth || 100; // 최소 100px 여유 확보
        // 버튼 왼쪽에 충분한 간격(12px) 두고 배치
        let left = Math.round(rect.left - badgeWidth - 12);
        if (left < 8) left = 8;
        badge.style.left = `${left}px`;
        badge.style.top = `${top}px`;
        badge.style.transform = 'translateY(-50%)';
        badge.style.display = 'inline-flex';
    }

    function ensureDueBadge(anchor) {
        if (!anchor) return null;
        let badge = document.getElementById(DUE_BADGE_ID);
        if (!badge) {
            badge = document.createElement('span');
            badge.id = DUE_BADGE_ID;
            badge.className = 'p50-due-badge';
            document.body.appendChild(badge);
        }
        bindBadgeClick(badge);
        positionBadge(anchor, badge);
        return badge;
    }

    function applyDueBadgeText(badge, dueDate) {
        if (!badge) return;
        if (!dueDate) {
            badge.textContent = 'Due date 없음';
            badge.dataset.level = 'unknown';
            badge.removeAttribute('title');
            return;
        }
        const { text, level } = formatDueCountdown(dueDate);
        badge.textContent = text;
        badge.dataset.level = level;
        badge.title = `Due Date: ${dueDate}`;
    }

    async function fetchDueDateByApi(ordNo) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), CONFIG.fetchTimeoutMs);

        try {
            const url = '/ngs/order/retrieveOrdBaseInfo.do';
            const requestBody = { dataSet: { ordNo } };

            const res = await fetch(url, {
                method: 'POST',
                credentials: 'include',
                signal: controller.signal,
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                    'X-Requested-With': 'XMLHttpRequest',
                    'menuCd': getOrderApiMenuCd()
                },
                body: JSON.stringify(requestBody)
            });
            clearTimeout(timeoutId);

            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            // ArrayBuffer로 읽어서 인코딩 감지 후 디코딩
            const buffer = await res.arrayBuffer();
            const bytes = new Uint8Array(buffer);

            let text;
            // UTF-16 LE 감지: 두 번째 바이트가 0이면 UTF-16 LE
            if (bytes.length > 1 && bytes[1] === 0) {
                // UTF-16 LE → UTF-8 변환
                text = new TextDecoder('utf-16le').decode(buffer);
            } else {
                text = new TextDecoder('utf-8').decode(buffer);
            }

            // BOM 제거
            text = text.replace(/^\uFEFF/, '').replace(/^\uFFFE/, '');

            // JSON 객체 추출
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                console.error('[P50] No JSON object found in response');
                return '';
            }
            text = jsonMatch[0];

            let data;
            try {
                data = JSON.parse(text);
            } catch (e) {
                console.error('[P50] JSON parse failed:', e.message);
                console.error('[P50] Problem area:', text.substring(0, 50));
                return '';
            }

            // 에러 응답 체크
            if (data.errorCode) {
                console.warn('[P50] API error:', data.errorCode, data.errorMessage);
                return '';
            }

            const result = data?.result;
            if (!result) return '';

            return extractDueDateFromApi(result);
        } catch (error) {
            clearTimeout(timeoutId);
            console.warn('[P50] API failed:', error.message);
            return '';
        }
    }

    async function resolveDueDateForPage() {
        const ordNo = extractOrdNoFromDoc(document);
        if (!ordNo) {
            state.dueDate = '';
            state.dueDateSource = 'ordNo-not-found';
            state.dueDateOrdNo = '';
            return { ordNo: '', dueDate: '', source: 'ordNo-not-found' };
        }
        if (state.dueDateSource && state.dueDateOrdNo === ordNo) {
            return { ordNo, dueDate: state.dueDate, source: 'cache' };
        }

        const dueDate = await fetchDueDateByApi(ordNo);
        const source = dueDate ? 'api' : 'api (not found)';

        state.dueDate = dueDate;
        state.dueDateSource = source;
        state.dueDateOrdNo = ordNo;
        return { ordNo, dueDate, source };
    }

    async function refreshDueBadge() {
        if (state.dueBadgePending) return;
        const target = findActionButton();
        if (!target) {
            const badge = document.getElementById(DUE_BADGE_ID);
            if (badge) badge.style.display = 'none';
            scheduleRetry();
            return;
        }

        const badge = ensureDueBadge(target.el);
        const currentOrdNo = extractOrdNoFromDoc(document);
        if (!currentOrdNo) {
            badge.textContent = '확인 중…';
            badge.dataset.level = 'unknown';
            state.ordNoSeenAt = 0;
            state.pendingOrdNo = '';
            positionBadge(target.el, badge);
            scheduleRetry();
            return;
        }
        if (state.pendingOrdNo !== currentOrdNo) {
            state.pendingOrdNo = currentOrdNo;
            state.ordNoSeenAt = Date.now();
        }
        if (Date.now() - state.ordNoSeenAt < CONFIG.ordNoStabilizeMs) {
            badge.textContent = '확인 중…';
            badge.dataset.level = 'unknown';
            positionBadge(target.el, badge);
            scheduleRetry();
            return;
        }
        if (state.fetchOrdNo !== currentOrdNo) {
            state.fetchOrdNo = currentOrdNo;
            state.fetchAttempt = 0;
            state.nextRetryAt = 0;
            state.dueDate = '';
            state.dueDateSource = '';
            state.dueDateOrdNo = '';
        }
        if (state.dueDateSource && state.dueDateOrdNo === currentOrdNo) {
            applyDueBadgeText(badge, state.dueDate);
            positionBadge(target.el, badge);
            return;
        }

        if (state.nextRetryAt && Date.now() < state.nextRetryAt) {
            badge.textContent = '확인 중…';
            badge.dataset.level = 'unknown';
            positionBadge(target.el, badge);
            scheduleRetry();
            return;
        }

        if (state.fetchAttempt >= CONFIG.maxFetchAttempts) {
            state.dueDate = '';
            state.dueDateSource = 'order-detail (not found)';
            state.dueDateOrdNo = currentOrdNo;
            applyDueBadgeText(badge, state.dueDate);
            positionBadge(target.el, badge);
            return;
        }

        badge.textContent = '확인 중…';
        badge.dataset.level = 'unknown';
        positionBadge(target.el, badge);
        state.dueBadgePending = true;
        state.fetchAttempt += 1;
        try {
            const { dueDate, source } = await resolveDueDateForPage();
            if (source === 'ordNo-not-found') {
                badge.textContent = 'ordNo 없음';
                badge.dataset.level = 'unknown';
                return;
            }
            if (!dueDate) {
                state.nextRetryAt = Date.now() + CONFIG.retryDelayMs;
                badge.textContent = '확인 중…';
                badge.dataset.level = 'unknown';
                scheduleRetry();
                return;
            }
            state.nextRetryAt = 0;
            applyDueBadgeText(badge, dueDate);
        } catch (error) {
            console.error('[P50] due badge error:', error);
            badge.textContent = 'Due date 조회 실패';
            badge.dataset.level = 'unknown';
            scheduleRetry();
        } finally {
            state.dueBadgePending = false;
            positionBadge(target.el, badge);
        }
    }

    function startDueBadgeObserver() {
        const observer = new MutationObserver(() => {
            if (state.dueBadgePending) return;
            scheduleRefresh();
        });
        observer.observe(document.body, { childList: true, subtree: true });

        // 스크롤/리사이즈 시 출렁임 방지를 위한 throttle
        let rafPending = false;
        const updatePosition = () => {
            if (rafPending) return;
            rafPending = true;
            requestAnimationFrame(() => {
                rafPending = false;
                const target = findActionButton();
                const badge = document.getElementById(DUE_BADGE_ID);
                if (target && badge) positionBadge(target.el, badge);
            });
        };

        document.addEventListener('scroll', updatePosition, true);
        window.addEventListener('resize', updatePosition);
        refreshDueBadge();
    }

    setTimeout(startDueBadgeObserver, CONFIG.startDelayMs);
})();
