// ==UserScript==
// @name         Auto Cadastro
// @version      1.0
// @namespace    https://github.com/0H4S
// @description  Preenche automaticamente o formulário de cadastro de atos (Portarias, Decretos e Leis) no sistema Oxy, com suporte para anexar arquivos e histórico de registros.
// @author       OHAS
// @homepageURL  https://github.com/0H4S
// @icon         https://cdn-icons-png.flaticon.com/512/11561/11561589.png
// @match        https://piraidosul.oxy.elotech.com.br/unico/*/leis-atos/new
// @match        https://piraidosul.oxy.elotech.com.br/unico/*/leis-atos
// @match        https://piraidosul.oxy.elotech.com.br/unico/*/leis-atos?filter=*
// @license      Copyright (c) OHAS - Todos os direitos reservados.
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/548832/Auto%20Cadastro.user.js
// @updateURL https://update.greasyfork.org/scripts/548832/Auto%20Cadastro.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const planoDeContingenciaDocumento = {
        '1 - 1 - Plano Plurianual': {
            'Lei': '1 - 1 - Lei ordinária',
            'Lei complementar': '1 - 1 - Lei ordinária',
            'Portaria': '1 - 1 - Lei ordinária',
            'Decreto': '3 - 3 - Decreto'
        },
        '2 - 2 - Lei de Diretrizes Orçamentárias - LDO': {
            'Lei': '1 - 1 - Lei ordinária',
            'Lei complementar': '1 - 1 - Lei ordinária',
            'Portaria': '1 - 1 - Lei ordinária',
            'Decreto': '3 - 3 - Decreto'
        },
        '3 - 3 - Lei Orçamentária Anual - LOA': {
            '_default': '1 - 1 - Lei ordinária'
        },
        '4 - 4 - Plano Municipal de Saúde': {
            'Lei': '1 - 1 - Lei ordinária',
            'Lei complementar': '1 - 1 - Lei ordinária',
            'Portaria': '1 - 1 - Lei ordinária',
            'Decreto': '3 - 3 - Decreto'
        },
        '5 - 5 - Plano de Ação dos Direitos da Criança e do Adolescente': {
            'Lei': '1 - 1 - Lei ordinária',
            'Lei complementar': '1 - 1 - Lei ordinária',
            'Portaria': '1 - 1 - Lei ordinária',
            'Decreto': '3 - 3 - Decreto'
        },
        '6 - 6 - Fundo Especial - Poder Legislativo': {
            '_default': '1 - 1 - Lei ordinária'
        },
        '7 - 7 - Instrumento de Programação Financeira': {
            'Lei': '3 - 3 - Decreto',
            'Lei complementar': '3 - 3 - Decreto',
            'Decreto': '3 - 3 - Decreto',
            'Portaria': '6 - 6 - Portaria'
        },
        '8 - 8 - Plano de Aplicação': {
            'Lei': '1 - 1 - Lei ordinária',
            'Lei complementar': '1 - 1 - Lei ordinária',
            'Portaria': '1 - 1 - Lei ordinária',
            'Decreto': '3 - 3 - Decreto'
        },
        '9 - 9 - Plano PLACIC': {
            '_default': '4 - 4 - Ato de consórcio'
        },
        '10 - 10 - Plano Diretor': {
            'Lei': '1 - 1 - Lei ordinária',
            'Decreto': '1 - 1 - Lei ordinária',
            'Portaria': '1 - 1 - Lei ordinária',
            'Lei complementar': '2 - 2 - Lei complementar'
        },
        '11 - 11 - Comissão Permanente de Licitações': {
            'Lei': '3 - 3 - Decreto',
            'Lei complementar': '3 - 3 - Decreto',
            'Decreto': '3 - 3 - Decreto',
            'Portaria': '6 - 6 - Portaria'
        },
        '12 - 12 - Comissão Especial de Licitações': {
            'Lei': '3 - 3 - Decreto',
            'Lei complementar': '3 - 3 - Decreto',
            'Decreto': '3 - 3 - Decreto',
            'Portaria': '6 - 6 - Portaria'
        },
        '13 - 13 - Designação de Leiloeiro': {
            'Lei': '3 - 3 - Decreto',
            'Lei complementar': '3 - 3 - Decreto',
            'Decreto': '3 - 3 - Decreto',
            'Portaria': '6 - 6 - Portaria'
        },
        '14 - 14 - Designação de Pregoeiro': {
            'Lei': '3 - 3 - Decreto',
            'Lei complementar': '3 - 3 - Decreto',
            'Decreto': '3 - 3 - Decreto',
            'Portaria': '6 - 6 - Portaria'
        },
        '15 - 15 - Servidor Designado': {
            'Lei': '3 - 3 - Decreto',
            'Lei complementar': '3 - 3 - Decreto',
            'Decreto': '3 - 3 - Decreto',
            'Portaria': '6 - 6 - Portaria'
        },
        '16 - 16 - Comissão de Recebimento de Bens': {
            'Lei': '3 - 3 - Decreto',
            'Lei complementar': '3 - 3 - Decreto',
            'Decreto': '3 - 3 - Decreto',
            'Portaria': '6 - 6 - Portaria'
        },
        '17 - 17 - Órgão Oficial': {
            'Lei': '1 - 1 - Lei ordinária',
            'Portaria': '1 - 1 - Lei ordinária',
            'Decreto': '1 - 1 - Lei ordinária',
            'Lei complementar': '2 - 2 - Lei complementar'
        },
        '18 - 18 - Comissão de Levantamento/Avaliação de Bens Patrimoniais': {
            'Lei': '3 - 3 - Decreto',
            'Lei complementar': '3 - 3 - Decreto',
            'Decreto': '3 - 3 - Decreto',
            'Portaria': '6 - 6 - Portaria'
        },
        '19 - 19 - Diárias': {
            'Lei': '1 - 1 - Lei ordinária',
            'Lei complementar': '2 - 2 - Lei complementar',
            'Decreto': '3 - 3 - Decreto',
            'Portaria': '6 - 6 - Portaria'
        },
        '20 - 20 - Contrato de Rateio dos Consórcios Públicos': {
            '_default': '101 - 101 - Contrato'
        },
        '21 - 21 - Créditos Adicionais': {
            'Lei': '1 - 1 - Lei ordinária',
            'Lei complementar': '1 - 1 - Lei ordinária',
            'Portaria': '1 - 1 - Lei ordinária',
            'Decreto': '3 - 3 - Decreto'
        },
        '22 - 22 - Tributos Municipais': {
            'Lei': '1 - 1 - Lei ordinária',
            'Portaria': '1 - 1 - Lei ordinária',
            'Lei complementar': '2 - 2 - Lei complementar',
            'Decreto': '3 - 3 - Decreto'
        },
        '26 - 26 - Edital - Contribuição de Melhoria': {
            '_default': '52 - 52 - Edital'
        },
        '27 - 27 - Edital de Licitação - Convite': {
            '_default': '52 - 52 - Edital'
        },
        '28 - 28 - Edital de Licitação - Tomada de Preços': {
            '_default': '52 - 52 - Edital'
        },
        '29 - 29 - Edital de Licitação - Concorrência': {
            '_default': '52 - 52 - Edital'
        },
        '30 - 30 - Edital de Licitação - Concurso': {
            '_default': '52 - 52 - Edital'
        },
        '31 - 31 - Edital de Licitação - Leilão': {
            '_default': '52 - 52 - Edital'
        },
        '32 - 32 - Edital de Licitação - Pregão': {
            '_default': '52 - 52 - Edital'
        },
        '33 - 33 - Edital de Licitação - Dispensa': {
            '_default': '52 - 52 - Edital'
        },
        '34 - 34 - Edital de Licitação - Inexigibilidade': {
            '_default': '52 - 52 - Edital'
        },
        '35 - 35 - Contratos Administrativos': {
            '_default': '101 - 101 - Contrato'
        },
        '36 - 36 - Projeto de Obras Públicas': {
            '_default': '100 - 100 - Projeto'
        },
        '37 - 37 - Atas das Comissões de Licitações': {
            '_default': '53 - 53 - Ata'
        },
        '38 - 38 - Orçamentos de Obras Públicas': {
            '_default': '104 - 104 - Orçamento base (execução direta) ou do edital (execução indireta)'
        },
        '39 - 39 - Termo de Medição de Obras Públicas': {
            '_default': '109 - 109 - Medição'
        },
        '40 - 40 - Termo de Recebimento de Obras Públicas': {
            '_default': '108 - 108 - Termo(s) de Recebimento Definitivo'
        },
        '41 - 41 - Impacto Orçamentário e Financeiro': {
            'Decreto': '3 - 3 - Decreto',
            'Lei': '3 - 3 - Decreto',
            'Lei complementar': '3 - 3 - Decreto',
            'Portaria': '6 - 6 - Portaria'
        },
        '42 - 42 - Desapropriação de Bens': {
            '_default': '3 - 3 - Decreto'
        },
        '43 - 43 - Alienação de Bens': {
            '_default': '1 - 1 - Lei ordinária'
        },
        '44 - 44 - Ratificação/Baixa de Consórcios Intermunicipais': {
            'Lei': '1 - 1 - Lei ordinária',
            'Lei complementar': '1 - 1 - Lei ordinária',
            'Portaria': '999 - 999 - Outros Tipos de Documentos',
            'Decreto': '999 - 999 - Outros Tipos de Documentos'
        },
        '45 - 45 - Ata da Assembléia Geral Ordinária': {
            '_default': '53 - 53 - Ata'
        },
        '46 - 46 - Ata da Assembléia Geral Extraordinária': {
            '_default': '53 - 53 - Ata'
        },
        '47 - 47 - Ata do Conselho de Administração': {
            '_default': '53 - 53 - Ata'
        },
        '48 - 48 - Ata do Conselho Fiscal': {
            '_default': '53 - 53 - Ata'
        },
        '51 - 51 - Baixa de Consórcios Intermunicipais': {
            '_default': '1 - 1 - Lei ordinária'
        },
        '52 - 52 - Parecer do Conselho do FUNDEB': {
            '_default': '50 - 50 - Parecer'
        },
        '53 - 53 - Parecer do Conselho Municipal de Saúde': {
            '_default': '50 - 50 - Parecer'
        },
        '54 - 54 - Parecer/Relatório do Controle Interno': {
            '_default': '50 - 50 - Parecer'
        },
        '55 - 55 - Orçamento Anual de Consórcios Públicos': {
            '_default': '4 - 4 - Ato de consórcio'
        },
        '56 - 56 - Entradas/Saídas de Bens e Materiais por Doação': {
            '_default': '300 - 300 - Termo de Recebimento'
        },
        '57 - 57 - Descarte de Número de Licitação': {
            '_default': '3 - 3 - Decreto'
        },
        '58 - 58 - Entradas/Saídas de Bens e Materiais através de Convênio': {
            '_default': '300 - 300 - Termo de Recebimento'
        },
        '59 - 59 - Ato de Fixação/Refixação dos Subsídios dos Agentes Políticos': {
            '_default': '1 - 1 - Lei ordinária'
        },
        '60 - 60 - Ato de Recomposição/Atualização dos Subsídios dos Agentes Políticos': {
            '_default': '1 - 1 - Lei ordinária'
        },
        '61 - 61 - Ato de Revisão Geral Anual/Recomposição/Atualização ou Reajuste da Remuneração dos Servidores.': {
            '_default': '1 - 1 - Lei ordinária'
        },
        '62 - 62 - Nomeação/Designação ou Baixa dos Secretários Municipais': {
            'Decreto': '3 - 3 - Decreto',
            'Lei': '3 - 3 - Decreto',
            'Lei complementar': '3 - 3 - Decreto',
            'Portaria': '6 - 6 - Portaria'
        },
        '63 - 63 - Estorno/Cancelamento de Passivo': {
            'Decreto': '3 - 3 - Decreto',
            'Lei': '3 - 3 - Decreto',
            'Lei complementar': '3 - 3 - Decreto',
            'Portaria': '6 - 6 - Portaria'
        },
        '64 - 64 - Empréstimos/Financiamentos e Parcelamentos': {
            '_default': '1 - 1 - Lei ordinária'
        },
        '65 - 65 - Termo de Paralisação de Obras Públicas': {
            '_default': '107 - 107 - Termo de Paralisação'
        },
        '66 - 66 - Documentos com Justificativa para Cancelamento ou Cadastro Indevido de Intervenção': {
            '_default': '110 - 110 - Justificativa para Cancelamento ou Cadastro Indevido de Intervenção'
        },
        '67 - 67 - Código Tributário Nacional': {
            'Lei': '1 - 1 - Lei ordinária',
            'Decreto': '1 - 1 - Lei ordinária',
            'Portaria': '1 - 1 - Lei ordinária',
            'Lei complementar': '2 - 2 - Lei complementar'
        },
        '68 - 68 - Código Tributário Estadual': {
            'Lei': '1 - 1 - Lei ordinária',
            'Decreto': '1 - 1 - Lei ordinária',
            'Portaria': '1 - 1 - Lei ordinária',
            'Lei complementar': '2 - 2 - Lei complementar'
        },
        '69 - 69 - Código Tributário Municipal': {
            'Lei': '1 - 1 - Lei ordinária',
            'Decreto': '1 - 1 - Lei ordinária',
            'Portaria': '1 - 1 - Lei ordinária',
            'Lei complementar': '2 - 2 - Lei complementar'
        },
        '70 - 70 - Nomeação do Quadro Deliberativo e Executivo de Estatais': {
            'Decreto': '3 - 3 - Decreto',
            'Lei': '3 - 3 - Decreto',
            'Lei complementar': '3 - 3 - Decreto',
            'Portaria': '6 - 6 - Portaria'
        },
        '71 - 71 - Termo de Cumprimento dos Objetivos - PETE': {
            '_default': '123 - 123 - Termo de Cumprimento dos Objetivos - PETE'
        },
        '72 - 72 - Plano Municipal de Educação': {
            '_default': '1 - 1 - Lei ordinária'
        },
        '73 - Edital de Licitação – Lei Ordinária nº 13.303/2016': {
            '_default': '52 - 52 - Edital'
        },
        '74 - Agente de Contratação': {
            'Lei': '3 - 3 - Decreto', 'Lei complementar': '3 - 3 - Decreto', 'Decreto': '3 - 3 - Decreto',
            'Portaria': '6 - 6 - Portaria'
        },
        '75 - Contratos de Consórcios': {
            '_default': '125 - Contrato de Rateio'
        },
        '9999 - 9999 - Outros Escopos': {
            '_default': '999 - 999 - Outros Tipos de Documentos'
        }
    };
        const dbManager = (function() {
            const DB_NAME = 'AutoCadastroDatabase';
            const DB_VERSION = 1;
            let db = null;
            function initDB() {
                return new Promise((resolve, reject) => {
                    if (db) return resolve(db);
                    const request = indexedDB.open(DB_NAME, DB_VERSION);
                    request.onupgradeneeded = function(event) {
                        const db = event.target.result;
                        if (!db.objectStoreNames.contains('diarioOficial')) db.createObjectStore('diarioOficial', { keyPath: 'numero' });
                        if (!db.objectStoreNames.contains('assinados')) db.createObjectStore('assinados', { keyPath: 'numero' });
                        if (!db.objectStoreNames.contains('historico')) {
                            const historicoStore = db.createObjectStore('historico', { keyPath: 'id', autoIncrement: true });
                            historicoStore.createIndex('tipoNumeroAno', ['tipo', 'numero', 'ano'], { unique: true });
                            historicoStore.createIndex('dataHora', 'dataHora', { unique: false });
                        }
                        if (!db.objectStoreNames.contains('jsons')) {
                            const jsonsStore = db.createObjectStore('jsons', { keyPath: 'id', autoIncrement: true });
                            jsonsStore.createIndex('nome', 'nome', { unique: false });
                        }
                    };
                    request.onsuccess = (event) => { db = event.target.result; resolve(db); };
                    request.onerror = (event) => reject(event.target.error);
                });
            }
            async function addFile(tipo, file, numero, fileData) {
                await initDB();
                const transaction = db.transaction([tipo], 'readwrite');
                const store = transaction.objectStore(tipo);
                const item = { numero, nome: file.name, tipo: file.type, tamanho: file.size, dataURL: fileData, dataCriacao: new Date().toISOString() };
                return new Promise((resolve, reject) => {
                    const request = store.put(item);
                    request.onsuccess = () => resolve(item);
                    request.onerror = (e) => reject(e.target.error);
                });
            }
            async function getAllFiles(tipo) {
                await initDB();
                return new Promise((resolve, reject) => {
                    const request = db.transaction([tipo], 'readonly').objectStore(tipo).getAll();
                    request.onsuccess = () => {
                        const files = {};
                        const promises = request.result.map(item =>
                            fetch(item.dataURL).then(res => res.blob()).then(blob => {
                                files[item.numero] = new File([blob], item.nome, { type: item.tipo });
                            })
                        );
                        Promise.all(promises).then(() => resolve(files)).catch(reject);
                    };
                    request.onerror = (e) => reject(e.target.error);
                });
            }
            async function deleteFile(tipo, numero) {
                await initDB();
                const transaction = db.transaction([tipo], 'readwrite');
                return new Promise((resolve, reject) => {
                    const request = transaction.objectStore(tipo).delete(numero);
                    request.onsuccess = () => resolve();
                    request.onerror = (e) => reject(e.target.error);
                });
            }
            async function addHistorico(tipo, numero, ano, anexos = { diarioOficial: false, assinados: false }) {
                await initDB();
                return new Promise((resolve, reject) => {
                    const transaction = db.transaction(['historico'], 'readwrite');
                    const store = transaction.objectStore('historico');
                    const request = store.index('tipoNumeroAno').getKey([tipo, numero, ano]);
                    request.onsuccess = () => {
                        if (request.result) return resolve(false);
                        const addRequest = store.add({ tipo, numero, ano, dataHora: new Date().toISOString(), anexos });
                        addRequest.onsuccess = () => resolve(true);
                        addRequest.onerror = (e) => reject(e.target.error);
                    };
                    request.onerror = (e) => reject(e.target.error);
                });
            }
            async function getAllHistorico() {
                await initDB();
                return new Promise((resolve, reject) => {
                    const items = [];
                    const request = db.transaction(['historico'], 'readonly').objectStore('historico').index('dataHora').openCursor(null, 'prev');
                    request.onsuccess = (event) => {
                        const cursor = event.target.result;
                        if (cursor) {
                            const item = cursor.value;
                            item.dataHoraFormatada = new Date(item.dataHora).toLocaleString();
                            items.push(item);
                            cursor.continue();
                        } else {
                            resolve(items);
                        }
                    };
                    request.onerror = (e) => reject(e.target.error);
                });
            }
            async function clearStore(storeName) {
                await initDB();
                return new Promise((resolve, reject) => {
                    const request = db.transaction([storeName], 'readwrite').objectStore(storeName).clear();
                    request.onsuccess = () => resolve();
                    request.onerror = (e) => reject(e.target.error);
                });
            }
            async function addJson(nome, conteudo) {
                await initDB();
                return new Promise((resolve, reject) => {
                    const transaction = db.transaction(['jsons'], 'readwrite');
                    const item = { nome, conteudo, dataCriacao: new Date().toISOString() };
                    const request = transaction.objectStore('jsons').add(item);
                    request.onsuccess = (event) => resolve({ ...item, id: event.target.result });
                    request.onerror = (e) => reject(e.target.error);
                });
            }
            async function getAllJsons() {
                await initDB();
                return new Promise((resolve, reject) => {
                    const request = db.transaction(['jsons'], 'readonly').objectStore('jsons').getAll();
                    request.onsuccess = () => resolve(request.result);
                    request.onerror = (e) => reject(e.target.error);
                });
            }
            async function getJson(id) {
                await initDB();
                 return new Promise((resolve, reject) => {
                    const request = db.transaction(['jsons'], 'readonly').objectStore('jsons').get(id);
                    request.onsuccess = () => resolve(request.result);
                    request.onerror = (e) => reject(e.target.error);
                });
            }
            async function deleteJson(id) {
                await initDB();
                return new Promise((resolve, reject) => {
                    const request = db.transaction(['jsons'], 'readwrite').objectStore('jsons').delete(id);
                    request.onsuccess = () => resolve();
                    request.onerror = (e) => reject(e.target.error);
                });
            }
            return {
                initDB,
                addFile, getAllFiles, deleteFile, addHistorico, getAllHistorico,
                addJson, getAllJsons, getJson, deleteJson,
                clearAllHistorico: () => clearStore('historico'),
                clearAllJsons: () => clearStore('jsons'),
                clearAllFiles: () => Promise.all([clearStore('diarioOficial'), clearStore('assinados')])
            };
        })();
        const styles = `
            #autoFillModal{display:none;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background-color:white;padding:20px;border-radius:8px;box-shadow:0 4px 15px rgba(0,0,0,0.3);z-index:10001;width:500px;max-width:90%;max-height:90vh;overflow-y:auto}
            #modalOverlay{display:none;position:fixed;top:0;left:0;width:100%;height:100%;background-color:rgba(0,0,0,0.5);z-index:10000}
            .modal-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;padding-bottom:10px;border-bottom:1px solid #ddd}
            .modal-title{font-size:18px;font-weight:bold;color:#333;margin:0}
            .close-button{background:none;border:none;font-size:24px;cursor:pointer;color:#888}
            .close-button:hover{color:#333}
            .tab-buttons{display:flex;border-bottom:1px solid #ddd;margin-bottom:15px;gap:2px}
            .tab-button{flex:1;text-align:center;padding:10px 15px;background-color:#f1f1f1;border:none;cursor:pointer;transition:background-color .3s;border-radius:5px 5px 0 0}
            .tab-button.active{background-color:#4CAF50;color:white}
            .tab-content{display:none;padding:10px}
            .tab-content.active{display:block}
            .form-group{margin-bottom:15px}
            .form-group label{display:block;margin-bottom:5px;font-weight:bold;color:#555}
            .form-control{width:100%;padding:8px 10px;border:1px solid #ddd;border-radius:4px;box-sizing:border-box;font-size:14px}
            textarea.form-control{min-height:100px;resize:vertical}
            .action-button{background-color:#4CAF50;color:white;border:none;padding:10px 15px;border-radius:4px;cursor:pointer;font-size:14px;margin-top:10px;transition:background-color .3s;width:100%}
            .action-button:hover{background-color:#45a049}
            .status-message{margin-top:15px;padding:10px;border-radius:4px;text-align:center}
            .status-success{background-color:#dff0d8;color:#3c763d}
            .status-error{background-color:#f2dede;color:#a94442}
            .status-warning{background-color:#fcf8e3;color:#8a6d3b}
            .file-section{margin-bottom:20px;padding:15px;background-color:#f9f9f9;border-radius:5px}
            .file-section h4{margin-top:0;margin-bottom:10px;color:#4CAF50;display:flex;align-items:center;gap:5px}
            .files-list{margin-top:10px;max-height:150px;overflow-y:auto;border:1px solid #ddd;border-radius:4px;padding:5px;background-color:white}
            .file-item{display:flex;justify-content:space-between;align-items:center;padding:5px;border-bottom:1px solid #eee;font-size:12px}
            .file-item:last-child{border-bottom:none}
            .file-item:hover{background-color:#f5f5f5}
            .file-name{flex:1;margin-right:10px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
            .file-buttons{display:flex;gap:5px}
            .file-button{background:none;border:none;cursor:pointer;padding:2px 5px;border-radius:3px;font-size:12px;display:flex;align-items:center;transition:background-color .2s}
            .file-button:hover{background-color:rgba(0,0,0,0.05)}
            .secondary-button{background-color:#2196F3;color:white;border:none;padding:5px 10px;border-radius:4px;cursor:pointer;font-size:12px;transition:background-color .3s}
            .warning-button{background-color:#f44336;color:white;border:none;padding:8px 12px;border-radius:4px;cursor:pointer;font-size:12px;transition:background-color .3s}
            .historico-list{margin-top:10px;max-height:300px;overflow-y:auto;border:1px solid #ddd;border-radius:4px;padding:10px;background-color:white}
            .historico-item{padding:8px;border-bottom:1px solid #eee;font-size:14px;display:flex;justify-content:space-between;align-items:center}
            .historico-actions{margin-top:15px;display:flex;justify-content:space-between;gap:10px}
            .anexos-info{font-style:italic;font-size:11px;color:#666;margin-top:2px}
            .anexo-sim{color:#4CAF50;font-weight:bold}
            .anexo-nao{color:#f44336}
            .empty-message{padding:20px;color:#888;font-style:italic;text-align:center}
            .switch{position:relative;display:inline-block;width:50px;height:24px}
            .switch input{opacity:0;width:0;height:0}
            .slider{position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background-color:#ccc;transition:.4s}
            .slider:before{position:absolute;content:"";height:18px;width:18px;left:3px;bottom:3px;background-color:white;transition:.4s}
            input:checked+.slider{background-color:#4CAF50}
            input:disabled+.slider{background-color:#e0e0e0;cursor:not-allowed}
            input:checked+.slider:before{transform:translateX(26px)}
            .slider.round{border-radius:24px}
            .slider.round:before{border-radius:50%}
            #progressBarContainer{margin-top:15px;display:none}
            .progress-bar-outer{height:20px;background-color:#f1f1f1;border-radius:10px;overflow:hidden}
            .progress-bar-inner{height:100%;background-color:#4CAF50;width:0%;border-radius:10px;transition:width .3s ease}
            .progress-status{font-size:12px;color:#555;text-align:center}
            #autoCadastroContainer{margin-top:15px;display:flex;align-items:center;justify-content:space-between;padding:10px 15px;background-color:#f8f8f8;border-radius:4px;border:1px solid #e0e0e0}
            #autoFillButton .hint-content { display: none; }
            #autoFillButton:hover .hint-content { display: block; }
            #autoFillButton::before { display: none !important; }
        `;
        const styleElement = document.createElement('style');
        styleElement.textContent = styles;
        document.head.appendChild(styleElement);
        let modalCriado = false;
        function openModal() {
            if (!modalCriado) {
                criarElementosDoModal();
                modalCriado = true;
            }
            const modal = document.getElementById('autoFillModal');
            const overlay = document.getElementById('modalOverlay');
            if (modal && overlay) {
                modal.style.display = 'block';
                overlay.style.display = 'block';
            }
        }
        GM_registerMenuCommand('⚙️ Menu', openModal);
        const svgIcon = `<svg style="width: 20px; height: 20px; fill: white;" viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg"><g><path d="m36.4 14.8h8.48a1.09 1.09 0 0 0 1.12-1.12 1 1 0 0 0 -.32-.8l-10.56-10.56a1 1 0 0 0 -.8-.32 1.09 1.09 0 0 0 -1.12 1.12v8.48a3.21 3.21 0 0 0 3.2 3.2z"/><path d="m44.4 19.6h-11.2a4.81 4.81 0 0 1 -4.8-4.8v-11.2a1.6 1.6 0 0 0 -1.6-1.6h-16a4.81 4.81 0 0 0 -4.8 4.8v38.4a4.81 4.81 0 0 0 4.8 4.8h30.4a4.81 4.81 0 0 0 4.8-4.8v-24a1.6 1.6 0 0 0 -1.6-1.6zm-32-1.6a1.62 1.62 0 0 1 1.6-1.55h6.55a1.56 1.56 0 0 1 1.57 1.55v1.59a1.63 1.63 0 0 1 -1.59 1.58h-6.53a1.55 1.55 0 0 1 -1.58-1.58zm24 20.77a1.6 1.6 0 0 1 -1.6 1.6h-20.8a1.6 1.6 0 0 1 -1.6-1.6v-1.57a1.6 1.6 0 0 1 1.6-1.6h20.8a1.6 1.6 0 0 1 1.6 1.6zm3.2-9.6a1.6 1.6 0 0 1 -1.6 1.63h-24a1.6 1.6 0 0 1 -1.6-1.6v-1.6a1.6 1.6 0 0 1 1.6-1.6h24a1.6 1.6 0 0 1 1.6 1.6z"/></g></svg>`;
        const observer = new MutationObserver(() => {
        if (document.getElementById('autoFillButton')) return;
        let referenceButton = document.querySelector('button#save');
        let useGreenStyle = false;
        if (referenceButton) {
            useGreenStyle = true;
        } else {
            referenceButton = document.querySelector('button#novo');
        }
        if (referenceButton && referenceButton.parentNode) {
            const container = referenceButton.parentNode;
            container.style.display = 'flex';
            container.style.flexDirection = 'column';
            container.style.gap = '8px';
            if (!modalCriado) {
                criarElementosDoModal();
                modalCriado = true;
            }
            const button = document.createElement('button');
            button.id = 'autoFillButton';
            button.type = 'button';
            button.title = 'Auto Cadastro';
            button.innerHTML = svgIcon + '<div class="hint-content">Auto Cadastro</div>';
            button.className = useGreenStyle ? 'btn positive' : 'btn neutral';
            button.classList.add('hint', 'clean', 'module-color');
            button.addEventListener('click', openModal);
            container.insertBefore(button, referenceButton);
        }
    });
observer.observe(document.body, { childList: true, subtree: true });
observer.observe(document.body, { childList: true, subtree: true });
    observer.observe(document.body, { childList: true, subtree: true });
    function criarElementosDoModal() {
        const overlay = document.createElement('div');
        overlay.id = 'modalOverlay';
        document.body.appendChild(overlay);
        const modal = document.createElement('div');
        modal.id = 'autoFillModal';
        modal.innerHTML = `
            <div class="modal-header"><h3 class="modal-title">Auto Cadastro</h3><button class="close-button">&times;</button></div>
            <div class="tab-container">
                <div class="tab-buttons">
                    <button class="tab-button active" data-tab="textTab">JSON</button>
                    <button class="tab-button" data-tab="filesTab">PDF</button>
                    <button class="tab-button" data-tab="historicoTab">HISTÓRICO</button>
                </div>
                <div class="tab-content active" id="textTab">
                    <div class="form-group">
                        <label for="jsonText">Cole o conteúdo JSON:</label>
                        <div style="display: flex; align-items: center;">
                            <textarea id="jsonText" class="form-control" placeholder='{"atos": [{"numero": "123", ...}]}'></textarea>
                            <button id="pasteButton" title="Colar da área de transferência" style="margin-left: 8px; background: none; border: none; cursor: pointer; padding: 5px;">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" stroke="#4CAF50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 2H9a1 1 0 00-1 1v2a1 1 0 001 1h6a1 1 0 001-1V3a1 1 0 00-1-1z" stroke="#4CAF50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                            </button>
                        </div>
                    </div>
                    <div style="margin-top: 20px; padding-top: 15px; border-top: 1px dashed #ccc;">
                        <h4>📋 Arquivos JSON</h4>
                        <div class="form-group"><input type="file" id="jsonFile" class="file-input" accept=".json" multiple></div>
                        <div id="jsonsFilesList" class="files-list"></div>
                        <div style="margin-top: 10px; text-align: center;"><button id="clearAllJsonsButton" class="warning-button">🗑️ Limpar todos os JSONs</button></div>
                    </div>
                    <button id="textImportButton" class="action-button">Preencher Formulário</button>
                </div>
                <div class="tab-content" id="filesTab">
                    <div class="file-section">
                        <h4>📰 Diário Oficial</h4>
                        <div class="form-group"><input type="file" id="diarioOficialFile" class="file-input" accept=".pdf" multiple></div>
                        <div id="diarioOficialFilesList" class="files-list"></div>
                    </div>
                    <div class="file-section">
                        <h4>📝 Assinados</h4>
                        <div class="form-group"><input type="file" id="assinadosFile" class="file-input" accept=".pdf" multiple></div>
                        <div id="assinadosFilesList" class="files-list"></div>
                    </div>
                    <div style="text-align: center;"><button id="clearAllFilesButton" class="warning-button">🗑️ Limpar todos os arquivos</button></div>
                </div>
                <div class="tab-content" id="historicoTab">
                    <h4>📋 Histórico de Registros</h4>
                    <div id="historicoList" class="historico-list"><div class="empty-message">Nenhum registro no histórico</div></div>
                    <div class="historico-actions">
                        <button id="exportHistoricoButton" class="secondary-button">🟩 Histórico Completo</button>
                        <button id="exportNaoAssinadosButton" class="secondary-button">🟥 DOC Não Assinados</button>
                        <button id="clearHistoricoButton" class="warning-button">🗑️ Limpar Histórico</button>
                    </div>
                </div>
            </div>
            <div id="statusMessage" class="status-message" style="display: none;"></div>
        `;
        document.body.appendChild(modal);
        const closeButton = modal.querySelector('.close-button');
        const textImportButton = modal.querySelector('#textImportButton');
        const jsonFileInput = modal.querySelector('#jsonFile');
        const jsonTextInput = modal.querySelector('#jsonText');
        const statusMessage = modal.querySelector('#statusMessage');
        const pasteButton = modal.querySelector('#pasteButton');
        const diarioOficialInput = document.getElementById('diarioOficialFile');
        const assinadosInput = document.getElementById('assinadosFile');
        const diarioOficialFilesList = document.getElementById('diarioOficialFilesList');
        const assinadosFilesList = document.getElementById('assinadosFilesList');
        const clearAllFilesButton = document.getElementById('clearAllFilesButton');
        const historicoList = document.getElementById('historicoList');
        const exportHistoricoButton = document.getElementById('exportHistoricoButton');
        const exportNaoAssinadosButton = document.getElementById('exportNaoAssinadosButton');
        const clearHistoricoButton = document.getElementById('clearHistoricoButton');
        const jsonsFilesList = document.getElementById('jsonsFilesList');
        const clearAllJsonsButton = document.getElementById('clearAllJsonsButton');
        const jsonsStorage = [];
        const filesStorage = { diarioOficial: {}, assinados: {} };
        window.autoCadastroAtivo = false;
        const sleep = ms => new Promise(res => setTimeout(res, ms));
        function limparNomeAto(nomeCompleto) {
            if (!nomeCompleto || typeof nomeCompleto !== 'string') return '';
            const partes = nomeCompleto.split(' - ');
            return partes[partes.length - 1].trim();
        }
        function extrairCodigo(valorCompleto) {
            if (!valorCompleto || typeof valorCompleto !== 'string') return '';
            return valorCompleto.split('-')[0].trim();
        }
        function showStatus(message, type = 'success') {
            if (!message) {
                statusMessage.style.display = 'none';
                return;
            }
            statusMessage.textContent = message;
            statusMessage.style.display = 'block';
            statusMessage.className = 'status-message';
            statusMessage.classList.add(type === 'error' ? 'status-error' : (type === 'warning' ? 'status-warning' : 'status-success'));
            if (type !== 'error') setTimeout(() => { statusMessage.style.display = 'none'; }, 5000);
        }
        class AutoCadastroManager {
            constructor() {
                this.emProcessamento = false;
                this.filaDeJsons = [];
                this.jsonAtual = null;
                this.cadastrosRealizados = 0;
                this.totalCadastros = 0;
                this.observadorURL = null;
                this.verificacaoTimeout = null;
                this.observadorErroDuplicidade = null;
                this.observadorErroDocumento = null;
            }
            iniciarProcessamentoAutomatico() {
                if (this.emProcessamento) return;
                this.filaDeJsons = [...jsonsStorage].sort((a, b) => a.nome.localeCompare(b.nome, undefined, { numeric: true }));
                this.totalCadastros = this.filaDeJsons.length;
                this.cadastrosRealizados = 0;
                this.emProcessamento = true;
                atualizarBarraProgresso(this.cadastrosRealizados, this.totalCadastros);
                this.iniciarMonitoramentoURL();
                this.monitorarErroDeDuplicidade();
                this.monitorarErroDeDocumentoInvalido();
                this.processarProximoJson();
            }
            async processarProximoJson() {
                if (this.filaDeJsons.length === 0) return this.finalizarProcessamento();
                try {
                    if (this.verificacaoTimeout) clearTimeout(this.verificacaoTimeout);
                    if (!window.location.href.includes('/leis-atos/new')) {
                        const botaoNovo = await this.esperarElemento('button#novo', 30);
                        if (botaoNovo) return botaoNovo.click();
                        return this.pararComErro("Não foi possível encontrar o botão 'Novo'");
                    }
                    await sleep(1500);
                    this.jsonAtual = this.filaDeJsons.shift();
                    const jsonData = JSON.parse(this.jsonAtual.conteudo);
                    const ato = jsonData.atos[0];
                    if (await this.verificarSeJaCadastrado(ato)) {
                        showStatus(`Ato ${ato.numero}/${ato.ano} já cadastrado. Pulando.`, 'warning');
                        await dbManager.deleteJson(this.jsonAtual.id);
                        const index = jsonsStorage.findIndex(json => json.id === this.jsonAtual.id);
                        if (index !== -1) jsonsStorage.splice(index, 1);
                        updateJsonsList();
                        this.cadastrosRealizados++;
                        atualizarBarraProgresso(this.cadastrosRealizados, this.totalCadastros);
                        return this.processarProximoJson();
                    }
                    await preencherFormulario(jsonData);
                    this.verificacaoTimeout = setTimeout(() => this.verificarESubmeter(), 4000);
                } catch (error) {
                    this.pararComErro(`Erro ao processar JSON: ${error.message}`);
                }
            }
            async verificarSeJaCadastrado(ato) {
                try {
                    if (!ato || !ato.natureza || !ato.numero || !ato.ano) return false;
                    const historico = await dbManager.getAllHistorico();
                    const naturezaLimpa = limparNomeAto(ato.natureza);
                    return historico.some(item =>
                        item.tipo.trim() === naturezaLimpa &&
                        item.numero == ato.numero &&
                        item.ano == ato.ano
                    );
                } catch (error) {
                    console.error("Erro ao verificar se já cadastrado:", error);
                    return false;
                }
            }
            async verificarUpload(tipo) {
                const config = (tipo === 'assinado') ? {
                    label: 'Assinado',
                    btnDownload: 'lei-ato-arquivo-form button#idBtnDownload',
                    btnAdicionar: 'lei-ato-arquivo-form button.btn.positive.inline.icon-left:not([disabled])',
                    btnPrincipal: 'lei-ato-arquivo-form button[id^="principal_"]',
                    gridDownload: 'lei-ato-arquivo-form elo-datatable button[id^="onDownload_"]'
                } : {
                    label: 'Diário',
                    btnDownload: 'adicionar-veiculo-publicacao button#idBtnDownload',
                    btnAdicionar: 'adicionar-veiculo-publicacao button#btnAdicionar:not([disabled])',
                    gridDownload: 'adicionar-veiculo-publicacao elo-datatable button[id^="onDownload_"]'
                };
                try {
                    showStatus(`Aguardando anexo (${config.label})...`, 'warning');
                    await this.esperarElemento(config.btnDownload, 30);
                    showStatus(`Anexo (${config.label}) processado. Adicionando...`, 'warning');
                    const btnAdicionar = await this.esperarElemento(config.btnAdicionar, 30);
                    if (btnAdicionar) btnAdicionar.click();
                    else throw new Error(`Botão 'Adicionar' (${config.label}) não encontrado.`);

                    if (tipo === 'assinado') {
                        showStatus(`Aguardando opção "Tornar Principal"...`, 'warning');
                        await this.esperarElemento(config.btnPrincipal, 30);
                        showStatus(`Opção "Tornar Principal" disponível.`, 'success');
                    }
                    await this.esperarElemento(config.gridDownload, 30);
                    showStatus(`Upload (${config.label}) confirmado!`, 'success');
                } catch (error) {
                    throw new Error(`Falha na verificação do anexo (${config.label}). ${error.message || 'Timeout'}`);
                }
            }
            async verificarESubmeter() {
                try {
                    const numeroAtoStr = document.querySelector('#numero')?.value;
                    if (!numeroAtoStr) return this.pararComErro("Não foi possível obter o número do ato para verificar anexos.");
                    if (filesStorage.assinados?.[numeroAtoStr]) await this.verificarUpload('assinado');
                    if (filesStorage.diarioOficial?.[numeroAtoStr]) await this.verificarUpload('diario');
                    const botaoSalvar = await this.esperarElemento('#save', 20);
                    if (botaoSalvar) {
                        showStatus("Todos os campos e anexos verificados. Salvando...", 'success');
                        setTimeout(() => botaoSalvar.click(), 1000);
                    } else {
                        this.pararComErro("Não foi possível encontrar o botão de salvar");
                    }
                } catch (error) {
                    this.pararComErro(`Erro ao verificar e submeter: ${error.message}`);
                }
            }
            monitorarErroDeDuplicidade() {
                if (this.observadorErroDuplicidade) this.observadorErroDuplicidade.disconnect();
                this.observadorErroDuplicidade = new MutationObserver((_, observer) => {
                    const errorDialog = document.querySelector('exception-handler article.dialoguebox.negative');
                    if (errorDialog && errorDialog.innerText.includes('Já existe um cadastro para esses dados')) {
                        showStatus('Erro de duplicidade detectado. Tratando...', 'warning');
                        observer.disconnect();
                        this.tratarErroDeDuplicidade();
                    }
                });
                this.observadorErroDuplicidade.observe(document.body, { childList: true, subtree: true });
            }
            monitorarErroDeDocumentoInvalido() {
                if (this.observadorErroDocumento) this.observadorErroDocumento.disconnect();
                this.observadorErroDocumento = new MutationObserver((_, observer) => {
                    const errorDialog = document.querySelector('exception-handler article.dialoguebox.negative');
                    if (errorDialog && (errorDialog.innerText.toLowerCase().includes('validação') || errorDialog.innerText.toLowerCase().includes('documento'))) {
                        showStatus('Erro de Validação/Documento Inválido detectado. Tratando...', 'warning');
                        observer.disconnect();
                        this.tratarErroDeDocumentoInvalido();
                    }
                });
                this.observadorErroDocumento.observe(document.body, { childList: true, subtree: true });
            }
            async tratarErroDeDuplicidade() {
                try {
                    await this.esperarElemento('span#okButton.btn.negative.close-dialoguebox', 10).then(el => el?.click());
                    await sleep(700);
                    const trashDiario = await this.esperarElemento('adicionar-veiculo-publicacao button i.fa-trash', 3);
                    if (trashDiario) {
                        trashDiario.closest('button').click();
                        await sleep(500);
                        await this.esperarElemento('elo-dialog button#btOk.btn.inline.positive', 10).then(el => el?.click());
                        await sleep(700);
                    }
                    const trashAssinado = await this.esperarElemento('lei-ato-arquivo-form button[id^="delete_"] i.fa-trash', 3);
                    if (trashAssinado) {
                        trashAssinado.closest('button').click();
                        await sleep(500);
                        await this.esperarElemento('elo-dialog button#btOk.btn.inline.positive', 10).then(el => el?.click());
                        await sleep(700);
                    }
                    if (this.jsonAtual) {
                        await dbManager.deleteJson(this.jsonAtual.id);
                        const index = jsonsStorage.findIndex(json => json.id === this.jsonAtual.id);
                        if (index !== -1) jsonsStorage.splice(index, 1);
                        updateJsonsList();
                        this.cadastrosRealizados++;
                        atualizarBarraProgresso(this.cadastrosRealizados, this.totalCadastros);
                        this.jsonAtual = null;
                    }
                    await sleep(500);
                    this.monitorarErroDeDuplicidade();
                    this.processarProximoJson();
                } catch (error) {
                    this.pararComErro(`Falha ao tratar erro de duplicidade: ${error.message}`);
                }
            }
            async tratarErroDeDocumentoInvalido() {
                try {
                    await this.esperarElemento('span#okButton.btn.negative.close-dialoguebox', 10).then(el => el?.click());
                    await sleep(700);
                    const escopoInput = document.querySelector('#escopo_input');
                    const naturezaInput = document.querySelector('#tipoLeiNatureza_input');
                    if (!escopoInput || !naturezaInput) throw new Error("Campos 'Escopo' ou 'Natureza' não encontrados para correção.");
                    const escopoAtual = escopoInput.value;
                    const naturezaAtualCompleta = naturezaInput.value;
                    const regrasEscopo = planoDeContingenciaDocumento[escopoAtual];
                    if (!regrasEscopo) {
                        return this.pararComErro(`Documento inválido. Nenhum plano de contingência encontrado para o escopo: "${escopoAtual}".`);
                    }
                    const tiposNatureza = ['Lei complementar', 'Lei', 'Decreto', 'Portaria'];
                    const naturezaKeyword = tiposNatureza.find(tipo => naturezaAtualCompleta.includes(tipo));
                    let documentoCorreto = null;
                    if (naturezaKeyword && regrasEscopo[naturezaKeyword]) {
                        documentoCorreto = regrasEscopo[naturezaKeyword];
                    } else if (regrasEscopo._default) {
                        documentoCorreto = regrasEscopo._default;
                    }
                    if (!documentoCorreto) {
                        return this.pararComErro(`Contingência para escopo "${escopoAtual}" encontrada, mas sem regra para a natureza "${naturezaKeyword || 'desconhecida'}" ou padrão.`);
                    }
                    showStatus(`Aplicando contingência: Trocando documento para "${documentoCorreto}"`, 'warning');
                    const seletorInputDocumento = '#tipoLeiDocumento_input';
                    const inputDocumento = document.querySelector(seletorInputDocumento);
                    if (!inputDocumento) throw new Error("Campo 'Documento' não encontrado para correção.");
                    inputDocumento.value = '';
                    inputDocumento.dispatchEvent(new Event('input', { bubbles: true }));
                    await sleep(500);
                    await preencherAutocomplete(seletorInputDocumento, extrairCodigo(documentoCorreto));
                    await sleep(1500);
                    this.monitorarErroDeDocumentoInvalido();
                    const botaoSalvar = await this.esperarElemento('#save', 10);
                    if (botaoSalvar) {
                        showStatus("Documento corrigido. Tentando salvar novamente...", 'success');
                        setTimeout(() => botaoSalvar.click(), 1000);
                    } else {
                        this.pararComErro("Não foi possível encontrar o botão de salvar após a correção.");
                    }

                } catch (error) {
                    this.pararComErro(`Falha ao tratar erro de documento: ${error.message}`);
                }
            }

            iniciarMonitoramentoURL() {
                if (this.observadorURL) clearInterval(this.observadorURL);
                let urlAtual = window.location.href;
                this.observadorURL = setInterval(async () => {
                    if (window.location.href !== urlAtual) {
                        urlAtual = window.location.href;
                        if (!this.emProcessamento) return;
                        if (urlAtual.includes('/leis-atos') && !urlAtual.includes('/leis-atos/new')) {
                            if (this.jsonAtual) {
                                await dbManager.deleteJson(this.jsonAtual.id);
                                const index = jsonsStorage.findIndex(json => json.id === this.jsonAtual.id);
                                if (index !== -1) jsonsStorage.splice(index, 1);
                                updateJsonsList();
                                this.cadastrosRealizados++;
                                atualizarBarraProgresso(this.cadastrosRealizados, this.totalCadastros);
                                this.jsonAtual = null;
                            }
                            setTimeout(() => this.processarProximoJson(), 2000);
                        } else if (urlAtual.includes('/leis-atos/new')) {
                            setTimeout(() => this.processarProximoJson(), 1500);
                        }
                    }
                }, 500);
            }
            esperarElemento(selector, timeoutSeconds = 10) {
                return new Promise((resolve) => {
                    const el = document.querySelector(selector);
                    if (el) return resolve(el);
                    const interval = setInterval(() => {
                        const el = document.querySelector(selector);
                        if (el) { clearInterval(interval); clearTimeout(timeout); resolve(el); }
                    }, 100);
                    const timeout = setTimeout(() => { clearInterval(interval); resolve(null); }, timeoutSeconds * 1000);
                });
            }
            pararComErro(mensagem) {
                showStatus(mensagem, 'error');
                this.emProcessamento = false;
                if (this.observadorURL) clearInterval(this.observadorURL);
                if (this.verificacaoTimeout) clearTimeout(this.verificacaoTimeout);
                if (this.observadorErroDuplicidade) this.observadorErroDuplicidade.disconnect();
                if (this.observadorErroDocumento) this.observadorErroDocumento.disconnect();
                const toggle = document.getElementById('autoCadastroToggle');
                if (toggle) { toggle.checked = false; window.autoCadastroAtivo = false; }
                atualizarBarraProgresso(0, 0);
            }
            finalizarProcessamento() {
                showStatus(`Todos os ${this.totalCadastros} cadastros foram processados!`, 'success');
                this.pararComErro(null);
            }
        }
        const autoCadastroManager = new AutoCadastroManager();
        function adicionarInterruptorAutoCadastro() {
            const textImportButton = document.querySelector('#textImportButton');
            if (!textImportButton || document.querySelector('#autoCadastroContainer')) return;
            const autoCadastroContainer = document.createElement('div');
            autoCadastroContainer.id = 'autoCadastroContainer';
            autoCadastroContainer.innerHTML = `
                <div class="auto-cadastro-label">
                    <div style="font-weight: bold; color: #333;">Modo de Cadastro Automático</div>
                    <div style="font-size: 11px; color: #666; margin-top: 3px;">Processa todos os JSONs em sequência</div>
                </div>
                <label class="switch"><input type="checkbox" id="autoCadastroToggle" disabled><span class="slider round"></span></label>`;
            const progressBarContainer = document.createElement('div');
            progressBarContainer.id = 'progressBarContainer';
            progressBarContainer.innerHTML = `
                <div class="progress-bar-outer"><div id="progressBarInner" class="progress-bar-inner"></div></div>
                <div id="progressStatus" class="progress-status">0/0 concluídos</div>
                <div style="margin-top: 8px; text-align: center;"><button id="cancelAutoCadastro" class="warning-button" style="display: none;">🛑 Cancelar</button></div>`;
            textImportButton.parentNode.insertBefore(autoCadastroContainer, textImportButton.nextSibling);
            autoCadastroContainer.parentNode.insertBefore(progressBarContainer, autoCadastroContainer.nextSibling);
            document.getElementById('autoCadastroToggle').addEventListener('change', function() { window.autoCadastroAtivo = this.checked; });
            document.getElementById('cancelAutoCadastro').addEventListener('click', () => {
                if (confirm('Cancelar o processamento automático?')) autoCadastroManager.pararComErro("Cancelado pelo usuário");
            });
            atualizarEstadoInterruptor();
        }
        function atualizarEstadoInterruptor() {
            const toggle = document.getElementById('autoCadastroToggle');
            if (!toggle) return;
            const temJsons = jsonsStorage.length > 0;
            toggle.disabled = !temJsons;
            if (!temJsons) {
                toggle.checked = false;
                window.autoCadastroAtivo = false;
            }
        }
        function atualizarBarraProgresso(atual, total) {
            const progressContainer = document.getElementById('progressBarContainer');
            if (!progressContainer) return;
            const progressBar = document.getElementById('progressBarInner');
            const progressStatus = document.getElementById('progressStatus');
            const cancelButton = document.getElementById('cancelAutoCadastro');
            if (total > 0) {
                progressContainer.style.display = 'block';
                progressBar.style.width = `${(atual / total) * 100}%`;
                progressStatus.textContent = `${atual}/${total} cadastros concluídos`;
                if(cancelButton) cancelButton.style.display = 'inline-block';
            } else {
                progressContainer.style.display = 'none';
                if(cancelButton) cancelButton.style.display = 'none';
            }
        }
        async function preencherFormulario(data) {
            try {
                const ato = data.atos[0];
                if (!ato) return showStatus('Nenhum dado de ato encontrado no JSON!', 'error');
                const anexosParaHistorico = {
                    diarioOficial: !!filesStorage.diarioOficial[ato.numero],
                    assinados: !!filesStorage.assinados[ato.numero]
                };
                function setInputValue(selector, value) {
                    const input = document.querySelector(selector);
                    if (input) {
                        input.value = value;
                        input.dispatchEvent(new Event('input', { bubbles: true }));
                        input.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                }
                setInputValue('#numero', ato.numero);
                setInputValue('#ano', ato.ano);
                setInputValue('#dataInicioVigencia_input', ato.inicioVigencia);
                setInputValue('#dataFimVigencia_input', ato.fimVigencia || '');
                setInputValue('#dataCadastro_input', ato.dataCadastro);
                setInputValue('#dataAto_input', ato.dataAto);
                setInputValue('#sumula', ato.sumula);
                setInputValue('#dataPublicacao_input', ato.dataPublicacao);
                setInputValue('#numeroEdicao', ato.numeroEdicao);
                setInputValue('#pagina', ato.pagina);
                setInputValue('#dataVinculo_input', ato.dataVinculacao);
                iniciarMonitoramentoBotoes();
                setTimeout(autoAttachFiles, 1000);
                if (ato.entidadeOrigem) preencherAutocomplete('#entidadeOrigem_input', extrairCodigo(ato.entidadeOrigem));
                if (ato.natureza) preencherAutocomplete('#tipoLeiNatureza_input', extrairCodigo(ato.natureza));
                if (ato.veiculoPublicacao) preencherAutocomplete('elo-autocomplete[formcontrolname="veiculoPublicacao"] input.autocomplete-input', extrairCodigo(ato.veiculoPublicacao));
                if (ato.escopo) {
                    await preencherAutocomplete('#escopo_input', extrairCodigo(ato.escopo));
                    await sleep(500);
                    if (ato.documento) {
                        await preencherAutocomplete('#tipoLeiDocumento_input', extrairCodigo(ato.documento));
                    }
                }
                const atoPessoalCheckbox = document.querySelector('label[for="atoPessoal"]')?.parentElement.querySelector('input[type="checkbox"]');
                if (atoPessoalCheckbox) {
                    atoPessoalCheckbox.checked = ato.atoPessoal;
                    atoPessoalCheckbox.dispatchEvent(new Event('change', { bubbles: true }));
                }
                const tipoNaturezaInput = document.querySelector('#tipoLeiNatureza_input');
                const tipoDocumento = (tipoNaturezaInput?.value) || ato.natureza || "Documento";
                historicoManager.adicionarRegistro(tipoDocumento, ato.numero, ato.ano, anexosParaHistorico);
                showStatus('Formulário preenchido com sucesso!', 'success');
                if (!window.autoCadastroAtivo) {
                    setTimeout(() => { modal.style.display = 'none'; overlay.style.display = 'none'; }, 1500);
                }
            } catch (error) {
                showStatus('Erro ao preencher formulário: ' + error.message, 'error');
            }
        }
        async function preencherAutocomplete(selector, value) {
            try {
                const input = document.querySelector(selector);
                if (!input || !value) return;
                input.focus();
                input.click();
                await sleep(200);
                input.value = '';
                input.dispatchEvent(new Event('input', { bubbles: true }));
                await sleep(500);
                input.value = value;
                input.dispatchEvent(new Event('input', { bubbles: true }));
                await sleep(1200);
                input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true }));
            } catch (e) {
                console.error(`Erro ao preencher autocomplete para ${selector}:`, e);
            }
        }
        function renderFileList(container, items, config) {
            container.innerHTML = '';
            const itemsArray = Array.isArray(items) ? items : Object.entries(items);
            if (itemsArray.length === 0) {
                container.innerHTML = `<div class="empty-message">${config.emptyMsg}</div>`;
                return;
            }
            itemsArray.sort(config.sortFn).forEach(itemData => {
                const item = config.getItem(itemData);
                const fileItem = document.createElement('div');
                fileItem.className = 'file-item';
                fileItem.innerHTML = `
                    <div class="file-name">${item.displayText}</div>
                    <div class="file-buttons">
                        <button class="file-button" title="${config.useTitle}">📄 Usar</button>
                        <button class="file-button" title="${config.deleteTitle}">❌ Excluir</button>
                    </div>`;
                fileItem.querySelector('button:nth-child(1)').addEventListener('click', () => config.useFn(item.id));
                fileItem.querySelector('button:nth-child(2)').addEventListener('click', () => config.deleteFn(item.id));
                container.appendChild(fileItem);
            });
        }

        function updateJsonsList() {
            renderFileList(jsonsFilesList, jsonsStorage, {
                emptyMsg: 'Nenhum arquivo JSON adicionado',
                useTitle: 'Usar este arquivo JSON',
                deleteTitle: 'Excluir este arquivo JSON',
                sortFn: (a, b) => a.nome.localeCompare(b.nome, undefined, { numeric: true }),
                getItem: (item) => ({ id: item.id, displayText: item.nome }),
                useFn: (id) => useJson(id),
                deleteFn: (id) => deleteJson(id)
            });
            atualizarEstadoInterruptor();
        }
        function updateFilesList(tipo) {
            const container = tipo === 'diarioOficial' ? diarioOficialFilesList : assinadosFilesList;
            renderFileList(container, filesStorage[tipo], {
                emptyMsg: 'Nenhum arquivo adicionado',
                useTitle: 'Usar este arquivo',
                deleteTitle: 'Excluir este arquivo',
                sortFn: (a, b) => parseInt(a[0]) - parseInt(b[0]),
                getItem: ([numero, file]) => ({ id: numero, displayText: `${numero}: ${file.name}` }),
                useFn: (numero) => useFile(tipo, numero),
                deleteFn: (numero) => deleteFile(tipo, numero)
            });
        }
        async function addJson(file) {
            try {
                const content = await file.text();
                const jsonData = JSON.parse(content);
                let nome = file.name;
                const ato = jsonData.atos?.[0];
                if (ato?.natureza && ato?.numero) {
                    const tipoAtoLimpo = limparNomeAto(ato.natureza);
                    nome = `${tipoAtoLimpo} ${ato.numero}`;
                }
                const jsonSalvo = await dbManager.addJson(nome, content);
                jsonsStorage.push(jsonSalvo);
                updateJsonsList();
                showStatus(`Arquivo JSON "${nome}" adicionado!`, 'success');
            } catch (error) {
                showStatus(`Erro ao processar JSON: ${error.message}`, 'error');
            }
        }
        async function useJson(id) {
            try {
                const json = await dbManager.getJson(id);
                if (!json) return showStatus(`Arquivo JSON não encontrado!`, 'error');
                await preencherFormulario(JSON.parse(json.conteudo));
                showStatus(`Usando arquivo JSON: ${json.nome}`, 'success');
                await deleteJson(id, false);
            } catch (error) {
                showStatus(`Erro ao usar arquivo JSON: ${error.message}`, 'error');
            }
        }
        async function deleteJson(id, confirmDelete = true) {
            if (confirmDelete && !confirm('Tem certeza que deseja excluir este arquivo JSON?')) return;
            try {
                await dbManager.deleteJson(id);
                const index = jsonsStorage.findIndex(json => json.id === id);
                if (index !== -1) jsonsStorage.splice(index, 1);
                updateJsonsList();
                if (confirmDelete) showStatus('Arquivo JSON excluído!', 'success');
            } catch (error) {
                if (confirmDelete) showStatus(`Erro ao excluir JSON: ${error.message}`, 'error');
            }
        }
        async function clearAllJsons() {
            if (!confirm('Tem certeza que deseja remover TODOS os arquivos JSON?')) return;
            try {
                await dbManager.clearAllJsons();
                jsonsStorage.length = 0;
                updateJsonsList();
                showStatus('Todos os arquivos JSON foram removidos!', 'success');
            } catch (error) {
                showStatus(`Erro ao remover JSONs: ${error.message}`, 'error');
            }
        }
        function addFile(tipo, file, numero) {
            if (!numero) {
                const nomeNormalizado = file.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[._\s]+/g, '-');
                const match = nomeNormalizado.match(/(?:portaria|decreto|lei|diario-?oficial)-?(\d[\d.,]*)/i) || file.name.match(/(\d[\d.,]*)/);
                if (match) numero = (match[1] || match[0]).replace(/\D/g, '');
            }
            if (!numero) numero = prompt(`Não foi possível identificar o número para "${file.name}".\nPor favor, digite o número:`);
            if (!numero) return;
            filesStorage[tipo][numero] = file;
            updateFilesList(tipo);
            const reader = new FileReader();
            reader.onload = (e) => dbManager.addFile(tipo, file, numero, e.target.result)
                .catch(() => showStatus('Erro ao salvar arquivo no banco de dados', 'error'));
            reader.readAsDataURL(file);
        }
        async function deleteFile(tipo, numero, confirmDelete = true) {
            if (confirmDelete && !confirm(`Excluir o arquivo para o número ${numero}?`)) return;
            delete filesStorage[tipo][numero];
            updateFilesList(tipo);
            try {
                await dbManager.deleteFile(tipo, numero);
                if (confirmDelete) showStatus(`Arquivo para o número ${numero} excluído!`, 'success');
            } catch (err) {
                if (confirmDelete) showStatus('Erro ao excluir arquivo do banco de dados', 'error');
            }
        }
        function useFile(tipo, numero) {
            const numeroAtual = document.querySelector('#numero').value;
            if (confirm(`Usar o arquivo do número ${numero} para o cadastro atual (${numeroAtual})?`)) {
                attachFileToForm(tipo, numero);
                showStatus(`Arquivo do número ${numero} sendo usado!`, 'success');
            }
        }
        function attachFileToForm(tipo, numero) {
            const file = filesStorage[tipo][numero];
            if (!file) return;
            try {
                let fileInput = null;
                if (tipo === 'diarioOficial') {
                    fileInput = document.querySelector('adicionar-veiculo-publicacao input.file-uploader-input');
                } else {
                    fileInput = document.querySelector('lei-ato-arquivo-form input.file-uploader-input');
                }
                if (!fileInput) {
                    showStatus(`ERRO CRÍTICO: Campo de anexo para '${tipo}' não foi encontrado!`, 'error');
                    return;
                }
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                fileInput.files = dataTransfer.files;
                fileInput.dispatchEvent(new Event('change', { bubbles: true }));
                deleteFile(tipo, numero, false);
            } catch (e) {
                showStatus(`Erro ao anexar arquivo: ${e.message}`, 'error');
            }
        }
        async function clearAllFiles() {
            if (confirm('Tem certeza que deseja remover TODOS os arquivos PDF armazenados?')) {
                filesStorage.diarioOficial = {};
                filesStorage.assinados = {};
                updateFilesList('diarioOficial');
                updateFilesList('assinados');
                try {
                    await dbManager.clearAllFiles();
                    showStatus('Todos os arquivos foram removidos!', 'success');
                } catch (err) {
                    showStatus('Erro ao remover arquivos do banco de dados', 'error');
                }
            }
        }
        const historicoManager = (function gerenciarHistorico() {
            async function atualizarListaHistorico() {
                try {
                    const historico = await dbManager.getAllHistorico();
                    historicoList.innerHTML = '';
                    if (historico.length === 0) return historicoList.innerHTML = '<div class="empty-message">Nenhum registro no histórico</div>';
                    historico.forEach(r => {
                        const registroItem = document.createElement('div');
                        registroItem.className = 'historico-item';
                        registroItem.innerHTML = `
                            <div style="flex: 1; overflow: hidden;">
                                <div>${r.tipo} ${r.numero}/${r.ano}</div>
                                <div class="anexos-info">
                                    <span>DO <span class="${r.anexos?.diarioOficial ? 'anexo-sim' : 'anexo-nao'}">${r.anexos?.diarioOficial ? '✓' : '✗'}</span></span>
                                    <span>ASS <span class="${r.anexos?.assinados ? 'anexo-sim' : 'anexo-nao'}">${r.anexos?.assinados ? '✓' : '✗'}</span></span>
                                </div>
                            </div>
                            <div style="color: #888; font-size: 12px;">${r.dataHoraFormatada}</div>`;
                        historicoList.appendChild(registroItem);
                    });
                } catch (error) { showStatus('Erro ao carregar histórico', 'error'); }
            }
            async function adicionarRegistro(tipo, numero, ano, anexos) {
                try {
                    const tipoLimpo = limparNomeAto(tipo);
                    if (!tipoLimpo || !numero || !ano) return;
                    if (await dbManager.addHistorico(tipoLimpo, numero, ano, anexos)) atualizarListaHistorico();
                } catch (error) { console.error("Erro ao adicionar registro ao histórico:", error); }
            }
            async function limparHistorico() {
                if (confirm('Limpar todo o histórico de registros?')) {
                    try {
                        await dbManager.clearAllHistorico();
                        atualizarListaHistorico();
                        showStatus('Histórico removido!', 'success');
                    } catch (error) { showStatus('Erro ao limpar histórico', 'error'); }
                }
            }
            function exportarTXT(filename, content) {
                const a = document.createElement('a');
                a.href = URL.createObjectURL(new Blob([content], { type: 'text/plain;charset=utf-8' }));
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(a.href);
            }
            async function exportarHistoricoTXT() {
                const historico = await dbManager.getAllHistorico();
                if (historico.length === 0) return showStatus('Não há registros para exportar!', 'warning');
                let content = "======================\nHISTÓRICO DE REGISTROS\n======================\n\n";
                historico.forEach(r => {
                    content += `${r.tipo} ${r.numero}/${r.ano}\nData: ${r.dataHoraFormatada}\n`;
                    content += `Anexos: Diário Oficial (${r.anexos?.diarioOficial ? "✅" : "❌"}), Documento Assinado (${r.anexos?.assinados ? "✅" : "❌"})\n\n`;
                });
                exportarTXT('historico_registros.txt', content);
                showStatus('Histórico exportado!', 'success');
            }
            async function exportarNaoAssinadosTXT() {
                const naoAssinados = (await dbManager.getAllHistorico()).filter(r => r.anexos && !r.anexos.assinados);
                if (naoAssinados.length === 0) return showStatus('Não há atos não assinados para exportar.', 'warning');
                const grouped = naoAssinados.reduce((acc, { ano, tipo, numero }) => {
                    const tipoLimpo = tipo.toUpperCase().trim();
                    if (!acc[ano]) acc[ano] = {};
                    if (!acc[ano][tipoLimpo]) acc[ano][tipoLimpo] = [];
                    acc[ano][tipoLimpo].push(numero);
                    return acc;
                }, {});
                let content = "";
                Object.keys(grouped).sort((a, b) => b - a).forEach(ano => {
                    Object.keys(grouped[ano]).sort().forEach(tipo => {
                        content += `==========================\n${tipo}S NÃO ${tipo.endsWith('A') ? 'ASSINADAS' : 'ASSINADOS'} ${ano}\n==========================\n`;
                        grouped[ano][tipo].sort((a,b) => parseInt(a)-parseInt(b)).forEach(n => content += `- ${tipo.charAt(0)+tipo.slice(1).toLowerCase()} ${n}\n`);
                        content += '\n';
                    });
                });
                exportarTXT('historico_nao_assinados.txt', content);
                showStatus('Histórico de não assinados exportado!', 'success');
            }
            dbManager.initDB().then(atualizarListaHistorico).catch(console.error);
            clearHistoricoButton.addEventListener('click', limparHistorico);
            exportHistoricoButton.addEventListener('click', exportarHistoricoTXT);
            exportNaoAssinadosButton.addEventListener('click', exportarNaoAssinadosTXT);
            return { adicionarRegistro };
        })();
        async function carregarDadosIniciais() {
            try {
                await dbManager.initDB();
                const [diarios, assinados, jsons] = await Promise.all([
                    dbManager.getAllFiles('diarioOficial'),
                    dbManager.getAllFiles('assinados'),
                    dbManager.getAllJsons()
                ]);
                filesStorage.diarioOficial = diarios;
                filesStorage.assinados = assinados;
                jsonsStorage.push(...jsons);
                updateFilesList('diarioOficial');
                updateFilesList('assinados');
                updateJsonsList();
            } catch (error) {
                showStatus('Erro ao carregar dados armazenados', 'error');
            }
        }
        const fecharModal = () => {
            if (autoCadastroManager.emProcessamento && confirm('Um processamento automático está em andamento. Deseja interromper?')) {
                autoCadastroManager.pararComErro("Interrompido pelo usuário");
            }
            modal.style.display = 'none';
            overlay.style.display = 'none';
        };
        closeButton.addEventListener('click', fecharModal);
        overlay.addEventListener('click', fecharModal);
        modal.querySelectorAll('.tab-button').forEach(btn => btn.addEventListener('click', () => {
            modal.querySelector('.tab-button.active').classList.remove('active');
            modal.querySelector('.tab-content.active').classList.remove('active');
            btn.classList.add('active');
            document.getElementById(btn.dataset.tab).classList.add('active');
        }));
        pasteButton.addEventListener('click', async () => {
            try {
                jsonTextInput.value = await navigator.clipboard.readText();
                showStatus('Texto colado!', 'success');
            } catch (err) { showStatus('Falha ao colar. Verifique as permissões.', 'error'); }
        });
        textImportButton.addEventListener('click', async () => {
            if (window.autoCadastroAtivo && jsonsStorage.length > 0) {
                autoCadastroManager.iniciarProcessamentoAutomatico();
                return;
            }
            if (jsonTextInput.value) {
                try {
                    const jsonContent = jsonTextInput.value;
                    const jsonData = JSON.parse(jsonContent);
                    const ato = jsonData.atos?.[0];
                    if (!ato) {
                        showStatus('Conteúdo JSON inválido ou sem a estrutura esperada.', 'error');
                        return;
                    }
                    let nome = `Texto Colado - ${new Date().toLocaleTimeString()}`;
                    if (ato.natureza && ato.numero) {
                         const tipoAtoLimpo = limparNomeAto(ato.natureza);
                         nome = `${tipoAtoLimpo} ${ato.numero}`;
                    }
                    const jsonSalvo = await dbManager.addJson(nome, jsonContent);
                    jsonsStorage.push(jsonSalvo);
                    updateJsonsList();
                    jsonTextInput.value = '';
                    await useJson(jsonSalvo.id);
                } catch (e) {
                    showStatus('Erro ao analisar o JSON do campo de texto: ' + e.message, 'error');
                }
            } else if (jsonsStorage.length > 0) {
                await useJson(jsonsStorage[jsonsStorage.length - 1].id);
            } else {
                showStatus('Insira um texto JSON ou adicione um arquivo para preencher!', 'error');
            }
        });
        jsonFileInput.addEventListener('change', () => { Array.from(jsonFileInput.files).forEach(addJson); jsonFileInput.value = ''; });
        diarioOficialInput.addEventListener('change', () => { Array.from(diarioOficialInput.files).forEach(f => addFile('diarioOficial', f)); diarioOficialInput.value = ''; });
        assinadosInput.addEventListener('change', () => { Array.from(assinadosInput.files).forEach(f => addFile('assinados', f)); assinadosInput.value = ''; });
        clearAllJsonsButton.addEventListener('click', clearAllJsons);
        clearAllFilesButton.addEventListener('click', clearAllFiles);
        function autoAttachFiles() {
            const numero = document.querySelector('#numero')?.value;
            if (!numero) return;
            if (filesStorage.diarioOficial[numero]) attachFileToForm('diarioOficial', numero);
            if (filesStorage.assinados[numero]) attachFileToForm('assinados', numero);
        }
        function iniciarMonitoramentoBotoes() {
            if (window._monitoramentoBotoesInterval) clearInterval(window._monitoramentoBotoesInterval);
            let btnAdicionarClicado = false;
            let btnAdicionarCheckClicado = false;
            let btnTornarPrincipalClicado = false;
            window._monitoramentoBotoesInterval = setInterval(() => {
                const btnAdicionar = document.querySelector('#btnAdicionar:not([disabled])');
                if (btnAdicionar && !btnAdicionarClicado) {
                    setTimeout(() => { if (btnAdicionar) { btnAdicionar.click(); btnAdicionarClicado = true; } }, 1500);
                }
                const btnAdicionarCheck = document.querySelector('button.btn.positive.inline.icon-left:not([disabled])');
                if (btnAdicionarCheck?.querySelector('.fa.fa-check') && !btnAdicionarCheckClicado) {
                    setTimeout(() => { if (btnAdicionarCheck) { btnAdicionarCheck.click(); btnAdicionarCheckClicado = true; } }, 1500);
                }
                const btnTornarPrincipal = document.querySelector('lei-ato-arquivo-form button[id^="principal_"]:not([disabled])');
                if (btnTornarPrincipal && !btnTornarPrincipalClicado) {
                    setTimeout(() => {
                        if (btnTornarPrincipal) {
                            btnTornarPrincipal.click();
                            btnTornarPrincipalClicado = true;
                        }
                    }, 500);
                }

            }, 1000);
            let lastUrl = location.href;
            if (!window._urlChangeMonitor) {
                window._urlChangeMonitor = setInterval(() => {
                    if (location.href !== lastUrl) {
                        lastUrl = location.href;
                        iniciarMonitoramentoBotoes();
                    }
                }, 2000);
            }
        }
        adicionarInterruptorAutoCadastro();
        carregarDadosIniciais();
        document.addEventListener('DOMContentLoaded', () => setTimeout(iniciarMonitoramentoBotoes, 1000));
    }
})();