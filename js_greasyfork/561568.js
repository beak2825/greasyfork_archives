// ==UserScript==
// @name         Bouton Sharewood -> QBittorrent
// @namespace    https://greasyfork.org/users/1556453
// @version      1.1.6
// @description  Ajoute un bouton qui envoi le torrent à qBittorrent.
// @author       pomdepain
// @license      MIT
// @match        https://www.sharewood.tv/torrents/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      *
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/561568/Bouton%20Sharewood%20-%3E%20QBittorrent.user.js
// @updateURL https://update.greasyfork.org/scripts/561568/Bouton%20Sharewood%20-%3E%20QBittorrent.meta.js
// ==/UserScript==

/* jshint esversion: 8 */

/* ==============================
   CONFIGURATION (modifier ici)
   ============================== */
 
const QB_URL = "http://192.168.1.55:8080";
const QB_USER = "admin"; // <-- mettre ton user ici (ou vide pour pas utiliser)
const QB_PASS = "pass"; // <-- mot de passe
 

// ======= OPTIONS D'ENVOI =======
// Contrôler ce qu'on envoie au qBittorrent :
// SEND_SAVE_PATH : si true, on envoie le paramètre `savepath` (chemin)
// SEND_CATEGORY  : si true, on envoie le paramètre `category` (libellé catégorie)
const SEND_SAVE_PATH = false;
const SEND_CATEGORY = true;

// mapping des chemins selon la catégorie ou sous-catégorie sur le site
// à rentrer au format "Catégorie": "dossier" ou "Catégorie/Sous-Catégorie": "dossier"
const PATHS = {
//  EXEMPLE :
//  "Vidéos/Séries": "/tv",
//  "Vidéos/Séries Animations": "/tv",

//  "Vidéos/Films": "/movies",
//  "Vidéos/Films Animations": "/movies",
    
//  "Jeux-Vidéos": "/games",

};
// chemin par défaut si rien n'est précisé
const DEFAULT_PATH = "/downloads";

// ======= TEMPLATE POUR CATEGORY =======
// Par défaut on enverra "{category}/{subcategory}".
// on peux mettre ici n'importe quel texte qui peut contenir ou non les balises {category} et {subcategory}.
// Exemples : "{category}/{subcategory}", "{subcategory}" ou "Sharewood"
const CATEGORY_TEMPLATE = "{category}/{subcategory}";

// texte et couleur du bouton
const BUTTON_TEXT = "QBittorrent";
const BUTTON_COLOR = "#086b9b";

/* ==============================
   FIN CONFIGURATION
   ============================== */


(function () {
    'use strict';

    /* ---------- utilitaires ---------- */
    function parseQbInput(str) {
        let username = null, password = null;
        let hostPort = (str || '').trim();
        if (!hostPort) return { baseUrl: '', username: null, password: null };
        if (hostPort.includes('@')) {
            const parts = hostPort.split('@');
            const authPart = parts[0];
            hostPort = parts.slice(1).join('@');
            if (authPart.includes(':')) [username, password] = authPart.split(':');
            else username = authPart;
        }
        let base = hostPort;
        if (!/^https?:\/\//i.test(base)) base = 'http://' + base;
        base = base.replace(/\/+$/, '');
        return { baseUrl: base, username, password };
    }

    function trimText(s) { return s ? s.replace(/\s+/g, ' ').trim() : ''; }

    function showToast(message, opts = {}) {
        const id = 'qb-toast';
        let container = document.getElementById(id);
        if (!container) {
            container = document.createElement('div');
            container.id = id;
            container.style.position = 'fixed';
            container.style.left = '50%';
            container.style.bottom = '20px';
            container.style.transform = 'translateX(-50%)';
            container.style.zIndex = 999999;
            container.style.display = 'flex';
            container.style.flexDirection = 'column';
            container.style.gap = '8px';
            document.body.appendChild(container);
        }
        container.innerHTML = '';
        const toast = document.createElement('div');
        toast.style.minWidth = '250px';
        toast.style.maxWidth = '450px';
        toast.style.padding = '15px 18px';
        toast.style.borderRadius = '8px';
        toast.style.boxShadow = '0 6px 18px rgba(0,0,0,0.2)';
        toast.style.background = opts.background || '#222';
        toast.style.color = opts.color || '#fff';
        toast.style.fontSize = '16px';
        toast.style.opacity = '0';
        toast.style.transition = 'opacity .18s ease';
        toast.textContent = message;
        container.appendChild(toast);
        requestAnimationFrame(() => { toast.style.opacity = '1'; });
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => { if (container.parentNode) container.parentNode.removeChild(container); }, 300);
        }, opts.lifetime || 4500);
    }

    /* ---------- extraction info page ---------- */
    function extractCategoryInfo() {
        try {
            const rows = Array.from(document.querySelectorAll('table.table tr'));
            let category = null, subcategory = null;
            rows.forEach(tr => {
                const firstTd = tr.querySelector('td:first-child strong');
                if (!firstTd) return;
                const key = trimText(firstTd.textContent || '');
                const tds = tr.querySelectorAll('td');
                const valueTd = tds[1];
                const value = valueTd ? trimText(valueTd.textContent || '') : '';
                if (key === 'Catégorie') category = value;
                if (key === 'Sous-Catégorie') subcategory = value;
            });
            return { category, subcategory };
        } catch (e) {
            console.error('extractCategoryInfo error', e);
            return { category: null, subcategory: null };
        }
    }

    // Construit la string category à partir du template.
    // Remplace {category} et {subcategory} puis nettoie les espaces.
    function buildCategoryString(category, subcategory) {
        const tpl = (typeof CATEGORY_TEMPLATE !== 'undefined' && CATEGORY_TEMPLATE) ? CATEGORY_TEMPLATE : '{category}/{subcategory}';
        const cat = trimText(category || '');
        const sub = trimText(subcategory || '');
        // remplacer placeholders
        let out = tpl.replace(/\{category\}/g, cat).replace(/\{subcategory\}/g, sub);
        // trim
        out = out.trim();
        return out;
    }

    function choosePath(category, subcategory) {
        function norm(k) { return k ? k.replace(/\s+/g, ' ').trim() : ''; }
        const cat = norm(category);
        const sub = norm(subcategory);
        const candidates = [];
        if (cat && sub) candidates.push(`${cat}/${sub}`);
        if (cat) candidates.push(cat);
        for (const c of candidates) if (PATHS.hasOwnProperty(c)) return PATHS[c];
        return DEFAULT_PATH;
    }

    function getTorrentHrefFromPage() {
        const downloadBtn = document.querySelector('a.btn-lg-download');
        return downloadBtn ? downloadBtn.href : null;
    }

    /* ---------- qB API ---------- */
    const qb = {
    baseUrl: (typeof QB_URL !== 'undefined' && QB_URL) ? QB_URL.replace(/\/+$/, '') : '',
    username: (typeof QB_USER !== 'undefined' && QB_USER) ? QB_USER : null,
    password: (typeof QB_PASS !== 'undefined' && QB_PASS) ? QB_PASS : null
};
    const QB_LOGIN = qb.baseUrl ? qb.baseUrl + '/api/v2/auth/login' : null;
    const QB_ADD = qb.baseUrl ? qb.baseUrl + '/api/v2/torrents/add' : null;

    // Stocke le SID extrait après login
    let QB_SID = null;

    function extractSidFromHeaders(headerStr) {
        if (!headerStr) return null;
        // Cherche Set-Cookie: ... SID=xxx
        try {
            // plusieurs Set-Cookie peuvent exister -> chercher SID
            const re = /Set-Cookie:\s*([^=;\s]+)=([^;\r\n]+)/gi;
            let m;
            while ((m = re.exec(headerStr)) !== null) {
                const name = m[1];
                const val = m[2];
                if (/^SID$/i.test(name)) return val;
            }
            // fallback: chercher SID=... n'importe où
            const m2 = headerStr.match(/SID=([^;\r\n]+)/i);
            if (m2) return m2[1];
        } catch (e) { console.warn('extractSidFromHeaders err', e); }
        return null;
    }

    function qbLogin(username, password) {
        return new Promise((resolve, reject) => {
            if (!username) { resolve({ ok: true, info: 'no auth provided' }); return; }
            if (!QB_LOGIN) return reject({ ok: false, error: 'QB URL not configured' });
            const body = `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password || '')}`;
            GM_xmlhttpRequest({
                method: 'POST',
                url: QB_LOGIN,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Referer': qb.baseUrl },
                data: body,
                onload(res) {
                    const text = res.responseText || '';
                    const headers = res.responseHeaders || '';
                    console.log('qbLogin response', res.status, { text, headers });

                    // essayer d'extraire SID depuis headers (Set-Cookie)
                    const sid = extractSidFromHeaders(headers);
                    if (sid) QB_SID = sid;

                    if (res.status === 200 && /ok/i.test(text)) {
                        resolve({ ok: true, info: text, sid: QB_SID });
                    } else {
                        // Si serveur répond 200 mais pas 'ok', passer l'erreur
                        reject({ ok: false, status: res.status, text: text || res.statusText, sid: QB_SID });
                    }
                },
                onerror(err) { reject({ ok: false, error: err }); }
            });
        });
    }

    function qbAddTorrentFromBlob(torrentBlob, savepath, categoryForQb) {
        return new Promise((resolve, reject) => {
            if (!QB_ADD) return reject({ ok: false, error: 'QB URL not configured' });
            try {
                const fd = new FormData();
                fd.append('torrents', torrentBlob, 'file.torrent');
                if (SEND_SAVE_PATH && savepath) fd.append('savepath', savepath);
                if (SEND_CATEGORY && categoryForQb) fd.append('category', categoryForQb);

                // Préparer headers
                const headers = { 'Referer': qb.baseUrl };
                if (QB_SID) headers.Cookie = `SID=${QB_SID}`;

                GM_xmlhttpRequest({
                    method: 'POST',
                    url: QB_ADD,
                    data: fd,
                    headers: headers,
                    onload(res) {
                        const text = res.responseText || '';
                        console.log('qbAdd response status=', res.status, 'text=', text);
                        const isFailText = /fail/i.test(text);
                        if (res.status >= 200 && res.status < 300 && !isFailText) {
                            resolve({ ok: true, status: res.status, text: text });
                        } else {
                            // tenter d'extraire Set-Cookie si présent (rare ici) pour debug
                            const headers = res.responseHeaders || '';
                            const sid = extractSidFromHeaders(headers);
                            if (sid && !QB_SID) QB_SID = sid;
                            reject({ ok: false, status: res.status, text: text || res.statusText });
                        }
                    },
                    onerror(err) { reject({ ok: false, error: err }); }
                });
            } catch (e) {
                reject({ ok: false, error: e });
            }
        });
    }

    function fetchTorrentAsBlob(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                responseType: 'blob',
                onload(res) {
                    if (res.status >= 200 && res.status < 300) resolve(res.response);
                    else reject({ status: res.status, text: res.statusText || res.responseText });
                },
                onerror(err) { reject(err); }
            });
        });
    }

    /* ---------- UI ---------- */
    GM_addStyle(`
    .tm-qb-button {
        border-color: ${BUTTON_COLOR} !important;
        background-color: ${BUTTON_COLOR} !important;
        color: #fff !important;
    }
    .tm-qb-button:hover {
        color: ${BUTTON_COLOR} !important;
    }
    `);

    function createButtonElement() {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.setAttribute('data-tm-qb', '1');
        btn.className = 'btn btn-primary btn-lg btn-upload hvr-bounce-to-bottom tm-qb-button';
        btn.style.marginLeft = '6px';
        btn.innerHTML = `<span class="btn-label">${BUTTON_TEXT}</span>`;

        btn.title = BUTTON_TEXT;
        btn.addEventListener('mouseenter', () => {
            try {
                const { category, subcategory } = extractCategoryInfo();
                const savepath = choosePath(category, subcategory);
                const qbCategory = buildCategoryString(category, subcategory);

                const parts = [];
                parts.push(`Envoi QBittorrent prêt`);
                if (SEND_CATEGORY) parts.push(`Catégorie: ${qbCategory || '(vide)'}`);
                if (SEND_SAVE_PATH) parts.push(`Chemin: ${savepath || '(par défaut)'}`);
                btn.title = parts.join(' - ');
            } catch (err) {
                // fallback sûr
                btn.title = BUTTON_TEXT;
            }
        });
        return btn;
    }

    function insertIntoContainer(container) {
        if (!container || !container.appendChild) return false;
        if (container.querySelector && container.querySelector('button[data-tm-qb="1"]')) return false;
        const btn = createButtonElement();
        btn.addEventListener('click', handleSendClickEvent);
        const downloadAnchor = container.querySelector && container.querySelector('a.btn-lg-download');
        if (downloadAnchor && downloadAnchor.parentNode) {
            downloadAnchor.parentNode.insertBefore(btn, downloadAnchor.nextSibling);
        } else {
            container.appendChild(btn);
        }
        return true;
    }

    function insertButtonsInPage() {
        const topSpan = document.querySelector('span.badge-user.bouton-resp');
        if (topSpan) insertIntoContainer(topSpan);
        const bottomSpan = document.querySelector('.torrent-bottom span.badge-user.bouton-resp') ||
              document.querySelector('.torrent-bottom .text-center span.badge-user.bouton-resp') ||
              document.querySelector('.torrent-bottom');
        if (bottomSpan) insertIntoContainer(bottomSpan);
        const allSpans = Array.from(document.querySelectorAll('span.badge-user.bouton-resp'));
        allSpans.forEach(sp => insertIntoContainer(sp));
    }

    async function handleSendClickEvent(e) {
        e.preventDefault();

        const torrentHref = getTorrentHrefFromPage();
        if (!torrentHref) {
            showToast('Impossible de trouver le lien .torrent sur la page.', { background: '#ef5c54' });
            return;
        }

        showToast('Envoi du torrent à qBittorrent...', { background: '#1ba09c' });

        const { category, subcategory } = extractCategoryInfo();
        const savepath = choosePath(category, subcategory);
        const qbCategory = buildCategoryString(category, subcategory);

        try {
            const blob = await fetchTorrentAsBlob(torrentHref);

            // login si besoin
            try {
                await qbLogin(qb.username, qb.password);
            } catch (loginErr) {
                console.error('Login failed', loginErr);
                const msg = 'Erreur login qBittorrent : ' + (loginErr.text || JSON.stringify(loginErr));
                showToast(msg, { background: '#ef5c54', lifetime: 7000 });
                return;
            }

            // tentative unique
            try {
                const res = await qbAddTorrentFromBlob(blob, savepath, qbCategory);
                console.log('qb add OK:', res);
                showToast('Torrent envoyé', { background: '#22b598', lifetime: 7000 });
                return;
            } catch (addErr) {
                console.warn('qb add failed:', addErr);
                let msg = 'Erreur lors de l\'ajout au serveur qBittorrent: ';
                if (addErr && addErr.text) msg += addErr.text;
                else if (addErr && addErr.status) msg += `HTTP ${addErr.status}`;
                else if (addErr && addErr.error) msg += JSON.stringify(addErr.error);
                else msg += JSON.stringify(addErr);
                showToast(msg, { background: '#ef5c54', lifetime: 7000 });
                return;
            }
        } catch (err) {
            console.error('Erreur process', err);
            let msg = 'Erreur lors de l\'envoi: ';
            if (err && err.text) msg += err.text;
            else if (err && err.status) msg += `HTTP ${err.status}`;
            else if (err && err.error) msg += JSON.stringify(err.error);
            else msg += JSON.stringify(err);
            showToast(msg, { background: '#ef5c54', lifetime: 7000 });
        }
    }

    function bindExistingButtons() {
        const buttons = Array.from(document.querySelectorAll('button[data-tm-qb="1"]'));
        buttons.forEach(btn => {
            if (!btn.__qbHandlerAttached) {
                btn.addEventListener('click', handleSendClickEvent);
                btn.__qbHandlerAttached = true;
            }
        });
    }

    function init() {
        insertButtonsInPage();
        bindExistingButtons();
        const observer = new MutationObserver(() => {
            insertButtonsInPage();
            bindExistingButtons();
        });
        const startObs = () => {
            if (!document.body) return false;
            observer.observe(document.body, { childList: true, subtree: true });
            return true;
        };
        if (!startObs()) {
            const bodyInterval = setInterval(() => { if (startObs()) clearInterval(bodyInterval); }, 50);
        }
        let attempts = 0;
        const iv = setInterval(() => {
            attempts++;
            insertButtonsInPage();
            bindExistingButtons();
            if (attempts > 24) clearInterval(iv);
        }, 250);
    }

    init();
})();
