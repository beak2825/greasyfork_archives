// ==UserScript==
// @name        Zendesk Improved Billing Decision
// @namespace   http://tampermonkey.net/
// @version     3.01
// @description Formats billing decisions with collapsible blocks, refund summaries, sub status, and auto-generated response templates. Features adaptive transparent design for light/dark modes.
// @author      Artur Pozhytko
// @match       https://*.zendesk.com/agent/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/555202/Zendesk%20Improved%20Billing%20Decision.user.js
// @updateURL https://update.greasyfork.org/scripts/555202/Zendesk%20Improved%20Billing%20Decision.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const keywords = [
        'PDFAid billing decision response:',
        'PDF House billing decision response:',
        'Howly Docs billing decision response:',
    ];

    // --- List of keys/sections to hide ---
    const keysToHide = [
        'orders',
        'id',
        'mid',
        'subscription_term_number',
        'sub_product'
    ];

    // --- List of keys to reformat as dates ---
    const keysToFormatDate = [
        'created_at',
        'sub_start_date',
        'sub_end_date'
    ];

    // --- List of keys that represent amounts and should receive currency suffix ---
    const keysToApplyCurrency = [
        'refund_amount'
    ];

    const zeroDecimalCurrencies = [
        'BIF', 'CLP', 'DJF', 'GNF', 'HUF', 'JPY', 'KRW', 'LBP', 'LAK', 'MMK',
        'PYG', 'RWF', 'TWD', 'UGX', 'VND', 'UZS', 'VUV', 'XOF', 'XAF', 'XPF',
        'ISK', 'KHR', 'KMF'
    ];

    // --- Templates ---
    const TEMPLATES = {
        PARTIAL: {
            NO_FORM: `Thank you for your patience — I’ve completed the review of your request. You’re eligible for a 50% refund of your most recent charge.

This is in line with our refund policy, and we always aim to provide the best possible option based on the situation. The refund of [PLACEHOLDER 1] has been processed and should reach your account within 7 business days, though in rare cases it may take up to 30 days, depending on your payment provider. You’ll receive the funds back via your original payment method.

If you don’t see it after that time, I recommend checking directly with your payment provider for more details.

The status of your current subscription is cancelled to prevent further charges. Access will remain active until [PLACEHOLDER 2].`,

            FORM: `Thank you for your patience — I’ve completed the review of your request. You’re eligible for a 50% refund of your most recent charge.

Please note that to receive your refund, you’ll need to fill out the refund form that was sent to {{visitor email}}

Once the form is completed, the refund of [PLACEHOLDER 1] will be processed and should appear in your account within 7 business days. In rare cases, it may take up to 30 days, depending on your payment provider. The funds will be returned to your original payment method.

If you don’t see it after that time, I recommend checking directly with your payment provider for more details.

The status of your current subscription is cancelled to prevent further charges. Access will remain active until [PLACEHOLDER 2].`
        },
        FULL: {
            NO_FORM: `I’m really sorry to see you go, but I completely respect your decision.

I’ve approved your refund request, and a total of [PLACEHOLDER 1] will be returned to your account within 7 business days, though in rare cases it may take up to 30 days, depending on your payment provider. You’ll receive the funds back via your original payment method.

If you don’t see it after that time, I recommend checking directly with your payment provider for more details.

The status of your current subscription is cancelled to prevent further charges. Access will remain active until [PLACEHOLDER 2].

If there’s anything else I can assist with in the meantime, feel free to let me know.`,

            FORM: `I’m really sorry to see you go, but I completely respect your decision.

Please note that to receive your refund, you’ll need to fill out the refund form that was sent to {{visitor email}}

Once the form is completed, a total of [PLACEHOLDER 1] will be returned to your account within 7 business days, though in rare cases it may take up to 30 days, depending on your payment provider. You’ll receive the funds back via your original payment method.

If you don’t see it after that time, I recommend checking directly with your payment provider for more details.

The status of your current subscription is cancelled to prevent further charges. Access will remain active until [PLACEHOLDER 2].

If there’s anything else I can assist with in the meantime, feel free to let me know.`
        },
        REJECT: {
            NO_FORM: `I’ve carefully reviewed your account and want to clarify that your subscription was activated directly by you — full details, including the recurring fee and cancellation terms, were available during sign-up and confirmed through acceptance of our Terms of Service.

Your refund request has been rejected.

The status of your current subscription is cancelled to prevent further charges. Access will remain active until [PLACEHOLDER 2].`,

            FORM: `I’ve carefully reviewed your account and want to clarify that your subscription was activated directly by you — full details, including the recurring fee and cancellation terms, were available during sign-up and confirmed through acceptance of our Terms of Service.

Your refund request has been rejected.

The status of your current subscription is cancelled to prevent further charges. Access will remain active until [PLACEHOLDER 2].

You’ll also receive a refund form at {{visitor email}}
When you have a moment, please share your feedback there.`
        }
    };

    const toggleLinkTextShow = 'Show Billing Decision';
    const toggleLinkTextHide = 'Hide Billing Decision';
    const hiddenContentClass = 'billing-decision-hidden-content';
    const toggleLinkClass = 'billing-decision-toggle-link';
    const containerClass = 'billing-decision-container';
    const headerClass = 'billing-decision-header';
    const metaLineClass = 'billing-decision-meta-line';
    const formattedBlockClass = 'billing-decision-formatted';

    const inlineSummaryClass = 'inline-summary-container';
    const inlineSummaryItemClass = 'inline-summary-item';
    const copyBtnClass = 'billing-decision-copy-btn';
    const testId = 'omni-log-omni-to-ag-comment';

    let currentCurrencyCode = '';

    // --- Styling (v3.4 - Dynamic Status Colors & Reordering) ---
    const style = document.createElement('style');
    style.textContent = `
        :root {
            /* --- Light Theme Defaults (High Transparency) --- */
            --bd-container-bg: rgba(255, 255, 255, 0.4);
            --bd-container-border: rgba(0, 0, 0, 0.1);
            --bd-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

            --bd-header-bg: rgba(60, 130, 246, 0.08);
            --bd-header-border: rgba(60, 130, 246, 0.15);
            --bd-header-text: #003366;
            --bd-meta-text: #004a99;
            --bd-content-bg: rgba(255, 255, 255, 0.2);

            --bd-toggle-bg: rgba(255, 255, 255, 0.3);
            --bd-toggle-text: #0056b3;
            --bd-toggle-hover-bg: rgba(255, 255, 255, 0.5);
            --bd-toggle-hover-text: #003a86;
            --bd-toggle-border: rgba(0, 0, 0, 0.05);

            --bd-text-main: #333;
            --bd-key-text: #0b5bbf;
            --bd-value-text: #1f2933;
            --bd-section-title: #004b9f;
            --bd-nested-border: rgba(0, 0, 0, 0.05);
            --bd-list-bg: rgba(255, 255, 255, 0.3);
            --bd-list-border: rgba(0, 0, 0, 0.05);
            --bd-row-border: rgba(0, 0, 0, 0.03);

            /* Summary Items (Refund) - Yellow */
            --bd-sum-refund-bg: rgba(255, 215, 0, 0.12);
            --bd-sum-refund-text: #8a6d3b;
            --bd-sum-refund-border: rgba(255, 215, 0, 0.25);

            /* Summary Items (Date) - Blue */
            --bd-sum-date-bg: rgba(0, 123, 255, 0.08);
            --bd-sum-date-text: #0056b3;
            --bd-sum-date-border: rgba(0, 123, 255, 0.15);

            /* Summary Items (Response/Neutral) - Grey (Old Status) */
            --bd-sum-grey-bg: rgba(107, 114, 128, 0.08);
            --bd-sum-grey-text: #374151;
            --bd-sum-grey-border: rgba(107, 114, 128, 0.15);
            --bd-sum-grey-btn-hover-bg: rgba(107, 114, 128, 0.15);
            --bd-sum-grey-btn-border: #9ca3af;

            /* Sub Status Colors */
            /* Active - Green */
            --bd-sum-green-bg: rgba(34, 197, 94, 0.1);
            --bd-sum-green-text: #15803d;
            --bd-sum-green-border: rgba(34, 197, 94, 0.2);

            /* Paused - Orange (Distinct from Yellow) */
            --bd-sum-orange-bg: rgba(249, 115, 22, 0.1);
            --bd-sum-orange-text: #c2410c;
            --bd-sum-orange-border: rgba(249, 115, 22, 0.2);

            /* Cancelled - Red */
            --bd-sum-red-bg: rgba(239, 68, 68, 0.1);
            --bd-sum-red-text: #b91c1c;
            --bd-sum-red-border: rgba(239, 68, 68, 0.2);

            /* Redemption - Purple */
            --bd-sum-purple-bg: rgba(168, 85, 247, 0.1);
            --bd-sum-purple-text: #9333ea;
            --bd-sum-purple-border: rgba(168, 85, 247, 0.2);

            /* Buttons */
            --bd-btn-bg: rgba(255, 255, 255, 0.8);
            --bd-btn-text: #333;
            --bd-btn-border: rgba(0, 0, 0, 0.1);
            --bd-btn-hover-bg: #fff;
            --bd-btn-hover-border: #bbb;
        }

        /* --- Dark Theme Overrides (Auto-Detected) --- */
        body.bd-theme-dark {
            --bd-container-bg: rgba(0, 0, 0, 0.2);
            --bd-container-border: rgba(255, 255, 255, 0.1);
            --bd-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);

            --bd-header-bg: rgba(147, 197, 253, 0.1);
            --bd-header-border: rgba(255, 255, 255, 0.1);
            --bd-header-text: #e2e8f0;
            --bd-meta-text: #94a3b8;
            --bd-content-bg: transparent;

            --bd-toggle-bg: rgba(255, 255, 255, 0.05);
            --bd-toggle-text: #60a5fa;
            --bd-toggle-hover-bg: rgba(255, 255, 255, 0.1);
            --bd-toggle-hover-text: #93c5fd;
            --bd-toggle-border: rgba(255, 255, 255, 0.1);

            --bd-text-main: #e5e7eb;
            --bd-key-text: #60a5fa;
            --bd-value-text: #f3f4f6;
            --bd-section-title: #93c5fd;
            --bd-nested-border: rgba(255, 255, 255, 0.1);
            --bd-list-bg: rgba(255, 255, 255, 0.05);
            --bd-list-border: rgba(255, 255, 255, 0.1);
            --bd-row-border: rgba(255, 255, 255, 0.05);

            /* Summaries */
            --bd-sum-refund-bg: rgba(253, 224, 71, 0.1);
            --bd-sum-refund-text: #fde047;
            --bd-sum-refund-border: rgba(253, 224, 71, 0.2);

            --bd-sum-date-bg: rgba(147, 197, 253, 0.08);
            --bd-sum-date-text: #93c5fd;
            --bd-sum-date-border: rgba(147, 197, 253, 0.2);

            --bd-sum-grey-bg: rgba(209, 213, 219, 0.1);
            --bd-sum-grey-text: #d1d5db;
            --bd-sum-grey-border: rgba(209, 213, 219, 0.2);
            --bd-sum-grey-btn-hover-bg: rgba(209, 213, 219, 0.15);
            --bd-sum-grey-btn-border: #9ca3af;

            /* Sub Status Overrides */
            --bd-sum-green-bg: rgba(74, 222, 128, 0.1);
            --bd-sum-green-text: #4ade80;
            --bd-sum-green-border: rgba(74, 222, 128, 0.2);

            --bd-sum-orange-bg: rgba(251, 146, 60, 0.1);
            --bd-sum-orange-text: #fb923c;
            --bd-sum-orange-border: rgba(251, 146, 60, 0.2);

            --bd-sum-red-bg: rgba(248, 113, 113, 0.1);
            --bd-sum-red-text: #f87171;
            --bd-sum-red-border: rgba(248, 113, 113, 0.2);

            --bd-sum-purple-bg: rgba(192, 132, 252, 0.1);
            --bd-sum-purple-text: #c084fc;
            --bd-sum-purple-border: rgba(192, 132, 252, 0.2);

            --bd-btn-bg: rgba(30, 41, 59, 0.6);
            --bd-btn-text: #e5e7eb;
            --bd-btn-border: rgba(255, 255, 255, 0.2);
            --bd-btn-hover-bg: rgba(30, 41, 59, 1);
            --bd-btn-hover-border: #9ca3af;
        }

        .${containerClass} {
            margin-top: 10px;
            border: 1px solid var(--bd-container-border);
            border-radius: 8px;
            background: var(--bd-container-bg);
            backdrop-filter: blur(5px);
            -webkit-backdrop-filter: blur(5px);
            box-shadow: var(--bd-shadow);
            overflow: hidden;
            font-family: "Inter", "Segoe UI", sans-serif;
            max-width: 100%;
        }

        .${headerClass} {
            background: var(--bd-header-bg);
            border-bottom: 1px solid var(--bd-header-border);
            padding: 10px 14px;
            font-size: 14px;
            line-height: 1.4;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
            overflow: hidden;
        }

        .billing-decision-header-main {
            display: flex;
            align-items: center;
            font-weight: 600;
            color: var(--bd-header-text);
            flex-shrink: 1;
            min-width: 0;
        }

        .billing-decision-header-main .billing-decision-icon {
            flex-shrink: 0;
            margin-right: 8px;
            vertical-align: -3px;
            color: var(--bd-header-text);
        }

        .billing-decision-header-main span {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .${metaLineClass} {
            font-weight: 400;
            color: var(--bd-meta-text);
            font-size: 13px;
            text-align: right;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            flex-shrink: 0;
        }

        .${hiddenContentClass} {
            display: none;
            background: var(--bd-content-bg);
            padding: 10px 12px;
            transition: max-height 0.2s ease;
        }

        .${inlineSummaryClass} {
            display: flex;
            justify-content: flex-start;
            flex-wrap: wrap;
            gap: 16px;
            margin-bottom: 10px;
            padding-bottom: 10px;
            border-bottom: 1px solid var(--bd-toggle-border);
        }

        .${inlineSummaryItemClass} {
            display: flex;
            flex-direction: column;
            padding: 6px 10px;
            border-radius: 6px;
            flex-grow: 0;
            flex-shrink: 0;
            min-width: 100px;
            box-shadow: 0 1px 3px var(--bd-shadow);
        }

        .inline-summary-refund {
            background: var(--bd-sum-refund-bg);
            color: var(--bd-sum-refund-text);
            border: 1px solid var(--bd-sum-refund-border);
        }

        .inline-summary-date {
            background: var(--bd-sum-date-bg);
            color: var(--bd-sum-date-text);
            border: 1px solid var(--bd-sum-date-border);
        }

        /* --- New Status Classes --- */
        .inline-summary-status-active {
            background: var(--bd-sum-green-bg);
            color: var(--bd-sum-green-text);
            border: 1px solid var(--bd-sum-green-border);
            min-width: 80px;
        }
        .inline-summary-status-paused {
            background: var(--bd-sum-orange-bg);
            color: var(--bd-sum-orange-text);
            border: 1px solid var(--bd-sum-orange-border);
            min-width: 80px;
        }
        .inline-summary-status-cancelled {
            background: var(--bd-sum-red-bg);
            color: var(--bd-sum-red-text);
            border: 1px solid var(--bd-sum-red-border);
            min-width: 80px;
        }
        .inline-summary-status-purple { /* Redemption */
            background: var(--bd-sum-purple-bg);
            color: var(--bd-sum-purple-text);
            border: 1px solid var(--bd-sum-purple-border);
            min-width: 80px;
        }

        /* Response is now Grey */
        .inline-summary-response {
            background: var(--bd-sum-grey-bg);
            color: var(--bd-sum-grey-text);
            border: 1px solid var(--bd-sum-grey-border);
        }

        .inline-summary-label {
            font-size: 11px;
            font-weight: 500;
            margin-bottom: 2px;
            opacity: 0.75;
        }

        .inline-summary-value {
            font-size: 14px;
            font-weight: 700;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
        }

        .${copyBtnClass} {
            background: var(--bd-btn-bg);
            border: 1px solid var(--bd-btn-border);
            border-radius: 4px;
            color: var(--bd-btn-text);
            font-size: 10px;
            padding: 3px 8px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.2s;
            flex-shrink: 0;
        }

        /* Grey buttons for Response block */
        .inline-summary-response .${copyBtnClass} {
            border-color: var(--bd-sum-grey-btn-border);
            color: var(--bd-sum-grey-text);
        }

        .${copyBtnClass}:hover {
            background: var(--bd-btn-hover-bg);
            border-color: var(--bd-btn-hover-border);
        }

        .inline-summary-response .${copyBtnClass}:hover {
            background: var(--bd-sum-grey-btn-hover-bg);
            border-color: var(--bd-sum-grey-btn-border);
        }

        .${copyBtnClass}.copied {
            background: #dff0d8;
            color: #3c763d;
            border-color: #d6e9c6;
        }

        .${toggleLinkClass} {
            display: flex;
            align-items: center;
            justify-content: space-between;
            text-align: left;
            color: var(--bd-toggle-text);
            cursor: pointer;
            text-decoration: none;
            font-size: 13px;
            font-weight: 600;
            padding: 9px 14px;
            background: var(--bd-toggle-bg);
            border-top: 1px solid var(--bd-toggle-border);
            transition: background 0.15s, color 0.15s;
        }

        .${toggleLinkClass}:hover {
            background: var(--bd-toggle-hover-bg);
            color: var(--bd-toggle-hover-text);
        }

        .${toggleLinkClass}::after {
            content: '▶';
            font-size: 10px;
            margin-left: 10px;
            transition: transform 0.2s ease, color 0.15s;
            transform: rotate(0deg);
            color: var(--bd-toggle-text);
        }

        .${toggleLinkClass}:hover::after {
            color: var(--bd-toggle-hover-text);
        }

        .${toggleLinkClass}.expanded::after {
            transform: rotate(90deg);
        }

        .${hiddenContentClass}.visible {
            display: block;
            animation: fadeIn 0.18s ease;
        }

        .${formattedBlockClass} {
            font-family: "Inter", "Segoe UI", sans-serif;
            font-size: 13px;
            line-height: 1.5;
            color: var(--bd-text-main);
            white-space: pre-wrap;
            word-break: break-word;
        }

        .${formattedBlockClass} .kv {
            display: flex;
            gap: 8px;
            align-items: flex-start;
            padding: 3px 0;
            border-bottom: 1px solid var(--bd-row-border);
        }

        .${formattedBlockClass} .kv:last-child {
            border-bottom: none;
        }

        .${formattedBlockClass} .key {
            color: var(--bd-key-text);
            min-width: 120px;
            font-weight: 600;
            flex: 0 0 120px;
        }

        .${formattedBlockClass} .value {
            color: var(--bd-value-text);
            flex: 1 1 auto;
            white-space: pre-wrap;
            word-break: break-word;
        }

        .${formattedBlockClass} .section-title {
            margin-top: 6px;
            font-weight: 700;
            color: var(--bd-section-title);
            padding: 4px 0 2px;
            border-bottom: 1px solid var(--bd-header-border);
        }

        .${formattedBlockClass} .nested {
            margin-top: 6px;
            padding-left: 12px;
            border-left: 3px solid var(--bd-nested-border);
            padding-bottom: 6px;
        }

        .${formattedBlockClass} .list-item {
            margin: 4px 0;
            padding: 6px;
            background: var(--bd-list-bg);
            border: 1px solid var(--bd-list-border);
            border-radius: 6px;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-4px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);

    // --- Helpers ---
    function checkThemeAndApply() {
        const bg = window.getComputedStyle(document.body).backgroundColor;
        const rgb = bg.match(/\d+/g);
        let isDark = false;
        if (rgb) {
            const brightness = (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000;
            if (brightness < 128) isDark = true;
        }

        if (isDark) {
            if (!document.body.classList.contains('bd-theme-dark')) {
                document.body.classList.add('bd-theme-dark');
            }
        } else {
            if (document.body.classList.contains('bd-theme-dark')) {
                document.body.classList.remove('bd-theme-dark');
            }
        }
    }

    function formatSubStatus(rawValue) {
        if (!rawValue) return '';
        const v = rawValue.trim().toLowerCase();

        if (v === 'active') return 'Active';
        if (v === 'soft-cancelled') return 'Cancelled (Soft)';
        if (v === 'paused') return 'Paused';
        if (v === 'cancelled') return 'Cancelled';
        if (v === 'redemption') return 'Redemption';

        return v.charAt(0).toUpperCase() + v.slice(1);
    }

    function parseLines(raw) {
        const rawLines = raw.split('\n');
        return rawLines.map(l => ({ raw: l, line: l.replace(/\r/g, ''), indent: l.match(/^(\s*)/)[1].length }));
    }

    function extractCurrencyCode(subProductValue) {
        if (!subProductValue) return '';
        const match = subProductValue.match(/sub_([a-z]{3})_/i);
        if (match && match[1]) {
            return match[1].toUpperCase();
        }
        return '';
    }

    function formatDateString(isoString) {
        try {
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const date = new Date(isoString.endsWith('Z') ? isoString : `${isoString}Z`);

            if (isNaN(date.getTime())) return isoString;
            return `${date.getUTCDate()} ${months[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
        } catch (e) {
            return isoString;
        }
    }

    function formatKeyString(key) {
        if (!key) return '';
        const withSpaces = key.replace(/_/g, ' ');
        return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
    }

    function formatAmount(amount, currency) {
        const floatVal = parseFloat(amount);
        if (!isNaN(floatVal)) {
            if (currency && zeroDecimalCurrencies.includes(currency)) {
                return floatVal.toFixed(0);
            }
            return floatVal.toFixed(2);
        }
        return amount;
    }

    function formatBillingText(raw) {
        const lines = parseLines(raw).filter(o => o.line.trim() !== '');
        const container = document.createElement('div');
        container.className = formattedBlockClass;

        currentCurrencyCode = '';
        let totalRefund = 0;
        let subEndDateRaw = '';
        let subStatusRaw = '';
        let currentBlockData = {};

        let hasPartial = false;
        let hasFull = false;
        let hasReject = false;

        for (let i = 0; i < lines.length; i++) {
            const trimmed = lines[i].line.trim();
            const kvMatch = trimmed.match(/^([^:]+):\s*(.*)$/);
            if (kvMatch) {
                const key = kvMatch[1].trim().toLowerCase();
                const value = kvMatch[2].trim();

                if (key === 'sub_product' && !currentCurrencyCode) {
                    currentCurrencyCode = extractCurrencyCode(value);
                } else if (key === 'sub_end_date' && !subEndDateRaw) {
                    subEndDateRaw = value;
                } else if (key === 'sub_status' && !subStatusRaw) {
                    subStatusRaw = value;
                }
            }
        }

        const checkAndAddRefund = (data) => {
            const resultRaw = (data['result'] || data['status'] || '').toLowerCase();
            const amountRaw = data['refund_amount'];

            if (resultRaw.includes('partial') || resultRaw === 'partial_refund') {
                hasPartial = true;
            } else if (resultRaw.includes('full') || resultRaw === 'full_refund') {
                hasFull = true;
            } else if (resultRaw === 'reject' || resultRaw === 'refund_rejected') {
                hasReject = true;
            }

            if ((resultRaw === 'full_refund' || resultRaw === 'partial_refund' || resultRaw.includes('refund')) && amountRaw) {
                const amountFloat = parseFloat(amountRaw);
                if (!isNaN(amountFloat)) {
                    totalRefund += amountFloat;
                }
            }
        };

        let i = 0;
        let currentSection = container;

        while (i < lines.length) {
            const { line, indent } = lines[i];
            const trimmed = line.trim();

            if (/^[A-Za-z0-9_]+:\s*$/.test(trimmed) && indent === 0) {
                checkAndAddRefund(currentBlockData);
                currentBlockData = {};

                const title = trimmed.replace(':', '');
                if (keysToHide.includes(title.toLowerCase())) {
                    i++;
                    while (i < lines.length && lines[i].indent > indent) i++;
                    continue;
                }
                const sectionTitle = document.createElement('div');
                sectionTitle.className = 'section-title';
                sectionTitle.textContent = formatKeyString(title);
                container.appendChild(sectionTitle);

                const sectionBody = document.createElement('div');
                sectionBody.className = 'nested';
                container.appendChild(sectionBody);
                currentSection = sectionBody;
                i++;
                continue;
            }

            if (trimmed.startsWith('-')) {
                checkAndAddRefund(currentBlockData);
                currentBlockData = {};

                const listItem = document.createElement('div');
                listItem.className = 'list-item';
                let itemData = {};

                const afterDash = trimmed.slice(1).trim();
                if (afterDash) {
                    const kvMatch = afterDash.match(/^([^:]+):\s*(.*)$/);
                    if (kvMatch) {
                        const key = kvMatch[1].trim();
                        const value = kvMatch[2].trim();
                        itemData[key.toLowerCase()] = value;
                        if (!keysToHide.includes(key.toLowerCase())) {
                            listItem.appendChild(makeKVRow(key, value));
                        }
                    } else {
                        const p = document.createElement('div');
                        p.className = 'kv';
                        p.innerHTML = `<div class="value">${afterDash}</div>`;
                        listItem.appendChild(p);
                    }
                }

                i++;
                while (i < lines.length && lines[i].indent > indent) {
                    const subLine = lines[i].line.trim();
                    const kvMatch = subLine.match(/^([^:]+):\s*(.*)$/);
                    if (kvMatch) {
                        const key = kvMatch[1].trim();
                        const value = kvMatch[2].trim();
                        itemData[key.toLowerCase()] = value;
                        if (!keysToHide.includes(key.toLowerCase())) {
                            listItem.appendChild(makeKVRow(key, value));
                        }
                    } else {
                        const extra = document.createElement('div');
                        extra.className = 'kv';
                        extra.innerHTML = `<div class="value">${subLine}</div>`;
                        listItem.appendChild(extra);
                    }
                    i++;
                }

                (currentSection || container).appendChild(listItem);
                checkAndAddRefund(itemData);
                continue;
            }

            const kvMatch = trimmed.match(/^([^:]+):\s*(.*)$/);
            if (kvMatch) {
                const key = kvMatch[1].trim();
                const value = kvMatch[2].trim();
                currentBlockData[key.toLowerCase()] = value;
                if (!keysToHide.includes(key.toLowerCase())) {
                    const kvRow = makeKVRow(key, value);
                    (currentSection || container).appendChild(kvRow);
                }
                i++;
                continue;
            }

            const plain = document.createElement('div');
            plain.className = 'kv';
            plain.innerHTML = `<div class="value">${trimmed}</div>`;
            (currentSection || container).appendChild(plain);
            i++;
        }

        checkAndAddRefund(currentBlockData);

        return {
            element: container,
            totalRefund: totalRefund,
            totalRefundFormatted: formatAmount(totalRefund, currentCurrencyCode),
            currency: currentCurrencyCode,
            subEndDateRaw: subEndDateRaw,
            subStatusRaw: subStatusRaw,
            detectedFlags: { hasPartial, hasFull, hasReject }
        };
    }

    function makeKVRow(key, value) {
        const kv = document.createElement('div');
        kv.className = 'kv';
        const k = document.createElement('div');
        k.className = 'key';
        k.textContent = formatKeyString(key) + ':';
        const v = document.createElement('div');
        v.className = 'value';

        if (keysToApplyCurrency.includes(key.toLowerCase()) && currentCurrencyCode) {
            const finalValue = formatAmount(value, currentCurrencyCode);
            v.textContent = `${finalValue} ${currentCurrencyCode}`;
        }
        else if (keysToFormatDate.includes(key.toLowerCase())) {
            v.textContent = formatDateString(value);
        }
        else {
            v.textContent = value;
        }

        kv.appendChild(k);
        kv.appendChild(v);
        return kv;
    }

    function createSummaryItem(label, displayValue, valueToCopy, typeClass, buttonLabel) {
        const item = document.createElement('div');
        item.className = `${inlineSummaryItemClass} ${typeClass}`;

        const labelDiv = document.createElement('div');
        labelDiv.className = 'inline-summary-label';
        labelDiv.textContent = label;

        const valueDiv = document.createElement('div');
        valueDiv.className = 'inline-summary-value';

        if (displayValue) {
            const valSpan = document.createElement('span');
            valSpan.textContent = displayValue;
            valueDiv.appendChild(valSpan);
        }

        // Only add button if valueToCopy is provided (Sub status can pass null)
        if (valueToCopy) {
            const copyBtn = document.createElement('button');
            copyBtn.className = copyBtnClass;
            const btnText = buttonLabel || 'Copy';
            copyBtn.textContent = btnText;
            copyBtn.title = `Copy to clipboard`;

            copyBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(valueToCopy).then(() => {
                    copyBtn.textContent = 'Copied!';
                    copyBtn.classList.add('copied');
                    setTimeout(() => {
                        copyBtn.textContent = btnText;
                        copyBtn.classList.remove('copied');
                    }, 1500);
                });
            });
            valueDiv.appendChild(copyBtn);
        }

        item.appendChild(labelDiv);
        item.appendChild(valueDiv);
        return item;
    }

    function createMultiButtonSummaryItem(label, buttonsConfig, typeClass) {
        const item = document.createElement('div');
        item.className = `${inlineSummaryItemClass} ${typeClass}`;

        const labelDiv = document.createElement('div');
        labelDiv.className = 'inline-summary-label';
        labelDiv.textContent = label;

        const valueDiv = document.createElement('div');
        valueDiv.className = 'inline-summary-value';

        buttonsConfig.forEach(config => {
            const copyBtn = document.createElement('button');
            copyBtn.className = copyBtnClass;
            copyBtn.textContent = config.label;
            copyBtn.title = `Copy to clipboard`;

            copyBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(config.text).then(() => {
                    copyBtn.textContent = 'Copied!';
                    copyBtn.classList.add('copied');
                    setTimeout(() => {
                        copyBtn.textContent = config.label;
                        copyBtn.classList.remove('copied');
                    }, 1500);
                });
            });
            valueDiv.appendChild(copyBtn);
        });

        item.appendChild(labelDiv);
        item.appendChild(valueDiv);
        return item;
    }

    function extractMeta(text) {
        const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
        return lines.join(' • ');
    }

    function extractRequesterEmail(text) {
        const match = text.match(/Requester email:\s*([^\s]+)/i);
        return match ? match[1] : '';
    }

    function processCommentElement(commentEl) {
        if (commentEl.querySelector(`.${containerClass}`)) return;

        checkThemeAndApply();

        const fullText = commentEl.textContent || '';
        let foundKeyword = null;
        let keywordIndex = -1;

        for (const keyword of keywords) {
            const index = fullText.indexOf(keyword);
            if (index !== -1 && (keywordIndex === -1 || index < keywordIndex)) {
                keywordIndex = index;
                foundKeyword = keyword;
            }
        }

        if (!foundKeyword || keywordIndex === -1) return;

        const beforeKeyword = fullText.substring(0, keywordIndex).trim();
        const keywordAndAfter = fullText.substring(keywordIndex);
        const metaText = extractMeta(beforeKeyword);
        const contentToHideText = keywordAndAfter.substring(foundKeyword.length).replace(/^\n+/, '');

        const requesterEmail = extractRequesterEmail(beforeKeyword);

        const header = document.createElement('div');
        header.className = headerClass;
        const headerMain = document.createElement('div');
        headerMain.className = 'billing-decision-header-main';
        const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="billing-decision-icon"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`;
        headerMain.innerHTML = iconSvg + '<span>' + foundKeyword + '</span>';
        header.appendChild(headerMain);

        if (metaText) {
            const metaLine = document.createElement('div');
            metaLine.className = metaLineClass;
            metaLine.textContent = metaText;
            header.appendChild(metaLine);
        }

        const {
            element: formattedContent,
            totalRefund,
            totalRefundFormatted,
            currency,
            subEndDateRaw,
            subStatusRaw,
            detectedFlags
        } = formatBillingText(contentToHideText);

        const subEndDateFormatted = subEndDateRaw ? formatDateString(subEndDateRaw) : null;
        const subStatusFormatted = subStatusRaw ? formatSubStatus(subStatusRaw) : null;

        const displayTotal = `${totalRefundFormatted} ${currency}`;

        const hiddenSpan = document.createElement('div');
        hiddenSpan.className = hiddenContentClass;

        let selectedTemplateInfo = null;
        if (detectedFlags.hasPartial) {
            selectedTemplateInfo = TEMPLATES.PARTIAL;
        } else if (detectedFlags.hasFull) {
            selectedTemplateInfo = TEMPLATES.FULL;
        } else if (detectedFlags.hasReject) {
            selectedTemplateInfo = TEMPLATES.REJECT;
        }

        let refundSummaryItem = null;
        let dateSummaryItem = null;
        let statusSummaryItem = null;
        let responseSummaryItem = null;
        let hasSummary = false;

        // 1. REFUND
        if (totalRefund > 0) {
            hasSummary = true;
            refundSummaryItem = createSummaryItem(
                'To be refunded',
                displayTotal,
                displayTotal,
                'inline-summary-refund'
            );
        }

        // 2. STATUS (with color logic, no copy button)
        if (subStatusFormatted) {
            hasSummary = true;
            let statusClass = 'inline-summary-status-active'; // Default to green if unknown?

            // Map formatted text to class
            if (subStatusFormatted === 'Active') statusClass = 'inline-summary-status-active';
            else if (subStatusFormatted === 'Paused') statusClass = 'inline-summary-status-paused';
            else if (subStatusFormatted === 'Cancelled (Soft)' || subStatusFormatted === 'Cancelled') statusClass = 'inline-summary-status-cancelled';
            else if (subStatusFormatted === 'Redemption') statusClass = 'inline-summary-status-purple';
            else statusClass = 'inline-summary-status-active'; // Fallback

            statusSummaryItem = createSummaryItem(
                'Sub status',
                subStatusFormatted,
                null, // NO COPY BUTTON
                statusClass
            );
        }

        // 3. DATE
        if (subEndDateFormatted && subEndDateFormatted !== subEndDateRaw) {
            hasSummary = true;
            dateSummaryItem = createSummaryItem(
                'Sub end date',
                subEndDateFormatted,
                subEndDateFormatted,
                'inline-summary-date'
            );
        }

        // 4. RESPONSE (GREY)
        if (selectedTemplateInfo) {
            hasSummary = true;

            const processPlaceholders = (text) => {
                let t = text || '';

                // If status is Cancelled or Redemption, remove the "Access will remain active until" phrase
                if (subStatusFormatted === 'Cancelled' || subStatusFormatted === 'Redemption') {
                    t = t.replace(/\s*Access will remain active until \[PLACEHOLDER 2\]\./g, '');
                }

                t = t.replace(/\[PLACEHOLDER 1\]/g, displayTotal);
                t = t.replace(/\[PLACEHOLDER 2\]/g, subEndDateFormatted || subEndDateRaw || 'N/A');
                if (requesterEmail) {
                    t = t.replace(/\{\{visitor email\}\}/g, requesterEmail);
                    t = t.replace(/\{\{visitor_email\}\}/g, requesterEmail);
                }
                return t;
            };

            const noFormText = processPlaceholders(selectedTemplateInfo.NO_FORM);
            const formText = processPlaceholders(selectedTemplateInfo.FORM);

            responseSummaryItem = createMultiButtonSummaryItem(
                'Copy response',
                [
                    { label: 'Casual', text: noFormText },
                    { label: 'Form', text: formText }
                ],
                'inline-summary-response' // CSS updated to Grey
            );
        }

        if (hasSummary) {
            const inlineSummaryContainer = document.createElement('div');
            inlineSummaryContainer.className = inlineSummaryClass;

            // ORDER: Status -> Refund -> Date -> Response
            if (statusSummaryItem) inlineSummaryContainer.appendChild(statusSummaryItem);
            if (refundSummaryItem) inlineSummaryContainer.appendChild(refundSummaryItem);
            if (dateSummaryItem) inlineSummaryContainer.appendChild(dateSummaryItem);
            if (responseSummaryItem) inlineSummaryContainer.appendChild(responseSummaryItem);

            hiddenSpan.appendChild(inlineSummaryContainer);
        }

        hiddenSpan.appendChild(formattedContent);

        const container = document.createElement('div');
        container.className = containerClass;
        container.appendChild(header);

        const toggleLink = document.createElement('div');
        toggleLink.className = toggleLinkClass;
        toggleLink.textContent = toggleLinkTextShow;

        container.appendChild(toggleLink);
        container.appendChild(hiddenSpan);

        commentEl.textContent = '';
        commentEl.appendChild(container);

        toggleLink.addEventListener('click', (e) => {
            e.preventDefault();
            const isVisible = hiddenSpan.classList.toggle('visible');
            toggleLink.classList.toggle('expanded', isVisible);
            toggleLink.textContent = isVisible ? toggleLinkTextHide : toggleLinkTextShow;
        });
    }

    const observer = new MutationObserver((mutationsList) => {
        checkThemeAndApply();
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.getAttribute('data-test-id') === testId) {
                            processCommentElement(node);
                        }
                        const commentElements = node.querySelectorAll(`[data-test-id="${testId}"]`);
                        commentElements.forEach(processCommentElement);
                    }
                });
            }
        }
    });

    checkThemeAndApply();
    observer.observe(document.body, { childList: true, subtree: true });
    console.log('✅ Billing Decision Formatter (v3.0) loaded.');
})();