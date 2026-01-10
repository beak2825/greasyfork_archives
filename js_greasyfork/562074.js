// ==UserScript==
// @name         pornhub-download-plugin
// @namespace    http://tampermonkey.net/
// @version      2026-01-02
// @description  Tiny pornhub downloader. Support m3u8 download or obtain video original link
// @author       SHANGDISHIGE109
// @source       https://github.com/SHANGDISHIGE109/pornhub-download-plugin
// @supportURL   https://github.com/SHANGDISHIGE109/pornhub-download-plugin/issues
// @license      MIT
// @match        https://*.pornhub.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pornhub.com
// @connect      phncdn.com
// @connect      pornhub.com
// @require      https://cdn.jsdelivr.net/npm/m3u8-parser@7.2.0/dist/m3u8-parser.min.js#sha256-b0UnNfUxCTHxPainxyZIaLqrjH+nnZMYLObCgQwrTlg=
// @require      https://cdn.jsdelivr.net/npm/mux.js@6.3.0/dist/mux.min.js#sha256-lMxLtY4muW6RYL2f1/4O6uFx8P+4AIblcPiZHh8hD/o=
// @resource     mediabunny https://cdn.jsdelivr.net/npm/mediabunny@1.15.1/dist/bundles/mediabunny.min.mjs#sha256-GeTAIUvoAkGQtpk0gDOqkrlT+wXXQesKCj8uJK3+DpA=
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @run-at       document-end

// @downloadURL https://update.greasyfork.org/scripts/562074/pornhub-download-plugin.user.js
// @updateURL https://update.greasyfork.org/scripts/562074/pornhub-download-plugin.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ========================= class ==============================

    class StateMachine {
        constructor(statePicky, triggerPicky) {
            this._context = {};
            this._tulpe = [];
            this._stateTable = Object.freeze(statePicky);
            this._triggerTable = Object.freeze(triggerPicky);
        }

        validState(state) {
            for (const key in this._stateTable) {
                if (this._stateTable[key] === state) {
                    return key;
                }
            }
            return undefined;
        }

        validTrigger(trigger) {
            for (const key in this._triggerTable) {
                if (this._triggerTable[key] === trigger) {
                    return key;
                }
            }
            return undefined;
        }

        configure(from) {
            if (this.validState(from) == undefined) {
                throw new Error('unsupport state ' + from);
            }
            const exist = this._tulpe.find(item => item._from == from);
            if (exist) {
                return exist;
            }
            const stateConfigure = new Object({
                _from: from,
                _onEntry: () => {},
                _onExit: () => {},
                _action: () => {},
                _permits: [],
                _machine: this,
            });
            stateConfigure.onEntry = function(handle) {
                this._onEntry = handle;
                return this;
            };
            stateConfigure.onExit = function(handle) {
                this._onExit = handle;
                return this;
            };
            stateConfigure.action = function(handle) {
                this._action = handle;
                return this;
            };
            stateConfigure.permit = function(sign, to) {
                if (this._machine.validTrigger(sign) == undefined || this._machine.validState(to) == undefined) {
                    throw new Error('unsupport trigger or state');
                }
                let p = this._permits.find(item => item._sign == sign);
                if (p) {
                    p._to = to;
                } else {
                    this._permits.push({ _sign: sign, _to: to });
                }
                return this;
            };
            stateConfigure.equals = function(configure) {
                return this._from == configure._from;
            };

            this._tulpe.push(stateConfigure);
            return stateConfigure;
        }
        
        setContext(key, value) {
            this._context[key] = value;
            return this;
        }

        getContext(key) {
            return this._context[key];
        }

        init(state) {
            if (this._state != undefined) {
                throw new Error('already init');
            }
            if (this.validState(state) == undefined) {
                throw new Error('unsupport state ' + state);
            }
            this._state = state;
        }

        fire(sign) {
            const from = this._tulpe.find(c => c._from == this._state);
            if (!from) {
                console.warn('no configure from', from);
                return;
            }
            const permit = from._permits.find(e => e._sign == sign);
            if (!permit) {
                console.warn('no permit', sign);
                return;
            }
            from._onExit(this);
            this._state = permit._to;
            const to = this._tulpe.find(c => c._from == permit._to);
            if (to) {
                to._onEntry(this);
                to._action(this);
            }
        }
    }

    class ParallelDownloader {
        constructor(coreSize, urls, requestFactory) { 
            /**
             * @param {number} coreSize concurrent download nums
             * @param {string[]} urls url list
             * @param {object} requestFactory request factory object that must contain fetch and abort methods
             *    - fetch(string, AbortController): async method that receives a url as parameter and returns a Promise
             */
            if (coreSize <= 0) throw new Error('coreSize must be greater than 0');
            if (urls.length <= 0) throw new Error('urls must be greater than 0');
            this.coreSize = coreSize;
            this.urls = Array.from(urls);
            this.opened = Array.from(Array(urls.length).keys()); // 待下载的urls的索引
            this.proceessing = new Set(); // 正在下载的urls的索引（用于应对快速play和pause切换）
            this.closed = []; // 已完成的urls的索引
            this.outcomes = new Array(urls.length); // 存放下载结果，索引顺序与urls一致
            this.requestFactory = requestFactory;

            this.workers = new Set(); // worker对象集合

            /**
             * 回调函数, 使用on函数绑定
             * @param progress speedMonitor更新下载进度时，调用一次
             * @param piece 每完成一次下载，调用一次
             * @param done 所有任务完成时调用一次
             * @param error 任务出错时调用一次
             */
            this.callcallback = {
                progress: (speedWithUnit, compeleted, percentage, totalBytesLengthDownloaded)=>{},
                piece: (index, url, bytes)=>{},
                error: (index, url, error)=>{},
                done: (wholeBytesArray)=>{}
            };

            /* 中断标识 */
            this.interrupted = {
                sign: new AbortController(),
                val: false,
                error: undefined,
                trigger: undefined,
                version: -1, // 用于应对快速play和pause切换，在无间隔的多次交叉调用play和pause时会出现ABA问题
            };

            // 速度、进度监控器
            this.speedMonitor = this.createSpeedMonitor();

            // 状态机的状态和触发器
            this.DownloaderState = {
                IDLE: 0, // 空闲 - 初始状态
                DOWNLOADING: 1, // 正在下载中 - 中间状态
                PAUSE_MANUAL: 2, // 手动暂停下载 - 中间状态
                PAUSE_ON_ERR: 3, // 错误导致暂停下载 - 中间状态
                TERMINATED: 4, // 停止下载 - 最终状态
                SUCCESSFLY: 5, // 下载完成 - 最终状态
            };
            this.DownloaderTrigger = { 
                PLAY: 1, // 启动下载
                DOWNLOAD_FALIURE: 2, // 下载失败导致的暂停
                PAUSE: 3, // 暂停下载
                CANCEL: 4, // 取消下载
                COMPLETION: 5 // 全部下载完成
            };
            // 状态机
            this.StateMachine = this.createStateMachine();
        }

        createSpeedMonitor() {
            const { urls, closed, callcallback } = this;

            const range = 5000, step = 500;
            const windowSeconds = Math.ceil(range / 1000);
            const speedMonitor = new Object({
                units: ['B/s', 'KB/s', 'MB/s', 'GB/s', 'TB/s'],
                buckets: Array.from({length: Math.ceil(range / step)}, () => 0),
                currentPositon: 0,
                earlyPosition: 1,
                totalBytesDownloaded: 0,
                percentage: '0%',
                total: urls.length,
                current: 0,
                timerId: undefined,
            });
            speedMonitor.downloadSpeedTimer = function () { 
                let curBytes = this.totalBytesDownloaded;
                this.buckets[this.currentPositon] = curBytes;
                let byteSpeed = (this.buckets[this.currentPositon] - this.buckets[this.earlyPosition]) / windowSeconds;
                this.currentPositon = (this.currentPositon + 1) % this.buckets.length;
                this.earlyPosition = (this.earlyPosition + 1) % this.buckets.length;
                callcallback.progress?.(this.fmt(byteSpeed), closed.length, this.percentage, this.totalBytesDownloaded);
            };
            speedMonitor.fmt = function (bytesLength) { 
                if (bytesLength == 0) {
                    return '0' + this.units[0];
                }
                let power = Math.trunc(Math.log2(bytesLength) / 10);
                let unit = this.units[power];
                return (bytesLength / Math.pow(1024, power)).toFixed(2) + unit;
            };
            speedMonitor.update = function (bytes) { 
                this.current++;
                this.percentage = (closed.length / urls.length * 100).toFixed(2) + '%';
                this.totalBytesDownloaded += bytes.byteLength;
            };
            speedMonitor.start = function () { 
                this.buckets.fill(0);
                this.currentPositon = 0;
                this.earlyPosition = 1;
                this.totalBytesDownloaded = 0;
                this.timerId = setInterval(() => this.downloadSpeedTimer(), step);
            };
            speedMonitor.stop = function () { 
                clearInterval(this.timerId);
                this.timerId = undefined;
                // 触发一次下载速度计算，让显示速度归零
                this.buckets.fill(0);
                this.currentPositon = 0;
                this.earlyPosition = 1;
                this.totalBytesDownloaded = 0;
                this.downloadSpeedTimer();
            };

            return speedMonitor;
        }

        createStateMachine() {
            const { DownloaderState, DownloaderTrigger } = this;
            const { coreSize, opened, proceessing, outcomes, workers, interrupted } = this;
            const { callcallback, speedMonitor } = this;
            const getTask = this.getTask.bind(this);
            const addWorker = this.addWorker.bind(this);
            const destory = this.destory.bind(this);

            const sm = new StateMachine(DownloaderState, DownloaderTrigger);
            sm.init(DownloaderState.IDLE);
            sm.configure(DownloaderState.IDLE)
                .permit(DownloaderTrigger.PLAY, DownloaderState.DOWNLOADING)
                .permit(DownloaderTrigger.CANCEL, DownloaderState.TERMINATED);
            sm.configure(DownloaderState.DOWNLOADING)
                .onEntry(()=>{
                    interrupted.version++;
                    interrupted.sign = new AbortController();
                    interrupted.val = false;
                    interrupted.error = undefined;
                    interrupted.trigger = undefined;
                    while (workers.size < coreSize) {
                        let first = getTask();
                        if (first != undefined) {
                            addWorker(first);
                        }else {
                            break;
                        }
                    }
                    // console.log('started downloading -  current workers: ', workers.size);
                })
                .action(()=> {
                    // 速度监控
                    speedMonitor.start();
                })
                .onExit(()=>{
                    // 停止速度监控，并触发一次下载速度计算，让显示速度归零
                    speedMonitor.stop();
                })
                .permit(DownloaderTrigger.DOWNLOAD_FALIURE, DownloaderState.PAUSE_ON_ERR)
                .permit(DownloaderTrigger.PAUSE, DownloaderState.PAUSE_MANUAL)
                .permit(DownloaderTrigger.CANCEL, DownloaderState.TERMINATED)
                .permit(DownloaderTrigger.COMPLETION, DownloaderState.SUCCESSFLY);
            sm.configure(DownloaderState.PAUSE_ON_ERR)
                .action(()=> {
                    callcallback.error?.(interrupted.error);
                })
                .permit(DownloaderTrigger.PLAY, DownloaderState.DOWNLOADING)
                .permit(DownloaderTrigger.CANCEL, DownloaderState.TERMINATED);
            sm.configure(DownloaderState.PAUSE_MANUAL)
                .onEntry(()=>{
                    /**
                     * 为了应对快速play和pause切换，需要在此处手动将所有资源回滚到初始状态
                     */
                    workers.clear();
                    proceessing.forEach(index=>opened.push(index));
                    proceessing.clear();
                    interrupted.val = true; // 阻断worker重复发出中断
                    interrupted.sign.abort(); // 中断所有fetch
                })
                .permit(DownloaderTrigger.PLAY, DownloaderState.DOWNLOADING)
                .permit(DownloaderTrigger.CANCEL, DownloaderState.TERMINATED);
            sm.configure(DownloaderState.SUCCESSFLY)
                .onEntry(()=>{
                    // 停止速度监控，并触发一次下载速度计算，让显示速度归零
                    speedMonitor.stop();
                })
                .action(()=> {
                    callcallback.done?.(outcomes);
                });
            sm.configure(DownloaderState.TERMINATED)
                .onEntry(()=>destory());
            
            return sm;
        }

        /* 获取一个url索引 */
        getTask() {
            const index = this.opened.shift();
            if (index != undefined) {
                this.proceessing.add(index);
            }
            return index;
        }

        /* 放回未完成的url */
        putbackTask(index) {
            if (this.proceessing.delete(index)) {
                this.opened.push(index);
            }
        }

        /* 完成一个url的下载时调用 */
        finishPiece(index, url, bytes) {
            this.outcomes[index] = bytes;
            this.closed.push(index);
            this.proceessing.delete(index);
            this.speedMonitor.update(bytes);
            this.callcallback.piece?.(index, url, bytes);
        }

        /* 是否全部url都下载完成 */
        isAllDownloadComplete() {
            return this.closed.length >0 && this.closed.length == this.urls.length;
        }

        addWorker(first) {
            const { urls, workers, interrupted, DownloaderTrigger, StateMachine, requestFactory } = this;
            const { version:currentVersion, sign:abort } = interrupted;
            const isCompleted = this.isAllDownloadComplete.bind(this);
            const getTask = this.getTask.bind(this);
            const finishPiece = this.finishPiece.bind(this);
            const putbackTask = this.putbackTask.bind(this);

            const worker = {
                id: (Date.now() + Math.round(Math.random() * 100000)).toString(16),
                version: currentVersion,
                abort: abort,
                compeletedTask: 0,
                async runWorker() {
                    let index = first;
                    first = undefined;
                    while (index != undefined || (index = getTask()) != undefined) {
                        // console.log(`worker-${worker.id} start ${index}`);
                        try{
                            const resp = await requestFactory.fetch(urls[index], this.abort);
                            finishPiece(index, urls[index], resp);
                            this.compeletedTask++;
                        }catch (error) { 
                            console.error(`worker-${worker.id} error: ${error}`);
                            // 检测版本号
                            if (currentVersion != interrupted.version) {
                                break;
                            }
                            putbackTask(index);
                            // 第一个发现中断的worker
                            if (interrupted.val == false) {
                                if (error.name != 'AbortError') {
                                    interrupted.error = error.message;
                                    interrupted.trigger = DownloaderTrigger.DOWNLOAD_FALIURE;
                                }
                            }
                            interrupted.val = true; // 阻断后续worker重复发出中断
                            abort.abort(); // 中断所有fetch
                            break;
                        }finally {
                            index = undefined;
                        }
                    }

                    workers.delete(this);
                    // console.log(`🚩🚩🚩🚩🚩worker-${this.id} dequeue. currentVersion=${this.version}, interrupted.version=${interrupted.version}, compeletedTask=${this.compeletedTask}`);
                    if (currentVersion != interrupted.version) {
                        return;
                    }
                    // console.log(`  🚩🚩🚩🚩trigger=${interrupted.trigger}, isCompleted=${isCompleted()}`);
                    // interrupted.trigger == undefined表示正常结束。
                    if (interrupted.trigger == undefined && isCompleted()) {
                        interrupted.trigger = DownloaderTrigger.COMPLETION;
                    }
                    // 只有最后一个worker才能触发状态转换（手动暂停不在此处触发）
                    if (interrupted.trigger != undefined && workers.size == 0) {
                        StateMachine.fire(interrupted.trigger);
                    }
                }
            };
            workers.add(worker);
            // console.log(`worker-${worker.id} enqueue`);
            worker.runWorker();
        }

        // 销毁下载器
        destory() {
            // 防止worker触发状态转换
            this.interrupted.val = true; // 阻断后续worker重复发出中断
            this.interrupted.trigger = undefined;
            this.urls.length = 0;
            this.opened.length = 0;
            this.closed.length = 0;
            this.outcomes.length = 0;
            this.interrupted.sign.abort();
            clearInterval(this.speedMonitor.timerId);
            this.speedMonitor.timerId = undefined;
        }

        /**
         * 绑定下载器事件回调函数
         * @param {string} event - 事件类型，具体查看callcallback
         * @param {function} callback - 对应事件的回调函数
         */
        on(event, callback) {
            this.callcallback[event] = callback;
        }

        /**
         * 启动下载
         */
        play() {
            this.StateMachine.fire(this.DownloaderTrigger.PLAY);
        }

        /**
         * 暂停下载
         */
        pause() {
            this.StateMachine.fire(this.DownloaderTrigger.PAUSE);
        }

        /**
         * 取消下载
         */
        cancel() {
            this.StateMachine.fire(this.DownloaderTrigger.CANCEL);
        }
    }


    // ========================= html ==============================

    function setVisible(obj) {
        if (obj instanceof HTMLElement) {
            obj.classList.remove('hidden');
        }else if(typeof obj === 'string') {
            let id = obj.startsWith('.')?obj:'.'+obj;
            const compent = document.querySelector(id);
            if (!compent) return;
            compent.classList.remove('hidden');
        }
    }

    function setHidden(obj) {
        if (obj instanceof HTMLElement) {
            obj.classList.add('hidden');
        }else if (typeof obj === 'string') {
            let id = obj.startsWith('.')?obj:'.'+obj;
            const compent = document.querySelector(id);
            if (!compent) return;
            compent.classList.add('hidden');
        }
    }

    function disable(obj) {
        if (obj instanceof HTMLElement) {
            obj.setAttribute('disabled', '');
        }else if (typeof obj === 'string') {
            let id = obj.startsWith('.')?obj:'.'+obj;
            const compent = document.querySelector(id);
            if (!compent) return;
            compent.setAttribute('disabled', '');
        }
    }

    function enable(obj) {
        if (obj instanceof HTMLElement) {
            obj.removeAttribute('disabled');
        }else if (typeof obj === 'string') {
            let id = obj.startsWith('.')?obj:'.'+obj;
            const compent = document.querySelector(id);
            if (!compent) return;
            compent.removeAttribute('disabled');
        }
    }

    function startSpin(id) {
        id = id.startsWith('.')?id:'.' + id;
        const compent = document.querySelector(id);
        if (!compent) return;
        compent.classList.add('loading-icon');
        compent.classList.remove('hidden');
    }

    function stopSpin(id) {
        id = id.startsWith('.')?id:'.' + id;
        const compent = document.querySelector(id);
        if (!compent) return;
        compent.classList.remove('loading-icon');
        compent.classList.add('hidden');
    }

    function addDownloadBtn() {
        const userRow = document.querySelector(".video-info-row.userRow");

        const downloadDiv = `
            <div class="${PH_DOWNLOAD_DIV_ID}">
                <button class="${PH_DOWNLOAD_BUTTON_ID}" type="button">
                    <!--<i class="fi fi-rr-download ph-icon-download"></i>-->
                    <i class="ph-icon-cloud-download"></i>
                    <i class="ph-icon-reset hidden"></i>
                    <span class="${PH_BUTTON_LABEL_ID}">Download</span>
                </button>
            </div>
        `;
        userRow.insertAdjacentHTML('beforeend', downloadDiv);

        // add download button click event
        const button = document.querySelector(`.${PH_DOWNLOAD_BUTTON_ID}`);
        button.addEventListener('click', () => {
            // console.log('fetch m3u8 content');
            startSpin(`.${PH_DOWNLOAD_BUTTON_ID} i.ph-icon-reset`);
            setHidden(`.${PH_DOWNLOAD_BUTTON_ID} i.ph-icon-cloud-download`);
            disable(`.${PH_DOWNLOAD_BUTTON_ID}`);
            // download all m3u8 and direct links
            Promise.all([
                getAllDirectLinks(),
                getAllM3U8()
            ]).then(([direct, m3u8])=>{
                // display file size in the download bar
                const barRow = document.querySelector(`.${PH_DOWNLOAD_BARROW_ID}`);
                for (let i = 0; i < barRow.children.length; i++) {
                    const item = barRow.children[i];
                    const definition = VIDEO_DEFINITIONS.find(d=>d.height == item.getAttribute('data-resolution'));
                    if (definition) {
                        const m3u8Btn = document.querySelector(`${getFullClassName(item)} > button.m3u8`);
                        m3u8Btn.innerText = `${m3u8Btn.innerText} [${definition.m3u8Datas.size.human_size}]`;
                    }
                }
                setVisible(`.${PH_DOWNLOAD_BARROW_ID}`);
            }).finally(()=>{
                stopSpin(`.${PH_DOWNLOAD_BUTTON_ID} i.ph-icon-reset`);
                setVisible(`.${PH_DOWNLOAD_BUTTON_ID} i.ph-icon-cloud-download`);
                enable(`.${PH_DOWNLOAD_BUTTON_ID}`);
            });
        });

        // console.log('Download button added');
    }

    function addDownloadBtnStyle() {
        const subscribeDiv = document.querySelector('.userActions');
        let btnFullScreenRight = '225px';
        let btnWindowScreenRight = '150px';
        let btnBackgroundStyle = '';
        let btnWindowScreenWidthStyle = '';

        // Special cases with additional buttons (non-subscription buttons)
        // Overlay the download button over the externalLinkButton when window screen
        if (subscribeDiv.childElementCount > 1) {
            btnBackgroundStyle = 'background: #000000;';

            // subscribeBtn
            const subscribeBtn = document.querySelector('.userActions > .subscribeButton.videoSubscribeButton.js_videoSubscribeButton.js-show-subscribe-btn.updatedStyledBtn.loggedOut');
            
            let externalLinkButtonDiv = subscribeDiv.children[0];
            if (externalLinkButtonDiv.className == 'subscribeButton videoSubscribeButton' 
                && externalLinkButtonDiv.children[0].getAttribute('data-label') == 'join_now') {
                // Raw rendering of case-1: |      Join Now     | subscribe |
                // Raw rendering of case-2: | Join BangBros Now | subscribe |
                // Get the width of the  | Join Now |  OR  | Join xxx Now |
                // console.log('external link button is join_now');
                let joinNowBtnWidth = externalLinkButtonDiv.getBoundingClientRect().width;
                btnWindowScreenWidthStyle = `width: ${joinNowBtnWidth}px`;
                btnWindowScreenRight = '150px';
                btnFullScreenRight = '450px';
            }else if (externalLinkButtonDiv.nodeName == 'A' && externalLinkButtonDiv.href.indexOf('www.fanhub.com') != -1) {
                // Raw rendering of buttons: | More of Me | subscribe |
                // console.log('external link button is more_of_me');
                btnFullScreenRight = '375px';
                btnWindowScreenWidthStyle = 'width: 145px;';
            }else if(subscribeBtn.offsetLeft == 10) {
                // Raw rendering of buttons: | subscribe | Join me on FANCENTRO |
                // console.log('external link button is join_me_on_FANCENTRO');
                btnFullScreenRight = '460px';
                btnWindowScreenRight = '0px';
                btnWindowScreenWidthStyle = 'width: 230.9px;';
            }else {
                console.warn('external link button is unknown', externalLinkButtonDiv);
            }
        }

        const cssText = `
            .${PH_DOWNLOAD_DIV_ID} {
                vertical-align: middle;
                position: absolute;
                display: flex;
                top: 13px;
                margin-top: auto;
                right: ${btnFullScreenRight};
                ${btnBackgroundStyle}
            }
            @media only screen and (max-width: 1349px) {
                .${PH_DOWNLOAD_DIV_ID} {
                    right: ${btnWindowScreenRight};
                }
                .${PH_DOWNLOAD_BUTTON_ID} {
                    ${btnWindowScreenWidthStyle}
                }
            }

            .${PH_DOWNLOAD_BUTTON_ID} {
                font-size: 14px;
                color: #c6c6c6;
                text-align: center;
                border: 1px solid #c6c6c6;
                min-width: 145px;
                padding: 0;
                border-radius: 3px;
                -moz-border-radius: 3px;
                -webkit-border-radius: 3px;
                -ms-border-radius: 3px;
                -o-border-radius: 3px;
                background-color: transparent;
                font-style: normal;
                font-weight: 700;
                line-height: 42.6px;
                box-sizing: border-box;
                cursor: pointer;
                float: left;
                vertical-align: middle;
                margin-left: 0;
                margin-right: 0;
            }

            .${PH_DOWNLOAD_BUTTON_ID}:not(:disabled):hover {
                border: 1px solid #ff9900;
            }

            .${PH_DOWNLOAD_BUTTON_ID}:disabled {
                border: 1px solid #585858;
                cursor: default;
            }

            .${PH_DOWNLOAD_BUTTON_ID}:disabled i {
                cursor: default;
            }

            .${PH_DOWNLOAD_BUTTON_ID} i {
                font-size: 20px;
                width: auto;
                height: auto;
                margin-right: 0;
                background: 0 0;
                vertical-align: middle;
            }
            .${PH_DOWNLOAD_BUTTON_ID} span {
                line-height: normal;
                margin-left: 4px;
            }

        `;
        const styleSheet = document.createElement('style');
        styleSheet.appendChild(document.createTextNode(cssText));
        document.head.appendChild(styleSheet);
    }

    function addProgressBarRow() {
        addAllMideaDownloadItems();
    }

    function addLoadingAnime() {
        const cssText = `
            @keyframes spin-pause {
                0%   { transform: rotate(360deg); }
                66.7% { transform: rotate(0deg); }
                100% { transform: rotate(0deg); }
            }

            .loading-icon {
                display: inline-block;
                animation: spin-pause 1.5s linear infinite;
            }
        `;
        const styleSheet = document.createElement('style');
        styleSheet.appendChild(document.createTextNode(cssText));
        document.head.appendChild(styleSheet);
    }

    function addCommonBarRowStyle() {
        const cssText = `
            .${PH_DOWNLOAD_BARROW_ID} {
                position: relative;
                width: 100%;
                box-sizing: border-box;
                margin-top: 9px;
                border: 1px solid #1b1b1b;
                border-radius: 3px;
                cursor: default;
            }

            .${PH_DOWNLOAD_MIDEA_ITEM_ID} {
                box-sizing: border-box;
                position: relative;
                display: flex;
                gap: 0;
                margin: 4px;
            }
            .${PH_DOWNLOAD_MIDEA_ITEM_ID} > * {
                grid-area: 1 / 1;
                width: 100%;
                height: 50px;
            }

            .${PH_DOWNLOAD_MEDIA_BTN_ID} {
                border-radius: 4px;
                -moz-border-radius: 4px;
                -webkit-border-radius: 4px;
                -ms-border-radius: 8px;
                -o-border-radius: 8px;
                background: #1b1b1b;
                font-weight: 800;
                font-size: 18px;
                color: #fff;
                text-transform: capitalize;
                white-space: nowrap;
                border: 0;
                cursor: pointer;
                box-sizing: border-box;
            }
            .${PH_DOWNLOAD_MEDIA_BTN_ID}:hover {
                background: #2f2f2f;
            }
            .${PH_DOWNLOAD_MEDIA_BTN_ID}.m3u8 {
                flex: 1;
            }
            .${PH_DOWNLOAD_MEDIA_BTN_ID}.direct {
                width: 60px;
                flex-shrink: 0;
                margin-left: 5px;
                z-index: 99;
            }

            .${PH_PROGRESS_BAR_CONTEXT_ID} {
                display: flex;
                line-height: 20px;
                text-align: center;
                box-sizing: border-box;
                align-items: center;
                flex: 1;
            }

            .${PH_PROGRESS_BAR_ID} {
                position: relative;
                background-color: #464646;
                float: left;
                display: flex;
                flex: 1 1 0;
                height: 100%;
                box-sizing: border-box;
                border-radius: 3px;
            }
            .${PH_PROGRESS_BAR_ID} span {
                background-color: #4f86e2;
                height: 100%;
                width: 0%;
                display: block;
                border-radius: 3px;
            }

            .${PH_PROGRESS_BAR_CONTEXT_ID} :not(span) {
                position: absolute;
                height: 35px;
                width: 35px;
                line-height: 35px;
                border-radius: 4px;
                opacity: 1;
            }

            /* label */
            .${PH_PROGRESS_BAR_CONTEXT_ID} .label {
                cursor: unset;
                width: fit-content;
                font-weight: 300;
                font-size: 16px;
                font-family: inherit;
                color: #ffffff;
            }
            .${PH_BAR_SPEED_LABEL_ID} {
                margin-left: 10px;
            }
            .${PH_BAR_DOWNLOADED_BYTES_LABEL_ID} {
                margin-left: 115px;
            }
            .${PH_BAR_COUNTDOWN_TIMER_LABEL_ID} {
                border-radius: 4px 0px 0px 4px;
                color: #c4c22c !important;
                font-weight: 600 !important;
                position: absolute;
                padding-left: 5px;
                height: 35px;
                line-height: 35px;
                right: 130px;
            }

            /* ctrl context */
            .${PH_PROGRESS_CTRL_BTN_CONTEXT_ID} {
                width: 100% !important;
                height: 100% !important;
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 30px;

                z-index: -99;
                opacity: 0 !important;
                transition: all 0.3s ease-in-out;
            }
            .${PH_PROGRESS_BAR_CONTEXT_ID}:hover .${PH_PROGRESS_CTRL_BTN_CONTEXT_ID} {
                opacity: 1 !important;
                z-index: 99;
            }
            .${PH_PROGRESS_BAR_CONTEXT_ID}:hover .${PH_PROGRESS_CTRL_BTN_CONTEXT_ID} button {
                transform: translateY(0);
                position: relative;
            }
            .${PH_PROGRESS_CTRL_BTN_CONTEXT_ID} button {
                transform: translateY(5px);
                position: relative;
                transition: opacity 0.3s ease, transform 0.3s ease;
            }


            .${PH_PROGRESS_BAR_CONTEXT_ID}::before {
                content: '';
                position: absolute;
                inset: 0;
                background: inherit;
                filter: blur(7px) brightness(0.9);
                z-index: 0;
                transition: filter .3s ease;
            }
            .${PH_PROGRESS_BAR_CONTEXT_ID}:hover::before {
                filter: blur(18px) brightness(0.9);
            }
            .${PH_PROGRESS_BAR_CONTEXT_ID}:hover .${PH_BAR_SPEED_LABEL_ID},
            .${PH_PROGRESS_BAR_CONTEXT_ID}:hover .${PH_BAR_DOWNLOADED_BYTES_LABEL_ID},
            .${PH_PROGRESS_BAR_CONTEXT_ID}:hover .${PH_BAR_COUNTDOWN_TIMER_LABEL_ID} {
                filter: blur(7px);
                transition: filter .3s ease;
            }


            /* ctrl btn */
            .${PH_PROGRESS_CTRL_BTN_ID} {
                box-sizing: border-box;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                text-align: center;
                border: 1px solid transparent;
                border-radius: 4px;
                -moz-border-radius: 4px;
                -webkit-border-radius: 4px;
                -ms-border-radius: 4px;
                -o-border-radius: 4px;
                cursor: pointer;
                vertical-align: middle;
                background-color: #272727;
            }
            .${PH_PROGRESS_CTRL_BTN_ID}:disabled {
                background-color: #666666;
                pointer-events: none;
                cursor: unset;
            }
            .${PH_PROGRESS_CTRL_BTN_ID}:disabled i {
                color: #888888;
            }
            .${PH_PROGRESS_CTRL_BTN_ID}:not(:disabled) {
                cursor: pointer;
            }
            .${PH_PROGRESS_CTRL_BTN_ID}:not(:disabled):hover {
                background: #373737;
            }
            .${PH_PROGRESS_CTRL_BTN_ID}:not(:disabled):hover i.ph-icon-save-alt {
                color: #25a11a;
            }
            .${PH_PROGRESS_CTRL_BTN_ID}:not(:disabled):hover i.toggle {
                color: #4284ff;
            }
            .${PH_PROGRESS_CTRL_BTN_ID}:not(:disabled):hover i.ph-icon-cross  {
                color: #c62929;
            }

            /* button icon */
            .${PH_PROGRESS_CTRL_BTN_ID} i {
                top: 0px;
                left: 0px;
                /* override website css */
                cursor: unset;
                position: static;
            }
            .${PH_PROGRESS_CTRL_BTN_ID} i.ph-icon-save-alt {
                color: #1A7A11;
            }
            .${PH_PROGRESS_CTRL_BTN_ID} i.toggle {
                color: #2e67d2;
            }
            .${PH_PROGRESS_BAR_CONTEXT_ID} i.ph-icon-cross {
                color: #971616;
            }
        `;
        const styleSheet = document.createElement('style');
        styleSheet.appendChild(document.createTextNode(cssText));
        document.head.appendChild(styleSheet);
    }

    function addAllMideaDownloadItems() {
        let html = `
            <div class="${PH_DOWNLOAD_BARROW_ID} hidden">
        `;
        // {240,480,720,1080,...}
        let resolutions = VIDEO_DEFINITIONS.map(item=>item.height);
        for(const resolution of resolutions) {
            html += `
                <div class="${PH_DOWNLOAD_MIDEA_ITEM_ID} resolution-${resolution}" data-resolution="${resolution}">
                    <button class="${PH_DOWNLOAD_MEDIA_BTN_ID} m3u8-${resolution} m3u8">${resolution}P</button>
                    <div class="${PH_PROGRESS_BAR_CONTEXT_ID} hidden">
                        <span class="${PH_PROGRESS_BAR_ID}" id="${PH_PROGRESS_BAR_ID}">
                            <span></span>
                            <div class=${PH_PROGRESS_CTRL_BTN_CONTEXT_ID}>
                                <button class="${PH_PROGRESS_CTRL_BTN_ID} save hidden" id="save-btn"><i class="ph-icon-save-alt"></i></button>
                                <button class="${PH_PROGRESS_CTRL_BTN_ID} play" id="play-btn" disabled><i class="ph-icon-play toggle"></i></button>
                                <button class="${PH_PROGRESS_CTRL_BTN_ID} pause" id="pause-btn"><i class="ph-icon-pause toggle"></i></button>
                                <button class="${PH_PROGRESS_CTRL_BTN_ID} cancel" id="cancel-btn"><i class="ph-icon-cross"></i></button>
                            </div>
                        </span>
                        <i class="label ${PH_BAR_SPEED_LABEL_ID}">0Byte/s</i>
                        <i class="label ${PH_BAR_DOWNLOADED_BYTES_LABEL_ID}"></i>
                        <span class="label ${PH_BAR_COUNTDOWN_TIMER_LABEL_ID} hidden">
                            cache cleaned after <span>0</span>s
                        </span>
                    </div>
                    <button class="${PH_DOWNLOAD_MEDIA_BTN_ID} direct-${resolution} direct"
                    title="Download the ${resolution}P resolution version of this video directly">
                        <i class="ph-icon-link" style="
                            font-size: x-large;
                            line-height: 50px;
                        "></i>
                    </button>
                </div>
            `;
        }
        html += `</div>`;

        const userRow = document.querySelector(`.video-info-row.userRow`);
        userRow.insertAdjacentHTML('beforeend', html);

        const COLOR_RUN = "#4f86e2", COLOR_PAUSE = "#c27c27", COLOR_FAIL = "#e71717", COLOR_COMPLETE = "#1a7a11";
        const items = document.querySelectorAll(`.${PH_DOWNLOAD_BARROW_ID} > .${PH_DOWNLOAD_MIDEA_ITEM_ID}`);
        for (const item of items) {
            const resolution = item.getAttribute("data-resolution"); // height
            const definition = getVideoDefinitionByHeight(resolution);
            const btn_m3u8 = item.children[0];
            const barContext = item.children[1];
            const btn_direct = item.children[2];
            const trapdoor = barContext.querySelector(`.${PH_PROGRESS_BAR_ID}`).children[0];
            const speedLabel = barContext.querySelector(`.${PH_BAR_SPEED_LABEL_ID}`);
            const byteLabel = barContext.querySelector(`.${PH_BAR_DOWNLOADED_BYTES_LABEL_ID}`);
            const countdownLabel = barContext.querySelector(`.${PH_BAR_COUNTDOWN_TIMER_LABEL_ID}`);
            const saveBtn = barContext.querySelector(`.${PH_PROGRESS_CTRL_BTN_ID}.save`);
            const playBtn = barContext.querySelector(`.${PH_PROGRESS_CTRL_BTN_ID}.play`);
            const pauseBtn = barContext.querySelector(`.${PH_PROGRESS_CTRL_BTN_ID}.pause`);
            const cancelBtn = barContext.querySelector(`.${PH_PROGRESS_CTRL_BTN_ID}.cancel`);
            btn_m3u8.addEventListener("click", function () {
                // m3u8 download
                console.log("start downloaded resolution", resolution);
                setHidden(btn_m3u8);
                setVisible(barContext);
                definition.components.bar.initialize();
                buildDownloader(definition, definition.components.bar);
                definition.components.downloader.play();
            });
            btn_direct.addEventListener("click", function () {
                // @todo direct download
                // Videos still open in new tabs only; direct browser download is not yet available.
                const directDefinition = getDirectVideoDefinitionByHeight(resolution);
                console.log("direct download: ", directDefinition.videoUrl);
                const suffix = directDefinition.videoUrl.split('/')[7].split('?')[0];
                const a = document.createElement('a');
                a.href = directDefinition.videoUrl;
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
                a.download = "[" + VIDEO_UPLOADER + "] " + VIDEO_TITLE + "." + suffix;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            });
            saveBtn.addEventListener("click", function () {
                const bufferArray = definition.videoData;
                const format = definition.videoFormat;
                let suffix = definition.videoUrl.split('/').find(s=>s.endsWith('.mp4'));
                const videoBlob =  new Blob([bufferArray], {type:format});
                const downloadLink = document.createElement('a');
                downloadLink.href = URL.createObjectURL(videoBlob);
                downloadLink.download = "[" + VIDEO_UPLOADER + "] " + VIDEO_TITLE + "." + suffix;
                downloadLink.click();
                URL.revokeObjectURL(downloadLink.href);
                downloadLink.remove();
            });
            playBtn.addEventListener("click", function () {
                definition.components.downloader.play();
                definition.components.bar.resume();
                disable(playBtn);
                enable(pauseBtn);
            });
            pauseBtn.addEventListener("click", function () {
                definition.components.downloader.pause();
                definition.components.bar.pause();
                enable(playBtn);
                disable(pauseBtn);
            });
            cancelBtn.addEventListener("click", function () {
                definition.components.downloader.cancel();
                setVisible(btn_m3u8);
                setHidden(barContext);
            });

            //
            const barComponent = {
                position: 0,
                downloadedByte: 0,
                element: {
                    item: item,
                    bar: barContext,
                    speedLabel: speedLabel,
                    byteLabel: byteLabel,
                    countdownLabel: countdownLabel,
                    saveBtn: saveBtn,
                    playBtn: playBtn,
                    pauseBtn: pauseBtn,
                    cancelBtn: cancelBtn,
                    trapdoor: trapdoor,
                },
                initialize: function() {
                    this.position = 0;
                    this.downloadedByte = 0;
                    this.element.trapdoor.style.width = '0%';
                    this.element.trapdoor.style.backgroundColor = COLOR_RUN;
                    this.element.speedLabel.innerText = '0Byte/s';
                    this.element.byteLabel.innerText = `0/${definition.m3u8Datas.size.human_size}`;
                    this.element.countdownLabel.innerHTML = 'cache cleaned after <span>0</span>s';
                    setHidden(this.element.countdownLabel);
                    setHidden(this.element.saveBtn);
                    enable(this.element.saveBtn);
                    disable(this.element.playBtn);
                    enable(this.element.pauseBtn);
                },
                speed: function (speedText) {
                    this.element.speedLabel.innerText = speedText;
                },
                update: function ({bytes}) {
                    this.position ++;
                    let progressMax = definition.m3u8Datas.indexM3u8.length;
                    let progressPercent = (this.position / progressMax) * 100;

                    this.element.trapdoor.style.width = `${progressPercent}%`;
                    this.element.trapdoor.style.backgroundColor = COLOR_RUN;

                    this.downloadedByte += bytes;
                    let human_size = fmt(this.downloadedByte);
                    this.element.byteLabel.innerText = `${human_size}/${definition.m3u8Datas.size.human_size}`;
                },
                resume: function() {
                    this.element.trapdoor.style.backgroundColor = COLOR_RUN;
                    disable(this.element.playBtn);
                    enable(this.element.pauseBtn);
                },
                pause: function() {
                    this.element.trapdoor.style.backgroundColor = COLOR_PAUSE;
                    enable(this.element.playBtn);
                    disable(this.element.pauseBtn);
                },
                failed: function() {
                    this.element.trapdoor.style.backgroundColor = COLOR_FAIL;
                    enable(this.element.playBtn);
                    disable(this.element.pauseBtn);
                },
                completed: function() {
                    this.position = definition.m3u8Datas.indexM3u8.length;
                    this.element.trapdoor.style.width = '100%';
                    this.element.trapdoor.style.backgroundColor = COLOR_COMPLETE;
                    disable(this.element.playBtn);
                    disable(this.element.pauseBtn);
                    setVisible(this.element.saveBtn);
                    setVisible(this.element.countdownLabel);
                    this.countdown(60);
                },
                countdown: function (seconds) {
                    let remainSec = seconds;
                    const timer = setInterval(() => {
                        remainSec--;
                        this.element.countdownLabel.children[0].innerText = remainSec;
                        if (remainSec <= 0) {
                            disable(this.element.saveBtn);
                            this.element.countdownLabel.innerHTML = 'cache has been cleaned';
                            clearInterval(timer);
                        }
                    }, 1000);
                },
            };

            // binding to definition
            definition.components = {bar: barComponent};
        }

        console.log('all midea items added');
    }

    // ================================= function =========================================

    function getVideoDefinitionByHeight(height) {
        /**
         * Get the video definition by height
         * @param {number} height
         * @return {string}
         */
        return VIDEO_DEFINITIONS.find(definition=>definition.height == height);
    }

    function getDirectVideoDefinitionByHeight(height) {
        /**
         * Get the video definition by height
         * @param {number} height
         * @return {string}
         */
        return DIRECT_VIDEO_DEFINITIONS.mediaDefinitions.find(definition=>definition.height == height);
    }

    function getFullClassName(element) {
        /**
         * Get the full class name of an element
         * @param {HTMLElement} element
         * @returns {string}
         */
        return '.' + Array.from(element.classList).join('.');
    }

    function httpGetText(url, options) {
        return httpGet(url, {responseType: 'text', ...options});
    }

    function httpGetArraybuffer(url, options) {
        return httpGet(url, {responseType: 'arraybuffer', ...options});
    }

    function httpGet(url, options) {
        /**
         * @param {string} url
         * @param {object} options
         *          - {AbortSignal} signal
         *          - {string} responseType
         */
        return new Promise((resolve, reject) => {
            // check if the signal has been aborted
            if (options?.signal?.aborted) {
                reject(new DOMException('the request has been aborted', 'AbortError'));
                return;
            }
            const xhr = GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                responseType: options?.responseType || 'text',
                headers: {
                    'accept': '*/*',
                    'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
                    'priority': 'u=1, i',
                    'sec-ch-ua': '"Chromium";v="136", "Microsoft Edge";v="136", "Not.A/Brand";v="99"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-platform': '"Windows"',
                    'sec-fetch-dest': 'empty',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-site': 'cross-site',
                    'Referer': 'https://www.pornhub.com/',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36 Edg/136.0.0.0',
                },
                onload: function (resp) { 
                    if(resp.status>=200 && resp.status<300){
                        resolve(resp.response);
                        return;
                    }
                    reject(resp);
                },
                onerror: function (resp) { reject(resp); },
                ontimeout: function (resp) { reject(resp); },
                onabort: function (resp) { reject(new DOMException('the request has been aborted', 'AbortError')); },
            });

            if (options?.signal) {
                options.signal.addEventListener('abort', () => {
                    xhr.abort();
                });
            }
        });
    }

    function buildDownloader(definition, barComponent) {
        /**
         * Add item and some methods to control it to the definition
         * @param {object} definition
         * @param {object} barComponent
         * @returns {void}
         */

        const urls = definition.m3u8Datas.indexM3u8.map(d=>d.uri);
        let concurrentNums = 3;
        const complete = function(allSegmengts) {
            Promise.all(allSegmengts)
            .then(segmentDatas=>{
                // console.log('Successful all ts chunks downloaded');
                console.log('save video...');
                let suffix = definition.videoUrl.split('/').find(s=>s.endsWith('.mp4'));
                let filename = "[" + VIDEO_UPLOADER + "] " + VIDEO_TITLE + "." + suffix;
                return saveVideo(segmentDatas, filename);
            }).then(([buffer, format])=>{
                definition.components.downloader.outcomes.length = 0;
                definition.videoData = buffer; // cache video data
                definition.videoFormat = format;
                barComponent.completed();
            });
        };

        const requestFactory = new Object({
            async fetch(url, abortController) {
                return await httpGetArraybuffer(url, {signal: abortController.signal});
            }
        });

        const downloader = new ParallelDownloader(concurrentNums, urls, requestFactory);
        downloader.on('piece', (index, url, bytes)=>{
            barComponent.update({bytes: bytes.byteLength});
        });
        downloader.on('progress', (speedWithUnit, compeleted, percentage, totalBytesLengthDownloaded)=>{
            barComponent.speed(speedWithUnit);
        });
        downloader.on('error', (index, url, error)=>{
            barComponent.failed();
        });
        downloader.on('done', (wholeBytesArray)=>{
            complete(wholeBytesArray);
        });

        // binding to definition
        definition.components.downloader = downloader;
    }

    function saveVideo(segmentDatas, filename) {
        return tsToMp4(segmentDatas)
        .then(mp4=> mediabunnyConversion(mp4))
        .then(([buffer, format])=>{
            const a = document.createElement('a');
            const blob = new Blob([buffer], {type: format});
            const url = URL.createObjectURL(blob);
            a.href = url;
            a.download = filename;
            a.click();
            a.remove();
            URL.revokeObjectURL(a.href);
            return [buffer, format];
        });
    }

    async function tsToMp4(segmentDatas) {
        const init = [];
        const segs = [];
        const transmuxer = new muxjs.mp4.Transmuxer();
        const done = new Promise(resolve => {
            let i = 0;
            transmuxer.on('data', seg => {
                if (seg.initSegment) init[0] = seg.initSegment;
                segs.push(seg.data);
                if (segs.length == segmentDatas.length) {
                    const len = init[0].byteLength + segs.reduce((a, b) => a + b.byteLength, 0);
                    const whole = new Uint8Array(len);
                    let offset = 0;
                    whole.set(init[0], offset);
                    offset += init[0].byteLength;
                    segs.forEach((s) => {
                        whole.set(s, offset);
                        offset += s.byteLength;
                    });
                    transmuxer.off('data');
                    resolve(whole);
                }
            });
        });
        segmentDatas.forEach(seg=>{
            // 每次push后立即flush才能正确的为每个seg生成moof和mdat
            // 如果是在push了所有seg之后才flush只会生成一整个大的mdat
            transmuxer.push(new Uint8Array(seg));
            transmuxer.flush();
        });
        const mp4Bytes = await done;
        return mp4Bytes;
    }

    async function mediabunnyConversion(mp4) {
        const resource = new File([mp4], 'raw.mp4');
        const source = new mediabunny.BlobSource(resource);
        const input = new mediabunny.Input({
            source, 
            formats: [mediabunny.MP4],
        });
        const output = new mediabunny.Output({
            target: new mediabunny.BufferTarget(), 
            format: new mediabunny.Mp4OutputFormat(),
        });

        VIDEO_INFO['published_date']
        const y = VIDEO_INFO['published_date'].slice(0, 4);
        const m = VIDEO_INFO['published_date'].slice(4, 6) - 1;
        const d = VIDEO_INFO['published_date'].slice(6, 8);
        const date = new Date(y, m, d);


        const conversion = await mediabunny.Conversion.init({
            input,
            output,
            // 因为不需要重新编码，所有不设置video和audio参数
            // 只为修复视频duration问题，以及保存视频源链接、参演者和设置视频封面
            tags: (originalTags) => ({
                ...originalTags,
                title: VIDEO_INFO['title'],
                comment: VIDEO_INFO['source'],
                date: date,
                artist: VIDEO_INFO['uploader']['fullname'],
				images: [{
					data: new Uint8Array(VIDEO_INFO['cover_image']),
					mimeType: 'image/jpeg',
					kind: 'coverFront',
					name: 'cover_1',
				}],
                raw: {
                    "uploader": VIDEO_INFO['uploader']['uploader'],
                    "uploaderType": VIDEO_INFO['uploader']['uploaderType'],
                    "actors": VIDEO_INFO['uploader']['actors'].join(','),
                    "source": VIDEO_INFO['source'],
                    "publishedDate": VIDEO_INFO['published_date'],
                    "tags": VIDEO_INFO['tags'],
                    "title": VIDEO_INFO['title']
                }
            }),
        });

        await conversion.execute();
        return [output.target.buffer, output.format.mimeType];
    }

    function parseMasterM3U8(text) {
        /**
         * mater.m3u8 response parse
         */
        const parse = new m3u8Parser.Parser();
        parse.push(text);
        parse.end();
        return parse.manifest.playlists;
    }

    function parseIndexM3U8(text) {
        /**
         * index.m3u8 response parse
         */
        const parse = new m3u8Parser.Parser();
        parse.push(text);
        parse.end();
        return parse.manifest.segments;
    }

    function fmt(bytes) {
        if (bytes == 0) {
            return '0' + UNITS[0];
        }
        let power = Math.trunc(Math.log2(bytes) / 10);
        let unit = UNITS[power];
        return (bytes / Math.pow(1024, power)).toFixed(2) + unit;
    }

    function estimate_size_by_bitrate(bitrate_bps, duration_seconds){
        /**
         * Estimate file size based on bit rate and duration
         * bitrate_bps: bits per second
         * duration_seconds:  video duration (seconds)
         */
        // BANDWIDTH can be seen from master.m3u8
        let sizeBytes = Math.ceil(bitrate_bps * duration_seconds / 8);
        let human_size = fmt(sizeBytes)
        return { size: sizeBytes, human_size: human_size };
    }

    function downloadM3U8(masterM3u8Url) {
        /**
         * m3u8Url: master.m3u8 url.
         *          The content is the link to index.m3u8.
         *          index.m3u8 contains all seg url.
         *
         * The response result of a master.m3u8 has only one index.m3u8 download link
         * Parse the response of m3u8Url Get the url of index.m3u8
         * Parse the response result of index.m3u8 to get the urls of all segs
         */
        let id = Math.floor(Math.random() * 100);
        let m3u8Datas = {};

        // Obtain the public prefix part of master.m3u8, which will be used in index.m3u8.
        // It is also used for all seg urls.
        let position = masterM3u8Url.lastIndexOf('/') + 1;
        const publicPrefix = masterM3u8Url.substring(0, position);

        // download master.m3u8
        const master = httpGetText(masterM3u8Url)
        .then(m3u8Content => {
            m3u8Content = parseMasterM3U8(m3u8Content)[0];
            m3u8Content.uri = publicPrefix + m3u8Content.uri;
            return m3u8Content;
        }).catch((err)=>{
            console.error(id,'Download master.m3u8 failed.\nError: ', err);
            return Promise.reject('fail to download m3u8: master.m3u8 download failed.');
        });

        // download index.m3u8
        const promise = master.then(masterM3u8=>{
            const resp = httpGetText(masterM3u8.uri);
            return Promise.all([masterM3u8, resp]);
        }).then(datas=>{
            let [masterM3u8, m3u8Content] = datas;
            let indexM3u8 = parseIndexM3U8(m3u8Content);
            indexM3u8.forEach(item=>item.uri = publicPrefix + item.uri);
            let totalDuration = indexM3u8.reduce((acc, item)=> acc + item.duration, 0);
            let size = estimate_size_by_bitrate(masterM3u8.attributes.BANDWIDTH, totalDuration);
            Object.assign(m3u8Datas, { masterM3u8, indexM3u8, size });
            return m3u8Datas;
        }).catch((err)=>{
            console.error(id,'Download index.m3u8 failed.\nError: ', err);
            return Promise.reject('fail to download m3u8: index.m3u8 download failed.');
        });

        return { m3u8Datas, promise };
    }

    function getAllM3U8() {
        VIDEO_DEFINITIONS.forEach(d => {
            let { m3u8Datas, promise } = downloadM3U8(d.videoUrl);
            d.m3u8Datas = m3u8Datas;
            d.m3u8Promise = promise;
        });
        return Promise.all(VIDEO_DEFINITIONS.map((def) => def.m3u8Promise))
            .then((datas) => {
            console.log('M3U8 all done.', datas);
            VIDEO_DEFINITIONS.forEach(d=>delete d.m3u8Promise);
            return VIDEO_DEFINITIONS.map(d=>d.m3u8Datas);
        });
    }

    function getAllDirectLinks() {
        return httpGet(DIRECT_VIDEO_DEFINITIONS.main, {responseType: 'json'})
            .then(data=>{
                console.log('getAllDirectLinks', data);
                DIRECT_VIDEO_DEFINITIONS.mediaDefinitions = data;
                return data;
            }).catch(err=>{
                console.error('Failed to obtain video link.', err);
                return Promise.reject('Failed to obtain video link.');
            });
    }

    function getVideoUploader() {
        const uploaderType = document.querySelector('.userInfo > .usernameWrap').getAttribute('data-type');
        let uploader;

        if (uploaderType === 'channel') {
            uploader = document.querySelector('.userInfo > .usernameWrap > a').innerText.trim();
        } else if (uploaderType === 'user') {
            // amateur model 
            uploader = document.querySelector('.userInfo > .usernameWrap > .usernameBadgesWrapper > a').innerText.trim();
        } else {
            console.warn('unknown uploader type:', uploaderType);
            uploader = 'unknown';
        }

        let actors = [];
        let suggestBox = document.querySelector('.js-suggestionsRow > .pornstarsWrapper');
        if (suggestBox) {
            actors = Array.from(suggestBox.children)
                .filter(e=>e.className=='gtm-event-video-underplayer pstar-list-btn')
                .map(e=>e.innerText.trim());
        }

        let fullname = actors.length>0?(uploader + "(" + actors.join(',') + ")"):uploader;

        return { uploaderType, uploader, actors, fullname };
    }

    // download button
    const PH_DOWNLOAD_DIV_ID = 'ph-video-download-div';
    const PH_DOWNLOAD_BUTTON_ID = 'ph-video-download-button';
    const PH_BUTTON_LABEL_ID = 'ph-button-label';

    // progress bar
    const PH_DOWNLOAD_BARROW_ID = 'ph-download-barRow';
    const PH_DOWNLOAD_MIDEA_ITEM_ID = 'ph-video-download-item';
    const PH_DOWNLOAD_MEDIA_BTN_ID = 'ph-video-download-btn';
    const PH_PROGRESS_BAR_CONTEXT_ID = 'ph-progress-bar-context';
    const PH_PROGRESS_BAR_ID = 'ph-progress-bar';
    const PH_PROGRESS_CTRL_BTN_CONTEXT_ID = 'ph-progress-ctrl-btn-context';
    const PH_PROGRESS_CTRL_BTN_ID = 'ph-progress-ctrl-btn';

    // label
    const PH_BAR_SPEED_LABEL_ID = 'ph-bar-speed-label';
    const PH_BAR_DOWNLOADED_BYTES_LABEL_ID = 'ph-bar-downloaded-bytes-label';
    const PH_BAR_COUNTDOWN_TIMER_LABEL_ID = 'ph-bar-countdown-timer-label';


    var VIDEO_INFO = {};
    var VIDEO_DEFINITIONS = [];
    var DIRECT_VIDEO_DEFINITIONS = {};
    var VIDEO_TITLE = undefined;
    var VIDEO_UPLOADER = undefined;
    var UNITS = ['Byte', 'KB', 'MB', 'GB'];

    function importModule(resourceName) {
        const src = GM_getResourceText(resourceName);

        const blob = new Blob([src], { type: 'text/javascript' });
        const url = URL.createObjectURL(blob);

        // Use <script> to mount to global window
        const script = document.createElement('script');
        script.textContent = `import * as _all from '${url}';
            Object.assign(window, {'${resourceName}':_all});`;
        script.type = 'module';
        document.head.appendChild(script);

        // Use import to mount to local window
        // 'import * as _all from url; 'is the equivalent of dynamic import
        import(url)
            .then(module => {
                Object.assign(window, {resourceName: module});
            })
            .catch(error => {
                console.error('Failed to import module:', error);
            })
            .finally(() => {
                setTimeout(()=>{
                    script.remove();
                    URL.revokeObjectURL(url);
                }, 1000);
            });
    }

    function getVideoId() {
        const video_player_div = document.querySelector('.mainPlayerDiv');
        if (!video_player_div) {
            console.log('No video player div found');
            return undefined;
        }
        return video_player_div.getAttribute('data-video-id');
    }

    function getDefinitions(videoId, then) {
        // Use <script> to get global variables
        const script = document.createElement('script');
        script.textContent = `
        (function() {
            // Get mideaDefinitions from flashvars_{number}
            const key = 'flashvars_${videoId}';
            const data = window[key]; // global variable

            // Get video data from dataLayer
            let videodata = undefined;
            const videopage = dataLayer.forEach(e=>{
                if (e.event == 'videopage') {
                    videodata = e.videodata;
                }
            });

            const videoTitle = VIDEO_SHOW.videoTitleOriginal;

            // Send back sandbox via postMessage
            window.postMessage({type: 'GM_DATA', key: key, data: {video_id:${videoId},flashvars:data, videodata:videodata, videoTitle:videoTitle}}, '*');
        })();
        `;
        document.head.appendChild(script);
        script.remove();

        // Monitoring messages in the sandbox
        window.addEventListener('message', async function(event) {
            if (event.data.type === 'GM_DATA') {
                console.log('✅ Get the native variable: ', event.data.key, event.data.data);
                // the video information is in the var variable flashvars_videoId
                const { video_id, flashvars, videodata, videoTitle } = event.data.data;

                // VIDEO_DEFINITIONS is array, each element is a link to obtain different resolutions of the video.
                let mediaDefinitions = flashvars.mediaDefinitions
                    .filter((item) => item.videoUrl.indexOf('master.m3u8')>=0)
                    .sort((a,b) => b.height - a.height);
                mediaDefinitions = mediaDefinitions.map(item=>({...item}));
                VIDEO_DEFINITIONS.push(...mediaDefinitions);

                // VIDEO_DIRECTIONS is array, each element is a direct link of the video.
                DIRECT_VIDEO_DEFINITIONS.main = flashvars.mediaDefinitions.find(item=> item.format == 'mp4').videoUrl;

                VIDEO_INFO['title'] = videoTitle;
                VIDEO_INFO['source'] = flashvars.link_url;
                VIDEO_INFO['cover_url'] = flashvars.image_url;
                VIDEO_INFO['cover_image'] = await httpGetArraybuffer(flashvars.image_url);
                VIDEO_INFO['uploader'] = getVideoUploader();
                VIDEO_INFO['published_date'] = videodata['video_date_published'];
                VIDEO_INFO['tags'] = videodata['categories_in_video'];


                VIDEO_TITLE = VIDEO_INFO['title'];
                VIDEO_UPLOADER = VIDEO_INFO['uploader']['fullname'];

                console.log('video_info', VIDEO_INFO);

                then();
            }
        });
    }
    function main() {
        window.addEventListener('load', ()=>{
            const VIDEO_ID = getVideoId();
            if (VIDEO_ID === undefined){
                return;
            }
            getDefinitions(VIDEO_ID, ()=>{
                // add div
                addDownloadBtn(VIDEO_DEFINITIONS);
                addProgressBarRow(VIDEO_DEFINITIONS);
    
                // add style
                addDownloadBtnStyle();
                addCommonBarRowStyle();
                addLoadingAnime();
            });
        });
    }

    importModule('mediabunny');
    main();
})();