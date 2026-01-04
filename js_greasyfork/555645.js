// ==UserScript==
// @name         drawaria mini buscador google local
// @namespace    asael.script.local
// @version      1.2
// @description  Botón con logo Google que abre un mini buscador (varias búsquedas) y un feed visual local donde publicar texto + imágenes (solo en tu navegador, session-only).
// @author       asael
// @match        *://*/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555645/drawaria%20mini%20buscador%20google%20local.user.js
// @updateURL https://update.greasyfork.org/scripts/555645/drawaria%20mini%20buscador%20google%20local.meta.js
// ==/UserScript==   //       



(function() {
    'use strict';

    /* ---------- Config ---------- */
    const STORAGE_KEY = 'asael_mini_feed_v1'; // usa sessionStorage para que se borre al cerrar la pestaña
    // Si prefieres persistencia más duradera, cambiar sessionStorage por localStorage.
    /* ---------------------------- */

    // Helper: cargar posts de sessionStorage
    function loadPosts() {
        try {
            const raw = sessionStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    }

    // Helper: guardar posts en sessionStorage
    function savePosts(posts) {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    }

    // Crear contenedor principal (para buscar + feed)
    const container = document.createElement('div');
    container.id = 'asael-mini-google-feed';
    Object.assign(container.style, {
        position: 'fixed',
        bottom: '90px',
        right: '20px',
        width: '360px',
        maxHeight: '70vh',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.25)',
        zIndex: 100000,
        overflow: 'hidden',
        fontFamily: 'Arial, sans-serif',
        display: 'none',
    });

    // --------- Header (mini Google bar) ----------
    const header = document.createElement('div');
    header.style = 'display:flex;align-items:center;padding:10px;border-bottom:1px solid #e6e6e6;';

    // Google color "G" SVG inline
    const googleLogo = document.createElement('div');
    googleLogo.innerHTML = `
        <svg width="28" height="28" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path fill="#EA4335" d="M24 9.5c3.9 0 6.6 1.7 8.1 3.1l6-5.8C34.7 4 29.7 2 24 2 14.7 2 6.9 6.9 3.6 14.3l7.7 6c1.6-4.9 6.7-10.8 12.7-10.8z"/>
          <path fill="#34A853" d="M46.5 24.5c0-1.6-.1-2.8-.4-4H24v8h12.7c-.6 3.5-3.1 6.5-6.7 8l6.3 4.9C43.8 37.7 46.5 31.6 46.5 24.5z"/>
          <path fill="#FBBC05" d="M11.3 29.8c-1.1-3.1-1.1-6.3 0-9.4l-7.7-6C1.1 18.6 0 21.2 0 24s1.1 5.4 3.6 9.1l7.7-3.3z"/>
          <path fill="#4285F4" d="M24 46c6.5 0 11.9-2.1 15.9-5.7l-6.3-4.9c-2.4 1.6-5.4 2.6-9.6 2.6-6 0-11-5.9-12.7-10.8l-7.7 6C6.9 41.1 14.7 46 24 46z"/>
        </svg>
    `;
    googleLogo.style.marginRight = '8px';

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Buscar (mini Google)...';
    Object.assign(input.style, {
        flex: '1',
        padding: '8px 10px',
        borderRadius: '8px',
        border: '1px solid #ddd',
        fontSize: '14px',
        outline: 'none',
    });

    const searchBtn = document.createElement('button');
    searchBtn.textContent = 'Buscar';
    Object.assign(searchBtn.style, {
        marginLeft: '8px',
        padding: '8px 10px',
        borderRadius: '8px',
        border: 'none',
        background: '#4285F4',
        color: 'white',
        cursor: 'pointer',
        fontSize: '14px'
    });

    header.appendChild(googleLogo);
    header.appendChild(input);
    header.appendChild(searchBtn);

    // --------- Body (feed composer + posts) ----------
    const body = document.createElement('div');
    body.style = 'padding:10px;overflow:auto;max-height:calc(70vh - 120px);';

    // Composer
    const composer = document.createElement('div');
    composer.style = 'margin-bottom:10px;';

    const textarea = document.createElement('textarea');
    textarea.placeholder = '¿Qué quieres compartir? (solo local, prueba)...';
    Object.assign(textarea.style, {
        width: '100%',
        minHeight: '60px',
        resize: 'vertical',
        padding: '8px',
        borderRadius: '8px',
        border: '1px solid #ddd',
        fontSize: '14px'
    });

    // Image input and preview
    const imgRow = document.createElement('div');
    imgRow.style = 'display:flex;align-items:center;margin-top:8px;gap:8px;';

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';

    const previewImg = document.createElement('img');
    previewImg.style = 'max-width:84px;max-height:84px;border-radius:8px;display:none;border:1px solid #ccc;object-fit:cover;';

    const publishBtn = document.createElement('button');
    publishBtn.textContent = 'Publicar';
    Object.assign(publishBtn.style, {
        marginLeft: 'auto',
        padding: '8px 12px',
        borderRadius: '8px',
        border: 'none',
        background: '#34A853',
        color: 'white',
        cursor: 'pointer',
        fontSize: '14px'
    });

    imgRow.appendChild(fileInput);
    imgRow.appendChild(previewImg);
    imgRow.appendChild(publishBtn);

    composer.appendChild(textarea);
    composer.appendChild(imgRow);

    // Posts container
    const postsContainer = document.createElement('div');
    postsContainer.id = 'asael-posts-container';

    // Footer with controls
    const footer = document.createElement('div');
    footer.style = 'display:flex;align-items:center;justify-content:space-between;padding:8px;border-top:1px solid #eee;background:#fafafa;';

    const info = document.createElement('div');
    info.textContent = 'Feed local — solo tu lo ves';
    info.style.fontSize = '12px;color:#666';

    const btnsRight = document.createElement('div');
    btnsRight.style.display = 'flex;gap:8px;align-items:center;';

    const clearBtn = document.createElement('button');
    clearBtn.textContent = 'Limpiar feed';
    Object.assign(clearBtn.style, {
        padding: '6px 10px',
        borderRadius: '8px',
        border: '1px solid #ddd',
        background: 'white',
        cursor: 'pointer',
        fontSize: '12px'
    });

    btnsRight.appendChild(clearBtn);
    footer.appendChild(info);
    footer.appendChild(btnsRight);

    body.appendChild(composer);
    body.appendChild(postsContainer);

    container.appendChild(header);
    container.appendChild(body);
    container.appendChild(footer);
    document.body.appendChild(container);

    // --------- Botón flotante (logo Google) ----------
    const floatBtn = document.createElement('button');
    floatBtn.id = 'asael-google-btn';
    floatBtn.title = 'Mini Google + Feed';
    Object.assign(floatBtn.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        border: 'none',
        padding: '6px',
        zIndex: 100001,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 8px 22px rgba(66,133,244,0.25)',
        background: 'white'
    });
    // put the smaller G inside the button
    floatBtn.innerHTML = `<svg width="36" height="36" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path fill="#EA4335" d="M24 9.5c3.9 0 6.6 1.7 8.1 3.1l6-5.8C34.7 4 29.7 2 24 2 14.7 2 6.9 6.9 3.6 14.3l7.7 6c1.6-4.9 6.7-10.8 12.7-10.8z"/>
          <path fill="#34A853" d="M46.5 24.5c0-1.6-.1-2.8-.4-4H24v8h12.7c-.6 3.5-3.1 6.5-6.7 8l6.3 4.9C43.8 37.7 46.5 31.6 46.5 24.5z"/>
          <path fill="#FBBC05" d="M11.3 29.8c-1.1-3.1-1.1-6.3 0-9.4l-7.7-6C1.1 18.6 0 21.2 0 24s1.1 5.4 3.6 9.1l7.7-3.3z"/>
          <path fill="#4285F4" d="M24 46c6.5 0 11.9-2.1 15.9-5.7l-6.3-4.9c-2.4 1.6-5.4 2.6-9.6 2.6-6 0-11-5.9-12.7-10.8l-7.7 6C6.9 41.1 14.7 46 24 46z"/>
        </svg>`;

    document.body.appendChild(floatBtn);

    // Toggle container visibility
    floatBtn.addEventListener('click', () => {
        container.style.display = container.style.display === 'none' ? 'block' : 'none';
        if (container.style.display === 'block') input.focus();
    });

    // ---------- Search behavior ----------
    function doMultiSearch(query) {
        if (!query) return;
        const related = [
            query,
            `${query} información`,
            `${query} imágenes`,
            `${query} videos`,
            `${query} curiosidades`,
            `${query} historia`
        ];
        // Intentamos abrir cada búsqueda en pestañas nuevas.
        related.forEach(q => {
            window.open(`https://www.google.com/search?q=${encodeURIComponent(q)}`, '_blank');
        });
    }

    searchBtn.addEventListener('click', () => {
        const q = input.value.trim();
        doMultiSearch(q);
        input.value = '';
    });
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            doMultiSearch(input.value.trim());
            input.value = '';
        }
    });

    // ---------- Composer behavior ----------
    let selectedImageData = null;
    fileInput.addEventListener('change', (ev) => {
        const f = ev.target.files && ev.target.files[0];
        if (!f) {
            previewImg.style.display = 'none';
            previewImg.src = '';
            selectedImageData = null;
            return;
        }
        const reader = new FileReader();
        reader.onload = function(evt) {
            selectedImageData = evt.target.result; // base64 data URL
            previewImg.src = selectedImageData;
            previewImg.style.display = 'block';
        };
        reader.readAsDataURL(f);
    });

    function renderPosts() {
        postsContainer.innerHTML = '';
        const posts = loadPosts().slice().reverse(); // mostrar el más reciente arriba
        posts.forEach(p => {
            const card = document.createElement('div');
            card.style = 'border:1px solid #eee;padding:8px;border-radius:10px;margin-bottom:8px;background:#fff;';

            const meta = document.createElement('div');
            meta.style = 'font-size:12px;color:#666;margin-bottom:6px;';
            const time = new Date(p.ts).toLocaleString();
            meta.textContent = `Tú • ${time}`;

            const text = document.createElement('div');
            text.style = 'white-space:pre-wrap;margin-bottom:6px;font-size:14px;color:#111;';
            text.textContent = p.text || '';

            card.appendChild(meta);
            if (p.text) card.appendChild(text);
            if (p.img) {
                const im = document.createElement('img');
                im.src = p.img;
                im.style = 'max-width:100%;border-radius:8px;border:1px solid #ddd;display:block;';
                card.appendChild(im);
            }

            postsContainer.appendChild(card);
        });
    }

    publishBtn.addEventListener('click', () => {
        const textVal = textarea.value.trim();
        if (!textVal && !selectedImageData) {
            alert('Escribe algo o selecciona una imagen antes de publicar.');
            return;
        }
        const posts = loadPosts();
        posts.push({
            ts: Date.now(),
            text: textVal,
            img: selectedImageData
        });
        savePosts(posts);
        // reset composer
        textarea.value = '';
        fileInput.value = '';
        previewImg.src = '';
        previewImg.style.display = 'none';
        selectedImageData = null;
        renderPosts();
    });

    clearBtn.addEventListener('click', () => {
        if (!confirm('¿Borrar todo el feed local? Esto lo elimina de la sesión actual.')) return;
        sessionStorage.removeItem(STORAGE_KEY);
        renderPosts();
    });

    // Cerrar el contenedor si el usuario hace clic fuera (y el contenedor está abierto)
    document.addEventListener('click', (e) => {
        if (container.style.display === 'none') return;
        const inside = container.contains(e.target) || floatBtn.contains(e.target);
        if (!inside) {
            container.style.display = 'none';
        }
    });

    // Inicializar UI con posts cargados
    renderPosts();

    // Pequeña mejora: atajo de teclado Ctrl+Shift+M para mostrar/ocultar (opcional)
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'm') {
            container.style.display = container.style.display === 'none' ? 'block' : 'none';
            if (container.style.display === 'block') input.focus();
        }
    });

})();