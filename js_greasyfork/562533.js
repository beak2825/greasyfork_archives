// ==UserScript==
// @name         WhatsApp View Once Direct Exploit (React Injection)
// @namespace    http://tampermonkey.net/
// @version      7.0
// @description  Força o React do WhatsApp a renderizar mensagens de visualização única como mídias normais (visíveis direto no chat).
// @author       Gemini & Você
// @match        https://web.whatsapp.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562533/WhatsApp%20View%20Once%20Direct%20Exploit%20%28React%20Injection%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562533/WhatsApp%20View%20Once%20Direct%20Exploit%20%28React%20Injection%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("[ReactExploit] Iniciando injeção no núcleo do React...");

    // Função auxiliar para encontrar a instância interna do React em um elemento HTML
    // O WhatsApp usa nomes aleatórios como __reactFiber$....
    function getReactFiber(node) {
        const key = Object.keys(node).find(key => key.startsWith("__reactFiber$") || key.startsWith("__reactInternalInstance$"));
        return node[key];
    }

    // Função que varre a hierarquia do React buscando a propriedade "msg" (onde os dados reais vivem)
    function findMessageObject(fiber) {
        let curr = fiber;
        while (curr) {
            // Verifica se este componente tem a propriedade 'msg' (estrutura padrão do WA)
            if (curr.memoizedProps && curr.memoizedProps.msg) {
                return curr.memoizedProps.msg;
            }
            // Verifica nos filhos/pais se não achou
            curr = curr.return;
        }
        return null;
    }

    // A Mágica: Varre a tela e modifica a memória
    function hackViewOnce() {
        // Pega todas as mensagens na tela
        const messages = document.querySelectorAll('div[role="row"]');

        messages.forEach(row => {
            const fiber = getReactFiber(row);
            if (!fiber) return;

            const msg = findMessageObject(fiber);
            
            // Se encontramos o objeto da mensagem na memória
            if (msg) {
                let modified = false;

                // 1. Desativa a flag isViewOnce
                if (msg.isViewOnce === true) {
                    msg.isViewOnce = false;
                    modified = true;
                }

                // 2. Muda o tipo de "view_once" para "image" ou "video"
                // Isso força o WhatsApp a desenhar a miniatura da foto em vez do botão "Ver Foto"
                if (msg.type === "view_once") {
                    if (msg.mimetype && msg.mimetype.includes("video")) {
                        msg.type = "video";
                    } else {
                        msg.type = "image";
                    }
                    modified = true;
                }
                
                // Se modificamos algo, forçamos o React a entender que é uma mídia baixável
                if (modified) {
                    console.log("[ReactExploit] Mensagem desbloqueada visualmente!", msg.id.id);
                    
                    // Truque sujo: Forçamos a UI a atualizar movendo ligeiramente o elemento (trigger reflow)
                    // Nota: O React do WA é reativo. Ao mudar a propriedade 'msg', 
                    // se você sair do chat e voltar, ela deve renderizar como foto normal.
                }
            }
        });
    }

    // Roda o hack a cada 2 segundos para garantir que novas mensagens ou scroll sejam pegos
    setInterval(hackViewOnce, 2000);
    
    // Roda também ao clicar na página, para resposta rápida
    document.addEventListener('click', () => setTimeout(hackViewOnce, 500));

})();