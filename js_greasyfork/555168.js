// ==UserScript==
// @name         Claude API Exporter (Minimal)
// @namespace    http://tampermonkey.net/
// @version      6.2.0
// @description  Simple export of Claude conversations and artifacts
// @author       MRL (Minimized)
// @match        https://claude.ai/*
// @grant        GM_registerMenuCommand
// @icon         https://www.google.com/s2/favicons?sz=64&domain=claude.ai
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555168/Claude%20API%20Exporter%20%28Minimal%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555168/Claude%20API%20Exporter%20%28Minimal%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // =============================================
    // UTILITIES
    // =============================================
    const sanitize = (name) => (name || 'Untitled').replace(/[\\/:*?"<>|]/g, '_').replace(/\s+/g, '_').slice(0, 100);
    const formatDate = (d) => d ? new Date(d).toLocaleString() : '';

    const timestamp = (d) => {
        const dt = new Date(d || Date.now());
        const p = (n) => String(n).padStart(2, '0');
        return `${dt.getFullYear()}-${p(dt.getMonth()+1)}-${p(dt.getDate())}_${p(dt.getHours())}-${p(dt.getMinutes())}-${p(dt.getSeconds())}`;
    };

    const download = (name, content) => {
        const url = URL.createObjectURL(new Blob([content], { type: 'text/plain' }));
        Object.assign(document.createElement('a'), { href: url, download: name }).click();
        setTimeout(() => URL.revokeObjectURL(url), 100);
    };

    const notify = (msg, type = 'info') => {
        document.querySelectorAll('.claude-notif').forEach(n => n.remove());
        const el = document.createElement('div');
        el.className = 'claude-notif';
        el.style.cssText = `position:fixed;top:20px;right:20px;padding:15px 20px;border-radius:8px;color:#fff;
            font-family:system-ui;font-size:14px;z-index:10000;box-shadow:0 4px 12px rgba(0,0,0,0.3);
            background:${type === 'error' ? '#e53935' : type === 'success' ? '#43a047' : '#1e88e5'}`;
        el.textContent = msg;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 4000);
    };

    // File extensions
    const EXT = {
        'application/vnd.ant.code': (lang) => ({
            javascript: '.js', typescript: '.ts', python: '.py', html: '.html', css: '.css',
            java: '.java', cpp: '.cpp', c: '.c', go: '.go', rust: '.rs', php: '.php',
            ruby: '.rb', json: '.json', yaml: '.yaml', sql: '.sql', bash: '.sh', markdown: '.md',
            jsx: '.jsx', tsx: '.tsx', swift: '.swift', kotlin: '.kt'
        }[(lang || '').toLowerCase()] || '.txt'),
        'text/html': '.html',
        'text/markdown': '.md',
        'image/svg+xml': '.svg',
        'application/vnd.ant.mermaid': '.mmd',
        'application/vnd.ant.react': '.jsx'
    };

    const getExt = (type, lang) => typeof EXT[type] === 'function' ? EXT[type](lang) : EXT[type] || '.txt';

    // =============================================
    // API
    // =============================================
    const getOrgId = () => {
        const c = document.cookie.split(';').find(c => c.trim().startsWith('lastActiveOrg='));
        if (!c) throw new Error('Organization ID not found');
        return c.trim().split('=')[1];
    };

    const getConvId = () => (window.location.pathname.match(/\/chat\/([^/?]+)/) || [])[1];

    const fetchConv = async (id) => {
        const cid = id || getConvId();
        if (!cid) return null;
        const r = await fetch(`/api/organizations/${getOrgId()}/chat_conversations/${cid}?tree=true&rendering_mode=messages&render_all_tools=true`);
        if (!r.ok) throw new Error(`API error: ${r.status}`);
        return r.json();
    };

    // =============================================
    // ARTIFACT EXTRACTION
    // =============================================
    const extractArtifacts = (conv) => {
        const artifacts = new Map();
        const msgs = [...conv.chat_messages].sort((a, b) => a.index - b.index);

        msgs.forEach(msg => {
            msg.content.forEach(c => {
                if (c.type === 'tool_use' && c.name === 'artifacts' && c.input) {
                    const inp = c.input;
                    if (!artifacts.has(inp.id)) {
                        artifacts.set(inp.id, { versions: [], content: '', title: inp.title || inp.id, type: inp.type, lang: inp.language });
                    }
                    const art = artifacts.get(inp.id);

                    if (inp.command === 'create') {
                        art.content = inp.content || '';
                        art.title = inp.title || art.title;
                        art.type = inp.type;
                        art.lang = inp.language;
                    } else if (inp.command === 'rewrite') {
                        art.content = inp.content || '';
                        art.title = inp.title || art.title;
                    } else if (inp.command === 'update') {
                        art.content = art.content.replace(inp.old_str || '', inp.new_str || '');
                    }

                    art.versions.push({
                        version: art.versions.length + 1,
                        command: inp.command,
                        title: inp.title || art.title,
                        content: art.content,
                        type: art.type,
                        lang: art.lang,
                        timestamp: c.stop_timestamp || msg.created_at,
                        msgUuid: msg.uuid
                    });
                }
            });
        });

        return artifacts;
    };

    // =============================================
    // MARKDOWN GENERATION
    // =============================================
    const generateMarkdown = (conv, artifacts = null, embedArtifacts = false) => {
        const lines = [];

        // Header
        if (conv.project) lines.push(`*Project:* [${conv.project.name}](https://claude.ai/project/${conv.project.uuid})  `);
        lines.push(`*URL:* https://claude.ai/chat/${conv.uuid}  `);
        lines.push(`*Created:* ${formatDate(conv.created_at)}  `);
        lines.push(`*Updated:* ${formatDate(conv.updated_at)}`);
        if (conv.model) lines.push(`*Model:* \`${conv.model}\``);
        lines.push(`\n# ${conv.name || 'Untitled'}\n`);

        const msgs = [...conv.chat_messages].sort((a, b) => a.index - b.index);

        msgs.forEach(msg => {
            const role = msg.sender === 'human' ? 'Human' : 'Claude';
            lines.push('__________\n');
            lines.push(`## ${msg.index} - ${role}  `);
            lines.push(`*Created:* ${formatDate(msg.created_at)}  `);
            lines.push(`*UUID:* \`${msg.uuid}\`\n`);

            msg.content.forEach(c => {
                if (c.type === 'text') {
                    lines.push(c.text + '\n');
                } else if (c.type === 'tool_use' && c.name === 'artifacts' && c.input) {
                    const inp = c.input;
                    lines.push(`**Artifact:** ${inp.title || inp.id}  `);
                    lines.push(`*ID:* \`${inp.id}\` | *Command:* \`${inp.command}\`\n`);

                    if (embedArtifacts && artifacts?.has(inp.id)) {
                        const art = artifacts.get(inp.id);
                        const ver = art.versions.find(v => v.msgUuid === msg.uuid);
                        if (ver) {
                            const lang = ver.type === 'text/markdown' ? 'markdown' :
                                        ver.type === 'text/html' ? 'html' :
                                        ver.type === 'application/vnd.ant.react' ? 'jsx' :
                                        (ver.lang || '').toLowerCase() || '';
                            lines.push('```' + lang);
                            lines.push(ver.content);
                            lines.push('```\n');
                        }
                    }
                } else if (c.type === 'tool_use' && c.name === 'web_search' && c.input) {
                    lines.push(`**🔍 Web Search:** \`${c.input.query}\`\n`);
                } else if (c.type === 'thinking' && c.thinking) {
                    const sum = c.summaries?.length ? c.summaries[c.summaries.length - 1]?.summary : 'Thinking...';
                    lines.push(`*[Claude thinking...]*\n<details>\n<summary>${sum}</summary>\n${c.thinking}\n</details>\n`);
                }
            });

            (msg.files_v2 || msg.files || []).forEach(f => {
                lines.push(`**File:** ${f.file_name} | *ID:* \`${f.file_uuid}\`\n`);
            });
        });

        return lines.join('\n');
    };

    // =============================================
    // EXPORT FUNCTIONS
    // =============================================
    const genFilename = (conv) => `[${timestamp(conv.created_at)}] ${sanitize(conv.name)}.md`;

    const exportConversation = async () => {
        try {
            notify('Exporting...', 'info');
            const conv = await fetchConv();
            if (!conv) { notify('No conversation found', 'error'); return; }

            download(genFilename(conv), generateMarkdown(conv));
            notify('✅ Conversation exported!', 'success');
        } catch (e) {
            console.error('[Exporter]', e);
            notify(`Export failed: ${e.message}`, 'error');
        }
    };

    const exportWithArtifacts = async (embedOnly = false) => {
        try {
            notify('Exporting...', 'info');
            const conv = await fetchConv();
            if (!conv) { notify('No conversation found', 'error'); return; }

            const artifacts = extractArtifacts(conv);
            download(genFilename(conv), generateMarkdown(conv, artifacts, true));

            if (!embedOnly) {
                let count = 0;
                artifacts.forEach((art) => {
                    if (art.versions.length) {
                        const final = art.versions[art.versions.length - 1];
                        const ext = getExt(final.type, final.lang);
                        const fn = `[${timestamp(final.timestamp)}] ${sanitize(conv.name)} - ${sanitize(final.title)}${ext}`;
                        download(fn, final.content);
                        count++;
                    }
                });
                notify(`✅ Exported + ${count} artifact files!`, 'success');
            } else {
                notify(`✅ Exported with ${artifacts.size} artifacts inline!`, 'success');
            }
        } catch (e) {
            console.error('[Exporter]', e);
            notify(`Export failed: ${e.message}`, 'error');
        }
    };

    // =============================================
    // INIT - v6.2: Removed Raw JSON option
    // =============================================
    const init = () => {
        console.log('[Claude Exporter v6.2] Ready');
        GM_registerMenuCommand('📄 Conversation Only', exportConversation);
        GM_registerMenuCommand('📝 Conversation + Code Inline', () => exportWithArtifacts(true));
        GM_registerMenuCommand('📁 Conversation + Separate Files', () => exportWithArtifacts(false));
    };

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();