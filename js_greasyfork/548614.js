// ==UserScript==
// @name         EMR 胸痛病历提取
// @namespace    emr.extractor.sun
// @version      1.3.2
// @description  从网页中提取病历字段并生成结构化 JSON，一键复制/下载；适配你提供的 DOM 类名与结构（.name/.sex/.agevalue/.selectage/.lxdh/.pidno/.emr_row/.tz_row 等）
// @match        *://*/*
// @run-at       document-end
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/548614/EMR%20%E8%83%B8%E7%97%9B%E7%97%85%E5%8E%86%E6%8F%90%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/548614/EMR%20%E8%83%B8%E7%97%9B%E7%97%85%E5%8E%86%E6%8F%90%E5%8F%96.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /** ===========================
   *  可调配置：如页面类名有差异，可在此微调
   *  ===========================
   */
  const SEL = {
    name: 'input.name',                   // 姓名
    sex: 'select.sex',                    // 性别
    ageValue: 'input.agevalue',           // 年龄数字
    ageUnit: 'select.selectage',          // 年龄单位（岁/月/天）
    phone: 'input.lxdh',                  // 电话
    idcard: 'input.pidno',                // 居民身份证
    emrBlocks: '.emr_row .content.input_emr', // 主诉/现病史/体检/处理 —— 顺序映射
    tzBlock: '.tz_row',                   // 体征父容器
    outpNo: '#outpNO',                    // 门诊号

    // 体征各项（在 tzBlock 内）
    vsign: {
      tw: '.vsign_tw',            // 体温 ℃
      hx: '.vsign_hx',            // 呼吸 次/分
      mb: '.vsign_mb',            // 脉搏 次/分
      xl: '.vsign_xl',            // 心率 次/分
      gxy: '.vsign_gxy',          // 收缩压 mmHg
      dxy: '.vsign_dxy',          // 舒张压 mmHg
      xt : '.vsign_xt',           // 血糖 mmol/L
      sg : '.vsign_sg',           // 身高 cm
      tz : '.vsign_tz',           // 体重 kg
      bmi: '.vsign_bmi',          // BMI（若页面未计算，脚本会自动计算）
      bloodType: '.vsign_bloodtype', // 血型
      xybhd: '.vsign_xybhd',      // 血氧饱和度 %
      yw : '.vsign_yw',           // 腰围 cm
    }
  };

  // 主诉/现病史/体格检查/处理意见的顺序约定（与页面 emrBlocks 顺序一致）
  const EMR_ORDER = ['chief_complaint', 'present_illness', 'physical_exam', 'treatment_plan'];

  /** ============ 工具函数 ============ */
  const $one = (sel, root = document) => root.querySelector(sel) || null;
  const $all = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const getVal = (el) => {
    if (!el) return '';
    // 优先取 .value；对于 contenteditable 取 innerText；若有 data-value 作为备选
    if (typeof el.value === 'string' && el.value.trim() !== '') return el.value.trim();
    const text = (el.innerText || el.textContent || '').trim();
    if (text) return text;
    if (el.dataset && el.dataset.value) return (el.dataset.value || '').trim();
    if (el.getAttribute) {
      const dv = el.getAttribute('data-oldvalue') || el.getAttribute('data-value') || '';
      if (dv && dv.trim()) return dv.trim();
    }
    return '';
  };

  const getSelectText = (selEl) => {
    if (!selEl) return '';
    const opt = selEl.selectedOptions && selEl.selectedOptions[0];
    if (opt) return (opt.textContent || opt.value || '').trim();
    // 退化：直接返回 value
    return (selEl.value || '').trim();
  };

  const toNumber = (s) => {
    if (typeof s === 'number') return s;
    if (!s) return NaN;
    const m = String(s).match(/-?\d+(\.\d+)?/);
    return m ? parseFloat(m[0]) : NaN;
  };

  const safeText = (s) => (s || '').replace(/\u00A0/g, ' ').trim();

  const computeBMI = (height_cm, weight_kg) => {
    const h = toNumber(height_cm);
    const w = toNumber(weight_kg);
    if (!isFinite(h) || !isFinite(w) || h <= 0) return '';
    const bmi = w / Math.pow(h / 100, 2);
    return bmi ? bmi.toFixed(1) : '';
  };

  const nowISO = () => new Date().toISOString();

  /** ============ 提取主函数 ============ */
  function extractEMR() {
    const nameEl = $one(SEL.name);
    const sexEl = $one(SEL.sex);
    const ageValueEl = $one(SEL.ageValue);
    const ageUnitEl = $one(SEL.ageUnit);
    const phoneEl = $one(SEL.phone);
    const idEl = $one(SEL.idcard);
    const outpNoEl = $one(SEL.outpNo);

    // 获取电话号，直接从 data-* 属性中提取
    let phoneValue = phoneEl ? phoneEl.dataset.value || phoneEl.dataset.oldvalue : '';

    console.log('提取的电话号：', phoneValue); // 打印提取的电话号

    // 获取身份证号，直接从 data-* 属性中提取
    let idCardValue = idEl ? idEl.dataset.value || idEl.dataset.oldvalue : '';

    console.log('提取的身份证号：', idCardValue); // 打印提取的身份证号

    // 获取门诊号
    const outpNoValue = outpNoEl ? getVal(outpNoEl) : '';

    console.log('提取的门诊号：', outpNoValue); // 打印提取的门诊号

    // 基本信息
    const base = {
      outp_no: outpNoValue, // 提取门诊号
      name: getVal(nameEl),
      sex: getSelectText(sexEl) || getVal(sexEl),
      age: (getVal(ageValueEl) ? `${getVal(ageValueEl)}${getSelectText(ageUnitEl) || getVal(ageUnitEl) || ''}` : ''),
      phone: phoneValue, // 直接从 data-* 属性提取电话号
      id_card: idCardValue, // 直接从 data-* 属性提取身份证号
    };

    // 主诉 / 现病史 / 体格检查 / 处理意见（按顺序）
    const emrBlocks = $all(SEL.emrBlocks);  // 更新为选取多个元素
    const emr = {};
    EMR_ORDER.forEach((key, i) => {
      if (key === 'physical_exam') {  // 体格检查（查体）
        const physicalExamElement = document.querySelector('div[section-title="体格检查"] span.content.input_emr');
        emr[key] = safeText(getVal(physicalExamElement));
      } else if (key === 'treatment_plan') {  // 处理意见
        const treatmentPlanElement = document.querySelector('div[section-title="处理意见"] span.content.input_emr');
        emr[key] = safeText(getVal(treatmentPlanElement));
      } else {
        const el = emrBlocks[i];
        emr[key] = safeText(getVal(el));
      }
    });

    // 体征
    const tzRoot = $one(SEL.tzBlock) || document;
    const v = SEL.vsign;

    const tw = getVal($one(v.tw, tzRoot));
    const hx = getVal($one(v.hx, tzRoot));
    const mb = getVal($one(v.mb, tzRoot));
    const xl = getVal($one(v.xl, tzRoot));
    const sys = getVal($one(v.gxy, tzRoot));
    const dia = getVal($one(v.dxy, tzRoot));
    const xt = getVal($one(v.xt, tzRoot));
    const sg = getVal($one(v.sg, tzRoot));
    const tz = getVal($one(v.tz, tzRoot));
    const bmiRaw = getVal($one(v.bmi, tzRoot));
    const bloodType = getVal($one(v.bloodType, tzRoot));
    const xybhd = getVal($one(v.xybhd, tzRoot));
    const yw = getVal($one(v.yw, tzRoot));

    const bmi = bmiRaw || computeBMI(sg, tz);

    const vitals = {
      temperature_c: tw || '',
      respiration_bpm: hx || '',
      pulse_bpm: mb || '',
      heart_rate_bpm: xl || '',
      blood_pressure: (sys || dia) ? `${sys || ''}/${dia || ''} mmHg` : '',
      glucose_mmol_L: xt || '',
      height_cm: sg || '',
      weight_kg: tz || '',
      bmi: bmi || '',
      blood_type: bloodType || '',
      spo2_percent: xybhd || '',
      waist_cm: yw || '',
    };

    const result = {
      meta: {
        extracted_at: nowISO(),
        page_title: document.title,
        url: location.href
      },
      base,
      emr,
      vitals
    };

    return result;
  }

  /** ============ UI：浮窗 + 操作按钮 ============ */
  function createPanel() {
    GM_addStyle(`
      .emr-extractor-panel {
        position: fixed; right: 16px; bottom: 16px; z-index: 2147483647;
        width: 360px; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 14px;
        box-shadow: 0 6px 30px rgba(0,0,0,.08); font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,ui-sans-serif;
      }
      .emr-extractor-header {
        display:flex; align-items:center; justify-content:space-between;
        padding: 10px 12px; border-bottom: 1px solid #f1f5f9; cursor: move;
      }
      .emr-extractor-title { font-size: 14px; font-weight: 600; }
      .emr-extractor-body { padding: 12px; }
      .emr-extractor-textarea {
        width:100%; height:160px; font-size:12px; line-height:1.45; padding:8px;
        border:1px solid #e5e7eb; border-radius:10px; resize: vertical; box-sizing: border-box;
        background:#fafafa;
      }
      .emr-extractor-actions { display:flex; gap:8px; margin-top:10px; }
      .emr-btn {
        flex:1; border:1px solid #e5e7eb; background:#0ea5e9; color:#fff; padding:8px 10px;
        border-radius:10px; font-size:12px; cursor:pointer; transition: all .15s ease;
      }
      .emr-btn.secondary { background:#fff; color:#111827; }
      .emr-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(0,0,0,.08); }
      .emr-extractor-footer {
        display:flex; justify-content:space-between; align-items:center;
        padding: 8px 12px; border-top:1px solid #f1f5f9; font-size:11px; color:#6b7280;
      }
      .emr-extractor-close { cursor:pointer; padding:2px 6px; border-radius:6px; }
      .emr-extractor-close:hover { background:#f3f4f6; }
    `);

    const panel = document.createElement('div');
    panel.className = 'emr-extractor-panel';
    panel.innerHTML = `
      <div class="emr-extractor-header" id="emrExtractorHeader">
        <div class="emr-extractor-title">病历提取</div>
        <div class="emr-extractor-close" id="emrExtractorClose">✕</div>
      </div>
      <div class="emr-extractor-body">
        <textarea class="emr-extractor-textarea" id="emrExtractorOutput" placeholder="点击“提取数据”后显示 JSON 结果"></textarea>
        <div class="emr-extractor-actions">
          <button class="emr-btn secondary" id="emrExtractorExtract">提取数据</button>
          <button class="emr-btn" id="emrExtractorCopy">复制文本</button>
          <button class="emr-btn secondary" id="emrExtractorDownload">下载JSON</button>
        </div>
      </div>
      <div class="emr-extractor-footer">
        <span>映射顺序：主诉 → 现病史 → 体格检查 → 处理意见</span>
        <span id="emrExtractorStatus"></span>
      </div>
    `;
    document.body.appendChild(panel);

    // 拖动
    (function makeDraggable() {
      const header = panel.querySelector('#emrExtractorHeader');
      let isDown = false, startX=0, startY=0, startLeft=0, startTop=0;
      header.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.clientX; startY = e.clientY;
        const rect = panel.getBoundingClientRect();
        startLeft = rect.left; startTop = rect.top;
        e.preventDefault();
      });
      document.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        panel.style.left = `${startLeft + dx}px`;
        panel.style.top = `${startTop + dy}px`;
        panel.style.right = 'auto';
        panel.style.bottom = 'auto';
      });
      document.addEventListener('mouseup', () => { isDown = false; });
    })();

    // 事件
    const closeBtn = panel.querySelector('#emrExtractorClose');
    const extractBtn = panel.querySelector('#emrExtractorExtract');
    const copyBtn = panel.querySelector('#emrExtractorCopy');
    const downloadBtn = panel.querySelector('#emrExtractorDownload');
    const output = panel.querySelector('#emrExtractorOutput');
    const status = panel.querySelector('#emrExtractorStatus');

    closeBtn.addEventListener('click', () => panel.remove());

    extractBtn.addEventListener('click', () => {
      try {
        const data = extractEMR();
        output.value = JSON.stringify(data, null, 2);
        status.textContent = '✓ 已提取';
        console.info('[EMR Extractor] Extracted:', data);
      } catch (err) {
        console.error('[EMR Extractor] 提取失败：', err);
        status.textContent = '✗ 提取失败';
        alert('提取失败：' + (err && err.message ? err.message : String(err)));
      }
    });

    copyBtn.addEventListener('click', async () => {
      try {
        const data = extractEMR();
        const textToCopy = `
"门诊号": "${data.base.outp_no}",
"姓名": "${data.base.name}",
"性别": "${data.base.sex}",
"年龄": ${data.base.age},
"联系电话": "${data.base.phone}",
"身份证": "${data.base.id_card}",
"现病史": "${data.emr.present_illness}",
"意识": "清醒",
"呼吸": ${data.vitals.respiration_bpm},
"脉搏": ${data.vitals.pulse_bpm},
"心率": ${data.vitals.heart_rate_bpm},
"血压": "${data.vitals.blood_pressure}",
"处理意见": "${data.emr.treatment_plan}"
`;
        // 使用 Clipboard API 复制文本
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(textToCopy);
          status.textContent = '✓ 已复制';
        } else {
          // 使用 document.execCommand 作为回退方案
          const textarea = document.createElement('textarea');
          textarea.value = textToCopy;
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
          status.textContent = '✓ 已复制';
        }
      } catch (err) {
        console.error('[EMR Extractor] 复制失败：', err);
        status.textContent = '✗ 复制失败';
        alert('复制失败：' + (err && err.message ? err.message : String(err)));
      }
    });

    downloadBtn.addEventListener('click', () => {
      try {
        const val = output.value.trim() || JSON.stringify(extractEMR(), null, 2);
        const blob = new Blob([val], { type: 'application/json;charset=utf-8' });
        const a = document.createElement('a');
        const ts = new Date().toISOString().replace(/[:.]/g, '-');
        a.download = `emr_extract_${ts}.json`;
        a.href = URL.createObjectURL(blob);
        a.click();
        URL.revokeObjectURL(a.href);
        status.textContent = '✓ 已下载';
      } catch (err) {
        console.error('[EMR Extractor] 下载失败：', err);
        status.textContent = '✗ 下载失败';
        alert('下载失败：' + (err && err.message ? err.message : String(err)));
      }
    });
  }

  /** 初始化：避免重复注入 */
  if (!document.querySelector('.emr-extractor-panel')) {
    createPanel();
  }
})();