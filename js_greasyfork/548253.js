// ==UserScript==
// @name         🔥【免费】中国大学Mooc答题助手（HappyMooc）
// @icon         https://i.postimg.cc/YqDVMYRC/Happy-Mooc-icon-128x128.png
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  免费答题助手（不需要购买题库），挂机刷课，真免费！
// @author       YZG
// @match        https://www.icourse163.org/learn/*
// @match        http://www.icourse163.org/learn/*
// @match        http://www.icourse163.org/spoc/learn/*
// @match        https://www.icourse163.org/spoc/learn/*
// @match        https://www.icourse163.org/mooc/*
// @grant        GM.xmlHttpRequest
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/548253/%F0%9F%94%A5%E3%80%90%E5%85%8D%E8%B4%B9%E3%80%91%E4%B8%AD%E5%9B%BD%E5%A4%A7%E5%AD%A6Mooc%E7%AD%94%E9%A2%98%E5%8A%A9%E6%89%8B%EF%BC%88HappyMooc%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/548253/%F0%9F%94%A5%E3%80%90%E5%85%8D%E8%B4%B9%E3%80%91%E4%B8%AD%E5%9B%BD%E5%A4%A7%E5%AD%A6Mooc%E7%AD%94%E9%A2%98%E5%8A%A9%E6%89%8B%EF%BC%88HappyMooc%EF%BC%89.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
    const debug = false
    const API_CONFIG = {
        BASE_URL: debug?'http://localhost:5001':"https://mooc.gxx.cool",
        ENDPOINTS: {
            AID_CHANGE: '/api/aidChange',
            USER_STATUS: '/api/user/status'
        }
    };
    // QRCode库加载状态
    let qrcodeLoaded = false;
    let qrcodeLoadCallbacks = [];

    let qrcode = document.createElement('script');
    qrcode.src = "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";

    // 监听QRCode库加载完成
    qrcode.onload = function() {
        console.log('QRCode库加载完成');
        qrcodeLoaded = true;
        // 执行所有等待的回调函数
        qrcodeLoadCallbacks.forEach(callback => callback());
        qrcodeLoadCallbacks = [];
    };

    qrcode.onerror = function() {
        console.error('QRCode库加载失败');
        qrcodeLoaded = true; // 即使加载失败也标记为完成，让程序继续运行
        // 执行所有等待的回调函数
        qrcodeLoadCallbacks.forEach(callback => callback());
        qrcodeLoadCallbacks = [];
    };

    document.head.appendChild(qrcode);
    const buildUrl = (endpoint, params = {}) => {
        let url = API_CONFIG.BASE_URL + endpoint;
        Object.keys(params).forEach(key => {
            url = url.replace(`{${key}}`, params[key]);
        });
        return url;
    };

    const user_info = unsafeWindow.webUser || GM_getValue('webUser');
    const global_data = { webUser: { ...user_info }, courseDto: { ...unsafeWindow.courseDto }, curseData: {} };
    console.log(global_data);

    class ToastManager {
        constructor() {
            this.container = null;
            this.toasts = [];
            this.init();
        }

        init() {
            this.addStyles();
            this.createContainer();
        }

        addStyles() {
            const style = document.createElement('style');
            style.textContent = `
                .toast-container {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 10000;
                    pointer-events: none;
                }

                .toast {
                    background: #fff;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    margin-bottom: 10px;
                    padding: 16px 20px;
                    min-width: 300px;
                    max-width: 400px;
                    pointer-events: auto;
                    transform: translateX(100%);
                    transition: all 0.3s ease;
                    border-left: 4px solid #007bff;
                    display: flex;
                    align-items: center;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    font-size: 14px;
                    line-height: 1.4;
                }

                .toast.show {
                    transform: translateX(0);
                }

                .toast.success {
                    border-left-color: #28a745;
                }

                .toast.error {
                    border-left-color: #dc3545;
                }

                .toast.warning {
                    border-left-color: #ffc107;
                }

                .toast.info {
                    border-left-color: #17a2b8;
                }

                .toast-icon {
                    margin-right: 12px;
                    font-size: 18px;
                    flex-shrink: 0;
                }

                .toast.success .toast-icon::before {
                    content: '✓';
                    color: #28a745;
                }

                .toast.error .toast-icon::before {
                    content: '✕';
                    color: #dc3545;
                }

                .toast.warning .toast-icon::before {
                    content: '⚠';
                    color: #ffc107;
                }

                .toast.info .toast-icon::before {
                    content: 'ℹ';
                    color: #17a2b8;
                }

                .toast-content {
                    flex: 1;
                }

                .toast-title {
                    font-weight: 600;
                    margin-bottom: 4px;
                    color: #333;
                }

                .toast-message {
                    color: #666;
                }

                .toast-close {
                    margin-left: 12px;
                    background: none;
                    border: none;
                    font-size: 18px;
                    color: #999;
                    cursor: pointer;
                    padding: 0;
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    transition: all 0.2s ease;
                }

                .toast-close:hover {
                    background: #f0f0f0;
                    color: #666;
                }

                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    z-index: 10001;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .modal-overlay.show {
                    opacity: 1;
                }

                .modal {
                    background: #fff;
                    border-radius: 12px;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
                    max-width: 500px;
                    width: 90%;
                    max-height: 80vh;
                    overflow: hidden;
                    transform: scale(0.9);
                    transition: transform 0.3s ease;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }

                .modal-overlay.show .modal {
                    transform: scale(1);
                }

                .modal-header {
                    padding: 20px 24px 16px;
                    border-bottom: 1px solid #eee;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                .modal-title {
                    font-size: 18px;
                    font-weight: 600;
                    color: #333;
                    margin: 0;
                }

                .modal-close {
                    background: none;
                    border: none;
                    font-size: 24px;
                    color: #999;
                    cursor: pointer;
                    padding: 0;
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    transition: all 0.2s ease;
                }

                .modal-close:hover {
                    background: #f0f0f0;
                    color: #666;
                }

                .modal-body {
                    padding: 20px 24px;
                    color: #666;
                    line-height: 1.5;
                }

                .modal-footer {
                    padding: 16px 24px 20px;
                    border-top: 1px solid #eee;
                    display: flex;
                    justify-content: flex-end;
                    gap: 12px;
                }

                .btn {
                    padding: 8px 16px;
                    border-radius: 6px;
                    border: 1px solid #ddd;
                    background: #fff;
                    color: #333;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 500;
                    transition: all 0.2s ease;
                }

                .btn:hover {
                    background: #f8f9fa;
                }

                .btn-primary {
                    background: #007bff;
                    border-color: #007bff;
                    color: #fff;
                }

                .btn-primary:hover {
                    background: #0056b3;
                    border-color: #0056b3;
                }

                .btn-danger {
                    background: #dc3545;
                    border-color: #dc3545;
                    color: #fff;
                }

                .btn-danger:hover {
                    background: #c82333;
                    border-color: #c82333;
                }
            `;
            document.head.appendChild(style);
        }

        createContainer() {
            this.container = document.createElement('div');
            this.container.className = 'toast-container';
            document.body.appendChild(this.container);
        }

        show(type, title, message, duration = 4000) {
            const toast = document.createElement('div');
            toast.className = `toast ${type}`;

            toast.innerHTML = `
                <div class="toast-icon"></div>
                <div class="toast-content">
                    <div class="toast-title">${title}</div>
                    <div class="toast-message">${message}</div>
                </div>
                <button class="toast-close">×</button>
            `;

            this.container.appendChild(toast);
            this.toasts.push(toast);

            setTimeout(() => toast.classList.add('show'), 10);

            const closeBtn = toast.querySelector('.toast-close');
            closeBtn.addEventListener('click', () => this.remove(toast));

            if (duration > 0) {
                setTimeout(() => this.remove(toast), duration);
            }

            return toast;
        }

        remove(toast) {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
                const index = this.toasts.indexOf(toast);
                if (index > -1) {
                    this.toasts.splice(index, 1);
                }
            }, 300);
        }

        success(title, message, duration) {
            return this.show('success', title, message, duration);
        }

        error(title, message, duration) {
            return this.show('error', title, message, duration);
        }

        warning(title, message, duration) {
            return this.show('warning', title, message, duration);
        }

        info(title, message, duration) {
            return this.show('info', title, message, duration);
        }

        confirm(title, message, onConfirm, onCancel) {
            const overlay = document.createElement('div');
            overlay.className = 'modal-overlay';

            overlay.innerHTML = `
                <div class="modal">
                    <div class="modal-header">
                        <h3 class="modal-title">${title}</h3>
                        <button class="modal-close">×</button>
                    </div>
                    <div class="modal-body">${message}</div>
                    <div class="modal-footer">
                        <button class="btn btn-cancel">取消</button>
                        <button class="btn btn-primary btn-confirm">确认</button>
                    </div>
                </div>
            `;

            document.body.appendChild(overlay);

            setTimeout(() => overlay.classList.add('show'), 10);

            const closeModal = () => {
                overlay.classList.remove('show');
                setTimeout(() => {
                    if (overlay.parentNode) {
                        overlay.parentNode.removeChild(overlay);
                    }
                }, 300);
            };

            overlay.querySelector('.modal-close').addEventListener('click', () => {
                closeModal();
                if (onCancel) onCancel();
            });

            overlay.querySelector('.btn-cancel').addEventListener('click', () => {
                closeModal();
                if (onCancel) onCancel();
            });

            overlay.querySelector('.btn-confirm').addEventListener('click', () => {
                closeModal();
                if (onConfirm) onConfirm();
            });

            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    closeModal();
                    if (onCancel) onCancel();
                }
            });
        }
    }

    const base64Encode = (str) => {
        return btoa(unescape(encodeURIComponent(str)));
    };

    const toast = new ToastManager();

    // ================ 慢刷功能相关变量 ================
    let studyTime = 0;
    global_data.slow = false;
    global_data.check_handle = null;
    global_data.interval_check = null;
    global_data.current_unit_index = 0;
    global_data.last_url = '';
    global_data.video_id = '';
    global_data.current_video = null;
    global_data.pause_listener = null;
    global_data.units = [];
    global_data.lesson_id = null;
    global_data.current_unit = null;

    // ================ 慢刷功能实现 ================
    function save_moc_ccontent_learn(data, csrfkey, index, url = "https://www.icourse163.org/web/j/courseBean.saveMocContentLearn.rpc?csrfKey=") {
        return new Promise((resolve, reject) => {
            let [Auth_Signature, timestamp, o] = get_Auth_Signature(data);
            GM.xmlHttpRequest({
                url: url + csrfkey,
                method: 'post',
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    'timestamp': timestamp,
                    'Auth-Signature': Auth_Signature,
                    'Nonce': o,
                    'System': 'v1',
                    'Edu-Script-Token': global_data.csrfkey,
                    'Origin': 'null'
                },
                data: data,
                onload: function (response) {
                    try {
                        let res = JSON.parse(response.responseText);
                        if (res.code !== 0) {
                            unsafeWindow.fail_list.push({'params': [data, csrfkey, url]});
                        }
                    } catch (e) {
                        // 忽略解析错误
                    }
                    resolve();
                }
            });
        });
    }

    function get_Auth_Signature(data) {
        let nonce = global_data.webUser.nonce || '12345678901234567890123456789012';
        let timestamp = new Date().getTime() + studyTime;
        let o = nonce.slice(-4);
        nonce = nonce.slice(0, -4);
        let Auth_Signature = unsafeWindow.CryptoJS.MD5(data + o + timestamp + nonce).toString().toLocaleUpperCase();
        return [Auth_Signature, timestamp, o];
    }

    function load_lesson() {
        let lesson_id = global_data.lesson_id;
        if (!lesson_id) return;

        let lession_url = 'https://www.icourse163.org/web/j/courseBean.getLastLearnedMocTermDto.rpc?csrfKey=' + global_data.csrfkey;
        let lession_data = {
            termId: lesson_id,
        };
        try {
            GM.xmlHttpRequest({
                url: lession_url,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Origin': 'null'
                },
                data: new URLSearchParams(lession_data).toString(),
                onload: function (response) {
                    try {
                        const result = JSON.parse(response.responseText);
                        if (result.result && result.result.mocTermDto && result.result.mocTermDto.chapters) {
                            const chapters = result.result.mocTermDto.chapters;
                            global_data.chapter_storage = chapters;
                            let units = [];
                            for (let chapter of chapters) {
                                if (!chapter.lessons)
                                    continue;
                                for (let lesson of chapter.lessons) {
                                    if (!lesson.units)
                                        continue;
                                    units = units.concat(lesson.units);
                                }
                            }
                            global_data.units = units;
                            toast.success('课程加载成功', '已加载 ' + units.length + ' 个学习单元');
                        }
                    } catch (parseError) {
                        console.error('解析课程数据失败:', parseError);
                        toast.error('课程数据解析失败', '请刷新页面重试');
                    }
                },
                onerror: function (error) {
                    console.error('加载课程失败:', error);
                    toast.error('加载课程失败', '请检查网络连接');
                }
            });
        } catch (error) {
            console.error('加载课程失败:', error);
            toast.error('加载课程失败', '请刷新页面重试');
        }
    }

    function curremt_unit_index() {
        // 优先从URL中获取当前单元ID
        const currentUrl = unsafeWindow.location.href;
        const urlMatch = currentUrl.match(/cid=(\d+)/);
        if (urlMatch) {
            const currentUnitId = urlMatch[1];
            for (let i = 0; i < global_data.units.length; i++) {
                if (global_data.units[i].id.toString() === currentUnitId) {
                    return i;
                }
            }
        }

        // 如果URL中没有cid，则从DOM中获取
        const li = document.querySelector(".f-fl.current");
        if (!li) return 0;
        const li_id = li.getAttribute("data-id");
        let current_unit_index = 0;
        for (let i = 0; i < global_data.units.length; i++) {
            if (global_data.units[i].id.toString() === li_id) {
                current_unit_index = i;
                break;
            }
        }
        return current_unit_index;
    }

    function get_lesson() {
        let next_unit = null;
        for (let i = global_data.current_unit_index + 1; i < global_data.units.length; i++) {
            // 只跳过讨论类型，保留其他所有类型（包括文档、视频等）
            if (global_data.units[i].contentType !== 6) {
                global_data.current_unit_index = i;
                next_unit = global_data.units[i];
                break;
            }
        }
        return next_unit;
    }

    function goto_next_href() {
        if (!global_data.slow) {
            return;
        }
        const loc = unsafeWindow.location.href;
        const next_unit = get_lesson();

        console.log('当前单元索引:', global_data.current_unit_index);
        console.log('下一个单元:', next_unit);

        unsafeWindow.location.href = loc.split('#')[0] + '#/learn/content';
        const progressElement = document.getElementById('lesson_progress');
        if (progressElement) {
            progressElement.textContent = '首页';
        }
        if (next_unit === null) {
            clearInterval(global_data.check_handle);
            clearInterval(global_data.interval_check);
            global_data.slow = false;
            if (progressElement) {
                progressElement.style.color = 'red';
                progressElement.textContent = '未开始';
            }
            toast.success('刷课完成', '慢刷任务已全部完成！');
            return;
        }
        global_data.current_unit = next_unit;
        const lessonId = next_unit.lessonId;
        const id = next_unit.id;
        const contentTypeName = {
            1: '视频',
            3: '文档',
            4: '富文本',
            5: '测验',
            6: '讨论'
        }[next_unit.contentType] || '未知';

        console.log(`准备跳转到: ${contentTypeName} (ID: ${id})`);

        const url = loc.split('#')[0] + `#/learn/content?type=detail&id=${lessonId}&cid=${id}`;
        setTimeout(function () {
            unsafeWindow.location.href = url;
        }, 2000);
    }

    function handle_discuss() {
        if (!global_data.slow) {
            return;
        }
        global_data.last_url = unsafeWindow.location.href;
        goto_next_href();
    }

    function handle_exam() {
        if (!global_data.slow) {
            return;
        }
        global_data.last_url = unsafeWindow.location.href;
        goto_next_href();
    }

    function _C(element) {
        element.id = 'globalScoreLockBtn';
        element.click();
        element.removeAttribute("id");
    }

    function handle_ppt() {
        global_data.last_url = unsafeWindow.location.href;
        if (!global_data.slow) {
            return;
        }
        const ppt_slider = document.querySelector(".ux-edu-pdfthumbnailviewer.f-pa.j-body");
        if (!ppt_slider) return;
        const a_list = ppt_slider.querySelectorAll('a');
        if (a_list.length === 0) return;

        function click_a(index) {
            const currentSlider = document.querySelector(".ux-edu-pdfthumbnailviewer.f-pa.j-body");
            if (!currentSlider) {
                global_data.slow = false;
                const progressElement = document.getElementById('lesson_progress');
                if (progressElement) {
                    progressElement.style.color = 'red';
                    progressElement.textContent = '未开始';
                }
                return;
            }
            _C(a_list[index]);
            const random_time = Math.floor(Math.random() * 1000) + 2500;
            setTimeout(function () {
                if (index < a_list.length - 1) {
                    click_a(++index);
                } else {
                    goto_next_href();
                }
            }, random_time);
        }

        const pageInput = document.querySelector(".ux-h5pdfreader_container_footer_pages_in");
        let current_page = pageInput ? parseInt(pageInput.value) || 1 : 1;
        click_a(current_page - 1);
    }

    function handle_txt() {
        if (!global_data.slow) {
            return;
        }
        global_data.last_url = unsafeWindow.location.href;
        goto_next_href();
    }

    function slow_skip_lesson(tip = true) {
        if (global_data.slow || !global_data.webUser) {
            return;
        }
        if (unsafeWindow.location.href.indexOf('type=detail') === -1) {
            toast.warning('请到课程页面', '请到课程页面后再开始挂机刷课！', 5000);
            return;
        }

        // 获取课程信息
        if (!global_data.lesson_id) {
            if (unsafeWindow.moocTermDto) {
                global_data.lesson_id = unsafeWindow.moocTermDto.id;
            } else if (unsafeWindow.termDto) {
                global_data.lesson_id = unsafeWindow.termDto.id;
            }
        }

        // 获取CSRF Key
        if (!global_data.csrfkey) {
            global_data.csrfkey = document.cookie.match(/NTESSTUDYSI=(.*?);/) ?
                document.cookie.match(/NTESSTUDYSI=(.*?);/)[1] : undefined;
        }

        // 加载课程单元
        if (global_data.units.length === 0) {
            load_lesson();
        }

        global_data.current_unit_index = curremt_unit_index();
        global_data.current_unit = global_data.units[global_data.current_unit_index];
        global_data.slow = true;
        global_data.check_handle = null;
        global_data.check_handle = setInterval(function () {
            const current_url = unsafeWindow.location.href;
            const last_url = global_data.last_url;
            if (current_url !== last_url && current_url.indexOf('type=detail') !== -1 && document.querySelector(".u-learnBCUI.f-cb")) {
                // 重新获取当前单元
                global_data.current_unit_index = curremt_unit_index();
                global_data.current_unit = global_data.units[global_data.current_unit_index];

                if (!global_data.current_unit || global_data.current_unit.contentType === undefined) {
                    return; // 等待课程单元数据加载
                }
                switch (global_data.current_unit.contentType) {
                    case 1:
                        //视频
                        const progressElement = document.getElementById('lesson_progress');
                        if (progressElement) progressElement.textContent = '视频';
                        break;
                    case 3:
                        //ppt文档
                        const progressElement3 = document.getElementById('lesson_progress');
                        if (progressElement3) progressElement3.textContent = '文档';
                        break;
                    case 4:
                        //富文本
                        const progressElement4 = document.getElementById('lesson_progress');
                        if (progressElement4) progressElement4.textContent = '富文本';
                        handle_txt();
                        break;
                    case 5:
                        //测验
                        const progressElement5 = document.getElementById('lesson_progress');
                        if (progressElement5) progressElement5.textContent = '测验';
                        handle_exam();
                        break;
                    case 6:
                        //讨论
                        const progressElement6 = document.getElementById('lesson_progress');
                        if (progressElement6) progressElement6.textContent = '讨论';
                        handle_discuss();
                        break;
                }
            }

            const video_elem = document.querySelector('video');
            if (video_elem && video_elem !== global_data.current_video) {
                global_data.last_url = unsafeWindow.location.href;
                video_elem.play();
                video_elem.muted = true;

                // 移除旧视频的暂停监听器
                if (global_data.current_video && global_data.pause_listener) {
                    global_data.current_video.removeEventListener('pause', global_data.pause_listener);
                }

                // 创建新的暂停监听器
                global_data.pause_listener = function() {
                    if (global_data.slow) {
                        video_elem.play();
                    }
                };

                video_elem.addEventListener('pause', global_data.pause_listener);
                global_data.current_video = video_elem;
                global_data.video_id = video_elem.id || 'video_' + Date.now();
            }
            if (document.querySelector(".ux-edu-pdfthumbnailviewer.f-pa.j-body") &&
                document.querySelector(".ux-edu-pdfthumbnailviewer.f-pa.j-body").querySelectorAll('a').length > 0 &&
                current_url !== last_url) {
                handle_ppt();
                global_data.last_url = unsafeWindow.location.href;
            }
            if (document.querySelector(".playEnd.f-f0.f-pa")) {
                goto_next_href();
            }
        }, 1000);

        global_data.interval_check = null;
        global_data.interval_check = setInterval(function () {
            const loc = unsafeWindow.location.href;
            if (loc.indexOf("learn/content") === -1) {
                global_data.slow = false;
                const progressElement = document.getElementById('lesson_progress');
                if (progressElement) {
                    progressElement.style.color = 'red';
                    progressElement.textContent = '未开始';
                }
                clearInterval(global_data.interval_check);
                clearInterval(global_data.check_handle);
            }
        }, 1000);

        if (tip) {
            toast.info('正在挂机刷课', '请勿手动切换页面！', 5000);
        }
        const progressElement = document.getElementById('lesson_progress');
        if (progressElement) {
            progressElement.style.color = 'blue';
            progressElement.textContent = '挂机中';
        }
    }

    // 添加隐藏 j-anchorContainer 的CSS
    const hideAnchorStyle = document.createElement('style');
    hideAnchorStyle.textContent = '#j-anchorContainer { display: none !important; }';
    document.head.appendChild(hideAnchorStyle);

    const createUI = () => {
        const sidePanel = document.createElement('div');
        Object.assign(sidePanel.style, {
            position: 'fixed',
            top: '15%',
            right: '20px',
            width: '280px',
            backgroundColor: '#fff',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            zIndex: '10000',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            overflow: 'hidden'
        });

        sidePanel.visible = true;

        const tabContainer = document.createElement('div');
        Object.assign(tabContainer.style, {
            height: '48px',
            backgroundColor: '#fff',
            display: 'flex',
            alignItems: 'stretch',
            borderBottom: '1px solid #f0f0f0'
        });

        const tab1 = document.createElement('div');
        Object.assign(tab1.style, {
            flex: '1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            color: '#007AFF',
            borderBottom: '2px solid #007AFF',
            transition: 'all 0.2s ease'
        });
        tab1.textContent = '小程序码';
        tab1.setAttribute('data-tab', 'miniprogram');

        const tab2 = document.createElement('div');
        Object.assign(tab2.style, {
            flex: '1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            color: '#8e8e93',
            borderBottom: '2px solid transparent',
            transition: 'all 0.2s ease'
        });
        tab2.textContent = '绑定页面';
        tab2.setAttribute('data-tab', 'binding');

        const tab3 = document.createElement('div');
        Object.assign(tab3.style, {
            flex: '1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            color: '#8e8e93',
            borderBottom: '2px solid transparent',
            transition: 'all 0.2s ease'
        });
        tab3.textContent = '挂机刷课';
        tab3.setAttribute('data-tab', 'slowlearn');

        const contentArea = document.createElement('div');
        Object.assign(contentArea.style, {
            padding: '20px',
            backgroundColor: '#fff',
            minHeight: '220px'
        });

        const miniprogramContent = document.createElement('div');
        Object.assign(miniprogramContent.style, {
            textAlign: 'center'
        });

        const qrDescription = document.createElement('div');
        Object.assign(qrDescription.style, {
            fontSize: '12px',
            color: '#666',
            marginBottom: '16px',
            lineHeight: '1.4'
        });
        qrDescription.textContent = '扫码进入小程序使用完整功能';

        const miniprogramQRContainer = document.createElement('div');
        Object.assign(miniprogramQRContainer.style, {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #e9ecef'
        });

        const qrImage = document.createElement('img');
        Object.assign(qrImage.style, {
            width: '150px',
            height: '150px',
            borderRadius: '8px',
            backgroundColor: 'white',
            objectFit: 'contain'
        });
        qrImage.src = 'https://i.postimg.cc/K8pSzjtH/suncode.jpg';
        qrImage.alt = '小程序码';

        qrImage.onerror = function() {
            const placeholder = document.createElement('div');
            Object.assign(placeholder.style, {
                width: '200px',
                height: '200px',
                backgroundColor: '#e9ecef',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#999',
                fontSize: '12px',
                textAlign: 'center',
                flexDirection: 'column'
            });
            placeholder.innerHTML = '<div>小程序码加载失败</div><div style="font-size: 10px; margin-top: 8px; color: #ccc;">请检查网络连接</div>';
            miniprogramQRContainer.replaceChild(placeholder, qrImage);
        };

        miniprogramQRContainer.appendChild(qrImage);
        miniprogramContent.appendChild(qrDescription);
        miniprogramContent.appendChild(miniprogramQRContainer);

        const bindingContent = document.createElement('div');
        Object.assign(bindingContent.style, {
            display: 'none'
        });

        const bindingTitle = document.createElement('div');
        Object.assign(bindingTitle.style, {
            fontSize: '16px',
            fontWeight: '600',
            color: '#333',
            marginBottom: '12px',
            textAlign: 'center'
        });
        bindingTitle.textContent = '绑定账户';

        const bindingDescription = document.createElement('div');
        Object.assign(bindingDescription.style, {
            fontSize: '12px',
            color: '#666',
            textAlign: 'center',
            marginBottom: '16px',
            lineHeight: '1.4'
        });
        bindingDescription.textContent = '请使用微信小程序扫描下方二维码完成账户绑定';

        const bindingQRContainer = document.createElement('div');
        Object.assign(bindingQRContainer.style, {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #e9ecef'
        });

        const encodedUserId = base64Encode(global_data.webUser.id);
        console.log('生成的Base64编码userid:', encodedUserId);

        const qrElement = document.createElement('div');
        qrElement.style.display = 'inline-block';

        const loadingHint = document.createElement('div');
        Object.assign(loadingHint.style, {
            padding: '30px',
            fontSize: '12px',
            color: '#666',
            textAlign: 'center'
        });
        loadingHint.textContent = '正在生成二维码...';
        qrElement.appendChild(loadingHint);

        generateQRCode(qrElement, encodedUserId).then(() => {
            bindingQRContainer.appendChild(qrElement);
        });

        bindingContent.appendChild(bindingTitle);
        bindingContent.appendChild(bindingDescription);
        bindingContent.appendChild(bindingQRContainer);

        const slowlearnContent = document.createElement('div');
        Object.assign(slowlearnContent.style, {
            display: 'none'
        });

        // 挂机刷课界面
        const slowlearnTitle = document.createElement('div');
        Object.assign(slowlearnTitle.style, {
            fontSize: '17px',
            fontWeight: '600',
            color: '#000',
            marginBottom: '6px',
            textAlign: 'center'
        });

        const slowlearnDescription = document.createElement('div');
        Object.assign(slowlearnDescription.style, {
            fontSize: '13px',
            color: '#8e8e93',
            marginBottom: '16px',
            lineHeight: '1.4',
            textAlign: 'center'
        });

        const startButton = document.createElement('button');
        Object.assign(startButton.style, {
            width: '85%',
            padding: '12px 16px',
            backgroundColor: '#007AFF',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '15px',
            fontWeight: '500',
            cursor: 'pointer',
            margin: '0 auto 10px auto',
            display: 'block',
            transition: 'opacity 0.2s ease'
        });
        startButton.textContent = '开始挂机';
        startButton.onmouseover = () => startButton.style.opacity = '0.8';
        startButton.onmouseout = () => startButton.style.opacity = '1';
        startButton.onclick = () => {
            slow_skip_lesson(true);
            toast.info('慢刷启动', '慢刷任务已开始，请勿手动切换页面！', 3000);
        };

        const stopButton = document.createElement('button');
        Object.assign(stopButton.style, {
            width: '85%',
            padding: '12px 16px',
            backgroundColor: '#ff3b30',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '15px',
            fontWeight: '500',
            cursor: 'pointer',
            margin: '0 auto 16px auto',
            display: 'block',
            transition: 'opacity 0.2s ease'
        });
        stopButton.textContent = '停止挂机';
        stopButton.onmouseover = () => stopButton.style.opacity = '0.8';
        stopButton.onmouseout = () => stopButton.style.opacity = '1';
        stopButton.onclick = () => {
            global_data.slow = false;
            if (global_data.check_handle) clearInterval(global_data.check_handle);
            if (global_data.interval_check) clearInterval(global_data.interval_check);
            const progressElement = document.getElementById('lesson_progress');
            if (progressElement) {
                progressElement.style.color = '#8e8e93';
                progressElement.textContent = '未开始';
            }
            toast.info('慢刷已停止', '慢刷任务已停止');
        };

        const progressContainer = document.createElement('div');
        Object.assign(progressContainer.style, {
            backgroundColor: '#f2f2f7',
            borderRadius: '10px',
            padding: '14px',
            textAlign: 'center',
            marginBottom: '14px'
        });

        const progressLabel = document.createElement('div');
        Object.assign(progressLabel.style, {
            fontSize: '12px',
            color: '#8e8e93',
            marginBottom: '6px',
            fontWeight: '500'
        });
        progressLabel.textContent = '刷课进度';
        const progressElement = document.createElement('div');
        progressElement.id = 'lesson_progress';
        Object.assign(progressElement.style, {
            fontSize: '20px',
            fontWeight: '600',
            color: '#000',
        });
        progressElement.textContent = '未开始';

        progressContainer.appendChild(progressLabel);
        progressContainer.appendChild(progressElement);




        slowlearnContent.appendChild(slowlearnDescription);
        slowlearnContent.appendChild(startButton);
        slowlearnContent.appendChild(stopButton);
        slowlearnContent.appendChild(progressContainer);

        const switchTab = (activeTab) => {
            [tab1, tab2, tab3].forEach(tab => {
                const isActive = tab.getAttribute('data-tab') === activeTab;
                if (isActive) {
                    tab.style.color = '#007AFF';
                    tab.style.borderBottomColor = '#007AFF';
                } else {
                    tab.style.color = '#8e8e93';
                    tab.style.borderBottomColor = 'transparent';
                }
            });

            miniprogramContent.style.display = activeTab === 'miniprogram' ? 'block' : 'none';
            bindingContent.style.display = activeTab === 'binding' ? 'block' : 'none';
            slowlearnContent.style.display = activeTab === 'slowlearn' ? 'block' : 'none';
        };

        tab1.addEventListener('click', (e) => {
            e.stopPropagation();
            switchTab('miniprogram');
        });
        tab2.addEventListener('click', (e) => {
            e.stopPropagation();
            switchTab('binding');
        });
        tab3.addEventListener('click', (e) => {
            e.stopPropagation();
            switchTab('slowlearn');
        });

        tabContainer.appendChild(tab1);
        tabContainer.appendChild(tab2);
        tabContainer.appendChild(tab3);

        contentArea.appendChild(miniprogramContent);
        contentArea.appendChild(bindingContent);
        contentArea.appendChild(slowlearnContent);

        sidePanel.appendChild(tabContainer);
        sidePanel.appendChild(contentArea);

        document.body.appendChild(sidePanel);

        addDragFunctionality(sidePanel);

        // 添加ESC键监听器
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' || e.keyCode === 27) {
                sidePanel.visible = !sidePanel.visible;
                sidePanel.style.display = sidePanel.visible ? 'block' : 'none';
                GM_setValue('windowVisible', sidePanel.visible);
            }
        });

        const savedWindowVisible = GM_getValue('windowVisible', true);
        sidePanel.visible = savedWindowVisible;
        sidePanel.style.display = savedWindowVisible ? 'block' : 'none';
    };

    const createBindingUI = () => {
        const sidePanel = document.createElement('div');
        Object.assign(sidePanel.style, {
            position: 'fixed',
            top: '40%',
            right: '20px',
            width: '320px',
            backgroundColor: 'white',
            border: '1px solid #e1e5e9',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
            zIndex: '10000',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            overflow: 'hidden'
        });

        sidePanel.visible = true;

        const tabContainer = document.createElement('div');
        Object.assign(tabContainer.style, {
            height: '60px',
            backgroundColor: '#f8f9fa',
            borderBottom: '1px solid #e9ecef',
            display: 'flex',
            alignItems: 'stretch'
        });

        const tab1 = document.createElement('div');
        Object.assign(tab1.style, {
            flex: '1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            color: '#666',
            backgroundColor: '#f8f9fa',
            borderBottom: '2px solid transparent',
            transition: 'all 0.3s ease'
        });
        tab1.textContent = '小程序码';
        tab1.setAttribute('data-tab', 'miniprogram');

        const tab2 = document.createElement('div');
        Object.assign(tab2.style, {
            flex: '1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            color: '#007bff',
            backgroundColor: 'white',
            borderBottom: '2px solid #007bff',
            transition: 'all 0.3s ease'
        });
        tab2.textContent = '绑定页面';
        tab2.setAttribute('data-tab', 'binding');

        const contentArea = document.createElement('div');
        Object.assign(contentArea.style, {
            padding: '16px',
            backgroundColor: 'white',
            minHeight: '200px'
        });

        const miniprogramContent = document.createElement('div');
        Object.assign(miniprogramContent.style, {
            textAlign: 'center',
            display: 'none'
        });

        const qrTitle = document.createElement('div');
        Object.assign(qrTitle.style, {
            fontSize: '16px',
            fontWeight: '600',
            color: '#333',
            marginBottom: '12px'
        });
        qrTitle.textContent = '小程序码';

        const qrDescription = document.createElement('div');
        Object.assign(qrDescription.style, {
            fontSize: '12px',
            color: '#666',
            marginBottom: '16px',
            lineHeight: '1.4'
        });
        qrDescription.textContent = '扫码进入小程序使用更多功能';

        const miniprogramQRContainer = document.createElement('div');
        Object.assign(miniprogramQRContainer.style, {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #e9ecef'
        });

        const qrImage = document.createElement('img');
        Object.assign(qrImage.style, {
            width: '150px',
            height: '150px',
            borderRadius: '8px',
            backgroundColor: 'white',
            border: '1px solid #ddd',
            objectFit: 'contain'
        });
        qrImage.src = 'https://i.postimg.cc/K8pSzjtH/suncode.jpg';
        qrImage.alt = '小程序码';

        qrImage.onerror = () => {
            qrImage.style.display = 'none';
            const errorPlaceholder = document.createElement('div');
            Object.assign(errorPlaceholder.style, {
                width: '150px',
                height: '150px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#999',
                fontSize: '12px',
                textAlign: 'center',
                border: '1px solid #e9ecef'
            });
            errorPlaceholder.textContent = '图片加载失败';
            qrImage.parentNode.insertBefore(errorPlaceholder, qrImage.nextSibling);
        };

        miniprogramQRContainer.appendChild(qrImage);
        miniprogramContent.appendChild(qrTitle);
        miniprogramContent.appendChild(qrDescription);
        miniprogramContent.appendChild(miniprogramQRContainer);

        const bindingContent = document.createElement('div');

        const bindingDescription = document.createElement('div');
        Object.assign(bindingDescription.style, {
            fontSize: '12px',
            color: '#666',
            textAlign: 'center',
            marginBottom: '16px',
            lineHeight: '1.4'
        });
        bindingDescription.textContent = '请使用微信小程序扫描下方二维码完成账户绑定';

        const bindingQRContainer = document.createElement('div');
        Object.assign(bindingQRContainer.style, {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #e9ecef'
        });

        const encodedUserId = base64Encode(global_data.webUser.id);
        console.log('生成的Base64编码userid:', encodedUserId);

        const qrElement = document.createElement('div');
        qrElement.style.display = 'inline-block';

        const loadingHint = document.createElement('div');
        Object.assign(loadingHint.style, {
            padding: '30px',
            fontSize: '12px',
            color: '#666',
            textAlign: 'center'
        });
        loadingHint.textContent = '正在生成二维码...';
        qrElement.appendChild(loadingHint);

        generateQRCode(qrElement, encodedUserId).then(() => {
            bindingQRContainer.appendChild(qrElement);
        });

        bindingContent.appendChild(bindingDescription);
        bindingContent.appendChild(bindingQRContainer);

        const switchTab = (activeTab) => {
            [tab1, tab2].forEach(tab => {
                const isActive = tab.getAttribute('data-tab') === activeTab;
                Object.assign(tab.style, {
                    color: isActive ? '#007bff' : '#666',
                    backgroundColor: isActive ? 'white' : '#f8f9fa',
                    borderBottomColor: isActive ? '#007bff' : 'transparent'
                });
            });

            miniprogramContent.style.display = activeTab === 'miniprogram' ? 'block' : 'none';
            bindingContent.style.display = activeTab === 'binding' ? 'block' : 'none';
        };

        tab1.addEventListener('click', (e) => {
            e.stopPropagation();
            switchTab('miniprogram');
        });
        tab2.addEventListener('click', (e) => {
            e.stopPropagation();
            switchTab('binding');
        });

        tabContainer.appendChild(tab1);
        tabContainer.appendChild(tab2);

        contentArea.appendChild(miniprogramContent);
        contentArea.appendChild(bindingContent);

        sidePanel.appendChild(tabContainer);
        sidePanel.appendChild(contentArea);

        document.body.appendChild(sidePanel);

        addDragFunctionality(sidePanel);

        // 添加ESC键监听器
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' || e.keyCode === 27) {
                sidePanel.visible = !sidePanel.visible;
                sidePanel.style.display = sidePanel.visible ? 'block' : 'none';
                GM_setValue('windowVisible', sidePanel.visible);
            }
        });

        const savedWindowVisible = GM_getValue('windowVisible', true);
        sidePanel.visible = savedWindowVisible;
        sidePanel.style.display = savedWindowVisible ? 'block' : 'none';
    };

    const generateQRCode = (container, text) => {
        return new Promise((resolve) => {
            const waitForQRCode = (callback) => {
                if (qrcodeLoaded) {
                    callback();
                } else {
                    qrcodeLoadCallbacks.push(callback);
                }
            };

            waitForQRCode(() => {
                try {
                    if (typeof QRCode === 'undefined') {
                        throw new Error('QRCode 库未加载，请确保已正确引入 qrcodejs');
                    }

                    console.log('检测到 QRCode 库，类型:', typeof QRCode);

                    container.innerHTML = '';

                    const qrContainer = document.createElement('div');
                    qrContainer.style.display = 'inline-block';
                    qrContainer.style.padding = '10px';
                    qrContainer.style.backgroundColor = '#ffffff';
                    qrContainer.style.borderRadius = '8px';

                    const qr = new QRCode(qrContainer, {
                        text: text,
                        width: 150,
                        height: 150,
                        colorDark: '#000000',
                        colorLight: '#ffffff',
                        correctLevel: QRCode.CorrectLevel.M
                    });

                    console.log('使用 qrcodejs 生成二维码成功');

                    container.appendChild(qrContainer);
                    resolve();

                } catch (error) {
                    console.error('二维码生成失败:', error);
                    console.log('切换到备用方案');
                    generateFallbackQRCode(container, text);
                    resolve();
                }
            });
        });
    };

    const generateFallbackQRCode = (container, text) => {
        console.log('使用备用方案生成二维码');

        container.innerHTML = '';

        const canvas = document.createElement('canvas');
        const size = 150;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, size, size);

        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, size, 20);
        ctx.fillRect(0, 0, 20, size);
        ctx.fillRect(size-20, 0, 20, size);
        ctx.fillRect(0, size-20, size, 20);

        const gridSize = 16;
        const cellSize = Math.floor((size - 40) / gridSize);
        const startX = 20;
        const startY = 20;

        ctx.fillStyle = '#000000';
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                const seed = text.charCodeAt((i * gridSize + j) % text.length);
                if ((seed + i + j) % 3 === 0) {
                    ctx.fillRect(
                        startX + j * cellSize,
                        startY + i * cellSize,
                        cellSize - 1,
                        cellSize - 1
                    );
                }
            }
        }

        const cornerSize = cellSize * 3;
        ctx.fillRect(startX, startY, cornerSize, cornerSize);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(startX + cellSize, startY + cellSize, cellSize, cellSize);
        ctx.fillStyle = '#000000';
        ctx.fillRect(startX + (gridSize - 3) * cellSize, startY, cornerSize, cornerSize);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(startX + (gridSize - 2) * cellSize, startY + cellSize, cellSize, cellSize);
        ctx.fillStyle = '#000000';
        ctx.fillRect(startX, startY + (gridSize - 3) * cellSize, cornerSize, cornerSize);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(startX + cellSize, startY + (gridSize - 2) * cellSize, cellSize, cellSize);

        const qrContainer = document.createElement('div');
        qrContainer.style.display = 'inline-block';
        qrContainer.style.padding = '10px';
        qrContainer.style.backgroundColor = '#ffffff';
        qrContainer.style.borderRadius = '8px';
        qrContainer.style.border = '1px solid #ddd';
        qrContainer.appendChild(canvas);

        container.appendChild(qrContainer);

        const hint = document.createElement('div');
        hint.style.marginTop = '10px';
        hint.style.fontSize = '12px';
        hint.style.color = '#999';
        hint.innerHTML = '请使用微信扫一扫 <span style="color: #dc3545;">⚠️ 备用显示</span>';
        container.appendChild(hint);
    };

    const checkUserStatus = () => {
        return new Promise((resolve) => {
            if (!global_data.webUser?.id) {
                console.log('用户未登录，无法检查状态');
                return resolve(false);
            }

            GM.xmlHttpRequest({
                method: 'GET',
                url: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER_STATUS}?userid=${global_data.webUser.id}`,
                headers: { 'Content-Type': 'application/json' },
                timeout: 3000,
                onload: (response) => {
                    console.log(response);

                    const isEnabled = handleStatusResponse(response);
                    resolve(isEnabled);
                },
                onerror: (error) => {
                    console.error('检查用户状态网络错误:', error);
                    resolve(true);
                }
            });
        });
    };

    const handleStatusResponse = (response) => {
        if (response.status !== 200) {
            console.error('检查用户状态请求失败:', response.status);
            return false;
        }

        try {
            const result = JSON.parse(response.responseText);

            if (result.status !== 0) {
                console.error('检查用户状态失败:', result.msg);
                return false;
            }

            const userData = result.data;
            console.log('用户状态检查结果:', userData);

            global_data.webUser.is_banned = userData.is_banned;
            global_data.webUser.is_bound = userData.is_bound;
            global_data.webUser.is_new_user = userData.is_new_user;

            if (userData.is_banned) {
                console.log('用户已被封禁，禁止使用脚本');
                return false;
            }

            console.log('用户状态正常，允许使用脚本');
            return true;

        } catch (error) {
            console.error('解析用户状态响应失败:', error);
            return false;
        }
    };

    const reportAidChange = () => {
        GM.xmlHttpRequest({
            method: 'POST',
            url: buildUrl(API_CONFIG.ENDPOINTS.AID_CHANGE),
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify({
                userID: global_data.webUser.id,
                aid: global_data.curseData.aid,
                tid: global_data.curseData.tid,
                courseName: global_data.courseDto.name,
                testName: global_data.curseData.tname,
                isExam: global_data.curseData.isExam
            }),
            onload: (response) => {
                if (response.status === 200) {
                    console.log('AID change reported successfully:', response.responseText);
                    toast.success('记录成功', '已同步打开试卷信息');
                } else {
                    console.error('Failed to report AID change:', response);
                    toast.error('记录失败', '');
                }
            },
            onerror: (error) => {
                console.error('Error reporting AID change:', error);
                toast.error('网络错误', '');
            }
        });
    };

    const hookXHR = () => {
        const originalXHR = unsafeWindow.XMLHttpRequest;
        unsafeWindow.XMLHttpRequest = class extends originalXHR {
            open(method, url, ...rest) {
                this._intercept = url.includes('getOpenQuizPaperDto')||url.includes('getOpenHomeworkPaperDto');
                super.open(method, url, ...rest);
            }

            set onreadystatechange(callback) {
                super.onreadystatechange = () => {
                    if (this._intercept && this.readyState === 4) {
                        try {
                            const jsonResponse = JSON.parse(this.responseText);
                            if (jsonResponse.result && jsonResponse.result.aid) {
                                global_data.curseData.aid = jsonResponse.result.aid;
                                global_data.curseData.tid = jsonResponse.result.tid;
                                global_data.curseData.tname = jsonResponse.result.tname;

                                global_data.curseData.isExam = !!jsonResponse.result.examId && jsonResponse.result.examId !== -1;

                                console.log('提取到的数据:', {
                                    aid: global_data.curseData.aid,
                                    tid: global_data.curseData.tid,
                                    courseName: global_data.courseDto.name,
                                    testName: global_data.curseData.tname,
                                    examId: jsonResponse.result.examId,
                                    isExam: global_data.curseData.isExam
                                });

                                reportAidChange();
                            }
                        } catch (error) {
                            console.error('Failed to parse response as JSON:', error);
                        }
                    }
                    callback?.call(this);
                };
            }
        };
    };

    const addDragFunctionality = (element) => {
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        const dragHandle = element.children[0];
        if (!dragHandle) return;

        const rect = element.getBoundingClientRect();
        xOffset = rect.left;
        yOffset = rect.top;

        dragHandle.style.cursor = 'move';
        dragHandle.style.userSelect = 'none';

        dragHandle.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        function dragStart(e) {
            e.stopPropagation();

            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;

            if (e.target === dragHandle || dragHandle.contains(e.target)) {
                isDragging = true;
                element.style.transition = 'none';
                element.style.left = xOffset + 'px';
                element.style.top = yOffset + 'px';
                element.style.right = 'auto';
            }
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;

                xOffset = currentX;
                yOffset = currentY;

                const windowWidth = window.innerWidth;
                const windowHeight = window.innerHeight;
                const elementWidth = element.offsetWidth;
                const elementHeight = element.offsetHeight;

                if (currentX < 0) currentX = 0;
                if (currentX > windowWidth - elementWidth) currentX = windowWidth - elementWidth;

                if (currentY < 0) currentY = 0;
                if (currentY > windowHeight - elementHeight) currentY = windowHeight - elementHeight;

                element.style.left = currentX + 'px';
                element.style.top = currentY + 'px';
                element.style.right = 'auto';
            }
        }

        function dragEnd(e) {
            if (isDragging) {
                initialX = currentX;
                initialY = currentY;
                isDragging = false;
                element.style.transition = 'all 0.2s ease';
            }
        }
    };

    let aid = null;
    let tid = null;

    const showNewUserGuide = () => {
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay';
        modalOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 10001;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        const modal = document.createElement('div');
        modal.className = 'new-user-guide-modal';
        modal.style.cssText = `
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow: hidden;
            transform: scale(0.9);
            transition: transform 0.3s ease;
        `;

        modal.innerHTML = `
            <div style="padding: 24px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2 style="margin: 0; color: #333; font-size: 20px;">欢迎使用慕课助手</h2>
                    <button class="close-btn" style="background: none; border: none; font-size: 24px; cursor: pointer; padding: 0; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border-radius: 50%;">×</button>
                </div>

                <div style="margin-bottom: 24px;">

                    <div style="background: #f8f9fa; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
                        <h3 style="margin: 0 0 12px 0; color: #007bff; font-size: 16px; display: flex; align-items: center;">
                            <span style="background: #007bff; color: white; border-radius: 50%; width: 20px; height: 20px; display: inline-flex; align-items: center; justify-content: center; margin-right: 8px; font-size: 12px;">1</span>
                            使用步骤
                        </h3>
                        <ol style="margin: 0; padding-left: 20px; color: #666; font-size: 14px;">
                            <li style="margin-bottom: 8px;">1.等待助手加载完成</li>
                            <li style="margin-bottom: 8px;">2.扫码进入小程序后，扫描绑定二维码完成账号绑定</li>
                            <li style="margin-bottom: 8px;">3.进入作业、测试或考试页面</li>
                            <li style="margin-bottom: 8px;">4.在小程序中查看答案</li>
                            <li style="margin-bottom: 8px;">5.按ESC控制窗口的显示和隐藏</li>
                        </ol>
                    </div>

                    <div style="background: #f8f9fa; border-radius: 8px; padding: 16px;">
                        <h3 style="margin: 0 0 12px 0; color: #007bff; font-size: 16px; display: flex; align-items: center;">
                            <span style="background: #007bff; color: white; border-radius: 50%; width: 20px; height: 20px; display: inline-flex; align-items: center; justify-content: center; margin-right: 8px; font-size: 12px;">2</span>
                            注意事项
                        </h3>
                        <ul style="margin: 0; padding-left: 20px; color: #666; font-size: 14px;">
                            <li style="margin-bottom: 8px;">1.可能题库中不存在题目的情况</li>
                            <li style="margin-bottom: 8px;">2.程序将收集用户的答案用于完善题库，不会收集个人信息</li>
                            <li style="margin-bottom: 8px;">3.请合理使用本工具，主要用于学习参考</li>
                            <li style="margin-bottom: 8px;">4.遵守平台使用规范，不要恶意刷题</li>
                        </ul>
                    </div>
                </div>

                <div style="display: flex; justify-content: flex-end;">
                    <button class="confirm-btn" style="background: #007bff; color: white; border: none; border-radius: 6px; padding: 10px 20px; font-size: 14px; cursor: pointer; transition: background 0.2s;">
                        开始使用
                    </button>
                </div>
            </div>
        `;

        modalOverlay.appendChild(modal);
        document.body.appendChild(modalOverlay);

        setTimeout(() => {
            modalOverlay.style.opacity = '1';
            modal.style.transform = 'scale(1)';
        }, 10);

        const closeBtn = modal.querySelector('.close-btn');
        const confirmBtn = modal.querySelector('.confirm-btn');

        const closeModal = () => {
            modalOverlay.style.opacity = '0';
            modal.style.transform = 'scale(0.9)';
            setTimeout(() => {
                document.body.removeChild(modalOverlay);
            }, 300);
        };

        closeBtn.addEventListener('click', closeModal);
        confirmBtn.addEventListener('click', () => {
            GM_setValue('hasCompletedGuide', true);
            closeModal();
        });

        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
    };

    // ================ 快捷键支持 ================
    let keysPressed = {};
    document.addEventListener('keydown', (event) => {
        keysPressed[event.key] = true;

        // Z+1: 显示慢刷控制面板
        if (keysPressed['z'] && keysPressed['1']) {
            keysPressed = {};
            const sidePanel = document.querySelector('[data-tab="slowlearn"]');
            if (sidePanel) {
                sidePanel.click();
            }
            toast.info('快捷键', '已切换到慢刷控制面板', 2000);
        }
        // Z+2: 开始慢刷
        else if (keysPressed['z'] && keysPressed['2']) {
            keysPressed = {};
            slow_skip_lesson(true);
            toast.info('慢刷启动', '慢刷任务已开始！', 3000);
        }
        // Z+3: 停止慢刷
        else if (keysPressed['z'] && keysPressed['3']) {
            keysPressed = {};
            global_data.slow = false;
            if (global_data.check_handle) clearInterval(global_data.check_handle);
            if (global_data.interval_check) clearInterval(global_data.interval_check);
            const progressElement = document.getElementById('lesson_progress');
            if (progressElement) {
                progressElement.style.color = 'red';
                progressElement.textContent = '未开始';
            }
            toast.info('慢刷已停止', '慢刷任务已停止');
        }
    });

    document.addEventListener('keyup', (event) => {
        keysPressed = {};
    });

    // 检查用户状态并根据结果决定是否加载脚本
    checkUserStatus().then(isEnabled => {
        if (isEnabled) {
            if (global_data.webUser.is_new_user || !GM_getValue('hasCompletedGuide', false)) {
                setTimeout(() => {
                    showNewUserGuide();
                }, 1500);
            }

            createUI();
            hookXHR();
            GM_setValue('webUser', global_data.webUser);
            setTimeout(() => {
                toast.success('脚本已加载', '慕课助手已成功加载！', 3000);
            }, 1000);
        } else {
            if (global_data.webUser && global_data.webUser.is_banned) {
                console.log('用户已被封禁，脚本不会加载');
                toast.error('账户被禁用', '您的账户已被禁用，无法使用此功能。如有疑问请联系管理员。', 0);
            } else if (global_data.webUser && global_data.webUser.is_bound === false) {
                console.log('用户未绑定，显示绑定二维码');
                createBindingUI();
                toast.info('需要绑定', '请扫描二维码完成账户绑定', 0);
            } else {
                console.log('用户状态异常，脚本不会加载');
                toast.error('状态异常', '用户状态异常，请检查登录状态。', 0);
            }
        }
    });
})();