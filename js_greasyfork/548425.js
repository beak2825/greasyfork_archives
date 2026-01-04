// ==UserScript==
// @name         ☆标注记录小助手☆
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  在标注记录列表显示图片和无效理由
// @author       damu
// @match        https://qlabel.tencent.com/workbench/label-tasks*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548425/%E2%98%86%E6%A0%87%E6%B3%A8%E8%AE%B0%E5%BD%95%E5%B0%8F%E5%8A%A9%E6%89%8B%E2%98%86.user.js
// @updateURL https://update.greasyfork.org/scripts/548425/%E2%98%86%E6%A0%87%E6%B3%A8%E8%AE%B0%E5%BD%95%E5%B0%8F%E5%8A%A9%E6%89%8B%E2%98%86.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let imgVisible = false; // 图片展示状态
    let imgRequestNum = 0; // 调用次数

    let imgDataMap = {}; // 存储图片数据
    let invalidReasonMap = {}; // 存储无效理由
    let questionsMap = {}; // 存储原题“问题”数据
    let detailFormMap = {}; // 存储最终填写的答案数据

    // 获取图片数据
    function getImgByPackKey(pack_key) {
        return imgDataMap[pack_key] || null;
    }

    // 获取无效理由
    function getInvalidReasonByPackKey(pack_key) {
        return invalidReasonMap[pack_key] || '';
    }

    // 获取原题“问题”数据
    function getsrcQuestionByPackKey(pack_key) {
        return questionsMap[pack_key] || '';
    }

    // 获取最终填写的答案数据
    function getdetailFormInfoByPackKey(pack_key) {
        return detailFormMap[pack_key] || '';
    }

    // 监听指定接口并存储数据
    function listenRequest() {
        const targetUrl = "api/workbench/listMyLabelDetailLog"; // 目标地址
        return new Promise((resolve) => {
            const originalOpen = XMLHttpRequest.prototype.open;
            const originalSend = XMLHttpRequest.prototype.send;

            XMLHttpRequest.prototype.open = function (method, url, ...rest) {
                if (url.includes(targetUrl)) {
                    this._method = method;
                    this._url = url;
                }
                return originalOpen.call(this, method, url, ...rest);
            };

            XMLHttpRequest.prototype.send = function (...args) {
                if (this._url && this._url.includes(targetUrl)) {
                    this.addEventListener('load', () => {
                        let result;
                        try {
                            result = JSON.parse(this.responseText);
                            result.result.data.forEach(element => {
                                // 存储图片数据
                                imgDataMap[element.pack_key] = JSON.parse(element.dataset_item_content).url;
                                // 存储“问题”数据
                                questionsMap[element.pack_key] = JSON.parse(element.dataset_item_content).q_refine;
                                // 最终填写的答案数据
                                try {
                                    detailFormMap[element.pack_key] = JSON.parse(element.detail_label).tags || ''; // tags:[{"name":"xxx","label":"问题","value":"xxx"},  {"name":"xxx","label":"答案","value":"xxx"}, {"name":"xxx","label":"备注","value":"xxx"} ,......]
                                } catch {
                                    detailFormMap[element.pack_key] = '';
                                }
                                // 存储无效理由
                                try {
                                    invalidReasonMap[element.pack_key] = JSON.parse(element.detail_label).invalidTags[0].value || '';
                                } catch {
                                    invalidReasonMap[element.pack_key] = '';
                                }
                            });
                        } catch {
                            result = this.responseText;
                            imgDataMap = {};
                            invalidReasonMap = {};
                        }
                        setTimeout(() => { imgRequestNum++; }, 30);
                        resolve(result);
                    });
                }
                return originalSend.apply(this, args);
            };
        });
    }
    listenRequest();

    let appendCount = 0;

    // 切换图片展示状态
    function changeImgVisible() {
        imgVisible = !imgVisible;
        const tableHeader = document.querySelector('.ivu-table-header table');
        const thead = tableHeader?.querySelector('thead tr');
        const tableBody = document.querySelector('.ivu-table-body table');
        const tbody = tableBody?.querySelector('tbody');
        if (!thead || !tbody) return;
        // 要隐藏的列
        const toBeHideIndex = [1, 5, 7];
        let i = 0;
        if (imgVisible) {
            // 隐藏无关列的表头
            if (thead.children.length >= 10) toBeHideIndex.forEach(i => { thead.children[i].style.display = 'none'; });

            // 插入表头答题内容列
            const srcQuestionTh = document.createElement('th');
            srcQuestionTh.innerHTML = '<div class="ivu-table-cell"><span>原题</span></div>';
            srcQuestionTh.style.width = '400px';
            thead.appendChild(srcQuestionTh);

            // 插入表头备注/无效理由列
            const shortInfoTh = document.createElement('th');
            shortInfoTh.innerHTML = '<div class="ivu-table-cell"><span>备注/无效理由</span></div>';
            shortInfoTh.style.width = '100px';
            thead.appendChild(shortInfoTh);

            // 插入表头图片列
            const imgTh = document.createElement('th');
            imgTh.innerHTML = '<div class="ivu-table-cell"><span>图片</span></div>';
            imgTh.style.width = '120px';
            thead.appendChild(imgTh);

            appendCount = 0;
            // 为每行插入相关信息并隐藏无关列内容
            tbody.querySelectorAll('tr').forEach(tr => {
                // 隐藏无关列内容
                if (tr.children.length >= 10) toBeHideIndex.forEach(i => { tr.children[i].style.display = 'none'; });
                const td = tr.children[2];
                const packKey = td.querySelector('span')?.textContent || '';

                // 原题
                const srcQuestionTd = document.createElement('td');
                srcQuestionTd.innerHTML = `<div class="ivu-table-cell">${getsrcQuestionByPackKey(packKey)}</div>`;
                tr.appendChild(srcQuestionTd);


                // 备注/无效理由
                const shortInfoTd = document.createElement('td');
                // 答题数据 [{"name":"xxx","label":"问题","value":"xxx"},  {"name":"xxx","label":"答案","value":"xxx"}, {"name":"xxx","label":"备注","value":"xxx"} ,......]
                const detailFormInfo = getdetailFormInfoByPackKey(packKey);
                let partInfoStr = '备注： 置空';
                let infoArr = [];
                if (detailFormInfo) {
                    detailFormInfo.forEach(data => {
                        if (data.value && data.label === "备注") partInfoStr = "备注： " + data.value;
                        infoArr.push({ label: data.label, value: data.value });
                    });
                } else {
                    partInfoStr = "-";
                }
                // 无效理由
                const invalidReason = getInvalidReasonByPackKey(packKey);
                if (invalidReason) {
                    // 插入无效理由单元格
                    shortInfoTd.innerHTML = `<div class="ivu-table-cell">无效理由：<span style="color:red;">${invalidReason}</span></div>`;
                } else {
                    shortInfoTd.innerHTML = `<div class="ivu-table-cell">${partInfoStr}<br>
                                                <a style="color:#1677ff;cursor:pointer;text-decoration:underline" data-info='${encodeURIComponent(JSON.stringify(infoArr))}' onclick='(function(s){
                                                    let arr=JSON.parse(decodeURIComponent(s));
                                                    let d=document.createElement("div");
                                                    Object.assign(d.style,{position:"fixed",top:"50%",left:"50%",transform:"translate(-50%,-50%)",background:"#fff",padding:"24px",border:"2px solid #1677ff",boxShadow:"0 8px 30px rgba(0,0,0,0.3)",maxWidth:"80%",maxHeight:"70%",overflow:"auto",zIndex:9999,fontFamily:"Segoe UI,Arial",lineHeight:"1.6"});
                                                    let header=document.createElement("div");Object.assign(header.style,{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"10px"});
                                                    let title=document.createElement("div");title.textContent="答题详情";Object.assign(title.style,{color:"#1677ff",fontWeight:"bold",fontSize:"16px"});
                                                    let closeBtn=document.createElement("button");Object.assign(closeBtn.style,{background:"none",border:"none",fontSize:"16px",cursor:"pointer",color:"#666"});closeBtn.textContent="关闭 ×";closeBtn.onmouseover=()=>closeBtn.style.color="#000";closeBtn.onmouseout=()=>closeBtn.style.color="#666";closeBtn.onclick=()=>d.remove();
                                                    header.appendChild(title);header.appendChild(closeBtn);d.appendChild(header);
                                                    let c=document.createElement("div");arr.forEach(it=>{let lbl=document.createElement("div");lbl.textContent=it.label;Object.assign(lbl.style,{color:"#1677ff",fontWeight:"bold",marginTop:"10px"});
                                                    let val=document.createElement("div");val.textContent=it.value;Object.assign(val.style,{border:"1px solid #ccc",background:"#f8f8f8",borderRadius:"6px",padding:"8px 10px",marginTop:"4px",width:"100%",boxSizing:"border-box",minHeight:"1.6em"});
                                                    c.appendChild(lbl);c.appendChild(val);});d.appendChild(c);document.body.appendChild(d);
                                                })(this.getAttribute("data-info"));'>查看答题详情</a>
                                             </div>`;
                }
                tr.appendChild(shortInfoTd);


                // 插入图片单元格
                const imgTd = document.createElement('td');
                const img = getImgByPackKey(packKey);
                if (img && !img.startsWith(`https://hunyuan-prod-`)) {
                    imgTd.innerHTML = `<div class="ivu-table-cell"><img src="${img}" style="height:300px;width:auto;border-radius:4px;"></div>`;
                } else {
                    imgTd.innerHTML = `<div class="ivu-table-cell"><span>⚠️此图无法加载！<span/></div>`;
                }
                tr.appendChild(imgTd);

                appendCount++;
            });

        } else {
            let removeCount = 0;
            // 显示无关列的表头
            if (thead.children.length >= 10) {
                toBeHideIndex.forEach(i => {
                    if (removeCount++ < appendCount) {
                        thead.removeChild(thead.lastChild);
                        thead.children[i].style.display = '';
                    }
                });
            }
            removeCount = 0;
            // 显示无关列的内容
            tbody.querySelectorAll('tr').forEach(tr => {
                if (removeCount++ < appendCount) {
                    if (tr.children.length >= 10) {
                        toBeHideIndex.forEach(i => {
                            tr.removeChild(tr.lastChild);
                            tr.children[i].style.display = '';

                        });
                    }
                }
            });
        }
    }

    // 去抖动
    function debounce(func, delay) {
        let timeoutId;
        return function () {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, arguments), delay);
        };
    }

    // 创建开关按钮并插入表格上方表单区域
    const btnObserver = new MutationObserver(debounce((mutations, obs) => {
        if (document.getElementById('showImgBtn')) return; // 按钮已存在
        const container = document.querySelector('.table-filter .t-space');
        if (container) {
            const btnDiv = document.createElement('div');
            btnDiv.className = "t-space-item";
            const btn = document.createElement('button');
            btnDiv.appendChild(btn);
            btn.id = 'showImgBtn';
            btn.textContent = '辅助开关';
            btn.className = "t-button t-button--variant-base t-button--theme-default";
            btn.style.cssText = 'margin-left:16px;padding:2px 8px;border-radius:4px;border:1px solid #409EFF;background:#fff;color:#409EFF;cursor:pointer;';
            container.appendChild(btnDiv);
            btn.addEventListener('click', () => { stopObserving(); changeImgVisible(); startObserving(); });
        }
    }, 100));
    btnObserver.observe(document.body, { childList: true, subtree: true });

    // 监听页面变化自动同步
    const observer = new MutationObserver(debounce(() => {
        if (imgVisible && imgRequestNum > 1) {
            imgRequestNum = 1;
            changeImgVisible();
            setTimeout(() => {
                changeImgVisible();
            }, 10);
        }
    }, 30));
    startObserving();
    // 启动监听
    function startObserving() {
        observer.observe(document.body, { childList: true, subtree: true });
    }
    // 停止监听
    function stopObserving() {
        observer.disconnect();
    }
})();