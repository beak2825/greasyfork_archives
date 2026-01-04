// ==UserScript==
// @name         职业规划大赛闯关助手
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  专为全国大学生职业规划大赛「生涯闯关」环节设计的辅助脚本。支持一键自动完成所有关卡。
// @author       毫厘
// @match        https://zgs.chsi.com.cn/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      api.zgs.chsi.com.cn
// @connect      chsi-zyghds.oss-cn-beijing.aliyuncs.com
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555775/%E8%81%8C%E4%B8%9A%E8%A7%84%E5%88%92%E5%A4%A7%E8%B5%9B%E9%97%AF%E5%85%B3%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/555775/%E8%81%8C%E4%B8%9A%E8%A7%84%E5%88%92%E5%A4%A7%E8%B5%9B%E9%97%AF%E5%85%B3%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let capturedAuthToken = null;

    // --- 工具函数 ---
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
    function generateRandomText(min, max) { const len = Math.floor(Math.random() * (max - min + 1)) + min; const chars = '社会实践帮助我们塑造正确的价值观，通过亲身体验，能更深刻地理解国情、社情，增强社会责任感和历史使命感。在实践中，我们学会了团队合作，懂得了沟通与协调的重要性。面对挑战和困难，我们锻炼了解决问题的能力和坚韧不拔的意志。这些宝贵的经历不仅丰富了我们的知识，更提升了综合素质，为未来的职业生涯和人生发展奠定了坚实的基础。'; return Array.from({ length: len }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join(''); }
    function shuffleArray(array) { for (let i = array.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[array[i], array[j]] = [array[j], array[i]]; } return array; }
    function generateCommaSeparatedText() {
        const words = ['高数', '大物', '编程', '写作', '沟通', '协作', '领导力', '创新', '批判性思维', '数据分析', '项目管理', '英语', '演讲', '逻辑推理'];
        let result = [];
        let currentLength = -1;
        const targetLength = Math.floor(Math.random() * 80) + 15;
        while (currentLength < targetLength && result.length < 15) {
            const word = words[Math.floor(Math.random() * words.length)];
            if (currentLength + word.length + 1 > 100) break;
            result.push(word);
            currentLength += word.length + 1;
        }
        return result.join(',');
    }

    // --- 文件上传辅助函数 ---
    let _dummyPdfBlob = null;
    function getDummyPdfBlob() {
        if (_dummyPdfBlob) return _dummyPdfBlob;
        try {
            const pdfBase64 = "JVBERi0xLjQKJSAxIDAgb2JqPDwvVHlwZS9DYXRhbG9nL1BhZ2VzIDIgMCBSPj5lbmRvYmogMiAwIG9iago8PC9UeXBlL1BhZ2VzL0NvdW50IDEgL0tpZHNbMyAwIFJdPj5lbmRvYmogMyAwIG9iago8PC9UeXBlL1BhZ2UvUGFyZW50IDIgMCBSL01lZGlhQm94WzAgMCA2MTIgNzkyXS9SZXNvdXJjZXM8Pj4vQ29udGVudHMgNCAwIFI+PmVuZG9iago0IDAgb2JqPDwvTGVuZ3RoIDA+PnN0cmVhbQplbmRzdHJlYW0KZW5kb2JqCnhyZWYNCjAgNQ0KMDAwMDAwMDAwMCA2NTUzNSBmDQowMDAwMDAwMDE1IDAwMDAwIG4NCjAwMDAwMDAwNzEgMDAwMDAgbg0KMDAwMDAwMDEzMyAwMDAwMCBuDQowMDAwMDAwMjQzIDAwMDAwIG4NCnRyYWlsZXI8PC9TaXplIDUvUm9vdCAxIDAgUj4+DQpzdGFydHhyZWYNCjI4MQ0KJSVFT0YNCg==";
            const binaryString = window.atob(pdfBase64);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            _dummyPdfBlob = new Blob([bytes], { type: 'application/pdf' });
            return _dummyPdfBlob;
        } catch (e) {
            log('创建虚拟PDF文件失败: ' + e.message, 'error');
            throw new Error("Dummy PDF could not be created.");
        }
    }

    async function uploadFile(headers, filename = "report.pdf", type = 11) {
        log(`  - 开始上传文件: ${filename} (type: ${type})`);
        const ossTokenResponse = await request({ method: 'GET', url: `https://api.zgs.chsi.com.cn/osses/token?type=${type}&upload_type=pdf&upload_max_filesize=52428800`, headers: headers, });
        log('    - 已获取OSS Token。');
        const formData = new FormData();
        const key = `${ossTokenResponse.dir}${ossTokenResponse.name}.pdf`;
        formData.append('key', key); formData.append('name', filename); formData.append('policy', ossTokenResponse.policy); formData.append('OSSAccessKeyId', ossTokenResponse.accessid); formData.append('success_action_status', '200'); formData.append('callback', ossTokenResponse.callback); formData.append('x-oss-forbid-overwrite', 'true');
        formData.append('signature', ossTokenResponse.signature);
        formData.append('x-oss-signature', ossTokenResponse.signature);
        formData.append('x-oss-signature-version', ossTokenResponse.x_oss_signature_version);
        formData.append('x-oss-credential', ossTokenResponse.x_oss_credential);
        formData.append('x-oss-date', ossTokenResponse.x_oss_date);
        formData.append('file', getDummyPdfBlob(), filename);
        const uploadResponse = await new Promise((resolve, reject) => { GM_xmlhttpRequest({ method: 'POST', url: ossTokenResponse.host, headers: { 'Accept': 'application/json, text/plain, */*', 'Origin': 'https://zgs.chsi.com.cn' }, data: formData, onload: function(response) { if (response.status >= 200 && response.status < 300) { try { resolve(JSON.parse(response.responseText)); } catch (e) { reject(new Error("解析OSS响应失败: " + response.responseText)); } } else { reject({ message: `OSS上传失败 (${response.status})`, status: response.status, responseText: response.responseText }); } }, onerror: (err) => reject({ message: "OSS上传网络错误", error: err }) }); });
        log(`    - 文件上传成功: ${uploadResponse.file}`);
        return { name: filename, url: uploadResponse.file };
    }


    // --- 核心功能：Token捕获 & 智能请求 ---
    function setupUniversalTokenInterceptor() { const originalXhrSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader; XMLHttpRequest.prototype.setRequestHeader = function(header, value) { if (header.toLowerCase() === 'authorization' && value && value !== capturedAuthToken) { console.log('XHR拦截器捕获/更新Token!', value.substring(0, 20) + '...'); capturedAuthToken = value; updateTokenStatus('Token已就绪', true); } return originalXhrSetRequestHeader.apply(this, arguments); }; const originalFetch = window.fetch; window.fetch = function(...args) { try { const headers = new Headers(args[1]?.headers); if (headers.has('Authorization')) { const token = headers.get('Authorization'); if (token && token !== capturedAuthToken) { console.log('Fetch拦截器捕获/更新Token!', token.substring(0, 20) + '...'); capturedAuthToken = token; updateTokenStatus('Token已就绪', true); } } } catch (e) {} return originalFetch.apply(this, args); }; console.log('生涯闯关助手：通用Token拦截器已启动。'); }
    setupUniversalTokenInterceptor();

    async function request(options, retries = 3) {
        return new Promise((resolve, reject) => {
            const attempt = async (tryCount) => {
                GM_xmlhttpRequest({
                    ...options,
                    onload: res => {
                        try {
                            const json = JSON.parse(res.responseText || 'null');
                            if (res.status >= 200 && res.status < 300) {
                                return resolve(json);
                            }
                             const errorMsg = (json ? json.message : null) || res.statusText || `请求失败 (${res.status})`;
                            reject(new Error(errorMsg));
                        } catch (e) {
                             reject(new Error(`解析响应失败 (${res.status}): ${res.responseText.substring(0,100)}`));
                        }
                    },
                    onerror: err => {
                        if (options.method === 'GET' && tryCount < retries) {
                            log(`  - GET请求失败，${1 + tryCount}/${retries}次重试中...`, 'error');
                            setTimeout(() => attempt(tryCount + 1), 1000 * tryCount);
                        } else {
                            reject(new Error(`网络错误: ${err.error || '未知'}`));
                        }
                    },
                    ontimeout: () => {
                        if (options.method === 'GET' && tryCount < retries) {
                             log(`  - GET请求超时，${1 + tryCount}/${retries}次重试中...`, 'error');
                            setTimeout(() => attempt(tryCount + 1), 1000 * tryCount);
                        } else {
                             reject(new Error('请求超时'));
                        }
                    }
                });
            };
            attempt(0);
        });
    }

    async function ignorableRequest(options) {
        try {
            return await request(options);
        } catch (error) {
            if (error.message.includes('请勿重复点击')) {
                log(`  - [提示] ${error.message}，已自动忽略。`, 'info');
                return null;
            }
            throw error;
        }
    }

    // --- 业务逻辑 ---
    const CONFIG = {
        apiBase: 'https://api.zgs.chsi.com.cn',
        barriers: [
            { id: 1, name: '生涯愿景', func: completeBarrierOne },
            { id: 2, name: '专业探索', func: completeBarrierTwo },
            { id: 3, name: '职业瞭望', func: completeBarrierThree },
            { id: 5, name: '兴趣揭秘', func: completeBarrierFour },
            { id: 6, name: '目标锚定', func: completeBarrierFive },
            { id: 7, name: '能力盘点', func: completeBarrierSix },
            { id: 8, name: '技能提升', func: completeBarrierSeven },
            { id: 9, name: '生涯启航', func: completeBarrierEight },
        ]
    };

    function getHeaders() {
        const token = capturedAuthToken;
        if (!token) {
            const errorMsg = '错误：Token捕获失败。请尝试刷新页面或重新登录。';
            log(errorMsg, 'error');
            throw new Error(errorMsg);
        }
        return { 'Authorization': token, 'Content-Type': 'application/json', 'X-Client-Type': 'pc', 'Accept': 'application/json, text/plain, */*', 'Origin': 'https://zgs.chsi.com.cn', 'Referer': 'https://zgs.chsi.com.cn/', 'User-Agent': navigator.userAgent };
    }

    // --- 闯关函数 ---
    async function completeBarrierOne() {
        const barrierId = 1, logPrefix = `[关卡1]`;
        updateStatus(barrierId, '进行中...');
        try {
            const headers = getHeaders();
            log(`${logPrefix} 新知...`);
            await ignorableRequest({ method: 'POST', url: `${CONFIG.apiBase}/barrier-firsts/new-knowledge`, headers: headers, data: JSON.stringify({}) });
            log(`${logPrefix} 笃行...`);
            const existingModels = await request({ method: 'GET', url: `${CONFIG.apiBase}/barrier-firsts/role-model-list`, headers: headers });
            if (existingModels.length < 2) { await request({ method: 'POST', url: `${CONFIG.apiBase}/barrier-firsts/create-role-model`, headers: headers, data: JSON.stringify({ data: Array.from({ length: 2 - existingModels.length }, () => ({ name: generateRandomText(2, 10), position: generateRandomText(2, 10), unit: generateRandomText(2, 10) })), del_ids: [] }) }); }
            const newRoleModels = await request({ method: 'GET', url: `${CONFIG.apiBase}/barrier-firsts/role-model-list`, headers: headers });
            const modelToAnalyze = newRoleModels.find(m => m.barrierRoleModelAnalyze === null);

            if (modelToAnalyze) {
                try {
                    log(`${logPrefix} 分析榜样...`);
                    await request({ method: 'POST', url: `${CONFIG.apiBase}/barrier-firsts/create-role-model-analyze/${modelToAnalyze.id}`, headers: headers, data: JSON.stringify({ intro: generateRandomText(100, 300), reason: generateRandomText(100, 300), inspired: generateRandomText(100, 300) }) });
                } catch (error) {
                    if (error.message.includes('已有分析数据')) {
                        log(`${logPrefix} [提示] 榜样分析已存在，自动跳过。`);
                    } else {
                        throw error;
                    }
                }
            } else {
                log(`${logPrefix} 所有榜样均已分析，跳过。`);
            }

            log(`${logPrefix} 领悟...`);
            await request({ method: 'POST', url: `${CONFIG.apiBase}/barrier-firsts/create-career-retrospect`, headers: headers, data: JSON.stringify({ content: generateRandomText(100, 500) }) });
            updateStatus(barrierId, '成功!', 'success');
            log(`${logPrefix} ${CONFIG.barriers.find(b => b.id === barrierId).name} 已成功完成！`);
        } catch (error) { console.error(`${logPrefix} 处理失败:`, error); updateStatus(barrierId, `失败: ${error.message}`, 'error'); throw error; }
    }

    async function completeBarrierTwo() {
        const barrierId = 2, logPrefix = `[关卡2]`;
        updateStatus(barrierId, '进行中...');
        try {
            const headers = getHeaders();
            log(`${logPrefix} 新知...`);
            await ignorableRequest({ method: 'POST', url: `${CONFIG.apiBase}/barrier-seconds/new-knowledge`, headers: headers, data: JSON.stringify({}) });
            log(`${logPrefix} 篤行...`);
            await request({ method: 'POST', url: `${CONFIG.apiBase}/barrier-seconds/create-major`, headers: headers, data: JSON.stringify({ major_name: generateRandomText(5, 10), major_course: generateRandomText(210, 300), tunnel: generateRandomText(210, 300), interviewer: generateRandomText(210, 300), practice_mode: generateRandomText(210, 300) }) });
            await request({ method: 'POST', url: `${CONFIG.apiBase}/barrier-seconds/create-major-explore`, headers: headers, data: JSON.stringify({}) });
            log(`${logPrefix} 领悟...`);
            await request({ method: 'POST', url: `${CONFIG.apiBase}/barrier-seconds/create-comprehend`, headers: headers, data: JSON.stringify({ identity_change: generateRandomText(210, 300), favorite_major: generateRandomText(210, 300) }) });
            updateStatus(barrierId, '成功!', 'success');
            log(`${logPrefix} ${CONFIG.barriers.find(b => b.id === barrierId).name} 已成功完成！`);
        } catch (error) { console.error(`${logPrefix} 处理失败:`, error); updateStatus(barrierId, `失败: ${error.message}`, 'error'); throw error; }
    }

    async function completeBarrierThree() {
        const barrierId = 3, logPrefix = `[关卡3]`;
        updateStatus(barrierId, '进行中...');
        try {
            const headers = getHeaders();
            log(`${logPrefix} 新知...`);
            await ignorableRequest({ method: 'POST', url: `${CONFIG.apiBase}/barrier-thirds/new-knowledge`, headers: headers, data: JSON.stringify({}) });
            log(`${logPrefix} 篤行...`);
            await request({ method: 'POST', url: `${CONFIG.apiBase}/barrier-thirds/create-profession`, headers: headers, data: JSON.stringify({
                job:generateRandomText(5,20),
                major:generateRandomText(5,20),
                profession:generateRandomText(80,95),
                interviewer:generateRandomText(110,150)
            })});
            await request({ method: 'POST', url: `${CONFIG.apiBase}/barrier-thirds/create-profession-explore`, headers: headers, data: JSON.stringify({}) });
            log(`${logPrefix} 领悟...`);
            await request({ method: 'POST', url: `${CONFIG.apiBase}/barrier-thirds/create-comprehend`, headers: headers, data: JSON.stringify({ data: [{ profession_name: generateRandomText(2, 10) }, { profession_name: generateRandomText(2, 10) }], del_ids: [] }) });
            updateStatus(barrierId, '成功!', 'success');
            log(`${logPrefix} ${CONFIG.barriers.find(b => b.id === barrierId).name} 已成功完成！`);
        } catch (error) { console.error(`${logPrefix} 处理失败:`, error); updateStatus(barrierId, `失败: ${error.message}`, 'error'); throw error; }
    }

    async function completeBarrierFour() {
        const barrierId = 5, logPrefix = `[关卡4]`;
        updateStatus(barrierId, '进行中...');
        try {
            const headers = getHeaders();
            log(`${logPrefix} 新知...`);
            await ignorableRequest({ method: 'POST', url: `${CONFIG.apiBase}/barrier-fifths/new-knowledge`, headers: headers, data: JSON.stringify({}) });
            log(`${logPrefix} 篤行...`);
            const interestTypes = await request({ method: 'GET', url: `${CONFIG.apiBase}/barrier-fifths/career-interest-type-entry-list`, headers: headers });
            if (!Array.isArray(interestTypes) || interestTypes.length === 0) throw new Error('未能获取兴趣选项');
            const selectedTypes = shuffleArray([...interestTypes]).slice(0, 3);
            const interestPayloadData = selectedTypes.map((type, index) => {
                const entries = type.barrierWorkValueEntry;
                if (!entries || entries.length === 0) { log(`  - 警告: 兴趣类型 "${type.name}" 没有可选项，将跳过此项。`); return null; }
                const randomEntry = entries[Math.floor(Math.random() * entries.length)];
                return { type_id: type.id, entry_id: [randomEntry.id], sort: index + 1 };
            }).filter(Boolean);
            while (interestPayloadData.length < 6) { interestPayloadData.push({ type_id: "", entry_id: [] }); }
            await request({ method: 'POST', url: `${CONFIG.apiBase}/barrier-fifths/create-career-interest`, headers: headers, data: JSON.stringify({ data: interestPayloadData }) });
            const exploreList = await request({ method: 'GET', url: `${CONFIG.apiBase}/barrier-fifths/career-interest-explore-list`, headers: headers });
            if (exploreList && exploreList.length > 0) { await request({ method: 'POST', url: `${CONFIG.apiBase}/barrier-fifths/create-career-interest-explore`, headers: headers, data: JSON.stringify({ data: exploreList.map((item, index) => ({ profession_comprehend_id: item.id, interest_factor: generateRandomText(50, 100), sort: index + 1 })) }) }); }
            log(`${logPrefix} 领悟...`);
            await request({ method: 'POST', url: `${CONFIG.apiBase}/barrier-fifths/create-comprehend`, headers: headers, data: JSON.stringify({ interest_analyze_report: generateRandomText(100, 300), job_choose: generateRandomText(100, 300) }) });
            updateStatus(barrierId, '成功!', 'success');
            log(`${logPrefix} ${CONFIG.barriers.find(b => b.id === barrierId).name} 已成功完成！`);
        } catch (error) { console.error(`${logPrefix} 处理失败:`, error); updateStatus(barrierId, `失败: ${error.message}`, 'error'); throw error; }
    }

    async function completeBarrierFive() {
        const barrierId = 6, logPrefix = `[关卡5]`;
        updateStatus(barrierId, '进行中...');
        try {
            const headers = getHeaders();
            log(`${logPrefix} 锚定...`);
            await request({ method: 'POST', url: `${CONFIG.apiBase}/barrier-sixths/create-anchored-job-direction`, headers: headers, data: JSON.stringify({ data: [{ job_name: generateRandomText(10, 20) }, { job_name: generateRandomText(10, 20) }] }) });
            log(`${logPrefix} 笃行-1 (职业探索)...`);
            const jobAdFile = await uploadFile(headers, "zhaopinjianzhang.pdf");
            await request({ method: 'POST', url: `${CONFIG.apiBase}/barrier-sixths/create-job-explore`, headers: headers, data: JSON.stringify({ platform_info: generateRandomText(5, 15), file: [{ name: jobAdFile.name, url: jobAdFile.url, uid: Date.now() }], book: { data: [{ name: `《${generateRandomText(5,10)}》`, experience: generateRandomText(20, 50) }], del_ids: [] } }) });
            log(`${logPrefix} 笃行-2 (访谈报告)...`);
            const interviewList = await request({ method: 'GET', url: `${CONFIG.apiBase}/barrier-sixths/interview-report-list`, headers: headers });
            if (!Array.isArray(interviewList) || interviewList.length < 2) throw new Error('未能获取到足够的访谈报告项');
            const interviewFile1 = await uploadFile(headers, "fangtanbaogao_1.pdf"); const interviewFile2 = await uploadFile(headers, "fangtanbaogao_2.pdf");
            await request({ method: 'POST', url: `${CONFIG.apiBase}/barrier-sixths/create-interview-report`, headers: headers, data: JSON.stringify({ data: [{ id: interviewList[0].id, job_name: interviewList[0].job_name, job_file: { name: interviewFile1.name, url: interviewFile1.url } }, { id: interviewList[1].id, job_name: interviewList[1].job_name, job_file: { name: interviewFile2.name, url: interviewFile2.url } }] }) });
            log(`${logPrefix} 篤行-3 (实习记录)...`);
            const practiceFile = await uploadFile(headers, "shixibaogao.pdf");
            await request({ method: 'POST', url: `${CONFIG.apiBase}/barrier-sixths/create-practice-record`, headers: headers, data: JSON.stringify({ data: [{ practice_mode: generateRandomText(10, 20), practice_report: { name: practiceFile.name, url: practiceFile.url }, practice_add_material: [] }], del_ids: [] }) });
            log(`${logPrefix} 笃行-4 (信息整理)...`);
            const tidyList = await request({ method: 'GET', url: `${CONFIG.apiBase}/barrier-sixths/job-info-tidy-list`, headers: headers });
            if (!Array.isArray(tidyList) || tidyList.length < 2) throw new Error('未能获取到足够的信息整理项');
            await request({ method: 'POST', url: `${CONFIG.apiBase}/barrier-sixths/create-job-info-tidy`, headers: headers, data: JSON.stringify({ data: tidyList.map(item => ({ anchored_job_id: item.id, interest_meet: generateRandomText(10, 30), job_environment: generateRandomText(10, 30), job_reward: generateRandomText(10, 30), job_lift_balance: generateRandomText(10, 30), channel_chance: generateRandomText(10, 30), qualification_prepare: generateRandomText(10, 30), remark: generateRandomText(10, 30), short_term_target: generateRandomText(10, 30), other: generateRandomText(10, 30), id: null })) }) });
            log(`${logPrefix} 领悟...`);
            await request({ method: 'POST', url: `${CONFIG.apiBase}/barrier-sixths/create-comprehend`, headers: headers, data: JSON.stringify({ new_know: generateRandomText(110, 250) }) });
            updateStatus(barrierId, '成功!', 'success');
            log(`${logPrefix} ${CONFIG.barriers.find(b => b.id === barrierId).name} 已成功完成！`);
        } catch (error) { console.error(`${logPrefix} 处理失败:`, error); updateStatus(barrierId, `失败: ${error.message}`, 'error'); throw error; }
    }

    async function completeBarrierSix() {
        const barrierId = 7, logPrefix = `[关卡6]`;
        updateStatus(barrierId, '进行中...');
        try {
            const headers = getHeaders();
            log(`${logPrefix} 新知...`);
            await ignorableRequest({ method: 'POST', url: `${CONFIG.apiBase}/barrier-sevenths/new-knowledge`, headers: headers, data: JSON.stringify({}) });

            log(`${logPrefix} 笃行-技能...`);
            const skillList = await request({ method: 'GET', url: `${CONFIG.apiBase}/barrier-sevenths/skill-explore-list`, headers });
            const unprocessedItems = [...(skillList.major || []), ...(skillList.profession || [])].filter(item => item.is_checked === "0");
            const total = (skillList.major || []).length + (skillList.profession || []).length;
            const done = total - unprocessedItems.length;

            if (unprocessedItems.length > 0) {
                const item = unprocessedItems[0];
                const type = item.type.key === 1 ? '专业' : '职业';
                log(`  - 提交${type}技能: ${item.name} (${done + 1}/${total})...`);
                await request({ method: 'POST', url: `${CONFIG.apiBase}/barrier-sevenths/create-skill-explore`, headers, data: JSON.stringify({ knowledge_skill: generateCommaSeparatedText(), migrate_skill: generateCommaSeparatedText(), self_manage_skill: generateCommaSeparatedText(), type: item.type.key, explore_id: item.explore_id }) });
                updateStatus(barrierId, `进行中 (${done + 1}/${total})`, 'running');
                return true;
            }

            log(`  - 所有专业和职业技能均已完成.`);
            let finalSkillList = await request({ method: 'GET', url: `${CONFIG.apiBase}/barrier-sevenths/skill-explore-list`, headers });
            if (finalSkillList.summary?.[0]?.is_checked === "0") {
                log(`  - 提交技能汇总...`);
                const summaryView = await request({ method: 'GET', url: `${CONFIG.apiBase}/barrier-sevenths/skill-explore-view/0`, headers });
                await request({ method: 'POST', url: `${CONFIG.apiBase}/barrier-sevenths/create-skill-explore`, headers, data: JSON.stringify({ ...summaryView, type: 3, id: undefined }) });
            }
            await ignorableRequest({ method: 'POST', url: `${CONFIG.apiBase}/barrier-sevenths/commit-skill-explore`, headers, data: JSON.stringify({}) });

            log(`${logPrefix} 笃行-成就...`);
            const achievementList = await request({ method: 'GET', url: `${CONFIG.apiBase}/barrier-sevenths/achievement-store-list`, headers });
            if (achievementList.length === 0) {
                 log(`  - 提交成就故事...`);
                 await request({ method: 'POST', url: `${CONFIG.apiBase}/barrier-sevenths/create-achievement-store`, headers, data: JSON.stringify({ situation: generateRandomText(55, 95), task_target: generateRandomText(55, 95), action_attitude: generateRandomText(55, 95), result: generateRandomText(55, 95), show_major_knowledge_skill: generateRandomText(55, 95), show_migrate_skill: generateRandomText(55, 95), show_self_manage_skill: generateRandomText(55, 95) }) });
            }
            await ignorableRequest({ method: 'POST', url: `${CONFIG.apiBase}/barrier-sevenths/commit-achievement-store`, headers, data: JSON.stringify({}) });

            log(`${logPrefix} 领悟...`);
            let comprehendView = await request({ method: 'GET', url: `${CONFIG.apiBase}/barrier-sevenths/comprehend-view`, headers });
            if (comprehendView.comprehension && comprehendView.comprehension.length > 490) { comprehendView.comprehension = comprehendView.comprehension.substring(0, 490); }
            await request({ method: 'POST', url: `${CONFIG.apiBase}/barrier-sevenths/create-comprehend`, headers, data: JSON.stringify(comprehendView) });

            updateStatus(barrierId, '成功!', 'success');
            log(`${logPrefix} ${CONFIG.barriers.find(b => b.id === barrierId).name} 已成功完成！`);
        } catch (error) { console.error(`${logPrefix} 处理失败:`, error); updateStatus(barrierId, `失败: ${error.message}`, 'error'); throw error; }
    }

    async function completeBarrierSeven() {
        const barrierId = 8, logPrefix = `[关卡7]`;
        updateStatus(barrierId, '进行中...');
        try {
            const headers = getHeaders();
            log(`${logPrefix} 新知...`);
            await ignorableRequest({ method: 'POST', url: `${CONFIG.apiBase}/barrier-eighths/new-knowledge`, headers, data: JSON.stringify({}) });

            log(`${logPrefix} 篤行...`);
            const allSkillTypes = await request({ method: 'GET', url: `${CONFIG.apiBase}/barrier-eighths/skill-type-list`, headers });
            const existingWays = await request({ method: 'GET', url: `${CONFIG.apiBase}/barrier-eighths/skill-promote-way-list`, headers });
            const existingTypeKeys = existingWays.map(way => way.type.key);
            const neededType = allSkillTypes.find(type => !existingTypeKeys.includes(type.key));

            if (neededType) {
                log(`  - 创建技能类型 "${neededType.name}" 的提升途径... (${existingTypeKeys.length + 1}/${allSkillTypes.length})`);
                const allTimeList = await request({ method: 'GET', url: `${CONFIG.apiBase}/barrier-eighths/expect-time-list`, headers });
                const allEventList = await request({ method: 'GET', url: `${CONFIG.apiBase}/barrier-eighths/event-list`, headers });
                const randomTime = (allTimeList && allTimeList.length > 0) ? allTimeList[Math.floor(Math.random() * allTimeList.length)] : { key: "7" };
                const randomEvent = (allEventList && allEventList.length > 0) ? allEventList[Math.floor(Math.random() * allEventList.length)] : null;
                await request({ method: 'POST', url: `${CONFIG.apiBase}/barrier-eighths/create-skill-promote-way`, headers, data: JSON.stringify({ type: neededType.key, name: generateRandomText(5, 10), behavior: generateRandomText(100, 150), expect_result: generateRandomText(100, 150), expect_time_id: randomTime.key, need_resource: generateRandomText(100, 150), event: randomEvent ? { name: randomEvent.name } : { name: generateRandomText(20, 50) } }) });
                updateStatus(barrierId, `进行中 (${existingTypeKeys.length + 1}/${allSkillTypes.length})`);
                return true;
            }

            log(`  - 所有技能类型的提升途径均已创建.`);
            await ignorableRequest({ method: 'POST', url: `${CONFIG.apiBase}/barrier-eighths/commit-skill-promote-way`, headers, data: JSON.stringify({}) });
            log(`${logPrefix} 领悟...`);
            await request({ method: 'POST', url: `${CONFIG.apiBase}/barrier-eighths/create-comprehend`, headers, data: JSON.stringify({ comprehension: generateRandomText(100, 490) }) });
            updateStatus(barrierId, '成功!', 'success');
            log(`${logPrefix} ${CONFIG.barriers.find(b => b.id === barrierId).name} 已成功完成！`);
        } catch (error) { console.error(`${logPrefix} 处理失败:`, error); updateStatus(barrierId, `失败: ${error.message}`, 'error'); throw error; }
    }

    async function completeBarrierEight() {
        const barrierId = 9, logPrefix = `[关卡8]`;
        updateStatus(barrierId, '进行中...');
        try {
            const headers = getHeaders();
            log(`${logPrefix} 新知...`);
            await ignorableRequest({ method: 'POST', url: `${CONFIG.apiBase}/barrier-ninths/new-knowledge`, headers, data: JSON.stringify({}) });
            log(`${logPrefix} 笃行...`);
            const careerData = await request({ method: 'GET', url: `${CONFIG.apiBase}/barrier-ninths/career-explore-grow-view`, headers });
            await request({ method: 'POST', url: `${CONFIG.apiBase}/barrier-ninths/create-career-explore-grow`, headers, data: JSON.stringify(careerData) });
            log(`${logPrefix} 领悟...`);
            const uploadedFile = await uploadFile(headers, "qiuzhijihuashu.pdf", 10);
            await request({ method: 'POST', url: `${CONFIG.apiBase}/barrier-ninths/create-comprehend`, headers, data: JSON.stringify({ job_plan_name: uploadedFile.name, job_plan_url: uploadedFile.url }) });
            updateStatus(barrierId, '成功!', 'success');
            log(`🎉 ${logPrefix} ${CONFIG.barriers.find(b => b.id === barrierId).name} 已成功完成！`);
        } catch (error) { console.error(`${logPrefix} 处理失败:`, error); updateStatus(barrierId, `失败: ${error.message}`, 'error'); throw error; }
    }

    // --- UI界面 ---

    function initializeUI() {
        if (document.getElementById('zgs-helper-panel')) return;

        addPanelStyles();

        // 创建主面板
        const panel = document.createElement('div');
        panel.id = 'zgs-helper-panel';

        // 创建标题栏
        const header = document.createElement('div');
        header.className = 'zgs-panel-header';
        header.innerHTML = `
            <div class="zgs-panel-title">
                <strong>闯关助手</strong>
                <span class="zgs-version">v1.0</span>
            </div>
            <div id="zgs-token-status" class="zgs-token-status waiting">
                <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M12,2A10,10 0 1,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 1,1 4,12A8,8 0 0,1 12,4M12,11.5A1.5,1.5 0 1,0 13.5,13A1.5,1.5 0 0,0 12,11.5M12,6A1,1 0 0,0 11,7V10A1,1 0 0,0 13,10V7A1,1 0 0,0 12,6Z"></path></svg>
                <span>等待Token...</span>
            </div>
        `;
        panel.appendChild(header);

        // 创建控制区
        const controls = document.createElement('div');
        controls.className = 'zgs-panel-controls';
        const runAllBtn = document.createElement('button');
        runAllBtn.id = 'zgs-run-all-btn';
        runAllBtn.className = 'zgs-btn zgs-btn-primary';
        runAllBtn.innerHTML = `
            <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M10,17L5,12L6.41,10.58L10,14.17L17.59,6.58L19,8L10,17Z"></path></svg>
            一键通关
        `;
        controls.appendChild(runAllBtn);
        panel.appendChild(controls);


        // 创建任务列表
        const body = document.createElement('div');
        body.className = 'zgs-panel-body';
        CONFIG.barriers.forEach((b, index) => {
            const item = document.createElement('div');
            item.className = 'zgs-barrier-item';
            item.innerHTML = `
                <span class="zgs-barrier-index">${(index + 1).toString().padStart(2, '0')}</span>
                <span class="zgs-barrier-name">${b.name}</span>
                <span id="zgs-status-${b.id}" class="zgs-status"></span>
            `;
            const btn = document.createElement('button');
            btn.dataset.id = b.id;
            btn.className = 'zgs-btn zgs-btn-run';
            btn.textContent = '开始';
            item.appendChild(btn);
            body.appendChild(item);
        });
        panel.appendChild(body);

        // 创建日志区域
        const logContainer = document.createElement('div');
        logContainer.className = 'zgs-panel-log-container collapsed';
        const logHeader = document.createElement('div');
        logHeader.className = 'zgs-log-header';
        logHeader.innerHTML = '<span>运行日志</span>';
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'zgs-log-toggle';
        toggleBtn.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" /></svg>`;
        toggleBtn.onclick = () => logContainer.classList.toggle('collapsed');
        logHeader.appendChild(toggleBtn);

        const logOutput = document.createElement('div');
        logOutput.id = 'zgs-log-output';
        logContainer.appendChild(logHeader);
        logContainer.appendChild(logOutput);
        panel.appendChild(logContainer);

        document.body.appendChild(panel);
        makeDraggable(panel, header);

        // 绑定事件
        panel.querySelectorAll('.zgs-btn-run').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const button = e.target;
                button.disabled = true;
                const id = parseInt(button.dataset.id);
                const barrier = CONFIG.barriers.find(b => b.id === id);
                if (barrier && typeof barrier.func === 'function') {
                    let needsAnotherRun = true;
                     while (needsAnotherRun) {
                         try {
                            needsAnotherRun = await barrier.func();
                            if(needsAnotherRun) {
                                log(`[手动模式] 关卡 ${barrier.name} 仍有子任务，1.5秒后自动继续...`);
                                await sleep(1500);
                            }
                         } catch (err) {
                            log(`关卡 ${barrier.name} 运行出错，已停止。`, 'error');
                            needsAnotherRun = false;
                         }
                     }
                }
                button.disabled = false;
            });
        });

        runAllBtn.addEventListener('click', async (e) => {
            const button = e.currentTarget;
            button.disabled = true;
            log('🚀 开始执行一键通关任务...');

            for (const barrier of CONFIG.barriers) {
                const statusEl = document.getElementById(`zgs-status-${barrier.id}`);
                if (statusEl && statusEl.classList.contains('success')) {
                    log(`[跳过] 关卡 ${barrier.name} 已完成。`);
                    continue;
                }

                log(`--- 开始执行关卡: ${barrier.name} ---`);
                let needsAnotherRun = true;
                while (needsAnotherRun) {
                    try {
                        needsAnotherRun = await barrier.func();
                        if (needsAnotherRun === true) {
                            log(`[自动重试] 关卡 ${barrier.name} 仍有子任务，1.5秒后自动继续...`);
                            await sleep(1500);
                        }
                    } catch (runError) {
                        log(`❌ 关卡 ${barrier.name} 运行时出现错误: ${runError.message}`, 'error');
                        log('🛑 一键通关任务已中断。', 'error');
                        updateStatus(barrier.id, '异常中断', 'error');
                        button.disabled = false;
                        return;
                    }
                }
                log(`✅ 关卡 ${barrier.name} 全部子任务完成。`);
                await sleep(1500);
            }
            log('🎉🎉🎉 恭喜！所有关卡已全部自动完成！🎉🎉🎉', 'success');
            showSuccessBanner();
            button.disabled = false;
        });

        log('UI面板已加载。');
    }

    function makeDraggable(panel, handle) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        handle.onmousedown = dragMouseDown;
        function dragMouseDown(e) { e.preventDefault(); pos3 = e.clientX; pos4 = e.clientY; document.onmouseup = closeDragElement; document.onmousemove = elementDrag; }
        function elementDrag(e) { e.preventDefault(); pos1 = pos3 - e.clientX; pos2 = pos4 - e.clientY; pos3 = e.clientX; pos4 = e.clientY; panel.style.top = (panel.offsetTop - pos2) + "px"; panel.style.left = (panel.offsetLeft - pos1) + "px"; }
        function closeDragElement() { document.onmouseup = null; document.onmousemove = null; }
    }

    function showSuccessBanner() {
        const body = document.querySelector('.zgs-panel-body');
        if (!body || document.querySelector('.zgs-success-banner')) return;

        const banner = document.createElement('div');
        banner.className = 'zgs-success-banner';
        banner.innerHTML = `
            <strong>🎉 全部通关成功！</strong>
            <span>所有任务已顺利完成，祝您好运！</span>
        `;
        body.prepend(banner);
    }


    function addPanelStyles() {
        GM_addStyle(`
            :root {
                --panel-width: 360px; --panel-bg: #ffffff; --header-bg: #f7f8fa; --border-color: #e5e7eb;
                --text-color-primary: #1f2937; --text-color-secondary: #6b7280; --primary-color: #3b82f6;
                --primary-color-hover: #2563eb; --success-color: #10b981; --success-color-bg: #ecfdf5;
                --error-color: #ef4444; --warning-color: #f59e0b;
            }
            @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

            #zgs-helper-panel {
                position: fixed; top: 100px; right: 20px; width: var(--panel-width); background: var(--panel-bg);
                border: 1px solid var(--border-color); border-radius: 12px;
                box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);
                z-index: 9999; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
                font-size: 14px; color: var(--text-color-primary); transition: box-shadow 0.3s ease;
            }
            #zgs-helper-panel:hover { box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04); }

            .zgs-panel-header { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: var(--header-bg); border-bottom: 1px solid var(--border-color); border-top-left-radius: 12px; border-top-right-radius: 12px; cursor: move; user-select: none; }
            .zgs-panel-title { display: flex; align-items: baseline; gap: 8px; }
            .zgs-panel-title strong { font-size: 16px; }
            .zgs-version { font-size: 12px; color: var(--text-color-secondary); font-weight: 500; }

            .zgs-token-status { display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 500; padding: 4px 8px; border-radius: 6px; }
            .zgs-token-status.waiting { color: var(--warning-color); background-color: #fffbeb; }
            .zgs-token-status.ready { color: var(--success-color); background-color: var(--success-color-bg); }

            .zgs-panel-controls { padding: 12px 16px; border-bottom: 1px solid var(--border-color); }
            /* --- [MODIFIED] --- */
            .zgs-panel-body { padding: 8px; max-height: 500px; overflow-y: auto; }
            /* --- [END MODIFIED] --- */

            .zgs-barrier-item { display: flex; align-items: center; padding: 10px 8px; border-bottom: 1px solid #f3f4f6; }
            .zgs-barrier-item:last-child { border-bottom: none; }
            .zgs-barrier-index { font-weight: 500; color: var(--text-color-secondary); margin-right: 12px; }
            .zgs-barrier-name { flex-grow: 1; }

            .zgs-status { margin: 0 12px; font-weight: 600; font-size: 13px; min-width: 80px; text-align: right; display: flex; align-items: center; justify-content: flex-end; gap: 4px; }
            .zgs-status.success { color: var(--success-color); }
            .zgs-status.error { color: var(--error-color); }
            .zgs-status.running { color: var(--primary-color); }
            .zgs-status.running::before { content: ''; display: inline-block; width: 14px; height: 14px; border: 2px solid currentColor; border-top-color: transparent; border-radius: 50%; animation: spin 0.8s linear infinite; margin-right: 4px; }

            .zgs-btn { padding: 6px 14px; border: 1px solid transparent; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 600; white-space: nowrap; transition: all 0.2s ease; display: inline-flex; align-items: center; justify-content: center; gap: 6px; }
            .zgs-btn:disabled { opacity: 0.6; cursor: not-allowed; }
            .zgs-btn-run { background-color: #fff; border-color: var(--border-color); color: var(--text-color-primary); }
            .zgs-btn-run:hover:not(:disabled) { background-color: #f9fafb; border-color: #d1d5db; }
            .zgs-btn-primary { background-color: var(--primary-color); color: white; border-color: var(--primary-color); }
            .zgs-btn-primary:hover:not(:disabled) { background-color: var(--primary-color-hover); border-color: var(--primary-color-hover); }

            /* --- [NEW] --- */
            .zgs-success-banner {
                margin: 8px; padding: 12px 16px; background-color: var(--success-color-bg);
                color: #065f46; border: 1px solid #a7f3d0; border-radius: 8px; text-align: center;
                font-size: 14px; line-height: 1.5;
            }
            .zgs-success-banner strong { display: block; font-size: 16px; margin-bottom: 4px; color: #047857; }
            /* --- [END NEW] --- */

            .zgs-panel-log-container { border-top: 1px solid var(--border-color); background: #fdfdfd; }
            .zgs-log-header { display: flex; justify-content: space-between; align-items: center; padding: 8px 16px; font-weight: 600; cursor: pointer; color: var(--text-color-secondary); }
            .zgs-log-toggle { background: none; border: none; cursor: pointer; padding: 4px; border-radius: 50%; line-height: 0;}
            .zgs-log-toggle:hover { background: #f0f0f0; }
            .zgs-log-toggle svg { transition: transform 0.3s ease; }
            .zgs-panel-log-container.collapsed .zgs-log-toggle svg { transform: rotate(-90deg); }
            #zgs-log-output { height: 150px; overflow-y: scroll; font-size: 12px; color: #4b5563; background: var(--panel-bg); padding: 8px 12px; white-space: pre-wrap; word-wrap: break-word; line-height: 1.6; border-top: 1px solid var(--border-color); display: none; }
            .zgs-panel-log-container:not(.collapsed) #zgs-log-output { display: block; }
            #zgs-log-output div { padding: 2px 0; border-bottom: 1px solid #f3f4f6; }
            #zgs-log-output div:last-child { border-bottom: none; }
        `);
    }

    function log(message, type = 'info') { const logOutput = document.getElementById('zgs-log-output'); if (!logOutput) { console.log(message); return; } const time = new Date().toLocaleTimeString('it-IT'); const div = document.createElement('div'); div.innerHTML = `<span style="color: #9ca3af; margin-right: 8px;">[${time}]</span> ${message}`; if(type === 'error') div.style.color = 'var(--error-color)'; if(type === 'success') div.style.color = 'var(--success-color)'; logOutput.appendChild(div); logOutput.scrollTop = logOutput.scrollHeight; }
    function updateStatus(id, text, type = 'running') { const statusEl = document.getElementById(`zgs-status-${id}`); if (statusEl) { statusEl.textContent = text; statusEl.className = `zgs-status ${type}`; } }
    function updateTokenStatus(text, isReady = false) { const statusEl = document.getElementById('zgs-token-status'); if (statusEl) { statusEl.className = `zgs-token-status ${isReady ? 'ready' : 'waiting'}`; const textEl = statusEl.querySelector('span'); if(textEl) textEl.textContent = text; if (isReady) { statusEl.querySelector('svg path').setAttribute('d', 'M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,16.5L6.5,12L7.91,10.59L11,13.67L16.09,8.59L17.5,10L11,16.5Z'); } } }

    // --- 脚本初始化 ---
    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', initializeUI);
    } else {
        initializeUI();
    }
})();