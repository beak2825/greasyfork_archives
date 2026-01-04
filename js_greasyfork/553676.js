// ==UserScript==
// @name         Autoclick
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Autoclica hechizos
// @author       You
// @match        https://*.grepolis.com/game/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grepolis.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553676/Autoclick.user.js
// @updateURL https://update.greasyfork.org/scripts/553676/Autoclick.meta.js
// ==/UserScript==

(function() {
async function simularClickHumanoAvanzado(elemento) {
    if (!elemento || !document.contains(elemento) || elemento.offsetParent === null) {
        console.warn("⚠️ Elemento no visible o no en DOM.");
        return;
    }

    const delay = (min, max) => new Promise(res => setTimeout(res, Math.random() * (max - min) + min));

    const opts = {
        bubbles: true,
        cancelable: true,
        view: window
    };

    elemento.dispatchEvent(new MouseEvent("mousemove", opts));
    await delay(40, 80);

    elemento.dispatchEvent(new MouseEvent("mouseenter", opts));
    await delay(30, 70);

    elemento.dispatchEvent(new MouseEvent("mouseover", opts));
    await delay(50, 120);

    elemento.dispatchEvent(new MouseEvent("mousedown", opts));
    await delay(70, 150);

    elemento.dispatchEvent(new MouseEvent("mouseup", opts));
    await delay(20, 60);
    elemento.dispatchEvent(new MouseEvent("click", opts));

    console.debug(`🖱️ Clic humano simulado en`, elemento);

    return Promise.resolve();
}
    function start(){
        // Aseguramos que Font Awesome esté cargado
        if (!document.querySelector('#fontawesome')) {
            const fa = document.createElement('link');
            fa.id = 'fontawesome';
            fa.rel = 'stylesheet';
            fa.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
            document.head.appendChild(fa);
        }

        // Seleccionamos todos los "spells"
        const spells = document.querySelectorAll('.spells_dialog .gods_container .power');

        // Guardamos los intervalos para poder detenerlos después
        const autoclickIntervals = new Map();

        spells.forEach(spell => {
            // Creamos el botón
            const btn = document.createElement('button');
            btn.innerHTML = '<i class="fa-solid fa-bolt"></i>'; // icono inicial
            btn.style.cssText = `
    position: absolute;
    top: 3px;
    right: 3px;
    width: 22px;
    height: 22px;
    background: rgba(255, 204, 0, 0.9);
    border: none;
    border-radius: 50%;
    cursor: pointer;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.15s ease, opacity 0.2s ease;
    opacity: 0.5;
  `;

            // Efecto hover
            btn.addEventListener('mouseenter', () => btn.style.opacity = '1');
            btn.addEventListener('mouseleave', () => btn.style.opacity = '0.5');
            btn.addEventListener('mousedown', () => btn.style.transform = 'scale(0.9)');
            btn.addEventListener('mouseup', () => btn.style.transform = 'scale(1)');

            // Aseguramos que el contenedor pueda posicionar elementos absolutos
            spell.style.position = 'relative';
            spell.appendChild(btn);

            // Lógica del autoclick
            btn.addEventListener('click', () => {
                if (autoclickIntervals.has(spell)) {
                    // Si ya está activo, lo paramos
                    clearInterval(autoclickIntervals.get(spell));
                    autoclickIntervals.delete(spell);
                    btn.innerHTML = '<i class="fa-solid fa-bolt"></i>';
                    btn.style.background = 'rgba(255, 204, 0, 0.9)';
                    console.log('AutoClick detenido para', spell.dataset.power_id);
                } else {
                    // Iniciamos el autoclick con intervalos aleatorios (imitando a un humano rápido)
                    const interval = setInterval(() => {
                        spell.click();
                    }, 100 + Math.random() * 50); // 60–100 ms

                    autoclickIntervals.set(spell, interval);
                    btn.innerHTML = '<i class="fa-solid fa-pause"></i>';
                    btn.style.background = 'rgba(255, 85, 85, 0.9)';
                    console.log('AutoClick iniciado para', spell.dataset.power_id);
                }
            });
        });
    }
    uw.$(uw.document).ajaxComplete(function (e, xhr, opt) {
        const parts=(opt.url||'').split('?'); const filename=parts[0]||''; const qs=parts[1]||'';
        if (filename !== '/game/command_info') return;
        const seg = qs.split(/&/)[1] || ''; const action = seg.substr(7);
        if (action == 'god'){
            try{
                start();
            }catch{}
        }
    });

})();