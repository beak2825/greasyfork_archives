// ==UserScript==
// @name         Tier Placeholder Tile
// @namespace    http://tampermonkey.net/
// @version      2.1.4
// @description  Create editable placeholder tiles and auto-insert/upload them into TierMaker templates
// @author       Liminality Dreams
// @match        https://tiermaker.com/*
// @icon         https://i.pinimg.com/736x/ae/d8/49/aed849cca00ffd2a756b107ae91075f9.jpg
// @grant        none
// @license GNU 3.0
// @downloadURL https://update.greasyfork.org/scripts/554827/Tier%20Placeholder%20Tile.user.js
// @updateURL https://update.greasyfork.org/scripts/554827/Tier%20Placeholder%20Tile.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function $(s, ctx=document){return ctx.querySelector(s)}
    function $all(s, ctx=document){return Array.from((ctx||document).querySelectorAll(s))}

    function ensureUi() {
        if (document.getElementById('tm-placeholder-ui')) return;
        const ui = document.createElement('div');
        ui.id = 'tm-placeholder-ui';
        ui.style.position = 'fixed';
        ui.style.right = '12px';
        ui.style.top = '12px';
        ui.style.zIndex = 2147483647;
        ui.style.width = '300px';
        ui.style.fontFamily = 'Inter, Arial, sans-serif';
        ui.style.boxShadow = '0 8px 24px rgba(0,0,0,0.4)';
        ui.style.borderRadius = '12px';
        ui.style.background = '#0f0f10';
        ui.style.color = '#eee';
        ui.style.padding = '8px';
        ui.style.backdropFilter = 'blur(4px)';
        ui.innerHTML = `
            <div id="tm-header" style="display:flex;align-items:center;gap:8px">
                <img id="tm-icon" src="https://i.pinimg.com/736x/ae/d8/49/aed849cca00ffd2a756b107ae91075f9.jpg" style="width:34px;height:34px;border-radius:6px;flex:0 0 34px;object-fit:cover" />
                <div style="flex:1">
                    <div style="font-weight:600">Tier Placeholder Tile</div>
                    <div style="font-size:11px;opacity:.7">Create, drag, upload</div>
                </div>
                <button id="tm-min" style="background:#111;border:1px solid #222;color:#ddd;padding:6px;border-radius:6px;cursor:pointer">—</button>
            </div>
            <div id="tm-body" style="margin-top:8px">
                <label style="font-size:12px;opacity:.8">Text</label>
                <input id="tm-text" type="text" maxlength="40" placeholder="placeholder text" style="width:100%;padding:6px;margin-top:4px;border-radius:8px;border:1px solid #222;background:#09090a;color:#eee"/>
                <div style="display:flex;gap:8px;margin-top:8px;align-items:center">
                    <div style="flex:1">
                        <label style="font-size:12px;opacity:.8">Background</label>
                        <input id="tm-color" type="color" value="#b76bff" style="width:100%;height:36px;border-radius:8px;border:0;padding:0;margin-top:4px"/>
                    </div>
                    <div style="width:84px">
                        <label style="font-size:12px;opacity:.8">Shape</label>
                        <select id="tm-shape" style="width:100%;padding:6px;margin-top:4px;border-radius:8px;background:#09090a;color:#eee;border:1px solid #222">
                            <option value="square">Square</option>
                            <option value="round">Round</option>
                        </select>
                    </div>
                </div>
                <div style="display:flex;gap:8px;margin-top:8px;align-items:center">
                    <div style="flex:1">
                        <label style="font-size:12px;opacity:.8">Size</label>
                        <select id="tm-size" style="width:100%;padding:6px;margin-top:4px;border-radius:8px;background:#09090a;color:#eee;border:1px solid #222">
                            <option value="256">256×256</option>
                            <option value="400" selected>400×400</option>
                            <option value="600">600×600</option>
                        </select>
                    </div>
                    <div style="width:84px">
                        <label style="font-size:12px;opacity:.8">Font</label>
                        <select id="tm-fontsize" style="width:100%;padding:6px;margin-top:4px;border-radius:8px;background:#09090a;color:#eee;border:1px solid #222">
                            <option value="18">18px</option>
                            <option value="22" selected>22px</option>
                            <option value="30">30px</option>
                        </select>
                    </div>
                </div>
                <div style="display:flex;gap:8px;margin-top:10px">
                    <button id="tm-create" style="flex:1;padding:8px;border-radius:8px;background:linear-gradient(180deg,#2a2a2a,#111);border:1px solid #333;color:#fff;cursor:pointer">Create Placeholder</button>
                    <button id="tm-insert" style="flex:1;padding:8px;border-radius:8px;background:#122;border:1px solid #233;color:#dff;cursor:pointer">Create + Insert</button>
                </div>
                <div id="tm-preview-wrap" style="margin-top:10px;display:flex;gap:8px;align-items:center">
                    <div id="tm-preview" style="width:64px;height:64px;border-radius:6px;box-shadow:inset 0 0 0 1px rgba(0,0,0,.2);display:flex;align-items:center;justify-content:center;overflow:hidden;background:#b76bff;"></div>
                    <div style="flex:1;font-size:12px;opacity:.8">Drag the preview into the tier area or press Create + Insert to auto-add to the upload input.</div>
                </div>
                <div id="tm-thumbs" style="margin-top:10px;display:flex;gap:6px;flex-wrap:wrap"></div>
            </div>
        `;
        document.body.appendChild(ui);

        const header = $('#tm-header', ui);
        const body = $('#tm-body', ui);
        const minBtn = $('#tm-min', ui);
        let minimized = false;
        minBtn.addEventListener('click', () => {
            minimized = !minimized;
            body.style.display = minimized ? 'none' : 'block';
            minBtn.textContent = minimized ? '+' : '—';
            ui.style.width = minimized ? '48px' : '300px';
        });

        const inputs = {
            text: $('#tm-text', ui),
            color: $('#tm-color', ui),
            shape: $('#tm-shape', ui),
            size: $('#tm-size', ui),
            fontsize: $('#tm-fontsize', ui),
            preview: $('#tm-preview', ui),
            thumbs: $('#tm-thumbs', ui),
            create: $('#tm-create', ui),
            insert: $('#tm-insert', ui)
        };

        function renderPreview() {
            const size = parseInt(inputs.size.value,10);
            const canvas = document.createElement('canvas');
            canvas.width = 200;
            canvas.height = 200;
            const ctx = canvas.getContext('2d');
            const bg = inputs.color.value;
            ctx.fillStyle = bg;
            if (inputs.shape.value === 'round') {
                ctx.beginPath();
                ctx.arc(100,100,100,0,Math.PI*2);
                ctx.fill();
            } else {
                ctx.fillRect(0,0,200,200);
            }
            const txt = inputs.text.value || 'Placeholder';
            ctx.fillStyle = '#0b0b0b';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = `${parseInt(inputs.fontsize.value,10)}px Arial`;
            wrapTextCenter(ctx, txt, 100, 100, 170, parseInt(inputs.fontsize.value,10)+6);
            inputs.preview.style.backgroundImage = `url(${canvas.toDataURL()})`;
            inputs.preview.style.backgroundSize = 'cover';
            inputs.preview.draggable = true;
            inputs.preview.dataset.dataurl = canvas.toDataURL();
        }

        function wrapTextCenter(ctx, text, x, y, maxWidth, lineHeight) {
            const words = text.split(' ');
            let line = '';
            const lines = [];
            for (let n = 0; n < words.length; n++) {
                const testLine = line + words[n] + ' ';
                const metrics = ctx.measureText(testLine);
                const testWidth = metrics.width;
                if (testWidth > maxWidth && n > 0) {
                    lines.push(line.trim());
                    line = words[n] + ' ';
                } else {
                    line = testLine;
                }
            }
            lines.push(line.trim());
            const startY = y - (lines.length-1) * (lineHeight/2);
            for (let i = 0; i < lines.length; i++) {
                ctx.fillText(lines[i], x, startY + i * lineHeight);
            }
        }

        inputs.text.addEventListener('input', renderPreview);
        inputs.color.addEventListener('input', renderPreview);
        inputs.shape.addEventListener('change', renderPreview);
        inputs.size.addEventListener('change', renderPreview);
        inputs.fontsize.addEventListener('change', renderPreview);

        async function createCanvasDataURL() {
            const size = parseInt(inputs.size.value,10);
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            const bg = inputs.color.value;
            ctx.fillStyle = bg;
            if (inputs.shape.value === 'round') {
                ctx.beginPath();
                ctx.arc(size/2, size/2, size/2, 0, Math.PI*2);
                ctx.fill();
            } else {
                ctx.fillRect(0,0,size,size);
            }
            const txt = inputs.text.value || 'Placeholder';
            ctx.fillStyle = '#000000';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = `${parseInt(inputs.fontsize.value,10)}px Arial`;
            wrapTextCenter(ctx, txt, size/2, size/2, size - 24, parseInt(inputs.fontsize.value,10)+8);
            return canvas.toDataURL('image/png');
        }

        function makeThumb(dataUrl, filename) {
            const el = document.createElement('div');
            el.style.width = '64px';
            el.style.height = '64px';
            el.style.borderRadius = '8px';
            el.style.overflow = 'hidden';
            el.style.backgroundImage = `url(${dataUrl})`;
            el.style.backgroundSize = 'cover';
            el.style.cursor = 'grab';
            el.draggable = true;
            el.dataset.url = dataUrl;
            el.dataset.filename = filename;
            el.addEventListener('dragstart', (e) => {
                try {
                    e.dataTransfer.setData('text/uri-list', dataUrl);
                    e.dataTransfer.setData('text/plain', filename);
                } catch (err) {}
                if (e.dataTransfer.items && e.dataTransfer.items.add) {
                    fetch(dataUrl).then(r=>r.blob()).then(blob=>{
                        const file = new File([blob], filename, {type: 'image/png'});
                        const dt = new DataTransfer();
                        dt.items.add(file);
                        try {
                            e.dataTransfer.items.clear();
                        } catch(e){}
                        try {
                            e.dataTransfer.items.add(file);
                        } catch(e){}
                    });
                }
            });
            el.addEventListener('click', async () => {
                const dt = new DataTransfer();
                const blob = await (await fetch(dataUrl)).blob();
                dt.items.add(new File([blob], filename, {type:'image/png'}));
                autoInsertFiles(dt.files);
            });
            inputs.thumbs.appendChild(el);
        }

        async function autoInsertFiles(fileList) {
            const fileInput = document.querySelector('input[type=file]');
            if (fileInput) {
                const dt = new DataTransfer();
                if (fileList instanceof FileList) {
                    for (let f of fileList) dt.items.add(f);
                } else if (Array.isArray(fileList)) {
                    for (let f of fileList) dt.items.add(f);
                } else {
                    dt.items.add(fileList);
                }
                fileInput.files = dt.files;
                const ev = new Event('change', {bubbles:true});
                fileInput.dispatchEvent(ev);
                return true;
            } else {
                const imagesContainer = findImagesContainer();
                if (imagesContainer) {
                    for (let f of fileList) {
                        const url = URL.createObjectURL(f);
                        insertLocalThumbnail(imagesContainer, url, f.name);
                    }
                    return true;
                }
            }
            return false;
        }

        function insertLocalThumbnail(container, url, name) {
            const thumbWrap = document.createElement('div');
            thumbWrap.style.width = '80px';
            thumbWrap.style.height = '80px';
            thumbWrap.style.margin = '6px';
            thumbWrap.style.borderRadius = '8px';
            thumbWrap.style.overflow = 'hidden';
            thumbWrap.style.backgroundImage = `url(${url})`;
            thumbWrap.style.backgroundSize = 'cover';
            container.appendChild(thumbWrap);
        }

        function findImagesContainer() {
            const candidates = $all('div');
            for (let c of candidates) {
                if (/No images have been uploaded|Upload images to be used in your tier list/i.test(c.innerText)) continue;
                if (c.querySelector && c.querySelector('img')) return c;
            }
            const alt = document.querySelector('.uploaded-images, .images, .tiles, .tm-image-list');
            return alt;
        }

        async function createAndOptionallyInsert(doInsert=false) {
            const dataUrl = await createCanvasDataURL();
            const filename = `placeholder-${Date.now()}.png`;
            makeThumb(dataUrl, filename);
            const blob = await (await fetch(dataUrl)).blob();
            const file = new File([blob], filename, {type:'image/png'});
            const dt = new DataTransfer();
            dt.items.add(file);
            const success = await autoInsertFiles(dt.files);
            if (!success) {
                // fallback: create floating drag image
                const floatImg = document.createElement('img');
                floatImg.src = dataUrl;
                floatImg.style.position = 'fixed';
                floatImg.style.right = '12px';
                floatImg.style.top = '80px';
                floatImg.style.width = '120px';
                floatImg.style.height = '120px';
                floatImg.style.zIndex = 2147483646;
                floatImg.style.border = '2px solid rgba(255,255,255,0.06)';
                floatImg.style.borderRadius = '10px';
                document.body.appendChild(floatImg);
                setTimeout(()=>{ floatImg.remove(); }, 4000);
            }
        }

        inputs.create.addEventListener('click', ()=>createAndOptionallyInsert(false));
        inputs.insert.addEventListener('click', ()=>createAndOptionallyInsert(true));

        inputs.preview.addEventListener('dragstart', (e)=>{
            const dataUrl = e.target.dataset.dataurl;
            const filename = `placeholder-${Date.now()}.png`;
            try {
                e.dataTransfer.setData('text/uri-list', dataUrl);
                e.dataTransfer.setData('text/plain', filename);
            } catch(err){}
            fetch(dataUrl).then(r=>r.blob()).then(blob=>{
                const file = new File([blob], filename, {type:'image/png'});
                try {
                    e.dataTransfer.items.clear();
                } catch(e){}
                try {
                    e.dataTransfer.items.add(file);
                } catch(e){}
            });
        });

        renderPreview();
        setupTierDropTargets();
    }

    function setupTierDropTargets() {
        const observer = new MutationObserver(()=>attachDropToTargets());
        observer.observe(document.body, {childList:true, subtree:true});
        attachDropToTargets();
    }

    function attachDropToTargets() {
        const targets = $all('.tier.sort, .tier.sortable, .tier, .sort');
        targets.forEach(t => {
            if (t.dataset.tmPlaceholderAttached) return;
            t.dataset.tmPlaceholderAttached = '1';
            t.addEventListener('dragover', (e)=>{ e.preventDefault(); });
            t.addEventListener('drop', async (e)=>{
                e.preventDefault();
                const items = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length ? e.dataTransfer.files : null;
                if (items) {
                    const dt = new DataTransfer();
                    for (let f of items) dt.items.add(f);
                    autoInsertFilesToTier(t, dt.files);
                    return;
                }
                const uri = e.dataTransfer.getData('text/uri-list') || e.dataTransfer.getData('text/plain');
                if (uri && uri.startsWith('data:')) {
                    const blob = await (await fetch(uri)).blob();
                    const file = new File([blob], `placeholder-${Date.now()}.png`, {type:'image/png'});
                    const dt = new DataTransfer();
                    dt.items.add(file);
                    autoInsertFilesToTier(t, dt.files);
                }
            }, {passive:false});
        });
    }

    function autoInsertFilesToTier(tierEl, fileList) {
        const fileInput = document.querySelector('input[type=file]');
        if (fileInput) {
            const dt = new DataTransfer();
            for (let f of fileList) dt.items.add(f);
            fileInput.files = dt.files;
            fileInput.dispatchEvent(new Event('change', {bubbles:true}));
            return;
        }
        const img = document.createElement('img');
        img.style.width = '80px';
        img.style.height = '80px';
        img.style.objectFit = 'cover';
        img.style.margin = '4px';
        img.style.borderRadius = '8px';
        const reader = new FileReader();
        reader.onload = ()=> {
            img.src = reader.result;
            tierEl.appendChild(img);
        };
        reader.readAsDataURL(fileList[0]);
    }

    ensureUi();

    function autoInsertFiles(files) {
        const fileInput = document.querySelector('input[type=file]');
        if (fileInput) {
            const dt = new DataTransfer();
            for (let f of files) dt.items.add(f);
            fileInput.files = dt.files;
            fileInput.dispatchEvent(new Event('change',{bubbles:true}));
            return true;
        }
        const imagesContainer = document.querySelector('.uploaded-images, .images, .tm-image-list');
        if (imagesContainer) {
            for (let f of files) {
                const url = URL.createObjectURL(f);
                const d = document.createElement('div');
                d.style.width='80px';d.style.height='80px';d.style.margin='6px';d.style.borderRadius='8px';d.style.backgroundImage=`url(${url})`;d.style.backgroundSize='cover';
                imagesContainer.appendChild(d);
            }
            return true;
        }
        return false;
    }

})();
