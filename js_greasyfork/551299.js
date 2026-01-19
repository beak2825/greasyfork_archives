// ==UserScript==
// @name         UTFPR Power-Up
// @namespace    http://tampermonkey.net/
// @version      2.1.0
// @description  Melhorias de interface para sistemas corporativos e utilitários acadêmicos
// @author       Gemini & Você
// @match        https://sistemas2.utfpr.edu.br/*
// @match        https://sistemas2.utfpr.edu.br/url/50*
// @match        https://sistemas2.utfpr.edu.br/dpls/sistema/acad11/mplistaprofcurso.inicio*
// @match        https://www.areadoaluno.seed.pr.gov.br/*
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_info
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/551299/UTFPR%20Power-Up.user.js
// @updateURL https://update.greasyfork.org/scripts/551299/UTFPR%20Power-Up.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ====================================================================================
    // --- CARREGAMENTO DAS CONFIGURAÇÕES ---
    // ====================================================================================
    const config = {
        enableMenuOptimizer: GM_getValue('enableMenuOptimizer', true),
        enablePastaDoEstudante: GM_getValue('enablePastaDoEstudante', true),
        enablePdfQualityBoost: GM_getValue('enablePdfQualityBoost', true),
        enableStatusCheckTab1: GM_getValue('enableStatusCheckTab1', true),
        enableProcessoSeletivo: GM_getValue('enableProcessoSeletivo', true),
        enableBloqueioHelper: GM_getValue('enableBloqueioHelper', true),
        enableConsultaRapida: GM_getValue('enableConsultaRapida', true),
        enableExcelTableGenerator: GM_getValue('enableExcelTableGenerator', true),
        enablePasteInputCleaner: GM_getValue('enablePasteInputCleaner', true),
        enableSeedPrValidation: GM_getValue('enableSeedPrValidation', true)
    };
    // ====================================================================================


    const currentUrl = window.location.href;
    const isUtfprDomain = currentUrl.includes('utfpr.edu.br');
    const isSeedPrDomain = currentUrl.includes('seed.pr.gov.br');
    let styles = '';

    // Declaração das funções de atualização
    let runMenuModification, runPastaDoEstudanteUpdates, runBloqueioHelperUpdates;


    // ------------------------------------------------------------------------------------
    // --- MÓDULO UTFPR: OTIMIZADOR DE MENU
    // ------------------------------------------------------------------------------------
    function initializeMenuOptimizer() {
        console.log('Power-Up: Módulo Otimizador de Menu ativado.');
        const ICON_SIZE = '26px'; const ICON_COLOR = '#0042b1'; const ICON_HOVER_BACKGROUND = 'rgba(0, 66, 177, 0.1)';
        
        const icons = {
            home: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${ICON_COLOR}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
            pasta: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>`,
            cadastro: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="17" y1="11" x2="23" y2="11"></line></svg>`,
            requerimento: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${ICON_COLOR}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>`,
            academico: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${ICON_COLOR}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`,
            identificacao: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${ICON_COLOR}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="12" cy="10" r="3"/><path d="M12 16a6 6 0 0 1 6-6 6 6 0 0 1-6 6 6 6 0 0 1-6-6 6 6 0 0 1 6 6z"/><line x1="7" y1="8" x2="7" y2="8"/><line x1="17" y1="8" x2="17" y2="8"/></svg>`,
            latoSensu: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${ICON_COLOR}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>`,
            protocolo: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${ICON_COLOR}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M16 13l-4 4-4-4"/><path d="M12 17V9"/></svg>`,
            sistemasGerais: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${ICON_COLOR}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`,
            strictoSensu: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${ICON_COLOR}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`
        };

        const submenusData = {
            'Requerimento': [{ name: "Cadastro", url: "https://sistemas2.utfpr.edu.br/url/1826" }, { name: "Trâmite", url: "https://sistemas2.utfpr.edu.br/url/1869" }],
            'Acadêmico': [ { name: "Aluno - Cadastro", url: "/home/modulo/18" }, { name: "Aluno - Mudança De Curso", url: "/home/modulo/540" }, { name: "Aluno Acadêmico - Consulta", url: "/home/modulo/23" }, { name: "Aluno Geral - Relatório", url: "/home/modulo/24" }, { name: "Atividades Complementares", url: "/home/modulo/265" }, { name: "Curso E Matriz", url: "/home/modulo/611" }, { name: "Dados Pessoais - Consulta", url: "/home/modulo/318" }, { name: "Deaae", url: "/home/modulo/308" }, { name: "Diários De Classe", url: "/home/modulo/612" }, { name: "Diplomas - Solicitação De Emissão", url: "/home/modulo/564" }, { name: "Documentos Disponibilizados", url: "/home/modulo/675" }, { name: "Educação Especial / Nec. Educ. Específicas", url: "/home/modulo/627" }, { name: "Eleição", url: "/home/modulo/287" }, { name: "Enade", url: "/home/modulo/613" }, { name: "Envio De Email", url: "/home/modulo/352" }, { name: "Eventos Letivos", url: "/home/modulo/54" }, { name: "Fechamento - Ano/semestre", url: "/home/modulo/47" }, { name: "Formatura", url: "/home/modulo/614" }, { name: "Fundamentação Legal", url: "/home/modulo/615" }, { name: "Horários", url: "/home/modulo/616" }, { name: "Jubilamento", url: "/home/modulo/617" }, { name: "Matrícula", url: "/home/modulo/619" }, { name: "Matrícula Calouros - Homologação", url: "/home/modulo/666" }, { name: "Menu Aluno", url: "/home/modulo/206" }, { name: "Microestágio", url: "/home/modulo/623" }, { name: "Ocorrências", url: "/home/modulo/625" }, { name: "Pagamento E Bloqueio", url: "/home/modulo/59" }, { name: "Plano De Ensino", url: "/home/modulo/626" }, { name: "Professores - Relatório", url: "/home/modulo/26" }, { name: "Registros Acadêmicos", url: "/home/modulo/629" }, { name: "Relatórios", url: "/home/modulo/630" }, { name: "Reopção, Transferência E Aproveitamento", url: "/home/modulo/728" }, { name: "Restrito Desis", url: "/home/modulo/139" }, { name: "Simulação Portal Do Aluno", url: "/home/modulo/548" }, { name: "Turmas E Horários", url: "/home/modulo/632" }, { name: "Usuários - Consultas", url: "/home/modulo/144" } ],
            'Sistemas Gerais': [ { name: "Agendamento De Veículos", url: "/url/2249" }, { name: "Aniversariantes Do Dia", url: "/url/2448" }, { name: "Aprovação De Agendamento De Veículos", url: "/url/2251" }, { name: "Bibliotec", url: "/url/2180" }, { name: "Calem - Matrícula Servidor (1º Período)", url: "/url/2253" }, { name: "Carta De Serviços", url: "ords/f?p=134:1:1" }, { name: "Consulta Individual De Servidor", url: "/url/2170" }, { name: "Consulta Protocolos Do Servidor", url: "/url/2176" }, { name: "Consulta Refeições Do Servidor No Ru", url: "/url/2174" }, { name: "Dirf - Declaração Complementar", url: "/url/2168" }, { name: "Enquete - Servidor", url: "/url/2404" }, { name: "Indicadores De Gestão Universitária", url: "ords/f?p=108:1" }, { name: "Lista De Ramais", url: "ords/f?p=120:1:0:1" }, { name: "Monitoria - Relatório Geral", url: "/url/2447" }, { name: "Movimentação - Remanejamento (No Mesmo Campus)", url: "/url/2482" }, { name: "Movimentação - Remoção Por Permuta (Entre Campus)", url: "/url/2401" }, { name: "Passaporte Vacinal", url: "/url/2417" }, { name: "Passaporte Vacinal - Estatística", url: "/url/2425" }, { name: "Plano De Saúde De Servidor", url: "/url/2172" }, { name: "Registro De Atividades Docentes", url: "/url/2247" }, { name: "Riadd", url: "/url/2542" } ]
        };

        submenusData['Acadêmico'].sort((a, b) => a.name.localeCompare(b.name));
        submenusData['Sistemas Gerais'].sort((a, b) => a.name.localeCompare(b.name));

        const leftBlockLinks = [ { href: 'https://sistemas2.utfpr.edu.br/home', title: 'Home', icon: icons.home }, { href: 'https://sistemas2.utfpr.edu.br/url/2450', title: 'Pasta do Estudante', icon: icons.pasta }, { href: 'https://sistemas2.utfpr.edu.br/url/1695', title: 'Cadastro de Pessoa', icon: icons.cadastro }, { href: 'https://sistemas2.utfpr.edu.br/url/1826', title: 'Requerimento', icon: icons.requerimento, hasSubmenu: true } ];
        const staticMiddleBlockLinks = [ { href: 'https://sistemas2.utfpr.edu.br/home/modulo/606', title: 'Acadêmico', icon: icons.academico, hasSubmenu: true }, { href: 'https://sistemas2.utfpr.edu.br/home/modulo/650', title: 'Identificação', icon: icons.identificacao }, { href: 'https://sistemas2.utfpr.edu.br/home/modulo/658', title: 'Lato Sensu', icon: icons.latoSensu }, { href: 'https://sistemas2.utfpr.edu.br/home/modulo/651', title: 'Protocolo Institucional', icon: icons.protocolo }, { href: 'https://sistemas2.utfpr.edu.br/home/modulo/665', title: 'Sistemas Gerais', icon: icons.sistemasGerais, hasSubmenu: true }, { href: 'https://sistemas2.utfpr.edu.br/home/modulo/641', title: 'Stricto Sensu', icon: icons.strictoSensu } ];

        function getIconForLink(href) { return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`; }
        
        styles += `#custom-icon-menu { display: flex; align-items: center; justify-content: center; flex-grow: 1; height: 100%; gap: 10px; } #custom-icon-menu .icon-link { position: relative; display: flex; align-items: center; justify-content: center; width: 42px; height: 42px; border-radius: 50%; transition: background-color 0.2s ease-in-out; cursor: pointer; } #custom-icon-menu .icon-link:hover { background-color: ${ICON_HOVER_BACKGROUND}; } #custom-icon-menu .icon-link svg { width: ${ICON_SIZE}; height: ${ICON_SIZE}; color: ${ICON_COLOR}; } #custom-icon-menu .custom-badge { position: absolute; top: 2px; right: 2px; background-color: red; color: white; border-radius: 50%; font-size: 11px; font-weight: bold; min-width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; padding: 1px; box-shadow: 0 0 2px rgba(0,0,0,0.5); } .menuTop .p-grid > div:last-child { margin-left: auto !important; flex-shrink: 0 !important; } .dropdown { position: relative; display: flex; align-items: center; height: 100%; } .dropdown-content { display: none; position: absolute; top: 100%; left: 50%; transform: translateX(-50%); background-color: #fff; min-width: 280px; box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2); z-index: 9999; max-height: 80vh; overflow-y: auto; border-radius: 4px; padding: 5px 0; text-align: left; border: 1px solid #ddd; } .dropdown:hover .dropdown-content { display: block; } .dropdown-content a { color: #333 !important; padding: 8px 12px; text-decoration: none; display: block; font-size: 12px; font-weight: normal; line-height: 1.2; border: none !important; background: none !important; width: 100%; text-align: left; } .dropdown-content a:hover { background-color: #f1f1f1 !important; color: #0042b1 !important; }`;

        function createSeparator() { const separator = document.createElement('div'); separator.style.borderLeft = '1px solid #ccc'; separator.style.height = '28px'; separator.style.margin = '0 5px'; return separator; }

        function renderItem(item, container) {
            if (item.hasSubmenu && submenusData[item.title]) {
                const dropdownDiv = document.createElement('div'); dropdownDiv.className = 'dropdown';
                const triggerLink = document.createElement('a'); triggerLink.href = item.href; triggerLink.className = 'icon-link'; triggerLink.title = item.title; triggerLink.innerHTML = item.icon;
                const dropdownContent = document.createElement('div'); dropdownContent.className = 'dropdown-content';
                submenusData[item.title].forEach(subItem => { const subLink = document.createElement('a'); subLink.href = subItem.url; subLink.textContent = subItem.name; dropdownContent.appendChild(subLink); });
                dropdownDiv.appendChild(triggerLink); dropdownDiv.appendChild(dropdownContent); container.appendChild(dropdownDiv);
            } else {
                const newLink = document.createElement('a'); newLink.href = item.href; newLink.className = 'icon-link'; newLink.title = item.title;
                if (item.target) newLink.target = item.target;
                newLink.innerHTML = item.icon;
                if (item.badge) { const newBadge = document.createElement('span'); newBadge.className = 'custom-badge'; newBadge.textContent = item.badge; newLink.appendChild(newBadge); }
                container.appendChild(newLink);
            }
        }

        runMenuModification = function() {
            if (document.getElementById('custom-icon-menu')) return;
            const originalMenu = document.getElementById('links'); const searchInput = document.querySelector('input[placeholder="Pesquisar sistemas..."]'); if (!originalMenu || !searchInput) return;
            const searchContainer = searchInput.closest('.p-col'); const topBarGrid = searchContainer ? searchContainer.parentElement : null; if (!topBarGrid) return;
            const newIconContainer = document.createElement('div'); newIconContainer.id = 'custom-icon-menu';
            leftBlockLinks.forEach(item => renderItem(item, newIconContainer));
            newIconContainer.appendChild(createSeparator());
            let middleBlockArray = [...staticMiddleBlockLinks]; let farRightBlockArray = [];
            originalMenu.querySelectorAll('a').forEach(link => { 
                const href = link.getAttribute('href'); if (href === '/home' || href.includes('mppastadoaluno') || href.includes('mpcadastropessoa') || href.includes('url/1826')) return;
                let title = ''; const labelElement = link.querySelector('.nome-completo'); if (labelElement) title = labelElement.textContent.trim(); else title = link.title || 'Sistema';
                const iconHtml = getIconForLink(link.href); let badgeContent = null; const badge = link.querySelector('.badge'); if (badge) badgeContent = badge.textContent.trim();
                const itemObject = { href: link.href, title: title, icon: iconHtml, badge: badgeContent, target: link.target === '_blank' ? '_blank' : null };
                if (href.includes('/url/2211') || href.includes('/url/2404') || href.includes('suporte.utfpr.edu.br')) { farRightBlockArray.push(itemObject); } else { middleBlockArray.push(itemObject); }
            });
            middleBlockArray.sort((a, b) => a.title.localeCompare(b.title)); middleBlockArray.forEach(item => renderItem(item, newIconContainer));
            newIconContainer.appendChild(createSeparator());
            farRightBlockArray.sort((a, b) => a.title.localeCompare(b.title)); farRightBlockArray.forEach(item => renderItem(item, newIconContainer));
            topBarGrid.insertBefore(newIconContainer, searchContainer); 
            const originalMenuContainer = originalMenu.closest('.vertical-flex-child-invariavel-xs-sm'); if (originalMenuContainer) originalMenuContainer.style.display = 'none';
        }
    }

    // ------------------------------------------------------------------------------------
    // --- MÓDULO UTFPR: PASTA DO ESTUDANTE
    // ------------------------------------------------------------------------------------
    function initializePastaEstudanteMain() {
        console.log('Power-Up: Módulo Pasta do Estudante (Página Principal) ativado.');
        let isAutomatingUpload = false;
        
        const DOCUMENTOS_MAPEADOS = [
            { label: 'Certidão de Nascimento/Casamento', value: '502', icon: 'fa-id-card-o', searchConfig: { include: ['Nascimento', 'Casamento'], exclude: [] } },
            { label: 'Doc. de Identificação', value: '101', icon: 'fa-id-card', searchConfig: { include: ['Identidade', 'Identificação'], exclude: [] } },
            { label: 'Serviço Militar', value: '109', icon: 'fa-shield', searchConfig: { include: ['Militar'], exclude: [] } },
            { label: 'Histórico Escolar', value: '104', icon: 'fa-graduation-cap', searchConfig: { include: ['Histórico Escolar'], exclude: ['Gerado pelo DERAC'] } },
            { label: 'Diploma de Graduação', value: '533', icon: 'fa-university', searchConfig: { include: ['Diploma de Graduação', 'Representação visual do Diploma Digital'], exclude: [], exactMatch: false } }
        ];

        function setupUploadAutomation() { const originalOpen = unsafeWindow.open; unsafeWindow.open = function(...args) { if (!isAutomatingUpload) { return originalOpen.apply(this, args); } console.log("Script: Interceptando popup para automação."); isAutomatingUpload = false; const popup = originalOpen.apply(this, args); if (!popup) { alert("O bloqueador de pop-ups pode estar impedindo a automação. Por favor, permita pop-ups para este site."); return null; } popup.addEventListener('load', () => { console.log("Script (Popup): Conteúdo carregado. Iniciando automação."); let attempts = 0; const maxAttempts = 50; const intervalId = setInterval(() => { attempts++; const fileInput = popup.document.querySelector('input[type="file"][name="p_nomearq"]'); const form = popup.document.getElementById('UploadArq'); if (fileInput && form) { clearInterval(intervalId); console.log("Script (Popup): Elementos do formulário encontrados."); popup.focus(); fileInput.addEventListener('change', () => { if (fileInput.files.length > 0) { console.log("Script (Popup): Arquivo selecionado. Submetendo formulário."); form.submit(); } }, { once: true }); fileInput.click(); console.log("Script (Popup): Clicando no input de arquivo."); } else if (attempts > maxAttempts) { clearInterval(intervalId); console.error("Script (Popup): Timeout! Não foi possível encontrar os elementos do formulário."); popup.close(); } }, 100); }, { once: true }); return popup; }; }
        const original_fsDisponibilizarDoc = unsafeWindow.fsDisponibilizarDoc; if (original_fsDisponibilizarDoc) { unsafeWindow.fsDisponibilizarDoc = function(...args) { const original_confirm = unsafeWindow.confirm; unsafeWindow.confirm = () => true; original_fsDisponibilizarDoc.apply(this, args); setTimeout(() => { unsafeWindow.confirm = original_confirm; }, 0); }; }
        function iniciarUploadRapido(docValue) { const dropdown = document.getElementById('p_atcodnr'); if (dropdown) { isAutomatingUpload = true; console.log("Script (Principal): Flag de automação ATIVADA."); dropdown.value = docValue; dropdown.dispatchEvent(new Event('change')); if (typeof unsafeWindow.jsAnexaArquivo === 'function') { unsafeWindow.jsAnexaArquivo(); } } }
        let adicionarBotoesUploadRapido = () => {
            const targetDiv = document.getElementById('dv_carregarArq'); if (!targetDiv || document.getElementById('bsb-quick-upload-container')) return;
            const container = document.createElement('div'); container.id = 'bsb-quick-upload-container'; container.className = 'ui-widget-content ui-corner-all'; const title = document.createElement('h5'); title.className = 'ui-widget-header ui-corner-all'; title.textContent = 'Upload Rápido (Automático)'; container.appendChild(title);
            const buttonWrapper = document.createElement('div'); buttonWrapper.className = 'bsb-quick-upload-wrapper';
            DOCUMENTOS_MAPEADOS.forEach(b => { const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'uiBotao bsb-quick-upload-btn'; btn.innerHTML = `<i class="fa ${b.icon}" aria-hidden="true"></i> ${b.label}`; btn.onclick = () => iniciarUploadRapido(b.value); buttonWrapper.appendChild(btn); });
            container.appendChild(buttonWrapper); targetDiv.insertBefore(container, targetDiv.firstChild);
        };
        let executarAcaoEmLote = (tipo) => { const tipoAcao = tipo === 0 ? "Disponibilizar" : "Retirar"; const buttons = Array.from(document.querySelectorAll("#tbl_docs button[id^='btRetirarDisp_']")).filter(btn => new RegExp(`fsDisponibilizarDoc\\([^,]+,[^,]+,\\s*${tipo}`).test(btn.getAttribute('onclick'))); if (buttons.length === 0) { alert(`Nenhum documento para ${tipoAcao.toLowerCase()} foi encontrado.`); return; } const delay = 1000; buttons.forEach((button, index) => { setTimeout(() => button.click(), index * delay); }); };
        let adicionarBotoesLote = () => { const headerAcoes = document.querySelector('#tbl_docs thead th[data-column="3"] .tablesorter-header-inner'); if (headerAcoes && !headerAcoes.querySelector('.batch-disponibilizar-btn')) { const batchDispBtn = document.createElement('i'); batchDispBtn.className = 'fa fa-share-square batch-disponibilizar-btn'; batchDispBtn.title = 'Disponibilizar Todos (sem confirmação)'; batchDispBtn.onclick = () => executarAcaoEmLote(0); headerAcoes.appendChild(batchDispBtn); const batchRetBtn = document.createElement('i'); batchRetBtn.className = 'fa fa-ban batch-retirar-btn'; batchRetBtn.title = 'Retirar Disponibilização de Todos (sem confirmação)'; batchRetBtn.onclick = () => executarAcaoEmLote(1); headerAcoes.appendChild(batchRetBtn); } };
        let processarInfoDeStatus = () => { document.querySelectorAll("#tbl_docs div[id^='dv_']").forEach(actionContainer => { if (actionContainer.querySelector('.status-info-icon')) return; const detailedInfoSpan = actionContainer.querySelector("span:has(i.fa-folder-open-o)"); const infoText = detailedInfoSpan ? detailedInfoSpan.innerText.trim().replace(/\s+/g, ' ') : 'Status do documento'; if(detailedInfoSpan) detailedInfoSpan.setAttribute('data-processed', 'true'); const infoIcon = document.createElement('i'); infoIcon.className = 'fa fa-lightbulb-o status-info-icon'; infoIcon.title = infoText; actionContainer.appendChild(infoIcon); }); };
        let padronizarIcones = () => { const processedAttr = 'data-bsb-icon-processed'; document.querySelectorAll(`img[src*='Documento-Físico-Autenticado.png']:not([${processedAttr}]), img[src*='Documento-Nato-CompAssinado.png']:not([${processedAttr}])`).forEach(img => { const icon = document.createElement('i'); icon.className = 'fa fa-file-text-o bsb-icon bsb-icon-autenticado'; icon.setAttribute(processedAttr, 'true'); img.replaceWith(icon); }); document.querySelectorAll(`img[src*='Documento-Fisico-Invalido-Pequeno.png'][title='Invalidar Documento']:not([${processedAttr}])`).forEach(img => { const icon = document.createElement('i'); icon.className = 'fa fa-ban bsb-icon bsb-icon-invalidar'; icon.title = img.title; icon.style.cursor = 'pointer'; if (img.getAttribute('onclick')) icon.setAttribute('onclick', img.getAttribute('onclick')); icon.setAttribute(processedAttr, 'true'); img.replaceWith(icon); }); document.querySelectorAll(`span:has(i.fa-folder-open-o):not([${processedAttr}])`).forEach(span => { const icon = span.querySelector('i.fa-folder-open-o'); if (icon) { icon.className = 'fa fa-share-alt bsb-icon-disponivel'; span.setAttribute(processedAttr, 'true'); } }); document.querySelectorAll(`button[onclick*='fsDisponibilizarDoc'][onclick*=', 0,']:not([${processedAttr}])`).forEach(btn => { const icon = btn.querySelector('i.fa-share-alt'); if (icon) icon.classList.add('bsb-icon-disponivel'); btn.setAttribute(processedAttr, 'true'); }); document.querySelectorAll(`button[onclick*='fsDisponibilizarDoc'][onclick*=', 1,']:not([${processedAttr}])`).forEach(btn => { const icon = btn.querySelector('i.fa-share-alt'); if (icon) icon.classList.add('bsb-icon-retirar'); btn.setAttribute(processedAttr, 'true'); }); };
        function parseDateFromRow(row) { const dateText = row.cells[2]?.textContent; if (!dateText) return null; const match = dateText.match(/\[(\d{2})\/(\d{2})\/(\d{4}) (\d{2}:\d{2}:\d{2})\]/); if (!match) return null; const [, day, month, year, time] = match; return new Date(`${year}-${month}-${day}T${time}`); }
        function checkDocumentExists(searchConfig, tab1Panel) { const rows = Array.from(tab1Panel.querySelectorAll('#tbl_docs tbody tr')); return rows.some(row => { const cellTextOriginal = row.cells[1]?.textContent; if (!cellTextOriginal) return false; let hasIncludedKeyword = false; if (searchConfig.exactMatch) { const cellTextTrimmed = cellTextOriginal.trim(); hasIncludedKeyword = searchConfig.include.some(inc => cellTextTrimmed === inc); } else { const cellTextLower = cellTextOriginal.toLowerCase(); hasIncludedKeyword = searchConfig.include.some(inc => cellTextLower.includes(inc.toLowerCase())); } if (!hasIncludedKeyword) return false; if (searchConfig.exclude && searchConfig.exclude.length > 0) { const cellTextLower = cellTextOriginal.toLowerCase(); const hasExcludedKeyword = searchConfig.exclude.some(exc => cellTextLower.includes(exc.toLowerCase())); if (hasExcludedKeyword) return false; } return true; }); }
        function handleStatusButtonClick(searchConfig) { const allRows = Array.from(document.querySelectorAll('#tbl_docs tbody tr')); const matchingRows = allRows.filter(row => { const cellTextOriginal = row.cells[1]?.textContent; if (!cellTextOriginal) return false; let hasIncludedKeyword = false; if (searchConfig.exactMatch) { const cellTextTrimmed = cellTextOriginal.trim(); hasIncludedKeyword = searchConfig.include.some(inc => cellTextTrimmed === inc); } else { const cellTextLower = cellTextOriginal.toLowerCase(); hasIncludedKeyword = searchConfig.include.some(inc => cellTextLower.includes(inc.toLowerCase())); } if (!hasIncludedKeyword) return false; if (searchConfig.exclude && searchConfig.exclude.length > 0) { const cellTextLower = cellTextOriginal.toLowerCase(); const hasExcludedKeyword = searchConfig.exclude.some(exc => cellTextLower.includes(exc.toLowerCase())); if (hasExcludedKeyword) return false; } return true; }); if (matchingRows.length === 0) return; let latestRow = matchingRows.reduce((latest, current) => { const latestDate = parseDateFromRow(latest); const currentDate = parseDateFromRow(current); if (currentDate && (!latestDate || currentDate > latestDate)) { return current; } return latest; }, matchingRows[0]); const link = latestRow.querySelector('td a[href*="javascript:popup"], td i[onclick*="fsDownload"], td i[onclick*="fsGerarDoc"]'); if (link) { link.click(); } else { console.error('Power-Up: Link do popup não encontrado na linha do documento mais recente.'); } }
        let renderStatusButtons = () => { const tab1Panel = document.querySelector('#tabs-1'); if (!tab1Panel || document.getElementById('status-check-container')) return; const container = document.createElement('div'); container.id = 'status-check-container'; const title = document.createElement('h5'); title.className = 'ui-widget-header ui-corner-all'; title.textContent = 'Status Rápido de Documentos'; container.appendChild(title); const buttonWrapper = document.createElement('div'); buttonWrapper.className = 'status-check-wrapper'; DOCUMENTOS_MAPEADOS.forEach(doc => { const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'uiBotao status-check-btn'; btn.textContent = doc.label; const found = checkDocumentExists(doc.searchConfig, tab1Panel); if (found) { btn.classList.add('status-exists'); btn.onclick = () => handleStatusButtonClick(doc.searchConfig); } else { btn.classList.add('status-missing'); btn.onclick = () => iniciarUploadRapido(doc.value); } buttonWrapper.appendChild(btn); }); container.appendChild(buttonWrapper); tab1Panel.prepend(container); };

        // --- RECURSO: LINKS RÁPIDOS (RA, CRACHÁ, BLOQUEIO) ---
        let adicionarLinksAcademicos = () => {
            if (!config.enableConsultaRapida) return;
            const raProcessedAttr = 'data-bsb-ra-link-v4';
            const crachaProcessedAttr = 'data-bsb-cracha-link-v4';
            const bloqueioProcessedAttr = 'data-bsb-bloqueio-link-v4';
            const cursosProcessedAttr = 'data-bsb-cursos-link-v1';
            let extractedRA = null;
            let p_pesscodnr = null;

            // Mapeamento de Cidades para DADs e IDs (Numéricos)
            // IMPORTANTE: IDs baseados em suposição lógica acadXX -> XX. Se falhar, usar o padrão 11.
            const campusMap = {
                'curitiba': { dad: 'acad01', id: 1 },
                'apucarana': { dad: 'acad02', id: 2 },
                'campo mourao': { dad: 'acad03', id: 3 }, 'campo mourão': { dad: 'acad03', id: 3 },
                'cornelio procopio': { dad: 'acad04', id: 4 }, 'cornélio procópio': { dad: 'acad04', id: 4 },
                'pato branco': { dad: 'acad05', id: 5 },
                'dois vizinhos': { dad: 'acad06', id: 6 },
                'londrina': { dad: 'acad07', id: 7 },
                'medianeira': { dad: 'acad08', id: 8 },
                'ponta grossa': { dad: 'acad09', id: 9 },
                'santa helena': { dad: 'acad10', id: 10 },
                'francisco beltrao': { dad: 'acad11', id: 11 }, 'francisco beltrão': { dad: 'acad11', id: 11 },
                'toledo': { dad: 'acad12', id: 12 },
                'guarapuava': { dad: 'acad13', id: 13 }
            };

            // Detecta unidade ATUAL do usuário
            const detectCurrentUnitId = () => {
                const button = document.querySelector('button.ui-button-primary span.pi-map-marker');
                if (button) {
                    const text = button.parentElement.textContent.trim().toLowerCase();
                    for (const [city, data] of Object.entries(campusMap)) {
                        if (text.includes(city)) return data.id;
                    }
                }
                return 11; // Padrão FB
            };
            const currentUnitId = detectCurrentUnitId();

            // Função para trocar unidade via API Legado
            const changeUnit = (targetId) => {
                return fetch('https://sistemas2.utfpr.edu.br/dpls/sistema/entrada/mpMenu2.pcMudaUnidade', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: `p_unidcodnr=${targetId}`
                });
            };

            // Função auxiliar para descobrir o DAD e ID baseado no texto da linha
            const getCampusData = (text) => {
                const lowerText = text.toLowerCase();
                for (const [city, data] of Object.entries(campusMap)) {
                    if (lowerText.includes(city)) return data;
                }
                return { dad: 'acad11', id: 11 };
            };

            const hiddenInput = document.getElementById('p_pesscodnr');
            if (hiddenInput && hiddenInput.value) { p_pesscodnr = hiddenInput.value; }

            const headers = document.querySelectorAll('strong, span, b, td, div');
            for (let el of headers) {
                if (el.textContent && el.textContent.includes('Estudante:')) {
                    const match = el.textContent.match(/Estudante:\s*(\d+)\s*-/);
                    if (match) { extractedRA = match[1]; if (!p_pesscodnr) { p_pesscodnr = extractedRA.substring(0, extractedRA.length - 1); } break; }
                }
            }

            if (extractedRA) {
                const strongAluno = document.querySelector('div#fsResultado_int span[style*="font-size:large"] strong') || Array.from(document.querySelectorAll('strong')).find(el => el.textContent.includes(`Estudante: ${extractedRA}`));
                if (strongAluno) {
                    const spanAluno = strongAluno.parentElement;
                    if (spanAluno && spanAluno.tagName !== 'A' && !spanAluno.hasAttribute(raProcessedAttr)) {
                        const match = strongAluno.textContent.match(/Estudante:\s*(\d+)\s*-\s*(.+)/);
                        if (match) {
                            spanAluno.setAttribute(raProcessedAttr, 'true'); const nome = match[2]; const url = `https://sistemas2.utfpr.edu.br/dpls/sistema/acad11/mpcadastropessoa.inicioderac`; strongAluno.innerHTML = `Estudante: ${extractedRA} - `;
                            const link = document.createElement('a'); link.href = url; link.target = "_blank"; link.title = `Abrir Cadastro de Pessoa para ${nome}`; link.style.cursor = 'pointer'; link.style.color = '#0042b1'; link.style.textDecoration = 'underline'; link.textContent = nome;
                            link.addEventListener('click', () => { GM_setValue('consulta_cadastro', extractedRA); GM_setValue('consulta_cadastro_etapa2', null); }); strongAluno.appendChild(link);
                        }
                    }
                }
                const imgSemFoto = document.querySelector('img[src*="sem_foto"]');
                const centerDiv = imgSemFoto ? imgSemFoto.parentElement : document.querySelector('div#fsResultado_int div[style*="float: left"] center');
                if (centerDiv && !centerDiv.hasAttribute(crachaProcessedAttr)) {
                    let foundSemFoto = false; if (centerDiv && (centerDiv.textContent.includes('Sem foto') || (imgSemFoto))) { foundSemFoto = true; }
                    if (foundSemFoto) { centerDiv.setAttribute(crachaProcessedAttr, 'true'); const linkCracha = document.createElement('a'); linkCracha.href = 'https://sistemas2.utfpr.edu.br/dpls/sistema/acad11/mpcracha.inicio1'; linkCracha.target = '_blank'; linkCracha.style.color = 'red'; linkCracha.style.textDecoration = 'underline'; linkCracha.title = 'Abrir página do crachá'; linkCracha.textContent = '[Sem foto no Sistema de Crachá]'; centerDiv.appendChild(document.createElement('br')); centerDiv.appendChild(linkCracha); }
                }
                const cursosTitle = Array.from(document.querySelectorAll('strong')).find(el => el.textContent.includes('Cursos:'));
                if (cursosTitle && !cursosTitle.hasAttribute(bloqueioProcessedAttr)) { cursosTitle.setAttribute(bloqueioProcessedAttr, 'true'); const link = document.createElement('a'); link.href = 'https://sistemas2.utfpr.edu.br/dpls/sistema/acad11/mpalunobloqueio.inicio'; link.target = '_blank'; link.title = 'Abrir página de bloqueio de aluno'; link.className = 'bsb-bloqueio-link'; link.innerHTML = ' [<i class="fa fa-lock" aria-hidden="true"></i> Bloqueio]'; link.addEventListener('click', () => { GM_setValue('consulta_bloqueio', extractedRA); }); cursosTitle.parentElement.insertBefore(link, cursosTitle.nextSibling); }
            }

            // --- SCANNER E LÓGICA DE TROCA DE UNIDADE (v2.1.0) ---
            if (p_pesscodnr) {
                const resultadoDiv = document.getElementById('dv_resultado');
                if (!resultadoDiv) return;

                const scanAndInject = () => {
                    const walker = document.createTreeWalker(resultadoDiv, NodeFilter.SHOW_TEXT, null, false);
                    let node;
                    while (node = walker.nextNode()) {
                        const text = node.nodeValue;
                        const match = text.match(/\[(\d+)\]/);
                        
                        if (match) {
                            const p_curscodnr = match[1];
                            const parentEl = node.parentElement;
                            if (parentEl.hasAttribute(cursosProcessedAttr)) continue;

                            parentEl.setAttribute(cursosProcessedAttr, 'true');

                            // Detecta Câmpus
                            const fullLineText = parentEl.textContent + (parentEl.nextSibling ? parentEl.nextSibling.textContent : "");
                            const targetData = getCampusData(fullLineText);
                            
                            // Detecta Grade
                            let p_gradcodnr = null;
                            let contextText = parentEl.textContent;
                            let nextSibling = parentEl.nextSibling;
                            let attempts = 0;
                            while(nextSibling && attempts < 5) { contextText += " " + (nextSibling.textContent || ""); nextSibling = nextSibling.nextSibling; attempts++; }
                            const gradeMatch = contextText.match(/(Grade|Currículo):\s*(\d+)/i);
                            if (gradeMatch) p_gradcodnr = gradeMatch[2];

                            // Toolbar
                            const toolbar = document.createElement('span');
                            toolbar.className = 'bsb-curso-toolbar';
                            toolbar.style.marginLeft = '2px';
                            toolbar.style.fontSize = '0.9em';
                            toolbar.style.whiteSpace = 'nowrap';

                            // --- LÓGICA DO LINK INTELIGENTE ---
                            const createSmartLink = (label, icon, endpointParams) => {
                                const a = document.createElement('a');
                                a.innerHTML = `<i class="fa ${icon}"></i>`;
                                a.className = 'bsb-curso-link';
                                a.style.marginLeft = '6px';
                                a.style.textDecoration = 'none';
                                a.style.fontSize = '1.1em';
                                a.style.cursor = 'pointer';

                                const targetUrl = `https://sistemas2.utfpr.edu.br/dpls/sistema/${targetData.dad}/${endpointParams}`;

                                if (targetData.id === currentUnitId) {
                                    // Mesmo Câmpus: Link Direto Azul
                                    a.href = targetUrl;
                                    a.target = '_blank';
                                    a.title = label;
                                    a.style.color = '#0042b1'; // Azul
                                } else {
                                    // Outro Câmpus: Link Laranja com Troca Automática
                                    a.title = `${label} (Troca automática para ${targetData.dad})`;
                                    a.style.color = '#e67e22'; // Laranja
                                    
                                    a.onclick = async (e) => {
                                        e.preventDefault();
                                        const originalIcon = a.innerHTML;
                                        a.innerHTML = `<i class="fa fa-spinner fa-spin"></i>`; // Loading
                                        document.body.style.cursor = 'wait';

                                        try {
                                            // 1. Troca Unidade
                                            await changeUnit(targetData.id);
                                            console.log(`Power-Up: Unidade trocada para ${targetData.id}`);
                                            
                                            // 2. Abre Link
                                            window.open(targetUrl, '_blank');

                                            // 3. Destroca após 3s
                                            setTimeout(async () => {
                                                await changeUnit(currentUnitId);
                                                console.log(`Power-Up: Unidade restaurada para ${currentUnitId}`);
                                                a.innerHTML = originalIcon;
                                                document.body.style.cursor = 'default';
                                            }, 3000);

                                        } catch (err) {
                                            console.error("Power-Up: Erro na troca de unidade.", err);
                                            alert("Erro ao trocar unidade automaticamente. Tente manualmente.");
                                            a.innerHTML = originalIcon;
                                            document.body.style.cursor = 'default';
                                        }
                                    };
                                }
                                return a;
                            };

                            toolbar.appendChild(createSmartLink('Boletim', 'fa-file-text-o', 
                                `mpBoletim.inicioAluno?p_pesscodnr=${p_pesscodnr}&p_curscodnr=${p_curscodnr}&p_alcuordemnr=1`));
                            
                            toolbar.appendChild(createSmartLink('Histórico', 'fa-graduation-cap', 
                                `mpHistEscol.pcprocessa?p_pesscodnr=${p_pesscodnr}&p_curscodnr=${p_curscodnr}&p_alcuordemnr=1`));

                            if (p_gradcodnr) {
                                toolbar.appendChild(createSmartLink('Situação', 'fa-bar-chart', 
                                    `mpListaSituacaoAluno.pcListaDisciplinasCur?p_pesscodnr=${p_pesscodnr}&p_curscodnr=${p_curscodnr}&p_alcuordemnr=1&p_gradcodnr=${p_gradcodnr}`));
                            }

                            if (node.nextSibling) { parentEl.insertBefore(toolbar, node.nextSibling); } else { parentEl.appendChild(toolbar); }
                        }
                    }
                };
                scanAndInject(); setTimeout(scanAndInject, 1000);
            }
        };
        // --- FIM: LINKS RÁPIDOS ---


        runPastaDoEstudanteUpdates = function() {
            adicionarBotoesLote();
            processarInfoDeStatus();
            padronizarIcones();
            adicionarBotoesUploadRapido();
            if (config.enableStatusCheckTab1) { renderStatusButtons(); }
            adicionarLinksAcademicos();
        };

        setupUploadAutomation();
        styles += `
            .batch-disponibilizar-btn { cursor: pointer; color: #007F00; margin-left: 10px; font-size: 1.4em; vertical-align: middle; } .batch-retirar-btn { cursor: pointer; color: #b30000; margin-left: 8px; font-size: 1.4em; vertical-align: middle; } #tbl_docs td.stdcenter { display: flex; align-items: center; justify-content: center; gap: 8px; flex-wrap: wrap; } #tbl_docs div[id^='dv_'] { display: flex !important; align-items: center; gap: 8px; flex-wrap: wrap; } #tbl_docs td.stdcenter > a { display: flex; flex-direction: column; align-items: center; gap: 4px; } #tbl_docs td.stdcenter > span, #tbl_docs div[id^='dv_'] > span[data-processed='true'], #tbl_docs div[id^='dv_'] .uiBotaoFA span, #tbl_docs td.stdcenter > a > span, #tbl_docs td.stdcenter > a > br, #tbl_docs div[id^='dv_'] > br, #tbl_docs div[id^='dv_'] > hr { display: none !important; } #tbl_docs div[id^='dv_'] .uiBotaoFA { padding: 4px 8px !important; margin: 0 !important; } .bsb-icon { font-size: 2.5em; } .bsb-icon-autenticado { color: #337ab7; } .bsb-icon-invalidar { color: #d9534f; font-size: 1.8em; } .bsb-icon-disponivel { color: #5cb85c !important; } .bsb-icon-retirar { color: #d9534f !important; } .status-info-icon { font-size: 1.2em; color: #f0ad4e; cursor: help; } #bsb-quick-upload-container { padding: 10px; margin: 0 auto 20px auto; border: 1px solid #ccc; max-width: 80%; } #bsb-quick-upload-container h5 { padding: 5px; margin: -11px -11px 10px -11px; text-align: center; font-size: 1em; font-weight: bold; } .bsb-quick-upload-wrapper { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; } .bsb-quick-upload-btn { display: flex; align-items: center; gap: 8px; font-size: 1em !important; padding: 5px 10px !important; border-radius: 4px; } .bsb-quick-upload-btn i { font-size: 1.5em; vertical-align: middle; }
            #status-check-container { padding: 10px; margin: 0 auto 20px auto; border: 1px solid #ccc; max-width: 80%; background-color: #f9f9f9; border-radius: 4px; } #status-check-container h5 { padding: 5px; margin: -11px -11px 10px -11px; text-align: center; font-size: 1em; font-weight: bold; } .status-check-wrapper { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; } .status-check-btn { color: white !important; font-weight: bold; border: 1px solid rgba(0,0,0,0.2); } .status-exists { background: #28a745 !important; cursor: pointer !important; } .status-missing { background: #dc3545 !important; cursor: pointer !important; }
            a.bsb-bloqueio-link { font-size: 0.9em; color: #b30000; text-decoration: none; font-weight: bold; } a.bsb-bloqueio-link:hover { text-decoration: underline; }
        `;
    }
    function initializePastaEstudantePopup() { console.log('Power-Up: Módulo Pasta do Estudante (Página Popup) ativado.'); try { if (window.opener && !window.opener.closed && typeof window.opener.fsPesquisar === 'function') { window.opener.fsPesquisar(); } } catch (e) { console.error("Script (Sucesso): Erro ao tentar atualizar a página principal.", e); } finally { window.close(); } }

    // ------------------------------------------------------------------------------------
    // --- MÓDULO UTFPR: QUALIDADE DO PDF
    // ------------------------------------------------------------------------------------
    function initializePdfQualityBoost() {
        console.log('Power-Up: Módulo Qualidade do PDF ativado.');
        const scriptElement = document.createElement('script');
        scriptElement.textContent = `
            if (typeof scale !== 'undefined') { scale = 2; }
            if (typeof queueRenderPage !== 'undefined' && typeof pageNum !== 'undefined') {
                queueRenderPage(pageNum);
            }
        `;
        document.body.appendChild(scriptElement);
    }

    // ------------------------------------------------------------------------------------
    // --- MÓDULO UTFPR: ASSISTENTE DO PROCESSO SELETIVO
    // ------------------------------------------------------------------------------------
    function initializeProcessoSeletivo() {
        console.log('Power-Up: Módulo Assistente do Processo Seletivo ativado.');
        const idDoCampoMotivo = 'P4_CSDOCOBSCANDIDATOVC';
        const motivos = {
            'Documento Ilegível': 'O documento enviado está ilegível, cortado ou com baixa qualidade, impossibilitando a análise das informações.', 'Falta Assinatura': 'A declaração enviada não está assinada. É necessário que o candidato assine o documento.',
            'Dados Divergentes': 'Os dados presentes no documento (nome, CPF, etc.) divergem das informações fornecidas no ato da inscrição.', 'Documento Inválido': 'O tipo de documento enviado não corresponde ao solicitado no edital.',
            'Documento incompleto': 'Documento incompleto, faltando páginas, frente ou verso.', 'Documento aberto': 'O candidato precisa tirar o documento do plástico de proteção, abri-lo, e enviar a foto da frente e verso.',
            'Modelo Incompatível': 'Documento apresentado não está de acordo com a declaração modelo disponível em https://www.utfpr.edu.br/cursos/estudenautfpr/sisu/modelos-de-declaracoes',
            'Assinatura ou Hash': 'Documento apresentado não possuiu assinatura física nem digital, tampouco código hash de validação'
        };
        function executar(campoMotivo) {
            if (document.getElementById('botoes-motivos-container')) return;
            const etiquetaFlutuante = campoMotivo.previousElementSibling;
            if (etiquetaFlutuante) { etiquetaFlutuante.style.display = 'none'; }
            const containerBotoes = document.createElement('div'); containerBotoes.id = 'botoes-motivos-container';
            Object.entries(motivos).forEach(([nomeBotao, texto]) => {
                const button = document.createElement('button'); button.innerText = nomeBotao; button.type = 'button'; button.className = 't-Button t-Button--small t-Button--hot';
                button.onclick = () => { campoMotivo.value = texto; campoMotivo.dispatchEvent(new Event('input', { bubbles: true })); };
                containerBotoes.appendChild(button);
            });
            campoMotivo.before(containerBotoes);
        }
        const waitForElement = (selector, callback) => { const observer = new MutationObserver((mutations, me) => { const element = document.querySelector(selector); if (element) { me.disconnect(); callback(element); } }); observer.observe(document.body, { childList: true, subtree: true }); };
        styles += `
            #botoes-motivos-container { margin-bottom: 12px; display: flex; flex-wrap: wrap; gap: 6px; }
            #botoes-motivos-container .t-Button { margin-bottom: 0 !important; }
        `;
        waitForElement(`#${idDoCampoMotivo}`, executar);
    }

    // ------------------------------------------------------------------------------------
    // --- MÓDULO UTFPR: AUTOPREENCHER BLOQUEIO (Lógica Corrigida)
    // ------------------------------------------------------------------------------------
    function initializeBloqueioHelper() {
        console.log('Power-Up: Módulo Bloqueio de Aluno ativado.');

        function fillAndValidateSpryField(field, value) {
            if (!field) return;
            field.value = value;
            field.dispatchEvent(new Event('input', { bubbles: true }));
            field.dispatchEvent(new Event('change', { bubbles: true }));
            field.dispatchEvent(new Event('blur', { bubbles: true }));
        }

        runBloqueioHelperUpdates = function() {
            const formDiv = document.getElementById('dv_alteracao');

            if (formDiv && formDiv.offsetHeight > 0) {
                // Formulário está visível
                if (typeof unsafeWindow.spryp_matrbloqanonr !== 'undefined' && !formDiv.hasAttribute('data-autofilled')) {

                    // Flag é setada imediatamente para evitar loops do observador
                    formDiv.setAttribute('data-autofilled', 'true');
                    console.log('Power-Up: Formulário e Spry detectados. Aguardando 100ms para preencher...');

                    // Adiciona o atraso de 100ms para deixar a Spry "se ligar" aos campos
                    setTimeout(() => {
                        console.log('Power-Up: Preenchendo campos agora.');
                        const anoField = document.getElementById('p_matrbloqanonr');
                        const semestreField = document.getElementById('p_matrbloqperanonr');
                        const motivoField = document.getElementById('p_matrbloqmotivovc');

                        if (anoField && semestreField && motivoField) {
                            const now = new Date();
                            const currentYear = now.getFullYear();
                            const currentMonth = now.getMonth(); // 0-11
                            const currentSemester = (currentMonth < 6) ? 1 : 2; // Jan-Jun -> 1; Jul-Dec -> 2

                            fillAndValidateSpryField(anoField, currentYear);
                            fillAndValidateSpryField(semestreField, currentSemester);
                            fillAndValidateSpryField(motivoField, 'Autenticação Administrativa');
                        }
                    }, 100); // Atraso de 100ms
                }
            } else if (formDiv && formDiv.offsetHeight === 0 && formDiv.hasAttribute('data-autofilled')) {
                // O formulário foi escondido, reseta a flag
                console.log('Power-Up: Formulário de bloqueio escondido, resetando flag.');
                formDiv.removeAttribute('data-autofilled');
            }
        }
    }

    // ------------------------------------------------------------------------------------
    // --- MÓDULO UTFPR: CONSULTA RÁPIDA (CADASTRO, BLOQUEIO, CRACHÁ) (v1.7.2)
    // ------------------------------------------------------------------------------------

    // Dispara os eventos necessários para que a página reconheça o preenchimento
    function dispatchInputEvents(element) {
        if (!element) return;
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
        element.dispatchEvent(new Event('blur', { bubbles: true }));
    }

    // Módulo 1: Cadastro de Pessoas
    function initializeCadastroRapido() {
        console.log('Power-Up: Módulo Consulta Rápida (Cadastro) ativado.');
        try {
            const buscaInput = document.getElementById('p_buscavc');
            const buscarBtn = document.getElementById('btnProcurar1');
            const raEtapa1 = GM_getValue('consulta_cadastro', null);
            const raEtapa2 = GM_getValue('consulta_cadastro_etapa2', null);

            // ETAPA 1
            if (raEtapa1 && buscaInput && buscarBtn && buscaInput.value === '') {
                console.log(`Power-Up (Cadastro Rápido): RA ${raEtapa1} detectado. Buscando...`);
                GM_setValue('consulta_cadastro', null); // Limpa flag 1
                GM_setValue('consulta_cadastro_etapa2', raEtapa1); // Seta flag 2
                buscaInput.value = raEtapa1;
                dispatchInputEvents(buscaInput);
                buscarBtn.click();
                return;
            }

            // ETAPA 2
            if (raEtapa2) {
                console.log(`Power-Up (Cadastro Rápido): Verificando resultados para ${raEtapa2}...`);
                GM_setValue('consulta_cadastro_etapa2', null); // Limpa flag 2

                const tabelaResultados = document.getElementById('tbl_');
                if (!tabelaResultados) return;
                const linhas = tabelaResultados.querySelectorAll('tbody tr');

                if (linhas.length === 1 && !linhas[0].textContent.includes('Nenhum Registro')) {
                    const linha = linhas[0];
                    const raNaLinha = linha.cells[1].textContent.trim();
                    const consultaBtn = linha.querySelector('img[onclick*="jsConsultar"]');

                    if (raNaLinha === raEtapa2 && consultaBtn) {
                        console.log('Power-Up (Cadastro Rápido): RA encontrado. Clicando para consultar...');
                        consultaBtn.click();
                    }
                }
            }
        } catch (e) {
            console.error('Power-Up (Cadastro Rápido): Erro no módulo.', e);
            GM_setValue('consulta_cadastro', null);
            GM_setValue('consulta_cadastro_etapa2', null);
        }
    }

    // Módulo 2: Bloqueio de Aluno
    function initializeBloqueioRapido() {
        const ra = GM_getValue('consulta_bloqueio', null);
        if (!ra) return;

        console.log(`Power-Up (Bloqueio Rápido): RA ${ra} detectado.`);
        GM_setValue('consulta_bloqueio', null);

        const buscaInput = document.getElementById('p_pessoa');
        const buscarBtn = document.getElementById('btnProcurar1');

        if (buscaInput && buscarBtn && buscaInput.value === '') {
            buscaInput.value = ra;
            dispatchInputEvents(buscaInput); // Dispara 'change' para fsPesqPess e 'blur' para Spry

            setTimeout(() => {
                 console.log(`Power-Up (Bloqueio Rápido): Clicando em Procurar.`);
                 buscarBtn.click();
            }, 500);
        }
    }

    // ------------------------------------------------------------------------------------
    // --- MÓDULO UTFPR: GERADOR DE TABELA EXCEL (v1.8.0)
    // ------------------------------------------------------------------------------------
    function initializeExcelTableGenerator() {
        console.log('Power-Up: Módulo Gerador de Excel ativado.');
        
        function reconstruirTabela(tabelaOriginal, targetDocument) {
            let dadosLimpos = [];
            let cabecalho = [];
            let infoProfessorAtual = {};
            const linhasOriginais = Array.from(tabelaOriginal.querySelectorAll('tbody > tr'));

            cabecalho = Array.from(linhasOriginais[0].cells).map(cell => cell.textContent.trim());
            dadosLimpos.push(cabecalho);

            for (let i = 1; i < linhasOriginais.length; i++) {
                const linha = linhasOriginais[i];
                const celulas = linha.cells;
                if (celulas.length <= 1 || celulas[0].querySelector('hr') || celulas[0].textContent.trim() === '') {
                    continue;
                }

                let novaLinha = [];
                if (celulas[0].hasAttribute('rowspan') && celulas.length > 3) {
                    infoProfessorAtual = {
                        codigo: celulas[0]?.textContent.trim(),
                        nome: celulas[1]?.textContent.trim(),
                        titulacao: celulas[2]?.textContent.trim(),
                    };
                    novaLinha.push(infoProfessorAtual.codigo, infoProfessorAtual.nome, infoProfessorAtual.titulacao);
                    for (let j = 3; j < celulas.length; j++) { novaLinha.push(celulas[j].textContent.trim()); }
                } else {
                    novaLinha.push(infoProfessorAtual.codigo, infoProfessorAtual.nome, infoProfessorAtual.titulacao);
                    for (let j = 0; j < celulas.length; j++) { novaLinha.push(celulas[j].textContent.trim()); }
                }
                while (novaLinha.length < cabecalho.length) { novaLinha.push(""); }
                dadosLimpos.push(novaLinha);
            }

            tabelaOriginal.style.display = 'none';

            const novaTabela = targetDocument.createElement('table');
            novaTabela.border = 1;
            novaTabela.style.cssText = "border-collapse: collapse; width: 100%; font-family: sans-serif; font-size: 14px; background-color: white;";
            novaTabela.id = 'tabela-limpa-para-excel';

            dadosLimpos.forEach((rowData, index) => {
                const tr = novaTabela.insertRow();
                rowData.forEach(cellData => {
                    const cellElement = (index === 0) ? document.createElement('th') : document.createElement('td');
                    cellElement.textContent = cellData;
                    cellElement.style.cssText = "border: 1px solid #ccc; padding: 6px; text-align: left;";
                    tr.appendChild(cellElement);
                });
            });

            tabelaOriginal.parentNode.insertBefore(novaTabela, tabelaOriginal.nextSibling);
            const mensagem = targetDocument.createElement('p');
            mensagem.id = 'mensagem-script-utfpr';
            mensagem.innerHTML = '✅ <b>Tabela limpa para Excel gerada abaixo.</b> A tabela original foi ocultada.';
            mensagem.style.cssText = "color: green; font-family: sans-serif; font-weight: bold;";
            tabelaOriginal.parentNode.insertBefore(mensagem, tabelaOriginal);
        }

        // Lógica de espera ativa
        const MAX_TENTATIVAS = 40; 
        let tentativas = 0;
        const observerId = setInterval(function() {
            tentativas++;
            let targetDocument = document;
            const iframe = document.querySelector('iframe[name="frameUrl"]');
            if (iframe) {
                try {
                    targetDocument = iframe.contentDocument || iframe.contentWindow.document;
                } catch(e) {
                    // Cross-origin issues might happen, though unlikely on same domain
                }
            }

            if (!targetDocument) {
                if (tentativas > MAX_TENTATIVAS) clearInterval(observerId);
                return;
            }

            const tabelaOriginal = targetDocument.querySelector('div#dv_resultado table.tabela');

            if (tabelaOriginal) {
                console.log(`Power-Up: Tabela para Excel encontrada após ${tentativas/2} segundos.`);
                clearInterval(observerId);
                reconstruirTabela(tabelaOriginal, targetDocument);
            } else if (tentativas > MAX_TENTATIVAS) {
                clearInterval(observerId);
            }
        }, 500);
    }

    // ------------------------------------------------------------------------------------
    // --- MÓDULO UTFPR: REMOVER FORMATAÇÃO AO COLAR (v1.8.3)
    // ------------------------------------------------------------------------------------
    function initializePasteInputCleaner() {
        console.log('Power-Up: Módulo Cleaner de Colagem ativado.');
        document.addEventListener('paste', function(e) {
            const target = e.target;
            if (target.tagName === 'INPUT' && (target.type === 'text' || target.type === 'number')) {
                const pastedText = (e.clipboardData || window.clipboardData).getData('text');
                const cleanedText = pastedText.replace(/\D/g, '');

                // Se houve alteração (tinha formatação) e o resultado é numérico
                if (pastedText !== cleanedText && cleanedText.length > 0) {
                    e.preventDefault();
                    
                    // Tenta usar execCommand para manter compatibilidade de eventos e undo
                    if (document.queryCommandSupported('insertText')) {
                        document.execCommand('insertText', false, cleanedText);
                    } else {
                        // Fallback para navegadores que não suportam execCommand ou em contextos restritos
                        const start = target.selectionStart;
                        const end = target.selectionEnd;
                        const val = target.value;
                        target.value = val.slice(0, start) + cleanedText + val.slice(end);
                        target.selectionStart = target.selectionEnd = start + cleanedText.length;
                        target.dispatchEvent(new Event('input', { bubbles: true }));
                        target.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                    console.log('Power-Up: Formatação removida da colagem.');
                }
            }
        }, true); // Capture phase para garantir que rodamos antes da validação do input
    }

    // ------------------------------------------------------------------------------------
    // --- MÓDULO SEED-PR: AUXILIAR DE VALIDAÇÃO (v1.8.1)
    // ------------------------------------------------------------------------------------
    function initializeSeedPrValidationHelper() {
        console.log('Power-Up: Módulo SEED-PR Validação ativado.');
        
        function activateHelper() {
             const firstField = document.getElementById('campoValidacao1');

            if (firstField && !firstField.hasAttribute('data-seed-helper-active')) {
                console.log('Power-Up: Campo de validação SEED detectado. Ativando listener.');
                firstField.setAttribute('data-seed-helper-active', 'true');

                firstField.addEventListener('paste', function(event) {
                    event.preventDefault();
                    const pastedData = (event.clipboardData || window.clipboardData).getData('text');
                    const parts = pastedData.trim().split('-');

                    if (parts.length === 5) {
                        const fieldIds = ['campoValidacao1', 'campoValidacao2', 'campoValidacao3', 'campoValidacao4', 'campoValidacao5'];
                        fieldIds.forEach((id, index) => {
                            const field = document.getElementById(id);
                            if (field) {
                                field.value = parts[index];
                            }
                        });
                    } else {
                        alert('O código colado não parece estar no formato correto.\nUse: XXXXX-XXXXX-XXXXX-XXXXX-XXXXX');
                        firstField.value = pastedData;
                    }
                });
            }
        }

        // Tenta ativar imediatamente e também observa caso a página seja carregada dinamicamente
        activateHelper();
        window.addEventListener('load', activateHelper);
    }


    // ------------------------------------------------------------------------------------
    // --- PAINEL DE CONFIGURAÇÕES VISUAL
    // ------------------------------------------------------------------------------------
    function createSettingsPanel() {
        const overlay = document.createElement('div');
        overlay.id = 'power-up-settings-overlay';
        const panel = document.createElement('div');
        panel.id = 'power-up-settings-panel';
        panel.innerHTML = `
            <h3>Configurações do UTFPR Power-Up</h3>
            <div class="setting-row"> <input type="checkbox" id="setting-processo-seletivo"> <label for="setting-processo-seletivo"><b>UTFPR: Assistente do Processo Seletivo:</b> Botões de motivo de indeferimento.</label> </div>
            <div class="setting-row"> <input type="checkbox" id="setting-menu-optimizer"> <label for="setting-menu-optimizer"><b>UTFPR: Otimizador de Menu:</b> Menu na barra superior.</label> </div>
            <div class="setting-row"> <input type="checkbox" id="setting-bloqueio-helper"> <label for="setting-bloqueio-helper"><b>UTFPR: Pagamento e Bloqueio:</b> Preenche Ano, Semestre e Motivo.</label> </div>
            <div class="setting-row"> <input type="checkbox" id="setting-consulta-rapida"> <label for="setting-consulta-rapida"><b>UTFPR: Pasta do Estudante - Links Rápidos:</b> Cadastro, Bloqueio e Crachá.</label> </div>
            <div class="setting-row"> <input type="checkbox" id="setting-pdf-quality"> <label for="setting-pdf-quality"><b>UTFPR: Pasta do Estudante - Qualidade dos documentos.</b></label> </div>
            <div class="setting-row"> <input type="checkbox" id="setting-status-check"> <label for="setting-status-check"><b>UTFPR: Pasta do Estudante - Status Rápido de documentos.</b></label> </div>
            <div class="setting-row"> <input type="checkbox" id="setting-pasta-estudante"> <label for="setting-pasta-estudante"><b>UTFPR: Pasta do Estudante - Upload rápido</b> e melhorias.</label> </div>
            <div class="setting-row"> <input type="checkbox" id="setting-excel-generator"> <label for="setting-excel-generator"><b>UTFPR: Tabelas: Professor por curso (url 50)</b></label> </div>
            <div class="setting-row"> <input type="checkbox" id="setting-paste-cleaner"> <label for="setting-paste-cleaner"><b>Geral: Remover formatação ao colar (CPF/CNPJ)</b></label> </div>
            <hr style="margin: 10px 0; border: 0; border-top: 1px solid #ccc;">
            <div class="setting-row"> <input type="checkbox" id="setting-seed-validation"> <label for="setting-seed-validation"><b>SEED-PR: Auxiliar de validação de HE</b></label> </div>
            <button id="power-up-save-btn">Salvar e Recarregar</button>
        `;
        document.body.appendChild(overlay); document.body.appendChild(panel);
        const closePanel = () => { overlay.style.display = 'none'; panel.style.display = 'none'; };
        overlay.addEventListener('click', closePanel);
        panel.querySelector('#power-up-save-btn').addEventListener('click', () => {
            const settings = {
                enableMenuOptimizer: panel.querySelector('#setting-menu-optimizer').checked,
                enablePastaDoEstudante: panel.querySelector('#setting-pasta-estudante').checked,
                enablePdfQualityBoost: panel.querySelector('#setting-pdf-quality').checked,
                enableStatusCheckTab1: panel.querySelector('#setting-status-check').checked,
                enableProcessoSeletivo: panel.querySelector('#setting-processo-seletivo').checked,
                enableBloqueioHelper: panel.querySelector('#setting-bloqueio-helper').checked,
                enableConsultaRapida: panel.querySelector('#setting-consulta-rapida').checked,
                enableExcelTableGenerator: panel.querySelector('#setting-excel-generator').checked,
                enablePasteInputCleaner: panel.querySelector('#setting-paste-cleaner').checked,
                enableSeedPrValidation: panel.querySelector('#setting-seed-validation').checked
            };
            Object.entries(settings).forEach(([key, value]) => GM_setValue(key, value));
            alert('Configurações salvas! A página será recarregada.');
            window.location.reload();
        });
    }

    function openSettingsPanel() {
        document.querySelector('#setting-menu-optimizer').checked = config.enableMenuOptimizer;
        document.querySelector('#setting-pasta-estudante').checked = config.enablePastaDoEstudante;
        document.querySelector('#setting-pdf-quality').checked = config.enablePdfQualityBoost;
        document.querySelector('#setting-status-check').checked = config.enableStatusCheckTab1;
        document.querySelector('#setting-processo-seletivo').checked = config.enableProcessoSeletivo;
        document.querySelector('#setting-bloqueio-helper').checked = config.enableBloqueioHelper;
        document.querySelector('#setting-consulta-rapida').checked = config.enableConsultaRapida;
        document.querySelector('#setting-excel-generator').checked = config.enableExcelTableGenerator;
        document.querySelector('#setting-paste-cleaner').checked = config.enablePasteInputCleaner;
        document.querySelector('#setting-seed-validation').checked = config.enableSeedPrValidation;
        document.querySelector('#power-up-settings-overlay').style.display = 'block';
        document.querySelector('#power-up-settings-panel').style.display = 'block';
    }

    styles += `
        #power-up-settings-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: rgba(0,0,0,0.6); z-index: 9998; display: none; }
        #power-up-settings-panel { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: #f0f0f0; border: 1px solid #ccc; border-radius: 8px; padding: 20px; z-index: 9999; display: none; min-width: 550px; box-shadow: 0 4px 15px rgba(0,0,0,0.3); font-family: sans-serif; }
        #power-up-settings-panel h3 { margin-top: 0; text-align: center; border-bottom: 1px solid #ddd; padding-bottom: 10px; }
        #power-up-settings-panel .setting-row { display: flex; align-items: center; margin: 15px 0; }
        #power-up-settings-panel input[type="checkbox"] { width: 20px; height: 20px; margin-right: 15px; flex-shrink: 0; }
        #power-up-settings-panel label { font-size: 14px; }
        #power-up-settings-panel button { display: block; width: 100%; padding: 10px; background-color: #0042b1; color: white; border: none; border-radius: 5px; font-size: 16px; cursor: pointer; margin-top: 10px; }
        #power-up-settings-panel button:hover { background-color: #0056cf; }
    `;

    // ------------------------------------------------------------------------------------
    // --- FUNÇÃO GLOBAL: ADICIONAR VERSÃO NO RODAPÉ
    // ------------------------------------------------------------------------------------
    function adicionarIdentificadorDeVersao() {
        // Correção v1.9.2: Apenas adiciona se for o topo (evita duplicidade em iframes)
        if (window.top !== window.self) return;

        // Seletor de rodapé genérico para funcionar nos dois sites
        const footerSelectors = 'footer, app-footer, #footer, .footer, .ui-layout-south, #j_idt13'; 
        const waitForFooter = (callback) => { const interval = setInterval(() => { const footer = document.querySelector(footerSelectors) || document.body; if (footer) { clearInterval(interval); callback(footer); } }, 1000); };
        
        waitForFooter((footer) => {
            const version = GM_info.script.version; const name = GM_info.script.name; const identifierId = 'power-up-version-indicator';
            if (document.getElementById(identifierId)) return;
            const versionDiv = document.createElement('div');
            versionDiv.id = identifierId;
            versionDiv.title = 'Abrir Configurações do Script';
            versionDiv.textContent = `${name} v${version}`;
            versionDiv.addEventListener('click', openSettingsPanel);
            
            // Estilo fixo para garantir visibilidade
            versionDiv.style.position = 'fixed';
            versionDiv.style.bottom = '2px';
            versionDiv.style.right = '5px';
            versionDiv.style.background = 'rgba(0,0,0,0.7)';
            versionDiv.style.color = 'white';
            versionDiv.style.padding = '2px 5px';
            versionDiv.style.fontSize = '10px';
            versionDiv.style.borderRadius = '3px';
            versionDiv.style.zIndex = '99999';
            versionDiv.style.cursor = 'pointer';

            document.body.appendChild(versionDiv);
        });
    }

    // ====================================================================================
    // --- ROTEADOR E OBSERVADOR CENTRAL
    // ====================================================================================
    function centralDispatcher() {
        if (isUtfprDomain) {
            // Lógica exclusiva UTFPR
            if (config.enableMenuOptimizer) {
                runMenuModification();
            }
            if (config.enablePastaDoEstudante && (currentUrl.includes('mppastadoaluno.inicio') || currentUrl.includes('/url/2450'))) {
                runPastaDoEstudanteUpdates();
            }
            if (config.enableBloqueioHelper && currentUrl.includes('mpAlunoBloqueio.inicio')) {
                runBloqueioHelperUpdates();
            }
        }
    }

    // --- EXECUÇÃO INICIAL POR DOMÍNIO ---
    
    // 1. UTFPR: Funcionalidades complexas
    if (isUtfprDomain) {
        if (config.enablePastaDoEstudante && currentUrl.includes('mpPastadoAluno.pcUploadRetorno')) {
            initializePastaEstudantePopup();
        }
        if (config.enablePdfQualityBoost && currentUrl.includes('mpCADEDocsAssinar.pcRecuperarDoc')) {
            initializePdfQualityBoost();
        }
        if (config.enableProcessoSeletivo && currentUrl.includes('/ords/f?p=106:')) {
            initializeProcessoSeletivo();
        }
        if (config.enableExcelTableGenerator && (currentUrl.includes('/url/50') || currentUrl.includes('mplistaprofcurso'))) {
            initializeExcelTableGenerator();
        }
        if (config.enablePasteInputCleaner && (currentUrl.includes('mpcadprotacad.inicio') || currentUrl.includes('mpcadastropessoa.inicioderac'))) {
            initializePasteInputCleaner();
        }

        if (config.enableConsultaRapida) {
            const pastaReferrer = document.referrer.includes('mppastadoaluno.inicio') || document.referrer.includes('/url/2450');
            if (currentUrl.includes('mpcadastropessoa.inicioderac') || currentUrl.includes('/url/1695')) {
                if (!pastaReferrer) { GM_setValue('consulta_cadastro', null); GM_setValue('consulta_cadastro_etapa2', null); }
                initializeCadastroRapido();
            } else if (currentUrl.includes('mpalunobloqueio.inicio')) {
                if (!pastaReferrer) { GM_setValue('consulta_bloqueio', null); }
                initializeBloqueioRapido();
            } else if (currentUrl.includes('mpcracha.inicio1')) {
                if (!pastaReferrer) { GM_setValue('consulta_cracha', null); }
            }
        }

        if (config.enableMenuOptimizer) initializeMenuOptimizer();
        if (config.enablePastaDoEstudante && (currentUrl.includes('mppastadoaluno.inicio') || currentUrl.includes('/url/2450'))) {
            initializePastaEstudanteMain();
        }
        if (config.enableBloqueioHelper && currentUrl.includes('mpAlunoBloqueio.inicio') && !GM_getValue('consulta_bloqueio', null)) {
            initializeBloqueioHelper();
        }
    }

    // 2. SEED-PR: Funcionalidades específicas
    if (isSeedPrDomain && config.enableSeedPrValidation) {
        initializeSeedPrValidationHelper();
    }

    // Comum a todos
    createSettingsPanel();
    adicionarIdentificadorDeVersao();

    GM_addStyle(`
        #power-up-version-indicator:hover { background: #0042b1 !important; }
        ${styles}
    `);

    // Inicia o observador central apenas se estiver na UTFPR (SEED usa apenas listeners diretos)
    if (isUtfprDomain && (runMenuModification || runPastaDoEstudanteUpdates || runBloqueioHelperUpdates)) {
        const mainObserver = new MutationObserver(centralDispatcher);
        mainObserver.observe(document.body, { childList: true, subtree: true });
        centralDispatcher();
    }

    console.log(`UTFPR Power-Up v${GM_info.script.version} carregado. Configuração de domínio: UTFPR=${isUtfprDomain}, SEED=${isSeedPrDomain}`);

})();