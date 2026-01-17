// ==UserScript==
// @name         1Doc - Filtragem e Varredura de Protocolos
// @namespace    Alexandre E. F.
// @version      17.0
// @description  Coleta protocolos relacionados a cemitério/óbitos com filtro visual persistente e editor avançado de badges e conteúdo
// @author       Alexandre E. F.
// @match        *://*/*pg=doc/listar*
// @license      Alexandre E. F.
// @downloadURL https://update.greasyfork.org/scripts/562897/1Doc%20-%20Filtragem%20e%20Varredura%20de%20Protocolos.user.js
// @updateURL https://update.greasyfork.org/scripts/562897/1Doc%20-%20Filtragem%20e%20Varredura%20de%20Protocolos.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let protocolosCem = [];
    let paginaAtual = 1;
    let paginaInicial = 1;
    let totalPaginas = 1;
    let rodando = false;
    let pararVarredura = false;
    let textoPesquisa = '';
    let inicioTempo = 0;

    // 🔘 FILTRO VISUAL
    let filtroAtivo = false;
    let filtroTimer = null;

    // 🔑 CONFIGURAÇÕES (salvam no localStorage)
    let config = {
        badges: [
            { texto: 'CEM', ativo: true },
            { texto: 'ÓBITO', ativo: true },
            { texto: 'OBITO', ativo: true },
            { texto: 'ÓBITOS', ativo: true },
            { texto: 'OBITOS', ativo: true },
            { texto: 'EXEC - ÓBITOS', ativo: true },
            { texto: 'EXEC - OBITOS', ativo: true },
            { texto: 'CEMITÉRIO', ativo: true },
            { texto: 'CEMITERIO', ativo: true }
        ],
        conteudo: [
            { texto: 'cemitério', ativo: true },
            { texto: 'cemiterio', ativo: true },
            { texto: 'sepultamento', ativo: true },
            { texto: 'falecimento', ativo: true },
            { texto: 'óbito', ativo: true },
            { texto: 'obito', ativo: true }
        ],
        modoBusca: 'OU' // 'OU', 'E', 'badge', 'conteudo'
    };

    // Carregar configurações salvas
    function carregarConfig() {
        const saved = localStorage.getItem('varredura_cem_config');
        if (saved) {
            try {
                config = JSON.parse(saved);
            } catch (e) {
                console.error('Erro ao carregar config:', e);
            }
        }
    }

    function salvarConfig() {
        localStorage.setItem('varredura_cem_config', JSON.stringify(config));
    }

    carregarConfig();

    // Estatísticas
    let stats = {
        porBadge: 0,
        porConteudo: 0,
        porAmbos: 0
    };

    // ========== ESTILOS ==========
    const style = document.createElement('style');
    style.innerHTML = `
        /* BOTÕES FIXOS */
        .vf-btn {
            position: fixed;
            z-index: 99999;
            padding: 8px 14px;
            border-radius: 20px;
            border: none;
            color: white;
            cursor: pointer;
            font-weight: bold;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            font-size: 13px;
            transition: all 0.2s;
            line-height: 1.2;
        }
        .vf-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(0,0,0,0.4);
        }

        .vf-btn-varredura {
            bottom: 20px;
            right: 20px;
            background: #007AFF;
            min-width: 160px;
            max-width: 260px;
        }
        .vf-btn-varredura:hover { background: #0056cc; }

        .vf-btn-filtro {
            bottom: 20px;
            right: 190px;
            background: #d32f2f;
            min-width: 90px;
        }
        .vf-btn-filtro.ativo {
            background: #2e7d32;
        }
        .vf-btn-filtro:hover {
            background: #b71c1c;
        }
        .vf-btn-filtro.ativo:hover {
            background: #1b5e20;
        }

        .vf-btn-parametros {
            bottom: 65px;
            right: 20px;
            background: #455a64;
            min-width: 100px;
        }
        .vf-btn-parametros:hover { background: #263238; }

        /* OVERLAY */
        .vf-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.6);
            backdrop-filter: blur(5px);
            z-index: 100000;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        /* MODAL */
        .vf-modal {
            background: white;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.4);
            width: 90%;
            max-width: 600px;
            max-height: 85vh;
            overflow: hidden;
            animation: modalSlide 0.3s ease;
            display: flex;
            flex-direction: column;
            position: relative;
            z-index: 100001;
        }

        @keyframes modalSlide {
            from {
                opacity: 0;
                transform: translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .vf-modal-header {
            padding: 20px;
            border-bottom: 1px solid #eee;
            background: #f8f9fa;
        }

        .vf-modal-header h3 {
            margin: 0;
            font-size: 18px;
            color: #333;
            font-weight: 600;
        }

        .vf-modal-body {
            padding: 20px;
            overflow-y: auto;
            flex: 1;
        }

        .vf-modal-footer {
            padding: 16px 20px;
            border-top: 1px solid #eee;
            display: flex;
            gap: 10px;
            justify-content: space-between;
            align-items: center;
            background: #f8f9fa;
        }

        /* COPYRIGHT */
        .vf-copyright {
            font-size: 11px;
            color: #999;
            font-style: italic;
        }

        .vf-modal-buttons {
            display: flex;
            gap: 10px;
        }

        /* SEÇÕES DE FILTRO */
        .vf-section {
            margin-bottom: 24px;
        }

        .vf-section-title {
            font-size: 14px;
            font-weight: 600;
            color: #333;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .vf-items-list {
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            padding: 8px;
            background: #fafafa;
            max-height: 200px;
            overflow-y: auto;
        }

        .vf-item {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px;
            margin-bottom: 4px;
            background: white;
            border-radius: 6px;
            transition: all 0.2s;
        }

        .vf-item:hover {
            background: #f0f0f0;
        }

        .vf-item.disabled {
            opacity: 0.5;
        }

        .vf-item input[type="checkbox"] {
            cursor: pointer;
            width: 18px;
            height: 18px;
        }

        .vf-item input[type="text"] {
            flex: 1;
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 6px 8px;
            font-size: 13px;
            background: white;
        }

        .vf-item input[type="text"]:focus {
            outline: none;
            border-color: #007AFF;
        }

        .vf-item-remove {
            background: #e74c3c;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 4px 8px;
            cursor: pointer;
            font-size: 12px;
            font-weight: bold;
        }

        .vf-item-remove:hover {
            background: #c0392b;
        }

        .vf-add-btn {
            margin-top: 8px;
            padding: 8px 12px;
            background: #007AFF;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 600;
            width: 100%;
        }

        .vf-add-btn:hover {
            background: #0056cc;
        }

        /* MODO DE BUSCA */
        .vf-radio-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .vf-radio-item {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 12px;
            background: #f5f5f5;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s;
        }

        .vf-radio-item:hover {
            background: #e8e8e8;
        }

        .vf-radio-item input[type="radio"] {
            cursor: pointer;
            width: 16px;
            height: 16px;
        }

        .vf-radio-item label {
            cursor: pointer;
            font-size: 13px;
            flex: 1;
        }

        /* BOTÕES MODAL */
        .vf-modal-btn {
            padding: 10px 20px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            font-size: 14px;
            transition: all 0.2s;
        }

        .vf-modal-btn-primary {
            background: #007AFF;
            color: white;
        }
        .vf-modal-btn-primary:hover {
            background: #0056cc;
            transform: scale(1.05);
        }

        .vf-modal-btn-success {
            background: #2e7d32;
            color: white;
        }
        .vf-modal-btn-success:hover {
            background: #1b5e20;
            transform: scale(1.05);
        }

        .vf-modal-btn-secondary {
            background: #6c757d;
            color: white;
        }
        .vf-modal-btn-secondary:hover {
            background: #495057;
            transform: scale(1.05);
        }

        /* INFO MODAL FINALIZAÇÃO */
        .vf-info-box {
            background: #e3f2fd;
            padding: 16px;
            border-radius: 8px;
            margin-bottom: 20px;
            border-left: 4px solid #007AFF;
        }

        .vf-info-box p {
            margin: 8px 0;
            font-size: 16px;
            color: #1565c0;
            font-weight: 600;
        }

        .vf-stats {
            background: #f5f5f5;
            padding: 12px;
            border-radius: 6px;
            margin-top: 12px;
            font-size: 13px;
        }

        .vf-stats div {
            margin: 4px 0;
            color: #555;
        }

        .vf-success-icon {
            font-size: 48px;
            text-align: center;
            margin-bottom: 16px;
            color: #2e7d32;
        }

        @media (max-width: 768px) {
            .vf-modal {
                width: 95%;
                max-height: 90vh;
            }
            .vf-btn-filtro {
                bottom: 70px;
                right: 20px;
            }
            .vf-btn-parametros {
                bottom: 120px;
            }
        }
    `;
    document.head.appendChild(style);

    function verificarProtocolo(badges, assunto) {
        const badgesTexto = badges.map(b =>
            ((b.innerText || '') + ' ' + (b.getAttribute('data-original-title') || '')).toUpperCase()
        ).join(' ');

        const assuntoLower = (assunto || '').toLowerCase();

        const matchBadge = config.badges
            .filter(b => b.ativo)
            .some(b => badgesTexto.includes(b.texto.toUpperCase()));

        const matchConteudo = config.conteudo
            .filter(c => c.ativo)
            .some(c => assuntoLower.includes(c.texto.toLowerCase()));

        let resultado = false;

        switch (config.modoBusca) {
            case 'OU':
                resultado = matchBadge || matchConteudo;
                break;
            case 'E':
                resultado = matchBadge && matchConteudo;
                break;
            case 'badge':
                resultado = matchBadge;
                break;
            case 'conteudo':
                resultado = matchConteudo;
                break;
        }

        // Estatísticas
        if (resultado) {
            if (matchBadge && matchConteudo) {
                stats.porAmbos++;
            } else if (matchBadge) {
                stats.porBadge++;
            } else if (matchConteudo) {
                stats.porConteudo++;
            }
        }

        return resultado;
    }

    function capturarPesquisa() {
        for (const span of document.querySelectorAll('.span6')) {
            if (span.innerText.includes('Sua busca por')) {
                const strong = span.querySelector('strong');
                if (strong) return strong.innerText.trim();
            }
        }
        return '';
    }

    function obterPaginaAtualDom() {
        const small = document.querySelector('.pull-right small.muted');
        if (!small) return null;

        const match = small.innerText.match(/Página\s+(\d+)\/(\d+)/i);
        if (!match) return null;

        return parseInt(match[1], 10);
    }

    function capturarTotalPaginas() {
        const small = document.querySelector('.pull-right small.muted');
        if (!small) return 1;

        const match = small.innerText.match(/Página\s+(\d+)\/(\d+)/i);
        if (!match) return 1;

        paginaAtual = parseInt(match[1], 10) || 1;
        paginaInicial = paginaAtual;
        return parseInt(match[2], 10) || 1;
    }

    function extrairProtocolo(tr) {
        const numeroData =
            tr.querySelector('td.menor.normal a')?.innerText.trim() || '';

        const remetente =
            tr.querySelector('.td_remetente .media-body')
                ?.innerText.replace(/\n+/g, ' ').trim() || '';

        const destinatario = Array.from(tr.querySelectorAll('.badge'))
            .map(b => {
                const v = b.innerText.trim();
                const t = b.getAttribute('data-original-title') || '';
                return v + (t ? ` (${t})` : '');
            })
            .join(' | ');

        let assunto = '';
        const tds = Array.from(tr.querySelectorAll('td.link_emissao'));
        const tdAssunto = tds.find(td =>
            !td.querySelector('.td_remetente') &&
            !td.querySelector('.badge') &&
            td.innerText.includes('\n')
        );
        if (tdAssunto) assunto = tdAssunto.innerText.split('\n')[0].trim();

        let ultimaAtividade = '';
        const tdUlt = tr.querySelector('td.menor');
        if (tdUlt) {
            const small = tdUlt.querySelector('small');
            ultimaAtividade = small ? small.innerText.trim() : tdUlt.innerText.trim();
        }

        return {
            numeroData,
            remetente,
            destinatario,
            assunto,
            ultimaAtividade,
            pagina: paginaAtual
        };
    }

    function aplicarFiltroVisual() {
        if (!filtroAtivo) {
            document.querySelectorAll("tr[id^='linha_']").forEach(tr => {
                tr.style.display = '';
            });
            return;
        }

        document.querySelectorAll("tr[id^='linha_']").forEach(tr => {
            const badges = Array.from(tr.querySelectorAll('.badge'));

            let assunto = '';
            const tds = Array.from(tr.querySelectorAll('td.link_emissao'));
            const tdAssunto = tds.find(td =>
                !td.querySelector('.td_remetente') &&
                !td.querySelector('.badge') &&
                td.innerText.includes('\n')
            );
            if (tdAssunto) assunto = tdAssunto.innerText.split('\n')[0].trim();

            const match = verificarProtocolo(badges, assunto);
            tr.style.display = match ? '' : 'none';
        });
    }

    function iniciarObserver() {
        const observer = new MutationObserver(() => {
            if (!filtroAtivo) return;
            clearTimeout(filtroTimer);
            filtroTimer = setTimeout(aplicarFiltroVisual, 50);
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    function varrerPagina() {
        document.querySelectorAll("tr[id^='linha_']").forEach(tr => {
            const badges = Array.from(tr.querySelectorAll('.badge'));

            let assunto = '';
            const tds = Array.from(tr.querySelectorAll('td.link_emissao'));
            const tdAssunto = tds.find(td =>
                !td.querySelector('.td_remetente') &&
                !td.querySelector('.badge') &&
                td.innerText.includes('\n')
            );
            if (tdAssunto) assunto = tdAssunto.innerText.split('\n')[0].trim();

            if (verificarProtocolo(badges, assunto)) {
                protocolosCem.push(extrairProtocolo(tr));
            }
        });
    }

    function proximaPagina() {
        const btn = document.querySelector(
            'a.navega_caixa.btn_nav.btn.btn-primary i.icon-angle-right'
        );
        if (btn && btn.parentElement) {
            paginaAtual++;
            btn.parentElement.click();
            return true;
        }
        return false;
    }

    // ⚡ AGUARDAR PÁGINA CARREGAR COM OBSERVER - DETECTA MUDANÇA DE PÁGINA
    function aguardarPaginaCarregar(paginaEsperada) {
        return new Promise((resolve) => {
            const tempoInicio = Date.now();
            const timeout = setTimeout(() => {
                observer.disconnect();
                console.warn('⚠️ Timeout atingido - continuando...');
                resolve();
            }, 3000); // Timeout de segurança aumentado

            const observer = new MutationObserver(() => {
                const paginaDom = obterPaginaAtualDom();

                // Verifica se a página mudou E tem conteúdo
                if (paginaDom === paginaEsperada) {
                    const linhas = document.querySelectorAll("tr[id^='linha_']");
                    if (linhas.length > 0) {
                        const tempoDecorrido = Date.now() - tempoInicio;
                        clearTimeout(timeout);
                        observer.disconnect();
                        console.log(`✅ Página ${paginaEsperada} carregada em ${tempoDecorrido}ms`);
                        resolve();
                    }
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    function gerarCSV() {
        const cab = ['Numero/Data', 'De', 'Para', 'Assunto', 'Ultima Atividade', 'Pagina'];
        const linhas = protocolosCem.map(p =>
            [
                `"${p.numeroData}"`,
                `"${p.remetente}"`,
                `"${p.destinatario}"`,
                `"${p.assunto}"`,
                `"${p.ultimaAtividade}"`,
                p.pagina
            ].join(';')
        );

        return [
            `Pesquisa realizada: ${textoPesquisa || 'NÃO IDENTIFICADA'}`,
            `Modo de busca: ${config.modoBusca}`,
            `Por Badge: ${stats.porBadge} | Por Conteúdo: ${stats.porConteudo} | Por Ambos: ${stats.porAmbos}`,
            '',
            cab.join(';'),
            ...linhas
        ].join('\n');
    }

    function baixarCSV() {
        const blob = new Blob([gerarCSV()], { type: 'text/csv' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'protocolos_cemiterio.csv';
        a.click();
    }

    function copiarClipboard() {
        navigator.clipboard.writeText(gerarCSV())
            .then(() => alert('Protocolos copiados para a área de transferência!'));
    }

    function mostrarModalFinalizacao() {
        const overlay = document.createElement('div');
        overlay.className = 'vf-overlay';

        const modal = document.createElement('div');
        modal.className = 'vf-modal';

        modal.innerHTML = `
            <div class="vf-modal-header">
                <h3>Varredura Completa</h3>
            </div>
            <div class="vf-modal-body">
                <div class="vf-success-icon">✓</div>
                <div class="vf-info-box">
                    <p><strong>${protocolosCem.length}</strong> protocolos encontrados</p>
                    <p>Pesquisa: <strong>${textoPesquisa || 'Não identificada'}</strong></p>
                    <div class="vf-stats">
                        <div><strong>Estatísticas:</strong></div>
                        <div>Por Badge: ${stats.porBadge}</div>
                        <div>Por Conteúdo: ${stats.porConteudo}</div>
                        <div>Por Ambos: ${stats.porAmbos}</div>
                        <div>Modo: ${config.modoBusca}</div>
                    </div>
                </div>
            </div>
            <div class="vf-modal-footer">
                <span class="vf-copyright">By Alexandre E. F.</span>
                <div class="vf-modal-buttons">
                    <button class="vf-modal-btn vf-modal-btn-primary" id="vf-btn-baixar">
                        Baixar CSV
                    </button>
                    <button class="vf-modal-btn vf-modal-btn-success" id="vf-btn-copiar">
                        Copiar
                    </button>
                </div>
            </div>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        document.getElementById('vf-btn-baixar').onclick = () => {
            baixarCSV();
            document.body.removeChild(overlay);
        };

        document.getElementById('vf-btn-copiar').onclick = () => {
            copiarClipboard();
            document.body.removeChild(overlay);
        };

        overlay.onclick = (e) => {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
            }
        };
    }

    function renderizarItem(item, index, tipo) {
        const div = document.createElement('div');
        div.className = `vf-item ${!item.ativo ? 'disabled' : ''}`;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = item.ativo;
        checkbox.onchange = (e) => {
            item.ativo = e.target.checked;
            div.classList.toggle('disabled', !item.ativo);
        };

        const input = document.createElement('input');
        input.type = 'text';
        input.value = item.texto;
        input.onchange = (e) => {
            item.texto = e.target.value.trim();
        };

        const btnRemove = document.createElement('button');
        btnRemove.className = 'vf-item-remove';
        btnRemove.textContent = 'X';
        btnRemove.onclick = () => {
            config[tipo].splice(index, 1);
            abrirEditorBadges();
        };

        div.appendChild(checkbox);
        div.appendChild(input);
        div.appendChild(btnRemove);

        return div;
    }

    function abrirEditorBadges() {
        const overlay = document.createElement('div');
        overlay.className = 'vf-overlay';

        const modal = document.createElement('div');
        modal.className = 'vf-modal';

        const header = document.createElement('div');
        header.className = 'vf-modal-header';
        header.innerHTML = '<h3>Configurar Filtros</h3>';

        const body = document.createElement('div');
        body.className = 'vf-modal-body';

        // Seção Badges
        const secaoBadges = document.createElement('div');
        secaoBadges.className = 'vf-section';
        secaoBadges.innerHTML = '<div class="vf-section-title">🏷️ FILTRO POR BADGES</div>';

        const listaBadges = document.createElement('div');
        listaBadges.className = 'vf-items-list';
        config.badges.forEach((badge, index) => {
            listaBadges.appendChild(renderizarItem(badge, index, 'badges'));
        });

        const btnAddBadge = document.createElement('button');
        btnAddBadge.className = 'vf-add-btn';
        btnAddBadge.textContent = '+ Adicionar Badge';
        btnAddBadge.onclick = () => {
            config.badges.push({ texto: 'Nova Badge', ativo: true });
            abrirEditorBadges();
        };

        secaoBadges.appendChild(listaBadges);
        secaoBadges.appendChild(btnAddBadge);

        // Seção Conteúdo
        const secaoConteudo = document.createElement('div');
        secaoConteudo.className = 'vf-section';
        secaoConteudo.innerHTML = '<div class="vf-section-title">📄 FILTRO POR CONTEÚDO (Assunto)</div>';

        const listaConteudo = document.createElement('div');
        listaConteudo.className = 'vf-items-list';
        config.conteudo.forEach((termo, index) => {
            listaConteudo.appendChild(renderizarItem(termo, index, 'conteudo'));
        });

        const btnAddConteudo = document.createElement('button');
        btnAddConteudo.className = 'vf-add-btn';
        btnAddConteudo.textContent = '+ Adicionar Termo';
        btnAddConteudo.onclick = () => {
            config.conteudo.push({ texto: 'novo termo', ativo: true });
            abrirEditorBadges();
        };

        secaoConteudo.appendChild(listaConteudo);
        secaoConteudo.appendChild(btnAddConteudo);

        // Modo de Busca
        const secaoModo = document.createElement('div');
        secaoModo.className = 'vf-section';
        secaoModo.innerHTML = '<div class="vf-section-title">⚙️ MODO DE BUSCA</div>';

        const radioGroup = document.createElement('div');
        radioGroup.className = 'vf-radio-group';

        const modos = [
            { value: 'OU', label: 'Badge OU Conteúdo (recomendado)', desc: 'Encontra se tiver badge OU conteúdo' },
            { value: 'E', label: 'Badge E Conteúdo', desc: 'Encontra apenas se tiver badge E conteúdo' },
            { value: 'badge', label: 'Apenas Badge', desc: 'Busca somente nas badges' },
            { value: 'conteudo', label: 'Apenas Conteúdo', desc: 'Busca somente no assunto' }
        ];

        modos.forEach(modo => {
            const radioItem = document.createElement('div');
            radioItem.className = 'vf-radio-item';

            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'modoBusca';
            radio.value = modo.value;
            radio.checked = config.modoBusca === modo.value;
            radio.id = `modo_${modo.value}`;

            const label = document.createElement('label');
            label.htmlFor = `modo_${modo.value}`;
            label.innerHTML = `<strong>${modo.label}</strong><br><small style="color:#666">${modo.desc}</small>`;

            radioItem.onclick = () => {
                config.modoBusca = modo.value;
                radioGroup.querySelectorAll('input[type="radio"]').forEach(r => r.checked = false);
                radio.checked = true;
            };

            radioItem.appendChild(radio);
            radioItem.appendChild(label);
            radioGroup.appendChild(radioItem);
        });

        secaoModo.appendChild(radioGroup);

        body.appendChild(secaoBadges);
        body.appendChild(secaoConteudo);
        body.appendChild(secaoModo);

        // Footer
        const footer = document.createElement('div');
        footer.className = 'vf-modal-footer';

        const copyright = document.createElement('span');
        copyright.className = 'vf-copyright';
        copyright.textContent = 'By Alexandre E. F.';

        const buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'vf-modal-buttons';

        const btnCancelar = document.createElement('button');
        btnCancelar.className = 'vf-modal-btn vf-modal-btn-secondary';
        btnCancelar.textContent = 'Cancelar';
        btnCancelar.onclick = () => {
            document.body.removeChild(overlay);
            carregarConfig(); // Recarrega config original
        };

        const btnSalvar = document.createElement('button');
        btnSalvar.className = 'vf-modal-btn vf-modal-btn-primary';
        btnSalvar.textContent = 'Salvar';
        btnSalvar.onclick = () => {
            salvarConfig();
            aplicarFiltroVisual();
            document.body.removeChild(overlay);
        };

        buttonsDiv.appendChild(btnCancelar);
        buttonsDiv.appendChild(btnSalvar);

        footer.appendChild(copyright);
        footer.appendChild(buttonsDiv);

        modal.appendChild(header);
        modal.appendChild(body);
        modal.appendChild(footer);

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        overlay.onclick = (e) => {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
                carregarConfig();
            }
        };
    }

    function atualizarBotaoVarredura(btn) {
        const progresso = ((paginaAtual - paginaInicial) / (totalPaginas - paginaInicial + 1)) * 100;
        const porcentagem = Math.min(Math.round(progresso), 100);

        btn.style.background = `linear-gradient(to right, #4caf50 ${porcentagem}%, #757575 ${porcentagem}%)`;
        btn.innerHTML = `${porcentagem}% | ${protocolosCem.length} | Pág ${paginaAtual}/${totalPaginas}`;
    }

    async function iniciar(btn) {
        rodando = true;
        pararVarredura = false;
        protocolosCem = [];
        stats = { porBadge: 0, porConteudo: 0, porAmbos: 0 };
        textoPesquisa = capturarPesquisa();
        totalPaginas = capturarTotalPaginas();

        btn.style.background = '#757575';
        btn.innerText = 'Varrendo...';

        while (paginaAtual <= totalPaginas && !pararVarredura) {
            console.log(`📄 Varrendo página ${paginaAtual}/${totalPaginas}`);
            varrerPagina();
            atualizarBotaoVarredura(btn);

            if (paginaAtual < totalPaginas) {
                if (!proximaPagina()) break;

                // ⚡ AGUARDA COM OBSERVER detectando mudança de página
                await aguardarPaginaCarregar(paginaAtual);
            } else {
                break;
            }
        }

        rodando = false;
        btn.style.background = '#007AFF';
        btn.innerText = 'Iniciar varredura CEM';

        console.log(`✅ Varredura finalizada! Total: ${protocolosCem.length} protocolos`);
        mostrarModalFinalizacao();
    }

    function criarBotoes() {
        const btnParametros = document.createElement('button');
        btnParametros.className = 'vf-btn vf-btn-parametros';
        btnParametros.innerText = 'Parâmetros';
        btnParametros.onclick = abrirEditorBadges;

        const btnFiltro = document.createElement('button');
        btnFiltro.className = 'vf-btn vf-btn-filtro';
        btnFiltro.innerText = 'Filtro OFF';
        btnFiltro.onclick = () => {
            filtroAtivo = !filtroAtivo;
            btnFiltro.innerText = filtroAtivo ? 'Filtro ON' : 'Filtro OFF';
            btnFiltro.classList.toggle('ativo', filtroAtivo);
            aplicarFiltroVisual();
        };

        const btnVarredura = document.createElement('button');
        btnVarredura.className = 'vf-btn vf-btn-varredura';
        btnVarredura.innerText = 'Iniciar varredura CEM';
        btnVarredura.onclick = () => {
            if (!rodando) {
                iniciar(btnVarredura);
            } else {
                if (confirm('Tem certeza que deseja interromper a varredura?')) {
                    pararVarredura = true;
                }
            }
        };

        document.body.appendChild(btnParametros);
        document.body.appendChild(btnFiltro);
        document.body.appendChild(btnVarredura);

        iniciarObserver();
    }

    criarBotoes();
})();