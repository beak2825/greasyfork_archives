// ==UserScript==
// @name         Anitsu Cloud Downloader Manager
// @namespace    https://nuvem.anitsu.moe/
// @version      1.3
// @description  Gerenciador de Download em lote para Anitsu Cloud
// @match        https://nuvem.anitsu.moe/*
// @icon         https://nuvem.anitsu.moe/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/560327/Anitsu%20Cloud%20Downloader%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/560327/Anitsu%20Cloud%20Downloader%20Manager.meta.js
// ==/UserScript==

(function () {
	'use strict';

	// ═══════════════════════════════════════════════════════════════════
	// CONFIGURAÇÃO
	// ═══════════════════════════════════════════════════════════════════
	const CONFIG = {
		SCRIPT_NAME: 'Anitsu Download Manager',
		ACCENT_COLOR: '#c41e3a',
		// ======= CONFIGURAÇÕES DE DOWNLOAD =======
		SIMULTANEOUS_DOWNLOADS: 2, // Quantidade de arquivos baixando ao mesmo tempo (1-4 recomendado)
		STORAGE_KEY: 'anitsu-dl-queue', // Chave do localStorage para persistir fila
		INCOMPLETE_FILES_KEY: 'anitsu-dl-incomplete', // Chave para arquivos incompletos
	};

	// ═══════════════════════════════════════════════════════════════════
	// LOGGER
	// ═══════════════════════════════════════════════════════════════════
	const Logger = {
		get prefix() {
			return [
				`%c[${new Date().toLocaleTimeString()}]%c[${CONFIG.SCRIPT_NAME}]%c:`,
				'font-weight: bold; color: #0920e6;',
				'font-weight: bold; color: #c41e3a;',
				'',
			];
		},
		log: (...data) => console.log(...Logger.prefix, ...data),
		info: (...data) => console.info(...Logger.prefix, ...data),
		warn: (...data) => console.warn(...Logger.prefix, ...data),
		error: (...data) => console.error(...Logger.prefix, ...data),
	};

	// ═══════════════════════════════════════════════════════════════════
	// HELPERS
	// ═══════════════════════════════════════════════════════════════════
	const Helper = {
		getSize(size, digits = 2) {
			const sizes = [' Bytes', ' KB', ' MB', ' GB', ' TB'];
			for (let i = 1; i < sizes.length; i++) {
				if (size < Math.pow(1024, i)) {
					return (size / Math.pow(1024, i - 1)).toFixed(digits) + sizes[i - 1];
				}
			}
			return 'infinite';
		},
		getSpeed(bytesPerSecond) {
			if (bytesPerSecond <= 0) return '0 B/s';
			const sizes = ['B/s', 'KB/s', 'MB/s', 'GB/s'];
			for (let i = 1; i < sizes.length; i++) {
				if (bytesPerSecond < Math.pow(1024, i)) {
					return (bytesPerSecond / Math.pow(1024, i - 1)).toFixed(2) + ' ' + sizes[i - 1];
				}
			}
			return (bytesPerSecond / Math.pow(1024, 3)).toFixed(2) + ' ' + sizes[3];
		},
		findElement(selector, interval = 500, maxRetry = 10) {
			let tryTime = 0;
			return new Promise((resolve, reject) => {
				const check = () => {
					const el = document.querySelector(selector);
					if (el) return resolve(el);
					tryTime++;
					if (tryTime >= maxRetry) return reject(new Error(`Elemento "${selector}" não encontrado`));
					setTimeout(check, interval);
				};
				check();
			});
		},
		sanitizeName: (name) => {
			if (!name) return 'arquivo';
			
			// Remove caracteres proibidos no Windows: \ / : * ? " < > |
			let safe = name.replace(/[\\/:*?"<>|]/g, '_');
			
			// Remove caracteres de controle (0-31) e DEL (127)
			safe = safe.replace(/[\x00-\x1F\x7F]/g, '');
			
			// Remove caracteres Unicode problemáticos (emojis, símbolos especiais)
			// Mantém apenas: letras, números, espaços, pontos, hífens, underscores, parênteses, colchetes
			safe = safe.replace(/[^\w\s.\-_()[\]àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞß]/gi, '_');
			
			// Remove underscores múltiplos
			safe = safe.replace(/_+/g, '_');
			
			// Remove pontos e espaços no início/fim
			safe = safe.replace(/^[\s._]+|[\s._]+$/g, '');
			
			// Nomes reservados do Windows
			const reserved = /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i;
			if (reserved.test(safe.split('.')[0])) {
				safe = '_' + safe;
			}
			
			// Limita tamanho (Windows tem limite de 255 chars no nome)
			if (safe.length > 200) {
				const ext = safe.match(/\.[^.]+$/)?.[0] || '';
				safe = safe.slice(0, 200 - ext.length) + ext;
			}
			
			return safe || 'arquivo';
		},
	};

	// ═══════════════════════════════════════════════════════════════════
	// STATE (reativo similar ao Vue)
	// ═══════════════════════════════════════════════════════════════════
	const state = {
		downloading: false,
		paused: false,
		cancelled: false,
		cancelAll: false,
		abortController: null,
		currentFile: null,
		bytesDownloaded: 0,
		totalBytes: 0,
		percent: 0,
		status: '',
		files: [],
		selectedFiles: new Set(),
		// Fila de download
		downloadQueue: [],
		downloadDir: null,
		queueProcessing: false,
		completedCount: 0,
		cancelledCount: 0,
		// Velocidade de download
		downloadSpeed: 0,
		lastSpeedUpdate: 0,
		lastBytesDownloaded: 0,
		// Downloads ativos (para UI múltipla)
		activeDownloads: new Map(), // Map<id, {file, bytesDownloaded, totalBytes, percent, speed, status}>
		// Último checkbox clicado (para seleção com Shift)
		lastCheckedIndex: null,
	};

	// ═══════════════════════════════════════════════════════════════════
	// PERSISTÊNCIA (localStorage)
	// ═══════════════════════════════════════════════════════════════════
	const saveQueueToStorage = (includeActive = false) => {
		try {
			// Inclui arquivos da fila
			const queueData = state.downloadQueue.map(f => ({
				name: f.name,
				filePath: f.filePath,
				href: f.href,
				sizeText: f.sizeText,
			}));
			
			// Se solicitado, inclui também downloads ativos (para salvar antes do F5)
			if (includeActive && state.activeDownloads.size > 0) {
				state.activeDownloads.forEach((dl) => {
					// Verifica se já não está na fila
					if (!queueData.some(f => f.name === dl.file.name)) {
						queueData.unshift({
							name: dl.file.name,
							filePath: dl.file.filePath,
							href: dl.file.href,
							sizeText: dl.file.sizeText,
						});
					}
				});
			}
			
			localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(queueData));
			Logger.info(`Fila salva no localStorage: ${queueData.length} arquivo(s)`);
		} catch (e) {
			Logger.warn('Erro ao salvar fila no localStorage:', e);
		}
	};

	const loadQueueFromStorage = () => {
		try {
			const data = localStorage.getItem(CONFIG.STORAGE_KEY);
			if (data) {
				const queueData = JSON.parse(data);
				return queueData.map(f => ({
					name: f.name,
					displayName: f.name,
					filePath: f.filePath,
					href: f.href,
					sizeText: f.sizeText || '—',
					contentLength: 0,
					row: null,
					downloadBtn: null,
				}));
			}
		} catch (e) {
			Logger.warn('Erro ao carregar fila do localStorage:', e);
		}
		return null;
	};

	const clearQueueStorage = () => {
		try {
			localStorage.removeItem(CONFIG.STORAGE_KEY);
			Logger.info('Fila removida do localStorage');
		} catch (e) {
			// Ignora
		}
	};

	// Rastreia arquivos incompletos para limpeza
	const addIncompleteFile = (fileName) => {
		try {
			const files = JSON.parse(localStorage.getItem(CONFIG.INCOMPLETE_FILES_KEY) || '[]');
			if (!files.includes(fileName)) {
				files.push(fileName);
				localStorage.setItem(CONFIG.INCOMPLETE_FILES_KEY, JSON.stringify(files));
			}
		} catch (e) {
			// Ignora
		}
	};

	const removeIncompleteFileFromStorage = (fileName) => {
		try {
			const files = JSON.parse(localStorage.getItem(CONFIG.INCOMPLETE_FILES_KEY) || '[]');
			const index = files.indexOf(fileName);
			if (index > -1) {
				files.splice(index, 1);
				localStorage.setItem(CONFIG.INCOMPLETE_FILES_KEY, JSON.stringify(files));
			}
		} catch (e) {
			// Ignora
		}
	};

	const getIncompleteFiles = () => {
		try {
			return JSON.parse(localStorage.getItem(CONFIG.INCOMPLETE_FILES_KEY) || '[]');
		} catch (e) {
			return [];
		}
	};

	const clearIncompleteFilesStorage = () => {
		try {
			localStorage.removeItem(CONFIG.INCOMPLETE_FILES_KEY);
		} catch (e) {
			// Ignora
		}
	};

	// Limpa arquivos incompletos do disco
	const cleanupIncompleteFiles = async (dir) => {
		const incompleteFiles = getIncompleteFiles();
		if (incompleteFiles.length === 0 || !dir) return;

		Logger.info(`Limpando ${incompleteFiles.length} arquivo(s) incompleto(s)...`);
		
		for (const fileName of incompleteFiles) {
			try {
				await dir.removeEntry(fileName);
				Logger.info(`Arquivo incompleto removido: ${fileName}`);
			} catch (e) {
				// Arquivo pode não existir mais
			}
		}
		
		clearIncompleteFilesStorage();
		Logger.info('Limpeza de arquivos incompletos concluída');
	};

	// ═══════════════════════════════════════════════════════════════════
	// DETECÇÃO DE ARQUIVOS NA PÁGINA
	// ═══════════════════════════════════════════════════════════════════
	const getCurrentPath = () => {
		// Tenta múltiplas formas de obter o path atual
		
		// Método 1: Hash-based routing (ex: /#/FLAC/Anime/I/)
		if (window.location.hash && window.location.hash.startsWith('#/')) {
			const hashPath = decodeURIComponent(window.location.hash.slice(1)); // Remove o #
			if (hashPath && hashPath !== '/') {
				return hashPath;
			}
		}
		
		// Método 2: Extrai do pathname
		const pathname = decodeURIComponent(window.location.pathname);
		if (pathname && pathname !== '/') {
			return pathname;
		}
		
		// Método 3: Tenta extrair do breadcrumb na página
		const breadcrumbLinks = document.querySelectorAll('nav a, [class*="breadcrumb"] a, [aria-label*="breadcrumb"] a');
		if (breadcrumbLinks.length > 0) {
			const lastBreadcrumb = breadcrumbLinks[breadcrumbLinks.length - 1];
			const href = lastBreadcrumb.getAttribute('href');
			if (href && href !== '/') {
				return decodeURIComponent(href.startsWith('#') ? href.slice(1) : href);
			}
		}
		
		// Método 4: Busca na URL completa por padrões de path
		const urlMatch = window.location.href.match(/nuvem\.anitsu\.moe\/?#?(.+?)(?:\?|$)/);
		if (urlMatch && urlMatch[1]) {
			let path = decodeURIComponent(urlMatch[1]);
			if (!path.startsWith('/')) path = '/' + path;
			return path;
		}
		
		return '/';
	};

	const buildDownloadUrl = (fileName, storedFilePath = null) => {
		// Usa o path armazenado se disponível, senão constrói baseado no path atual
		let filePath;
		if (storedFilePath) {
			filePath = storedFilePath;
		} else {
			const currentPath = getCurrentPath();
			filePath = currentPath.endsWith('/') ? currentPath + fileName : currentPath + '/' + fileName;
		}
		// Tenta diferentes padrões de API comuns
		return `${window.location.origin}/api/raw/?path=${encodeURIComponent(filePath)}`;
	};

	const hasFileExtension = (name) => {
		// Verifica se tem extensão (pelo menos 1 char antes do ponto e 1-10 chars depois)
		return /\.[a-zA-Z0-9]{1,10}$/.test(name);
	};

	const parseFilesFromDOM = () => {
		const files = [];
		const rows = document.querySelectorAll('table tbody tr');
		const currentPath = getCurrentPath(); // Captura o path atual para todos os arquivos

		rows.forEach((row) => {
			// Verifica se é pasta pelo ícone
			const hasFolder = row.querySelector('svg.lucide-folder, svg[class*="folder"]');
			if (hasFolder) return; // Ignora pastas

			// Tenta múltiplas formas de pegar o nome
			let fileName = null;
			
			// Método 1: Link dentro da célula
			const link = row.querySelector('td a');
			if (link) {
				fileName = link.textContent?.trim();
			}
			
			// Método 2: Span com nome
			if (!fileName) {
				const nameSpan = row.querySelector('td span');
				if (nameSpan) {
					fileName = nameSpan.textContent?.trim();
				}
			}
			
			// Método 3: Segunda célula diretamente
			if (!fileName) {
				const cells = row.querySelectorAll('td');
				if (cells.length >= 2) {
					// Pega texto direto, ignorando SVGs
					const textNodes = [];
					cells[1].childNodes.forEach(node => {
						if (node.nodeType === Node.TEXT_NODE) {
							textNodes.push(node.textContent.trim());
						} else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'SVG') {
							textNodes.push(node.textContent.trim());
						}
					});
					fileName = textNodes.filter(t => t).join('').trim();
				}
			}
			
			// Método 4: Primeira célula com link
			if (!fileName) {
				const firstCell = row.querySelector('td:first-child a, td:nth-child(2) a');
				if (firstCell) {
					fileName = firstCell.textContent?.trim();
				}
			}

			if (!fileName) return;
			
			// Filtra arquivos sem extensão (provavelmente pastas)
			if (!hasFileExtension(fileName)) return;

			// Tenta encontrar o tamanho do arquivo
			let sizeText = '—';
			const cells = row.querySelectorAll('td');
			for (const cell of cells) {
				const text = cell.textContent?.trim();
				// Detecta tamanho (ex: 21.1 MB, 500 KB, etc)
				if (/^[\d.,]+\s*(B|KB|MB|GB|TB)$/i.test(text)) {
					sizeText = text;
					break;
				}
			}

			// Botão de download
			const downloadBtn = row.querySelector('svg.lucide-download, svg[class*="download"]')?.closest('button');

			// Constrói o path completo do arquivo no momento da detecção
			const filePath = currentPath.endsWith('/') ? currentPath + fileName : currentPath + '/' + fileName;
			
			files.push({
				name: fileName,
				displayName: fileName,
				sizeText: sizeText,
				contentLength: 0,
				href: null,
				filePath: filePath, // Armazena o path completo para downloads futuros
				row: row,
				downloadBtn: downloadBtn,
			});
		});

		return files;
	};

	// ═══════════════════════════════════════════════════════════════════
	// CAPTURA DE URL DE DOWNLOAD
	// ═══════════════════════════════════════════════════════════════════
	const captureDownloadUrl = (file) => {
		return new Promise((resolve) => {
			// Se já tem URL em cache, usa
			if (file.href) {
				return resolve(file.href);
			}

			const btn = file.downloadBtn;
			// Verifica se o botão ainda existe no DOM
			if (!btn || !document.body.contains(btn)) {
				// Fallback: construir URL (pode falhar se navegou para outra pasta)
				Logger.warn(`Botão de download não encontrado para ${file.name}, usando fallback`);
				return resolve(buildDownloadUrl(file.name, file.filePath));
			}

			// Intercepta window.open para capturar a URL
			const origOpen = window.open;
			let captured = null;

			window.open = (url, ...rest) => {
				captured = url;
				window.open = origOpen;
				return null; // Não abre a aba
			};

			// Dispara o clique
			btn.click();

			// Aguarda um pouco e restaura
			setTimeout(() => {
				window.open = origOpen;
				if (captured) {
					file.href = captured; // Cache para próximas vezes
					Logger.info(`URL capturada: ${captured}`);
					resolve(captured);
				} else {
					// Fallback usando filePath armazenado
					Logger.warn(`Não foi possível capturar URL para ${file.name}, usando fallback`);
					resolve(buildDownloadUrl(file.name, file.filePath));
				}
			}, 150);
		});
	};

	// Pré-captura as URLs de todos os arquivos selecionados ANTES de adicionar à fila
	const preCaptureUrls = async (files) => {
		Logger.info(`Pré-capturando URLs de ${files.length} arquivo(s)...`);
		for (const file of files) {
			if (!file.href && file.downloadBtn && document.body.contains(file.downloadBtn)) {
				await captureDownloadUrl(file);
				// Pequeno delay entre capturas para não sobrecarregar
				await new Promise(r => setTimeout(r, 100));
			}
		}
		Logger.info('Pré-captura de URLs concluída');
	};

	// ═══════════════════════════════════════════════════════════════════
	// DOWNLOAD
	// ═══════════════════════════════════════════════════════════════════
	const waitWhilePaused = () => {
		return new Promise((resolve) => {
			const check = () => {
				if (!state.paused || state.cancelled || state.cancelAll) {
					resolve();
				} else {
					setTimeout(check, 100);
				}
			};
			check();
		});
	};

	const downloadFile = async (dir, file, updateUI) => {
		const downloadUrl = await captureDownloadUrl(file);
		Logger.info(`Baixando: ${file.name} de ${downloadUrl}`);

		// Cria ID único para este download
		const downloadId = Date.now() + '-' + Math.random().toString(36).substr(2, 9);
		const downloadState = {
			file: file,
			bytesDownloaded: 0,
			totalBytes: 0,
			percent: 0,
			speed: 0,
			status: 'downloading',
			lastSpeedUpdate: Date.now(),
			lastBytesDownloaded: 0,
			abortController: new AbortController(),
		};
		state.activeDownloads.set(downloadId, downloadState);

		state.currentFile = file;
		state.bytesDownloaded = 0;
		state.percent = 0;
		state.status = 'downloading';
		state.cancelled = false;
		state.abortController = downloadState.abortController;
		// Reset velocidade
		state.downloadSpeed = 0;
		state.lastSpeedUpdate = Date.now();
		state.lastBytesDownloaded = 0;
		updateUI();

		const safeName = Helper.sanitizeName(file.name);
		const fileHandle = await dir.getFileHandle(safeName, { create: true });

		// Registra como arquivo incompleto (será removido do registro quando concluir)
		addIncompleteFile(safeName);

		// Verifica se já existe
		const existingFile = await fileHandle.getFile();
		if (existingFile.size > 10) {
			Logger.info(`Arquivo já existe: ${file.name}, pulando...`);
			state.status = 'skipped';
			state.activeDownloads.delete(downloadId);
			updateUI();
			return 'skipped';
		}

		// Função auxiliar para remover arquivo incompleto
		const removeIncompleteFile = async () => {
			try {
				await dir.removeEntry(safeName);
				Logger.info(`Arquivo incompleto removido: ${safeName}`);
			} catch (e) {
				// Ignora erro se arquivo não existir
			}
		};

		let writable;
		try {
			writable = await fileHandle.createWritable();

			const response = await fetch(downloadUrl, { 
				credentials: 'include',
				signal: downloadState.abortController.signal 
			});
			if (!response.ok || !response.body) {
				throw new Error(`Falha ao baixar: ${response.status}`);
			}

			downloadState.totalBytes = Number(response.headers.get('Content-Length')) || 0;
			state.totalBytes = downloadState.totalBytes;
			file.contentLength = downloadState.totalBytes;

			const reader = response.body.getReader();

			while (true) {
				// Verifica pausa
				if (state.paused) {
					downloadState.status = 'paused';
					state.status = 'paused';
					updateUI();
					await waitWhilePaused();
					downloadState.status = 'downloading';
					state.status = 'downloading';
					updateUI();
				}

				// Verifica cancelamento
				if (state.cancelled || state.cancelAll) {
					Logger.warn(`Download cancelado: ${file.name}`);
					await reader.cancel();
					await writable.abort();
					await removeIncompleteFile();
					downloadState.status = 'cancelled';
					state.status = 'cancelled';
					state.activeDownloads.delete(downloadId);
					updateUI();
					return 'cancelled';
				}

				const { done, value } = await reader.read();
				if (done) break;

				downloadState.bytesDownloaded += value.length;
				state.bytesDownloaded = downloadState.bytesDownloaded;
				if (downloadState.totalBytes) {
					downloadState.percent = Number(((downloadState.bytesDownloaded / downloadState.totalBytes) * 100).toFixed(2));
					state.percent = downloadState.percent;
				}
				
				// Calcula velocidade a cada 500ms
				const now = Date.now();
				const timeDiff = now - downloadState.lastSpeedUpdate;
				if (timeDiff >= 500) {
					const bytesDiff = downloadState.bytesDownloaded - downloadState.lastBytesDownloaded;
					downloadState.speed = (bytesDiff / timeDiff) * 1000;
					state.downloadSpeed = downloadState.speed;
					downloadState.lastSpeedUpdate = now;
					downloadState.lastBytesDownloaded = downloadState.bytesDownloaded;
				}
				updateUI();

				await writable.write(value);
			}

			downloadState.percent = 100;
			state.percent = 100;
			await writable.close();
			downloadState.status = 'success';
			state.status = 'success';
			state.activeDownloads.delete(downloadId);
			
			// Remove do rastreamento de incompletos
			removeIncompleteFileFromStorage(safeName);
			
			updateUI();

			Logger.info(`Concluído: ${file.name}`);
			return 'success';
		} catch (err) {
			if (err.name === 'AbortError') {
				Logger.warn(`Download abortado: ${file.name}`);
				if (writable) await writable.abort().catch(() => {});
				await removeIncompleteFile();
				downloadState.status = 'cancelled';
				state.status = 'cancelled';
				state.activeDownloads.delete(downloadId);
				updateUI();
				return 'cancelled';
			}
			state.activeDownloads.delete(downloadId);
			await removeIncompleteFile();
			throw err;
		}
	};

	const addToQueue = (files) => {
		// Adiciona arquivos à fila (evita duplicatas por nome)
		const existingNames = new Set(state.downloadQueue.map(f => f.name));
		let added = 0;
		for (const file of files) {
			if (!existingNames.has(file.name)) {
				state.downloadQueue.push(file);
				existingNames.add(file.name);
				added++;
			}
		}
		Logger.info(`${added} arquivo(s) adicionado(s) à fila. Total na fila: ${state.downloadQueue.length}`);
		
		// Salva no localStorage para poder retomar após F5
		saveQueueToStorage();
		
		return added;
	};

	const processQueue = async (updateUI) => {
		// Se já está processando, apenas retorna (os novos arquivos serão processados pelo loop existente)
		if (state.queueProcessing) {
			Logger.info('Fila já está sendo processada, arquivos serão baixados em sequência.');
			return;
		}

		// Se não tem diretório selecionado, pede
		if (!state.downloadDir) {
			try {
				state.downloadDir = await window.showDirectoryPicker({ mode: 'readwrite' });
			} catch (e) {
				Logger.warn('Seleção de pasta cancelada');
				// Mantém a fila salva para tentar novamente depois
				saveQueueToStorage();
				alert('Seleção de pasta cancelada.\n\nA fila foi mantida e você pode tentar novamente clicando em "Download Manager".');
				// Atualiza UI para mostrar a fila pendente
				updateUI();
				return;
			}
		}

		state.queueProcessing = true;
		state.downloading = true;
		state.cancelAll = false;
		state.paused = false;
		state.completedCount = 0;
		state.cancelledCount = 0;
		updateUI();

		try {
			// Processa a fila com downloads simultâneos
			const maxSimultaneous = CONFIG.SIMULTANEOUS_DOWNLOADS || 2;
			const activeDownloads = new Set();

			const startNextDownload = async () => {
				if (state.cancelAll || state.downloadQueue.length === 0) return;

				const file = state.downloadQueue.shift();
				if (!file) return;
				
				// Atualiza localStorage após remover da fila
				saveQueueToStorage();

				const downloadId = Symbol();
				activeDownloads.add(downloadId);
				Logger.info(`Iniciando: ${file.name} (${activeDownloads.size} ativo(s), ${state.downloadQueue.length} na fila)`);

				try {
					const result = await downloadFile(state.downloadDir, file, updateUI);
					if (result === 'success' || result === 'skipped') state.completedCount++;
					if (result === 'cancelled') state.cancelledCount++;
				} catch (err) {
					Logger.error(`Erro ao baixar ${file.name}:`, err);
					state.cancelledCount++;
				} finally {
					activeDownloads.delete(downloadId);
				}
			};

			// Loop principal - mantém sempre o máximo de downloads ativos
			while (state.downloadQueue.length > 0 || activeDownloads.size > 0) {
				if (state.cancelAll) {
					Logger.warn('Download em lote cancelado!');
					// Aguarda downloads ativos terminarem
					while (activeDownloads.size > 0) {
						await new Promise(r => setTimeout(r, 100));
					}
					break;
				}

				// Inicia novos downloads até atingir o limite
				while (activeDownloads.size < maxSimultaneous && state.downloadQueue.length > 0 && !state.cancelAll) {
					startNextDownload(); // Não usa await para iniciar em paralelo
					await new Promise(r => setTimeout(r, 100)); // Pequeno delay entre inícios
				}

				// Aguarda um pouco antes de verificar novamente
				await new Promise(r => setTimeout(r, 200));
			}
			
			if (state.cancelAll) {
				alert(`Download cancelado! ${state.completedCount} arquivo(s) concluído(s), ${state.cancelledCount} cancelado(s).`);
			} else {
				Logger.info('Fila de download concluída!');
				alert(`Download concluído! ${state.completedCount} arquivo(s) baixado(s).`);
			}
			
			// Limpa localStorage quando terminar
			clearQueueStorage();
		} catch (err) {
			Logger.error('Erro no download:', err);
			state.status = 'error';
			updateUI();
		} finally {
			state.queueProcessing = false;
			state.downloading = false;
			state.paused = false;
			state.cancelAll = false;
			state.cancelled = false;
			state.downloadDir = null; // Reset para próxima sessão
			updateUI();
		}
	};

	// ═══════════════════════════════════════════════════════════════════
	// UI - DRAWER/MENU
	// ═══════════════════════════════════════════════════════════════════
	const injectStyles = () => {
		if (document.getElementById('anitsu-dl-styles')) return;
		const style = document.createElement('style');
		style.id = 'anitsu-dl-styles';
		style.textContent = `
			#anitsu-dl-btn {
				position: fixed;
				top: 16px;
				right: 16px;
				z-index: 9999;
				padding: 10px 18px;
				border-radius: 8px;
				background: linear-gradient(135deg, ${CONFIG.ACCENT_COLOR}, #7f1d1d);
				border: none;
				color: white;
				cursor: pointer;
				box-shadow: 0 4px 20px rgba(196, 30, 58, 0.4);
				display: flex;
				align-items: center;
				justify-content: center;
				gap: 8px;
				transition: transform 0.2s, box-shadow 0.2s;
				font-family: Inter, system-ui, sans-serif;
				font-size: 14px;
				font-weight: 600;
				letter-spacing: 0.3px;
			}
			#anitsu-dl-btn:hover {
				transform: scale(1.05);
				box-shadow: 0 6px 30px rgba(196, 30, 58, 0.6);
			}

			/* Oculta coluna de checkbox da tabela original */
			table thead th:first-child,
			table tbody tr td:first-child {
				display: none !important;
			}

			#anitsu-dl-drawer {
				position: fixed;
				top: 0;
				right: -400px;
				width: 380px;
				height: 100vh;
				background: #1a1a1c;
				z-index: 10000;
				transition: right 0.3s ease;
				display: flex;
				flex-direction: column;
				color: #f7f7f7;
				font-family: Inter, system-ui, sans-serif;
				box-shadow: -5px 0 30px rgba(0,0,0,0.5);
			}
			#anitsu-dl-drawer.open {
				right: 0;
			}

			#anitsu-dl-drawer-header {
				padding: 20px;
				background: linear-gradient(135deg, ${CONFIG.ACCENT_COLOR}, #7f1d1d);
				font-size: 18px;
				font-weight: bold;
				display: flex;
				justify-content: space-between;
				align-items: center;
			}
			#anitsu-dl-drawer-header button {
				background: none;
				border: none;
				color: white;
				cursor: pointer;
				font-size: 24px;
				line-height: 1;
			}

			#anitsu-dl-drawer-content {
				flex: 1;
				overflow-y: auto;
				padding: 16px;
			}

			.anitsu-dl-section {
				margin-bottom: 16px;
			}
			.anitsu-dl-section-title {
				font-size: 12px;
				text-transform: uppercase;
				color: #888;
				margin-bottom: 8px;
				letter-spacing: 0.5px;
			}

			.anitsu-dl-progress {
				background: #2a2a2c;
				border-radius: 8px;
				padding: 12px;
				margin-bottom: 12px;
				position: relative;
			}
			.anitsu-dl-progress-cancel {
				position: absolute;
				top: 8px;
				right: 8px;
				background: rgba(239, 68, 68, 0.2);
				border: none;
				border-radius: 4px;
				color: #ef4444;
				width: 22px;
				height: 22px;
				cursor: pointer;
				display: flex;
				align-items: center;
				justify-content: center;
				transition: background 0.2s, color 0.2s;
				padding: 0;
			}
			.anitsu-dl-progress-cancel:hover {
				background: #ef4444;
				color: white;
			}
			.anitsu-dl-progress-cancel svg {
				width: 14px;
				height: 14px;
			}
			.anitsu-dl-progress-bar {
				height: 8px;
				background: #333;
				border-radius: 4px;
				overflow: hidden;
				margin: 8px 0;
			}
			.anitsu-dl-progress-fill {
				height: 100%;
				background: linear-gradient(90deg, ${CONFIG.ACCENT_COLOR}, #ff6b6b);
				transition: width 0.2s;
			}
			.anitsu-dl-progress-text {
				display: flex;
				justify-content: space-between;
				font-size: 12px;
				color: #aaa;
			}
			.anitsu-dl-progress-file {
				font-weight: 600;
				color: #fff;
				margin-bottom: 4px;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
			.anitsu-dl-controls {
				display: flex;
				gap: 8px;
				margin-top: 10px;
			}
			.anitsu-dl-controls button {
				flex: 1;
				padding: 8px 12px;
				border: none;
				border-radius: 6px;
				font-size: 12px;
				font-weight: 600;
				cursor: pointer;
				display: flex;
				align-items: center;
				justify-content: center;
				gap: 6px;
				transition: background 0.2s;
			}
			.anitsu-dl-controls button svg {
				width: 14px;
				height: 14px;
			}
			.anitsu-dl-btn-pause {
				background: #3b82f6;
				color: white;
			}
			.anitsu-dl-btn-pause:hover {
				background: #2563eb;
			}
			.anitsu-dl-btn-pause.paused {
				background: #22c55e;
			}
			.anitsu-dl-btn-pause.paused:hover {
				background: #16a34a;
			}
			.anitsu-dl-btn-cancel {
				background: #f97316;
				color: white;
			}
			.anitsu-dl-btn-cancel:hover {
				background: #ea580c;
			}
			.anitsu-dl-btn-cancel-all {
				background: #ef4444;
				color: white;
			}
			.anitsu-dl-btn-cancel-all:hover {
				background: #dc2626;
			}
			.anitsu-dl-status {
				font-size: 11px;
				color: #888;
				margin-top: 6px;
				text-align: center;
			}
			.anitsu-dl-status.paused { color: #3b82f6; }
			.anitsu-dl-status.cancelled { color: #ef4444; }

			.anitsu-dl-queue-toggle {
				display: flex;
				align-items: center;
				justify-content: space-between;
				cursor: pointer;
				padding: 8px 0;
			}
			.anitsu-dl-queue-toggle:hover {
				color: ${CONFIG.ACCENT_COLOR};
			}
			.anitsu-dl-queue-toggle svg {
				width: 16px;
				height: 16px;
				transition: transform 0.2s;
			}
			.anitsu-dl-queue-toggle.expanded svg {
				transform: rotate(180deg);
			}
			.anitsu-dl-queue-list {
				max-height: 200px;
				overflow-y: auto;
				display: none;
			}
			.anitsu-dl-queue-list.show {
				display: block;
			}
			.anitsu-dl-queue-item {
				display: flex;
				align-items: center;
				padding: 8px;
				background: #2a2a2c;
				border-radius: 6px;
				margin-bottom: 4px;
				gap: 8px;
			}
			.anitsu-dl-queue-item .position {
				font-size: 11px;
				color: #666;
				width: 20px;
				text-align: center;
			}
			.anitsu-dl-queue-item .name {
				flex: 1;
				font-size: 12px;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
			.anitsu-dl-queue-item .actions {
				display: flex;
				gap: 4px;
			}
			.anitsu-dl-queue-item .actions button {
				background: #444;
				border: none;
				border-radius: 4px;
				color: white;
				width: 24px;
				height: 24px;
				cursor: pointer;
				display: flex;
				align-items: center;
				justify-content: center;
				transition: background 0.2s;
			}
			.anitsu-dl-queue-item .actions button:hover {
				background: #555;
			}
			.anitsu-dl-queue-item .actions button.remove:hover {
				background: #ef4444;
			}
			.anitsu-dl-queue-item .actions button svg {
				width: 14px;
				height: 14px;
			}
			.anitsu-dl-queue-item .actions button:disabled {
				opacity: 0.3;
				cursor: not-allowed;
			}
			.anitsu-dl-queue-empty {
				text-align: center;
				color: #666;
				font-size: 12px;
				padding: 12px;
			}
			.anitsu-dl-queue-actions {
				display: flex;
				gap: 8px;
				margin-top: 8px;
			}
			.anitsu-dl-queue-actions button {
				flex: 1;
				padding: 10px 16px;
				border: none;
				border-radius: 6px;
				color: white;
				font-size: 13px;
				font-weight: 600;
				cursor: pointer;
				display: flex;
				align-items: center;
				justify-content: center;
				gap: 8px;
				transition: background 0.2s, transform 0.1s;
			}
			.anitsu-dl-queue-actions button:disabled {
				opacity: 0.5;
				cursor: not-allowed;
				transform: none;
			}
			.anitsu-dl-queue-actions button:hover:not(:disabled) {
				transform: scale(1.02);
			}
			.anitsu-dl-queue-actions button svg {
				width: 16px;
				height: 16px;
			}
			.anitsu-dl-btn-start-queue {
				background: linear-gradient(90deg, #22c55e, #16a34a);
			}
			.anitsu-dl-btn-start-queue:hover:not(:disabled) {
				background: linear-gradient(90deg, #16a34a, #15803d);
			}
			.anitsu-dl-btn-clear-queue {
				background: #ef4444;
			}
			.anitsu-dl-btn-clear-queue:hover:not(:disabled) {
				background: #dc2626;
			}

			.anitsu-dl-file-list {
				max-height: 300px;
				overflow-y: auto;
			}
			.anitsu-dl-file-item {
				display: flex;
				align-items: center;
				padding: 10px;
				background: #2a2a2c;
				border-radius: 8px;
				margin-bottom: 6px;
				gap: 10px;
			}
			.anitsu-dl-file-item input[type="checkbox"] {
				accent-color: ${CONFIG.ACCENT_COLOR};
				width: 18px;
				height: 18px;
				cursor: pointer;
			}
			.anitsu-dl-file-item .name {
				flex: 1;
				font-size: 13px;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
			.anitsu-dl-file-item .size {
				font-size: 11px;
				color: #888;
			}

			.anitsu-dl-actions {
				padding: 16px;
				border-top: 1px solid #333;
				display: flex;
				gap: 8px;
			}
			.anitsu-dl-actions button {
				flex: 1;
				padding: 12px;
				border: none;
				border-radius: 8px;
				font-weight: 600;
				cursor: pointer;
				transition: opacity 0.2s;
			}
			.anitsu-dl-actions button:disabled {
				opacity: 0.5;
				cursor: not-allowed;
			}
			.anitsu-dl-btn-primary {
				background: linear-gradient(90deg, ${CONFIG.ACCENT_COLOR}, #7f1d1d);
				color: white;
			}
			.anitsu-dl-btn-secondary {
				background: #333;
				color: white;
			}

			#anitsu-dl-backdrop {
				position: fixed;
				inset: 0;
				background: rgba(0,0,0,0.5);
				z-index: 9999;
				display: none;
			}
			#anitsu-dl-backdrop.show {
				display: block;
			}
		`;
		document.head.appendChild(style);
	};

	const createUI = () => {
		// Botão flutuante
		const btn = document.createElement('button');
		btn.id = 'anitsu-dl-btn';
		btn.innerHTML = `Download Manager`;
		btn.title = 'Abrir Gerenciador de Downloads';

		// Backdrop
		const backdrop = document.createElement('div');
		backdrop.id = 'anitsu-dl-backdrop';

		// Drawer
		const drawer = document.createElement('div');
		drawer.id = 'anitsu-dl-drawer';
		drawer.innerHTML = `
			<div id="anitsu-dl-drawer-header">
				<span>Anitsu Downloader</span>
				<button id="anitsu-dl-close">&times;</button>
			</div>
			<div id="anitsu-dl-drawer-content">
				<div class="anitsu-dl-section" id="anitsu-dl-progress-section" style="display:none;">
					<div class="anitsu-dl-section-title">Downloads Ativos (<span id="anitsu-dl-active-count">0</span>)</div>
					<div id="anitsu-dl-active-downloads"></div>
					<div class="anitsu-dl-controls">
						<button class="anitsu-dl-btn-pause" id="anitsu-dl-pause" title="Pausar/Retomar">
							<svg id="anitsu-dl-pause-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
							<span id="anitsu-dl-pause-text">Pausar</span>
						</button>
						<button class="anitsu-dl-btn-cancel-all" id="anitsu-dl-cancel-all" title="Cancelar todos os downloads">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg>
							Cancelar Tudo
						</button>
					</div>
					<div class="anitsu-dl-status" id="anitsu-dl-status"></div>
				</div>
				<div class="anitsu-dl-section" id="anitsu-dl-queue-section" style="display:none;">
					<div class="anitsu-dl-queue-toggle" id="anitsu-dl-queue-toggle">
						<span class="anitsu-dl-section-title" style="margin:0;">Fila de Download (<span id="anitsu-dl-queue-count">0</span>)</span>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
					</div>
					<div class="anitsu-dl-queue-list" id="anitsu-dl-queue-list"></div>
					<div class="anitsu-dl-queue-actions">
						<button class="anitsu-dl-btn-start-queue" id="anitsu-dl-start-queue">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
							Iniciar Downloads
						</button>
						<button class="anitsu-dl-btn-clear-queue" id="anitsu-dl-clear-queue">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
							Limpar Fila
						</button>
					</div>
				</div>
				<div class="anitsu-dl-section">
					<div class="anitsu-dl-section-title">Arquivos (<span id="anitsu-dl-count">0</span>)</div>
					<div class="anitsu-dl-file-list" id="anitsu-dl-file-list"></div>
				</div>
			</div>
			<div class="anitsu-dl-actions">
				<button class="anitsu-dl-btn-secondary" id="anitsu-dl-select-all">Selecionar Todos</button>
				<button class="anitsu-dl-btn-primary" id="anitsu-dl-start" disabled>Adicionar à Fila</button>
			</div>
		`;

		document.body.appendChild(backdrop);
		document.body.appendChild(drawer);
		document.body.appendChild(btn);

		return { btn, backdrop, drawer };
	};

	const updateUI = () => {
		const progressSection = document.getElementById('anitsu-dl-progress-section');
		const activeDownloadsContainer = document.getElementById('anitsu-dl-active-downloads');
		const activeCountEl = document.getElementById('anitsu-dl-active-count');
		const startBtn = document.getElementById('anitsu-dl-start');
		const pauseBtn = document.getElementById('anitsu-dl-pause');
		const pauseIcon = document.getElementById('anitsu-dl-pause-icon');
		const pauseText = document.getElementById('anitsu-dl-pause-text');
		const statusEl = document.getElementById('anitsu-dl-status');

		// Renderiza downloads ativos
		if (state.downloading && state.activeDownloads.size > 0) {
			progressSection.style.display = 'block';
			activeCountEl.textContent = state.activeDownloads.size;
			
			// Renderiza cada download ativo
			activeDownloadsContainer.innerHTML = '';
			state.activeDownloads.forEach((dl, id) => {
				const progressDiv = document.createElement('div');
				progressDiv.className = 'anitsu-dl-progress';
				progressDiv.innerHTML = `
					<button class="anitsu-dl-progress-cancel" title="Cancelar este download">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
					</button>
					<div class="anitsu-dl-progress-file" title="${dl.file.name}">${dl.file.name}</div>
					<div class="anitsu-dl-progress-bar">
						<div class="anitsu-dl-progress-fill" style="width:${dl.percent}%"></div>
					</div>
					<div class="anitsu-dl-progress-text">
						<span>${dl.percent}%</span>
						<span>${Helper.getSpeed(dl.speed)}</span>
						<span>${Helper.getSize(dl.bytesDownloaded)} / ${Helper.getSize(dl.totalBytes)}</span>
					</div>
				`;
				
				// Botão de cancelar individual
				const cancelBtn = progressDiv.querySelector('.anitsu-dl-progress-cancel');
				cancelBtn.addEventListener('click', () => {
					if (dl.abortController) {
						Logger.info(`Cancelando download: ${dl.file.name}`);
						dl.abortController.abort();
					}
				});
				
				activeDownloadsContainer.appendChild(progressDiv);
			});
			
			// Atualiza botão pause/play
			if (pauseBtn) {
				if (state.paused) {
					pauseBtn.classList.add('paused');
					pauseIcon.innerHTML = '<polygon points="5 3 19 12 5 21 5 3"/>';
					pauseText.textContent = 'Retomar';
				} else {
					pauseBtn.classList.remove('paused');
					pauseIcon.innerHTML = '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>';
					pauseText.textContent = 'Pausar';
				}
			}
			
			// Atualiza status
			if (statusEl) {
				const queueInfo = state.downloadQueue.length > 0 ? `${state.downloadQueue.length} na fila` : '';
				if (state.paused) {
					statusEl.textContent = 'Downloads pausados' + (queueInfo ? ` | ${queueInfo}` : '');
					statusEl.className = 'anitsu-dl-status paused';
				} else {
					statusEl.textContent = queueInfo;
					statusEl.className = 'anitsu-dl-status';
				}
			}
		} else if (state.downloading) {
			// Baixando mas sem downloads ativos no momento (transição)
			progressSection.style.display = 'block';
			activeCountEl.textContent = '0';
			activeDownloadsContainer.innerHTML = '<div class="anitsu-dl-queue-empty">Iniciando...</div>';
		} else {
			if (progressSection) progressSection.style.display = 'none';
		}

	// Mostra/esconde seção de fila
	const queueSection = document.getElementById('anitsu-dl-queue-section');
	const queueCountEl = document.getElementById('anitsu-dl-queue-count');
	if (queueSection) {
		// Mostra fila se tiver itens (mesmo sem estar baixando)
		if (state.downloadQueue.length > 0) {
			queueSection.style.display = 'block';
			queueCountEl.textContent = state.downloadQueue.length;
			renderQueueList();
		} else if (state.downloading) {
			// Se está baixando mas fila está vazia, ainda mostra a seção
			queueSection.style.display = 'block';
			queueCountEl.textContent = '0';
			renderQueueList();
		} else {
			queueSection.style.display = 'none';
		}
	}

	// Permite adicionar arquivos mesmo durante download
	startBtn.disabled = state.selectedFiles.size === 0;
	
	// Texto do botão - sempre "Adicionar à Fila"
	if (state.selectedFiles.size > 0) {
		startBtn.textContent = `Adicionar à Fila (${state.selectedFiles.size})`;
	} else {
		startBtn.textContent = `Adicionar à Fila`;
	}
	
	// Atualiza estado do botão "Iniciar Downloads"
	const startQueueBtn = document.getElementById('anitsu-dl-start-queue');
	const clearQueueBtn = document.getElementById('anitsu-dl-clear-queue');
	if (startQueueBtn) {
		if (state.downloading) {
			startQueueBtn.disabled = true;
			startQueueBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> Baixando...`;
		} else if (state.downloadQueue.length === 0) {
			startQueueBtn.disabled = true;
			startQueueBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg> Iniciar Downloads`;
		} else {
			startQueueBtn.disabled = false;
			startQueueBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg> Iniciar (${state.downloadQueue.length})`;
		}
	}
	if (clearQueueBtn) {
		// Desabilita durante download ou se não há nada para limpar
		const hasIncomplete = getIncompleteFiles().length > 0;
		clearQueueBtn.disabled = state.downloading || (state.downloadQueue.length === 0 && !hasIncomplete);
	}
};

	const renderQueueList = () => {
		const queueList = document.getElementById('anitsu-dl-queue-list');
		if (!queueList) return;

		queueList.innerHTML = '';

		if (state.downloadQueue.length === 0) {
			queueList.innerHTML = '<div class="anitsu-dl-queue-empty">Fila vazia</div>';
			return;
		}

		state.downloadQueue.forEach((file, index) => {
			const item = document.createElement('div');
			item.className = 'anitsu-dl-queue-item';
			item.innerHTML = `
				<span class="position">${index + 1}</span>
				<span class="name" title="${file.name}">${file.name}</span>
				<div class="actions">
					<button class="up" title="Subir na fila" ${index === 0 ? 'disabled' : ''}>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"/></svg>
					</button>
					<button class="down" title="Descer na fila" ${index === state.downloadQueue.length - 1 ? 'disabled' : ''}>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
					</button>
					<button class="remove" title="Remover da fila">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
					</button>
				</div>
			`;
			queueList.appendChild(item);

			// Botão subir
			item.querySelector('.up').addEventListener('click', () => {
				if (index > 0) {
					[state.downloadQueue[index - 1], state.downloadQueue[index]] = 
						[state.downloadQueue[index], state.downloadQueue[index - 1]];
					renderQueueList();
				}
			});

			// Botão descer
			item.querySelector('.down').addEventListener('click', () => {
				if (index < state.downloadQueue.length - 1) {
					[state.downloadQueue[index], state.downloadQueue[index + 1]] = 
						[state.downloadQueue[index + 1], state.downloadQueue[index]];
					renderQueueList();
				}
			});

			// Botão remover
			item.querySelector('.remove').addEventListener('click', () => {
				state.downloadQueue.splice(index, 1);
				document.getElementById('anitsu-dl-queue-count').textContent = state.downloadQueue.length;
				renderQueueList();
				updateUI();
			});
		});
	};

	const renderFileList = () => {
		const fileList = document.getElementById('anitsu-dl-file-list');
		const countEl = document.getElementById('anitsu-dl-count');

		// Limpa seleção anterior ao atualizar lista
		state.selectedFiles.clear();
		
		state.files = parseFilesFromDOM();
		countEl.textContent = state.files.length;

		fileList.innerHTML = '';
		state.files.forEach((file, index) => {
			const item = document.createElement('div');
			item.className = 'anitsu-dl-file-item';
			item.innerHTML = `
				<input type="checkbox" data-index="${index}">
				<span class="name" title="${file.name}">${file.name}</span>
				<span class="size">${file.sizeText}</span>
			`;
			fileList.appendChild(item);

			const checkbox = item.querySelector('input');
			checkbox.addEventListener('click', (e) => {
				const currentIndex = parseInt(checkbox.dataset.index);
				const isChecked = checkbox.checked;
				
				// Se Shift está pressionado e há um último índice
				if (e.shiftKey && state.lastCheckedIndex !== null && state.lastCheckedIndex !== currentIndex) {
					const start = Math.min(state.lastCheckedIndex, currentIndex);
					const end = Math.max(state.lastCheckedIndex, currentIndex);
					
					// Seleciona/deseleciona todos os checkboxes no range
					const allCheckboxes = fileList.querySelectorAll('input[type="checkbox"]');
					for (let i = start; i <= end; i++) {
						const cb = allCheckboxes[i];
						if (cb) {
							cb.checked = isChecked;
							const idx = parseInt(cb.dataset.index);
							if (isChecked) {
								state.selectedFiles.add(idx);
							} else {
								state.selectedFiles.delete(idx);
							}
						}
					}
				} else {
					// Seleção normal
					if (isChecked) {
						state.selectedFiles.add(currentIndex);
					} else {
						state.selectedFiles.delete(currentIndex);
					}
				}
				
				// Atualiza último índice clicado
				state.lastCheckedIndex = currentIndex;
				
				updateUI();
			});
		});

		updateUI();
	};

	// ═══════════════════════════════════════════════════════════════════
	// FORÇAR VISUALIZAÇÃO EM LISTA
	// ═══════════════════════════════════════════════════════════════════
	const forceListView = () => {
		// Clica no botão de lista se não estiver ativo
		const listBtn = document.querySelector('button[title="List view"]');
		const gridBtn = document.querySelector('button[title="Grid view"]');
		
		if (listBtn && listBtn.getAttribute('data-variant') !== 'default') {
			listBtn.click();
			Logger.info('Visualização em lista forçada');
		}
		
		// Remove/esconde o botão de grid
		if (gridBtn) {
			gridBtn.style.display = 'none';
		}
	};

	// ═══════════════════════════════════════════════════════════════════
	// INIT
	// ═══════════════════════════════════════════════════════════════════
	const init = () => {
		Logger.info('Iniciando...');
		
		// Salva estado antes de fechar/recarregar a página (F5)
		window.addEventListener('beforeunload', () => {
			if (state.downloading || state.downloadQueue.length > 0 || state.activeDownloads.size > 0) {
				// Salva fila + downloads ativos
				saveQueueToStorage(true);
				Logger.info('Estado salvo antes de fechar a página');
			}
		});
		
		// Verifica se há fila pendente do localStorage
		const pendingQueue = loadQueueFromStorage();
		if (pendingQueue && pendingQueue.length > 0) {
			Logger.info(`Fila pendente encontrada: ${pendingQueue.length} arquivo(s)`);
			
			// Aguarda a tabela de arquivos carregar antes de mostrar o diálogo
			const waitForTable = () => {
				return new Promise((resolve) => {
					const check = () => {
						const table = document.querySelector('table tbody tr');
						if (table) {
							Logger.info('Tabela de arquivos carregada');
							resolve();
						} else {
							setTimeout(check, 200);
						}
					};
					// Dá um tempo inicial para a página carregar
					setTimeout(check, 300);
					// Timeout máximo de 5 segundos
					setTimeout(resolve, 5000);
				});
			};
			
			// Pergunta se quer retomar (após a tabela carregar)
			waitForTable().then(async () => {
				const incompleteFiles = getIncompleteFiles();
				const hasIncomplete = incompleteFiles.length > 0;
				
				const message = `Há ${pendingQueue.length} arquivo(s) pendente(s) de uma sessão anterior.` +
					(hasIncomplete ? `\n\nTambém há ${incompleteFiles.length} arquivo(s) incompleto(s) no disco.` : '') +
					`\n\nDeseja retomar os downloads?`;
				
				if (confirm(message)) {
					// Restaura a fila (usuário iniciará manualmente)
					state.downloadQueue = pendingQueue;
					Logger.info('Fila restaurada do localStorage');
					
					// Abre o drawer para o usuário ver a fila
					const drawer = document.getElementById('anitsu-dl-drawer');
					const backdrop = document.getElementById('anitsu-dl-backdrop');
					if (drawer && backdrop) {
						// Renderiza a lista de arquivos da pasta atual
						renderFileList();
						drawer.classList.add('open');
						backdrop.classList.add('show');
					}
					
					updateUI();
					alert('Fila restaurada!\n\nClique em "Iniciar Downloads" para começar.');
				} else {
					// Limpa a fila se não quiser retomar
					clearQueueStorage();
					Logger.info('Fila pendente descartada pelo usuário');
					
					// Oferece limpar arquivos incompletos
					if (hasIncomplete && confirm(`Deseja excluir os ${incompleteFiles.length} arquivo(s) incompleto(s) do disco?\n\nVocê precisará selecionar a pasta de downloads.`)) {
						try {
							const dir = await window.showDirectoryPicker({ mode: 'readwrite' });
							await cleanupIncompleteFiles(dir);
							alert('Arquivos incompletos removidos com sucesso!');
						} catch (e) {
							Logger.warn('Limpeza cancelada ou erro:', e);
							clearIncompleteFilesStorage(); // Limpa o registro mesmo assim
						}
					} else {
						clearIncompleteFilesStorage();
					}
				}
			});
		}
		
		// Força visualização em lista
		forceListView();
		// Observa mudanças para reforçar lista quando navegar
		const viewObserver = new MutationObserver(() => {
			forceListView();
		});
		viewObserver.observe(document.body, { childList: true, subtree: true });

		injectStyles();
		const { btn, backdrop, drawer } = createUI();

		const openDrawer = () => {
			renderFileList();
			drawer.classList.add('open');
			backdrop.classList.add('show');
		};

		const closeDrawer = () => {
			drawer.classList.remove('open');
			backdrop.classList.remove('show');
		};

		btn.addEventListener('click', openDrawer);
		backdrop.addEventListener('click', closeDrawer);
		document.getElementById('anitsu-dl-close').addEventListener('click', closeDrawer);

		// Alternar expandir/recolher fila
		document.getElementById('anitsu-dl-queue-toggle').addEventListener('click', () => {
			const toggle = document.getElementById('anitsu-dl-queue-toggle');
			const queueList = document.getElementById('anitsu-dl-queue-list');
			toggle.classList.toggle('expanded');
			queueList.classList.toggle('show');
		});

		document.getElementById('anitsu-dl-select-all').addEventListener('click', () => {
			const checkboxes = document.querySelectorAll('#anitsu-dl-file-list input[type="checkbox"]');
			const allChecked = state.selectedFiles.size === state.files.length;

			checkboxes.forEach((cb, index) => {
				cb.checked = !allChecked;
				if (!allChecked) {
					state.selectedFiles.add(index);
				} else {
					state.selectedFiles.delete(index);
				}
			});
			updateUI();
		});

		document.getElementById('anitsu-dl-start').addEventListener('click', async () => {
			const selectedFiles = Array.from(state.selectedFiles).map((i) => state.files[i]);
			if (selectedFiles.length === 0) return;
			
			// Desabilita o botão durante a pré-captura
			const startBtn = document.getElementById('anitsu-dl-start');
			startBtn.disabled = true;
			startBtn.textContent = 'Capturando URLs...';
			
			// Pré-captura as URLs enquanto os botões ainda estão no DOM
			await preCaptureUrls(selectedFiles);
			
			// Adiciona à fila (NÃO inicia automaticamente)
			const added = addToQueue(selectedFiles);
			
			// Limpa seleção
			state.selectedFiles.clear();
			const checkboxes = document.querySelectorAll('#anitsu-dl-file-list input[type="checkbox"]');
			checkboxes.forEach(cb => cb.checked = false);
			
			// Atualiza UI para mostrar a fila
			updateUI();
			
			Logger.info(`${added} arquivo(s) adicionado(s) à fila. Clique em "Iniciar Downloads" para começar.`);
		});
		
		// Botão Iniciar Downloads (na seção de fila)
		document.getElementById('anitsu-dl-start-queue').addEventListener('click', () => {
			if (state.downloadQueue.length === 0) {
				alert('A fila está vazia!');
				return;
			}
			if (state.queueProcessing) {
				Logger.info('Downloads já estão em andamento');
				return;
			}
			processQueue(updateUI);
		});
		
		// Botão Limpar Fila
		document.getElementById('anitsu-dl-clear-queue').addEventListener('click', async () => {
			if (state.downloading) {
				alert('Não é possível limpar a fila enquanto downloads estão em andamento.\n\nUse "Cancelar Tudo" primeiro.');
				return;
			}
			
			const incompleteFiles = getIncompleteFiles();
			const hasIncomplete = incompleteFiles.length > 0;
			const hasQueue = state.downloadQueue.length > 0;
			
			if (!hasQueue && !hasIncomplete) {
				alert('Não há nada para limpar.');
				return;
			}
			
			let message = '';
			if (hasQueue && hasIncomplete) {
				message = `Limpar ${state.downloadQueue.length} arquivo(s) da fila e excluir ${incompleteFiles.length} arquivo(s) incompleto(s) do disco?`;
			} else if (hasQueue) {
				message = `Limpar ${state.downloadQueue.length} arquivo(s) da fila?`;
			} else {
				message = `Excluir ${incompleteFiles.length} arquivo(s) incompleto(s) do disco?`;
			}
			
			if (confirm(message)) {
				// Limpa a fila
				state.downloadQueue = [];
				clearQueueStorage();
				Logger.info('Fila limpa');
				
				// Limpa arquivos incompletos do disco
				if (hasIncomplete) {
					try {
						const dir = await window.showDirectoryPicker({ mode: 'readwrite' });
						await cleanupIncompleteFiles(dir);
						alert('Fila e arquivos incompletos removidos com sucesso!');
					} catch (e) {
						Logger.warn('Seleção de pasta cancelada:', e);
						clearIncompleteFilesStorage();
						alert('Fila limpa!\n\n(Arquivos incompletos no disco não foram removidos)');
					}
				} else {
					alert('Fila limpa!');
				}
				
				updateUI();
			}
		});

		// Botão Pausar/Retomar
		document.getElementById('anitsu-dl-pause').addEventListener('click', () => {
			state.paused = !state.paused;
			Logger.info(state.paused ? 'Downloads pausados' : 'Downloads retomados');
			
			// Atualiza o status de todos os downloads ativos
			state.activeDownloads.forEach((dl) => {
				dl.status = state.paused ? 'paused' : 'downloading';
			});
			
			updateUI();
		});

		// Botão Cancelar Tudo
		document.getElementById('anitsu-dl-cancel-all').addEventListener('click', async () => {
			if (confirm('Cancelar todos os downloads e excluir arquivos incompletos?')) {
				state.cancelAll = true;
				state.paused = false;
				state.downloadQueue = []; // Limpa a fila
				clearQueueStorage(); // Limpa do localStorage também
				
				// Aborta TODOS os downloads ativos
				state.activeDownloads.forEach((dl, id) => {
					if (dl.abortController) {
						Logger.info(`Abortando download: ${dl.file.name}`);
						dl.abortController.abort();
					}
				});
				
				// Aguarda um pouco para os downloads serem cancelados
				await new Promise(r => setTimeout(r, 500));
				
				// Limpa arquivos incompletos do disco
				if (state.downloadDir) {
					await cleanupIncompleteFiles(state.downloadDir);
				}
				
				Logger.info('Todos os downloads cancelados e arquivos incompletos removidos');
				updateUI();
			}
		});

		// Atualiza lista quando navega (com debounce para evitar loops)
		let debounceTimer = null;
		let isRendering = false;
		const observer = new MutationObserver((mutations) => {
			// Ignora mutações do próprio drawer
			if (isRendering) return;
			const isOwnMutation = mutations.some(m => 
				drawer.contains(m.target) || backdrop.contains(m.target)
			);
			if (isOwnMutation) return;
			
			if (drawer.classList.contains('open')) {
				clearTimeout(debounceTimer);
				debounceTimer = setTimeout(() => {
					isRendering = true;
					renderFileList();
					isRendering = false;
				}, 300);
			}
		});
		observer.observe(document.body, { childList: true, subtree: true });

		Logger.info('Pronto!');
	};

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();
