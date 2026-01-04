// ==UserScript==
// @name         linux.do 收藏夹
// @namespace    http://tampermonkey.net/
// @version      6.4.1
// @description  收藏 linux.do 的帖子。
// @match        https://linux.do/*
// @match        https://idcflare.com/*
// @exclude      https://linux.do/a/*
// @exclude      https://idcflare.com/a/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/551642/linuxdo%20%E6%94%B6%E8%97%8F%E5%A4%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/551642/linuxdo%20%E6%94%B6%E8%97%8F%E5%A4%B9.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // 使用常量管理所有键名、ID和类名
    const CONSTANTS = {
        STORAGE_KEYS: {
            BOOKMARKS: "linuxdo_bookmarks",
            TRASH: "linuxdo_trash", // 回收站
            WEBDAV_SERVER: "webdav_server",
            WEBDAV_USER: "webdav_user",
            WEBDAV_PASS: "webdav_pass",
            AUTO_SYNC: "webdav_auto_sync_enabled",
            TAG_ORDER: "bm_tag_order",
            FLOATING_BUTTON_POSITION: "bm_floating_button_position",
        },
        IDS: {
            MANAGER_MODAL: "bookmark-manager-modal",
            SETTINGS_MODAL: "bookmark-settings-modal", // [NEW] 配置页面
            WEBDAV_SETTINGS_MODAL: "webdav-settings-modal",
            WEBDAV_BROWSER_MODAL: "webdav-browser-modal",
            SEARCH_INPUT: "bookmark-search-input",
            TABLE_CONTAINER: "bookmarks-table-container",
            TABLE: "bookmarks-table",
            ROW_TEMPLATE: "bm-row-template",
            TAG_FILTER_CONTAINER: "bm-tag-filter-container",
            TAG_EDIT_INPUT: "bm-tag-edit-input",
            RENAME_TAGS_BUTTON: "rename-tags-btn",
            TRASH_TOGGLE_BUTTON: "toggle-trash-btn",
            EMPTY_TRASH_BUTTON: "empty-trash-btn",
            SETTINGS_BUTTON: "open-settings-btn", // [NEW] 打开配置按钮
            WEBDAV_TEST_RESULT: "webdav-test-result",
            AUTO_SYNC_TOGGLE: "auto-sync-toggle",
            WEBDAV_BROWSER_LIST: "webdav-browser-list",
            MANAGE_BUTTON: "manage-bookmarks-button",
            PAGINATION_INFO: "bm-pagination-info", // [NEW] 分页信息
            PAGINATION_CONTROLS: "bm-pagination-controls", // [NEW] 分页控件
            FOOTER_CONTAINER: "bm-footer-container", // [NEW] 底部容器
            PAGE_SIZE_SELECT: "bm-page-size-select", // [NEW] 每页显示数量选择器
            TRASH_BACK_BUTTON: "return-to-bookmarks-btn", // [NEW] 回收站返回收藏按钮
        },
        CLASSES: {
            DELETE_BTN: "delete-btn",
            RESTORE_BTN: "restore-btn", PURGE_BTN: "purge-btn", RENAME_BTN: "rename-btn",
            SAVE_BTN: "save-btn",
            CANCEL_BTN: "cancel-btn",
            PIN_BTN: "pin-btn",
            UNPIN_BTN: "unpin-btn",
            PINNED_ROW: "pinned-bookmark",
            EDIT_INPUT: "edit-name-input",
            MODAL_BACKDROP: "bm-modal-backdrop",
            CLOSE_BTN: "bm-close-btn",
            CONTENT_PANEL: "bm-content-panel",
            ROW_HIDING: "bm-row-hiding",
            TAG_FILTER_BTN: "bm-tag-filter-btn", TAG_ACTIVE: "active", TAG_CELL: "bm-tag-cell", TAG_PILL: "bm-tag-pill", TAG_EDIT_BTN: "bm-tag-edit-btn", TAG_ADD_BTN: "bm-tag-add-btn", TAG_REMOVE_BTN: "bm-tag-remove-btn", TAG_SAVE_BTN: "bm-tag-save-btn", TAG_CANCEL_BTN: "bm-tag-cancel-btn",
        },
        WEBDAV_DIR: "LinuxDoBookmarks/",
    };

    const TAG_COLLATOR = new Intl.Collator(undefined, {
        sensitivity: "base",
        numeric: true,
    });

    let activeTagFilter = null; // 用于存储当前激活的标签过滤器
    let viewMode = "bookmarks"; // 视图模式：bookmarks | trash
    let currentPage = 1; // 当前页码
    let itemsPerPage = 10; // 每页显示数量
    let openModalCount = 0;

    function updateModalLockState() {
        const root = document.documentElement;
        const body = document.body;
        if (!root || !body) return;
        if (openModalCount > 0) {
            root.classList.add("bm-modal-open");
            body.classList.add("bm-modal-open");
        } else {
            root.classList.remove("bm-modal-open");
            body.classList.remove("bm-modal-open");
        }
    }

    function openModal(modal) {
        if (!modal || modal.style.display === "flex") return;
        modal.style.display = "flex";
        openModalCount += 1;
        updateModalLockState();
    }

    function closeModal(modal) {
        if (!modal || modal.style.display === "none") return;
        modal.style.display = "none";
        openModalCount = Math.max(0, openModalCount - 1);
        updateModalLockState();
    }

    // --- Part 1: 定义样式和 HTML ---
    GM_addStyle(`
        .bm-modal-backdrop { display: none; position: fixed; z-index: 2147483647; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgba(0,0,0,0.4); justify-content: center; align-items: center; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; pointer-events: auto; }
        html.bm-modal-open,
        body.bm-modal-open { overflow: hidden !important; touch-action: none; }
        body.bm-modal-open .action-button { pointer-events: none; }
        .bm-content-panel { background-color: #ffffff; border-radius: 12px; padding: 25px 30px; border: 1px solid #EAEAEA; box-shadow: 0 10px 25px rgba(0,0,0,0.1); display: flex; flex-direction: column; }
        #${CONSTANTS.IDS.MANAGER_MODAL} .bm-content-panel { width: 1280px; height: 70vh; max-width: 95vw; max-height: 95vh; }
        .bm-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #EAEAEA; padding-bottom: 15px; margin-bottom: 20px; flex-shrink: 0; }
        .bm-header h2 { margin: 0; font-size: 24px; color: #333; font-weight: 600; }
        .bm-header-actions { display: flex; align-items: center; gap: 12px; margin-left: auto; }
        .bm-close-btn { color: #333; cursor: pointer; line-height: 1; transition: background-color 0.2s; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; padding: 0; margin: 0; background: none; border: none; border-radius: 4px; }
        .bm-close-btn svg { width: 20px; height: 20px; }
        .bm-close-btn:hover { background-color: #ff4444; color: #fff; }
        .bm-settings-btn { color: #333; font-size: 18px; font-weight: normal; cursor: pointer; line-height: 1; background: none; border: none; padding: 0; margin: 0; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; }
        .bm-settings-btn svg { width: 20px; height: 20px; }
        .search-input-container {
            position: relative;
            flex: 1;
            min-width: 200px;
            display: flex;
            align-items: center;
            height: 26px;
            border: 1px solid #DDD;
            border-radius: 4px;
            padding: 0 25px 0 10px;
            background: white;
        }
        #${CONSTANTS.IDS.SEARCH_INPUT} {
            width: 100%;
            height: 100%;
            padding: 0;
            margin: 0;
            font-size: 13px;
            border: none;
            outline: none;
            background: transparent;
            box-sizing: border-box;
        }
        .search-clear-btn {
            position: absolute;
            right: 6px;
            top: 50%;
            transform: translateY(-50%);
            width: 13px;
            height: 13px;
            border-radius: 50%;
            background-color: #555;
            color: #fff;
            border: none;
            cursor: pointer;
            display: none;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            line-height: 1;
            padding: 0;
            transition: background-color 0.2s;
        }
        .search-clear-btn:hover { background-color: #ff4444; }
        .search-clear-btn.visible { display: flex; }
        .controls-buttons { display: flex; flex-wrap: wrap; gap: 8px; }
        #${CONSTANTS.IDS.TABLE_CONTAINER} {
            flex: 1;
            overflow-y: auto;
            overflow-x: hidden;
            min-height: 0;
            width: 100%;
            scrollbar-width: none; /* Firefox */
            -ms-overflow-style: none; /* IE and Edge */
        }
        #${CONSTANTS.IDS.TABLE_CONTAINER}::-webkit-scrollbar {
            display: none; /* Chrome, Safari and Opera */
        }
        #${CONSTANTS.IDS.TABLE} { width: 100%; min-width: 100%; border-collapse: separate; border-spacing: 0; border: 1px solid #EAEAEA; border-radius: 8px; overflow: hidden; table-layout: fixed; }
        #${CONSTANTS.IDS.TABLE} th { position: sticky; top: 0; z-index: 1; background-color: #F9F9F9; padding: 12px 8px; text-align: left; border-bottom: 2px solid #EAEAEA; border-right: 1px solid #EAEAEA; box-sizing: border-box;}
        #${CONSTANTS.IDS.TABLE} th:last-child { border-right: none; }
        #${CONSTANTS.IDS.TABLE} td { border-bottom: 1px solid #EAEAEA; border-right: 1px solid #EAEAEA; padding: 12px 8px; text-align: left; transition: background-color 0.3s; vertical-align: middle; word-wrap: break-word; word-break: break-word; box-sizing: border-box; }
        #${CONSTANTS.IDS.TABLE} td:last-child { border-right: none; }
        #${CONSTANTS.IDS.TABLE} tr:last-child td { border-bottom: none; }
        #${CONSTANTS.IDS.TABLE} tbody tr:hover { background-color: #F8F9FA; }
        #${CONSTANTS.IDS.TABLE} td a { color: #007AFF; text-decoration: none; word-break: break-all; }
        #${CONSTANTS.IDS.TABLE} td a:hover { text-decoration: underline; }

        /* 固定列宽的单元格样式 - 允许内容换行 */
        #${CONSTANTS.IDS.TABLE} th:nth-child(1), .bm-name-cell { width: 31%; word-wrap: break-word; word-break: break-word; }
        .bm-name-cell { font-size: 14px; }
        #${CONSTANTS.IDS.TABLE} th:nth-child(2), .bm-url-cell { width: 23%; word-wrap: break-word; }
        .bm-url-cell { font-size: 14px; }
        .bm-url-cell a { display: block; word-wrap: break-word; word-break: break-all; }
        #${CONSTANTS.IDS.TABLE} th:nth-child(3), .${CONSTANTS.CLASSES.TAG_CELL} { width: 12%; word-wrap: break-word; }
        #${CONSTANTS.IDS.TABLE} th:nth-child(4), .bm-time-cell { width: 12%; word-wrap: break-word; }
        .bm-time-cell { font-size: 13px !important; color: #666; }
        #${CONSTANTS.IDS.TABLE} th:nth-child(5), .bm-actions-cell { width: 22%; text-align: center; white-space: nowrap; }

        .bm-btn { border: 1px solid #CCC; background-color: #FFF; color: #333; padding: 4px 10px; height: 26px; border-radius: 5px; cursor: pointer; font-size: 13px; transition: all 0.2s; white-space: nowrap; display: inline-flex; align-items: center; justify-content: center; }
        .bm-actions-cell .bm-btn { padding: 4px 10px; font-size: 13px; margin: 0 2px; border-radius: 4px; }
        .bm-btn-io { border-color: #81C784; color: #2E7D32; }
        .bm-btn-cloud { border-color: #64B5F6; color: #1976D2; }
        .bm-btn-danger { border-color: #E57373; color: #D32F2F; }
        .bm-toast { position: fixed; bottom: 20px; right: 20px; z-index: 10001; background-color: #333; color: white; padding: 12px 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); opacity: 0; transition: opacity 0.3s, transform 0.3s; transform: translateY(20px); font-size: 15px; display: flex; align-items: center; gap: 10px; }
        .bm-toast.show { opacity: 1; transform: translateY(0); }
        .bm-toast.error { background-color: #D32F2F; }
        .bm-toast-action { color: #4CAF50; font-weight: bold; cursor: pointer; text-decoration: underline; }
        #${CONSTANTS.IDS.WEBDAV_BROWSER_MODAL} .bm-content-panel { max-width: 700px; height: 75vh; }
        #${CONSTANTS.IDS.WEBDAV_BROWSER_LIST} { list-style: none; padding: 0; margin: 0; overflow-y: auto; flex-grow: 1; border: 1px solid #eee; border-radius: 6px; }
        #${CONSTANTS.IDS.WEBDAV_BROWSER_LIST} li { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px 15px; border-bottom: 1px solid #f0f0f0; cursor: pointer; transition: background-color 0.2s; }
        #${CONSTANTS.IDS.WEBDAV_BROWSER_LIST} li:hover { background-color: #f5f5f5; }
        #${CONSTANTS.IDS.WEBDAV_BROWSER_LIST} li .webdav-backup-filename { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .webdav-delete-btn { flex-shrink: 0; padding: 4px 8px; font-size: 12px; }
        #${CONSTANTS.IDS.WEBDAV_BROWSER_LIST} li.loading-text { cursor: default; display: block; text-align: center; color: #888; pointer-events: none; }
        #${CONSTANTS.IDS.WEBDAV_BROWSER_LIST} li.loading-text:hover { background-color: transparent; }
        #${CONSTANTS.IDS.WEBDAV_SETTINGS_MODAL} .bm-content-panel { max-width: 550px; }
        .webdav-form-group { margin-bottom: 15px; }
        .webdav-form-group label { display: block; margin-bottom: 5px; color: #555; font-weight: 500; user-select: none;}
        .webdav-form-group input[type="checkbox"] { margin-right: 5px; vertical-align: middle; }
        .webdav-form-group input[type="text"], .webdav-form-group input[type="password"] { width: 100%; padding: 8px 12px; font-size: 15px; border-radius: 6px; border: 1px solid #DDD; box-sizing: border-box; }
        .webdav-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 20px; flex-wrap: wrap; gap: 10px; }
        .webdav-footer-buttons { margin-left: auto; }
        .${CONSTANTS.CLASSES.PINNED_ROW} { background-color: #FFF8E1; }
        .${CONSTANTS.CLASSES.PINNED_ROW} td:first-child::before {
            content: "";
            display: inline-block;
            width: 14px;
            height: 14px;
            margin-right: 4px;
            background-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="%23F57C00"/></svg>');
            background-size: contain;
            background-repeat: no-repeat;
            vertical-align: middle;
            position: relative;
            top: -2px;
        }
        .action-button { position: fixed; z-index: 9998; padding: 10px 15px; background-color: #fff; color: #333; border: 1px solid #DDD; border-radius: 20px; cursor: grab; font-size: 14px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); right: 24px; top: 50%; transform: translateY(-50%); touch-action: none; user-select: none; }
        .action-button.dragging { cursor: grabbing; }
        #${CONSTANTS.IDS.MANAGE_BUTTON} { right: 20px; top: 50%; transform: translateY(-50%); display: flex; align-items: center; gap: 4px; }
        .heart-icon { font-size: 18px; transition: all 0.2s ease; cursor: pointer; user-select: none; }
        .heart-icon.empty { color: #999; }
        .heart-icon.filled { color: #ff4444; }
        .heart-icon:hover { transform: scale(1.2); }
        .divider { color: #DDD; margin: 0 2px; user-select: none; }
        .${CONSTANTS.CLASSES.ROW_HIDING} { opacity: 0; transform: scale(0.95); }
        #${CONSTANTS.IDS.TABLE} tr { transition: opacity 0.3s ease, transform 0.3s ease; }
        /* [NEW] Tag Styles - 优化版 */
        #${CONSTANTS.IDS.TAG_FILTER_CONTAINER} {
            display: flex;
            flex-wrap: nowrap;
            gap: 0;
            margin-bottom: 15px;
            padding: 12px;
            background: linear-gradient(to bottom, #FAFAFA, #F5F5F5);
            border-radius: 8px;
            border: 1px solid #E8E8E8;
            align-items: center;
            overflow-x: auto;
            scrollbar-width: none;
            -ms-overflow-style: none;
            user-select: none;
        }
        #${CONSTANTS.IDS.TAG_FILTER_CONTAINER}::-webkit-scrollbar {
            display: none;
        }
        .${CONSTANTS.CLASSES.TAG_FILTER_BTN} {
            border: 1px solid #DDD;
            background-color: #FFF;
            color: #555;
            padding: 3px 10px;
            height: 24px;
            border-radius: 12px;
            cursor: pointer;
            font-size: 12px;
            transition: all 0.2s;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 1px 2px rgba(0,0,0,0.05);
            flex: 0 0 auto;
            margin-right: 6px;
        }
        .${CONSTANTS.CLASSES.TAG_FILTER_BTN}.tag-draggable {
            cursor: grab;
        }
        .${CONSTANTS.CLASSES.TAG_FILTER_BTN}.tag-draggable:active {
            cursor: grabbing;
        }
        .${CONSTANTS.CLASSES.TAG_FILTER_BTN}.tag-dragging {
            opacity: 0.75;
            cursor: grabbing !important;
        }
        .${CONSTANTS.CLASSES.TAG_FILTER_BTN}:hover:not(.${CONSTANTS.CLASSES.TAG_ACTIVE}) {
            transform: translateY(-1px);
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .${CONSTANTS.CLASSES.TAG_FILTER_BTN}.custom-tag {
            background: linear-gradient(135deg, #E8F5FE, #DAEFFF);
            border-color: #90CAF9;
            color: #1565C0;
            font-weight: 500;
        }
        .${CONSTANTS.CLASSES.TAG_FILTER_BTN}.original-tag {
            background-color: #F5F5F5;
            border-color: #CCC;
            color: #666;
        }
        .${CONSTANTS.CLASSES.TAG_FILTER_BTN}.${CONSTANTS.CLASSES.TAG_ACTIVE} {
            background: linear-gradient(135deg, #007AFF, #0066DD) !important;
            color: white !important;
            border-color: #0066DD !important;
            transform: scale(1.05);
        }
        .${CONSTANTS.CLASSES.TAG_PILL} { display: inline-block; background-color: #EFEFEF; color: #555; padding: 3px 8px; border-radius: 10px; font-size: 12px; margin-right: 5px; margin-bottom: 5px; position: relative; }
        .${CONSTANTS.CLASSES.TAG_PILL}.editable { padding-right: 20px; }
        .${CONSTANTS.CLASSES.TAG_REMOVE_BTN} { position: absolute; right: 2px; top: 50%; transform: translateY(-50%); background: none; border: none; color: #999; cursor: pointer; font-size: 10px; padding: 0; width: 14px; height: 14px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
        .${CONSTANTS.CLASSES.TAG_REMOVE_BTN}:hover { background-color: #ff4444; color: white; }
        .${CONSTANTS.CLASSES.TAG_EDIT_BTN} { background-color: #E8F5E8; color: #2E7D32; border: 1px solid #81C784; padding: 4px 10px; height: 26px; font-size: 13px; display: inline-flex; align-items: center; justify-content: center; }
        .${CONSTANTS.CLASSES.TAG_ADD_BTN} { background-color: #E3F2FD; color: #1976D2; border: 1px solid #64B5F6; font-size: 12px; padding: 4px 8px; height: 26px; margin-left: 5px; display: inline-flex; align-items: center; justify-content: center; }
        .${CONSTANTS.IDS.TAG_EDIT_INPUT} { width: 120px; padding: 2px 6px; font-size: 12px; border: 1px solid #DDD; border-radius: 3px; margin-right: 5px; }
        .tag-edit-mode { background-color: #F5F5F5; padding: 8px; border-radius: 4px; display: flex; flex-wrap: wrap; gap: 5px; align-items: center; line-height: 1.8; }
        .tag-edit-mode br { width: 100%; margin: 4px 0; }
        .bm-custom-tag-header { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; width: 100%; }
        .bm-tag-dropdown { position: relative; display: inline-flex; }
        .bm-tag-dropdown-toggle { background-color: #FFF; color: #1976D2; border: 1px solid #64B5F6; font-size: 12px; padding: 4px 12px 4px 10px; border-radius: 14px; cursor: pointer; transition: all 0.2s; }
        .bm-tag-dropdown-toggle::after { content: "▼"; font-size: 10px; margin-left: 6px; transition: transform 0.2s; color: inherit; }
        .bm-tag-dropdown.open .bm-tag-dropdown-toggle::after { transform: rotate(180deg); }
        .bm-tag-dropdown-list { display: none; position: absolute; top: calc(100% + 4px); left: 0; min-width: 200px; max-height: 220px; overflow-y: auto; background: #FFF; border: 1px solid #90CAF9; border-radius: 6px; box-shadow: 0 8px 20px rgba(0,0,0,0.15); padding: 6px; z-index: 1000; }
        .bm-tag-dropdown.open .bm-tag-dropdown-list { display: block; }
        .bm-tag-option { display: flex; align-items: center; gap: 6px; padding: 4px 6px; border-radius: 4px; font-size: 12px; color: #1976D2; cursor: pointer; }
        .bm-tag-option:hover { background-color: #E3F2FD; }
        .bm-tag-option input { margin: 0; }
        .bm-selected-tags { display: flex; flex-wrap: wrap; gap: 6px; width: 100%; margin: 6px 0; }
        .bm-selected-tag-pill { display: inline-flex; align-items: center; gap: 4px; background-color: #E3F2FD; color: #1976D2; border-left: 3px solid #64B5F6; border-radius: 10px; padding: 2px 8px; font-size: 12px; position: relative; }
        .bm-selected-tag-pill .${CONSTANTS.CLASSES.TAG_REMOVE_BTN} { position: static; background: none; color: #1976D2; width: auto; height: auto; font-size: 12px; }
        .bm-selected-tag-pill .${CONSTANTS.CLASSES.TAG_REMOVE_BTN}:hover { background-color: #ff4444; color: #FFF; }
        .bm-tag-empty-hint { font-size: 12px; color: #999; margin: 4px 0; display: block; }
        .${CONSTANTS.CLASSES.TAG_SAVE_BTN}, .${CONSTANTS.CLASSES.TAG_CANCEL_BTN} { font-size: 12px; padding: 4px 8px; height: 26px; display: inline-flex; align-items: center; justify-content: center; }
        /* Settings Modal Styles */
        #${CONSTANTS.IDS.SETTINGS_MODAL} .bm-content-panel { max-width: 800px; }
        .settings-sections { display: flex; flex-direction: column; gap: 20px; }
        .settings-section { background-color: #F9F9F9; border-radius: 8px; padding: 20px; border: 1px solid #EAEAEA; }
        .settings-section h3 { margin: 0 0 12px 0; font-size: 18px; color: #333; border-bottom: 2px solid #007AFF; padding-bottom: 8px; }
        .settings-buttons { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 8px; }
        .settings-desc { margin: 0; font-size: 13px; color: #666; line-height: 1.4; }
        /* Footer Styles - Left Search, Right Controls */
        #${CONSTANTS.IDS.FOOTER_CONTAINER} {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            padding-top: 10px;
            margin-top: 10px;
            border-top: 2px solid #EAEAEA;
            flex-shrink: 0;
            gap: 20px;
        }
        .footer-left {
            display: flex;
            align-items: center;
            gap: 8px;
            flex: 0 1 350px;
        }
        .footer-right {
            display: flex;
            align-items: center;
            gap: 15px;
            flex-shrink: 0;
        }
        .footer-show {
            display: flex;
            align-items: center;
            gap: 6px;
        }
        #${CONSTANTS.IDS.PAGE_SIZE_SELECT} {
            padding: 0 2px;
            border: none;
            font-size: 14px;
            cursor: pointer;
            background-color: transparent;
            width: auto;
            color: #666;
            appearance: none;
            -webkit-appearance: none;
            -moz-appearance: none;
            outline: none;
            transition: color 0.2s;
            vertical-align: baseline;
            line-height: 1;
            margin: 0;
            font-family: inherit;
        }
        #${CONSTANTS.IDS.PAGE_SIZE_SELECT}:hover {
            color: #007AFF;
        }
        #${CONSTANTS.IDS.PAGE_SIZE_SELECT}:focus {
            color: #007AFF;
        }
        .search-label, .show-label { font-size: 13px; color: #666; margin: 0; padding: 0; line-height: 1; vertical-align: baseline; }
        #${CONSTANTS.IDS.PAGINATION_INFO} { font-size: 13px; color: #666; }
        #${CONSTANTS.IDS.PAGINATION_CONTROLS} { display: flex; gap: 4px; align-items: center; }
        .pagination-btn { padding: 4px 8px; border: 1px solid #DDD; background-color: #FFF; border-radius: 4px; cursor: pointer; font-size: 13px; transition: all 0.2s; min-width: 32px; text-align: center; }
        .pagination-btn:hover:not(:disabled) { background-color: #F0F0F0; border-color: #007AFF; }
        .pagination-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .pagination-btn.active { background-color: #007AFF; color: white; border-color: #007AFF; }

        /* 移动端响应式样式 */
        @media (max-width: 768px) {
            /* 模态框调整 */
            #${CONSTANTS.IDS.MANAGER_MODAL} .bm-content-panel {
                width: 100%;
                height: 100%;
                max-width: 100%;
                max-height: 100%;
                border-radius: 0;
                padding: 15px;
            }

            #${CONSTANTS.IDS.SETTINGS_MODAL} .bm-content-panel,
            #${CONSTANTS.IDS.WEBDAV_SETTINGS_MODAL} .bm-content-panel,
            #${CONSTANTS.IDS.WEBDAV_BROWSER_MODAL} .bm-content-panel {
                width: 100%;
                max-width: 100%;
                padding: 15px;
                border-radius: 0;
            }

            /* 标题和按钮调整 */
            .bm-header h2 {
                font-size: 18px;
            }

            .bm-header-actions {
                gap: 8px;
            }

            /* 标签过滤器优化 */
            #${CONSTANTS.IDS.TAG_FILTER_CONTAINER} {
                padding: 8px;
                gap: 4px;
            }

            .${CONSTANTS.CLASSES.TAG_FILTER_BTN} {
                font-size: 11px;
                padding: 2px 8px;
                height: 22px;
            }

            /* 隐藏表格，使用卡片布局 */
            #${CONSTANTS.IDS.TABLE} {
                display: block;
                border: none;
            }

            #${CONSTANTS.IDS.TABLE} thead {
                display: none;
            }

            #${CONSTANTS.IDS.TABLE} tbody {
                display: block;
            }

            #${CONSTANTS.IDS.TABLE} tr {
                display: block;
                margin-bottom: 12px;
                border: 1px solid #EAEAEA;
                border-radius: 8px;
                padding: 12px;
                background-color: #FFF;
            }

            #${CONSTANTS.IDS.TABLE} tr:hover {
                background-color: #F8F9FA;
            }

            #${CONSTANTS.IDS.TABLE} td {
                display: block;
                border: none;
                padding: 6px 0;
                width: 100% !important;
                text-align: left !important;
            }

            #${CONSTANTS.IDS.TABLE} td::before {
                content: attr(data-label);
                font-weight: 600;
                color: #666;
                display: block;
                margin-bottom: 4px;
                font-size: 12px;
            }

            /* 名称单元格 */
            .bm-name-cell {
                font-size: 15px;
                font-weight: 600;
                color: #333;
                padding-top: 0 !important;
            }

            .bm-name-cell::before {
                display: none;
            }

            /* URL 单元格 */
            .bm-url-cell {
                font-size: 13px;
            }

            /* 时间单元格 */
            .bm-time-cell {
                font-size: 12px !important;
            }

            /* 操作按钮单元格 */
            .bm-actions-cell {
                display: flex !important;
                flex-wrap: wrap;
                gap: 6px;
                padding-top: 8px !important;
            }

            .bm-actions-cell::before {
                width: 100%;
            }

            .bm-actions-cell .bm-btn {
                flex: 1 1 auto;
                min-width: calc(50% - 3px);
                font-size: 12px;
                padding: 6px 8px;
                height: 32px;
            }

            /* 底部搜索和分页 */
            #${CONSTANTS.IDS.FOOTER_CONTAINER} {
                flex-direction: column;
                gap: 12px;
                padding-top: 12px;
            }

            .footer-left {
                width: 100%;
                flex: 1 1 100%;
            }

            .footer-right {
                width: 100%;
                flex-wrap: wrap;
                justify-content: space-between;
                gap: 8px;
            }

            .search-input-container {
                min-width: 0;
                flex: 1;
            }

            #${CONSTANTS.IDS.PAGINATION_INFO} {
                font-size: 12px;
                order: 1;
            }

            #${CONSTANTS.IDS.PAGINATION_CONTROLS} {
                order: 3;
                width: 100%;
                justify-content: center;
            }

            .footer-show {
                order: 2;
                font-size: 12px;
            }

            .pagination-btn {
                font-size: 12px;
                padding: 6px 10px;
                min-width: 36px;
                height: 36px;
            }

            /* 控制按钮组 */
            .controls-buttons {
                gap: 6px;
            }

            .controls-buttons .bm-btn {
                font-size: 12px;
                padding: 6px 10px;
                height: 32px;
            }

            /* 浮动按钮调整 */
            .action-button {
                font-size: 13px;
                padding: 8px 12px;
                border-radius: 18px;
            }

            /* 表单调整 */
            .webdav-form-group input[type="text"],
            .webdav-form-group input[type="password"] {
                font-size: 14px;
            }

            /* Toast 通知 */
            .bm-toast {
                font-size: 13px;
                padding: 10px 16px;
                bottom: 12px;
                right: 12px;
                left: 12px;
                max-width: calc(100% - 24px);
            }

            /* 配置页面调整 */
            .settings-section h3 {
                font-size: 16px;
            }

            .settings-desc {
                font-size: 12px;
            }

            .settings-buttons .bm-btn {
                font-size: 12px;
                padding: 6px 10px;
                height: 32px;
            }

            /* WebDAV 浏览器列表 */
            #${CONSTANTS.IDS.WEBDAV_BROWSER_LIST} li {
                flex-direction: column;
                align-items: flex-start;
                gap: 8px;
            }

            .webdav-delete-btn {
                align-self: flex-end;
            }

            /* 触摸目标优化 */
            .bm-close-btn,
            .bm-settings-btn {
                width: 32px;
                height: 32px;
            }

            .bm-close-btn svg,
            .bm-settings-btn svg {
                width: 22px;
                height: 22px;
            }

            /* 标签编辑 */
            .${CONSTANTS.IDS.TAG_EDIT_INPUT} {
                width: 100%;
                font-size: 14px;
                padding: 6px 8px;
            }

            .${CONSTANTS.CLASSES.TAG_PILL} {
                font-size: 11px;
            }

            /* 搜索清除按钮 */
            .search-clear-btn {
                width: 16px;
                height: 16px;
                font-size: 11px;
                right: 8px;
            }

            /* 置顶行样式 */
            .${CONSTANTS.CLASSES.PINNED_ROW} td:first-child::before {
                content: "";
                display: inline-block;
                width: 14px;
                height: 14px;
                margin-right: 4px;
                background-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="%23F57C00"/></svg>');
                background-size: contain;
                background-repeat: no-repeat;
                vertical-align: middle;
                position: relative;
                top: -2px;
            }
        }
    `);

    document.body.insertAdjacentHTML(
        "beforeend",
        `
  <div id="${CONSTANTS.IDS.MANAGER_MODAL}" class="${CONSTANTS.CLASSES.MODAL_BACKDROP}">
    <div class="bm-content-panel">
      <div class="bm-header">
        <h2 id="bm-header-title">收藏夹</h2>
        <div class="bm-header-actions">
          <button id="${CONSTANTS.IDS.TRASH_BACK_BUTTON}" class="bm-settings-btn" aria-label="返回收藏夹" title="返回收藏夹" style="display:none;">
            <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
              <path fill="currentColor" d="M14.5 3H7.71l-.85-.85L6.51 2h-5l-.5.5v11l.5.5h13l.5-.5v-10L14.5 3zm-.51 8.49V13h-12V7h4.49l.35-.15.86-.86H14v1.5l-.01 4zm0-6.49h-6.5l-.35.15-.86.86H2v-3h4.29l.85.85.36.15H14l-.01.99z"/>
            </svg>
          </button>
          <button id="${CONSTANTS.IDS.SETTINGS_BUTTON}" class="bm-settings-btn" aria-label="打开配置">
            <svg class="bm-settings-icon" viewBox="0 0 72 72" aria-hidden="true" focusable="false">
              <g>
                <g>
                  <path fill="currentColor" d="M35.649,45.188c-5.066,0-9.188-4.121-9.188-9.188c0-5.066,4.121-9.188,9.188-9.188c5.065,0,9.188,4.122,9.188,9.188 C44.837,41.067,40.715,45.188,35.649,45.188z M35.649,30.812c-2.86,0-5.188,2.327-5.188,5.188s2.327,5.188,5.188,5.188 s5.188-2.327,5.188-5.188S38.51,30.812,35.649,30.812z"/>
                </g>
                <g>
                  <path fill="currentColor" d="M35.913,68.5H35.72c-3.65,0-6.958-2.748-8.125-6.572c-1.561-0.485-3.078-1.115-4.536-1.881 c-1.498,0.842-3.155,1.297-4.777,1.297c-2.091,0-4.015-0.773-5.418-2.177l-0.172-0.182c-2.541-2.54-2.924-6.823-1.034-10.357 c-0.752-1.44-1.274-2.976-1.768-4.585c-3.83-1.157-6.39-4.326-6.39-7.92v-0.193c0-3.607,2.558-6.795,6.384-7.966 c0.519-1.718,1.103-3.29,1.876-4.755c-1.943-3.501-1.652-7.604,0.887-10.144l0.126-0.139c1.462-1.462,3.494-2.269,5.731-2.269 c1.628,0,3.261,0.424,4.717,1.211c1.364-0.705,2.781-1.292,4.236-1.753C28.459,6.262,31.806,3.5,35.72,3.5h0.193 c3.859,0,7.03,2.714,7.96,6.625c1.474,0.469,2.909,1.065,4.288,1.783c1.399-0.82,2.991-1.262,4.597-1.262 c2.262,0,4.368,0.86,5.931,2.422l0.103,0.095c2.772,2.771,3.104,6.936,1.002,10.354c0.73,1.394,1.436,2.813,1.897,4.242 c3.905,0.924,6.81,4.232,6.81,8.171v0.193c0,3.918-2.906,7.207-6.815,8.121c-0.438,1.333-1.068,2.691-1.781,4.062 c2.063,3.443,1.637,7.79-1.157,10.585l-0.146,0.213C57.103,60.6,55.098,61.5,52.983,61.5h0.002c-1.601,0-3.214-0.549-4.656-1.42 c-1.47,0.779-3.003,1.38-4.583,1.873C42.663,65.838,39.531,68.5,35.913,68.5z M22.983,55.719c0.349,0,0.697,0.09,1.01,0.273 c1.821,1.064,3.767,1.873,5.78,2.4c0.76,0.198,1.333,0.824,1.465,1.598c0.431,2.529,2.399,4.51,4.481,4.51h0.193 c2.282,0,3.818-2.252,4.155-4.477c0.119-0.79,0.697-1.433,1.47-1.635c2.061-0.541,4.042-1.37,5.891-2.465 c0.721-0.428,1.632-0.359,2.282,0.169c0.989,0.806,2.153,1.249,3.277,1.25l0,0c1.062,0,2.019-0.396,2.768-1.145l0.133-0.134 c1.654-1.654,1.683-4.389,0.066-6.361c-0.524-0.641-0.6-1.539-0.189-2.258c1.075-1.887,1.856-3.732,2.323-5.488 c0.217-0.817,1.029-1.41,1.872-1.48c2.569-0.213,4.539-2.045,4.539-4.354v-0.193c0-2.336-1.971-4.189-4.542-4.408 c-0.841-0.071-1.6-0.663-1.816-1.479c-0.504-1.899-1.333-3.802-2.41-5.654c-0.421-0.724-0.359-1.633,0.174-2.279 c1.648-1.997,1.688-4.496,0.106-6.078l-0.104-0.095c-0.85-0.848-1.954-1.292-3.147-1.292c-1.151,0-2.298,0.414-3.229,1.164 c-0.645,0.52-1.544,0.589-2.261,0.172c-1.784-1.038-3.692-1.83-5.671-2.355c-0.809-0.214-1.399-0.909-1.479-1.742 C39.871,9.303,38.142,7.5,35.913,7.5H35.72c-2.313,0-4.264,1.895-4.535,4.407c-0.089,0.823-0.676,1.506-1.477,1.719 c-1.935,0.512-3.806,1.283-5.562,2.291c-0.68,0.392-1.528,0.348-2.165-0.112c-1.011-0.729-2.28-1.146-3.482-1.146 c-1.169,0-2.203,0.391-2.912,1.1l-0.14,0.139c-1.6,1.6-1.107,4.267,0.206,6.074c0.471,0.647,0.511,1.513,0.101,2.2 c-1.046,1.755-1.841,3.707-2.431,5.965c-0.197,0.755-0.71,1.326-1.479,1.463C9.308,32.052,7.5,33.914,7.5,35.931v0.193 c0,1.996,1.806,3.835,4.34,4.279c0.771,0.135,1.339,0.707,1.537,1.465c0.547,2.094,1.319,4.047,2.348,5.805 c0.397,0.678,0.347,1.527-0.109,2.168c-1.491,2.098-1.515,4.893-0.045,6.362l0.168,0.181c0.787,0.786,1.821,0.961,2.544,0.961 c1.171,0,2.452-0.451,3.515-1.235C22.149,55.85,22.565,55.719,22.983,55.719z"/>
                </g>
                <g>
                  <g>
                    <path fill="currentColor" d="M52.704,30.489c-0.402,0-0.781-0.244-0.934-0.642c-2.54-6.612-9.007-11.054-16.092-11.055c-0.553,0-1-0.448-1-1 s0.447-1,1-1l0,0c7.906,0,15.124,4.958,17.959,12.338c0.197,0.515-0.06,1.094-0.575,1.292 C52.944,30.468,52.823,30.489,52.704,30.489z"/>
                  </g>
                  <g>
                    <path fill="currentColor" d="M18.936,44.918c-0.339,0-0.67-0.173-0.857-0.484c-0.199-0.33-0.288-0.574-0.448-1.02 c-0.077-0.211-0.175-0.483-0.318-0.857c-0.198-0.516,0.06-1.094,0.575-1.291c0.515-0.199,1.094,0.06,1.292,0.574 c0.149,0.39,0.252,0.674,0.331,0.894c0.146,0.401,0.188,0.513,0.281,0.667c0.285,0.474,0.133,1.088-0.34,1.373 C19.289,44.872,19.111,44.918,18.936,44.918z"/>
                  </g>
                  <g>
                    <path fill="currentColor" d="M35.271,54.895L35.271,54.895c-5.683,0-11.045-2.494-14.711-6.843c-0.356-0.423-0.303-1.054,0.12-1.409 c0.421-0.356,1.053-0.303,1.409,0.12c3.285,3.896,8.09,6.132,13.182,6.132c0.552,0,1,0.448,1,1 C36.271,54.448,35.823,54.895,35.271,54.895z"/>
                  </g>
                </g>
              </g>
            </svg>
          </button>
          <button type="button" class="${CONSTANTS.CLASSES.CLOSE_BTN}" data-target-modal="${CONSTANTS.IDS.MANAGER_MODAL}" aria-label="关闭">
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
            </svg>
          </button>
        </div>
      </div>
      <div id="${CONSTANTS.IDS.TAG_FILTER_CONTAINER}"></div>
      <div id="${CONSTANTS.IDS.TABLE_CONTAINER}"></div>
      <div id="${CONSTANTS.IDS.FOOTER_CONTAINER}">
        <div class="footer-left">
          <label for="${CONSTANTS.IDS.SEARCH_INPUT}" class="search-label">Search:</label>
          <div class="search-input-container">
            <input type="text" id="${CONSTANTS.IDS.SEARCH_INPUT}" placeholder="搜索...">
            <button class="search-clear-btn" aria-label="清除搜索">✕</button>
          </div>
        </div>
        <div class="footer-right">
          <div id="${CONSTANTS.IDS.PAGINATION_INFO}"></div>
          <div id="${CONSTANTS.IDS.PAGINATION_CONTROLS}"></div>
          <div class="footer-show">
            <label for="${CONSTANTS.IDS.PAGE_SIZE_SELECT}" class="show-label">Show:</label>
            <select id="${CONSTANTS.IDS.PAGE_SIZE_SELECT}">
              <option value="5">5</option>
              <option value="10" selected>10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div id="${CONSTANTS.IDS.SETTINGS_MODAL}" class="${CONSTANTS.CLASSES.MODAL_BACKDROP}">
    <div class="bm-content-panel" style="max-width: 800px;">
      <div class="bm-header">
        <h2>配置与管理</h2>
        <button type="button" class="${CONSTANTS.CLASSES.CLOSE_BTN}" data-target-modal="${CONSTANTS.IDS.SETTINGS_MODAL}" aria-label="关闭">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
          </svg>
        </button>
      </div>
      <div class="settings-sections">
        <div class="settings-section">
          <h3>数据管理</h3>
          <div class="settings-buttons">
            <button id="import-bookmarks-btn" class="bm-btn bm-btn-io">导入收藏</button>
            <button id="export-bookmarks-btn" class="bm-btn bm-btn-io">导出收藏</button>
          </div>
          <p class="settings-desc">从本地文件导入或导出收藏数据</p>
        </div>

        <div class="settings-section">
          <h3>云端同步</h3>
          <div class="settings-buttons">
            <button id="sync-from-cloud-btn" class="bm-btn bm-btn-cloud">恢复</button>
            <button id="sync-to-cloud-btn" class="bm-btn bm-btn-cloud">备份</button>
            <button id="webdav-settings-btn" class="bm-btn">云同步设置</button>
          </div>
          <p class="settings-desc">通过 WebDAV 在多设备间同步收藏</p>
        </div>

        <div class="settings-section">
          <h3>标签管理</h3>
          <div class="settings-buttons">
            <button id="${CONSTANTS.IDS.RENAME_TAGS_BUTTON}" class="bm-btn">批量重命名标签</button>
          </div>
          <p class="settings-desc">批量重命名自定义标签</p>
        </div>

        <div class="settings-section">
          <h3>回收站</h3>
          <div class="settings-buttons">
            <button id="${CONSTANTS.IDS.TRASH_TOGGLE_BUTTON}" class="bm-btn bm-btn-danger">查看回收站</button>
            <button id="${CONSTANTS.IDS.EMPTY_TRASH_BUTTON}" class="bm-btn bm-btn-danger">清空回收站</button>
          </div>
          <p class="settings-desc">查看已删除的收藏或清空回收站</p>
        </div>
      </div>
    </div>
  </div>

  <div id="${CONSTANTS.IDS.WEBDAV_SETTINGS_MODAL}" class="${CONSTANTS.CLASSES.MODAL_BACKDROP}">
    <div class="bm-content-panel">
      <div class="bm-header">
        <h2>WebDAV 云同步设置</h2>
        <button type="button" class="${CONSTANTS.CLASSES.CLOSE_BTN}" data-target-modal="${CONSTANTS.IDS.WEBDAV_SETTINGS_MODAL}" aria-label="关闭">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
          </svg>
        </button>
      </div>
      <div class="webdav-form-group"><label for="webdav-server">服务器地址:</label><input type="text" id="webdav-server" class="webdav-input" placeholder="例如: https://dav.jianguoyun.com/dav/"></div>
      <div class="webdav-form-group"><label for="webdav-user">用户名:</label><input type="text" id="webdav-user" class="webdav-input"></div>
      <div class="webdav-form-group"><label for="webdav-pass">应用密码 (非登录密码):</label><input type="password" id="webdav-pass" class="webdav-input"></div>
      <div class="webdav-form-group"><label><input type="checkbox" id="${CONSTANTS.IDS.AUTO_SYNC_TOGGLE}">当收藏变化时自动备份</label></div>
      <div class="webdav-footer">
        <div id="${CONSTANTS.IDS.WEBDAV_TEST_RESULT}"></div>
        <div class="webdav-footer-buttons"><button id="test-webdav-connection" class="bm-btn">测试连接</button><button id="save-webdav-settings" class="bm-btn bm-btn-io">保存</button></div>
      </div>
    </div>
  </div>
        <div id="${CONSTANTS.IDS.WEBDAV_BROWSER_MODAL}" class="${CONSTANTS.CLASSES.MODAL_BACKDROP}">
          <div class="bm-content-panel">
            <div class="bm-header">
              <h2>选择一个云端备份进行恢复</h2>
              <button type="button" class="${CONSTANTS.CLASSES.CLOSE_BTN}" data-target-modal="${CONSTANTS.IDS.WEBDAV_BROWSER_MODAL}" aria-label="关闭">
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
                </svg>
              </button>
            </div>
            <ul id="${CONSTANTS.IDS.WEBDAV_BROWSER_LIST}"><li class="loading-text">正在加载备份列表...</li></ul>
          </div>
        </div>
        <template id="${CONSTANTS.IDS.ROW_TEMPLATE}">
             <tr data-url-key="">
                <td class="bm-name-cell" data-label="名称"></td>
                <td class="bm-url-cell" data-label="链接"><a href="" target="_blank" title=""></a></td>
                <td class="${CONSTANTS.CLASSES.TAG_CELL}" data-label="标签"></td>
                <td class="bm-time-cell" data-label="时间"></td>
                <td class="bm-actions-cell" data-label="操作" style="text-align:center; white-space:nowrap;">
                    <button class="bm-btn bm-btn-pin ${CONSTANTS.CLASSES.PIN_BTN}">置顶</button>
                    <button class="bm-btn ${CONSTANTS.CLASSES.RENAME_BTN}">重命名</button>
                    <button class="bm-btn ${CONSTANTS.CLASSES.TAG_EDIT_BTN}">编辑标签</button>
                    <button class="bm-btn bm-btn-danger ${CONSTANTS.CLASSES.DELETE_BTN}">删除</button>
                </td>
            </tr>
        </template>
    `
    );

    // --- Part 2: DOM 元素获取与核心变量 ---
    const getEl = (id) => document.getElementById(id);
    const managerModal = getEl(CONSTANTS.IDS.MANAGER_MODAL);
    const settingsModal = getEl(CONSTANTS.IDS.SETTINGS_MODAL);
    const webdavSettingsModal = getEl(CONSTANTS.IDS.WEBDAV_SETTINGS_MODAL);
    const webdavBrowserModal = getEl(CONSTANTS.IDS.WEBDAV_BROWSER_MODAL);
    const trashBackButton = getEl(CONSTANTS.IDS.TRASH_BACK_BUTTON);
    const searchInput = getEl(CONSTANTS.IDS.SEARCH_INPUT);
    const tableContainer = getEl(CONSTANTS.IDS.TABLE_CONTAINER);
    const webdavTestResult = getEl(CONSTANTS.IDS.WEBDAV_TEST_RESULT);
    const autoSyncToggle = getEl(CONSTANTS.IDS.AUTO_SYNC_TOGGLE);
    const webdavBrowserList = getEl(CONSTANTS.IDS.WEBDAV_BROWSER_LIST);
    const rowTemplate = getEl(CONSTANTS.IDS.ROW_TEMPLATE);
    const tagFilterContainer = getEl(CONSTANTS.IDS.TAG_FILTER_CONTAINER);
    const pageSizeSelect = getEl(CONSTANTS.IDS.PAGE_SIZE_SELECT);
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".json";
    fileInput.style.display = "none";
    document.body.appendChild(fileInput);

    // --- Part 3: 核心函数 ---
    const getRootTopicUrl = (url) =>
        (url.match(/(https:\/\/(?:linux\.do|idcflare\.com)\/t\/[^\/]+\/\d+)/) || [])[0] || url;
    const pad = (num) => num.toString().padStart(2, "0");
    const getTimestampedFilename = () => {
        const d = new Date();
        const date = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
            d.getDate()
        )}`;
        const time = `${pad(d.getHours())}-${pad(d.getMinutes())}-${pad(
            d.getSeconds()
        )}`;
        return `linuxdo-backup-${date}_${time}.json`;
    };

    function showToast(message, options = {}) {
        const { isError = false, duration = 3000, actions = [] } = options;
        const toast = document.createElement("div");
        toast.className = `bm-toast ${isError ? "error" : ""}`;

        const messageSpan = document.createElement("span");
        messageSpan.textContent = message;
        toast.appendChild(messageSpan);

        actions.forEach((action) => {
            const actionLink = document.createElement("a");
            actionLink.textContent = action.text;
            actionLink.className = "bm-toast-action";
            actionLink.onclick = (e) => {
                e.stopPropagation();
                action.onClick();
                toast.remove();
            };
            toast.appendChild(actionLink);
        });

        document.body.appendChild(toast);
        setTimeout(() => {
            toast.classList.add("show");
            setTimeout(() => {
                toast.classList.remove("show");
                setTimeout(() => toast.remove(), 500);
            }, duration);
        }, 10);
    }

    const getTagOrderKey = (tag, isCustom) => `${isCustom ? "custom" : "original"}:${tag}`;
    const tagDragState = {
        draggedButton: null,
        hasMoved: false,
    };

    function renderTagFilters() {
        // 在回收站视图隐藏标签筛选
        if (viewMode === "trash") {
            tagFilterContainer.style.display = "none";
            return;
        }
        tagFilterContainer.style.display = "block";
        const allBookmarks = GM_getValue(CONSTANTS.STORAGE_KEYS.BOOKMARKS, []);
        const originalTags = new Set(); // 帖子自带的标签
        const customTags = new Set(); // 用户自定义的标签

        allBookmarks.forEach((bm) => {
            // 帖子自带的标签（从 tags 数组获取）
            bm.tags?.forEach((tag) => originalTags.add(tag));
            // 用户自定义的标签（从 customTags 数组获取）
            bm.customTags?.forEach((tag) => customTags.add(tag));
        });

        // 清空容器
        tagFilterContainer.innerHTML = "";
        ensureTagDragHandlersInitialized();

        const createButton = (text, tag, isCustom = false) => {
            const btn = document.createElement("button");
            btn.textContent = text;
            btn.className = CONSTANTS.CLASSES.TAG_FILTER_BTN;
            btn.dataset.tag = tag === null ? "" : tag;
            btn.dataset.isCustom = isCustom;

            if (tag !== null) {
                btn.classList.add(isCustom ? "custom-tag" : "original-tag");
                btn.dataset.tagKey = getTagOrderKey(tag, isCustom);
                btn.draggable = true;
                btn.classList.add("tag-draggable");
            } else {
                btn.draggable = false;
            }

            if (activeTagFilter === tag) {
                btn.classList.add(CONSTANTS.CLASSES.TAG_ACTIVE);
            }
            return btn;
        };

        // 添加"所有标签"按钮
        tagFilterContainer.appendChild(createButton("所有标签", null));

        const storedOrderRaw = GM_getValue(CONSTANTS.STORAGE_KEYS.TAG_ORDER, []);
        const tagEntries = [];

        Array.from(originalTags).forEach((tag) => {
            tagEntries.push({
                label: tag,
                tag,
                isCustom: false,
                key: getTagOrderKey(tag, false),
            });
        });

        Array.from(customTags).forEach((tag) => {
            tagEntries.push({
                label: tag,
                tag,
                isCustom: true,
                key: getTagOrderKey(tag, true),
            });
        });

        const availableKeys = new Set(tagEntries.map((entry) => entry.key));
        const cleanedOrder = storedOrderRaw.filter((key) =>
            availableKeys.has(key)
        );

        if (cleanedOrder.length !== storedOrderRaw.length) {
            GM_setValue(CONSTANTS.STORAGE_KEYS.TAG_ORDER, cleanedOrder);
        }

        const orderMap = new Map();
        cleanedOrder.forEach((key, index) => orderMap.set(key, index));

        tagEntries.sort((a, b) => {
            const idxA = orderMap.has(a.key)
                ? orderMap.get(a.key)
                : Number.MAX_SAFE_INTEGER;
            const idxB = orderMap.has(b.key)
                ? orderMap.get(b.key)
                : Number.MAX_SAFE_INTEGER;

            if (idxA !== idxB) return idxA - idxB;
            if (a.isCustom !== b.isCustom) return a.isCustom ? 1 : -1;
            return TAG_COLLATOR.compare(a.tag, b.tag);
        });

        let orderUpdated = false;
        tagEntries.forEach((entry) => {
            if (!orderMap.has(entry.key)) {
                orderMap.set(entry.key, cleanedOrder.length);
                cleanedOrder.push(entry.key);
                orderUpdated = true;
            }
        });

        if (orderUpdated) {
            GM_setValue(CONSTANTS.STORAGE_KEYS.TAG_ORDER, cleanedOrder);
        }

        tagEntries.forEach((entry) => {
            tagFilterContainer.appendChild(
                createButton(entry.label, entry.tag, entry.isCustom)
            );
        });
    }

    function ensureTagDragHandlersInitialized() {
        if (ensureTagDragHandlersInitialized.initialized || !tagFilterContainer) {
            return;
        }
        tagFilterContainer.addEventListener("dragstart", handleTagDragStart);
        tagFilterContainer.addEventListener("dragover", handleTagDragOver);
        tagFilterContainer.addEventListener("drop", handleTagDrop);
        tagFilterContainer.addEventListener("dragend", handleTagDragEnd);
        ensureTagDragHandlersInitialized.initialized = true;
    }
    ensureTagDragHandlersInitialized.initialized = false;

    function handleTagDragStart(event) {
        const button = event.target.closest(`.${CONSTANTS.CLASSES.TAG_FILTER_BTN}`);
        if (!button || !button.dataset.tagKey) return;

        tagDragState.draggedButton = button;
        tagDragState.hasMoved = false;
        button.classList.add("tag-dragging");

        if (event.dataTransfer) {
            event.dataTransfer.effectAllowed = "move";
            event.dataTransfer.setData("text/plain", button.dataset.tag || "");
        }
    }

    function handleTagDragOver(event) {
        if (!tagDragState.draggedButton) return;
        event.preventDefault();

        const container = tagFilterContainer;
        if (!container) return;

        const hoveredButton = event.target.closest(`.${CONSTANTS.CLASSES.TAG_FILTER_BTN}`);
        if (!hoveredButton || hoveredButton === tagDragState.draggedButton) {
            return;
        }

        if (!hoveredButton.dataset.tagKey) {
            return;
        }

        const rect = hoveredButton.getBoundingClientRect();
        const isBefore = event.clientX < rect.left + rect.width / 2;
        const referenceNode = isBefore
            ? hoveredButton
            : hoveredButton.nextSibling;

        if (referenceNode !== tagDragState.draggedButton) {
            container.insertBefore(tagDragState.draggedButton, referenceNode);
            tagDragState.hasMoved = true;
        }
    }

    function handleTagDrop(event) {
        if (!tagDragState.draggedButton) return;
        event.preventDefault();
    }

    function handleTagDragEnd() {
        if (tagDragState.draggedButton) {
            tagDragState.draggedButton.classList.remove("tag-dragging");
        }
        if (tagDragState.hasMoved) {
            updateTagOrderStorage();
        }
        tagDragState.draggedButton = null;
        tagDragState.hasMoved = false;
    }

    function updateTagOrderStorage() {
        if (!tagFilterContainer) return;

        const buttons = tagFilterContainer.querySelectorAll(
            `.${CONSTANTS.CLASSES.TAG_FILTER_BTN}`
        );
        const newOrder = [];
        buttons.forEach((btn) => {
            if (btn.dataset.tagKey) {
                newOrder.push(btn.dataset.tagKey);
            }
        });

        const currentOrder = GM_getValue(
            CONSTANTS.STORAGE_KEYS.TAG_ORDER,
            []
        );

        if (
            currentOrder.length === newOrder.length &&
            currentOrder.every((key, index) => key === newOrder[index])
        ) {
            return;
        }

        GM_setValue(CONSTANTS.STORAGE_KEYS.TAG_ORDER, newOrder);
    }

    function renderBookmarksTable() {
        if (viewMode === "trash") {
            renderTrashTable();
            return;
        }
        const searchText = searchInput.value.toLowerCase();
        const allBookmarks = GM_getValue(CONSTANTS.STORAGE_KEYS.BOOKMARKS, []);

        const filteredBookmarks = allBookmarks.filter((bm) => {
            const hasTag =
                !activeTagFilter ||
                (bm.tags && bm.tags.includes(activeTagFilter)) ||
                (bm.customTags && bm.customTags.includes(activeTagFilter));
            const hasText =
                !searchText ||
                bm.name.toLowerCase().includes(searchText) ||
                bm.url.toLowerCase().includes(searchText) ||
                (bm.tags &&
                    bm.tags.some((t) => t.toLowerCase().includes(searchText))) ||
                (bm.customTags &&
                    bm.customTags.some((t) => t.toLowerCase().includes(searchText)));
            return hasTag && hasText;
        });

        if (filteredBookmarks.length === 0) {
            tableContainer.innerHTML =
                '<p style="text-align:center; color:#888; padding:20px 0;">没有找到匹配的收藏。</p>';
            updatePagination(0, 0);
            return;
        }

        const sortedBookmarks = [...filteredBookmarks].sort((a, b) =>
            a.pinned === b.pinned ? 0 : a.pinned ? -1 : 1
        );

        // 分页计算
        const totalItems = sortedBookmarks.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        if (currentPage > totalPages) currentPage = totalPages;
        if (currentPage < 1) currentPage = 1;

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
        const pageBookmarks = sortedBookmarks.slice(startIndex, endIndex);

        const table = document.createElement("table");
        table.id = CONSTANTS.IDS.TABLE;
        table.innerHTML = `<thead><tr><th style="width: 31%;">名称</th><th style="width: 20%;">链接</th><th style="width: 16%;">标签</th><th style="width: 11%;">收藏时间</th><th style="width: 22%; text-align:center;">操作</th></tr></thead>`;
        const tbody = document.createElement("tbody");

        pageBookmarks.forEach((bookmark) => {
            const row = rowTemplate.content.cloneNode(true).firstElementChild;
            row.dataset.urlKey = getRootTopicUrl(bookmark.url);

            row.querySelector(".bm-name-cell").textContent = bookmark.name;
            const link = row.querySelector(".bm-url-cell a");
            link.href = bookmark.url;
            link.textContent = bookmark.url;
            link.title = bookmark.url;

            const tagCell = row.querySelector(`.${CONSTANTS.CLASSES.TAG_CELL}`);

            // 显示帖子自带的标签
            if (bookmark.tags && bookmark.tags.length > 0) {
                bookmark.tags.forEach((tag) => {
                    const pill = document.createElement("span");
                    pill.className = `${CONSTANTS.CLASSES.TAG_PILL}`;
                    pill.textContent = tag;
                    pill.style.backgroundColor = "#EFEFEF";
                    pill.style.color = "#555";
                    tagCell.appendChild(pill);
                });
            }

            // 显示用户自定义的标签
            if (bookmark.customTags && bookmark.customTags.length > 0) {
                bookmark.customTags.forEach((tag) => {
                    const pill = document.createElement("span");
                    pill.className = `${CONSTANTS.CLASSES.TAG_PILL} editable`;
                    pill.textContent = tag;
                    pill.style.backgroundColor = "#E3F2FD";
                    pill.style.color = "#1976D2";
                    pill.style.borderLeft = "3px solid #64B5F6";

                    // 添加删除按钮（只有自定义标签可以删除）
                    const removeBtn = document.createElement("button");
                    removeBtn.className = CONSTANTS.CLASSES.TAG_REMOVE_BTN;
                    removeBtn.textContent = "×";
                    removeBtn.title = "删除自定义标签";
                    removeBtn.onclick = (e) => {
                        e.stopPropagation();
                        removeCustomTagFromBookmark(getRootTopicUrl(bookmark.url), tag);
                    };

                    pill.appendChild(removeBtn);
                    tagCell.appendChild(pill);
                });
            }

            // 显示收藏时间
            const timeCell = row.querySelector(".bm-time-cell");
            if (bookmark.timestamp) {
                const date = new Date(bookmark.timestamp);
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');
                timeCell.textContent = `${year}-${month}-${day} ${hours}:${minutes}`;
            } else {
                timeCell.textContent = "未知";
            }

            const pinBtn = row.querySelector(`.${CONSTANTS.CLASSES.PIN_BTN}`);
            if (bookmark.pinned) {
                row.classList.add(CONSTANTS.CLASSES.PINNED_ROW);
                pinBtn.style.backgroundColor = "#f39c12";
                pinBtn.style.color = "#fff";
                pinBtn.classList.add(CONSTANTS.CLASSES.UNPIN_BTN);
            } else {
                pinBtn.style.backgroundColor = "";
                pinBtn.style.color = "";
                pinBtn.classList.remove(CONSTANTS.CLASSES.UNPIN_BTN);
            }
            tbody.appendChild(row);
        });

        table.appendChild(tbody);
        tableContainer.innerHTML = "";
        tableContainer.appendChild(table);

        // 更新分页信息
        updatePagination(totalItems, totalPages);
    }

    // 更新分页信息和控件
    function updatePagination(totalItems, totalPages) {
        const paginationInfo = getEl(CONSTANTS.IDS.PAGINATION_INFO);
        const paginationControls = getEl(CONSTANTS.IDS.PAGINATION_CONTROLS);

        if (totalItems === 0) {
            paginationInfo.textContent = "";
            paginationControls.innerHTML = "";
            return;
        }

        // 显示信息: "Showing 1 to 20 of 432 entries"
        const startIndex = (currentPage - 1) * itemsPerPage + 1;
        const endIndex = Math.min(currentPage * itemsPerPage, totalItems);
        paginationInfo.textContent = `Showing ${startIndex} to ${endIndex} of ${totalItems} entries`;

        // 生成分页按钮
        paginationControls.innerHTML = "";

        // 上一页按钮
        const prevBtn = document.createElement("button");
        prevBtn.className = "pagination-btn";
        prevBtn.textContent = "<";
        prevBtn.disabled = currentPage === 1;
        prevBtn.onclick = () => {
            if (currentPage > 1) {
                currentPage--;
                renderBookmarksTable();
            }
        };
        paginationControls.appendChild(prevBtn);

        // 页码按钮 (显示当前页附近的页码)
        const maxButtons = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
        let endPage = Math.min(totalPages, startPage + maxButtons - 1);

        if (endPage - startPage < maxButtons - 1) {
            startPage = Math.max(1, endPage - maxButtons + 1);
        }

        if (startPage > 1) {
            const firstBtn = document.createElement("button");
            firstBtn.className = "pagination-btn";
            firstBtn.textContent = "1";
            firstBtn.onclick = () => {
                currentPage = 1;
                renderBookmarksTable();
            };
            paginationControls.appendChild(firstBtn);

            if (startPage > 2) {
                const dots = document.createElement("span");
                dots.textContent = "...";
                dots.style.padding = "0 8px";
                paginationControls.appendChild(dots);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            const pageBtn = document.createElement("button");
            pageBtn.className = "pagination-btn" + (i === currentPage ? " active" : "");
            pageBtn.textContent = i;
            pageBtn.onclick = () => {
                currentPage = i;
                renderBookmarksTable();
            };
            paginationControls.appendChild(pageBtn);
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                const dots = document.createElement("span");
                dots.textContent = "...";
                dots.style.padding = "0 8px";
                paginationControls.appendChild(dots);
            }

            const lastBtn = document.createElement("button");
            lastBtn.className = "pagination-btn";
            lastBtn.textContent = totalPages;
            lastBtn.onclick = () => {
                currentPage = totalPages;
                renderBookmarksTable();
            };
            paginationControls.appendChild(lastBtn);
        }

        // 下一页按钮
        const nextBtn = document.createElement("button");
        nextBtn.className = "pagination-btn";
        nextBtn.textContent = ">";
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.onclick = () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderBookmarksTable();
            }
        };
        paginationControls.appendChild(nextBtn);
    }

    // [NEW] 回收站渲染
    function renderTrashTable() {
        const searchText = searchInput.value.toLowerCase();
        const allTrash = GM_getValue(CONSTANTS.STORAGE_KEYS.TRASH, []);

        const filtered = allTrash.filter((bm) => {
            const hasText =
                !searchText ||
                (bm.name && bm.name.toLowerCase().includes(searchText)) ||
                (bm.url && bm.url.toLowerCase().includes(searchText)) ||
                (bm.tags &&
                    bm.tags.some((t) => t.toLowerCase().includes(searchText))) ||
                (bm.customTags &&
                    bm.customTags.some((t) => t.toLowerCase().includes(searchText)));
            return hasText;
        });

        if (filtered.length === 0) {
            tableContainer.innerHTML =
                '<p style="text-align:center; color:#888; padding:20px 0;">回收站为空或没有匹配项。</p>';
            return;
        }

        const table = document.createElement("table");
        table.id = CONSTANTS.IDS.TABLE;
        table.innerHTML = `<thead><tr><th style="width: 31%;">名称</th><th style="width: 23%;">链接</th><th style="width: 12%;">标签</th><th style="width: 12%;">收藏时间</th><th style="width: 22%; text-align:center;">操作</th></tr></thead>`;
        const tbody = document.createElement("tbody");

        filtered.forEach((bm) => {
            const tr = document.createElement("tr");
            tr.dataset.urlKey = getRootTopicUrl(bm.url);
            const nameTd = document.createElement("td");
            nameTd.textContent = bm.name || "(无标题)";
            const urlTd = document.createElement("td");
            const a = document.createElement("a");
            a.href = bm.url;
            a.target = "_blank";
            a.textContent = bm.url;
            a.title = bm.url;
            urlTd.appendChild(a);
            const tagTd = document.createElement("td");
            if (bm.tags)
                bm.tags.forEach((t) => {
                    const s = document.createElement("span");
                    s.className = `${CONSTANTS.CLASSES.TAG_PILL}`;
                    s.textContent = t;
                    tagTd.appendChild(s);
                });
            if (bm.customTags)
                bm.customTags.forEach((t) => {
                    const s = document.createElement("span");
                    s.className = `${CONSTANTS.CLASSES.TAG_PILL}`;
                    s.textContent = t;
                    s.style.backgroundColor = "#E3F2FD";
                    s.style.color = "#1976D2";
                    s.style.borderLeft = "3px solid #64B5F6";
                    tagTd.appendChild(s);
                });

            // 添加时间列
            const timeTd = document.createElement("td");
            timeTd.style.fontSize = "12px";
            timeTd.style.color = "#666";
            if (bm.timestamp) {
                const date = new Date(bm.timestamp);
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');
                timeTd.textContent = `${year}-${month}-${day} ${hours}:${minutes}`;
            } else {
                timeTd.textContent = "未知";
            }

            const actTd = document.createElement("td");
            actTd.style.textAlign = "center";
            actTd.style.whiteSpace = "nowrap";
            const restoreBtn = document.createElement("button");
            restoreBtn.className = `bm-btn bm-btn-restore ${CONSTANTS.CLASSES.RESTORE_BTN}`;
            restoreBtn.textContent = "恢复";
            const purgeBtn = document.createElement("button");
            purgeBtn.className = `bm-btn bm-btn-purge ${CONSTANTS.CLASSES.PURGE_BTN}`;
            purgeBtn.style.marginLeft = "6px";
            purgeBtn.textContent = "彻底删除";
            actTd.appendChild(restoreBtn);
            actTd.appendChild(purgeBtn);

            tr.appendChild(nameTd);
            tr.appendChild(urlTd);
            tr.appendChild(tagTd);
            tr.appendChild(timeTd);
            tr.appendChild(actTd);
            tbody.appendChild(tr);
        });

        table.appendChild(tbody);
        tableContainer.innerHTML = "";
        tableContainer.appendChild(table);
    }

    function modifyBookmarks(updateFunction) {
        let bookmarks = GM_getValue(CONSTANTS.STORAGE_KEYS.BOOKMARKS, []);
        const result = updateFunction(bookmarks);
        if (result === false) return;
        GM_setValue(CONSTANTS.STORAGE_KEYS.BOOKMARKS, result.bookmarks);
        if (result.changed) triggerAutoWebDAVSync();
        return result.bookmarks;
    }

    // [NEW] 回收站修改器
    function modifyTrash(updateFunction) {
        let trash = GM_getValue(CONSTANTS.STORAGE_KEYS.TRASH, []);
        const result = updateFunction(trash);
        if (result === false) return;
        GM_setValue(CONSTANTS.STORAGE_KEYS.TRASH, result.trash);
        return result.trash;
    }

    // 批量重命名自定义标签（将 oldTag -> newTag）
    function bulkRenameCustomTag(oldTag, newTag) {
        if (!oldTag || !newTag || oldTag === newTag) {
            showToast("无效的标签重命名参数", { isError: true });
            return;
        }
        let changedCount = 0;
        modifyBookmarks((bookmarks) => {
            bookmarks.forEach((bm) => {
                if (bm.customTags && bm.customTags.includes(oldTag)) {
                    // 避免重复：如果 newTag 已存在，则仅删除 oldTag
                    if (bm.customTags.includes(newTag)) {
                        bm.customTags = bm.customTags.filter((t) => t !== oldTag);
                    } else {
                        bm.customTags = bm.customTags.map((t) =>
                            t === oldTag ? newTag : t
                        );
                    }
                    // 清空后删除字段
                    if (bm.customTags.length === 0) delete bm.customTags;
                    changedCount++;
                }
            });
            return { bookmarks, changed: changedCount > 0 };
        });
        if (changedCount > 0) {
            renderBookmarksTable();
            renderTagFilters();
            showToast(`已重命名 ${changedCount} 条中的自定义标签`);
        } else {
            showToast("未找到需要重命名的自定义标签", { isError: true });
        }
    }

    // 通过 prompt 启动批量重命名流程
    function startBulkRenameFlow(presetOldTag = "") {
        const oldTag =
            presetOldTag || prompt("请输入需要重命名的【旧自定义标签】(精确匹配)：");
        if (!oldTag) return;
        const newTag = prompt(`将自定义标签 "${oldTag}" 重命名为：`);
        if (!newTag) return;
        if (/[,/]/.test(newTag)) {
            showToast("新标签中不允许包含逗号或斜杠", { isError: true });
            return;
        }
        bulkRenameCustomTag(oldTag.trim(), newTag.trim());
    }

    // 标签管理功能
    function removeTagFromBookmark(urlKey, tagToRemove) {
        modifyBookmarks((bookmarks) => {
            const bookmark = bookmarks.find((b) => getRootTopicUrl(b.url) === urlKey);
            if (bookmark && bookmark.tags) {
                bookmark.tags = bookmark.tags.filter((tag) => tag !== tagToRemove);
                if (bookmark.tags.length === 0) {
                    delete bookmark.tags;
                }
            }
            return { bookmarks, changed: true };
        });
        renderBookmarksTable();
        renderTagFilters();
        showToast(`已删除标签: ${tagToRemove}`);
    }

    function removeCustomTagFromBookmark(urlKey, tagToRemove) {
        modifyBookmarks((bookmarks) => {
            const bookmark = bookmarks.find((b) => getRootTopicUrl(b.url) === urlKey);
            if (bookmark && bookmark.customTags) {
                bookmark.customTags = bookmark.customTags.filter(
                    (tag) => tag !== tagToRemove
                );
                if (bookmark.customTags.length === 0) {
                    delete bookmark.customTags;
                }
            }
            return { bookmarks, changed: true };
        });
        renderBookmarksTable();
        renderTagFilters();
        showToast(`已删除自定义标签: ${tagToRemove}`);
    }

    function addTagToBookmark(urlKey, newTag) {
        if (!newTag || !newTag.trim()) {
            showToast("标签名称不能为空！", { isError: true });
            return;
        }

        newTag = newTag.trim();

        modifyBookmarks((bookmarks) => {
            const bookmark = bookmarks.find((b) => getRootTopicUrl(b.url) === urlKey);
            if (bookmark) {
                if (!bookmark.customTags) {
                    bookmark.customTags = [];
                }
                // 检查是否与原生标签重复
                if (bookmark.tags && bookmark.tags.includes(newTag)) {
                    showToast("该标签已存在于帖子标签中！", { isError: true });
                    return false;
                }
                // 检查是否与自定义标签重复
                if (!bookmark.customTags.includes(newTag)) {
                    bookmark.customTags.push(newTag);
                    return { bookmarks, changed: true };
                } else {
                    showToast("该自定义标签已存在！", { isError: true });
                    return false;
                }
            }
            return false;
        });
        renderBookmarksTable();
        renderTagFilters();
        showToast(`已添加自定义标签: ${newTag}`);
    }

    function getAllCustomTags() {
        const allBookmarks = GM_getValue(CONSTANTS.STORAGE_KEYS.BOOKMARKS, []);
        const tagSet = new Set();
        allBookmarks.forEach((bookmark) => {
            if (!bookmark?.customTags) return;
            bookmark.customTags.forEach((tag) => {
                if (typeof tag === "string") {
                    const trimmed = tag.trim();
                    if (trimmed) {
                        tagSet.add(trimmed);
                    }
                }
            });
        });
        return Array.from(tagSet).sort((a, b) => TAG_COLLATOR.compare(a, b));
    }

    function setCustomTagsForBookmark(urlKey, tags) {
        const sanitizedTags = Array.from(
            new Set(
                tags
                    .map((tag) => (typeof tag === "string" ? tag.trim() : ""))
                    .filter((tag) => tag.length > 0)
            )
        );

        let conflictTag = null;
        let changed = false;
        let bookmarkFound = false;

        modifyBookmarks((bookmarks) => {
            const bookmark = bookmarks.find((b) => getRootTopicUrl(b.url) === urlKey);
            if (!bookmark) {
                return false;
            }
            bookmarkFound = true;
            const originalTags = bookmark.tags || [];
            const conflict = sanitizedTags.find((tag) => originalTags.includes(tag));
            if (conflict) {
                conflictTag = conflict;
                return false;
            }
            if (sanitizedTags.length === 0) {
                if (bookmark.customTags) {
                    delete bookmark.customTags;
                    changed = true;
                    return { bookmarks, changed: true };
                }
                return { bookmarks, changed: false };
            }
            const current = bookmark.customTags || [];
            const same =
                current.length === sanitizedTags.length &&
                sanitizedTags.every((tag) => current.includes(tag));
            if (same) {
                return { bookmarks, changed: false };
            }
            bookmark.customTags = sanitizedTags;
            changed = true;
            return { bookmarks, changed: true };
        });

        if (!bookmarkFound) {
            showToast("未找到对应的收藏记录，无法更新标签", { isError: true });
            return false;
        }

        if (conflictTag) {
            showToast(`标签 "${conflictTag}" 已存在于帖子标签中！`, { isError: true });
            return false;
        }

        renderBookmarksTable();
        if (changed) {
            renderTagFilters();
            showToast("自定义标签已更新");
        }
        return true;
    }

    function enterTagEditMode(row) {
        const tagCell = row.querySelector(`.${CONSTANTS.CLASSES.TAG_CELL}`);
        if (!tagCell || tagCell.querySelector(".tag-edit-mode")) return;

        const urlKey = row.dataset.urlKey;
        const bookmarks = GM_getValue(CONSTANTS.STORAGE_KEYS.BOOKMARKS, []);
        const bookmark = bookmarks.find((b) => getRootTopicUrl(b.url) === urlKey);

        if (!bookmark) {
            showToast("未找到对应的收藏记录，无法编辑标签", { isError: true });
            return;
        }

        const originalTags = bookmark.tags || [];
        const customTags = bookmark.customTags || [];
        const originalTagSet = new Set(originalTags);

        const availableTags = new Set(
            getAllCustomTags().filter((tag) => !originalTagSet.has(tag))
        );
        customTags.forEach((tag) => availableTags.add(tag));

        const selectedCustomTags = new Set(customTags);

        const editContainer = document.createElement("div");
        editContainer.className = "tag-edit-mode";

        if (originalTags.length > 0) {
            const originalLabel = document.createElement("span");
            originalLabel.textContent = "帖子标签: ";
            originalLabel.style.fontSize = "12px";
            originalLabel.style.color = "#666";
            originalLabel.style.marginRight = "8px";
            editContainer.appendChild(originalLabel);

            originalTags.forEach((tag) => {
                const pill = document.createElement("span");
                pill.className = CONSTANTS.CLASSES.TAG_PILL;
                pill.textContent = tag;
                pill.style.backgroundColor = "#EFEFEF";
                pill.style.color = "#555";
                editContainer.appendChild(pill);
            });

            editContainer.appendChild(document.createElement("br"));
        }

        const customHeader = document.createElement("div");
        customHeader.className = "bm-custom-tag-header";

        const customLabel = document.createElement("span");
        customLabel.textContent = "自定义标签: ";
        customLabel.style.fontSize = "12px";
        customLabel.style.color = "#1976D2";
        customLabel.style.fontWeight = "bold";
        customLabel.style.marginRight = "8px";

        const dropdownWrapper = document.createElement("div");
        dropdownWrapper.className = "bm-tag-dropdown";

        const dropdownButton = document.createElement("button");
        dropdownButton.type = "button";
        dropdownButton.className = "bm-btn bm-tag-dropdown-toggle";
        dropdownButton.textContent = "选择已有标签";
        dropdownWrapper.appendChild(dropdownButton);

        const dropdownList = document.createElement("div");
        dropdownList.className = "bm-tag-dropdown-list";
        dropdownWrapper.appendChild(dropdownList);

        customHeader.appendChild(customLabel);
        customHeader.appendChild(dropdownWrapper);
        editContainer.appendChild(customHeader);

        const selectedContainer = document.createElement("div");
        selectedContainer.className = "bm-selected-tags";
        editContainer.appendChild(selectedContainer);

        const optionCheckboxMap = new Map();

        const renderSelectedTags = () => {
            selectedContainer.innerHTML = "";
            if (selectedCustomTags.size === 0) {
                const hint = document.createElement("span");
                hint.className = "bm-tag-empty-hint";
                hint.textContent = "尚未选择自定义标签";
                selectedContainer.appendChild(hint);
                return;
            }
            Array.from(selectedCustomTags)
                .sort((a, b) => TAG_COLLATOR.compare(a, b))
                .forEach((tag) => {
                    const pill = document.createElement("span");
                    pill.className = "bm-selected-tag-pill";
                    pill.textContent = tag;

                    const removeBtn = document.createElement("button");
                    removeBtn.type = "button";
                    removeBtn.className = CONSTANTS.CLASSES.TAG_REMOVE_BTN;
                    removeBtn.textContent = "×";
                    removeBtn.title = "移除该标签";
                    removeBtn.onclick = (event) => {
                        event.stopPropagation();
                        selectedCustomTags.delete(tag);
                        const checkbox = optionCheckboxMap.get(tag);
                        if (checkbox) {
                            checkbox.checked = false;
                        }
                        renderSelectedTags();
                    };

                    pill.appendChild(removeBtn);
                    selectedContainer.appendChild(pill);
                });
        };

        const renderOptions = () => {
            optionCheckboxMap.clear();
            dropdownList.innerHTML = "";
            const sortedTags = Array.from(availableTags).sort((a, b) =>
                TAG_COLLATOR.compare(a, b)
            );
            if (sortedTags.length === 0) {
                const empty = document.createElement("span");
                empty.className = "bm-tag-empty-hint";
                empty.textContent = "暂无可复用标签";
                dropdownList.appendChild(empty);
                return;
            }
            sortedTags.forEach((tag) => {
                const option = document.createElement("label");
                option.className = "bm-tag-option";

                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.value = tag;
                checkbox.checked = selectedCustomTags.has(tag);
                checkbox.onchange = (event) => {
                    event.stopPropagation();
                    if (checkbox.checked) {
                        selectedCustomTags.add(tag);
                    } else {
                        selectedCustomTags.delete(tag);
                    }
                    renderSelectedTags();
                };

                const text = document.createElement("span");
                text.textContent = tag;

                option.appendChild(checkbox);
                option.appendChild(text);
                option.addEventListener("click", (event) => event.stopPropagation());
                dropdownList.appendChild(option);
                optionCheckboxMap.set(tag, checkbox);
            });
        };

        dropdownList.addEventListener("click", (event) => event.stopPropagation());

        const handleOutsideClick = (event) => {
            if (!dropdownWrapper.contains(event.target)) {
                dropdownWrapper.classList.remove("open");
                document.removeEventListener("click", handleOutsideClick);
            }
        };

        dropdownButton.addEventListener("click", (event) => {
            event.stopPropagation();
            const isOpen = dropdownWrapper.classList.toggle("open");
            if (isOpen) {
                document.addEventListener("click", handleOutsideClick);
            } else {
                document.removeEventListener("click", handleOutsideClick);
            }
        });

        const input = document.createElement("input");
        input.className = CONSTANTS.IDS.TAG_EDIT_INPUT;
        input.type = "text";
        input.placeholder = "输入新的自定义标签...";
        editContainer.appendChild(input);

        const addBtn = document.createElement("button");
        addBtn.className = `bm-btn ${CONSTANTS.CLASSES.TAG_ADD_BTN}`;
        addBtn.textContent = "添加";

        const attemptAddNewTag = () => {
            const raw = input.value.trim();
            if (!raw) {
                return;
            }
            if (originalTagSet.has(raw)) {
                showToast("该标签已存在于帖子标签中！", { isError: true });
                return;
            }
            if (selectedCustomTags.has(raw)) {
                showToast("该自定义标签已存在！", { isError: true });
                return;
            }
            selectedCustomTags.add(raw);
            availableTags.add(raw);
            input.value = "";
            renderOptions();
            renderSelectedTags();
        };

        addBtn.onclick = () => {
            attemptAddNewTag();
            input.focus();
        };
        editContainer.appendChild(addBtn);

        const buttonCleanup = () => {
            document.removeEventListener("click", handleOutsideClick);
            dropdownWrapper.classList.remove("open");
        };

        const saveBtn = document.createElement("button");
        saveBtn.className = `bm-btn ${CONSTANTS.CLASSES.TAG_SAVE_BTN}`;
        saveBtn.textContent = "完成";
        saveBtn.onclick = () => {
            const success = setCustomTagsForBookmark(
                urlKey,
                Array.from(selectedCustomTags)
            );
            if (success) {
                buttonCleanup();
            }
        };
        editContainer.appendChild(saveBtn);

        const cancelBtn = document.createElement("button");
        cancelBtn.className = `bm-btn ${CONSTANTS.CLASSES.TAG_CANCEL_BTN}`;
        cancelBtn.textContent = "取消";
        cancelBtn.onclick = () => {
            buttonCleanup();
            exitTagEditMode(row);
        };
        editContainer.appendChild(cancelBtn);

        tagCell.innerHTML = "";
        tagCell.appendChild(editContainer);

        renderOptions();
        renderSelectedTags();
        input.focus();

        input.onkeydown = (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                attemptAddNewTag();
            }
            if (event.key === "Escape") {
                event.preventDefault();
                buttonCleanup();
                exitTagEditMode(row);
            }
        };
    }

    function exitTagEditMode(row) {
        renderBookmarksTable(); // 重新渲染表格以退出编辑模式
    }

    function enterEditMode(row) {
        const nameCell = row.querySelector(".bm-name-cell");
        if (nameCell.querySelector(`.${CONSTANTS.CLASSES.EDIT_INPUT}`)) return; // Already in edit mode

        const originalName = nameCell.textContent;
        nameCell.innerHTML = `<textarea class="${CONSTANTS.CLASSES.EDIT_INPUT}" style="width:100%; min-height:40px; max-height:120px; padding:8px; border-radius:4px; border:1px solid #DDD; font-family:inherit; font-size:inherit; resize:vertical; overflow-y:auto; line-height:1.4;">${originalName}</textarea>`;

        const actionCell = row.querySelector(".bm-actions-cell");
        const originalButtons = actionCell.innerHTML;
        actionCell.innerHTML = `<button class="bm-btn ${CONSTANTS.CLASSES.SAVE_BTN}">保存</button><button class="bm-btn ${CONSTANTS.CLASSES.CANCEL_BTN}">取消</button>`;

        const input = nameCell.querySelector(`.${CONSTANTS.CLASSES.EDIT_INPUT}`);
        input.focus();
        input.select();

        // 自动调整 textarea 高度
        const autoResize = () => {
            input.style.height = "auto";
            input.style.height = Math.min(input.scrollHeight, 120) + "px";
        };
        autoResize();
        input.addEventListener("input", autoResize);

        const handleBlur = () => {
            saveRename(row, input.value);
        };
        input.addEventListener("blur", handleBlur);

        const cancelAction = () => {
            input.removeEventListener("blur", handleBlur);
            input.removeEventListener("input", autoResize);
            nameCell.textContent = originalName;
            actionCell.innerHTML = originalButtons;
        };

        const saveAction = () => {
            input.removeEventListener("blur", handleBlur);
            input.removeEventListener("input", autoResize);
            saveRename(row, input.value);
        };

        row.querySelector(`.${CONSTANTS.CLASSES.SAVE_BTN}`).onclick = saveAction;
        row.querySelector(`.${CONSTANTS.CLASSES.CANCEL_BTN}`).onclick =
            cancelAction;

        input.onkeydown = (e) => {
            if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                saveAction();
            }
            if (e.key === "Escape") {
                cancelAction();
            }
        };
    }

    function saveRename(row, newName) {
        if (!newName.trim()) {
            showToast("名称不能为空！", { isError: true });
            return;
        }
        const urlKey = row.dataset.urlKey;
        modifyBookmarks((bookmarks) => {
            const bookmark = bookmarks.find((b) => getRootTopicUrl(b.url) === urlKey);
            if (bookmark) bookmark.name = newName;
            return { bookmarks, changed: true };
        });
        renderBookmarksTable();
        showToast("名称已更新！");
    }

    function togglePinBookmark(row) {
        const urlKey = row.dataset.urlKey;
        let status = "";
        modifyBookmarks((bookmarks) => {
            const bookmark = bookmarks.find((b) => getRootTopicUrl(b.url) === urlKey);
            if (bookmark) {
                bookmark.pinned = !bookmark.pinned;
                status = bookmark.pinned ? "置顶" : "取消置顶";
            }
            return { bookmarks, changed: true };
        });
        showToast(`已${status}收藏`);
        renderBookmarksTable();
    }

    function deleteBookmark(row) {
        const urlKey = row.dataset.urlKey;
        const allBookmarks = GM_getValue(CONSTANTS.STORAGE_KEYS.BOOKMARKS, []);
        const index = allBookmarks.findIndex(
            (b) => getRootTopicUrl(b.url) === urlKey
        );
        if (index === -1) return;

        const item = allBookmarks[index];

        // 从书签移除并移入回收站
        modifyBookmarks((bookmarks) => {
            bookmarks.splice(index, 1);
            return { bookmarks, changed: true };
        });
        modifyTrash((trash) => {
            // 避免重复添加
            const exists = trash.some((t) => getRootTopicUrl(t.url) === urlKey);
            if (!exists) trash.unshift({ ...item, deletedAt: Date.now() });
            return { trash };
        });

        row.classList.add(CONSTANTS.CLASSES.ROW_HIDING);
        setTimeout(() => (row.style.display = "none"), 300);

        renderTagFilters();
        showToast("已移入回收站", {
            actions: [
                {
                    text: "撤销",
                    onClick: () => restoreFromTrash(urlKey, { showToastMsg: true }),
                },
            ],
        });
    }

    // [NEW] 从回收站恢复
    function restoreFromTrash(urlKey, { showToastMsg = false } = {}) {
        const trash = GM_getValue(CONSTANTS.STORAGE_KEYS.TRASH, []);
        const idx = trash.findIndex((t) => getRootTopicUrl(t.url) === urlKey);
        if (idx === -1) return;
        const item = trash[idx];

        modifyTrash((t) => {
            t.splice(idx, 1);
            return { trash: t };
        });
        modifyBookmarks((bookmarks) => {
            // 避免重复恢复
            const exists = bookmarks.some((b) => getRootTopicUrl(b.url) === urlKey);
            if (!exists) bookmarks.unshift({ ...item, deletedAt: undefined });
            return { bookmarks, changed: true };
        });
        renderBookmarksTable();
        renderTagFilters();
        if (showToastMsg) showToast("已恢复到收藏");
    }

    // [NEW] 彻底删除单条
    function purgeFromTrash(urlKey) {
        modifyTrash((trash) => {
            const idx = trash.findIndex((t) => getRootTopicUrl(t.url) === urlKey);
            if (idx !== -1) trash.splice(idx, 1);
            return { trash };
        });
        renderTrashTable();
        showToast("已彻底删除");
    }

    // [NEW] 清空回收站
    function emptyTrash() {
        if (!confirm("确认清空回收站？此操作不可恢复！")) return;
        GM_setValue(CONSTANTS.STORAGE_KEYS.TRASH, []);
        renderTrashTable();
        showToast("🧹 回收站已清空");
    }

    function handleLocalImport(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedBookmarks = JSON.parse(e.target.result);
                if (!Array.isArray(importedBookmarks))
                    throw new Error("文件格式不正确。");
                promptAndMergeBookmarks(importedBookmarks);
            } catch (error) {
                showToast("导入失败: " + error.message, { isError: true });
            } finally {
                fileInput.value = "";
            }
        };
        reader.readAsText(file);
    }

    function handleLocalExport() {
        const bookmarks = GM_getValue(CONSTANTS.STORAGE_KEYS.BOOKMARKS, []);
        if (bookmarks.length === 0) {
            showToast("没有收藏可以导出。", { isError: true });
            return;
        }
        const dataStr = JSON.stringify(bookmarks, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "linuxdo_bookmarks_backup.json";
        a.click();
        URL.revokeObjectURL(url);
    }

    // --- Part 4: WebDAV 核心功能 ---
    function getWebDAVConfig(fromStorage = true) {
        const server = fromStorage
            ? GM_getValue(CONSTANTS.STORAGE_KEYS.WEBDAV_SERVER)
            : getEl("webdav-server").value.trim();
        const user = fromStorage
            ? GM_getValue(CONSTANTS.STORAGE_KEYS.WEBDAV_USER)
            : getEl("webdav-user").value.trim();
        const pass = fromStorage
            ? GM_getValue(CONSTANTS.STORAGE_KEYS.WEBDAV_PASS)
            : getEl("webdav-pass").value;
        if (!server || !user || !pass) return null;
        return { server: server.endsWith("/") ? server : server + "/", user, pass };
    }
    function saveWebDAVConfig() {
        const config = getWebDAVConfig(false);
        if (!config) {
            showToast("服务器、用户名和应用密码均不能为空！", { isError: true });
            return;
        }
        GM_setValue(CONSTANTS.STORAGE_KEYS.WEBDAV_SERVER, config.server);
        GM_setValue(CONSTANTS.STORAGE_KEYS.WEBDAV_USER, config.user);
        GM_setValue(CONSTANTS.STORAGE_KEYS.WEBDAV_PASS, config.pass);
        GM_setValue(
            CONSTANTS.STORAGE_KEYS.AUTO_SYNC,
            getEl(CONSTANTS.IDS.AUTO_SYNC_TOGGLE).checked
        );
        showToast("WebDAV 配置已保存！");
        closeModal(webdavSettingsModal);
    }
    function webdavRequest(options) {
        const config = getWebDAVConfig(true);
        if (!config) {
            if (options.onerror)
                options.onerror({ status: 0, statusText: "WebDAV 配置不完整" });
            else showToast("操作失败: WebDAV 配置不完整", { isError: true });
            return;
        }
        GM_xmlhttpRequest({
            method: options.method,
            url: config.server + (options.path || ""),
            headers: {
                Authorization: "Basic " + btoa(config.user + ":" + config.pass),
                ...options.headers,
            },
            data: options.data,
            onload: options.onload,
            onerror: options.onerror,
        });
    }
    function testWebDAVConnection() {
        const config = getWebDAVConfig(false);
        if (!config) {
            webdavTestResult.textContent = "请填写所有字段！";
            return;
        }
        webdavTestResult.textContent = "正在测试连接...";
        webdavRequest({
            method: "PROPFIND",
            path: "",
            headers: { Depth: "0" },
            onload: (res) => {
                if (res.status === 207 || res.status === 200)
                    webdavTestResult.textContent = "连接成功！";
                else if (res.status === 401)
                    webdavTestResult.textContent = "连接失败: 用户名或密码错误 (401)";
                else
                    webdavTestResult.textContent = `连接失败: 服务器返回 ${res.status}`;
            },
            onerror: () =>
                (webdavTestResult.textContent = "连接失败: 请检查服务器地址或网络"),
        });
    }
    function uploadToWebDAV(isAuto = false) {
        const filename = getTimestampedFilename();
        const bookmarks = GM_getValue(CONSTANTS.STORAGE_KEYS.BOOKMARKS, []);
        if (!isAuto) showToast(`正在手动备份到云端...`);
        const performPut = () => {
            webdavRequest({
                method: "PUT",
                path: CONSTANTS.WEBDAV_DIR + filename,
                headers: { "Content-Type": "application/json; charset=utf-8" },
                data: JSON.stringify(bookmarks, null, 2),
                onload: (res) => {
                    if (res.status === 201 || res.status === 204)
                        showToast(`${isAuto ? "自动" : "手动"}备份成功！`);
                    else
                        showToast(`备份失败: ${res.status} ${res.statusText}`, {
                            isError: true,
                        });
                },
                onerror: (res) =>
                    showToast(`备份出错: ${res.statusText}`, { isError: true }),
            });
        };
        webdavRequest({
            method: "MKCOL",
            path: CONSTANTS.WEBDAV_DIR,
            onload: (res) => {
                if ([201, 405].includes(res.status)) performPut();
                else
                    showToast(`创建云端目录失败: ${res.status} ${res.statusText}`, {
                        isError: true,
                    });
            },
            onerror: (res) =>
                showToast(`创建云端目录出错: ${res.statusText}`, { isError: true }),
        });
    }
    function triggerAutoWebDAVSync() {
        if (GM_getValue(CONSTANTS.STORAGE_KEYS.AUTO_SYNC, false)) {
            uploadToWebDAV(true);
        }
    }
    function listWebDAVBackups() {
        openModal(webdavBrowserModal);
        webdavBrowserList.innerHTML =
            '<li class="loading-text">正在加载备份列表...</li>';
        webdavRequest({
            method: "PROPFIND",
            path: CONSTANTS.WEBDAV_DIR,
            headers: { Depth: "1" },
            onload: (res) => {
                if (res.status !== 207) {
                    webdavBrowserList.innerHTML = `<li class="loading-text">加载失败: ${res.statusText} (请确保目录已存在)</li>`;
                    return;
                }
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(
                    res.responseText,
                    "application/xml"
                );
                const files = Array.from(xmlDoc.getElementsByTagName("d:href"))
                    .concat(Array.from(xmlDoc.getElementsByTagName("D:href")))
                    .map((node) => node.textContent.split("/").pop())
                    .filter(
                        (name) =>
                            name.startsWith("linuxdo-backup-") && name.endsWith(".json")
                    )
                    .sort()
                    .reverse();
                if (files.length === 0) {
                    webdavBrowserList.innerHTML =
                        '<li class="loading-text">云端没有找到任何备份文件。</li>';
                    return;
                }
                webdavBrowserList.innerHTML = "";
                files.forEach((file) => {
                    const li = document.createElement("li");
                    li.className = "webdav-backup-item";

                    const nameSpan = document.createElement("span");
                    nameSpan.className = "webdav-backup-filename";
                    nameSpan.textContent = file;

                    const deleteBtn = document.createElement("button");
                    deleteBtn.type = "button";
                    deleteBtn.className = "bm-btn bm-btn-danger webdav-delete-btn";
                    deleteBtn.textContent = "删除";
                    deleteBtn.onclick = (event) => {
                        event.stopPropagation();
                        event.preventDefault();
                        deleteWebDAVBackup(file, li, deleteBtn);
                    };

                    li.onclick = () => {
                        if (deleteBtn.disabled) return;
                        downloadFromWebDAV(file);
                    };
                    li.appendChild(nameSpan);
                    li.appendChild(deleteBtn);
                    webdavBrowserList.appendChild(li);
                });
            },
            onerror: (res) =>
                (webdavBrowserList.innerHTML = `<li class="loading-text">加载出错: ${res.statusText}</li>`),
        });
    }
    function downloadFromWebDAV(filename) {
        showToast(`即将从云端恢复备份: ${filename}`);
        webdavRequest({
            method: "GET",
            path: CONSTANTS.WEBDAV_DIR + filename,
            onload: (res) => {
                if (res.status === 200) {
                    try {
                        const cloudBookmarks = JSON.parse(res.responseText);
                        if (!Array.isArray(cloudBookmarks))
                            throw new Error("云端数据格式错误。");
                        closeModal(webdavBrowserModal);
                        promptAndMergeBookmarks(cloudBookmarks);
                    } catch (e) {
                        showToast("解析云端数据失败！" + e.message, { isError: true });
                    }
                } else {
                    showToast(`下载失败！服务器响应: ${res.status} ${res.statusText}`, {
                        isError: true,
                    });
                }
            },
            onerror: (res) =>
                showToast(`下载出错！详情: ${res.statusText}`, { isError: true }),
        });
    }
    function deleteWebDAVBackup(filename, listItem, deleteButton) {
        if (!confirm(`确定要删除云端备份文件 ${filename} 吗？`)) return;

        const originalLabel = deleteButton.textContent;
        deleteButton.textContent = "删除中...";
        deleteButton.disabled = true;

        const finalizeSuccess = () => {
            listItem.remove();
            if (!webdavBrowserList.querySelector("li")) {
                webdavBrowserList.innerHTML =
                    '<li class="loading-text">云端没有找到任何备份文件。</li>';
            }
            showToast(`已删除云端备份: ${filename}`);
        };
        const resetButton = () => {
            deleteButton.disabled = false;
            deleteButton.textContent = originalLabel;
        };

        webdavRequest({
            method: "DELETE",
            path: CONSTANTS.WEBDAV_DIR + filename,
            onload: (res) => {
                if ([200, 202, 204, 404].includes(res.status)) {
                    finalizeSuccess();
                } else {
                    showToast(`删除失败: ${res.status} ${res.statusText}`, {
                        isError: true,
                    });
                    resetButton();
                }
            },
            onerror: (res) => {
                showToast(`删除出错: ${res.statusText}`, { isError: true });
                resetButton();
            },
        });
    }

    // --- Part 5: 通用逻辑与事件绑定 ---
    function promptAndMergeBookmarks(newBookmarks) {
        const choice = prompt(
            "请选择恢复模式：\n1. 增量合并 (智能去重)\n2. 完全覆盖 (清空本地后恢复)\n\n请输入数字 1 或 2"
        );
        let dataChanged = false;
        modifyBookmarks((bookmarks) => {
            if (choice === "1") {
                const currentUrls = new Set(
                    bookmarks.map((b) => getRootTopicUrl(b.url))
                );
                let addedCount = 0;
                newBookmarks.forEach((b) => {
                    if (b.url && !currentUrls.has(getRootTopicUrl(b.url))) {
                        bookmarks.unshift(b);
                        addedCount++;
                    }
                });
                if (addedCount > 0) dataChanged = true;
                showToast(
                    `合并完成！新增 ${addedCount} 条，跳过 ${newBookmarks.length - addedCount
                    } 条。`
                );
            } else if (choice === "2") {
                if (confirm("警告：此操作将清空您本地的所有收藏，确定要继续吗？")) {
                    bookmarks = newBookmarks;
                    dataChanged = true;
                    showToast(`覆盖完成！成功恢复 ${newBookmarks.length} 条收藏。`);
                }
            } else {
                showToast("操作已取消。");
                return false;
            }
            return { bookmarks, changed: dataChanged };
        });
        renderBookmarksTable();
    }

    document.body.addEventListener("click", function (event) {
        // 处理可能的 SVG 或内部元素点击，找到真正的按钮元素
        const target = event.target.closest('button') || event.target;

        if (target.classList.contains(CONSTANTS.CLASSES.TAG_FILTER_BTN)) {
            const tag = target.dataset.tag === "" ? null : target.dataset.tag;
            activeTagFilter = tag;
            currentPage = 1; // 切换标签时重置到第一页
            renderTagFilters();
            renderBookmarksTable();
            return;
        }

        const row = target.closest("tr");
        if (row && row.dataset.urlKey) {
            if (target.classList.contains(CONSTANTS.CLASSES.DELETE_BTN))
                deleteBookmark(row);
            else if (target.classList.contains(CONSTANTS.CLASSES.RENAME_BTN))
                enterEditMode(row);
            else if (target.classList.contains(CONSTANTS.CLASSES.TAG_EDIT_BTN))
                enterTagEditMode(row);
            else if (target.classList.contains(CONSTANTS.CLASSES.PIN_BTN))
                togglePinBookmark(row);
            else if (target.classList.contains(CONSTANTS.CLASSES.RESTORE_BTN))
                restoreFromTrash(row.dataset.urlKey, { showToastMsg: true });
            else if (target.classList.contains(CONSTANTS.CLASSES.PURGE_BTN))
                purgeFromTrash(row.dataset.urlKey);
            return;
        }

        const buttonActions = {
            "manage-bookmarks-button": () => {
                setViewMode("bookmarks");
                openModal(managerModal);
            },
            [CONSTANTS.IDS.TRASH_BACK_BUTTON]: () => {
                setViewMode("bookmarks");
            },
            [CONSTANTS.IDS.SETTINGS_BUTTON]: () => {
                openModal(settingsModal);
            },
            "webdav-settings-btn": () => {
                webdavTestResult.textContent = "";
                getEl("webdav-server").value = GM_getValue(
                    CONSTANTS.STORAGE_KEYS.WEBDAV_SERVER,
                    ""
                );
                getEl("webdav-user").value = GM_getValue(
                    CONSTANTS.STORAGE_KEYS.WEBDAV_USER,
                    ""
                );
                getEl("webdav-pass").value = GM_getValue(
                    CONSTANTS.STORAGE_KEYS.WEBDAV_PASS,
                    ""
                );
                autoSyncToggle.checked = GM_getValue(
                    CONSTANTS.STORAGE_KEYS.AUTO_SYNC,
                    false
                );
                openModal(webdavSettingsModal);
            },
            "save-webdav-settings": saveWebDAVConfig,
            "test-webdav-connection": testWebDAVConnection,
            "import-bookmarks-btn": () => fileInput.click(),
            "export-bookmarks-btn": handleLocalExport,
            "sync-from-cloud-btn": listWebDAVBackups,
            "sync-to-cloud-btn": () => uploadToWebDAV(false),
            [CONSTANTS.IDS.RENAME_TAGS_BUTTON]: () => startBulkRenameFlow(),
            [CONSTANTS.IDS.TRASH_TOGGLE_BUTTON]: () => {
                // 从配置页面进入回收站,需要先关闭配置页面,再打开主窗口显示回收站
                closeModal(settingsModal);
                setViewMode("trash");
                openModal(managerModal);
            },
            [CONSTANTS.IDS.EMPTY_TRASH_BUTTON]: () => emptyTrash(),
        };

        if (buttonActions[target.id]) buttonActions[target.id]();

        // 处理关闭按钮点击
        if (target.classList.contains(CONSTANTS.CLASSES.CLOSE_BTN)) {
            const modalId = target.dataset.targetModal;
            if (modalId) {
                const modal = getEl(modalId);
                if (modal) {
                    closeModal(modal);
                    console.log(`关闭模态框: ${modalId}`);
                } else {
                    console.error(`找不到模态框: ${modalId}`);
                }
            }
        }

        // 处理点击背景关闭模态框
        if (
            target.classList.contains(CONSTANTS.CLASSES.MODAL_BACKDROP) &&
            !event.target.closest(`.${CONSTANTS.CLASSES.CONTENT_PANEL}`)
        )
            closeModal(target);
    });

    fileInput.addEventListener(
        "change",
        (e) => e.target.files[0] && handleLocalImport(e.target.files[0])
    );

    // 右键自定义标签快速重命名
    document.body.addEventListener("contextmenu", (e) => {
        const pill = e.target.closest(`.${CONSTANTS.CLASSES.TAG_PILL}`);
        if (
            pill &&
            pill.parentElement &&
            pill.parentElement.classList.contains(CONSTANTS.CLASSES.TAG_CELL)
        ) {
            // 仅对自定义标签启用（蓝色，有 editable 类 或 具有删除按钮）
            if (pill.classList.contains("editable")) {
                e.preventDefault();
                const oldTag =
                    pill.firstChild?.textContent ||
                    pill.textContent.replace(/×$/, "").trim();
                if (oldTag) startBulkRenameFlow(oldTag);
            }
        }
    });
    // 搜索框输入事件
    const searchClearBtn = document.querySelector(".search-clear-btn");
    searchInput.addEventListener("input", () => {
        currentPage = 1; // 搜索时重置到第一页
        renderBookmarksTable();

        // 显示/隐藏清除按钮
        if (searchInput.value.trim()) {
            searchClearBtn.classList.add("visible");
        } else {
            searchClearBtn.classList.remove("visible");
        }
    });

    // 清除按钮点击事件
    searchClearBtn.addEventListener("click", () => {
        searchInput.value = "";
        searchClearBtn.classList.remove("visible");
        currentPage = 1;
        renderBookmarksTable();
        searchInput.focus(); // 清除后聚焦到输入框
    });

    // 每页显示数量切换
    pageSizeSelect.addEventListener("change", (e) => {
        itemsPerPage = parseInt(e.target.value, 10);
        currentPage = 1; // 切换每页数量时重置到第一页
        renderBookmarksTable();
    });

    autoSyncToggle.addEventListener("change", (e) =>
        GM_setValue(CONSTANTS.STORAGE_KEYS.AUTO_SYNC, e.target.checked)
    );

    // --- Part 6: 页面按钮与初始化 ---

    const FLOATING_BUTTON_MARGIN = 12;
    const CLICK_MOVE_THRESHOLD = 3;

    function clamp(value, min, max) {
        if (!Number.isFinite(value)) return min;
        if (value < min) return min;
        if (value > max) return max;
        return value;
    }

    function applyFloatingButtonPosition(button, rightPercent, bottomPercent) {
        const width = button.offsetWidth || button.getBoundingClientRect().width || 0;
        const height = button.offsetHeight || button.getBoundingClientRect().height || 0;

        // 计算实际的right和bottom像素值
        const rightPx = (window.innerWidth * rightPercent) / 100;
        const bottomPx = (window.innerHeight * bottomPercent) / 100;

        // 限制范围，确保按钮不会超出视口
        const maxRight = Math.max(FLOATING_BUTTON_MARGIN, window.innerWidth - width - FLOATING_BUTTON_MARGIN);
        const maxBottom = Math.max(FLOATING_BUTTON_MARGIN, window.innerHeight - height - FLOATING_BUTTON_MARGIN);
        const clampedRight = clamp(rightPx, FLOATING_BUTTON_MARGIN, maxRight);
        const clampedBottom = clamp(bottomPx, FLOATING_BUTTON_MARGIN, maxBottom);

        button.style.right = `${clampedRight}px`;
        button.style.bottom = `${clampedBottom}px`;
        button.style.left = "auto";
        button.style.top = "auto";

        // 返回实际使用的百分比
        return {
            rightPercent: (clampedRight / window.innerWidth) * 100,
            bottomPercent: (clampedBottom / window.innerHeight) * 100
        };
    }

    function loadSavedFloatingButtonPosition(button) {
        const savedPosition = GM_getValue(
            CONSTANTS.STORAGE_KEYS.FLOATING_BUTTON_POSITION,
            null
        );

        // 如果没有保存的位置，使用默认位置：右侧5%,垂直居中50%
        let rightPercent = 5;
        let bottomPercent = 50;

        if (savedPosition && typeof savedPosition === "object") {
            // 兼容旧版本的left/top存储格式,转换为百分比
            if (typeof savedPosition.left === "number" && typeof savedPosition.top === "number") {
                rightPercent = ((window.innerWidth - savedPosition.left) / window.innerWidth) * 100;
                bottomPercent = ((window.innerHeight - savedPosition.top) / window.innerHeight) * 100;
            } else if (typeof savedPosition.rightPercent === "number" && typeof savedPosition.bottomPercent === "number") {
                rightPercent = savedPosition.rightPercent;
                bottomPercent = savedPosition.bottomPercent;
            }
        }

        requestAnimationFrame(() => {
            const applied = applyFloatingButtonPosition(button, rightPercent, bottomPercent);
            // 如果位置被调整或格式需要更新,保存新的百分比位置
            if (Math.abs(applied.rightPercent - rightPercent) > 0.1 ||
                Math.abs(applied.bottomPercent - bottomPercent) > 0.1 ||
                !savedPosition ||
                savedPosition.left !== undefined) {
                GM_setValue(
                    CONSTANTS.STORAGE_KEYS.FLOATING_BUTTON_POSITION,
                    applied
                );
            }
        });
    }

    function persistFloatingButtonPosition(rightPx, bottomPx) {
        if (!Number.isFinite(rightPx) || !Number.isFinite(bottomPx)) return;
        // 将像素值转换为百分比保存
        const rightPercent = (rightPx / window.innerWidth) * 100;
        const bottomPercent = (bottomPx / window.innerHeight) * 100;
        GM_setValue(CONSTANTS.STORAGE_KEYS.FLOATING_BUTTON_POSITION, {
            rightPercent,
            bottomPercent,
        });
    }

    // 将创建和更新浮动按钮的逻辑封装成一个独立的函数
    function updateFloatingButtons() {
        // a. 首先，移除可能已存在的旧按钮
        const existingButton = document.getElementById(CONSTANTS.IDS.MANAGE_BUTTON);
        if (existingButton) {
            existingButton.remove();
        }

        // b. 创建新的组合按钮
        const floatingButton = document.createElement("button");
        floatingButton.id = CONSTANTS.IDS.MANAGE_BUTTON;
        floatingButton.className = "action-button";

        // c. 创建按钮内部结构
        const bookmarksText = document.createElement("span");
        bookmarksText.textContent = "收藏夹";
        bookmarksText.style.cursor = "pointer";

        const heartIcon = document.createElement("span");
        heartIcon.className = "heart-icon";

        let dragState = null;
        let suppressNextClick = false;

        const capturedClickHandler = (event) => {
            if (!suppressNextClick) return;
            suppressNextClick = false;
            event.stopImmediatePropagation();
            event.preventDefault();
        };

        floatingButton.addEventListener("click", capturedClickHandler, true);

        // d. 检查是否在帖子页面
        const isTopicPage = /\/(linux\.do|idcflare\.com)\/t\//.test(window.location.href);

        if (isTopicPage) {
            // 检查当前页面的收藏状态
            const currentUrl = window.location.href;
            const currentUrlKey = getRootTopicUrl(currentUrl);
            const bookmarks = GM_getValue(CONSTANTS.STORAGE_KEYS.BOOKMARKS, []);
            const isBookmarked = bookmarks.some(
                (b) => getRootTopicUrl(b.url) === currentUrlKey
            );

            // 设置心形图标样式
            if (isBookmarked) {
                heartIcon.textContent = "♥";
                heartIcon.className = "heart-icon filled";
            } else {
                heartIcon.textContent = "♡";
                heartIcon.className = "heart-icon empty";
            }

            // 为心形图标绑定点击事件
            heartIcon.addEventListener("click", (e) => {
                e.stopPropagation();

                const bookmarks = GM_getValue(CONSTANTS.STORAGE_KEYS.BOOKMARKS, []);
                const currentUrlKey = getRootTopicUrl(window.location.href);
                const bookmarkIndex = bookmarks.findIndex(
                    (b) => getRootTopicUrl(b.url) === currentUrlKey
                );

                if (bookmarkIndex !== -1) {
                    // 已收藏，执行取消收藏
                    const deletedItem = bookmarks[bookmarkIndex];

                    // 移到回收站
                    modifyTrash((trash) => {
                        const exists = trash.some((t) => getRootTopicUrl(t.url) === currentUrlKey);
                        if (!exists) trash.unshift({ ...deletedItem, deletedAt: Date.now() });
                        return { trash };
                    });

                    // 从书签中删除
                    modifyBookmarks((bookmarks) => {
                        bookmarks.splice(bookmarkIndex, 1);
                        return { bookmarks, changed: true };
                    });

                    // 更新图标状态
                    heartIcon.textContent = "♡";
                    heartIcon.className = "heart-icon empty";
                } else {
                    // 未收藏，执行收藏
                    const postUrl = window.location.href;
                    const fullTitle = document.title.replace(/\s*-\s*(?:LINUX\s*DO|IDC\s*Flare)\s*$/i, "");

                    let cleanTitle = fullTitle;
                    let tags = [];

                    const tagMatch = fullTitle.match(/\s*-\s*([^\-]+)$/);
                    if (tagMatch && tagMatch[1]) {
                        const rawTagString = tagMatch[1].trim();
                        const primaryTag = rawTagString.split(/[\/,]/)[0].trim();
                        tags.push(primaryTag);
                        cleanTitle = fullTitle.replace(tagMatch[0], "").trim();
                    }

                    modifyBookmarks((bookmarks) => {
                        bookmarks.unshift({
                            name: cleanTitle,
                            url: postUrl,
                            pinned: false,
                            tags: tags,
                            timestamp: Date.now(), // 添加收藏时间戳
                        });
                        return { bookmarks, changed: true };
                    });

                    // 更新图标状态
                    heartIcon.textContent = "♥";
                    heartIcon.className = "heart-icon filled";
                }
            });

            // 组装按钮结构（带心形图标）
            floatingButton.appendChild(bookmarksText);
            floatingButton.appendChild(heartIcon);
        } else {
            // 非帖子页面，只显示收藏夹文本
            floatingButton.appendChild(bookmarksText);
        }

        // e. 使用 pointer 事件统一处理拖拽和轻击打开逻辑
        floatingButton.addEventListener("pointerdown", (event) => {
            if (event.button !== 0) return;
            if (event.target === heartIcon) return;

            suppressNextClick = false;

            const initialRect = floatingButton.getBoundingClientRect();
            const computedStyle = window.getComputedStyle(floatingButton);
            // 确保按钮使用right/bottom定位
            if (computedStyle.right === "auto" || computedStyle.bottom === "auto") {
                floatingButton.style.right = `${window.innerWidth - initialRect.right}px`;
                floatingButton.style.bottom = `${window.innerHeight - initialRect.bottom}px`;
                floatingButton.style.left = "auto";
                floatingButton.style.top = "auto";
            }

            const rect = floatingButton.getBoundingClientRect();

            dragState = {
                pointerId: event.pointerId,
                startClientX: event.clientX,
                startClientY: event.clientY,
                startRight: window.innerWidth - rect.right,
                startBottom: window.innerHeight - rect.bottom,
                moved: false,
                latestRight: window.innerWidth - rect.right,
                latestBottom: window.innerHeight - rect.bottom,
                initialTarget: event.target,
            };

            floatingButton.setPointerCapture(event.pointerId);
        });

        floatingButton.addEventListener("pointermove", (event) => {
            if (!dragState || event.pointerId !== dragState.pointerId) return;

            const deltaX = event.clientX - dragState.startClientX;
            const deltaY = event.clientY - dragState.startClientY;

            if (!dragState.moved) {
                if (Math.abs(deltaX) + Math.abs(deltaY) < CLICK_MOVE_THRESHOLD) {
                    return;
                }
                dragState.moved = true;
                floatingButton.classList.add("dragging");
            }

            // 注意:向右拖动时deltaX为正,但right应该减小;向下拖动时deltaY为正,但bottom应该减小
            const proposedRight = dragState.startRight - deltaX;
            const proposedBottom = dragState.startBottom - deltaY;

            // 使用百分比计算
            const proposedRightPercent = (proposedRight / window.innerWidth) * 100;
            const proposedBottomPercent = (proposedBottom / window.innerHeight) * 100;

            const applied = applyFloatingButtonPosition(
                floatingButton,
                proposedRightPercent,
                proposedBottomPercent
            );

            // 保存当前的像素位置用于后续计算
            dragState.latestRight = (applied.rightPercent / 100) * window.innerWidth;
            dragState.latestBottom = (applied.bottomPercent / 100) * window.innerHeight;
        });

        const finishPointerInteraction = (event, shouldTreatAsClick) => {
            if (!dragState || event.pointerId !== dragState.pointerId) return;

            floatingButton.releasePointerCapture(event.pointerId);
            floatingButton.classList.remove("dragging");

            if (dragState.moved) {
                suppressNextClick = true;
                event.preventDefault();
                event.stopPropagation();
                persistFloatingButtonPosition(dragState.latestRight, dragState.latestBottom);
            } else if (shouldTreatAsClick) {
                suppressNextClick = true;
                event.stopPropagation();
                const managerModal = document.getElementById(CONSTANTS.IDS.MANAGER_MODAL);
                if (managerModal) {
                    setViewMode("bookmarks");
                    openModal(managerModal);
                }
            }

            dragState = null;

            if (suppressNextClick) {
                setTimeout(() => {
                    suppressNextClick = false;
                }, 0);
            }
        };

        floatingButton.addEventListener("pointerup", (event) => {
            finishPointerInteraction(event, true);
        });
        floatingButton.addEventListener("pointercancel", (event) => {
            finishPointerInteraction(event, false);
        });

        document.body.appendChild(floatingButton);
        loadSavedFloatingButtonPosition(floatingButton);
    }

    // 页面首次加载时，立即执行一次函数来创建按钮
    updateFloatingButtons();

    window.addEventListener("resize", () => {
        const button = document.getElementById(CONSTANTS.IDS.MANAGE_BUTTON);
        if (!button) return;

        const saved = GM_getValue(
            CONSTANTS.STORAGE_KEYS.FLOATING_BUTTON_POSITION,
            null
        );
        if (!saved || typeof saved !== "object") return;

        // 支持新旧两种存储格式
        let rightPercent, bottomPercent;
        if (typeof saved.rightPercent === "number" && typeof saved.bottomPercent === "number") {
            rightPercent = saved.rightPercent;
            bottomPercent = saved.bottomPercent;
        } else if (typeof saved.left === "number" && typeof saved.top === "number") {
            // 兼容旧格式,转换为百分比
            rightPercent = ((window.innerWidth - saved.left) / window.innerWidth) * 100;
            bottomPercent = ((window.innerHeight - saved.top) / window.innerHeight) * 100;
        } else {
            return;
        }

        const applied = applyFloatingButtonPosition(button, rightPercent, bottomPercent);
        if (Math.abs(applied.rightPercent - rightPercent) > 0.1 ||
            Math.abs(applied.bottomPercent - bottomPercent) > 0.1) {
            GM_setValue(CONSTANTS.STORAGE_KEYS.FLOATING_BUTTON_POSITION, applied);
        }
    });

    // 创建一个 MutationObserver 来监听页面标题的变化
    // 这是修复 SPA 页面切换 bug 的核心
    const observer = new MutationObserver(() => {
        // 当监听到变化（意味着可能切换了帖子），就重新调用函数来更新按钮状态
        // 使用 setTimeout 做一个小的延迟，确保页面其他部分也已加载完毕
        setTimeout(updateFloatingButtons, 200);
    });

    // 让观察者开始监视 <title> 元素的变化
    const titleElement = document.querySelector("title");
    if (titleElement) {
        observer.observe(titleElement, { childList: true });
    }

    console.log("L站收藏夹已加载！");

    // 视图切换
    function setViewMode(mode) {
        viewMode = mode;
        const header = document.getElementById("bm-header-title");
        activeTagFilter = null;
        currentPage = 1; // 切换视图时重置页码
        if (trashBackButton) {
            trashBackButton.style.display = viewMode === "trash" ? "inline-flex" : "none";
        }
        if (viewMode === "trash") {
            header && (header.textContent = "回收站");
        } else {
            header && (header.textContent = "收藏夹");
        }
        renderTagFilters();
        renderBookmarksTable();
    }
})();