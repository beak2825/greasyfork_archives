// ==UserScript==
// @name         WhatsApp Web - Llamadas y Funciones Extra
// @version      1.2
// @description  Habilita llamadas con audio claro y funciones "dormidas" estables.
// @author       Usuario & Gemini
// @match        https://web.whatsapp.com/*
// @run-at       document-start
// @grant        none
// @namespace https://greasyfork.org/users/1528596
// @downloadURL https://update.greasyfork.org/scripts/563672/WhatsApp%20Web%20-%20Llamadas%20y%20Funciones%20Extra.user.js
// @updateURL https://update.greasyfork.org/scripts/563672/WhatsApp%20Web%20-%20Llamadas%20y%20Funciones%20Extra.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- 1. MEJORA DE CALIDAD DE AUDIO (Para evitar sonido robótico) ---
    const originalGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
    navigator.mediaDevices.getUserMedia = function (constraints) {
        if (constraints.audio) {
            constraints.audio = {
                echoCancellation: true,   // Evita que te escuches a ti mismo
                noiseSuppression: false,  // Desactivado para que no choque con el filtro de WhatsApp
                autoGainControl: true,    // Mantiene el volumen estable
                sampleRate: 48000         // Calidad de audio profesional
            };
        }
        return originalGetUserMedia(constraints);
    };

    // --- 2. ACTIVACIÓN DE FUNCIONES DORMIDAS ---
    function patchABProps(func) {
        return function (...args) {
            const key = args[0];

            // LISTA DE FUNCIONES SEGURAS (TRUE)
            const stableFeatures = [
                'enable_web_calling',            // Llamadas individuales
                'enable_web_group_calling',      // Llamadas de grupo
                'web_voip_call_tab_new_call',    // Pestaña de llamadas
                'web_view_once_receive',         // VER fotos de "una sola vez" en PC
                'edit_message',                  // Asegura poder editar mensajes
                'newsletter_enabled',            // Funciones completas de Canales
                'web_display_text_status_polls'  // Mejoras en encuestas y estados
            ];

            if (stableFeatures.includes(key)) {
                return true;
            }

            // AJUSTES DE CALIDAD Y TIEMPOS
            switch (key) {
                case 'voip_individual_outgoing_max_bitrate': return 64000; // Audio más nítido
                case 'heartbeat_interval_s': return 10;                   // Conexión más estable
                case 'calling_lid_version': return 1;
                default: return func(...args);
            }
        };
    }

    // --- 3. INYECCIÓN DEL SCRIPT ---
    const inject = setInterval(() => {
        try {
            const mod = window.require && window.require("WAWebABProps");
            if (mod && mod.getABPropConfigValue) {
                if (!mod.getABPropConfigValue.__hooked) {
                    const original = mod.getABPropConfigValue;
                    mod.getABPropConfigValue = patchABProps(original);
                    mod.getABPropConfigValue.__hooked = true;
                    console.log("✅ Mega Script Aplicado: Funciones estables activadas.");
                    clearInterval(inject); // Detener el ciclo una vez aplicado
                }
            }
        } catch (e) {
            // Error silencioso para no molestar en la consola
        }
    }, 500);
})();