// ==UserScript==
// @name         WME PLN Module - UI Handler
// @version      9.0.0
// @description  Módulo de UI para WME Place Normalizer. No funciona por sí solo.
// @author       mincho77
// @license      MIT
// @grant        none
// ==/UserScript==
// Ícono en base64 para la pestaña principal del script
let floatingPanelElement = null;

// Función para crear la pestaña lateral del script
function createSidebarTab()
{
    try
    {
        // 1. Verificar si WME y la función para registrar pestañas están listos
        if (!W || !W.userscripts || typeof W.userscripts.registerSidebarTab !== 'function')
        {
            plnLog('warn', "[WME PLN] WME (userscripts o registerSidebarTab) no está listo para crear la pestaña lateral.");
            return;
        }
        // 2. Registrar la pestaña principal del script en WME y obtener tabPane
        let registration;
        try
        {
            registration = W.userscripts.registerSidebarTab("NrmliZer"); // Nombre del Tab que aparece en WME
        }
        catch (e)
        {
            if (e.message.includes("already been registered"))
            {
                plnLog('warn',"[WME PLN] Tab 'NrmliZer' ya registrado. El script puede no funcionar como se espera si hay múltiples instancias.");
                // Podrías intentar obtener el tabPane existente o simplemente
                // retornar. Para evitar mayor complejidad, si ya está
                // registrado, no continuaremos con la creación de la UI de la
                // pestaña.
                return;
            }

            throw e; // Relanzar otros errores para que se vean en consola
        }
        const { tabLabel, tabPane } = registration;
        if (!tabLabel || !tabPane)
        {
            plnLog('ui', "[WME PLN] Registro de pestaña incompleto (sin label o pane).");
            return;
        }
        // Configurar el ícono y nombre de la pestaña principal del script
        // Corrección aquí: usar directamente MAIN_TAB_ICON_BASE64 en el src
        tabLabel.innerHTML = `
            <img src="${MAIN_TAB_ICON_BASE64}" style="height: 16px; vertical-align: middle; margin-right: 5px;">
            NrmliZer
        `;
        // 3. Inicializar las pestañas internas (General, Especiales,
        // Diccionario, Reemplazos)
        const tabsContainer = document.createElement("div");
        tabsContainer.style.display = "flex";
        tabsContainer.style.marginBottom = "8px";
        tabsContainer.style.gap = "8px";
        const tabButtons = {};
        const tabContents = {}; // Objeto para guardar los divs de contenido
        // Crear botones para cada pestaña
        tabNames.forEach(({ label, icon }) =>
        {
            const btn = document.createElement("button");
            btn.innerHTML = icon
            ? `<span style="display: inline-flex; align-items: center; font-size: 11px;">
                <span style="font-size: 12px; margin-right: 4px;">${icon}</span>${label}
            </span>`
            : `<span style="font-size: 11px;">${label}</span>`;
            btn.style.fontSize = "11px";
            btn.style.padding = "4px 8px";
            btn.style.marginRight = "4px";
            btn.style.minHeight = "28px";
            btn.style.border = "1px solid #ccc";
            btn.style.borderRadius = "4px 4px 0 0";
            btn.style.cursor = "pointer";
            btn.style.borderBottom = "none"; // Para que la pestaña activa se vea mejor integrada
            btn.className = "custom-tab-style";
            // Agrega el tooltip personalizado para cada tab
            if (label === "Gene") btn.title = "Configuración general";
            else if (label === "Espe") btn.title = "Palabras especiales (Excluidas)";
            else if (label === "Dicc") btn.title = "Diccionario de palabras válidas";
            else if (label === "Reemp") btn.title = "Gestión de reemplazos automáticos";
            // Estilo inicial: la primera pestaña es la activa
            if (label === tabNames[0].label)
            {
                btn.style.backgroundColor = "#ffffff"; // Color de fondo activo (blanco)
                btn.style.borderBottom = "2px solid #007bff"; // Borde inferior distintivo para la activa
                btn.style.fontWeight = "bold";
            }
            else
            {
                btn.style.backgroundColor = "#f0f0f0"; // Color de fondo inactivo (gris claro)
                btn.style.fontWeight = "normal";
            }
            btn.addEventListener("click", () =>
            {
                tabNames.forEach(({ label: tabLabel_inner }) =>
                {
                    const isActive = (tabLabel_inner === label);
                    const currentButton = tabButtons[tabLabel_inner];
                    if (tabContents[tabLabel_inner])
                    {
                        tabContents[tabLabel_inner].style.display = isActive ? "block" : "none";
                    }
                    if (currentButton)
                    {
                        // Aplicar/Quitar estilos de pestaña activa directamente
                        if (isActive)
                        {
                            currentButton.style.backgroundColor = "#ffffff"; // Activo
                            currentButton.style.borderBottom = "2px solid #007bff";
                            currentButton.style.fontWeight = "bold";
                        }
                        else
                        {
                            currentButton.style.backgroundColor = "#f0f0f0"; // Inactivo
                            currentButton.style.borderBottom = "none";
                            currentButton.style.fontWeight = "normal";
                        }
                    }
                    // Llamar a la función de renderizado correspondiente
                    if (isActive)
                    {
                        if (tabLabel_inner === "Espe")
                        {
                            const ul = document.getElementById("excludedWordsList");
                            if (ul && typeof window.renderExcludedWordsList === 'function') window.renderExcludedWordsList(ul);
                        }
                        else if (tabLabel_inner === "Dicc")
                        {
                            const ulDict = document.getElementById("dictionaryWordsList");
                            if (ulDict && typeof window.renderDictionaryList === 'function') window.renderDictionaryList(ulDict);
                        }
                        else if (tabLabel_inner === "Reemp")
                        {
                        const ulReemplazos = document.getElementById("replacementsListElementID");
                            if (ulReemplazos && typeof window.renderReplacementsList === 'function') window.renderReplacementsList(ulReemplazos);
                        }
                    }
                });
            });
            tabButtons[label] = btn;
            tabsContainer.appendChild(btn);
        });
        tabPane.appendChild(tabsContainer);
        // Crear los divs contenedores para el contenido de cada pestaña
        tabNames.forEach(({ label }) =>
        {
            const contentDiv = document.createElement("div");
            contentDiv.style.display = label === tabNames[0].label ? "block" : "none"; // Mostrar solo la primera
            contentDiv.style.padding = "10px";
            tabContents[label] = contentDiv; // Guardar referencia
            tabPane.appendChild(contentDiv);
        });
        // --- POBLAR EL CONTENIDO DE CADA PESTAÑA ---
        // 4. Poblar el contenido de la pestaña "General"
        const containerGeneral = tabContents["Gene"];
        if (containerGeneral)
        {
            // Crear el contenedor principal
            const mainTitle = document.createElement("h3");
            mainTitle.textContent = "NormliZer";
            mainTitle.style.textAlign = "center";
            mainTitle.style.fontSize = "20px";
            mainTitle.style.marginBottom = "2px";
            containerGeneral.appendChild(mainTitle);
            // Crear el subtítulo (información de la versión)
            const versionInfo = document.createElement("div");
            versionInfo.textContent = "V. " + (window.PLN_META?.version || window.VERSION || '9.0.0'); // VERSION segura
            versionInfo.style.textAlign = "right";
            versionInfo.style.fontSize = "10px";
            versionInfo.style.color = "#777";
            versionInfo.style.marginBottom = "15px";
            containerGeneral.appendChild(versionInfo);
                //Crear un div para mostrar el ID del usuario
            const userIdInfo = document.createElement("div"); //
            userIdInfo.id = "wme-pln-user-id"; //
            userIdInfo.textContent = "Cargando usuario..."; //
            userIdInfo.style.textAlign = "right"; //
            userIdInfo.style.fontSize = "10px"; //
            userIdInfo.style.color = "#777"; //
            userIdInfo.style.marginBottom = "15px"; //
            containerGeneral.appendChild(userIdInfo); //
            // Esta función reemplaza la necesidad de las funciones getCurrentEditorViaSdk, etc.
            const pollAndDisplayUserInfo = () =>
            {
                let pollingAttempts = 0;
                const maxPollingAttempts = 60;
                const pollInterval = setInterval(async () =>
                {
                    let currentUserInfoLocal = null; //: Usar una variable local temporal
                    // Primero intentar con wmeSDK.State.getUserInfo() ***
                    if (wmeSDK && wmeSDK.State && typeof wmeSDK.State.getUserInfo === 'function')
                    {
                        try
                        {
                            const sdkUserInfo = await wmeSDK.State.getUserInfo();
                            if (sdkUserInfo && sdkUserInfo.userName)
                            {
                                currentUserInfoLocal = {
                                    // Si sdkUserInfo.id NO existe, usar sdkUserInfo.userName DIRECTAMENTE (sin Number())
                                    id: sdkUserInfo.id !== undefined ? sdkUserInfo.id : sdkUserInfo.userName, //
                                    name: sdkUserInfo.userName,
                                    privilege: sdkUserInfo.privilege || 'N/A'
                                };
                                // Asegurarse de que el ID es válido para el log
                                const displayId = typeof currentUserInfoLocal.id === 'number' ? currentUserInfoLocal.id : `"${currentUserInfoLocal.id}"`; //

                            }
                            else
                            {

                            }
                        }
                        catch (e)
                        {

                        }
                    }
                    else
                    {
                        plnLog('warn',`[WME_PLN][DEBUG] SDK.State.getUserInfo no disponible. wmeSDK:`, wmeSDK);
                    }
                    // Fallback a W.loginManager (si SDK.State no funcionó)
                    if (!currentUserInfoLocal && typeof W !== 'undefined' && W.loginManager && W.loginManager.userName && W.loginManager.userId) { //: Usar currentUserInfoLocal
                        currentUserInfoLocal = {
                            id: Number(W.loginManager.userId), // Convertir a número
                            name: W.loginManager.userName,
                            privilege: W.loginManager.userPrivilege || 'N/A'
                        };
                        plnLog('sdk', `[WME PLN][DEBUG] W.loginManager SUCCESS: Usuario obtenido: ${currentUserInfoLocal.name} (ID: ${currentUserInfoLocal.id})`);
                    }
                    else if (!currentUserInfoLocal)
                    { //: Solo logear si aún no se encontró en ningún método
                        plnLog('warn',`[WME_PLN][DEBUG] W.loginManager devolvió datos incompletos o null:`, W?.loginManager);
                    }
                    if (currentUserInfoLocal && currentUserInfoLocal.id && currentUserInfoLocal.name)
                    {
                        clearInterval(pollInterval);
                        window.currentGlobalUserInfo = currentUserInfoLocal;
                        userIdInfo.textContent = `Editor Actual: ${window.currentGlobalUserInfo.name}`;
                        userIdInfo.title = `Privilegio: ${window.currentGlobalUserInfo.privilege}`;
                        window.updateStatsDisplay?.();//: Actualizar estadísticas con el nuevo usuario
                        plnLog('init', '[WME_PLN][DEBUG] USUARIO CARGADO EXITOSAMENTE mediante polling.');
                        const labelToUpdate = document.querySelector('label[for="chk-avoid-my-edits"]');
                        if (labelToUpdate)
                        {
                            labelToUpdate.innerHTML = `Excluir lugares cuya última edición sea del Editor: <span style="color: #007bff; font-weight: normal;">${currentGlobalUserInfo.name}</span>`;
                        }
                        const avoidMyEditsCheckbox = document.getElementById("chk-avoid-my-edits");
                        if (avoidMyEditsCheckbox)
                        {
                            avoidMyEditsCheckbox.disabled = false;
                            avoidMyEditsCheckbox.style.opacity = "1";
                            avoidMyEditsCheckbox.style.cursor = "pointer";
                        }
                    }
                    else if (pollingAttempts >= maxPollingAttempts - 1)
                    {
                        clearInterval(pollInterval);
                        userIdInfo.textContent = "Usuario no detectado (agotados intentos)";
                        plnLog('init', '[WME PLN][DEBUG]  Polling agotado. Usuario no detectado después de varios intentos.');
                        // Asignar el estado de fallo a currentGlobalUserInfo
                        window.currentGlobalUserInfo = { id: 0, name: 'No detectado', privilege: 'N/A' };
                        // Actualizar el texto del checkbox para evitar ediciones del usuario
                        const avoidTextSpanToUpdate = document.querySelector("#chk-avoid-my-edits + label span");
                        //: Actualizar el texto del checkbox para evitar ediciones del usuario
                        if (avoidTextSpanToUpdate)
                        {
                            //: Usa innerHTML y estilo atenuado para el nombre "No detectado"
                            avoidTextSpanToUpdate.innerHTML = `Excluir lugares cuya última edición sea del Editor: <span style="color: #777; opacity: 0.5;">No detectado</span>`; //
                            avoidTextSpanToUpdate.style.opacity = "1"; //: Asegurar opacidad base para el span principal
                            // avoidTextSpanToUpdate.style.color = "#777"; //: Puedes quitar esta línea si el color del span es suficiente
                        }
                        const avoidMyEditsCheckbox = document.getElementById("chk-avoid-my-edits");
                        //: Deshabilitar el checkbox si no se detecta el usuario
                        if (avoidMyEditsCheckbox)
                        {
                            avoidMyEditsCheckbox.disabled = true;
                            avoidMyEditsCheckbox.style.opacity = "0.5";
                            avoidMyEditsCheckbox.style.cursor = "not-allowed";
                        }
                    }
                    pollingAttempts++;
                }, 200);

            };
            // Iniciar el polling para la información del usuario
            pollAndDisplayUserInfo(); //Llamada directa a la nueva función de polling
            // Título de la sección de normalización
            const normSectionTitle = document.createElement("h4");
            normSectionTitle.textContent = "Análisis de Nombres de Places";
            normSectionTitle.style.fontSize = "16px";
            normSectionTitle.style.marginTop = "10px";
            normSectionTitle.style.marginBottom = "5px";
            normSectionTitle.style.borderBottom = "1px solid #eee";
            normSectionTitle.style.paddingBottom = "3px";
            containerGeneral.appendChild(normSectionTitle);
            // Descripción de la sección
            const scanButton = document.createElement("button");
            scanButton.id = "pln-start-scan-btn";
            scanButton.textContent = "Start Scan...";
            scanButton.setAttribute("type", "button");
            scanButton.style.marginBottom = "10px";
            scanButton.style.fontSize = "14px";
            scanButton.style.width = "100%";
            scanButton.style.padding = "8px";
            scanButton.style.border = "none";
            scanButton.style.borderRadius = "4px";
            scanButton.style.backgroundColor = "#007bff";
            scanButton.style.color = "#fff";
            scanButton.style.cursor = "pointer";
            scanButton.addEventListener("click", () =>
            {
                window.disableScanControls?.();
                scanButton.textContent = "Escaneando...";

                const outputDiv = document.getElementById("wme-normalization-tab-output");
                if (!outputDiv)
                {
                    enableScanControls();
                    return;
                }
                let places = (typeof window.getVisiblePlaces === 'function') ? window.getVisiblePlaces() : [];
                // Filtrar lugares excluidos ANTES de mostrar el conteo.
                places = places.filter(place => !(window.excludedPlaces instanceof Map && window.excludedPlaces.has(place.getID())));
                
                const totalPlacesToScan = places.length;

                if (totalPlacesToScan === 0)
                {
                    outputDiv.textContent = "No hay lugares visibles para analizar (o todos están excluidos).";
                    window.enableScanControls?.();
                    return;
                }

                // Mostrar el conteo correcto y verificado.
                outputDiv.textContent = `Escaneando ${totalPlacesToScan} lugares...`;

                // Llamar a la función de renderizado con la lista ya filtrada.
                setTimeout(() => {
                    renderPlacesInFloatingPanel(places);
                }, 10);
            });
            containerGeneral.appendChild(scanButton);
            // Crear el contenedor para el checkbox de usuario
            const maxWrapper = document.createElement("div");
            maxWrapper.style.display = "flex";
            maxWrapper.style.alignItems = "center";
            maxWrapper.style.gap = "8px";
            maxWrapper.style.marginBottom = "8px";
            const maxLabel = document.createElement("label");
            maxLabel.textContent = "Máximo de places a revisar:";
            maxLabel.style.fontSize = "13px";
            maxWrapper.appendChild(maxLabel);
            const maxInput = document.createElement("input");
            maxInput.type = "number";
            maxInput.id = "maxPlacesInput";
            maxInput.min = "1";
            maxInput.value = "100";
            maxInput.style.width = "80px";
            maxWrapper.appendChild(maxInput);
            containerGeneral.appendChild(maxWrapper);
            const presets = [ 25, 50, 100, 250, 500 ];
            const presetContainer = document.createElement("div");
            presetContainer.style.textAlign = "center";
            presetContainer.style.marginBottom = "8px";
            presets.forEach(preset =>
            {
                const btn = document.createElement("button");
                btn.className = "pln-preset-btn"; // Clase para aplicar estilos comunes
                btn.textContent = preset.toString();
                btn.style.margin = "2px";
                btn.style.padding = "4px 6px";
                btn.addEventListener("click", () =>
                {
                    if (maxInput)
                        maxInput.value = preset.toString();
                });
                presetContainer.appendChild(btn);
            });
            containerGeneral.appendChild(presetContainer);
            // Checkbox para recomendar categorías
            const recommendCategoriesWrapper = document.createElement("div");
            recommendCategoriesWrapper.style.marginTop = "10px";
            recommendCategoriesWrapper.style.marginBottom = "5px";
            recommendCategoriesWrapper.style.display = "flex";
            recommendCategoriesWrapper.style.flexDirection = "column"; //Cambiar a columna para apilar checkboxes
            recommendCategoriesWrapper.style.alignItems = "flex-start"; //Alinear ítems al inicio
            recommendCategoriesWrapper.style.padding = "6px 8px"; // Añadir padding
            recommendCategoriesWrapper.style.backgroundColor = "#e0f7fa"; // Fondo claro para destacar
            recommendCategoriesWrapper.style.border = "1px solid #00bcd4"; // Borde azul
            recommendCategoriesWrapper.style.borderRadius = "4px"; // Bordes redondeados
            containerGeneral.appendChild(recommendCategoriesWrapper); //Añadir el wrapper aquí, antes de sus contenidos
            // Contenedor para el checkbox "Recomendar categorías"
            const recommendCategoryCheckboxRow = document.createElement("div"); //
            recommendCategoryCheckboxRow.style.display = "flex"; //Fila para checkbox y etiqueta
            recommendCategoryCheckboxRow.style.alignItems = "center"; //
            recommendCategoryCheckboxRow.style.marginBottom = "5px"; //Margen inferior
            // Crear el checkbox y la etiqueta
            const recommendCategoriesCheckbox = document.createElement("input");
            recommendCategoriesCheckbox.type = "checkbox";
            recommendCategoriesCheckbox.id = "chk-recommend-categories";
            recommendCategoriesCheckbox.style.marginRight = "8px";
            const savedCategoryRecommendationState = localStorage.getItem("wme_pln_recommend_categories");
            recommendCategoriesCheckbox.checked = (savedCategoryRecommendationState === "true");
            const recommendCategoriesLabel = document.createElement("label");
            recommendCategoriesLabel.htmlFor = "chk-recommend-categories";
            recommendCategoriesLabel.style.fontSize = "14px";
            recommendCategoriesLabel.style.cursor = "pointer";
            recommendCategoriesLabel.style.fontWeight = "bold";
            recommendCategoriesLabel.style.color = "#00796b";
            recommendCategoriesLabel.style.display = "flex";
            recommendCategoriesLabel.style.alignItems = "center";
            const iconSpan = document.createElement("span");
            iconSpan.innerHTML = "✨ ";
            iconSpan.style.marginRight = "4px";
            iconSpan.style.fontSize = "16px";
            iconSpan.appendChild(document.createTextNode("Recomendar categorías"));
            recommendCategoriesLabel.appendChild(iconSpan);
            recommendCategoryCheckboxRow.appendChild(recommendCategoriesCheckbox); //
            recommendCategoryCheckboxRow.appendChild(recommendCategoriesLabel); //
            recommendCategoriesWrapper.appendChild(recommendCategoryCheckboxRow); //Añadir la fila al wrapper
            recommendCategoriesCheckbox.addEventListener("change", () =>
            {
                localStorage.setItem("wme_pln_recommend_categories", recommendCategoriesCheckbox.checked ? "true" : "false");
            });
            // --- Contenedor para AGRUPAR las opciones de exclusión ---
            const excludeContainer = document.createElement('div');
            excludeContainer.style.marginTop = '8px'; // Espacio que lo separa de la opción de arriba
            // --- Fila para el checkbox "Excluir lugares..." ---
            const avoidMyEditsCheckboxRow = document.createElement("div");
            avoidMyEditsCheckboxRow.style.display = "flex";
            avoidMyEditsCheckboxRow.style.alignItems = "center";
            //: Añadir un margen inferior para separar del checkbox de categorías
            const avoidMyEditsCheckbox = document.createElement("input");
            avoidMyEditsCheckbox.type = "checkbox";
            avoidMyEditsCheckbox.id = "chk-avoid-my-edits";
            avoidMyEditsCheckbox.style.marginRight = "8px";
            const savedAvoidMyEditsState = localStorage.getItem("wme_pln_avoid_my_edits");
            avoidMyEditsCheckbox.checked = (savedAvoidMyEditsState === "true");
            avoidMyEditsCheckboxRow.appendChild(avoidMyEditsCheckbox);
            //: Añadir un label con el texto de la opción
            const avoidMyEditsLabel = document.createElement("label");
            avoidMyEditsLabel.htmlFor = "chk-avoid-my-edits";
            avoidMyEditsLabel.style.fontSize = "16px"; // Tamaño de fuente consistente
            avoidMyEditsLabel.style.cursor = "pointer";
            avoidMyEditsLabel.style.fontWeight = "bold";
            avoidMyEditsLabel.style.color = "#00796b";
            avoidMyEditsLabel.innerHTML = `Excluir lugares cuya última edición sea del Editor: <span style="color: #007bff; font-weight: normal;">Cargando...</span>`;
            avoidMyEditsCheckboxRow.appendChild(avoidMyEditsLabel);
            // --- Fila para el dropdown de fecha (sub-menú) ---
            const dateFilterRow = document.createElement("div");
            dateFilterRow.style.display = "flex";
            dateFilterRow.style.alignItems = "center";
            dateFilterRow.style.marginTop = "8px"; // Espacio entre el checkbox y esta fila
            dateFilterRow.style.paddingLeft = "25px"; // Indentación para que parezca una sub-opción
            dateFilterRow.style.gap = "8px";
            //: Añadir un label para el dropdown
            const dateFilterLabel = document.createElement("label");
            dateFilterLabel.htmlFor = "dateFilterSelect";
            dateFilterLabel.textContent = "Excluir solo ediciones de:";
            dateFilterLabel.style.fontSize = "13px";
            dateFilterLabel.style.fontWeight = "500";
            dateFilterLabel.style.color = "#334";
            dateFilterRow.appendChild(dateFilterLabel);
            //: Crear el dropdown para seleccionar el filtro de fecha
            const dateFilterSelect = document.createElement("select");
            dateFilterSelect.id = "dateFilterSelect";
            dateFilterSelect.style.padding = "5px 8px";
            dateFilterSelect.style.border = "1px solid #b0c4de";
            dateFilterSelect.style.borderRadius = "4px";
            dateFilterSelect.style.backgroundColor = "#fff";
            dateFilterSelect.style.flexGrow = "1";
            dateFilterSelect.style.fontSize = "13px";
            dateFilterSelect.style.cursor = "pointer";
            // Añadir opciones al dropdown
            const dateOptions = {
                "all": "Elegir una opción",
                "6_months": "Últimos 6 meses",
                "3_months": "Últimos 3 meses",
                "1_month": "Último mes",
                "1_week": "Última Semana",
                "1_day": "Último día"
            };
            // Añadir las opciones al dropdown
            for (const [value, text] of Object.entries(dateOptions))
            {
                const option = document.createElement("option");
                option.value = value;
                option.textContent = text;
                dateFilterSelect.appendChild(option);
            }
            // Cargar el valor guardado del localStorage
            const savedDateFilter = localStorage.getItem("wme_pln_date_filter");
            if (savedDateFilter)
            {
                dateFilterSelect.value = savedDateFilter;
            }
            dateFilterSelect.addEventListener("change", () =>
            {
                localStorage.setItem("wme_pln_date_filter", dateFilterSelect.value);
            });
            dateFilterRow.appendChild(dateFilterSelect);
            // --- Añadir AMBAS filas al contenedor de exclusión ---
            excludeContainer.appendChild(avoidMyEditsCheckboxRow);
            excludeContainer.appendChild(dateFilterRow);
            // --- Añadir el contenedor AGRUPADO al wrapper principal (el cuadro azul) ---
            recommendCategoriesWrapper.appendChild(excludeContainer);
            // --- Lógica para habilitar/deshabilitar el dropdown ---
            const toggleDateFilterState = () =>
            {
                const isChecked = avoidMyEditsCheckbox.checked;
                dateFilterSelect.disabled = !isChecked;
                dateFilterRow.style.opacity = isChecked ? "1" : "0.5";
                dateFilterRow.style.pointerEvents = isChecked ? "auto" : "none";
            };
            // --- Listener unificado para el checkbox ---
            avoidMyEditsCheckbox.addEventListener("change", () =>
            {
                toggleDateFilterState(); // Actualiza la UI del dropdown
                localStorage.setItem("wme_pln_avoid_my_edits", avoidMyEditsCheckbox.checked ? "true" : "false"); // Guarda el estado
            });
            // Llamada inicial para establecer el estado correcto al cargar
            toggleDateFilterState();
            // --- Contenedor para el checkbox de estadísticas ---
            const statsContainer = document.createElement('div');
            statsContainer.style.marginTop = '8px';
            // Añadir un borde y fondo para destacar
            const statsCheckboxRow = document.createElement("div");
            statsCheckboxRow.style.display = "flex";
            statsCheckboxRow.style.alignItems = "center";
            // Añadir un margen inferior para separar del checkbox de exclusión
            const statsCheckbox = document.createElement("input");
            statsCheckbox.type = "checkbox";
            statsCheckbox.id = "chk-enable-stats";
            statsCheckbox.style.marginRight = "8px";
            statsCheckbox.checked = localStorage.getItem(STATS_ENABLED_KEY) === 'true';
            statsCheckboxRow.appendChild(statsCheckbox);
            // Crear la etiqueta para el checkbox de estadísticas
            const statsLabel = document.createElement("label");
            statsLabel.htmlFor = "chk-enable-stats";
            statsLabel.style.fontSize = "16px"; // Tamaño consistente
            statsLabel.style.cursor = "pointer";
            statsLabel.style.fontWeight = "bold";
            statsLabel.style.color = "#00796b";
            statsLabel.innerHTML = `📊 Habilitar panel de estadísticas`;
            statsCheckboxRow.appendChild(statsLabel);
            // Añadir un tooltip al checkbox de estadísticas
            statsContainer.appendChild(statsCheckboxRow);
            // Añadir el contenedor de estadísticas al wrapper principal (el cuadro azul)
            recommendCategoriesWrapper.appendChild(statsContainer);

            // Listener para el checkbox de estadísticas
            statsCheckbox.addEventListener("change", () =>
            {
                localStorage.setItem(STATS_ENABLED_KEY, statsCheckbox.checked ? "true" : "false");
                toggleStatsPanelVisibility();
            });
            //===========================Finaliza bloque de estadísticas
            // Listener para guardar el estado del nuevo checkbox
            avoidMyEditsCheckbox.addEventListener("change", () =>
            { //
                localStorage.setItem("wme_pln_avoid_my_edits", avoidMyEditsCheckbox.checked ? "true" : "false"); //
            });
            // Barra de progreso y texto
            const tabProgressWrapper = document.createElement("div");
            tabProgressWrapper.style.margin = "10px 0";
            tabProgressWrapper.style.height = "18px";
            tabProgressWrapper.style.backgroundColor = "transparent";
            const tabProgressBar = document.createElement("div");
            tabProgressBar.style.height = "100%";
            tabProgressBar.style.width = "0%";
            tabProgressBar.style.backgroundColor = "#007bff";
            tabProgressBar.style.transition = "width 0.2s";
            tabProgressBar.id = "progressBarInnerTab";
            tabProgressWrapper.appendChild(tabProgressBar);
            containerGeneral.appendChild(tabProgressWrapper);
            // Texto de progreso
            const tabProgressText = document.createElement("div");
            tabProgressText.style.fontSize = "13px";
            tabProgressText.style.marginTop = "5px";
            tabProgressText.id = "progressBarTextTab";
            tabProgressText.textContent = "Progreso: 0% (0/0)";
            containerGeneral.appendChild(tabProgressText);
            // Div para mostrar el resultado del análisis
            const outputNormalizationInTab = document.createElement("div");
            outputNormalizationInTab.id = "wme-normalization-tab-output";
            outputNormalizationInTab.style.fontSize = "12px";
            outputNormalizationInTab.style.minHeight = "20px";
            outputNormalizationInTab.style.padding = "5px";
            outputNormalizationInTab.style.marginBottom = "15px";
            outputNormalizationInTab.textContent = "Presiona 'Start Scan...' para analizar los places visibles.";
            containerGeneral.appendChild(outputNormalizationInTab);
        }
        else
        {
            plnLog('error',"[WME PLN] No se pudo poblar la pestaña 'General' porque su contenedor no existe.");
        }
        // 5. Poblar las otras pestañas
        if (tabContents["Espe"])
                createSpecialItemsManager(tabContents["Espe"]);
        else
        {
            plnLog('error',"[WME PLN] No se pudo encontrar el contenedor para la pestaña 'Especiales'.");
        }
        // --- Llamada A La Función Para Poblar La Nueva Pestaña "Diccionario"
        if (tabContents["Dicc"])
        {
            createDictionaryManager(tabContents["Dicc"]);
        }
        else
        {
            plnLog('error',"[WME PLN] No se pudo encontrar el contenedor para la pestaña 'Diccionario'.");
        }
        // --- Llamada A La Función Para Poblar La Nueva Pestaña "Reemplazos"
        if (tabContents["Reemp"])
        {
            createReplacementsManager(tabContents["Reemp"]); // Esta es la llamada clave
        }
        else
        {
            plnLog('error',"[WME PLN] No se pudo encontrar el contenedor para la pestaña 'Reemplazos'.");
        }
    }
    catch (error)
    {
        plnLog('error',"[WME PLN] Error creando la pestaña lateral:", error, error.stack);
    }
} // Fin de createSidebarTab

//Permite crear un panel flotante para mostrar los resultados del escaneo
function createFloatingPanel(status = "processing", numInconsistents = 0)
{
    if (!floatingPanelElement)
    {
        floatingPanelElement = document.createElement("div");
        floatingPanelElement.id = "wme-place-inspector-panel";
        floatingPanelElement.setAttribute("role", "dialog");
        floatingPanelElement.setAttribute("aria-label", "NrmliZer: Panel de resultados");
        floatingPanelElement.style.position = "fixed";
        floatingPanelElement.style.zIndex = "10005"; // Z-INDEX DEL PANEL DE RESULTADOS
        floatingPanelElement.style.background = "#fff";
        floatingPanelElement.style.border = "1px solid #ccc";
        floatingPanelElement.style.borderRadius = "8px";
        floatingPanelElement.style.boxShadow = "0 5px 15px rgba(0,0,0,0.2)";
        floatingPanelElement.style.padding = "10px";
        floatingPanelElement.style.fontFamily = "'Helvetica Neue', Helvetica, Arial, sans-serif";
        floatingPanelElement.style.display = 'none';
        floatingPanelElement.style.transition = "width 0.25s, height 0.25s, left 0.25s, top 0.25s"; // Agregado left y top a la transición
        floatingPanelElement.style.overflow = "hidden";

        // Variables para almacenar el estado del panel
        floatingPanelElement._isMaximized = false;
        floatingPanelElement._isMinimized = false;
        floatingPanelElement._originalState = {};
        floatingPanelElement._isDragging = false;
        floatingPanelElement._currentStatus = status;

        // Crear barra de título con controles
        const titleBar = document.createElement("div");
        titleBar.id = "wme-pln-titlebar";
        titleBar.style.display = "flex";
        titleBar.style.justifyContent = "space-between";
        titleBar.style.alignItems = "center";
        titleBar.style.marginBottom = "10px";
        titleBar.style.userSelect = "none";
        titleBar.style.cursor = "move";
        titleBar.style.padding = "5px 0";

        // Título del panel
        const titleElement = document.createElement("h4");
        titleElement.id = "wme-pln-panel-title";
        titleElement.style.margin = "0";
        titleElement.style.fontSize = "20px";
        titleElement.style.color = "#333";
        titleElement.style.fontWeight = "bold";
        titleElement.style.flex = "1";
        titleElement.style.textAlign = "center";

        // Contenedor de controles estilo macOS
        const controlsContainer = document.createElement("div");
        controlsContainer.style.display = "flex";
        controlsContainer.style.gap = "8px";
        controlsContainer.style.alignItems = "center";
        controlsContainer.style.position = "absolute";
        controlsContainer.style.left = "15px";
        controlsContainer.style.top = "15px";

        // Función para crear botones estilo macOS
        function createMacButton(color, action, tooltip) {
            const btn = document.createElement("div");
            btn.style.width = "12px";
            btn.style.height = "12px";
            btn.style.borderRadius = "50%";
            btn.style.backgroundColor = color;
            btn.style.cursor = "pointer";
            btn.style.border = "1px solid rgba(0,0,0,0.1)";
            btn.style.display = "flex";
            btn.style.alignItems = "center";
            btn.style.justifyContent = "center";
            btn.style.fontSize = "8px";
            btn.style.color = "rgba(0,0,0,0.6)";
            btn.style.transition = "all 0.2s";
            btn.title = tooltip;

            // Efectos hover
            btn.addEventListener("mouseenter", () => {
                btn.style.transform = "scale(1.1)";
                if (color === "#ff5f57") btn.textContent = "×";
                else if (color === "#ffbd2e") btn.textContent = "−";
                else if (color === "#28ca42") btn.textContent = action === "maximize" ? "⬜" : "🗗";
            });

            btn.addEventListener("mouseleave", () => {
                btn.style.transform = "scale(1)";
                btn.textContent = "";
            });

            btn.addEventListener("click", action);
            return btn;
        }

        // Botón cerrar (rojo)
        const closeBtn = createMacButton("#ff5f57", async () => {
            if (floatingPanelElement._currentStatus === "processing")
            {
                const confirmCancel = await (window.plnUiConfirm ? window.plnUiConfirm("¿Detener la búsqueda en progreso?", { okText: "Detener", cancelText: "Continuar" }) : Promise.resolve(true));
                if (confirmCancel !== true) return;
                window.resetInspectorState?.();
            }
            if (floatingPanelElement) floatingPanelElement.style.display = 'none';
            window.resetInspectorState?.();
        }, "Cerrar panel");

        // Botón minimizar (amarillo)
        const minimizeBtn = createMacButton("#ffbd2e", () => {
            const outputDiv = floatingPanelElement.querySelector("#wme-place-inspector-output");

            if (!floatingPanelElement._isMinimized) {
                // Guardar estado actual antes de minimizar
                floatingPanelElement._originalState = {
                    width: floatingPanelElement.style.width,
                    height: floatingPanelElement.style.height,
                    top: floatingPanelElement.style.top,
                    left: floatingPanelElement.style.left,
                    transform: floatingPanelElement.style.transform,
                    outputHeight: outputDiv ? outputDiv.style.height : 'auto'
                };

                // Minimizar - mover a la parte superior
                floatingPanelElement.style.top = "20px";
                floatingPanelElement.style.left = "50%";
                floatingPanelElement.style.transform = "translateX(-50%)";
                floatingPanelElement.style.height = "50px";
                floatingPanelElement.style.width = "300px";
                if (outputDiv) outputDiv.style.display = "none";

                floatingPanelElement._isMinimized = true;
                updateButtonVisibility();
            } else {
                // Restaurar desde minimizado
                const originalState = floatingPanelElement._originalState;
                floatingPanelElement.style.width = originalState.width;
                floatingPanelElement.style.height = originalState.height;
                floatingPanelElement.style.top = originalState.top;
                floatingPanelElement.style.left = originalState.left;
                floatingPanelElement.style.transform = originalState.transform;

                if (outputDiv) {
                    outputDiv.style.display = "block";
                    outputDiv.style.height = originalState.outputHeight;
                }

                floatingPanelElement._isMinimized = false;
                updateButtonVisibility();
            }
        }, "Minimizar panel");

        // Botón maximizar (verde)
        //  const maximizeBtn = createMacButton("#28ca42", () => {
            const outputDiv = floatingPanelElement.querySelector("#wme-place-inspector-output");

        // Función para actualizar visibilidad de botones
        // Replace the updateButtonVisibility function in createFloatingPanel
        function updateButtonVisibility()
        {
            const isProcessing = floatingPanelElement._currentStatus === "processing";

            // Limpiar contenedor
            controlsContainer.innerHTML = "";

            if (isProcessing) {
                // Solo botón cerrar durante la búsqueda
                controlsContainer.appendChild(closeBtn);
            } else if (floatingPanelElement._isMinimized) {
                // Minimizado: cerrar y restaurar
                controlsContainer.appendChild(closeBtn);

                // Crear botón de restaurar si estamos minimizados
                const restoreBtn = createMacButton("#28ca42", () => {
                    // Restaurar desde minimizado
                    const originalState = floatingPanelElement._originalState;
                    floatingPanelElement.style.width = originalState.width;
                    floatingPanelElement.style.height = originalState.height;
                    floatingPanelElement.style.top = originalState.top;
                    floatingPanelElement.style.left = originalState.left;
                    floatingPanelElement.style.transform = originalState.transform;

                    const outputDiv = floatingPanelElement.querySelector("#wme-place-inspector-output");
                    if (outputDiv) {
                        outputDiv.style.display = "block";
                        outputDiv.style.height = originalState.outputHeight;
                    }

                    floatingPanelElement._isMinimized = false;
                    updateButtonVisibility();
                }, "Restaurar panel");

                restoreBtn.textContent = "🗗";
                controlsContainer.appendChild(restoreBtn);
            } else {
                // Normal: cerrar y minimizar
                controlsContainer.appendChild(closeBtn);
                controlsContainer.appendChild(minimizeBtn);
            }
        }// updateButtonVisibility

        // Funcionalidad de arrastrar
        let isDragging = false;
        let dragOffset = { x: 0, y: 0 };

        titleBar.addEventListener("mousedown", (e) => {
            if (e.target === titleBar || e.target === titleElement) {
                isDragging = true;
                const rect = floatingPanelElement.getBoundingClientRect();
                dragOffset.x = e.clientX - rect.left;
                dragOffset.y = e.clientY - rect.top;
                floatingPanelElement.style.transition = "none";
                e.preventDefault();
            }
        });

        document.addEventListener("mousemove", (e) => {
            if (isDragging && !floatingPanelElement._isMaximized) {
                const newLeft = e.clientX - dragOffset.x;
                const newTop = e.clientY - dragOffset.y;

                floatingPanelElement.style.left = `${newLeft}px`;
                floatingPanelElement.style.top = `${newTop}px`;
                floatingPanelElement.style.transform = "none";
            }
        });

        document.addEventListener("mouseup", () => {
            if (isDragging) {
                isDragging = false;
                floatingPanelElement.style.transition = "width 0.25s, height 0.25s, left 0.25s, top 0.25s";
            }
        });

        // Agregar controles y título a la barra
        titleBar.appendChild(controlsContainer);
        titleBar.appendChild(titleElement);

        // Agregar barra de título al panel
        floatingPanelElement.appendChild(titleBar);

        // Contenido del panel
        const outputDivLocal = document.createElement("div");
        outputDivLocal.id = "wme-place-inspector-output";
        outputDivLocal.setAttribute("aria-live", "polite");
        outputDivLocal.style.fontSize = "18px";
        outputDivLocal.style.backgroundColor = "#fdfdfd";
        outputDivLocal.style.overflowY = "auto";
        outputDivLocal.style.flex = "1";
        floatingPanelElement.appendChild(outputDivLocal);

        // Función para actualizar botones (hacer accesible)
        floatingPanelElement._updateButtonVisibility = updateButtonVisibility;
        if (!document.getElementById('pln-spinner-style'))
        {
            const st = document.createElement('style');
            st.id = 'pln-spinner-style';
            st.textContent = '@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}';
            document.head.appendChild(st);
        }
        document.body.appendChild(floatingPanelElement);
    }

    // Actualizar estado actual
    floatingPanelElement._currentStatus = status;
    const processingPanelDimensions = window.processingPanelDimensions || { width: "480px", height: "220px" };
    const resultsPanelDimensions    = window.resultsPanelDimensions    || { width: "820px", height: "720px"  };
    // Referencias a elementos existentes
    const titleElement = floatingPanelElement.querySelector("#wme-pln-panel-title");
    const outputDiv = floatingPanelElement.querySelector("#wme-place-inspector-output");

    // Limpiar contenido
    if(outputDiv) outputDiv.innerHTML = "";

    // Actualizar visibilidad de botones
    if (floatingPanelElement._updateButtonVisibility) {
        floatingPanelElement._updateButtonVisibility();
    }

    // Configurar según el estado
    if (status === "processing")
    {
        // Solo actualizar si no está maximizado o minimizado
        if (!floatingPanelElement._isMaximized && !floatingPanelElement._isMinimized) {
            floatingPanelElement.style.width = processingPanelDimensions.width;
            floatingPanelElement.style.height = processingPanelDimensions.height;
            floatingPanelElement.style.top = "50%";
            floatingPanelElement.style.left = "50%";
            floatingPanelElement.style.transform = "translate(-50%, -50%)";
        }

        if(outputDiv && !floatingPanelElement._isMinimized) {
            outputDiv.style.height = floatingPanelElement._isMaximized ? "calc(100vh - 100px)" : "150px";
            outputDiv.style.display = "block";
        }

        if(titleElement) titleElement.textContent = "Buscando...";

        if (outputDiv && !floatingPanelElement._isMinimized)
        {
            outputDiv.innerHTML = "<div style='display:flex; align-items:center; justify-content:center; height:100%;'><span class='loader-spinner' style='width:32px; height:32px; border:4px solid #ccc; border-top:4px solid #007bff; border-radius:50%; animation:spin 0.8s linear infinite;'></span></div>";
        }
    }
    else
    { // status === "results"
        // Solo actualizar si no está maximizado o minimizado
        if (!floatingPanelElement._isMaximized && !floatingPanelElement._isMinimized) {
            floatingPanelElement.style.width = resultsPanelDimensions.width;
            floatingPanelElement.style.height = resultsPanelDimensions.height;
            floatingPanelElement.style.top = "50%";
            floatingPanelElement.style.left = "60%";
            floatingPanelElement.style.transform = "translate(-50%, -50%)";
        }

        if(outputDiv && !floatingPanelElement._isMinimized) {
            outputDiv.style.height = floatingPanelElement._isMaximized ? "calc(100vh - 100px)" : "660px";
            outputDiv.style.display = "block";
        }


    if(titleElement) titleElement.textContent = "NrmliZer: Resultados";

    // --- BOTÓN MOSTRAR/OCULTAR NORMALIZADOS ---
    let showHidden = false;
    let toggleBtn = document.getElementById('pln-toggle-hidden-btn');
    if (!toggleBtn) {
        toggleBtn = document.createElement('button');
        toggleBtn.id = 'pln-toggle-hidden-btn';
        toggleBtn.textContent = 'Mostrar normalizados';
        toggleBtn.style.marginLeft = '12px';
        toggleBtn.style.padding = '4px 10px';
        toggleBtn.style.fontSize = '12px';
        toggleBtn.style.border = '1px solid #bbb';
        toggleBtn.style.borderRadius = '5px';
        toggleBtn.style.background = '#f4f4f4';
        toggleBtn.style.cursor = 'pointer';
        toggleBtn.addEventListener('click', () => {
            showHidden = !showHidden;
            if (showHidden) {
                // Mostrar lo oculto
                const st = document.getElementById('pln-hide-style'); if (st) st.remove();
                document.querySelectorAll('tr.pln-hidden-normalized')
                    .forEach(tr => tr.classList.remove('pln-hidden-normalized'));
                toggleBtn.textContent = 'Ocultar normalizados';
            } else {
                // Volver a ocultar normalizados
                if (!document.getElementById('pln-hide-style')) {
                    const st = document.createElement('style');
                    st.id = 'pln-hide-style';
                    st.textContent = `tr.pln-hidden-normalized{display:none !important;}`;
                    document.head.appendChild(st);
                }
                document.querySelectorAll('tr').forEach(tr => {
                    // Reaplicar la lógica de ocultar si corresponde
                    if (tr.dataset && tr.dataset.placeId) {
                        // Si la fila ya estaba normalizada, volver a ocultarla
                        // (esto depende de lógica de marcado, aquí solo se vuelve a aplicar la clase si no tiene cambios)
                        // Si quieres forzar el ocultamiento, puedes volver a llamar a processAll() si la tienes global
                        if (typeof window.__plnHideNormalizedRows === 'function') {
                            window.__plnHideNormalizedRows();
                        }
                    }
                });
                toggleBtn.textContent = 'Mostrar normalizados';
            }
        });
        // Insertar el botón en la barra de título del panel
        const tb = document.getElementById('wme-pln-titlebar');
        if (tb) tb.appendChild(toggleBtn);
    }

    }

    floatingPanelElement.style.display = 'flex';
    floatingPanelElement.style.flexDirection = 'column';
}// Fin de createFloatingPanel


    //Permite renderizar los lugares en el panel flotante
function renderPlacesInFloatingPanel(places)
{
    // Limpiar la lista global de duplicados antes de llenarla de nuevo
    window.placesForDuplicateCheckGlobal = window.placesForDuplicateCheckGlobal || [];
    window.placesForDuplicateCheckGlobal.length = 0;
    createFloatingPanel("processing"); // Mostrar panel en modo "procesando"
    const maxPlacesToScan = parseInt(document.getElementById("maxPlacesInput")?.value || "100", 10);  //Obtiene el número total de lugares a procesar      
    const lockRankEmojis = ["0️⃣", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣"]; // Definir los emojis de nivel de bloqueo
    // Permite obtener el nombre de la categoría de un lugar, ya sea del modelo antiguo o del SDK

    function getPlaceCategoryName(venueFromOldModel, venueSDKObject)
    { // Acepta ambos tipos de venue
        let categoryId = null;
        let categoryName = null;
        // Intento 1: Usar el venueSDKObject si está disponible y tiene la info
        if (venueSDKObject)
        {
            if (venueSDKObject.mainCategory && venueSDKObject.mainCategory.id)
            {// Si venueSDKObject tiene mainCategory con ID
                categoryId = venueSDKObject.mainCategory.id; // source = "SDK (mainCategory.id)";
                    //Limpiar comillas aquí
                if (typeof categoryId === 'string') categoryId = categoryId.replace(/'/g, '');
                if (venueSDKObject.mainCategory.name) // Si mainCategory tiene nombre
                    categoryName = venueSDKObject.mainCategory.name;// source = "SDK (mainCategory.name)";
                if (typeof categoryName === 'string') categoryName = categoryName.replace(/'/g, '');
            }
            else if (Array.isArray(venueSDKObject.categories) && venueSDKObject.categories.length > 0)
            {// Si venueSDKObject tiene un array de categorías y al menos una categoría
                const firstCategorySDK = venueSDKObject.categories[0]; // source = "SDK (categories[0])";
                if (typeof firstCategorySDK === 'object' && firstCategorySDK.id)
                {// Si la primera categoría es un objeto con ID
                    categoryId = firstCategorySDK.id;
                    // Limpiar comillas aquí
                    if (typeof categoryId === 'string') categoryId = categoryId.replace(/'/g, '');

                    if (firstCategorySDK.name)  // Si la primera categoría tiene nombre
                        categoryName = firstCategorySDK.name;
                    if (typeof categoryName === 'string') categoryName = categoryName.replace(/'/g, '');
                }
                else if (typeof firstCategorySDK === 'string') // Si la primera categoría es una cadena (nombre de categoría)
                {
                    categoryName = firstCategorySDK;
                    if (typeof categoryName === 'string') categoryName = categoryName.replace(/'/g, '');
                }
            }
            else if (venueSDKObject.primaryCategoryID)
            {
                categoryId = venueSDKObject.primaryCategoryID;
                if (typeof categoryName === 'string') categoryName = categoryName.replace(/'/g, '');
            }
        }
        if (categoryName)
        {// Si se obtuvo el nombre de categoría del SDK

            return categoryName;
        }
        // Intento 2: Usar W.model si no se obtuvo del SDK
        if (!categoryId && venueFromOldModel && venueFromOldModel.attributes && Array.isArray(venueFromOldModel.attributes.categories) && venueFromOldModel.attributes.categories.length > 0)
            categoryId = venueFromOldModel.attributes.categories[0];
        if (!categoryId)// Si no se pudo obtener el ID de categoría de ninguna fuente
            return "Sin categoría";
        let categoryObjWModel = null; // Intentar obtener el objeto de categoría del modelo Waze
        if (typeof W !== 'undefined' && W.model)
        {// Si Waze Map Editor está disponible
            if (W.model.venueCategories && typeof W.model.venueCategories.getObjectById === "function") // Si venueCategories está disponible en W.model
                categoryObjWModel =  W.model.venueCategories.getObjectById(categoryId);
            if (!categoryObjWModel && W.model.categories && typeof W.model.categories.getObjectById === "function") // Si no se encontró en venueCategories, intentar en categories
                categoryObjWModel =   W.model.categories.getObjectById(categoryId);
        }
        if (categoryObjWModel && categoryObjWModel.attributes && categoryObjWModel.attributes.name)
        {// Si se encontró el objeto de categoría en W.model
            let nameToReturn = categoryObjWModel.attributes.name;
            //  Limpiar comillas aquí
            if (typeof nameToReturn === 'string') nameToReturn = nameToReturn.replace(/'/g, '');
            return nameToReturn;
        }
        if (typeof categoryId === 'number' || (typeof categoryId === 'string' && categoryId.trim() !== ''))
        {// Si no se pudo obtener el nombre de categoría de ninguna fuente, devolver el ID
            return `${categoryId}`; // Devuelve el ID si no se encuentra el nombre.
        }
        return "Sin categoría";
    }//getPlaceCategoryName

        //Permite obtener el tipo de lugar (área o punto) y su icono
    function getPlaceTypeInfo(venueSDKObject) // <--- AHORA RECIBE venueSDKObject
    {
        let isArea = false;
        let icon = "⊙"; // Icono por defecto para punto
        let title = "Punto"; // Título por defecto para punto

        if (venueSDKObject && venueSDKObject.geometry && venueSDKObject.geometry.type)
        {
            const geometryType = venueSDKObject.geometry.type;
            if (geometryType === 'Polygon' || geometryType === 'MultiPolygon')
            {
                isArea = true;
                icon = "⭔"; // Icono para área
                title = "Área"; // Título para área
            }
            // Para otros tipos como 'Point', 'LineString', etc., se mantienen los valores por defecto (Punto).
        }
        return { isArea, icon, title };
    }// getPlaceTypeInfo

    //Permite procesar un lugar y generar un objeto con sus detalles
    function shouldForceSuggestionForReview(word)
    {
        if (typeof word !== 'string') // Si la palabra no es una cadena, no forzar sugerencia por esta regla
            return false;
        const lowerWord = word.toLowerCase(); // Convertir la palabra a minúsculas para evitar problemas de mayúsculas/minúsculas
        const hasTilde = /[áéíóúÁÉÍÓÚ]/.test(word); // Verificar si la palabra tiene alguna tilde (incluyendo mayúsculas acentuadas)
        if (!hasTilde)  // Si no tiene tilde, no forzar sugerencia por esta regla
            return false; // Si no hay tilde, no forzar sugerencia por esta regla
        const problematicSubstrings = ['c', 's', 'x', 'cc', 'sc', 'cs', 'g', 'j', 'z','ñ']; // Lista de patrones de letras/combinaciones que, junto con una tilde, fuerzan la sugerencia (insensible a mayúsculas debido a lowerWord)
        for (const sub of problematicSubstrings)
        {// Verificar si la palabra contiene alguna de las letras/combinaciones problemáticas
            if (lowerWord.includes(sub))
                return true; // Tiene tilde y una de las letras/combinaciones problemáticas
        }
        return false; // Tiene tilde, pero no una de las letras/combinaciones problemáticas
    }//shouldForceSuggestionForReview

    // Procesa un lugar y genera un objeto con sus detalles
    async function getPlaceCityInfo(venueFromOldModel, venueSDKObject)
    {
        let hasExplicitCity = false; // Indica si hay una ciudad explícita definida
        let explicitCityName = null; // Nombre de la ciudad explícita, si se encuentra
        let hasStreetInfo = false; // Indica si hay información de calle disponible
        let cityAssociatedWithStreet = null; // Nombre de la ciudad asociada a la calle, si se encuentra
        // 1. Check for EXPLICIT city  SDK
        if (venueSDKObject && venueSDKObject.address)
        {
            plnLog('sdk', "[DEBUG] venueSDKObject.address:", venueSDKObject.address);

            if (venueSDKObject.address.city && typeof venueSDKObject.address.city.name === 'string' && venueSDKObject.address.city.name.trim() !== '') {
                // Si hay una ciudad explícita en el SDK
                explicitCityName = venueSDKObject.address.city.name.trim(); // Nombre de la ciudad explícita
                hasExplicitCity = true; // source = "SDK (address.city.name)";
            plnLog('sdk', "[DEBUG] Ciudad explícita encontrada en SDK (address.city.name):", explicitCityName);
            } else if (typeof venueSDKObject.address.cityName === 'string' && venueSDKObject.address.cityName.trim() !== '') {
                // Si hay una ciudad explícita en el SDK (cityName)
                explicitCityName = venueSDKObject.address.cityName.trim(); // Nombre de la ciudad explícita
                hasExplicitCity = true; // source = "SDK (address.cityName)";
            plnLog('sdk', "[DEBUG] Ciudad explícita encontrada en SDK (address.cityName):", explicitCityName);
            }
            else
            {
            plnLog('sdk', "[DEBUG] No se encontró ciudad explícita en SDK.");
            }
        }//

        if (!hasExplicitCity && venueFromOldModel && venueFromOldModel.attributes)
        {
            plnLog('sdk', "[DEBUG] venueFromOldModel.attributes:", venueFromOldModel.attributes);
            const cityID = venueFromOldModel.attributes.cityID;
            plnLog('city', "[DEBUG] cityID del modelo antiguo:", cityID);

            if (cityID && typeof W !== 'undefined' && W.model && W.model.cities && W.model.cities.getObjectById)
            {
                plnLog('city', "[DEBUG] Intentando obtener el objeto de ciudad con cityID:", cityID);

                const cityObject = W.model.cities.getObjectById(cityID); // Obtener el objeto de ciudad del modelo Waze
                plnLog('city', "[DEBUG] cityObject obtenido:", cityObject);

                if (cityObject && cityObject.attributes && typeof cityObject.attributes.name === 'string' && cityObject.attributes.name.trim() !== '')
                {
                    // Si el objeto de ciudad tiene un nombre válido
                    explicitCityName = cityObject.attributes.name.trim(); // Nombre de la ciudad explícita
                    hasExplicitCity = true; // source = "W.model.cities (cityID)";
                plnLog('city', "[DEBUG] Ciudad explícita encontrada en modelo antiguo (cityID):", explicitCityName);
                }
                else
                {
                plnLog('city', "[DEBUG] cityObject no tiene un nombre válido.");
                }
            }
            else
            {
                plnLog('city', "[DEBUG] cityID no válido o W.model.cities.getObjectById no disponible.");
            }
        }
        // 2. Check for STREET information (and any city derived from it) // SDK street check
        if (venueSDKObject && venueSDKObject.address)
            if ((venueSDKObject.address.street && typeof venueSDKObject.address.street.name === 'string' && venueSDKObject.address.street.name.trim() !== '') ||
                (typeof venueSDKObject.address.streetName === 'string' && venueSDKObject.address.streetName.trim() !== ''))
                hasStreetInfo = true; // source = "SDK (address.street.name or streetName)";
        if (venueFromOldModel && venueFromOldModel.attributes && venueFromOldModel.attributes.streetID)
        {// Old Model street check (if not found via SDK or to supplement)
            hasStreetInfo = true; // Street ID exists in old model
            const streetID = venueFromOldModel.attributes.streetID; // Obtener el streetID del modelo antiguo
            if (typeof W !== 'undefined' && W.model && W.model.streets && W.model.streets.getObjectById)
            {// Si hay un streetID en el modelo antiguo
                const streetObject = W.model.streets.getObjectById(streetID); // Obtener el objeto de calle del modelo Waze
                if (streetObject && streetObject.attributes && streetObject.attributes.cityID)
                {// Si el objeto de calle tiene un cityID asociado
                    const cityIDFromStreet = streetObject.attributes.cityID;// Obtener el cityID de la calle
                    if (W.model.cities && W.model.cities.getObjectById)
                    {// Si W.model.cities está disponible y tiene el método getObjectById
                        const cityObjectFromStreet = W.model.cities.getObjectById(cityIDFromStreet);// Obtener el objeto de ciudad asociado a la calle
                        // Si el objeto de ciudad tiene un nombre válido
                        if (cityObjectFromStreet && cityObjectFromStreet.attributes && typeof cityObjectFromStreet.attributes.name === 'string' && cityObjectFromStreet.attributes.name.trim() !== '')
                            cityAssociatedWithStreet = cityObjectFromStreet.attributes.name.trim(); // Nombre de la ciudad asociada a la calle
                    }
                }
            }
        }
        // --- 3. Determine icon, title, and returned hasCity based on user's specified logic ---
        let icon;
        let title;
        const returnedHasCityBoolean = hasExplicitCity; // To be returned, indicates if an *explicit* city is set.
        const hasAnyAddressInfo = hasExplicitCity || hasStreetInfo; // Determina si hay alguna información de dirección (ciudad explícita o calle).
        if (hasAnyAddressInfo)
        {// Si hay información de dirección (ciudad explícita o calle)
            if (hasExplicitCity)
            {
                // Tiene ciudad explícita
                icon = "🏙️";
                title = `Ciudad: ${explicitCityName}`;
            }
            else if (cityAssociatedWithStreet)
            {
                // No tiene ciudad explícita, pero la calle sí está asociada a ciudad
                icon = "🏙️";
                title = `Ciudad (por calle): ${cityAssociatedWithStreet}`;
            }
            else
            {
                // No hay ciudad explícita ni ciudad por calle
                icon = "🚫";
                title = "Sin ciudad asignada";
            }
            return {
                icon: icon || "❓",
                title: title || "Info no disponible",
                hasCity: (hasExplicitCity || !!cityAssociatedWithStreet) // Ahora true si tiene ciudad por calle
            };
        }
        else
        { // No tiene ni ciudad explícita ni información de calle
            icon = "🚫";
            title = "El campo dirección posee inconsistencias"; // Título para "no tiene ciudad ni calle"
        }
        return {
            icon: icon || "❓", // Usar '?' si icon es undefined/null/empty
            title: title || "Info no disponible", // Usar "Info no disponible" si title es undefined/null/empty
            hasCity: returnedHasCityBoolean || false // Asegurarse de que sea un booleano
        };
    }//getPlaceCityInfo

    //Renderizar barra de progreso en el TAB PRINCIPAL justo después del slice
    const tabOutput = document.querySelector("#wme-normalization-tab-output");
    if (tabOutput)
    {// Si el tab de salida ya existe, limpiar su contenido
        // Reiniciar el estilo del mensaje en el tab al valor predeterminado
        tabOutput.style.color = "#000";
        tabOutput.style.fontWeight = "normal";
        // Crear barra de progreso visual
        const progressBarWrapperTab = document.createElement("div");
        progressBarWrapperTab.style.margin = "10px 0";
        progressBarWrapperTab.style.marginTop = "10px";
        progressBarWrapperTab.style.height = "18px";
        progressBarWrapperTab.style.backgroundColor = "transparent";
        // Crear el contenedor de la barra de progreso
        const progressBarTab = document.createElement("div");
        progressBarTab.style.height = "100%";
        progressBarTab.style.width = "0%";
        progressBarTab.style.backgroundColor = "#007bff";
        progressBarTab.style.transition = "width 0.2s";
        progressBarTab.id = "progressBarInnerTab";
        progressBarWrapperTab.appendChild(progressBarTab);
        // Crear texto de progreso
        const progressTextTab = document.createElement("div");
        progressTextTab.style.fontSize = "12px";
        progressTextTab.style.marginTop = "5px";
        progressTextTab.id = "progressBarTextTab";
        tabOutput.appendChild(progressBarWrapperTab);
        tabOutput.appendChild(progressTextTab);
    }
    // Asegurar que la barra de progreso en el tab se actualice desde el principio
    const progressBarInnerTab = document.getElementById("progressBarInnerTab"); // Obtener la barra de progreso del tab
    const progressBarTextTab = document.getElementById("progressBarTextTab"); // Obtener el texto de progreso del tab
    if (progressBarInnerTab && progressBarTextTab)
    {// Si ambos elementos existen, reiniciar su estado
        progressBarInnerTab.style.width = "0%";
        progressBarTextTab.textContent = `Progreso: 0% (0/${places.length})`; // Reiniciar el texto de progreso
    }
    // --- PANEL FLOTANTE: limpiar y preparar salida ---
    const output = document.querySelector("#wme-place-inspector-output");//
    if (!output)
    {// Si el panel flotante no está disponible, mostrar un mensaje de error
        plnLog('error',"[WME_PLN][ERROR]❌ Panel flotante no está disponible");
        return;
    }
    output.innerHTML = ""; // Limpia completamente el contenido del panel flotante
    output.innerHTML = "<div style='display:flex; align-items:center; gap:10px;'><span class='loader-spinner' style='width:16px; height:16px; border:2px solid #ccc; border-top:2px solid #007bff; border-radius:50%; animation:spin 0.8s linear infinite;'></span><div><div id='processingText'>Procesando lugares visibles<span class='dots'>.</span></div><div id='processingStep' style='font-size:13px; color:#555;'>Inicializando escaneo...</div></div></div>";
    // Asegurar que el panel flotante tenga un alto mínimo
    const processingStepLabel = document.getElementById("processingStep");
    // Animación de puntos suspensivos
    const dotsSpan = output.querySelector(".dots");
    if (dotsSpan)
    {// Si el span de puntos existe, iniciar la animación de puntos
        const dotStates = ["", ".", "..", "..."];
        let dotIndex = 0;
        window.processingDotsInterval = setInterval(() => {dotIndex = (dotIndex + 1) % dotStates.length;
            dotsSpan.textContent = dotStates[dotIndex];}, 500);
    }
    output.style.height = "calc(55vh - 40px)";
    if (!places.length)
    {// Si no hay places, mostrar mensaje y salir
        output.appendChild(document.createTextNode("No hay places visibles para analizar."));
        const existingOverlay = document.getElementById("scanSpinnerOverlay");
        if (existingOverlay)// Si ya existe un overlay de escaneo, removerlo
            existingOverlay.remove();
        return;
    }
    // Procesamiento incremental para evitar congelamiento
    let inconsistents = []; // Array para almacenar inconsistencias encontradas
    let index = 0; // Índice para iterar sobre los lugares
    const scanBtn = document.getElementById("pln-start-scan-btn");    if (scanBtn)
    {// Si el botón de escaneo existe, remover el ícono de ✔ previo si está presente
        const existingCheck = scanBtn.querySelector("span");
        if (existingCheck) // Si hay un span dentro del botón, removerlo
            existingCheck.remove();
    }
    // --- Sugerencias por palabra global para toda la ejecución ---
    let sugerenciasPorPalabra = {};
    // Helper local: similitud usando índice por primera letra
    function findSimilarWords(cleanedLower, dictIndex, threshold)
    {
        const firstChar = cleanedLower.charAt(0);
        const bucket = (dictIndex && dictIndex[firstChar]) ? dictIndex[firstChar] : [];
        const results = [];
        for (const word of bucket)
        {
            const sim = (PLNCore?.utils?.calculateSimilarity)
            ? PLNCore.utils.calculateSimilarity(cleanedLower, word.toLowerCase())
            : 0;
            if (sim >= threshold) results.push({ word, similarity: sim });
        }
        results.sort((a,b)=>b.similarity-a.similarity);
        return results.slice(0, 5);
    }
    // Convertir excludedWords a array solo una vez al inicio del análisis, seguro ante undefined
    const excludedArray = (typeof excludedWords !== "undefined" && Array.isArray(excludedWords)) ? excludedWords : (typeof excludedWords !== "undefined" ? Array.from(excludedWords) : []);
    
    // Función asíncrona para procesar el siguiente lugar
    async function processNextPlace()
    {
        const maxInconsistentsToFind = parseInt(document.getElementById("maxPlacesInput")?.value || "30", 10);
        if (inconsistents.length >= maxInconsistentsToFind)
        {
            finalizeRender(inconsistents, places.slice(0, index), sugerenciasPorPalabra);
            return;
        }
        if (index >= places.length)
        {// Si se han procesado todos los lugares, finalizar
            finalizeRender(inconsistents, places, sugerenciasPorPalabra);
            return;
        }
        const venueFromOldModel = places[index];
        const currentVenueId = venueFromOldModel.getID();
        // Salto temprano si el lugar es inválido o no tiene nombre
        if (!venueFromOldModel || !venueFromOldModel.attributes || typeof (venueFromOldModel.attributes.name?.value || venueFromOldModel.attributes.name || '').trim() !== 'string' || (venueFromOldModel.attributes.name?.value || venueFromOldModel.attributes.name || '').trim() === '')
        {
            updateScanProgressBar(index, places.length);
            index++;
            setTimeout(() => processNextPlace(), 0);
            return;
        }

        // --- Inicialización de variables para este lugar ---
        let shouldSkipThisPlace = false;
        let skipReasonLog = "";
        let venueSDK = null;

        try
        {
            if (wmeSDK?.DataModel?.Venues?.getById)
            {
                venueSDK = await wmeSDK.DataModel.Venues.getById({ venueId: currentVenueId });
            }
        }
        catch (sdkError)
        {
            plnLog('error',`[WME_PLN] Error al obtener venueSDK para ID ${currentVenueId}:`, sdkError);
        }

        const originalNameRaw = (venueSDK?.name || venueFromOldModel.attributes.name?.value || venueFromOldModel.attributes.name || '').trim();
        const nameForProcessing = originalNameRaw; // PLNCore.normalize maneja limpieza
        const normalizedName = PLNCore.normalize(nameForProcessing);
        const suggestedName = normalizedName;

        const originalWords = nameForProcessing.split(/\s+/).filter(word => word.length > 0);
        let sugerenciasLugar = {};
        const similarityThreshold = parseFloat(document.getElementById("similarityThreshold")?.value || "81") / 100;

        originalWords.forEach((originalWord) =>
        {
            if (!originalWord) return;
            const lowerOriginalWord = originalWord.toLowerCase();
            const cleanedLowerNoDiacritics = (window.PLNCore?.utils?.removeDiacritics || ((s)=>s))(lowerOriginalWord);
            let tildeCorrectionSuggested = false;

            if (window.dictionaryWords?.size > 0)
            {
                const firstChar = lowerOriginalWord.charAt(0);
                const candidatesForTildeCheck = window.dictionaryIndex[firstChar] || [];
                for (const dictWord of candidatesForTildeCheck)
                {
                    const lowerDictWord = dictWord.toLowerCase();
                    if (removeDiacritics(lowerDictWord) === cleanedLowerNoDiacritics && lowerDictWord !== lowerOriginalWord && !/[áéíóúÁÉÍÓÚüÜñÑ]/.test(lowerOriginalWord) && /[áéíóúÁÉÍÓÚüÜñÑ]/.test(lowerDictWord))
                    {
                        let suggestedTildeWord = PLNCore.normalize(dictWord);                        if (!sugerenciasLugar[originalWord]) sugerenciasLugar[originalWord] = [];
                        sugerenciasLugar[originalWord].push({ word: suggestedTildeWord, similarity: 0.999, fuente: 'dictionary_tilde' });
                        tildeCorrectionSuggested = true;
                        break;
                    }
                }
            }

            if (!tildeCorrectionSuggested && window.dictionaryWords)
            {
                const similarDictionary = findSimilarWords(cleanedLowerNoDiacritics, window.dictionaryIndex, similarityThreshold);
                if (similarDictionary.length > 0)
                {
                    const finalSuggestions = similarDictionary.filter(d => d.word.toLowerCase() !== lowerOriginalWord);
                    if (finalSuggestions.length > 0)
                    {
                        if (!sugerenciasLugar[originalWord]) sugerenciasLugar[originalWord] = [];
                        finalSuggestions.forEach(dictSuggestion =>
                        {
                            if (!sugerenciasLugar[originalWord].some(s => s.word === PLNCore.normalize(dictSuggestion.word)))
                            {
                                sugerenciasLugar[originalWord].push({ ...dictSuggestion, fuente: 'dictionary' });
                            }
                        });
                    }
                }
            }
        });

        const tieneSugerencias = Object.keys(sugerenciasLugar).length > 0;

        // ===================================================================
        // INICIO: LÓGICA DE DECISIÓN UNIFICADA Y CORREGIDA
        // ===================================================================
        const cleanedOriginalName = String(nameForProcessing || '').replace(/\s+/g, ' ').trim();
        const cleanedSuggestedName = String(suggestedName || '').replace(/\s+/g, ' ').trim();

        // Condición única y estricta: un lugar es una inconsistencia si su nombre cambia.
        const isTrulyInconsistent = cleanedOriginalName !== cleanedSuggestedName;

        if (!isTrulyInconsistent)
        {
            // Si los nombres son idénticos, este lugar no cuenta y pasamos al siguiente.
            shouldSkipThisPlace = true;
        }
        else
        {
            // Aquí podrías añadir las otras condiciones de omisión si las necesitas.
            // Por ahora, si es inconsistente, no lo saltamos.
            shouldSkipThisPlace = false;
        }

        const isNameEffectivelyNormalized = (cleanedOriginalName === cleanedSuggestedName);
        const avoidMyEdits = document.getElementById("chk-avoid-my-edits")?.checked ?? false;
        const typeInfo = getPlaceTypeInfo(venueSDK);
        const areaMeters = PLNCore.utils.calculateArea(venueSDK);
        let wasEditedByMe = false;

        if (currentGlobalUserInfo && currentGlobalUserInfo.id)
        {
            let lastEditorId = venueSDK?.modificationData?.updatedBy ?? venueFromOldModel.attributes.updatedBy;
            if (lastEditorId)
            {
                let lastEditorName = W.model.users.getObjectById(lastEditorId)?.userName || "";
                wasEditedByMe = (String(lastEditorId) === String(currentGlobalUserInfo.id)) || (lastEditorName && lastEditorName === currentGlobalUserInfo.name);
            }
        }

        // Aplicar reglas de omisión en orden de prioridad
        if (isNameEffectivelyNormalized && !tieneSugerencias)
        {
            shouldSkipThisPlace = true;
            skipReasonLog = `[SKIP NORMALIZED]`;
        }
        else if (excludedPlaces.has(currentVenueId))
        {
            shouldSkipThisPlace = true;
            skipReasonLog = `[SKIP EXCLUDED PLACE]`;
        }
        else if (avoidMyEdits && wasEditedByMe)
        {
            const dateFilterValue = document.getElementById("dateFilterSelect")?.value || "all";
            const placeEditDate = (venueSDK?.modificationData?.updatedOn) ? new Date(venueSDK.modificationData.updatedOn) : null;
            if (placeEditDate && typeof window.isDateWithinRange === 'function' && window.isDateWithinRange(placeEditDate, dateFilterValue))
            {
                shouldSkipThisPlace = true;
                skipReasonLog = `[SKIP MY OWN EDIT - In Range: ${dateFilterValue}]`;
            }
        }
        else if (typeInfo.isArea && areaMeters === null)
        {
            shouldSkipThisPlace = true;
            skipReasonLog = `[SKIP AREA_CALC_FAILED]`;
        }
        // ===================================================================
        // FIN: LÓGICA DE DECISIÓN
        // ===================================================================

        if (shouldSkipThisPlace)
        {
            updateScanProgressBar(index, places.length);
            index++;
            setTimeout(() => processNextPlace(), 0);
            return;
        }

        // --- Si no se omite, se recopila la información para mostrar ---
        const processingStepLabel = document.getElementById("processingStep");
        if (processingStepLabel)
        {
            processingStepLabel.textContent = "Registrando inconsistencias...";
        }

        const { lat: placeLat, lon: placeLon } = (window.getPlaceCoordinates ? window.getPlaceCoordinates(venueFromOldModel, venueSDK) : {lat:null, lon:null});
        const shouldRecommendCategories = document.getElementById("chk-recommend-categories")?.checked ?? true;
        let currentCategoryKey = getPlaceCategoryName(venueFromOldModel, venueSDK);
        const categoryDetails = (window.getCategoryDetails ? window.getCategoryDetails(currentCategoryKey) : {});
        let dynamicSuggestions = shouldRecommendCategories && typeof window.findCategoryForPlace === 'function' ? window.findCategoryForPlace(originalNameRaw) : [];

        let lastEditorId = venueSDK?.modificationData?.updatedBy ?? venueFromOldModel.attributes.updatedBy;
        let resolvedEditorName = W.model.users.getObjectById(lastEditorId)?.userName || `${lastEditorId}` || "Desconocido";

        const cityInfo = await getPlaceCityInfo(venueFromOldModel, venueSDK);
        let lockRank = venueSDK?.lockRank ?? venueFromOldModel.attributes.lockRank ?? 0;
        const lockRankEmojis = ["0️⃣", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣"];
        let lockRankEmoji = (lockRank >= 0 && lockRank <= 5) ? lockRankEmojis[lockRank + 1] : lockRankEmojis[0];
        const hasOverlappingHours = checkForOverlappingHours(venueSDK); // Llama a la nueva función.

        inconsistents.push({
            lockRankEmoji,
            id: currentVenueId,
            original: originalNameRaw,
            normalized: suggestedName,
            editor: resolvedEditorName,
            cityIcon: cityInfo.icon,
            cityTitle: cityInfo.title,
            hasCity: cityInfo.hasCity,
            venueSDKForRender: venueSDK,
            currentCategoryName: categoryDetails.description,
            currentCategoryIcon: categoryDetails.icon,
            currentCategoryTitle: categoryDetails.description,
            currentCategoryKey: currentCategoryKey,
            dynamicCategorySuggestions: dynamicSuggestions,
            lat: placeLat,
            lon: placeLon,
            typeInfo: typeInfo,
            areaMeters: areaMeters,
            hasOverlappingHours: hasOverlappingHours                
        });

        sugerenciasPorPalabra[currentVenueId] = sugerenciasLugar;
        updateScanProgressBar(index, places.length);
        index++;
        setTimeout(() => processNextPlace(), 0);
    }
    
    plnLog('normalize', "[WME_PLN] Iniciando primer processNextPlace...");
    try
    {
        setTimeout(() => { processNextPlace(); }, 10);
    }
    catch (error)
    {
        plnLog('error',"[WME_PLN][ERROR_CRITICAL] Fallo al iniciar processNextPlace:", error, error.stack);
        enableScanControls();
        const outputFallback = document.querySelector("#wme-place-inspector-output");
        if (outputFallback)
        {
            outputFallback.innerHTML = `<div style='color:red; padding:10px;'><b>Error Crítico:</b> El script de normalización encontró un problema grave y no pudo continuar. Revise la consola para más detalles (F12).<br>Detalles: ${error.message}</div>`;
        }
        const scanBtn = document.querySelector("button[type='button']"); // Asumiendo que es el botón de Start Scan
        if (scanBtn)
        {
            scanBtn.disabled = false;
            scanBtn.textContent = "Start Scan... (Error Previo)";
        }
        if (window.processingDotsInterval)
        {
            clearInterval(window.processingDotsInterval);
        }
    }// processNextPlace

    // Función para re-aplicar la lógica de palabras excluidas al texto normalizado
    function reapplyExcludedWordsLogic(text, excludedWordsSet)
    {
        if (typeof text !== 'string' || !excludedWordsSet || excludedWordsSet.size === 0)
        {
            return text;
        }
        const wordsInText = text.split(/\s+/);
        const processedWordsArray = wordsInText.map(word =>
        {
            if (word === "") return "";
            const wordWithoutDiacriticsLower = removeDiacritics(word.toLowerCase());
            // Encontrar la palabra excluida que coincida (insensible a may/min y diacríticos)
            const matchingExcludedWord = Array.from(excludedWordsSet).find(
                w_excluded => removeDiacritics(w_excluded.toLowerCase()) === wordWithoutDiacriticsLower);
            if (matchingExcludedWord)
            {
                // Si coincide, DEVOLVER LA FORMA EXACTA DE LA LISTA DE EXCLUIDAS
                return matchingExcludedWord;
            }
            // Si no, devolver la palabra como estaba (ya normalizada por pasos previos)
            return word;
        });
        return processedWordsArray.join(' ');
    }// reapplyExcludedWordsLogic

    function excludePlace(row, placeId, placeName)
    {
        const confirmModal = document.createElement("div");
        // ... (Estilos del modal, no cambian)
        confirmModal.style.position = "fixed";
        confirmModal.style.top = "50%";
        confirmModal.style.left = "50%";
        confirmModal.style.transform = "translate(-50%, -50%)";
        confirmModal.style.background = "#fff";
        confirmModal.style.border = "1px solid #aad";
        confirmModal.style.padding = "28px 32px 20px 32px";
        confirmModal.style.zIndex = "20000";
        confirmModal.style.boxShadow = "0 4px 24px rgba(0,0,0,0.18)";
        confirmModal.style.fontFamily = "sans-serif";
        confirmModal.style.borderRadius = "10px";
        confirmModal.style.textAlign = "center";
        confirmModal.style.minWidth = "340px";

        confirmModal.innerHTML = `
            <div style="font-size: 38px; margin-bottom: 10px;">🚫</div>
            <div style="font-size: 20px; margin-bottom: 8px;"><b>¿Excluir "${placeName}"?</b></div>
            <div style="font-size: 15px; color: #555; margin-bottom: 18px;">Este lugar no volverá a aparecer en futuras búsquedas del normalizador.</div>
        `;

        const buttonWrapper = document.createElement("div");
        buttonWrapper.style.display = "flex";
        buttonWrapper.style.justifyContent = "center";
        buttonWrapper.style.gap = "18px";

        const cancelBtn = document.createElement("button");
        cancelBtn.textContent = "Cancelar";
        // ... (Estilos del botón cancelar)
        cancelBtn.style.padding = "7px 18px";
        cancelBtn.style.background = "#eee";
        cancelBtn.style.border = "none";
        cancelBtn.style.borderRadius = "4px";
        cancelBtn.style.cursor = "pointer";
        cancelBtn.addEventListener("click", () => confirmModal.remove());

        const confirmExcludeBtn = document.createElement("button");
        confirmExcludeBtn.textContent = "Excluir";
        // ... (Estilos del botón confirmar)
        confirmExcludeBtn.style.padding = "7px 18px";
        confirmExcludeBtn.style.background = "#d9534f";
        confirmExcludeBtn.style.color = "#fff";
        confirmExcludeBtn.style.border = "none";
        confirmExcludeBtn.style.borderRadius = "4px";
        confirmExcludeBtn.style.cursor = "pointer";
        confirmExcludeBtn.style.fontWeight = "bold";

        confirmExcludeBtn.addEventListener("click", () => {
            excludedPlaces.set(placeId, placeName);
            saveExcludedPlacesToLocalStorage();
            showTemporaryMessage("Lugar excluido de futuras búsquedas.", 3000, 'success');

            if (row) {
                // Reutilizamos la lógica del botón "Aplicar" para unificar el feedback visual
                const actionButtons = row.querySelectorAll('td:last-child button');
                actionButtons.forEach(btn => {
                    btn.disabled = true;
                    btn.style.cursor = 'not-allowed';
                    btn.style.opacity = '0.5';
                });
                const mainButton = row.querySelector('button[title="Aplicado"], button[title="Aplicar sugerencia"]');
                if(mainButton){
                    mainButton.innerHTML = '🚫';
                    mainButton.style.backgroundColor = '#dc3545';
                    mainButton.style.color = 'white';
                    mainButton.style.opacity = '1';
                    mainButton.title = 'Excluido';
                }
                updateInconsistenciesCount(-1);
            }
            confirmModal.remove();
        });

        buttonWrapper.appendChild(cancelBtn);
        buttonWrapper.appendChild(confirmExcludeBtn);
        confirmModal.appendChild(buttonWrapper);
        document.body.appendChild(confirmModal);
    }


    async function handleAiRequestForRow(brainButton, row, placeId, originalName)
    {
        const suggestionTextarea = row.querySelector('.replacement-input');
        const aiContainer = document.getElementById(`ai-suggestion-container-${placeId}`);
        if (!aiContainer || !suggestionTextarea) return;
        row.dataset.aiProcessing = 'true';
        try {
            brainButton.innerHTML = '🧠...';
            brainButton.disabled = true;
            aiContainer.innerHTML = '';
            const loadingContainer = document.createElement('div');
            loadingContainer.style.display = 'flex'; loadingContainer.style.alignItems = 'center'; loadingContainer.style.gap = '8px'; loadingContainer.style.color = '#555'; loadingContainer.style.fontSize = '12px';
            const spinner = document.createElement('div');
            spinner.style.width = '16px'; spinner.style.height = '16px'; spinner.style.border = '2px solid #ccc'; spinner.style.borderTop = '2px solid #00796b'; spinner.style.borderRadius = '50%'; spinner.style.animation = 'pln-spin 0.8s linear infinite';
            const loadingText = document.createElement('span');
            loadingText.textContent = 'Procesando...';
            loadingContainer.appendChild(spinner); loadingContainer.appendChild(loadingText); aiContainer.appendChild(loadingContainer);

            let nameForAI = originalName;
            if (typeof aplicarReemplazosDefinidos === 'function' && typeof replacementWords === 'object')
            {
                nameForAI = aplicarReemplazosDefinidos(nameForAI, replacementWords);
            }
            if (typeof applySwapRules === 'function')
            {
                nameForAI = applySwapRules(nameForAI);
            }

            const categoryKeysForAI = window.dynamicCategoryRules.map(rule => rule.categoryKey).filter(Boolean);
            const aiSuggestions = await PLNCore.ai.getSuggestions(nameForAI, categoryKeysForAI);

            aiContainer.innerHTML = '';

            if (!aiSuggestions || aiSuggestions.error) {
                const errorText = aiSuggestions ? (aiSuggestions.error || aiSuggestions.details) : "Error desconocido.";
                aiContainer.innerHTML = `<div style="color:red; font-size:12px; font-weight:bold;">❌ ${errorText}</div>`;
                brainButton.disabled = false; brainButton.innerHTML = '🧠';
                return;
            }

            let finalSuggestion = aiSuggestions.normalizedName;
            if (typeof plnApplyExclusions === 'function') {
                finalSuggestion = plnApplyExclusions(finalSuggestion);
            }

            const currentSuggestedName = suggestionTextarea.value;

            if (finalSuggestion.trim().toLowerCase() === currentSuggestedName.trim().toLowerCase() && !aiSuggestions.suggestedCategory) {
                brainButton.innerHTML = '✔️';
                brainButton.disabled = true;
                aiContainer.innerHTML = `<div style="font-weight:bold; color:green; margin: 8px;">✔ El nombre ya es correcto.</div>`;
            } else {
                brainButton.innerHTML = '🧠';
                brainButton.disabled = true;

                const suggestionBox = document.createElement('div');
                suggestionBox.style.padding = '8px'; suggestionBox.style.borderRadius = '5px'; suggestionBox.style.border = `1px solid #00796b`; suggestionBox.style.background = '#f8f9fa';

                const suggestionContent = document.createElement('div');
                suggestionContent.style.fontWeight = 'bold'; suggestionContent.style.marginBottom = '8px'; suggestionContent.style.color = '#007bff';
                suggestionContent.innerHTML = `<b>Nombre:</b> ${finalSuggestion}`;
                suggestionBox.appendChild(suggestionContent);
            
                const acceptButton = document.createElement('button');
                acceptButton.innerHTML = '✔ Aceptar';
                acceptButton.style.padding = '4px 8px'; acceptButton.style.fontSize = '11px'; acceptButton.style.background = '#28a745'; acceptButton.style.color = 'white'; acceptButton.style.border = 'none'; acceptButton.style.borderRadius = '4px'; acceptButton.style.cursor = 'pointer';

                acceptButton.addEventListener('click', () => {
                    const venueObj = W.model.venues.getObjectById(placeId);
                    if (!venueObj) return;

                    try
                    {
                        const UpdateObject = require("Waze/Action/UpdateObject");
                        const changes = { name: finalSuggestion };                        
                        const action = new UpdateObject(venueObj, changes);
                        W.model.actionManager.add(action);
                        recordNormalizationEvent();
                        // 1. Marcar la fila como procesada (se atenuará y se ocultará si está activado el filtro)
                        markRowAsProcessed(row, 'applied');
                        // 2. Actualizar el contador de inconsistencias
                        updateInconsistenciesCount(-1);
                        // 3. Simular clic en el botón principal para que se ponga verde (o copiar su lógica)
                        const mainApplyButton = row.querySelector('button[title="Aplicar sugerencia"]');
                        if (mainApplyButton)
                        {
                            mainApplyButton.disabled = true;
                            mainApplyButton.innerHTML = '✔️'; // Poner el check
                            mainApplyButton.style.backgroundColor = '#28a745'; // Color verde
                            mainApplyButton.style.color = 'white';
                            mainApplyButton.style.opacity = '1';
                            mainApplyButton.title = 'Aplicado';
                        }
                    
                    }
                    catch (e)
                    {
                        plnToast("Error al aplicar cambios: " + e.message);
                    }
                });
                suggestionBox.appendChild(acceptButton);
                aiContainer.appendChild(suggestionBox);
            }

        }
        finally
        {
            delete row.dataset.aiProcessing;
        }
    }

    //Función para finalizar renderizado una vez completado el análisis
    function finalizeRender(inconsistents, placesArr, allSuggestions)
    {
        const resultsPanel = document.getElementById("wme-place-inspector-panel");
        if (resultsPanel)
        {
            resultsPanel.dataset.totalScanned = placesArr.length;
        }
        // Filtrar inconsistencias reales (original !== normalized)
        // en la función finalizeRender            
        const filteredInconsistents = inconsistents.filter(place => {
            // Comparamos los strings directamente después de limpiar espacios.
            // Esto asegura que "Hotel hersua boutique" y "Hotel Hersua Boutique" se consideren diferentes.
            return (place.original || "").trim() !== (place.normalized || "").trim();
        });
        // Limpiar el mensaje de procesamiento y spinner al finalizar el análisis
        //const typeInfo = venueSDK?.typeInfo || {};
        enableScanControls();
        // Detener animación de puntos suspensivos si existe
        if (window.processingDotsInterval)
        {
            clearInterval(window.processingDotsInterval);
            window.processingDotsInterval = null;
        }
        // Refuerza el restablecimiento del botón de escaneo al entrar
        const scanBtn = document.querySelector("button[type='button']");
        if (scanBtn)
        {
            scanBtn.textContent = "Start Scan...";
            scanBtn.disabled = false;
            scanBtn.style.opacity = "1";
            scanBtn.style.cursor = "pointer";
        }
        // Verificar si el botón de escaneo existe
        const output = document.querySelector("#wme-place-inspector-output");
        if (!output)
        {
        plnLog('error',"[WME_PLN]❌ No se pudo montar el panel flotante. Revisar estructura del DOM.");
            plnToast("Hubo un problema al mostrar los resultados. Intenta recargar la página.");
            return;
        }
        // Limpiar el mensaje de procesamiento y spinner
        const undoRedoHandler = function()
        {// Maneja el evento de deshacer/rehacer
            if (floatingPanelElement && floatingPanelElement.style.display !== 'none')
            {
                waitForWazeAPI(() =>
                {
                    const places = getVisiblePlaces();
                    renderPlacesInFloatingPanel(places); // Esto mostrará el panel de "procesando" y luego resultados
                    reactivateAllActionButtons(); // No necesitamos setTimeout aquí si renderPlacesInFloatingPanel es síncrono.
                });
            }
            else
            {
                plnLog('ui', "[WME PLN] Undo/Redo: Panel de resultados no visible, no se re-escanea.");
            }
        };
        // Objeto para almacenar referencias de listeners para desregistro
        if (!window._wmePlnUndoRedoListeners)
        {
            window._wmePlnUndoRedoListeners = {};
        }
        // Desregistrar listeners previos si existen
        if (window._wmePlnUndoRedoListeners.undo)
        {
            W.model.actionManager.events.unregister("afterundoaction", null, window._wmePlnUndoRedoListeners.undo);
        }
        if (window._wmePlnUndoRedoListeners.redo)
        {
            W.model.actionManager.events.unregister("afterredoaction", null, window._wmePlnUndoRedoListeners.redo);
        }
        // Registrar nuevos listeners
        W.model.actionManager.events.register("afterundoaction", null, undoRedoHandler);
        W.model.actionManager.events.register("afterredoaction", null, undoRedoHandler);
        // Almacenar referencias para poder desregistrar en el futuro
        window._wmePlnUndoRedoListeners.undo = undoRedoHandler;
        window._wmePlnUndoRedoListeners.redo = undoRedoHandler;
        // Esta llamada se hace ANTES de limpiar el output. El primer argumento es el estado, el segundo es el número de inconsistencias.
        createFloatingPanel("results", filteredInconsistents.length);
        // Si no hay inconsistencias reales, retornar antes del renderizado de la tabla
        if (filteredInconsistents.length === 0) {
            // Limpiar el mensaje de procesamiento y spinner
            if (output)
            {
                output.innerHTML = `<div style='color:green; padding:10px;'>✔ Todos los lugares visibles están correctamente normalizados o excluidos.</div>`;
            }
            // Ocultar botón de alternar panel si existe
            const toggleBtn = document.getElementById('pln-toggle-hidden-btn');
            if (toggleBtn)
            {
                toggleBtn.style.display = 'none';
            }
            const existingOverlay = document.getElementById("scanSpinnerOverlay");
            if (existingOverlay) existingOverlay.remove();
            const progressBarInnerTab = document.getElementById("progressBarInnerTab");
            const progressBarTextTab = document.getElementById("progressBarTextTab");
            if (progressBarInnerTab && progressBarTextTab)
            {
                progressBarInnerTab.style.width = "100%";
                progressBarTextTab.textContent = `Progreso: 100% (${placesArr.length}/${placesArr.length})`;
            }
            const outputTab = document.getElementById("wme-normalization-tab-output");
            if (outputTab)
            {
                outputTab.innerHTML = `✔ Todos los nombres están normalizados. Se analizaron ${placesArr.length} lugares.`;
                outputTab.style.color = "green";
                outputTab.style.fontWeight = "bold";
            }
            const scanBtn = document.querySelector("button[type='button']");
            if (scanBtn)
            {
                scanBtn.textContent = "Start Scan...";
                scanBtn.disabled = false;
                scanBtn.style.opacity = "1";
                scanBtn.style.cursor = "pointer";
                const iconCheck = document.createElement("span");
                iconCheck.textContent = " ✔";
                iconCheck.style.marginLeft = "8px";
                iconCheck.style.color = "green";
                scanBtn.appendChild(iconCheck);
            }
            return;
        }
        // Limitar a 30 resultados y mostrar advertencia si excede
        const maxRenderLimit = 30;
        const totalInconsistentsOriginal = filteredInconsistents.length; // Guardar el total original
        let isLimited = false; // Declarar e inicializar isLimited
        // Si hay más de 30 resultados, limitar a 30 y mostrar mensaje
        let inconsistentsToRender = filteredInconsistents;
        if (totalInconsistentsOriginal > maxRenderLimit)
        {
            inconsistentsToRender = filteredInconsistents.slice(0, maxRenderLimit);
            isLimited = true; // Establecer isLimited a true si se aplica el límite
            // Mostrar mensaje de advertencia si se aplica el límite
            if (!sessionStorage.getItem("popupShown"))
            {
                const modalLimit = document.createElement("div"); // Renombrado a modalLimit para claridad
                modalLimit.style.position = "fixed";
                modalLimit.style.top = "50%";
                modalLimit.style.left = "50%";
                modalLimit.style.transform = "translate(-50%, -50%)";
                modalLimit.style.background = "#fff";
                modalLimit.style.border = "1px solid #ccc";
                modalLimit.style.padding = "20px";
                modalLimit.style.zIndex = "10007"; // <<<<<<< Z-INDEX AUMENTADO
                modalLimit.style.width = "400px";
                modalLimit.style.boxShadow = "0 0 15px rgba(0,0,0,0.3)";
                modalLimit.style.borderRadius = "8px";
                modalLimit.style.fontFamily = "sans-serif";
                // Fondo suave azul y mejor presentación
                modalLimit.style.backgroundColor = "#f0f8ff";
                modalLimit.style.border = "1px solid #aad";
                modalLimit.style.boxShadow = "0 0 10px rgba(0, 123, 255, 0.2)";
                // --- Insertar ícono visual de información arriba del mensaje ---
                const iconInfo = document.createElement("div"); // Renombrado
                iconInfo.innerHTML = "ℹ️";
                iconInfo.style.fontSize = "24px";
                iconInfo.style.marginBottom = "10px";
                modalLimit.appendChild(iconInfo);
                // Contenedor del mensaje
                const message = document.createElement("p");
                message.innerHTML = `Se encontraron <strong>${
                totalInconsistentsOriginal}</strong> lugares con nombres no normalizados.<br><br>Solo se mostrarán los primeros <strong>${
                maxRenderLimit}</strong>.<br><br>Una vez corrijas estos, presiona nuevamente <strong>'Start Scan...'</strong> para continuar con el análisis del resto.`;
                message.style.marginBottom = "20px";
                modalLimit.appendChild(message);
                // Botón de aceptar
                const acceptBtn = document.createElement("button");
                acceptBtn.textContent = "Aceptar";
                acceptBtn.style.padding = "6px 12px";
                acceptBtn.style.cursor = "pointer";
                acceptBtn.style.backgroundColor = "#007bff";
                acceptBtn.style.color = "#fff";
                acceptBtn.style.border = "none";
                acceptBtn.style.borderRadius = "4px";
                acceptBtn.addEventListener("click", () => {sessionStorage.setItem("popupShown", "true");
                    modalLimit.remove();
                });
                modalLimit.appendChild(acceptBtn);
                document.body.appendChild(modalLimit); // Se añade al body, así que el z-index debería funcionar globalmente
            }
        }
        // Llamar a la función para detectar y alertar nombres duplicados
        detectAndAlertDuplicateNames(inconsistentsToRender);

        // Crear un contenedor para los elementos fijos de la cabecera del panel de resultados
        const fixedHeaderContainer = document.createElement("div");

        fixedHeaderContainer.style.background = "#fff"; // Fondo para que no se vea el scroll debajo
        fixedHeaderContainer.style.padding = "0 10px 8px 10px"; // Padding para espacio y que no esté pegado
        fixedHeaderContainer.style.borderBottom = "1px solid #ccc"; // Un borde para separarlo de la tabla
        fixedHeaderContainer.style.zIndex = "11"; // Asegurarse de que esté por encima de la tabla
        // Añadir Estas Dos Líneas Clave Al FixedHeaderContainer
        fixedHeaderContainer.style.position = "sticky"; // Hacer Que Este Contenedor Sea Sticky
        fixedHeaderContainer.style.top = "0";            // Pegado A La Parte Superior Del Contenedor De Scroll

        // =======================================================
        // INICIO DEL BLOQUE CORREGIDO
        // =======================================================
        // 1. Contenedor Flex para el texto y el botón
        const headerControlsContainer = document.createElement("div");
        headerControlsContainer.style.display = "flex";
        // LA SIGUIENTE LÍNEA ES EL CAMBIO PRINCIPAL:
        headerControlsContainer.style.justifyContent = "flex-start"; // Alinea los elementos al inicio
        headerControlsContainer.style.alignItems = "center";
        headerControlsContainer.style.gap = "15px"; // Mantiene el espacio entre texto y botón

        const resultsCounter = document.createElement("div");
        resultsCounter.className = "results-counter-display";
        resultsCounter.style.fontSize = "13px";
        resultsCounter.style.color = "#555";
        resultsCounter.style.textAlign = "left";

        resultsCounter.dataset.currentCount = inconsistentsToRender.length;
        resultsCounter.dataset.totalOriginal = totalInconsistentsOriginal;
        resultsCounter.dataset.maxRenderLimit = maxRenderLimit;

        if (totalInconsistentsOriginal > 0)
        {
            resultsCounter.innerHTML = `Inconsistencias encontradas: <b style="color: #ff0000;">${totalInconsistentsOriginal}</b> de <b>${placesArr.length}</b> analizados.`;
            headerControlsContainer.appendChild(resultsCounter);
        }
        else
        {
            const outputDiv = document.querySelector("#wme-place-inspector-output");
            if (outputDiv)
            {
                outputDiv.innerHTML = `<div style='color:green; padding:10px;'>✔ Todos los lugares visibles están correctamente normalizados o excluidos.</div>`;
            }
        }

        // 2. Lógica del botón (sin cambios respecto a la corrección anterior)
        // En la función donde creas el botón toggle
        let toggleBtn = document.getElementById('pln-toggle-hidden-btn');
        if (!toggleBtn)
        {
            toggleBtn = document.createElement("button");
            toggleBtn.id = 'pln-toggle-hidden-btn';
            toggleBtn.style.padding = "5px 10px";
            toggleBtn.style.marginLeft = "15px";
            toggleBtn.dataset.state = 'hidden'; // IMPORTANTE: Iniciar en 'hidden' para ocultar automáticamente

            toggleBtn.addEventListener('click', function() {
                const currentState = this.dataset.state;
                if (currentState === 'shown')
                {
                    // Cambiar a ocultos
                    this.textContent = "Mostrar procesados";
                    document.body.classList.add('pln-hide-normalized-rows');
                    this.dataset.state = 'hidden';
                }
                else
                {
                    // Cambiar a visibles
                    this.textContent = "Ocultar procesados";
                    document.body.classList.remove('pln-hide-normalized-rows');
                    this.dataset.state = 'shown';
                }
            });

            // Establecer texto inicial según el estado
            toggleBtn.textContent = "Mostrar procesados";
        }

        // Sincronizar el texto del botón con su estado actual cada vez que se renderiza
        if (toggleBtn.dataset.state === 'shown') {
            toggleBtn.textContent = 'Ocultar Normalizados';
        } else {
            toggleBtn.textContent = 'Mostrar Normalizados';
        }

        if (totalInconsistentsOriginal > 0)
        {
            headerControlsContainer.appendChild(toggleBtn);
            toggleBtn.style.display = 'inline-block'; // O simplemente ''
        }

        fixedHeaderContainer.appendChild(headerControlsContainer);

        if (output)
        {
            output.style.display = 'flex';
            output.style.flexDirection = 'column';
            output.style.position = 'relative';
            output.appendChild(fixedHeaderContainer);
        }
        const table = document.createElement("table");
        table.style.width = "100%";
        table.style.borderCollapse = "collapse";
        table.style.fontSize = "12px";
        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");
        [
            "N°",
            "Perma",
            "Tipo/Ciudad",
            "LL",
            "Editor",
            "Nombre Actual",
            "⚠️",
            "Nombre Sugerido",
            "Sugerencias<br>de reemplazo",
            "Categoría",
            "Categoría<br>Recomendada",
            "Acción"
        ].forEach(header =>
        {
            const th = document.createElement("th");
            th.innerHTML = header;
            th.style.borderBottom = "1px solid #ccc";
            th.style.padding = "4px";
            th.style.textAlign = "center";
            th.style.fontSize = "14px";
            if (header === "N°")
            {
                th.style.width = "30px";
            }
            else if (header === "LL")
            {
                th.title = "Nivel de Bloqueo (Lock Level)";
                th.style.width = "40px";
            }
            else if (header === "Perma" || header === "Tipo/Ciudad")
            {
                th.style.width = "65px";
            }
            else if (header === "⚠️")
            {
                th.title = "Alertas y advertencias";
                th.style.width = "30px";
            }
            else if (header === "Categoría")
            {
                th.style.width = "130px";
            }
            else if (header === "Categoría<br>Recomendada" || header === "Sugerencias<br>de reemplazo")
            {
                th.style.width = "180px";
            }
            else if (header === "Editor")
            {
                th.style.width = "100px";
            }
            else if (header === "Acción")
            {
                th.style.width = "100px";
            }
            else if (header === "Nombre Actual" || header === "Nombre Sugerido")
            {
                th.style.width = "270px";
            }
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);
        thead.style.position = "sticky";
        thead.style.top = "0";
        thead.style.background = "#f1f1f1";
        thead.style.zIndex = "10";
        headerRow.style.backgroundColor = "#003366";
        headerRow.style.color = "#ffffff";
        const tbody = document.createElement("tbody");


        let activeAiPopover = null; // Variable global para controlar el popover activo
        inconsistentsToRender.forEach(({ lockRankEmoji, id, original, normalized, editor, cityIcon, cityTitle, hasCity, currentCategoryName, currentCategoryIcon, currentCategoryTitle, currentCategoryKey, dynamicCategorySuggestions, venueSDKForRender, isDuplicate = false, duplicatePartners = [], typeInfo, areaMeters, hasOverlappingHours }, index) =>
        {
            const progressPercent =  Math.floor(((index + 1) / inconsistentsToRender.length) * 100);
            const progressBarInnerTab = document.getElementById("progressBarInnerTab");
            const progressBarTextTab =  document.getElementById("progressBarTextTab");
            if (progressBarInnerTab && progressBarTextTab)
            {
                progressBarInnerTab.style.width = `${progressPercent}%`;
                progressBarTextTab.textContent = `Progreso: ${progressPercent}% (${index + 1}/${inconsistents.length})`;
            }
            const row = document.createElement("tr");
            row.querySelectorAll("td").forEach(td => td.style.verticalAlign = "top");
            row.dataset.placeId = id;
            const numberCell = document.createElement("td");
            numberCell.textContent = index + 1;
            numberCell.style.textAlign = "center";
            numberCell.style.padding = "4px";
            row.appendChild(numberCell);
            const permalinkCell = document.createElement("td");
            const link = document.createElement("a");
            link.href = "#";
            link.addEventListener("click", (e) =>
            {
                e.preventDefault();
                const venueObj = W.model.venues.getObjectById(id);
                const venueSDKForUse = venueSDKForRender;

                let targetLat = null;
                let targetLon = null;

                if (venueSDKForUse && venueSDKForUse.geometry && Array.isArray(venueSDKForUse.geometry.coordinates) && venueSDKForUse.geometry.coordinates.length >= 2) {
                    targetLon = venueSDKForUse.geometry.coordinates[0];
                    targetLat = venueSDKForUse.geometry.coordinates[1];
                }

                if ((targetLat === null || targetLon === null) && venueObj && typeof venueObj.getOLGeometry === 'function') {
                    try {
                        const geometryOL = venueObj.getOLGeometry();
                        if (geometryOL && typeof geometryOL.getCentroid === 'function') {
                            const centroidOL = geometryOL.getCentroid();
                            if (typeof OpenLayers !== 'undefined' && OpenLayers.Projection) {
                                const transformedPoint = new OpenLayers.Geometry.Point(centroidOL.x, centroidOL.y).transform(
                                    new OpenLayers.Projection("EPSG:3857"),
                                    new OpenLayers.Projection("EPSG:4326")
                                );
                                targetLat = transformedPoint.y;
                                targetLon = transformedPoint.x;
                            } else {
                                targetLat = centroidOL.y;
                                targetLon = centroidOL.x;
                            }
                        }
                    } catch (e) {
                        plnLog('error',"[WME PLN] Error al obtener/transformar geometría OL para navegación:", e);
                    }
                }

                let navigated = false;

                if (venueObj && W.selectionManager && typeof W.selectionManager.select === "function")
                {
                    W.selectionManager.select(venueObj);
                    navigated = true;
                }
                else if (venueObj && W.selectionManager && typeof W.selectionManager.setSelectedModels === "function")
                {
                    W.selectionManager.setSelectedModels([venueObj]);
                    navigated = true;
                }

                if (!navigated)
                {
                    const confirmOpen = confirm(`El lugar "${original}" (ID: ${id}) no se pudo seleccionar o centrar directamente. ¿Deseas abrirlo en una nueva pestaña del editor?`);
                    if (confirmOpen)
                    {
                        const wmeUrl = `https://www.waze.com/editor?env=row&venueId=${id}`;
                        window.open(wmeUrl, '_blank');
                    }
                    else
                    {
                        showTemporaryMessage("El lugar podría estar fuera de vista o no cargado.", 4000, 'warning');
                    }
                }
                else
                {
                    showTemporaryMessage("Presentando detalles del lugar...", 2000, 'info');
                }
            });
            link.title = "Seleccionar lugar en el mapa";
            link.textContent = "🔗";
            permalinkCell.appendChild(link);
            permalinkCell.style.padding = "4px";
            permalinkCell.style.fontSize = "18px";
            permalinkCell.style.textAlign = "center";
            permalinkCell.style.width = "65px";
            row.appendChild(permalinkCell);

            const typeCityCell = document.createElement("td");
            typeCityCell.style.padding = "4px";
            typeCityCell.style.width = "65px";
            typeCityCell.style.verticalAlign = "middle";

            const cellContentWrapper = document.createElement("div");
            cellContentWrapper.style.display = "flex";
            cellContentWrapper.style.justifyContent = "space-around";
            cellContentWrapper.style.alignItems = "center";

            const typeContainer = document.createElement("div");
            typeContainer.style.display = "flex";
            typeContainer.style.flexDirection = "column";
            typeContainer.style.alignItems = "center";
            typeContainer.style.justifyContent = "center";
            typeContainer.style.gap = "2px";

            const typeIconSpan = document.createElement("span");
            typeIconSpan.textContent = typeInfo.icon;
            typeIconSpan.style.fontSize = "20px";

            let tooltipText = `Tipo: ${typeInfo.title}`;
            typeIconSpan.title = tooltipText;

            typeContainer.appendChild(typeIconSpan);

            if (typeInfo.isArea && areaMeters !== null && areaMeters !== undefined)
            {
                const areaSpan = document.createElement("span");
                const areaFormatted = areaMeters.toLocaleString('es-ES', { maximumFractionDigits: 0 });
                areaSpan.textContent = `${areaFormatted} m²`;
                areaSpan.style.fontSize = "10px";
                areaSpan.style.fontWeight = "bold";
                areaSpan.style.textAlign = "center";
                areaSpan.style.lineHeight = "1";
                areaSpan.style.whiteSpace = "nowrap";

                if (areaMeters < 400)
                {
                    areaSpan.style.color = "red";
                    areaSpan.classList.add("area-blink");
                }
                else
                {
                    areaSpan.style.color = "blue";
                }
                areaSpan.title = `Área: ${areaFormatted} m²`;
                typeContainer.appendChild(areaSpan);
            }
            cellContentWrapper.appendChild(typeContainer);

            const cityStatusIconSpan = document.createElement("span");
            cityStatusIconSpan.className = 'city-status-icon';
            cityStatusIconSpan.style.fontSize = "18px";
            cityStatusIconSpan.style.cursor = "pointer";

            if (hasCity)
            {
                cityStatusIconSpan.innerHTML = '✅';
                cityStatusIconSpan.style.color = 'green';
                cityStatusIconSpan.title = cityTitle;
            }
            else
            {
                cityStatusIconSpan.innerHTML = '🚩';
                cityStatusIconSpan.style.color = 'red';
                cityStatusIconSpan.title = cityTitle;

                cityStatusIconSpan.addEventListener("click", async () =>
                {
                    const coords = getPlaceCoordinates(W.model.venues.getObjectById(id), venueSDKForRender);
                    const placeLat = coords.lat;
                    const placeLon = coords.lon;

                    if (placeLat === null || placeLon === null)
                    {
                        plnToast("No se pudieron obtener las coordenadas del lugar.");
                        return;
                    }
                    const allCities = Object.values(W.model.cities.objects)
                    .filter(city =>
                        city &&
                        city.attributes &&
                        typeof city.attributes.name === 'string' &&
                        city.attributes.name.trim() !== ''
                    );
                    const citiesWithDistance = allCities.map(city =>
                    {
                        if (!city.attributes.geoJSONGeometry ||
                            !Array.isArray(city.attributes.geoJSONGeometry.coordinates) ||
                            city.attributes.geoJSONGeometry.coordinates.length < 2)
                            return null;
                        const cityLon = city.attributes.geoJSONGeometry.coordinates[0];
                        const cityLat = city.attributes.geoJSONGeometry.coordinates[1];
                        const distanceInMeters = calculateDistance(placeLat, placeLon, cityLat, cityLon);
                        const distanceInKm = distanceInMeters / 1000;
                        return {
                            name: city.attributes.name,
                            distance: distanceInKm,
                            cityId: city.getID()
                        };
                    }).filter(Boolean);
                    const closestCities = citiesWithDistance.sort((a, b) => a.distance - b.distance).slice(0, 5);
                    const modal = document.createElement("div");
                    modal.style.position = "fixed";
                    modal.style.top = "50%";
                    modal.style.left = "50%";
                    modal.style.transform = "translate(-50%, -50%)";
                    modal.style.background = "#fff";
                    modal.style.border = "1px solid #aad";
                    modal.style.padding = "28px 32px 20px 32px";
                    modal.style.zIndex = "20000";
                    modal.style.boxShadow = "0 4px 24px rgba(0,0,0,0.18)";
                    modal.style.fontFamily = "sans-serif";
                    modal.style.borderRadius = "10px";
                    modal.style.textAlign = "center";
                    modal.style.minWidth = "340px";

                    const iconElement = document.createElement("div");
                    iconElement.innerHTML = "🏙️";
                    iconElement.style.fontSize = "38px";
                    iconElement.style.marginBottom = "10px";
                    modal.appendChild(iconElement);

                    const messageTitle = document.createElement("div");
                    messageTitle.innerHTML = `<b>Asignar ciudad al lugar</b>`;
                    messageTitle.style.fontSize = "20px";
                    messageTitle.style.marginBottom = "8px";
                    modal.appendChild(messageTitle);

                    const listDiv = document.createElement("div");
                    listDiv.style.textAlign = "left";
                    listDiv.style.marginTop = "10px";

                    if (closestCities.length === 0)
                    {
                        const noCityLine = document.createElement("div");
                        noCityLine.textContent = "No se encontraron ciudades cercanas para mostrar.";
                        noCityLine.style.color = "#888";
                        listDiv.appendChild(noCityLine);
                    }
                    else
                    {
                        closestCities.forEach((city, idx) =>
                        {
                            const cityLine = document.createElement("div");
                            cityLine.style.marginBottom = "8px";
                            cityLine.style.display = "flex";
                            cityLine.style.alignItems = "center";

                            const radioInput = document.createElement("input");
                            radioInput.type = "radio";
                            radioInput.name = `city-selection-${id}`;
                            radioInput.value = city.cityId;
                            radioInput.id = `city-radio-${city.cityId}`;
                            radioInput.style.marginRight = "10px";
                            radioInput.style.marginTop = "0";
                            if (idx === 0) radioInput.checked = true;

                            const radioLabel = document.createElement("label");
                            radioLabel.htmlFor = `city-radio-${city.cityId}`;
                            radioLabel.style.cursor = "pointer";
                            radioLabel.innerHTML = `<b>${city.name}</b> <span style="color: #666; font-size: 11px;">(ID: ${city.cityId})</span> <span style="color: #007bff;">${city.distance.toFixed(1)} km</span>`;
                            cityLine.appendChild(radioInput);
                            cityLine.appendChild(radioLabel);
                            listDiv.appendChild(cityLine);
                        });
                    }
                    modal.appendChild(listDiv);

                    const buttonWrapper = document.createElement("div");
                    buttonWrapper.style.display = "flex";
                    buttonWrapper.style.justifyContent = "flex-end";
                    buttonWrapper.style.gap = "12px";
                    buttonWrapper.style.marginTop = "20px";

                    const applyBtn = document.createElement("button");
                    applyBtn.textContent = "Aplicar Ciudad";
                    applyBtn.style.padding = "8px 16px";
                    applyBtn.style.background = "#28a745";
                    applyBtn.style.color = "#fff";
                    applyBtn.style.border = "none";
                    applyBtn.style.borderRadius = "4px";
                    applyBtn.style.cursor = "pointer";
                    applyBtn.style.fontWeight = "bold";

                    applyBtn.addEventListener('click', () => {
                        const selectedRadio = modal.querySelector(`input[name="city-selection-${id}"]:checked`);
                        if (!selectedRadio) {
                            plnToast("Por favor, selecciona una ciudad de la lista.");
                            return;
                        }
                        const selectedCityId = parseInt(selectedRadio.value, 10);
                        const selectedCityName = selectedRadio.parentElement.querySelector('label b').textContent;

                        const venueToUpdate = W.model.venues.getObjectById(id);
                        if (!venueToUpdate)
                        {
                            plnToast("Error: No se pudo encontrar el lugar para actualizar. Puede que ya no esté visible.");
                            modal.remove();
                            return;
                        }
                        try
                        {
                            const UpdateObject = require("Waze/Action/UpdateObject");
                            const action = new UpdateObject(venueToUpdate, { cityID: selectedCityId });
                            W.model.actionManager.add(action);

                            const row = document.querySelector(`tr[data-place-id="${id}"]`);
                            if (row)
                            {
                                row.dataset.addressChanged = 'true';
                                const iconToUpdate = row.querySelector('.city-status-icon');
                                if (iconToUpdate)
                                {
                                    iconToUpdate.innerHTML = '✅';
                                    iconToUpdate.style.color = 'green';
                                    iconToUpdate.title = `Ciudad asignada: ${selectedCityName}`;
                                    iconToUpdate.style.pointerEvents = 'none';
                                }
                                updateApplyButtonState(row, original);
                            }
                            modal.remove();
                            showTemporaryMessage("Ciudad asignada correctamente. No olvides Guardar los cambios.", 4000, 'success');

                        }
                        catch (e)
                        {
                            plnLog('error',"[WME PLN] Error al crear o ejecutar la acción de actualizar ciudad:", e);
                            plnToast("Ocurrió un error al intentar asignar la ciudad: " + e.message);
                        }
                    });
                    const closeBtn = document.createElement("button");
                    closeBtn.textContent = "Cerrar";
                    closeBtn.style.padding = "8px 16px";
                    closeBtn.style.background = "#888";
                    closeBtn.style.color = "#fff";
                    closeBtn.style.border = "none";
                    closeBtn.style.borderRadius = "4px";
                    closeBtn.style.cursor = "pointer";
                    closeBtn.style.fontWeight = "bold";
                    closeBtn.addEventListener("click", () => modal.remove());

                    buttonWrapper.appendChild(applyBtn);
                    buttonWrapper.appendChild(closeBtn);
                    modal.appendChild(buttonWrapper);

                    closeBtn.style.padding = "8px 16px";
                    closeBtn.style.background = "#888";
                    closeBtn.style.color = "#fff";
                    closeBtn.style.border = "none";
                    closeBtn.style.borderRadius = "4px";
                    closeBtn.style.cursor = "pointer";
                    closeBtn.style.fontWeight = "bold";
                    closeBtn.addEventListener("click", () => modal.remove());

                    buttonWrapper.appendChild(applyBtn);
                    buttonWrapper.appendChild(closeBtn);
                    modal.appendChild(buttonWrapper);

                    document.body.appendChild(modal);
                });
            }

            cellContentWrapper.appendChild(cityStatusIconSpan);
            typeCityCell.appendChild(cellContentWrapper);
            row.appendChild(typeCityCell);
            const lockCell = document.createElement("td");
            lockCell.textContent = lockRankEmoji;
            lockCell.style.textAlign = "center";
            lockCell.style.padding = "4px";
            lockCell.style.width = "40px";
            lockCell.style.fontSize = "18px";
            row.appendChild(lockCell);
            const editorCell = document.createElement("td");
            editorCell.textContent =  editor || "Desconocido";
            editorCell.title = "Último editor";
            editorCell.style.padding = "4px";
            editorCell.style.width = "140px";
            editorCell.style.textAlign = "center";
            row.appendChild(editorCell);
            const originalCell = document.createElement("td");
            const inputOriginal = document.createElement("textarea");
            inputOriginal.rows = 3; inputOriginal.readOnly = true;
            inputOriginal.style.whiteSpace = "pre-wrap";
            const venueLive = W.model.venues.getObjectById(id);
            const currentLiveName = venueLive?.attributes?.name?.value || venueLive?.attributes?.name || "";
            inputOriginal.value = currentLiveName || original;
            if (currentLiveName.trim().toLowerCase() !== normalized.trim().toLowerCase())
            {
                inputOriginal.style.border = "1px solid red";
                inputOriginal.title = "Este nombre es distinto del original mostrado en el panel";
            }
            inputOriginal.disabled = true;
            inputOriginal.style.width = "270px";
            inputOriginal.style.backgroundColor = "#eee";
            originalCell.style.padding = "4px";
            originalCell.style.width = "270px";
            originalCell.style.display      = "flex";
            originalCell.style.alignItems   = "flex-start";
            originalCell.style.verticalAlign = "middle";
            inputOriginal.style.flex       = "1";
            inputOriginal.style.height     = "100%";
            inputOriginal.style.boxSizing  = "border-box";
            originalCell.appendChild(inputOriginal);
            row.appendChild(originalCell);
            const alertCell = document.createElement("td");
            alertCell.style.width = "30px";
            alertCell.style.textAlign = "center";
            alertCell.style.verticalAlign = "middle";
            alertCell.style.padding = "4px";
            // Lógica para el icono de advertencia por duplicados
            if (isDuplicate)
            {
                const warningIcon = document.createElement("span");
                warningIcon.textContent = " ⚠️";
                warningIcon.style.fontSize = "16px";
                let tooltipText = `Nombre de lugar duplicado cercano.`;
                if (duplicatePartners && duplicatePartners.length > 0)
                {
                    const partnerDetails = duplicatePartners.map(p => `Línea ${p.line}: "${p.originalName}"`).join(", ");
                    tooltipText += ` Duplicado(s) con: ${partnerDetails}.`;
                }
                else
                {
                    tooltipText += ` No se encontraron otros duplicados cercanos específicos.`;
                }
                warningIcon.title = tooltipText;
                alertCell.appendChild(warningIcon);
            }
            // Lógica para el icono de advertencia por horarios que se cruzan
            if (hasOverlappingHours)
            {
                const clockIcon = document.createElement("span");
                clockIcon.textContent = " ⏰";
                clockIcon.style.fontSize = "16px";
                clockIcon.style.color = "red";
                clockIcon.title = "¡Alerta! Este lugar tiene horarios que se cruzan.";
                alertCell.appendChild(clockIcon);
            }

            row.appendChild(alertCell);
            const suggestionCell = document.createElement("td");
            suggestionCell.style.display = "flex";
            suggestionCell.style.alignItems = "flex-start";
            suggestionCell.style.justifyContent = "flex-start";
            suggestionCell.style.padding = "4px";
            suggestionCell.style.width = "270px";
            const inputReplacement = document.createElement("textarea");
            inputReplacement.className = 'replacement-input';
            try
            {
                inputReplacement.value = normalized;
            }
            catch (_)
            {
                inputReplacement.value = normalized;
            }
            inputReplacement.style.width = "100%";
            inputReplacement.style.height = "100%";
            inputReplacement.style.boxSizing = "border-box";
            inputReplacement.style.whiteSpace = "pre-wrap";
            inputReplacement.rows = 3;
            suggestionCell.appendChild(inputReplacement);

            const brainButton = document.createElement('button');
            brainButton.innerHTML = '🧠';
            brainButton.className = 'pln-ai-brain-btn';
            brainButton.title = 'Obtener sugerencia de la IA para este lugar';
            brainButton.style.display = 'inline-block';
            brainButton.style.marginLeft = '5px';
            brainButton.style.padding = '5px';
            brainButton.style.verticalAlign = 'top';
            brainButton.style.background = '#f0f0f0';
            brainButton.style.border = '1px solid #ccc';
            brainButton.style.borderRadius = '4px';
            brainButton.style.cursor = 'pointer';

            suggestionCell.appendChild(brainButton); // Asegúrate que esta línea esté después de la creación del botón

            brainButton.addEventListener('click', () => {
                const currentRow = brainButton.closest('tr');
                const originalName = currentRow.querySelector('td:nth-child(6) textarea').value;
                const placeId = currentRow.dataset.placeId;

                // Llamada a la función central que maneja la IA
                handleAiRequestForRow(brainButton, currentRow, placeId, originalName);
            });


            function debounce(func, delay)
            {
                let timeout;
                return function (...args)
                {
                    clearTimeout(timeout);
                    timeout = setTimeout(() => func.apply(this, args), delay);
                };
            }
            const checkAndUpdateApplyButton = () =>
            {
                const nameIsDifferent = inputReplacement.value.trim() !== original.trim();
                const categoryWasChanged = row.dataset.categoryChanged === 'true';
                if (nameIsDifferent || categoryWasChanged)
                {
                    applyButton.disabled = false;
                    applyButton.style.opacity = "1";
                    const successIcon = applyButtonWrapper.querySelector('span');
                    if (successIcon) successIcon.remove();
                }
                else
                {
                    applyButton.disabled = true;
                    applyButton.style.opacity = "0.5";
                }
            };

            inputReplacement.addEventListener('input', debounce(checkAndUpdateApplyButton, 300));
            let autoApplied = false;
            if (Object.values(allSuggestions).flat().some(s => s.fuente === 'excluded' && s.similarity === 1))
            {
                autoApplied = true;
            }
            if (autoApplied)
            {
                inputReplacement.style.backgroundColor = "#c8e6c9";
                inputReplacement.title = "Reemplazo automático aplicado (palabra especial con 100% similitud)";
            }
            else if (Object.values(allSuggestions).flat().some(s => s.fuente === 'excluded'))
            {
                inputReplacement.style.backgroundColor = "#fff3cd";
                inputReplacement.title = "Contiene palabra especial reemplazada";
            }
            function debounce(func, delay)
            {
                let timeout;
                return function(...args) {
                    clearTimeout(timeout);
                    timeout = setTimeout(() => func.apply(this, args), delay);
                };
            }
            inputReplacement.addEventListener('input', debounce(() =>
            {
                if (inputReplacement.value.trim() !== original)
                {
                    applyButton.disabled = false;
                    applyButton.style.color = "";
                }
                else
                {
                    applyButton.disabled = true;
                    applyButton.style.color = "#bbb";
                }
            }, 300));
            inputOriginal.addEventListener('input', debounce(() =>
            {
            }, 300));
            const suggestionListCell = document.createElement("td");
            suggestionListCell.style.padding = "4px";
            suggestionListCell.style.width = "180px";
            const suggestionContainer = document.createElement('div');
            const palabrasYaProcesadas = new Set();
            const currentPlaceSuggestions = allSuggestions[id];
            if (currentPlaceSuggestions)
            {
                Object.entries(currentPlaceSuggestions).forEach(([originalWordForThisPlace, suggestionsArray]) =>
                {
                    if (Array.isArray(suggestionsArray))
                    {
                        suggestionsArray.forEach(s =>
                        {
                            let icono = '';
                            let textoSugerencia = '';
                            let colorFondo = '#f9f9f9';
                            let esSugerenciaValida = false;
                            let palabraAReemplazar = originalWordForThisPlace;
                            let palabraAInsertar = s.word;
                            switch (s.fuente)
                            {
                                case 'original_preserved':
                                    esSugerenciaValida = true;
                                    icono = '⚙️';
                                    textoSugerencia = `¿"${originalWordForThisPlace}" x "${s.word}"?`;
                                    colorFondo = '#f0f0f0';
                                    palabraAReemplazar = originalWordForThisPlace;
                                    palabraAInsertar = s.word;
                                    break;
                                case 'excluded':
                                    if (s.similarity < 1 || (s.similarity === 1 && originalWordForThisPlace.toLowerCase() !== s.word.toLowerCase()))
                                    {
                                        esSugerenciaValida = true;
                                        icono = '🏷️';
                                        textoSugerencia = `¿"${originalWordForThisPlace}" x "${s.word}"? (sim. ${(s.similarity * 100).toFixed(0)}%)`;
                                        colorFondo = '#f3f9ff';
                                        palabraAReemplazar = originalWordForThisPlace;
                                        palabraAInsertar = s.word;
                                        palabrasYaProcesadas.add(originalWordForThisPlace.toLowerCase());
                                    }
                                    break;
                                case 'dictionary':
                                    esSugerenciaValida = true;
                                    icono = '📘';
                                    colorFondo = '#e6ffe6';
                                    // Capitaliza la palabra sugerida desde el diccionario
                                    const capitalizedDictionaryWord = s.word.charAt(0).toUpperCase() + s.word.slice(1);
                                    textoSugerencia = `¿"${originalWordForThisPlace}" x "${capitalizedDictionaryWord}"? (sim. ${(s.similarity * 100).toFixed(0)}%)`;
                                    palabraAReemplazar = originalWordForThisPlace;
                                    palabraAInsertar = capitalizedDictionaryWord;
                                    break;

                                case 'dictionary_tilde':
                                    esSugerenciaValida = true;
                                    icono = '✍️';
                                    colorFondo = '#ffe6e6';
                                    // Capitaliza la palabra sugerida con corrección de tilde
                                    const capitalizedTildeWord = s.word.charAt(0).toUpperCase() + s.word.slice(1);
                                    textoSugerencia = `¿"${originalWordForThisPlace}" x "${capitalizedTildeWord}"? (Corregir Tilde)`;
                                    palabraAReemplazar = originalWordForThisPlace;
                                    palabraAInsertar = capitalizedTildeWord;
                                    break;
                            }
                            if (esSugerenciaValida)
                            {
                                const suggestionDiv = document.createElement("div");
                                suggestionDiv.innerHTML = `${icono} ${textoSugerencia}`;
                                suggestionDiv.style.cursor = "pointer";
                                suggestionDiv.style.padding = "2px 4px";
                                suggestionDiv.style.margin = "2px 0";
                                suggestionDiv.style.border = "1px solid #ddd";
                                suggestionDiv.style.borderRadius = "3px";
                                suggestionDiv.style.backgroundColor = colorFondo;

                                suggestionDiv.addEventListener("click", () =>
                                {
                                    const currentSuggestedValue = inputReplacement.value;
                                    const searchRegex = new RegExp("\\b" + escapeRegExp(palabraAReemplazar) + "\\b", "gi");
                                    const newSuggestedValue = currentSuggestedValue.replace(searchRegex, palabraAInsertar);
                                    if (inputReplacement.value !== newSuggestedValue)
                                    {
                                        inputReplacement.value = newSuggestedValue;
                                    }
                                    checkAndUpdateApplyButton();
                                });
                                suggestionContainer.appendChild(suggestionDiv);
                            }
                        });
                    }
                    else
                    {
                        plnLog('warn',`[WME_PLN][DEBUG] suggestionsArray para "${originalWordForThisPlace}" no es un array o es undefined:`, suggestionsArray);
                    }
                });
            }
            suggestionListCell.appendChild(suggestionContainer);
            row.appendChild(suggestionCell);
            row.appendChild(suggestionListCell);
            const categoryCell = document.createElement("td");
            categoryCell.style.padding = "4px";
            categoryCell.style.width = "130px";
            categoryCell.style.textAlign = "center";
            const currentCategoryDiv = document.createElement("div");
            currentCategoryDiv.style.display = "flex";
            currentCategoryDiv.style.flexDirection = "column";
            currentCategoryDiv.style.alignItems = "center";
            currentCategoryDiv.style.gap = "2px";
            const currentCategoryText = document.createElement("span");
            currentCategoryText.textContent = currentCategoryTitle;
            currentCategoryText.title = `Categoría Actual: ${currentCategoryTitle}`;
            currentCategoryDiv.appendChild(currentCategoryText);
            const currentCategoryIconDisplay = document.createElement("span");
            currentCategoryIconDisplay.textContent = currentCategoryIcon;
            currentCategoryIconDisplay.style.fontSize = "20px";
            currentCategoryDiv.appendChild(currentCategoryIconDisplay);
            categoryCell.appendChild(currentCategoryDiv);
            row.appendChild(categoryCell);
            const recommendedCategoryCell = document.createElement("td");
            recommendedCategoryCell.style.padding = "4px";
            recommendedCategoryCell.style.width = "180px";
            recommendedCategoryCell.style.textAlign = "left";
            const categoryDropdown = createRecommendedCategoryDropdown(
                id,
                currentCategoryKey,
                dynamicCategorySuggestions
            );
            recommendedCategoryCell.appendChild(categoryDropdown);

            // Contenedor para la sugerencia de la IA
            const aiSuggestionContainer = document.createElement('div');
            aiSuggestionContainer.id = `ai-suggestion-container-${id}`; // ID único por fila
            aiSuggestionContainer.style.marginTop = '8px';
            aiSuggestionContainer.style.minHeight = '30px'; // Espacio reservado
            recommendedCategoryCell.appendChild(aiSuggestionContainer);

            row.appendChild(recommendedCategoryCell);
            const actionCell = document.createElement("td");
            actionCell.style.padding = "4px";
            actionCell.style.width = "120px";
            const buttonGroup = document.createElement("div");
            buttonGroup.style.display = "flex";
            buttonGroup.style.flexDirection = "column";
            buttonGroup.style.gap = "4px";
            buttonGroup.style.alignItems = "flex-start";
            const commonButtonStyle = {
                width: "40px",
                height: "30px",
                minWidth: "40px",
                minHeight: "30px",
                padding: "4px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                backgroundColor: "#f0f0f0",
                color: "#555",
                cursor: "pointer",
                fontSize: "18px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                boxSizing: "border-box"
            };
            const applyButton = document.createElement("button");
            Object.assign(applyButton.style, commonButtonStyle);
            applyButton.textContent = "✔";
            applyButton.title = "Aplicar sugerencia";
            applyButton.disabled = true;
            applyButton.style.opacity = "0.5";
            const applyButtonWrapper = document.createElement("div");
            applyButtonWrapper.style.display = "flex";
            applyButtonWrapper.style.alignItems = "center";
            applyButtonWrapper.style.gap = "5px";
            applyButtonWrapper.appendChild(applyButton);
            buttonGroup.appendChild(applyButtonWrapper);
            let deleteButton = document.createElement("button");
            Object.assign(deleteButton.style, commonButtonStyle);
            deleteButton.textContent = "🗑️";
            deleteButton.title = "Eliminar lugar";
            const deleteButtonWrapper = document.createElement("div");
            Object.assign(deleteButtonWrapper.style, {
                display: "flex",
                alignItems: "center",
                gap: "5px"
            });
            deleteButtonWrapper.appendChild(deleteButton);
            buttonGroup.appendChild(deleteButtonWrapper);
            const addToExclusionBtn = document.createElement("button");
            Object.assign(addToExclusionBtn.style, commonButtonStyle);
            addToExclusionBtn.textContent = "🏷️";
            addToExclusionBtn.title = "Marcar palabra como especial (no se modifica)";
            buttonGroup.appendChild(addToExclusionBtn);
            actionCell.appendChild(buttonGroup);
            row.appendChild(actionCell);

            const excludePlaceBtn = document.createElement("button");
            Object.assign(excludePlaceBtn.style, commonButtonStyle);
            excludePlaceBtn.textContent = "📵";
            excludePlaceBtn.title = "Excluir este lugar (no aparecerá en futuras búsquedas)";
            buttonGroup.appendChild(excludePlaceBtn);

            actionCell.appendChild(buttonGroup);
            row.appendChild(actionCell);

            // Comparamos el valor actual real con el normalizado y si son idénticos,
            // añadimos la clase para ocultar la fila ANTES de que se renderice.
            // Esto elimina la condición de carrera por completo.
            const finalCurrentName = (currentLiveName || original).trim();
            const finalNormalizedName = normalized.trim();

            if (finalCurrentName === finalNormalizedName)
            {
                row.classList.add('pln-hidden-normalized');
            }
            
            applyButton.addEventListener("click", async () => {
                const row = applyButton.closest('tr');
                const venueObj = W.model.venues.getObjectById(id);

                if (!venueObj) {
                    showTemporaryMessage("Error: No se pudo encontrar el lugar.", 4000, 'error');
                    return;
                }

                const newName = inputReplacement.value.trim();
                const nameWasChanged = (newName !== (venueObj?.attributes?.name?.value || venueObj?.attributes?.name || ""));
                const categoryWasChanged = row.dataset.categoryChanged === 'true';

                if (!nameWasChanged && !categoryWasChanged) {
                    showTemporaryMessage("No hay cambios para aplicar.", 3000, 'info');
                    return;
                }

                try {
                    // Usamos el SDK de Waze para aplicar los cambios
                    if (nameWasChanged) {
                        const UpdateObject = require("Waze/Action/UpdateObject");
                        const action = new UpdateObject(venueObj, { name: newName });
                        W.model.actionManager.add(action);
                    }
                    // La categoría ya se aplicó al seleccionarla, solo necesitamos registrar el evento

                    showTemporaryMessage("Cambios aplicados. Presiona 'Guardar' en WME.", 3000, 'success');
                    recordNormalizationEvent(); // Para las estadísticas
                    updateInconsistenciesCount(-1); // Para el contador

                    // --- NUEVA LÓGICA VISUAL (NO OCULTA LA FILA) ---
                    // 1. Deshabilitar TODOS los botones de acción de esta fila
                    const actionButtons = row.querySelectorAll('td:last-child button');
                    actionButtons.forEach(btn => {
                        btn.disabled = true;
                        btn.style.cursor = 'not-allowed';
                        btn.style.opacity = '0.5';
                    });

                    // 2. Cambiar el botón "Aplicar" para mostrar que fue exitoso
                    applyButton.innerHTML = '✔️';
                    applyButton.style.backgroundColor = '#28a745';
                    applyButton.style.color = 'white';
                    applyButton.style.opacity = '1';
                    applyButton.title = 'Aplicado';

                } catch (e) {
                    plnToast("Error al aplicar cambios: " + e.message);
                    plnLog('error',"[WME PLN] Error al aplicar cambios:", e);
                }
            });
            deleteButton.addEventListener("click", () =>
            {
                const confirmModal = document.createElement("div");
                confirmModal.style.position = "fixed";
                confirmModal.style.top = "50%";
                confirmModal.style.left = "50%";
                confirmModal.style.transform = "translate(-50%, -50%)";
                confirmModal.style.background = "#fff";
                confirmModal.style.border = "1px solid #aad";
                confirmModal.style.padding = "28px 32px 20px 32px";
                confirmModal.style.zIndex = "20000";
                confirmModal.style.boxShadow = "0 4px 24px rgba(0,0,0,0.18)";
                confirmModal.style.fontFamily = "sans-serif";
                confirmModal.style.borderRadius = "10px";
                confirmModal.style.textAlign = "center";
                confirmModal.style.minWidth = "340px";
                const iconElement = document.createElement("div");
                iconElement.innerHTML = "⚠️";
                iconElement.style.fontSize = "38px";
                iconElement.style.marginBottom = "10px";
                confirmModal.appendChild(iconElement);
                const message = document.createElement("div");
                const venue = W.model.venues.getObjectById(id);
                const placeName = venue?.attributes?.name?.value || venue?.attributes?.name || "este lugar";
                message.innerHTML = `<b>¿Eliminar "${placeName}"?</b>`;
                message.style.fontSize = "20px";
                message.style.marginBottom = "8px";
                confirmModal.appendChild(message);
                const nameDiv = document.createElement("div");
                nameDiv.textContent = `"${placeName}"`;
                nameDiv.style.fontSize = "15px";
                nameDiv.style.color = "#007bff";
                nameDiv.style.marginBottom = "18px";
                confirmModal.appendChild(nameDiv);
                const buttonWrapper = document.createElement("div");
                buttonWrapper.style.display = "flex";
                buttonWrapper.style.justifyContent = "center";
                buttonWrapper.style.gap = "18px";
                const cancelBtn = document.createElement("button");
                cancelBtn.textContent = "Cancelar";
                cancelBtn.style.padding = "7px 18px";
                cancelBtn.style.background = "#eee";
                cancelBtn.style.border = "none";
                cancelBtn.style.borderRadius = "4px";
                cancelBtn.style.cursor = "pointer";
                cancelBtn.addEventListener("click", () => confirmModal.remove());
                const confirmBtn = document.createElement("button");
                confirmBtn.textContent = "Eliminar";
                confirmBtn.style.padding = "7px 18px";
                confirmBtn.style.background = "#d9534f";
                confirmBtn.style.color = "#fff";
                confirmBtn.style.border = "none";
                confirmBtn.style.borderRadius = "4px";
                confirmBtn.style.cursor = "pointer";
                confirmBtn.style.fontWeight = "bold";
                confirmBtn.addEventListener("click", () =>
                {
                    const venue = W.model.venues.getObjectById(id);
                    if (!venue)
                    {
                        plnLog('error',"[WME_PLN]El lugar no está disponible o ya fue eliminado.");
                        confirmModal.remove();
                        return;
                    }
                    try
                    {
                        const DeleteObject = require("Waze/Action/DeleteObject");
                        const action = new DeleteObject(venue);
                        W.model.actionManager.add(action);
                        recordNormalizationEvent();
                        const row = deleteButton.closest('tr');
                        markRowAsProcessed(row, 'deleted');
                        updateInconsistenciesCount(-1);

                        deleteButton.disabled = true;
                        deleteButton.style.color = "#bbb";
                        deleteButton.style.opacity = "0.5";
                        applyButton.disabled = true;
                        applyButton.style.color = "#bbb";
                        applyButton.style.opacity = "0.5";
                        const successIcon = document.createElement("span");
                        successIcon.textContent = " 🗑️";
                        successIcon.style.marginLeft = "0";
                        successIcon.style.fontSize = "20px";
                        deleteButtonWrapper.appendChild(successIcon);
                    }
                    catch (e)
                    {
                        plnLog('error',"[WME_PLN] Error al eliminar lugar: " + e.message, e);
                    }
                    confirmModal.remove();
                });
                buttonWrapper.appendChild(cancelBtn);
                buttonWrapper.appendChild(confirmBtn);
                confirmModal.appendChild(buttonWrapper);
                document.body.appendChild(confirmModal);
            });
            addToExclusionBtn.addEventListener("click", () =>
            {
                const words = original.split(/\s+/);
                const modal = document.createElement("div");

                modal.style.position = "fixed";
                modal.style.top = "50%";
                modal.style.left = "50%";
                modal.style.transform = "translate(-50%, -50%)";
                modal.style.background = "#fff";
                modal.style.border = "1px solid #aad";
                modal.style.padding = "28px 32px 20px 32px";
                modal.style.zIndex = "20000";
                modal.style.boxShadow = "0 4px 24px rgba(0,0,0,0.18)";
                modal.style.fontFamily = "sans-serif";
                modal.style.borderRadius = "10px";
                modal.style.textAlign = "center";
                modal.style.minWidth = "340px";
                const title = document.createElement("h4");
                title.textContent = "Agregar palabra a especiales";
                modal.appendChild(title);
                const instructions = document.createElement("p");
                const list = document.createElement("ul");
                list.style.listStyle = "none";
                list.style.padding = "0";
                words.forEach(w =>
                {
                    if (w.trim() === '') return;
                    const lowerW = w.trim().toLowerCase();
                    if (!/[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9]/.test(lowerW) || /^[^a-zA-Z0-9]+$/.test(lowerW)) return;
                    const alreadyExists = Array.from(excludedWords).some(existing => existing.toLowerCase() === lowerW);
                    if (commonWords.includes(lowerW) || alreadyExists) return;
                    const li = document.createElement("li");
                    const checkbox = document.createElement("input");
                    checkbox.type = "checkbox";
                    checkbox.value = w;
                    checkbox.id = `cb-exc-${w.replace(/[^a-zA-Z0-9]/g, "")}`;
                    li.appendChild(checkbox);
                    const label = document.createElement("label");
                    label.htmlFor = checkbox.id;
                    label.appendChild(document.createTextNode(" " + w));
                    li.appendChild(label);
                    list.appendChild(li);
                });
                modal.appendChild(list);
                const confirmBtn = document.createElement("button");
                confirmBtn.textContent = "Añadir Seleccionadas";
                confirmBtn.addEventListener("click", () =>
                {
                    const checked = modal.querySelectorAll("input[type=checkbox]:checked");
                    let wordsActuallyAdded = false;
                    checked.forEach(c =>
                    {
                        if (!excludedWords.has(c.value))
                        {
                            excludedWords.add(c.value);
                            wordsActuallyAdded = true;
                        }
                    });
                    if (wordsActuallyAdded)
                    {
                        if (typeof renderExcludedWordsList === 'function')
                        {
                            const excludedListElement = document.getElementById("excludedWordsList");
                            if (excludedListElement)
                            {
                                renderExcludedWordsList(excludedListElement);
                            }
                            else
                            {
                                renderExcludedWordsList();
                            }
                        }
                    }
                    modal.remove();
                    if (wordsActuallyAdded)
                    {
                        saveExcludedWordsToLocalStorage();
                        showTemporaryMessage("Palabra(s) añadida(s) a especiales y guardada(s).", 3000, 'success');
                    }
                    else
                    {
                        showTemporaryMessage("No se seleccionaron palabras o ya estaban en la lista.", 3000, 'info');
                    }
                });
                modal.appendChild(confirmBtn);
                const cancelBtn = document.createElement("button");
                cancelBtn.textContent = "Cancelar";
                cancelBtn.style.marginLeft = "8px";
                cancelBtn.addEventListener("click", () => modal.remove());
                modal.appendChild(cancelBtn);
                document.body.appendChild(modal);
            });
            buttonGroup.appendChild(addToExclusionBtn);
            // Reemplaza el addEventListener del excludePlaceBtn con esto:
            excludePlaceBtn.addEventListener("click", () => {
                const placeName = original || `ID: ${id}`;
                const row = excludePlaceBtn.closest('tr');
                excludePlace(row, id, placeName);
            });
            

            actionCell.appendChild(buttonGroup);
            row.appendChild(actionCell);

            //Descripción: Compara los nombres y añade la clase de ocultar durante
            //             la creación de la fila para eliminar la condición de carrera.                
            if ((original || "").trim() === (normalized || "").trim())
            {
                row.classList.add('pln-hidden-normalized');
            }

            row.style.borderBottom = "1px solid #ddd";
            row.style.backgroundColor = index % 2 === 0 ? "#f9f9f9" : "#ffffff";
            row.querySelectorAll("td").forEach(td =>
            {
                td.style.verticalAlign = "top";
            });
            tbody.appendChild(row);
            checkAndUpdateApplyButton();
            setTimeout(() =>
            {
                const progress = Math.floor(((index + 1) / inconsistentsToRender.length) * 100);
                const progressElem = document.getElementById("scanProgressText");
                if (progressElem)
                {
                    progressElem.textContent = `Analizando lugares: ${progress}% (${index + 1}/${inconsistentsToRender.length})`;
                }
            }, 0);
        });
        table.appendChild(tbody);
        output.appendChild(table);
        const existingOverlay = document.getElementById("scanSpinnerOverlay");
        if (existingOverlay)
        {
            existingOverlay.remove();
        }
        // Forzar una re-evaluación final para asegurar que se oculten las filas ya normalizadas.
        if (typeof window.__plnHideNormalizedRows === 'function')
        {
            setTimeout(() => window.__plnHideNormalizedRows(), 100); // Pequeño delay para asegurar que el DOM está listo.
        }
        const progressBarInnerTab = document.getElementById("progressBarInnerTab");
        const progressBarTextTab = document.getElementById("progressBarTextTab");
        if (progressBarInnerTab && progressBarTextTab)
        {
            progressBarInnerTab.style.width = "100%";
            progressBarTextTab.textContent = `Progreso: 100% (${inconsistents.length}/${placesArr.length})`;
        }

        function reactivateAllActionButtons()
        {
            document.querySelectorAll("#wme-place-inspector-output button")
                .forEach(btn =>
                {
                    btn.disabled = false;
                    btn.style.color = "";
                    btn.style.opacity = "";
                });
        }

        W.model.actionManager.events.register("afterundoaction", null, () =>
        {
            if (floatingPanelElement && floatingPanelElement.style.display !== 'none')
            {
                waitForWazeAPI(() =>
                {
                    const places = getVisiblePlaces();
                    renderPlacesInFloatingPanel(places);
                    setTimeout(reactivateAllActionButtons, 250);
                });
            }
            else
            {
                plnLog('ui', "[WME PLN] Undo/Redo: Panel de resultados no visible, no se re-escanea.");
            }
        });
        W.model.actionManager.events.register("afterredoaction", null, () =>
        {
            if (floatingPanelElement && floatingPanelElement.style.display !== 'none')
            {
                waitForWazeAPI(() =>
                {
                    const places = getVisiblePlaces();
                    renderPlacesInFloatingPanel(places);
                    setTimeout(reactivateAllActionButtons, 250);
                });
            }
            else
            {
                plnLog('ui', "[WME PLN] Undo/Redo: Panel de resultados no visible, no se re-escanea.");
            }
        });
    }

}// renderPlacesInFloatingPanel

// Muestra un spinner de procesamiento con un mensaje opcional
function showProcessingSpinner(msg = "Procesando...") 
{
    const panel = document.querySelector('#user-panel-root');
    if (!panel || document.getElementById('pln-spinner')) return;

    const wrapper = document.createElement('div');
    wrapper.id = 'pln-spinner';
    wrapper.style.cssText = `
    position:absolute;
    top:35%;
    left:50%;
    transform:translate(-50%,-50%);
    background:rgba(255,255,255,0.95);
    padding:12px 20px;
    border-radius:8px;
    z-index:9999;
    font-weight:bold;
    box-shadow:0 2px 6px rgba(0,0,0,0.25);
    `;
    wrapper.innerHTML = `<div class="wz-icon wz-icon-spinner" style="margin-right:8px;animation:spin 1s linear infinite"></div>${msg}`;

    panel.appendChild(wrapper);
}// showProcessingSpinner

// Oculta el spinner de procesamiento si está visible
function hideProcessingSpinner() 
{
    const el = document.getElementById('pln-spinner');
    if (el) el.remove();
}// hideProcessingSpinner
// Muestra un mensaje tipo "toast" en la esquina inferior derecha
function plnToast(message, duration = 3000) 
{
    try 
    {
        let container = document.getElementById('pln-toast-container');
        if (!container) 
        {
            container = document.createElement('div');
            container.id = 'pln-toast-container';
            container.style.cssText = 'position: fixed; bottom: 20px; right: 20px; z-index: 99999; display: flex; flex-direction: column; gap: 10px;';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            background-color: #333;
            color: white;
            padding: 10px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            font-family: sans-serif;
            font-size: 14px;
            opacity: 0;
            transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
            transform: translateY(20px);
        `;
        container.appendChild(toast);
        // Animación de entrada
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
        }, 10);
        // Desaparición automática
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            // Eliminar del DOM después de la animación
            toast.addEventListener('transitionend', () => toast.remove());
        }, duration);

    } 
    catch (e) 
    {
        // Fallback si algo sale mal
        plnLog('error',"Error en plnToast:", e);
        alert(message);
    }
}// plnToast
// Notifica que un lugar ha sido procesado exitosamente
function plnNotifyProcessed(placeName) 
{
    if (!placeName) return;
    const message = `'${placeName}' procesado.`;
    plnToast(message, 2000);
    plnLog('normalize', `✅ ${message}`);
}// plnNotifyProcessed

 // Función para obtener información del editor. Se queda aquí porque es necesaria al inicio.
function getCurrentEditorViaWazeWrap()
{
    if (WazeWrap && WazeWrap.User)
    {
        const user = WazeWrap.User.getActiveUser();
        return {
            id: user.id,
            name: user.userName,
            privilege: user.rank
        };
    }
    return { id: null, name: 'Desconocido', privilege: 'N/A' };
}

// ================== UI ADAPTERS ==================
if (typeof window.plnUiConfirm !== 'function')
{
    window.plnUiConfirm = function (message, opts = {})
    {
        return new Promise(resolve =>
        {
            const overlay = document.createElement('div');
            overlay.style.position = 'fixed';
            overlay.style.inset = '0';
            overlay.style.background = 'rgba(0,0,0,0.35)';
            overlay.style.zIndex = '10006';

            const dialog = document.createElement('div');
            dialog.role = 'dialog';
            dialog.ariaLabel = 'Confirmación';
            dialog.style.position = 'fixed';
            dialog.style.top = '50%';
            dialog.style.left = '50%';
            dialog.style.transform = 'translate(-50%, -50%)';
            dialog.style.background = '#fff';
            dialog.style.padding = '14px 16px';
            dialog.style.borderRadius = '6px';
            dialog.style.boxShadow = '0 8px 24px rgba(0,0,0,.25)';
            dialog.style.minWidth = '320px';

            const msg = document.createElement('div');
            msg.style.marginBottom = '10px';
            msg.style.fontSize = '13px';
            msg.textContent = message || '¿Confirmar acción?';

            const actions = document.createElement('div');
            actions.style.display = 'flex';
            actions.style.justifyContent = 'flex-end';
            actions.style.gap = '8px';

            const cancel = document.createElement('button');
            cancel.type = 'button';
            cancel.textContent = opts.cancelText || 'Cancelar';
            cancel.onclick = () => { document.body.removeChild(overlay); resolve(false); };

            const ok = document.createElement('button');
            ok.type = 'button';
            ok.textContent = opts.okText || 'Aceptar';
            ok.style.background = '#d9534f';
            ok.style.color = '#fff';
            ok.style.border = '1px solid #c9302c';
            ok.style.borderRadius = '4px';
            ok.onclick = () => { document.body.removeChild(overlay); resolve(true); };

            actions.appendChild(cancel);
            actions.appendChild(ok);
            dialog.appendChild(msg);
            dialog.appendChild(actions);
            overlay.appendChild(dialog);
            document.body.appendChild(overlay);
        });
    };
}