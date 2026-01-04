// ==UserScript==
// @name         POS快捷键+数量+图片 (Español + Fixes v5.9.3)
// @namespace    playbox-electronics
// @version      5.9.3-ES
// @description  Basado en v5.9.2: Soluciona atajos en búsqueda, vista previa perfecta, contador de cantidad con filtros. F3 abre descuento clásico. Evita que el POS entre en suspensión (Anti-Sleep).
// @author       Playbox & Gemini
// @match        *://*.odoo.com/pos/*
// @match        *://*/pos/*
// @match        *://*/point_of_sale/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557677/POS%E5%BF%AB%E6%8D%B7%E9%94%AE%2B%E6%95%B0%E9%87%8F%2B%E5%9B%BE%E7%89%87%20%28Espa%C3%B1ol%20%2B%20Fixes%20v593%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557677/POS%E5%BF%AB%E6%8D%B7%E9%94%AE%2B%E6%95%B0%E9%87%8F%2B%E5%9B%BE%E7%89%87%20%28Espa%C3%B1ol%20%2B%20Fixes%20v593%29.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // ==========================================
    // 0. Configuración Global
    // ==========================================
    const PREVIEW_DELAY = 300; // Retraso vista previa (ms)

    // ==========================================
    // 1. Estilos y UI
    // ==========================================
    const style = document.createElement("style");
    style.textContent = `
        .category-list { height: 150px !important; border-bottom: 2px solid #9f9f9f40 !important; overflow-y: auto; }

        /* Contenedor Vista Previa */
        #pos-img-overlay {
            position: fixed; right: 20px; bottom: 20px; z-index: 999999;
            background: #fff; padding: 8px; border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3); pointer-events: none;
            opacity: 0; transform: translateY(20px) scale(0.95);
            transition: opacity 0.25s ease-out, transform 0.25s cubic-bezier(0.18, 0.89, 0.32, 1.28);
        }
        #pos-img-overlay.visible { opacity: 1; transform: translateY(0) scale(1); }

        /* Imagen */
        #pos-img-overlay img {
            display: block; border-radius: 8px; object-fit: contain;
            background: #f8f9fa;
            opacity: 0;
            transition: opacity 0.2s ease-in;
        }
        #pos-img-overlay img.loaded { opacity: 1; }

        /* Burbuja de Notificación (Toast) */
        #pos-tip-box {
            position: fixed; top: 20px; right: 20px; background: rgba(0,0,0,0.85); color: #fff;
            padding: 10px 16px; border-radius: 8px; font-size: 16px; z-index: 99999;
            transition: opacity 0.5s; opacity: 0; pointer-events: none;
        }
    `;
    document.head.appendChild(style);

    let tipTimer;
    function showTip(msg) {
        if (!GM_getValue("showTips", true)) return;
        let tip = document.getElementById("pos-tip-box");
        if (!tip) {
            tip = document.createElement("div");
            tip.id = "pos-tip-box";
            document.body.appendChild(tip);
        }
        tip.innerText = msg;
        tip.style.opacity = "1";
        clearTimeout(tipTimer);
        tipTimer = setTimeout(() => { tip.style.opacity = "0"; }, 2000);
    }

    function clickInModal(selector, label) {
        const modal = document.querySelector(".modal, .modal-dialog, .modal-body, .popup");
        if (modal) {
            const btn = modal.querySelector(selector)?.closest("button");
            if (btn) { btn.click(); showTip(`✅ Clic en «${label}»`); }
            else {
                const close = modal.querySelector('button.btn-close[aria-label="Cerrar"], .button.cancel');
                if (close) { close.click(); showTip(`⚠️ No encontrado, cerrando ventana`); }
            }
            return;
        }
        const more = document.querySelector("button.more-btn");
        if (more) {
            more.click();
            let count = 0;
            const t = setInterval(() => {
                const m = document.querySelector(".modal, .modal-dialog, .modal-body, .popup");
                if (!m) return;
                const b = m.querySelector(selector)?.closest("button");
                const c = m.querySelector('button.btn-close[aria-label="Cerrar"], .button.cancel');
                if (b) { b.click(); showTip(`✅ Clic en «${label}»`); clearInterval(t); }
                else if (c && ++count > 5) { c.click(); clearInterval(t); }
            }, 200);
            setTimeout(() => clearInterval(t), 2000);
        }
    }

    // ==========================================
    // 2. Módulo: Corrección de Búsqueda (Input Fix)
    // ==========================================
    const SearchFix = {
        init: () => {
            if (GM_getValue("enable_search_fix", true) === false) return;

            const attach = (input) => {
                if (input.dataset.posFix) return;

                // Si el input está dentro de un modal, NO tocarlo (ej. entrada de efectivo)
                if (input.closest('.modal, .modal-dialog, .popup, .popups')) return;

                let manual = false;
                input.addEventListener('input', (e) => {
                    if (manual) { manual = false; return; }
                    e.stopImmediatePropagation(); e.stopPropagation();
                }, true);

                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        // Si hay un modal abierto, no interceptar Enter
                        if (document.querySelector(".modal-content, .popup")) return;

                        manual = true;
                        input.dispatchEvent(new Event('input', { bubbles: true }));
                        input.dispatchEvent(new Event('change', { bubbles: true }));
                        input.blur(); setTimeout(() => input.focus(), 10);
                    }
                }, true);

                input.dataset.posFix = "true";
            };

            const obs = new MutationObserver(() => {
                const inputs = document.querySelectorAll('.pos-search-bar input, .search-box input, .input-container input.o_input');
                inputs.forEach(attach);
            });
            obs.observe(document.body, { childList: true, subtree: true });
        }
    };

    // ==========================================
    // 3. Módulo: Vista Previa de Imágenes (Sin parpadeo)
    // ==========================================
    const ImagePreview = {
        init: () => {
            let overlay, img, timer;
            const getSize = () => ({ normal: [420,300], large: [640,480], xlarge: [800,600] }[GM_getValue("imageSize", "large")] || [640,480]);

            const create = () => {
                if (overlay) return;
                overlay = document.createElement("div"); overlay.id = "pos-img-overlay";
                img = document.createElement("img"); overlay.appendChild(img);
                document.body.appendChild(overlay);
            };

            const show = (el) => {
                const i = el.querySelector("img");
                if (!i) return;
                create();

                // Resetear estado para evitar imagen anterior (Ghosting fix)
                img.classList.remove("loaded");
                img.style.opacity = "0";
                img.src = "";

                const [w, h] = getSize();
                const newSrc = i.src.replace(/image_\d+/, "image_1024");
                Object.assign(img.style, { maxWidth: w+"px", maxHeight: h+"px" });

                img.onload = () => {
                    img.style.opacity = "";
                    img.classList.add("loaded");
                };

                img.src = newSrc;
                requestAnimationFrame(() => overlay.classList.add("visible"));
            };

            document.addEventListener("mouseover", (e) => {
                if (!GM_getValue("imagePreview", true)) return;
                const el = e.target.closest(".product-img, article.product");
                clearTimeout(timer);
                if (el) timer = setTimeout(() => show(el), PREVIEW_DELAY);
                else if (overlay) overlay.classList.remove("visible");
            }, true);

            document.addEventListener("mouseout", (e) => {
                if (e.target.closest(".product-img, article.product")) {
                    clearTimeout(timer);
                    if (overlay) overlay.classList.remove("visible");
                }
            }, true);
        }
    };

    // ==========================================
    // 4. Módulo: Contador de Cantidad (Con Filtro)
    // ==========================================
    const QtyCounter = {
        init: () => {
            let lastSum = null;
            // 🚫 Lista negra: Si el nombre contiene esto, NO se suma
            const BLACKLIST = ["CORTESÍA", "税费", "IMPUESTO", "DESCUENTO", "GUIA", "折扣"];

            setInterval(() => {
                const container = [...document.querySelectorAll(".order-container")].find(c => getComputedStyle(c).display !== 'none');
                if (!container) {
                    const s = document.getElementById("pos-total-qty");
                    if(s) s.textContent = "Cant: ...";
                    return;
                }

                let sum = 0;
                // Recorrer cada línea para validar nombre
                container.querySelectorAll(".orderline").forEach(line => {
                    const nameEl = line.querySelector(".product-name");
                    const qtyEl = line.querySelector(".qty");

                    if (nameEl && qtyEl) {
                        const name = nameEl.textContent.toUpperCase();
                        // Lógica de filtrado
                        const isIgnored = BLACKLIST.some(k => name.includes(k));

                        if (!isIgnored) {
                            sum += parseFloat(qtyEl.textContent.trim().replace(",", ".")) || 0;
                        }
                    }
                });

                if (sum !== lastSum) {
                    const totalEl = document.querySelector(".order-summary .total");
                    if (totalEl) {
                        let label = document.getElementById("pos-total-qty");
                        if (!label) {
                            label = document.createElement("span");
                            label.id = "pos-total-qty";
                            label.style.cssText = "margin-right: 10px; color: #007bff; font-weight: bold;";
                            totalEl.parentNode.insertBefore(label, totalEl);
                        }
                        label.textContent = `Cant: ${sum}`;
                    }
                    lastSum = sum;
                }
            }, 300);
        }
    };

    // ==========================================
    // 5. Atajos de Teclado (Lógica Principal)
    // ==========================================
    document.addEventListener("keydown", (e) => {
        const k = e.key;
        const isInput = e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA";

        // 1. Prioridad Modal: Si hay modal, Enter siempre confirma
        if (k === "Enter") {
            const modalContent = document.querySelector(".modal-content, .popup");
            if (modalContent) {
                const confirmBtn = modalContent.querySelector(".btn-primary, .button.confirm");
                if (confirmBtn && !confirmBtn.disabled && !confirmBtn.classList.contains("disabled")) {
                    e.preventDefault(); e.stopPropagation();
                    confirmBtn.click();
                    return;
                }
            }
        }

        // 2. Protección de Input: Evitar atajos mientras se escribe
        if (isInput) {
            // Permitir Enter, Escape y Teclas F
            if (k !== "Enter" && k !== "Escape" && !k.startsWith("F")) {
                return;
            }
        }

        // Bloquear F1-F10 por defecto
        if (["F1","F2","F3","F4","F6","F7","F8","F9","F10"].includes(k)) e.preventDefault();

        const href = window.location.href;
        const inProduct = href.includes("/product") || !href.includes("/payment");
        const inPayment = href.includes("/payment");

        if (inProduct) {
            if (k === "F1" && GM_getValue("enable_F1", true)) { const b = document.querySelector(".pay-order-button"); if(b) b.click(); }
            if (k === "F2" && GM_getValue("enable_F2", true)) clickInModal('i[aria-label="Información del producto"], i[title="Información del producto"]', "Info Producto");

            // ✅ F3: Lógica clásica v4.8.3 (Solo abrir descuento)
            if (k === "F3" && GM_getValue("enable_F3", true)) clickInModal("button.js_discount i.fa-tag", "Descuento");

            if (k === "F4" && GM_getValue("enable_F4", true)) clickInModal('i[aria-label="Configurar orden de venta"]', "Cotización/Pedido");
            if (k === "F6" && GM_getValue("enable_F6", true)) clickInModal('i[aria-label="Lista de precios"]', "Lista de precios");
            if (k === "F7" && GM_getValue("enable_F7", true)) clickInModal(".fa-trash", "Cancelar");
            if (k === "F8" && GM_getValue("enable_F8", true)) { const b = document.querySelector(".numpad-qty"); if(b) {b.click(); showTip("🔢 Cantidad");} }
            if (k === "F9" && GM_getValue("enable_F9", true)) { const b = document.querySelector(".numpad-price"); if(b) {b.click(); showTip("💲 Precio");} }
            if (k === "F10" && GM_getValue("enable_F10", true)) { const b = document.querySelector(".list-plus-btn"); if(b) {b.click(); showTip("🛒 Nueva Orden");} }

            if (k === "Enter" && GM_getValue("enable_Enter", true)) {
                if (document.querySelector(".modal, .popup")) return; // Doble protección
                const b = document.querySelector("button.o-default-button");
                if(b) { b.click(); showTip("✅ Agregar"); }
            }
        }

        if (inPayment) {
            if (k === "Enter" && GM_getValue("enable_Enter", true)) { const b = document.querySelector(".validation-button"); if(b) b.click(); }
            if (k === "Escape" && GM_getValue("enable_Escape", true)) { const b = document.querySelector(".back-button"); if(b) b.click(); }
        }

        if (k === "Escape" && GM_getValue("enable_Escape", true)) {
            const close = document.querySelector(".modal .btn-close, .modal .cancel, .modal .close, .popup .cancel");
            if (close) { close.click(); showTip("❎ Cerrar Ventana"); }
        }

    }, true);

    // ==========================================
    // 6. Módulo: Anti-Sleep (Evitar Suspensión)
    // ==========================================
    const AntiSleep = {
        init: () => {
            if (!GM_getValue("enable_anti_sleep", true)) return;

            // Simular evento de ratón cada 60 segundos
            setInterval(() => {
                // FIX: No incluir 'view': window para evitar errores de Proxy
                const event = new MouseEvent('mousemove', {
                    'bubbles': true,
                    'cancelable': true,
                    'clientX': 1,
                    'clientY': 1
                });
                document.body.dispatchEvent(event);
                window.dispatchEvent(event);
            }, 60000);
        }
    };

    // ==========================================
    // 7. Menú Tampermonkey (Español)
    // ==========================================
    let menuIds = [];
    function refreshMenu() {
        menuIds.forEach(GM_unregisterMenuCommand);
        menuIds = [];

        const addToggle = (key, name) => {
            const v = GM_getValue(key, true);
            menuIds.push(GM_registerMenuCommand(`${v?"✅":"❌"} ${name}`, () => {
                GM_setValue(key, !v); showTip(`${name} ${!v?"Activado":"Desactivado"}`); refreshMenu();
            }));
        };

        addToggle("enable_anti_sleep", "🛡️ Modo Anti-Suspensión"); // 🔥 Nuevo en Español
        addToggle("enable_search_fix", "Corrección Búsqueda (Anti-Lag)");
        addToggle("showTips", "Mostrar Burbujas");
        addToggle("imagePreview", "Vista Previa Imágenes");

        const sz = GM_getValue("imageSize", "large");
        const label = {normal:"Normal",large:"Grande",xlarge:"Extra Grande"}[sz];
        menuIds.push(GM_registerMenuCommand(`🖼️ Tamaño Img: ${label}`, () => {
            const map = ["normal","large","xlarge"];
            const next = map[(map.indexOf(sz)+1)%3];
            GM_setValue("imageSize", next); showTip(`Tamaño: ${next}`); refreshMenu();
        }));

        ["F1","F2","F3","F4","F6","F7","F8","F9","F10","Enter","Escape"].forEach(k => {
            const desc = {F1:"Cobrar",F2:"Info",F3:"Desc.",F4:"Cotiz.",F6:"Precios",F7:"Cancelar",F8:"Cant",F9:"Precio",F10:"Nuevo",Enter:"Confirmar",Escape:"Volver"}[k];
            const v = GM_getValue(`enable_${k}`, true);
            menuIds.push(GM_registerMenuCommand(`${v?"✅":"❌"} ${k} ${desc}`, () => {
                GM_setValue(`enable_${k}`, !v); showTip(`${k} ${!v?"Activado":"Desactivado"}`); refreshMenu();
            }));
        });
    }

    refreshMenu();
    SearchFix.init();
    ImagePreview.init();
    QtyCounter.init();
    AntiSleep.init(); // 🔥 Iniciar Anti-Sleep
    console.log("🚀 Odoo POS Enhanced v5.9.3-ES Loaded");

})();