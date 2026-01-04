// ==UserScript==
// @name         Formulário Flutuante CENEGEDPA (v2)
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Adiciona formulário flutuante para combinar dados quando estiver na página de Cadastro de Pessoa - Preenchimento automático
// @author       Adriel Alves
// @match        https://cenegedpa.gpm.srv.br/ci/Cadastro/pessoa/alter/*
// @match        https://cenegedpa.gpm.srv.br/ci/Cadastro/Pessoa/alter/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/549137/Formul%C3%A1rio%20Flutuante%20CENEGEDPA%20%28v2%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549137/Formul%C3%A1rio%20Flutuante%20CENEGEDPA%20%28v2%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Estilos CSS para o formulário flutuante
    const styles = `
        #formulario-flutuante {
            position: fixed;
            top: 150px;
            right: 20px;
            width: 300px;
            background-color: #f9f9f9;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            z-index: 9999;
            display: none;
            overflow: hidden;
        }
        #formulario-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: #f1f1f1;
            padding: 10px 15px;
            border-bottom: 1px solid #ddd;
            cursor: move;
        }
        #formulario-header h3 {
            margin: 0;
            color: #333;
        }
        #toggle-btn {
            background: none;
            border: none;
            font-size: 18px;
            cursor: pointer;
            padding: 0 5px;
        }
        #formulario-conteudo {
            padding: 15px;
        }
        #formulario-flutuante.minimizado #formulario-conteudo {
            display: none;
        }
        #formulario-flutuante label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        #formulario-flutuante input {
            width: 100%;
            padding: 8px;
            margin-bottom: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        #formulario-flutuante input.campo-vazio {
            border: 2px solid #ff0000;
            background-color: #ffeeee;
        }
        #formulario-flutuante input.campo-preenchido {
            border: 2px solid #4CAF50;
            background-color: #f0fff0;
        }
        #formulario-flutuante button {
            background-color: #4CAF50;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 4px;
            cursor: pointer;
            margin-right: 5px;
            margin-bottom: 5px;
        }
        #formulario-flutuante button:hover {
            background-color: #45a049;
        }
        #limpar-btn {
            background-color: #b81226 !important;
        }
        #limpar-btn:hover {
            background-color: #d32f2f;
        }
        #resultado {
            margin-top: 10px;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            background-color: #f5f5f5;
            min-height: 50px;
            word-break: break-all;
            font-family: monospace;
            font-size: 12px;
        }
        .mensagem-erro {
            color: #ff0000;
            font-size: 12px;
            margin-top: -5px;
            margin-bottom: 10px;
            display: none;
        }
        .contador-campos {
            font-size: 12px;
            color: #666;
            margin-bottom: 10px;
            text-align: center;
        }
    `;

    // Criar elemento de estilo e adicionar ao head
    const styleEl = document.createElement('style');
    styleEl.innerHTML = styles;
    document.head.appendChild(styleEl);

    // Criar o formulário flutuante
    const formulario = document.createElement('div');
    formulario.id = 'formulario-flutuante';
    formulario.innerHTML = `
        <div id="formulario-header">
            <h3>Dados para Combinação</h3>
            <button id="toggle-btn" title="Minimizar/Maximizar">−</button>
        </div>
        <div id="formulario-conteudo">
            <div id="contador-campos" class="contador-campos">0/5 campos preenchidos</div>

            <label for="dataNascimento">Data Nascimento:</label>
            <input type="text" id="dataNascimento" placeholder="DD/MM/AAAA" required>
            <div id="erro-dataNascimento" class="mensagem-erro">Campo obrigatório</div>

            <label for="dataEmissao">Data Emissão:</label>
            <input type="text" id="dataEmissao" placeholder="DD/MM/AAAA" required>
            <div id="erro-dataEmissao" class="mensagem-erro">Campo obrigatório</div>

            <label for="orgao">Órgão:</label>
            <input type="text" id="orgao" required>
            <div id="erro-orgao" class="mensagem-erro">Campo obrigatório</div>

            <label for="naturalidade">Naturalidade:</label>
            <input type="text" id="naturalidade" required>
            <div id="erro-naturalidade" class="mensagem-erro">Campo obrigatório</div>

            <label for="filiacao">Filiação:</label>
            <input type="text" id="filiacao" required>
            <div id="erro-filiacao" class="mensagem-erro">Campo obrigatório</div>

            <button id="copiar-btn">Copiar</button>
            <button id="limpar-btn">Limpar</button>

            <div id="resultado">Preencha os campos acima para ver o resultado...</div>
        </div>
    `;

    function normalizeText(text) {
        // Mapeamentos específicos para caracteres que não são bem transliterados por padrão
        const specificMappings = {
            // Grego - letras básicas que devem mapear diretamente para latino
            'Α': 'A', 'α': 'a',
            'Β': 'B', 'β': 'b',
            'Ε': 'E', 'ε': 'e',
            'Ζ': 'Z', 'ζ': 'z',
            'Η': 'I', 'η': 'i',
            'Ι': 'I', 'ι': 'i',
            'Κ': 'K', 'κ': 'k',
            'Μ': 'M', 'μ': 'm',
            'Ν': 'N', 'ν': 'n',
            'Ο': 'O', 'ο': 'o',
            'Ρ': 'R', 'ρ': 'r',
            'Τ': 'T', 'τ': 't',
            'Υ': 'Y', 'υ': 'y',
            'Χ': 'Ch', 'χ': 'ch',

            // Grego - caracteres especiais
            'Θ': 'Th', 'θ': 'th',
            'Φ': 'Ph', 'φ': 'ph',
            'Ψ': 'Ps', 'ψ': 'ps',
            'Ω': 'O', 'ω': 'o',
            'Ξ': 'Ks', 'ξ': 'ks',
            'Γ': 'G', 'γ': 'g',
            'Δ': 'D', 'δ': 'd',
            'Λ': 'L', 'λ': 'l',
            'Π': 'P', 'π': 'p',
            'Σ': 'S', 'σ': 's', 'ς': 's',

            // Cirílico
            'А': 'A', 'а': 'a',
            'Б': 'B', 'б': 'b',
            'В': 'V', 'в': 'v',
            'Г': 'G', 'г': 'g',
            'Д': 'D', 'д': 'd',
            'Е': 'E', 'е': 'e',
            'Ж': 'Zh', 'ж': 'zh',
            'З': 'Z', 'з': 'z',
            'И': 'I', 'и': 'i',
            'Й': 'Y', 'й': 'y',
            'К': 'K', 'к': 'k',
            'Л': 'L', 'л': 'l',
            'М': 'M', 'м': 'm',
            'Н': 'N', 'н': 'n',
            'О': 'O', 'о': 'o',
            'П': 'P', 'п': 'p',
            'Р': 'R', 'р': 'r',
            'С': 'S', 'с': 's',
            'Т': 'T', 'т': 't',
            'У': 'U', 'у': 'u',
            'Ф': 'F', 'ф': 'f',
            'Х': 'Kh', 'х': 'kh',
            'Ц': 'Ts', 'ц': 'ts',
            'Ч': 'Ch', 'ч': 'ch',
            'Ш': 'Sh', 'ш': 'sh',
            'Щ': 'Shch', 'щ': 'shch',
            'Ъ': '', 'ъ': '',
            'Ы': 'Y', 'ы': 'y',
            'Ь': '', 'ь': '',
            'Э': 'E', 'э': 'e',
            'Ю': 'Yu', 'ю': 'yu',
            'Я': 'Ya', 'я': 'ya',
        };

        // Primeiro aplicar mapeamentos específicos
        for (const [original, replacement] of Object.entries(specificMappings)) {
            text = text.replaceAll(original, replacement);
        }

        // Normalizar para forma compatível (NFD) - decomposição
        text = text.normalize('NFD');

        // Remover todos os caracteres não ASCII
        text = text.replace(/[^\x00-\x7F]+/g, '');

        return text;
    }

    // Adicionar o formulário ao corpo da página
    document.body.appendChild(formulario);

    // Função para verificar se estamos na página de Cadastro de Pessoa
    function verificarPaginaCadastroPessoa() {
        // Verificar a URL atual
        const urlAtual = window.location.href;
        const urlCadastroPessoa = 'https://cenegedpa.gpm.srv.br/ci/Cadastro/Pessoa';

        // Verificar se a URL atual começa com a URL de cadastro de pessoa
        if (urlAtual.startsWith(urlCadastroPessoa) || true) {
            document.getElementById('formulario-flutuante').style.display = 'block';
        } else {
            document.getElementById('formulario-flutuante').style.display = 'none';
        }
    }

    // Função para remover acentos e converter para maiúsculas (apenas para órgão, naturalidade e filiação)
    function normalizarTexto(texto) {
        texto = normalizeText(texto);
        // Remover acentos
        const semAcentos = texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        // Converter para maiúsculas
        return semAcentos.toUpperCase();
    }

    // Função para combinar os dados automaticamente
    function combinarDadosAutomatico() {
        const dataNascimento = document.getElementById('dataNascimento').value.trim();
        const dataEmissao = document.getElementById('dataEmissao').value.trim();
        const orgao = document.getElementById('orgao').value.trim();
        const naturalidade = document.getElementById('naturalidade').value.trim();
        const filiacao = document.getElementById('filiacao').value.trim();

        // Contar campos preenchidos
        const camposPreenchidos = [dataNascimento, dataEmissao, orgao, naturalidade, filiacao].filter(campo => campo !== '').length;
        document.getElementById('contador-campos').textContent = `${camposPreenchidos}/5 campos preenchidos`;

        // Se algum campo estiver vazio, mostrar estado parcial
        if (camposPreenchidos === 0) {
            document.getElementById('resultado').textContent = 'Preencha os campos acima para ver o resultado...';
            return;
        }

        // Normalizar apenas os campos de texto (não as datas)
        const orgaoNormalizado = orgao ? normalizarTexto(orgao) : '';
        const naturalidadeNormalizada = naturalidade ? normalizarTexto(naturalidade) : '';
        const filiacaoNormalizada = filiacao ? normalizarTexto(filiacao) : '';

        // Criar string com campos preenchidos (usar placeholder para campos vazios)
        const dadosCombinados = `${dataNascimento || '[Data Nasc.]'};${dataEmissao || '[Data Emis.]'};${orgaoNormalizado || '[Órgão]'};${naturalidadeNormalizada || '[Naturalidade]'};${filiacaoNormalizada || '[Filiação]'}`;

        document.getElementById('resultado').textContent = dadosCombinados;

        // Só preencher o campo de destino se todos os campos estiverem completos
        if (camposPreenchidos === 5) {
            const dadosCompletos = `${dataNascimento};${dataEmissao};${orgaoNormalizado};${naturalidadeNormalizada};${filiacaoNormalizada}`;
            const campoDestino = document.getElementById('cod_email_pfj');
            if (campoDestino) {
                campoDestino.value = dadosCompletos;
            }
        }
    }

    // Função para atualizar visual do campo
    function atualizarVisualCampo(elemento) {
        const valor = elemento.value.trim();

        // Remover todas as classes de estado
        elemento.classList.remove('campo-vazio', 'campo-preenchido');

        // Adicionar classe apropriada
        if (valor) {
            elemento.classList.add('campo-preenchido');
        }
    }

    // Função para copiar os dados combinados
    function copiarDados() {
        const resultado = document.getElementById('resultado').textContent;
        if (resultado && !resultado.includes('[') && !resultado.includes('Preencha os campos')) {
            navigator.clipboard.writeText(resultado).then(() => {
                alert('Dados copiados para a área de transferência!');
            }).catch(err => {
                console.error('Erro ao copiar: ', err);

                // Fallback para navegadores que não suportam clipboard API
                const tempTextArea = document.createElement('textarea');
                tempTextArea.value = resultado;
                document.body.appendChild(tempTextArea);
                tempTextArea.select();
                document.execCommand('copy');
                document.body.removeChild(tempTextArea);
                alert('Dados copiados para a área de transferência!');
            });
        } else {
            alert('Preencha todos os campos antes de copiar!');
        }
    }

    // Função para limpar todos os campos
    function limparCampos() {
        const campos = ['dataNascimento', 'dataEmissao', 'orgao', 'naturalidade', 'filiacao'];

        campos.forEach(campo => {
            const elemento = document.getElementById(campo);
            elemento.value = '';
            elemento.classList.remove('campo-vazio', 'campo-preenchido');
            document.getElementById(`erro-${campo}`).style.display = 'none';
        });

        document.getElementById('resultado').textContent = 'Preencha os campos acima para ver o resultado...';
        document.getElementById('contador-campos').textContent = '0/5 campos preenchidos';

        // Limpar campo de destino
        const campoDestino = document.getElementById('cod_email_pfj');
        if (campoDestino) {
            campoDestino.value = '';
        }
    }

    // Função para alternar entre minimizado e maximizado
    function toggleMinimizado() {
        const form = document.getElementById('formulario-flutuante');
        const toggleBtn = document.getElementById('toggle-btn');

        form.classList.toggle('minimizado');

        if (form.classList.contains('minimizado')) {
            toggleBtn.textContent = '+';
            toggleBtn.title = 'Maximizar';
        } else {
            toggleBtn.textContent = '−';
            toggleBtn.title = 'Minimizar';
        }
    }

    // Função para tornar o formulário arrastável
    function tornarArrastavel(elemento) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const header = document.getElementById('formulario-header');

        if (header) {
            header.onmousedown = iniciarArrasto;
        } else {
            elemento.onmousedown = iniciarArrasto;
        }

        function iniciarArrasto(e) {
            e = e || window.event;
            e.preventDefault();
            // Posição do mouse no início
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = pararArrasto;
            document.onmousemove = elementoArrastando;
        }

        function elementoArrastando(e) {
            e = e || window.event;
            e.preventDefault();
            // Calcular nova posição
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // Definir nova posição do elemento
            elemento.style.top = (elemento.offsetTop - pos2) + "px";
            elemento.style.left = (elemento.offsetLeft - pos1) + "px";
            elemento.style.right = "auto";
        }

        function pararArrasto() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    // Configurar eventos de input para preenchimento automático
    function configurarEventosInput() {
        const campos = ['dataNascimento', 'dataEmissao', 'orgao', 'naturalidade', 'filiacao'];

        campos.forEach(campo => {
            const elemento = document.getElementById(campo);

            // Evento para atualização em tempo real
            elemento.addEventListener('input', function() {
                // Atualizar visual do campo
                atualizarVisualCampo(this);

                // Combinar dados automaticamente
                combinarDadosAutomatico();
            });

            // Evento para quando o campo perde o foco (para normalização final dos campos de texto)
            elemento.addEventListener('blur', function() {
                if (['orgao', 'naturalidade', 'filiacao'].includes(campo) && this.value.trim()) {
                    this.value = normalizarTexto(this.value.trim());
                    combinarDadosAutomatico();
                }
            });
        });
    }

    // Adicionar eventos aos botões
    document.getElementById('copiar-btn').addEventListener('click', copiarDados);
    document.getElementById('limpar-btn').addEventListener('click', limparCampos);
    document.getElementById('toggle-btn').addEventListener('click', toggleMinimizado);

    // Tornar o formulário arrastável
    tornarArrastavel(document.getElementById('formulario-flutuante'));

    // Configurar eventos de input para todos os campos
    configurarEventosInput();

    // Monitorar mudanças na URL
    let urlAnterior = '';

    function verificarMudancaURL() {
        const urlAtual = window.location.href;
        if (urlAtual !== urlAnterior) {
            urlAnterior = urlAtual;
            verificarPaginaCadastroPessoa();
        }
    }

    // Verificar a URL a cada 1 segundo
    setInterval(verificarMudancaURL, 1000);

    // Verificar imediatamente após o carregamento
    verificarPaginaCadastroPessoa();
})();