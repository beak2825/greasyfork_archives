// ==UserScript==
// @name         WHUT 一键评教
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  WHUT教务系统一键评教脚本。可视化展示课程列表（进行中/已完成/未开始/已结束）。支持一键全选、自定义评价内容、随机评分策略（90%满分+10%波动）。
// @author       毫厘
// @match        *://jwxt.whut.edu.cn/jwapp/sys/pjapp/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556466/WHUT%20%E4%B8%80%E9%94%AE%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/556466/WHUT%20%E4%B8%80%E9%94%AE%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * ==========================================
     * 配置与状态 (State)
     * ==========================================
     */
    const STORE = {
        courses: [], // 课程数据
        termCode: '', // 学期代码
        isRunning: false, // 运行状态
        config: {
            // 默认评价内容
            comment: localStorage.getItem('whut_pj_comment') || "老师讲课重点突出，条理清晰，内容丰富，受益匪浅。",
            // 请求间隔(ms)
            delay: parseInt(localStorage.getItem('whut_pj_delay')) || 1500,
            // 随机评分开关 (true: 开启随机, false: 全满分)
            randomScore: localStorage.getItem('whut_pj_random') === 'true'
        }
    };

    /**
     * ==========================================
     * API 服务 (API Service)
     * ==========================================
     */
    const API = {
        async post(url, dataStr) {
            try {
                const res = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    body: dataStr
                });
                return await res.json();
            } catch (e) {
                console.error("[WHUT-PJ] API Error:", e);
                return null;
            }
        },

        // 1. 获取当前学期
        async getCurrentTerm() {
            const params = "ZCSDM=DQXNXQDM&CSDM=SYS&SFSY=1&*order=%2BPX%2C%2BWID";
            const res = await this.post('/jwapp/sys/jwpubapp/modules/gg/cxmrxnxq.do', params);
            return res?.datas?.cxmrxnxq?.rows?.[0]?.XNXQDM || "";
        },

        // 2. 获取评教类型
        async getPjlx(termCode) {
            const params = termCode ? `XNXQDM=${termCode}` : "";
            const res = await this.post('/jwapp/sys/pjapp/api/wdpj/getPjlx.do', params);
            return res?.datas?.getPjlx || [];
        },

        // 3. 获取课程列表
        async getListByType(pjlxCode, termCode) {
            const querySetting = [
                {"name":"PJLXDM","value":pjlxCode,"builder":"equal","linkOpt":"AND"}
            ];
            if (termCode) {
                querySetting.push({"name":"XNXQDM","value":termCode,"builder":"m_value_equal","linkOpt":"AND"});
            }
            const params = `PJLXDM=${pjlxCode}&querySetting=${encodeURIComponent(JSON.stringify(querySetting))}`;
            const res = await this.post('/jwapp/sys/pjapp/api/wdpj/getDpwj.do', params);
            return res?.datas?.getDpwj || [];
        },

        // 4. 获取题目
        async getQuestions(course) {
            const params = `GROUPNO=${course.GROUPNO}&PJLXDM=${course.PJLXDM||'01'}&XUH=${course.XUH||1}&JXBID=${course.JXBID||''}&KCH=${course.KCH||''}`;
            const res = await this.post('/jwapp/sys/pjapp/api/wdpj/getWjtxxx.do', params);
            return res?.datas?.getWjtxxx || null;
        },

        // 5. 提交评教
        async submitCourse(course, logCallback) {
            try {
                logCallback(`获取题目...`);
                const wjData = await this.getQuestions(course);

                if (!wjData || !wjData.teachers || wjData.teachers.length === 0) {
                    throw new Error("无题目数据");
                }

                const teacherInfo = wjData.teachers[0];
                const correctPJGXID = teacherInfo.PJGXID;
                const correctWJID = wjData.WJID;
                const daArray = [];

                // 遍历题目构造答案
                wjData.questionList.forEach(q => {
                    // 客观题 (01)
                    if (q.TX === '01' && q.questionOptions.length > 0) {
                        // 按分数降序排列
                        const options = [...q.questionOptions].sort((a, b) => b.FZ - a.FZ);
                        let selectedOption = options[0]; // 默认最高分

                        // 随机策略: 10% 概率选次高分 (模拟真实感)
                        if (STORE.config.randomScore && Math.random() > 0.9 && options.length > 1) {
                            selectedOption = options[1];
                        }

                        const simpleDA = { "TMXXID": selectedOption.WID, "FJXX": "" };
                        daArray.push({
                            "DA": simpleDA,
                            "XXID": selectedOption.WID,
                            "DAStr": JSON.stringify(simpleDA),
                            "YWZJ": correctPJGXID,
                            "WID": "",
                            "DF": selectedOption.FZ,
                            "WJID": correctWJID,
                            "TMID": q.TMID,
                            "TX": "01"
                        });
                    }
                    // 主观题 (02)
                    else if (q.TX === '02') {
                        daArray.push({
                            "DA": STORE.config.comment,
                            "DAStr": STORE.config.comment,
                            "YWZJ": correctPJGXID,
                            "WID": "",
                            "DF": null,
                            "WJID": correctWJID,
                            "TMID": q.TMID,
                            "TX": "02"
                        });
                    }
                });

                // 构造 Payload
                const payload = [{
                    "XM": teacherInfo.XM,
                    "KCM": teacherInfo.KCM,
                    "PJZT": "1",
                    "DF": "100.0",
                    "PJGXID": correctPJGXID,
                    "DA": daArray,
                    "XUH": course.XUH || 1,
                    "FJTXXX": { "TKZC": "12", "WID": "" },
                    "WJID": correctWJID,
                    "questionAnswers": JSON.stringify(daArray)
                }];
                const postData = "requestParamStr=" + encodeURIComponent(JSON.stringify(payload));

                // 计算 & 提交
                await this.post('/jwapp/sys/pjapp/api/wdpj/calculateQuestionnaireAnswerScore.do', postData);
                const res = await this.post('/jwapp/sys/pjapp/api/wdpj/commitQuestionnaireAnswer.do', postData);

                if (res && res.code === '0') return { success: true };
                return { success: false, msg: res ? res.msg : '失败' };

            } catch (e) {
                return { success: false, msg: e.message };
            }
        }
    };

    /**
     * ==========================================
     * UI 组件 (UI Component)
     * ==========================================
     */
    const UI = {
        panelVisible: true, // 面板显示状态

        init() {
            if(document.getElementById('whut-panel')) return;

            // 创建浮动按钮（最小化状态）
            const floatBtn = document.createElement('div');
            floatBtn.id = 'whut-float-btn';
            floatBtn.style.cssText = `
                position: fixed; top: 20px; right: 20px; z-index: 99998;
                width: 56px; height: 56px; border-radius: 50%;
                background: linear-gradient(135deg, #1e88e5 0%, #1565c0 100%);
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                display: none; align-items: center; justify-content: center;
                cursor: move; transition: all 0.3s ease;
                font-size: 24px; user-select: none;
            `;
            floatBtn.innerHTML = '🎓';
            floatBtn.title = '打开评教面板';
            floatBtn.onclick = () => UI.togglePanel(true);
            document.body.appendChild(floatBtn);

            // 浮动按钮拖动功能
            UI.initFloatBtnDrag();

            // 创建主面板
            const panel = document.createElement('div');
            panel.id = 'whut-panel';
            panel.style.cssText = `
                position: fixed; top: 60px; right: 20px; z-index: 99999; width: 360px;
                background: #fff; border-radius: 8px; box-shadow: 0 8px 30px rgba(0,0,0,0.15);
                font-family: 'Microsoft YaHei', sans-serif; font-size: 13px; display: flex; flex-direction: column;
                max-height: 85vh; border: 1px solid #e0e0e0; overflow: hidden;
                transition: all 0.3s ease;
            `;

            panel.innerHTML = `
                <div id="whut-header" style="padding: 12px 15px; background: linear-gradient(135deg, #1e88e5 0%, #1565c0 100%); color: white; display: flex; justify-content: space-between; align-items: center; cursor: move; user-select: none;">
                    <span style="font-weight: bold; pointer-events: none;">🎓 WHUT 评教小助手 (v1.0)</span>
                    <div>
                        <span id="whut-settings-btn" style="cursor:pointer; margin-right: 12px; opacity:0.9; font-size: 16px;" title="设置">⚙️</span>
                        <span id="whut-collapse-btn" style="cursor:pointer; margin-right: 12px; opacity:0.9; font-size: 14px;" title="收起">▼</span>
                        <span id="whut-minimize-btn" style="cursor:pointer; opacity:0.9; font-size: 18px;" title="最小化">−</span>
                    </div>
                </div>

                <div id="whut-panel-content" style="display: flex; flex-direction: column; flex: 1; overflow: hidden;">
                    <div id="whut-toast" style="background:rgba(0,0,0,0.8); color:white; padding:8px 16px; position:absolute; top:50px; left:50%; transform:translateX(-50%); border-radius:20px; font-size:12px; display:none; z-index:100; white-space:nowrap; pointer-events:none;"></div>

                    <div id="whut-status-bar" style="padding: 8px 12px; background: #f5f5f5; border-bottom: 1px solid #eee; color: #666; font-size: 12px;">⏳ 初始化...</div>

                    <div id="whut-list-area" style="flex: 1; overflow-y: auto; padding: 0; background: #fff; min-height: 300px;"></div>

                    <div style="padding: 10px; background: #fafafa; border-top: 1px solid #eee; display: flex; gap: 8px;">
                        <button id="whut-refresh-btn" style="flex:1; padding: 8px; border: 1px solid #ccc; border-radius: 4px; background: white; cursor: pointer; transition: all 0.2s;">🔄 刷新</button>
                        <button id="whut-run-btn" style="flex:2; padding: 8px; border: none; border-radius: 4px; background: #43a047; color: white; font-weight: bold; cursor: pointer; transition: all 0.2s;">🚀 开始评教</button>
                    </div>
                </div>

                <!-- Settings Modal -->
                <div id="whut-settings-modal" style="display:none; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: white; z-index: 50; border-radius: 8px; overflow: hidden; flex-direction: column;">
                    <div style="padding: 12px 15px; background: linear-gradient(135deg, #1e88e5 0%, #1565c0 100%); color: white; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0;">
                        <span style="font-weight: bold;">🛠️ 脚本配置</span>
                        <span id="whut-cfg-close" style="cursor:pointer; opacity:0.9; font-size: 20px;" title="关闭">✕</span>
                    </div>

                    <div style="padding: 15px; overflow-y: auto; flex: 1; min-height: 0;">
                        <div style="margin-bottom: 15px;">
                            <label style="display:block; font-weight:bold; margin-bottom:5px; color:#333;">评价内容:</label>
                            <textarea id="whut-cfg-comment" style="width: 100%; height: 80px; padding: 8px; border: 1px solid #ddd; border-radius: 4px; resize: vertical; font-family: inherit; box-sizing: border-box;"></textarea>
                        </div>

                        <div style="margin-bottom: 15px;">
                            <label style="display:block; font-weight:bold; margin-bottom:5px; color:#333;">评分策略:</label>
                            <select id="whut-cfg-random" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
                                <option value="false">💯 全满分 (默认)</option>
                                <option value="true">🎲 随机波动 (推荐)</option>
                            </select>
                        </div>

                        <div style="margin-bottom: 15px;">
                            <label style="display:block; font-weight:bold; margin-bottom:5px; color:#333;">间隔 (ms):</label>
                            <input type="number" id="whut-cfg-delay" min="500" max="5000" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
                        </div>
                    </div>

                    <div style="padding: 15px; border-top: 1px solid #eee; background: #fafafa; flex-shrink: 0;">
                        <div style="display: flex; gap: 8px; justify-content: flex-end;">
                            <button id="whut-cfg-cancel" style="padding: 8px 20px; border: 1px solid #ddd; background: white; border-radius: 4px; cursor: pointer; transition: all 0.2s;">取消</button>
                            <button id="whut-cfg-save" style="padding: 8px 20px; border: none; background: linear-gradient(135deg, #1e88e5 0%, #1565c0 100%); color: white; border-radius: 4px; cursor: pointer; font-weight: bold; transition: all 0.2s;">保存</button>
                        </div>
                    </div>
                </div>
            `;

            document.body.appendChild(panel);

            // 拖动功能
            UI.initDrag();

            // Events
            document.getElementById('whut-minimize-btn').onclick = () => UI.togglePanel(false);
            document.getElementById('whut-collapse-btn').onclick = () => UI.toggleCollapse();
            document.getElementById('whut-refresh-btn').onclick = Logic.loadData;
            document.getElementById('whut-run-btn').onclick = Logic.runSelected;

            // 按钮悬停效果
            const refreshBtn = document.getElementById('whut-refresh-btn');
            const runBtn = document.getElementById('whut-run-btn');
            refreshBtn.onmouseenter = () => refreshBtn.style.background = '#f5f5f5';
            refreshBtn.onmouseleave = () => refreshBtn.style.background = 'white';
            runBtn.onmouseenter = () => runBtn.style.background = '#2e7d32';
            runBtn.onmouseleave = () => runBtn.style.background = '#43a047';

            // Settings Events
            const modal = document.getElementById('whut-settings-modal');
            document.getElementById('whut-settings-btn').onclick = () => {
                modal.style.display = 'flex';
                document.getElementById('whut-cfg-comment').value = STORE.config.comment;
                document.getElementById('whut-cfg-delay').value = STORE.config.delay;
                document.getElementById('whut-cfg-random').value = STORE.config.randomScore.toString();
            };
            document.getElementById('whut-cfg-close').onclick = () => { modal.style.display = 'none'; };
            document.getElementById('whut-cfg-cancel').onclick = () => { modal.style.display = 'none'; };
            document.getElementById('whut-cfg-save').onclick = () => {
                STORE.config.comment = document.getElementById('whut-cfg-comment').value;
                STORE.config.delay = parseInt(document.getElementById('whut-cfg-delay').value);
                STORE.config.randomScore = document.getElementById('whut-cfg-random').value === 'true';
                localStorage.setItem('whut_pj_comment', STORE.config.comment);
                localStorage.setItem('whut_pj_delay', STORE.config.delay);
                localStorage.setItem('whut_pj_random', STORE.config.randomScore);
                modal.style.display = 'none';
                UI.showToast('✅ 配置已保存');
            };

            Logic.loadData();
        },

        // 面板拖动功能
        initDrag() {
            const panel = document.getElementById('whut-panel');
            const header = document.getElementById('whut-header');
            let isDragging = false;
            let currentX, currentY, initialX, initialY;

            header.addEventListener('mousedown', (e) => {
                if (e.target.id === 'whut-header' || e.target.style.pointerEvents === 'none') {
                    isDragging = true;
                    initialX = e.clientX - panel.offsetLeft;
                    initialY = e.clientY - panel.offsetTop;
                    panel.style.transition = 'none';
                }
            });

            document.addEventListener('mousemove', (e) => {
                if (isDragging) {
                    e.preventDefault();
                    currentX = e.clientX - initialX;
                    currentY = e.clientY - initialY;

                    // 边界限制
                    currentX = Math.max(0, Math.min(currentX, window.innerWidth - panel.offsetWidth));
                    currentY = Math.max(0, Math.min(currentY, window.innerHeight - 60));

                    panel.style.left = currentX + 'px';
                    panel.style.top = currentY + 'px';
                    panel.style.right = 'auto';
                }
            });

            document.addEventListener('mouseup', () => {
                if (isDragging) {
                    isDragging = false;
                    panel.style.transition = 'all 0.3s ease';
                }
            });
        },

        // 浮动按钮拖动功能
        initFloatBtnDrag() {
            const floatBtn = document.getElementById('whut-float-btn');
            let isDragging = false;
            let currentX, currentY, initialX, initialY;

            floatBtn.addEventListener('mousedown', (e) => {
                // 只在非点击展开时触发拖动
                isDragging = true;
                initialX = e.clientX - floatBtn.offsetLeft;
                initialY = e.clientY - floatBtn.offsetTop;
                floatBtn.style.transition = 'none';
                e.preventDefault();
            });

            document.addEventListener('mousemove', (e) => {
                if (isDragging) {
                    e.preventDefault();
                    currentX = e.clientX - initialX;
                    currentY = e.clientY - initialY;

                    // 边界限制
                    currentX = Math.max(0, Math.min(currentX, window.innerWidth - 56));
                    currentY = Math.max(0, Math.min(currentY, window.innerHeight - 56));

                    floatBtn.style.left = currentX + 'px';
                    floatBtn.style.top = currentY + 'px';
                    floatBtn.style.right = 'auto';
                    floatBtn.style.bottom = 'auto';
                }
            });

            document.addEventListener('mouseup', (e) => {
                if (isDragging) {
                    isDragging = false;
                    floatBtn.style.transition = 'all 0.3s ease';
                    // 延迟执行onclick，避免拖动后触发点击
                    setTimeout(() => {
                        floatBtn.onclick = (event) => {
                            if (!isDragging) UI.togglePanel(true);
                        };
                    }, 50);
                }
            });
        },

        // 切换面板显示/隐藏
        togglePanel(show) {
            const panel = document.getElementById('whut-panel');
            const floatBtn = document.getElementById('whut-float-btn');

            if (show) {
                panel.style.display = 'flex';
                floatBtn.style.display = 'none';
                UI.panelVisible = true;
            } else {
                panel.style.display = 'none';
                floatBtn.style.display = 'flex';
                UI.panelVisible = false;
            }
        },

        // 收起/展开内容区
        toggleCollapse() {
            const content = document.getElementById('whut-panel-content');
            const btn = document.getElementById('whut-collapse-btn');
            const panel = document.getElementById('whut-panel');

            if (content.style.display === 'none') {
                content.style.display = 'flex';
                btn.innerText = '▼';
                btn.title = '收起';
                panel.style.height = 'auto';
            } else {
                content.style.display = 'none';
                btn.innerText = '▶';
                btn.title = '展开';
                panel.style.height = 'auto';
            }
        },

        setStatus(msg) {
            const el = document.getElementById('whut-status-bar');
            if(el) el.innerHTML = msg;
        },

        showToast(msg) {
            const toast = document.getElementById('whut-toast');
            if(!toast) return;
            toast.innerText = msg;
            toast.style.display = 'block';
            setTimeout(() => { toast.style.display = 'none'; }, 3000);
        },

        // 分组构建 (含全选)
        createGroup(title, color, isOpen, isCheckable = false) {
            const group = document.createElement('div');
            const header = document.createElement('div');
            header.style.cssText = `padding: 8px 12px; background: #f5f7fa; border-bottom: 1px solid #eee; border-top: 1px solid #eee; font-weight: bold; font-size: 12px; color: ${color}; cursor: pointer; display: flex; align-items: center;`;

            let checkHtml = '';
            if (isCheckable) {
                checkHtml = `<input type="checkbox" class="whut-group-cb" style="margin-right:8px;" checked>`;
            }

            header.innerHTML = `${checkHtml}<span style="flex:1">${title}</span><span class="arrow" style="font-size:10px; color:#999;">${isOpen?'▼':'▶'}</span>`;

            const content = document.createElement('div');
            content.style.display = isOpen ? 'block' : 'none';

            // 折叠
            header.onclick = (e) => {
                if (e.target.type !== 'checkbox') {
                    const show = content.style.display === 'none';
                    content.style.display = show ? 'block' : 'none';
                    header.querySelector('.arrow').innerText = show ? '▼' : '▶';
                }
            };

            // 全选
            if (isCheckable) {
                const cb = header.querySelector('.whut-group-cb');
                cb.onchange = (e) => {
                    const items = content.querySelectorAll('.whut-course-cb:not([disabled])');
                    items.forEach(i => i.checked = e.target.checked);
                };
            }

            group.appendChild(header);
            group.appendChild(content);
            return { container: group, content };
        },

        createItem(c, idx) {
            const div = document.createElement('div');
            div.style.cssText = `padding: 8px 12px; background: white; border-bottom: 1px solid #f0f0f0; display: flex; align-items: center;`;

            let badge = '';
            let disabled = true;
            let checked = false;

            if (c._status === 'done') {
                badge = `<span style="color:#1976d2; font-size:10px;">已完成</span>`;
                disabled = false; // 允许重评
            } else if (c._status === 'ing') {
                badge = `<span style="color:#2e7d32; font-size:10px;">进行中</span>`;
                disabled = false;
                checked = true;
            } else if (c._status === 'wait') {
                badge = `<span style="color:#9e9e9e; font-size:10px;">未开始</span>`;
            } else {
                badge = `<span style="color:#c62828; font-size:10px;">已结束</span>`;
            }

            div.innerHTML = `
                <input type="checkbox" class="whut-course-cb" value="${idx}" ${disabled?'disabled':''} ${checked?'checked':''} style="margin-right:10px; cursor:pointer;">
                <div style="flex:1; font-size:12px;">
                    <div style="color:#333; font-weight:bold;">${c.KCM}</div>
                    <div style="color:#888;">${c.XM}</div>
                </div>
                <div style="text-align:right;">
                    ${badge}
                    <div id="whut-log-${idx}" style="font-size:10px; color:#ff9800; height:14px;"></div>
                </div>
            `;
            return div;
        }
    };

    /**
     * ==========================================
     * 业务逻辑 (Logic)
     * ==========================================
     */
    const Logic = {
        async loadData() {
            UI.setStatus("🔄 获取课程数据...");
            const listArea = document.getElementById('whut-list-area');
            listArea.innerHTML = '';
            STORE.courses = [];

            try {
                const term = await API.getCurrentTerm();
                if (!term) { UI.setStatus("❌ 无法获取学期"); return; }
                STORE.termCode = term;

                let types = await API.getPjlx(term);
                if (!types || types.length === 0) types = [{PJLXDM:'01', PJLXMC:'默认'}];

                let allCourses = [];
                for (let t of types) {
                    const code = t.PJLXDM || t.DM || '01';
                    const list = await API.getListByType(code, term);
                    list.forEach(c => { c.PJLXDM = code; c.PJLXMC = t.PJLXMC || t.MC || ''; });
                    allCourses = allCourses.concat(list);
                }

                STORE.courses = allCourses;
                Logic.renderGroups(allCourses);
                UI.setStatus(`✅ 就绪: 共 ${allCourses.length} 门课程 (${term})`);

            } catch (e) {
                console.error(e);
                UI.setStatus("❌ 数据加载异常");
            }
        },

        renderGroups(courses) {
            const listArea = document.getElementById('whut-list-area');
            if (courses.length === 0) {
                listArea.innerHTML = '<div style="text-align:center; padding:30px; color:#999;">暂无课程</div>';
                return;
            }

            const groups = { ing: [], wait: [], end: [] };
            const now = new Date();

            courses.forEach((c, idx) => {
                c._idx = idx;
                // 安全解析时间，防止报错
                let start = new Date();
                let end = new Date();
                try {
                    if (c.KSSJ) start = new Date(c.KSSJ.replace(/-/g, "/"));
                    if (c.JSSJ) end = new Date(c.JSSJ.replace(/-/g, "/"));
                } catch(e) { console.log("时间解析失败", c); }

                if (c.BPJSSFYPG === '1') {
                    c._status = 'done';
                    groups.ing.push(c); // 已完成归入进行中方便查看
                } else if (now < start) {
                    c._status = 'wait';
                    groups.wait.push(c);
                } else if (now > end) {
                    c._status = 'end';
                    groups.end.push(c);
                } else {
                    c._status = 'ing';
                    groups.ing.push(c);
                }
            });

            // 渲染分组
            if (groups.ing.length > 0) {
                const g = UI.createGroup(`🟢 进行中 / 已完成 (${groups.ing.length})`, '#2e7d32', true, true);
                groups.ing.forEach(c => g.content.appendChild(UI.createItem(c, c._idx)));
                listArea.appendChild(g.container);
            }
            if (groups.wait.length > 0) {
                const g = UI.createGroup(`⚪ 未开始 (${groups.wait.length})`, '#757575', false);
                groups.wait.forEach(c => g.content.appendChild(UI.createItem(c, c._idx)));
                listArea.appendChild(g.container);
            }
            if (groups.end.length > 0) {
                const g = UI.createGroup(`🔴 已结束 (${groups.end.length})`, '#c62828', false);
                groups.end.forEach(c => g.content.appendChild(UI.createItem(c, c._idx)));
                listArea.appendChild(g.container);
            }
        },

        async runSelected() {
            if (STORE.isRunning) return;
            const checkboxes = document.querySelectorAll('.whut-course-cb:checked');
            if (checkboxes.length === 0) { UI.showToast("请先选择课程"); return; }

            STORE.isRunning = true;
            const btn = document.getElementById('whut-run-btn');
            btn.disabled = true; btn.innerText = '⏳ 处理中...';
            btn.style.background = '#9e9e9e';

            let success = 0;
            for (let i = 0; i < checkboxes.length; i++) {
                const idx = checkboxes[i].value;
                const course = STORE.courses[idx];
                const logEl = document.getElementById(`whut-log-${idx}`);

                logEl.innerText = "提交中...";
                const res = await API.submitCourse(course, (msg) => logEl.innerText = msg);

                if (res.success) {
                    logEl.innerHTML = "<span style='color:green'>✅ 完成</span>";
                    success++;
                } else {
                    logEl.innerHTML = `<span style='color:red'>❌ ${res.msg}</span>`;
                }

                if (i < checkboxes.length - 1) await new Promise(r => setTimeout(r, STORE.config.delay));
            }

            STORE.isRunning = false;
            btn.disabled = false; btn.innerText = '🚀 开始评教';
            btn.style.background = '#43a047';
            UI.showToast(`🎉 任务完成！成功: ${success} / 总数: ${checkboxes.length}`);
            UI.setStatus(`✨ 评教结束，成功 ${success} 门`);
        }
    };

    window.addEventListener('load', () => setTimeout(UI.init, 1000));
})();