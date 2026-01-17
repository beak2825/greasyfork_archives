// ==UserScript==
// @name         Auto Regalo Diario
// @namespace    AutoRegaloDiario
// @version      0.1.1
// @description  Canjea el regalo diario (actualmente solo favor)
// @author       You
// @match        https://*.grepolis.com/game/*
// @icon         https://png.pngtree.com/png-clipart/20250210/original/pngtree-red-gift-box-icon-symbolizing-surprises-and-celebrations-in-a-3d-png-image_20404741.png
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/562773/Auto%20Regalo%20Diario.user.js
// @updateURL https://update.greasyfork.org/scripts/562773/Auto%20Regalo%20Diario.meta.js
// ==/UserScript==


(function () {
    'use strict';

    const uw = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

    let autoFavor = GM_getValue('autoFavor', true);
    let selectedGod = GM_getValue('selected_god', null);;
    let minsToMidnight = GM_getValue('minsToMidnight', 10);
    let secsToMidnight = uw.Timestamp.getSecondsToNextMidnight();
    let timeout = (secsToMidnight - (minsToMidnight*60)) * 1000;

    function getNextGift(){
        const model = uw.MM.getModels().DailyLoginBonus?.[uw.Game.player_id];
        const acceptedAt = model?.attributes?.accepted_at;

        if (typeof acceptedAt === "undefined") {
            setTimeout(getNextGift, 50);
            return;
        }

        const isAvailable = (acceptedAt === null);
        if ((autoFavor === true || selectedGod != null) && isAvailable){
            setTimeout(getGift, Math.max(0, timeout));
        }
    }

    getNextGift()
    // ====== CONFIGURACIÓN POR MENÚ ======
    GM_registerMenuCommand(
        `Elegir modo`,
        () => {
            crearVentanaMenu();
        }
    );

    function crearBoton(texto, funcionClick) {
        let boton = document.createElement('a');
        boton.className = 'button';

        // Crear los spans anidados para replicar la estructura del enlace
        let spanLeft = document.createElement('span');
        spanLeft.className = 'left';

        let spanRight = document.createElement('span');
        spanRight.className = 'right';

        let spanMiddle = document.createElement('span');
        spanMiddle.className = 'middle';
        spanMiddle.textContent = texto;
        spanMiddle.style.color = "#fc6";

        // Anidar los spans correctamente
        spanRight.appendChild(spanMiddle);
        spanLeft.appendChild(spanRight);
        boton.appendChild(spanLeft);

        // Crear un div para contener tanto el botón como el texto
        let divContenedor = document.createElement('div');
        divContenedor.appendChild(boton);

        divContenedor.style.display = 'flex';
        divContenedor.style.justifyContent = 'space-between';
        return divContenedor;
    }

    function getEmoji(){
        let emoji = ' ❌';
        if (autoFavor){
            emoji = ' ✅';
        }
        return emoji
    }

    function crearSpinner(valorInicial, clase) {
        const wrapper = document.createElement("div");
        wrapper.className = "sp_attack_month spinner_horizontal js-spinner-month";
        wrapper.innerHTML = `
        <div class="border_l"></div>
        <div class="border_r"></div>
        <div class="body">
            <input id="stage-limit" placeholder="00" type="text" value="${valorInicial}" tabindex="2" class="${'campo' + clase}">
        </div>
        <div class="button_increase ${'button_increase' + clase}"></div>
        <div class="button_decrease ${'button_decrease' + clase}"></div>
    `;

        return wrapper;
    }

    function buildGodsHtml() {
        const gods = uw.MM.getModels().PlayerGods[uw.Game.player_id].getProductionOverview();
        const order = ["zeus","poseidon","hera","athena","hades","artemis","aphrodite","ares"];

        const items = order
        .filter(k => gods[k])
        .map(k => {
            const favor = Math.floor(Number(gods[k].current || 0));
            const prodN = Number(gods[k].production || 0);
            const prod = prodN.toFixed(1);
            const disabled = prodN <= 0;

            return `
        <div class="god_box" style="display:flex; flex-direction:column; align-items:center; gap:2px; min-width:44px; margin-left:auto; margin-right:auto; ${disabled ? 'opacity:.35;' : ''}">
          <div class="god_favor" style="font-weight:bolder; color:blue; font-size:11px; line-height:12px;">${favor}</div>

          <div class="god_mini ${k} ${disabled ? 'disabled' : ''}"
               data-god="${k}"
               ${disabled ? '' : 'role="button" tabindex="0"'}
               style="${disabled ? 'cursor:not-allowed;' : 'cursor:pointer;'}">
          </div>

          <div class="god_prod" style="font-weight:bolder; font-size:11px; line-height:12px;">+${prod}/h</div>
        </div>
      `;
        })
        .join("");

        return `
    <div id="gods_container_auto_gift" style="display:flex; gap:8px; align-items:flex-end; padding:0 5px;">
      ${items}
    </div>
    <hr>
  `;
    }



    function crearVentanaMenu() {
        // Buscar todos los elementos que podrían contener el título
        const titulos = document.querySelectorAll('.ui-dialog-title');
        let existeVentana = false;

        if (!titulos) {
            existeVentana = false;
        } else {
            for (let i = 0; i < titulos.length; i++) {
                if (titulos[i].textContent.trim() === "Auto Regalo Diario") {
                    existeVentana = true;
                    break;
                }
            }
        }

        if (!existeVentana) {
            /* MENU DE FAVOR */
            let ventana = uw.Layout.wnd.Create(uw.Layout.wnd.TYPE_DIALOG, "Auto Regalo Diario", { width: "600", height: "230" });

            const header = document.createElement('div');
            header.style.display = 'flex';
            header.style.alignItems = 'center';
            header.style.gap = '4px';
            header.style.marginBottom = '10px';

            const h4 = document.createElement('h4');
            h4.textContent = 'FAVOR DIARIO';

            const right = document.createElement('div');
            right.style.marginLeft = 'auto';

            const botonGuardar = crearBoton('Dios automático' + getEmoji());
            right.appendChild(botonGuardar);

            header.appendChild(h4);
            header.appendChild(right);

            ventana.appendContent(header);

            ventana.appendContent(buildGodsHtml());

            const $container = ventana.getJQElement().find('#gods_container_auto_gift');

            $container.on('mouseenter', '.god_mini', function () {
                if (this.classList.contains('disabled')) return;
                uw.$(this).addClass('hovered');
            });

            $container.on('mouseleave', '.god_mini', function () {
                uw.$(this).removeClass('hovered');
            });

            $container.on('click', '.god_mini', function () {
                if (this.classList.contains('disabled')) return;

                const godKey = this.dataset.god;
                selectedGod = godKey;

                $container.find('.god_mini').removeClass('selected');
                uw.$(this).addClass('selected');

                GM_setValue('selected_god', selectedGod);

                autoFavor = false;
                GM_setValue('autoFavor', autoFavor);

                botonGuardar.querySelector('.middle').innerText = 'Dios automático' + getEmoji();
            });


            botonGuardar.addEventListener('click', function(){
                autoFavor = !autoFavor;
                GM_setValue('autoFavor', autoFavor);

                botonGuardar.querySelector('.middle').innerText = 'Dios automático' + getEmoji();

                $container.find('.god_mini').removeClass('selected');
                selectedGod = null;
                GM_setValue('selected_god', selectedGod);
            });

            if (selectedGod) {
                $container.find(`.god_mini[data-god="${selectedGod}"]`).addClass('selected');
            }

            // --- MENÚ DE AJUSTES ---
            const footer = document.createElement('div');
            footer.style.display = 'flex';
            footer.style.alignItems = 'center';
            footer.style.gap = '6px';
            footer.style.marginTop = '10px';

            footer.innerHTML = '<span>Minutos antes de medianoche:</span>';

            const spinner = crearSpinner(minsToMidnight, '_mins');
            footer.appendChild(spinner);
            ventana.appendContent(footer);

            const inputMins = spinner.querySelector("input");
            const btnUp = spinner.querySelector(".button_increase_mins");
            const btnDown = spinner.querySelector(".button_decrease_mins");
            inputMins.addEventListener('input', () => {
                minsToMidnight = Math.max(0, Math.min(9999, Number(inputMins.value) || 0));
                inputMins.value = parseInt(minsToMidnight);
                GM_setValue('minsToMidnight', minsToMidnight);
            });

            btnUp.addEventListener("click", () => {
                inputMins.value = parseInt(minsToMidnight) + 1;
                minsToMidnight = parseInt(inputMins.value);
                GM_setValue('minsToMidnight', minsToMidnight);

            });
            btnDown.addEventListener("click", () => {
                inputMins.value = parseInt(minsToMidnight) - 1;
                minsToMidnight = parseInt(inputMins.value);
                GM_setValue('minsToMidnight', minsToMidnight);

            });
            // Botón Guardar (recarga / F5)
            const btnGuardarWrap = crearBoton('Guardar minutos');
            btnGuardarWrap.style.marginLeft = 'auto'; // lo manda a la derecha en el flex del footer
            footer.appendChild(btnGuardarWrap);

            btnGuardarWrap.querySelector('a.button').addEventListener('click', (e) => {
                e.preventDefault();
                location.reload(); // F5
            });

        }
    }


    /* Funciones de autofavor */
    function getTargetGod(){
        const gods = uw.MM.getModels().PlayerGods[uw.Game.player_id].getProductionOverview();

        let targetGod = {
            current: 999,
            production: 0,
            god: "none"
        };

        if (autoFavor){
            for (let god in gods){
                if (gods[god].current < targetGod.current && gods[god].production > 0){
                    targetGod = gods[god]
                }
            }
        }
        return targetGod;
    }


    function getTownWithGod(targetGod){
        let townId;
        if (targetGod.production != 0){
            const towns = uw.MM.getModels().Town
            for (let town in towns){
                if (towns[town].getGod() == targetGod.god.toLowerCase()){
                    townId = towns[town].id;
                    break;
                }
            }
        }else{
            townId = null;
        }

        return townId;
    }

    function getTownId(){

        let targetGod = selectedGod;

        if (autoFavor){
            targetGod = getTargetGod();
        }

        const townId = getTownWithGod(targetGod);

        return townId;
    }

    function getGift(){
        const modelUrl = `DailyLoginBonus/${uw.Game.player_id}`;
        const townId = getTownId();

        uw.gpAjax.ajaxPost(
            "frontend_bridge",
            "execute",
            {
                model_url: modelUrl,
                action_name: "accept",
                captcha: null,
                arguments:{option:1},
                town_id: townId,
                nl_init: "true"
            },
        );

    }
    uw.$('head').append(`
  <style>
    #gods_container_auto_gift .god_mini { cursor: pointer; }
    #gods_container_auto_gift .god_mini.hovered { filter: brightness(1.35); }
    #gods_container_auto_gift .god_mini.selected { outline: 3px solid blue; border-radius: 50%; }
  </style>
`);
}());
