// ==UserScript==
// @name         BDE → One-click GLTF export
// @namespace    bde-export
// @description  Экспорт GLTF из BDE через встроенный GLTFExporter
// @match        https://bdengine.app/*
// @match        https://block-display.com/*
// @match        https://*.bdengine.app/*
// @match        https://*.block-display.com/*
// @run-at       document-idle
// @grant        none
// @version      1.0.
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557393/BDE%20%E2%86%92%20One-click%20GLTF%20export.user.js
// @updateURL https://update.greasyfork.org/scripts/557393/BDE%20%E2%86%92%20One-click%20GLTF%20export.meta.js
// ==/UserScript==

(() => {
  const log = (...args) => console.log('%c[BDE Export]', 'color:#0f9;font-weight:700', ...args);

  const nowTag = () => {
    const d = new Date(), p = n => String(n).padStart(2,'0');
    return `${d.getFullYear()}${p(d.getMonth()+1)}${p(d.getDate())}_${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
  };

  const download = (blob, name) => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 0);
  };

  function pickTargets(root){
    const out = [];
    root.traverse?.(o=>{
      if(o?.isMesh && o.visible !== false && o.material?.visible !== false) out.push(o);
    });
    return out;
  }

function collectForExport(obj) {

    if (!obj.visible) return null;

    let clone;
    try { clone = obj.clone(true); }
    catch { clone = obj; }

    if (obj.children?.length) {
        clone.children = [];
        obj.children.forEach(child => {
            const childClone = collectForExport(child);
            if (childClone) clone.add(childClone);
        });
    }
    return clone;
}

async function doExportGLB(trigger='manual') {
    log('Export triggered by', trigger);

    const root = window.editor?.objects;
    if (!root) {
      window.editor.gui.notify.createNotify('Сцена не найдена', 'CircleX');
      return; }

    const exportRoot = collectForExport(root);
    if (!exportRoot) {

       window.editor.gui.notify.createNotify('Нечего экспортировать', 'CircleX');
      return; }

    if (!window.THREE?.GLTFExporter) {
        window.editor.gui.notify.createNotify('GLTFExporter не найден', 'CircleX');

      return; }

    const exporter = new window.THREE.GLTFExporter();
    exporter.parse(exportRoot, (res) => {
        const isBinary = res instanceof ArrayBuffer;
        const blob = isBinary
            ? new Blob([res], {type:'model/gltf-binary'})
            : new Blob([JSON.stringify(res)], {type:'application/json'});

        const filename = `bde_export_${nowTag()}` + (isBinary ? '.glb' : '.gltf');
        download(blob, filename);
        log('GLB saved:', filename);

       window.editor.gui.notify.createNotify('Экспорт завершён: '+ filename, 'icon-save');
    }, {
        binary: true,
        embedImages: true,
        onlyVisible: false,
        maxTextureSize: 4096
    });
}
  // ---------- UI ----------
const bottom = document.getElementById('bottom_container');
if (!bottom) {
    console.warn('bottom_container не найден, кнопка не добавлена');
} else {
    const btnWrap = document.createElement('div');
    btnWrap.id = 'bde-oneclick';

    const link = document.createElement('a');
    link.textContent = 'Export to GLTF';

    link.addEventListener('click', e => {
        e.preventDefault();
        doExportGLB('click');
    });

    btnWrap.appendChild(link);
    bottom.appendChild(btnWrap);
}

  // hotkey E
  //window.addEventListener('keydown', e => { if(e.key==='e'||e.key==='E') doExportGLB('hotkey'); });

  log('Export button injected. Click or press "E" to export.');
})();
