// ==UserScript==
// @name         Promiedos-Simulator
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Simulador de partidos de Promiedos.
// @author       Duszafir
// @match        https://www.promiedos.com.ar/league/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=promiedos.com.ar
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563823/Promiedos-Simulator.user.js
// @updateURL https://update.greasyfork.org/scripts/563823/Promiedos-Simulator.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let zonasInfo, id, key,data, equipos, fechasInfo, bloque;
    const avisoKey = 'avisoSimuladorVisto';
    if (!localStorage.getItem(avisoKey)) {
        mostrarAviso();
    }

    function mostrarAviso() {
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = 0;
        modal.style.left = 0;
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.background = 'rgba(0,0,0,0.5)';
        modal.style.display = 'flex';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';
        modal.style.zIndex = 9999;

        const box = document.createElement('div');
        box.style.background = '#237714';
        box.style.padding = '20px';
        box.style.borderRadius = '8px';
        box.style.textAlign = 'center';
        box.style.maxWidth = '300px';

        box.innerHTML = `
            <p>Espera a que carguen todas las fechas para poder simular.</p>
        `;

        const checkContainer = document.createElement('label');
        checkContainer.style.display = 'flex';
        checkContainer.style.alignItems = 'center';
        checkContainer.style.justifyContent = 'center';
        checkContainer.style.marginTop = '10px';
        checkContainer.style.color = '#fff';
        checkContainer.style.cursor = 'pointer';

        const check = document.createElement('input');
        check.type = 'checkbox';
        check.style.marginRight = '8px';

        checkContainer.appendChild(check);
        checkContainer.appendChild(document.createTextNode('No volver a mostrar'));

        const btn = document.createElement('button');
        btn.textContent = 'Entendido';
        btn.style.padding = '6px 12px';
        btn.style.border = 'none';
        btn.style.borderRadius = '6px';
        btn.style.background = '#0f481c';
        btn.style.color = '#fff';
        btn.style.cursor = 'pointer';
        btn.style.marginTop = '10px';

        btn.addEventListener('mouseenter', () => {
            btn.style.background = '#0c3a16';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.background = '#0f481c';
        });

        btn.addEventListener('click', () => {
            if (check.checked) {
                localStorage.setItem(avisoKey, 'true');
            }
            document.body.removeChild(modal);
        });

        box.appendChild(checkContainer);
        box.appendChild(btn);
        modal.appendChild(box);
        document.body.appendChild(modal);
    }

    async function cargarDatos(el) {
        data = JSON.parse(el.textContent);

        id = data.props.pageProps.data.league.id;
        const filters = data.props.pageProps.data.games?.filters;
        zonasInfo = data.props.pageProps.data.tables_groups;

        if (!filters || !filters[1] || !filters[1].key || !zonasInfo || zonasInfo.length == 0) {
            console.error("No se pudo obtener la key de las fechas");
            console.log("Filters recibidos:", filters);
            alert("No se puede simular.")
            return;
        }
        key = filters[1].key;
        equipos = crearEquipos();
        fechasInfo = await verFechas(filters);
    }

    function crearEquipos() {
        let grupos = [];

        for (let group of zonasInfo) {
            let grupo = {
                nombre: group.name,
                zonas: []
            };

            for (let table of group.tables) {
                let zona = {
                    nombre: table.name,
                    equipos: []
                };

                for (let row of table.table.rows) {
                    let perdidos = parseInt(row.values[6]?.value);
                    if (isNaN(perdidos)) perdidos = 0; 

                    zona.equipos.push({
                        nombre: row.entity.object.name,
                        shortName: row.entity.object.short_name,
                        partidos: parseInt(row.values[0].value),
                        goles: parseInt(row.values[1].value),
                        difGoles: parseInt(row.values[2].value),
                        puntos: parseInt(row.values[3].value),
                        ganados: parseInt(row.values[4].value),
                        empates: parseInt(row.values[5].value),
                        perdidos: perdidos,
                        positionOriginal: row.num
                    });

                }
                grupo.zonas.push(zona);
            }
            grupos.push(grupo);
        }
        return grupos;
    }

    function buscarEquipo(nombreEquipo, tabla) {
        for (let z = 0; z < equipos[tabla].zonas.length; z++) {
            for (let eq of equipos[tabla].zonas[z].equipos) {
                if (eq.nombre === nombreEquipo || eq.shortName === nombreEquipo) {
                    return {
                        equipo: eq,
                        indiceZona: z,
                        indiceTabla: tabla
                    };
                }
            }
        }
        return null;
    }

    function filterEsDeFechas(filter) {return /fecha/i.test(filter.name);}

    async function verFechas(filters) {
        let fechasInfo = [];
        let tabla = 0;
        const basesProbadas = new Set();

        for (let f of filters) {
            if (!filterEsDeFechas(f)) continue;

            const base = f.key.replace(/_\d+$/, "");

            if (basesProbadas.has(base)) continue;
            basesProbadas.add(base);

            let fechas = [];
            let n = 1;

            while (n <= 45) {
                const keyActual = `${base}_${n}`;
                const url = `https://api.promiedos.com.ar/league/games/${id}/${keyActual}`;

                try {
                    const res = await fetch(url);
                    if (!res.ok) break;

                    const data = await res.json();
                    if (!data.games || data.games.length === 0) break;

                    fechas.push({
                        fecha: n,
                        tabla: tabla,
                        base: base,
                        partidos: data.games.map(p => ({
                            id: p.id,
                            teamA: p.teams[0],
                            teamB: p.teams[1],
                            winner: p.winner,
                            scores: p.scores,
                            alreadyPlayed: "scores" in p
                        }))
                    });

                    n++;
                } catch {
                    break;
                }
            }

            if (fechas.length > 0) {
                fechasInfo.push(...fechas);
                tabla++;
            }
        }

        if (fechasInfo.length === 0) {
            alert("No se encontraron fechas disponibles para simular.");
        }

        return fechasInfo;
    }

    window.simular = function (idFecha, num1, num2, tabla) {
        if (isNaN(num1) || isNaN(num2) || num1 < 0 || num2 < 0) {
            console.log("Pusiste mal los numeros");
            return;
        }

        let partidoEncontrado = null;

        for (let f of fechasInfo) {
            for (let p of f.partidos) {
                if (p.id === idFecha) {
                    partidoEncontrado = p;
                    break;
                }
            }
            if (partidoEncontrado) break;
        }

        if (!partidoEncontrado) {
            console.log("Ese partido no existe");
            return;
        }

        const resA = buscarEquipo(partidoEncontrado.teamA.name, tabla);
        const resB = buscarEquipo(partidoEncontrado.teamB.name, tabla);

        if (!resA || !resB) {
            console.log("No se encontraron los equipos");
            return;
        }

        const equipoA = resA.equipo;
        const equipoB = resB.equipo;

        const resultadoActual = obtenerResultadoActual(partidoEncontrado);
        if (resultadoActual) {
            revertirPartido(equipoA, equipoB, resultadoActual);
        }

        partidoEncontrado.prev = {
            golesA: num1,
            golesB: num2
        };

        if (num1 > num2) {
            completarDatos(equipoA, "w", num1, num2);
            completarDatos(equipoB, "l", num2, num1);
            partidoEncontrado.winner = 1;
        } else if (num1 < num2) {
            completarDatos(equipoA, "l", num1, num2);
            completarDatos(equipoB, "w", num2, num1);
            partidoEncontrado.winner = 2;
        } else {
            completarDatos(equipoA, "t", num1, num2);
            completarDatos(equipoB, "t", num2, num1);
            partidoEncontrado.winner = 0;
        }

        partidoEncontrado.alreadyPlayed = true;
        const zonasActualizar = new Set([resA.indiceZona, resB.indiceZona]);
        console.log(resA.indiceZona, resB.indiceZona);
        zonasActualizar.forEach(indiceZona => ordenarTablas(indiceZona, tabla));
    };

    function ordenarTablas(indiceZona, tabla) {
        const tablaContainer = document.querySelector('div[class^=page-layout_dashboard__layout_left__]');
        console.log(tablaContainer);
        const tablas = tablaContainer.children[tabla].children[indiceZona+1].children[1].children[0].children[0].children[1];
        if (!tablas) return;

        const filasOriginales = Array.from(tablas.children).map(f => {
            return {
                fila: f,
                color: f.children[0].style.backgroundColor
            };
        });

        const zona = equipos[tabla].zonas[indiceZona];  
        if (!zona) return;

        zona.equipos.sort((a, b) => {
            if (b.puntos !== a.puntos) return b.puntos - a.puntos;
            if (b.difGoles !== a.difGoles) return b.difGoles - a.difGoles;
            if (b.goles !== a.goles) return b.goles - a.goles;
            return a.nombre.localeCompare(b.nombre);
        });

        tablas.innerHTML = "";

        let posicion = 1;
        for (let eq of zona.equipos) {
            const filaData = filasOriginales.find(f => {
                const nombre = f.fila.children[1].children[0].children[1].textContent.trim();
                return nombre === eq.shortName || nombre === eq.nombre;
            });
            if (!filaData) continue;

            const fila = filaData.fila;
            const colorPosicion = filasOriginales[posicion - 1]?.color || "";
            fila.children[0].style.backgroundColor = colorPosicion;

            const eqDifGol = eq.goles - eq.difGoles;
            fila.children[0].children[0].textContent = posicion;
            fila.children[2].textContent = eq.puntos;
            fila.children[3].textContent = eq.partidos;
            fila.children[4].textContent = `${eq.goles}:${eqDifGol}`;
            fila.children[5].textContent = eq.difGoles;
            fila.children[6].textContent = eq.ganados;
            fila.children[7].textContent = eq.empates;
            fila.children[8].textContent = eq.perdidos;

            tablas.appendChild(fila);
            posicion++;
        }
    }

    function obtenerResultadoActual(partido) {
        if (partido.prev) {
            return partido.prev;
        }

        if (partido.alreadyPlayed && partido.scores) {
            return {
                golesA: partido.scores[0],
                golesB: partido.scores[1]
            };
        }

        return null;
    }

    function revertirPartido(eA, eB, prev) {
        eA.partidos--;
        eB.partidos--;

        eA.goles -= prev.golesA;
        eB.goles -= prev.golesB;

        eA.difGoles -= (prev.golesA - prev.golesB);
        eB.difGoles -= (prev.golesB - prev.golesA);

        if (prev.golesA > prev.golesB) {
            eA.puntos -= 3;
            eA.ganados--;
            eB.perdidos--;
        } else if (prev.golesA < prev.golesB) {
            eB.puntos -= 3;
            eB.ganados--;
            eA.perdidos--;
        } else {
            eA.puntos--;
            eB.puntos--;
            eA.empates--;
            eB.empates--;
        }
    }

    function completarDatos(equipo, resul, goles, golesE) {
        equipo.partidos++;
        equipo.goles += goles;
        equipo.difGoles += goles - golesE;

        if (resul === "w") {
            equipo.puntos += 3;
            equipo.ganados++;
        } else if (resul === "l") {
            equipo.perdidos++;
        } else {
            equipo.puntos++;
            equipo.empates++;
        }
    }

    window.onload = () => {
        const resulContainer = document.querySelector(".item-event__content");
        const btnCol = document.createElement("div");
        const fechaActual = getFechaActual();
        if (!resulContainer || !fechaActual) return;
        layout();
    }

    function getFechaActual() {
        const filtersS = data.props.pageProps.data.games?.filters;
        if (!filtersS) return null;

        const selectedFilter = filtersS.find(f => f.selected);
        return selectedFilter || null;
    }

    function layout() {
        const mainBlock = document.querySelector('div[class^=page-layout_dashboard__layout_right__]')
        const mainBlockL = document.querySelector('div[class^=page-layout_dashboard__layout_left__]')
        const theMainBlock = document.querySelector('div[class^=main-block__container]')
        mainBlock.style.width = "100%"
        mainBlockL.style.width = "100%"
        theMainBlock.style.maxWidth = "1400px"
    }

    function crearBloque(resulContainer, btnCol) {
        const block = resulContainer.parentElement.parentElement.parentElement;
        bloque = document.createElement("div");
        bloque.className = "bloque";
        bloque.style.display = "grid";
        bloque.style.gridTemplateColumns = "1fr auto";
        bloque.style.columnGap = "6px";
        bloque.style.width = "410px"
        ajustarBloque(bloque)

        block.parentNode.insertBefore(bloque, block);
        bloque.appendChild(block);

        btnCol.style.display = "flex";
        btnCol.style.flexDirection = "column";
        btnCol.style.gap = "2px";

        const offsetTop =
            resulContainer.getBoundingClientRect().top -
            block.getBoundingClientRect().top;

        btnCol.style.marginTop = `${offsetTop}px`;

        bloque.appendChild(btnCol);
    }

    function crearBotones(resulContainer, btnCol, fechaActual, tabla) {
        let resul;
        const links = resulContainer.querySelectorAll("a");

        links.forEach((a, i) => {
            const partido = fechaActual[i];
            if (!partido) return;

            let num1 = null;
            let num2 = null;

            const btn = document.createElement("button");
            btn.className = "simulador-btn";
            btn.textContent = "Simular";

            btn.style.padding = "2px 6px";
            btn.style.borderRadius = "6px";
            btn.style.border = "none";
            btn.style.background = "#17712c";
            btn.style.color = "#fff";
            btn.style.cursor = "pointer";
            btn.style.height = "36.81px";

            btn.addEventListener("mouseenter", () => btn.style.background = "#11501f");
            btn.addEventListener("mouseleave", () => btn.style.background = "#17712c");

            btn.dataset.partidoId = partido.id;
            btn.dataset.tabla = tabla;
            btnCol.appendChild(btn);

            if (a.children.length == 2) {
                a.children[1].children[0].style.height = "38px";
                a.style.height = "63px";
                btn.style.marginTop = "24px";
                resul = a.children[1].children[1].children[0].children[1];
            } else if (a.children.length == 1) {5
                a.children[0].children[0].style.height = "38px";
                a.style.height = "38.81px";
                resul = a.children[0].children[1].children[0].children[1];
            }

            a.addEventListener("click", e => e.preventDefault());
            console.log(resul);

            if (resul.children.length == 1) {
                num1 = resul.children[0].children[0].children[1];
                num2 = resul.children[0].children[2].children[0];

                num1.setAttribute("contenteditable", "true");
                num2.setAttribute("contenteditable", "true");

                limitarAUnDigito(num1);
                limitarAUnDigito(num2);
            } else if (resul.children.length == 2) {
                const nums = crearResul(resul);
                num1 = nums.num1;
                num2 = nums.num2;
            }

            btn.addEventListener("click", () => {
                if (!num1 || !num2) return;
                if (num1.textContent === "+" || num2.textContent === "+") return;

                simular(
                    String(btn.dataset.partidoId),
                    Number(num1.textContent),
                    Number(num2.textContent),
                    Number(btn.dataset.tabla)
                );
            });
        });
    }

    function crearResul(resul) {
        while (resul.firstChild) {
            resul.removeChild(resul.firstChild);
        }

        const resultBlock = document.createElement("div");
        resultBlock.style.color = "white";
        resultBlock.style.display = "flex";
        resultBlock.style.alignItems = "center";
        resultBlock.style.gap = "4px";
        resultBlock.style.fontSize = "18px";

        const num1Container = document.createElement("div");

        const num1Margin = document.createElement("div");
        num1Margin.style.marginRight = "3px";

        const num1 = document.createElement("span");
        num1.textContent = "+";
        num1.setAttribute("contenteditable", "true");
        limitarAUnDigito(num1);

        num1Container.appendChild(num1Margin);
        num1Container.appendChild(num1);

        const dash = document.createElement("div");
        dash.textContent = "-";
        dash.style.padding = "0 2px";
        dash.style.textAlign = "center";
        dash.style.fontSize = "28px";
        dash.style.fontWeight = "700";

        const num2Container = document.createElement("div");

        const num2Margin = document.createElement("div");
        num2Margin.style.marginRight = "3px";

        const num2 = document.createElement("span");
        num2.textContent = "+";
        num2.setAttribute("contenteditable", "true");
        limitarAUnDigito(num2);

        num2Container.appendChild(num2Margin);
        num2Container.appendChild(num2);

        resultBlock.appendChild(num1Container);
        resultBlock.appendChild(dash);
        resultBlock.appendChild(num2Container);

        resul.appendChild(resultBlock);
        return { num1, num2 };
    }

    function eliminarBotones() {
        document.querySelectorAll(".simulador-btn").forEach(btn => btn.remove());

        if (bloque && bloque.parentNode) {
            while (bloque.firstChild) {
                const child = bloque.firstChild;
                if (child.classList && child.classList.contains("btnCol")) {
                    child.remove();
                } else {
                    bloque.parentNode.insertBefore(child, bloque);
                }
            }

            bloque.parentNode.removeChild(bloque);
            bloque = null;
        }
    }

    let ultimaBaseUsada = null;
    function interceptarFetch() {
        const _fetch = window.fetch;
        window.fetch = async (...args) => {
            const res = await _fetch(...args);
            try {
                const url = args[0];
                if (typeof url === "string" && url.includes("/league/games/")) {
                    const key = url.split("/").pop();
                    ultimaBaseUsada = key.replace(/_\d+$/, "");
                }
            } catch {}
            return res;
        };
    }

    let ultimaClave = null;
    let primeraVez = true;
    let fechaRenderizada = null;
    setInterval(() => {
        const resulContainer = document.querySelector(".item-event__content");
        if (!resulContainer || !fechasInfo || fechasInfo.length === 0) return;

        let fechaCorrecta = null;

        if (primeraVez) {
            const filtroActivo = data?.props?.pageProps?.data?.games?.filters?.find(f => f.selected);
            if (!filtroActivo) return;

            const baseSeleccionada = filtroActivo.key.replace(/_\d+$/, "");
            fechaCorrecta = fechasInfo.find(f => f.base === baseSeleccionada);
            if (!fechaCorrecta) return;

            primeraVez = false;
        } else {
            const menuFechas = document.querySelector("div[class*='select-trigger_selectTop__']");
            if (!menuFechas || !menuFechas.children[1]) return;

            const fechaVisible = menuFechas.children[1].firstChild;
            if (!fechaVisible) return;

            const textoActual = fechaVisible.textContent.trim();
            const match = textoActual.match(/\d+/);
            if (!match) return;

            const numeroFecha = parseInt(match[0]);
            const baseEnUso = ultimaBaseUsada;
            if (!baseEnUso) return;

            const claveActual = `${numeroFecha}-${baseEnUso}`;
            if (claveActual === ultimaClave) return;
            ultimaClave = claveActual;

            fechaCorrecta = fechasInfo.find(
                f => f.fecha === numeroFecha && f.base === baseEnUso
            );
            if (!fechaCorrecta) return;
        }

        const claveRender = `${fechaCorrecta.fecha}-${fechaCorrecta.base}-${fechaCorrecta.tabla}`;
        if (claveRender === fechaRenderizada) return;
        fechaRenderizada = claveRender;

        eliminarBotones();

        const btnCol = document.createElement("div");
        crearBloque(resulContainer, btnCol);

        crearBotones(
            resulContainer,
            btnCol,
            fechaCorrecta.partidos,
            fechaCorrecta.tabla
        );

        interceptarFetch();
    }, 200);

    function limitarAUnDigito(el) {
        if (!el.textContent.trim()) {
            el.textContent = "+";
        }

        el.addEventListener("keydown", e => {
            if (
                e.key === "Backspace" ||
                e.key === "Delete" ||
                e.key === "ArrowLeft" ||
                e.key === "ArrowRight" ||
                e.key === "Tab"
            ) return;

            if (!/^[0-9]$/.test(e.key)) {
                e.preventDefault();
                return;
            }
        });

        el.addEventListener("paste", e => {
            e.preventDefault();
        });

        el.addEventListener("input", () => {
            let val = el.textContent.replace(/[^0-9]/g, "").slice(0, 1);
            el.textContent = val === "" ? "+" : val;
        });
    }

    let lastMode = null;
    let resizeTimeout;
    function ajustarBloque(bloque) {
        const w = window.innerWidth;
        let mode;

        if (w > 1200) mode = "big";
        else if (w > 1040) mode = "mid";
        else mode = "small";

        if (mode === lastMode) return;
        lastMode = mode;

        bloque.style.width =
            mode === "big" ? "410px" :
            mode === "mid" ? "710px" :
            "510px";
    }
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => ajustarBloque(bloque), 100);
    });

    function verDatos() {
        // console.clear();
        console.log("Equipos:", equipos);
        console.log("Fechas Info: ", fechasInfo);
    }
    window.verDatos = verDatos;

    let interval = setInterval(async function () {
        let el = document.getElementById("__NEXT_DATA__");
        if (!el) return;

        clearInterval(interval);
        await cargarDatos(el);
        document.querySelectorAll("iframe").forEach(i => i.remove());
        const iframeObserver = new MutationObserver(mutations => {
            for (const m of mutations) {
                for (const node of m.addedNodes) {
                    if (node.tagName === "IFRAME") {
                        node.remove();
                    } else if (node.querySelectorAll) {
                        node.querySelectorAll("iframe").forEach(i => i.remove());
                    }
                }
            }
        });

        iframeObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
        verDatos();
    }, 100);

})();