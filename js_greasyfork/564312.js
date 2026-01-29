// ==UserScript==
// @name         BooksTWtoDouban
// @namespace    http://tampermonkey.net/
// @version      2.20
// @description  Autofill content, author intro, TOC from Books.com.tw (繁体/简体) to Douban accurately
// @author       天一阁守藏史
// @match        *://www.books.com.tw/products/*
// @match        *://book.douban.com/new_subject*
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/564312/BooksTWtoDouban.user.js
// @updateURL https://update.greasyfork.org/scripts/564312/BooksTWtoDouban.meta.js
// ==/UserScript==

(() => {
'use strict';

const STORAGE_KEY = 'douban_book_meta_global';

/* ================= Storage ================= */
const storage = {
    get: k => { try { return JSON.parse(GM_getValue(k)); } catch { return null; } },
    set: (k,v) => GM_setValue(k, JSON.stringify(v))
};
const saveGlobal = m => m && storage.set(STORAGE_KEY, m);
const readStored = () => storage.get(STORAGE_KEY);

/* ================= Helpers ================= */
const cleanText = s => s ? s.replace(/<[^>]+>/g,'').replace(/\r/g,'').replace(/\n{2,}/g,'\n').trim() : '';
const normalizeIsbn = s => (s||'').replace(/[^0-9Xx]/g,'').toUpperCase();
const normalizePersonName = s => (s||'').replace(/[,，]/g,'').trim();
const splitTitle = t => {
    if (!t) return { main_title:'', subtitle:null };
    if (t.includes('：')) {
        const [a,...b]=t.split('：');
        return { main_title:a.trim(), subtitle:b.join('：').trim()||null };
    }
    return { main_title:t.trim(), subtitle:null };
};
const parsePubdate = s => {
    if (!s) return {};
    const m = s.replace(/\D/g,'');
    if (m.length>=8) return { pub_year:+m.slice(0,4), pub_month:+m.slice(4,6), pub_day:+m.slice(6,8) };
    if (m.length>=6) return { pub_year:+m.slice(0,4), pub_month:+m.slice(4,6) };
    if (m.length>=4) return { pub_year:+m.slice(0,4) };
    return {};
};
const toAbsUrl = (u,b)=>{ try{return new URL(u,b).href}catch{return u} };
const appendSourceNote=(t,n)=>t?`${t}\n\n（${n}）`:t;

/* ================= Section Extractor ================= */
// 支持繁体/简体标题匹配
function extractSections() {
    const root = document.body;
    if (!root) return {};
    const sections = { description:'', author_profile:'', toc:'' };

    const headers = root.querySelectorAll('h1,h2,h3,h4,strong,b');

    headers.forEach(h => {
        const text = h.textContent.trim();
        let type = null;
        // 繁体/简体内容简介
        if (/內容簡介|内容简介/.test(text)) type = 'description';
        // 繁体/简体作者介绍
        else if (/作者介紹|作者简介/.test(text)) type = 'author_profile';
        // 繁体/简体目录
        else if (/目錄|目录/.test(text)) type = 'toc';
        if (!type) return;

        const content = [];
        let node = h.nextElementSibling;
        while(node){
            const txt = cleanText(node.innerHTML || '');
            if (!txt) { node = node.nextElementSibling; continue; }
            if (/內容簡介|内容简介|作者介紹|作者简介|目錄|目录/.test(txt)) break;
            content.push(txt);
            node = node.nextElementSibling;
        }
        sections[type] = content.join('\n');
    });

    sections.description = appendSourceNote(sections.description,' books.com.tw');
    return sections;
}

/* ================= Books.com.tw Extractor ================= */
function extractBooksTwMeta() {
    const $ = s => document.querySelector(s);

    const title = $('h1')?.textContent?.trim() || '';
    const { main_title, subtitle } = splitTitle(title);

    const infoText = $('.type02_p003')?.innerText || '';
    const pick = label => infoText.match(new RegExp(label + '\\s*[：:]\\s*([^\\n]+)'))?.[1]?.trim() || '';

    const authors = pick('作者').split(/[／/]/).map(normalizePersonName).filter(Boolean);
    const translators = pick('譯者').split(/[／/]/).map(normalizePersonName).filter(Boolean);

    let isbn = normalizeIsbn(pick('ISBN')) || normalizeIsbn($('meta[itemprop="isbn"]')?.content || '');
    if (!isbn) {
        const m = document.body.innerText.match(/97[89][-\dXx]{10,16}/);
        if (m) isbn = normalizeIsbn(m[0]);
    }

    const publisher = pick('出版社');
    const pubdate = parsePubdate(pick('出版日期'));
    const binding = pick('裝訂');
    const price = pick('定價')?.replace(/[^\d]/g,'') || null;
    const cover = $('.cover img')?.src || '';

    const sections = extractSections();

    return {
        title,
        main_title,
        subtitle,
        author: authors,
        translator: translators,
        publisher,
        isbn,
        cover: toAbsUrl(cover, location.href),
        description: sections.description,       // 内容简介
        author_profile: sections.author_profile, // 作者介绍
        toc: sections.toc,                        // 目录
        binding,
        price,
        Original_title: null,
        ...pubdate,
        _source: 'books.com.tw',
        _books_url: location.href
    };
}

/* ================= Books → Douban ================= */
function parseAndRedirectFromBooksTw() {
    const meta = extractBooksTwMeta();
    saveGlobal(meta);
    window.open('https://book.douban.com/new_subject','_blank');
}

/* ================= Douban Autofill ================= */
const setVal=(s,v)=>{ const el=document.querySelector(s); if(!el||!v) return; el.value=v; el.dispatchEvent(new Event('input',{bubbles:true})); };
const setArea=setVal;
const fillList=(base,arr)=>{ if(!Array.isArray(arr))return; arr.forEach((v,i)=>setVal(`#${base}${i?`_${i}`:''}`,v)); };

function fillDoubanPage1(){
    const m=readStored(); if(!m)return;
    setVal('#p_title',m.title);
    setVal('#uid',m.isbn);
}

function fillDoubanPage2(){
    const m=readStored(); if(!m)return;
    setVal('#p_2', m.main_title);
    setVal('#p_42', m.subtitle);
    setVal('#p_6', m.publisher);
    setVal('#p_9', m.isbn);
    setArea('textarea[name="p_3_other"]', m.description);    // 内容简介
    setArea('textarea[name="p_4"]', m.author_profile);       // 作者简介
    setArea('textarea[name="p_3"]', m.toc);                  // 目录
    fillList('p_5', m.author);
    fillList('p_7', m.translator);
}

/* ================= Toolbar ================= */
function createToolbar(){
    if(document.getElementById('douban-helper-toolbar')) return;
    const bar=document.createElement('div');
    bar.id='douban-helper-toolbar';
    bar.style.cssText='position:fixed;top:10px;right:10px;z-index:99999;background:#fff;border:1px solid #ccc;padding:6px;font-size:12px';
    const btn=(t,cb)=>{ const b=document.createElement('button'); b.textContent=t; b.onclick=cb; b.style.margin='4px'; return b; };

    if (/books\.com\.tw/.test(location.hostname)) bar.appendChild(btn('Add to Douban',parseAndRedirectFromBooksTw));
    if (location.hostname === 'book.douban.com') {
        if (document.querySelector('#p_title')) bar.appendChild(btn('ISBN & Title',fillDoubanPage1));
        if (document.querySelector('#p_2')) bar.appendChild(btn('Autofill All',fillDoubanPage2));
    }
    document.body.appendChild(bar);
}

/* init */
createToolbar();

})();
