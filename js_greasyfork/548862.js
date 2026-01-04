// ==UserScript==
// @name         WME PLN Module - Lists Handler
// @version      9.0.0
// @description  Módulo para gestionar listas de usuario en WME Place Normalizer. No funciona por sí solo.
// @author       mincho77
// @license      MIT
// @grant        none
// ==/UserScript==
// Función para crear el gestor de palabras excluidas y lugares excluidos
function createSpecialItemsManager(parentContainer)
{
    // Evitar crear múltiples instancias
    const mainSection = document.createElement("div"); 
    mainSection.id = "specialItemsManagerSection";
    mainSection.style.marginTop = "20px";
    mainSection.style.borderTop = "1px solid #ccc";
    mainSection.style.paddingTop = "10px";
    // --- Dropdown para seleccionar el tipo de gestión ---
    const typeSelectorWrapper = document.createElement("div");
    typeSelectorWrapper.style.marginBottom = "15px";
    typeSelectorWrapper.style.textAlign = "center";
    
    const typeSelectorLabel = document.createElement("label");
    typeSelectorLabel.textContent = "Gestionar:";
    typeSelectorLabel.style.marginRight = "10px";
    typeSelectorLabel.style.fontWeight = "bold";
    typeSelectorWrapper.appendChild(typeSelectorLabel);

    const typeSelector = document.createElement("select");
    typeSelector.id = "specialTypeSelector";
    typeSelector.style.padding = "5px";
    typeSelector.style.borderRadius = "4px";
    typeSelector.style.fontSize = "13px";

    const optionWords = document.createElement("option");
    optionWords.value = "words";
    optionWords.textContent = "Palabras Especiales";
    typeSelector.appendChild(optionWords);

    const optionPlaces = document.createElement("option");
    optionPlaces.value = "places";
    optionPlaces.textContent = "Lugares Excluidos";
    typeSelector.appendChild(optionPlaces);

    typeSelectorWrapper.appendChild(typeSelector);
    mainSection.appendChild(typeSelectorWrapper); // Añadir a mainSection
    // --- Contenedores para las dos vistas ---
    const wordsView = document.createElement("div");
    wordsView.id = "specialWordsView";
    wordsView.style.display = "block"; // Visible por defecto
    const placesView = document.createElement("div");
    placesView.id = "excludedPlacesView";
    placesView.style.display = "none"; // Oculto por defecto
    mainSection.appendChild(wordsView); // Añadir a mainSection
    mainSection.appendChild(placesView); // Añadir a mainSection
    // Título de la sección
    const wordsTitle = document.createElement("h4");
    wordsTitle.textContent = "Gestión de Palabras Especiales";
    wordsTitle.style.fontSize = "15px";
    wordsTitle.style.marginBottom = "10px";
    wordsView.appendChild(wordsTitle); // AÑADIDO A wordsView

    // Contenedor para los controles de añadir palabra
    const addWordsControlsContainer = document.createElement("div"); // Renombrado para claridad
    addWordsControlsContainer.style.display = "flex";
    addWordsControlsContainer.style.gap = "8px";
    addWordsControlsContainer.style.marginBottom = "8px";
    addWordsControlsContainer.style.alignItems = "center"; // Alinear verticalmente
    // Input para añadir nueva palabra o frase
    const wordsInput = document.createElement("input"); // Renombrado para claridad
    wordsInput.type = "text";
    wordsInput.placeholder = "Nueva palabra o frase";
    wordsInput.style.flexGrow = "1";
    wordsInput.style.padding = "6px";
    wordsInput.style.border = "1px solid #ccc";
    wordsInput.style.borderRadius = "3px";
    addWordsControlsContainer.appendChild(wordsInput); // AÑADIDO A addWordsControlsContainer
    // Botón para añadir la palabra
    const addWordBtn = document.createElement("button"); // Renombrado para claridad
    addWordBtn.textContent = "Añadir";
    addWordBtn.style.padding = "6px 10px";
    addWordBtn.style.cursor = "pointer";
    // Añadir tooltip al botón
    addWordBtn.addEventListener("click", function ()
    {
        const newWord = wordsInput.value.trim(); // Usa wordsInput
        const validation = isValidExcludedWord(newWord);
        if (!validation.valid)
        {
            plnToast(validation.msg, 3000);
            return;
        }
        excludedWords.add(newWord);
        const firstCharNew = newWord.charAt(0).toLowerCase();
        if (!excludedWordsMap.has(firstCharNew))
        {
            excludedWordsMap.set(firstCharNew, new Set());
        }
        excludedWordsMap.get(firstCharNew).add(newWord);
        wordsInput.value = ""; // Limpia wordsInput
        renderExcludedWordsList(document.getElementById("excludedWordsList"));
        saveExcludedWordsToLocalStorage();
    });
    addWordsControlsContainer.appendChild(addWordBtn); // AÑADIDO A addWordsControlsContainer
    wordsView.appendChild(addWordsControlsContainer); // AÑADIDO A wordsView
    // Contenedor para los botones de acción (Exportar/Limpiar para Palabras)
    const wordsActionButtonsContainer = document.createElement("div"); // Renombrado
    wordsActionButtonsContainer.style.display = "flex";
    wordsActionButtonsContainer.style.gap = "8px";
    wordsActionButtonsContainer.style.marginBottom = "10px";
    const exportWordsBtn = document.createElement("button"); // Renombrado
    exportWordsBtn.textContent = "Exportar";
    exportWordsBtn.title = "Exportar Lista a XML";
    exportWordsBtn.style.padding = "6px 10px";
    exportWordsBtn.style.cursor = "pointer";
    exportWordsBtn.addEventListener("click", () => plnUiExportDataToXml("words")); // UI adapter
    wordsActionButtonsContainer.appendChild(exportWordsBtn); // AÑADIDO A wordsActionButtonsContainer
    const clearWordsBtn = document.createElement("button"); // Renombrado
    clearWordsBtn.textContent = "Limpiar";
    clearWordsBtn.title = "Limpiar toda la lista";
    clearWordsBtn.style.padding = "6px 10px";
    clearWordsBtn.style.cursor = "pointer";
    clearWordsBtn.addEventListener("click", function ()
    {
        if (confirm("¿Estás seguro de que deseas eliminar TODAS las palabras de la lista?"))
        {
            excludedWords.clear();
            excludedWordsMap.clear();
            renderExcludedWordsList(document.getElementById("excludedWordsList"));
            saveExcludedWordsToLocalStorage();
        }
    });
    wordsActionButtonsContainer.appendChild(clearWordsBtn); // AÑADIDO A wordsActionButtonsContainer
    wordsView.appendChild(wordsActionButtonsContainer); // AÑADIDO A wordsView
    // Contenedor para la lista de palabras excluidas (buscador y UL)
    const wordsSearchInput = document.createElement("input"); // Renombrado
    wordsSearchInput.type = "text";
    wordsSearchInput.placeholder = "Buscar en especiales...";
    wordsSearchInput.style.display = "block";
    wordsSearchInput.style.width = "calc(100% - 14px)";
    wordsSearchInput.style.padding = "6px";
    wordsSearchInput.style.border = "1px solid #ccc";
    wordsSearchInput.style.borderRadius = "3px";
    wordsSearchInput.style.marginBottom = "5px";
    wordsSearchInput.addEventListener("input", () =>
    {
        renderExcludedWordsList(document.getElementById("excludedWordsList"), wordsSearchInput.value.trim()); // Usa wordsSearchInput
    });
    wordsView.appendChild(wordsSearchInput); // AÑADIDO A wordsView
    // UL para palabras excluidas
    const wordsListUL = document.createElement("ul"); // Renombrado
    wordsListUL.id = "excludedWordsList"; // Mantiene el ID original para compatibilidad con renderExcludedWordsList
    wordsListUL.style.maxHeight = "150px";
    wordsListUL.style.overflowY = "auto";
    wordsListUL.style.border = "1px solid #ddd";
    wordsListUL.style.padding = "5px";
    wordsListUL.style.margin = "0";
    wordsListUL.style.background = "#fff";
    wordsListUL.style.listStyle = "none";
    wordsView.appendChild(wordsListUL); // AÑADIDO A wordsView
    // Drop Area para XML de palabras
    const wordsDropArea = document.createElement("div"); // Renombrado
    wordsDropArea.textContent =  "Arrastra aquí el archivo XML de palabras especiales";
    wordsDropArea.style.border = "2px dashed #ccc";
    wordsDropArea.style.borderRadius = "4px";
    wordsDropArea.style.padding = "15px";
    wordsDropArea.style.marginTop = "10px";
    wordsDropArea.style.textAlign = "center";
    wordsDropArea.style.background = "#f9f9f9";
    wordsDropArea.style.color = "#555";
    wordsDropArea.addEventListener("dragover", (e) =>
    {
        e.preventDefault();
        wordsDropArea.style.background = "#e9e9e9";
        wordsDropArea.style.borderColor = "#aaa";
    });
    wordsDropArea.addEventListener("dragleave", () =>
    {
        wordsDropArea.style.background = "#f9f9f9";
        wordsDropArea.style.borderColor = "#ccc";
    });
    wordsDropArea.addEventListener("drop", (e) =>
    {
        e.preventDefault();
        wordsDropArea.style.background = "#f9f9f9";
        plnUiHandleXmlFileDrop(e.dataTransfer.files[0], "words"); // UI adapter
    });
    wordsView.appendChild(wordsDropArea); // AÑADIDO A wordsView
    // Título de la sección
    const placesTitle = document.createElement("h4");
    placesTitle.textContent = "Gestión de Lugares Excluidos";
    placesTitle.style.fontSize = "15px";
    placesTitle.style.marginBottom = "10px";
    placesView.appendChild(placesTitle);
    // Controles de búsqueda y lista de lugares
    const placesSearchInput = document.createElement("input");
    placesSearchInput.type = "text";
    placesSearchInput.placeholder = "Buscar lugar excluido...";
    placesSearchInput.style.display = "block";
    placesSearchInput.style.width = "calc(100% - 14px)";
    placesSearchInput.style.padding = "6px";
    placesSearchInput.style.border = "1px solid #ccc";
    placesSearchInput.style.borderRadius = "3px";
    placesSearchInput.style.marginBottom = "5px";
    placesSearchInput.addEventListener("input", () =>
    {
        renderExcludedPlacesList(document.getElementById("excludedPlacesListUL"), placesSearchInput.value.trim());
    });
    placesView.appendChild(placesSearchInput);

    const placesListUL = document.createElement("ul");
    placesListUL.id = "excludedPlacesListUL"; // Nuevo ID para la lista de Places
    placesListUL.style.maxHeight = "200px"; // Un poco más grande
    placesListUL.style.overflowY = "auto";
    placesListUL.style.border = "1px solid #ddd";
    placesListUL.style.padding = "5px";
    placesListUL.style.margin = "0";
    placesListUL.style.background = "#fff";
    placesListUL.style.listStyle = "none";
    placesView.appendChild(placesListUL);

    // Botones de acción para Lugares Excluidos
    const placesActionButtonsContainer = document.createElement("div");
    placesActionButtonsContainer.style.display = "flex";
    placesActionButtonsContainer.style.gap = "8px";
    placesActionButtonsContainer.style.marginTop = "10px";

    const exportPlacesBtn = document.createElement("button");
    exportPlacesBtn.textContent = "Exportar";
    exportPlacesBtn.title = "Exportar Lugares Excluidos a XML";
    exportPlacesBtn.style.padding = "6px 10px";
    exportPlacesBtn.style.cursor = "pointer";
    exportPlacesBtn.addEventListener("click", () => plnUiExportDataToXml("places")); // UI adapter
    placesActionButtonsContainer.appendChild(exportPlacesBtn);

    const clearPlacesBtn = document.createElement("button");
    clearPlacesBtn.textContent = "Limpiar";
    clearPlacesBtn.title = "Limpiar lista de lugares excluidos";
    clearPlacesBtn.style.padding = "6px 10px";
    clearPlacesBtn.style.cursor = "pointer";
    clearPlacesBtn.addEventListener("click", () => 
    {
        if (confirm("¿Estás seguro de que deseas eliminar TODOS los lugares de la lista?")) 
        {
            excludedPlaces.clear();
            renderExcludedPlacesList(document.getElementById("excludedPlacesListUL"));
            saveExcludedPlacesToLocalStorage();
        }
    });
    placesActionButtonsContainer.appendChild(clearPlacesBtn);
    placesView.appendChild(placesActionButtonsContainer);

    // Drop Area para XML de Lugares Excluidos
    const placesDropArea = document.createElement("div");
    placesDropArea.textContent =  "Arrastra aquí el archivo XML de lugares excluidos";
    placesDropArea.style.border = "2px dashed #ccc";
    placesDropArea.style.borderRadius = "4px";
    placesDropArea.style.padding = "15px";
    placesDropArea.style.marginTop = "10px";
    placesDropArea.style.textAlign = "center";
    placesDropArea.style.background = "#f9f9f9";
    placesDropArea.style.color = "#555";
    placesDropArea.addEventListener("dragover", (e) =>
    {
        e.preventDefault();
        placesDropArea.style.background = "#e9e9e9";
        placesDropArea.style.borderColor = "#aaa";
    });
    placesDropArea.addEventListener("dragleave", () =>
    {
        placesDropArea.style.background = "#f9f9f9";
        placesDropArea.style.borderColor = "#ccc";
    });
    placesDropArea.addEventListener("drop", (e) =>
    {
        e.preventDefault();
        placesDropArea.style.background = "#f9f9f9";
        plnUiHandleXmlFileDrop(e.dataTransfer.files[0], "places"); // UI adapter
    });
    placesView.appendChild(placesDropArea);
    // --- Lógica de alternancia del selector ---
    typeSelector.addEventListener("change", () => 
    {
        if (typeSelector.value === "words") 
        {
            wordsView.style.display = "block";
            placesView.style.display = "none";
            renderExcludedWordsList(document.getElementById("excludedWordsList"), wordsSearchInput.value.trim()); // Renderiza lista de palabras
        } 
        else 
        {
            wordsView.style.display = "none";
            placesView.style.display = "block";
            renderExcludedPlacesList(document.getElementById("excludedPlacesListUL"), placesSearchInput.value.trim()); // Renderiza lista de lugares
        }
    });
    // --- Renderizado inicial de las listas al cargar ---
    renderExcludedWordsList(wordsListUL, ""); 
    renderExcludedPlacesList(placesListUL, ""); 

    parentContainer.appendChild(mainSection); 
}// createSpecialItemsManager


// === Diccionario ===
// Función para crear el gestor de diccionario personalizado
function createDictionaryManager(parentContainer)
{
    // Evitar crear múltiples instancias
    const section = document.createElement("div");
    section.id = "dictionaryManagerSection";
    section.style.marginTop = "20px";
    section.style.borderTop = "1px solid #ccc";
    section.style.paddingTop = "10px";
    // Título de la sección
    const title = document.createElement("h4");
    title.textContent = "Gestión del Diccionario";
    title.style.fontSize = "15px";
    title.style.marginBottom = "10px";
    section.appendChild(title);
    // Contenedor para los controles de añadir palabra
    const addControlsContainer = document.createElement("div");
    addControlsContainer.style.display = "flex";
    addControlsContainer.style.gap = "8px";
    addControlsContainer.style.marginBottom = "8px";
    addControlsContainer.style.alignItems = "center"; // Alinear verticalmente
    // Input para añadir nueva palabra
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Nueva palabra";
    input.style.flexGrow = "1";
    input.style.padding = "6px"; // Mejor padding
    input.style.border = "1px solid #ccc";
    input.style.borderRadius = "3px";
    addControlsContainer.appendChild(input);
    // Botón para añadir la palabra
    const addBtn = document.createElement("button");
    addBtn.textContent = "Añadir";
    addBtn.style.padding = "6px 10px"; // Mejor padding
    addBtn.style.cursor = "pointer";
    addBtn.addEventListener("click", function ()
    {
        const newWord = input.value.trim();
        const validation = isValidExcludedWord(newWord);
        if (!validation.valid) 
        {
            plnToast(validation.msg,3000);
            return;
        }
        if (newWord)
        {
            const lowerNewWord = newWord.toLowerCase();
            const alreadyExists = Array.from(window.dictionaryWords).some(w => w.toLowerCase() === lowerNewWord);

            if (commonWords.includes(lowerNewWord))
            {
                plnToast("La palabra es muy común y no debe agregarse a la lista.", 3000);
                return;
            }

            if (alreadyExists)
            {
                plnToast("La palabra ya está en la lista.", 3000);
                return;
            }
            window.dictionaryWords.add(lowerNewWord);
            input.value = "";
            renderDictionaryList(document.getElementById("dictionaryWordsList"));
        }
    });
    // Añadir tooltip al botón
    addControlsContainer.appendChild(addBtn);
    section.appendChild(addControlsContainer);
    // Contenedor para los botones de acción
    const actionButtonsContainer = document.createElement("div");
    actionButtonsContainer.style.display = "flex";
    actionButtonsContainer.style.gap = "8px";
    actionButtonsContainer.style.marginBottom = "10px"; // Más espacio
    // Botón para importar desde XML
    const exportBtn = document.createElement("button");
    exportBtn.textContent = "Exportar"; // Más corto
    exportBtn.title = "Exportar Diccionario a XML";
    exportBtn.style.padding = "6px 10px";
    exportBtn.style.cursor = "pointer";
    exportBtn.addEventListener("click", exportDictionaryWordsList);
    actionButtonsContainer.appendChild(exportBtn);
    // Botón para importar desde XML
    const clearBtn = document.createElement("button");
    clearBtn.textContent = "Limpiar"; // Más corto
    clearBtn.title = "Limpiar toda la lista";
    clearBtn.style.padding = "6px 10px";
    clearBtn.style.cursor = "pointer";
    clearBtn.addEventListener("click", function ()
    {
        if (confirm("¿Estás seguro de que deseas eliminar TODAS las palabras del diccionario?"))
        {
            window.dictionaryWords.clear();
            renderDictionaryList(document.getElementById("dictionaryWordsList")); // Pasar el elemento UL
        }
    });
    actionButtonsContainer.appendChild(clearBtn);
    section.appendChild(actionButtonsContainer);
    // Diccionario: búsqueda
    const search = document.createElement("input");
    search.type = "text";
    search.placeholder = "Buscar en diccionario...";
    search.style.display = "block";
    search.style.width = "calc(100% - 14px)";
    search.style.padding = "6px";
    search.style.border = "1px solid #ccc";
    search.style.borderRadius = "3px";
    search.style.marginTop = "5px";
    // On search input, render filtered list
    search.addEventListener("input", () =>
    {
        renderDictionaryList(document.getElementById("dictionaryWordsList"),search.value.trim());
    });
    section.appendChild(search);
    // Lista UL para mostrar palabras del diccionario
    const listContainerElement = document.createElement("ul");
    listContainerElement.id = "dictionaryWordsList";
    listContainerElement.style.maxHeight = "150px";
    listContainerElement.style.overflowY = "auto";
    listContainerElement.style.border = "1px solid #ddd";
    listContainerElement.style.padding = "5px";
    listContainerElement.style.margin = "0";
    listContainerElement.style.background = "#fff";
    listContainerElement.style.listStyle = "none";
    section.appendChild(listContainerElement);
    // Renderizar la lista de palabras del diccionario
    const dropArea = document.createElement("div");
    dropArea.textContent = "Arrastra aquí el archivo XML del diccionario";
    dropArea.style.border = "2px dashed #ccc";
    dropArea.style.borderRadius = "4px";
    dropArea.style.padding = "15px";
    dropArea.style.marginTop = "10px";
    dropArea.style.textAlign = "center";
    dropArea.style.background = "#f9f9f9";
    dropArea.style.color = "#555";
    // Añadir eventos de arrastrar y soltar
    dropArea.addEventListener("dragover", (e) =>
    {
        e.preventDefault();
        dropArea.style.background = "#e9e9e9";
        dropArea.style.borderColor = "#aaa";
    });
    // Evento para cuando el ratón sale del área de arrastre
    dropArea.addEventListener("dragleave", () =>
    {
        dropArea.style.background = "#f9f9f9";
        dropArea.style.borderColor = "#ccc";
    });
    // Evento para cuando se suelta el archivo
    dropArea.addEventListener("drop", (e) =>
    {
        e.preventDefault();
        dropArea.style.background = "#f9f9f9";
        dropArea.style.borderColor = "#ccc";
        const file = e.dataTransfer.files[0];
        if (file && (file.type === "text/xml" || file.name.endsWith(".xml")))
        {
            const reader = new FileReader();
            reader.onload = function (evt)
            {
                try
                {
                    const parser = new DOMParser();
                    const xmlDoc = parser.parseFromString(evt.target.result,
                                                            "application/xml");
                    const parserError = xmlDoc.querySelector("parsererror");
                    if (parserError)
                    {
                        plnLog('error',"[WME PLN] Error parseando XML:", parserError.textContent);
                        plnToast("Error al parsear el archivo XML del diccionario.", 3000);
                        return;
                    }
                    const xmlWords = xmlDoc.querySelectorAll("word");
                    let newWordsAddedCount = 0;
                    for (let i = 0; i < xmlWords.length; i++)
                    {
                        const val = xmlWords[i].textContent.trim();
                        if (val && !window.dictionaryWords.has(val))
                        {
                            window.dictionaryWords.add(val);
                            newWordsAddedCount++;
                        }
                    }
                    if (newWordsAddedCount > 0)
                        plnLog('swap', `[WME PLN] ${newWordsAddedCount} nuevas palabras añadidas desde XML.`);
                    // Renderizar la lista en el panel
                    renderDictionaryList(listContainerElement);
                }
                catch (err)
                {
                    plnToast("Error procesando el diccionario XML.", 3000);
                }
            };
            reader.readAsText(file);
        }
        else
        {
            plnToast("Por favor, arrastra un archivo XML válido.", 3000);
        }
    });
    section.appendChild(dropArea);
    parentContainer.appendChild(section);
    renderDictionaryList(listContainerElement);
}// createDictionaryManager
// Crea el gestor de reemplazos
function createReplacementsManager(parentContainer)
{
    loadSwapWordsFromStorage();
    parentContainer.innerHTML = ''; // Limpiar por si acaso
    function openSwapWordEditor(item, index) 
    {
        // Crear el fondo del modal
        const modalOverlay = document.createElement("div");
        modalOverlay.style.position = "fixed";
        modalOverlay.style.top = "0";
        modalOverlay.style.left = "0";
        modalOverlay.style.width = "100%";
        modalOverlay.style.height = "100%";
        modalOverlay.style.background = "rgba(0,0,0,0.5)";
        modalOverlay.style.zIndex = "20000";
        modalOverlay.style.display = "flex";
        modalOverlay.style.justifyContent = "center";
        modalOverlay.style.alignItems = "center";
        // Crear el contenido del modal
        const modalContent = document.createElement("div");
        modalContent.style.background = "#fff";
        modalContent.style.padding = "25px";
        modalContent.style.borderRadius = "8px";
        modalContent.style.boxShadow = "0 5px 15px rgba(0,0,0,0.3)";
        modalContent.style.width = "400px";
        modalContent.style.fontFamily = "sans-serif";
        // Título del modal
        const title = document.createElement("h4");
        title.textContent = "Editar Palabra Swap";
        title.style.marginTop = "0";
        title.style.marginBottom = "20px";
        title.style.textAlign = "center";
        modalContent.appendChild(title);
        // Input para la palabra
        const wordLabel = document.createElement("label");
        wordLabel.textContent = "Palabra o Frase:";
        wordLabel.style.display = "block";
        wordLabel.style.marginBottom = "5px";
        modalContent.appendChild(wordLabel);
        // Input de texto
        const wordInput = document.createElement("input");
        wordInput.type = "text";
        wordInput.value = item.word;
        wordInput.style.width = "calc(100% - 12px)";
        wordInput.style.padding = "8px";
        wordInput.style.marginBottom = "15px";
        wordInput.setAttribute('spellcheck', 'false');
        modalContent.appendChild(wordInput);
        // Radio buttons para la dirección
        const directionFieldset = document.createElement("fieldset");
        directionFieldset.style.border = "1px solid #ccc";
        directionFieldset.style.borderRadius = "5px";
        directionFieldset.style.padding = "10px";
        const legend = document.createElement("legend");
        legend.textContent = "Mover a:";
        directionFieldset.appendChild(legend);
        // Crear radio buttons
        ['start', 'end'].forEach(dir => 
        {
            const container = document.createElement("div");
            container.style.marginBottom = "5px";
            const radio = document.createElement("input");
            radio.type = "radio";
            radio.name = "editSwapDirection";
            radio.value = dir;
            radio.id = `editSwap_${dir}`;
            if (item.direction === dir) radio.checked = true;
            // Asociar label al radio
            const label = document.createElement("label");
            label.htmlFor = `editSwap_${dir}`;
            label.textContent = ` ${dir === 'start' ? 'Al Inicio (Start ←A)' : 'Al Final (A→End)'}`;
            label.style.cursor = "pointer";
            // Añadir al contenedor
            container.appendChild(radio);
            container.appendChild(label);
            directionFieldset.appendChild(container);
        });
        modalContent.appendChild(directionFieldset);
        // Contenedor para los botones de acción
        const buttonContainer = document.createElement("div");
        buttonContainer.style.display = "flex";
        buttonContainer.style.justifyContent = "flex-end";
        buttonContainer.style.gap = "10px";
        buttonContainer.style.marginTop = "20px";
        // Botón Cancelar
        const cancelBtn = document.createElement("button");
        cancelBtn.textContent = "Cancelar";
        cancelBtn.style.padding = "8px 15px";
        cancelBtn.addEventListener("click", () => modalOverlay.remove());
        buttonContainer.appendChild(cancelBtn);
        // Botón Guardar
        const saveBtn = document.createElement("button");
        saveBtn.textContent = "Guardar Cambios";
        saveBtn.style.padding = "8px 15px";
        saveBtn.style.background = "#007bff";
        saveBtn.style.color = "white";
        saveBtn.style.border = "none";
        saveBtn.style.borderRadius = "4px";
        saveBtn.addEventListener("click", () => 
        {
            const newWord = wordInput.value.trim();
            const newDirection = document.querySelector('input[name="editSwapDirection"]:checked').value;
            // Validar que la palabra no esté vacía
            if (!newWord) 
            {
                plnToast("La palabra no puede estar vacía.");
                return;
            }
            // Verificar si el nuevo nombre ya existe (excluyendo el item actual)
            if (newWord !== item.word && window.swapWords.some((sw, i) => i !== index && sw.word === newWord)) 
            {
                plnToast("Esa palabra ya existe en la lista.");
                return;
            }
            // Actualizar el item en el array global
            window.swapWords[index].word = newWord;
            window.swapWords[index].direction = newDirection;            
            saveSwapWordsToStorage();
            renderSwapList();
            modalOverlay.remove();
        });
        buttonContainer.appendChild(saveBtn);
        modalContent.appendChild(buttonContainer);
        modalOverlay.appendChild(modalContent);
        document.body.appendChild(modalOverlay);
    }
    // --- Contenedor principal ---
    const title = document.createElement("h4");
    title.textContent = "Gestión de Reemplazos";
    title.style.fontSize = "15px";
    title.style.marginBottom = "10px";
    parentContainer.appendChild(title);
    // --- Dropdown de modo de reemplazo ---
    const modeSelector = document.createElement("select");
    modeSelector.id = "replacementModeSelector";
    modeSelector.style.marginBottom = "10px";
    modeSelector.style.marginTop = "5px";
    // Añadir opciones al selector
    const optionWords = document.createElement("option");
    optionWords.value = "words";
    optionWords.textContent = "Reemplazos de palabras";
    modeSelector.appendChild(optionWords);
    // Añadir opción para swap
    const optionSwap = document.createElement("option");
    optionSwap.value = "swapStart";
    optionSwap.textContent = "Palabras al inicio/final (swap)"; // Texto actualizado
    modeSelector.appendChild(optionSwap);
    parentContainer.appendChild(modeSelector);
    //Contenedor para reemplazos y controles
    const replacementsContainer = document.createElement("div");
    replacementsContainer.id = "replacementsContainer";
    // Sección para añadir nuevos reemplazos
    const addSection = document.createElement("div");
    addSection.style.display = "flex";
    addSection.style.gap = "8px";
    addSection.style.marginBottom = "12px";
    addSection.style.alignItems = "flex-end"; // Alinear inputs y botón
    // Contenedores para inputs de texto
    const fromInputContainer = document.createElement("div");
    fromInputContainer.style.flexGrow = "1";
    const fromLabel = document.createElement("label");
    fromLabel.textContent = "Texto Original:";
    fromLabel.style.display = "block";
    fromLabel.style.fontSize = "12px";
    fromLabel.style.marginBottom = "2px";
    // Input para el texto original
    const fromInput = document.createElement("input");
    fromInput.type = "text";
    fromInput.placeholder = "Ej: Urb.";
    fromInput.style.width = "95%"; // Para que quepa bien
    fromInput.style.padding = "6px";
    fromInput.style.border = "1px solid #ccc";
    // Añadir label e input al contenedor
    fromInputContainer.appendChild(fromLabel);
    fromInputContainer.appendChild(fromInput);
    addSection.appendChild(fromInputContainer);
    // Contenedor para el texto de reemplazo
    const toInputContainer = document.createElement("div");
    toInputContainer.style.flexGrow = "1";
    const toLabel = document.createElement("label");
    toLabel.textContent = "Texto de Reemplazo:";
    toLabel.style.display = "block";
    toLabel.style.fontSize = "12px";
    toLabel.style.marginBottom = "2px";
    // Input para el texto de reemplazo
    const toInput = document.createElement("input");
    toInput.type = "text";
    toInput.placeholder = "Ej: Urbanización";
    toInput.style.width = "95%";
    toInput.style.padding = "6px";
    toInput.style.border = "1px solid #ccc";
    toInputContainer.appendChild(toLabel);
    toInputContainer.appendChild(toInput);
    addSection.appendChild(toInputContainer);
    // Atributos para evitar corrección ortográfica
    fromInput.setAttribute('spellcheck', 'false');
    toInput.setAttribute('spellcheck', 'false');
    // Botón para añadir el reemplazo
    const addReplacementBtn = document.createElement("button");
    addReplacementBtn.textContent = "Añadir";
    addReplacementBtn.style.padding = "6px 10px";
    addReplacementBtn.style.cursor = "pointer";
    addReplacementBtn.style.height = "30px"; // Para alinear con los inputs
    addSection.appendChild(addReplacementBtn);
    // Elemento UL para la lista de reemplazos
    const listElement = document.createElement("ul");
    listElement.id = "replacementsListElementID"; // ID ÚNICO para esta lista
    listElement.style.maxHeight = "150px";
    listElement.style.overflowY = "auto";
    listElement.style.border = "1px solid #ddd";
    listElement.style.padding = "8px";
    listElement.style.margin = "0 0 10px 0";
    listElement.style.background = "#fff";
    listElement.style.listStyle = "none";
    // Event listener para el botón "Añadir"
    addReplacementBtn.addEventListener("click", () =>
    {
        const fromValue = fromInput.value.trim();
        const toValue = toInput.value.trim();
        if (!fromValue)
        {
            plnToast("El campo 'Texto Original' es requerido.", 3000);
            return;
        }
        // Validar que no sea solo caracteres especiales
        if (fromValue === toValue)
        {
            plnToast("El texto original y el de reemplazo no pueden ser iguales.", 3000);
            return;
        }
        // Validar que no sea solo caracteres especiales
        if (replacementWords.hasOwnProperty(fromValue) && replacementWords[fromValue] !== toValue)
        {
            if (!confirm(`El reemplazo para "${fromValue}" ya existe ('${replacementWords[fromValue]}'). ¿Deseas sobrescribirlo con '${toValue}'?`))
                return;
        }
        replacementWords[fromValue] = toValue;
        fromInput.value = "";
        toInput.value = "";
        // Renderiza toda la lista (más seguro y rápido en la práctica)
        renderReplacementsList(listElement);
        saveReplacementWordsToStorage();
    });
    // Botones de Acción y Drop Area (usarán la lógica compartida)
    const actionButtonsContainer = document.createElement("div");
    actionButtonsContainer.style.display = "flex";
    actionButtonsContainer.style.gap = "8px";
    actionButtonsContainer.style.marginBottom = "10px";
    // Botones de acción
    const exportButton = document.createElement("button");
    exportButton.textContent = "Exportar Todo";
    exportButton.title = "Exportar Excluidas y Reemplazos a XML";
    exportButton.style.padding = "6px 10px";
    exportButton.addEventListener("click", () => plnUiExportDataToXml("words")); // Exporta Excluidas/Reemplazos/Swap
    actionButtonsContainer.appendChild(exportButton);
    // Botón para exportar solo reemplazos
    const clearButton = document.createElement("button");
    clearButton.textContent = "Limpiar Reemplazos";
    clearButton.title = "Limpiar solo la lista de reemplazos";
    clearButton.style.padding = "6px 10px";
    clearButton.addEventListener("click", () =>
    {
        if (confirm("¿Estás seguro de que deseas eliminar TODOS los reemplazos definidos?"))
        {
            replacementWords = {};
            saveReplacementWordsToStorage();
            renderReplacementsList(listElement);
        }
    });
    actionButtonsContainer.appendChild(clearButton);
    // Botón para importar desde XML
    const dropArea = document.createElement("div");
    dropArea.textContent = "Arrastra aquí el archivo XML (contiene Excluidas y Reemplazos)";
    dropArea.style.border = "2px dashed #ccc";
    dropArea.style.borderRadius = "4px";
    dropArea.style.padding = "15px";
    dropArea.style.marginTop = "10px";
    dropArea.style.textAlign = "center";
    dropArea.style.background = "#f9f9f9";
    dropArea.style.color = "#555";
    // Añadir estilos para el drop area
    dropArea.addEventListener("dragover", (e) =>
    {
        e.preventDefault();
        dropArea.style.background = "#e9e9e9";
    });
    // Cambiar el fondo al salir del área de arrastre
    dropArea.addEventListener("dragleave", () => { dropArea.style.background = "#f9f9f9"; });
    // Manejar el evento de drop
    dropArea.addEventListener("drop", (e) =>
    {
        e.preventDefault();
        dropArea.style.background = "#f9f9f9";
        plnUiHandleXmlFileDrop(e.dataTransfer.files[0]); // defaults to "words"
    });
    // --- Ensamblar en replacementsContainer ---
    replacementsContainer.appendChild(addSection);
    replacementsContainer.appendChild(listElement);
    replacementsContainer.appendChild(actionButtonsContainer);
    replacementsContainer.appendChild(dropArea);
    parentContainer.appendChild(replacementsContainer);
    // --- Contenedor para swapStart/frases al inicio ---
    const swapContainer = document.createElement("div");
    swapContainer.id = "swapContainer";
    swapContainer.style.display = "none";
    // === TÍTULO Y EXPLICACIONES ===
    const swapTitle = document.createElement("h4");
    swapTitle.textContent = "Palabras de Intercambio (Swap)";
    swapTitle.style.fontSize = "14px";
    swapTitle.style.marginBottom = "8px";
    swapContainer.appendChild(swapTitle);
    // Caja de explicación
    const swapExplanationBox = document.createElement("div");
    swapExplanationBox.style.background = "#f4f8ff";
    swapExplanationBox.style.borderLeft = "4px solid #2d6df6";
    swapExplanationBox.style.padding = "10px";
    swapExplanationBox.style.margin = "10px 0";
    swapExplanationBox.style.fontSize = "13px";
    swapExplanationBox.style.lineHeight = "1.4";
    swapExplanationBox.innerHTML =
        "<strong>🔄 ¿Qué hace esta lista?</strong><br>" +
        "Las palabras aquí se moverán al inicio o al final del nombre.<br>" +
        "<em>Ej:</em> \"Las Palmas <b>Urbanización</b>\" → \"<b>Urbanización</b> Las Palmas\" (si se configura 'Al Inicio').";
    swapContainer.appendChild(swapExplanationBox);
    // Contenedor principal para los controles, ahora apilado verticalmente
    const swapInputContainer = document.createElement("div");
    swapInputContainer.style.display = "flex";
    swapInputContainer.style.flexDirection = "column"; // Apilado vertical
    swapInputContainer.style.gap = "8px";
    swapInputContainer.style.marginBottom = "8px";
    // Fila 1: Input de la palabra
    const swapInputDiv = document.createElement("div");
    const swapInputLabel = document.createElement("label");
    swapInputLabel.textContent = "Palabra a agregar:";
    swapInputLabel.style.fontSize = "12px";
    swapInputLabel.style.display = "block";
    swapInputLabel.style.marginBottom = "2px";
    const swapInput = document.createElement("input");
    swapInput.type = "text";
    swapInput.placeholder = "Ej: Urbanización";
    swapInput.style.width = "calc(100% - 12px)"; // Ancho completo
    swapInput.style.padding = "6px";
    swapInput.setAttribute('spellcheck', 'false');
    swapInputDiv.appendChild(swapInputLabel);
    swapInputDiv.appendChild(swapInput);
    // Fila 2: Controles de dirección y botón de añadir
    const controlsRow = document.createElement("div");
    controlsRow.style.display = "flex";
    controlsRow.style.alignItems = "center";
    controlsRow.style.gap = "10px";
    // Contenedor para los radio buttons
    const directionContainer = document.createElement("div");
    directionContainer.style.display = "flex";
    directionContainer.style.gap = "15px";
    directionContainer.style.padding = "5px 10px";
    directionContainer.style.border = "1px solid #ccc";
    directionContainer.style.borderRadius = "4px";
    ['start', 'end'].forEach(dir => {
        const optionContainer = document.createElement('div');
        optionContainer.style.display = 'flex';
        optionContainer.style.alignItems = 'center';
        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = "swapDirection";
        radio.value = dir;
        radio.id = `swap_${dir}`;
        if (dir === 'start') radio.checked = true;
        radio.style.marginRight = "4px";
        //Permitir seleccionar el radio al hacer clic en la etiqueta
        const label = document.createElement("label");
        label.htmlFor = `swap_${dir}`;
        label.textContent = dir === 'start' ? 'Mover a Inicio' : 'Mover al Final'; // ETIQUETAS ACTUALIZADAS
        label.style.fontSize = "13px";
        label.style.cursor = "pointer";
        optionContainer.appendChild(radio);
        optionContainer.appendChild(label);
        directionContainer.appendChild(optionContainer);
    });
    // Botón para añadir
    const swapBtn = document.createElement("button");
    swapBtn.textContent = "Añadir";
    swapBtn.style.padding = "6px 12px";
    swapBtn.style.height = "32px";
    // Ensamblar la fila 2
    controlsRow.appendChild(directionContainer);
    controlsRow.appendChild(swapBtn);
    // Ensamblar el contenedor principal
    swapInputContainer.appendChild(swapInputDiv);
    swapInputContainer.appendChild(controlsRow);
    swapContainer.appendChild(swapInputContainer); // Añadir el contenedor principal al panel
    // === EVENT LISTENER PARA EL BOTÓN AÑADIR (sin cambios en la lógica) ===
    swapBtn.addEventListener("click", () => 
    {
        const val = swapInput.value.trim();
        const direction = document.querySelector('input[name="swapDirection"]:checked').value;
        if (!val || /^[^a-zA-Z0-9]+$/.test(val)) 
        {
            plnToast("No se permiten caracteres especiales solos o palabras vacías.", 3000);
            return;
        }

        if (window.swapWords.some(item => item.word === val)) {
            plnToast("Esa palabra ya existe en la lista.", 3000);
            return;
        }
        window.swapWords.push({ word: val, direction: direction });
        saveSwapWordsToStorage();
        swapInput.value = "";
        renderSwapList();
    });
    // === CAMPO DE BÚSQUEDA ===
    const searchSwapInput = document.createElement("input");
    searchSwapInput.type = "text";
    searchSwapInput.placeholder = "Buscar palabra...";
    searchSwapInput.id = "searchSwapInput";
    searchSwapInput.style.width = "calc(100% - 12px)";
    searchSwapInput.style.padding = "6px";
    searchSwapInput.style.marginBottom = "8px";
    searchSwapInput.style.border = "1px solid #ccc";
    searchSwapInput.addEventListener("input", () => renderSwapList());
    swapContainer.appendChild(searchSwapInput);
    parentContainer.appendChild(swapContainer);
    // === LÓGICA DE RENDERIZADO DE LA LISTA (ACTUALIZADA) ===
    function renderSwapList() 
    {
        const searchInput = document.getElementById("searchSwapInput");
        const swapList = swapContainer.querySelector("ul") || (() => 
        {
            const ul = document.createElement("ul");
            ul.id = "swapList";
            ul.style.maxHeight = "120px";
            ul.style.overflowY = "auto";
            ul.style.border = "1px solid #ddd";
            ul.style.padding = "8px";
            ul.style.margin = "0";
            ul.style.background = "#fff";
            ul.style.listStyle = "none";
            swapContainer.appendChild(ul);
            return ul;
        })();
        swapList.innerHTML = "";
        if (!window.swapWords || window.swapWords.length === 0) 
        {
            const li = document.createElement("li");
            li.textContent = "No hay palabras de intercambio definidas.";
            li.style.textAlign = "center";
            li.style.color = "#777";
            swapList.appendChild(li);
            return;
        }
        const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : "";
        const filteredSwapWords = window.swapWords.filter(item => item.word.toLowerCase().includes(searchTerm));
        filteredSwapWords.forEach((item, index) => 
        {
            const li = document.createElement("li");
            li.style.display = "flex";
            li.style.justifyContent = "space-between";
            li.style.alignItems = "center";
            li.style.padding = "4px 2px";
            li.style.borderBottom = "1px solid #f0f0f0";
            // Mostrar la palabra con su dirección
            const wordSpan = document.createElement("span");
            const directionIcon = item.direction === "start" ? "←" : "→";
            const directionText = item.direction === "start" ? "Al Inicio" : "Al Final";
            wordSpan.innerHTML = `<b>${item.word}</b> <small style="color: #666;">(${directionIcon} ${directionText})</small>`;
            // Contenedor para los botones
            const btnContainer = document.createElement("span");
            btnContainer.style.display = "flex";
            btnContainer.style.gap = "4px";
            // Botón Editar
            const editBtn = document.createElement("button");
            editBtn.innerHTML = "✏️";
            editBtn.title = "Editar";
            editBtn.style.border = "none";
            editBtn.style.background = "transparent";
            editBtn.style.cursor = "pointer";
            editBtn.addEventListener("click", () => 
            {
                const originalIndex = window.swapWords.findIndex(sw => sw.word === item.word);
                if (originalIndex > -1) {
                    openSwapWordEditor(window.swapWords[originalIndex], originalIndex);
                }
            });
            // Botón Eliminar
            const deleteBtn = document.createElement("button");
            deleteBtn.innerHTML = "🗑️";
            deleteBtn.title = "Eliminar";
            deleteBtn.style.border = "none";
            deleteBtn.style.background = "transparent";
            deleteBtn.style.cursor = "pointer";
            deleteBtn.addEventListener("click", () => 
            {
                if (confirm(`¿Eliminar la palabra swap '${item.word}'?`)) 
                {
                    const indexToDelete = window.swapWords.findIndex(sw => sw.word === item.word);
                    if (indexToDelete > -1) 
                    {
                        window.swapWords.splice(indexToDelete, 1);
                        saveSwapWordsToStorage();
                        renderSwapList();
                    }
                }
            });
            btnContainer.appendChild(editBtn);
            btnContainer.appendChild(deleteBtn);
            li.appendChild(wordSpan);
            li.appendChild(btnContainer);
            swapList.appendChild(li);
        });
    }
    // Render inicial y listener del selector
    renderReplacementsList(listElement);
    renderSwapList();
    modeSelector.addEventListener("change", () => 
    {
        replacementsContainer.style.display = modeSelector.value === "words" ? "block" : "none";
        swapContainer.style.display = modeSelector.value === "swapStart" ? "block" : "none";
    });
}// Crea el gestor de diccionario
//Permite crear la lista de palabras swap
function renderSwapList() 
{
    const searchInput = document.getElementById("searchSwapInput");
    const swapList = swapContainer.querySelector("ul") || (() => 
    {
        const ul = document.createElement("ul");
        ul.id = "swapList";
        ul.style.maxHeight = "120px";
        ul.style.overflowY = "auto";
        ul.style.border = "1px solid #ddd";
        ul.style.padding = "8px";
        ul.style.margin = "0";
        ul.style.background = "#fff";
        ul.style.listStyle = "none";
        swapContainer.appendChild(ul);
        return ul;
    })();

    swapList.innerHTML = "";

    if (!window.swapWords || window.swapWords.length === 0) {
        const li = document.createElement("li");
        li.textContent = "No hay palabras de intercambio definidas.";
        li.style.textAlign = "center";
        li.style.color = "#777";
        swapList.appendChild(li);
        return;
    }

    const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : "";
    const filteredSwapWords = window.swapWords.filter(item => item.word.toLowerCase().includes(searchTerm));

    filteredSwapWords.forEach((item, index) => {
        const li = document.createElement("li");
        li.style.display = "flex";
        li.style.justifyContent = "space-between";
        li.style.alignItems = "center";
        li.style.padding = "4px 2px";
        li.style.borderBottom = "1px solid #f0f0f0";

        const wordSpan = document.createElement("span");
        const directionIcon = item.direction === "start" ? "←" : "→";
        const directionText = item.direction === "start" ? "Al Inicio" : "Al Final";
        wordSpan.innerHTML = `<b>${item.word}</b> <small style="color: #666;">(${directionIcon} ${directionText})</small>`;

        const btnContainer = document.createElement("span");
        btnContainer.style.display = "flex";
        btnContainer.style.gap = "4px";

        // Botón Editar
        const editBtn = document.createElement("button");
        editBtn.innerHTML = "✏️";
        editBtn.title = "Editar";
        editBtn.style.border = "none";
        editBtn.style.background = "transparent";
        editBtn.style.cursor = "pointer";
        editBtn.addEventListener("click", () => {
            const originalIndex = window.swapWords.findIndex(sw => sw.word === item.word);
            if (originalIndex > -1) {
                openSwapWordEditor(window.swapWords[originalIndex], originalIndex);
            }
        });

        // Botón Eliminar
        const deleteBtn = document.createElement("button");
        deleteBtn.innerHTML = "🗑️";
        deleteBtn.title = "Eliminar";
        deleteBtn.style.border = "none";
        deleteBtn.style.background = "transparent";
        deleteBtn.style.cursor = "pointer";
        deleteBtn.addEventListener("click", () => {
            if (confirm(`¿Eliminar la palabra swap '${item.word}'?`)) 
            {
                const indexToDelete = window.swapWords.findIndex(sw => sw.word === item.word);
                if (indexToDelete > -1)
                {
                    window.swapWords.splice(indexToDelete, 1);
                    saveSwapWordsToStorage();
                    renderSwapList();
                }
            }
        });

        btnContainer.appendChild(editBtn);
        btnContainer.appendChild(deleteBtn);

        li.appendChild(wordSpan);
        li.appendChild(btnContainer);
        swapList.appendChild(li);
    });
}//renderSwapList
// Renderiza la lista de palabras excluidas
function renderExcludedWordsList(ulElement, filter = "")
{
    // Asegurarse de que ulElement es un elemento UL válido
    if (!ulElement)
    {
        return;
    }
    // Asegurarse de que ulElement es válido
    const currentFilter = filter.toLowerCase();
    ulElement.innerHTML = "";
    // Asegurarse de que excludedWords es un Set
    const wordsToRender = Array.from(excludedWords).filter(word => word.toLowerCase().includes(currentFilter))
        .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
    // Si no hay palabras para renderizar, mostrar mensaje
    if (wordsToRender.length === 0)
    {
        const li = document.createElement("li");
        li.textContent = "No hay palabras excluidas.";
        li.style.textAlign = "center";
        li.style.color = "#777";
        ulElement.appendChild(li);
        return;
    }
    // Renderizar cada palabra
    wordsToRender.forEach(word =>
    {
        const li = document.createElement("li");
        li.style.display = "flex"; // Agregado para alinear texto y botones
        li.style.justifyContent = "space-between"; // Agregado para espacio entre texto y botones
        li.style.alignItems = "center"; // Agregado para centrado vertical
        li.style.padding = "5px";
        li.style.borderBottom = "1px solid #ddd";
        // Span para el texto de la palabra
        const wordSpan = document.createElement("span");
        wordSpan.textContent = word;
        wordSpan.style.flexGrow = "1"; // Permite que el texto ocupe el espacio disponible
        wordSpan.style.marginRight = "10px"; // Espacio entre el texto y los botones
        li.appendChild(wordSpan);
        //Bloque para los botones de edición y eliminación ---
        const btnContainer = document.createElement("span");
        btnContainer.style.display = "flex";
        btnContainer.style.gap = "8px"; // Espacio entre los botones
        // Botón de edición
        const editBtn = document.createElement("button");
        editBtn.innerHTML = "✏️"; // Icono de lápiz
        editBtn.title = "Editar";
        editBtn.style.border = "none";
        editBtn.style.background = "transparent";
        editBtn.style.cursor = "pointer";
        editBtn.style.padding = "2px";
        editBtn.style.fontSize = "14px";
        editBtn.addEventListener("click", () => 
        {
            const newWord = prompt("Editar palabra:", word);
            if (newWord !== null && newWord.trim() !== word) 
            {
                const validation = isValidExcludedWord(newWord.trim());
                if (!validation.valid) 
                {
                    plnToast(validation.msg,3000);
                    return;
                }
                // Eliminar la palabra antigua del Set y Map
                excludedWords.delete(word);
                const oldFirstChar = word.charAt(0).toLowerCase();
                if (excludedWordsMap.has(oldFirstChar)) 
                {
                    excludedWordsMap.get(oldFirstChar).delete(word);
                    if (excludedWordsMap.get(oldFirstChar).size === 0) 
                    {
                        excludedWordsMap.delete(oldFirstChar);
                    }
                }
                // Añadir la nueva palabra al Set y Map
                const trimmedNewWord = newWord.trim();
                excludedWords.add(trimmedNewWord);
                const newFirstChar = trimmedNewWord.charAt(0).toLowerCase();
                if (!excludedWordsMap.has(newFirstChar)) 
                {
                    excludedWordsMap.set(newFirstChar, new Set());
                }
                excludedWordsMap.get(newFirstChar).add(trimmedNewWord);
                renderExcludedWordsList(ulElement, currentFilter);
                saveExcludedWordsToLocalStorage();
            }
        });
        btnContainer.appendChild(editBtn);
        // Botón de eliminación
        const deleteBtn = document.createElement("button");
        deleteBtn.innerHTML = "🗑️"; // Icono de bote de basura
        deleteBtn.title = "Eliminar";
        deleteBtn.style.border = "none";
        deleteBtn.style.background = "transparent";
        deleteBtn.style.cursor = "pointer";
        deleteBtn.style.padding = "2px";
        deleteBtn.style.fontSize = "14px";
        deleteBtn.addEventListener("click", () => 
        {
            if (confirm(`¿Eliminar la palabra '${word}' de la lista de especiales?`)) 
            {
                excludedWords.delete(word);
                const firstChar = word.charAt(0).toLowerCase();
                if (excludedWordsMap.has(firstChar)) 
                {
                    excludedWordsMap.get(firstChar).delete(word);
                    if (excludedWordsMap.get(firstChar).size === 0)
                    {
                        excludedWordsMap.delete(firstChar);
                    }
                }
                renderExcludedWordsList(ulElement, currentFilter);
                saveExcludedWordsToLocalStorage();
            }
        });
        btnContainer.appendChild(deleteBtn);
        li.appendChild(btnContainer);
        ulElement.appendChild(li);
    });//
}// renderExcludedWordsList

// Función para renderizar la lista de lugares excluidos
function renderExcludedPlacesList(ulElement, filter = "")
{
    // Asegurarse de que ulElement es un elemento UL válido
    if (!ulElement) return;
    ulElement.innerHTML = "";
    const lowerFilter = filter.toLowerCase();
    // Ahora excludedPlaces es un Map<ID, Nombre>. Iteramos sobre sus entries.
    const placesToRender = Array.from(excludedPlaces.entries()).filter(([placeId, placeNameSaved]) =>
        // Filtra por ID o por el nombre guardado
        placeId.toLowerCase().includes(lowerFilter) || placeNameSaved.toLowerCase().includes(lowerFilter)).sort((a, b) => 
        {
            // Ordena alfabéticamente por el nombre guardado
            return a[1].toLowerCase().localeCompare(b[1].toLowerCase()); // Compara por el nombre (índice 1 del entry)
        });
        // Si no hay lugares para renderizar, mostrar mensaje
        if (placesToRender.length === 0)
        {
            const li = document.createElement("li");
            li.textContent = "No hay lugares excluidos.";
            li.style.textAlign = "center";
            li.style.color = "#777";
            li.style.padding = "5px";
            ulElement.appendChild(li);
            return;
        }
        // Renderizar cada lugar
        placesToRender.forEach(([placeId, placeNameSaved]) =>
        { // Ahora recibimos [ID, NombreGuardado]
            const li = document.createElement("li");
            li.style.display = "flex";
            li.style.justifyContent = "space-between";
            li.style.alignItems = "center";
            li.style.padding = "4px 2px";
            li.style.borderBottom = "1px solid #f0f0f0";
            // Muestra el nombre guardado, con un fallback si el nombre guardado está vacío.
            const displayName = placeNameSaved || `ID: ${placeId}`;
            const linkSpan = document.createElement("span");
            linkSpan.style.flexGrow = "1";
            linkSpan.style.marginRight = "10px";
            const link = document.createElement("a");
            link.href = "#";
            link.textContent = displayName; // Muestra el nombre guardado
            link.title = `Abrir lugar en WME (ID: ${placeId})`; // El tooltip sigue mostrando el ID
            link.addEventListener("click", (e) =>
            {
                e.preventDefault();
                // Intenta obtener el lugar del modelo para seleccionarlo y centrarlo
                // Usamos W.model como fallback si wmeSDK.DataModel.Venues.getById no es eficiente aquí o no está diseñado para esta interacción
                const venueObj = W.model.venues.getObjectById(placeId); // <---
                const venueSDKForUse = venueSDKForRender; // Objeto del SDK que pasamos desde processNextPlace
                if (venueObj)
                {
                    if (W.map && typeof W.map.setCenter === 'function' && venueObj.getOLGeometry && venueObj.getOLGeometry().getCentroid)
                    {
                        W.map.setCenter(venueObj.getOLGeometry().getCentroid(), null, false, 0); 
                    }
                    if (W.selectionManager && typeof W.selectionManager.select === 'function') 
                    {
                        W.selectionManager.select(venueObj); // <--- REINTRODUCIMOS W.selectionManager.select
                    } else if (W.selectionManager && typeof W.selectionManager.setSelectedModels === 'function') 
                    {
                        W.selectionManager.setSelectedModels([venueObj]); // Fallback para versiones antiguas
                    }
                }
                else
                {
                    // Si el lugar no está en el modelo (fuera de vista), avisa y ofrece abrir en nueva pestaña.
                    const confirmOpen = confirm(`Lugar '${displayName}' (ID: ${placeId}) no encontrado en el modelo actual. ¿Deseas abrirlo en una nueva pestaña del editor?`);
                    if (confirmOpen)
                    {
                        const wmeUrl = `https://www.waze.com/editor?env=row&venueId=${placeId}`;
                        window.open(wmeUrl, '_blank');
                    }
                }
            });
            linkSpan.appendChild(link);
            li.appendChild(linkSpan);
            // Botón para eliminar el lugar de la lista de excluidos.
            const deleteBtn = document.createElement("button");
            deleteBtn.innerHTML = "🗑️";
            deleteBtn.title = "Eliminar lugar de la lista de excluidos";
            deleteBtn.style.border = "none";
            deleteBtn.style.background = "transparent";
            deleteBtn.style.cursor = "pointer";
            deleteBtn.style.padding = "2px";
            deleteBtn.style.fontSize = "14px";
            deleteBtn.addEventListener("click", () => {
            // ************************************************************
            // INICIO DE LA MODIFICACIÓN: Modal de confirmación "bonito"
            // ************************************************************
            const confirmModal = document.createElement("div");
            confirmModal.style.position = "fixed";
            confirmModal.style.top = "50%";
            confirmModal.style.left = "50%";
            confirmModal.style.transform = "translate(-50%, -50%)";
            confirmModal.style.background = "#fff";
            confirmModal.style.border = "1px solid #aad";
            confirmModal.style.padding = "28px 32px 20px 32px";
            confirmModal.style.zIndex = "20000"; // Z-INDEX ALTO
            confirmModal.style.boxShadow = "0 4px 24px rgba(0,0,0,0.18)";
            confirmModal.style.fontFamily = "sans-serif";
            confirmModal.style.borderRadius = "10px";
            confirmModal.style.textAlign = "center";
            confirmModal.style.minWidth = "340px";
            // Ícono visual
            const iconElement = document.createElement("div");
            iconElement.innerHTML = "⚠️"; // Ícono de advertencia
            iconElement.style.fontSize = "38px";
            iconElement.style.marginBottom = "10px";
            confirmModal.appendChild(iconElement);
            // Mensaje principal
            const messageTitle = document.createElement("div");
            messageTitle.innerHTML = `<b>¿Eliminar de excluidos "${placeNameSaved}"?</b>`;
            messageTitle.style.fontSize = "20px";
            messageTitle.style.marginBottom = "8px";
            confirmModal.appendChild(messageTitle);
            // Mensaje explicativo
            const explanationDiv = document.createElement("div");
            explanationDiv.textContent = `Este lugar volverá a aparecer en futuras búsquedas del normalizador.`;
            explanationDiv.style.fontSize = "15px";
            explanationDiv.style.color = "#555";
            explanationDiv.style.marginBottom = "18px";
            confirmModal.appendChild(explanationDiv);
            // Botones de confirmación
            const buttonWrapper = document.createElement("div");
            buttonWrapper.style.display = "flex";
            buttonWrapper.style.justifyContent = "center";
            buttonWrapper.style.gap = "18px";
            // Botón Cancelar
            const cancelBtn = document.createElement("button");
            cancelBtn.textContent = "Cancelar";
            cancelBtn.style.padding = "7px 18px";
            cancelBtn.style.background = "#eee";
            cancelBtn.style.border = "none";
            cancelBtn.style.borderRadius = "4px";
            cancelBtn.style.cursor = "pointer";
            cancelBtn.addEventListener("click", () => confirmModal.remove());
            // Botón Confirmar Eliminación
            const confirmDeleteBtn = document.createElement("button");
            confirmDeleteBtn.textContent = "Eliminar";
            confirmDeleteBtn.style.padding = "7px 18px";
            confirmDeleteBtn.style.background = "#d9534f"; // Rojo
            confirmDeleteBtn.style.color = "#fff";
            confirmDeleteBtn.style.border = "none";
            confirmDeleteBtn.style.borderRadius = "4px";
            confirmDeleteBtn.style.cursor = "pointer";
            confirmDeleteBtn.style.fontWeight = "bold";
            confirmDeleteBtn.addEventListener("click", () => 
            {
                // Aquí va la lógica que antes estaba directamente en el if(confirm)
                excludedPlaces.delete(placeId); // Sigue eliminando por ID
                renderExcludedPlacesList(ulElement, filter); // Vuelve a renderizar la lista después de eliminar.
                saveExcludedPlacesToLocalStorage(); // Guarda los cambios en localStorage.
                showTemporaryMessage("Lugar eliminado de la lista de excluidos.", 3000, 'success');
                confirmModal.remove(); // Cerrar el modal después de la acción
            });
            buttonWrapper.appendChild(cancelBtn);
            buttonWrapper.appendChild(confirmDeleteBtn);
            confirmModal.appendChild(buttonWrapper);
            document.body.appendChild(confirmModal); // Añadir el modal al body
        });
        li.appendChild(deleteBtn);
        ulElement.appendChild(li);
    });
}// renderExcludedPlacesList

// Renderizar lista de palabras del diccionario
function renderDictionaryList(ulElement, filter = "")
{
    // Asegurarse de que ulElement es válido
    if (!ulElement || !window.dictionaryWords)
        return;
    // Asegurarse de que ulElement es válido
    const currentFilter = filter.toLowerCase();
    ulElement.innerHTML = "";
    // Asegurarse de que dictionaryWords es un Set
    const wordsToRender =
    Array.from(window.dictionaryWords)
        .filter(word => word.toLowerCase().startsWith(currentFilter))
        .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
    // Si no hay palabras que renderizar, mostrar mensaje
    if (wordsToRender.length === 0)
    {
        const li = document.createElement("li");
        li.textContent = window.dictionaryWords.size === 0
                        ? "El diccionario está vacío."
                        : "No hay coincidencias.";
        li.style.textAlign = "center";
        li.style.color = "#777";
        ulElement.appendChild(li);
        // Guardar diccionario también cuando está vacío
        try
        {
            localStorage.setItem(
            "dictionaryWordsList",
            JSON.stringify(Array.from(window.dictionaryWords)));
        }
        catch (e)
        {
            plnLog('error', "[WME PLN] Error guardando el diccionario en localStorage:", e);
        }
        return;
    }
    // Renderizar cada palabra
    wordsToRender.forEach(word => 
    {
        const li = document.createElement("li");
        li.style.display = "flex";
        li.style.justifyContent = "space-between";
        li.style.alignItems = "center";
        li.style.padding = "4px 2px";
        li.style.borderBottom = "1px solid #f0f0f0";
        // Span para la palabra
        const wordSpan = document.createElement("span");
        wordSpan.textContent = word;
        wordSpan.style.maxWidth = "calc(100% - 60px)";
        wordSpan.style.overflow = "hidden";
        wordSpan.style.textOverflow = "ellipsis";
        wordSpan.style.whiteSpace = "nowrap";
        wordSpan.title = word;
        li.appendChild(wordSpan);
        // Contenedor para los iconos de acción
        const iconContainer = document.createElement("span");
        iconContainer.style.display = "flex";
        iconContainer.style.gap = "8px";
        // Botón de edición y eliminación
        const editBtn = document.createElement("button");
        editBtn.innerHTML = "✏️";
        editBtn.title = "Editar";
        editBtn.style.border = "none";
        editBtn.style.background = "transparent";
        editBtn.style.cursor = "pointer";
        editBtn.style.padding = "2px";
        editBtn.style.fontSize = "14px";
        editBtn.addEventListener("click", () => {
            const newWord = prompt("Editar palabra:", word);
            if (newWord !== null && newWord.trim() !== word)
            {
                window.dictionaryWords.delete(word);
                window.dictionaryWords.add(newWord.trim());
                renderDictionaryList(ulElement, currentFilter);
            }
        });
        // Botón de eliminación
        const deleteBtn = document.createElement("button");
        deleteBtn.innerHTML = "🗑️";
        deleteBtn.title = "Eliminar";
        deleteBtn.style.border = "none";
        deleteBtn.style.background = "transparent";
        deleteBtn.style.cursor = "pointer";
        deleteBtn.style.padding = "2px";
        deleteBtn.style.fontSize = "14px";
        deleteBtn.addEventListener("click", () => 
        {
            // Confirmación antes de eliminar
            if (confirm(`¿Eliminar la palabra '${word}' del diccionario?`))
            {
                window.dictionaryWords.delete(word);
                renderDictionaryList(ulElement, currentFilter);
            }
        });
        iconContainer.appendChild(editBtn);
        iconContainer.appendChild(deleteBtn);
        li.appendChild(iconContainer);
        ulElement.appendChild(li);
    });
    // Guardar el diccionario actualizado en localStorage después de cada render
    try
    {
        localStorage.setItem("dictionaryWordsList", JSON.stringify(Array.from(window.dictionaryWords)));
    }
    catch (e)
    {
        plnLog('error',"[WME PLN] Error guardando el diccionario en localStorage:", e);
    }
}// renderDictionaryList

// Renderiza la lista de reemplazos
function renderReplacementsList(ulElement)
{
    plnLog('swap', "[WME_PLN][DEBUG] renderReplacementsList llamada para:", ulElement ? ulElement.id : "Elemento UL nulo");
    if (!ulElement)
    {
        plnLog('error',"[WME PLN] Elemento UL para reemplazos no proporcionado a renderReplacementsList.");
        return;
    }
    ulElement.innerHTML = ""; // Limpiar lista actual
    const entries = Object.entries(replacementWords);
    // Si no hay reemplazos, mostrar mensaje
    if (entries.length === 0)
    {
        const li = document.createElement("li");
        li.textContent = "No hay reemplazos definidos.";
        li.style.textAlign = "center";
        li.style.color = "#777";
        li.style.padding = "5px";
        ulElement.appendChild(li);
        return;
    }
    // Ordenar alfabéticamente por la palabra original (from)
    entries.sort((a, b) =>  a[0].toLowerCase().localeCompare(b[0].toLowerCase()));
    entries.forEach(([from, to]) =>
    {
        const li = document.createElement("li");
        li.style.display = "flex";
        li.style.justifyContent = "space-between";
        li.style.alignItems = "center";
        li.style.padding = "4px 2px";
        li.style.borderBottom = "1px solid #f0f0f0";
        // Añadir un tooltip al elemento li
        const textContainer = document.createElement("div");
        textContainer.style.flexGrow = "1";
        textContainer.style.overflow = "hidden";
        textContainer.style.textOverflow = "ellipsis";
        textContainer.style.whiteSpace = "nowrap";
        textContainer.title = `Reemplazar "${from}" con "${to}"`;
        // Crear los spans para mostrar el texto
        const fromSpan = document.createElement("span");
        fromSpan.textContent = from;
        fromSpan.style.fontWeight = "bold";
        textContainer.appendChild(fromSpan);
        // Añadir un espacio entre el "from" y el "to"
        const arrowSpan = document.createElement("span");
        arrowSpan.textContent = " → ";
        arrowSpan.style.margin = "0 5px";
        textContainer.appendChild(arrowSpan);
        // Span para el texto de reemplazo
        const toSpan = document.createElement("span");
        toSpan.textContent = to;
        toSpan.style.color = "#007bff";
        textContainer.appendChild(toSpan);
        // Añadir el contenedor de texto al li
        li.appendChild(textContainer);
        // Botón Editar
        const editBtn = document.createElement("button");
        editBtn.innerHTML = "✏️";
        editBtn.title = "Editar este reemplazo";
        editBtn.style.border = "none";
        editBtn.style.background = "transparent";
        editBtn.style.cursor = "pointer";
        editBtn.style.padding = "2px 4px";
        editBtn.style.fontSize = "14px";
        editBtn.style.marginLeft = "4px";
        editBtn.addEventListener("click", () =>
        {
            const newFrom = prompt("Editar texto original:", from);
            if (newFrom === null) return;
            const newTo = prompt("Editar texto de reemplazo:", to);
            if (newTo === null) return;
            if (!newFrom.trim())
            {
                plnToast("El campo 'Texto Original' es requerido.", 3000);
                return;
            }
            if (newFrom === newTo)
            {
                plnToast("El texto original y el de reemplazo no pueden ser iguales.", 3000);
                return;
            }
            // Si cambia la clave, elimina la anterior
            if (newFrom !== from) delete replacementWords[from];
            replacementWords[newFrom] = newTo;
            renderReplacementsList(ulElement);
            saveReplacementWordsToStorage();
        });

        // Botón Eliminar
        const deleteBtn = document.createElement("button");
        deleteBtn.innerHTML = "🗑️";
        deleteBtn.title = `Eliminar este reemplazo`;
        deleteBtn.style.border = "none";
        deleteBtn.style.background = "transparent";
        deleteBtn.style.cursor = "pointer";
        deleteBtn.style.padding = "2px 4px";
        deleteBtn.style.fontSize = "14px";
        deleteBtn.style.marginLeft = "4px";
        deleteBtn.addEventListener("click", () =>
        {
            if (confirm(`¿Estás seguro de eliminar el reemplazo:\n"${from}" → "${to}"?`))
            {
                delete replacementWords[from];
                renderReplacementsList(ulElement);
                saveReplacementWordsToStorage();
            }
        });
        // Contenedor para los botones de acción
        const btnContainer = document.createElement("span");
        btnContainer.style.display = "flex";
        btnContainer.style.gap = "4px";
        btnContainer.appendChild(editBtn);
        btnContainer.appendChild(deleteBtn);
        // Añadir el contenedor de botones al li
        li.appendChild(btnContainer);
        ulElement.appendChild(li);
    });
}// renderReplacementsList
// Carga las palabras excluidas desde localStorage
function saveExcludedWordsToLocalStorage()
{
    try
    {
        localStorage.setItem("excludedWordsList", JSON.stringify(Array.from(excludedWords)));
        plnLog('swap', "[WME PLN] Lista de palabras especiales guardada en localStorage.");
    }
    catch (e)
    {
        plnLog('error',"[WME PLN] Error guardando palabras especiales en localStorage:", e);
    }
}// saveExcludedWordsToLocalStorage
// Carga las palabras excluidas desde localStorage
// Añadir esta función dentro de WME_PLN_module_lists.js
function loadExcludedWordsFromLocalStorage()
{
    if (!window.excludedWords)
    {
        const stored = localStorage.getItem('wme_excludedWords'); // Ojo: la clave era diferente
        if (stored)
        {
            try
            {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed))
                {
                    window.excludedWords = new Set(parsed);
                }
            }
            catch (e)
            {
                plnLog('error','No se pudieron cargar las palabras excluidas:', e);
            }
        }
        // Asegurarse que window.excludedWords sea un Set si no existe
        if (!(window.excludedWords instanceof Set))
        {
            window.excludedWords = new Set();
        }
    }
}// loadExcludedWordsFromLocalStorage
// Función para guardar los IDs de lugares excluidos en localStorage
function saveExcludedPlacesToLocalStorage()
{
    try
    {
        // Convertir el Map a un array de arrays antes de stringify
        localStorage.setItem("excludedPlacesList", JSON.stringify(Array.from(excludedPlaces.entries())));
        plnLog('swap', '[WME PLN] Lugares excluidos GUARDADOS EXITOSAMENTE.');
    }
    catch (e)
    {
        plnLog('error','[WME PLN] Error guardando lugares excluidos en localStorage:', e);
    }
}// saveExcludedPlacesToLocalStorage
// Función para cargar los IDs de lugares excluidos desde localStorage
function loadExcludedPlacesFromLocalStorage()
{
    if (!window.excludedPlaces)
    {
        const storedData = localStorage.getItem('wme_excluded_places');
        if (storedData)
        {
            try
            {
                // El formato guardado es un array de [id, nombre]
                const parsedArray = JSON.parse(storedData);
                if (Array.isArray(parsedArray))
                {
                    // Convertimos el array de nuevo a un Map
                    window.excludedPlaces = new Map(parsedArray);
                }
            }
            catch (e)
            {
                plnLog('error','No se pudieron cargar los lugares excluidos:', e);
            }
        }

        // Si después de todo no es un Map, lo inicializamos como uno vacío
        if (!(window.excludedPlaces instanceof Map))
        {
            window.excludedPlaces = new Map();
        }
    }
}// loadExcludedPlacesFromLocalStorage
// Función para cargar palabras del diccionario desde Google Sheets (Hoja "Dictionary")
async function loadDictionaryWordsFromSheet(forceReload = false)
{
    const SPREADSHEET_ID = "1kJDEOn8pKLdqEyhIZ9DdcrHTb_GsoeXgIN4GisrpW2Y";
    const API_KEY = "AIzaSyAQbvIQwSPNWfj6CcVEz5BmwfNkao533i8";
    const RANGE = "Dictionary!A2:B";

    // usa window.dictionaryWords y window.dictionaryIndex para almacenar las palabras y su índice
    // Si no existen, las inicializa como un Set y un objeto vacío
    if (!window.dictionaryWords) window.dictionaryWords = new Set();
    if (!window.dictionaryIndex) window.dictionaryIndex = {};

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`;

    return new Promise((resolve) =>
    {
        if (SPREADSHEET_ID === "TU_SPREADSHEET_ID" || API_KEY === "TU_API_KEY")
        {
            plnLog('warn','[WME PLN] SPREADSHEET_ID o API_KEY no configurados para el diccionario.');
            resolve();
            return;
        }

    // verifica si hay datos en caché
    // Si hay datos en caché y no se fuerza la recarga, los usa
    // Si no hay datos en caché o se fuerza la recarga, hace la solicitud
    const cachedData = localStorage.getItem("wme_pln_dictionary_cache");
    if (!forceReload && cachedData)
    {
        try
        {
            const { data, timestamp } = JSON.parse(cachedData);
            // usar caché si tiene menos de 24 horas
            if (data && timestamp && (Date.now() - timestamp < 24 * 60 * 60 * 1000))
            {
                plnLog('sdk', '[WME PLN] Usando datos en caché. Tiempo restante para expirar:', ((timestamp + 24 * 60 * 60 * 1000) - Date.now())/1000/60, 'minutos');
                plnLog('swap', '[WME PLN] Usando diccionario en caché');
                // restaura las palabras y el índice del diccionario desde la caché
                window.dictionaryWords = new Set(data.words);
                window.dictionaryIndex = data.index;
                resolve();
                return;
            }
        } catch (e) {
            plnLog('warn','[WME PLN] Error al leer caché del diccionario:', e);
        }
    }
    makeRequest(
    {
        method: "GET",
        url: url,
        timeout: 10000,
            onload: function (response)
            {
                if (response.status >= 200 && response.status < 300)
                {
                    try
                    {
                        const data = JSON.parse(response.responseText);
                        let newWordsAdded = 0;

                        if (data.values)
                        {
                            data.values.forEach(row =>
                            {
                                const word = (row[0] || '').trim();
                                if (word && !window.dictionaryWords.has(word.toLowerCase()))
                                {
                                    window.dictionaryWords.add(word.toLowerCase());
                                    const firstChar = word.charAt(0).toLowerCase();
                                    if (!window.dictionaryIndex[firstChar])
                                        window.dictionaryIndex[firstChar] = [];
                                    window.dictionaryIndex[firstChar].push(word.toLowerCase());
                                    newWordsAdded++;
                                }
                            });

                            // Cache the dictionary
                            try
                            {
                                localStorage.setItem("wme_pln_dictionary_cache", JSON.stringify(
                                {
                                    data:
                                    {
                                        words: Array.from(window.dictionaryWords),
                                        index: window.dictionaryIndex
                                    },
                                    timestamp: Date.now()
                                }));
                            }
                            catch (e)
                            {
                                plnLog('warn','[WME PLN] Error al guardar caché del diccionario:', e);
                            }
                            // también guarda en localStorage para uso rápido
                            try
                            {
                                localStorage.setItem("dictionaryWordsList", JSON.stringify(Array.from(window.dictionaryWords)));
                            }
                            catch (e)
                            {
                                plnLog('error',"[WME PLN] Error guardando diccionario en localStorage:", e);
                            }

                            plnLog('swap', `[WME PLN] Diccionario cargado: ${newWordsAdded} palabras nuevas añadidas.`);
                        }
                    }
                    catch (e)
                    {
                        plnLog('error','[WME PLN] Error al procesar datos del diccionario:', e);
                    }
                }
                resolve();
            },
            // Añade esto en ambas funciones, justo después del try/catch en onload:
            onerror: function (error)
            {
                plnLog('error','[WME PLN] Error de red al cargar datos desde Google Sheets:', error);
                plnLog('scan', '[WME PLN] URL que falló:', url);
                resolve(); // Resolver la promesa para no bloquear
            },
            ontimeout: function ()
            {
                plnLog('error','[WME PLN] Timeout al cargar diccionario');
                resolve();
            }
        });
    });
}//loadDictionaryWordsFromSheet
// Carga las palabras reemplazo
function saveReplacementWordsToStorage()
{
    try
    {
        localStorage.setItem("replacementWordsList", JSON.stringify(replacementWords));
        plnLog('swap', "[WME PLN] Lista de reemplazos guardada en localStorage.");
    }
    catch (e)
    {
        plnLog('error',"[WME PLN] Error guardando lista de reemplazos en localStorage:", e);
    }
}// saveReplacementWordsToStorage
// Carga las palabras excluidas desde localStorage
function loadReplacementWordsFromStorage()
{
    const savedReplacements = localStorage.getItem("replacementWordsList");
    if (savedReplacements)
    {
        try
        {
            replacementWords = JSON.parse(savedReplacements);
            if (typeof replacementWords !== 'object' || replacementWords === null)
            { // Asegurar que sea un objeto
                replacementWords = {};
            }
        }
        catch (e)
        {
            plnLog('error',"[WME PLN] Error cargando lista de reemplazos desde localStorage:", e);
            replacementWords = {};
        }
    }
    else
    {
        replacementWords = {}; // Inicializar si no hay nada guardado
    }
    plnLog('swap', "[WME PLN] Reemplazos cargados:",    Object.keys(replacementWords).length, "reglas.");
}// loadReplacementWordsFromStorage

 // Carga las palabras excluidas desde localStorage
// Función para guardar las palabras swap en localStorage (formato nuevo)
function saveSwapWordsToStorage()
{
    try
    {
        localStorage.setItem("swapWords", JSON.stringify(window.swapWords || []));
        plnLog('swap', "[WME PLN] SwapWords guardadas en localStorage:", window.swapWords ? window.swapWords.length : 0, "palabras");
    }
    catch (e)
    {
        plnLog('error',"[WME PLN] Error guardando swapWords en localStorage:", e);
    }
}// saveSwapWordsToStorage

   // Función para cargar las palabras swap desde localStorage con migración automática
function loadSwapWordsFromStorage()
{
    const stored = localStorage.getItem("swapWords");

    // Si hay datos en localStorage, intentar parsearlos
    if (stored)
    {
        try
        {
            const parsed = JSON.parse(stored);

            // MIGRACIÓN AUTOMÁTICA: Verificar el formato de los datos
            if (Array.isArray(parsed) && parsed.length > 0)
            {
                // Verificar si es formato antiguo (array de strings)
                if (typeof parsed[0] === "string")
                {
                   plnLog('swap', "[WME PLN] Detectado formato antiguo de swapWords. Migrando automáticamente...");

                    // Migrar formato antiguo a nuevo formato
                    window.swapWords = parsed.map(word => ({
                        word: word,
                        direction: "start" // Todas las palabras existentes se configuran como "start" por defecto
                    }));

                    // Guardar el nuevo formato inmediatamente
                    saveSwapWordsToStorage();
                   plnLog('swap', `[WME PLN] Migración completada: ${window.swapWords.length} palabras migradas a formato 'start'.`);
                }
                else if (typeof parsed[0] === "object" && parsed[0].hasOwnProperty('word'))
                {
                    // Ya está en formato nuevo
                    window.swapWords = parsed;
                   plnLog('swap', "[WME PLN] Formato nuevo de swapWords detectado. No se requiere migración.");
                }
                else
                {
                    // Formato desconocido, inicializar vacío
                    plnLog('warn',"[WME PLN] Formato desconocido en swapWords. Inicializando lista vacía.");
                    window.swapWords = [];
                }
            }
            else
            {
                // Array vacío o null
                window.swapWords = [];
            }
        }
        catch (e)
        {
            plnLog('error',"[WME PLN] Error al parsear swapWords desde localStorage:", e);
            window.swapWords = [];
        }
    }
    else
    {
        // No hay datos guardados
        window.swapWords = [];
    }
}// loadSwapWordsFromStorage
