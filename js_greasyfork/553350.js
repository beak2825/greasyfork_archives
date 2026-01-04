// ==UserScript==
// @name         中国裁判文书网一键转存
// @version      1.3
// @description  快速复制标题、内容，并支持一键生成 Word/PNG/PDF 文件
// @author       旋转突进的蓝色枪兵
// @match        https://wenshu.court.gov.cn/website/wenshu/*/index.html*
// @grant        GM_setClipboard
// @grant        GM_download
// @require      https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js
// @require      https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js
// @license      MIT
// @namespace    https://greasyfork.org/users/1529400
// @downloadURL https://update.greasyfork.org/scripts/553350/%E4%B8%AD%E5%9B%BD%E8%A3%81%E5%88%A4%E6%96%87%E4%B9%A6%E7%BD%91%E4%B8%80%E9%94%AE%E8%BD%AC%E5%AD%98.user.js
// @updateURL https://update.greasyfork.org/scripts/553350/%E4%B8%AD%E5%9B%BD%E8%A3%81%E5%88%A4%E6%96%87%E4%B9%A6%E7%BD%91%E4%B8%80%E9%94%AE%E8%BD%AC%E5%AD%98.meta.js
// ==/UserScript==

(() => {
  'use strict';

  /* ---------- 通用函数 ---------- */
  const getContent = cls => document.querySelector(`.${cls}`)?.innerText.trim() ?? '';
  const sanitizeFileName = n => n.replace(/[\\/:*?"<>|]/g, '_');

  /* ---------- Word 生成 ---------- */
  async function createWordBlob(title, body) {
    const esc = t => t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    const paras = body.split('\n').filter(l => l.trim());
    const bodyXml = paras.map(p => `
      <w:p><w:pPr><w:jc w:val="left"/><w:spacing w:after="60" w:line="480" w:lineRule="exact"/>
        <w:ind w:firstLineChars="200"/><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:eastAsia="仿宋"/>
        <w:sz w:val="28"/><w:szCs w:val="28"/></w:rPr></w:pPr>
        <w:r><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:eastAsia="仿宋"/>
        <w:sz w:val="28"/><w:szCs w:val="28"/></w:rPr><w:t>${esc(p)}</w:t></w:r></w:p>`).join('');
    const titleXml = `
      <w:p><w:pPr><w:jc w:val="center"/><w:spacing w:after="200"/>
        <w:rPr><w:rFonts w:ascii="方正小标宋简体" w:eastAsia="方正小标宋简体"/><w:b/>
        <w:sz w:val="44"/><w:szCs w:val="44"/></w:rPr></w:pPr>
        <w:r><w:rPr><w:rFonts w:ascii="方正小标宋简体" w:eastAsia="方正小标宋简体"/><w:b/>
        <w:sz w:val="44"/><w:szCs w:val="44"/></w:rPr><w:t>${esc(title)}</w:t></w:r></w:p>`;
    const docXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>${titleXml}${bodyXml}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/>
  <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/></w:sectPr></w:body></w:document>`;
    if (typeof JSZip === 'undefined') await import('https://cdn.jsdelivr.net/npm/jszip@3/dist/jszip.min.js');
    const zip = new JSZip();
    zip.file('[Content_Types].xml', `<?xml version="1.0"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`);
    zip.file('_rels/.rels', `<?xml version="1.0"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`);
    zip.file('word/_rels/document.xml.rels', `<?xml version="1.0"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"></Relationships>`);
    zip.file('word/document.xml', docXml);
    return zip.generateAsync({type: 'blob'});
  }

  /* ---------- 界面插入 ---------- */
  const hbox = document.querySelector('.header_box');
  if (!hbox) return;

  const addBtn = (text, parent) => {
    const div = document.createElement('div'); div.className = 'fl date';
    const btn = document.createElement('button'); btn.textContent = text;
    div.appendChild(btn); parent.appendChild(div); return btn;
  };
  const btnTitle = addBtn('复制标题', hbox);
  const btnContent = addBtn('复制内容', hbox);
  const btnWord = addBtn('创建文件', hbox);

  const lineShot = document.createElement('div'); lineShot.className = 'fl date';
  lineShot.style.display = 'flex'; lineShot.style.alignItems = 'center'; lineShot.style.gap = '6px';
  const btnShot = document.createElement('button'); btnShot.textContent = '创建截图';
  const selFmt = document.createElement('select');
  ['png', 'pdf'].forEach(f => { const o = document.createElement('option'); o.value = f; o.textContent = f.toUpperCase(); selFmt.appendChild(o); });
  selFmt.value = localStorage.getItem('userDefaultShotFmt') || 'png';
  lineShot.append(btnShot, selFmt); hbox.appendChild(lineShot);

  /* ---------- 事件 ---------- */
  btnTitle.onclick = () => { GM_setClipboard(getContent('PDF_title')); alert('标题已复制！'); };
  btnContent.onclick = () => { GM_setClipboard(getContent('PDF_pox')); alert('内容已复制！'); };
  btnWord.onclick = async () => {
    const title = sanitizeFileName(getContent('PDF_title')) || '未命名';
    const body = getContent('PDF_pox');
    if (!body) return alert('未获取到正文内容！');
    const blob = await createWordBlob(title, body);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = title + '.docx'; a.click();
    URL.revokeObjectURL(a.href);
  };

  btnShot.onclick = async () => {
    const fmt = selFmt.value;
    localStorage.setItem('userDefaultShotFmt', fmt);
    const node = document.querySelector('.PDF_box');
    if (!node) return alert('未找到 PDF_box 节点');
    try {
      const canvas = await html2canvas(node, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      const title = sanitizeFileName(getContent('PDF_title')) || '截图';
      const fileName = `${title}.${fmt}`;

      if (fmt === 'png') {
        canvas.toBlob(blob => downBlob(blob, fileName), 'image/png');
      } else {
        const imgData = canvas.toDataURL('image/jpeg', 0.9);
        const imgWidth = 595.28; // A4 宽度（单位：pt）
        const imgHeight = (canvas.height * imgWidth) / canvas.width; // 等比缩放高度

        const pageHeight = 841.89; // A4 高度（单位：pt）
        let heightLeft = imgHeight;
        let position = 0;

        const pdf = new jspdf.jsPDF('p', 'pt', 'a4');

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
            position -= pageHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        downBlob(pdf.output('blob'), fileName);
      }
    } catch (e) { alert('截图失败：' + e.message); }
  };

  const downBlob = (blob, fileName) => {
    if (typeof GM_download !== 'undefined') {
      const url = URL.createObjectURL(blob);
      GM_download({ url, name: fileName, saveAs: false, onload: () => URL.revokeObjectURL(url) });
    } else {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob); a.download = fileName; a.click();
      URL.revokeObjectURL(a.href);
    }
  };
})();