// ==UserScript==
// @name         暗暗钩索
// @namespace    frivolous.rope.qiegewala
// @version      2025.9.15.8.9
// @description  为了生活，有什么办法？
// @license      GPL-3.0
// @author       miaoyin-tei
// @match        https://www.bilibili.com/
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/list/*
// @connect      https://*.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        GM_cookie
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/549658/%E6%9A%97%E6%9A%97%E9%92%A9%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/549658/%E6%9A%97%E6%9A%97%E9%92%A9%E7%B4%A2.meta.js
// ==/UserScript==

(async function () {

    // Debug
    const isDebug = 0;

    // 战利品
    const rope = window.rope_ = {};
    if (isDebug) unsafeWindow.rope_ = rope;
    const pilferLoot = {};


    // 钩索 ( 目标, 名字, 要做什么({ target, thisArg, args}), 异步转同步返回超时时间[5000ms] )
    const hook = (obj, methodName, callback, asyncReturnTimeout = 5000) => {
        if (!obj || typeof obj[methodName] !== 'function') throw new TypeError('搞错目标了');

        const originalFn = obj[methodName];

        function isPromise(obj) {
            return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
        }

        function waitSync(promise, timeout) {
            let done = false, res, err;
            promise.then(r => { done = true; res = r }, e => { done = true; err = e });
            const start = Date.now();
            while (!done) {
                if (Date.now() - start > timeout) {
                    done = true;
                    err = `等待异步返回超时：${timeout} ms`;
                }
            }
            if (err) console.error(err);
            return res;
        }

        function hookedFn(...args) {
            const hookReturn = callback(this, args[0], args);
            if (isPromise(hookReturn)) {
                return waitSync(hookReturn, asyncReturnTimeout);
            } else if (hookReturn !== undefined) {
                return hookReturn;
            }
            return originalFn.apply(this, args);
        }

        Object.setPrototypeOf(hookedFn, Object.getPrototypeOf(originalFn));
        obj[methodName] = hookedFn;

        return {
            restore() {
                obj[methodName] = originalFn;
            }
        }
    };


    // 偷走甜点
    const pilferTreat = (name, index = 0, options = {}) => new Promise(resolve => {
        const query = {
            name,
            domain: options.domain || location.hostname,
            ...options
        };
        const grab = (n) => {
            let i = new RegExp("(^| )" + n + "=([^;]*)(;|$)"),
                t = document.cookie.match(i);
            return t ? decodeURIComponent(t[2]) : null
        };

        GM_cookie.list(query, (treats, error) => {
            const alittle = grab(name);
            if (error && !alittle) {
                resolve();
                return;
            }
            resolve(
                treats.length > 0
                    ? (index < 0 ? treats : treats[index]?.value)
                    : alittle
            );
        });
    });


    // 等待时机
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));


    // 行动计划
    const actionGroups = [
        {
            name: '暗中行动',
            urls: [
                '/'
            ],
            actions: [
                {
                    name: '偷暗交物资',
                    task: () => molePilferStash()
                }
            ]
        },
        {
            name: '暗中钩索',
            urls: [
                '/video/',
                '/list/'
            ],
            actions: [
                {
                    name: '偷饭卡',
                    task: () => stealMealCard()
                },
                {
                    name: '偷门卡',
                    task: () => stealVueAccessCard()
                },
            ]
        },
        {
            name: '偷以致用',
            urls: [
                '/video/',
                '/list/'
            ],
            actions: [
                {
                    name: '使用门卡',
                    dependsOn: ['偷门卡'],
                    shouldRun: async (deps) => deps[0].status === TaskStatus.SUCCESS,
                    task: () => useAccessCardInVue()
                },
                {
                    name: '伪装身份',
                    dependsOn: ['偷饭卡'],
                    shouldRun: async (deps) => deps[0].status === TaskStatus.SUCCESS,
                    task: async () => useDisguiseIdentity()
                },
                {
                    name: '暗箱操作',
                    dependsOn: ['伪装身份'],
                    shouldRun: async (deps) => deps[0].status === TaskStatus.SUCCESS,
                    task: async () => doBehindScenesRig().then(snoopIntel())
                }
            ]
        }
    ];


    // 传闻记录
    const heapHearsay = {
        mcpy: "MEDIA_CANPLAY"
    };


    //  月光字
    //  注意：直接阅读这些字可能导致认知混乱
    const moonlitGlyphs = new Set([
        'tcj_ilib',
        'nigoLsi',
        'ytilauQteg',
        'tseTbAbew',
        'nigoLsi.resu',
        'resUrepuSsi',
        'hctiwSlairTsi',
        'ytilauQlairTsi',
        'ytilauQtseuqer',
        'eliforp_reyalp_xpb',
        'hctaWlairTgnirahCsi',
        'noisrev_golaid_nigol',
        'TSAOT_YALP_REYALP_V',
        'tsiLytilauQdetroppuSteg'
    ]);

    // 月光图书馆
    const moonLightLibrary = {
        // 荧光流转
        fluorescenceFlow(lunarScript) {
            const found = [...moonlitGlyphs].find(v => v.startsWith(lunarScript));
            return found ? [...found].reverse().join('') : null;
        }
        // 光痕编织
        // luminousWeaving(mundaneText) {
        //     return [...mundaneText].reverse().join('');
        // }
    };


    // 任务状态结果枚举
    const TaskStatus = { SUCCESS: 1, FAILED: 2, SKIPPED: 3 };

    // 任务对象结构
    class TaskResult {
        constructor(groupName, name, status, data = '这次就算了') {
            Object.assign(this, { groupName, name, status, data, startTime: performance.now() });
        }
        end() { this.duration = performance.now() - this.startTime; return this; }
        get statusText() { return ['✅ 成功', '❌ 失败', '⏸️ 跳过'][this.status - 1]; }
        isSuccess() { return this.status === TaskStatus.SUCCESS; }
    }

    // 任务追踪
    class MissionTracker {
        #missions = Object.create(null);

        // 记录任务结果
        logMission(missionName, status) {
            if (!Object.values(TaskStatus).includes(status)) {
                throw new Error(`无效的任务状态: ${status}`);
            }
            this.#missions[missionName] = status;
        }

        // 验证任务是否达标 (单个或多个任务名, 期望状态, 检查方式[all: 全部达标 / some: 至少一个达标])
        verifyMission(missionNames, targetStatus, mode = 'all') {
            const missions = Array.isArray(missionNames) ? missionNames : [missionNames];
            const statuses = missions.map(name => this.#missions[name] === targetStatus);
            return mode === 'all' ? statuses.every(Boolean) : statuses.some(Boolean);
        }
    }
    const missionTracker = new MissionTracker();


    /**
     * 执行任务
     *
     * @example
     * const globalTaskRegistry = new Map();
     * const actionGroups = [{
     *   name: '示例任务组',
     *   urls: ['/login'], // 匹配域名使用 '/'
     *   actions: [{
     *     name: '任务1',
     *     task: async () => console.log('执行任务')
     *   }, {
     *     name: '任务2',
     *     dependsOn: ['任务1'], // 依赖任务1
     *     shouldRun: async (deps) => deps[0].status === TaskStatus.SUCCESS, // 执行条件控制，deps[n] 依赖任务执行结果数组
     *     task: async () => console.log("依赖任务执行后运行")
     *   }]
     * }];
     *
     * executeActions(actionGroups, globalTaskRegistry);
     *
     * @param {Object} actGroups 任务清单
     * @returns {Promise<void>}
     *
     * @see TaskStatus 任务状态指南
     * @see TaskResult 任务结果指南
     * @see MissionTracker 任务追踪
     * @see generateReport 发布任务报告
    */
    async function executeActions(actGroups) {
        const groups = actGroups.filter(g => g.urls.some(u => location.pathname === u || location.href.includes(u)));
        if (!groups.length) return;

        const withGroupProp = (groups, propName, getter) =>
            groups.map(group => ({
                actions: group.actions.map(action => ({
                    ...action,
                    [propName]: getter(group)
                }))
            }));

        const executeTasks = async (actions) => {
            const taskMap = new Map(actions.map(a => [a.name, a]));
            const results = {};

            const runTask = async (action) => {
                const result = new TaskResult(action.groupName, action.name, TaskStatus.SUCCESS);
                try {
                    const resultDat = await action.task();
                    result.data = resultDat?.data || resultDat;
                    result.status = resultDat?.status || TaskStatus.SUCCESS;
                } catch (e) {
                    result.status = TaskStatus.FAILED;
                    result.data = e;
                }
                return result.end();
            };

            const executeTask = async (action) => {
                if (results[action.name]) return results[action.name];

                const deps = action.dependsOn
                    ? await Promise.all(
                        [].concat(action.dependsOn).map(name => {
                            const depAction = taskMap.get(name);
                            if (!depAction) throw new Error(`依赖任务 ${name} 不存在`);
                            return executeTask(depAction);
                        })
                    )
                    : [];

                const shouldRun = !action.dependsOn || !action.shouldRun || await action.shouldRun(deps);
                results[action.name] = shouldRun
                    ? await runTask(action)
                    : new TaskResult(action.groupName, action.name, TaskStatus.SKIPPED).end();

                missionTracker.logMission(action.name, results[action.name].status);
                return results[action.name];
            };

            await Promise.all(actions.map(executeTask));
            return { taskResults: Object.values(results) };
        };

        const results = await executeTasks(
            withGroupProp(groups, 'groupName', g => g.name)
                .flatMap(g => g.actions)
        );

        isDebug && generateReport([results]);
    }


    // 准备行动
    const ready = document.readyState === 'complete'
        ? Promise.resolve()
        : new Promise(resolve => window.addEventListener('load', resolve));

    ready.then(executeActions(actionGroups)).catch(console.error);


    // ----------------------


    // 发布任务报告
    function generateReport(results) {
        console.group('%c+ 暗暗钩索 +', 'font-size:15px;color:#86f');

        const flatResults = results.flatMap(({ taskResults }) =>
            taskResults.map(task => ({
                任务组: task.groupName,
                任务名称: task.name,
                执行状态: task.statusText,
                耗时: `${task.duration?.toFixed(2) || '0.00'}ms`,
                结果: task.isSuccess() ? task.data : task.data?.message || String(task.data)
            }))
        );

        // 统计结果计数
        const stats = {
            '总任务数': flatResults.length,
            '成功数': flatResults.filter(r => r.执行状态 === '✅ 成功').length,
            '失败数': flatResults.filter(r => r.执行状态 === '❌ 失败').length,
            '跳过数': flatResults.filter(r => r.执行状态 === '⏸️ 跳过').length
        };

        console.table(flatResults);
        console.log('%c统计结果:', 'color:#87f', stats);

        // 失败详情
        flatResults.filter(r => r.执行状态 === '❌ 失败').forEach(failed => {
            console.groupCollapsed(`%c失败任务: ${failed.任务组} > ${failed.任务名称}`, 'color:#e66');
            console.error(failed.结果);
            console.groupEnd();
        });

        console.groupEnd();
    };


    /**
     * 偷设备
     * @param {Set} propSet - 需要偷的设备属性清单
     * @param {boolean} [once=true] - 只偷一次？false：每次见到就偷
     * @param {Function} onStolen({target, name, firstArg, args}) - 偷到时要做的事
     * @param {Function} onUnstolen - 没偷到时要做的事
     */
    function stealFuncCall({
        propSet,
        once = true,
        onStolen = () => { },
        onUnstolen = () => { }
    } = {}) {
        return new Promise(async (resolve, reject) => {
            const allowedProperties = propSet || new Set();
            const hookFnObj = unsafeWindow.Function.prototype;
            const hookFnName = 'call';

            const failed = () => {
                hooked.restore();
                onUnstolen();
                reject(false);
            };

            let timeout = setTimeout(failed, 30000);

            const hooked = hook(hookFnObj, hookFnName, (thisArg, firstArg, args) => {
                if (firstArg && typeof firstArg === 'object') {
                    const matchedProps = Object.keys(firstArg).filter(prop =>
                        allowedProperties.has(prop)
                    );

                    if (matchedProps.length < 1) return;

                    if (timeout) {
                        clearTimeout(timeout);
                        timeout = undefined;
                    }

                    onStolen({
                        target: thisArg,
                        name: thisArg.name,
                        firstArg,
                        args
                    });

                    if (once) {
                        hooked.restore();
                        resolve(true);
                    }
                }
            });
        });
    }


    /**
     * 偷暗交物资
     * @param {Set} contentSet - 需要偷的物资内容清单 [new Set(['findstr1', or 'findstr2']), and new Set...]
     * @param {boolean} [once=true] - 只偷一次？false：每次见到就偷
     * @param {Function} onStolen({target, name, handler, args}) - 偷到时要做的事 - return null 偷走
     * @param {Function} onUnstolen - 没偷到时要做的事
     */
    function stealCovertAwaitGoods({
        contentSet,
        once = true,
        onStolen = () => { },
        onUnstolen = () => { }
    } = {}) {
        return new Promise(async (resolve, reject) => {
            const allowedContents = contentSet || new Set();
            const hookFnObj = unsafeWindow;
            const hookFnName = 'setTimeout';

            const matchGroupedKeywords = (str, groups) =>
                groups.every(group => [...group].some(k => str.includes(k)));

            const hooked = hook(hookFnObj, hookFnName, (thisArg, firstArg, args) => {
                if (firstArg && typeof firstArg === 'function') {

                    const fnStr = firstArg.toString();
                    if (!matchGroupedKeywords(fnStr, allowedContents)) return;

                    const isStral = onStolen({
                        target: thisArg,
                        name: thisArg.name,
                        firstArg,
                        args
                    });

                    if (once) {
                        hooked.restore();
                        resolve(true);
                    }

                    return isStral;
                }
            });
        });
    }


    /**
     * 在Vue组件树中查找包含指定属性的组件
     * @param {VueComponent} component - 起始Vue组件实例
     * @param {string} propPath - 要查找的属性路径（如 'user.name'）
     * @param {Object} [options={maxDepth=3, findAll=false}] - 配置选项{ 最大查找深度（-1无限），查找所有匹配组件（false返回第一个）}
     * @returns {VueComponent|VueComponent[]|null} 查找结果（根据findAll决定返回类型）
     */
    function findVueComponentByPropPath(
        component,
        propPath,
        { maxDepth = 3, findAll = false } = {},
        currentDepth = 1
    ) {
        if (!component || (maxDepth !== -1 && currentDepth > maxDepth)) {
            return findAll ? [] : null;
        }

        const propChain = propPath.split('.');
        const results = [];

        // 检查当前组件是否匹配
        const isMatch = propChain.reduce((obj, prop) => {
            return (obj && typeof obj === 'object' && prop in obj)
                ? obj[prop]
                : undefined;
        }, component) !== undefined;

        if (isMatch) {
            if (!findAll) {
                return component; // 立即返回第一个匹配项
            }
            results.push(component); // 收集所有匹配项
        }

        // 递归检查子组件
        if (component.$children) {
            for (const child of component.$children) {
                const childResult = findVueComponentByPropPath(
                    child,
                    propPath,
                    { maxDepth, findAll },
                    currentDepth + 1
                );

                if (!findAll && childResult) {
                    return childResult; // 找到第一个立即返回
                }
                if (findAll && childResult.length) {
                    results.push(...childResult); // 收集子组件结果
                }
            }
        }

        return findAll ? results : null;
    }


    /**
     * 异步等待获取对象值
     * @param {Function} getter - 获取对象值的函数
     * @param {number} [maxRetries=5] - 最大重试次数
     * @param {number} [delay=1000] - 重试间隔(毫秒)
     * @returns {Promise<any>} 返回获取到的值
     */
    async function waitForValue(getter, maxRetries = 5, delay = 1000) {
        let retries = 0;

        return new Promise((resolve, reject) => {
            const tryGetValue = async () => {
                try {
                    const value = await Promise.resolve(getter());

                    if (value !== null && value !== undefined) {
                        resolve(value);

                    } else if (retries < maxRetries) {
                        retries++;
                        setTimeout(tryGetValue, delay);
                    } else {
                        reject(new Error(`获取对象值失败，已达到最大重试次数 ${maxRetries} 次`));
                    }
                } catch (error) {
                    reject(error);
                }
            };

            tryGetValue();
        });
    }


    /**
     * 设置对象属性值
    * @param {object} obj - 目标对象
    * @param {string} propPath - 属性路径（如 'user.name'）
    * @param {any} value - 设置的新值
    * @returns {boolean} 是否设置成功
    */
    function setValue(obj, propPath, value) {
        if (!obj || typeof obj !== 'object') return false;

        const props = propPath.split('.');
        const lastProp = props.pop();
        const parent = props.reduce((o, p) => (o[p] ??= {}), obj);

        const desc = Object.getOwnPropertyDescriptor(parent, lastProp);
        if (desc?.set) return Reflect.set(parent, lastProp, value);

        return Reflect.defineProperty(parent, lastProp, {
            configurable: true,
            enumerable: true,
            writable: true,
            value
        });
    }
    if (isDebug) unsafeWindow.rope_.setValue = setValue;


    /**
     * 从localStorage读取JSON指定路径值
     * @param {string} key - 存储键名
     * @param {string|string[]} path - 取值路径
     * @returns {any} 路径对应值，无值则返回null
     */
    function getValueFromLocalStorage(key, path) {
        try {
            const str = localStorage.getItem(key);
            if (!str) return null;

            const data = JSON.parse(str);
            const paths = Array.isArray(path) ? path : path.split('.').filter(Boolean);

            return paths.length
                ? paths.reduce((curr, k) => curr?.[k] ?? null, data)
                : data;
        } catch (e) {
            console.error('读取失败:', e);
            return null;
        }
    };


    // - - - - - - - - - - - - - - - - - - -


    // 查找目标
    async function findTargetVue() {
        try {
            const app = await waitForValue(
                () => unsafeWindow.document.querySelector('#app')?.__vue__
            );
            return app;
        } catch (error) {
            console.warn('没有找到目标', error);
            return;
        }
    }


    // 下次再试？
    async function toBeContinue(resolve) {
        const gotTreat = !!await pilferTreat(moonLightLibrary.fluorescenceFlow('tcj_ili'));

        if (resolve && gotTreat) {
            resolve({
                data: '下次再来吧',
                status: TaskStatus.SKIPPED
            });
        }

        return gotTreat;
    }


    // 暗行
    async function snoopSneak(hearsay, source) {
        switch (hearsay) {

            case heapHearsay.mcpy:
                if (source === 'player') {
                    if (
                        missionTracker.verifyMission('暗箱操作', TaskStatus.SUCCESS)
                        && rope?.quaSetdbid !== pilferLoot.player.input.bvid
                    ) {
                        rope.quaSetdbid = pilferLoot.player.input.bvid;
                        useDisguiseIdentity().then(doBehindScenesRig);
                    }
                }
                break;

        }
    }


    // 暗探 pL-
    function snoopIntel() {
        const hookPObj = pilferLoot?.player;
        const hookPName = 'emit';
        const hearsayPemit = (thisArg, say) => {
            snoopSneak(say, 'player');
        }
        hookPObj && hook(hookPObj, hookPName, hearsayPemit);
    }


    // 花言巧语 (巧语，时机，选择) pL-
    function doGlibTalk(vexGlow, sleightStall = 5e3, mystCraft = false) {
        pilferLoot?.toast?.create({
            text: vexGlow,
            duration: sleightStall,
            manualMode: mystCraft,
        });
    }


    // ------------------


    // 偷饭卡 #pilferLoot
    function stealMealCard() {
        return new Promise(async (resolve, reject) => {
            const sayonara = await toBeContinue(resolve);
            if (sayonara) return;

            let isStolen;
            const propSet = new Set(['rootPlayer', 'rootStore']);

            const mapping = (result) => {
                const mapprop = {
                    toastStore: 'toast',
                    userStore: 'user',
                    qualityStore: 'quality',
                    portStore: 'port',
                    rootPlayer: 'player'
                };
                Object.entries(mapprop).forEach(([from, to]) => pilferLoot[to] = result.firstArg[from]);
            }

            stealFuncCall({
                propSet,
                onStolen: (result) => {
                    rope.bRoot = result;
                    mapping(result);
                    if (!isStolen) {
                        isStolen = true;
                        resolve('偷到了！');
                    }
                },
                onUnstolen: () => reject('没偷到...')
            });
        });
    }


    // 偷门卡
    function stealVueAccessCard() {
        return new Promise(async (resolve, reject) => {
            const sayonara = await toBeContinue(resolve);
            if (sayonara) return;

            const app = await findTargetVue();
            const prop1 = moonLightLibrary.fluorescenceFlow('nigoLsi.res');
            const prop2 = moonLightLibrary.fluorescenceFlow('nigoLsi');

            await delay(1000);
            const find1 = findVueComponentByPropPath(app, prop1, { findAll: true });
            const find2 = findVueComponentByPropPath(app, prop2, { findAll: true });
            const components = [...new Set([...find1, ...find2])];

            if (components.length < 1) return reject('没偷到...');

            rope.isLoginArr = components;
            return resolve('偷到了！');
        });
    }


    // 偷暗交物资
    function molePilferStash() {
        return new Promise(async (resolve, reject) => {
            const sayonara = await toBeContinue(resolve);
            if (sayonara) return;

            const targetContentSet = [new Set(['Login(', 'login('])];

            stealCovertAwaitGoods({
                contentSet: targetContentSet,
                once: false,
                onStolen: () => {
                    resolve('偷到了！');
                    return null; // 偷
                },
                onUnstolen: () => reject('没偷到...')
            });
        });
    }


    // ------------------


    // 伪装身份 pL
    function useDisguiseIdentity() {
        return new Promise(async (resolve, reject) => {
            let used = false;
            const nl = moonLightLibrary.fluorescenceFlow('nigoLsi'),
                hwtc = moonLightLibrary.fluorescenceFlow('hctaWlairTgn'),
                rus = moonLightLibrary.fluorescenceFlow('resUrepuS'),
                tta = moonLightLibrary.fluorescenceFlow('tseTbA'),
                ngn = moonLightLibrary.fluorescenceFlow('noisrev_golaid_n'),
                tyrv = moonLightLibrary.fluorescenceFlow('TSAOT_YALP_REYA'),
                hst = moonLightLibrary.fluorescenceFlow('hctiwSlairT'),
                yqt = moonLightLibrary.fluorescenceFlow('ytilauQlairT');

            used = setValue(pilferLoot?.user, nl, true)
                && setValue(pilferLoot?.user, hwtc, false)
                && setValue(pilferLoot?.user, rus, true);
            unsafeWindow[tta][ngn] = tyrv;
            used &&= unsafeWindow[tta][ngn] === tyrv;
            pilferLoot?.quality?.setState({ [yqt]: true, [hst]: true });

            return used ? resolve('伪装成功！') : reject('被识破了...');
        });
    }


    // 使用门卡
    function useAccessCardInVue() {
        return new Promise(async (resolve, reject) => {
            const isLoginArr = rope?.isLoginArr;
            const prop1 = moonLightLibrary.fluorescenceFlow('nigoLsi.res');
            const prop2 = moonLightLibrary.fluorescenceFlow('nigoLsi');
            let used = false;

            if (!isLoginArr || isLoginArr.length < 1) return reject('没有门卡');
            if (isLoginArr[0][prop1] || isLoginArr[0][prop2]) return await toBeContinue(resolve);

            for (const comp of isLoginArr) {
                used = setValue(comp, prop1, true)
                    || setValue(comp, prop2, true);
            };
            if (used) doGlibTalk('🪢暗暗钩索带你躲避了催登者的追缉🪢');
            return used ? resolve('通过 ！') : reject('门卡失效...');
        });
    }


    //-----------------


    // 暗箱操作 pL
    function doBehindScenesRig() {
        return new Promise(async (resolve, reject) => {
            const tlqs = moonLightLibrary.fluorescenceFlow('tsiLytilauQdetroppuS'),
                yqu = moonLightLibrary.fluorescenceFlow('ytilauQtseuqe'),
                hst = moonLightLibrary.fluorescenceFlow('hctiwSlairT'),
                erx = moonLightLibrary.fluorescenceFlow('eliforp_reyalp_x'),
                gqy = moonLightLibrary.fluorescenceFlow('ytilauQteg');

            const hqv = () => {
                let q = getValueFromLocalStorage(erx, 'media.quality');
                q = q || pilferLoot?.port[tlqs]()?.[0];
                return q;
            }

            const newQ = hqv();
            if (pilferLoot?.quality[gqy]().nowQ != newQ) {
                pilferLoot?.quality[yqu](hqv()).then((function () {
                    pilferLoot?.quality?.setState({ [hst]: false });
                }
                )).catch((function () {
                    return reject('糟糕..搞砸了...');
                }));
            }
            return resolve('这东西真的管用么？');
        });
    }


})();
