// ==UserScript==
// @name         Amazon Yard PS Info Viewer - Enhanced Interactive with Chime and Email
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Visualización mejorada de ECOs con navegación a PS, envío a Chime y correo
// @author       You
// @match        https://trans-logistics.amazon.com/yms/shipclerk/*
// @grant        GM_xmlhttpRequest
// @license      MIT
// @supportURL   https://github.com/tuusuario/Amazon Yard PS Info Viewer - Enhanced Interactive with Chime and Email
// @downloadURL https://update.greasyfork.org/scripts/562743/Amazon%20Yard%20PS%20Info%20Viewer%20-%20Enhanced%20Interactive%20with%20Chime%20and%20Email.user.js
// @updateURL https://update.greasyfork.org/scripts/562743/Amazon%20Yard%20PS%20Info%20Viewer%20-%20Enhanced%20Interactive%20with%20Chime%20and%20Email.meta.js
// ==/UserScript==


(function() {
'use strict';

// Objeto con todos los webhooks
const WEBHOOKS = {
    'TRRS': 'https://hooks.chime.aws/incomingwebhooks/924a4843-2a80-42ba-954e-55674f09c54a?token=UVVnZEJVa1F8MXwyQ0ZmakgweEdtV1hiT0RBVkVkNkZuQWozYU0xZ1BqdkxEaGJUWHdFckJ3',
    'MXBP': 'https://hooks.chime.aws/incomingwebhooks/584cd794-5911-466b-ab8c-8fc6968d1d2d?token=cHZ0bENSNnB8MXx6ZTlZejFldThOTlEycEdWLXVlR3M2OXRnbEtwU1FrbVQ2QXpjdGROQ1JN',
    'TRUCK': 'https://hooks.chime.aws/incomingwebhooks/40bbdbf8-bd08-4f95-a275-c8a1dc1e1340?token=ODBYQjJoWER8MXxfUkNqbmxwYlIwWHd2NTdTWUcyNmotZUZYMmc5dFM4V0NVbUNRZ29lRUhF',
    'MXVGO': 'https://hooks.chime.aws/incomingwebhooks/2a86ea89-3b33-4c99-bb92-5d32f74eb6db?token=dEJFTEo1ekZ8MXxwSU02dlJhXzBBUXhQMFdxeWh4LXV0LXlLV1Rfa0g3Z29vWllMTWJwVDhz',
    'ARDMV': 'https://hooks.chime.aws/incomingwebhooks/9e0c76df-370c-471f-b5d0-596d00a8907d?token=bVc5V2ZwT3B8MXxvN0RyOXRQTzVmbGlJLWFyaTRrbmZSYlg0cHFjOTA4WVp1UUlLdU55VHdN',
    'MXAK': 'https://hooks.chime.aws/incomingwebhooks/b9968bd0-f16e-4d6a-9d75-a83534792766?token=eG10ZmlWYmx8MXxLdUgzbjRzQThpOFQ0eWVaUV81MENWb3pIaTdObkRJRXpobE9mbTlHREp3',
    'MXGTM': 'https://hooks.chime.aws/incomingwebhooks/d041ec1b-9919-4d69-8971-153d88435a79?token=OHZkTEh6cUh8MXxqWkVxX29fZkcyZGhzXzh4RmR2ZGtjNHVnR0JXY3M1R3EzNWlraUVfam5j',
    'MXLAR': 'https://hooks.chime.aws/incomingwebhooks/4b999303-9aab-4504-bb47-6502c414991d?token=a2F5SzNvVVZ8MXxvVl9vd1pPLU1BV3dEZ3RBU3N2RlJkRTh4blZ6ZHc5OHZuOC1EdWJjeF9R',
    'MTUML': 'https://hooks.chime.aws/incomingwebhooks/b12a85fa-c0f3-46c9-bfab-9ad2d0ac33e1?token=MGlMSHdtTGl8MXxEaE5zVjFDNGI4Wi1BSlcyMkp2Qkd2OU1vQXJDZmpWNmdWSjMteWJWQ28w',
    'MGUR': 'https://hooks.chime.aws/incomingwebhooks/86df076e-661e-4685-9dd8-4bb024dd4823?token=WlhuMHl3NXp8MXw1d0xtYVM1aEg2MnhZbWI3cmFJMERmNEZIdUl4aG5aUjRLUlh0NUl4elBB',
    'AWLRY': 'https://hooks.chime.aws/incomingwebhooks/715ca057-b030-4d05-8f79-0e1d0ff5945a?token=SkdKeVR2Q0d8MXxBYXdYeE0yU3BBako3YnpaVi1ZdXR1TG5nTG15N05zTHZ3R1hkVkhneXZn'
};

// CC fijos para todos los correos
const CC_FIJOS = 'tom-bjx1@amazon.com;vmarturo@amazon.com;caherras@amazon.com';

// Configuración inicial de correos - se llenará automáticamente
const DEFAULT_CARRIER_EMAILS = {};

// Obtener configuración guardada o usar la predeterminada
let CARRIER_EMAILS = JSON.parse(localStorage.getItem('carrierEmails')) || DEFAULT_CARRIER_EMAILS;

const PALABRAS_CLAVE_IGNORAR = [
    'ALMACENAMIENTO',
    'RENTA',
    'PROCUREMENT',
    'GO CARTS',
    'STAND BY',
    'STANDBY',
    'STORAGE',
    'D&H'
];
// Estilos actualizados con scroll
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(-20px); }
    }
    @keyframes highlightRow {
        0% { background-color: #FFE3B3; }
        100% { background-color: transparent; }
    }
    .highlight-row {
        animation: highlightRow 2s ease-out;
    }
    .palabra-clave-encontrada {
        background-color: #FFEBEE !important;
        border: 2px solid red !important;
        font-weight: bold !important;
        color: red !important;
        padding: 2px 4px !important;
    }
    .tab-container {
        display: flex;
        border-bottom: 2px solid #FF9900;
        margin-bottom: 15px;
        position: sticky;
        top: 0;
        background: white;
        z-index: 1;
    }
    .tab {
        padding: 8px 16px;
        cursor: pointer;
        background: #232F3E;
        color: white;
        border: none;
        margin-right: 5px;
        border-radius: 4px 4px 0 0;
    }
    .tab.active {
        background: #FF9900;
        color: #232F3E;
        font-weight: bold;
    }
    .tab-content {
        display: none;
        padding: 15px;
        max-height: 60vh;
        overflow-y: auto;
    }
    .tab-content.active {
        display: block;
    }
    .email-config {
        margin-bottom: 20px;
        max-height: calc(60vh - 100px);
        overflow-y: auto;
        padding-right: 10px;
    }
    .carrier-section {
        background: #f8f9fa;
        padding: 15px;
        border-radius: 4px;
        margin-bottom: 15px;
        border: 1px solid #e9ecef;
    }
    .email-input-container {
        display: flex;
        margin-bottom: 8px;
        gap: 8px;
    }
    .email-input {
        flex: 1;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 14px;
    }
    .remove-email {
        background: #dc3545;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 0 10px;
        cursor: pointer;
        font-size: 16px;
        line-height: 1;
    }
    .add-email {
        background: #232F3E;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 8px;
        cursor: pointer;
        width: 100%;
        margin-top: 8px;
        transition: all 0.2s ease;
    }
    .add-email:hover {
        background: #FF9900;
    }
    .save-config {
        background: #FF9900;
        color: #232F3E;
        border: none;
        border-radius: 4px;
        padding: 10px;
        cursor: pointer;
        width: 100%;
        font-weight: bold;
        margin-top: 15px;
        transition: all 0.2s ease;
        position: sticky;
        bottom: 0;
    }
    .save-config:hover {
        background: #232F3E;
        color: #FF9900;
    }

    /* Estilos para la barra de scroll */
    .email-config::-webkit-scrollbar,
    .tab-content::-webkit-scrollbar {
        width: 8px;
    }
    .email-config::-webkit-scrollbar-track,
    .tab-content::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 4px;
    }
    .email-config::-webkit-scrollbar-thumb,
    .tab-content::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 4px;
    }
    .email-config::-webkit-scrollbar-thumb:hover,
    .tab-content::-webkit-scrollbar-thumb:hover {
        background: #555;
    }
`;
document.head.appendChild(styleSheet);
function obtenerFechaFormateada() {
    const fecha = new Date();
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const año = fecha.getFullYear();
    return `${dia}/${mes}/${año}`;
}

function getSaludo() {
    const hora = new Date().getHours();
    if (hora >= 5 && hora < 12) return "Buenos días";
    if (hora >= 12 && hora < 19) return "Buenas tardes";
    return "Buenas noches";
}

function enviarMensajeChime(carrier, ecos) {
    const webhookUrl = WEBHOOKS[carrier];
    if (!webhookUrl) {
        console.error(`No se encontró webhook para el carrier ${carrier}`);
        return;
    }

    const mensaje = {
        Content: `/md ### 🚛 Solicitud de Recolección BJX1

${getSaludo()} equipo ${carrier}!

📦 ECOs pendientes de recolección:
${ecos.map(eco => `• ${eco}`).join('\n')}

⏰ Se solicita su apoyo con la recolección de estas unidades.

✅ Por favor:

    Confirmar de enterados
    Responder el correo correspondiente

¡Gracias por su atención! 🙌`
    };

    GM_xmlhttpRequest({
        method: 'POST',
        url: webhookUrl,
        data: JSON.stringify(mensaje),
        headers: {
            'Content-Type': 'application/json'
        },
        onload: function(response) {
            if (response.status === 200) {
                alert('Mensaje enviado exitosamente');
            } else {
                alert('Error al enviar mensaje: ' + response.status);
            }
        },
        onerror: function(error) {
            alert('Error en la solicitud: ' + error);
        }
    });
}

function abrirOutlookWeb(carrier, ecos) {
    const fechaActual = obtenerFechaFormateada();
    const asunto = `BJX1 | Seguimiento a estatus de remolques | ${carrier} | Recolección de vacíos | ${fechaActual}`;

    // Obtener los correos configurados para el carrier
    const toEmails = CARRIER_EMAILS[carrier]?.to?.join(';') || '';
    const ccEmails = [...(CARRIER_EMAILS[carrier]?.cc || []), CC_FIJOS].filter(Boolean).join(';');

    const cuerpo = `${getSaludo()} equipo ${carrier},

De su apoyo para la recolección de los siguientes ECOs:

${ecos.map(eco => eco).join('\n')}

Por favor su ayuda para programar la recolección de los siguientes remolques lo antes posible, actualmente estamos cerca del límite máximo de ocupación en nuestros cajones destinados a remolques que están vacíos y deben ser recolectados, se envió por individual la solicitud de recolección vía mail y la notificación vía Chime.

De su apoyo, responder este correo de enterado, incluyendo los datos de los operadores que estarán encargados de la recolección de las unidades.`;

    const outlookUrl = `https://outlook.office.com/mail/deeplink/compose?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}&to=${encodeURIComponent(toEmails)}&cc=${encodeURIComponent(ccEmails)}`;
    window.open(outlookUrl, '_blank');
}

function agregarNuevoCarrier(carrier) {
    if (!CARRIER_EMAILS.hasOwnProperty(carrier)) {
        CARRIER_EMAILS[carrier] = {
            to: [],
            cc: []
        };
        localStorage.setItem('carrierEmails', JSON.stringify(CARRIER_EMAILS));
        console.log(`Nuevo carrier agregado: ${carrier}`);
    }
}

function createEmailInput(email = '', type = 'to') {
    const container = document.createElement('div');
    container.className = 'email-input-container';

    const input = document.createElement('input');
    input.type = 'email';
    input.className = 'email-input';
    input.value = email;
    input.placeholder = type === 'to' ? 'Correo electrónico TO' : 'Correo electrónico CC';
    input.dataset.type = type;

    const removeButton = document.createElement('button');
    removeButton.className = 'remove-email';
    removeButton.textContent = '×';
    removeButton.onclick = () => container.remove();

    container.appendChild(input);
    container.appendChild(removeButton);
    return container;
}
function createCarrierSection(carrier) {
    const section = document.createElement('div');
    section.className = 'carrier-section';

    const title = document.createElement('h4');
    title.textContent = carrier;
    title.style.marginBottom = '10px';

    // Sección para correos TO
    const toSection = document.createElement('div');
    toSection.style.marginBottom = '15px';

    const toLabel = document.createElement('div');
    toLabel.textContent = 'Correos TO:';
    toLabel.style.fontWeight = '500';
    toLabel.style.marginBottom = '8px';
    toLabel.style.color = '#232F3E';

    const emailList = document.createElement('div');
    emailList.id = `email-list-${carrier}`;

    // Sección para correos CC
    const ccSection = document.createElement('div');
    ccSection.style.marginBottom = '15px';

    const ccLabel = document.createElement('div');
    ccLabel.textContent = 'Correos CC:';
    ccLabel.style.fontWeight = '500';
    ccLabel.style.marginBottom = '8px';
    ccLabel.style.color = '#232F3E';

    const ccList = document.createElement('div');
    ccList.id = `cc-list-${carrier}`;

    // Agregar correos TO existentes
    const existingEmails = CARRIER_EMAILS[carrier]?.to || [];
    existingEmails.forEach(email => {
        emailList.appendChild(createEmailInput(email, 'to'));
    });

    // Agregar correos CC existentes
    const existingCCs = CARRIER_EMAILS[carrier]?.cc || [];
    existingCCs.forEach(email => {
        ccList.appendChild(createEmailInput(email, 'cc'));
    });

    // Botón para agregar correo TO
    const addToButton = document.createElement('button');
    addToButton.className = 'add-email';
    addToButton.textContent = '+ Agregar correo TO';
    addToButton.onclick = () => emailList.appendChild(createEmailInput('', 'to'));

    // Botón para agregar correo CC
    const addCcButton = document.createElement('button');
    addCcButton.className = 'add-email';
    addCcButton.textContent = '+ Agregar correo CC';
    addCcButton.onclick = () => ccList.appendChild(createEmailInput('', 'cc'));

    // Ensamblar secciones
    toSection.appendChild(toLabel);
    toSection.appendChild(emailList);
    toSection.appendChild(addToButton);

    ccSection.appendChild(ccLabel);
    ccSection.appendChild(ccList);
    ccSection.appendChild(addCcButton);

    section.appendChild(title);
    section.appendChild(toSection);
    section.appendChild(ccSection);

    return section;
}

function crearPanelConfiguracion() {
    const panel = document.createElement('div');
    panel.className = 'config-panel';

    const tabContainer = document.createElement('div');
    tabContainer.className = 'tab-container';

    const palabrasClaveTab = document.createElement('button');
    palabrasClaveTab.className = 'tab active';
    palabrasClaveTab.textContent = 'Palabras Clave';

    const correosTab = document.createElement('button');
    correosTab.className = 'tab';
    correosTab.textContent = 'Configuración de Correos';

    tabContainer.appendChild(palabrasClaveTab);
    tabContainer.appendChild(correosTab);

    // Contenido de palabras clave
    const palabrasClaveContent = document.createElement('div');
    palabrasClaveContent.className = 'tab-content active';
    palabrasClaveContent.innerHTML = `
        <div style="color: #232F3E; font-weight: 600; margin-bottom: 10px;">
            Palabras clave ignoradas
        </div>
        <div style="color: #666; font-size: 13px; margin-bottom: 10px;">
            Las siguientes palabras en notas excluyen el ECO de la recolección:
        </div>
        ${PALABRAS_CLAVE_IGNORAR.map(palabra =>
            `<div style="color: #232F3E; padding: 4px 8px; margin: 4px 0; background-color: #F8F9FA; border-radius: 4px; border: 1px solid #E9ECEF;">
                ${palabra}
            </div>`
        ).join('')}
    `;

    // Contenido de configuración de correos
    const correosContent = document.createElement('div');
    correosContent.className = 'tab-content';

    const emailConfigContainer = document.createElement('div');
    emailConfigContainer.className = 'email-config';
    emailConfigContainer.innerHTML = '<h3 style="margin-bottom: 15px; color: #232F3E;">Configuración de Correos por Carrier</h3>';
    // Crear secciones para cada carrier
    Object.keys(CARRIER_EMAILS).sort().forEach(carrier => {
        emailConfigContainer.appendChild(createCarrierSection(carrier));
    });

    // Botón de guardar actualizado
    const saveButton = document.createElement('button');
    saveButton.className = 'save-config';
    saveButton.textContent = 'Guardar Configuración';
    saveButton.onclick = () => {
        const newConfig = {};
        Object.keys(CARRIER_EMAILS).forEach(carrier => {
            const toInputs = document.querySelectorAll(`#email-list-${carrier} input[data-type="to"]`);
            const ccInputs = document.querySelectorAll(`#cc-list-${carrier} input[data-type="cc"]`);

            newConfig[carrier] = {
                to: Array.from(toInputs)
                    .map(input => input.value.trim())
                    .filter(email => email !== ''),
                cc: Array.from(ccInputs)
                    .map(input => input.value.trim())
                    .filter(email => email !== '')
            };
        });
        CARRIER_EMAILS = newConfig;
        localStorage.setItem('carrierEmails', JSON.stringify(newConfig));
        alert('Configuración guardada exitosamente');
    };

    emailConfigContainer.appendChild(saveButton);
    correosContent.appendChild(emailConfigContainer);

    // Manejadores de eventos para las pestañas
    palabrasClaveTab.onclick = () => {
        palabrasClaveTab.className = 'tab active';
        correosTab.className = 'tab';
        palabrasClaveContent.className = 'tab-content active';
        correosContent.className = 'tab-content';
    };

    correosTab.onclick = () => {
        correosTab.className = 'tab active';
        palabrasClaveTab.className = 'tab';
        correosContent.className = 'tab-content active';
        palabrasClaveContent.className = 'tab-content';
    };

    panel.appendChild(tabContainer);
    panel.appendChild(palabrasClaveContent);
    panel.appendChild(correosContent);

    return panel;
}

function crearVentanaModal() {
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '100px';
    modal.style.right = '50px';
    modal.style.width = '380px';
    modal.style.backgroundColor = '#FFFFFF';
    modal.style.borderRadius = '6px';
    modal.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.15)';
    modal.style.zIndex = '10000';
    modal.style.border = '1px solid #DDD';
    modal.style.overflow = 'hidden';
    modal.style.animation = 'fadeIn 0.3s ease-out';
    modal.style.maxHeight = 'calc(90vh - 100px)';
    modal.style.display = 'flex';
    modal.style.flexDirection = 'column';

    const titleBar = document.createElement('div');
    titleBar.style.background = '#232F3E';
    titleBar.style.borderBottom = '2px solid #FF9900';
    titleBar.style.padding = '12px 20px';
    titleBar.style.color = 'white';
    titleBar.style.fontWeight = '500';
    titleBar.style.display = 'flex';
    titleBar.style.justifyContent = 'space-between';
    titleBar.style.alignItems = 'center';
    titleBar.style.cursor = 'move';
    titleBar.style.fontFamily = 'Amazon Ember, Arial, sans-serif';
    titleBar.style.flexShrink = '0';
    titleBar.innerHTML = `<div style="display: flex; align-items: center; gap: 8px;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke-width="2"/>
            <path d="M2 17L12 22L22 17" stroke-width="2"/>
            <path d="M2 12L12 17L22 12" stroke-width="2"/>
        </svg>
        <span>Recolección BJX1</span>
    </div>`;

    const closeButton = document.createElement('button');
    closeButton.innerHTML = '✕';
    closeButton.style.background = 'none';
    closeButton.style.border = 'none';
    closeButton.style.color = '#FF9900';
    closeButton.style.fontSize = '18px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.padding = '4px 8px';
    closeButton.style.transition = 'all 0.2s';
    closeButton.style.borderRadius = '4px';
    closeButton.onmouseover = () => {
        closeButton.style.backgroundColor = 'rgba(255,255,255,0.1)';
        closeButton.style.color = '#FFF';
    };
    closeButton.onmouseout = () => {
        closeButton.style.backgroundColor = 'transparent';
        closeButton.style.color = '#FF9900';
    };
    closeButton.onclick = () => {
        modal.style.animation = 'fadeOut 0.3s ease-in forwards';
        setTimeout(() => modal.remove(), 300);
    };

    titleBar.appendChild(closeButton);
    modal.appendChild(titleBar);

    // Funcionalidad de arrastrar
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    titleBar.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        modal.style.top = (modal.offsetTop - pos2) + "px";
        modal.style.right = (parseInt(getComputedStyle(modal).right) + pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }

    return modal;
}

function highlightRow(row) {
    row.classList.add('highlight-row');
    setTimeout(() => row.classList.remove('highlight-row'), 2000);
}

function scrollToRow(row) {
    row.scrollIntoView({ behavior: 'smooth', block: 'center' });
    highlightRow(row);
}

function normalizarCarrier(carrier) {
    const match = carrier.match(/\(([^)]+)\)/);
    if (match) {
        const codigo = match[1];
        const carriersIgnorar = ['OTHR', 'HHWY', 'NCSL', 'TXDV', 'ALMAC'];
        if (carriersIgnorar.includes(codigo)) {
            return null;
        }
        switch (codigo) {
            case 'ATRRS':
            case 'TRRS':
                return 'TRRS';
            case 'MTUML':
            case 'MTUM':
            case 'INWP':
                return 'MTUML';
            default:
                return codigo;
        }
    }
    return null;
}

function mostrarInfo() {
    const filas = document.querySelectorAll('tr');
    let resultadoPorCarrier = {};
    let mapeoFilas = new Map();

    filas.forEach(fila => {
        const ubicacion = fila.querySelector('td:nth-child(1)');          // Location
        const eco = fila.querySelector('td:nth-child(6)');               // Vehicle ID
        const carrier = fila.querySelector('td:nth-child(7)');           // Owner (Operator)
        const loadIdentifier = fila.querySelector('td:nth-child(8)');    // Load identifier(s)
        const notes = fila.querySelector('td:nth-child(10)');            // Notes

        if(ubicacion && eco && carrier && loadIdentifier && notes) {
            const textoUbicacion = ubicacion.textContent.trim();
            const textoEco = eco.textContent.trim();
            let textoCarrier = carrier.textContent.trim();
            const textoLoad = loadIdentifier.textContent.trim();
            const textoNotes = notes.textContent.trim().toUpperCase();

            if(textoLoad !== '') return;

            const debeIgnorar = PALABRAS_CLAVE_IGNORAR.some(palabra => {
                if(textoNotes.includes(palabra.toUpperCase())) {
                    notes.classList.add('palabra-clave-encontrada');
                    return true;
                }
                return false;
            });
            if (!debeIgnorar) {
                const psNumber = parseInt(textoUbicacion.replace('PS', ''));
                if (psNumber >= 201 && psNumber <= 280) {
                    if (textoEco && textoEco !== 'Vehicle ID not required') {
                        const carrierNormalizado = normalizarCarrier(textoCarrier);
                        if (carrierNormalizado) {
                            agregarNuevoCarrier(carrierNormalizado);
                            if (!resultadoPorCarrier[carrierNormalizado]) {
                                resultadoPorCarrier[carrierNormalizado] = new Set();
                            }
                            resultadoPorCarrier[carrierNormalizado].add(textoEco);
                            mapeoFilas.set(textoEco, {fila, ubicacion: textoUbicacion});
                        }
                    }
                }
            }
        }
    });

    const modal = crearVentanaModal();
    const contenido = document.createElement('div');
    contenido.style.padding = '20px';
    contenido.style.maxHeight = 'calc(90vh - 200px)';
    contenido.style.overflowY = 'auto';
    contenido.style.backgroundColor = '#F8F9FA';
    contenido.style.flexGrow = '1';

    for (let carrier in resultadoPorCarrier) {
        if (resultadoPorCarrier[carrier].size > 0) {
            const carrierSection = document.createElement('div');
            carrierSection.style.marginBottom = '20px';
            carrierSection.style.padding = '16px';
            carrierSection.style.backgroundColor = '#FFFFFF';
            carrierSection.style.borderRadius = '6px';
            carrierSection.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
            carrierSection.style.border = '1px solid #E9ECEF';
            carrierSection.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';

            carrierSection.onmouseover = () => {
                carrierSection.style.transform = 'translateY(-2px)';
                carrierSection.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
            };
            carrierSection.onmouseout = () => {
                carrierSection.style.transform = 'translateY(0)';
                carrierSection.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
            };

            const ecos = Array.from(resultadoPorCarrier[carrier]);

            // Título del carrier con contador de ECOs
            const carrierTitle = document.createElement('div');
            carrierTitle.style.fontWeight = '600';
            carrierTitle.style.marginBottom = '12px';
            carrierTitle.style.color = '#232F3E';
            carrierTitle.style.fontSize = '16px';
            carrierTitle.style.display = 'flex';
            carrierTitle.style.alignItems = 'center';
            carrierTitle.style.justifyContent = 'space-between';
            carrierTitle.innerHTML = `<span>${carrier}</span><span style="color: #FF9900; font-size: 14px;">${ecos.length} ECO${ecos.length !== 1 ? 's' : ''}</span>`;

            // Lista de ECOs
            const ecosList = document.createElement('div');
            ecosList.style.marginTop = '8px';

            ecos.forEach(eco => {
                const ecoData = mapeoFilas.get(eco);
                const ecoItem = document.createElement('div');
                ecoItem.style.padding = '8px 12px';
                ecoItem.style.marginBottom = '8px';
                ecoItem.style.backgroundColor = '#F8F9FA';
                ecoItem.style.borderRadius = '4px';
                ecoItem.style.border = '1px solid #E9ECEF';
                ecoItem.style.fontSize = '14px';
                ecoItem.style.color = '#444';
                ecoItem.style.display = 'flex';
                ecoItem.style.alignItems = 'center';
                ecoItem.style.transition = 'all 0.2s ease';
                ecoItem.style.cursor = 'pointer';
                ecoItem.innerHTML = `<span style="color: #FF9900; margin-right: 8px;">•</span><span style="flex-grow: 1;">${eco}</span><span style="color: #666; font-size: 12px;">${ecoData.ubicacion}</span>`;
                ecoItem.onmouseover = () => {
                    ecoItem.style.backgroundColor = '#FFF9F0';
                    ecoItem.style.borderColor = '#FF9900';
                    ecoItem.style.transform = 'translateX(5px)';
                };
                ecoItem.onmouseout = () => {
                    ecoItem.style.backgroundColor = '#F8F9FA';
                    ecoItem.style.borderColor = '#E9ECEF';
                    ecoItem.style.transform = 'translateX(0)';
                };
                ecoItem.onclick = () => {
                    if (ecoData && ecoData.fila) {
                        scrollToRow(ecoData.fila);
                    }
                };
                ecosList.appendChild(ecoItem);
            });

            carrierSection.appendChild(carrierTitle);
            carrierSection.appendChild(ecosList);

            // Botones de acción
            const actionButtons = document.createElement('div');
            actionButtons.style.display = 'flex';
            actionButtons.style.gap = '10px';
            actionButtons.style.marginTop = '10px';

            // Botón de correo
            const emailButton = document.createElement('button');
            emailButton.innerHTML = '📧 Enviar Correo';
            emailButton.style.flex = '1';
            emailButton.style.padding = '8px';
            emailButton.style.backgroundColor = '#232F3E';
            emailButton.style.color = '#FFFFFF';
            emailButton.style.border = '2px solid #FF9900';
            emailButton.style.borderRadius = '4px';
            emailButton.style.cursor = 'pointer';
            emailButton.onclick = () => abrirOutlookWeb(carrier, ecos);

            actionButtons.appendChild(emailButton);

            // Botón de Chime para carriers con webhook configurado
            if (WEBHOOKS[carrier]) {
                const chimeButton = document.createElement('button');
                chimeButton.innerHTML = '💬 Enviar Chime';
                chimeButton.style.flex = '1';
                chimeButton.style.padding = '8px';
                chimeButton.style.backgroundColor = '#232F3E';
                chimeButton.style.color = '#FFFFFF';
                chimeButton.style.border = '2px solid #FF9900';
                chimeButton.style.borderRadius = '4px';
                chimeButton.style.cursor = 'pointer';
                chimeButton.onclick = () => enviarMensajeChime(carrier, ecos);
                actionButtons.appendChild(chimeButton);
            }

            carrierSection.appendChild(actionButtons);
            contenido.appendChild(carrierSection);
        }
    }

    if (Object.keys(resultadoPorCarrier).length === 0) {
        contenido.innerHTML = `
            <div style="text-align: center; padding: 40px 20px;">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#FF9900" style="margin-bottom: 16px;">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke-width="2"/>
                    <path d="M2 17L12 22L22 17" stroke-width="2"/>
                    <path d="M2 12L12 17L22 12" stroke-width="2"/>
                </svg>
                <div style="color: #232F3E; font-size: 16px; font-weight: 500;">
                    No se encontraron unidades para recolección
                </div>
            </div>`;
    }

    modal.appendChild(contenido);
    document.body.appendChild(modal);
}

// Crear y agregar botones principales
const button = document.createElement('button');
button.innerHTML = `<span style="display: flex; align-items: center; gap: 8px;">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke-width="2"/>
        <path d="M2 17L12 22L22 17" stroke-width="2"/>
        <path d="M2 12L12 17L22 12" stroke-width="2"/>
    </svg>Recolección</span>`;
button.style.position = 'fixed';
button.style.top = '15px';
button.style.right = '20px';
button.style.zIndex = '99999';
button.style.padding = '8px 16px';
button.style.backgroundColor = '#232F3E';
button.style.color = '#FFFFFF';
button.style.border = '2px solid #FF9900';
button.style.borderRadius = '4px';
button.style.cursor = 'pointer';
button.style.fontSize = '14px';
button.style.fontWeight = '500';
button.style.fontFamily = 'Amazon Ember, Arial, sans-serif';
button.style.transition = 'all 0.2s ease';
button.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';

const infoButton = document.createElement('button');
infoButton.innerHTML = 'ℹ️';
infoButton.style.position = 'fixed';
infoButton.style.top = '15px';
infoButton.style.right = '180px';
infoButton.style.zIndex = '99999';
infoButton.style.padding = '8px 12px';
infoButton.style.backgroundColor = '#232F3E';
infoButton.style.color = '#FFFFFF';
infoButton.style.border = '2px solid #FF9900';
infoButton.style.borderRadius = '50%';
infoButton.style.cursor = 'pointer';
infoButton.style.fontSize = '14px';
infoButton.style.fontWeight = '500';
infoButton.style.transition = 'all 0.2s ease';
infoButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';

button.addEventListener('click', mostrarInfo);
infoButton.addEventListener('click', () => {
    const panel = crearPanelConfiguracion();
    const modal = crearVentanaModal();
    modal.appendChild(panel);
    document.body.appendChild(modal);
});

document.body.appendChild(button);
document.body.appendChild(infoButton);

})();
