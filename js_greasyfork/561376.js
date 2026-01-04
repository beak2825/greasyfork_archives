// ==UserScript==
// @name         XIV CN Traveler
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Hook 原生函数进行超域旅行自动尝试，成功率可能会玄学的高一些...?
// @author       etnAtker
// @match        https://ff14bjz.sdo.com/RegionKanTelepo
// @license      MIT
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561376/XIV%20CN%20Traveler.user.js
// @updateURL https://update.greasyfork.org/scripts/561376/XIV%20CN%20Traveler.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SIG_STR = "· 选择您想要传送的游戏角色当前所处服务器，然后点击查找角色";
    let _rawWebpackJsonp = window.webpackJsonp;

    let retryHandler = null;
    let retryCount = 1;

    function stopRetry(reason) {
        if (retryHandler) {
            log(reason);
            clearInterval(retryHandler);
            retryHandler = null;
            retryCount = 1;
        }
    }

    const logger = (() => {
        const container = document.createElement('div');
        container.id = 'tm-log-container';
        Object.assign(container.style, {
            position: 'fixed',
            top: '250px',
            left: '10px',
            width: '320px',
            maxHeight: '600px',
            backgroundColor: 'rgba(30, 30, 30, 0.85)',
            color: '#d4d4d4',
            fontFamily: '"JetBrains Mono", "Consolas", monospace',
            fontSize: '12px',
            padding: '10px',
            borderRadius: '8px',
            zIndex: '999999',
            overflowY: 'auto',
            boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
            pointerEvents: 'none',
            transition: 'all 0.3s ease'
        });

        const header = document.createElement('div');
        header.innerHTML = `
          <div style="display:flex; justify-content:space-between; margin-bottom:8px; border-bottom:1px solid #444; padding-bottom:4px;">
            <span style="font-weight:bold; color:#569cd6;">XIV CN Traveler</span>
            <div style="display:flex; gap:10px; pointer-events:auto;">
              <span id="log-clear-btn" style="cursor:pointer; color:#ce9178; pointer-events:auto;">[Clear]</span>
              <span id="log-stop-btn" style="cursor:pointer; color:#ce9178; pointer-events:auto;">[STOP]</span>
            </div>
          </div>`;
        container.appendChild(header);

        const logList = document.createElement('div');
        container.appendChild(logList);

        document.documentElement.appendChild(container);

        header.querySelector('#log-clear-btn').onclick = () => {
            logList.innerHTML = '';
        };
        header.querySelector('#log-stop-btn').onclick = () => {
            stopRetry("由于用户点击，已停止尝试传送");
        };

        return {
            log: (msg, type = 'info') => {
                const entry = document.createElement('div');
                entry.style.marginBottom = '4px';
                entry.style.wordBreak = 'break-all';

                const time = new Date().toLocaleTimeString([], { hour12: false });
                const colors = {
                    info: '#9cdcfe',
                    success: '#6a9955',
                    warn: '#dcdcaa',
                    error: '#f44747'
                };

                entry.innerHTML = `<span style="color:#808080;">[${time}]</span> <span style="color:${colors[type] || colors.info};">${msg}</span>`;

                logList.appendChild(entry);
                container.scrollTop = container.scrollHeight;
            }
        };
    })();

    function log(...msgs) {
        console.log(`[${new Date().toLocaleString()}]`, "[Traveler]", ...msgs);
        logger.log(msgs.filter(m => typeof m === "string").map(m => m.toString()).join(" "));
    }

    function hookState(stateThis) {
        if (stateThis.__is_hooked_by_traveler__) return;
        stateThis.__is_hooked_by_traveler__ = true;
        let originSetState = stateThis.setState;

        stateThis.setState = function (e, cb) {
            const targets = e.areaGroupListTarget;
            if (typeof e !== 'object' || !targets) return originSetState.call(this, e, cb);

            const newState = {
                ...e,
                areaGroupListTarget: targets.map(e => {
                    if (e.state === 2) return { ...e, state: 1 };
                    else return e;
                })
            };
            return originSetState.call(this, newState, cb);
        }
    };

    function createHookedJsonp(originalFn) {
        return function(_chunkIds, moreModules, _executeModules) {
            for (let moduleId in moreModules) {
                const originalModuleFn = moreModules[moduleId];
                if (originalModuleFn && originalModuleFn.toString().includes(SIG_STR)) {
                    log(`[Hook] 成功定位目标模块! ID: ${moduleId}`);

                    moreModules[moduleId] = function(_module, exports, __webpack_require__) {
                        const result = originalModuleFn.apply(this, arguments);

                        log(`[Hook] 模块 ${moduleId} 的 exports 已捕获`);
                        // 为了debug方便，这里挂载到了window对象上
                        window.dbgTeleExports = exports;

                        let queryTargetAreaList = exports.default.prototype.queryTargetAreaList;
                        exports.default.prototype.queryTargetAreaList = function() {
                            hookState(this);
                            queryTargetAreaList.apply(this);
                        }

                        let migrationOrder = exports.default.prototype.migrationOrder;
                        exports.default.prototype.migrationOrder = function() {
                            if (retryHandler) {
                                log("正在尝试传送，请不要再次点击")
                                return;
                            }

                            log("开始尝试传送");
                            retryHandler = setInterval(() => {
                                log(`尝试传送（第${retryCount++}次）`);
                                migrationOrder.apply(this);
                            }, 60 * 1000);

                            migrationOrder.apply(this);
                        }

                        let queryOrderStatus = exports.default.prototype.queryOrderStatus;
                        exports.default.prototype.queryOrderStatus = function() {
                            stopRetry("创建订单成功，已停止尝试传送");
                            queryOrderStatus.apply(this);
                        }

                        return result;
                    };
                }
            }

            return originalFn.apply(this, arguments);
        };
    }

    if (window.webpackJsonp) {
        const err = "[Hook] 错误: 检测到 webpackJsonp 已初始化，脚本将不会加载，请按 Ctrl + F5 刷新页面";
        log(err);
        window.alert(err);
        return;
    }

    log("使用说明：");
    log("脚本已解锁不可传送大区");
    log("请按正常流程填写信息并提交传送申请");
    log("脚本会自动帮你重试");
    log("如果想停止请点击STOP按钮");
    log("");

    Object.defineProperty(window, 'webpackJsonp', {
        get: () => _rawWebpackJsonp,
        set: (val) => {
            log("[Hook] webpackJsonp 初始化");
            _rawWebpackJsonp = createHookedJsonp(val);
        },
        configurable: true
    });
})();