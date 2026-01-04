// ==UserScript==
// @name         WME PLN Module - Logger
// @namespace    https://greasyfork.org/en/users/mincho77
// @version      9.0.0
// @description  Módulo de logging para WME Place Normalizer. No funciona por sí solo.
// @author       mincho77
// @license      MIT
// @grant        none
// ==/UserScript==
// Este objeto global controlará todos los logs del script.
window.PLN_LOG_CONFIG = (function (prev)
{
    const defaults = {
        global_enabled: true,
        contexts: {
            'init': true,
            'scan': false,
            'normalize': false,
            'swap': false,
            'ui': true,
            'city': false,
            'sdk': false,
            'geo': false,
            'utils': false,
            'warn': true,
            'error': true
        }
    };
    const mergedContexts = Object.assign({}, defaults.contexts, (prev && prev.contexts) || {});
    return {
        global_enabled: (typeof prev?.global_enabled === 'boolean') ? prev.global_enabled : defaults.global_enabled,
        contexts: mergedContexts
    };
})(window.PLN_LOG_CONFIG || null);

// Función de logging que respeta la configuración global y por contexto.
function plnLog(context, ...args) 
{
    // No hacer nada si el log global está deshabilitado y no es un error.
    if (!PLN_LOG_CONFIG.global_enabled && context !== 'error') 
    {
        return;
    }

    // Verificar si el contexto específico está habilitado.
    if (PLN_LOG_CONFIG.contexts[context] === true) 
    {
        const logFunction = (context === 'error') ? console.error : (context === 'warn') ? console.warn : console.log;
        logFunction(`[WME PLN][${context}]`, ...args);
    }
}//plnLog   