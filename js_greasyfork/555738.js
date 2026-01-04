// ==UserScript==
// @name         Google Search Language Filter
// @name:zh-CN   Google 搜索语言过滤器
// @name:zh-TW   Google 搜尋語言過濾器
// @name:ja      Google 検索言語フィルター
// @name:es      Filtro de idioma de búsqueda de Google
// @name:fa      فیلتر زبان جستجوی گوگل
// @name:ru      Фильтр языка поиска Google
// @namespace    google-search-lang-script
// @version      0.1.1
// @description  Automatically apply lr=lang_* language filters to Google search results based on configurable languages.
// @description:zh-CN 根据可配置语言，自动为 Google 搜索结果应用 lr=lang_* 语言过滤。
// @description:zh-TW 根據可配置語言，自動為 Google 搜尋結果套用 lr=lang_* 語言過濾。
// @description:ja    設定した言語に基づき、Google 検索結果に lr=lang_* の言語フィルターを自動適用します。
// @description:es    Aplica automáticamente filtros de idioma lr=lang_* a los resultados de búsqueda de Google según los idiomas configurados。
// @description:fa    بر اساس زبان‌های تنظیم‌شده، فیلترهای زبانی lr=lang_* را به‌طور خودکار روی نتایج جستجوی گوگل اعمال می‌کند.
// @description:ru    Автоматически применяет языковые фильтры lr=lang_* к результатам поиска Google на основе выбранных языков.
// @homepageURL  https://github.com/tiaot33/google-search-lang-script
// @supportURL   https://github.com/tiaot33/google-search-lang-script/issues
// @run-at       document-start
// @noframes
// @author       tiaot33
// @match              *://*.google.com/search*
// @match              *://*.google.ad/search*
// @match              *://*.google.ae/search*
// @match              *://*.google.com.af/search*
// @match              *://*.google.com.ag/search*
// @match              *://*.google.com.ai/search*
// @match              *://*.google.al/search*
// @match              *://*.google.am/search*
// @match              *://*.google.co.ao/search*
// @match              *://*.google.com.ar/search*
// @match              *://*.google.as/search*
// @match              *://*.google.at/search*
// @match              *://*.google.com.au/search*
// @match              *://*.google.az/search*
// @match              *://*.google.ba/search*
// @match              *://*.google.com.bd/search*
// @match              *://*.google.be/search*
// @match              *://*.google.bf/search*
// @match              *://*.google.bg/search*
// @match              *://*.google.com.bh/search*
// @match              *://*.google.bi/search*
// @match              *://*.google.bj/search*
// @match              *://*.google.com.bn/search*
// @match              *://*.google.com.bo/search*
// @match              *://*.google.com.br/search*
// @match              *://*.google.bs/search*
// @match              *://*.google.bt/search*
// @match              *://*.google.co.bw/search*
// @match              *://*.google.by/search*
// @match              *://*.google.com.bz/search*
// @match              *://*.google.ca/search*
// @match              *://*.google.cd/search*
// @match              *://*.google.cf/search*
// @match              *://*.google.cg/search*
// @match              *://*.google.ch/search*
// @match              *://*.google.ci/search*
// @match              *://*.google.co.ck/search*
// @match              *://*.google.cl/search*
// @match              *://*.google.cm/search*
// @match              *://*.google.cn/search*
// @match              *://*.google.com.co/search*
// @match              *://*.google.co.cr/search*
// @match              *://*.google.com.cu/search*
// @match              *://*.google.cv/search*
// @match              *://*.google.com.cy/search*
// @match              *://*.google.cz/search*
// @match              *://*.google.de/search*
// @match              *://*.google.dj/search*
// @match              *://*.google.dk/search*
// @match              *://*.google.dm/search*
// @match              *://*.google.com.do/search*
// @match              *://*.google.dz/search*
// @match              *://*.google.com.ec/search*
// @match              *://*.google.ee/search*
// @match              *://*.google.com.eg/search*
// @match              *://*.google.es/search*
// @match              *://*.google.com.et/search*
// @match              *://*.google.fi/search*
// @match              *://*.google.com.fj/search*
// @match              *://*.google.fm/search*
// @match              *://*.google.fr/search*
// @match              *://*.google.ga/search*
// @match              *://*.google.ge/search*
// @match              *://*.google.gg/search*
// @match              *://*.google.com.gh/search*
// @match              *://*.google.com.gi/search*
// @match              *://*.google.gl/search*
// @match              *://*.google.gm/search*
// @match              *://*.google.gr/search*
// @match              *://*.google.com.gt/search*
// @match              *://*.google.gy/search*
// @match              *://*.google.hk/search*
// @match              *://*.google.com.hk/search*
// @match              *://*.google.hn/search*
// @match              *://*.google.hr/search*
// @match              *://*.google.ht/search*
// @match              *://*.google.hu/search*
// @match              *://*.google.co.id/search*
// @match              *://*.google.ie/search*
// @match              *://*.google.co.il/search*
// @match              *://*.google.im/search*
// @match              *://*.google.co.in/search*
// @match              *://*.google.iq/search*
// @match              *://*.google.is/search*
// @match              *://*.google.it/search*
// @match              *://*.google.je/search*
// @match              *://*.google.com.jm/search*
// @match              *://*.google.jo/search*
// @match              *://*.google.jp/search*
// @match              *://*.google.co.jp/search*
// @match              *://*.google.co.ke/search*
// @match              *://*.google.com.kh/search*
// @match              *://*.google.ki/search*
// @match              *://*.google.kg/search*
// @match              *://*.google.co.kr/search*
// @match              *://*.google.com.kw/search*
// @match              *://*.google.kz/search*
// @match              *://*.google.la/search*
// @match              *://*.google.com.lb/search*
// @match              *://*.google.li/search*
// @match              *://*.google.lk/search*
// @match              *://*.google.co.ls/search*
// @match              *://*.google.lt/search*
// @match              *://*.google.lu/search*
// @match              *://*.google.lv/search*
// @match              *://*.google.com.ly/search*
// @match              *://*.google.co.ma/search*
// @match              *://*.google.md/search*
// @match              *://*.google.me/search*
// @match              *://*.google.mg/search*
// @match              *://*.google.mk/search*
// @match              *://*.google.ml/search*
// @match              *://*.google.com.mm/search*
// @match              *://*.google.mn/search*
// @match              *://*.google.ms/search*
// @match              *://*.google.com.mt/search*
// @match              *://*.google.mu/search*
// @match              *://*.google.mv/search*
// @match              *://*.google.mw/search*
// @match              *://*.google.com.mx/search*
// @match              *://*.google.com.my/search*
// @match              *://*.google.co.mz/search*
// @match              *://*.google.com.na/search*
// @match              *://*.google.com.ng/search*
// @match              *://*.google.com.ni/search*
// @match              *://*.google.ne/search*
// @match              *://*.google.nl/search*
// @match              *://*.google.no/search*
// @match              *://*.google.com.np/search*
// @match              *://*.google.nr/search*
// @match              *://*.google.nu/search*
// @match              *://*.google.co.nz/search*
// @match              *://*.google.com.om/search*
// @match              *://*.google.com.pa/search*
// @match              *://*.google.com.pe/search*
// @match              *://*.google.com.pg/search*
// @match              *://*.google.com.ph/search*
// @match              *://*.google.com.pk/search*
// @match              *://*.google.pl/search*
// @match              *://*.google.pn/search*
// @match              *://*.google.com.pr/search*
// @match              *://*.google.ps/search*
// @match              *://*.google.pt/search*
// @match              *://*.google.com.py/search*
// @match              *://*.google.com.qa/search*
// @match              *://*.google.ro/search*
// @match              *://*.google.ru/search*
// @match              *://*.google.rw/search*
// @match              *://*.google.com.sa/search*
// @match              *://*.google.com.sb/search*
// @match              *://*.google.sc/search*
// @match              *://*.google.se/search*
// @match              *://*.google.com.sg/search*
// @match              *://*.google.sh/search*
// @match              *://*.google.si/search*
// @match              *://*.google.sk/search*
// @match              *://*.google.com.sl/search*
// @match              *://*.google.sn/search*
// @match              *://*.google.so/search*
// @match              *://*.google.sm/search*
// @match              *://*.google.sr/search*
// @match              *://*.google.st/search*
// @match              *://*.google.com.sv/search*
// @match              *://*.google.td/search*
// @match              *://*.google.tg/search*
// @match              *://*.google.co.th/search*
// @match              *://*.google.com.tj/search*
// @match              *://*.google.tl/search*
// @match              *://*.google.tm/search*
// @match              *://*.google.tn/search*
// @match              *://*.google.to/search*
// @match              *://*.google.com.tr/search*
// @match              *://*.google.tt/search*
// @match              *://*.google.com.tw/search*
// @match              *://*.google.co.tz/search*
// @match              *://*.google.com.ua/search*
// @match              *://*.google.co.ug/search*
// @match              *://*.google.co.uk/search*
// @match              *://*.google.com.uy/search*
// @match              *://*.google.co.uz/search*
// @match              *://*.google.com.vc/search*
// @match              *://*.google.co.ve/search*
// @match              *://*.google.vg/search*
// @match              *://*.google.co.vi/search*
// @match              *://*.google.com.vn/search*
// @match              *://*.google.vu/search*
// @match              *://*.google.ws/search*
// @match              *://*.google.rs/search*
// @match              *://*.google.co.za/search*
// @match              *://*.google.co.zm/search*
// @match              *://*.google.co.zw/search*
// @match              *://*.google.cat/search*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/555738/Google%20Search%20Language%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/555738/Google%20Search%20Language%20Filter.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const STORAGE_KEY = 'googleSearchLangConfig';
  const CONFIG_VERSION = 1;
  const DEFAULT_LANGUAGES = Object.freeze(['lang_en']);

  const AVAILABLE_LANGUAGES = [
    { code: 'lang_ar', label: 'Arabic' },
    { code: 'lang_bn', label: 'Bengali' },
    { code: 'lang_bg', label: 'Bulgarian' },
    { code: 'lang_ca', label: 'Catalan' },
    { code: 'lang_zh-CN', label: 'Chinese (simplified)' },
    { code: 'lang_zh-TW', label: 'Chinese (traditional)' },
    { code: 'lang_hr', label: 'Croatian' },
    { code: 'lang_cs', label: 'Czech' },
    { code: 'lang_da', label: 'Danish' },
    { code: 'lang_nl', label: 'Dutch' },
    { code: 'lang_en', label: 'English' },
    { code: 'lang_et', label: 'Estonian' },
    { code: 'lang_tl', label: 'Filipino' },
    { code: 'lang_fi', label: 'Finnish' },
    { code: 'lang_fr', label: 'French' },
    { code: 'lang_de', label: 'German' },
    { code: 'lang_el', label: 'Greek' },
    { code: 'lang_gu', label: 'Gujarati' },
    { code: 'lang_iw', label: 'Hebrew' },
    { code: 'lang_hi', label: 'Hindi' },
    { code: 'lang_hu', label: 'Hungarian' },
    { code: 'lang_is', label: 'Icelandic' },
    { code: 'lang_id', label: 'Indonesian' },
    { code: 'lang_it', label: 'Italian' },
    { code: 'lang_ja', label: 'Japanese' },
    { code: 'lang_kn', label: 'Kannada' },
    { code: 'lang_ko', label: 'Korean' },
    { code: 'lang_lv', label: 'Latvian' },
    { code: 'lang_lt', label: 'Lithuanian' },
    { code: 'lang_ms', label: 'Malay' },
    { code: 'lang_ml', label: 'Malayalam' },
    { code: 'lang_mr', label: 'Marathi' },
    { code: 'lang_no', label: 'Norwegian' },
    { code: 'lang_fa', label: 'Persian' },
    { code: 'lang_pl', label: 'Polish' },
    { code: 'lang_pt', label: 'Portuguese' },
    { code: 'lang_pa', label: 'Punjabi' },
    { code: 'lang_ro', label: 'Romanian' },
    { code: 'lang_ru', label: 'Russian' },
    { code: 'lang_sr', label: 'Serbian' },
    { code: 'lang_sk', label: 'Slovak' },
    { code: 'lang_sl', label: 'Slovenian' },
    { code: 'lang_es', label: 'Spanish' },
    { code: 'lang_sv', label: 'Swedish' },
    { code: 'lang_ta', label: 'Tamil' },
    { code: 'lang_te', label: 'Telugu' },
    { code: 'lang_th', label: 'Thai' },
    { code: 'lang_tr', label: 'Turkish' },
    { code: 'lang_uk', label: 'Ukrainian' },
    { code: 'lang_ur', label: 'Urdu' },
    { code: 'lang_vi', label: 'Vietnamese' }
  ];

  const AVAILABLE_LANGUAGE_CODES = new Set(
    AVAILABLE_LANGUAGES.map((lang) => lang.code)
  );

  let cachedConfig = null;
  let hasCachedConfig = false;

  const gmApi = typeof GM === 'object' && GM !== null ? GM : null;
  const gmAsyncGet = gmApi && typeof gmApi.getValue === 'function'
    ? gmApi.getValue.bind(gmApi)
    : null;
  const gmAsyncSet = gmApi && typeof gmApi.setValue === 'function'
    ? gmApi.setValue.bind(gmApi)
    : null;

  function sanitizeLanguages(languages) {
    if (!Array.isArray(languages)) {
      return [];
    }

    const seen = new Set();
    const result = [];

    languages.forEach((code) => {
      if (typeof code !== 'string') {
        return;
      }
      const trimmed = code.trim();
      if (!trimmed || !AVAILABLE_LANGUAGE_CODES.has(trimmed)) {
        return;
      }
      if (seen.has(trimmed)) {
        return;
      }
      seen.add(trimmed);
      result.push(trimmed);
    });

    return result;
  }

  function normalizeConfig(rawConfig) {
    const hasLanguages =
      rawConfig && Object.prototype.hasOwnProperty.call(rawConfig, 'languages');
    const rawLanguages = hasLanguages ? rawConfig.languages : undefined;
    const sanitizedLanguages = sanitizeLanguages(rawLanguages);

    const shouldKeepEmptySelection =
      Array.isArray(rawLanguages) && rawLanguages.length === 0;

    const languages =
      sanitizedLanguages.length || shouldKeepEmptySelection
        ? sanitizedLanguages
        : Array.from(DEFAULT_LANGUAGES);

    return {
      version: CONFIG_VERSION,
      languages
    };
  }

  function parseStoredValue(value) {
    if (value == null) {
      return null;
    }
    if (typeof value === 'string') {
      if (!value) {
        return null;
      }
      try {
        return JSON.parse(value);
      } catch (err) {
        return null;
      }
    }
    if (typeof value === 'object') {
      return value;
    }
    return null;
  }

  async function readStoredConfig() {
    if (gmAsyncGet) {
      try {
        const value = await gmAsyncGet(STORAGE_KEY, null);
        return parseStoredValue(value);
      } catch (err) {
        return null;
      }
    }

    if (typeof GM_getValue === 'function') {
      try {
        const value = GM_getValue(STORAGE_KEY, null);
        return parseStoredValue(value);
      } catch (err) {
        return null;
      }
    }

    return null;
  }

  async function writeStoredConfig(config) {
    const serialized = JSON.stringify(config);

    if (gmAsyncSet) {
      try {
        await gmAsyncSet(STORAGE_KEY, serialized);
        return { success: true };
      } catch (err) {
        return {
          success: false,
          error: err && err.message ? err.message : 'Unknown error'
        };
      }
    }

    if (typeof GM_setValue === 'function') {
      try {
        GM_setValue(STORAGE_KEY, serialized);
        return { success: true };
      } catch (err) {
        return {
          success: false,
          error: err && err.message ? err.message : 'Unknown error'
        };
      }
    }

    return { success: false, error: 'GM_setValue unavailable' };
  }

  async function loadConfig() {
    if (hasCachedConfig) {
      return cachedConfig;
    }

    const stored = await readStoredConfig();
    cachedConfig = normalizeConfig(stored);
    hasCachedConfig = true;
    return cachedConfig;
  }

  async function saveConfig(config) {
    const normalized = normalizeConfig({
      ...config,
      version: CONFIG_VERSION
    });

    const writeResult = await writeStoredConfig(normalized);
    cachedConfig = normalized;
    hasCachedConfig = true;

    if (!writeResult.success) {
      return writeResult;
    }

    return { success: true, config: normalized };
  }

  function buildLrValue(languages) {
    return (languages || []).filter(Boolean).join('|');
  }

  function isGoogleSearchPage() {
    if (!/^www\.google\./.test(window.location.hostname)) {
      return false;
    }
    return window.location.pathname === '/search';
  }

  async function applyLanguageFilterIfNeeded(config) {
    if (!isGoogleSearchPage()) {
      return;
    }

    const activeConfig = config || (await loadConfig());

    const params = new URLSearchParams(window.location.search);
    const query = (params.get('q') || '').trim();
    if (!query) {
      return;
    }

    const lr = buildLrValue(activeConfig.languages);
    if (!lr) {
      return;
    }

    const currentUrl = window.location.href;

    if (params.get('lr') === lr) {
      return;
    }

    params.set('lr', lr);

    const newSearch = params.toString();
    const newUrl =
      window.location.origin +
      window.location.pathname +
      (newSearch ? `?${newSearch}` : '');

    if (newUrl === currentUrl) {
      return;
    }

    window.location.replace(newUrl);
  }

  function openConfigDialog(initialConfig) {
    if (!document.body) {
      window.addEventListener(
        'DOMContentLoaded',
        () => {
          openConfigDialog(initialConfig);
        },
        { once: true }
      );
      return;
    }

    const existing = document.getElementById('gs-lang-config-overlay');
    if (existing) {
      existing.remove();
    }

    const overlay = document.createElement('div');
    overlay.id = 'gs-lang-config-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.background = 'rgba(0, 0, 0, 0.4)';
    overlay.style.zIndex = '2147483647';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'gs-lang-config-title');

    const panel = document.createElement('div');
    panel.style.background = '#fff';
    panel.style.color = '#000';
    panel.style.padding = '16px 20px';
    panel.style.minWidth = '320px';
    panel.style.maxWidth = '420px';
    panel.style.borderRadius = '8px';
    panel.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
    panel.style.fontFamily = 'Arial, sans-serif';
    panel.style.fontSize = '13px';

    const title = document.createElement('div');
    title.id = 'gs-lang-config-title';
    title.setAttribute('role', 'heading');
    title.setAttribute('aria-level', '1');
    title.textContent = 'Google 搜索语言过滤配置';
    title.style.fontSize = '15px';
    title.style.fontWeight = 'bold';
    title.style.marginBottom = '8px';

    const hint = document.createElement('div');
    hint.textContent = '请选择要应用到搜索结果的语言（勾选一项或多项，可按名称搜索）。';
    hint.style.marginBottom = '6px';

    const searchWrapper = document.createElement('div');
    searchWrapper.style.marginBottom = '6px';

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = '按语言名称或代码过滤，例如 "english" 或 "en"';
    searchInput.style.width = '100%';
    searchInput.style.boxSizing = 'border-box';
    searchInput.style.padding = '4px 6px';
    searchInput.style.border = '1px solid #ddd';
    searchInput.style.borderRadius = '4px';
    searchInput.style.fontSize = '12px';

    searchWrapper.appendChild(searchInput);

    const list = document.createElement('div');
    list.style.maxHeight = '260px';
    list.style.overflowY = 'auto';
    list.style.border = '1px solid #ddd';
    list.style.padding = '8px 10px';
    list.style.marginTop = '4px';

    const initialLanguages =
      initialConfig && Array.isArray(initialConfig.languages)
        ? initialConfig.languages
        : Array.from(DEFAULT_LANGUAGES);
    const selectedSet = new Set(initialLanguages);

    function renderList(filterText) {
      const normalized = (filterText || '').trim().toLowerCase();
      list.innerHTML = '';

      AVAILABLE_LANGUAGES.forEach((lang) => {
        const labelText = `${lang.label} (${lang.code})`;
        if (
          normalized &&
          !labelText.toLowerCase().includes(normalized)
        ) {
          return;
        }

        const item = document.createElement('label');
        item.style.display = 'flex';
        item.style.alignItems = 'center';
        item.style.marginBottom = '4px';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = lang.code;
        checkbox.checked = selectedSet.has(lang.code);
        checkbox.style.marginRight = '6px';

        checkbox.addEventListener('change', () => {
          if (checkbox.checked) {
            selectedSet.add(lang.code);
          } else {
            selectedSet.delete(lang.code);
          }
        });

        const text = document.createElement('span');
        text.textContent = labelText;

        item.appendChild(checkbox);
        item.appendChild(text);
        list.appendChild(item);
      });
    }

    renderList('');

    searchInput.addEventListener('input', () => {
      renderList(searchInput.value);
    });

    const buttons = document.createElement('div');
    buttons.style.marginTop = '12px';
    buttons.style.textAlign = 'right';

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = '取消';
    cancelBtn.style.marginRight = '8px';

    const saveBtn = document.createElement('button');
    const saveDefaultLabel = '保存';
    saveBtn.textContent = saveDefaultLabel;
    saveBtn.style.background = '#1a73e8';
    saveBtn.style.color = '#fff';
    saveBtn.style.border = 'none';
    saveBtn.style.padding = '4px 10px';
    saveBtn.style.borderRadius = '4px';
    saveBtn.style.cursor = 'pointer';

    const statusText = document.createElement('div');
    statusText.style.marginTop = '6px';
    statusText.style.minHeight = '1em';
    statusText.style.fontSize = '12px';
    statusText.style.textAlign = 'right';
    statusText.setAttribute('role', 'status');
    statusText.setAttribute('aria-live', 'polite');

    const handleKeydown = (event) => {
      if (event.key === 'Escape') {
        closeOverlay();
      }
    };

    function closeOverlay() {
      document.removeEventListener('keydown', handleKeydown);
      if (overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
    }

    document.addEventListener('keydown', handleKeydown);

    cancelBtn.addEventListener('click', () => {
      closeOverlay();
    });

    saveBtn.addEventListener('click', async () => {
      saveBtn.disabled = true;
      saveBtn.textContent = '保存中...';
      statusText.textContent = '';
      const config = { languages: Array.from(selectedSet) };
      try {
        const result = await saveConfig(config);

        if (result.success) {
          statusText.textContent = '配置已保存';
          setTimeout(() => {
            closeOverlay();
          }, 400);
          return;
        }

        statusText.textContent = result.error
          ? `保存失败: ${result.error}`
          : '保存失败';
      } catch (err) {
        statusText.textContent = '保存失败: 未知错误';
      }

      saveBtn.disabled = false;
      saveBtn.textContent = saveDefaultLabel;
    });

    buttons.appendChild(cancelBtn);
    buttons.appendChild(saveBtn);

    panel.appendChild(title);
    panel.appendChild(hint);
    panel.appendChild(searchWrapper);
    panel.appendChild(list);
    panel.appendChild(buttons);
    panel.appendChild(statusText);

    overlay.appendChild(panel);

    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) {
        closeOverlay();
      }
    });

    document.body.appendChild(overlay);
  }

  loadConfig()
    .then((config) => {
      return applyLanguageFilterIfNeeded(config);
    })
    .catch(() => {
      // Ignore storage errors during initial load; defaults will be used on next invocation.
    });

  if (typeof GM_registerMenuCommand === 'function') {
    GM_registerMenuCommand('配置 Google 搜索语言过滤', async () => {
      try {
        const config = await loadConfig();
        openConfigDialog(config);
      } catch (err) {
        openConfigDialog(normalizeConfig(null));
      }
    });
  }
})();
