// ==UserScript==
// @name         P9富文本框增强
// @namespace    http://tampermonkey.net/
// @version      1.81
// @description  扩展p9富文本框，为其添加站内支持的bbcode按钮、markdown转换、excel导入等功能
// @match        https://psnine.com/*
// @match        https://www.psnine.com/*
// @grant        none
// @author       p9 playercrane
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555732/P9%E5%AF%8C%E6%96%87%E6%9C%AC%E6%A1%86%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/555732/P9%E5%AF%8C%E6%96%87%E6%9C%AC%E6%A1%86%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const SCHEMES = {
    blue: { name: '蓝色系', tableBg: '#fbfbf7', oddRowBg: '#4e81bd', evenRowBg: '#dbe5f1', fontColor: '#fff' },
    green: { name: '绿色系', tableBg: '#f7fbf7', oddRowBg: '#77933c', evenRowBg: '#c2d69b', fontColor: '#fff' },
    gray: { name: '灰色系', tableBg: '#f8f8f8', oddRowBg: '#7f7f7f', evenRowBg: '#d9d9d9', fontColor: '#fff' }
  };

  const COLOR_BG_CHOICES = ['#f74d46','#4caf50','#2196f3','#ff9800','#9c27b0'];
  const COLOR_FONT_CHOICES = ['#fff','#000','#ffe000','#00ffff','#ffebee'];

  // 工具函数模块
  function insertAtCursor(textarea, text, lastSelection) {
    if (document.activeElement !== textarea) {
      textarea.focus();
      if (typeof lastSelection.start === 'number') {
        textarea.selectionStart = lastSelection.start;
        textarea.selectionEnd = lastSelection.end;
      }
    }
    const start = textarea.selectionStart ?? textarea.value.length;
    const end = textarea.selectionEnd ?? textarea.value.length;
    const before = textarea.value.substring(0, start);
    const after = textarea.value.substring(end);
    textarea.value = before + text + after;
    const pos = before.length + text.length;
    textarea.selectionStart = textarea.selectionEnd = pos;
    // 更新存储的光标位置
    lastSelection.start = lastSelection.end = pos;
  }

  var utils = /*#__PURE__*/Object.freeze({
    __proto__: null,
    insertAtCursor: insertAtCursor
  });

  // 引入风格常量如有需要
  // import { SCHEMES } from './schemes.js';

  function mdToBBCode(md) {
    // 参考文件完整实现
    const cfg = {
      heading: { h1:{tagOpen:'[title]',tagClose:'[/title]'}, h2:{tagOpen:'[size=24]',tagClose:'[/size]'}, h3:{tagOpen:'[size=20]',tagClose:'[/size]'} },
      table: { wrapperOpen:'[tbl]', wrapperClose:'[/tbl]', delimiter:',' }};
    const lines = md.replace(/\r/g,'').split('\n');
    const out = [];
    let inCodeBlock = false;
    for(let i=0;i<lines.length;i++){
      let raw = lines[i];
      let trimmed = raw.trim();
      const leading = raw.match(/^\s*/)[0];
      const trailing = raw.match(/\s*$/)[0];
      // 代码块围栏
        if(/^```/.test(trimmed)){
          // 围栏代码块处理：区分单行内联与多行块
          const inlineMatch = trimmed.match(/^```(.+?)```$/);
          if(inlineMatch){
            let inner = inlineMatch[1];
            // 特例：奖杯标签去除围栏直接输出
            inner = inner.replace(/^(\[trophy=.*?\]\[\/trophy\])$/, '$1');
            // 可选择：行内的其他 BBCode 不再做回退处理
            trimmed = inner; // 继续后续常规转换
          } else {
            inCodeBlock = !inCodeBlock; console.log('[mdToBBCode] fence toggle', inCodeBlock, 'line', i); continue;
          }
        }
      if(inCodeBlock){ out.push(raw); continue; }
      // 表格块检测
      const isTableLine = /^\|.*\|$/.test(trimmed) && (trimmed.match(/\|/g)||[]).length >= 2;
      console.log('[MD->BB][TABLE_CHECK]', {line: i, trimmed, isTableLine});
      if(isTableLine){
        let block = []; const startIndex=i;
        while(i<lines.length){
          const t = lines[i].trim();
          console.log('[MD->BB][TABLE_BLOCK_LINE]', {line: i, trimmed: t, isTableLine: /^\|.*\|$/.test(t)});
          if(/^\|.*\|$/.test(t) && (t.match(/\|/g)||[]).length>=2){ block.push(lines[i]); i++; continue; }
          break;
        }
        i--; // 回退一行
        if(DEBUG_TABLE) console.log('[MD->BB][TABLE_BLOCK_RAW]', {start:startIndex, count:block.length, block});
        if(block.length){
          const ESC='\u0007';
          function splitRow(row){
            const protectedLine = row.replace(/\\\|/g, ESC);
            let cells = protectedLine.split('|').map(c=> c.replace(new RegExp(ESC,'g'),'|').trim());
            while(cells.length && cells[0]==='') cells.shift();
            while(cells.length && cells[cells.length-1]==='') cells.pop();
            return cells;
          }
          let parsed = block.map(r=> splitRow(r));
          // 跳过第二行分隔行
          if(parsed.length>1 && parsed[1].every(c=>/^:?-{1,}:?$/.test(c))){ if(DEBUG_TABLE) console.log('[MD->BB][TABLE] skip separator row'); parsed.splice(1,1); }
          const csvRows = parsed.map((cells,idx)=>{ const csv = cells.map(c=> c.replace(/,/g,'，')).join(cfg.table.delimiter); if(DEBUG_TABLE) console.log('[MD->BB][TABLE_ROW]', idx, cells, '=>', csv); return csv; });
          out.push(cfg.table.wrapperOpen);
          if(DEBUG_TABLE) out.push('[DEBUG]TABLE_BLOCK_START index='+startIndex+' rows='+csvRows.length);
          csvRows.forEach((r,ri)=>{ if(DEBUG_TABLE) out.push('[DEBUG]ROW'+ri+':'+r); out.push(r); });
          if(DEBUG_TABLE) out.push('[DEBUG]TABLE_BLOCK_END');
          out.push(cfg.table.wrapperClose);
          continue;
        }
      }
      // 无序列表转换，支持 -, *, + 作为列表符号，缩进规则与 markdown 原生一致：每2空格为一级
      const ulMatch = raw.match(/^(\s*)[-*+]\s+(.*)$/);
      if (ulMatch) {
        // 计算缩进层级，每2个空格为一层
        const spaceCount = ulMatch[1].replace(/\t/g, '    ').length;
        let level = Math.floor(spaceCount / 2) + 1;
        let symbol = '';
        let zenkaku = '';
        if (level === 1) {
          symbol = '●';
          zenkaku = '';
        } else if (level === 2) {
          symbol = '○';
          zenkaku = '　　';
        } else if (level >= 3) {
          symbol = '■';
          zenkaku = '　　'.repeat(level - 1);
        }
        out.push(leading + zenkaku + symbol + ' ' + ulMatch[2] + trailing);
        continue;
      }

      // 标题
      if(/^# /.test(trimmed)){
        out.push(leading + trimmed.replace(/^# +/, cfg.heading.h1.tagOpen)+cfg.heading.h1.tagClose + trailing);
        continue;
      }
      if(/^## /.test(trimmed)){
        out.push(leading + trimmed.replace(/^## +/, cfg.heading.h2.tagOpen)+cfg.heading.h2.tagClose + trailing);
        continue;
      }
      if(/^### /.test(trimmed)){
        out.push(leading + trimmed.replace(/^### +/, cfg.heading.h3.tagOpen)+cfg.heading.h3.tagClose + trailing);
        continue;
      }
      // 引用
      if(/^>/.test(trimmed)){
        out.push(leading + '[quote]'+trimmed.replace(/^>\s?/, '')+'[/quote]' + trailing);
        continue;
      }
      // 列表
      // const ol = trimmed.match(/^\s*(\d+)\.\s+(.*)/);
      // if(ol){
      //   const indent = raw.search(/\S/); // 计算缩进层级
      //   while(listStack.length > indent) out.push(listStack.pop());
      //   while(listStack.length < indent) { out.push('[list]'); listStack.push('[/list]'); }
      //   out.push(ol[1] + '. ' + ol[2]);
      //   continue;
      // }
      // const ul = trimmed.match(/^\s*-\s+(.*)/);
      // if(ul){
      //   const indent = raw.search(/\S/); // 计算缩进层级
      //   while(listStack.length > indent) out.push(listStack.pop());
      //   while(listStack.length < indent) { out.push('[list]'); listStack.push('[/list]'); }
      //   out.push(cfg.listBullets[0] + ' ' + ul[1]);
      //   continue;
      // }
      // while(listStack.length) out.push(listStack.pop()); // 关闭所有未结束的列表
      // 强调替换（顺序）
      { trimmed = trimmed.replace(/\*\*\*\*\*([^*]+)\*\*\*\*\*/g,'[b][i]$1[/i][/b]'); }
      trimmed = trimmed.replace(/\*\*\*([^*]+)\*\*\*/g,'[i][b]$1[/b][/i]');
      trimmed = trimmed.replace(/\*\*([^*]+)\*\*/g,'[b]$1[/b]');
      // 修正斜体转换为 [i]$1[/i]
      trimmed = trimmed.replace(/\*([^*]+)\*/g,'[i]$1[/i]');
      // 奖杯围栏行内写法
      trimmed = trimmed.replace(/```(\[trophy=.*?\]\[\/trophy\])```/g,'$1');
      { trimmed = trimmed.replace(/`(\[[^`]+\])`/g,'$1'); }
      // 图片
      const imgMatch = trimmed.match(/^!\[.*?\]\((.*?)\)$/);
      if (imgMatch) {
        out.push(leading + `[img]${imgMatch[1]}[/img]` + trailing);
        continue;
      }
      out.push(leading + trimmed + trailing);
    }
    return out.join('\n');
  }

  function bbcodeToMarkdown(bb) {
    const lines = bb.replace(/\r/g,'').split('\n');
    let out = [];
    let inTable = false; let tableRows=[];  function flushTable(){
      if(!inTable) return;
      if(tableRows.length){
        // 转为 markdown 表格：首行作为表头（如果有多列）
        const rows = tableRows.map(r=> r.map(c=> c.trim()));
        if(rows.length){
          const colCount = Math.max(...rows.map(r=>r.length));
          const norm = rows.map(r=>{ while(r.length<colCount) r.push(''); return r; });
          // 处理行内 [center] 包裹
          norm.forEach(r=>{ for(let i=0;i<r.length;i++){ r[i]=r[i].replace(/\[center\](.*?)\[\/center\]/g,'$1'); } });
          // 如果单元格是 [bgcolor=...][color=...]标签开头的白金卡格式：转换为 “标签: 内容” 列
          norm.forEach(r=>{ for(let i=0;i<r.length;i++){ r[i]=r[i].replace(/\[bgcolor=[^\]]+\]\[color=[^\]]+\](.*?)\[\/color\]/g,'$1'); } });
          // 生成 markdown 表格
          if(colCount>1){
            out.push(norm[0].join(' | '));
            out.push(norm[0].map(()=> '---').join(' | '));
            norm.slice(1).forEach(r=> out.push(r.join(' | ')));
          } else {
            norm.forEach(r=> out.push('- ' + r[0]));
          }
        }
      }
      tableRows=[]; inTable=false;  }
    lines.forEach(raw=>{
      if(/^\[tbl(=.+)?\]$/.test(raw.trim())){ flushTable(); inTable=true; raw.trim(); return; }
      if(/^\[\/tbl\]$/.test(raw.trim())){ flushTable(); return; }
      if(inTable){
        // 可能含有 [bgcolor=...] 开头行
        let line = raw.trim();
        if(!line){ return; }
        line = line.replace(/^\[bgcolor=[^\]]+\]/,'');
        const cells = line.split(',').map(c=>c);
        tableRows.push(cells);
        return;
      }
      // 保留原始前后空格
      const leading = raw.match(/^\s*/)[0];
      const trailing = raw.match(/\s*$/)[0];
      let line = raw.trim();
      // 代码块保留：如果原行看似代码（无需特殊处理，这里不自动加围栏）
      // 引用
      line = line.replace(/\[quote\]([\s\S]*?)\[\/quote\]/g, (_,t)=> t.split('\n').map(l=> '> '+l).join('\n'));
      // 标题
      line = line.replace(/\[title\]([\s\S]*?)\[\/title\]/g,'# $1');
      line = line.replace(/\[size=24\]([\s\S]*?)\[\/size\]/g, '## $1');
      line = line.replace(/\[size=20\]([\s\S]*?)\[\/size\]/g, '### $1');
      line = line.replace(/\[b\]([\s\S]*?)\[\/b\]/g,'**$1**');
      line = line.replace(/\[i\]([\s\S]*?)\[\/i\]/g,'*$1*');
      line = line.replace(/\[s\]([\s\S]*?)\[\/s\]/g,'~~$1~~');
      line = line.replace(/\[center\]([\s\S]*?)\[\/center\]/g,'$1');
      line = line.replace(/\[trophy=[^\]]+\][\s\S]*?\[\/trophy\]/g, m=> '```'+m+'```');
      line = line.replace(/\[(\w+)(=[^\]]+)?\]([\s\S]*?)\[\/(\w+)\]/g,(m,tag,a,inner,tagEnd)=>{
        if(tag!==tagEnd) return m; // 不匹配不处理
        if(['b','i','u','s','title','size','quote','center','trophy'].includes(tag)) return m; // 已处理或允许
        if(tag==='color' || tag==='bgcolor') return inner; // 颜色去除
        if(tag==='mark') return '`'+inner+'`'; // mark 行内代码
        return '```'+m+'```';
      });
      // 列表符号行：● / ○ / ∎ 转为 markdown 无序列表（保留嵌套缩进）
      line = line.replace(/^(　*)(●|○|∎)　(.*)$/,(m,indent,sym,content)=>{
        const depth = indent.length; // 每个全角空格代表一层
        const mdIndent = '  '.repeat(depth); // 两空格缩进
        return mdIndent + '- ' + content.trim();
      });
      // 有序列表 1.　 内容 -> 保留缩进
      line = line.replace(/^(　*)(\d+)\.　(.*)$/,(m,indent,num,content)=>{
        const depth = indent.length;
        const mdIndent = '  '.repeat(depth);
        return mdIndent + num + '. ' + content.trim();
      });
      // 已移除无序列表 BBCode → Markdown 的专门识别
      out.push(leading + line + trailing); // 拼接回前后空格
    });
    flushTable();
    return out.join('\n').replace(/\n{3,}/g,'\n\n');
  }

  // 新的 Markdown/BBCode 双向转换弹窗
  function createMdBbcodeConvertModal(mainTextarea, lastSelection) {
    const modal = document.createElement('div');
    modal.style.cssText = 'position:fixed;left:0;top:0;width:100%;height:100%;background:rgba(0,0,0,.55);z-index:9999;display:flex;align-items:center;justify-content:center;font-size:14px;';
    modal.innerHTML = `
    <div style="background:#fff;width:900px;max-width:98vw;padding:18px;box-shadow:0 2px 12px rgba(0,0,0,.3);display:flex;flex-direction:column;gap:12px;">
      <div style="display:flex;align-items:center;justify-content:space-between;">
        <h3 style='margin:0 0 8px 0;font-size:16px;text-align:center;flex:1;'>Markdown ⇄ BBCode 转换</h3>
        <button id="toggleFileImportBtn" title="展开/收起文件导入" style="padding:2px 10px;font-size:13px;background:#eee;border:1px solid #ccc;border-radius:3px;cursor:pointer;transition:background 0.2s;">导入本地文件</button>
      </div>
      <div id="fileImportPanel" style="display:none;flex-direction:column;gap:4px;margin-bottom:4px;">
        <input id="mdFileInputConvert" type="file" accept=".md,.markdown,.txt" style="width:100%;margin-bottom:4px;" />
        <button id="readFileBtnConvert" style="padding:4px 10px;background:#666;color:#fff;border:none;cursor:pointer;width:100px;margin-bottom:4px;">读取文件</button>
      </div>
      <div style="display:flex;gap:12px;align-items:stretch;">
        <div style="flex:1;display:flex;flex-direction:column;">
          <label style="font-weight:bold;margin-bottom:4px;">Markdown</label>
          <textarea id="mdInput" style="flex:1;width:100%;height:600px;min-height:480px;resize:vertical;padding:8px;font-family:Consolas,monospace;"></textarea>
        </div>
        <div style="display:flex;flex-direction:column;justify-content:center;gap:12px;margin-left:5px;">
          <button id="md2bbBtn" title="Markdown → BBCode" style="padding:8px 12px;font-size:18px;margin-left:10px">→</button>
          <button id="bb2mdBtn" title="BBCode → Markdown" style="padding:8px 12px;font-size:18px;margin-left:10px">←</button>
        </div>
        <div style="flex:1;display:flex;flex-direction:column;">
          <label style="font-weight:bold;margin-bottom:4px;">BBCode</label>
          <textarea id="bbcodeInput" style="flex:1;width:100%;height:600px;min-height:480px;resize:vertical;padding:8px;font-family:Consolas,monospace;"></textarea>
        </div>
      </div>
      <div style="display:flex;gap:10px;justify-content:flex-end;">
        <button id="insertToEditorBtn" style="padding:6px 18px;background:#3890ff;color:#fff;border:none;cursor:pointer;border-radius:4px;">插入到编辑框</button>
        <button id="closeMdBbModalBtn" style="padding:6px 18px;background:#bbb;color:#333;border:none;cursor:pointer;border-radius:4px;">关闭</button>
      </div>
    </div>
  `;
    document.body.appendChild(modal);

    // 新增：文件导入相关
    const fileImportPanel = modal.querySelector('#fileImportPanel');
    const toggleFileImportBtn = modal.querySelector('#toggleFileImportBtn');
    toggleFileImportBtn.onclick = () => {
      if (fileImportPanel.style.display === 'none') {
        fileImportPanel.style.display = 'flex';
        toggleFileImportBtn.textContent = '收起';
      } else {
        fileImportPanel.style.display = 'none';
        toggleFileImportBtn.textContent = '导入本地文件';
      }
    };

    const fileInput = modal.querySelector('#mdFileInputConvert');
    const readFileBtn = modal.querySelector('#readFileBtnConvert');
    if (readFileBtn) {
      readFileBtn.onclick = () => {
        if (!fileInput.files || !fileInput.files[0]) { alert('请选择文件'); return; }
        const reader = new FileReader();
        reader.onload = e => { mdInput.value = e.target.result; };
        reader.onerror = () => alert('读取文件失败');
        reader.readAsText(fileInput.files[0], 'utf-8');
      };
    }

    const mdInput = modal.querySelector('#mdInput');
    const bbcodeInput = modal.querySelector('#bbcodeInput');
    const md2bbBtn = modal.querySelector('#md2bbBtn');
    const bb2mdBtn = modal.querySelector('#bb2mdBtn');
    const insertBtn = modal.querySelector('#insertToEditorBtn');
    const closeBtn = modal.querySelector('#closeMdBbModalBtn');

    mdInput.value = '';
    bbcodeInput.value = '';

    md2bbBtn.onclick = () => {
      bbcodeInput.value = mdToBBCode(mdInput.value);
    };
    bb2mdBtn.onclick = () => {
      mdInput.value = bbcodeToMarkdown(bbcodeInput.value);
    };

    insertBtn.onclick = () => {
      Promise.resolve().then(() => Promise.resolve().then(function () { return utils; })).then(({ insertAtCursor }) => {
        insertAtCursor(mainTextarea, bbcodeInput.value, lastSelection);
        modal.remove();
      });
    };
    closeBtn.onclick = () => modal.remove();
  }

  // 已包含 mdToBBCode 和 bbcodeToMarkdown，无需变动

  // 插入白金卡弹窗
  function createPlatinumModal(mainTextarea, lastSelection) {
    const bgColors = COLOR_BG_CHOICES;
    const fontColors = COLOR_FONT_CHOICES;
    let selectedBg = '';
    let selectedFont = '';
    const modal = document.createElement('div');
    modal.style.cssText = 'position:fixed;left:0;top:0;width:100%;height:100%;background:rgba(0,0,0,.55);z-index:9999;display:flex;align-items:center;justify-content:center;font-size:14px;';
    modal.innerHTML = `
    <div style="background:#fff;width:700px;max-width:94%;padding:16px;box-shadow:0 2px 12px rgba(0,0,0,.3);display:flex;flex-direction:column;gap:10px;">
      <h3 style='margin:0;font-size:16px'>生成白金卡</h3>
      <div style='display:flex;flex-direction:column;gap:10px;'>
        <div>
          <span style='margin-right:6px;'>背景颜色:</span>
          ${bgColors.map(c=>`<span class='pl-bg-choice' data-color='${c}' title='${c}' style='display:inline-block;width:24px;height:24px;border:2px solid #ccc;border-radius:4px;cursor:pointer;background:${c};margin-right:4px;'></span>`).join('')}
          <input class='pl-input' data-key='bgCustom' placeholder='自定义(如 #123456)' style='width:120px;padding:4px;margin-left:8px;' />
        </div>
        <div>
          <span style='margin-right:6px;'>字体颜色:</span>
          ${fontColors.map(c=>`<span class='pl-font-choice' data-color='${c}' title='${c}' style='display:inline-block;width:24px;height:24px;border:2px solid #ccc;border-radius:4px;cursor:pointer;background:${c};margin-right:4px;'></span>`).join('')}
          <input class='pl-input' data-key='fontCustom' placeholder='自定义(如 #ffffff)' style='width:120px;padding:4px;margin-left:8px;' />
        </div>
        <div id='plRows' style='display:flex;flex-direction:column;gap:6px;'></div>
        <div style='display:flex;justify-content:flex-end;'>
          <button id='plAddRowBtn' style='padding:4px 10px;background:#3890ff;color:#fff;border:none;cursor:pointer;border-radius:4px;font-size:12px;'>添加新的一行</button>
        </div>
        <div style='display:flex;align-items:flex-start;gap:8px;'>
          <label style='flex:0 0 110px;text-align:right;color:#333;padding-top:6px;'>全成就思路：</label>
          <textarea class='pl-input' data-key='idea' placeholder='全成就思路 (多行 可选)' style='flex:1;height:180px;padding:8px;font-family:Consolas,monospace;'></textarea>
        </div>
      </div>
      <div style='display:flex;gap:8px;justify-content:flex-end;'>
        <button id='confirmPlBtn' style='padding:6px 12px;background:#ff7a18;color:#fff;border:none;cursor:pointer;'>生成并插入</button>
        <button id='cancelPlBtn' style='padding:6px 12px;background:#bbb;color:#333;border:none;cursor:pointer;'>取消</button>
      </div>
    </div>`;
    document.body.appendChild(modal);

    modal.querySelectorAll('.pl-bg-choice').forEach(el => {
      el.onclick = () => {
        selectedBg = el.dataset.color;
        modal.querySelectorAll('.pl-bg-choice').forEach(x=>x.style.borderColor='#ccc');
        el.style.borderColor = '#000';
      };
    });
    modal.querySelectorAll('.pl-font-choice').forEach(el => {
      el.onclick = () => {
        selectedFont = el.dataset.color;
        modal.querySelectorAll('.pl-font-choice').forEach(x=>x.style.borderColor='#ccc');
        el.style.borderColor = '#000';
      };
    });

    const rowsWrap = modal.querySelector('#plRows');
    const defaultRows = [
      ['图片地址','img','图片地址 (可选)'],
      ['全成就耗时','time','全成就耗时 (例:25-30h 可选)'],
      ['全成就需要周目','week','全成就需要周目 (例:一周目即可 可选)'],
      ['有无难度杯','diff','有无难度杯 (例:无/说明 可选)'],
      ['是否需要购买dlc','dlc','是否需要购买DLC (例:不需要 可选)'],
      ['需不需要联机/双手柄','coop','需不需要联机/双手柄 (例:不需要 可选)'],
      ['有无奖杯bug','bug','有无奖杯BUG (例:未遇到 可选)'],
      ['可错过杯','miss','可错过杯 (例:[trophy=xxxxx][/trophy] 说明 可选)']
    ];
    function addRow(label, key, placeholder){
      const div = document.createElement('div');
      div.className='pl-row';
      div.style.cssText='display:flex;align-items:center;gap:8px;';
      div.innerHTML = `<input class='pl-label-input' data-default='${label}' data-row-key='${key}' value='${label}' style='flex:0 0 140px;padding:6px;'/>`+
        `<input class='pl-value-input' data-row-key='${key}' placeholder='${placeholder}' style='flex:1;padding:6px;' />`;
      rowsWrap.appendChild(div);
    }
    defaultRows.forEach(r=>addRow(...r));
    modal.querySelector('#plAddRowBtn').onclick=()=> addRow('自定义标签','custom'+Date.now(),'内容');

    function buildContent() {
      const mapInputs = {};
      modal.querySelectorAll('.pl-input').forEach(i=> mapInputs[i.dataset.key] = i.value.trim());
      const bg = mapInputs.bgCustom || selectedBg || '?';
      const fc = mapInputs.fontCustom || selectedFont || '?';
      let out = '[tbl=#f5f5f7]\n';
      rowsWrap.querySelectorAll('.pl-row').forEach(r=>{
        const left = r.querySelector('.pl-label-input').value.trim();
        const right = r.querySelector('.pl-value-input').value.trim();
        const key = r.querySelector('.pl-value-input').dataset.rowKey;
        if(!right) return;
        if(key === 'img') { out += `[img]${right}[/img]\n`; return; }
        if (bg !== '?' && fc !== '?') {
          out += `[bgcolor=${bg}][color=${fc}]${left}[/color],${right}\n`;
        } else {
          out += `${left},${right}\n`;
        }
      });
      if (mapInputs.idea) {
        if (bg !== '?' && fc !== '?') {
          out += `[bgcolor=${bg}][center][color=${fc}]全成就思路[/color][/center]\n`;
        } else {
          out += `[center]全成就思路[/center]\n`;
        }
      }
      out += '[/tbl]\n';
      return out;
    }

    modal.querySelector('#confirmPlBtn').onclick = () => {
      const content = buildContent();
      insertAtCursor(mainTextarea, content, lastSelection);
      modal.remove();
    };
    modal.querySelector('#cancelPlBtn').onclick = () => modal.remove();
  }

  // 插入表格弹窗（完整可视化表格编辑）
  function createTableModal(mainTextarea, lastSelection) {
    const maxRows = 30, maxCols = 15, minRows = 2, minCols = 2;
    let selRows = 0, selCols = 0;
    let selectedScheme = SCHEMES.blue;
    let centerAll = true;

    const modal = document.createElement('div');
    modal.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:9999;display:flex;align-items:center;justify-content:center;font-size:14px;';
    modal.innerHTML = `
    <div style="background:#fff;width:680px;max-width:95%;padding:16px;box-shadow:0 2px 12px rgba(0,0,0,.3);display:flex;flex-direction:column;gap:14px;">
      <h3 style='margin:0;font-size:16px'>插入表格 (手动)</h3>
      <div id='stageSize' style='display:flex;flex-direction:column;gap:8px;'>
        <p style='margin:0;'>选择表格尺寸 (最少 ${minRows}x${minCols}, 最大 ${maxRows}x${maxCols})</p>
        <div style='border:1px solid #ddd;padding:6px;overflow:auto;max-height:300px;background:#fafafa;'>
          <div id='gridSelect' style='display:grid;width:100%;grid-template-columns:repeat(${maxCols},1fr);grid-auto-rows:36px;gap:4px;user-select:none;'>
            ${Array.from({length:maxRows*maxCols}).map((_,i)=>`<div data-r='${Math.floor(i/maxCols)+1}' data-c='${i%maxCols+1}' style='background:#eee;border:1px solid #ccc;border-radius:3px;'></div>`).join('')}
          </div>
        </div>
        <div style='margin-top:4px;'>已选择: <span id='sizeDisplay'>0 x 0</span></div>
        <div style='display:flex;gap:10px;justify-content:flex-end;margin-top:4px;'>
          <button id='nextSizeBtn' style='padding:6px 12px;background:#3890ff;color:#fff;border:none;cursor:pointer;border-radius:4px;' disabled>下一步</button>
          <button id='cancelTblBtn' style='padding:6px 12px;background:#bbb;color:#333;border:none;cursor:pointer;border-radius:4px;'>取消</button>
        </div>
      </div>
      <div id='stageData' style='display:none;flex-direction:column;gap:10px;'>
        <div style='display:flex;flex-direction:column;gap:6px;'>
          <div style='display:flex;flex-wrap:wrap;gap:6px;align-items:center;'>
            <span style='font-size:12px;color:#555;'>预设风格:</span>
            ${Object.entries(SCHEMES).map(([k,v])=>`<button class='tbl-style-btn' data-key='${k}' style='position:relative;padding:4px 10px;border:1px solid #ccc;background:${v.oddRowBg};color:#fff;font-size:12px;cursor:pointer;border-radius:4px;'>${v.name}</button>`).join('')}
            <button id='tbl-style-cancel' style='padding:4px 10px;border:1px solid #ccc;background:#eee;color:#333;font-size:12px;cursor:pointer;border-radius:4px;'>取消风格</button>
            <button id='tbl-center-toggle' style='padding:4px 10px;border:1px solid #ccc;background:#4e81bd;color:#fff;font-size:12px;cursor:pointer;border-radius:4px;'>居中 ✓</button>
          </div>
          <span style='font-size:12px;color:#666;'>（风格与居中与“导入Excel”保持一致：隔行背景，仅首行/奇数行添加 [bgcolor]；居中勾选则所有单元格添加 [center] 包裹）</span>
        </div>
        <div id='dataInputs' style='max-height:360px;overflow:auto;border:1px solid #ddd;padding:8px;border-radius:4px;background:#fafafa;'></div>
        <div style='display:flex;gap:8px;justify-content:flex-end;'>
          <button id='insertTblBtn' style='padding:6px 12px;background:#ff7a18;color:#fff;border:none;cursor:pointer;border-radius:4px;'>生成并插入</button>
          <button id='backTblBtn' style='padding:6px 12px;background:#666;color:#fff;border:none;cursor:pointer;border-radius:4px;'>返回</button>
          <button id='cancelTblBtn2' style='padding:6px 12px;background:#bbb;color:#333;border:none;cursor:pointer;border-radius:4px;'>取消</button>
        </div>
      </div>
    </div>`;
    document.body.appendChild(modal);

    const grid = modal.querySelector('#gridSelect');
    const disp = modal.querySelector('#sizeDisplay');
    const nextBtn = modal.querySelector('#nextSizeBtn');
    function highlight(r,c){ grid.querySelectorAll('div').forEach(d=>{ const dr=+d.dataset.r, dc=+d.dataset.c; d.style.background=(dr<=r && dc<=c)? '#2196f3':'#eee'; }); }
    let mouseDown=false;
    grid.onmousedown = e=>{ if(e.target.dataset.r){ mouseDown=true; selRows=+e.target.dataset.r; selCols=+e.target.dataset.c; highlight(selRows,selCols); updateSize(); } };
    grid.onmouseover = e=>{ if(mouseDown && e.target.dataset.r){ selRows=+e.target.dataset.r; selCols=+e.target.dataset.c; highlight(selRows,selCols); updateSize(); } };
    grid.onmouseup = ()=>{ mouseDown=false; };
    grid.onclick = e=>{ if(e.target.dataset.r){ selRows=+e.target.dataset.r; selCols=+e.target.dataset.c; highlight(selRows,selCols); updateSize(); } };
    function updateSize(){ disp.textContent = selRows + ' x ' + selCols; nextBtn.disabled = !(selRows>=minRows && selCols>=minCols); }
    nextBtn.onclick = ()=>{ modal.querySelector('#stageSize').style.display='none'; modal.querySelector('#stageData').style.display='flex'; buildInputs(); initStyleButtons(); };
    modal.querySelectorAll('#cancelTblBtn,#cancelTblBtn2').forEach(b=> b.onclick = ()=> modal.remove());
    modal.querySelector('#backTblBtn').onclick = ()=>{ modal.querySelector('#stageData').style.display='none'; modal.querySelector('#stageSize').style.display='flex'; };

    function buildInputs(){ const wrap=modal.querySelector('#dataInputs'); wrap.innerHTML=''; const tbl=document.createElement('table'); tbl.style.borderCollapse='collapse'; tbl.style.width='100%'; for(let r=0;r<selRows;r++){ const tr=document.createElement('tr'); for(let c=0;c<selCols;c++){ const td=document.createElement('td'); td.style.border='1px solid #ccc'; td.style.padding='2px'; td.innerHTML=`<input data-r='${r}' data-c='${c}' style='width:100%;box-sizing:border-box;padding:4px;font-size:12px;' placeholder='R${r+1}C${c+1}'>`; tr.appendChild(td);} tbl.appendChild(tr);} wrap.appendChild(tbl);}

    function initStyleButtons(){
      const centerBtn = modal.querySelector('#tbl-center-toggle');
      centerBtn.onclick = ()=>{ centerAll = !centerAll; centerBtn.textContent = centerAll? '居中 ✓':'居中 ✕'; centerBtn.style.background = centerAll? '#4e81bd':'#777'; };
      function applyTick(btn){ modal.querySelectorAll('.tbl-style-btn .tick').forEach(t=>t.remove()); if(btn){ const s=document.createElement('span'); s.className='tick'; s.textContent='✓'; s.style.cssText='position:absolute;right:4px;bottom:2px;font-size:12px;font-weight:bold;color:#fff;text-shadow:0 0 2px #000;'; btn.appendChild(s);} }
      function clearOutlines(){ modal.querySelectorAll('.tbl-style-btn').forEach(x=>x.style.outline='none'); modal.querySelector('#tbl-style-cancel').style.outline='none'; }
      const defBtn = modal.querySelector('.tbl-style-btn[data-key="blue"]'); if(defBtn){ defBtn.style.outline='2px solid #000'; applyTick(defBtn); }
      modal.querySelectorAll('.tbl-style-btn').forEach(b=>{ b.onclick=()=>{ selectedScheme = SCHEMES[b.dataset.key]; clearOutlines(); b.style.outline='2px solid #000'; applyTick(b); }; });
      modal.querySelector('#tbl-style-cancel').onclick=()=>{ selectedScheme = null; clearOutlines(); modal.querySelector('#tbl-style-cancel').style.outline='2px solid #000'; applyTick(null); };
    }

    modal.querySelector('#insertTblBtn').onclick = ()=>{
      const cells = Array.from(modal.querySelectorAll('#dataInputs input'));
      const data = Array.from({length:selRows},()=>Array(selCols).fill(''));
      cells.forEach(inp=>{ data[+inp.dataset.r][+inp.dataset.c]=inp.value.trim(); });
      let out = selectedScheme? `[tbl=${selectedScheme.tableBg}]\n` : '[tbl]\n';
      data.forEach((row, i) => {
        const converted = row.map(val => {
          let v = (val || '').replace(/,/g, '，');
          if (v && centerAll) v = `[center]${v}[/center]`;
          if (i === 0) {
            // 表头深蓝色
            return `[bgcolor=#4E81BD]${v}`;
          } else if (i % 2 === 1) {
            // 隔行浅蓝色
            return `[bgcolor=#DBE5F1]${v}`;
          }
          return v;
        }).join(',');
        out += converted + '\n';
      });
      out += '[/tbl]\n';
      insertAtCursor(mainTextarea,out,lastSelection); modal.remove();
    };
  }

  // 编辑表格弹窗（可视化表格编辑）
  function createBeautifyTableModal(mainTextarea, lastSelection) {
    // 读取选区内容，判断是否为合法表格
    const selectedText = mainTextarea.value.substring(mainTextarea.selectionStart, mainTextarea.selectionEnd).trim();
    if (!selectedText.startsWith('[tbl') || !selectedText.endsWith('[/tbl]')) {
      alert('请选择表格文本（以"[tbl"开头，"[/tbl]"结尾）再点击此按钮！');
      return;
    }
    const rows = selectedText
      .replace(/\[tbl(=[^\]]+)?\]/, '')
      .replace(/\[\/tbl\]/, '')
      .split('\n')
      .filter(row => row.trim())
      .map(row => row.split(',').map(cell => cell.replace(/\[.*?\]/g, '').trim()));

    const modal = document.createElement('div');
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:9999;display:flex;align-items:center;justify-content:center;font-size:14px;';
    modal.innerHTML = `
    <div style="background:#fff;width:760px;max-width:95%;padding:16px;display:flex;flex-direction:column;gap:12px;box-shadow:0 2px 12px rgba(0,0,0,.3);">
      <h3 style='margin:0;font-size:16px;'>编辑表格</h3>
      <div id='tableEditor' style='overflow:auto;border:1px solid #ddd;padding:8px;background:#fafafa;max-height:300px;'>
        <table style='border-collapse:collapse;width:100%;'>
          ${rows.map((row, rIdx) => `
            <tr>
              ${row.map((cell, cIdx) => `<td style='border:1px solid #ccc;padding:4px;'>
                <input data-row='${rIdx}' data-col='${cIdx}' value='${cell}' style='width:100%;box-sizing:border-box;padding:4px;' />
              </td>`).join('')}
            </tr>
          `).join('')}
        </table>
      </div>
      <div style='display:flex;gap:8px;'>
        <button id='addRowBtn' style='padding:6px 12px;background:#4caf50;color:#fff;border:none;cursor:pointer;border-radius:4px;'>增加一行</button>
        <button id='addColBtn' style='padding:6px 12px;background:#4caf50;color:#fff;border:none;cursor:pointer;border-radius:4px;'>增加一列</button>
      </div>
      <div style='display:flex;flex-wrap:wrap;gap:6px;align-items:center;'>
        <span style='font-size:12px;color:#555;'>预设风格:</span>
        ${Object.entries(SCHEMES).map(([k,v])=>`<button class='beautify-style-btn' data-key='${k}' style='position:relative;padding:4px 8px;border:1px solid #ccc;background:${v.oddRowBg};color:${v.fontColor};font-size:12px;cursor:pointer;border-radius:4px;'>${v.name}</button>`).join('')}
        <button id='beautify-style-cancel' style='padding:4px 8px;border:1px solid #ccc;background:#eee;color:#333;font-size:12px;cursor:pointer;border-radius:4px;'>取消风格</button>
      </div>
      <div style='display:flex;gap:8px;align-items:center;'>
        <button id='beautify-center-toggle' style='padding:4px 10px;border:1px solid #ccc;background:#4e81bd;color:#fff;font-size:12px;cursor:pointer;border-radius:4px;'>居中 ✓</button>
      </div>
      <div style='display:flex;gap:8px;justify-content:flex-end;'>
        <button id='confirmBeautifyBtn' style='padding:6px 12px;background:#ff7a18;color:#fff;border:none;cursor:pointer;'>确认</button>
        <button id='cancelBeautifyBtn' style='padding:6px 12px;background:#bbb;color:#333;border:none;cursor:pointer;'>关闭</button>
      </div>
    </div>`;

    document.body.appendChild(modal);

    const tableEditor = modal.querySelector('#tableEditor table');
    const centerToggle = modal.querySelector('#beautify-center-toggle');
    let centerAll = true;
    centerToggle.onclick = () => {
      centerAll = !centerAll;
      centerToggle.textContent = centerAll ? '居中 ✓' : '居中 ✕';
      centerToggle.style.background = centerAll ? '#4e81bd' : '#777';
    };

    modal.querySelector('#addRowBtn').onclick = () => {
      const row = document.createElement('tr');
      const colCount = tableEditor.rows[0]?.cells.length || 1;
      for (let i = 0; i < colCount; i++) {
        const cell = document.createElement('td');
        cell.style.cssText = 'border:1px solid #ccc;padding:4px;';
        cell.innerHTML = `<input style='width:100%;box-sizing:border-box;padding:4px;' />`;
        row.appendChild(cell);
      }
      tableEditor.appendChild(row);
    };

    modal.querySelector('#addColBtn').onclick = () => {
      Array.from(tableEditor.rows).forEach(row => {
        const cell = document.createElement('td');
        cell.style.cssText = 'border:1px solid #ccc;padding:4px;';
        cell.innerHTML = `<input style='width:100%;box-sizing:border-box;padding:4px;' />`;
        row.appendChild(cell);
      });
    };

    modal.querySelector('#confirmBeautifyBtn').onclick = () => {
      const rows = Array.from(tableEditor.rows).map(row => {
        return Array.from(row.cells).map(cell => {
          const input = cell.querySelector('input');
          let value = input.value.trim();
          if (centerAll && value) value = `[center]${value}[/center]`;
          return value.replace(/,/g, '，');
        }).join(',');
      });

      const bbcode = `[tbl]\n${rows.join('\n')}\n[/tbl]`;
      insertAtCursor(mainTextarea, bbcode, lastSelection);
      modal.remove();
    };

    modal.querySelector('#cancelBeautifyBtn').onclick = () => modal.remove();

    modal.querySelectorAll('.beautify-style-btn').forEach(b => {
      b.onclick = () => {
        const schemeKey = b.dataset.key;
        const scheme = SCHEMES[schemeKey];
        if (!scheme) return;
        Array.from(tableEditor.rows).forEach((row, rowIndex) => {
          Array.from(row.cells).forEach(cell => {
            const input = cell.querySelector('input');
            if (input) {
              let value = input.value.trim();
              if (value) {
                if (rowIndex % 2 === 0) {
                  value = `[bgcolor=${scheme.oddRowBg}]${value}`;
                } else {
                  value = `[bgcolor=${scheme.evenRowBg}]${value}`;
                }
                input.value = value;
              }
            }
          });
        });
      };
    });

    modal.querySelector('#beautify-style-cancel').onclick = () => {
      Array.from(tableEditor.rows).forEach(row => {
        Array.from(row.cells).forEach(cell => {
          const input = cell.querySelector('input');
          if (input) {
            input.value = input.value.replace(/\[bgcolor=.*?\]/g, '').trim();
          }
        });
      });
    };
  }

  // 导入 Excel 弹窗
  function createExcelModal(mainTextarea, lastSelection) {
    let selectedScheme = null;
    let centerAll = true;
    const modal=document.createElement('div');
    modal.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:9999;display:flex;align-items:center;justify-content:center;font-size:14px;';
    modal.innerHTML = `
    <div style='background:#fff;width:760px;max-width:95%;padding:16px;display:flex;flex-direction:column;gap:12px;box-shadow:0 2px 12px rgba(0,0,0,.3);'>
      <h3 style='margin:0;font-size:16px;'>导入 Excel</h3>
      <div style='display:flex;flex-wrap:wrap;gap:6px;align-items:center;'>
        <span style='font-size:12px;color:#555;'>预设风格:</span>
        ${Object.entries(SCHEMES).map(([k,v])=>`<button class='xls-style-btn' data-key='${k}' style='position:relative;padding:4px 8px;border:1px solid #ccc;background:${v.oddRowBg};color:${v.fontColor};font-size:12px;cursor:pointer;border-radius:4px;'>${v.name}</button>`).join('')}
        <button id='xls-style-cancel' style='padding:4px 8px;border:1px solid #ccc;background:#eee;color:#333;font-size:12px;cursor:pointer;border-radius:4px;'>取消风格</button>
      </div>
      <div style='display:flex;gap:8px;align-items:center;'>
        <button id='xls-center-toggle' style='padding:4px 10px;border:1px solid #ccc;background:#4e81bd;color:#fff;font-size:12px;cursor:pointer;border-radius:4px;'>居中 ✓</button>
        <span style='font-size:12px;color:#666;'>（点击可切换是否为每个单元格添加 [center] 包裹）</span>
      </div>
      <input id='xlsFileInputMain' type='file' accept='.xlsx,.xls' style='width:100%;' />
      <div id='excelPreviewBox' style='display:none;flex-direction:column;gap:6px;'>
        <label style='font-weight:bold;'>预览 & 编辑:</label>
        <textarea id='xlsPreview' style='width:100%;height:220px;padding:6px;font-family:Consolas,monospace;'></textarea>
      </div>
      <div style='display:flex;gap:8px;justify-content:flex-end;'>
        <button id='confirmXlsBtn' style='padding:6px 12px;background:#ff7a18;color:#fff;border:none;cursor:pointer;' disabled>插入</button>
        <button id='cancelXlsBtn' style='padding:6px 12px;background:#bbb;color:#333;border:none;cursor:pointer;'>关闭</button>
      </div>
    </div>`;

    document.body.appendChild(modal);

    function applyTick(btn){
      modal.querySelectorAll('.xls-style-btn .tick').forEach(t=>t.remove());
      if(btn){
        const span=document.createElement('span');
        span.className='tick';
        span.textContent='✓';
        span.style.cssText='position:absolute;right:4px;bottom:2px;font-size:12px;font-weight:bold;color:#fff;text-shadow:0 0 2px #000;';
        btn.appendChild(span);
      }
    }
    function clearOutlines(){ modal.querySelectorAll('.xls-style-btn').forEach(x=>{ x.style.outline='none'; }); modal.querySelector('#xls-style-cancel').style.outline='none'; }

    selectedScheme = SCHEMES.blue;
    const defaultBtn = modal.querySelector('.xls-style-btn[data-key="blue"]');
    if(defaultBtn){ defaultBtn.style.outline='2px solid #000'; applyTick(defaultBtn); }

    modal.querySelectorAll('.xls-style-btn').forEach(b=>{ b.onclick=()=>{ selectedScheme = SCHEMES[b.dataset.key]; clearOutlines(); b.style.outline='2px solid #000'; applyTick(b); }; });
    modal.querySelector('#xls-style-cancel').onclick=()=>{ selectedScheme = null; clearOutlines(); modal.querySelector('#xls-style-cancel').style.outline='2px solid #000'; applyTick(null); };

    const centerBtn = modal.querySelector('#xls-center-toggle');
    centerBtn.onclick = () => {
      centerAll = !centerAll;
      centerBtn.textContent = centerAll ? '居中 ✓' : '居中 ✕';
      centerBtn.style.background = centerAll ? '#4e81bd' : '#777';
    };

    function ensureXLSX(cb){ if(window.XLSX){ cb(); return; } const s=document.createElement('script'); s.src='https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js'; s.onload=()=>cb(); s.onerror=()=>alert('加载 XLSX 库失败'); document.head.appendChild(s); }

    function colToLetter(n){ let s=''; while(n>=0){ s=String.fromCharCode(n%26 + 65)+s; n=Math.floor(n/26)-1; } return s; }
    function isCellCentered(rIndex, cIndex, sheet) {
      try {
        const addr = colToLetter(cIndex) + (rIndex + 1);
        const cell = sheet[addr];
        if (cell && cell.s && cell.s.alignment && cell.s.alignment.horizontal) {
          const h = cell.s.alignment.horizontal.toLowerCase();
          return h === 'center' || h === 'centercontinuous';
        }
      } catch (e) {
        console.error('[isCellCentered] Error:', e);
      }
      return false;
    }
    function excelToBBCode(rows, sheet){
      const sch=selectedScheme;
      let out= sch? `[tbl=${sch.tableBg}]\n` : '[tbl]\n';
      rows.forEach((r,i)=>{
        if(r.every(c=>c==null || c==='')) return; // 跳过全空行
        const rowCopy=r.slice();
        let lineCells=[];
        for(let ci=0; ci<rowCopy.length; ci++){
          let raw=rowCopy[ci];
          raw = raw===undefined? '' : String(raw).replace(/,/g,'，');
          if(raw.trim()!==''){
            if(centerAll){ raw = `[center]${raw}[/center]`; }
            else if(isCellCentered(i,ci,sheet)){ raw = `[center]${raw}[/center]`; }
          }
          if (i === 0) {
            // 表头深蓝色
            raw = `[bgcolor=#4E81BD]${raw}`;
          } else if (i % 2 === 1) {
            // 隔行浅蓝色
            raw = `[bgcolor=#DBE5F1]${raw}`;
          }
          lineCells.push(raw);
        }
        const lineData = lineCells.join(',');
        out += lineData + '\n';
      });
      out += '[/tbl]\n';
      return out;
    }

    function handleExcel(file) {
      console.log('[Excel] 开始处理文件:', file.name);
      ensureXLSX(() => {
        const reader = new FileReader();
        reader.onload = e => {
          try {
            const data = new Uint8Array(e.target.result);
            const wb = XLSX.read(data, { type: 'array', cellStyles: true });
            const sheet = wb.Sheets[wb.SheetNames[0]];
            const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, blankrows: false });
            console.log('[Excel] 解析成功, 行数:', rows.length);
            const bb = excelToBBCode(rows, sheet);
            const box = modal.querySelector('#excelPreviewBox');
            box.style.display = 'flex';
            modal.querySelector('#xlsPreview').value = bb;
            modal.querySelector('#confirmXlsBtn').disabled = false;
          } catch (err) {
            console.error('[Excel] 解析失败:', err);
            alert('解析失败: ' + err.message);
          } finally {
            console.log('[Excel] 文件处理完成');
          }
        };
        reader.onerror = () => alert('读取文件失败');
        reader.readAsArrayBuffer(file);
      });
    }

    modal.querySelector('#xlsFileInputMain').onchange=e=>{ const f=e.target.files[0]; if(f) handleExcel(f); };
    modal.querySelector('#confirmXlsBtn').onclick = () => {
      const ta = modal.querySelector('#xlsPreview');
      if (ta && ta.value.trim()) {
        insertAtCursor(mainTextarea, ta.value.trim() + '\n', lastSelection);
      }
      modal.remove();
    };
    modal.querySelector('#cancelXlsBtn').onclick=()=> modal.remove();
  }

  // 工具栏相关逻辑，拆分自 enhancer.js

  function setupToolbar(mainTextarea, lastSelection) {
    // 只在规范网址下显示部分按钮
    const url = window.location.href;
    const urlRules = [
      /^https:\/\/psnine\.com\/topic\/.*\/edit$/,
      /^https:\/\/psnine\.com\/node\/talk\/add$/,
      /^https:\/\/www\.psnine\.com\/topic\/.*\/edit$/,
      /^https:\/\/www\.psnine\.com\/node\/talk\/add$/
    ];
    const isValidUrl = urlRules.some(rule => rule.test(url));

    // 统一工具栏容器
    const topBar = document.createElement('div');
    topBar.style.cssText = 'display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:8px 0;';
    mainTextarea.parentNode.insertBefore(topBar, mainTextarea);

    // 插件主按钮（仅不规范时显示，绑定到.editor）
    let toggleBtn = null;
    if (!isValidUrl) {
      let editorDiv = document.querySelector('.editor');
      if (editorDiv) {
        toggleBtn = document.createElement('button');
        toggleBtn.type = 'button';
        toggleBtn.title = '展开P9富文本增强工具栏';
        // 初始为加号
        toggleBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" style="display:block;margin:auto;" xmlns="http://www.w3.org/2000/svg"><path d="M12 5v14m-7-7h14" stroke="#3890ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
        toggleBtn.style.cssText = 'width:26px;height:26px;padding:0;background:#fff;border:1px solid #3890ff;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 4px rgba(0,0,0,0.07);margin:4px 0 0 0;';
        editorDiv.appendChild(toggleBtn);
        topBar.style.display = 'none';
        toggleBtn.onclick = () => {
          if (topBar.style.display === 'none') {
            topBar.style.display = 'flex';
            toggleBtn.title = '收起P9富文本增强工具栏';
            // 展开后变为减号
            toggleBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" style="display:block;margin:auto;" xmlns="http://www.w3.org/2000/svg"><path d="M5 12h14" stroke="#3890ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
          } else {
            topBar.style.display = 'none';
            toggleBtn.title = '展开P9富文本增强工具栏';
            // 收起后变为加号
            toggleBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" style="display:block;margin:auto;" xmlns="http://www.w3.org/2000/svg"><path d="M12 5v14m-7-7h14" stroke="#3890ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
          }
        };
      }
    }

    // 公共插入函数
    function insertAtCursor(textarea, text) {
      if (document.activeElement !== textarea) {
        textarea.focus();
        if (typeof lastSelection.start === 'number') {
          textarea.selectionStart = lastSelection.start;
          textarea.selectionEnd = lastSelection.end;
        }
      }
      const start = textarea.selectionStart ?? textarea.value.length;
      const end = textarea.selectionEnd ?? textarea.value.length;
      const before = textarea.value.substring(0, start);
      const after = textarea.value.substring(end);
      textarea.value = before + text + after;
      const pos = before.length + text.length;
      textarea.selectionStart = textarea.selectionEnd = pos;
      // 更新存储的光标位置
      lastSelection.start = lastSelection.end = pos;
    }

    // 添加 BBCode 快捷按钮（图标+文字） 支持选中文本包裹标签（原始实现恢复）
    function addBBBtn(icon, label, snippet, opts = {}) {
      const { openTag, closeTag, skipWrap } = opts;
      const b = document.createElement('button');
      b.type = 'button';
      b.innerHTML = `<span style="font-size:16px;line-height:16px;">${icon}</span><span style="margin-left:4px;">${label}</span>`;
      b.style.cssText = 'display:flex;align-items:center;gap:4px;padding:6px 10px;background:#333;color:#fff;border:none;cursor:pointer;font-size:12px;border-radius:4px;';
      b.title = label + ' (' + snippet + ')';
      b.onclick = () => {
        const start = mainTextarea.selectionStart;
        const end = mainTextarea.selectionEnd;
        const hasSel = typeof start === 'number' && typeof end === 'number' && end > start;
        if (!skipWrap && hasSel && openTag && closeTag) {
          const before = mainTextarea.value.slice(0, start);
          const sel = mainTextarea.value.slice(start, end);
          const after = mainTextarea.value.slice(end);
          const wrapped = openTag + sel + closeTag;
          mainTextarea.value = before + wrapped + after;
          const newPos = before.length + wrapped.length;
          mainTextarea.selectionStart = mainTextarea.selectionEnd = newPos;
          lastSelection.start = lastSelection.end = newPos;
          mainTextarea.focus();
        } else {
          insertAtCursor(mainTextarea, snippet);
        }
      };
      topBar.appendChild(b);
    }

    // 创建插入白金卡按钮
    const platinumBtn = document.createElement('button');
    platinumBtn.type = 'button';
    platinumBtn.textContent = '插入白金卡';
    platinumBtn.style.cssText = 'padding:6px 12px;background:#ff7a18;color:#fff;border:none;cursor:pointer;border-radius:4px;';
    platinumBtn.onclick = () => createPlatinumModal(mainTextarea, lastSelection);

    // 创建插入表格按钮
    const tableBtn = document.createElement('button');
    tableBtn.type = 'button';
    tableBtn.textContent = '插入表格';
    tableBtn.style.cssText = 'padding:6px 12px;background:#6a5acd;color:#fff;border:none;cursor:pointer;border-radius:4px;';
    tableBtn.onclick = () => createTableModal(mainTextarea, lastSelection);

    // 创建导入 Excel 按钮
    const excelBtn = document.createElement('button');
    excelBtn.type = 'button';
    excelBtn.textContent = '导入Excel';
    excelBtn.style.cssText = 'padding:6px 12px;background:#2196f3;color:#fff;border:none;cursor:pointer;border-radius:4px;';
    excelBtn.onclick = () => createExcelModal(mainTextarea, lastSelection);

    // 创建 Markdown ⇄ BBCode 转换弹窗按钮
    const convertBtn = document.createElement('button');
    convertBtn.type = 'button';
    convertBtn.textContent = '插入Markdwon文本';
    convertBtn.style.cssText = 'padding:6px 12px;background:#2196f3;color:#fff;border:none;cursor:pointer;border-radius:4px;';
    convertBtn.onclick = () => createMdBbcodeConvertModal(mainTextarea, lastSelection);

    // addBBBtn功能区，分页和奖杯按钮仅规范时显示，其余始终显示
    if (isValidUrl) {
      addBBBtn('📄', '分页', '[title][/title]', { openTag:'[title]', closeTag:'[/title]' });
      addBBBtn('🏆', '奖杯', '[trophy=奖杯ID]用户ID（可选）[/trophy]', { skipWrap:true });
    }
    addBBBtn('◼', '涂黑', '[mark][/mark]', { openTag:'[mark]', closeTag:'[/mark]' });
    addBBBtn('🔴', '涂红加粗', '[color=red][b][/b][/color]', { openTag:'[color=red][b]', closeTag:'[/b][/color]' });
    addBBBtn('S̶', '删除线', '[s][/s]', { openTag:'[s]', closeTag:'[/s]' });
    addBBBtn('I', '斜体', '[i][/i]', { openTag:'[i]', closeTag:'[/i]' });
    addBBBtn('U', '下划线', '[u][/u]', { openTag:'[u]', closeTag:'[/u]' });
    addBBBtn('H1', 'H1', '[size=24][/size]', { openTag:'[size=24]', closeTag:'[/size]' });
    addBBBtn('H2', 'H2', '[size=20][/size]', { openTag:'[size=20]', closeTag:'[/size]' });

    // 插入白金卡按钮仅规范时显示
    if (isValidUrl) {
      topBar.appendChild(platinumBtn);
    }
    // 这些按钮始终显示
    topBar.appendChild(tableBtn);
    topBar.appendChild(excelBtn);
    topBar.appendChild(convertBtn);

    if (isValidUrl) {
      // 插件信息按钮
      const pluginInfoBtn = document.createElement('button');
      pluginInfoBtn.type = 'button';
      pluginInfoBtn.textContent = '插入插件信息';
      pluginInfoBtn.style.cssText = 'padding:6px 12px;background:#ff5722;color:#fff;border:none;cursor:pointer;border-radius:4px;';
      pluginInfoBtn.onclick = () => {
        const pluginInfo = "[quote]本文档格式由【p9富文本框增强】插件辅助生成：[url]https://www.psnine.com/topic/38792[/url][/quote]\n";
        insertAtCursor(mainTextarea, pluginInfo);
      };
      topBar.appendChild(pluginInfoBtn);
    }

    // 编辑表格按钮始终显示
    const beautifyTableBtn = document.createElement('button');
    beautifyTableBtn.type = 'button';
    beautifyTableBtn.textContent = '编辑表格';
    beautifyTableBtn.style.cssText = 'padding:6px 12px;background:#4caf50;color:#fff;border:none;cursor:pointer;border-radius:4px;';
    beautifyTableBtn.onclick = () => createBeautifyTableModal(mainTextarea, lastSelection);
    topBar.appendChild(beautifyTableBtn);

    // 如果不符合规范，初始隐藏工具栏
    if (!isValidUrl && topBar) {
      topBar.style.display = 'none';
    }
  }

  function enhanceRichText() {
    const mainTextarea = document.querySelector('#comment');
    if (!mainTextarea) return;
    let lastSelection = { start: mainTextarea.value.length, end: mainTextarea.value.length };
    ['keyup','click','select','input','mouseup','touchend','keydown','blur'].forEach(ev => {
      mainTextarea.addEventListener(ev, () => {
        lastSelection.start = mainTextarea.selectionStart;
        lastSelection.end = mainTextarea.selectionEnd;
      });
    });
    setupToolbar(mainTextarea, lastSelection);
  }

  // 拼接头部信息到打包输出
  if (typeof GM_info === 'undefined') {
    // 非油猴环境下，直接输出头部信息
    // eslint-disable-next-line no-undef
    if (typeof window !== 'undefined') {
      const script = document.createElement('script');
      script.textContent = userscriptHeader;
      document.head.appendChild(script);
    }
  }

  enhanceRichText();

})();


