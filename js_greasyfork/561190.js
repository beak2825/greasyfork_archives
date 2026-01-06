// ==UserScript==
// @name         LANraragi 现代主题
// @namespace    https://github.com/Kelcoin
// @version      3.3
// @description  更现代化、简介、美观的 LANraragi 主题
// @author       Kelcoin
// @include      https://lanraragi*/*
// @include      http://lanraragi*/*
// @match        https://lrr.tvc-16.science/*
// @grant        none
// @run-at       document-end
// @icon         https://github.com/Difegue/LANraragi/raw/dev/public/favicon.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561190/LANraragi%20%E7%8E%B0%E4%BB%A3%E4%B8%BB%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/561190/LANraragi%20%E7%8E%B0%E4%BB%A3%E4%B8%BB%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const modernCss = `
    :root {
        --glass-bg: rgba(28, 30, 36, 0.96);
        --glass-bg-hover: rgba(40, 43, 52, 0.98);
        --glass-border: rgba(140, 160, 190, 0.28);
        --accent-color: #4a9ff0;
        --text-primary: #e3e9f3;
        --text-secondary: #a7b1c2;
        --shadow-card: 0 4px 18px rgba(0, 0, 0, 0.36);
        --shadow-soft: 0 10px 28px -8px rgba(5, 10, 25, 0.72);
        --shadow-hover: 0 14px 34px -6px rgba(5, 12, 32, 0.9);
        --radius-lg: 16px;
        --radius-md: 10px;
        --radius-sm: 6px;
        --transition-smooth: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    }

    *,
    *::before,
    *::after {
        box-sizing: border-box !important;
    }

    body {
        background: radial-gradient(circle at top, #22242b 0%, #171821 40%, #15161e 100%) !important;
        background-attachment: fixed !important;
        color: var(--text-primary) !important;
        font-family: "Geist", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Microsoft YaHei", sans-serif !important;
        line-height: 1.5 !important;
    }

    .tippy-content .caption {
        padding: 0 !important;
        margin: 0 !important;
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        backdrop-filter: none !important;
    }

    .tippy-content .caption img {
        border-radius: 4px !important;
        max-width: 100% !important;
        height: auto !important;
        display: block !important;
    }

    .stdbtn,
    .favtag-btn:not(select),
    .searchbtn,
    input[type="button"],
    input[type="submit"],
    .tagger > ul > li,
    label[for="thumbnail-crop"] {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        vertical-align: middle !important;
        height: auto !important;
        min-height: 32px !important;
        line-height: 1.2 !important;
        padding: 4px 12px !important;
        margin: 3px !important;
        background: rgba(10, 12, 18, 0.7) !important;
        border: 1px solid var(--glass-border) !important;
        border-radius: var(--radius-md) !important;
        color: var(--text-secondary) !important;
        font-weight: normal !important;
        transition: all 0.2s ease;
        box-shadow: none !important;
        text-decoration: none !important;
        outline: none !important;
    }

    .tippy-content div.gt,
    .id1 div.gt,
    .caption-tags div.gt {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        vertical-align: middle !important;
        height: auto !important;
        min-height: 32px !important;
        line-height: 1.2 !important;
        padding: 4px 12px !important;
        margin: 3px !important;
        background: rgba(10, 12, 18, 0.7) !important;
        border: 1px solid var(--glass-border) !important;
        border-radius: var(--radius-md) !important;
        color: var(--text-secondary) !important;
        font-weight: normal !important;
        transition: all 0.2s ease;
        box-shadow: none !important;
        text-decoration: none !important;
        outline: none !important;
    }

    div.gt,
    .tippy-content div.gt,
    .id1 div.gt,
    .tagger > ul > li,
    tr.gtr,
    tr.gtr0,
    tr.gtr1,
    .tippy-content,
    .tippy-content[style] {
        background: transparent !important;
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
    }

    div.gt a,
    .tagger > ul > li a {
        color: inherit !important;
        text-decoration: none !important;
        display: block !important;
        line-height: inherit !important;
        border: none !important;
    }

    .stdbtn:hover,
    .favtag-btn:not(select):hover,
    .searchbtn:hover,
    .tippy-content div.gt:hover,
    .id1 div.gt:hover,
    .tagger > ul > li:hover,
    div.gt:hover,
    .tagger > ul > li:hover,
    .caption-tags div.gt:hover,
    label[for="thumbnail-crop"]:hover {
        background: var(--accent-color) !important;
        color: #f7fbff !important;
        border-color: rgba(206, 224, 255, 0.55) !important;
        transform: translateY(-1px);
    }

    .favtag-btn.toggled,
    .category-active {
        background: var(--accent-color) !important;
        color: #f7fbff !important;
        border-color: rgba(206, 224, 255, 0.55) !important;
        font-weight: 600 !important;
    }

    input[type="text"],
    input[type="password"],
    input[type="search"],
    select {
        height: 36px !important;
        line-height: normal !important;
        padding: 0 10px !important;
        background: rgba(12, 14, 20, 0.8) !important;
        border: 1px solid var(--glass-border) !important;
        border-radius: var(--radius-md) !important;
        color: var(--text-primary) !important;
        font-family: inherit !important;
        font-size: 0.9rem !important;
        vertical-align: middle !important;
        display: inline-block !important;
    }

    #namespace-sortby,
    #page-select,
    #columnCount {
        background: rgba(14, 16, 24, 0.9) !important;
        border-radius: var(--radius-md) !important;
        border: 1px solid var(--glass-border) !important;
        color: var(--text-primary) !important;
    }

    #namespace-sortby option,
    #page-select option,
    #columnCount option {
        background: #20222c !important;
        color: var(--text-primary) !important;
    }

    select {
        -moz-appearance: none;
        text-align: center;
    }

    input:focus,
    select:focus {
        border-color: var(--accent-color) !important;
        background: rgba(10, 14, 22, 0.95) !important;
        box-shadow: 0 0 0 2px rgba(74, 159, 240, 0.28);
        outline: none !important;
    }

    label {
        display: inline-flex !important;
        align-items: center !important;
        vertical-align: middle !important;
        line-height: normal !important;
        gap: 6px !important;
        cursor: pointer;
    }

    input[type="checkbox"] {
        margin: 0 !important;
        vertical-align: middle !important;
        width: 16px !important;
        height: 16px !important;
        position: relative !important;
        top: 0 !important;
        cursor: pointer;
    }

    div.sni,
    .option-flyout,
    .caption:not(#tagContainer):not(.caption-tags):not(.id1 .caption) {
        background: var(--glass-bg) !important;
        backdrop-filter: blur(14px) !important;
        -webkit-backdrop-filter: blur(14px);
        border: 1px solid var(--glass-border) !important;
        box-shadow: var(--shadow-soft) !important;
        border-radius: var(--radius-lg) !important;
    }

    table.itg {
        background: var(--glass-bg) !important;
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
        border: 1px solid var(--glass-border) !important;
        box-shadow: var(--shadow-soft) !important;
        border-radius: var(--radius-lg) !important;
    }

    .logo-container {
        background-color: transparent !important;
        border-bottom: 1px solid rgba(140, 160, 190, 0.26);
        margin-bottom: 10px;
    }

    div.ido {
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        width: 98% !important;
        max-width: 98vw !important;
        margin: 0 auto !important;
        padding: 0 !important;
    }

    #toppane {
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        width: 100% !important;
        max-width: 100% !important;
        margin: 0 auto !important;
        padding: 0 !important;
    }

    .idi {
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        gap: 12px !important;
        background: var(--glass-bg) !important;
        padding: 20px !important;
        border-radius: var(--radius-lg) !important;
        border: 1px solid var(--glass-border) !important;
        position: relative !important;
        z-index: 10 !important;
        margin: 10px auto 24px auto !important;
        max-width: 1200px !important;
        width: 96% !important;
    }

    #index,
    .index,
    .index .index-gallery,
    .index-gallery,
    .index-carousel,
    .main,
    #content,
    .content {
        width: 90% !important;
        max-width: 98vw !important;
        margin: 0 auto !important;
    }

    #category-container {
        width: 100% !important;
        display: flex !important;
        flex-wrap: wrap !important;
        justify-content: center !important;
        gap: 6px !important;
        margin: 0 0 6px 0 !important;
        padding: 4px 0 10px 0 !important;
        border-bottom: 1px solid var(--glass-border) !important;
    }

    #search-bar-row {
        width: 100% !important;
        display: flex !important;
        flex-direction: row !important;
        flex-wrap: nowrap !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 8px !important;
        margin-top: 4px !important;
        margin-bottom: 10px !important;
    }

    #search-bar-row .awesomplete {
        flex: 1 1 auto !important;
        min-width: 150px !important;
        width: auto !important;
        display: block !important;
        position: relative !important;
    }

    #search-input {
        width: 100% !important;
        margin: 0 !important;
        text-align: left !important;
        padding-left: 15px !important;
    }

    #apply-search,
    #clear-search {
        flex: 0 0 auto !important;
        width: auto !important;
        padding: 0 20px !important;
        margin: 0 !important;
        white-space: nowrap !important;
    }

    .table-options {
        background: var(--glass-bg) !important;
        padding: 12px 18px !important;
        border-radius: var(--radius-lg) !important;
        margin: 16px auto 20px auto !important;
        border: 1px solid var(--glass-border) !important;
        display: flex !important;
        flex-wrap: wrap !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 18px !important;
        width: fit-content !important;
        max-width: 100% !important;
        text-align: center !important;
        transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.4s ease !important;
        z-index: 900 !important;
    }

    #thumbnail-crop {
        position: absolute;
        opacity: 0;
        pointer-events: none;
    }

    label[for="thumbnail-crop"] {
        all: unset !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        padding: 4px 12px !important;
        margin: 3px !important;
        min-height: 32px !important;
        width: 57px !important;
        border-radius: var(--radius-md) !important;
        background: rgba(10, 12, 18, 0.7) !important;
        border: 1px solid var(--glass-border) !important;
        color: var(--text-secondary) !important;
        cursor: pointer !important;
        transition: all 0.2s ease !important;
    }

    label[for="thumbnail-crop"]:hover {
        background: var(--accent-color) !important;
        color: #f7fbff !important;
        border-color: rgba(206, 224, 255, 0.55) !important;
        transform: translateY(-1px);
    }

    #thumbnail-crop:checked ~ label[for="thumbnail-crop"] {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        width: 57px !important;
        max-width: 100% !important;

        background: var(--accent-color) !important;
        color: #f7fbff !important;
        border-color: rgba(206, 224, 255, 0.55) !important;
        font-weight: 600 !important;
    }

    .Toastify__toast-container {
        z-index: 9999;
        padding: 0 !important;
    }

    .Toastify__toast-container--top-left {
        top: 18px !important;
        left: 18px !important;
    }

    .Toastify__toast-container--top-right {
        top: 18px !important;
        right: 18px !important;
    }

    .Toastify__toast-container--bottom-left {
        bottom: 18px !important;
        left: 18px !important;
    }

    .Toastify__toast-container--bottom-right {
        bottom: 18px !important;
        right: 18px !important;
    }

    .Toastify__toast {

        background: var(--glass-bg, rgba(10, 12, 18, 0.9)) !important;
        border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.08)) !important;
        border-radius: var(--radius-lg, 12px) !important;
        box-shadow: var(--shadow-card, 0 18px 40px rgba(0, 0, 0, 0.55)) !important;
        backdrop-filter: blur(12px) !important;
        -webkit-backdrop-filter: blur(12px) !important;

        color: var(--text-primary, #e6edf7) !important;
        padding: 12px 16px !important;
        min-width: 280px !important;
        max-width: 440px !important;

        box-sizing: border-box !important;
        overflow: hidden !important;

        border-radius: var(--radius-lg, 12px) !important;
    }

    .Toastify__toast-theme--light {
        background: var(--glass-bg, rgba(10, 12, 18, 0.9)) !important;
        color: var(--text-primary, #e6edf7) !important;
    }

    .Toastify__toast-body {
        display: flex !important;
        align-items: flex-start !important;
        gap: 10px !important;
        margin: 0 !important;
        padding: 0 !important;
        font-size: 14px !important;
        line-height: 1.55 !important;
    }

    .Toastify__toast-icon {
        width: 24px !important;
        height: 24px !important;
        flex-shrink: 0 !important;
    }

    .Toastify__toast-icon svg {
        width: 100% !important;
        height: 100% !important;
        fill: currentColor !important;
    }

    .Toastify__toast--info .Toastify__toast-icon {
        color: var(--accent-color, #4A9FF0) !important;
    }

    .Toastify__toast--success .Toastify__toast-icon {
        color: var(--accent-success, #3fbf7f) !important;
    }

    .Toastify__toast--error .Toastify__toast-icon {
        color: var(--accent-danger, #ff6b6b) !important;
    }

    .Toastify__toast--warning .Toastify__toast-icon {
        color: var(--accent-warning, #f4c96b) !important;
    }

    .Toastify__toast-body > div {
        color: var(--text-secondary, #a9b4c8) !important;
    }

    .Toastify__toast-body h2,
    .Toastify__toast-body h3 {
        margin: 0 0 4px 0 !important;
        font-size: 15px !important;
        font-weight: 600 !important;
        color: var(--text-primary, #ffffff) !important;
    }

    .Toastify__close-button {
        color: var(--text-secondary, #a9b4c8) !important;
        opacity: 0.8 !important;
        align-self: flex-start !important;
        margin-left: 8px !important;

        transition: opacity 0.18s ease, transform 0.18s ease !important;
    }

    .Toastify__close-button:hover {
        opacity: 1 !important;
        transform: scale(1.05) !important;
    }

    .Toastify__close-button svg {
        width: 14px !important;
        height: 14px !important;
        fill: currentColor !important;
    }

    .Toastify__progress-bar {
        height: 3px !important;
        border-radius: 0 0 var(--radius-lg, 12px) 12px !important;
        opacity: 0.9 !important;
    }

    .Toastify__toast--info .Toastify__progress-bar {
        background: linear-gradient(
            90deg,
            rgba(74, 159, 240, 0.18),
            var(--accent-color, #4A9FF0)
        ) !important;
    }

    .Toastify__toast--success .Toastify__progress-bar {
        background: linear-gradient(
            90deg,
            rgba(63, 191, 127, 0.18),
            var(--accent-success, #3fbf7f)
        ) !important;
    }

    .Toastify__toast--error .Toastify__progress-bar {
        background: linear-gradient(
            90deg,
            rgba(255, 107, 107, 0.18),
            var(--accent-danger, #ff6b6b)
        ) !important;
    }

    .Toastify__toast--warning .Toastify__progress-bar {
        background: linear-gradient(
            90deg,
            rgba(244, 201, 107, 0.18),
            var(--accent-warning, #f4c96b)
        ) !important;
    }

    #editArchiveForm {
        max-width: 1200px !important;
        width: 95% !important;
        margin: 20px auto !important;
        padding: 30px 40px !important;
        background: var(--glass-bg) !important;
        border-radius: var(--radius-lg) !important;
        box-shadow: var(--shadow-card) !important;
        border: 1px solid var(--glass-border) !important;
        overflow: visible !important;
        box-sizing: border-box !important;
    }

    #editArchiveForm table {
        display: block !important;
        width: 100% !important;
    }

    #editArchiveForm tbody {
        display: block !important;
        width: 100% !important;
    }

    #editArchiveForm tr {
        display: flex !important;
        flex-wrap: wrap !important;
        align-items: flex-start !important;
        margin-bottom: 18px !important;
        position: relative !important;
        width: 100% !important;
        box-sizing: border-box !important;
    }

    #editArchiveForm tr td:first-child {
        display: block !important;
        width: 130px !important;
        min-width: 130px !important;
        padding-top: 10px !important;
        padding-right: 15px !important;
        text-align: right !important;
        font-size: 15px !important;
        font-weight: 600 !important;
        color: var(--text-primary) !important;
        opacity: 0.9;
        box-sizing: border-box !important;
    }

    #editArchiveForm tr td:nth-child(2) {
        display: block !important;
        flex: 1 1 auto !important;
        width: auto !important;
        min-width: 0 !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
    }

    #editArchiveForm td[style*="text-align:left"][style*="vertical-align:top"] {
        font-size: 16px !important;
        font-weight: 600;
        white-space: nowrap !important;
    }

    #editArchiveForm td[style*="text-align:left"][style*="vertical-align:top"] span {
        font-size: 1em !important;
    }

    #editArchiveForm tr:nth-child(-n+4) {
        flex-direction: column !important;
        align-items: stretch !important;
    }

    #editArchiveForm tr:nth-child(-n+4) td:first-child {
        width: 100% !important;
        min-width: 0 !important;
        padding-top: 0 !important;
        padding-right: 0 !important;
        padding-bottom: 6px !important;
        text-align: left !important;
    }

    #editArchiveForm tr:nth-child(-n+4) td:nth-child(2) {
        flex: 0 0 100% !important;
        width: 100% !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
    }

    .stdinput,
    #editArchiveForm input[type="text"],
    #editArchiveForm textarea,
    #editArchiveForm select {
        width: 100% !important;
        background: rgba(12, 14, 20, 0.4) !important;
        border: 1px solid var(--glass-border) !important;
        box-sizing: border-box !important;
        border-radius: var(--radius-md) !important;
        padding: 10px 14px !important;
        color: var(--text-primary) !important;
        font-family: inherit !important;
        font-size: 14px !important;
        transition: var(--transition-smooth) !important;
        box-shadow: none !important;
    }

    .stdinput:focus,
    #editArchiveForm textarea:focus,
    #editArchiveForm select:focus {
        border-color: var(--accent-color) !important;
        background: rgba(12, 14, 20, 0.7) !important;
        outline: none !important;
    }

    #editArchiveForm textarea#summary {
        resize: vertical !important;
        min-height: 80px !important;
    }

    #editArchiveForm tr.lrredit-row--stacked .lrredit-control {
        width: 100%;
        overflow: hidden;
        background: rgba(12, 14, 20, 0.4) !important;
        border: 1px solid var(--glass-border) !important;
        border-radius: var(--radius-md) !important;
        box-sizing: border-box !important;
        padding: 0 !important;
    }

    #editArchiveForm tr.lrredit-row--stacked .lrredit-control > input,
    #editArchiveForm tr.lrredit-row--stacked .lrredit-control > textarea {
        width: 100% !important;
        min-width: 0 !important;

        border: none !important;
        background: transparent !important;
        box-shadow: none !important;
        border-radius: 0 !important;

        padding: 10px 14px !important;
        color: var(--text-primary) !important;
        font-family: inherit !important;
        font-size: 14px !important;

        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }

    .tagger {
        max-width: 100% !important;
        box-sizing: border-box !important;
    }

    .tagger.wrap {
        display: flex !important;
        flex-wrap: wrap !important;
        gap: 8px !important;
        padding: 8px !important;
        background: rgba(0, 0, 0, 0.2) !important;
        border: 1px solid var(--glass-border) !important;
        border-radius: var(--radius-md) !important;
        width: 100% !important;
        box-sizing: border-box !important;
    }

    .tagger > ul {
        display: contents !important;
    }

    .tagger > ul > li {
        display: inline-flex !important;
        align-items: center !important;
        height: 30px !important;
        padding: 0 10px 0 14px !important;
        background: rgba(74, 159, 240, 0.05) !important;
        border: 1px solid rgba(74, 159, 240, 0.3) !important;
        border-radius: 50px !important;
        font-size: 13px !important;
        color: #fff !important;
        white-space: nowrap !important;
        margin: 0 !important;
        max-width: 100% !important;
    }

    .tagger > ul > li > a:first-child {
        display: flex !important;
        align-items: center !important;
        text-decoration: none !important;
        color: inherit !important;
        background: transparent !important;
    }

    .tagger > ul > li .label {
        margin-right: 4px !important;
        max-width: 300px !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        background: transparent !important;
    }

    .tagger > ul > li .close {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        width: 20px !important;
        height: 20px !important;
        border-radius: 50% !important;
        font-size: 16px !important;
        line-height: 1 !important;
        margin-left: 2px !important;
        color: rgba(255, 255, 255, 0.6) !important;
        transition: all 0.2s !important;
        cursor: pointer !important;
    }

    .tagger > ul > li .close:hover {
        background-color: rgba(255, 255, 255, 0.2) !important;
        color: #fff !important;
    }

    .tagger-new {
        flex: 0 0 auto !important;
        min-width: 150px !important;
        max-width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        background: transparent !important;
        border: none !important;
    }

    .tagger-new input {
        background: transparent !important;
        border: none !important;
        border-bottom: 2px solid rgba(255,255,255,0.1) !important;
        border-radius: 0 !important;
        padding: 0 5px !important;
        height: 30px !important;
        color: #fff !important;
        field-sizing: content !important;
    }

    .tagger-new input:focus {
        border-bottom-color: var(--accent-color) !important;
        background: transparent !important;
    }

    #editArchiveForm #tagText,
    #editArchiveForm #arg {
        width: 100% !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
        background: rgba(12, 14, 20, 0.4) !important;
        border: 1px solid var(--glass-border) !important;
        border-radius: var(--radius-md) !important;
        padding: 10px 14px !important;
        color: var(--text-primary) !important;
        font-family: inherit !important;
        font-size: 14px !important;
    }

    #editArchiveForm #tagText {
        resize: vertical !important;
    }

    #plugin-block {
        max-width: 640px;
        margin: 8px auto 0 auto;
        padding: 4px 0 0 0;
        background: none;
        border: none;
        box-shadow: none;
        box-sizing: border-box;
        text-align: center;
    }

    #plugin-block-title {
        font-size: 15px;
        font-weight: 600;
        color: var(--text-primary);
        margin: 0 0 8px 0;
    }

    #editArchiveForm #plugin_table::before {
        content: '';
    }

    #editArchiveForm #plugin_table {

    }

    #editArchiveForm table tbody tr:nth-child(6) td:first-child {
        display: none !important;
    }

    #plugin-block .plugin-row {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
    }

    .plugin-row {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
    }

    #show-help {
        order: 0;
    }

    #plugin {
        order: 1;
    }

    #run-plugin {
        order: 2;
    }

    #arg_label {
        display: block !important;
        width: 100% !important;
        margin: 12px auto 2px auto !important;
        max-width: 640px;
        font-size: 0.85rem !important;
        color: var(--text-secondary) !important;
        text-align: left;
    }

    #arg {
        display: block !important;
        margin: 4px auto 0 auto !important;
        width: 100% !important;
        max-width: 640px !important;
        box-sizing: border-box !important;
    }

    #plugin-warning {
        display: flex;
        align-items: flex-start;
        gap: 6px;
        margin: 10px auto 0 auto;
        max-width: 640px;
        font-size: 12px;
        color: var(--text-secondary);
        opacity: 0.9;
        text-align: left;
    }

    #plugin-warning-icon {
        font-size: 14px;
        line-height: 1;
        color: var(--accent-warning, #f4c96b);
        margin-top: 2px;
    }

    #plugin_table i.fa-exclamation-circle {
        display: none !important;
    }

    #arg_label {
        display: block !important;
        text-align: center !important;
        margin-top: 10px !important;
        width: 100%;
    }

    #plugin-warning {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        margin-top: 8px;

        text-align: center;
    }

    #plugin-block {
        text-align: center;
    }

    #editArchiveForm tr:last-child {
        margin-top: 30px !important;
        margin-bottom: 0 !important;
        justify-content: center !important;
    }

    #editArchiveForm tr:last-child td {
        display: flex !important;
        width: 100% !important;
        justify-content: center !important;
        align-items: center !important;
        gap: 30px !important;
        padding: 0 !important;
    }

    #editArchiveForm #save-metadata,
    #editArchiveForm #delete-archive,
    #editArchiveForm #read-archive,
    #editArchiveForm #goback {
        min-width: 140px !important;
        height: 44px !important;
        font-size: 15px !important;
        font-weight: 600 !important;
        margin: 0 !important;
    }

    #editArchiveForm #save-metadata {
        background: rgba(74, 159, 240, 0.15) !important
        #color: #f7fbff !important;
        border-color: var(--accent-color) !important;
    }

    #editArchiveForm #delete-archive {
        background: rgba(220, 53, 69, 0.15) !important;
        border-color: rgba(220, 53, 69, 0.5) !important;
        color: #ff6b6b !important;
    }
    #editArchiveForm #delete-archive:hover {
        background: rgba(220, 53, 69, 0.85) !important;
        color: #fff !important;
        box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3) !important;
        transform: translateY(-2px);
    }

    #editArchiveForm #delete-archive {
        order: 1 !important;
    }

    #editArchiveForm #save-metadata {
        order: 2 !important;
    }

    #editArchiveForm #goback {
        order: 3 !important;
    }

    form#editPluginForm .left-column,
    form#editPluginForm .right-column {
        width: 100% !important;
        float: none !important;
        display: block !important;
        max-width: 1200px !important;
    }

    form#editPluginForm .left-column {
        margin: 0 auto 0 auto !important;
    }

    form#editPluginForm .right-column {
        margin: 0 auto 15px auto !important;
    }

    form#editPluginForm .left-column ul.collapsible {
        margin-bottom: 0 !important;
    }

    form#editPluginForm > h1 {
        display: flex !important;
        justify-content: center !important;
        align-items: center !important;
        flex-wrap: wrap !important;
        gap: 15px !important;
    }

    #editPluginForm input[type="text"],
    #editPluginForm input[type="password"],
    #editPluginForm input[type="number"],
    #editPluginForm input.stdinput,
    #editPluginForm input:not([type]),
    #editPluginForm textarea,
    #editPluginForm select {
        width: 400px !important;
        max-width: 400px !important;
        height: 38px !important;
        background: rgba(12, 14, 20, 0.4) !important;
        border: 1px solid var(--glass-border) !important;
        border-radius: 6px !important;
        padding: 0 10px !important;
        color: var(--text-primary) !important;
        font-family: inherit !important;
        font-size: 14px !important;
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
        box-shadow: none !important;
        margin: 4px 0 !important;
        box-sizing: border-box !important;
    }

    #editPluginForm #urlfinder_ARG {
        width: 100% !important;
        max-width: 100% !important;
        height: 38px !important;

        background: rgba(12, 14, 20, 0.4) !important;
        border: 1px solid var(--glass-border) !important;
        border-radius: 6px !important;

        padding: 0 10px !important;
        margin: 4px 0 !important;

        color: var(--text-primary) !important;
        font-family: inherit !important;
        font-size: 14px !important;

        box-sizing: border-box !important;
    }

    #editPluginForm textarea {
        height: auto !important;
        min-height: 80px !important;
        padding: 10px !important;
        resize: vertical !important;
    }

    #editPluginForm input:focus,
    #editPluginForm textarea:focus,
    #editPluginForm select:focus {
        border-color: var(--accent-color) !important;
        background: rgba(12, 14, 20, 0.7) !important;
        outline: none !important;
        box-shadow: 0 0 0 2px rgba(74, 159, 240, 0.28) !important;
    }

    #editPluginForm input[type=number]::-webkit-outer-spin-button,
    #editPluginForm input[type=number]::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    #editPluginForm input[type=number] {
        -moz-appearance: textfield;
    }

    #editPluginForm input[type="checkbox"] {
        appearance: none !important;
        -webkit-appearance: none !important;
        width: 50px !important;
        height: 26px !important;
        background: rgba(20, 22, 28, 0.6) !important;
        border: 1px solid var(--glass-border) !important;
        border-radius: 20px !important;
        position: relative !important;
        cursor: pointer !important;
        transition: all 0.3s ease !important;
        flex-shrink: 0 !important;
        vertical-align: middle !important;
        margin: 0 0 0 8px !important;
        top: -2px !important;
        outline: none !important;
    }

    #editPluginForm input[type="checkbox"]::before {
        content: '' !important;
        position: absolute !important;
        top: 3px !important;
        left: 4px !important;
        width: 18px !important;
        height: 18px !important;
        border-radius: 50% !important;
        background: #5c6b7f !important;
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
        box-shadow: none !important;
    }

    #editPluginForm input[type="checkbox"]:checked {
        background: rgba(74, 159, 240, 0.2) !important;
        border-color: var(--accent-color) !important;
    }

    #editPluginForm input[type="checkbox"]:checked::before {
        left: 26px !important;
        background: var(--accent-color) !important;
        box-shadow: 0 0 10px var(--accent-color) !important;
    }

    #editPluginForm input[type="checkbox"]::after {
        content: none !important;
        display: none !important;
    }

    #editPluginForm table td input[type="checkbox"] {
        margin-top: 4px !important;
    }
    #editPluginForm div[style*="float:right"] input[type="checkbox"] {
        margin-left: 10px !important;
    }

    .option-flyout:has(.fa-paint-brush) {
        display: none !important;
    }

    #editConfigForm table,
    #editConfigForm tbody {
        display: block !important;
        width: 100% !important;
    }

    #editConfigForm tr {
        display: flex !important;
        flex-wrap: wrap !important;
        align-items: center !important;
        border-bottom: 1px solid rgba(255,255,255,0.05);
        padding: 15px 0 !important;
        margin: 0 !important;
        width: 100% !important;
    }

    #editConfigForm .option-td {
        display: flex !important;
        align-items: center !important;
        justify-content: flex-end !important;
        width: 200px !important;
        flex: 0 0 200px !important;
        padding-right: 20px !important;
        box-sizing: border-box !important;
    }

    #editConfigForm .option-td h2.ih {
        margin: 0 !important;
        font-size: 15px !important;
        color: var(--text-primary) !important;
        white-space: nowrap !important;
        width: auto !important;
    }

    #editConfigForm .config-td {
        display: flex !important;
        flex: 1 1 0 !important;
        align-items: center !important;
        flex-wrap: wrap !important;
        padding: 0 !important;
        border: none !important;
        gap: 15px !important;
    }

    #editConfigForm .config-control-wrapper {
        flex: 0 0 auto !important;
        width: 300px !important;
        max-width: 100% !important;
    }

    #editConfigForm .config-desc-text {
        flex: 1 1 200px !important;
        font-size: 13px !important;
        line-height: 1.5 !important;
        color: var(--text-secondary) !important;
        margin: 0 !important;
        padding: 0 !important;
        white-space: normal !important;
        text-align: left !important;
        opacity: 0.8;
    }

    #editPluginForm .collapsible-body > span[style*="border-bottom"] {
        display: block !important;
        width: 100% !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
        background: rgba(255, 255, 255, 0.03) !important;
        border: 1px solid var(--glass-border) !important;
        border-radius: 12px !important;
        padding: 10px !important;
        margin-bottom: -20px !important;
        position: relative !important;
        text-align: left !important;
    }

    #editPluginForm .collapsible-body > span {
        border-bottom: 1px solid transparent !important;
    }

    #editPluginForm .collapsible-body > span > br {
        display: none !important;
    }

    #editPluginForm i.fa-puzzle-piece,
    #editPluginForm img[src*="data:image"] {
        font-size: 24px !important;
        width: 24px !important;
        height: 24px !important;
        margin-right: 10px !important;
        color: var(--accent-color) !important;
        vertical-align: middle !important;
        display: inline-block !important;
    }

    #editPluginForm h2.ih {
        font-size: 16px !important;
        font-weight: 700 !important;
        color: var(--text-primary) !important;
        display: inline !important;
        margin: 0 8px 0 0 !important;
        vertical-align: middle !important;
    }

    #editPluginForm h1.ih {
        font-size: 13px !important;
        font-weight: 400 !important;
        color: var(--text-secondary) !important;
        display: inline !important;
        vertical-align: middle !important;
        margin: 0 !important;
        opacity: 0.8;
    }

    #editPluginForm .collapsible-body {
        font-size: 14px !important;
        line-height: 1.6 !important;
        color: #cfd8dc !important;
        padding: 0 !important;
    }

    #editPluginForm h1.ih::after {
        content: "";
        display: block;
        margin-bottom: 10px;
    }

    #editPluginForm div[style*="float:right"] {
        float: none !important;
        position: static !important;
        display: flex !important;
        flex-direction: row !important;
        align-items: center !important;
        justify-content: flex-end !important;
        gap: 8px !important;
        margin-top: 10px !important;
        margin-bottom: 4px !important;
        padding: 0 !important;
        background: transparent !important;
        width: 100% !important;
    }

    #editPluginForm div[style*="float:right"] > h1.ih,
    #editPluginForm div[style*="float:right"] > br {
        display: none !important;
    }

    #editPluginForm div[style*="float:right"] > input[type="checkbox"] {
        order: 2 !important;
        margin: 0 !important;
        vertical-align: middle !important;
    }

    #editPluginForm div[style*="float:right"] .plugin-dependency {
        order: 1 !important;
        display: inline-flex !important;
        align-items: center !important;
        font-size: 12px !important;
        color: var(--text-secondary) !important;
        white-space: nowrap !important;
    }

    #editPluginForm div[style*="float:right"] .plugin-dependency .fa-plug {
        font-size: 12px !important;
        margin-right: 4px !important;
    }

    #editPluginForm .collapsible-body table {
        width: 100% !important;
        margin-top: 20px !important;
        border-collapse: collapse !important;
    }

    #editPluginForm .collapsible-body tbody {
        display: block !important;
        width: 100% !important;
    }

    #editPluginForm .collapsible-body tr {
        display: flex !important;
        flex-direction: column;
        align-items: flex-start !important;
        width: 100% !important;
        border-bottom: 1px solid rgba(255,255,255,0.05);
        padding: 12px 0 !important;
    }

    #editPluginForm .collapsible-body td:first-child:not([colspan="2"]) {
        display: block !important;
        width: 100% !important;
        margin-bottom: 8px !important;
        padding: 0 !important;
        text-align: left !important;
    }

    #editPluginForm .collapsible-body td:first-child b {
        text-align: left !important;
        display: block !important;
        width: 100% !important;
        color: var(--text-primary) !important;
    }

    #editPluginForm .collapsible-body td:nth-child(2) {
        display: block !important;
        width: 100% !important;
        padding: 0 !important;
    }

    #editPluginForm .collapsible-body input:not([type="checkbox"]):not([type="button"]),
    #editPluginForm .collapsible-body select {
        width: 100% !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
    }

    #editPluginForm .collapsible-body td[colspan="2"] {
        display: block !important;
        width: 100% !important;
        border: none !important;
        padding-top: 15px !important;
        text-align: center !important;
    }

    #editPluginForm .collapsible-body input[type="button"].stdbtn {
        width: 100% !important;
        max-width: 200px !important;
        margin: 0 auto !important;
        display: block !important;
        height: 40px !important;
        font-weight: 600 !important;
        color: #fff !important;
        cursor: pointer;
    }

    form#editPluginForm > h1 {
        display: flex !important;
        justify-content: center !important;
        align-items: center !important;
        gap: 16px !important;
        flex-wrap: wrap !important;
        margin-bottom: 16px !important;
    }

    form#editPluginForm > h1 .stdbtn,
    form#editPluginForm > h1 input.stdbtn {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        min-width: 140px !important;
        height: 44px !important;
        padding: 0 20px !important;
        margin: 0 !important;
        background: rgba(30, 35, 45, 0.6) !important;
        border: 1px solid var(--glass-border) !important;
        border-radius: var(--radius-md) !important;
        color: var(--text-primary) !important;
        font-size: 15px !important;
        font-weight: 600 !important;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
        text-decoration: none !important;
        cursor: pointer !important;
    }

    form#editPluginForm > h1 .stdbtn:hover,
    form#editPluginForm > h1 input.stdbtn:hover {
        background: var(--accent-color) !important;
        color: #fff !important;
        border-color: rgba(255,255,255,0.3) !important;
        transform: translateY(-2px);
    }

    form#editPluginForm > h1 #plugin-upload {
        order: 1 !important;
    }

    form#editPluginForm > h1 #save {
        order: 2 !important;
    }

    form#editPluginForm > h1 #return {
        order: 3 !important;
    }

    form#editPluginForm > h1 #save {
        border-color: var(--accent-color) !important;
        color: #f7fbff !important;
    }

    form#editPluginForm > h1 #save:hover {
        background: var(--accent-color) !important;
        color: #fff !important;
        border-color: rgba(255,255,255,0.4) !important;
    }

    #plugin-upload > span[style*="position:absolute"] {
        position: static !important;
        top: auto !important;
        left: auto !important;
        transform: none !important;
        width: auto !important;
        display: block !important;
        margin: 0 !important;
    }

    #save, #return, #plugin-upload {
        min-width: 140px !important;
        min-height: 44px !important;
        font-size: 15px !important;
        font-weight: 600 !important;
        margin: 0 !important;
    }

    .collapsible-body {
        text-align: center !important;
    }

    .collapsible-body > h1.ih {
        display: inline-block !important;
        vertical-align: middle !important;
        margin-right: 10px !important;
        font-size: 16px !important;
    }

    input#replacetitles {
        display: inline-block !important;
        vertical-align: middle !important;
        margin-top: 0 !important;
    }

    label[for="replacetitles"] {
        display: block !important;
        margin-top: 12px !important;
        color: var(--text-secondary) !important;
        font-size: 1.2em !important;
        line-height: 1.5 !important;
        width: 100% !important;
        text-align: center !important;
    }

    label[for="replacetitles"] br {
        display: none !important;
    }

    div.ido:has(> #editConfigForm),
    div.ido.admin-settings-mode {
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        width: 95% !important;
        max-width: 1200px !important;
        margin: 20px auto !important;
    }

    div.ido:has(> #editConfigForm) > h2.ih,
    div.ido.admin-settings-mode > h2.ih {
        order: 0;
        margin-bottom: 20px !important;
        width: 100%;
        text-align: center;
    }

    div.ido:has(> #editConfigForm) > #editConfigForm,
    div.ido.admin-settings-mode > #editConfigForm {
        order: 1 !important;
        width: 100% !important;
        margin: 0 auto 30px auto !important;
        float: none !important;
        display: block !important;
        padding: 0 !important;
    }

    div.ido:has(> #editConfigForm) > #editConfigForm ul,
    div.ido.admin-settings-mode > #editConfigForm ul {
        padding: 0 !important;
        margin: 0 !important;
        width: 100% !important;
        list-style: none !important;
    }

    div.ido:has(> #editConfigForm) > #editConfigForm ul > li,
    div.ido.admin-settings-mode > #editConfigForm ul > li {
        width: 100% !important;
        max-width: 100% !important;
        margin-left: 0 !important;
        margin-right: 0 !important;
        box-sizing: border-box !important;
    }

    div.ido:has(> #editConfigForm) > .left-column,
    div.ido.admin-settings-mode > .left-column {
        order: 2 !important;
        width: 100% !important;
        float: none !important;
        padding: 0 !important;
        margin: 0 !important;
        display: flex !important;
        flex-direction: row !important;
        justify-content: space-between !important;
        flex-wrap: wrap !important;
        gap: 15px !important;
        font-size: 0 !important;
        line-height: 0 !important;
        color: transparent !important;
    }

    div.ido:has(> #editConfigForm) > .left-column::before,
    div.ido:has(> #editConfigForm) > .left-column::after,
    div.ido.admin-settings-mode > .left-column::before,
    div.ido.admin-settings-mode > .left-column::after {
        display: none !important;
        content: none !important;
    }

    div.ido:has(> #editConfigForm) > .left-column .logo-container,
    div.ido:has(> #editConfigForm) > .left-column h1,
    div.ido:has(> #editConfigForm) > .left-column h2,
    div.ido:has(> #editConfigForm) > .left-column br,
    div.ido.admin-settings-mode > .left-column .logo-container,
    div.ido.admin-settings-mode > .left-column h1,
    div.ido.admin-settings-mode > .left-column h2,
    div.ido.admin-settings-mode > .left-column br {
        display: none !important;
    }

    div.ido:has(> #editConfigForm) > .left-column .stdbtn,
    div.ido.admin-settings-mode > .left-column .stdbtn {
        font-size: 15px !important;
        line-height: 1.5 !important;
        color: var(--text-primary) !important;
        height: 48px !important;
        padding: 0 20px !important;
        margin: 0 !important;
        flex: 1 1 18% !important;
        min-width: 140px !important;
        background: rgba(30, 35, 45, 0.6) !important;
        border: 1px solid var(--glass-border) !important;
        border-radius: var(--radius-md) !important;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
    }

    div.ido:has(> #editConfigForm) > .left-column .stdbtn:hover,
    div.ido.admin-settings-mode > .left-column .stdbtn:hover {
        background: var(--accent-color) !important;
        color: #fff !important;
        border-color: rgba(255,255,255,0.3) !important;
        transform: translateY(-2px);
    }

    div.ido:has(> #editConfigForm) > .left-column #backup,
    div.ido.admin-settings-mode > .left-column #backup { order: 1; }

    div.ido:has(> #editConfigForm) > .left-column #duplicate,
    div.ido.admin-settings-mode > .left-column #duplicate { order: 2; }

    div.ido:has(> #editConfigForm) > .left-column #save,
    div.ido.admin-settings-mode > .left-column #save {
        order: 3;
        #background: rgba(74, 159, 240, 0.15) !important;
        border-color: var(--accent-color) !important;
        font-weight: bold !important;
        color: #fff !important;
    }
    div.ido:has(> #editConfigForm) > .left-column #save:hover,
    div.ido.admin-settings-mode > .left-column #save:hover {
        background: var(--accent-color) !important;
    }

    div.ido:has(> #editConfigForm) > .left-column #plugin-config,
    div.ido.admin-settings-mode > .left-column #plugin-config { order: 4; }

    div.ido:has(> #editConfigForm) > .left-column #return,
    div.ido.admin-settings-mode > .left-column #return { order: 5; opacity: 0.8; }

    .config-td {
        display: flex !important;
        flex-direction: row !important;
        align-items: flex-start !important;
        justify-content: flex-start !important;
        flex-wrap: nowrap !important;
        gap: 20px !important;
        padding: 16px 15px !important;
        border-bottom: 1px solid rgba(255,255,255,0.05);
        min-height: 60px !important;
    }

    .config-control-wrapper {
        flex: 0 0 auto !important;
        width: 240px !important;
        max-width: 240px !important;
        display: flex !important;
        align-items: center !important;
        min-height: 38px !important;
        position: relative !important;
    }

    .config-td:has(textarea) {
        flex-direction: column !important;
        align-items: stretch !important;
    }
    .config-control-wrapper:has(textarea) {
        width: 100% !important;
        max-width: 100% !important;
        flex-direction: column !important;
        align-items: flex-start !important;
        gap: 8px !important;
    }
    .config-td:has(textarea) .config-desc-text {
        margin-left: 0 !important;
        padding-top: 0 !important;
        white-space: pre-wrap !important;
    }

    .config-desc-text {
        flex: 1 1 auto !important;
        font-size: 14px !important;
        line-height: 1.6 !important;
        color: var(--text-secondary) !important;
        padding-top: 4px !important;
        cursor: text !important;
    }

    .config-td input[type="text"],
    .config-td input[type="password"],
    .config-td input[type="number"],
    .config-td input[type="search"] {
        width: 100% !important;
        height: 38px !important;
        border-radius: 6px !important;
        padding: 0 10px !important;
        margin: 0 !important;
    }

    .config-td textarea {
        width: 100% !important;
        min-height: 180px !important;
        border-radius: 6px !important;
        padding: 10px !important;
        line-height: 1.4 !important;
        margin-top: 5px !important;
    }

    td.config-td[data-is-status-row="true"] {
        display: block !important;
        width: 100% !important;
        height: auto !important;
    }

    td.config-td[data-is-status-row="true"] .config-control-wrapper,
    td.config-td[data-is-status-row="true"] .config-desc-text {
        display: inline !important;
        width: auto !important;
        margin: 0 !important;
        padding: 0 !important;
    }

    .config-td input[type="checkbox"] {
        appearance: none !important;
        -webkit-appearance: none !important;
        width: 50px !important;
        height: 26px !important;
        background: rgba(20, 22, 28, 0.6) !important;
        border: 1px solid var(--glass-border) !important;
        border-radius: 20px !important;
        position: relative !important;
        cursor: pointer !important;
        transition: all 0.3s ease !important;
        flex-shrink: 0 !important;
    }
    .config-td input[type="checkbox"]::before {
        content: '' !important;
        position: absolute !important;
        top: 3px !important;
        left: 4px !important;
        width: 18px !important;
        height: 18px !important;
        border-radius: 50% !important;
        background: #5c6b7f !important;
        transition: all 0.3s ease !important;
    }
    .config-td input[type="checkbox"]:checked {
        background: rgba(74, 159, 240, 0.2) !important;
        border-color: var(--accent-color) !important;
    }
    .config-td input[type="checkbox"]:checked::before {
        left: 26px !important;
        background: var(--accent-color) !important;
        box-shadow: 0 0 10px var(--accent-color) !important;
    }
    .config-td input[type="checkbox"]::after { content: none !important; }

    .config-td {
        display: flex !important;
        align-items: center !important;
        gap: 15px !important;
    }

    .config-desc-text {
        font-size: 14px !important;
        color: var(--text-secondary) !important;
        line-height: 1.4 !important;
        cursor: default !important;
        flex: 1;
        text-align: left;
    }

    .config-desc-text br:first-child {
        display: none !important;
    }

    .context-menu-list {
        background: var(--glass-bg) !important;
        backdrop-filter: blur(12px) !important;
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid var(--glass-border) !important;
        border-radius: var(--radius-md) !important;
        box-shadow: var(--shadow-hover) !important;
        padding: 6px 0 !important;
        font-family: inherit !important;
        min-width: 140px !important;
    }

    .context-menu-item {
        background: transparent !important;
        color: var(--text-primary) !important;
        padding: 10px 16px !important;
        line-height: 1.5 !important;
        font-size: 14px !important;
        transition: all 0.1s ease;
        margin-bottom: 1px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: flex-start !important;
    }

    .context-menu-item.context-menu-hover {
        background: var(--accent-color) !important;
        color: #fff !important;
        cursor: pointer !important;
    }

    .context-menu-item > i,
    .context-menu-item > .context-menu-icon,
    .context-menu-item::before,
    .context-menu-icon::before {
        display: none !important;
        width: 0 !important;
        margin: 0 !important;
        content: none !important;
    }

    .context-menu-item.context-menu-icon {
        background-image: none !important;
    }

    .context-menu-item > span {
        flex: 1 !important;
        text-align: left !important;
        white-space: nowrap !important;
        margin: 0 !important;
        padding: 0 !important;
    }

    .context-menu-separator {
        padding: 0 !important;
        margin: 4px 0 !important;
        border-bottom: 1px solid var(--glass-border) !important;
    }

    .context-menu-item.context-menu-disabled {
        color: var(--text-secondary) !important;
        opacity: 0.5 !important;
        background: transparent !important;
    }

    .context-menu-item.context-menu-submenu::after {
        opacity: 0.6;
        right: 10px;
    }

    .context-menu-input > label {
        color: inherit !important;
        font-weight: normal !important;
        cursor: pointer;
        margin: 0 !important;
    }
    .context-menu-input:hover > label {
        color: #fff !important;
    }

    div.swal2-popup {
        background: var(--glass-bg) !important;
        backdrop-filter: blur(16px) !important;
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid var(--glass-border) !important;
        border-radius: var(--radius-lg) !important;
        box-shadow: var(--shadow-card) !important;
        padding: 24px !important;
        width: auto !important;
        min-width: 320px !important;
        max-width: 480px !important;
        display: grid !important;
    }

    div.swal2-popup .swal2-range,
    div.swal2-popup .swal2-checkbox,
    div.swal2-popup .swal2-select,
    div.swal2-popup .swal2-radio,
    div.swal2-popup .swal2-file,
    div.swal2-popup input[type="range"],
    div.swal2-popup input[type="checkbox"],
    div.swal2-popup input[type="file"],
    div.swal2-popup select {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        height: 0 !important;
        width: 0 !important;
        margin: 0 !important;
        padding: 0 !important;
        border: none !important;
    }

    h2.swal2-title {
        color: var(--text-primary) !important;
        font-size: 1.4rem !important;
        font-weight: 600 !important;
        display: block !important;
    }

    div.swal2-html-container {
        color: var(--text-secondary) !important;
        font-size: 1rem !important;
        margin: 10px 0 20px 0 !important;
        display: block !important;
    }

    .swal2-icon {
        border-color: var(--glass-border) !important;
    }
    .swal2-icon.swal2-warning {
        border-color: var(--accent-warning, #f4c96b) !important;
        color: var(--accent-warning, #f4c96b) !important;
    }

    div.swal2-actions {
        gap: 15px !important;
        width: 100% !important;
        justify-content: center !important;
        margin-top: 10px !important;
        display: flex !important;
    }

    .swal2-styled.swal2-confirm,
    .swal2-styled.swal2-cancel {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        min-height: 40px !important;
        padding: 0 24px !important;
        font-size: 14px !important;
        font-weight: 600 !important;
        border-radius: var(--radius-md) !important;
        border: 1px solid transparent !important;
        box-shadow: none !important;
        transition: var(--transition-smooth) !important;
        outline: none !important;
        margin: 0 !important;
    }

    .swal2-styled.swal2-cancel {
        background: rgba(12, 14, 20, 0.6) !important;
        border-color: var(--glass-border) !important;
        color: var(--text-primary) !important;
        font-size: 0 !important;
    }

    .swal2-styled.swal2-cancel::after {
        content: "取消";
        font-size: 14px !important;
        color: inherit !important;
    }

    .swal2-styled.swal2-cancel:hover {
        background: rgba(30, 35, 45, 0.8) !important;
        transform: translateY(-2px);
    }
    .swal2-styled.swal2-cancel:hover {
        background: rgba(30, 35, 45, 0.8) !important;
        transform: translateY(-2px);
    }

    .swal2-styled.swal2-confirm {
        background: rgba(220, 53, 69, 0.15) !important;
        border-color: rgba(220, 53, 69, 0.5) !important;
        color: #ff6b6b !important;
    }
    .swal2-styled.swal2-confirm:hover {
        background: rgba(220, 53, 69, 0.85) !important;
        color: #fff !important;
        box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3) !important;
        transform: translateY(-2px);
    }

    .swal2-loader {
        border-color: var(--accent-color) transparent var(--accent-color) transparent !important;
    }

    #DataTables_Table_0 thead[style*="none"] {
        display: none !important;
    }

    #DataTables_Table_0 thead[style*="none"] th,
    #DataTables_Table_0 thead[style*="none"] th::before {
        border: none !important;
        background: none !important;
        display: none !important;
        height: 0 !important;
        padding: 0 !important;
    }

    #DataTables_Table_0 {
        border-collapse: separate !important;
        border-spacing: 0 6px !important;
        #margin-top: 10px !important;
        background: transparent !important;
    }

    #DataTables_Table_0 thead th {
        background: transparent !important;
        border: none !important;
        position: relative !important;
        z-index: 1;
        color: var(--text-secondary) !important;
        font-weight: 600 !important;
        text-transform: uppercase;
        font-size: 0.8rem !important;
        padding: 12px 16px !important;
    }

    #DataTables_Table_0 thead th::before {
        content: "";
        position: absolute;
        z-index: -1;
        top: 0;
        bottom: 0;
        left: 0;
        right: 10px;
        background: rgba(12, 14, 20, 0.4) !important;
        border-bottom: 1px solid var(--glass-border) !important;
        border-radius: 15px;
    }

    #DataTables_Table_0 thead th:last-child::before {
        right: 0 !important;
}

    #DataTables_Table_0 tbody tr {
        background: var(--glass-bg) !important;
        backdrop-filter: blur(10px);
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        transition: transform 0.2s ease, background 0.2s ease !important;
    }

    #DataTables_Table_0 tbody tr:hover {
        background: var(--glass-bg-hover) !important;
        transform: scale(1.005) !important;
        z-index: 5;
        position: relative;
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
        border: 1px solid var(--accent-color) !important;
    }

    #DataTables_Table_0 td {
        padding: 12px 16px !important;
        border: none !important;
        vertical-align: middle !important;
        color: var(--text-secondary) !important;
        font-size: 0.9rem !important;
    }

    #DataTables_Table_0 tbody tr td:first-child {
        border-top-left-radius: 8px;
        border-bottom-left-radius: 8px;
        border-left: 1px solid var(--glass-border);
    }
    #DataTables_Table_0 tbody tr td:last-child {
        border-top-right-radius: 8px;
        border-bottom-right-radius: 8px;
        border-right: 1px solid var(--glass-border);
    }

    #DataTables_Table_0 tbody tr td {
        border-top: 1px solid var(--glass-border) !important;
        border-bottom: 1px solid var(--glass-border) !important;
    }

    #DataTables_Table_0 td.title a {
        color: var(--text-primary) !important;
        font-weight: 600 !important;
        font-size: 1rem !important;
        text-decoration: none !important;
        display: block;
        margin-bottom: 4px;
    }
    #DataTables_Table_0 td.title a:hover {
        color: var(--accent-color) !important;
    }

    #DataTables_Table_0 .isnew {
        display: inline-block !important;
        background: var(--accent-color) !important;
        color: #fff !important;
        padding: 2px 8px !important;
        border-radius: 4px !important;
        font-size: 0.75rem !important;
        font-weight: bold !important;
        margin-right: 8px !important;
        box-shadow: 0 2px 4px rgba(74, 159, 240, 0.3);
    }

    #DataTables_Table_0 td.tags span {
        display: inline-flex !important;
        align-items: center;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 4px;
        padding: 2px 8px;
        margin: 2px 4px 2px 0;
        font-size: 0.8rem;
        color: #a7b1c2;
        transition: all 0.2s;
    }

    #DataTables_Table_0 td.tags span:hover {
        background: rgba(74, 159, 240, 0.15);
        color: var(--accent-color);
        border-color: var(--accent-color);
    }

    #DataTables_Table_0 td.title {
        position: relative;
        max-width: 40vw;
        overflow: hidden;
    }

    #DataTables_Table_0 td.title a {
        display: block !important;
        width: 90%;
        white-space: nowrap !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        padding-right: 10px;
    }

    .dataTables_wrapper .bottom,
    .dataTables_wrapper .top {
        background: transparent !important;
        padding: 10px 0 !important;
        margin-top: 10px !important;
        color: var(--text-secondary) !important;
    }

    .dataTables_wrapper .dataTables_paginate {
        display: flex !important;
        justify-content: center !important;
        align-items: center !important;
        width: 100% !important;
        float: none !important;
        margin-top: 20px !important;
        padding: 0 !important;
        text-align: center !important;
    }

    .dataTables_wrapper .dataTables_paginate .paginate_button {
        display: inline-flex !important;
        justify-content: center !important;
        align-items: center !important;
        width: auto !important;
        min-width: 36px !important;
        height: 36px !important;
        margin: 0 4px !important;
        padding: 0 8px !important;
        font-size: 14px !important;
        background: rgba(12, 14, 20, 0.6) !important;
        border: 1px solid var(--glass-border) !important;
        color: var(--text-primary) !important;
        border-radius: 6px !important;
        cursor: pointer !important;
        transition: all 0.2s ease !important;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }

    .dataTables_wrapper .dataTables_paginate .paginate_button.current,
    .dataTables_wrapper .dataTables_paginate .paginate_button:hover:not(.disabled) {
        background: var(--accent-color) !important;
        color: #fff !important;
        border-color: var(--accent-color) !important;
        font-weight: bold !important;
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(74, 159, 240, 0.3);
    }

    .dataTables_wrapper .dataTables_paginate .paginate_button.disabled,
    .dataTables_wrapper .dataTables_paginate .paginate_button.disabled:hover {
        cursor: default !important;
        color: rgba(255, 255, 255, 0.3) !important;
        background: transparent !important;
        border-color: transparent !important;
        transform: none !important;
        box-shadow: none !important;
    }

    #DataTables_Table_0 td.tags {
        max-width: 700px !important;
        white-space: nowrap !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        vertical-align: middle !important;
    }

    #DataTables_Table_0:has(thead[style*="none"]) {
        border: none !important;
        border-top: none !important;
        border-bottom: none !important;
        box-shadow: none !important;
    }

    #DataTables_Table_0.dataTable {
        border-bottom: none !important;
    }

    #DataTables_Table_0 thead[style*="none"],
    #DataTables_Table_0 thead[style*="none"] th,
    #DataTables_Table_0 thead[style*="none"] th::before {
        display: none !important;
        border: none !important;
        height: 0 !important;
        padding: 0 !important;
        margin: 0 !important;
    }

    #urlForm {
        width: 100% !important;
        min-height: 240px !important;
        box-sizing: border-box !important;
        margin: 10px 0 20px 0 !important;
        padding: 16px !important;
        resize: vertical !important;
        background-color: rgba(10, 12, 16, 0.5) !important;
        border: 1px solid rgba(140, 160, 190, 0.2) !important;
        border-radius: 12px !important;
        box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.4) !important;
        backdrop-filter: blur(4px);
        color: #a7b1c2 !important;
        font-family: "JetBrains Mono", "Fira Code", "Consolas", "Courier New", monospace !important;
        font-size: 13px !important;
        line-height: 1.6 !important;
        white-space: pre !important;
        overflow-x: auto !important;
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
        outline: none !important;
    }

    #urlForm:focus {
        background-color: rgba(12, 14, 20, 0.8) !important;
        color: #e3e9f3 !important;
        border-color: #4a9ff0 !important;
        box-shadow:
            0 0 0 3px rgba(74, 159, 240, 0.15),
            inset 0 2px 6px rgba(0, 0, 0, 0.5) !important;
    }

    #urlForm::-webkit-scrollbar {
        width: 8px;
        height: 8px;
    }
    #urlForm::-webkit-scrollbar-thumb {
        background: rgba(74, 159, 240, 0.3);
        border-radius: 4px;
    }
    #urlForm::-webkit-scrollbar-thumb:hover {
        background: rgba(74, 159, 240, 0.6);
    }
    #urlForm::-webkit-scrollbar-corner {
        background: transparent;
    }

    @media (min-width: 700px) {

        .Toastify__toast {
            min-width: 0 !important;
            max-width: calc(100vw - 24px) !important;
            margin: 0 12px !important;
        }

        .Toastify__toast-container--top-left,
        .Toastify__toast-container--top-right {
            left: 0 !important;
            right: 0 !important;
            top: 12px !important;
        }

        .Toastify__toast-container--bottom-left,
        .Toastify__toast-container--bottom-right {
            left: 0 !important;
            right: 0 !important;
            bottom: 12px !important;
        }

        .table-options {
            position: fixed !important;
            right: 12px !important;
            top: 34% !important;

            opacity: 0;
            transform: translate(200%, -50%) !important;

            transition: opacity 0.35s ease, transform 0.35s ease;

            width: 100px !important;
            padding: 16px 12px !important;

            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            gap: 14px !important;

            backdrop-filter: blur(20px) !important;
            box-shadow: -4px 4px 20px rgba(0,0,0,0.4) !important;
            text-align: center !important;
            font-size: 0.85rem !important;
            color: var(--text-secondary) !important;
            z-index: 50;
        }

        body.panel-ready .table-options {
            opacity: 1;
            transform: translate(0, -50%) !important;
        }

        .table-options.scroll-hidden {
            transform: translate(140%, -50%) !important;
            opacity: 0 !important;
            pointer-events: none !important;
        }

        .table-options .compact-options {
            display: flex;
            flex-direction: column !important;
            align-items: center !important;
            gap: 6px !important;
            width: 100% !important;
            margin: 0 !important;
        }

        .table-options .thumbnail-options:not([style*="none"]) {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            gap: 8px !important;
            width: 100% !important;
            margin: 0 !important;
        }

        .table-options .thumbnail-options[style*="none"] {
            display: none !important;
        }

        .table-options .thumbnail-options .crop-group {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 6px !important;
            width: 100% !important;
            padding: 6px 8px !important;
            border-radius: var(--radius-sm);
        }

        .table-options > div:last-child {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            gap: 8px !important;
            width: 100% !important;
            margin: 0 !important;
        }

        .table-options select,
        .table-options input {
            width: 100% !important;
            text-align: center !important;
            text-align-last: center !important;
        }

        .table-options .mode-toggle {
            margin-top: 4px !important;
        }

        .table-options .thumbnail-options .crop-group label[for="thumbnail-crop"] {
            position: relative !important;
            left: 31% !important;
            transform: translateX(-50%) !important;
            white-space: nowrap !important;
        }

        #thumbnail-crop:checked ~ label[for="thumbnail-crop"] {
            left: 31% !important;
            transform: translateX(-50%) !important;
        }

        #editPluginForm div[style*="float:right"] {
            position: absolute !important;
            top: 15px !important;
            right: 20px !important;
            width: auto !important;
            margin: 0 !important;
            padding: 0 !important;
            border-top: none !important;
            justify-content: flex-end !important;
            background: transparent !important;
        }

        #editPluginForm .stdbtn {
            width: auto !important;
            min-width: 120px !important;
        }

                #editPluginForm .collapsible-body tr {
            flex-direction: row !important;
            align-items: center !important;
        }

        #editPluginForm .collapsible-body td:first-child:not([colspan="2"]) {
            width: 30% !important;
            padding-right: 20px !important;
            margin-bottom: 0 !important;
            text-align: right !important;
        }

        #editPluginForm .collapsible-body td:nth-child(2) {
            width: 70% !important;
        }

        #editPluginForm .collapsible-body input[type="button"].stdbtn {
            width: auto !important;
            min-width: 160px !important;
        }

        #editPluginForm .collapsible-body > span {
            padding-right: 180px !important;
        }
    }

    .table-options .thumbnail-options,
    .table-options > div:last-child {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        white-space: nowrap;
    }

    .table-options .thumbnail-options {
        flex: 0 1 auto;
    }

    .table-options > div:last-child {
        margin-left: 0;
    }

    .table-options .align-right-option {
        margin-left: 0 !important;
        order: initial !important;
        align-self: center !important;
        flex: 0 1 auto !important;
    }

    .table-options .thumbnail-options .crop-group {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        align-self: center !important;
        gap: 4px !important;
        width: auto !important;
        padding: 6px 8px !important;
        border-radius: var(--radius-sm);
    }

    .table-options .crop-btn {
            width: 100% !important;
            margin: 0 !important;
        }

    .table-options #order-sortby,
    .table-options .mode-toggle {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        vertical-align: middle !important;
        height: 36px !important;
        line-height: 1 !important;
        padding: 0 6px !important;
        font-size: 1.5rem !important;
        width: 36px !important;
        border: none !important;
        color: var(--text-secondary) !important;
        cursor: pointer !important;
        transition: color 0.2s, transform 0.2s;
    }

    .table-options #order-sortby:hover,
    .table-options .mode-toggle:hover {
        color: var(--accent-color) !important;
        transform: translateY(-1px);
    }

    .table-options #order-sortby[style*="none"],
    .table-options .mode-toggle[style*="none"] {
        display: none !important;
    }

    .table-options #order-sortby .fa,
    .table-options .mode-toggle .fa {
        font-size: inherit !important;
    }

    .table-options .fa-2x {
        font-size: 32px !important;
    }

    .compact-options {
        display: none;
        align-items: center !important;
        gap: 10px !important;
        white-space: nowrap !important;
    }

    .base-overlay {
        background: rgba(10, 12, 18, 0.96) !important;
        backdrop-filter: blur(12px) !important;
        z-index: 10050 !important;
    }

    #overlay-shade {
        position: fixed !important;
        inset: 0 !important;
        background: rgba(3, 5, 10, 0.7) !important;
        z-index: 10000 !important;
    }

    #archivePagesOverlay {
        position: fixed !important;
        top: 50% !important;
        left: 50% !important;
        transform: translate(-50%, -50%) !important;
        width: 80vw !important;
        max-width: 960px !important;
        max-height: 80vh !important;
        overflow-y: auto !important;
        overflow-x: hidden !important;
        padding: 24px !important;
        z-index: 10100 !important;
        text-align: center !important;
    }

    #archivePagesOverlay .reader-thumbnail {
        width: auto !important;
        max-width: 140px !important;
        max-height: 200px !important;
        margin: 0 auto 16px auto !important;
        display: block !important;
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
    }

    #archivePagesOverlay .reader-thumbnail img {
        width: 100% !important;
        height: auto !important;
        object-fit: contain !important;
        border-radius: 8px !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4) !important;
        margin: 0 !important;
    }

    #archivePagesOverlay .caption,
    #archivePagesOverlay #tagContainer,
    #archivePagesOverlay table.itg,
    #archivePagesOverlay table.itg tr,
    #archivePagesOverlay table.itg td {
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        backdrop-filter: none !important;
        padding: 0 !important;
    }

    #archivePagesOverlay table.itg {
        width: 100% !important;
        display: table !important;
        border-collapse: collapse !important;
        table-layout: auto !important;
    }

    #archivePagesOverlay table.itg td.caption-namespace {
        width: 1% !important;
        white-space: nowrap !important;
        text-align: right !important;
        padding: 4px 12px 4px 0 !important;
        color: var(--text-secondary) !important;
        font-weight: 600 !important;
        font-size: 0.9rem !important;
        vertical-align: middle !important;
        display: table-cell !important;
    }

    #archivePagesOverlay table.itg td:not(.caption-namespace) {
        width: auto !important;
        text-align: left !important;
        padding: 4px 0 !important;
        display: table-cell !important;
        vertical-align: middle !important;
    }

    #archivePagesOverlay .quick-thumbnail {
        display: inline-flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: flex-start !important;
        vertical-align: top !important;
        width: 22% !important;
        margin: 12px 1% !important;
        height: auto !important;
        min-height: auto !important;
        padding: 0 !important;
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
    }

    #archivePagesOverlay .quick-thumbnail img {
        width: 100% !important;
        height: auto !important;
        border-radius: var(--radius-sm) !important;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3) !important;
        margin-bottom: 6px !important;
        border: 1px solid var(--glass-border) !important;
    }

    #archivePagesOverlay .quick-thumbnail .page-number {
        display: block !important;
        position: static !important;
        font-size: 0.75rem !important;
        color: var(--text-secondary) !important;
        background: transparent !important;
        text-align: center !important;
        width: 100% !important;
        padding: 0 !important;
    }

    #settingsOverlay {
        position: fixed !important;
        top: 50% !important;
        left: 50% !important;
        transform: translate(-50%, -50%) !important;
        width: 70vw !important;
        max-width: 640px !important;
        max-height: 80vh !important;
        overflow-y: auto !important;
        overflow-x: hidden !important;
        padding: 16px 20px !important;
        z-index: 10110 !important;
    }

    #archivePagesOverlay,
    #settingsOverlay {
        scrollbar-width: thin;
        scrollbar-color: var(--accent-color) rgba(0, 0, 0, 0.4);
    }

    #archivePagesOverlay::-webkit-scrollbar,
    #settingsOverlay::-webkit-scrollbar {
        width: 6px;
    }

    #archivePagesOverlay::-webkit-scrollbar-track,
    #settingsOverlay::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.25);
        border-radius: 999px;
    }

    #archivePagesOverlay::-webkit-scrollbar-thumb,
    #settingsOverlay::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, rgba(74, 159, 240, 0.95), rgba(74, 159, 240, 0.5));
        border-radius: 999px;
    }

    .collapsible.index-carousel.with-right-caret > li.option-flyout {
        display: flex !important;
        flex-wrap: wrap !important;
        align-items: center !important;
        justify-content: space-between !important;
        width: 98% !important;
        max-width: 98vw !important;
        margin: 0 auto 16px auto !important;
    }

    .collapsible.index-carousel.with-right-caret > li.option-flyout > .collapsible-title.caret-right.active {
        display: flex !important;
        align-items: center !important;
        flex: 1 1 auto !important;
        margin: 0 !important;
    }

    .collapsible.index-carousel.with-right-caret > li.option-flyout > .collapsible-right {
        display: flex !important;
        align-items: center !important;
        margin-left: 12px !important;
    }

    .collapsible.index-carousel.with-right-caret > li.option-flyout > .collapsible-body div.id1 {
        transform: scale(0.95) !important;
        transform-origin: top center !important;
        margin-top: 4px !important;
    }

    .ido [style*="width:50%"],
    .index [style*="width:50%"],
    .index-gallery [style*="width:50%"],
    #toppane [style*="width:50%"] {
        width: 100% !important;
        min-width: 0 !important;
    }

    .index-carousel {
        margin-top: 16px !important;
        display: block !important;
        clear: both !important;
        position: relative !important;
        z-index: 1 !important;
    }

    div.id1:not(.base-overlay) {
        display: inline-flex !important;
        flex-direction: column !important;
        justify-content: space-between !important;
        vertical-align: top !important;
        background: rgba(255, 255, 255, 0.03) !important;
        border: 1px solid transparent !important;
        border-radius: var(--radius-md) !important;
        padding: 10px !important;
        transition: var(--transition-smooth) !important;
        box-shadow: var(--shadow-card) !important;
        width: 200px !important;
        min-height: 330px !important;
        height: auto !important;
        margin: 10px 5px !important;
    }

    .swiper-slide div.id1:not(.base-overlay) {
        width: 92% !important;
        margin: 0 auto !important;
        min-height: unset !important;
        display: flex !important;
        box-shadow: none !important;
        height: 100% !important;
    }

    div.id1:not(.base-overlay):hover {
        background: rgba(255, 255, 255, 0.06) !important;
        transform: translateY(-6px) !important;
        box-shadow: var(--shadow-hover) !important;
        border-color: rgba(74, 159, 240, 0.45) !important;
        z-index: 10;
    }

    div.id2 {
        height: 44px !important;
        overflow: hidden !important;
        margin-bottom: 8px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        text-align: center !important;
        width: 100% !important;
    }

    div.id2 a {
        color: var(--text-primary) !important;
        font-weight: 600 !important;
        font-size: 0.8rem !important;
        line-height: 1.3 !important;
        display: -webkit-box !important;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    div.id3 {
        flex-grow: 1 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        width: 100% !important;
        height: 240px !important;
        overflow: hidden !important;
        margin-bottom: 6px !important;
        background: transparent !important;
        #box-shadow: none !important;
        border: none !important;
        border-radius: var(--radius-sm);
        position: relative !important;
    }

    div.id3 a {
        display: flex !important;
        width: 100% !important;
        height: 100% !important;
        align-items: center !important;
        justify-content: center !important;
        overflow: hidden !important;
    }

    div.id3 img {
        border-radius: var(--radius-sm) !important;
        max-width: 100% !important;
        max-height: 100% !important;
        width: auto !important;
        height: auto !important;
        object-fit: contain !important;
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    }

    div.id1:hover div.id3 img {
        transform: scale(1.02);
        transition: transform 0.3s ease;
    }

    body.crop-mode div.id3 img {
        object-fit: cover !important;
        object-position: top center !important;
        width: 100% !important;
        height: 100% !important;
        max-width: none !important;
        max-height: none !important;
    }

    div.id4 {
        height: 22px !important;
        overflow: hidden !important;
        white-space: nowrap !important;
        text-overflow: ellipsis !important;
        font-size: 0.75rem !important;
        opacity: 0.8;
        margin-top: auto !important;
        width: 100% !important;
        text-align: center !important;
    }

    #updateOverlay,
    #changelog {
        display: none !important;
        visibility: hidden !important;
        pointer-events: none !important;
    }

    .tippy-arrow {
        color: #262830 !important;
    }

    a {
        color: var(--text-primary) !important;
        transition: color 0.2s;
    }

    a:hover {
        color: var(--accent-color) !important;
    }

    .fade-in-up {
        animation: fadeInUp 0.5s ease-out forwards;
        opacity: 0;
        transform: translateY(20px);
    }

    @keyframes fadeInUp {
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    a {
        color: var(--text-primary) !important;
        transition: color 0.2s;
    }
    a:hover {
        color: var(--accent-color) !important;
    }
    .fade-in-up {
        animation: fadeInUp 0.5s ease-out forwards;
        opacity: 0;
        transform: translateY(20px);
    }
    @keyframes fadeInUp {
        to { opacity: 1; transform: translateY(0); }
    }

    .tippy-arrow {
        color: var(--glass-bg) !important;
    }
    .tippy-arrow::before {
        border-top-color: var(--glass-bg) !important;
        border-bottom-color: var(--glass-bg) !important;
    }

    div[id^="tippy-"] .tippy-box {
        z-index: 2147483647 !important;
        background-color: transparent !important;
        box-shadow: none !important;
        border: none !important;
        width: auto !important;
        max-width: 95vw !important;
    }

    div[id^="tippy-"] .tippy-content {
        position: relative !important;
        z-index: 1 !important;
        overflow: hidden !important;

        background: var(--glass-bg) !important;
        border: 1px solid var(--glass-border) !important;
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.6) !important;
        backdrop-filter: blur(16px) !important;
        -webkit-backdrop-filter: blur(16px) !important;

        border-radius: 10px !important;
        padding: 6px !important;
        text-align: left !important;
        width: fit-content !important;
        height: fit-content !important;
        max-width: 450px !important;
    }

    .tippy-box > .tippy-content::before {
        content: none !important;
    }

    div[id^="tippy-"] .tippy-content table,
    div[id^="tippy-"] .tippy-content table.itg,
    div[id^="tippy-"] .tippy-content tr,
    div[id^="tippy-"] .tippy-content td {
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        margin: 0 !important;
    }

    div[id^="tippy-"] .tippy-content .caption:not(.caption-tags) {
        height: auto !important;
        width: auto !important;
        display: block !important;
        margin: 0 !important;
        padding: 0 !important;
        background: transparent !important;
        border: none !important;
    }

    div[id^="tippy-"] .tippy-content .caption:not(.caption-tags) img {
        display: block !important;
        height: auto !important;
        max-height: 300px !important;
        max-width: 300px !important;
        width: auto !important;
        border-radius: 6px !important;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2) !important;
        margin: 0 !important;
    }

    div[id^="tippy-"] .tippy-content .caption.caption-tags {
        display: block !important;
        padding: 4px !important;
        width: 100% !important;
    }

    div[id^="tippy-"] .tippy-content table.itg {
        width: 100% !important;
        table-layout: fixed !important;
    }

    div[id^="tippy-"] .tippy-content table.itg td {
        padding: 4px 2px !important;
        font-size: 0.85rem !important;
        line-height: 1.4 !important;
        color: var(--text-secondary) !important;
        vertical-align: middle !important;
        white-space: normal !important;
        word-wrap: break-word !important;
    }

    div[id^="tippy-"] .tippy-content .caption-namespace {
        width: 80px !important;
        color: var(--text-primary) !important;
        font-weight: 600 !important;
        text-align: right !important;
        padding-right: 10px !important;
        white-space: nowrap !important;
    }

    div[id^="tippy-"] .tippy-content div.gt {
        display: inline-flex !important;
        align-items: center !important;
        padding: 2 6px !important;
        margin: 1px 2px !important;
        min-height: 21px !important;
        background: rgba(10, 12, 18, 0.7) !important;
        border: 1px solid var(--glass-border) !important;
        border-radius: 10px !important;
        color: var(--text-secondary) !important;
        font-size: 0.75rem !important;
        box-shadow: none !important;
        line-height: 1.3 !important;
        max-width: 100% !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        white-space: nowrap !important;
    }

    div[id^="tippy-"] .tippy-content div.gt:hover {
        background: var(--accent-color) !important;
        color: #fff !important;
        border-color: var(--accent-color) !important;
    }

    div[id^="tippy-"] .tippy-content div.gt a {
        color: inherit !important;
        text-decoration: none !important;
        border: none !important;
        display: block !important;
    }

    #content div.gt,
    #content div.gt a {
        font-size: 0.75rem !important;
        line-height: 1.2 !important;
    }

    @media (max-width: 700px) {
        .tippy-box {
            max-width: 96vw !important;
        }

        .table-options {
            justify-content: center !important;
            gap: 10px !important;
            width: 96% !important;
            padding: 12px 8px !important;
        }

        .table-options > div:last-child,
        .table-options > div {
            margin-left: 0 !important;
            justify-content: center !important;
        }

        #page-select {
            min-width: 60px !important;
            text-align: center !important;
            margin-right: 8px !important;
        }

        div.id1:not(.base-overlay) {
            width: 46% !important;
            margin: 5px 2% !important;
            min-height: 280px !important;
        }

        .tippy-box {
            max-width: calc(100vw - 12px) !important;
        }

        #search-bar-row {
            flex-wrap: wrap !important;
            gap: 8px !important;
        }

        #search-bar-row .awesomplete {
            width: 100% !important;
            flex: 1 1 100% !important;
        }

        #apply-search,
        #clear-search {
            flex: 1 1 45% !important;
            margin: 0 !important;
            width: auto !important;
        }

        #settingsOverlay {
            width: 90vw !important;
            max-width: 90vw !important;
            left: 50% !important;
            right: auto !important;
            margin: 0 !important;
            transform: translate(-50%, -50%) !important;
            padding: 10px 12px !important;
            border-radius: 12px !important;
            height: 95vh !important;
        }

        #archivePagesOverlay .stdbtn {
            margin: 0 !important;
        }

        #archivePagesOverlay #tagContainer br {
            display: none !important;
        }

        #archivePagesOverlay .overlay-options-wrapper {
            display: flex !important;
            flex-wrap: wrap !important;
            justify-content: flex-start !important;
            align-items: flex-start !important;
            width: 100% !important;
            gap: 6px !important;
            margin-top: 10px !important;
            padding-left: 0 !important;
        }

        #archivePagesOverlay input.stdbtn {
            flex: 0 0 48% !important;
            max-width: 49% !important;
        }

        #archivePagesOverlay {
            width: 90vw !important;
            max-width: 90vw !important;
            padding: 10px 0px !important;
            left: 50% !important;
            transform: translate(-50%, -47%) !important;
            max-height: 90vh !important;
        }

        #archivePagesOverlay #tagContainer > div {
            display: block !important;
            width: 100% !important;
            padding: 0 12px !important;
            box-sizing: border-box !important;
        }

        #archivePagesOverlay .reader-thumbnail {
            margin: 0 auto 10px auto !important;
            display: block !important;
            max-width: 150px !important;
        }

        #archivePagesOverlay #tagContainer > div > div[style*="inline-block"] {
            display: flex !important;
            flex-direction: row !important;
            flex-wrap: wrap !important;
            justify-content: center !important;
            width: 100% !important;
            gap: 4px !important;
            margin-top: 10px !important;
            margin-left: auto !important;
            margin-right: auto !important;
        }

        #archivePagesOverlay input.stdbtn {
            width: 40% !important;
            max-width: 40% !important;
            min-width: auto !important;
            margin: 0 !important;
            height: 36px !important;
            padding: 0 4px !important;
            font-size: 0.8rem !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
        }

        #category {
            width: 35% !important;
            margin-right: 5px !important;
        }

        #archivePagesOverlay table.itg td.caption-namespace {
            white-space: nowrap !important;
            text-align: right !important;
            padding: 0 8px 0 0 !important;
            color: var(--text-secondary) !important;
            font-weight: 600 !important;
            font-size: 0.9rem !important;
            display: block !important;
            flex: 0 0 100px !important;
            max-width: 140px !important;

            align-self: center !important;
        }

        #archivePagesOverlay table.itg,
        #archivePagesOverlay table.itg tbody {
            display: block !important;
            width: 100% !important;
            border: none !important;
        }

        #archivePagesOverlay table.itg tr {
            display: flex !important;
            flex-direction: row !important;
            align-items: center !important;
            width: 100% !important;
            margin-bottom: 4px !important;
            border-bottom: none !important;
            padding: 2px 0 !important;
        }

        #archivePagesOverlay table.itg td:not(.caption-namespace) {
            display: flex !important;
            flex-wrap: wrap !important;
            align-items: center !important;
            justify-content: flex-start !important;
            flex: 1 1 0 !important;
            min-width: 0 !important;
            overflow-wrap: break-word !important;
            padding: 0 !important;
            gap: 4px !important;
        }

        #archivePagesOverlay .gt {
            display: inline-flex !important;
            max-width: 100% !important;
            margin: 0 !important;
            height: 26px !important;
            font-size: 0.8rem !important;
        }

        #archivePagesOverlay #tagContainer br {
            display: none !important;
        }

        #archivePagesOverlay h2 {
            font-size: 1.1rem !important;
            margin: 10px 0 5px 0 !important;
            width: 100% !important;
            text-align: center !important;
        }

        #editArchiveForm {
            padding: 15px !important;
            width: 100% !important;
        }

        #editArchiveForm tr td:first-child {
            text-align: left !important;
            padding-bottom: 5px !important;
        }

        #editArchiveForm tr {
            flex-direction: column !important;
        }

        #plugin_table {
            flex-wrap: wrap !important;
            gap: 8px !important;
            padding-right: 0 !important;
        }

        #plugin {
            width: 100% !important;
            max-width: 100% !important;
        }

        #run-plugin,
        #show-help {
            width: 100% !important;
        }

        #show-help {
            margin-top: 1px !important;
        }

        #editArchiveForm tr:last-child td {
            flex-direction: column !important;
            gap: 15px !important;
        }

        #editArchiveForm #save-metadata,
        #editArchiveForm #delete-archive,
        #editArchiveForm #goback,
        #editArchiveForm #read-archive {
            width: 100% !important;
        }

        div.ido:has(> #editConfigForm) > .left-column .stdbtn,
        div.ido.admin-settings-mode > .left-column .stdbtn {
            flex: 1 1 45% !important;
            margin-bottom: 8px !important;
        }
        div.ido:has(> #editConfigForm) > .left-column #save,
        div.ido.admin-settings-mode > .left-column #save {
            flex: 1 1 100% !important;
        }

        #DataTables_Table_0 thead {
            display: none !important;
        }

        #DataTables_Table_0 tbody tr {
            display: flex !important;
            flex-direction: row !important;
            flex-wrap: wrap !important;
            align-items: flex-start !important;
            align-content: flex-start !important;
            position: relative !important;
            height: auto !important;
            min-height: 90px !important;
            margin-bottom: 12px !important;
            padding: 12px 12px 12px 12px !important;

            background: rgba(30, 32, 40, 0.8) !important;
            border: 1px solid var(--glass-border) !important;
            border-radius: 12px !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2) !important;
        }

        #DataTables_Table_0 tbody td,
        #DataTables_Table_0 tbody td.itd {
            border: none !important;
            background: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            min-height: 0 !important;
            height: auto !important;
        }

        #DataTables_Table_0 td.title {
            flex: 1 1 100% !important;
            width: 100% !important;
            max-width: 100% !important;
            order: 1 !important;
            margin-bottom: 10px !important;
            padding-right: 50px !important;
            padding-left: 2px !important;
            display: block !important;
        }

        #DataTables_Table_0 td.title a {
            white-space: normal !important;
            font-size: 1rem !important;
            font-weight: 600 !important;
            line-height: 1.4 !important;
            color: var(--text-primary) !important;
            display: block !important;
        }

        #DataTables_Table_0 td.customheader1,
        #DataTables_Table_0 td.customheader2 {
            flex: 0 0 50% !important;
            width: 50% !important;
            max-width: 50% !important;
            order: 2 !important;
            display: flex !important;
            align-items: center !important;

            font-size: 0.8rem !important;
            color: var(--text-secondary) !important;
            margin-bottom: 8px !important;
            box-sizing: border-box !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
        }

        #DataTables_Table_0 td.customheader1::before {
            content: '📅 '; margin-right: 4px; opacity: 0.7; font-size: 0.9em;
        }
        #DataTables_Table_0 td.customheader2::before {
            content: '🎨 '; margin-right: 4px; opacity: 0.7; font-size: 0.9em;
        }

        #DataTables_Table_0 td.tags {
            flex: 1 1 100% !important;
            width: 100% !important;
            order: 3 !important;
            margin-top: 4px !important;
            display: block !important;
            overflow: hidden !important;
        }

        #DataTables_Table_0 td.tags {
            display: flex !important;
            flex-wrap: nowrap !important;
            overflow-x: auto !important;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
        }
        #DataTables_Table_0 td.tags::-webkit-scrollbar { display: none; }

        #DataTables_Table_0 td.tags span {
            flex-shrink: 0 !important;
            display: inline-flex !important;
            font-size: 0.75rem !important;
            padding: 2px 6px !important;
            margin-right: 6px !important;
            background: rgba(255, 255, 255, 0.08) !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
            border-radius: 4px !important;
            color: #a7b1c2 !important;
        }

        #DataTables_Table_0 .isnew {
            position: absolute !important;
            top: 12px !important;
            right: 12px !important;
            margin: 0 !important;
            font-size: 0.75rem !important;
            padding: 2px 6px !important;
            z-index: 20;
            background: var(--accent-color) !important;
            color: #fff !important;
            border-radius: 4px !important;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        }

        #editPluginForm .collapsible-body tr {
            flex-direction: row !important;
            align-items: center !important;
        }

        #editPluginForm .collapsible-body td:first-child:not([colspan="2"]) {
            width: 30% !important;
            padding-right: 20px !important;
            margin-bottom: 0 !important;
            text-align: right !important;
        }

        #editPluginForm .collapsible-body td:nth-child(2) {
            width: 70% !important;
        }

        #editPluginForm .collapsible-body input[type="button"].stdbtn {
            width: auto !important;
            min-width: 160px !important;
        }

        #editPluginForm .collapsible-body > span {
            padding-right: 180px !important;
        }

        #editPluginForm div[style*="float:right"] {
            top: 15px !important;
            right: 15px !important;
        }

        #editPluginForm .collapsible-body > span {
            padding-top: 60px !important;
        }

        #editPluginForm h2.ih,
        #editPluginForm h1.ih,
        #editPluginForm i.fa-puzzle-piece {
            position: relative;
            top: -10px;
        }
    }

    @media (max-width: 430px) {
        #archivePagesOverlay #tagContainer > div {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            width: 90% !important;
            padding: 0 0px !important;
        }

        #archivePagesOverlay table.itg,
        #archivePagesOverlay table.itg tbody {
            display: block !important;
            width: 85% !important;
            border: none !important;
        }
    }
    `;

    function injectStyle(cssText) {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(cssText));
        document.head.appendChild(style);
    }

    injectStyle(modernCss);

    function styleLoginPage() {
        const loginForm = document.querySelector('form[name="loginForm"]');

        if (!loginForm) return;

        const container = loginForm.closest('.ido');
        if (container) {
            container.classList.add('admin-login-mode');
        }
        document.body.classList.add('is-login-page');

        const passwordInput = loginForm.querySelector('input[type="password"]');
        if (passwordInput) {
            passwordInput.placeholder = "请输入管理员密码...";
        }

        const loginCss = `

            div.ido.admin-login-mode {
                position: fixed !important;
                top: 50% !important;
                left: 50% !important;
                transform: translate(-50%, -55%) !important;
                width: 90% !important;
                max-width: 420px !important;
                padding: 40px 35px !important;
                background: var(--glass-bg) !important;
                border: 1px solid var(--glass-border) !important;
                border-radius: 16px !important;
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6) !important;
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                z-index: 100;
            }

            div.ido.admin-login-mode > p:first-child {
                font-size: 18px !important;
                font-weight: 600 !important;
                margin: 0 0 30px 0 !important;
                color: var(--text-primary) !important;
                letter-spacing: 0.5px !important;
            }

            div.ido.admin-login-mode form,
            div.ido.admin-login-mode table,
            div.ido.admin-login-mode tbody {
                display: block !important;
                width: 100% !important;
                border: none !important;
                padding: 0 !important;
                margin: 0 !important;
                background: transparent !important;
            }

            div.ido.admin-login-mode tr {
                display: flex !important;
                flex-direction: column !important;
                width: 100% !important;
                align-items: stretch !important;
            }

            div.ido.admin-login-mode td {
                display: block !important;
                width: 100% !important;
                padding: 0 !important;
                margin: 0 !important;
                border: none !important;
                text-align: center !important;
            }

            div.ido.admin-login-mode tr:first-child td:first-child {
                display: none !important;
            }

            div.ido.admin-login-mode input[type="password"] {
                width: 100% !important;
                height: 50px !important;
                background: rgba(12, 14, 20, 0.5) !important;
                border: 1px solid var(--glass-border) !important;
                border-radius: 8px !important;
                color: #fff !important;
                padding: 0 16px !important;
                font-size: 16px !important;
                letter-spacing: 1px !important;
                transition: all 0.2s ease !important;
                box-shadow: inset 0 2px 4px rgba(0,0,0,0.2) !important;
                margin-bottom: 20px !important;
                text-align: center !important;
                box-sizing: border-box !important;
            }

            div.ido.admin-login-mode input[type="password"]::placeholder {
                color: rgba(255, 255, 255, 0.3) !important;
                font-size: 14px !important;
                letter-spacing: normal !important;
            }

            div.ido.admin-login-mode input[type="password"]:focus {
                border-color: var(--accent-color) !important;
                background: rgba(12, 14, 20, 0.8) !important;
                box-shadow: 0 0 0 2px rgba(74, 159, 240, 0.25) !important;
                outline: none !important;
            }

            div.ido.admin-login-mode tr:last-child td {
                display: flex !important;
                justify-content: center !important;
                width: 100% !important;
            }

            div.ido.admin-login-mode input[type="submit"] {
                width: 100% !important;
                min-width: 120px !important;
                height: 44px !important;
                background: var(--accent-color) !important;
                color: #fff !important;
                font-size: 15px !important;
                font-weight: 600 !important;
                border: none !important;
                border-radius: 8px !important;
                cursor: pointer !important;
                transition: all 0.2s ease !important;
                box-shadow: 0 4px 12px rgba(74, 159, 240, 0.3) !important;
                margin-top: 5px !important;
                appearance: none !important;
                -webkit-appearance: none !important;
            }

            div.ido.admin-login-mode input[type="submit"]:hover {
                background: #3a8cdb !important;
                transform: translateY(-2px) !important;
                box-shadow: 0 6px 16px rgba(74, 159, 240, 0.4) !important;
            }

            div.ido.admin-login-mode input[type="submit"]:active {
                transform: translateY(0) !important;
            }

            body.is-login-page .ip {
                position: fixed !important;
                bottom: 20px !important;
                left: 0 !important;
                width: 100% !important;
                text-align: center !important;
                opacity: 0.4 !important;
                font-size: 12px !important;
                pointer-events: none !important;
            }

            @media (max-height: 700px) {
                div.ido.admin-login-mode {
                    position: relative !important;
                    top: 20px !important;
                    left: auto !important;
                    transform: none !important;
                    margin: 0 auto 40px auto !important;
                }
            }
        `;

        const style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(loginCss));
        document.head.appendChild(style);
    }

    function fixSearchLayout() {
        const idi = document.querySelector('.idi');
        if (!idi) return;

        if (document.getElementById('search-bar-row')) return;

        const awesomplete = idi.querySelector('.awesomplete');
        const btnApply = document.getElementById('apply-search');
        const btnClear = document.getElementById('clear-search');

        if (awesomplete && btnApply && btnClear) {
            const wrapper = document.createElement('div');
            wrapper.id = 'search-bar-row';

            const catContainer = document.getElementById('category-container');
            if (catContainer && catContainer.parentNode === idi) {
                catContainer.parentNode.insertBefore(wrapper, catContainer.nextSibling);
            } else {
                idi.appendChild(wrapper);
            }

            wrapper.appendChild(awesomplete);
            wrapper.appendChild(btnApply);
            wrapper.appendChild(btnClear);
        }
    }

    function fixCropGroup() {
        const thumbnailOptions = document.querySelector('.table-options .thumbnail-options');
        if (!thumbnailOptions) return;

        if (thumbnailOptions.querySelector('.crop-group')) return;

        const cb = thumbnailOptions.querySelector('#thumbnail-crop');
        const label = thumbnailOptions.querySelector('label[for="thumbnail-crop"]');
        if (!cb || !label) return;

        const group = document.createElement('span');
        group.className = 'crop-group';

        cb.parentNode.insertBefore(group, cb);
        group.appendChild(cb);
        group.appendChild(label);

        const toggleCropMode = () => {
            if (cb.checked) {
                document.body.classList.add('crop-mode');
            } else {
                document.body.classList.remove('crop-mode');
            }
        };

        cb.addEventListener('change', toggleCropMode);

        toggleCropMode();
    }

    function alignCropAndCompact() {
        fixCropGroup();
    }

    function highlightActiveCategory() {
        const params = new URLSearchParams(window.location.search);
        const currentCatID = params.get('c') || params.get('category');

        document.querySelectorAll('.category-active').forEach(el => el.classList.remove('category-active'));

        if (currentCatID) {
            const catLinks = document.querySelectorAll('#category-container a, #category-container .favtag-btn');
            catLinks.forEach(link => {
                const linkHref = link.getAttribute('href');
                const linkDataId = link.getAttribute('data-id') || link.id;

                const matchesHref = linkHref && (linkHref.includes(`c=${currentCatID}`) || linkHref.includes(`category=${currentCatID}`));
                const matchesId = linkDataId && (linkDataId == currentCatID || linkDataId == `SET_${currentCatID}`);

                if (matchesHref || matchesId) {
                    link.classList.add('category-active');
                }
            });
        }
    }

    function cleanUpNotifications() {
        const updateOverlay = document.getElementById('updateOverlay');
        if (updateOverlay) updateOverlay.remove();

        const leftColumn = document.querySelector('.left-column');
        if (leftColumn) {
            Array.from(leftColumn.childNodes).forEach(node => {
                if (node.nodeType === 3) {
                    node.remove();
                }
            });
        }
    }

    function animateGalleryItems() {
        const items = document.querySelectorAll('div.id1:not(.base-overlay)');
        items.forEach((item, index) => {
            if (!item.classList.contains('fade-in-up')) {
                item.style.animationDelay = `${index * 0.03}s`;
                item.classList.add('fade-in-up');
            }
        });
    }

    function enhanceButtons() {
        const buttons = document.querySelectorAll('.stdbtn, .favtag-btn, .paginate_button');
        buttons.forEach(btn => {
            btn.addEventListener('mousedown', function() { this.style.transform = 'scale(0.95)'; });
            btn.addEventListener('mouseup', function() { this.style.transform = 'translateY(-2px)'; });
            btn.addEventListener('mouseleave', function() { this.style.transform = ''; });
        });
    }

    function fixPageLength() {
        const wrappers = document.querySelectorAll('.dataTables_wrapper');
        if (!wrappers.length) return;

        wrappers.forEach(wrapper => {
            let lengthSelect = wrapper.querySelector('.dataTables_length select');
            if (!lengthSelect) {
                lengthSelect = wrapper.querySelector('select');
            }
            if (!lengthSelect) return;

            const currentValue = lengthSelect.value;
            const event = new Event('change', { bubbles: true });
            lengthSelect.value = currentValue;
            lengthSelect.dispatchEvent(event);
        });
    }

    function initScrollListener() {
        let lastScrollTop = 0;
        const optionsPanel = document.querySelector('.table-options');

        if (!optionsPanel) return;

        window.addEventListener('scroll', function() {
            if (window.innerWidth < 700) return;

            const currentScroll = window.scrollY || document.documentElement.scrollTop;

            if (currentScroll > 100) {
                if (currentScroll > lastScrollTop) {
                    optionsPanel.classList.add('scroll-hidden');
                } else {
                    optionsPanel.classList.remove('scroll-hidden');
                }
            } else {
                optionsPanel.classList.remove('scroll-hidden');
            }
            lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
        }, { passive: true });
    }

    function fixConfigLayout() {
        const configCells = document.querySelectorAll('.config-td');

        configCells.forEach(td => {
            if (td.dataset.layoutFixed === 'true') return;

            if (td.querySelector('#shinobu-ok') || td.querySelector('#shinobu-ko') || td.innerHTML.includes('PID:')) {
                td.dataset.isStatusRow = "true";
                td.dataset.layoutFixed = 'true';
                return;
            }

            const controlWrapper = document.createElement('div');
            controlWrapper.className = 'config-control-wrapper';

            const descWrapper = document.createElement('div');
            descWrapper.className = 'config-desc-text';

            const childNodes = Array.from(td.childNodes);

            childNodes.forEach(node => {
                if (node.nodeType === 3 && !node.textContent.trim()) {
                    return;
                }

                if (node.nodeName === 'BR') {
                    return;
                }

                const isControl = ['INPUT', 'SELECT', 'TEXTAREA'].includes(node.nodeName);

                if (isControl) {
                    controlWrapper.appendChild(node);
                } else if (node.nodeName === 'LABEL') {
                    while (node.firstChild) {
                        descWrapper.appendChild(node.firstChild);
                    }
                } else {
                    descWrapper.appendChild(node);
                }
            });

            td.innerHTML = '';
            td.appendChild(controlWrapper);
            td.appendChild(descWrapper);

            td.dataset.layoutFixed = 'true';
        });
    }

    const observer = new MutationObserver((mutations) => {
        let shouldFixSearch = false;
        let shouldFixLayout = false;
        let shouldAnimate = false;

        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                shouldFixLayout = true;
                if (mutation.target.classList && mutation.target.classList.contains('idi')) {
                    shouldFixSearch = true;
                }
                if (mutation.target.classList && (mutation.target.classList.contains('index-gallery') || mutation.target.id === 'index')) {
                    shouldAnimate = true;
                }
                if (mutation.target.classList && mutation.target.classList.contains('dataTables_wrapper')) {
                    shouldFixLayout = true;
                }
            }
        });

        if (shouldFixSearch) {
            fixSearchLayout();
        }

        if (shouldFixLayout) {
            cleanUpNotifications();
            fixCropGroup();
            enhanceButtons();
            highlightActiveCategory();
            fixEditFormStructure();
            fixConfigLayout();
        }

        if (shouldAnimate) {
            animateGalleryItems();
        }
    });

    function identifySettingsPage() {
        const configForm = document.getElementById('editConfigForm');
        if (configForm) {
            const container = configForm.closest('.ido');
            if (container) {
                container.classList.add('admin-settings-mode');
            }
        }
    }

    function fixEditFormStructure() {
        const form = document.querySelector('#editArchiveForm');
        if (!form) return;

        if (form.dataset.lrreditFixed === "1") return;

        const rows = form.querySelectorAll('table > tbody > tr');
        if (!rows.length) return;

        rows.forEach((tr, index) => {
            if (index > 3) return;

            const tds = tr.querySelectorAll('td');
            if (tds.length < 2) return;

            const labelTd = tds[0];
            const fieldTd = tds[1];

            const labelText = labelTd.innerHTML.trim();

            const wrapper = document.createElement('div');
            wrapper.className = 'lrredit-field';

            const labelDiv = document.createElement('div');
            labelDiv.className = 'lrredit-label';
            labelDiv.innerHTML = labelText;

            const controlDiv = document.createElement('div');
            controlDiv.className = 'lrredit-control';

            while (fieldTd.firstChild) {
                controlDiv.appendChild(fieldTd.firstChild);
            }

            wrapper.appendChild(labelDiv);
            wrapper.appendChild(controlDiv);

            tr.innerHTML = '';
            const singleTd = document.createElement('td');
            singleTd.colSpan = 2;
            singleTd.appendChild(wrapper);
            tr.appendChild(singleTd);

            tr.classList.add('lrredit-row--stacked');
        });

        (function fixPluginSection() {
            const pluginCell = document.getElementById('plugin_table');
            const pluginSelect = document.getElementById('plugin');
            const runButton = document.getElementById('run-plugin');
            const helpButton = document.getElementById('show-help');
            const argLabel = document.getElementById('arg_label');
            const argInput = document.getElementById('arg');

            if (!pluginCell || !pluginSelect || !runButton || !argLabel || !argInput) return;

            if (pluginCell.dataset.lrreditPluginFixed === '1') return;

            const pluginRow = pluginCell.closest('tr');
            if (pluginRow) {
                const cells = pluginRow.querySelectorAll('td');
                if (cells.length === 2) {
                    const labelCell = cells[0];
                    if (labelCell !== pluginCell) {
                        labelCell.style.display = 'none';
                    }
                    pluginCell.colSpan = 2;
                }
            }

            const existingWarning = document.getElementById('plugin-warning');
            if (existingWarning && existingWarning.parentElement !== pluginCell) {
                existingWarning.remove();
            }

            pluginCell.innerHTML = '';

            const block = document.createElement('div');
            block.id = 'plugin-block';

            const title = document.createElement('div');
            title.id = 'plugin-block-title';
            title.textContent = '从插件导入标签';

            const row = document.createElement('div');
            row.className = 'plugin-row';

            row.appendChild(pluginSelect);
            row.appendChild(runButton);

            if (helpButton) {
                helpButton.style.display = 'inline-flex';
                helpButton.textContent = '帮助';
                row.appendChild(helpButton);
            }

            argLabel.style.display = 'block';
            argLabel.style.marginTop = '10px';

            const warn = document.createElement('div');
            warn.id = 'plugin-warning';
            warn.innerHTML = `
                <span id="plugin-warning-icon">⚠</span>
                <span>使用插件将保存您对档案元数据所做的任何修改。</span>
            `;

            block.appendChild(title);
            block.appendChild(row);
            block.appendChild(argLabel);
            block.appendChild(argInput);
            block.appendChild(warn);

            pluginCell.appendChild(block);

            pluginCell.dataset.lrreditPluginFixed = '1';
        })();

        form.dataset.lrreditFixed = "1";
    }

    function wrapPluginDependencies() {
        // 锁定所有包含“自动运行 + 依赖说明”的右侧控制区
        var containers = document.querySelectorAll('#editPluginForm div[style*="float:right"]');

        containers.forEach(function (c) {
            // 已经处理过就跳过（防止重复包裹）
            if (c.querySelector('.plugin-dependency')) return;

            var plug = c.querySelector('i.fa-plug');
            if (!plug) return;

            // 创建依赖信息容器
            var wrap = document.createElement('span');
            wrap.className = 'plugin-dependency';

            // 从图标开始，把后面的所有兄弟节点搬进容器
            var node = plug;
            while (node) {
                var next = node.nextSibling;
                wrap.appendChild(node);
                node = next;
            }

            // 把容器挂回原来的 div 末尾
            c.appendChild(wrap);
        });
    }

    function init() {
        styleLoginPage();
        cleanUpNotifications();
        fixSearchLayout();
        alignCropAndCompact();
        highlightActiveCategory();
        animateGalleryItems();
        enhanceButtons();
        initScrollListener();
        fixEditFormStructure();
        identifySettingsPage();
        fixConfigLayout();
        wrapPluginDependencies();

        const targetNode = document.body;
        if (targetNode) {
            observer.observe(targetNode, {
                childList: true,
                subtree: true
            });
        }
        setTimeout(() => {
            document.body.classList.add("panel-ready");
        }, 500);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();