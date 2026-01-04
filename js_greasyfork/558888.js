// ==UserScript==
// @name         Bangumi 图片上传增强
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  支持剪切板粘贴/本地上传图片；支持 Ry.mk/SDA1/Catbox/PicGo/ImgBB
// @author       zin
// @match        *://bgm.tv/*
// @match        *://bangumi.tv/*
// @match        *://chii.in/*
// @connect      p.sda1.dev
// @connect      catbox.moe
// @connect      bgmchat.ry.mk
// @connect      www.picgo.net
// @connect      api.imgbb.com
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558888/Bangumi%20%E5%9B%BE%E7%89%87%E4%B8%8A%E4%BC%A0%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/558888/Bangumi%20%E5%9B%BE%E7%89%87%E4%B8%8A%E4%BC%A0%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置与状态 ---
    const KEYS = { HOST: 'userscript_img_host', PICGO: 'userscript_picgo_key', IMGBB: 'userscript_imgbb_key' };
    const DEFAULT_HOST = 'rymk'; // 默认改为更稳定的 ry.mk
    const ICON = `data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2217%22%20height%3D%2217%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22black%22%20stroke-width%3D%222.3%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20stroke%3D%22none%22%20d%3D%22M0%200h24v24H0z%22%20fill%3D%22none%22/%3E%3Cpath%20d%3D%22M3%206h5l2%202h11a2%202%200%200%201%202%202v8a2%202%200%200%201-2%202H3a2%202%200%200%201-2-2V8a2%202%200%200%201%202-2z%22/%3E%3C/svg%3E`;

    let state = { host: DEFAULT_HOST, picgoKey: '', imgbbKey: '', uploadCount: 0 };

    // --- 工具函数 ---
    const Config = {
        get: (k, def) => (typeof chiiApp !== 'undefined' && chiiApp.cloud_settings?.get(k)) || localStorage.getItem(k) || def,
        set: (k, v) => {
            localStorage.setItem(k, v);
            if (typeof chiiApp !== 'undefined' && chiiApp.cloud_settings) {
                chiiApp.cloud_settings.update({ [k]: v });
                chiiApp.cloud_settings.save();
            }
        },
        init() {
            state.host = this.get(KEYS.HOST, DEFAULT_HOST);
            state.picgoKey = this.get(KEYS.PICGO, '');
            state.imgbbKey = this.get(KEYS.IMGBB, '');
        }
    };
    Config.init();

    GM_addStyle(`.markItUpButton.tool_custom_upload a{background:url('${ICON}') no-repeat center/14px !important}.img-uploader-panel{padding:10px;line-height:2}.img-uploader-panel h3{border-bottom:1px solid #eee;padding-bottom:5px;margin-bottom:10px;font-weight:bold}.api-settings-box{margin-top:15px;padding:10px;background:#f9f9f9;border-radius:5px;border:1px solid #eee}.api-settings-box h4{margin:0 0 5px 0;font-weight:bold;color:#444}.api-settings-box .tip-link{color:#999;font-size:12px}.api-settings-box .tip-link a{text-decoration:underline;color:#0084B4}.save-status{margin-left:8px;font-size:12px;color:#00a000;opacity:0;transition:opacity .3s;font-weight:bold}.save-status.visible{opacity:1}html[data-theme="dark"] .img-uploader-panel h3{border-bottom-color:#444;color:#eee}html[data-theme="dark"] .api-settings-box{background:#2d2e2f;border-color:#444}html[data-theme="dark"] .api-settings-box h4{color:#ccc}html[data-theme="dark"] .api-settings-box input[type="text"]{background-color:#1b1b1b;color:#eee;border:1px solid #444}html[data-theme="dark"] .save-status{color:#4caf50}`);

    // --- UI 注入 ---
    const observer = new MutationObserver(() => {
        document.querySelectorAll('li.tool_img').forEach(btn => {
            if (!btn.nextElementSibling?.classList.contains('tool_custom_upload')) insertBtn(btn);
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    const insertBtn = (targetBtn) => {
        const li = document.createElement('li');
        li.className = 'markItUpButton tool_custom_upload tool_ico';
        const a = document.createElement('a');
        Object.assign(a, { href: 'javascript:;', title: '上传本地图片', innerText: '上传本地图片' });
        Object.assign(a.style, { textIndent: '-9999px', display: 'block' });

        a.onclick = (e) => {
            e.preventDefault();
            const input = document.createElement('input');
            input.type = 'file'; input.accept = 'image/*'; input.multiple = true;
            input.onchange = () => {
                if (!input.files.length) return;
                const container = targetBtn.closest('.markItUpContainer');
                const form = targetBtn.closest('form');
                const area = container?.querySelector('textarea') || form?.querySelector('textarea') || form?.querySelector('input[type="text"]');

                area ? Array.from(input.files).forEach(f => processFile(f, area)) : alert('未找到输入框');
            };
            input.click();
        };
        li.appendChild(a);
        targetBtn.after(li);
    };

    // --- 设置面板 ---
    if (typeof chiiLib !== 'undefined' && chiiLib.ukagaka?.addPanelTab) {
        chiiLib.ukagaka.addPanelTab({
            tab: 'img_uploader', label: '图片助手', type: 'custom',
            customContent: () => `
                <div class="img-uploader-panel">
                    <h3>图床选择</h3>
                    <div>${['ry.mk','p.sda1.dev','catbox','picgo','imgbb'].map(v =>
                        `<label style="display:block"><input type="radio" name="script_host" value="${v}" ${state.host===v?'checked':''}> ${v.toUpperCase()} ${v==='picgo'||v==='imgbb'?'(需 Key)':v==='catbox'?'(需代理)':''}</label>`
                    ).join('')}</div>
                    ${renderApiBox('picgo', 'PicGo', state.picgoKey, 'https://www.picgo.net/settings/api', 'PicGo 设置')}
                    ${renderApiBox('imgbb', 'ImgBB', state.imgbbKey, 'https://api.imgbb.com/', 'ImgBB API')}
                </div>`,
            onInit: (s, $c) => {
                $c.on('change', 'input[name="script_host"]', function() {
                    const v = $(this).val();
                    state.host = v; Config.set(KEYS.HOST, v);
                    $c.find('.api-settings-box').slideUp(200);
                    if(v==='picgo'||v==='imgbb') $c.find(`#${v}-settings`).slideDown(200);
                });
                const bindSave = (id, keyName, stateKey) => {
                    let t;
                    $c.on('input', id, function() {
                        const v = $(this).val().trim();
                        state[stateKey] = v; Config.set(keyName, v);
                        const $s = $(this).parent().next('.save-status');
                        clearTimeout(t);
                        $s.text('保存中...').addClass('visible');
                        t = setTimeout(() => { $s.text('已保存'); setTimeout(() => $s.removeClass('visible'), 2000); }, 600);
                    });
                };
                bindSave('#script_picgo_key', KEYS.PICGO, 'picgoKey');
                bindSave('#script_imgbb_key', KEYS.IMGBB, 'imgbbKey');
            }
        });
    }

    function renderApiBox(id, name, val, link, linkText) {
        return `<div id="${id}-settings" class="api-settings-box" style="display:${state.host===id?'block':'none'}">
            <h4>${name} 配置</h4>
            <div style="display:flex;align-items:center"><label>API Key: <input type="text" id="script_${id}_key" class="inputtext" style="width:200px;padding:2px 5px" value="${val}" autocomplete="off"></label><span class="save-status">已保存</span></div>
            <div class="tip-link">请在 <a href="${link}" target="_blank">${linkText}</a> 获取 Key</div>
        </div>`;
    }

    // --- 事件监听 ---
    const handle = (e, type) => {
        const t = e.target;
        if (!['TEXTAREA', 'INPUT'].includes(t.tagName)) return;
        if (type === 'paste') {
            const f = Array.from(e.clipboardData.items).find(i => i.type.includes('image'))?.getAsFile();
            if (f) { e.preventDefault(); processFile(f, t); }
        } else if (type === 'drop') {
            const u = e.dataTransfer.getData('text/uri-list') || e.dataTransfer.getData('text/plain');
            if (u && /\.(jpg|jpeg|png|gif|webp|bmp|svg)($|\?|#)/i.test(u)) { e.preventDefault(); insertText(t, `[img]${u}[/img]`); }
        }
    };
    document.addEventListener('paste', e => handle(e, 'paste'));
    document.addEventListener('drop', e => handle(e, 'drop'));

    // --- 上传逻辑 ---
    async function processFile(file, area) {
        const btn = (area.form || document).querySelector('input[type="submit"], button, .inputBtn[name="submit"]');
        updateBtn(btn, true);
        try {
            const url = await upload(file);
            insertText(area, `[img]${url}[/img]`);
            updateBtn(btn, false);
        } catch (e) {
            console.error(e);
            if (e === 'Missing Key') alert(`请先在设置面板配置 ${state.host} 的 API Key`);
            updateBtn(btn, false, true);
        }
    }

    function upload(file) {
        return new Promise((resolve, reject) => {
            const fd = new FormData();
            const strategies = {
                sda1: () => req(`https://p.sda1.dev/api_dup${Math.floor(Math.random()*10)}/v1/upload_noform?filename=${encodeURIComponent(file.name)}`, file,
                    { headers: {'Content-Type': file.type || 'application/octet-stream'}, parser: r => r.response?.code==='success'?r.response.data.url:null }),
                rymk: () => (fd.append('image', file), req('https://bgmchat.ry.mk/api/upload', fd, { parser: r => r.response?.imageUrl })),
                picgo: () => {
                    if (!state.picgoKey) return reject('Missing Key');
                    fd.append('source', file);
                    req('https://www.picgo.net/api/1/upload', fd, { headers: {'X-API-Key': state.picgoKey}, parser: r => r.response?.status_code===200?r.response.image.url:null });
                },
                imgbb: () => {
                    if (!state.imgbbKey) return reject('Missing Key');
                    fd.append('image', file);
                    req(`https://api.imgbb.com/1/upload?key=${state.imgbbKey}`, fd, { parser: r => r.response?.data?.url });
                },
                catbox: () => (fd.append('reqtype','fileupload'), fd.append('fileToUpload', file), req('https://catbox.moe/user/api.php', fd, { type: 'text', parser: r => r.responseText.startsWith('http')?r.responseText.trim():null }))
            };
            (strategies[state.host] || strategies[DEFAULT_HOST])();

            function req(url, data, { headers, type='json', parser }={}) {
                GM_xmlhttpRequest({ method: 'POST', url, data, headers, responseType: type,
                    onload: r => r.status===200 ? (parser(r) ? resolve(parser(r)) : reject('Parse Err')) : reject(`HTTP ${r.status}`),
                    onerror: () => reject('Net Err')
                });
            }
        });
    }

    function insertText(field, text) {
        const [start, end] = [field.selectionStart, field.selectionEnd];
        field.value = (start||start===0) ? field.value.slice(0, start) + text + field.value.slice(end) : field.value + text;
        field.dispatchEvent(new Event('input', { bubbles: true }));
        field.focus();
    }

    function updateBtn(btn, loading, err) {
        if (!btn) return;
        if (loading) {
            if (!state.uploadCount) btn.dataset.origin = btn.value || btn.innerText;
            state.uploadCount++;
            setBtn(btn, `上传中...(${state.uploadCount})`, true, '#999');
        } else {
            state.uploadCount = Math.max(0, state.uploadCount - 1);
            if (err) {
                setBtn(btn, '上传失败', true, '#d9534f');
                setTimeout(() => updateBtn(btn, false), 2000);
            } else if (!state.uploadCount) {
                setBtn(btn, btn.dataset.origin || '加上去', false, '');
            } else {
                setBtn(btn, `上传中...(${state.uploadCount})`, true, '#999');
            }
        }
    }

    function setBtn(btn, txt, dis, bg) {
        btn.disabled = dis; btn.value = txt; btn.style.backgroundColor = bg;
        Object.assign(btn.style, bg ? {color:'#fff',cursor:'not-allowed',boxShadow:'none'} : {color:'',cursor:'',boxShadow:''});
    }
})();