// ==UserScript==
// @name         LANraragi 现代主题
// @namespace    https://github.com/Kelcoin
// @version      1.3
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

    /* 通用按钮样式 */
    .stdbtn,
    .favtag-btn:not(select),
    .searchbtn,
    input[type="button"],
    input[type="submit"],
    div.gt,
    .tagger > ul > li,
    .caption-tags div.gt,
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

    div.gt,
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
        text-align: center; /* 让下拉框文字居中 */
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
    .caption:not(#tagContainer):not(.caption-tags) {
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
        max-width: 700px !important;
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
    
    /* 默认样式（移动端/窄屏保持原样） */
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

    /* 清除 label 全局样式对裁剪按钮的覆盖 */
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

    /* hover 高亮 */
    label[for="thumbnail-crop"]:hover {
        background: var(--accent-color) !important;
        color: #f7fbff !important;
        border-color: rgba(206, 224, 255, 0.55) !important;
        transform: translateY(-1px);
    }

    /* 激活状态保持高亮 */
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

    /* 桌面端大屏逻辑 */
    @media (min-width: 700px) {

        /* 主容器：固定右侧垂直居中 */
        .table-options {
            position: fixed !important;
            right: 12px !important;
            top: 38% !important;

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
            white-space: nowrap !important; /* 防止换行 */
        }

        #thumbnail-crop:checked ~ label[for="thumbnail-crop"] {
            left: 31% !important;
            transform: translateX(-50%) !important;
        }
    }

    .table-options .thumbnail-options,
    .table-options > div:last-child {
        display: inline-flex; /* 移动端保持 flex */
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
        display: none;
    }

    .table-options #order-sortby[style]:not([style*="none"]),
    .table-options .mode-toggle[style]:not([style*="none"]) {
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
        background: rgba(4, 6, 12, 0.75) !important;
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

    .tippy-box {
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        transform: translateZ(0) !important;
        will-change: opacity !important;
        transition: opacity 0.15s cubic-bezier(0.4, 0, 0.2, 1) !important;
    }

    .tippy-box[data-state="hidden"] {
        opacity: 0 !important;
    }

    .tippy-box[data-state="visible"] {
        opacity: 1 !important;
    }

    .tippy-box > .tippy-content {
        position: relative !important;
        z-index: 1 !important;
        overflow: hidden !important;
        background: #262830 !important;
        border: 1px solid rgba(140, 160, 190, 0.32) !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5) !important;
        border-radius: 8px !important;
        padding: 8px 10px !important;
        text-align: left !important;
        transform: none !important;
        transition: none !important;
    }

    .tippy-box > .tippy-content::before {
        content: none !important;
    }

    .tippy-content *,
    .tippy-content table,
    .tippy-content td,
    .tippy-content tr {
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        border-radius: 0 !important;
        transition: none !important;
        transform: none !important;
        opacity: 1 !important;
    }

    .tippy-content .caption {
        padding: 0 !important;
        margin: 0 !important;
    }

    .tippy-content table.itg {
        margin: 0 !important;
        width: 100% !important;
        border-collapse: collapse !important;
    }

    /* 左侧命名空间：宽度固定 + 右对齐 + 垂直居中 */
    .tippy-content .caption-namespace {
        padding-right: 6px !important;
        color: var(--text-secondary) !important;
        font-weight: bold !important;
        font-size: 0.8rem !important;
        border-right: none !important;
        vertical-align: middle !important;           /* 原来是 top，改为 middle，与右侧标签垂直对齐 */
        text-align: right !important;
        box-sizing: content-box !important;
        width: 3.5rem !important;
        max-width: 3.5rem !important;
        min-width: 3.5rem !important;
        white-space: nowrap !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
    }

    /* 右侧单元格：与左侧一起垂直居中 */
    .tippy-content td:not(.caption-namespace) {
        padding-left: 8px !important;
        vertical-align: middle !important;          /* 确保右侧内容也以行中线对齐 */
    }

    .tippy-content .caption-tags {
        padding-left: 8px !important;
        font-size: 0.55rem !important;
        line-height: 1.3 !important;
    }

    .tippy-content .gt {
        font-size: 0.7rem !important;
        line-height: 1 !important;
        padding: 0 4px !important;
        margin: 1px 2px !important;
        border: 1px solid rgba(143, 158, 190, 0.55) !important;
        background: rgba(8, 10, 16, 0.8) !important;
        border-radius: 3px !important;
    }

    .tippy-content .gt a {
        font-size: inherit !important;
        line-height: inherit !important;
        padding: 0 !important;
        margin: 0 !important;
    }

    #content div.gt,
    #content div.gt a {
        font-size: 0.75rem !important;
        line-height: 1.2 !important;
    }

    @media (max-width: 700px) {
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
            padding: 5px 0px !important;
            left: 50% !important;
            transform: translate(-50%, -47%) !important;
            max-height: 90vh !important;
        }

        /* 改：整体内容区左对齐且拉满宽度，匹配信息行布局 */
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

        /* 左侧标签列：宽度固定 + 右对齐 */
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
            /* 关键：在当前行的交叉轴上居中对齐，跟右侧标签对齐 */
            align-self: center !important;
        }

        #archivePagesOverlay table.itg,
        #archivePagesOverlay table.itg tbody {
            display: block !important;
            width: 100% !important;
            border: none !important;
        }

        /* 每一行是「左标签 + 右内容」，并在垂直方向上居中对齐 */
        #archivePagesOverlay table.itg tr {
            display: flex !important;
            flex-direction: row !important;
            /* 原来是 flex-start，这里改为 center，整行两个 td 垂直居中 */
            align-items: center !important;
            width: 100% !important;
            margin-bottom: 4px !important;
            border-bottom: none !important;
            padding: 2px 0 !important;
        }

        /* 右侧内容区域：自适应宽度，内部标签本身也垂直居中 */
        #archivePagesOverlay table.itg td:not(.caption-namespace) {
            display: flex !important;
            flex-wrap: wrap !important;
            align-items: center !important;        /* 标签内部垂直居中 */
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
    }
    `;

    function injectStyle(cssText) {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(cssText));
        document.head.appendChild(style);
    }

    injectStyle(modernCss);

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

        // 防止重复执行
        if (thumbnailOptions.querySelector('.crop-group')) return;

        const cb = thumbnailOptions.querySelector('#thumbnail-crop');
        const label = thumbnailOptions.querySelector('label[for="thumbnail-crop"]');
        if (!cb || !label) return;

        // 1. 创建容器并移动元素
        const group = document.createElement('span');
        group.className = 'crop-group';
        
        // 保持原有布局逻辑
        cb.parentNode.insertBefore(group, cb);
        group.appendChild(cb);
        group.appendChild(label);

        // 2. 定义切换逻辑
        const toggleCropMode = () => {
            if (cb.checked) {
                document.body.classList.add('crop-mode');
            } else {
                document.body.classList.remove('crop-mode');
            }
        };

        // 3. 绑定监听事件
        cb.addEventListener('change', toggleCropMode);

        // 4. 初始化状态
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

        const headings = document.querySelectorAll('h2');
        headings.forEach(h2 => {
            if (h2.textContent.includes('欢迎来到 LANraragi') || h2.textContent.includes('Welcome to LANraragi')) {
                const parentDiv = h2.closest('div');
                if (parentDiv && !parentDiv.classList.contains('ido') && !parentDiv.id) {
                    parentDiv.style.display = 'none';
                } else if (parentDiv) {
                    h2.style.display = 'none';
                    if (parentDiv.childNodes) {
                        parentDiv.childNodes.forEach(node => {
                            if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) {
                                node.textContent = '';
                            }
                        });
                    }
                }
            }
        });
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

    // 处理滚动时面板的显示与隐藏（仅对桌面端生效）
    function initScrollListener() {
        let lastScrollTop = 0;
        const optionsPanel = document.querySelector('.table-options');
        
        // 如果没有找到元素或处于移动端（简单判断宽度），则不执行逻辑
        if (!optionsPanel) return;

        window.addEventListener('scroll', function() {
            // 仅在宽度大于700px时执行隐藏逻辑，与CSS保持一致
            if (window.innerWidth < 700) return;

            const currentScroll = window.scrollY || document.documentElement.scrollTop;
            
            // 阈值：滚动超过100px才开始交互
            if (currentScroll > 100) {
                if (currentScroll > lastScrollTop) {
                    // 向下滚动 -> 隐藏
                    optionsPanel.classList.add('scroll-hidden');
                } else {
                    // 向上滚动 -> 显示
                    optionsPanel.classList.remove('scroll-hidden');
                }
            } else {
                // 回到顶部 -> 总是显示
                optionsPanel.classList.remove('scroll-hidden');
            }
            lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; // 防止负值
        }, { passive: true });
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
        }

        if (shouldAnimate) {
            animateGalleryItems();
        }
    });

    function init() {
        cleanUpNotifications();
        fixSearchLayout();
        alignCropAndCompact();
        highlightActiveCategory();
        animateGalleryItems();
        enhanceButtons();
        initScrollListener();

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