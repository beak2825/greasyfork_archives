// ==UserScript==
// @name        快樂工具人：AI 對話匯出與快速範本 (GPT/Gemini/Grok/Claude)
// @name:en     AI Chat Exporter & Quick Templates (by Haoming)
// @description 支援將 ChatGPT/Gemini/Grok/Claude 對話匯出至 MD/JSON/HTML，並內建快捷指令工具箱。
// @description:en Export ChatGPT/Gemini/Grok/Claude chats to MD/JSON/HTML and use quick prompt templates.
// @namespace   happy-toolman
// @version     2026-01-07.002
// @author      快樂工具人 (Haoming Lu)
// @icon        https://raw.githubusercontent.com/luhaoming/userscripts/main/assets/logo.png
// @match       *://chatgpt.com/*
// @match       *://chat.openai.com/*
// @match       *://grok.com/*
// @match       *://gemini.google.com/*
// @match       *://claude.ai/*
// @noframes
// @sandbox     raw
// @license     MIT
// @homepage    https://greasyfork.org/zh-TW/scripts/561579
// @supportURL  https://greasyfork.org/zh-TW/scripts/561579/feedback
// @run-at      document-idle
// @grant       GM_addStyle
// @grant       GM_registerMenuCommand
// @grant       GM_setValue
// @grant       GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/561579/AI%20Chat%20Exporter%20%20Quick%20Templates%20%28by%20Haoming%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561579/AI%20Chat%20Exporter%20%20Quick%20Templates%20%28by%20Haoming%29.meta.js
// ==/UserScript==

(function() {
'use strict';

const VERSION = '2026-01-07.002';

// Trusted Types Policy
let trustedPolicy = null;
if (typeof trustedTypes !== 'undefined' && trustedTypes.createPolicy) {
  try {
    trustedPolicy = trustedTypes.createPolicy('aitk', {
      createHTML: s => s,
      createScriptURL: s => s,
      createScript: s => s
    });
  } catch (e) {
    // Policy already exists or not supported
  }
}

const safeParseHTML = (html) => {
  const parser = new DOMParser();
  if (trustedPolicy) {
    return parser.parseFromString(trustedPolicy.createHTML(html), 'text/html');
  }
  return parser.parseFromString(html, 'text/html');
};

// i18n
const i18n = {
  lang: null,
  detect() {
    if (this.lang) return this.lang;
    
    // 1. 優先使用手動設定
    const manualLang = GM_getValue('manualLang', null);
    if (manualLang) {
      this.lang = manualLang;
      return this.lang;
    }
    
    // 2. 自動偵測
    const browserLang = navigator.language || navigator.userLanguage || '';
    console.log('[AI Chat Toolkit] Browser language:', browserLang);
    
    // 偵測所有中文變體
    if (browserLang.match(/^zh/i) || browserLang.match(/chinese/i)) {
      this.lang = 'zh';
    } else {
      this.lang = 'en';
    }
    
    console.log('[AI Chat Toolkit] Detected language:', this.lang);
    return this.lang;
  },
  setLang(lang) {
    GM_setValue('manualLang', lang);
    this.lang = lang;
    location.reload();
  },
  t(key) {
    const lang = this.detect(); // 確保語言已偵測
    const texts = {
      'menu.title': { zh: '快樂工具人聊天小幫手', en: 'AI Chat Toolkit' },
      'menu.export': { zh: '匯出對話', en: 'Export Chat' },
      'menu.actions': { zh: '快捷指令', en: 'Quick Actions' },
      'menu.edit': { zh: '⚙️ 編輯指令', en: '⚙️ Edit Actions' },
      'menu.lang': { zh: '🌐 語言', en: '🌐 Language' },
      'editor.title': { zh: '編輯快捷指令', en: 'Edit Quick Actions' },
      'editor.hint': { zh: '格式：icon | 名稱 | 指令內容（每行一個）', en: 'Format: icon | name | prompt (one per line)' },
      'editor.reset': { zh: '重設預設', en: 'Reset' },
      'editor.save': { zh: '儲存', en: 'Save' },
      'action.summary': { zh: '摘要對話', en: 'Summary' },
      'action.summary.prompt': { zh: '請用一句話摘要上面的對話紀錄', en: 'Please summarize the conversation above in one sentence' },
      'action.translate': { zh: '翻譯中文', en: 'Translate' },
      'action.translate.prompt': { zh: '請將上面的回覆翻譯成繁體中文', en: 'Please translate the above response to English' },
      'action.simplify': { zh: '精簡回答', en: 'Simplify' },
      'action.simplify.prompt': { zh: '請用更簡短的方式重新回答', en: 'Please answer more concisely' },
      'action.explain': { zh: '詳細解釋', en: 'Explain' },
      'action.explain.prompt': { zh: '請更詳細地解釋上面的回答', en: 'Please explain the above answer in more detail' },
      'action.continue': { zh: '繼續', en: 'Continue' },
      'action.continue.prompt': { zh: '好，繼續', en: 'OK, continue' },
      'action.no': { zh: '不', en: 'No' },
      'action.no.prompt': { zh: '不用', en: 'No thanks' },
      'alert.unsupported': { zh: '不支援此平台', en: 'Platform not supported' },
      'alert.no_content': { zh: '找不到對話內容', en: 'No conversation found' }
    };
    return texts[key]?.[lang] || key;
  }
};

// Platform
const Platform = {
  detect() {
    const host = location.hostname;
    if (host.includes('chatgpt.com') || host.includes('openai.com')) return 'chatgpt';
    if (host.includes('grok.com')) return 'grok';
    if (host.includes('gemini.google.com')) return 'gemini';
    if (host.includes('claude.ai')) return 'claude';
    return null;
  },

  getSelectors(platform) {
    const s = {
      chatgpt: { messages: 'div[data-message-id]', user: '[data-message-author-role="user"]', assistant: '[data-message-author-role="assistant"]', title: '#history a[data-active]', codeBlock: 'pre', codeLang: 'div > div:first-child', codeContent: 'div > div:nth-child(3) > code, code', inputBox: 'div[contenteditable="true"], textarea#prompt-textarea' },
      grok: { messages: 'div.message-bubble', user: null, assistant: null, title: null, codeBlock: 'div.not-prose', codeLang: 'div > div > span', codeContent: 'div > div:nth-child(3) > code, code', inputBox: 'textarea' },
      gemini: { messages: 'user-query-content, model-response', user: 'user-query-content', assistant: 'model-response', title: 'conversations-list div.selected', codeBlock: 'code-block', codeLang: 'div > div > span', codeContent: 'div > div:nth-child(2) > div > pre, pre', inputBox: 'rich-textarea div[contenteditable="true"], textarea' },
      claude: { messages: '[data-testid="user-human-turn"], [data-testid="assistant-turn"], div.font-user-message, div.font-claude-message', user: '[data-testid="user-human-turn"], div.font-user-message', assistant: '[data-testid="assistant-turn"], div.font-claude-message', title: null, codeBlock: 'pre', codeLang: '.text-text-300, [class*="language-"]', codeContent: 'code', inputBox: 'div[contenteditable="true"].ProseMirror, div[contenteditable="true"]' }
    };
    return s[platform] || null;
  },

  getModelName(platform) {
    return { chatgpt: 'ChatGPT', grok: 'Grok', gemini: 'Gemini', claude: 'Claude' }[platform] || 'Unknown';
  }
};

// Converter
const Converter = {
  toMarkdown(html, platform) {
    const doc = safeParseHTML(html);
    
    doc.querySelectorAll('span.katex-html, mrow').forEach(el => el.remove());
    doc.querySelectorAll('annotation[encoding="application/x-tex"]').forEach(el => {
      const tex = el.textContent.trim();
      const isBlock = el.closest('.katex-display');
      el.replaceWith(isBlock ? `\n$$\n${tex}\n$$\n` : `$${tex}$`);
    });

    const sel = Platform.getSelectors(platform);
    if (sel) {
      doc.querySelectorAll(sel.codeBlock).forEach(pre => {
        const lang = pre.querySelector(sel.codeLang)?.textContent?.trim().toLowerCase() || '';
        const code = pre.querySelector(sel.codeContent)?.textContent || pre.textContent;
        pre.textContent = `\n\`\`\`${lang}\n${code}\n\`\`\`\n`;
      });
    }

    const rules = [
      ['strong, b', el => `**${el.textContent}**`],
      ['em, i', el => `*${el.textContent}*`],
      ['p code, span code', el => `\`${el.textContent}\``],
      ['a', el => `[${el.textContent}](${el.href})`],
      ['img', el => `![${el.alt || ''}](${el.src})`]
    ];
    rules.forEach(([sel, fn]) => doc.querySelectorAll(sel).forEach(el => el.replaceWith(fn(el))));

    doc.querySelectorAll('ul').forEach(ul => {
      let md = '\n';
      ul.querySelectorAll(':scope > li').forEach(li => md += `- ${li.textContent.trim()}\n`);
      ul.replaceWith(md);
    });
    doc.querySelectorAll('ol').forEach(ol => {
      let md = '\n';
      ol.querySelectorAll(':scope > li').forEach((li, i) => md += `${i + 1}. ${li.textContent.trim()}\n`);
      ol.replaceWith(md);
    });

    for (let i = 1; i <= 6; i++) {
      doc.querySelectorAll(`h${i}`).forEach(h => h.replaceWith(`\n${'#'.repeat(i)} ${h.textContent}\n`));
    }

    doc.querySelectorAll('p').forEach(p => p.replaceWith(`\n${p.textContent}\n`));

    doc.querySelectorAll('table').forEach(table => {
      let md = '\n';
      const headers = table.querySelectorAll('thead th');
      if (headers.length) {
        md += '| ' + [...headers].map(th => th.textContent).join(' | ') + ' |\n';
        md += '| ' + [...headers].map(() => '---').join(' | ') + ' |\n';
      }
      table.querySelectorAll('tbody tr').forEach(tr => {
        md += '| ' + [...tr.querySelectorAll('td')].map(td => td.textContent).join(' | ') + ' |\n';
      });
      table.replaceWith(md);
    });

    let markdown = doc.body.innerHTML.replace(/<[^>]*>/g, '');
    return markdown
      .replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&')
      .replace(/≥/g, '>=').replace(/≤/g, '<=').replace(/\n{3,}/g, '\n\n').trim();
  }
};

// Extractor
const Extractor = {
  getMessages(platform) {
    const sel = Platform.getSelectors(platform);
    if (!sel) return [];

    const messages = [];

    if (platform === 'gemini') {
      const users = document.querySelectorAll('user-query-content');
      const assistants = document.querySelectorAll('model-response');
      const len = Math.max(users.length, assistants.length);
      for (let i = 0; i < len; i++) {
        if (users[i]) messages.push({ role: 'user', html: users[i].innerHTML, text: users[i].textContent });
        if (assistants[i]) messages.push({ role: 'assistant', html: assistants[i].innerHTML, text: assistants[i].textContent });
      }
      return messages;
    }

    document.querySelectorAll(sel.messages).forEach((el, idx) => {
      let role = 'unknown';
      if (platform === 'grok') {
        role = idx % 2 === 0 ? 'user' : 'assistant';
      } else if (platform === 'claude') {
        if (el.matches('[data-testid="user-human-turn"], div.font-user-message')) role = 'user';
        else if (el.matches('[data-testid="assistant-turn"], div.font-claude-message')) role = 'assistant';
      } else {
        if (el.matches(sel.user)) role = 'user';
        else if (el.matches(sel.assistant)) role = 'assistant';
      }
      messages.push({ role, html: el.innerHTML, text: el.textContent });
    });
    return messages;
  },

  getTitle(platform) {
    const sel = Platform.getSelectors(platform);
    if (!sel?.title) return null;
    return document.querySelector(sel.title)?.textContent?.trim() || null;
  },

  getMetadata(platform) {
    return {
      platform: Platform.getModelName(platform),
      url: location.href,
      exportedAt: new Date().toISOString(),
      exporterVersion: VERSION,
      title: this.getTitle(platform) || 'Untitled Chat'
    };
  }
};

// Formatters
const Formatter = {
  markdown(messages, metadata, platform) {
    let md = `---
title: "${metadata.title}"
platform: ${metadata.platform}
url: ${metadata.url}
exported_at: ${metadata.exportedAt}
exporter_version: ${metadata.exporterVersion}
---

`;
    messages.forEach(msg => {
      const label = msg.role === 'user' ? 'User' : metadata.platform;
      md += `## ${label}\n\n${Converter.toMarkdown(msg.html, platform)}\n\n---\n\n`;
    });
    return md.trim();
  },

  json(messages, metadata, platform) {
    return JSON.stringify({
      metadata,
      messages: messages.map(msg => ({
        role: msg.role,
        content: { text: msg.text.trim(), markdown: Converter.toMarkdown(msg.html, platform) }
      }))
    }, null, 2);
  },

  html(messages, metadata) {
    const esc = s => s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>${esc(metadata.title)}</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"><\/script>
  <style>
    body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:800px;margin:0 auto;padding:20px;background:#f5f5f5}
    .meta{background:#e8e8e8;padding:15px;border-radius:8px;margin-bottom:20px;font-size:.9em;color:#666}
    .msg{background:#fff;padding:20px;margin:10px 0;border-radius:12px;box-shadow:0 1px 3px rgba(0,0,0,.1)}
    .msg.user{background:#e3f2fd}.role{font-weight:700;margin-bottom:10px}
    pre{background:#f6f8fa;padding:16px;border-radius:6px;overflow-x:auto}
  </style>
</head>
<body>
  <div class="meta"><strong>${esc(metadata.title)}</strong><br>Platform: ${metadata.platform} | Exported: ${new Date(metadata.exportedAt).toLocaleString()}<br><a href="${metadata.url}">Original</a></div>
`;
    messages.forEach(msg => {
      html += `  <div class="msg ${msg.role}"><div class="role">${msg.role === 'user' ? 'User' : metadata.platform}</div><div>${msg.html}</div></div>\n`;
    });
    return html + `  <script>hljs.highlightAll()<\/script>\n</body></html>`;
  },

  text(messages, metadata) {
    let txt = `${metadata.title}\nPlatform: ${metadata.platform}\nURL: ${metadata.url}\nExported: ${metadata.exportedAt}\n${'='.repeat(50)}\n\n`;
    messages.forEach(msg => {
      txt += `[${msg.role === 'user' ? 'User' : metadata.platform}]\n${msg.text.trim()}\n\n${'-'.repeat(40)}\n\n`;
    });
    return txt.trim();
  }
};

// Downloader
const Downloader = {
  save(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement('a'), { href: url, download: filename });
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 100);
  },
  sanitize: name => (name.replace(/[\/\\?%*:|"<>]/g, '_').trim().slice(0, 100) || 'chat')
};

// Quick Actions
const defaultActions = [
  { id: 'summary', icon: '📋', label: i18n.t('action.summary'), prompt: i18n.t('action.summary.prompt') },
  { id: 'translate', icon: '🌐', label: i18n.t('action.translate'), prompt: i18n.t('action.translate.prompt') },
  { id: 'simplify', icon: '✂️', label: i18n.t('action.simplify'), prompt: i18n.t('action.simplify.prompt') },
  { id: 'explain', icon: '💡', label: i18n.t('action.explain'), prompt: i18n.t('action.explain.prompt') },
  { id: 'continue', icon: '⭕', label: i18n.t('action.continue'), prompt: i18n.t('action.continue.prompt') },
  { id: 'no', icon: '❌', label: i18n.t('action.no'), prompt: i18n.t('action.no.prompt') }
];

const QuickAction = {
  getActions() {
    const saved = GM_getValue('customActions', null);
    if (saved) {
      try { return JSON.parse(saved); } catch(e) {}
    }
    return defaultActions;
  },

  saveActions(actions) {
    GM_setValue('customActions', JSON.stringify(actions));
  },

  resetActions() {
    GM_setValue('customActions', JSON.stringify(defaultActions));
  },

  sendMessage(platform, text) {
    const sel = Platform.getSelectors(platform);
    if (!sel?.inputBox) return false;

    const box = document.querySelector(sel.inputBox);
    if (!box) return false;

    box.focus();

    if (box.tagName === 'TEXTAREA') {
      box.value = text;
      box.dispatchEvent(new Event('input', { bubbles: true }));
    } else {
      document.execCommand('insertText', false, text);
      box.dispatchEvent(new Event('input', { bubbles: true }));
    }

    setTimeout(() => {
      const sendBtn = document.querySelector(
        'button[data-testid="send-button"], ' +
        'button[aria-label*="Send"], ' +
        'button[aria-label*="送出"], ' +
        'button[aria-label*="Submit"], ' +
        'button.send-button, ' +
        'button[class*="send"], ' +
        'button[class*="submit"]'
      );
      if (sendBtn && !sendBtn.disabled) sendBtn.click();
    }, 150);

    return true;
  },

  showEditor() {
    const actions = this.getActions();
    const editorDefaultActions = [
      { icon: '📋', label: i18n.t('action.summary'), prompt: i18n.t('action.summary.prompt') },
      { icon: '🌐', label: i18n.t('action.translate'), prompt: i18n.t('action.translate.prompt') },
      { icon: '✂️', label: i18n.t('action.simplify'), prompt: i18n.t('action.simplify.prompt') },
      { icon: '💡', label: i18n.t('action.explain'), prompt: i18n.t('action.explain.prompt') },
      { icon: '⭕', label: i18n.t('action.continue'), prompt: i18n.t('action.continue.prompt') },
      { icon: '❌', label: i18n.t('action.no'), prompt: i18n.t('action.no.prompt') }
    ];

    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:999999999;display:flex;align-items:center;justify-content:center;padding:20px;';
    
    const editor = document.createElement('div');
    editor.style.cssText = 'background:#fff;border-radius:12px;width:100%;max-width:600px;max-height:80vh;overflow:auto;box-shadow:0 8px 32px rgba(0,0,0,0.3);';

    const header = document.createElement('div');
    header.style.cssText = 'display:flex;justify-content:space-between;align-items:center;padding:20px;border-bottom:1px solid #eee;font-weight:600;font-size:16px;color:#333;';
    
    const headerTitle = document.createElement('span');
    headerTitle.textContent = i18n.t('editor.title');
    
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕';
    closeBtn.style.cssText = 'background:none;border:none;font-size:24px;cursor:pointer;color:#999;padding:0;width:30px;height:30px;';
    
    header.appendChild(headerTitle);
    header.appendChild(closeBtn);
    editor.appendChild(header);

    const hint = document.createElement('div');
    hint.style.cssText = 'padding:16px 20px;font-size:13px;color:#666;background:#f8f9fa;';
    hint.textContent = i18n.t('editor.hint');
    editor.appendChild(hint);

    const textarea = document.createElement('textarea');
    textarea.style.cssText = 'display:block;width:calc(100% - 40px);margin:16px 20px;min-height:300px;border:1px solid #ddd;border-radius:8px;padding:12px;font-size:14px;resize:vertical;font-family:monospace;line-height:1.6;color:#333;background:#fff;box-sizing:border-box;';
    textarea.value = actions.map(a => `${a.icon} | ${a.label} | ${a.prompt}`).join('\n');
    editor.appendChild(textarea);

    const buttons = document.createElement('div');
    buttons.style.cssText = 'display:flex;justify-content:flex-end;gap:10px;padding:0 20px 20px;';
    
    const resetBtn = document.createElement('button');
    resetBtn.textContent = i18n.t('editor.reset');
    resetBtn.style.cssText = 'padding:10px 20px;border-radius:6px;border:1px solid #ddd;cursor:pointer;font-size:14px;background:#f5f5f5;color:#666;';
    
    const saveBtn = document.createElement('button');
    saveBtn.textContent = i18n.t('editor.save');
    saveBtn.style.cssText = 'padding:10px 20px;border-radius:6px;border:none;cursor:pointer;font-size:14px;background:#4a9eff;color:#fff;';
    
    buttons.appendChild(resetBtn);
    buttons.appendChild(saveBtn);
    editor.appendChild(buttons);

    overlay.appendChild(editor);
    document.body.appendChild(overlay);

    const close = () => overlay.remove();
    closeBtn.onclick = close;
    overlay.onclick = e => { if (e.target === overlay) close(); };

    resetBtn.onclick = () => {
      this.resetActions();
      textarea.value = editorDefaultActions.map(a => `${a.icon} | ${a.label} | ${a.prompt}`).join('\n');
    };

    saveBtn.onclick = () => {
      const text = textarea.value;
      const lines = text.split('\n').filter(l => l.trim());
      const newActions = lines.map((line, i) => {
        const parts = line.split('|').map(p => p.trim());
        return {
          id: 'custom_' + i,
          icon: parts[0] || '⚡',
          label: parts[1] || '指令' + (i + 1),
          prompt: parts[2] || ''
        };
      }).filter(a => a.prompt);
      
      this.saveActions(newActions);
      close();
      location.reload();
    };
  }
};

// Export
function exportChat(format) {
  const platform = Platform.detect();
  if (!platform) return alert(i18n.t('alert.unsupported'));

  const messages = Extractor.getMessages(platform);
  if (!messages.length) return alert(i18n.t('alert.no_content'));

  const metadata = Extractor.getMetadata(platform);
  const baseName = Downloader.sanitize(metadata.title);
  const ts = new Date().toISOString().slice(0, 10);

  const fmts = {
    markdown: { ext: 'md', mime: 'text/markdown', fn: Formatter.markdown },
    json: { ext: 'json', mime: 'application/json', fn: Formatter.json },
    html: { ext: 'html', mime: 'text/html', fn: Formatter.html },
    text: { ext: 'txt', mime: 'text/plain', fn: Formatter.text }
  };

  const f = fmts[format];
  if (!f) return;

  Downloader.save(f.fn(messages, metadata, platform), `${baseName}_${ts}.${f.ext}`, f.mime);
}

// UI
function createUI() {
  const platform = Platform.detect();

  GM_addStyle(`
    .aitk-btn{position:fixed;top:10px;left:50%;transform:translateX(-50%);z-index:999999;display:flex;align-items:center;gap:6px;padding:8px 12px;border-radius:20px;background:rgba(255,255,255,0.95);border:1px solid #ddd;cursor:pointer;font-size:13px;box-shadow:0 2px 8px rgba(0,0,0,.1);transition:all .3s cubic-bezier(0.4,0,0.2,1);color:#333;backdrop-filter:blur(10px)}
    .aitk-btn:hover{background:#fff;box-shadow:0 3px 12px rgba(0,0,0,.15)}
    .aitk-btn.mini{padding:6px;gap:0}
    .aitk-btn.mini .aitk-btn-text{max-width:0;opacity:0;margin:0}
    .aitk-btn svg{fill:#333;flex-shrink:0;transition:transform .3s}
    .aitk-btn.mini svg{transform:scale(0.9)}
    .aitk-btn-text{max-width:200px;opacity:1;overflow:hidden;transition:all .3s cubic-bezier(0.4,0,0.2,1);white-space:nowrap;margin-left:4px}
    .aitk-menu{position:fixed;top:55px;left:50%;transform:translateX(-50%);z-index:999999;background:#fff;border:1px solid #ddd;border-radius:8px;box-shadow:0 4px 16px rgba(0,0,0,.15);display:none;min-width:200px;color:#333}
    .aitk-menu.show{display:block}
    .aitk-menu-section{padding:8px 12px;font-size:11px;color:#666;letter-spacing:.5px;border-bottom:1px solid #eee;background:#fafafa;font-weight:600}
    .aitk-menu-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:2px;padding:6px}
    .aitk-menu button{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;padding:8px 4px;border:none;background:#fff;cursor:pointer;font-size:11px;color:#333;border-radius:6px}
    .aitk-menu button:hover{background:#f0f0f0}
    .aitk-menu button .icon{font-size:18px}
    .aitk-menu hr{margin:0;border:none;border-top:1px solid #eee}
    .aitk-menu-edit{display:block;width:100%;padding:8px;border:none;background:#f5f5f5;cursor:pointer;font-size:11px;color:#666;text-align:center}
    .aitk-menu-edit:hover{background:#eee;color:#333}
  `);

  const btn = document.createElement('div');
  btn.className = 'aitk-btn';
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '16');
  svg.setAttribute('height', '16');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'currentColor');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'M3 3h18v2H3V3zm0 16h18v2H3v-2zm0-8h18v2H3v-2z');
  svg.appendChild(path);
  btn.appendChild(svg);
  const btnText = document.createElement('span');
  btnText.className = 'aitk-btn-text';
  btnText.textContent = i18n.t('menu.title');
  btn.appendChild(btnText);

  const menu = document.createElement('div');
  menu.className = 'aitk-menu';

  // Helper function to create elements
  const el = (tag, className, text) => {
    const e = document.createElement(tag);
    if (className) e.className = className;
    if (text) e.textContent = text;
    return e;
  };

  // Export section
  const exportSection = el('div', 'aitk-menu-section', i18n.t('menu.export'));
  menu.appendChild(exportSection);

  const exportGrid = el('div', 'aitk-menu-grid');
  const exports = [
    { fmt: 'markdown', icon: '📝', label: 'MD' },
    { fmt: 'json', icon: '📊', label: 'JSON' },
    { fmt: 'html', icon: '🌐', label: 'HTML' },
    { fmt: 'text', icon: '📄', label: 'TXT' }
  ];
  exports.forEach(ex => {
    const b = el('button');
    b.dataset.export = ex.fmt;
    const iconSpan = el('span', 'icon', ex.icon);
    b.appendChild(iconSpan);
    b.appendChild(document.createTextNode(ex.label));
    exportGrid.appendChild(b);
  });
  menu.appendChild(exportGrid);

  menu.appendChild(el('hr'));

  const actionSection = el('div', 'aitk-menu-section', i18n.t('menu.actions'));
  menu.appendChild(actionSection);

  const actionGrid = el('div', 'aitk-menu-grid');
  const actions = QuickAction.getActions();
  actions.forEach(a => {
    const b = el('button');
    b.dataset.action = a.id;
    b.dataset.prompt = encodeURIComponent(a.prompt);
    const iconSpan = el('span', 'icon', a.icon);
    b.appendChild(iconSpan);
    b.appendChild(document.createTextNode(a.label));
    actionGrid.appendChild(b);
  });
  menu.appendChild(actionGrid);

  // 語言切換按鈕
  const currentLang = i18n.detect();
  const langBtn = el('button', 'aitk-menu-edit', i18n.t('menu.lang') + ': ' + (currentLang === 'zh' ? '繁中' : 'EN'));
  langBtn.dataset.lang = 'true';
  menu.appendChild(langBtn);

  const editBtn = el('button', 'aitk-menu-edit', i18n.t('menu.edit'));
  editBtn.dataset.edit = 'true';
  menu.appendChild(editBtn);
  document.body.appendChild(btn);
  document.body.appendChild(menu);

  // 載入儲存的縮放狀態
  const isMini = GM_getValue('btnMini', false);
  if (isMini) btn.classList.add('mini');

  // 單擊按鈕：切換選單
  btn.onclick = (e) => {
    // 如果點擊的是 SVG 或其子元素，切換大小
    if (e.target.closest('svg')) {
      e.stopPropagation();
      btn.classList.toggle('mini');
      GM_setValue('btnMini', btn.classList.contains('mini'));
      menu.classList.remove('show');
      return;
    }
    // 點擊其他地方，切換選單
    menu.classList.toggle('show');
  };

  menu.onclick = e => {
    const target = e.target.closest('button');
    if (!target) return;

    const exportFmt = target.dataset.export;
    const actionId = target.dataset.action;
    const isEdit = target.dataset.edit;
    const isLang = target.dataset.lang;

    if (exportFmt) {
      exportChat(exportFmt);
    } else if (isLang) {
      // 切換語言
      const newLang = i18n.lang === 'zh' ? 'en' : 'zh';
      i18n.setLang(newLang);
    } else if (isEdit) {
      QuickAction.showEditor();
    } else if (actionId) {
      const prompt = decodeURIComponent(target.dataset.prompt || '');
      if (prompt) QuickAction.sendMessage(platform, prompt);
    }

    menu.classList.remove('show');
  };

  document.addEventListener('click', e => {
    if (!btn.contains(e.target) && !menu.contains(e.target)) menu.classList.remove('show');
  });
}

// Init
function init() {
  if (!Platform.detect()) return;
  if (document.querySelector('.aitk-btn')) return; // 避免重複
  createUI();
  GM_registerMenuCommand('Export Markdown', () => exportChat('markdown'));
  GM_registerMenuCommand('Export JSON', () => exportChat('json'));
  GM_registerMenuCommand('Export HTML', () => exportChat('html'));
  GM_registerMenuCommand('Export Text', () => exportChat('text'));
}

// 立即嘗試 + 延遲重試（給 Gemini 這種慢載入的）
init();
setTimeout(init, 1000);
setTimeout(init, 3000);

})();