// ==UserScript==
// @name         AnMe
// @author       zjw
// @version      9.8.0
// @namespace    https://github.com/Zhu-junwei/AnMe
// @description  通用多网站多账号切换器
// @description:zh  通用多网站多账号切换器
// @description:en  Universal Multi-Site Account Switcher
// @description:es  Conmutador universal de múltiples cuentas para múltiples sitios web
// @icon         data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMWVtIiBoZWlnaHQ9IjFlbSIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0yMSAxNy41QzIxIDE5LjQzMyAxOS40MzMgMjEgMTcuNSAyMUMxNS41NjcgMjEgMTQgMTkuNDMzIDE0IDE3LjVDMTQgMTUuNTY3IDE1LjU2NyAxNCAxNy41IDE0QzE5LjQzMyAxNCAyMSAxNS41NjcgMjEgMTcuNVoiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2Utd2lkdGg9IjEuNSIvPjxwYXRoIGQ9Ik0yIDExSDIyIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjxwYXRoIGQ9Ik00IDExTDQuNjEzOCA4LjU0NDc5QzUuMTU5NDcgNi4zNjIxMSA1LjQzMjMxIDUuMjcwNzcgNi4yNDYwOSA0LjYzNTM4QzcuMDU5ODggNCA4LjE4NDggNCAxMC40MzQ3IDRIMTMuNTY1M0MxNS44MTUyIDQgMTYuOTQwMSA0IDE3Ljc1MzkgNC42MzUzOEMxOC41Njc3IDUuMjcwNzcgMTguODQwNSA2LjM2MjExIDE5LjM4NjIgOC41NDQ3OUwyMCAxMSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48cGF0aCBkPSJNMTAgMTcuNUMxMCAxOS40MzMgOC40MzMgMjEgNi41IDIxQzQuNTY3IDIxIDMgMTkuNDMzIDMgMTcuNUMzIDE1LjU2NyA0LjU2NyAxNCA2LjUgMTRDOC40MzMgMTQgMTAgMTUuNTY3IDEwIDE3LjVaIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIxLjUiLz48cGF0aCBkPSJNMTAgMTcuNDk5OUwxMC42NTg0IDE3LjE3MDdDMTEuNTAyOSAxNi43NDg0IDEyLjQ5NzEgMTYuNzQ4NCAxMy4zNDE2IDE3LjE3MDdMMTQgMTcuNDk5OSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48L3N2Zz4=
// @match        *://*/*
// @license      MIT
// @run-at       document-end
// @grant        GM_cookie
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM_info
// @downloadURL https://update.greasyfork.org/scripts/563142/AnMe.user.js
// @updateURL https://update.greasyfork.org/scripts/563142/AnMe.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (window.self !== window.top) return;

    // ========================================================================
    // 1. Constants & Configuration & Styles
    // ========================================================================

    const CONST = {
        PREFIX: 'acc_stable_',
        ORDER_PREFIX: 'acc_order_',
        CFG: {
            LANG: 'cfg_lang',
            FAB_MODE: 'cfg_fab_mode',
            FAB_POS: 'cfg_fab_pos'
        },
        HOST: location.hostname,
        META: {
            NAME: GM_info.script.name,
            VERSION: GM_info.script.version,
            AUTHOR: GM_info.script.author,
            LINKS: {
                PROJECT: "https://github.com/Zhu-junwei/AnMe",
                DONATE: "https://www.cnblogs.com/zjw-blog/p/19466109"
            }
        },
        ICONS: {
            LOGO: `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 17.5C21 19.433 19.433 21 17.5 21C15.567 21 14 19.433 14 17.5C14 15.567 15.567 14 17.5 14C19.433 14 21 15.567 21 17.5Z" stroke="currentColor" stroke-width="1.5"/><path d="M2 11H22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M4 11L4.6138 8.54479C5.15947 6.36211 5.43231 5.27077 6.24609 4.63538C7.05988 4 8.1848 4 10.4347 4H13.5653C15.8152 4 16.9401 4 17.7539 4.63538C18.5677 5.27077 18.8405 6.36211 19.3862 8.54479L20 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M10 17.5C10 19.433 8.433 21 6.5 21C4.567 21 3 19.433 3 17.5C3 15.567 4.567 14 6.5 14C8.433 14 10 15.567 10 17.5Z" stroke="currentColor" stroke-width="1.5"/><path d="M10 17.4999L10.6584 17.1707C11.5029 16.7484 12.4971 16.7484 13.3416 17.1707L14 17.4999" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
            SWITCH: `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 12H6C4.11438 12 3.17157 12 2.58579 12.5858C2 13.1716 2 14.1144 2 16V18C2 19.8856 2 20.8284 2.58579 21.4142C3.17157 22 4.11438 22 6 22H8C9.88562 22 10.8284 22 11.4142 21.4142C12 20.8284 12 19.8856 12 18V17" stroke="currentColor" stroke-width="1.5"/><path d="M12 7H11C9.11438 7 8.17157 7 7.58579 7.58579C7 8.17157 7 9.11438 7 11V13C7 14.8856 7 15.8284 7.58579 16.4142C8.17157 17 9.11438 17 11 17H13C14.8856 17 15.8284 17 16.4142 16.4142C17 15.8284 17 14.8856 17 13V12" stroke="currentColor" stroke-width="1.5"/><path d="M12 6C12 4.11438 12 3.17157 12.5858 2.58579C13.1716 2 14.1144 2 16 2H18C19.8856 2 20.8284 2 21.4142 2.58579C22 3.17157 22 4.11438 22 6V8C22 9.88562 22 10.8284 21.4142 11.4142C20.8284 12 19.8856 12 18 12H16C14.1144 12 13.1716 12 12.5858 11.4142C12 10.8284 12 9.88562 12 8V6Z" stroke="currentColor" stroke-width="1.5"/></svg>`,
            USER: `<svg width="1em" height="1em" viewBox="0 0 24 24"  fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="6" r="4" stroke="currentColor" stroke-width="1.5"/><ellipse cx="12" cy="17" rx="7" ry="4" stroke="currentColor" stroke-width="1.5"/></svg>`,
            SETTINGS: `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.84308 3.80211C9.8718 2.6007 10.8862 2 12 2C13.1138 2 14.1282 2.6007 16.1569 3.80211L16.8431 4.20846C18.8718 5.40987 19.8862 6.01057 20.4431 7C21 7.98943 21 9.19084 21 11.5937V12.4063C21 14.8092 21 16.0106 20.4431 17C19.8862 17.9894 18.8718 18.5901 16.8431 19.7915L16.1569 20.1979C14.1282 21.3993 13.1138 22 12 22C10.8862 22 9.8718 21.3993 7.84308 20.1979L7.15692 19.7915C5.1282 18.5901 4.11384 17.9894 3.55692 17C3 16.0106 3 14.8092 3 12.4063V11.5937C3 9.19084 3 7.98943 3.55692 7C4.11384 6.01057 5.1282 5.40987 7.15692 4.20846L7.84308 3.80211Z" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5"/></svg>`,
            HELP: `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 17.75C12.4142 17.75 12.75 17.4142 12.75 17V11C12.75 10.5858 12.4142 10.25 12 10.25C11.5858 10.25 11.25 10.5858 11.25 11V17C11.25 17.4142 11.5858 17.75 12 17.75Z" fill="currentColor"/><path d="M12 7C12.5523 7 13 7.44772 13 8C13 8.55228 12.5523 9 12 9C11.4477 9 11 8.55228 11 8C11 7.44772 11.4477 7 12 7Z" fill="currentColor"/><path fill-rule="evenodd" clip-rule="evenodd" d="M1.25 12C1.25 6.06294 6.06294 1.25 12 1.25C17.9371 1.25 22.75 6.06294 22.75 12C22.75 17.9371 17.9371 22.75 12 22.75C6.06294 22.75 1.25 17.9371 1.25 12ZM12 2.75C6.89137 2.75 2.75 6.89137 2.75 12C2.75 17.1086 6.89137 21.25 12 21.25C17.1086 21.25 21.25 17.1086 21.25 12C21.25 6.89137 17.1086 2.75 12 2.75Z" fill="currentColor"/></svg>`,
            LOCK: `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M5.25 9.30277V8C5.25 4.27208 8.27208 1.25 12 1.25C15.7279 1.25 18.75 4.27208 18.75 8V9.30277C18.9768 9.31872 19.1906 9.33948 19.3918 9.36652C20.2919 9.48754 21.0497 9.74643 21.6517 10.3483C22.2536 10.9503 22.5125 11.7081 22.6335 12.6082C22.75 13.4752 22.75 14.5775 22.75 15.9451V16.0549C22.75 17.4225 22.75 18.5248 22.6335 19.3918C22.5125 20.2919 22.2536 21.0497 21.6517 21.6516C21.0497 22.2536 20.2919 22.5125 19.3918 22.6335C18.5248 22.75 17.4225 22.75 16.0549 22.75H7.94513C6.57754 22.75 5.47522 22.75 4.60825 22.6335C3.70814 22.5125 2.95027 22.2536 2.34835 21.6516C1.74643 21.0497 1.48754 20.2919 1.36652 19.3918C1.24996 18.5248 1.24998 17.4225 1.25 16.0549V15.9451C1.24998 14.5775 1.24996 13.4752 1.36652 12.6082C1.48754 11.7081 1.74643 10.9503 2.34835 10.3483C2.95027 9.74643 3.70814 9.48754 4.60825 9.36652C4.80938 9.33948 5.02317 9.31872 5.25 9.30277ZM6.75 8C6.75 5.10051 9.10051 2.75 12 2.75C14.8995 2.75 17.25 5.10051 17.25 8V9.25344C16.8765 9.24999 16.4784 9.24999 16.0549 9.25H7.94513C7.52161 9.24999 7.12353 9.24999 6.75 9.25344V8ZM3.40901 11.409C3.68577 11.1322 4.07435 10.9518 4.80812 10.8531C5.56347 10.7516 6.56459 10.75 8 10.75H16C17.4354 10.75 18.4365 10.7516 19.1919 10.8531C19.9257 10.9518 20.3142 11.1322 20.591 11.409C20.8678 11.6858 21.0482 12.0743 21.1469 12.8081C21.2484 13.5635 21.25 14.5646 21.25 16C21.25 17.4354 21.2484 18.4365 21.1469 19.1919C21.0482 19.9257 20.8678 20.3142 20.591 20.591C20.3142 20.8678 19.9257 21.0482 19.1919 21.1469C18.4365 21.2484 17.4354 21.25 16 21.25H8C6.56459 21.25 5.56347 21.2484 4.80812 21.1469C4.07435 21.0482 3.68577 20.8678 3.40901 20.591C3.13225 20.3142 2.9518 19.9257 2.85315 19.1919C2.75159 18.4365 2.75 17.4354 2.75 16C2.75 14.5646 2.75159 13.5635 2.85315 12.8081C2.9518 12.0743 3.13225 11.6858 3.40901 11.409Z" fill="currentColor"/></svg>`,
            EXPORT: `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 15C3 17.8284 3 19.2426 3.87868 20.1213C4.75736 21 6.17157 21 9 21H15C17.8284 21 19.2426 21 20.1213 20.1213C21 19.2426 21 17.8284 21 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 16V3M12 3L16 7.375M12 3L8 7.375" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
            MUTIEXPORT: `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 9.00195C19.175 9.01406 20.3529 9.11051 21.1213 9.8789C22 10.7576 22 12.1718 22 15.0002V16.0002C22 18.8286 22 20.2429 21.1213 21.1215C20.2426 22.0002 18.8284 22.0002 16 22.0002H8C5.17157 22.0002 3.75736 22.0002 2.87868 21.1215C2 20.2429 2 18.8286 2 16.0002L2 15.0002C2 12.1718 2 10.7576 2.87868 9.87889C3.64706 9.11051 4.82497 9.01406 7 9.00195" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M12 15L12 2M12 2L15 5.5M12 2L9 5.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
            IMPORT: `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g transform="translate(0,24) scale(1,-1)"><path d="M3 15C3 17.8284 3 19.2426 3.87868 20.1213C4.75736 21 6.17157 21 9 21H15C17.8284 21 19.2426 21 20.1213 20.1213C21 19.2426 21 17.8284 21 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 16V3M12 3L16 7.375M12 3L8 7.375" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
            DELETE: `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.1709 4C9.58273 2.83481 10.694 2 12.0002 2C13.3064 2 14.4177 2.83481 14.8295 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M20.5001 6H3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M18.8332 8.5L18.3732 15.3991C18.1962 18.054 18.1077 19.3815 17.2427 20.1907C16.3777 21 15.0473 21 12.3865 21H11.6132C8.95235 21 7.62195 21 6.75694 20.1907C5.89194 19.3815 5.80344 18.054 5.62644 15.3991L5.1665 8.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M9.5 11L10 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M14.5 11L14 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
            DONATE: `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.28441 11.2661C3.15113 9.26687 3.08449 8.26726 3.67729 7.63363C4.27009 7 5.27191 7 7.27555 7H12.7245C14.7281 7 15.7299 7 16.3227 7.63363C16.9155 8.26726 16.8489 9.26687 16.7156 11.2661L16.3734 16.3991C16.1964 19.054 16.1079 20.3815 15.2429 21.1907C14.3779 22 13.0475 22 10.3867 22H9.61333C6.95253 22 5.62212 22 4.75712 21.1907C3.89211 20.3815 3.80361 19.054 3.62662 16.3991L3.28441 11.2661Z" stroke="currentColor" stroke-width="1.5"/><path d="M17 17H18C20.2091 17 22 15.2091 22 13C22 10.7909 20.2091 9 18 9H17" stroke="currentColor" stroke-width="1.5"/><path d="M16 18H4" stroke="currentColor" stroke-width="1.5"/><path d="M6.05081 5.0614L6.46143 4.48574C6.6882 4.16781 6.61431 3.72623 6.29638 3.49945C5.97845 3.27267 5.90455 2.8311 6.13133 2.51317L6.54195 1.9375M14.0508 5.0614L14.4614 4.48574C14.6882 4.16781 14.6143 3.72623 14.2964 3.49945C13.9784 3.27267 13.9046 2.8311 14.1313 2.51317L14.5419 1.9375M10.0508 5.0614L10.4614 4.48574C10.6882 4.16781 10.6143 3.72623 10.2964 3.49945C9.97845 3.27267 9.90455 2.8311 10.1313 2.51317L10.5419 1.9375" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
        }
    };

    const I18N_DATA = {
      zh: {_name:"简体中文",nav_switch:"账号切换",nav_mgr:"管理账号",nav_set:"高级设置",nav_notice:"使用声明",nav_about:"关于脚本",confirm_delete: "确定要删除该账号记录吗？",placeholder_name:"给新账号命名...",tip_help:"切换登录失败？尝试勾选 LocalStorage 和 SessionStorage。",tip_lock:"为保证正常读取Cookie，请在篡改猴高级模式下，设置允许脚本访问 Cookie: ALL",btn_save:"保存当前账号",confirm_overwrite: "⚠️ 该名称已存在，确定要覆盖原有记录吗？",btn_clean:"切换新环境 (清空本站痕迹)",save_empty_err:"⚠️ 没有检测到可保存的数据",set_fab_mode:"悬浮球显示模式",fab_auto:"智能",fab_show:"常驻",fab_hide:"隐藏",fab_auto_title:"有账号记录时自动显示，无记录时隐藏",fab_show_title:"始终显示悬浮球",fab_hide_title:"平时不显示，仅能通过菜单唤起",set_lang:"语言设置 / Language",set_backup:"数据备份与还原",btn_exp_curr:"导出当前网站数据",btn_exp_all:"导出脚本全部数据",btn_imp:"导入备份文件",donate:"支持作者",btn_clear_all:"清空脚本所有数据 (慎用)",notice_title:"《使用声明与免责条款》",back:"← 返回上一级",no_data:"🍃 暂无账号记录",confirm_clean:"确定清空当前网站所有痕迹并开启新环境？",confirm_clear_all:"⚠️ 警告：这将删除本脚本保存的所有网站的所有账号数据！且无法恢复！",import_ok:"✅ 成功导入/更新 {count} 个账号！",import_err:"❌ 导入失败：文件格式错误",export_err:"⚠️ 没有可导出的数据",menu_open:"🚀 开启账号管理",dlg_ok:"确定",dlg_cancel:"取消",about_desc:"通用多网站多账号切换器",notice_content:`<h4>1. 脚本功能说明</h4><p>本脚本通过篡改猴插件提供的存储API，将当前网站的 Cookie、LocalStorage 和 SessionStorage 进行快照保存。当您点击切换时，脚本会清空当前痕迹并还原选中的快照数据，从而实现多账号快速登录。</p><h4>2. 数据存储安全</h4><p>所有账号数据均存储在您浏览器的篡改猴插件内部管理器中（GM_setValue），脚本没有联网权限，更不会上传任何数据到远程服务器。如果您需要云端同步数据，可以使用篡改猴自带的云端备份功能。</p><h4>3. 风险提示</h4><p>由于浏览器环境的开放性，本脚本无法阻止同域名下的其他恶意脚本通过篡改猴 API 或存储机制尝试获取这些数据。请勿在公共电脑或不可信的设备环境中使用本脚本保存重要账号。</p><h4>4. 免责声明</h4><p>本脚本仅供学习交流使用。因使用本脚本导致的账号被封禁、数据泄露或任何形式的损失，作者不承担任何法律责任。</p>`},
      en: {_name:"English",nav_switch:"Accounts",nav_mgr:"Manage",nav_set:"Settings",nav_notice:"Disclaimer",nav_about:"About",confirm_delete: "Are you sure you want to delete this account?",placeholder_name:"Name this account...",tip_help:"Switch failed? Try checking LocalStorage/SessionStorage.",tip_lock:"To ensure cookies can be read correctly, open Tampermonkey’s Advanced Settings and change “Allow scripts to access cookies” to “ALL”.",btn_save:"Save Current",confirm_overwrite: "⚠️ Name already exists. Do you want to overwrite it?",btn_clean:"Switch to a new environment (clear all data for this site)",save_empty_err:"⚠️ No data detected to save",set_fab_mode:"Float Button Mode",fab_auto:"Auto",fab_show:"Show",fab_hide:"Hide",fab_auto_title:"Automatically show when accounts exist, hide when none",fab_show_title:"Always show the floating button",fab_hide_title:"Hidden by default, can only be activated via the menu",set_lang:"语言设置 / Language",set_backup:"Backup & Restore",btn_exp_curr:"Export Current Site",btn_exp_all:"Export All Data",btn_imp:"Import Backup",donate:"Buy me a coffee",btn_clear_all:"Clear all script data (use with caution)",notice_title:"Disclaimer & Terms",back:"← Back",no_data:"🍃 No accounts",confirm_clean:"Are you sure you want to clear all traces of the current website and start a new environment?",confirm_clear_all:"⚠️ Warning: This will delete all account data for all websites saved by this script, and cannot be undone!",import_ok:"✅ Successfully imported/updated {count} account(s)!",import_err:"❌ Invalid format",export_err:"⚠️ No data",menu_open:"🚀 Open Manager",dlg_ok:"OK",dlg_cancel:"Cancel",about_desc:"Universal Multi-Site Account Switcher",notice_content:`<h4>1. Script Functionality</h4><p>This script utilizes the storage API provided by Tampermonkey to take snapshots of the current website's Cookies, LocalStorage, and SessionStorage. When switching accounts, the script clears current session data and restores the selected snapshot, enabling rapid multi-account login.</p><h4>2. Data Storage & Security</h4><p>All account data is stored locally within your browser's Tampermonkey extension manager (via GM_setValue). This script has no network permissions and will never upload any data to remote servers. If you require cloud synchronization, please use Tampermonkey's built-in cloud backup feature.</p><h4>3. Risk Warning</h4><p>Due to the open nature of browser environments, this script cannot prevent other malicious scripts on the same domain from attempting to access data via storage mechanisms. Please avoid using this script to save sensitive accounts on public or untrusted devices.</p><h4>4. Disclaimer</h4><p>This script is intended for educational and exchange purposes only. The author shall not be held legally responsible for any account bans, data breaches, or any form of loss resulting from the use of this script.</p>`},
      es: {_name:"Español",nav_switch:"Cuentas",nav_mgr:"Administrar",nav_set:"Configuración",nav_notice:"Aviso legal",nav_about:"Acerca de",confirm_delete: "¿Estás seguro de que deseas eliminar esta cuenta?",placeholder_name:"Nombre para esta cuenta...",tip_help:"¿Falló el cambio de cuenta? Intenta marcar LocalStorage y SessionStorage.",tip_lock:"Para garantizar la correcta lectura de cookies, abre la configuración avanzada de Tampermonkey y establece “Permitir que los scripts accedan a cookies” en “ALL”.",btn_save:"Guardar cuenta actual",confirm_overwrite: "⚠️ El nombre ya existe. ¿Deseas sobrescribirlo?",btn_clean:"Cambiar a un nuevo entorno (borrar datos del sitio)",save_empty_err:"⚠️ No se detectaron datos para guardar",set_fab_mode:"Modo del botón flotante",fab_auto:"Automático",fab_show:"Siempre visible",fab_hide:"Oculto",fab_auto_title:"Se muestra automáticamente cuando hay cuentas guardadas; se oculta si no hay ninguna",fab_show_title:"El botón flotante se muestra siempre",fab_hide_title:"Oculto por defecto, solo accesible desde el menú",set_lang:"Idioma / Language",set_backup:"Copia de seguridad y restauración",btn_exp_curr:"Exportar datos del sitio actual",btn_exp_all:"Exportar todos los datos del script",btn_imp:"Importar archivo de respaldo",donate:"Apoyar al autor",btn_clear_all:"Borrar todos los datos del script (usar con precaución)",notice_title:"Términos de uso y descargo de responsabilidad",back:"← Volver",no_data:"🍃 No hay cuentas",confirm_clean:"¿Seguro que deseas borrar todos los rastros del sitio actual y comenzar un nuevo entorno?",confirm_clear_all:"⚠️ Advertencia: Esto eliminará todos los datos de cuentas de todos los sitios guardados por este script. ¡Esta acción no se puede deshacer!",import_ok:"✅ Se importaron/actualizaron correctamente {count} cuenta(s)",import_err:"❌ Error de importación: formato de archivo inválido",export_err:"⚠️ No hay datos para exportar",menu_open:"🚀 Abrir gestor de cuentas",dlg_ok:"Aceptar",dlg_cancel:"Cancelar",about_desc:"Conmutador universal de múltiples cuentas para múltiples sitios",notice_content:`<h4>1. Funcionalidad del script</h4><p>Este script utiliza la API de almacenamiento proporcionada por Tampermonkey para guardar instantáneas de las Cookies, LocalStorage y SessionStorage del sitio web actual. Al cambiar de cuenta, el script borra los datos actuales y restaura la instantánea seleccionada, permitiendo un inicio de sesión rápido con múltiples cuentas.</p><h4>2. Almacenamiento y seguridad de datos</h4><p>Todos los datos de las cuentas se almacenan localmente en el administrador interno de Tampermonkey (mediante GM_setValue). El script no tiene permisos de red y nunca sube datos a servidores remotos. Si necesitas sincronización en la nube, utiliza la función de respaldo en la nube integrada de Tampermonkey.</p><h4>3. Advertencia de riesgo</h4><p>Debido a la naturaleza abierta del entorno del navegador, este script no puede impedir que otros scripts maliciosos bajo el mismo dominio intenten acceder a estos datos mediante mecanismos de almacenamiento. Evita guardar cuentas sensibles en equipos públicos o no confiables.</p><h4>4. Descargo de responsabilidad</h4><p>Este script se proporciona únicamente con fines educativos y de intercambio. El autor no asume ninguna responsabilidad legal por bloqueos de cuentas, fugas de datos o cualquier tipo de pérdida derivada del uso de este script.</p>`}
    };


    // Shadow DOM CSS
    const STYLE_CSS = `
        :host {
            all: initial; font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif!important;font-size: 14px!important;line-height: 1.5;color: #333!important;z-index: 2147483647; position: fixed;
            top: 0;left: 0;width: 0;height: 0;pointer-events: none;
        }

        * { box-sizing: border-box; }
        a { text-decoration:none; }

        #acc-mgr-fab, .acc-panel, .acc-dialog-mask { pointer-events: auto; }
        #acc-mgr-fab { padding: 10px;position: fixed; bottom: 100px; right: 30px; width: 44px; height: 44px; background: #2196F3; color: white; border-radius: 50%; display: none; align-items: center; justify-content: center; font-size: 20px; cursor: move; z-index: 1000000; box-shadow: 0 8px 30px rgba(0,0,0,0.25); user-select: none; border: none; touch-action: none; transition: transform 0.1s; }
        #acc-mgr-fab:active { transform: scale(0.95); }

        .acc-panel { position: fixed; width: 340px; background: white; border-radius: 12px; box-shadow: 0 8px 30px rgba(0,0,0,0.25); z-index: 1000001; display: flex; flex-direction: column; font-family: inherit; border: 1px solid #ddd; overflow: hidden; height: 480px; overscroll-behavior: none !important; opacity: 0; visibility: hidden; transform: translateY(20px) scale(0.95); transition: opacity 0.2s ease, visibility 0.2s ease, transform 0.2s cubic-bezier(0.4, 0, 0.2, 1); pointer-events: none; }
        .acc-panel.show { opacity: 1; visibility: visible; transform: translateY(0) scale(1); pointer-events: auto; }
        .acc-header { display: flex; align-items: center; justify-content: center; padding: 8px 15px; border-bottom: 1px solid #eee; background: #fff; position: relative; flex-shrink: 0; }
        .acc-header-title { font-size: 14px; font-weight: bold; color: #333; text-align: center; }
        #acc-close-btn { position: absolute; right: 15px; top: 50%; transform: translateY(-50%); cursor: pointer; color: #ccc; font-size: 16px; padding: 5px; transition: color 0.2s; }
        #acc-close-btn:hover { color: #666; }

        .acc-tab-content { flex: 1; display: none; padding: 15px 15px 0 15px; overflow: hidden; flex-direction: column; background: #fff; }
        .acc-tab-content.active { display: flex; }
        .acc-tab-btn span { font-size: 18px; margin-bottom: 2px; }
        .acc-tabs-footer { display: flex; background: #fff; border-top: 1px solid #eee; flex-shrink: 0; box-shadow: 0 -4px 12px rgba(0,0,0,0.05); position: relative; z-index: 10; }
        .acc-tab-btn { position: relative; flex: 1; padding: 6px 0; cursor: pointer; transition: color 0.2s; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .acc-tab-btn::after { content: ""; position: absolute; bottom: 0; left: 0; width: 100%; height: 1px; background-color: transparent; transition: all 0.2s; }
        .acc-tab-btn.active { color: #2196F3; background: #f2f8fd }
        .acc-tab-btn.active::after { background-color: #2196F3; box-shadow: 0 -1px 4px rgba(33, 150, 243, 0.4); }

        .acc-host-sel {flex:1; padding:6px; font-size:12px; border:1px solid #eee; border-radius:4px; outline:none; cursor:pointer; background:#fff; color:#333;}
        .aac-btn-goto-host {width:30px; height:30px; border:1px solid #ddd; background:#fff; border-radius:4px; cursor:pointer; display:flex; align-items:center; justify-content:center; flex-shrink:0; color:#555; font-size:16px;}

        .acc-scroll-area { flex: 1; overflow-y: auto; padding-right: 4px; margin-top: 2px; overscroll-behavior: contain;}
        .acc-scroll-area::-webkit-scrollbar { width: 4px; }
        .acc-scroll-area::-webkit-scrollbar-thumb { background: #ddd; border-radius: 10px; }

        /* --- Customized Elements --- */
        .acc-backup-row { display: flex; gap: 8px; margin-bottom: 10px; justify-content: space-between; }
        .acc-icon-btn { flex: 1; height: 38px; padding: 0; border-radius: 6px; border: 1px solid #eee; background: #f9f9f9; cursor: pointer; font-size: 18px; transition: 0.2s; display: flex; align-items: center; justify-content: center; color: #555; }
        .acc-icon-btn:hover,.aac-btn-goto-host:hover { background: #e3f2fd; border-color: #2196F3; color:#2196F3}
        .acc-icon-btn.danger:hover { background: #ffebee; border-color: #f44336; color: #f44336; }

        .acc-about-content { padding: 5px; color: #444 !important; font-size: 13px !important; line-height: 1.6 !important; text-align: left !important; }
        .acc-about-header { text-align: center !important; margin-bottom: 20px !important; }
        .acc-about-logo { font-size: 20px !important; margin-bottom: 5px !important; display: block !important; }
        .acc-about-name { font-weight: bold !important; font-size: 16px !important; color: #333 !important; }
        .acc-about-ver { color: #999 !important; font-size: 12px !important; }
        .acc-about-item { display: flex !important; justify-content: space-between !important; padding: 3px 0 !important; border-bottom: 1px solid #f5f5f5 !important; }
        .acc-about-label { color: #888 !important; font-weight: bold !important; }

        /* Custom Dialog UI */
        .acc-dialog-mask { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.4); z-index: 2000005; display: none; align-items: center; justify-content: center; backdrop-filter: blur(2px); }
        .acc-dialog-box { background: white; width: 280px; border-radius: 12px; padding: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); animation: accPop 0.05s ease-out; display: flex; flex-direction: column; }
        @keyframes accPop { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .acc-dialog-msg { font-size: 14px; color: #333; margin-bottom: 20px; line-height: 1.5; text-align: center; white-space: pre-wrap; font-weight: 500; }
        .acc-dialog-footer { display: flex; gap: 10px; }
        .acc-dialog-btn { flex: 1; padding: 8px 0; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 13px; transition: 0.1s; }
        .acc-dialog-btn-ok { background: #2196F3; color: white; }
        .acc-dialog-btn-ok:hover { background: #1976D2; }
        .acc-dialog-btn-cancel { background: #f5f5f5; color: #666; }
        .acc-dialog-btn-cancel:hover { background: #e0e0e0; }

        /* Others ... */
        .acc-switch-card { padding: 12px; border: 1px solid #eee; border-radius: 8px; margin-bottom: 8px; cursor: pointer; transition: 0.2s; position: relative; background: #fff; }
        .acc-switch-card:hover { border-color: #2196F3; background: #f7fbff; }
        .acc-switch-card:hover svg {fill: #2196F3 !important;stroke: #2196F3 !important;transition: all 0.2s ease;}
        .acc-card-name { font-weight: 600; font-size: 14px; display: flex; align-items: center; gap: 6px; margin-bottom: 6px; color: #333; }
        .acc-card-meta { font-size: 10px; color: #999; display: flex; flex-wrap: wrap; gap: 4px; }
        .acc-mini-tag { background: #f0f0f0; padding: 1px 5px; border-radius: 3px; color: #777; transition: all 0.2s; border: 1px solid transparent; }
        .acc-click-tag { cursor: pointer; text-decoration: none; position: relative; }
        .acc-click-tag:hover { background: #2196F3; color: white; border-color: #1976D2; z-index: 2; }

        .acc-mgr-item { display: flex; align-items: center; margin-top: 2px; border-bottom: 1px solid #f9f9f9; background: white; cursor: grab; color: #333; }
        .acc-mgr-item.dragging { opacity: 0.4; background: #e3f2fd; border: 1px dashed #2196F3; }
        .acc-mgr-handle { margin: 0 8px; color: #ccc; font-size: 14px; user-select: none; cursor: grab; }

        /* Updated Input Styling - Added border color transition on hover/focus */
        .acc-mgr-input { flex: 1; border: 1px solid transparent; padding: 4px 6px; font-size: 13px; outline: none; border-radius: 4px; background: transparent; color: #333; transition: all 0.2s; }
        .acc-mgr-input:hover { border-color: #ddd; background: #fdfdfd; }

        .acc-btn-del { color: #ccc; cursor: pointer; padding: 0 12px; font-size: 20px; font-weight: 300; user-select: none; }
        .acc-btn-del:hover { color: #f44336; }
        .acc-action-fixed { border-top: 1px solid #eee; padding-top: 1px; flex-shrink: 0; background-color: #fcfcfc;}
        .acc-row-btn { display: flex; gap: 8px; align-items: center; }
        .acc-input-text { flex: 1; width:100%; padding: 8px; margin-bottom:8px; border: 1px solid #ddd; border-radius: 6px; font-size: 13px; box-sizing: border-box; background: #fff; color: #333; outline: none; transition: all 0.2s; }
        .acc-input-text:focus,.acc-mgr-input:focus { border-color: #2196F3; box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2); }
        .acc-btn { border: none; padding: 10px; border-radius: 6px; cursor: pointer; font-size: 13px; display: flex; align-items: center; justify-content: center; gap: 5px; transition: 0.2s; }
        .acc-btn-blue { flex: 1; background: #2196F3; color: white; }
        .acc-btn-plus { width: 38px; height: 38px; background: #fff; color: #666; border: 1px solid #ddd; font-size: 20px; }
        .acc-btn-plus:hover { border-color: #2196F3; color: #2196F3; }
        .acc-help-tip, .acc-lock-tip { display: inline-block; width: 16px; height: 16px; line-height: 16px; text-align: center; cursor: help; font-size: 16px; }
        .acc-help-tip { color:#f5a623; margin-left:10px; margin-right:4px}
        .acc-lock-tip { color: #999; }
        .acc-set-group { margin-bottom: 10px; }
        .acc-set-title { font-size: 12px; font-weight: bold; color: #999; margin-bottom: 8px; }
        .acc-set-row { display: flex; gap: 10px; margin-bottom: 10px; padding: 0 3px;}
        .acc-btn-light { background: #f5f5f5; color: #333; flex: 1; border: 1px solid #eee; }
        .acc-btn-light:hover { background: #e0e0e0; }
        .acc-btn-active { background: #2196F3 !important; color: white !important; border-color: #2196F3 !important; }
        .acc-notice-content { line-height: 1.6; color: #444; font-size: 13px; }
        .acc-notice-content h4 { margin: 15px 0 8px 0; color: #333; border-left: 3px solid #2196F3; padding-left: 8px; }
        .acc-link-btn { color: #2196F3; cursor: pointer; font-size: 12px; }
        .acc-select-ui { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 6px; font-size: 13px; background: #fff; cursor: pointer; outline: none; color: #333; }
        .acc-chk {display:flex; align-items:center; flex-wrap:wrap; font-size:11px; color:#666; margin:5px 0;-webkit-user-select: none;}
        .acc-chk-label { display: inline-flex !important; align-items: center !important; cursor: pointer !important; margin-right:4px; font-size: 12px; color: #666; }
        .acc-custom-chk { appearance: none !important; width: 14px !important; height: 14px !important; border: 1px solid #ccc !important; border-radius: 3px !important; margin-right: 4px !important; cursor: pointer !important; position: relative !important; background: #fff; }
        .acc-custom-chk:checked { background-color: #2196F3 !important; border-color: #2196F3 !important; }
        .acc-custom-chk:checked::after { content: ''; position: absolute !important; left: 4px !important; top: 1px !important; width: 3px !important; height: 7px !important; border: solid white !important; border-width: 0 2px 2px 0 !important; transform: rotate(45deg) !important; }

        .acc-loading-mask{position:absolute;top:0;left:0;right:0;bottom:0;background:rgba(255,255,255,.7);backdrop-filter:blur(2px);display:none;flex-direction:column;align-items:center;justify-content:center;z-index:2000010;border-radius:12px}
        .acc-spinner{width:30px;height:30px;border:3px solid #f3f3f3;border-top:3px solid #2196F3;border-radius:50%;animation:acc-spin 1s linear infinite}
        @keyframes acc-spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}
        .acc-loading-text{margin-top:10px;font-size:12px;color:#2196F3;font-weight:700}

    `;

    // ========================================================================
    // 2. Global State & Utils
    // ========================================================================

    const navLang = navigator.language.split('-')[0];
    let currentLang = GM_getValue(CONST.CFG.LANG, I18N_DATA[navLang] ? navLang : 'en');
    if (!I18N_DATA[currentLang]) currentLang = 'en';

    let currentViewingHost = CONST.HOST;
    let isForcedShow = false;

    // Shadow DOM Refs
    let uiRoot = null;
    let fab = null;
    let panel = null;
    let dialogMask = null;

    const Utils = {
        t: (key) => I18N_DATA[currentLang][key] || key,
        extractName: (key) => key.split('::')[1] || key,
        makeKey: (name, host = CONST.HOST) => `${CONST.PREFIX}${host}::${name}`,
        listAllHosts: () => [...new Set(GM_listValues().filter(v => v.startsWith(CONST.PREFIX)).map(v => v.split('::')[0].replace(CONST.PREFIX, '')))],
        getSortedKeysByHost: (host) => {
            const allKeys = GM_listValues().filter(k => k.startsWith(`${CONST.PREFIX}${host}::`));
            const savedOrder = GM_getValue(CONST.ORDER_PREFIX + host, []);
            return allKeys.sort((a, b) => {
                const nameA = Utils.extractName(a);
                const nameB = Utils.extractName(b);
                let idxA = savedOrder.indexOf(nameA);
                let idxB = savedOrder.indexOf(nameB);
                if (idxA === -1) idxA = 9999;
                if (idxB === -1) idxB = 9999;
                if (idxA !== idxB) return idxA - idxB;
                const dataA = GM_getValue(a);
                const dataB = GM_getValue(b);
                return new Date(dataB.time || 0) - new Date(dataA.time || 0);
            });
        },
        formatTime: (timestamp) => {
            if (!timestamp) return '';
            return typeof timestamp === 'number'? new Date(timestamp).toLocaleString(): timestamp;
        }
    };

    // ========================================================================
    // 3. Core Logic (Data & Storage)
    // ========================================================================

    const Core = {
        async saveAccount(name, options = { ck: true, ls: false, ss: false }) {
            const snapshot = {
                time: Date.now(),
                localStorage: options.ls ? { ...localStorage } : {},
                sessionStorage: options.ss ? { ...sessionStorage } : {},
                cookies: []
            };
            if (options.ck) {
                snapshot.cookies = await new Promise(res => GM_cookie.list({}, res));
            }

            const hasCookies = snapshot.cookies && snapshot.cookies.length > 0;
            const hasLS = Object.keys(snapshot.localStorage).length > 0;
            const hasSS = Object.keys(snapshot.sessionStorage).length > 0;

            if (!hasCookies && !hasLS && !hasSS) {
                await UI.alert(Utils.t('save_empty_err'));
                return;
            }

            GM_setValue(Utils.makeKey(name), snapshot);
            const currentOrder = GM_getValue(CONST.ORDER_PREFIX + CONST.HOST, []);
            if (!currentOrder.includes(name)) {
                currentOrder.push(name);
                GM_setValue(CONST.ORDER_PREFIX + CONST.HOST, currentOrder);
            }
        },

        async loadAccount(key) {
            const data = GM_getValue(key);
            if (!data) return;
            UI.toggleLoading(true, "Switching...");
            try {
               localStorage.clear(); sessionStorage.clear();
               const ck = await new Promise(res => GM_cookie.list({}, res));
               for (const c of (ck || [])) await new Promise(res => GM_cookie.delete({name: c.name }, res));
               Object.entries(data.localStorage || {}).forEach(([k, v]) => localStorage.setItem(k, v));
               Object.entries(data.sessionStorage || {}).forEach(([k, v]) => sessionStorage.setItem(k, v));
               for (const c of (data.cookies || [])) {
                   const d = { ...c}; delete d.hostOnly; delete d.session;
                   await new Promise(res => GM_cookie.set(d, res));
               }
               location.reload();
            } catch (err) {
                console.error(err);
                UI.toggleLoading(false);
                UI.alert("Switch failed!");
            }
        },

        async cleanEnvironment() {
            UI.toggleLoading(true, "Cleaning...");
            localStorage.clear(); sessionStorage.clear();
            const ck = await new Promise(res => GM_cookie.list({}, res));
            for (const c of (ck || [])) await new Promise(res => GM_cookie.delete({name: c.name }, res));
            location.reload();
        },

        inspectData(key, type) {
            const data = GM_getValue(key);
            if (!data) return;
            let content = null;
            if (type === 'cookies') content = data.cookies;
            else if (type === 'localStorage') content = data.localStorage;
            else if (type === 'sessionStorage') content = data.sessionStorage;
            if (content) {
                const win = window.open("", "_blank");
                if (win) {
                    win.document.write(`<html><head><title>AnMe Inspector</title><style>body{font-family:monospace;padding:20px;background:#f5f5f5}pre{white-space:pre-wrap;word-wrap:break-word;background:#fff;padding:15px;border:1px solid #ddd;border-radius:5px}</style></head>
                                            <body><h3>${Utils.extractName(key)} - ${type}</h3><pre>${JSON.stringify(content, null, 2)}</pre></body></html>`);
                    win.document.close();
                }
            }
        },

        renameAccount(oldKey, newName, host) {
            const data = GM_getValue(oldKey);
            GM_deleteValue(oldKey);
            GM_setValue(Utils.makeKey(newName, host), data);
            const orderKey = CONST.ORDER_PREFIX + host;
            let order = GM_getValue(orderKey, []);
            const idx = order.indexOf(Utils.extractName(oldKey));
            if(idx !== -1) { order[idx] = newName; GM_setValue(orderKey, order); }
        },

        deleteAccount(key, host) {
            GM_deleteValue(key);
            const orderKey = CONST.ORDER_PREFIX + host;
            const name = Utils.extractName(key);
            const order = GM_getValue(orderKey, []);
            const newOrder = order.filter(n => n !== name);
            if (newOrder.length === 0) {GM_deleteValue(orderKey);} else {GM_setValue(orderKey, newOrder);}
        },

        updateOrder(host, nameList) { GM_setValue(CONST.ORDER_PREFIX + host, nameList); },

        async exportData(scope) {
            let exportObj = {};
            const allKeys = GM_listValues();
            const targetAccKeys = scope === 'current' ? allKeys.filter(k => k.startsWith(`${CONST.PREFIX}${CONST.HOST}::`)) : allKeys.filter(k => k.startsWith(CONST.PREFIX));

            if (targetAccKeys.length === 0) { await UI.alert(Utils.t('export_err')); return; }
            targetAccKeys.forEach(key => {exportObj[key] = GM_getValue(key)});

            if (scope === 'current') {
                const orderKey = CONST.ORDER_PREFIX + CONST.HOST;
                const orderVal = GM_getValue(orderKey);
                if (orderVal) exportObj[orderKey] = orderVal;
            } else {
                allKeys.filter(k => k.startsWith(CONST.ORDER_PREFIX)).forEach(k => {exportObj[k] = GM_getValue(k)});
            }

            const blob = new Blob([JSON.stringify(exportObj, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const downsite = scope === 'current' ? CONST.HOST : 'All_Sites';
            const a = document.createElement('a'); a.href = url; a.download = `${CONST.META.NAME}_Backup_${downsite}_${new Date().toLocaleString('sv-SE').replace(' ', '_').replace(/:/g, '-')}.json`; a.click(); URL.revokeObjectURL(url);
        },

        async importData(file) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    let count = 0;
                    const hostsInFile = [...new Set(Object.keys(data).filter(k => k.startsWith(CONST.PREFIX)).map(k => k.replace(CONST.PREFIX, '').split('::')[0]))];
                    hostsInFile.forEach(host => {
                        const orderKey = CONST.ORDER_PREFIX + host;
                        const fileOrder = data[orderKey] || [];
                        let localOrder = GM_getValue(orderKey, []);
                        const namesToImport = fileOrder.length > 0 ? fileOrder : Object.keys(data).filter(k => k.startsWith(`${CONST.PREFIX}${host}::`)).map(k => k.split('::')[1]);
                        namesToImport.forEach(name => {
                            const fullKey = `${CONST.PREFIX}${host}::${name}`;
                            if (data[fullKey]) {
                                GM_setValue(fullKey, data[fullKey]);
                                if (!localOrder.includes(name)) localOrder.push(name);
                                count++;
                            }
                        });
                        GM_setValue(orderKey, localOrder);
                    });
                    await UI.alert(Utils.t('import_ok').replace('{count}', count));
                    UI.refresh();
                } catch (err) {
                    await UI.alert(Utils.t('import_err'));
                }
            };
            reader.readAsText(file);
        },

        clearAllData() {
            GM_listValues().forEach(k => { if (k.startsWith(CONST.PREFIX) || k.startsWith(CONST.ORDER_PREFIX)) GM_deleteValue(k); });
        }
    };

    // ========================================================================
    // 4. UI Rendering & Templates
    // ========================================================================

    const Templates = {
        panel: () => {
            const langOptions = Object.keys(I18N_DATA).map(code => `<option value="${code}" ${currentLang === code ? 'selected' : ''}>${I18N_DATA[code]._name}</option>`).join('');

            return `
            <div class="acc-header">
                <div class="acc-header-title" id="acc-header-text">${Utils.t('nav_switch')}</div>
                <div  id="acc-close-btn">✕</div>
            </div>

            <div class="acc-tab-content active" id="pg-switch"><div class="acc-scroll-area" id="switch-area"></div></div>

            <div class="acc-tab-content" id="pg-mgr">
                <div style="display:flex; gap:5px; margin-bottom:10px; align-items:center;">
                    <select class="acc-host-sel" id="host-sel"></select>
                    <button class="aac-btn-goto-host" id="btn-goto-host">→</button>
                </div>
                <div class="acc-scroll-area" id="mgr-list-area"></div>
                <div class="acc-action-fixed" id="mgr-fixed-actions">
                    <div class="acc-chk">
                        <label class="acc-chk-label" title="Cookie" ><input type="checkbox" id="c-ck" class="acc-custom-chk" checked> Cookie</label>
                        <label class="acc-chk-label" title="LocalStorage"><input type="checkbox" id="c-ls" class="acc-custom-chk"> LS</label>
                        <label class="acc-chk-label" title="SessionStorage"><input type="checkbox" id="c-ss" class="acc-custom-chk"> SS</label>
                        <span class="acc-help-tip" title="${Utils.t('tip_help')}">${CONST.ICONS.HELP}</span>
                        <span class="acc-lock-tip" title="${Utils.t('tip_lock')}">${CONST.ICONS.LOCK}</span>
                    </div>
                    <input type="text" id="acc-new-name" class="acc-input-text" placeholder="${Utils.t('placeholder_name')}">

                    <div class="acc-row-btn">
                        <button id="do-save" class="acc-btn acc-btn-blue">${Utils.t('btn_save')}</button>
                        <button id="do-clean" class="acc-btn acc-btn-plus" title="${Utils.t('btn_clean')}">+</button>
                    </div>
                </div>
            </div>

            <div class="acc-tab-content" id="pg-set">
                <div class="acc-scroll-area">
                    <div class="acc-set-group">
                        <div class="acc-set-title">${Utils.t('set_fab_mode')}</div>
                        <div class="acc-set-row">
                            <button class="acc-btn acc-btn-light fab-mode-btn" data-val="auto" title="${Utils.t('fab_auto_title')}">${Utils.t('fab_auto')}</button>
                            <button class="acc-btn acc-btn-light fab-mode-btn" data-val="show" title="${Utils.t('fab_show_title')}">${Utils.t('fab_show')}</button>
                            <button class="acc-btn acc-btn-light fab-mode-btn" data-val="hide" title="${Utils.t('fab_hide_title')}">${Utils.t('fab_hide')}</button>
                        </div>
                    </div>
                    <div class="acc-set-group">
                        <div class="acc-set-title">${Utils.t('set_lang')}</div>
                        <div class="acc-set-row"><select id="lang-sel" class="acc-select-ui">${langOptions}</select></div>
                    </div>
                    <div class="acc-set-group">
                        <div class="acc-set-title">${Utils.t('set_backup')}</div>
                        <div class="acc-backup-row">
                            <button class="acc-icon-btn" id="btn-export-curr" title="${Utils.t('btn_exp_curr')}">${CONST.ICONS.EXPORT}</button>
                            <button class="acc-icon-btn" id="btn-export-all" title="${Utils.t('btn_exp_all')}">${CONST.ICONS.MUTIEXPORT}</button>
                            <button class="acc-icon-btn" id="btn-import-trigger" title="${Utils.t('btn_imp')}">${CONST.ICONS.IMPORT}</button>
                            <button class="acc-icon-btn danger" id="btn-clear-all" title="${Utils.t('btn_clear_all')}">${CONST.ICONS.DELETE}</button>
                            <input type="file" id="inp-import-file" accept=".json" style="display:none">
                        </div>
                    </div>
                    <div class="acc-set-group">
                        <div class="acc-set-title">${Utils.t('nav_about')}</div>
                        <button class="acc-btn acc-btn-light" id="go-about" style="width:100%">${Utils.t('nav_about')}</button>
                    </div>
                    <div style="text-align: center; margin-top: 20px;">
                       <span class="acc-link-btn" id="go-notice">${Utils.t('notice_title')}</span>
                    </div>
                </div>
            </div>

            <div class="acc-tab-content" id="pg-about">
                 <div style="margin-bottom: 5px; font-weight: bold; color: #2196F3; cursor: pointer;" class="back-to-set-btn">${Utils.t('back')}</div>
                 <div class="acc-scroll-area">
                    <div class="acc-about-content">
                        <div class="acc-about-header">
                            <div class="acc-about-logo">${CONST.ICONS.LOGO}</div>
                            <div class="acc-about-name">${CONST.META.NAME}</div>
                            <div class="acc-about-ver">Version ${CONST.META.VERSION}</div>
                            <div style="margin:3px 0; color:#666;">${Utils.t('about_desc')}</div>
                        </div>
                        <div class="acc-about-item"><span class="acc-about-label">Author</span><span>${CONST.META.AUTHOR}</span></div>
                        <div class="acc-about-item"><span class="acc-about-label">License</span><span>MIT</span></div>
                        <div class="acc-about-item"><span class="acc-about-label">Github</span><a href="${CONST.META.LINKS.PROJECT}" target="_blank" style="color:#2196F3">View Repo</a></div>
                        <div style="text-align:center;margin-top:20px;">
                            <a href="${CONST.META.LINKS.DONATE}" target="_blank" class="acc-btn acc-btn-blue" style="display:inline-flex; width:80%;">${CONST.ICONS.DONATE} ${Utils.t('donate')}</a>
                        </div>
                    </div>
                 </div>
            </div>

            <div class="acc-tab-content" id="pg-notice">
               <div style="margin-bottom: 5px; font-weight: bold; color: #2196F3; cursor: pointer;" class="back-to-set-btn">${Utils.t('back')}</div>
               <div class="acc-scroll-area"><div class="acc-notice-content">${Utils.t('notice_content')}</div></div>
            </div>

            <div class="acc-tabs-footer">
                <div class="acc-tab-btn active" data-pg="pg-switch" data-title="${Utils.t('nav_switch')}"><span>${CONST.ICONS.SWITCH}</span>${Utils.t('nav_switch')}</div>
                <div class="acc-tab-btn" data-pg="pg-mgr" data-title="${Utils.t('nav_mgr')}"><span>${CONST.ICONS.LOGO}</span>${Utils.t('nav_mgr')}</div>
                <div class="acc-tab-btn" data-pg="pg-set" data-title="${Utils.t('nav_set')}"><span>${CONST.ICONS.SETTINGS}</span>${Utils.t('nav_set')}</div>
            </div>
        `},
        switchCard: (key, data) => `
            <div class="acc-switch-card" data-key="${key}">
                <span class="acc-card-name">${CONST.ICONS.USER} ${Utils.extractName(key)}</span>
                <div class="acc-card-meta">
                    <span class="acc-mini-tag">${Utils.formatTime(data.time)}</span>
                    ${(data.cookies?.length || 0) ? `<span class="acc-mini-tag acc-click-tag" title="Cookie"data-type="cookies">CK: ${data.cookies.length}</span>` : ''}
                    ${Object.keys(data.localStorage || {}).length ? `<span class="acc-mini-tag acc-click-tag" title="LocalStorage" data-type="localStorage">LS: ${Object.keys(data.localStorage).length}</span>` : ''}
                    ${Object.keys(data.sessionStorage || {}).length ? `<span class="acc-mini-tag acc-click-tag" title="SessionStorage" data-type="sessionStorage">SS: ${Object.keys(data.sessionStorage).length}</span>` : ''}
                </div>
            </div>
        `,
        mgrItem: (key) => `
            <div class="acc-mgr-item" draggable="true">
                <span class="acc-mgr-handle">☰</span>
                <input type="text" class="acc-mgr-input" value="${Utils.extractName(key)}" data-key="${key}">
                <span class="acc-btn-del" data-key="${key}">×</span>
            </div>
        `,
        noData: () => `<div style="text-align:center;color:#ccc;margin-top:100px;font-size:13px;">${Utils.t('no_data')}</div>`
    };

    const UI = {
        // --- Helper to query inside shadow root ---
        qs(selector) { return uiRoot ? uiRoot.querySelector(selector) : null; },
        qsa(selector) { return uiRoot ? uiRoot.querySelectorAll(selector) : []; },

        // --- Custom Dialog System ---
        async alert(msg) { return this.showDialog(msg, false); },
        async confirm(msg) { return this.showDialog(msg, true); },
        showDialog(msg, isConfirm) {
            return new Promise(resolve => {
                if (!dialogMask) {
                    dialogMask = document.createElement('div'); dialogMask.className = 'acc-dialog-mask';
                    uiRoot.appendChild(dialogMask); // Append to Shadow Root
                }
                dialogMask.innerHTML = `
                    <div class="acc-dialog-box">
                        <div class="acc-dialog-msg">${msg}</div>
                        <div class="acc-dialog-footer">
                            ${isConfirm ? `<button class="acc-dialog-btn acc-dialog-btn-cancel" id="acc-dlg-cancel">${Utils.t('dlg_cancel')}</button>` : ''}
                            <button class="acc-dialog-btn acc-dialog-btn-ok" id="acc-dlg-ok">${Utils.t('dlg_ok')}</button>
                        </div>
                    </div>
                `;
                dialogMask.style.display = 'flex';
                const okBtn = this.qs('#acc-dlg-ok');
                const cancelBtn = this.qs('#acc-dlg-cancel');
                const close = (res) => { dialogMask.style.display = 'none'; resolve(res); };
                okBtn.onclick = () => close(true);
                if (cancelBtn) cancelBtn.onclick = () => close(false);
            });
        },

        initDraggable() {
            const container = this.qs('#mgr-list-area');
            if (!container) return;
            let draggingEle = null;
            const onDragStart = (e) => { draggingEle = e.target.closest('.acc-mgr-item'); if (draggingEle) draggingEle.classList.add('dragging'); };
            const onDragEnd = (e) => {
                if (draggingEle) {
                    draggingEle.classList.remove('dragging'); draggingEle = null;
                    const items = [...container.querySelectorAll('.acc-mgr-input')];
                    const newOrder = items.map(input => Utils.extractName(input.dataset.key));
                    Core.updateOrder(currentViewingHost, newOrder);
                    UI.renderSwitchView();
                }
            };
            const onDragOver = (e) => {
                e.preventDefault();
                const afterElement = getDragAfterElement(container, e.clientY);
                if (afterElement == null) container.appendChild(draggingEle); else container.insertBefore(draggingEle, afterElement);
            };
            function getDragAfterElement(container, y) {
                const draggableElements = [...container.querySelectorAll('.acc-mgr-item:not(.dragging)')];
                return draggableElements.reduce((closest, child) => {
                    const box = child.getBoundingClientRect();
                    const offset = y - box.top - box.height / 2;
                    if (offset < 0 && offset > closest.offset) return { offset: offset, element: child }; else return closest;
                }, { offset: Number.NEGATIVE_INFINITY }).element;
            }
            container.removeEventListener('dragstart', container._ds); container.removeEventListener('dragend', container._de); container.removeEventListener('dragover', container._do);
            container._ds = onDragStart; container._de = onDragEnd; container._do = onDragOver;
            container.addEventListener('dragstart', onDragStart); container.addEventListener('dragend', onDragEnd); container.addEventListener('dragover', onDragOver);
        },

        renderSwitchView() {
            const currentKeys = Utils.getSortedKeysByHost(CONST.HOST);
            const switchArea = this.qs('#switch-area');
            if (!switchArea) return;
            switchArea.innerHTML = currentKeys.length === 0 ? Templates.noData() : currentKeys.map(k => Templates.switchCard(k, GM_getValue(k))).join('');
        },

        renderMgrView() {
            const mgrList = this.qs('#mgr-list-area');
            if (!mgrList) return;
            const viewingKeys = Utils.getSortedKeysByHost(currentViewingHost);
            mgrList.innerHTML = viewingKeys.map(k => Templates.mgrItem(k)).join('');
            this.initDraggable();

            mgrList.querySelectorAll('.acc-mgr-input').forEach(i => {
                const row = i.closest('.acc-mgr-item');

                // --- FIX: Stop Dragging when typing ---
                i.onmouseenter = () => {if(row) row.setAttribute('draggable', 'false');};
                i.onmouseleave = () => {if(row && uiRoot.activeElement !== i) {row.setAttribute('draggable', 'true');}};
                i.onfocus = () => {if(row) row.setAttribute('draggable', 'false');};
                i.onblur = () => {
                    if(row) row.setAttribute('draggable', 'true');
                    const originalName = Utils.extractName(i.dataset.key);
                    const val = i.value.trim();
                    if (!val || val === originalName) {i.value = originalName;return;}
                    const newKey = Utils.makeKey(val, currentViewingHost);
                    if (GM_getValue(newKey)) {i.value = originalName;return;}
                    Core.renameAccount(i.dataset.key, val, currentViewingHost);
                    UI.refresh();
                };

                i.onclick = (e) => { e.stopPropagation(); }; // Prevent click triggering drag start
                i.onkeydown = (e) => {
                    e.stopPropagation(); // Stop event bubbling
                    if (e.key === 'Enter') { e.preventDefault(); i.blur(); }
                };
                i.onkeyup = (e) => e.stopPropagation();
                i.onkeypress = (e) => e.stopPropagation();
            });
        },

        toggleLoading(show, text = "") {
            let loader = this.qs('.acc-loading-mask');
            if (!loader) {
                loader = document.createElement('div');
                loader.className = 'acc-loading-mask';
                loader.innerHTML = `
                    <div class="acc-spinner"></div>
                    <div class="acc-loading-text"></div>
                `;
                panel.appendChild(loader);
            }
            loader.querySelector('.acc-loading-text').innerText = text;
            loader.style.display = show ? 'flex' : 'none';
        },

        refresh() {
            if (!fab || !panel) return;
            this.renderSwitchView();
            const hosts = Utils.listAllHosts();
            if (!hosts.includes(CONST.HOST)) hosts.push(CONST.HOST);
            if (!hosts.includes(currentViewingHost)) { currentViewingHost = CONST.HOST; }
            const hostSel = this.qs('#host-sel');
            if (hostSel) hostSel.innerHTML = hosts.map(h => `<option value="${h}" ${h === currentViewingHost ? 'selected' : ''}>${h === CONST.HOST ? '📌 ' : '🌐 '}${h}</option>`).join('');
            this.renderMgrView();
            const fixedAct = this.qs('#mgr-fixed-actions');
            if (fixedAct) fixedAct.style.display = (currentViewingHost === CONST.HOST) ? 'block' : 'none';
            const fabMode = GM_getValue(CONST.CFG.FAB_MODE, 'auto');
            const hasAccounts = Utils.getSortedKeysByHost(CONST.HOST).length > 0;
            const isPanelOpen = panel.classList.contains('show');
            panel.querySelectorAll('.fab-mode-btn').forEach(btn => btn.classList.toggle('acc-btn-active', btn.dataset.val === fabMode));
            fab.style.display = (isPanelOpen || isForcedShow || (fabMode === 'show') || (fabMode === 'auto' && hasAccounts)) ? 'flex' : 'none';

            const eyes = fab.querySelectorAll('path:nth-of-type(1), path:nth-of-type(4)');
            if (hasAccounts) {eyes.forEach(path => {path.style.fill = '#555';});} else {eyes.forEach(path => {path.style.fill = 'none';});}

            this.updateSaveBtnState();
        },

        syncPanelPos() {
            if (!fab || !panel) return;
            const r = fab.getBoundingClientRect();
            panel.style.bottom = (window.innerHeight - r.top + 10) + 'px';
            panel.style.left = Math.max(10, r.left - 290) + 'px';
        },

        closePanel() {
            if (panel) panel.classList.remove('show');
            isForcedShow = false;
            UI.refresh();
        },

        createShadowHost() {
            if (document.getElementById('anme-app-host')) return;
            const host = document.createElement('div');
            host.id = 'anme-app-host';
            document.body.appendChild(host);
            uiRoot = host.attachShadow({ mode: 'open' });

            // Inject Styles into Shadow Root
            const styleEl = document.createElement('style');
            styleEl.textContent = STYLE_CSS;
            uiRoot.appendChild(styleEl);
        },

        createFab() {
            if (this.qs('#acc-mgr-fab')) { fab = this.qs('#acc-mgr-fab'); return; }
            fab = document.createElement('div'); fab.id = 'acc-mgr-fab';
            fab.innerHTML = CONST.ICONS.LOGO;
            uiRoot.appendChild(fab); // Append to Shadow Root

            const savedPos = GM_getValue(CONST.CFG.FAB_POS);
            if (savedPos && savedPos.left !== undefined) {
                fab.style.left = Math.max(0, Math.min(savedPos.left, window.innerWidth - 44)) + 'px';
                fab.style.top = Math.max(0, Math.min(savedPos.top, window.innerHeight - 44)) + 'px';
                fab.style.bottom = 'auto'; fab.style.right = 'auto';
            }
            let isDrag = false;
            fab.onmousedown = (e) => {
                isDrag = false; let sx=e.clientX, sy=e.clientY, bx=fab.offsetLeft, by=fab.offsetTop;
                const mv=(ev)=>{
                    isDrag=true;
                    let nl = Math.max(0, Math.min(bx + ev.clientX - sx, window.innerWidth - 44));
                    let nt = Math.max(0, Math.min(by + ev.clientY - sy, window.innerHeight - 44));
                    fab.style.left= nl + 'px'; fab.style.top= nt + 'px'; fab.style.bottom='auto'; fab.style.right='auto';
                    if(panel && panel.classList.contains('show')) UI.syncPanelPos();
                };
                const up=()=>{ document.removeEventListener('mousemove', mv); document.removeEventListener('mouseup', up); if (isDrag) GM_setValue(CONST.CFG.FAB_POS, { left: parseInt(fab.style.left), top: parseInt(fab.style.top) }); };
                document.addEventListener('mousemove', mv); document.addEventListener('mouseup', up);
            };
            fab.onclick = (e) => { if(!isDrag && panel) { e.stopPropagation(); if(panel.classList.toggle('show')) UI.syncPanelPos(); else isForcedShow = false; UI.refresh(); } };
        },

        createPanel() {
            if (this.qs('#acc-mgr-panel')) return;
            panel = document.createElement('div'); panel.id = 'acc-mgr-panel'; panel.className = 'acc-panel';
            panel.innerHTML = Templates.panel();
            uiRoot.appendChild(panel); // Append to Shadow Root
            this.bindPanelEvents(); this.updateSaveBtnState();
        },

        updateSaveBtnState() {
            const ck = UI.qs('#c-ck').checked, ls = UI.qs('#c-ls').checked, ss = UI.qs('#c-ss').checked;
            const name = UI.qs('#acc-new-name').value.trim();
            const saveBtn = UI.qs('#do-save');
            const isAnyChecked = ck || ls || ss;
            const hasName = name.length > 0;
            const canSave = isAnyChecked && hasName;
            saveBtn.disabled = !canSave;
            saveBtn.style.opacity = canSave ? "1" : "0.5";
            saveBtn.style.cursor = canSave ? "pointer" : "not-allowed";
        },

        bindPanelEvents() {
            // Helper for scoped events
            const $ = (s) => this.qs(s);
            const $$ = (s) => this.qsa(s);

            // --- IMPORTANT: Global Panel Event Isolation ---
            // Stop keyboard and input events from leaking out of the panel to the main page
            ['keydown', 'keyup', 'keypress', 'input', 'contextmenu', 'wheel'].forEach(evt => {
                panel.addEventListener(evt, (e) => {
                    e.stopPropagation();
                       if (evt === 'wheel') {
                           const scrollArea = e.target.closest('.acc-scroll-area');
                           if (!scrollArea || scrollArea.scrollHeight <= scrollArea.clientHeight) {e.preventDefault();}
                       }
                   }, { passive: false });
            });

            // Tab switching
           $$('.acc-tab-btn').forEach(b => {
               b.onclick = () => {
                   $$('.acc-tab-btn, .acc-tab-content').forEach(el => el.classList.remove('active'));
                   b.classList.add('active');
                   $('#' + b.dataset.pg).classList.add('active');
                   $('#acc-header-text').innerText = b.dataset.title;
               };
           });
            // --- 新增：响应底部导航栏滚动切换标签 ---
            const footer = $('.acc-tabs-footer');
            const tabBtns = Array.from($$('.acc-tab-btn'));
            footer.onwheel = (e) => {
                e.preventDefault();
                const currentIndex = tabBtns.findIndex(btn => btn.classList.contains('active'));
                const nextIndex = e.deltaY > 0 ?
                    (currentIndex + 1) % tabBtns.length :
                    (currentIndex - 1 + tabBtns.length) % tabBtns.length;
                tabBtns[nextIndex].click();
            };

            // Close
            $('#acc-close-btn').onclick = this.closePanel;
            panel.onclick = (e) => e.stopPropagation();

            // Settings: Fab Mode & Language
            $$('.fab-mode-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    GM_setValue(CONST.CFG.FAB_MODE, btn.dataset.val);
                    this.refresh();
                });
            });
            $('#lang-sel').onchange = (e) => {
                currentLang = e.target.value; GM_setValue(CONST.CFG.LANG, currentLang);
                document.body.removeChild(document.getElementById('anme-app-host')); // Remove old host

                // --- FIX: Reset ALL references to avoid ghost elements ---
                uiRoot = null; panel = null; fab = null; dialogMask = null;

                UI.init();
                // Re-open if was open (hacky but works)
               const newPanel = this.qs('#acc-mgr-panel');
                if (newPanel) {
                    newPanel.classList.add('show');
                    UI.syncPanelPos();
                    const setBtn = Array.from(this.qsa('.acc-tab-btn')).find(b => b.dataset.pg === 'pg-set');
                    if (setBtn) {
                        this.qsa('.acc-tab-btn, .acc-tab-content').forEach(el => el.classList.remove('active'));
                        setBtn.classList.add('active');
                        this.qs('#pg-set').classList.add('active');
                        this.qs('#acc-header-text').innerText = setBtn.dataset.title;
                    }
                }
            };

            // Switch View Logic
            $('#switch-area').onclick = (e) => {
                const tag = e.target.closest('.acc-click-tag');
                if (tag) { e.stopPropagation(); const card = tag.closest('.acc-switch-card'); Core.inspectData(card.dataset.key, tag.dataset.type); return; }
                const card = e.target.closest('.acc-switch-card');
                if (card) Core.loadAccount(card.dataset.key);
            };

            // Manager View Logic
            $('#mgr-list-area').onclick = async (e) => {
                if (e.target.classList.contains('acc-btn-del')) {
                    e.stopPropagation();
                    const key = e.target.dataset.key;
                    if (await UI.confirm(Utils.t('confirm_delete'))) {
                        Core.deleteAccount(key, currentViewingHost);
                        this.refresh();
                    }
                }
            };
            $('#host-sel').onchange = (e) => { currentViewingHost = e.target.value; this.refresh(); };
            $('#btn-goto-host').onclick = () => {
                const host = $('#host-sel').value;
                if (host) {
                    // 默认使用 https 协议跳转
                    window.open('https://' + host, '_blank');
                }
            };

            // Save & Clean Logic
            ['#c-ck', '#c-ls', '#c-ss'].forEach(id => $(id).addEventListener('change', this.updateSaveBtnState));
            // 监听输入框打字事件，实时更新保存按钮状态
            $('#acc-new-name').addEventListener('input', () => this.updateSaveBtnState());
            $('#do-save').onclick = async () => {
                const nameInp = $('#acc-new-name');
                const name = nameInp.value.trim();
                if (!name) return;
                const targetKey = Utils.makeKey(name);
                // overwrite
                if (GM_getValue(targetKey)) {if (!(await UI.confirm(Utils.t('confirm_overwrite')))) {return;}}
                await Core.saveAccount(name, { ck: $('#c-ck').checked, ls: $('#c-ls').checked, ss: $('#c-ss').checked });
                nameInp.value = ""; this.refresh();
            };
            $('#do-clean').onclick = async () => { if(await UI.confirm(Utils.t('confirm_clean'))) Core.cleanEnvironment(); };

            // Backup & Restore Actions
            $('#btn-export-curr').onclick = () => Core.exportData('current');
            $('#btn-export-all').onclick = () => Core.exportData('all');
            $('#btn-import-trigger').onclick = () => $('#inp-import-file').click();
            $('#inp-import-file').onchange = (e) => { if(e.target.files.length) Core.importData(e.target.files[0]); e.target.value = ''; };
            $('#btn-clear-all').onclick = async () => {
                if (await UI.confirm(Utils.t('confirm_clear_all'))) { Core.clearAllData(); this.refresh(); }
            };

            // Sub-pages Navigation
            const showSubPage = (pageId, titleKey) => {
                $$('.acc-tab-content').forEach(el => el.classList.remove('active'));
                $( '#' + pageId ).classList.add('active');
                $('#acc-header-text').innerText = Utils.t(titleKey);
            };
            const backToSet = () => {
                $$('.acc-tab-content').forEach(el => el.classList.remove('active'));
                $('#pg-set').classList.add('active');
                $('#acc-header-text').innerText = Utils.t('nav_set');
            };

            $('#go-notice').onclick = () => showSubPage('pg-notice', 'nav_notice');
            $('#go-about').onclick = () => showSubPage('pg-about', 'nav_about');
            $$('.back-to-set-btn').forEach(btn => btn.addEventListener('click', backToSet));
        },

        init() {
            this.createShadowHost();
            this.createFab();
            this.createPanel();
            this.refresh();
        }
    };

    // ========================================================================
    // 5. Initialization
    // ========================================================================

    const start = () => {
        if (document.body) {
            UI.init();
            new MutationObserver(() => { if (!document.getElementById('anme-app-host')) UI.init(); }).observe(document.body, { childList: true });
        } else { setTimeout(start, 200); }
    };

    window.addEventListener('resize', () => {
        if (fab && fab.style.left) {
            fab.style.left = Math.min(Math.max(0, parseFloat(fab.style.left)), window.innerWidth - 44) + 'px';
            fab.style.top = Math.min(Math.max(0, parseFloat(fab.style.top)), window.innerHeight - 44) + 'px';
            if (panel && panel.classList.contains('show')) UI.syncPanelPos();
        }
    });

    // Close panel when clicking outside (Handles Shadow DOM boundary)
    document.addEventListener('click', (e) => {
        if (!panel || !panel.classList.contains('show')) return;
        // e.composedPath() includes the shadow roots and elements clicked
        const path = e.composedPath();
        if (!path.includes(panel) && !path.includes(fab) && !path.includes(dialogMask)) {
            UI.closePanel();
        }
    });

    GM_registerMenuCommand(Utils.t('menu_open'), () => {
        isForcedShow = true; UI.init();
        if (fab) fab.style.display = 'flex';
        if (panel && !panel.classList.contains('show')) { panel.classList.add('show'); UI.syncPanelPos(); }
        UI.refresh();
    });

    if (document.readyState === 'complete' || document.readyState === 'interactive') start();
    else window.addEventListener('DOMContentLoaded', start);

})();