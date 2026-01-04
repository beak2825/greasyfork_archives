// ==UserScript==
// @name         Ajustar ataques
// @namespace    http://tampermonkey.net/
// @version      2.0.8
// @description  Ayuda a ajustar
// @author       You
// @match        https://*.grepolis.com/game/*
// @match        http://*.grepolis.com/game/*
// @exclude      view-source://*
// @exclude      https://classic.grepolis.com/game/*
// @exclude      http://classic.grepolis.com/game/*
// @icon         https://gpes.innogamescdn.com/images/game/res/time.png
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/557457/Ajustar%20ataques.user.js
// @updateURL https://update.greasyfork.org/scripts/557457/Ajustar%20ataques.meta.js
// ==/UserScript==


const uw = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
const playerId = uw.Game?.player_id;
const worldId = uw.Game?.world_id;

let horaAjuste = GM_getValue("horaAjuste" + worldId, 0);
let tmpHora = horaAjuste;
let range = GM_getValue("range" + worldId, 0);
let modifier = GM_getValue("modifier" + worldId, '±');
let daysAdd = GM_getValue("daysAdd" + worldId, 0);


(function hideIndicator() {
    const style = document.createElement("style");
    style.textContent='.sandy-box .item.command{   height: 54px !important;}.indicatorAankomst {	color: rgba(0, 0, 0, 0.5) ;	font-size: xx-small ;   position: relative;   display: flex;   line-height: 0px;}'
    document.head.appendChild(style);
})();

function diaDD(daysOffset = 0, hhmmss = null) {
    const d = new Date();
    const off = parseInt(daysOffset, 10) || 0;

    let extra = 0;
    if (hhmmss) {
        const [hh, mm, ss] = hhmmss.split(":").map(Number);
        const target = new Date();
        target.setHours(hh, mm, ss, 0);
        if (target.getTime() <= d.getTime()) extra = 1;
    }

    d.setDate(d.getDate() + off + extra);
    return String(d.getDate()).padStart(2, "0");
}

function hhmmssToUNIXFuture(hhmmss, daysOffset = 0) {
    const [hh, mm, ss] = hhmmss.split(":").map(Number);

    const now = new Date();
    const target = new Date();

    target.setHours(hh, mm, ss, 0);

    target.setDate(target.getDate() + (parseInt(daysOffset, 10) || 0));

    while (target.getTime() <= now.getTime()) {
        target.setDate(target.getDate() + 1);
    }

    return Math.floor(target.getTime() / 1000);
}

function crearSpinnerNumero(valorInicial, clase, placeholder = "0") {
    const wrapper = document.createElement("div");
    wrapper.className = "sp_attack_month spinner_horizontal js-spinner-month";
    wrapper.style.marginLeft = '5px';
    wrapper.style.marginRight = '5px';

    wrapper.innerHTML = `
    <div class="border_l"></div>
    <div class="border_r"></div>
    <div class="body">
      <input placeholder="${placeholder}" type="text" value="${valorInicial}" tabindex="2" class="${'campo' + clase}">
    </div>
    <div class="button_increase ${'button_increase' + clase}"></div>
    <div class="button_decrease ${'button_decrease' + clase}"></div>
  `;
    return wrapper;
}

function crearSpinner(valorInicial, clase) {
    const wrapper = document.createElement("div");
    wrapper.className = "sp_attack_month spinner_horizontal js-spinner-month";
    wrapper.style.marginLeft = '5px';
    wrapper.style.marginRight = '5px';

    wrapper.innerHTML = `
        <div class="border_l"></div>
        <div class="border_r"></div>
        <div class="body">
            <input id="stage-limit" placeholder="00:00:00" type="text" value="${valorInicial}" tabindex="2" class="${'campo' + clase}">
        </div>
        <div class="button_increase ${'button_increase' + clase}"></div>
        <div class="button_decrease ${'button_decrease' + clase}"></div>
    `;

    return wrapper;
}

function crearBotonDropdownSigno(parentEl, modifier) {
    const btn = document.createElement("div");
    btn.id = "dd_signo";
    btn.className = "dropdown default dd_signo";
    btn.innerHTML = `
    <div class="border-left"></div>
    <div class="border-right"></div>
    <div class="caption">${modifier}&nbsp;</div>
    <div class="initial-message-box js-empty" style="display:none;"></div>
    <div class="arrow"></div>
  `;
    parentEl.appendChild(btn);
    return btn;
}

function crearDropdownSigno(parentEl, modifier) {
    const dd = document.createElement("div");
    dd.className = "dropdown-list default";
    dd.id = "dd_signo_list";
    dd.style.position = "absolute";
    dd.style.visibility = "visible";
    dd.style.display = "none";
    dd.style.zIndex = "2001";
    dd.dataset.value = modifier;

    dd.innerHTML = `
    <div class="item-list">
      <div class="option" data-value="+">+</div>
      <div class="option" data-value="-">-</div>
      <div class="option" data-value="±">±</div>
    </div>
  `;

    dd.querySelectorAll(".option").forEach(opt => {
        if (opt.dataset.value === modifier) opt.classList.add("selected");
    });

    document.body.appendChild(dd);
    return dd;
}

function engancharDropdownSigno(btn, dd, getModifier, setModifier) {
    const caption = btn.querySelector(".caption");

    function open() {
        const r = btn.getBoundingClientRect();
        dd.style.left = `${r.left + window.scrollX}px`;
        dd.style.top = `${r.bottom + window.scrollY + 2}px`; // +2px de separación
        dd.style.width = `${r.width}px`;

        dd.classList.add("active");
        dd.style.display = "block";
    }

    function close() {
        dd.classList.remove("active");
        dd.style.display = "none";
    }

    btn.addEventListener("click", (e) => {
        e.stopPropagation();
        dd.classList.contains("active") ? close() : open();
    });

    dd.addEventListener("click", (e) => {
        const opt = e.target.closest(".option");
        if (!opt) return;

        dd.querySelectorAll(".option").forEach(o => o.classList.remove("selected"));
        opt.classList.add("selected");

        const val = opt.dataset.value;
        setModifier(val);
        dd.dataset.value = val;

        caption.innerHTML = `${val}&nbsp;`; // espacio a la derecha
        close();
    });

    document.addEventListener("click", (e) => {
        if (!dd.classList.contains("active")) return;
        if (btn.contains(e.target) || dd.contains(e.target)) return;
        close();
    });
}

function crearVentanaSettings() {
    let ventana = document.querySelector('.ventana_ajustes');
    if (ventana) return;

    const wnd = uw.Layout.wnd.Create(uw.Layout.wnd.TYPE_DIALOG, "Ajustar Ataque", { width: 330, height: 155 });
    const root = wnd.getElement();
    root.classList.add("ventana_ajustes");

    // --- FILA 1: hh:mm:ss  [dropdown signo]  n segs    GUARDAR
    const row1 = document.createElement("div");
    row1.style.display = "flex";
    row1.style.alignItems = "center";
    row1.style.gap = "6px";

    const spinnerHora = crearSpinner(tmpHora, "_hora");
    const inputHora = spinnerHora.querySelector("input");
    const btnUp = spinnerHora.querySelector(".button_increase_hora");
    const btnDown = spinnerHora.querySelector(".button_decrease_hora");

    const toSec = (t) => {
        const m = /^(\d{2}):(\d{2}):(\d{2})$/.exec(t);
        if (!m) return null;
        const h = +m[1], mi = +m[2], s = +m[3];
        if (h > 23 || mi > 59 || s > 59) return null;
        return h * 3600 + mi * 60 + s;
    };
    const toHHMMSS = (sec) => {
        sec = ((sec % 86400) + 86400) % 86400;
        const h = String(Math.floor(sec / 3600)).padStart(2, "0");
        const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
        const s = String(sec % 60).padStart(2, "0");
        return `${h}:${m}:${s}`;
    };

    btnUp.addEventListener("click", () => {
        const sec = toSec(inputHora.value) ?? 0;
        inputHora.value = toHHMMSS(sec + 1);
    });
    btnDown.addEventListener("click", () => {
        const sec = toSec(inputHora.value) ?? 0;
        inputHora.value = toHHMMSS(sec - 1);
    });

    const btnSigno = crearBotonDropdownSigno(root, modifier);
    const listSigno = crearDropdownSigno(root, modifier);
    engancharDropdownSigno(btnSigno, listSigno, () => modifier, (val) => {
        modifier = val;
        GM_setValue("modifier" + worldId, modifier);
    });

    const spinnerDiff = crearSpinner(range, "_diff");
    spinnerDiff.style.width = "60px";
    const inputDiff = spinnerDiff.querySelector("input");
    const btnUpDiff = spinnerDiff.querySelector(".button_increase_diff");
    const btnDownDiff = spinnerDiff.querySelector(".button_decrease_diff");

    btnUpDiff.addEventListener("click", () => {
        let v = parseInt(inputDiff.value, 10) || 0;
        if (v < 10) inputDiff.value = v + 1;
    });
    btnDownDiff.addEventListener("click", () => {
        let v = parseInt(inputDiff.value, 10) || 0;
        if (v > 0) inputDiff.value = v - 1;
    });

    // Botón Guardar (DOM real, sin insertAdjacentHTML)
    const btnGuardar = document.createElement("div");
    btnGuardar.className = "btn_save_time button_new";
    btnGuardar.style.marginLeft = "auto";
    btnGuardar.innerHTML = `
    <div class="left"></div>
    <div class="right"></div>
    <div class="caption js-caption"><span>Guardar</span><div class="effect js-effect"></div></div>
  `;

    row1.appendChild(spinnerHora);
    row1.appendChild(btnSigno);
    row1.appendChild(spinnerDiff);
    row1.appendChild(btnGuardar);
    root.appendChild(row1);

    // --- FILA 2: + n días
    const row2 = document.createElement("div");
    row2.style.display = "flex";
    row2.style.alignItems = "center";
    row2.style.gap = "6px";
    row2.style.marginTop = "6px";

    const spinnerDias = crearSpinner(daysAdd, "_dias");
    spinnerDias.style.width = "60px";
    const inputDias = spinnerDias.querySelector("input");
    const btnUpDias = spinnerDias.querySelector(".button_increase_dias");
    const btnDownDias = spinnerDias.querySelector(".button_decrease_dias");

    btnUpDias.addEventListener("click", () => {
        let d = parseInt(inputDias.value, 10) || 0;
        if (d < 30) inputDias.value = d + 1;
    });
    btnDownDias.addEventListener("click", () => {
        let d = parseInt(inputDias.value, 10) || 0;
        if (d > 0) inputDias.value = d - 1;
    });

    const labelDias1 = document.createElement("span");
    labelDias1.textContent = "+ ";

    const labelDias2 = document.createElement("span");
    labelDias2.textContent = " días";

    row2.appendChild(labelDias1);
    row2.appendChild(spinnerDias);
    row2.appendChild(labelDias2);
    root.appendChild(row2);

    // hr
    root.appendChild(document.createElement("hr"));

    // --- Fecha guardada...
    const divHoraActual = document.createElement("div");
    divHoraActual.classList.add("divHora");

    if (horaAjuste != 0) {
        divHoraActual.innerHTML = `<p>Fecha guardada: <code><strong>${tmpHora}</strong> ${modifier} ${range} s del día ${diaDD(daysAdd, tmpHora)}</code></p>`;
    } else {
        divHoraActual.innerHTML = `<p>Sin fecha guardada</p>`;
    }
    root.appendChild(divHoraActual);

    // --- Guardar
    btnGuardar.addEventListener("click", () => {
        tmpHora = inputHora.value.trim();
        range = parseInt(inputDiff.value, 10) || 0;
        daysAdd = parseInt(inputDias.value, 10) || 0;

        const ok = /^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/.test(tmpHora);
        if (!ok) {
            divHoraActual.innerHTML = `<p style="color:#c00">Hora inválida. Usa <strong>hh:mm:ss</strong> (00:00:00–23:59:59)</p>`;
            inputHora.focus();
            return;
        }

        GM_setValue("horaAjuste" + worldId, tmpHora);
        GM_setValue("range" + worldId, range);
        GM_setValue("daysAdd" + worldId, daysAdd);

        divHoraActual.innerHTML = `<p>Fecha guardada: <code><strong>${tmpHora}</strong> ${modifier} ${range} s del día ${diaDD(daysAdd, tmpHora)}</code></p>`;
    });
}

function crearBoton(){
    var deletear = document.querySelector('.slide_button_wrapper');
    var contenedor = deletear.parentElement
    contenedor.removeChild(deletear);

    var boton = document.createElement("button");
    boton.class = "botonAjustes";

    var img = document.createElement("img");
    img.src = "https://i.imgur.com/Ebwr9HX.png";
    img.style.width = "120%";
    img.style.height = "auto";

    boton.style.width = "50px";
    boton.style.height = "50px";
    boton.style.padding = "0";
    boton.style.border = "none";
    boton.style.left = "-8px";
    boton.style.background = "none";
    boton.style.cursor = "pointer";
    boton.style.position = 'absolute';
    boton.style.top = '90%';
    boton.style.left = '44%';
    boton.style.transform = 'translate(-50%, -50%)';

    boton.appendChild(img);
    boton.onmouseover = function() {
        img.src = 'https://i.imgur.com/TU1471X.png'
    };
    boton.onmouseout = function() {
        img.src = "https://i.imgur.com/Ebwr9HX.png";

    };
    if (contenedor) {
        contenedor.appendChild(boton);

    } else {
        console.log("El contenedor no fue encontrado");
    }
    boton.addEventListener("click", function(event) {
        crearVentanaSettings();
    });
}

function fillUnits(params, ciudadDestino){
    const data = JSON.parse(params.get("json"));

    const units = Object.fromEntries(
        Object.entries(data)
        .filter(([k]) => !["id", "type", "town_id", "nl_init"].includes(k))
        .map(([k, v]) => [`unit_type_${k}`, v])
    );
    for (let k in units){
        if (k != 'unit_type_heroes'){
            let input = ciudadDestino.querySelector(`.${k}.unit_input.town_info_input`);
            input.value = units[k];
            const event = new Event('change', { bubbles: true });
            input.dispatchEvent(event);
        }
    }


}

function subscribeVisible(selector, cb) {
    let wasVisible = false;
    const isVisible = (el) => el && getComputedStyle(el).display !== "none";

    const tick = () => {
        const el = document.querySelector(selector);
        const visible = isVisible(el);
        if (visible && !wasVisible) { wasVisible = true; cb(el); }
        if (!visible) wasVisible = false;
    };

    tick();

    const obs = new MutationObserver(tick);
    obs.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["style", "class"]
    });

    return obs;
}

function injectHideButtons(toolbarEl) {
    const box = toolbarEl.querySelector(".sandy-box") || toolbarEl;
    const list = toolbarEl.querySelector(".content.js-dropdown-item-list");
    if (!list) return;

    const commands = list.querySelectorAll(".item.command");
    if (!commands.length) return;

    commands.forEach(cmd => {
        if (cmd.querySelector(":scope > .js-hide-command")) return;
        if (getComputedStyle(cmd).position === "static") cmd.style.position = "relative";
        Array.from(cmd.children).forEach(child => {
            if (child.classList.contains("js-hide-command")) return;
            if (!child.dataset.__shift22) {
                if (!child.classList.contains('js-delete')){
                    child.style.transform = "translateX(22px)";
                }
                child.dataset.__shift22 = "1";
            }
        });

        const btn = document.createElement("div");
        btn.className = "js-hide-command";
        btn.title = "Ocultar";
        btn.style.cssText = `
        position:absolute;
        left:4px;
        top:40%;
        transform:translateY(-50%) scale(0.9);
        transform-origin:center;
        width:40px; height:24px;
        cursor:pointer;
        background-image:url(https://gpes.innogamescdn.com/images/game/autogenerated/events/grid_event/gods_gifts/sprite_images_7a29b66.png);
        background-repeat:no-repeat;
        background-position:-545px -331px;
        `;

        btn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            const movement = cmd.closest('[id^="movement_"]') || cmd;
            movement.remove();
        });

        // ✅ primer hijo del row
        cmd.insertBefore(btn, cmd.firstChild);
    });
}

subscribeVisible("#toolbar_activity_commands_list", (el) => {
    injectHideButtons(el);
});


function observeMovements(){
    uw.$(uw.document).ajaxComplete(function (e, xhr, opt) {
        let parts = (opt.url || '').split('?');
        let filename = parts[0] || '';
        let qs = parts[1] || '';
        if (filename !== '/game/town_info') return;

        let seg = qs.split(/&/)[1] || '';
        let action = seg.substr(7);
        if (action == 'send_units'){
            try {
                let res = JSON.parse(xhr.responseText)
                if (res.json.notifications){
                    let notifications = res.json.notifications;
                    for (let notification of notifications){
                        let param = JSON.parse(notification.param_str);
                        if (param.MovementsUnits){
                            let ciudadesDestino = document.querySelectorAll('#town_info-attack')

                            for (let i = 0; i < ciudadesDestino.length; i++){
                                let ciudadDestino = ciudadesDestino[i].parentElement.parentElement.parentElement.parentElement.parentElement;
                                let title = ciudadDestino.querySelector('.ui-dialog-title').innerText
                                if (title == param.MovementsUnits.town_name_destination){

                                    let timestampAjuste = hhmmssToUNIXFuture(tmpHora, daysAdd);

                                    // Get params to repeat request
                                    const params = new URLSearchParams(opt.data);

                                    fillUnits(params, ciudadDestino);

                                    // Get info from movement to check if it's on time
                                    let arrival = param.MovementsUnits.arrival_at;

                                    // Get command id to cancel the movement
                                    let commandId = param.MovementsUnits.command_id;

                                    console.log('ajustado:', arrival == timestampAjuste, arrival, timestampAjuste)
                                    console.log('+: ', modifier != '-', arrival <= (timestampAjuste + range) && arrival > timestampAjuste, '||||', arrival <= (timestampAjuste + range), arrival > timestampAjuste)
                                    console.log('-: ', modifier != '+', arrival >= (timestampAjuste - range) && arrival < timestampAjuste, '||||', arrival >= (timestampAjuste + range), arrival < timestampAjuste)

                                    if ((arrival == timestampAjuste ||
                                         (modifier != '-' && arrival <= (timestampAjuste + range) && arrival > timestampAjuste)||
                                         (modifier != '+' && arrival >= (timestampAjuste - range) && arrival < timestampAjuste))){
                                        let dio = document.querySelector('#dio_plusmenuCommands');
                                        if(dio){
                                            let botonX = dio.querySelector(".dio_plusback");
                                            botonX.style.display = 'block';
                                            botonX.click();
                                        }
                                        else{uw.$('#toolbar_activity_commands_list .cancel').click()}
                                    }/*else{
                                        let commandId = param.MovementsUnits.command_id;

                                        //Cancelar
                                        uw.gpAjax.ajaxPost(
                                            "frontend_bridge",
                                            "execute",
                                            {
                                                model_url: "Commands",
                                                action_name: "cancelCommand",
                                                captcha: null,
                                                arguments:{id:commandId},
                                                town_id: uw.Game.townId,
                                                nl_init: "true"
                                            },
                                        );
                                    }*/
                                }
                            }
                        }
                    }
                }

            } catch (err) {
                console.warn('⚠️ Error al parsear filtros', err);
            }
        }
    });
}

function init(){
    let boton = document.querySelector('.botonAjustes');
    if (!boton){
        crearBoton();
        observeMovements();
    }else{
        setTimeout(init, 50);
    }
}

init();
