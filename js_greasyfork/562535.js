// ==UserScript==
// @name         Aither Comps
// @namespace    http://tampermonkey.net/
// @version      3.4
// @description  Add "Create comp" button next to copy button in description block
// @author       Dooky
// @match        https://aither.cc/torrents/*
// @match        https://aither.cc/forums/topics/forum/57/create
// @match        https://aither.cc/forums/topics/forum/58/create
// @exclude      https://aither.cc/torrents/similar/*
// @exclude      https://aither.cc/torrents/moderation
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562535/Aither%20Comps.user.js
// @updateURL https://update.greasyfork.org/scripts/562535/Aither%20Comps.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const decodeHTML = (html) => html
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&rarr;/g, '→');

  const getTitleElement = () =>
    document.querySelector('h1.torrent__name, h1, .torrent-title h1');

  const getDescriptionSection = () =>
    document.querySelector('.panel__body.bbcode-rendered, .bbcode-rendered, section.panelV2 .panel__body, .panel__body');

  const findCopyButton = () => {
    const headers = document.querySelectorAll('.panel__header');
    for (const header of headers) {
      const heading = header.querySelector('.panel__heading');
      if (heading) {
        const headingText = (heading.innerText || heading.textContent || '').toLowerCase();
        if (headingText.includes('description')) {
          const actions = header.querySelector('.panel__actions');
          if (actions) {
            for (const btn of actions.querySelectorAll('button')) {
              const text = (btn.innerText || btn.textContent || '').toLowerCase();
              if (text.includes('copy')) {
                return btn;
              }
            }
          }
        }
      }
    }

    const descButtons = document.querySelectorAll('button[x-data="description"]');
    for (const btn of descButtons) {
      const onclick = btn.getAttribute('x-on:click') || btn.getAttribute('@click');
      if (onclick?.includes('copy')) {
        return btn;
      }
    }

    const allButtons = document.querySelectorAll('button');
    for (const btn of allButtons) {
      const text = (btn.innerText || btn.textContent || '').toLowerCase();
      if (text.includes('copy')) {
        return btn;
      }
    }

    return null;
  };

  const extractTMDBId = () => {
    for (const link of document.querySelectorAll('a[href*="themoviedb.org"]')) {
      const match = link.href.match(/themoviedb\.org\/(movie|tv)\/(\d+)/);
      if (match) return { type: match[1], id: match[2] };
    }
    return null;
  };

  const extractTitleAndYear = () => {
    const elem = getTitleElement();
    if (!elem) return { title: null, year: null };

    const fullTitle = (elem.innerText || elem.textContent || '').trim();

    const yearParen = fullTitle.match(/\s\((\d{4})\)/);
    if (yearParen) {
      const year = yearParen[1];
      const title = fullTitle.substring(0, fullTitle.indexOf(`(${year})`)).replace(/[-\s]+$/, '').trim();
      return { title, year };
    }

    const yearStandalone = fullTitle.match(/\b(19|20)\d{2}\b/);
    if (yearStandalone) {
      const year = yearStandalone[0];
      const title = fullTitle.substring(0, yearStandalone.index).trim();
      return { title, year };
    }

    const stopWords = /^(UHD|HD|SD|WEB-DL|WEBRip|BluRay|Blu-ray|REMUX|DV|HDR|HDR10|HDR10\+|HEVC|H\.264|H\.265|x264|x265|AAC|AC3|DTS|TrueHD|Atmos|DD|DDP)$/i;
    const words = fullTitle.split(/\s+/);
    const titleWords = [];
    let year = null;

    for (const word of words) {
      if (/^(19|20)\d{2}$/.test(word)) {
        year = word;
        break;
      }
      if (/^\d{3,4}p$/i.test(word) || stopWords.test(word)) break;
      titleWords.push(word);
    }

    return { title: titleWords.join(' ').trim(), year };
  };

  const extractSeasonEpisode = () => {
    const elem = getTitleElement();
    if (!elem) return null;

    const match = (elem.innerText || elem.textContent || '').match(/S(\d+)E(\d+)/i);
    return match ? `S${match[1].padStart(2, '0')}E${match[2].padStart(2, '0')}` : null;
  };

  const extractResolution = () => {
    const elem = getTitleElement();
    if (!elem) return null;

    const fullTitle = (elem.innerText || elem.textContent || '').trim();

    const resMatch = fullTitle.match(/\b(\d{3,4}p)\b/i);
    if (resMatch) return resMatch[1].toLowerCase();
    if (fullTitle.match(/\b4K\b/i)) return '2160p';

    const mediaEl = document.querySelector('.torrent-mediainfo-dump pre code[x-ref="mediainfo"], .torrent-mediainfo-dump pre.decoda-code code, .torrent-mediainfo-dump code');
    if (mediaEl) {
      const widthMatch = (mediaEl.innerText || mediaEl.textContent || '').match(/Width\s*[:\-]\s*(\d+)/i);
      if (widthMatch) {
        const width = parseInt(widthMatch[1]);
        if (width >= 3840) return '2160p';
        if (width >= 1920) return '1080p';
        if (width >= 1280) return '720p';
      }
    }

    return null;
  };

  const extractMediainfo = () => {
    const elem = document.querySelector('.torrent-mediainfo-dump pre code[x-ref="mediainfo"], .torrent-mediainfo-dump pre.decoda-code code, .torrent-mediainfo-dump code, .torrent-mediainfo-dump pre, pre code');
    if (!elem) return { text: null, completeName: null };

    let text = elem.innerText || elem.textContent || '';
    if (!text) return { text: null, completeName: null };

    const nameMatch = text.match(/Complete name\s*[:\-]\s*(.+)/i);
    const completeName = nameMatch ? nameMatch[1].trim() : null;

    const audioMatch = text.match(/\n(Audio #\d+)\n/);
    const menuMatch = text.match(/\nMenu\n/);
    const cutoffIndex = audioMatch && menuMatch
      ? Math.min(audioMatch.index, menuMatch.index)
      : (audioMatch?.index ?? menuMatch?.index ?? -1);

    if (cutoffIndex !== -1) {
      text = text.substring(0, cutoffIndex).trim();
    }

    return { text: text.trim(), completeName };
  };

  const detectTorrentType = () => {
    const tmdb = extractTMDBId();
    if (tmdb?.type) return tmdb.type;
    if (extractSeasonEpisode()) return 'tv';
    if (document.querySelector("i.fa-tv, i.torrent-icon[title*='TV'], i.torrent-icon[title*='Show']")) return 'tv';
    if (document.querySelector("i.fa-film, i.fa-movie, i.torrent-icon[title*='Movie']")) return 'movie';

    const url = window.location.href.toLowerCase();
    if (url.includes('/tv') || url.includes('/series')) return 'tv';
    if (url.includes('/movie') || url.includes('/film')) return 'movie';

    return 'movie';
  };

  const getRawBBCodeFromDescription = () => {
    const section = getDescriptionSection();
    if (!section) return null;

    const copyBtn = findCopyButton();
    if (!copyBtn) return null;

    const attrs = ['data-bbcode', 'data-content', 'data-copy', 'data-clipboard-text', 'data-text'];
    for (const attr of attrs) {
      const val = copyBtn.getAttribute(attr);
      if (val) return val;
    }

    const onclick = copyBtn.getAttribute('onclick');
    if (onclick) {
      const match = onclick.match(/["']([^"']*\[comparison[^"']*)["']/);
      if (match) return match[1];
    }

    const rendered = section.querySelector('.bbcode-rendered') || section;
    for (const attr of ['data-bbcode', 'data-content', 'data-raw', 'data-original']) {
      const val = rendered.getAttribute(attr);
      if (val?.includes('[')) return val;
    }

    const parent = section.closest('section, .panel, .panelV2');
    if (parent) {
      for (const textarea of parent.querySelectorAll('textarea')) {
        if (textarea.value?.includes('[comparison')) return textarea.value;
      }
      for (const pre of parent.querySelectorAll('pre, code')) {
        const text = pre.textContent || pre.innerText || '';
        if (text?.includes('[comparison')) return text;
      }
    }

    const targetId = copyBtn.getAttribute('data-clipboard-target') || copyBtn.getAttribute('data-target');
    if (targetId) {
      const target = document.querySelector(targetId) || document.getElementById(targetId.replace(/^#/, ''));
      if (target) {
        const val = target.value || target.textContent || target.innerText || target.getAttribute('data-content');
        if (val?.includes('[')) return val;
      }
    }

    if (copyBtn.parentElement) {
      for (const sibling of copyBtn.parentElement.children) {
        if (sibling !== copyBtn && ['PRE', 'CODE', 'TEXTAREA'].includes(sibling.tagName)) {
          const text = sibling.textContent || sibling.innerText || sibling.value || '';
          if (text?.includes('[comparison')) return text;
        }
      }
    }

    const alpine = section.closest('[x-data], [data-alpine]');
    if (alpine?.Alpine?._x_dataStack?.[0]?.content) {
      return alpine._x_dataStack[0].content;
    }

    return interceptCopyEvent(copyBtn);
  };

  const interceptCopyEvent = (copyBtn) => {
    let intercepted = null;
    let active = true;

    const handler = (e) => {
      if (!active) return;
      e.preventDefault();
      e.stopImmediatePropagation();

      const text = window.getSelection()?.toString() || e.target?.value || e.target?.textContent || e.target?.innerText || '';
      if (text?.includes('[comparison')) intercepted = text;
      e.clipboardData?.setData('text/plain', '');
      return false;
    };

    const origWrite = navigator.clipboard?.writeText;
    const origExec = document.execCommand;

    document.addEventListener('copy', handler, true);

    if (navigator.clipboard && origWrite) {
      navigator.clipboard.writeText = (text) => {
        if (active && text?.includes('[comparison')) intercepted = text;
        return active ? Promise.resolve() : origWrite.call(navigator.clipboard, text);
      };
    }

    document.execCommand = (cmd, ui, val) => {
      if (active && cmd === 'copy') {
        const text = val || window.getSelection()?.toString() || '';
        if (text?.includes('[comparison')) intercepted = text;
        return false;
      }
      return origExec.call(document, cmd, ui, val);
    };

    try { copyBtn.click(); } catch (e) {}

    setTimeout(() => {
      active = false;
      document.removeEventListener('copy', handler, true);
      if (navigator.clipboard && origWrite) navigator.clipboard.writeText = origWrite;
      document.execCommand = origExec;
    }, 300);

    if (intercepted) {
      active = false;
      document.removeEventListener('copy', handler, true);
      if (navigator.clipboard && origWrite) navigator.clipboard.writeText = origWrite;
      document.execCommand = origExec;
    }

    return intercepted;
  };

  const getDescriptionFromAudits = () => {
    const table = document.querySelector('.data-table-wrapper table.data-table tbody');
    if (!table) return null;

    for (const row of table.querySelectorAll('tr')) {
      const cell = row.querySelector('td:last-child');
      if (!cell) continue;

      for (const li of cell.querySelectorAll('li')) {
        const html = li.innerHTML || '';
        if (!html.toLowerCase().includes('description:')) continue;

        const arrows = ['→', '&rarr;'];
        let after = '';

        for (const arrow of arrows) {
          if (html.includes(arrow)) {
            after = html.split(arrow).slice(1).join(arrow).trim();
            break;
          }
        }

        if (!after) {
          const idx = html.toLowerCase().indexOf('description:');
          if (idx !== -1) {
            const substr = html.substring(idx + 12);
            for (const arrow of arrows) {
              if (substr.includes(arrow)) {
                after = substr.substring(substr.indexOf(arrow) + arrow.length).trim();
                break;
              }
            }
          }
        }

        if (after) return decodeHTML(after);
      }
    }

    return null;
  };

  const getDescription = () => {
    return getRawBBCodeFromDescription() ||
           getDescriptionFromAudits() ||
           getDescriptionSection()?.innerHTML ||
           getDescriptionSection()?.textContent ||
           '';
  };

  const extractComparisonTags = () => {
    const html = getDescription();
    if (!html) return [];

    const decoded = decodeHTML(html);
    const comparisons = [];

    const regex = /\[comparison\s*=\s*([^\]]*)\]([\s\S]*?)\[\/comparison\]/gi;
    let match;

    while ((match = regex.exec(decoded)) !== null) {
      comparisons.push({
        fullTag: `[comparison=${match[1]}]${match[2].trim()}[/comparison]`,
        params: match[1],
        content: match[2].trim()
      });
    }

    if (comparisons.length === 0) {
      const origRegex = /\[comparison\s*=\s*([^\]]*)\]([\s\S]*?)\[\/comparison\]/gi;
      while ((match = origRegex.exec(html)) !== null) {
        comparisons.push({
          fullTag: `[comparison=${match[1]}]${match[2].trim()}[/comparison]`,
          params: match[1],
          content: match[2].trim()
        });
      }
    }

    if (comparisons.length === 0) {
      const encRegex = /&lt;comparison\s*=\s*([^&]*?)&gt;([\s\S]*?)&lt;\/comparison&gt;/gi;
      while ((match = encRegex.exec(html)) !== null) {
        comparisons.push({
          fullTag: `[comparison=${match[1]}]${match[2].replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim()}[/comparison]`,
          params: match[1],
          content: match[2].replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim()
        });
      }
    }

    if (comparisons.length === 0) {
      const noParamRegex = /\[comparison\]([\s\S]*?)\[\/comparison\]/gi;
      while ((match = noParamRegex.exec(decoded)) !== null) {
        comparisons.push({
          fullTag: `[comparison]${match[1].trim()}[/comparison]`,
          params: '',
          content: match[1].trim()
        });
      }
    }

    return comparisons;
  };

  const extractBoldTextBeforeComparison = (html, compTag) => {
    if (!html || !compTag) return null;

    const decoded = decodeHTML(html);
    const compIdx = decoded.indexOf(compTag);
    if (compIdx === -1) return null;

    const before = decoded.substring(0, compIdx);
    const boldMatches = before.match(/\[b\](.*?)\[\/b\]/gi);
    if (!boldMatches?.length) return null;

    const lastBold = boldMatches[boldMatches.length - 1];
    const between = before.substring(before.lastIndexOf(lastBold) + lastBold.length);

    return between.trim().length <= 10 ? lastBold : null;
  };

  const extractComparisonLinks = () => {
    const html = getDescription();
    const decoded = decodeHTML(html || '');
    const compPicsLinks = [];
    const seen = new Set();
    
    const descSection = getDescriptionSection();
    const fallbackHTML = descSection?.innerHTML || descSection?.textContent || '';
    const fallbackDecoded = decodeHTML(fallbackHTML);

    const extractCompPicsFromText = (text) => {
      if (!text) return;
      
      const urlRegex = /(https?:\/\/comp\.pics\/[a-z]+\/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/gi;
      let match;

      while ((match = urlRegex.exec(text)) !== null) {
        const url = match[1].trim();
        if (seen.has(url)) continue;

        const context = text.substring(Math.max(0, match.index - 500), match.index);
        let label = '';

        const nested = /\[color\s*=\s*[^\]]+\]\s*\[b\]([\s\S]*?)\[\/b\]\s*\[\/color\]/gi;
        const nestedMatches = [...context.matchAll(nested)];
        if (nestedMatches.length) {
          const last = nestedMatches[nestedMatches.length - 1];
          label = last[1].trim().replace(/\s+(?:tonemapped|not[_\s]?tonemapped)$/i, '').trim();
        } else {
          const bold = /\[b\]([\s\S]*?)\[\/b\]/gi;
          const boldMatches = [...context.matchAll(bold)];
          if (boldMatches.length) {
            const last = boldMatches[boldMatches.length - 1];
            label = last[1].trim().replace(/\s+(?:tonemapped|not[_\s]?tonemapped)$/i, '').trim();
          }
        }

        if (!/\bRPU\b/i.test(label)) {
          compPicsLinks.push({ url, label });
          seen.add(url);
        }
      }
    };
    
    extractCompPicsFromText(html);
    extractCompPicsFromText(decoded);
    extractCompPicsFromText(fallbackDecoded);
    
    if (descSection) {
      const codeElements = descSection.querySelectorAll('code, pre, .decoda-code');
      codeElements.forEach(el => {
        const codeText = el.textContent || el.innerText || '';
        extractCompPicsFromText(codeText);
      });
    }
    
    try {
      const allTextElements = document.querySelectorAll('p, div, span, li, td, th, code, pre, textarea');
      allTextElements.forEach(el => {
        const text = el.textContent || el.innerText || '';
        if (text.includes('comp.pics/')) {
          extractCompPicsFromText(text);
        }
      });
    } catch (e) {}

    const slowPicsLinks = [];
    const slowSeen = new Set();
    
    const extractSlowPicsFromText = (text) => {
      if (!text) return;
      
      const slowUrlRegex = /\[url\s*=\s*([^\]]*slow\.pics\/c\/[^\]]*)\]([^\[]+?)(?:\[\/url\]|$)/gi;
      let slowMatch;
      
      while ((slowMatch = slowUrlRegex.exec(text)) !== null) {
        const url = slowMatch[1].trim().replace(/["'>]/g, '').split(/["'>]/)[0];
        if (slowSeen.has(url)) continue;
        
        const originalLabel = slowMatch[2].trim();
        slowPicsLinks.push({ url, label: originalLabel || '' });
        slowSeen.add(url);
      }
      
      const slowStandaloneRegex = /(https?:\/\/slow\.pics\/c\/[a-zA-Z0-9]{8})/gi;
      while ((slowMatch = slowStandaloneRegex.exec(text)) !== null) {
        const url = slowMatch[1].trim().replace(/["'>]/g, '').split(/["'>]/)[0];
        if (slowSeen.has(url)) continue;
        
        slowPicsLinks.push({ url, label: '' });
        slowSeen.add(url);
      }
    };
    
    extractSlowPicsFromText(html);
    
    extractSlowPicsFromText(decoded);
    
    extractSlowPicsFromText(fallbackDecoded);
    
    if (descSection) {
      const codeElements = descSection.querySelectorAll('code, pre, .decoda-code, .torrent-mediainfo-dump code');
      codeElements.forEach(el => {
        const codeText = el.textContent || el.innerText || '';
        extractSlowPicsFromText(codeText);
      });
    }
    
    try {
      const allTextElements = document.querySelectorAll('p, div, span, li, td, th, code, pre, textarea');
      allTextElements.forEach(el => {
        const text = el.textContent || el.innerText || '';
        if (text.includes('slow.pics/c/')) {
          extractSlowPicsFromText(text);
        }
      });
    } catch (e) {}

    return {
      compPics: compPicsLinks.length ? compPicsLinks : null,
      slowPics: slowPicsLinks.length ? slowPicsLinks : null
    };
  };

  const getSourcesString = () => {
    const html = getDescription();
    if (!html) return 'Source Vs. Source';

    const decoded = decodeHTML(html);

    const slowMatch = decoded.match(/\[url\s*=\s*[^\]]*slow\.pics[^\]]*\]([^\[]+?)(?:\[\/url\]|$)/i);
    if (slowMatch) {
      const label = slowMatch[1].split('|')[0].trim();
      const vsMatch = label.match(/(?:^|.*[-\u2013\u2014]\s*)(.+?\bvs\.?\b.+?)(?:\s*\||$)/i);
      if (vsMatch) {
        const sources = vsMatch[1].split(/\s+vs\.?\s+/i)
          .map(s => s.trim())
          .filter(s => s && !/^(tonemapped|not[_\s]?tonemapped)$/i.test(s));
        if (sources.length >= 2) return sources.join(' vs. ');
      }
    }

    const comparisons = extractComparisonTags();
    if (comparisons[0]?.params) {
      const sources = comparisons[0].params.split(',').map(s => s.trim()).filter(s => s);
      if (sources.length) return sources.join(' Vs. ');
    }

    return 'Source Vs. Source';
  };

  const buildTitleLine = () => {
    const { title, year } = extractTitleAndYear();
    const seasonEp = extractSeasonEpisode();
    const res = extractResolution();
    const sources = getSourcesString();

    let line = title || '';
    if (year) line += ` (${year})`;
    if (seasonEp) line += ` - ${seasonEp}`;
    if (res) line += ` - ${res}`;
    line += ` - ${sources}`;

    return line;
  };

  const buildComparisonTitle = () => {
    const tmdb = extractTMDBId();
    const { title, year } = extractTitleAndYear();
    const seasonEp = extractSeasonEpisode();
    const res = extractResolution();
    const sources = getSourcesString();

    let compTitle = tmdb
      ? `[${tmdb.type}/${tmdb.id}] `
      : `[${detectTorrentType()}/] `;

    if (title) {
      compTitle += title;
      if (year) compTitle += ` (${year})`;
    }
    if (seasonEp) compTitle += ` - ${seasonEp}`;
    if (res) compTitle += ` - ${res}`;
    compTitle += ` - ${sources}`;

    return compTitle.trim();
  };

  const buildPostContent = () => {
    const titleLine = buildTitleLine();
    let content = `[u]${titleLine}[/u]\n\n`;

    const comparisons = extractComparisonTags();
    const html = getDescription();

    if (comparisons.length) {
      comparisons.forEach(comp => {
        const bold = extractBoldTextBeforeComparison(html, comp.fullTag);
        if (bold) content += `${bold}`;
        content += `${comp.fullTag}\n\n`;
      });
    } else {
      content += `[comparison=]\n[/comparison]\n\n`;
    }

    const links = extractComparisonLinks();
    if (links.compPics) {
      const { title, year } = extractTitleAndYear();
      const titlePrefix = title && year ? `${title} (${year}) - ` : title ? `${title} - ` : '';
      
      const picsArray = Array.isArray(links.compPics) ? links.compPics : [links.compPics];
      picsArray.forEach(link => {
        const url = typeof link === 'string' ? link : link.url;
        let baseLabel = typeof link === 'string' ? '' : link.label;
        
        if (!baseLabel || baseLabel === 'comps pics') {
          baseLabel = '';
        }
        
        const fullLabel = baseLabel 
          ? `${titlePrefix}${baseLabel} | comps pics`
          : `${titlePrefix}comps pics`;
        content += `[url=${url}]${fullLabel}[/url]\n\n`;
      });
    }

    if (links.slowPics) {
      const { title, year } = extractTitleAndYear();
      const titlePrefix = title && year ? `${title} (${year}) - ` : title ? `${title} - ` : '';
      
      const slowArray = Array.isArray(links.slowPics) ? links.slowPics : [links.slowPics];
      slowArray.forEach(link => {
        const url = typeof link === 'string' ? link : link.url;
        let baseLabel = typeof link === 'string' ? '' : link.label;
        
        const isGenericLabel = !baseLabel || 
                               /^slow\.?pics?$/i.test(baseLabel) || 
                               /^slowpoke\.?pics?$/i.test(baseLabel) ||
                               (!/\bvs\.?\b/i.test(baseLabel) && baseLabel.length < 20);
        
        if (isGenericLabel && comparisons.length > 0 && comparisons[0].params) {
          const sources = comparisons[0].params.split(',').map(s => s.trim()).filter(s => s);
          if (sources.length >= 2) {
            baseLabel = sources.join(' Vs. ');
          } else if (sources.length === 1) {
            baseLabel = sources[0];
          }
        }
        
        if (!baseLabel) {
          baseLabel = 'SlowPoke Pics';
        }
        
        const fullLabel = `${titlePrefix}${baseLabel} | SlowPoke Pics`;
        content += `[url=${url}]${fullLabel}[/url]\n\n`;
      });
    }

    const media = extractMediainfo();
    if (media.text) {
      const spoilerTitle = media.completeName || 'Mediainfo';
      content += `[spoiler=${spoilerTitle}][code]${media.text}[/code][/spoiler]\n\n`;
    }

    return content.trim();
  };

  const addCreateCompButton = () => {
    if (document.getElementById('create-comp-btn')) {
      return;
    }

    const btn = document.createElement('button');
    btn.id = 'create-comp-btn';
    btn.textContent = 'Create comp';
    Object.assign(btn.style, {
      marginLeft: '8px',
      padding: '4px 12px',
      cursor: 'pointer',
      backgroundColor: '#2d6cd3',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      fontSize: '13px'
    });

    btn.addEventListener('mouseenter', () => btn.style.backgroundColor = '#2563eb');
    btn.addEventListener('mouseleave', () => btn.style.backgroundColor = '#2d6cd3');
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      try {
        const title = buildComparisonTitle();
        const content = buildPostContent();
        const type = detectTorrentType();
        const url = type === 'tv'
          ? 'https://aither.cc/forums/topics/forum/58/create'
          : 'https://aither.cc/forums/topics/forum/57/create';

        GM_setValue('aither_comp_title', title);
        GM_setValue('aither_comp_content', content);
        GM_openInTab(url, { active: true, insert: true });
      } catch (err) {
        alert('Error creating comp: ' + err.message);
      }
    });

    const copyBtn = findCopyButton();
    if (copyBtn) {
      if (copyBtn.parentNode) {
        copyBtn.parentNode.insertBefore(btn, copyBtn.nextSibling);
      } else {
        copyBtn.after(btn);
      }
    } else {
      const descSection = getDescriptionSection();
      const titleElement = getTitleElement();

      if (titleElement) {
        const container = document.createElement('div');
        container.style.marginTop = '10px';
        container.style.marginBottom = '10px';
        container.appendChild(btn);
        titleElement.parentNode?.insertBefore(container, titleElement.nextSibling);
      } else if (descSection) {
        const container = document.createElement('div');
        container.style.marginBottom = '10px';
        container.appendChild(btn);
        descSection.insertBefore(container, descSection.firstChild);
      } else {
        return;
      }
    }
  };

  const fillField = (selector, value, key, isTextarea = false) => {
    if (!value) return;

    let filled = false;
    const fill = () => {
      if (filled) return;

      const field = document.querySelector(selector);
      if (!field) return;

      const current = field.value || '';
      if (current.trim() && current !== value) return;

      field.focus();
      field.value = value;

      if (!isTextarea) {
        const desc = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
        desc?.set?.call(field, value);
      }

      const events = [
        new Event('focus', { bubbles: true }),
        new Event('input', { bubbles: true, cancelable: true }),
        new Event('change', { bubbles: true, cancelable: true }),
        new Event('blur', { bubbles: true })
      ];

      if (!isTextarea) {
        events.splice(2, 0, new InputEvent('input', {
          bubbles: true,
          cancelable: true,
          inputType: 'insertText',
          data: value
        }));
      }

      events.forEach(evt => field.dispatchEvent(evt));

      if (field.hasAttribute('wire:model')) {
        setTimeout(() => {
          field.value = value;
          field.dispatchEvent(new Event('input', { bubbles: true }));
        }, 100);
      }

      setTimeout(() => {
        if (field.value === value) {
          filled = true;
          GM_setValue(key, null);
        }
      }, 500);
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => setTimeout(fill, isTextarea ? 200 : 100));
    } else {
      setTimeout(fill, isTextarea ? 200 : 100);
    }

    const delays = isTextarea ? [500, 1000, 2000, 3000] : [300, 500, 800, 1200, 2000, 3000, 5000];
    delays.forEach(d => setTimeout(fill, d));

    const obs = new MutationObserver(() => !filled && fill());
    obs.observe(document.body, { childList: true, subtree: true });
    setTimeout(() => obs.disconnect(), isTextarea ? 5000 : 10000);
  };

  const fillTitleField = () => fillField(
    'input#input-thread-title, input.form__text[name="title"], input[name="title"], input[name="topic_title"], input#title, form[method="post"] input[type="text"]:first-of-type',
    GM_getValue('aither_comp_title', null),
    'aither_comp_title',
    false
  );

  const fillPostContent = () => fillField(
    'textarea#bbcode-content, textarea[name="content"], textarea.bbcode-input__input, form textarea',
    GM_getValue('aither_comp_content', null),
    'aither_comp_content',
    true
  );

  const isTorrentPage = /\/torrents\/\d+/.test(window.location.pathname);
  const isForumPage = window.location.href.includes('/forums/topics/forum/57/create') ||
                      window.location.href.includes('/forums/topics/forum/58/create');

  if (isForumPage) {
    fillTitleField();
    fillPostContent();
  } else if (isTorrentPage) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(addCreateCompButton, 500);
      });
    } else {
      setTimeout(addCreateCompButton, 500);
    }

    setTimeout(addCreateCompButton, 1500);
    setTimeout(addCreateCompButton, 3000);
  }
})();
