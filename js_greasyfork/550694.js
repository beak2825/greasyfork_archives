// ==UserScript==
// @name         Interactive Algebra on Drawaria
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Immersive fullscreen interactive panels for algebra learning.
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @grant        GM_registerMenuCommand
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @downloadURL https://update.greasyfork.org/scripts/550694/Interactive%20Algebra%20on%20Drawaria.user.js
// @updateURL https://update.greasyfork.org/scripts/550694/Interactive%20Algebra%20on%20Drawaria.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Estilos Globales para un Tema Claro, Grande y Moderno ---
    const lightThemeStyles = {
        windowBackground: '#ffffff', // Blanco puro
        windowColor: '#333333',     // Texto oscuro
        headerBackground: '#f8f9fa', // Gris muy claro para encabezados
        headerColor: '#8400ff',     // Púrpura vibrante para el título
        buttonPrimary: '#8400ff',   // Púrpura primario
        buttonSecondary: '#6c757d', // Gris oscuro
        buttonHover: '#6a00cc',     // Púrpura oscuro en hover
        borderColor: '#e9ecef',     // Borde gris sutil
        quizCorrect: '#28a745',     // Verde
        quizIncorrect: '#dc3545',   // Rojo
    };

    // Función para crear elementos con atributos y estilos
    function createElem(type, props = {}, styles = {}, parent = null) {
        const el = document.createElement(type);
        Object.entries(props).forEach(([k, v]) => el[k] = v);
        Object.entries(styles).forEach(([k, v]) => el.style[k] = v);
        if (parent) parent.appendChild(el);
        return el;
    }

    // Draggable mejorado
    function makeDraggable(el, handle) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        // La mejora: el drag solo inicia si no estamos haciendo clic en un botón de control
        handle.onmousedown = dragMouseDown;
        // DENTRO DE function makeDraggable(el, handle) { ... }

        let initialX, initialY, initialTop, initialLeft; // Nuevas variables para almacenar el estado

        handle.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            // Permitir el drag solo si el click no es en el botón de cerrar
            if (e.target.tagName === 'BUTTON') return;

            e.preventDefault();

            // Almacenar la posición inicial del ratón (e.clientX, e.clientY)
            initialX = e.clientX;
            initialY = e.clientY;

            // Almacenar la posición inicial del panel (el.offsetLeft, el.offsetTop)
            initialLeft = el.offsetLeft;
            initialTop = el.offsetTop;

            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e.preventDefault();

            // Calcula cuánto se ha movido el ratón desde el clic inicial
            const dx = e.clientX - initialX;
            const dy = e.clientY - initialY;

            // Calcula la nueva posición del panel, sumando el movimiento del ratón a la posición inicial del panel
            let newTop = initialTop + dy;
            let newLeft = initialLeft + dx;

            // --- Restricción de límites de la pantalla ---
            // Esto asegura que el panel no desaparezca, pero permite el movimiento fluido.
            newTop = Math.max(0, Math.min(window.innerHeight - el.offsetHeight, newTop));
            newLeft = Math.max(0, Math.min(window.innerWidth - el.offsetWidth, newLeft));
            // --------------------------------------------

            el.style.top = newTop + 'px';
            el.style.left = newLeft + 'px';
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    // --- Panel Principal (Menú) ---
    const menu = createElem('div', { id: 'algebraMainMenu' }, {
        position: 'fixed', top: '100px', left: '50px', width: '320px',
        background: lightThemeStyles.windowBackground, color: lightThemeStyles.windowColor,
        fontFamily: 'Roboto, sans-serif', fontSize: '18px',
        borderRadius: '16px', boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
        padding: '20px', zIndex: 99999, userSelect: 'none', cursor: 'default',
        border: '2px solid ' + lightThemeStyles.headerColor,
        transition: 'all 0.3s ease'
    }, document.body);

    // Drag handle & Close button
    const dragHandle = createElem('div', { id: 'dragHandle', innerText: '🟣 Álgebra Interactivo Pro' }, {
        cursor: 'move', background: lightThemeStyles.headerBackground,
        color: lightThemeStyles.headerColor, padding: '12px 20px',
        marginBottom: '20px', fontWeight: '900', fontSize: '1.4em',
        borderRadius: '12px', borderBottom: '3px solid ' + lightThemeStyles.headerColor,
        userSelect: 'none', position: 'relative', textAlign: 'center'
    }, menu);

    const closeMenuBtn = createElem('button', { innerText: '✖' }, {
        position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
        background: lightThemeStyles.buttonSecondary, border: 'none',
        borderRadius: '50%', color: 'white', cursor: 'pointer', fontWeight: 'bold',
        width: '35px', height: '35px', lineHeight: '1', padding: '0',
        fontSize: '1em', transition: 'background 0.2s'
    }, dragHandle);

    closeMenuBtn.onmouseover = () => closeMenuBtn.style.background = lightThemeStyles.quizIncorrect;
    closeMenuBtn.onmouseout = () => closeMenuBtn.style.background = lightThemeStyles.buttonSecondary;
    closeMenuBtn.onclick = () => menu.style.display = 'none';

    makeDraggable(menu, dragHandle); // El área de drag es todo el dragHandle

    // Botones para abrir ventanas independientes
    const buttonsInfo = [
        { id: 'btnConcepts', text: '📘 Conceptos Fundamentales' },
        { id: 'btnExercises', text: '💪 Taller de Ejercicios' },
        { id: 'btnExamples', text: '✨ Casos Prácticos Resueltos' },
        { id: 'btnQuizzes', text: '🏆 Desafío de Quizzes' }
    ];

    let windows = {};

    buttonsInfo.forEach(({ id, text }) => {
        const btn = createElem('button', { id, innerText: text }, {
            width: '100%', marginBottom: '15px', padding: '15px', borderRadius: '10px',
            fontWeight: 'bold', border: 'none', background: lightThemeStyles.buttonPrimary,
            color: 'white', cursor: 'pointer', userSelect: 'none', fontSize: '1.1em',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)', transition: 'background 0.2s, transform 0.1s'
        }, menu);
        btn.onmouseover = () => btn.style.background = lightThemeStyles.buttonHover;
        btn.onmouseout = () => btn.style.background = lightThemeStyles.buttonPrimary;
        btn.onmousedown = () => btn.style.transform = 'scale(0.98)';
        btn.onmouseup = () => btn.style.transform = 'scale(1)';

        btn.onclick = () => openWindow(id.replace('btn', '').toLowerCase());
    });

    // --- Contenido Extendido (Mismo que v3.0) ---
    const contentData = {
        concepts: `
            <h2 style="color:${lightThemeStyles.headerColor};margin-top:0;font-size:1.5em;">📘 Conceptos Clave del Álgebra</h2>
            <p style="font-size:1.1em;line-height:1.7;">El álgebra es la generalización de la aritmética. Usamos letras para representar cantidades desconocidas. ¡Es la clave para resolver problemas de la vida real!</p>
            <hr style="border-color:${lightThemeStyles.borderColor};margin:15px 0;">
            <h3>Principios Fundamentales:</h3>
            <ul style="list-style-type:square;padding-left:25px;line-height:1.8;font-size:1em;">
                <li>**Variable ($x, y$):** Un valor que puede cambiar. Es tu "número misterioso".</li>
                <li>**Coeficiente:** El número que multiplica a la variable (ej: el **3** en $3x$).</li>
                <li>**Término:** Una variable, un número, o el producto/cociente de ambos (ej: $5, 2x, x/3$).</li>
                <li>**Ecuación Lineal:** Aquella donde la variable tiene exponente 1 (ej: $4x - 1 = 15$).</li>
            </ul>
            <h3 style="color:${lightThemeStyles.buttonPrimary};">La Regla de la Balanza:</h3>
            <p style="font-style:italic;">Lo que haces a un lado de la ecuación, **debes** hacerlo al otro. ¡Así mantienes la igualdad!</p>
            <table style="width:100%; border-collapse:collapse; margin-top:10px; font-size:0.95em;">
                <tr style="background:${lightThemeStyles.headerBackground};"><th>Operación a Eliminar</th><th>Operación Inversa (Aplicar)</th></tr>
                <tr><td style="border:1px solid ${lightThemeStyles.borderColor}; padding:8px;">Suma (+)</td><td style="border:1px solid ${lightThemeStyles.borderColor}; padding:8px;">Resta (-)</td></tr>
                <tr><td style="border:1px solid ${lightThemeStyles.borderColor}; padding:8px;">Resta (-)</td><td style="border:1px solid ${lightThemeStyles.borderColor}; padding:8px;">Suma (+)</td></tr>
                <tr><td style="border:1px solid ${lightThemeStyles.borderColor}; padding:8px;">Multiplicación (*)</td><td style="border:1px solid ${lightThemeStyles.borderColor}; padding:8px;">División (/)</td></tr>
                <tr><td style="border:1px solid ${lightThemeStyles.borderColor}; padding:8px;">División (/)</td><td style="border:1px solid ${lightThemeStyles.borderColor}; padding:8px;">Multiplicación (*)</td></tr>
            </table>
        `,
        exercises: `
            <h2 style="color:${lightThemeStyles.headerColor};margin-top:0;font-size:1.5em;">💪 Taller de Ecuaciones (Escribe y Comprueba)</h2>
            <p style="font-size:1.1em;">Resuelve cada ecuación de UN o DOS pasos. Escribe tu respuesta y haz clic en "Comprobar".</p>
            <hr style="border-color:${lightThemeStyles.borderColor};margin:15px 0;">
            <div id="exerciseFormContainer">
                </div>
        `,
        examples: `
            <h2 style="color:${lightThemeStyles.headerColor};margin-top:0;font-size:1.5em;">✨ Casos Prácticos Resueltos (Método de Dos Pasos)</h2>
            <p style="font-size:1.1em;">La clave es deshacer la suma/resta **primero**, y luego la multiplicación/división.</p>

            <div style="margin-bottom:20px;padding:15px;border:2px solid ${lightThemeStyles.buttonPrimary};border-radius:10px;background:#f9f5ff;">
                <h4>Ejemplo 1: Aislar la variable ($x$)</h4>
                <p style="font-weight:bold;">Ecuación: $4x + 10 = 30$</p>
                <ol style="padding-left:20px;">
                    <li>**Paso 1 (Restar):** Deshacer el $+10$ restando 10 a ambos lados: $4x = 30 - 10 \implies 4x = 20$.</li>
                    <li>**Paso 2 (Dividir):** Deshacer el $4\cdot$ dividiendo entre 4 a ambos lados: $x = 20 / 4 \implies x = 5$.</li>
                    <li>**Comprobación:** $4(5) + 10 = 20 + 10 = 30$. ¡Correcto!</li>
                </ol>
            </div>

            <div style="margin-bottom:20px;padding:15px;border:2px solid ${lightThemeStyles.buttonPrimary};border-radius:10px;background:#f9f5ff;">
                <h4>Ejemplo 2: Variable Negativa ($a$)</h4>
                <p style="font-weight:bold;">Ecuación: $25 - 3a = 4$</p>
                <ol style="padding-left:20px;">
                    <li>**Paso 1 (Restar):** Deshacer el $+25$ restando 25: $-3a = 4 - 25 \implies -3a = -21$.</li>
                    <li>**Paso 2 (Dividir):** Dividir entre $-3$: $a = -21 / -3 \implies a = 7$. (Recuerda: menos entre menos es más).</li>
                    <li>**Comprobación:** $25 - 3(7) = 25 - 21 = 4$. ¡Correcto!</li>
                </ol>
            </div>
        `,
        quizzes: `
            <h2 style="color:${lightThemeStyles.headerColor};margin-top:0;font-size:1.5em;">🏆 Desafío de Quizzes (Selección Múltiple)</h2>
            <p style="font-size:1.1em;">Responde estas preguntas de opción múltiple para probar tus conocimientos.</p>
            <hr style="border-color:${lightThemeStyles.borderColor};margin:15px 0;">
            <div id="quizContainer">
                </div>
            <button id="checkAllQuizzesBtn" style="width:100%; padding:12px; margin-top:15px; background:${lightThemeStyles.buttonPrimary}; color:white; border:none; border-radius:8px; font-weight:bold; cursor:pointer; font-size:1.1em; transition:background 0.2s;">
                Comprobar Todas las Respuestas
            </button>
            <p id="quizGlobalFeedback" style="text-align:center;font-weight:bold;margin-top:15px;font-size:1.2em;"></p>
        `
    };

    // --- Data de Ejercicios y Quizzes ---
    const exerciseQuestions = [
        { q: "$x + 9 = 24$", variable: 'x', ans: 15, hint: "Resta 9 a ambos lados." },
        { q: "$5y = 45$", variable: 'y', ans: 9, hint: "Divide por 5." },
        { q: "$2z - 5 = 15$", variable: 'z', ans: 10, hint: "Suma 5, luego divide por 2." },
        { q: "$x/3 + 1 = 6$", variable: 'x', ans: 15, hint: "Resta 1, luego multiplica por 3." }
    ];

    const quizQuestions = [
        { q: "¿Qué operación inversa se usa para deshacer $x/5$?", ans: 'Multiplicación', options: ['Suma', 'Resta', 'División', 'Multiplicación'] },
        { q: "Si $3x = 18$, ¿cuánto vale $x$?", ans: '6', options: ['3', '6', '9', '15'] }, // Corregido: convertir a string para coincidir con radio value
        { q: "¿Cuál es el coeficiente en la expresión $7y - 2$?", ans: '7', options: ['7', 'y', '-2', '2'] },
        { q: "Si $a - 4 = 12$, ¿cuál es el valor de $a$?", ans: '16', options: ['8', '16', '3', '48'] }
    ];

    // --- Lógica del Taller de Ejercicios (Interactiva) ---
    function setupExercises(content) {
        const container = content.querySelector('#exerciseFormContainer');
        container.innerHTML = ''; // Limpiar

        exerciseQuestions.forEach((qData, index) => {
            const qDiv = createElem('div', {}, {
                marginBottom: '20px', padding: '15px', borderRadius: '10px',
                border: '1px solid ' + lightThemeStyles.borderColor, background: lightThemeStyles.headerBackground
            }, container);

            createElem('p', { innerHTML: `**Ejercicio ${index + 1}:** Resuelve ${qData.q}` }, {
                fontWeight: 'bold', marginBottom: '10px', fontSize: '1.1em'
            }, qDiv);

            const inputGroup = createElem('div', {}, { display: 'flex', gap: '10px', alignItems: 'center' }, qDiv);

            createElem('span', { innerText: `${qData.variable} = ` }, {
                fontWeight: 'bold', fontSize: '1.1em'
            }, inputGroup);

            const input = createElem('input', { type: 'number', placeholder: 'Tu respuesta' }, {
                padding: '8px', borderRadius: '5px', border: `1px solid ${lightThemeStyles.borderColor}`,
                flexGrow: 1, fontSize: '1em'
            }, inputGroup);

            const checkBtn = createElem('button', { innerText: 'Comprobar' }, {
                padding: '8px 12px', borderRadius: '5px', border: 'none',
                background: lightThemeStyles.buttonPrimary, color: 'white', cursor: 'pointer',
                transition: 'background 0.2s'
            }, inputGroup);
            checkBtn.onmouseover = () => checkBtn.style.background = lightThemeStyles.buttonHover;
            checkBtn.onmouseout = () => checkBtn.style.background = lightThemeStyles.buttonPrimary;

            const feedback = createElem('p', {}, {
                marginTop: '10px', fontWeight: 'bold', minHeight: '1.2em'
            }, qDiv);

            checkBtn.onclick = () => {
                const userAnswer = parseFloat(input.value);
                // Usamos el 'ans' del objeto, que es un número
                if (isNaN(userAnswer)) {
                    feedback.innerText = '⚠️ Ingresa un número.';
                    feedback.style.color = lightThemeStyles.buttonSecondary;
                    return;
                }

                if (userAnswer === qData.ans) {
                    feedback.innerHTML = `✅ **¡Correcto!** $${qData.variable} = ${qData.ans}$. ¡Bien hecho!`;
                    feedback.style.color = lightThemeStyles.quizCorrect;
                    input.style.border = `2px solid ${lightThemeStyles.quizCorrect}`;
                } else {
                    feedback.innerHTML = `❌ **Incorrecto.** Intenta de nuevo. Pista: ${qData.hint}`;
                    feedback.style.color = lightThemeStyles.quizIncorrect;
                    input.style.border = `2px solid ${lightThemeStyles.quizIncorrect}`;
                }
            };
        });
    }

    // --- Lógica de Quizzes Interactivos (Opción Múltiple) ---
    // Fix: Se usa el ID del div para el querySelector, asegurando que se inicialice.
    function setupQuiz(content) {
        const container = content.querySelector('#quizContainer');
        const checkBtn = content.querySelector('#checkAllQuizzesBtn');
        const globalFeedback = content.querySelector('#quizGlobalFeedback');

        // Verifica si el container existe antes de continuar (DEBUG)
        if (!container) {
            console.error("Error: #quizContainer no se encontró.");
            return;
        }

        container.innerHTML = '';
        globalFeedback.innerText = '';
        checkBtn.style.display = 'block';
        checkBtn.disabled = false;
        checkBtn.innerText = 'Comprobar Todas las Respuestas';
        checkBtn.style.background = lightThemeStyles.buttonPrimary;


        quizQuestions.forEach((qData, index) => {
            const qDiv = createElem('div', { id: `quizItem_${index}` }, {
                marginBottom: '20px', padding: '15px', borderRadius: '10px',
                border: '1px solid ' + lightThemeStyles.borderColor, background: '#f5f5f5'
            }, container);

            createElem('p', { innerHTML: `**Pregunta ${index + 1}:** ${qData.q}` }, {
                fontWeight: 'bold', marginBottom: '12px', fontSize: '1.1em'
            }, qDiv);

            const optionsDiv = createElem('div', { className: 'options-group' }, { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }, qDiv);

            qData.options.forEach(option => {
                const label = createElem('label', {}, {
                    padding: '10px', borderRadius: '6px', border: `1px solid ${lightThemeStyles.borderColor}`,
                    cursor: 'pointer', background: '#ffffff', transition: 'all 0.2s',
                    textAlign: 'center', display: 'block'
                }, optionsDiv);

                const radio = createElem('input', {
                    type: 'radio', name: `q_${index}`, value: option // El valor es el texto de la opción
                }, { display: 'none' }, label);

                createElem('span', { innerText: option }, { fontWeight: 'normal' }, label);

                // Efecto visual al seleccionar
                radio.onchange = () => {
                    optionsDiv.querySelectorAll('label').forEach(l => l.style.border = `1px solid ${lightThemeStyles.borderColor}`);
                    if (radio.checked) {
                        label.style.border = `2px solid ${lightThemeStyles.buttonPrimary}`;
                    }
                };
            });
        });

        checkBtn.onclick = () => {
            let correctCount = 0;
            quizQuestions.forEach((qData, index) => {
                const qDiv = content.querySelector(`#quizItem_${index}`);
                const selectedRadio = qDiv.querySelector(`input[name="q_${index}"]:checked`);
                const options = qDiv.querySelectorAll('.options-group label');

                options.forEach(label => {
                    label.style.border = `1px solid ${lightThemeStyles.borderColor}`;
                    const radio = label.querySelector('input');

                    if (radio.value == qData.ans) {
                        // Resalta la correcta en verde
                        label.style.border = `3px solid ${lightThemeStyles.quizCorrect}`;
                        label.style.background = '#e6ffec';
                    } else if (selectedRadio && radio === selectedRadio) {
                        // Si es incorrecta y fue la seleccionada, resáltala en rojo
                        label.style.border = `3px solid ${lightThemeStyles.quizIncorrect}`;
                        label.style.background = '#ffe6e6';
                    } else {
                        label.style.background = '#ffffff';
                    }
                    radio.disabled = true;
                    label.style.cursor = 'default';
                });

                if (selectedRadio && selectedRadio.value == qData.ans) {
                    correctCount++;
                }
            });

            globalFeedback.innerText = `Resultado Final: ${correctCount} de ${quizQuestions.length} correctas.`;
            globalFeedback.style.color = correctCount === quizQuestions.length ? lightThemeStyles.quizCorrect : lightThemeStyles.quizIncorrect;
            checkBtn.disabled = true;
            checkBtn.innerText = 'Quiz Resuelto';
            checkBtn.style.background = lightThemeStyles.buttonSecondary;
        };
    }


    // Función para abrir ventana nueva o mostrar si ya existe
    function openWindow(type) {
        if (windows[type]) {
            windows[type].style.display = 'block';
            windows[type].style.opacity = '1';
            // Vuelve a aplicar la lógica interactiva por si se cerró y volvió a abrir
            if (type === 'exercises') setupExercises(windows[type].querySelector('.content-area'));
            if (type === 'quizzes') setupQuiz(windows[type].querySelector('.content-area'));
            return;
        }

        // --- Ventana a Pantalla Completa (Full Screen) ---
        const win = createElem('div', {}, {
            position: 'fixed', top: '10px', left: '10px',
            width: 'calc(100% - 20px)', height: 'calc(100% - 20px)', // PANTALLA COMPLETA
            background: lightThemeStyles.windowBackground, color: lightThemeStyles.windowColor,
            borderRadius: '16px', boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
            padding: '0', overflow: 'hidden', zIndex: 99998, userSelect: 'none',
            fontFamily: 'Roboto, sans-serif', cursor: 'default',
            border: '2px solid ' + lightThemeStyles.headerColor,
            transition: 'all 0.3s ease', opacity: '0'
        }, document.body);

        // Desactivamos el drag para las ventanas a pantalla completa, ya que no tiene sentido.
        // makeDraggable(win, header); // << Se omite intencionalmente

        // Header
        const header = createElem('div', {}, {
            cursor: 'default', background: lightThemeStyles.headerBackground,
            color: lightThemeStyles.headerColor, padding: '15px 20px',
            fontWeight: '900', fontSize: '1.4em', userSelect: 'none',
            position: 'relative', borderBottom: '2px solid ' + lightThemeStyles.borderColor,
            textAlign: 'center'
        }, win);

        header.textContent = {
            concepts: '📘 Conceptos Fundamentales',
            exercises: '💪 Taller de Ejercicios',
            examples: '✨ Casos Prácticos Resueltos',
            quizzes: '🏆 Desafío de Quizzes'
        }[type] || 'Ventana de Contenido';

        const closeBtn = createElem('button', { innerText: 'X CERRAR' }, {
            position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)',
            border: 'none', background: lightThemeStyles.buttonSecondary, color: 'white',
            cursor: 'pointer', fontWeight: 'bold', borderRadius: '8px',
            padding: '8px 15px', fontSize: '1em', transition: 'background 0.2s'
        }, header);
        closeBtn.onmouseover = () => closeBtn.style.background = lightThemeStyles.quizIncorrect;
        closeBtn.onmouseout = () => closeBtn.style.background = lightThemeStyles.buttonSecondary;
        closeBtn.onclick = () => {
            win.style.opacity = '0';
            setTimeout(() => win.style.display = 'none', 300);
        };

        // Content area
        // El área de contenido ocupa el resto del espacio vertical.
        const content = createElem('div', { className: 'content-area' }, {
            fontSize: '1em', lineHeight: '1.6', padding: '20px',
            overflowY: 'auto', height: 'calc(100% - 59px)' // Altura restante (aprox 59px de header)
        }, win);

        // Insert content HTML
        content.innerHTML = contentData[type] || '<p>Sin contenido</p>';

        // Lógicas interactivas (FIX: La lógica ahora se aplica al 'content' creado)
        if (type === 'exercises') {
            setupExercises(content);
        }

        if (type === 'quizzes') {
            setupQuiz(content); // ¡FIX aplicado aquí!
        }

        windows[type] = win;
        // Animación de entrada
        setTimeout(() => win.style.opacity = '1', 10);
    }

    // Abrir el menú principal con contenido inicial
    menu.style.display = 'block';
    menu.style.opacity = '1';

    // Registrar comandos para abrir/cerrar menú
    GM_registerMenuCommand('Abrir Menú Álgebra (v4.0)', () => {
        menu.style.display = 'block';
        menu.style.opacity = '1';
    });
    GM_registerMenuCommand('Cerrar Menú Álgebra', () => {
        menu.style.display = 'none';
        menu.style.opacity = '0';
    });


})();