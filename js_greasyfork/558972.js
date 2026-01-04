// ==UserScript==
// @name         YouTube Master Control - The ultimate YouTube audio & video tool
// @name:pt-BR   YouTube Master Control - Ferramenta definitiva de áudio e vídeo
// @name:es      YouTube Master Control - The ultimate YouTube audio & video tool
// @name:fr      YouTube Master Control - The ultimate YouTube audio & video tool
// @name:de      YouTube Master Control - The ultimate YouTube audio & video tool
// @name:it      YouTube Master Control - The ultimate YouTube audio & video tool
// @name:ru      YouTube Master Control - The ultimate YouTube audio & video tool
// @name:zh-CN   YouTube Master Control - 终极YouTube音视频工具
// @name:zh-TW   YouTube Master Control - 終極YouTube音視頻工具
// @name:zh-HK   YouTube Master Control - 終極YouTube音視頻工具
// @name:ja      YouTube Master Control - The ultimate YouTube audio & video tool
// @name:ko      YouTube Master Control - The ultimate YouTube audio & video tool
// @name:hi      YouTube Master Control - The ultimate YouTube audio & video tool
// @name:id      YouTube Master Control - The ultimate YouTube audio & video tool
// @namespace    http://tampermonkey.net/
// @version      1.3.4
// @description  The ultimate YouTube audio & video tool! Features: Audio Booster, A-B Loop, Screen Recorder (Live & VOD), Speed Control (0.1x-5.0x), Video Zoom & Rotate, Video Quality Locker, Adblock, Screenshot, Resizable Interface, Theme Customization, and Subtitle Downloader.
// @description:pt-BR A melhor ferramenta de áudio e vídeo para YouTube! Recursos: Reforço de Áudio, Loop A-B, Gravação de Vídeo (Lives/VOD), Controle de Velocidade (0.1x-5.0x), Zoom e Rotação de Vídeo, Travar Qualidade, Adblock, Captura de Tela, Tema Personalizável e Download de Legendas.
// @description:es    ¡La melhor herramienta de audio y video para YouTube! Características: Refuerzo de Audio, Bucle A-B, Grabación de Pantalla (En vivo/VOD), Control de Velocidad (0.1x-5.0x), Zoom y Rotación de Video, Bloqueo de Calidad, Adblock, Captura de Pantalla, Tema Personalizable y Descarga de Subtítulos.
// @description:fr    L'outil audio et vidéo ultime para YouTube! Fonctionnalités: Amplificateur audio, Boucle A-B, Enregistrement d'écran (Live/VOD), Contrôle de vitesse (0.1x-5.0x), Zoom et Rotation vidéo, Verrouillage qualidade, Adblock, Capture d'écran, Thème personnalisable et Téléchargement de sous-titres.
// @description:de    Das ultimative YouTube-Audio- & Videotool! Funktionen: Audio-Verstärker, A-B-Loop, Bildschirmaufnahme (Live/VOD), Geschwindigkeitssteuerung (0.1x-5.0x), Video-Zoom & Drehung, Qualitäts-Sperre, Werbeblocker, Screenshot, Anpassbares Design und Untertitel-Download.
// @description:it    Lo strumento audio e video definitivo per YouTube! Funzioni: Amplificatore Audio, Loop A-B, Registrazione Schermo (Live/VOD), Controllo Velocità (0.1x-5.0x), Zoom e Rotazione Video, Blocco Qualità, Adblock, Screenshot, Tema Personalizzabile e Download Sottotitoli.
// @description:ru    Ультимативный инструмент para аудио и видео на YouTube! Функции: Усиление звука, Петля A-B, Запись экрана (Live/VOD), Контроль скорости (0.1x-5.0x), Зум и Поворот видео, Блокировка качества, Блокировка рекламы, Скриншот, Настраиваемая тема и Скачивание субтитров.
// @description:zh-CN 终极YouTube音视频工具！功能：音频增强、A-B循环、屏幕录制（直播/点播）、速度控制（0.1x-5.0x）、视频缩放与旋转、视频质量锁定、广告拦截、截图、主题定制和字幕下载。
// @description:zh-TW 終極YouTube音視頻工具！功能：音頻增強、A-B循環、屏幕錄製（直播/點播）、速度控制（0.1x-5.0x）、視頻縮放與旋轉、視頻質量鎖定、廣告攔截、截圖、主題定制和字幕下載。
// @description:zh-HK 終極YouTube音視頻工具！功能：音頻增強、A-B循環、屏幕錄製（直播/點播）、速度控制（0.1x-5.0x）、視頻縮放與旋轉、視頻質量鎖定、廣告攔截、截圖、主題定制和字幕下載。
// @description:ja    究極のYouTubeオーディオ＆ビデオツール！機能：オーディオブースター、A-Bループ、画面録画（ライブ/VOD）、速度制御（0.1x-5.0x）、ビデオズーム＆回転、品質ロック、広告ブロック、スクリーンショット、テーマのカスタマイズ、字幕ダウンロード。
// @description:ko    최고의 YouTube 오디오 및 비디오 도구! 기능: 오디オ 부스터, A-B 루プ, 화면 녹화 (라이브/VOD), 속도 제어 (0.1x-5.0x), 비디오 확대/축소 및 회전, 화질 잠금, 광고 차단, 스크린샷, 테마 사용자 정의 및 자막 다운로드.
// @description:hi    अंतिम यूट्यूब ऑडियो और वीडियो उपकरण! विशेषताएं: ऑडियो बूस्टर, ए-बी लूप, स्क्रीन रिकॉर्डिंग (लाइव/वीओडी), गति नियंत्रण (0.1x-5.0x), वीडियो ज़ूम और रोटेशन, गुणवत्ता लॉकर, ऐडब्लॉक, स्क्रीनशॉट, थीम अनुकूलन और उपशीर्षक डाउनलोड।
// @description:id    Alat audio & video YouTube terbaik! Fitur: Penguat Audio, Loop A-B, Perekaran Layar (Live/VOD), Kontrol Kecepatan (0.1x-5.0x), Zoom & Rotasi Video, Pengunci Kualitas, Adblock, Tangkapan Layar, Kustomisasi Tema, dan Pengunduh Subtitle.
// @author       Tauã B. Kloch Leite
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @run-at       document-end
// @copyright    2025, Tauã B. Kloch Leite - All Rights Reserved.
// @downloadURL https://update.greasyfork.org/scripts/558972/YouTube%20Master%20Control%20-%20The%20ultimate%20YouTube%20audio%20%20video%20tool.user.js
// @updateURL https://update.greasyfork.org/scripts/558972/YouTube%20Master%20Control%20-%20The%20ultimate%20YouTube%20audio%20%20video%20tool.meta.js
// ==/UserScript==

(function() {
    'use strict';

    try {
        const detectionFlags = [
            'yt-player-adblock-detected',
            'yt-ads-detect',
            'adblock_detected',
            'yt_adblock',
            'yt-player-blocked',
            'abp_detected'
        ];

        detectionFlags.forEach(flag => {
            localStorage.removeItem(flag);
            sessionStorage.removeItem(flag);
        });

        document.cookie.split(";").forEach(c => {
            const name = c.split("=")[0].trim();
            if (name.includes('ad') || name.includes('ADS') || name.includes('adblock')) {
                document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.youtube.com";
                document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=youtube.com";
            }
        });
    } catch (e) {}

    const i18n = {
        'en': {
            'general': 'General',
            'audio': 'Audio',
            'image': 'Image',
            'visual': 'Visual',
            'tools': 'Tools',
            'subtitles': 'Subtitles',
            'hotkeys': 'Hotkeys',
            'about': 'About',
            'adblock': 'Anti-AdBlock (AdGuard recommended)',
            'adblockExtension': 'Download AdBlock Extension',
            'forceQuality': 'Force Max Quality (4K)',
            'cinemaMode': 'Auto Cinema',
            'redirectShorts': 'Shorts -> Normal',
            'hideShorts': '🚫 HIDE SHORTS',
            'stealthTip': 'Tip: Alt+Shift+Y to hide HUD',
            'audioBooster': 'Audio Booster & EQ',
            'volumeBoost': 'Volume Boost',
            'bass': 'Bass',
            'treble': 'Treble',
            'resetAudio': 'Reset Audio',
            'imageAdjust': 'Image Adjustments',
            'brightness': 'Brightness',
            'contrast': 'Contrast',
            'saturation': 'Saturation',
            'hdrMode': 'HDR / SHARPNESS MODE',
            'grayscale': 'Grayscale',
            'resetImage': 'Reset Image',
            'colorsSizes': 'Colors & Sizes',
            'titleColor': 'Title Color',
            'textColor': 'General Text Color',
            'fontSize': 'Font Size',
            'background': 'Background',
            'bgType': 'Type:',
            'bgDefault': 'Default (YT)',
            'bgColor': 'Solid Color',
            'bgImage': 'Image / Photo',
            'chooseColor': 'Choose Color',
            'imageLink': 'Image Link:',
            'contentOpacity': 'Content Opacity',
            'themeColor': 'Theme Color',
            'buttonBG': 'Button BG',
            'buttonText': 'Button Text',
            'resetVisual': 'Reset Visual',
            'speed': 'Speed',
            'normal': '1.0x (Normal)',
            'fast': '2.5x (Fast)',
            'recordVideo': 'Record Video (REC)',
            'setA': 'Set A',
            'setB': 'Set B',
            'clear': 'Clear',
            'loopInactive': 'Loop Inactive',
            'zoom': 'Zoom',
            'rotation': 'Rotation',
            'resetZoom': 'Reset Zoom/Rotation',
            'screenshot': 'Screenshot',
            'pip': 'PiP',
            'stealth': 'Stealth',
            'thumbnail': 'Thumbnail',
            'zapperMode': 'Zapper Mode (Hide elements)',
            'stopZapper': 'Zapper Mode Active - Click to remove elements, ESC to exit',
            'resetZapped': 'Reset Hidden Elements',
            'downloadSubs': 'Download Subtitles (.srt)',
            'keyboardShortcuts': 'Keyboard Shortcuts',
            'panelHotkey': 'F9 / Insert - Open/Close Control Panel',
            'stealthHotkey': 'Alt + Shift + Y - Show/Hide HUD (Stealth Mode)',
            'screenshotHotkey': 'Shift + P - Take Screenshot',
            'zoomInHotkey': 'Ctrl + Shift + Arrow Up/+ - Zoom In',
            'zoomOutHotkey': 'Ctrl + Shift + Arrow Down/- - Zoom Out',
            'rotateRightHotkey': 'Ctrl + Shift + Arrow Right - Rotate +90°',
            'rotateLeftHotkey': 'Ctrl + Shift + Arrow Left - Rotate -90°',
            'resetZoomHotkey': 'Ctrl + Shift + 0 - Reset Zoom/Rotation',
            'menuHotkey': 'Tampermonkey Menu - Access all functions',
            'aboutTitle': 'About',
            'version': '⚡ YT Master v1.3.4',
            'features': 'Features:',
            'audioBoosterFeature': 'Audio Booster & Equalizer',
            'videoRecording': 'Video Recording (WEBM)',
            'abLoop': 'AB Loop Function',
            'speedControl': 'Speed Control (0.1x - 5.0x)',
            'imageAdjustments': 'Image Adjustments',
            'themeCustomization': 'Theme Customization',
            'subtitlesDownload': 'Subtitles Download',
            'supportProject': 'Support the Project',
            'supportText': 'If you like this tool, consider donating to help with development and maintenance.',
            'pixBrazil': 'Pix (Brazil)',
            'cryptocurrency': 'Cryptocurrency',
            'copy': 'Copy',
            'copied': 'Copied!',
            'rights': 'Tauã B. Kloch Leite - All Rights Reserved 2025',
            'menuControlPanel': '⚙️ Control Panel',
            'menuShowHideHUD': '👁️ Show/Hide HUD (Alt+Shift+Y)',
            'menuScreenshot': '📸 Take Screenshot (Shift+P)',
            'menuStartStopRecording': '🔴 Start/Stop Recording',
            'menuResetSpeed': '⏩ Reset Speed (1.0x)',
            'menuResetAudio': '🔊 Reset Audio',
            'menuToggleZapper': '🎯 Toggle Zapper Mode',
            'menuResetHiddenElements': '🔄 Reset Hidden Elements',
            'menuViewHotkeys': '⌨️ View All Hotkeys',
            'adblockStatus': '🛡️ Anti-AdBlock: INACTIVE',
            'resetDetection': '🔄 RESET DETECTION',
            'stealthMode': 'Stealth Mode',
            'restorePlayer': '🔄 Restore Player',
            'installAdguardFor': 'Install AdGuard for:',
            'officialAdguard': 'Official AdGuard Website',
            'chooseBrowser': 'Choose your browser:',
            'recommendedForBest': 'For best ad blocking results, we strongly recommend using AdGuard extension. This is more effective than the built-in anti-adblock which may not work reliably due to YouTube constant updates.'
        },
        'pt-BR': {
            'general': 'Geral',
            'audio': 'Áudio',
            'image': 'Imagem',
            'visual': 'Visual',
            'tools': 'Ferramentas',
            'subtitles': 'Legendas',
            'hotkeys': 'Atalhos',
            'about': 'Sobre',
            'adblock': 'Anti-AdBlock (AdGuard recomendado)',
            'adblockExtension': 'Baixar Extensão AdBlock',
            'forceQuality': 'Forçar Qualidade Máxima (4K)',
            'cinemaMode': 'Cinema Automático',
            'redirectShorts': 'Shorts -> Normal',
            'hideShorts': '🚫 OCULTAR SHORTS',
            'stealthTip': 'Dica: Alt+Shift+Y para ocultar HUD',
            'audioBooster': 'Amplificador de Áudio & Equalizador',
            'volumeBoost': 'Amplificar Volume',
            'bass': 'Graves',
            'treble': 'Agudos',
            'resetAudio': 'Resetar Áudio',
            'imageAdjust': 'Ajustes de Imagem',
            'brightness': 'Brilho',
            'contrast': 'Contraste',
            'saturation': 'Saturação',
            'hdrMode': 'MODO HDR / NITIDEZ',
            'grayscale': 'Escala de Cinza',
            'resetImage': 'Resetar Imagem',
            'colorsSizes': 'Cores e Tamanhos',
            'titleColor': 'Cor do Título',
            'textColor': 'Cor do Texto Geral',
            'fontSize': 'Tamanho da Fonte',
            'background': 'Fundo',
            'bgType': 'Tipo:',
            'bgDefault': 'Padrão (YT)',
            'bgColor': 'Cor Sólida',
            'bgImage': 'Imagem / Foto',
            'chooseColor': 'Escolher Cor',
            'imageLink': 'Link da Imagem:',
            'contentOpacity': 'Opacidade do Conteúdo',
            'themeColor': 'Cor do Tema',
            'buttonBG': 'Fundo do Botão',
            'buttonText': 'Texto do Botão',
            'resetVisual': 'Resetar Visual',
            'speed': 'Velocidade',
            'normal': '1.0x (Normal)',
            'fast': '2.5x (Rápido)',
            'recordVideo': 'Gravar Vídeo (REC)',
            'setA': 'Definir A',
            'setB': 'Definir B',
            'clear': 'Limpar',
            'loopInactive': 'Loop Inativo',
            'zoom': 'Zoom',
            'rotation': 'Rotação',
            'resetZoom': 'Resetar Zoom/Rotação',
            'screenshot': 'Captura de Tela',
            'pip': 'Picture-in-Picture',
            'stealth': 'Modo Furtivo',
            'thumbnail': 'Miniatura',
            'zapperMode': 'Modo Zapper (Ocultar elementos)',
            'stopZapper': 'Modo Zapper Ativo - Clique para remover elementos, ESC para sair',
            'resetZapped': 'Resetar Elementos Ocultos',
            'downloadSubs': 'Baixar Legendas (.srt)',
            'keyboardShortcuts': 'Atalhos de Teclado',
            'panelHotkey': 'F9 / Insert - Abrir/Fechar Painel',
            'stealthHotkey': 'Alt + Shift + Y - Mostrar/Ocultar HUD (Modo Furtivo)',
            'screenshotHotkey': 'Shift + P - Capturar Tela',
            'zoomInHotkey': 'Ctrl + Shift + Seta Cima/+ - Aumentar Zoom',
            'zoomOutHotkey': 'Ctrl + Shift + Seta Baixo/- - Diminuir Zoom',
            'rotateRightHotkey': 'Ctrl + Shift + Seta Direita - Rotacionar +90°',
            'rotateLeftHotkey': 'Ctrl + Shift + Seta Esquerda - Rotacionar -90°',
            'resetZoomHotkey': 'Ctrl + Shift + 0 - Resetar Zoom/Rotação',
            'menuHotkey': 'Menu Tampermonkey - Acessar todas funções',
            'aboutTitle': 'Sobre',
            'version': '⚡ YT Master v1.3.4',
            'features': 'Recursos:',
            'audioBoosterFeature': 'Amplificador de Áudio & Equalizador',
            'videoRecording': 'Gravação de Vídeo (WEBM)',
            'abLoop': 'Função AB Loop',
            'speedControl': 'Controle de Velocidade (0.1x - 5.0x)',
            'imageAdjustments': 'Ajustes de Imagem',
            'themeCustomization': 'Personalização de Tema',
            'subtitlesDownload': 'Download de Legendas',
            'supportProject': 'Apoie o Projeto',
            'supportText': 'Se você gosta desta ferramenta, considere doar para ajudar no desenvolvimento e manutenção.',
            'pixBrazil': 'Pix (Brasil)',
            'cryptocurrency': 'Criptomoedas',
            'copy': 'Copiar',
            'copied': 'Copiado!',
            'rights': 'Tauã B. Kloch Leite - Todos os Direitos Reservados 2025',
            'menuControlPanel': '⚙️ Painel de Controle',
            'menuShowHideHUD': '👁️ Mostrar/Ocultar HUD (Alt+Shift+Y)',
            'menuScreenshot': '📸 Capturar Tela (Shift+P)',
            'menuStartStopRecording': '🔴 Iniciar/Parar Gravação',
            'menuResetSpeed': '⏩ Resetar Velocidade (1.0x)',
            'menuResetAudio': '🔊 Resetar Áudio',
            'menuToggleZapper': '🎯 Alternar Modo Zapper',
            'menuResetHiddenElements': '🔄 Resetar Elementos Ocultos',
            'menuViewHotkeys': '⌨️ Ver Todos Atalhos',
            'adblockStatus': '🛡️ Anti-AdBlock: INATIVO',
            'resetDetection': '🔄 RESETAR DETECÇÃO',
            'stealthMode': 'Modo Furtivo',
            'restorePlayer': '🔄 Restaurar Player',
            'installAdguardFor': 'Instalar AdGuard para:',
            'officialAdguard': 'Site Oficial AdGuard',
            'chooseBrowser': 'Escolha seu navegador:',
            'recommendedForBest': 'Para os melhores resultados de bloqueio de anúncios, recomendamos fortemente o uso da extensão AdGuard. Isso é mais eficaz que o anti-adblock interno, que pode não funcionar de forma confiável devido às atualizações constantes do YouTube.'
        },
        'zh-CN': {
            'general': '常规',
            'audio': '音频',
            'image': '图像',
            'visual': '视觉',
            'tools': '工具',
            'subtitles': '字幕',
            'hotkeys': '快捷键',
            'about': '关于',
            'adblock': '反广告屏蔽 (推荐AdGuard)',
            'adblockExtension': '下载广告拦截扩展',
            'forceQuality': '强制最高质量 (4K)',
            'cinemaMode': '自动影院模式',
            'redirectShorts': 'Shorts -> 普通视频',
            'hideShorts': '🚫 隐藏Shorts',
            'stealthTip': '提示: Alt+Shift+Y 隐藏HUD',
            'audioBooster': '音频增强器 & 均衡器',
            'volumeBoost': '音量增强',
            'bass': '低音',
            'treble': '高音',
            'resetAudio': '重置音频',
            'imageAdjust': '图像调整',
            'brightness': '亮度',
            'contrast': '对比度',
            'saturation': '饱和度',
            'hdrMode': 'HDR / 锐化模式',
            'grayscale': '灰度',
            'resetImage': '重置图像',
            'colorsSizes': '颜色和大小',
            'titleColor': '标题颜色',
            'textColor': '常规文本颜色',
            'fontSize': '字体大小',
            'background': '背景',
            'bgType': '类型:',
            'bgDefault': '默认 (YT)',
            'bgColor': '纯色',
            'bgImage': '图像 / 照片',
            'chooseColor': '选择颜色',
            'imageLink': '图片链接:',
            'contentOpacity': '内容不透明度',
            'themeColor': '主题颜色',
            'buttonBG': '按钮背景',
            'buttonText': '按钮文字',
            'resetVisual': '重置视觉',
            'speed': '速度',
            'normal': '1.0x (正常)',
            'fast': '2.5x (快速)',
            'recordVideo': '录制视频 (REC)',
            'setA': '设置A',
            'setB': '设置B',
            'clear': '清除',
            'loopInactive': '循环未启用',
            'zoom': '缩放',
            'rotation': '旋转',
            'resetZoom': '重置缩放/旋转',
            'screenshot': '截图',
            'pip': '画中画',
            'stealth': '隐身模式',
            'thumbnail': '缩略图',
            'zapperMode': 'Zapper模式 (隐藏元素)',
            'stopZapper': 'Zapper模式激活 - 点击移除元素，ESC退出',
            'resetZapped': '重置隐藏元素',
            'downloadSubs': '下载字幕 (.srt)',
            'keyboardShortcuts': '键盘快捷键',
            'panelHotkey': 'F9 / Insert - 打开/关闭控制面板',
            'stealthHotkey': 'Alt + Shift + Y - 显示/隐藏HUD (隐身模式)',
            'screenshotHotkey': 'Shift + P - 截图',
            'zoomInHotkey': 'Ctrl + Shift + 上箭头/+ - 放大',
            'zoomOutHotkey': 'Ctrl + Shift + 下箭头/- - 缩小',
            'rotateRightHotkey': 'Ctrl + Shift + 右箭头 - 旋转 +90°',
            'rotateLeftHotkey': 'Ctrl + Shift + 左箭头 - 旋转 -90°',
            'resetZoomHotkey': 'Ctrl + Shift + 0 - 重置缩放/旋转',
            'menuHotkey': 'Tampermonkey 菜单 - 访问所有功能',
            'aboutTitle': '关于',
            'version': '⚡ YT Master v1.3.4',
            'features': '功能:',
            'audioBoosterFeature': '音频增强器 & 均衡器',
            'videoRecording': '视频录制 (WEBM)',
            'abLoop': 'AB循环功能',
            'speedControl': '速度控制 (0.1x - 5.0x)',
            'imageAdjustments': '图像调整',
            'themeCustomization': '主题定制',
            'subtitlesDownload': '字幕下载',
            'supportProject': '支持项目',
            'supportText': '如果您喜欢这个工具，请考虑捐赠以帮助开发和维护。',
            'pixBrazil': 'Pix (巴西)',
            'cryptocurrency': '加密货币',
            'copy': '复制',
            'copied': '已复制!',
            'rights': 'Tauã B. Kloch Leite - 版权所有 2025',
            'menuControlPanel': '⚙️ 控制面板',
            'menuShowHideHUD': '👁️ 显示/隐藏HUD (Alt+Shift+Y)',
            'menuScreenshot': '📸 截图 (Shift+P)',
            'menuStartStopRecording': '🔴 开始/停止录制',
            'menuResetSpeed': '⏩ 重置速度 (1.0x)',
            'menuResetAudio': '🔊 重置音频',
            'menuToggleZapper': '🎯 切换Zapper模式',
            'menuResetHiddenElements': '🔄 重置隐藏元素',
            'menuViewHotkeys': '⌨️ 查看所有快捷键',
            'adblockStatus': '🛡️ 反广告屏蔽: 未激活',
            'resetDetection': '🔄 重置检测',
            'stealthMode': '隐身模式',
            'restorePlayer': '🔄 恢复播放器',
            'installAdguardFor': '安装AdGuard用于:',
            'officialAdguard': 'AdGuard官方网站',
            'chooseBrowser': '选择您的浏览器:',
            'recommendedForBest': '为了获得最佳的广告拦截效果，我们强烈推荐使用AdGuard扩展。这比内置的反广告屏蔽更有效，由于YouTube不断更新，内置功能可能不可靠。'
        },
        'zh-TW': {
            'general': '一般',
            'audio': '音頻',
            'image': '圖像',
            'visual': '視覺',
            'tools': '工具',
            'subtitles': '字幕',
            'hotkeys': '快速鍵',
            'about': '關於',
            'adblock': '反廣告屏蔽 (推薦AdGuard)',
            'adblockExtension': '下載廣告攔截擴展',
            'forceQuality': '強制最高品質 (4K)',
            'cinemaMode': '自動影院模式',
            'redirectShorts': 'Shorts -> 普通影片',
            'hideShorts': '🚫 隱藏Shorts',
            'stealthTip': '提示: Alt+Shift+Y 隱藏HUD',
            'audioBooster': '音頻增強器 & 均衡器',
            'volumeBoost': '音量增強',
            'bass': '低音',
            'treble': '高音',
            'resetAudio': '重置音頻',
            'imageAdjust': '圖像調整',
            'brightness': '亮度',
            'contrast': '對比度',
            'saturation': '飽和度',
            'hdrMode': 'HDR / 銳化模式',
            'grayscale': '灰度',
            'resetImage': '重置圖像',
            'colorsSizes': '顏色和大小',
            'titleColor': '標題顏色',
            'textColor': '一般文字顏色',
            'fontSize': '字體大小',
            'background': '背景',
            'bgType': '類型:',
            'bgDefault': '默認 (YT)',
            'bgColor': '純色',
            'bgImage': '圖像 / 照片',
            'chooseColor': '選擇顏色',
            'imageLink': '圖片連結:',
            'contentOpacity': '內容不透明度',
            'themeColor': '主題顏色',
            'buttonBG': '按鈕背景',
            'buttonText': '按鈕文字',
            'resetVisual': '重置視覺',
            'speed': '速度',
            'normal': '1.0x (正常)',
            'fast': '2.5x (快速)',
            'recordVideo': '錄製影片 (REC)',
            'setA': '設置A',
            'setB': '設置B',
            'clear': '清除',
            'loopInactive': '循環未啟用',
            'zoom': '縮放',
            'rotation': '旋轉',
            'resetZoom': '重置縮放/旋轉',
            'screenshot': '截圖',
            'pip': '畫中畫',
            'stealth': '隱身模式',
            'thumbnail': '縮圖',
            'zapperMode': 'Zapper模式 (隱藏元素)',
            'stopZapper': 'Zapper模式激活 - 點擊移除元素，ESC退出',
            'resetZapped': '重置隱藏元素',
            'downloadSubs': '下載字幕 (.srt)',
            'keyboardShortcuts': '鍵盤快速鍵',
            'panelHotkey': 'F9 / Insert - 打開/關閉控制面板',
            'stealthHotkey': 'Alt + Shift + Y - 顯示/隱藏HUD (隱身模式)',
            'screenshotHotkey': 'Shift + P - 截圖',
            'zoomInHotkey': 'Ctrl + Shift + 上箭頭/+ - 放大',
            'zoomOutHotkey': 'Ctrl + Shift + 下箭頭/- - 縮小',
            'rotateRightHotkey': 'Ctrl + Shift + 右箭頭 - 旋轉 +90°',
            'rotateLeftHotkey': 'Ctrl + Shift + 左箭頭 - 旋轉 -90°',
            'resetZoomHotkey': 'Ctrl + Shift + 0 - 重置縮放/旋轉',
            'menuHotkey': 'Tampermonkey 菜單 - 訪問所有功能',
            'aboutTitle': '關於',
            'version': '⚡ YT Master v1.3.4',
            'features': '功能:',
            'audioBoosterFeature': '音頻增強器 & 均衡器',
            'videoRecording': '影片錄製 (WEBM)',
            'abLoop': 'AB循環功能',
            'speedControl': '速度控制 (0.1x - 5.0x)',
            'imageAdjustments': '圖像調整',
            'themeCustomization': '主題定制',
            'subtitlesDownload': '字幕下載',
            'supportProject': '支持項目',
            'supportText': '如果您喜歡這個工具，請考慮捐贈以幫助開發和維護。',
            'pixBrazil': 'Pix (巴西)',
            'cryptocurrency': '加密貨幣',
            'copy': '複製',
            'copied': '已複製!',
            'rights': 'Tauã B. Kloch Leite - 版權所有 2025',
            'menuControlPanel': '⚙️ 控制面板',
            'menuShowHideHUD': '👁️ 顯示/隱藏HUD (Alt+Shift+Y)',
            'menuScreenshot': '📸 截圖 (Shift+P)',
            'menuStartStopRecording': '🔴 開始/停止錄製',
            'menuResetSpeed': '⏩ 重置速度 (1.0x)',
            'menuResetAudio': '🔊 重置音頻',
            'menuToggleZapper': '🎯 切換Zapper模式',
            'menuResetHiddenElements': '🔄 重置隱藏元素',
            'menuViewHotkeys': '⌨️ 查看所有快速鍵',
            'adblockStatus': '🛡️ 反廣告屏蔽: 未激活',
            'resetDetection': '🔄 重置檢測',
            'stealthMode': '隱身模式',
            'restorePlayer': '🔄 恢復播放器',
            'installAdguardFor': '安裝AdGuard用於:',
            'officialAdguard': 'AdGuard官方網站',
            'chooseBrowser': '選擇您的瀏覽器:',
            'recommendedForBest': '為了獲得最佳的廣告攔截效果，我們強烈推薦使用AdGuard擴展。這比內置的反廣告屏蔽更有效，由於YouTube不斷更新，內置功能可能不可靠。'
        },
        'zh-HK': {
            'general': '一般',
            'audio': '音頻',
            'image': '圖像',
            'visual': '視覺',
            'tools': '工具',
            'subtitles': '字幕',
            'hotkeys': '快速鍵',
            'about': '關於',
            'adblock': '反廣告屏蔽 (推薦AdGuard)',
            'adblockExtension': '下載廣告攔截擴展',
            'forceQuality': '強制最高品質 (4K)',
            'cinemaMode': '自動影院模式',
            'redirectShorts': 'Shorts -> 普通影片',
            'hideShorts': '🚫 隱藏Shorts',
            'stealthTip': '提示: Alt+Shift+Y 隱藏HUD',
            'audioBooster': '音頻增強器 & 均衡器',
            'volumeBoost': '音量增強',
            'bass': '低音',
            'treble': '高音',
            'resetAudio': '重置音頻',
            'imageAdjust': '圖像調整',
            'brightness': '亮度',
            'contrast': '對比度',
            'saturation': '飽和度',
            'hdrMode': 'HDR / 銳化模式',
            'grayscale': '灰度',
            'resetImage': '重置圖像',
            'colorsSizes': '顏色和大小',
            'titleColor': '標題顏色',
            'textColor': '一般文字顏色',
            'fontSize': '字體大小',
            'background': '背景',
            'bgType': '類型:',
            'bgDefault': '默認 (YT)',
            'bgColor': '純色',
            'bgImage': '圖像 / 照片',
            'chooseColor': '選擇顏色',
            'imageLink': '圖片連結:',
            'contentOpacity': '內容不透明度',
            'themeColor': '主題顏色',
            'buttonBG': '按鈕背景',
            'buttonText': '按鈕文字',
            'resetVisual': '重置視覺',
            'speed': '速度',
            'normal': '1.0x (正常)',
            'fast': '2.5x (快速)',
            'recordVideo': '錄製影片 (REC)',
            'setA': '設置A',
            'setB': '設置B',
            'clear': '清除',
            'loopInactive': '循環未啟用',
            'zoom': '縮放',
            'rotation': '旋轉',
            'resetZoom': '重置縮放/旋轉',
            'screenshot': '截圖',
            'pip': '畫中畫',
            'stealth': '隱身模式',
            'thumbnail': '縮圖',
            'zapperMode': 'Zapper模式 (隱藏元素)',
            'stopZapper': 'Zapper模式激活 - 點擊移除元素，ESC退出',
            'resetZapped': '重置隱藏元素',
            'downloadSubs': '下載字幕 (.srt)',
            'keyboardShortcuts': '鍵盤快速鍵',
            'panelHotkey': 'F9 / Insert - 打開/關閉控制面板',
            'stealthHotkey': 'Alt + Shift + Y - 顯示/隱藏HUD (隱身模式)',
            'screenshotHotkey': 'Shift + P - 截圖',
            'zoomInHotkey': 'Ctrl + Shift + 上箭頭/+ - 放大',
            'zoomOutHotkey': 'Ctrl + Shift + 下箭頭/- - 縮小',
            'rotateRightHotkey': 'Ctrl + Shift + 右箭頭 - 旋轉 +90°',
            'rotateLeftHotkey': 'Ctrl + Shift + 左箭頭 - 旋轉 -90°',
            'resetZoomHotkey': 'Ctrl + Shift + 0 - 重置縮放/旋轉',
            'menuHotkey': 'Tampermonkey 菜單 - 訪問所有功能',
            'aboutTitle': '關於',
            'version': '⚡ YT Master v1.3.4',
            'features': '功能:',
            'audioBoosterFeature': '音頻增強器 & 均衡器',
            'videoRecording': '影片錄製 (WEBM)',
            'abLoop': 'AB循環功能',
            'speedControl': '速度控制 (0.1x - 5.0x)',
            'imageAdjustments': '圖像調整',
            'themeCustomization': '主題定制',
            'subtitlesDownload': '字幕下載',
            'supportProject': '支持項目',
            'supportText': '如果您喜歡這個工具，請考慮捐贈以幫助開發和維護。',
            'pixBrazil': 'Pix (巴西)',
            'cryptocurrency': '加密貨幣',
            'copy': '複製',
            'copied': '已複製!',
            'rights': 'Tauã B. Kloch Leite - 版權所有 2025',
            'menuControlPanel': '⚙️ 控制面板',
            'menuShowHideHUD': '👁️ 顯示/隱藏HUD (Alt+Shift+Y)',
            'menuScreenshot': '📸 截圖 (Shift+P)',
            'menuStartStopRecording': '🔴 開始/停止錄製',
            'menuResetSpeed': '⏩ 重置速度 (1.0x)',
            'menuResetAudio': '🔊 重置音頻',
            'menuToggleZapper': '🎯 切換Zapper模式',
            'menuResetHiddenElements': '🔄 重置隱藏元素',
            'menuViewHotkeys': '⌨️ 查看所有快速鍵',
            'adblockStatus': '🛡️ 反廣告屏蔽: 未激活',
            'resetDetection': '🔄 重置檢測',
            'stealthMode': '隱身模式',
            'restorePlayer': '🔄 恢復播放器',
            'installAdguardFor': '安裝AdGuard用於:',
            'officialAdguard': 'AdGuard官方網站',
            'chooseBrowser': '選擇您的瀏覽器:',
            'recommendedForBest': '為了獲得最佳的廣告攔截效果，我們強烈推薦使用AdGuard擴展。這比內置的反廣告屏蔽更有效，由於YouTube不斷更新，內置功能可能不可靠。'
        }
    };

    const browserLang = navigator.language || navigator.userLanguage;
    let currentLang = 'en';

    if (browserLang.startsWith('zh')) {
        if (browserLang.includes('CN') || browserLang === 'zh' || browserLang === 'zh-Hans' || browserLang === 'zh-CN') {
            currentLang = 'zh-CN';
        } else if (browserLang.includes('TW') || browserLang === 'zh-TW' || browserLang === 'zh-Hant') {
            currentLang = 'zh-TW';
        } else if (browserLang.includes('HK') || browserLang.includes('MO') || browserLang === 'zh-HK') {
            currentLang = 'zh-HK';
        } else {
            currentLang = 'zh-CN';
        }
    } else if (browserLang.startsWith('pt')) {
        currentLang = 'pt-BR';
    } else if (i18n[browserLang.split('-')[0]]) {
        currentLang = browserLang.split('-')[0];
    }

    function t(key) {
        return i18n[currentLang]?.[key] || i18n['en'][key] || key;
    }

    const defaultConfig = {
        adblock: false,
        adblockStealth: false,
        cinemaMode: false,
        redirectShorts: true,
        hideShorts: false,
        forceQuality: true,
        themeColor: '#ff0000',
        titleColor: '#ffffff',
        textColor: '#aaaaaa',
        titleFontSize: 100,
        btnColor: '#065fd4',
        btnTextColor: '#ffffff',
        videoZoom: 100,
        videoRotate: 0,
        videoSpeed: 1.0,
        vBrightness: 100,
        vContrast: 100,
        vSaturate: 100,
        vGrayscale: 0,
        vSepia: 0,
        vHDR: false,
        audioBoost: 100,
        eqBass: 0,
        eqTreble: 0,
        bgType: 'default',
        bgColor: '#000000',
        bgImage: '',
        bgOpacity: 80,
        subColor: '#ffeb3b',
        subBgColor: 'rgba(0,0,0,0.7)',
        subSize: 100,
        uiHidden: false,
        panelPos: { top: '100px', left: '100px', width: '400px', height: '500px' },
        btnPos: { top: 'auto', left: 'auto', bottom: '20px', right: '20px' },
        zapperList: []
    };

    let config = { ...defaultConfig, ...GM_getValue('ytMasterConfig', {}) };
    config.zapperList = GM_getValue('ytMasterZapperList', []);

    let adblockObserver = null;
    let lastAdblockRun = 0;
    let playerUnlockAttempts = 0;
    let playerReplacementAttempts = 0;
    let playerRestoreInterval = null;
    const adblockZapperSelectors = [
        'ytd-companion-slot-renderer',
        'ytd-ad-slot-renderer',
        'ytm-promoted-sparkles-web-renderer',
        '.tp-backdrop',
        '.tp-modal',
        'ytd-rich-section-renderer[is-ad]',
        'ytd-display-ad-renderer',
        'ytd-action-companion-ad-renderer'
    ];

    function restoreYouTubePlayer() {
        const playerContainer = document.getElementById('movie_player');
        const video = document.querySelector('video');
        const flexy = document.querySelector('ytd-watch-flexy');

        if (!playerContainer) return false;

        try {
            if (flexy && flexy.hasAttribute('player-unavailable')) {
                flexy.removeAttribute('player-unavailable');
            }

            document.querySelectorAll('tp-yt-iron-overlay-backdrop, .ytp-ad-player-overlay').forEach(el => {
                el.style.opacity = '0';
                setTimeout(() => {
                    if (el.parentNode) el.parentNode.removeChild(el);
                }, 300);
            });

            const enforcement = document.querySelector('ytd-enforcement-message-view-model');
            const adBlockDialogs = document.querySelectorAll('tp-yt-paper-dialog, ytd-mealbar-promo-renderer');

            if (enforcement) {
                enforcement.style.opacity = '0';
                setTimeout(() => {
                    if (enforcement.parentNode) enforcement.parentNode.removeChild(enforcement);
                }, 200);
            }

            adBlockDialogs.forEach(dialog => {
                dialog.style.cssText = 'opacity:0!important;transform:scale(0.9)!important;';
                setTimeout(() => {
                    if (dialog.parentNode) dialog.parentNode.removeChild(dialog);
                }, 250);
            });

            if (playerContainer.style.display === 'none' || playerContainer.style.visibility === 'hidden') {
                playerContainer.style.display = '';
                playerContainer.style.visibility = '';
            }

            if (video) {
                const wasPlaying = !video.paused;
                const currentTime = video.currentTime;

                video.play().catch(() => {
                    video.load();
                    setTimeout(() => {
                        video.currentTime = currentTime;
                        if (wasPlaying) video.play().catch(() => {});
                    }, 500);
                });
            }

            const errorClasses = ['ad-showing', 'ad-interrupting', 'player-error', 'unplayable'];
            errorClasses.forEach(className => {
                if (playerContainer.classList.contains(className)) {
                    playerContainer.classList.remove(className);
                }
            });

            document.querySelectorAll('[style*="pointer-events"]').forEach(el => {
                if (el.style.pointerEvents === 'none') {
                    el.style.pointerEvents = 'auto';
                }
            });

            return true;
        } catch (e) {
            return false;
        }
    }

    function startPlayerMonitor() {
        if (playerRestoreInterval) clearInterval(playerRestoreInterval);

        playerRestoreInterval = setInterval(() => {
            const video = document.querySelector('video');
            const player = document.getElementById('movie_player');

            if (!video || !player) return;

            const isPlayerEmpty =
                player.offsetWidth > 100 &&
                player.offsetHeight > 100 &&
                video.readyState === 0 &&
                video.networkState === 0;

            const blockingOverlay = player.querySelector(
                '.ytp-ad-player-overlay, .ad-interstitial, [class*="ad-overlay"]'
            );

            const hasBlockMessage = document.querySelector('ytd-enforcement-message-view-model');

            if ((isPlayerEmpty || blockingOverlay || hasBlockMessage) && config.adblock) {
                restoreYouTubePlayer();
            }

        }, 1000);
    }

    function initStealthAdblock() {
        if (!config.adblock) {
            if (adblockObserver) {
                adblockObserver.disconnect();
                adblockObserver = null;
            }
            return;
        }

        adblockZapperSelectors.forEach(selector => {
            if (!config.zapperList.includes(selector)) {
                config.zapperList.push(selector);
            }
        });
        GM_setValue('ytMasterZapperList', config.zapperList);

        if (!adblockObserver) {
            adblockObserver = new MutationObserver((mutations) => {
                const now = Date.now();
                if (now - lastAdblockRun > getRandomInterval()) {
                    handleStealthAdblock();
                    lastAdblockRun = now;
                }
            });

            adblockObserver.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: false,
                characterData: false
            });
        }

        setTimeout(handleStealthAdblock, 1000);
    }

    function getRandomInterval() {
        return 500 + Math.random() * 1000;
    }

    function handleStealthAdblock() {
        if (!config.adblock) return;

        const player = document.getElementById('movie_player');
        const video = document.querySelector('video');
        const now = Date.now();

        if ((!player || !video) && config.adblock) {
            setTimeout(() => {
                restoreYouTubePlayer();
            }, 100);
            return;
        }

        const warningSelectors = [
            'ytd-enforcement-message-view-model',
            'tp-yt-paper-dialog:not([class*="player"]):not([id*="player"])',
            '#dialog:not([class*="player"])',
            '.ytd-popup-container:not([id*="player"])',
            'yt-mealbar-promo-renderer',
            '.ytp-ad-message-container',
            '[class*="ad-interstitial"]:not([class*="video"]):not([class*="player"])',
            '.video-ads.ytp-ad-module',
            'ytd-popup-container'
        ];

        let warningDetected = false;
        warningSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                if (el && el.parentNode) {
                    const isPlayerElement =
                          el.closest('#movie_player') ||
                          el.closest('.html5-video-player') ||
                          el.closest('.ytp-chrome-top') ||
                          el.closest('.ytp-chrome-bottom') ||
                          el.id?.includes('player') ||
                          el.classList?.contains('video-stream');

                    if (!isPlayerElement) {
                        el.style.transition = 'opacity 0.4s';
                        el.style.opacity = '0';
                        el.style.pointerEvents = 'none';

                        setTimeout(() => {
                            if (el.parentNode && el.style.opacity === '0') {
                                el.parentNode.removeChild(el);
                            }
                        }, 400);

                        warningDetected = true;
                    }
                }
            });
        });

        if (warningDetected && player) {
            const unlockStrategies = [
                () => {
                    document.querySelectorAll('.tp-yt-iron-overlay-backdrop').forEach(overlay => {
                        overlay.style.cssText = 'opacity:0!important;transition:opacity 0.3s!important;';
                        setTimeout(() => {
                            if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
                        }, 300);
                    });
                },
                () => {
                    if (video && video.paused) {
                        video.play().catch(() => {});
                    }
                },
                () => {
                    const flexy = document.querySelector('ytd-watch-flexy');
                    if (flexy) {
                        flexy.removeAttribute('player-unavailable');
                        flexy.removeAttribute('player-error');
                    }
                }
            ];

            unlockStrategies.forEach((strategy, index) => {
                setTimeout(() => {
                    try { strategy(); } catch (e) {}
                }, index * 200);
            });
        }

        if (player && video && video.duration > 0) {
            const isAd = player.classList.contains('ad-showing') ||
                  player.classList.contains('ad-interrupting') ||
                  video.currentTime < 1 && video.duration < 35;

            const hasAdElements =
                  document.querySelector('.ytp-ad-player-overlay') ||
                  document.querySelector('.ytp-ad-text-overlay') ||
                  video.textTracks.length > 2;

            if ((isAd || hasAdElements) && config.adblock) {
                const adStrategies = [
                    () => {
                        const skipBtn = document.querySelector('.ytp-ad-skip-button, .ytp-ad-skip-button-modern');
                        if (skipBtn && skipBtn.offsetParent !== null) {
                            skipBtn.style.cssText = 'opacity:1!important;pointer-events:auto!important;';
                            setTimeout(() => skipBtn.click(), 100);
                        }
                    },
                    () => {
                        if (video.playbackRate < 3) {
                            video.playbackRate = 2.0;
                            video.muted = true;
                        }
                    },
                    () => {
                        if (video.duration < 30 && !isNaN(video.duration)) {
                            video.currentTime = video.duration - 0.5;
                            video.muted = true;
                        }
                    }
                ];

                const useSkip = document.querySelector('.ytp-ad-skip-button') !== null;
                const strategyIndex = useSkip ? 0 : Math.floor(Math.random() * 2) + 1;

                try {
                    adStrategies[strategyIndex]();
                } catch (e) {}

                document.querySelectorAll('.ytp-ad-player-overlay, .ytp-ad-overlay-container').forEach(overlay => {
                    overlay.style.cssText = 'opacity:0!important;pointer-events:none!important;';
                    setTimeout(() => {
                        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
                    }, 300);
                });
            } else if (!isAd) {
                if (Math.abs(video.playbackRate - config.videoSpeed) > 0.1) {
                    video.playbackRate = config.videoSpeed;
                }
                if (video.muted && video.playbackRate < 2) {
                    video.muted = false;
                }
            }
        }

        const persistentAds = [
            '#masthead-ad',
            'ytd-ad-slot-renderer',
            'ytd-companion-slot-renderer',
            '.ytp-ad-text-overlay',
            'ytm-promoted-sparkles-web-renderer',
            '.ad-container:not([class*="player"])',
            '.ad-div:not([class*="player"])',
            '[data-ad-status]:not([class*="player"])'
        ];

        persistentAds.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                if (el && el.parentNode) {
                    const isInPlayer = el.closest('#movie_player') || el.closest('.html5-video-player');
                    if (!isInPlayer) {
                        el.style.cssText = 'display:none!important;opacity:0!important;height:0!important;overflow:hidden!important;';
                    }
                }
            });
        });

        if (Math.random() > 0.8) {
            document.querySelectorAll('span, div, p').forEach(element => {
                if (element.children.length === 0 && element.textContent) {
                    const isInPlayer = element.closest('#movie_player') || element.closest('.html5-video-player');
                    const isInPanel = element.closest('#ym-panel');
                    if (!isInPlayer && !isInPanel) {
                        const text = element.textContent.toLowerCase();
                        const adKeywords = [
                            'adblock',
                            'ad blocker',
                            'whitelist youtube',
                            'desative seu bloqueador',
                            'permitir anúncios',
                            'anúncio em andamento',
                            'video will play after ad',
                            'disable ad blocker'
                        ];

                        if (adKeywords.some(keyword => text.includes(keyword))) {
                            element.style.display = 'none';
                            const parent = element.parentElement;
                            if (parent && parent.children.length <= 2 && !parent.closest('#movie_player') && !parent.closest('#ym-panel')) {
                                parent.style.display = 'none';
                            }
                        }
                    }
                }
            });
        }
    }

    function emergencyDetectionReset() {
        try {
            localStorage.clear();
            sessionStorage.clear();

            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.includes('yt') || key.includes('YT')) {
                    localStorage.removeItem(key);
                }
            }

            document.cookie.split(";").forEach(c => {
                const name = c.split("=")[0].trim();
                document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.youtube.com";
                document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=youtube.com";
            });

            playerUnlockAttempts = 0;

            setTimeout(() => {
                window.location.href = window.location.href.split('?')[0] + '?reload=' + Date.now();
            }, 1000);

            return '✅ Reset realizado. Recarregando...';
        } catch (e) {
            return '❌ Erro no reset: ' + e.message;
        }
    }

    let zapperObserver = null;
    const ICONS = {
        pix: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Logo%E2%80%94pix_powered_by_Banco_Central_%28Brazil%2C_2020%29.svg",
        paypal: "https://www.paypalobjects.com/webstatic/icon/pp258.png",
        btc: "https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=025",
        eth: "https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=025",
        sol: "https://cryptologos.cc/logos/solana-sol-logo.svg?v=025",
        bnb: "https://cryptologos.cc/logos/bnb-bnb-logo.svg?v=025",
        matic: "https://cryptologos.cc/logos/polygon-matic-logo.svg?v=025",
        usdt: "https://cryptologos.cc/logos/tether-usdt-logo.svg?v=025",
        bubble: "https://img.icons8.com/?size=100&id=9F8aDI7mYs6V&format=png&color=ffffff",
        warn: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Antu_dialog-warning.svg/200px-Antu_dialog-warning.svg.png"
    };

    let audioCtx, audioSource, gainNode, bassNode, trebleNode;
    let loopStart = null, loopEnd = null, loopActive = false;
    let mediaRecorder, recordedChunks = [];
    let isRecording = false;
    let zapperActive = false;

    function registerMenus() {
        GM_registerMenuCommand(t('menuControlPanel'), toggleMenu);
        GM_registerMenuCommand(t('menuShowHideHUD'), toggleStealthMode);
        GM_registerMenuCommand(t('menuScreenshot'), takeScreenshot);
        GM_registerMenuCommand(t('menuStartStopRecording'), toggleRecording);
        GM_registerMenuCommand(t('menuResetSpeed'), () => { updateConfig('videoSpeed', 1.0); refreshInputs(); });
        GM_registerMenuCommand(t('menuResetAudio'), resetAudioSettings);
        GM_registerMenuCommand(t('menuToggleZapper'), toggleZapper);
        GM_registerMenuCommand(t('menuResetHiddenElements'), resetZappedElements);
        GM_registerMenuCommand(t('menuViewHotkeys'), () => {
            if (!document.getElementById('ym-panel')) buildUI();
            document.getElementById('ym-panel').style.display = 'flex';
            switchTab('hotkeys');
        });
    }
    registerMenus();

    const cssStructure = `
        :root {
            --ym-theme: ${config.themeColor};
            --ym-title: ${config.titleColor};
            --ym-text: ${config.textColor};
            --ym-btn-bg: ${config.btnColor};
            --ym-btn-txt: ${config.btnTextColor};
            --ym-font-scale: ${config.titleFontSize / 100};
            --ym-sub-color: ${config.subColor};
            --ym-sub-bg: ${config.subBgColor};
            --ym-sub-size: ${config.subSize}%;
        }

        video { transition: transform 0.2s ease-out, filter 0.2s ease-out !important; }

        .yt-lockup-metadata-view-model__title, a.yt-lockup-metadata-view-model__title, h3.yt-lockup-metadata-view-model__title, .yt-lockup-metadata-view-model__title span {
            color: var(--ym-title) !important; font-size: calc(1.6rem * var(--ym-font-scale)) !important; line-height: 1.3 !important; font-weight: 500 !important; max-height: none !important;
        }
        #video-title, #video-title.ytd-rich-grid-media, #video-title.ytd-compact-video-renderer, a#video-title-link, h1.ytd-watch-metadata {
            color: var(--ym-title) !important; font-size: calc(1.5rem * var(--ym-font-scale)) !important;
        }

        .yt-lockup-metadata-view-model__metadata, #metadata-line, ytd-channel-name #text, #description-text, ytd-guide-entry-renderer #endpoint {
             color: var(--ym-text) !important;
        }

        body.ym-hide-shorts ytd-rich-shelf-renderer[is-shorts], body.ym-hide-shorts ytd-reel-shelf-renderer, body.ym-hide-shorts a[href^="/shorts"] { display: none !important; }

        html.ym-bg-image { background-image: var(--ym-bg-url) !important; background-size: cover !important; background-attachment: fixed !important; background-position: center !important; background-color: #000 !important; }
        html.ym-bg-image body, html.ym-bg-image ytd-app, html.ym-bg-image #content, html.ym-bg-image #page-manager { background: transparent !important; }
        html.ym-bg-image ytd-rich-item-renderer, html.ym-bg-image ytd-watch-metadata, html.ym-bg-image #comments, html.ym-bg-image #secondary-inner, html.ym-bg-image #masthead-container {
            background-color: rgba(0,0,0, var(--ym-content-opacity)) !important; border-radius: 12px; padding: 6px !important; margin-bottom: 8px !important;
        }

        .ytp-play-progress, .ytp-swatch-background-color { background: var(--ym-theme) !important; }
        ytd-menu-renderer button, ytd-menu-renderer yt-button-shape { background-color: var(--ym-btn-bg) !important; color: var(--ym-btn-txt) !important; border-radius: 20px; }
        .ytp-caption-segment { color: var(--ym-sub-color) !important; background-color: var(--ym-sub-bg) !important; font-size: var(--ym-sub-size) !important; }

        #ym-panel {
            position: fixed;
            background: #0f0f0f;
            border: 1px solid #333;
            border-radius: 12px;
            z-index: 2147483647;
            color: white;
            font-family: Arial, sans-serif;
            font-size: 12px;
            box-shadow: 0 10px 50px rgba(0,0,0,1);
            display: none;
            flex-direction: column;
            resize: both;
            overflow: hidden;
            min-width: 350px;
            min-height: 300px;
            max-width: 90vw;
            max-height: 90vh;
        }

        #ym-header {
            padding: 12px;
            background: #1f1f1f;
            border-bottom: 1px solid #333;
            display: flex;
            justify-content: space-between;
            cursor: move;
            flex-shrink: 0;
            user-select: none;
        }

        #ym-tabs {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            background: #111;
            border-bottom: 1px solid #333;
            flex-shrink: 0;
            user-select: none;
        }

        .ym-tab {
            padding: 10px 5px;
            text-align: center;
            cursor: pointer;
            color: #888;
            border-bottom: 2px solid transparent;
            transition: 0.2s;
            font-size: 11px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            min-width: 0;
        }

        .ym-tab.active {
            color: #fff;
            border-bottom: 2px solid var(--ym-theme);
            background: #222;
        }

        .ym-content {
            padding: 15px;
            display: none;
            overflow-y: auto;
            overflow-x: hidden;
            flex-grow: 1;
            min-height: 200px;
        }

        .ym-content.active {
            display: block;
        }

        .ym-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
            min-width: 0;
        }

        .ym-btn {
            width: 100%;
            padding: 8px;
            background: #333;
            color: white;
            border: 1px solid #444;
            margin-top: 5px;
            cursor: pointer;
            border-radius: 4px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .ym-btn:hover {
            background: #444;
            border-color: white;
        }

        .ym-btn.active-btn {
            background: var(--ym-theme);
            color: #000;
            font-weight: bold;
        }

        .ym-rec-active {
            animation: pulse 1.5s infinite;
            background: #990000 !important;
            border-color: red !important;
            font-weight: bold;
        }

        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.7; }
            100% { opacity: 1; }
        }

        input[type="text"] {
            background: #222;
            border: 1px solid #444;
            color: #fff;
            padding: 5px;
            border-radius: 4px;
            width: 100%;
            min-width: 0;
        }

        input[type=range] {
            accent-color: var(--ym-theme);
            width: 100%;
            min-width: 0;
        }

        select {
            min-width: 0;
            max-width: 100%;
        }

        #ym-float-btn {
            position: fixed;
            width: 50px;
            height: 50px;
            background: #111;
            border: 2px solid var(--ym-theme);
            border-radius: 50%;
            text-align: center;
            line-height: 50px;
            font-size: 24px;
            cursor: pointer;
            z-index: 2147483647;
            box-shadow: 0 0 15px rgba(0,0,0,0.5);
            transition: transform 0.2s;
            user-select: none;
        }

        #ym-float-btn:hover {
            transform: scale(1.1);
        }

        .ym-stealth #ym-panel, .ym-stealth #ym-float-btn {
            display: none !important;
        }

        .ym-zapper-hover {
            outline: 3px solid red !important;
            cursor: crosshair !important;
            opacity: 0.7 !important;
        }

        .sup-row {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
            min-width: 0;
        }

        .sup-icon {
            height: 20px;
            width: 20px;
            margin-right: 10px;
            flex-shrink: 0;
        }

        .sup-val {
            flex: 1;
            margin: 0 10px;
            background: #222;
            border: 1px solid #444;
            color: #fff;
            padding: 5px;
            border-radius: 4px;
            font-size: 11px;
            min-width: 0;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .sup-copy {
            background: #333;
            color: #fff;
            border: 1px solid #444;
            padding: 5px 10px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 11px;
            flex-shrink: 0;
        }

        .sup-copy:hover {
            background: #444;
        }

        .adblock-status {
            font-size: 10px;
            color: #f00;
            text-align: center;
            margin: 5px 0;
            padding: 2px;
            background: #222;
            border-radius: 3px;
            font-weight: bold;
        }

        .emergency-reset {
            background: #8B0000 !important;
            margin-top: 10px;
            font-weight: bold;
        }

        .emergency-reset:hover {
            background: #A00000 !important;
            animation: emergencyPulse 0.8s infinite;
        }

        @keyframes emergencyPulse {
            0% { opacity: 1; }
            50% { opacity: 0.7; }
            100% { opacity: 1; }
        }

        .player-restore {
            background: #2a4d69 !important;
            margin-top: 5px;
        }

        .adguard-section {
            margin: 15px 0;
            padding: 10px;
            background: rgba(30, 30, 30, 0.8);
            border-radius: 8px;
            border-left: 3px solid #2e7d32;
        }

        .adguard-buttons-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 6px;
            margin: 8px 0;
        }

        .adguard-btn {
            padding: 6px 4px;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            text-align: center;
            font-size: 10px;
            font-weight: bold;
            text-decoration: none;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
            min-width: 0;
            overflow: hidden;
        }

        .adguard-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        .adguard-btn.chrome { background: linear-gradient(135deg, #4285f4, #3367d6); }
        .adguard-btn.opera { background: linear-gradient(135deg, #ff1b2d, #cc0000); }
        .adguard-btn.firefox { background: linear-gradient(135deg, #ff7139, #e65c2e); }
        .adguard-btn.edge { background: linear-gradient(135deg, #0078d7, #106ebe); }

        .adguard-warning {
            font-size: 10px;
            color: #ff9800;
            text-align: left;
            margin: 10px 0;
            padding: 8px;
            background: rgba(255, 152, 0, 0.1);
            border-radius: 6px;
            border-left: 3px solid #ff9800;
            line-height: 1.3;
        }

        .adguard-official {
            background: linear-gradient(135deg, #ff6b35, #ff5722) !important;
            margin: 8px 0 0 0;
            font-weight: bold;
            font-size: 11px;
            padding: 8px;
        }

        .adguard-official:hover {
            background: linear-gradient(135deg, #ff5722, #f4511e) !important;
        }

        .browser-label {
            font-size: 9px;
            color: #aaa;
            text-align: center;
            margin-top: 5px;
            margin-bottom: 8px;
        }

        .adguard-btn-icon {
            width: 14px;
            height: 14px;
            filter: brightness(0) invert(1);
        }

        .ym-footer-drag {
            color: #888;
            font-size: 11px;
            text-align: center;
            margin-top: 20px;
            padding-bottom: 10px;
            cursor: move;
            user-select: none;
            flex-shrink: 0;
        }

        .resize-handle {
            position: absolute;
            background: transparent;
            z-index: 2147483648;
        }

        .resize-handle.right {
            right: 0;
            top: 0;
            bottom: 0;
            width: 10px;
            cursor: ew-resize;
        }

        .resize-handle.bottom {
            bottom: 0;
            left: 0;
            right: 0;
            height: 10px;
            cursor: ns-resize;
        }

        .resize-handle.bottom-right {
            bottom: 0;
            right: 0;
            width: 15px;
            height: 15px;
            cursor: se-resize;
        }
    `;

    GM_addStyle(cssStructure);

    function applyZapperList() {
        if (!zapperObserver) {
            zapperObserver = new MutationObserver(() => {
                config.zapperList.forEach(selector => {
                    try {
                        document.querySelectorAll(selector).forEach(el => {
                            if (el && el.parentNode) el.style.display = 'none';
                        });
                    } catch (e) {}
                });
            });

            zapperObserver.observe(document.body, {
                childList: true,
                subtree: true
            });
        }

        config.zapperList.forEach(selector => {
            try {
                document.querySelectorAll(selector).forEach(el => {
                    if (el && el.parentNode) el.style.display = 'none';
                });
            } catch (e) {}
        });
    }

    function removeZapperElement(element) {
        if (element && element.parentNode) {
            element.style.display = 'none';
            const selector = getZapperSelector(element);
            if (selector && !config.zapperList.includes(selector)) {
                config.zapperList.push(selector);
                GM_setValue('ytMasterZapperList', config.zapperList);
            }
        }
    }

    function getZapperSelector(element) {
        if (!element || !element.tagName) return null;
        if (element.id) return `#${CSS.escape(element.id)}`;
        if (element.className && typeof element.className === 'string') {
            const classes = element.className.split(' ').filter(c => c.length > 0);
            if (classes.length > 0) {
                return `${element.tagName.toLowerCase()}.${classes.map(c => CSS.escape(c)).join('.')}`;
            }
        }
        const parent = element.parentElement;
        let index = Array.from(parent ? parent.children : []).indexOf(element) + 1;
        return `${element.tagName.toLowerCase()}:nth-child(${index})`;
    }

    function initAudioContext() {
        if (audioCtx) return;
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioCtx = new AudioContext();
            const video = document.querySelector('video');
            if (!video) return;
            if (!audioSource) {
                audioSource = audioCtx.createMediaElementSource(video);
                gainNode = audioCtx.createGain();
                bassNode = audioCtx.createBiquadFilter();
                trebleNode = audioCtx.createBiquadFilter();
                bassNode.type = 'lowshelf'; bassNode.frequency.value = 200;
                trebleNode.type = 'highshelf'; trebleNode.frequency.value = 2000;
                audioSource.connect(bassNode); bassNode.connect(trebleNode); trebleNode.connect(gainNode); gainNode.connect(audioCtx.destination);
            }
            applyAudioSettings();
        } catch (e) {}
    }

    function applyAudioSettings() {
        if (!gainNode) initAudioContext();
        if (gainNode) { gainNode.gain.value = config.audioBoost / 100; bassNode.gain.value = config.eqBass; trebleNode.gain.value = config.eqTreble; }
    }

    function resetAudioSettings() { updateConfig('audioBoost', 100); updateConfig('eqBass', 0); updateConfig('eqTreble', 0); refreshInputs(); }

    function toggleRecording() { if (isRecording) stopRecording(); else startRecording(); }

    function startRecording() {
        const video = document.querySelector('video'); if (!video) return;
        try {
            const stream = video.captureStream();
            mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
            recordedChunks = [];
            mediaRecorder.ondataavailable = (event) => { if (event.data.size > 0) recordedChunks.push(event.data); };
            mediaRecorder.onstop = () => {
                const blob = new Blob(recordedChunks, { type: 'video/webm' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a'); a.href = url; a.download = `yt_rec_${new Date().getTime()}.webm`; a.click();
                window.URL.revokeObjectURL(url); updateRecButton(false);
            };
            mediaRecorder.start(); isRecording = true; updateRecButton(true);
        } catch (e) { alert('Error: Browser does not support direct recording here.'); }
    }

    function stopRecording() { if (mediaRecorder && isRecording) { mediaRecorder.stop(); isRecording = false; } }

    function updateRecButton(active) {
        const btn = document.getElementById('btn-rec');
        if (btn) {
            if (active) { btn.innerText = '⏹️ ' + t('recordVideo'); btn.classList.add('ym-rec-active'); }
            else { btn.innerText = '🔴 ' + t('recordVideo'); btn.classList.remove('ym-rec-active'); }
        }
    }

    function setLoopA() { const v = document.querySelector('video'); if (v) { loopStart = v.currentTime; loopActive = true; updateLoopUI(); } }

    function setLoopB() { const v = document.querySelector('video'); if (v) { loopEnd = v.currentTime; loopActive = true; updateLoopUI(); } }

    function clearLoop() { loopStart = null; loopEnd = null; loopActive = false; updateLoopUI(); }

    function updateLoopUI() {
        const status = document.getElementById('loop-status');
        if (status) {
            const a = loopStart !== null ? loopStart.toFixed(1) + 's' : '...';
            const b = loopEnd !== null ? loopEnd.toFixed(1) + 's' : '...';
            status.innerText = `Loop: [A: ${a}] - [B: ${b}] ${loopActive ? '(ON)' : ''}`;
            status.style.color = loopActive ? '#00ff00' : '#888';
        }
    }

    function toggleZapper() {
        zapperActive = !zapperActive;
        let overlay = document.getElementById('ym-zapper-overlay');
        if (!overlay) {
            overlay = el('div', {
                id: 'ym-zapper-overlay',
                style: {
                    position: 'fixed',
                    top: '0',
                    left: '0',
                    width: '100%',
                    background: 'red',
                    color: 'white',
                    zIndex: '2147483646',
                    textAlign: 'center',
                    padding: '10px',
                    fontWeight: 'bold',
                    display: 'none'
                }
            });
            document.body.appendChild(overlay);
        }
        if (zapperActive) {
            overlay.innerText = t('stopZapper');
            overlay.style.display = 'block';
            document.addEventListener('mouseover', onZapMove);
            document.addEventListener('click', onZapClick, true);
            document.addEventListener('keydown', onZapKey);
            const panel = document.getElementById('ym-panel');
            if (panel) panel.style.display = 'none';
        } else {
            overlay.style.display = 'none';
            document.removeEventListener('mouseover', onZapMove);
            document.removeEventListener('click', onZapClick, true);
            document.removeEventListener('keydown', onZapKey);
            document.querySelectorAll('.ym-zapper-hover').forEach(e => e.classList.remove('ym-zapper-hover'));
        }

        const btn = document.getElementById('btn-zapper');
        if (btn) {
            btn.innerText = (zapperActive ? '🎯 ' : '🎯 ') + t('zapperMode') + (zapperActive ? ' (ON)' : '');
            if (zapperActive) {
                btn.classList.add('active-btn');
            } else {
                btn.classList.remove('active-btn');
            }
        }
    }

    function onZapMove(e) {
        document.querySelectorAll('.ym-zapper-hover').forEach(el => el.classList.remove('ym-zapper-hover'));
        if (e.target.id !== 'ym-zapper-overlay') e.target.classList.add('ym-zapper-hover');
    }

    function onZapClick(e) {
        if (!zapperActive) return;
        e.preventDefault();
        e.stopPropagation();
        removeZapperElement(e.target);
    }

    function onZapKey(e) {
        if (e.key === 'Escape') toggleZapper();
    }

    function resetZappedElements() {
        config.zapperList = [];
        GM_setValue('ytMasterZapperList', []);
        if (zapperObserver) {
            zapperObserver.disconnect();
            zapperObserver = null;
        }
        location.reload();
    }

    async function downloadSubtitles() {
        try {
            const player = document.getElementById('movie_player'); if (!player) return alert('Player not found.');
            const captions = player.getOption('captions', 'tracklist'); if (!captions || captions.length === 0) return alert('No subtitles.');
            const track = captions.find(c => c.languageCode === player.getOption('captions', 'track').languageCode) || captions[0];
            const response = await fetch(track.baseUrl + '&fmt=srv3');
            const text = await response.text();
            let srtOutput = '', srtIndex = 1, match;
            const regex = /<p t="(\d+)" d="(\d+)".*?>(.*?)<\/p>/g;
            function fmt(ms) { const d = new Date(ms); return d.toISOString().slice(11, 23).replace('.', ','); }
            while ((match = regex.exec(text)) !== null) {
                srtOutput += `${srtIndex}\n${fmt(parseInt(match[1]))} --> ${fmt(parseInt(match[1]) + parseInt(match[2]))}\n${match[3].replace(/&quot;/g,'"').replace(/&#39;/g,"'")}\n\n`;
                srtIndex++;
            }
            const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([srtOutput], { type: 'text/srt' })); a.download = `subs.srt`; a.click();
        } catch (e) { alert('Download error.'); }
    }

    function enforceQuality() {
        if (!config.forceQuality) return;
        const player = document.getElementById('movie_player');
        if (player && player.getAvailableQualityLevels) {
            const levels = player.getAvailableQualityLevels();
            if (levels.length > 0 && player.getPlaybackQuality() !== levels[0]) player.setPlaybackQualityRange(levels[0], levels[0]);
        }
    }

    function el(tag, props = {}, children = []) {
        const element = document.createElement(tag);
        for (let key in props) {
            if (key === 'style') {
                Object.assign(element.style, props[key]);
            } else if (key.startsWith('on')) {
                element.addEventListener(key.substring(2).toLowerCase(), props[key]);
            } else if (key.startsWith('data-')) {
                element.setAttribute(key, props[key]);
            } else {
                element[key] = props[key];
            }
        }
        children.forEach(child => { if (typeof child === 'string') element.appendChild(document.createTextNode(child)); else element.appendChild(child); });
        return element;
    }

    function switchTab(tabId) {
        const tabElement = document.querySelector(`[data-tab="${tabId}"]`);
        const contentElement = document.getElementById(`tab-${tabId}`);
        if (!tabElement || !contentElement) return;
        document.querySelectorAll('.ym-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.ym-content').forEach(c => c.classList.remove('active'));
        tabElement.classList.add('active');
        contentElement.classList.add('active');
    }

    function setupCopyButtons() {
        document.querySelectorAll('.sup-copy').forEach(btn => {
            btn.addEventListener('click', function() {
                const val = this.getAttribute('data-val');
                navigator.clipboard.writeText(val).then(() => {
                    const originalText = this.innerText;
                    this.innerText = t('copied');
                    setTimeout(() => this.innerText = originalText, 2000);
                }).catch(err => {
                    console.error('Failed to copy: ', err);
                });
            });
        });
    }

    function createResizeHandles(panel) {
        const rightHandle = el('div', {
            className: 'resize-handle right'
        });

        const bottomHandle = el('div', {
            className: 'resize-handle bottom'
        });

        const bottomRightHandle = el('div', {
            className: 'resize-handle bottom-right'
        });

        panel.appendChild(rightHandle);
        panel.appendChild(bottomHandle);
        panel.appendChild(bottomRightHandle);

        function initResize(handle, direction) {
            let startX, startY, startWidth, startHeight;

            function onMouseMove(e) {
                e.preventDefault();
                if (direction === 'horizontal' || direction === 'both') {
                    const newWidth = startWidth + (e.clientX - startX);
                    if (newWidth >= 350 && newWidth <= window.innerWidth * 0.9) {
                        panel.style.width = newWidth + 'px';
                    }
                }
                if (direction === 'vertical' || direction === 'both') {
                    const newHeight = startHeight + (e.clientY - startY);
                    if (newHeight >= 300 && newHeight <= window.innerHeight * 0.9) {
                        panel.style.height = newHeight + 'px';
                    }
                }
            }

            function onMouseUp() {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                config.panelSize = {
                    width: panel.style.width,
                    height: panel.style.height
                };
                GM_setValue('ytMasterConfig', config);
            }

            handle.addEventListener('mousedown', function(e) {
                e.preventDefault();
                startX = e.clientX;
                startY = e.clientY;
                startWidth = parseInt(document.defaultView.getComputedStyle(panel).width, 10);
                startHeight = parseInt(document.defaultView.getComputedStyle(panel).height, 10);
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            });
        }

        initResize(rightHandle, 'horizontal');
        initResize(bottomHandle, 'vertical');
        initResize(bottomRightHandle, 'both');
    }

    function buildUI() {
        if (document.getElementById('ym-panel')) return;

        const createFooter = () => el('div', {
            className: 'ym-footer-drag',
            style: { color: '#888', fontSize: '11px', textAlign: 'center', marginTop: '20px', paddingBottom: '10px', cursor: 'move', userSelect: 'none' }
        }, [t('rights')]);

        const tGeneral = el('div', { className: 'ym-content active', id: 'tab-general' }, [
            createCheck(t('adblock'), 'adblock'),

            el('div', { className: 'adguard-section' }, [
                el('div', {
                    style: {
                        fontSize: '12px',
                        color: '#fff',
                        marginBottom: '8px',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                    } },
                    [ '🛡️ ' + t('installAdguardFor') ]
                ),
                el('div', {
                    className: 'adguard-buttons-grid'
                }, [
                    el('a', {
                        className: 'adguard-btn chrome',
                        href: 'https://chromewebstore.google.com/detail/adguard-adblocker/bgnkhhnnamicmpeenaelnjfhikgbkllg',
                        target: '_blank',
                        title: 'AdGuard para Google Chrome',
                        style: { textDecoration: 'none' }
                    }, ['Chrome']),

                    el('a', {
                        className: 'adguard-btn opera',
                        href: 'https://addons.opera.com/pt-br/extensions/details/adguard/',
                        target: '_blank',
                        title: 'AdGuard para Opera',
                        style: { textDecoration: 'none' }
                    }, ['Opera']),

                    el('a', {
                        className: 'adguard-btn firefox',
                        href: 'https://addons.mozilla.org/pt-BR/firefox/addon/adguard-adblocker/',
                        target: '_blank',
                        title: 'AdGuard para Firefox',
                        style: { textDecoration: 'none' }
                    }, ['Firefox']),

                    el('a', {
                        className: 'adguard-btn edge',
                        href: 'https://microsoftedge.microsoft.com/addons/detail/bloqueador-adguard/pdffkfellgipmhklpdmokmckkkfcopbh',
                        target: '_blank',
                        title: 'AdGuard para Microsoft Edge',
                        style: { textDecoration: 'none' }
                    }, ['Edge'])
                ]),
                el('div', {
                    className: 'browser-label'
                }, [t('chooseBrowser')]),
                el('a', {
                    className: 'ym-btn adguard-official',
                    innerText: '🌐 ' + t('officialAdguard'),
                    href: 'https://adguard.com/',
                    target: '_blank',
                    style: { textDecoration: 'none', display: 'block', textAlign: 'center' }
                })
            ]),

            el('div', {
                className: 'adguard-warning'
            }, [t('recommendedForBest')]),

            el('hr', { style: { border: '0', borderTop: '1px solid #333', margin: '15px 0' } }),

            createCheck(t('forceQuality'), 'forceQuality'),
            createCheck(t('cinemaMode'), 'cinemaMode'),
            el('hr', { style: { border: '0', borderTop: '1px solid #333', margin: '10px 0' } }),
            createCheck(t('redirectShorts'), 'redirectShorts'),
            createCheck(t('hideShorts'), 'hideShorts'),
            el('div', { className: 'adblock-status', id: 'adblock-status-indicator' }, [t('adblockStatus')]),
            el('button', {
                id: 'btn-emergency-reset',
                className: 'ym-btn emergency-reset',
                innerText: t('resetDetection'),
                onclick: () => {
                    const result = emergencyDetectionReset();
                    const btn = document.getElementById('btn-emergency-reset');
                    const originalText = btn.innerText;
                    btn.innerText = result;
                    setTimeout(() => btn.innerText = originalText, 3000);
                }
            }),
            el('div', { style: { color: '#888', fontSize: '11px', textAlign: 'center', marginTop: '10px' } }, [t('stealthTip')]),
            createFooter()
        ]);

        const tAudio = el('div', { className: 'ym-content', id: 'tab-audio' }, [
            el('h3', { style: { margin: '0 0 10px 0', fontSize: '14px', color: '#fff' } }, [t('audioBooster')]),
            createRange('🔊 ' + t('volumeBoost'), 'audioBoost', 100, 600, '%', 10),
            el('hr', { style: { border: '0', borderTop: '1px solid #333', margin: '10px 0' } }),
            createRange('🎸 ' + t('bass'), 'eqBass', -20, 20, 'dB'),
            createRange('🎻 ' + t('treble'), 'eqTreble', -20, 20, 'dB'),
            el('button', { className: 'ym-btn', innerText: t('resetAudio'), onclick: () => { initAudioContext(); resetAudioSettings(); } }),
            createFooter()
        ]);

        const tImage = el('div', { className: 'ym-content', id: 'tab-image' }, [
            el('h3', { style: { margin: '0 0 10px 0', fontSize: '14px', color: '#fff' } }, [t('imageAdjust')]),
            createRange('☀️ ' + t('brightness'), 'vBrightness', 0, 200, '%'),
            createRange('🌗 ' + t('contrast'), 'vContrast', 0, 200, '%'),
            createRange('🎨 ' + t('saturation'), 'vSaturate', 0, 200, '%'),
            el('hr', { style: { border: '0', borderTop: '1px solid #333', margin: '10px 0' } }),
            createCheck('✨ ' + t('hdrMode'), 'vHDR'),
            createRange('🌑 ' + t('grayscale'), 'vGrayscale', 0, 100, '%'),
            el('button', { className: 'ym-btn', style: { marginTop: '15px', background: '#4a1111' }, innerText: t('resetImage'), onclick: resetImage }),
            createFooter()
        ]);

        const tVisual = el('div', { className: 'ym-content', id: 'tab-visual' }, [
            el('h3', { style: { margin: '0 0 10px 0', fontSize: '14px', color: '#fff' } }, [t('colorsSizes')]),
            createColor(t('titleColor'), 'titleColor'),
            createColor(t('textColor'), 'textColor'),
            createRange(t('fontSize'), 'titleFontSize', 50, 200, '%'),
            el('hr', { style: { border: '0', borderTop: '1px solid #333', margin: '10px 0' } }),
            el('h3', { style: { margin: '0 0 10px 0', fontSize: '14px', color: '#fff' } }, [t('background')]),
            el('div', { className: 'ym-row' }, [
                el('span', {}, [t('bgType')]),
                el('select', { style: { padding: '5px', borderRadius: '4px', background: '#333', color: '#fff' }, onchange: (e) => updateConfig('bgType', e.target.value) }, [
                    el('option', { value: 'default', innerText: t('bgDefault'), selected: config.bgType === 'default' }),
                    el('option', { value: 'color', innerText: t('bgColor'), selected: config.bgType === 'color' }),
                    el('option', { value: 'image', innerText: t('bgImage'), selected: config.bgType === 'image' })
                ])
            ]),
            config.bgType === 'color' ? createColor(t('chooseColor'), 'bgColor') : null,
            config.bgType === 'image' ? el('div', { style: { marginBottom: '10px' } }, [
                el('div', { style: { marginBottom: '5px' } }, [t('imageLink')]),
                el('input', { type: 'text', placeholder: 'Paste link...', value: config.bgImage, onchange: (e) => updateConfig('bgImage', e.target.value) })
            ]) : null,
            (config.bgType === 'image') ? createRange(t('contentOpacity'), 'bgOpacity', 0, 100, '%') : null,
            el('hr', { style: { border: '0', borderTop: '1px solid #333', margin: '10px 0' } }),
            createColor(t('themeColor'), 'themeColor'),
            createColor(t('buttonBG'), 'btnColor'),
            createColor(t('buttonText'), 'btnTextColor'),
            el('button', { className: 'ym-btn', style: { marginTop: '15px', background: '#4a1111' }, innerText: t('resetVisual'), onclick: resetVisual }),
            createFooter()
        ].filter(Boolean));

        const tSubtitles = el('div', { className: 'ym-content', id: 'tab-subtitles' }, [
            createColor(t('titleColor'), 'subColor'),
            createRange(t('fontSize'), 'subSize', 50, 250, '%'),
            el('button', { className: 'ym-btn', innerText: '📥 ' + t('downloadSubs'), onclick: downloadSubtitles }),
            createFooter()
        ]);

        const tTools = el('div', { className: 'ym-content', id: 'tab-tools' }, [
            el('h3', { style: { margin: '0 0 10px 0', fontSize: '14px', color: '#fff' } }, [t('tools')]),
            createRange('⏩ ' + t('speed'), 'videoSpeed', 0.1, 5.0, 'x', 0.1),
            el('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '15px' } }, [
                 el('button', { className: 'ym-btn', style: { width: '48%' }, innerText: t('normal'), onclick: () => { updateConfig('videoSpeed', 1.0); refreshInputs(); } }),
                 el('button', { className: 'ym-btn', style: { width: '48%' }, innerText: t('fast'), onclick: () => { updateConfig('videoSpeed', 2.5); refreshInputs(); } })
            ]),
            el('hr', { style: { border: '0', borderTop: '1px solid #333', margin: '10px 0' } }),
            el('button', { id: 'btn-rec', className: 'ym-btn', innerText: '🔴 ' + t('recordVideo'), onclick: toggleRecording }),
            el('hr', { style: { border: '0', borderTop: '1px solid #333', margin: '10px 0' } }),
            el('div', { style: { display: 'flex', gap: '5px' } }, [
                el('button', { className: 'ym-btn', innerText: t('setA'), onclick: setLoopA }),
                el('button', { className: 'ym-btn', innerText: t('setB'), onclick: setLoopB }),
                el('button', { className: 'ym-btn', innerText: t('clear'), onclick: clearLoop }),
            ]),
            el('div', { id: 'loop-status', style: { textAlign: 'center', margin: '5px 0', fontSize: '11px', color: '#888' } }, [t('loopInactive')]),
            el('hr', { style: { border: '0', borderTop: '1px solid #333', margin: '10px 0' } }),
            createRange('🔍 ' + t('zoom'), 'videoZoom', 100, 300, '%'),
            createRange('🔄 ' + t('rotation'), 'videoRotate', -720, 720, '°'),
            el('button', { className: 'ym-btn', style: { marginBottom: '15px', background: '#4a1111' }, innerText: t('resetZoom'), onclick: () => { updateConfig('videoZoom', 100); updateConfig('videoRotate', 0); refreshInputs(); } }),
            el('hr', { style: { border: '0', borderTop: '1px solid #333', margin: '10px 0' } }),
            el('button', { id: 'btn-zapper', className: 'ym-btn', innerText: '🎯 ' + t('zapperMode') + (zapperActive ? ' (ON)' : ''), onclick: toggleZapper }),
            el('button', { className: 'ym-btn', style: { background: '#4a1111' }, innerText: '🔄 ' + t('resetZapped'), onclick: resetZappedElements }),
            el('div', { style: { color: '#888', fontSize: '11px', textAlign: 'center', margin: '5px 0' } }, ['Click: Hide element | ESC: Exit']),
            el('hr', { style: { border: '0', borderTop: '1px solid #333', margin: '10px 0' } }),
            el('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' } }, [
                el('button', { className: 'ym-btn', innerText: '📸 ' + t('screenshot'), onclick: takeScreenshot }),
                el('button', { className: 'ym-btn', innerText: '📺 ' + t('pip'), onclick: togglePiP }),
                el('button', { className: 'ym-btn', innerText: '👁️ ' + t('stealth'), onclick: toggleStealthMode }),
                el('button', { className: 'ym-btn', innerText: '🖼️ ' + t('thumbnail'), onclick: downloadThumb })
            ]),
            el('button', {
                id: 'btn-restore-player',
                className: 'ym-btn player-restore',
                innerText: t('restorePlayer'),
                onclick: () => {
                    const result = restoreYouTubePlayer();
                    const btn = document.getElementById('btn-restore-player');
                    const originalText = btn.innerText;
                    btn.innerText = result ? '✅ Player Destravado!' : '❌ Falha ao destravar';
                    setTimeout(() => btn.innerText = originalText, 2000);
                }
            }),
            createFooter()
        ]);

        const tHotkeys = el('div', { className: 'ym-content', id: 'tab-hotkeys' }, [
            el('h3', { style: { margin: '0 0 10px 0', fontSize: '14px', color: '#fff' } }, [t('keyboardShortcuts')]),
            el('div', { style: { fontSize: '12px', lineHeight: '1.6' } }, [
                el('div', { style: { marginBottom: '8px' } }, [el('b', {}, [t('panelHotkey')])]),
                el('div', { style: { marginBottom: '8px' } }, [el('b', {}, [t('stealthHotkey')])]),
                el('div', { style: { marginBottom: '8px' } }, [el('b', {}, [t('screenshotHotkey')])]),
                el('div', { style: { marginBottom: '8px' } }, [el('b', {}, [t('zoomInHotkey')])]),
                el('div', { style: { marginBottom: '8px' } }, [el('b', {}, [t('zoomOutHotkey')])]),
                el('div', { style: { marginBottom: '8px' } }, [el('b', {}, [t('rotateRightHotkey')])]),
                el('div', { style: { marginBottom: '8px' } }, [el('b', {}, [t('rotateLeftHotkey')])]),
                el('div', { style: { marginBottom: '8px' } }, [el('b', {}, [t('resetZoomHotkey')])]),
                el('div', { style: { marginBottom: '8px' } }, [el('b', {}, [t('menuHotkey')])]),
                el('hr', { style: { border: '0', borderTop: '1px solid #333', margin: '15px 0' } }),
                createFooter()
            ])
        ]);

        const tAbout = el('div', { className: 'ym-content', id: 'tab-about' }, [
            el('h3', { style: { margin: '0 0 10px 0', fontSize: '14px', color: '#fff' } }, [t('aboutTitle')]),
            el('div', { style: { fontSize: '12px', lineHeight: '1.6' } }, [
                el('p', {}, [t('version')]),
                el('ul', { style: { paddingLeft: '20px', margin: '10px 0' } }, [
                    el('li', {}, [t('audioBoosterFeature')]),
                    el('li', {}, [t('videoRecording')]),
                    el('li', {}, [t('abLoop')]),
                    el('li', {}, [t('speedControl')]),
                    el('li', {}, [t('imageAdjustments')]),
                    el('li', {}, [t('themeCustomization')]),
                    el('li', {}, [t('subtitlesDownload')])
                ]),
                el('hr', { style: { border: '0', borderTop: '1px solid #333', margin: '15px 0' } }),
                el('h4', { style: { color: '#d63384', margin: '10px 0 5px' } }, [t('supportProject')]),
                el('p', { style: { fontSize: '11px', color: '#aaa', marginBottom: '10px' } }, [t('supportText')]),
                el('div', { style: { textAlign: 'left', color: '#d63384', fontWeight: 'bold', fontSize: '10px', marginBottom: '5px' } }, [t('pixBrazil')]),
                el('div', { className: 'sup-row' }, [
                    el('img', { src: ICONS.pix, className: 'sup-icon', style: { height: '20px', width: '20px' } }),
                    el('input', { type: 'text', className: 'sup-val', readonly: true, value: '69993230419', style: { flex: 1, margin: '0 10px', background: '#222', border: '1px solid #444', color: '#fff', padding: '5px', borderRadius: '4px', fontSize: '11px' } }),
                    el('button', { className: 'sup-copy', 'data-val': '69993230419', style: { background: '#333', color: '#fff', border: '1px solid #444', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' } }, [t('copy')])
                ]),
                el('div', { style: { textAlign: 'left', color: '#d63384', fontWeight: 'bold', fontSize: '10px', margin: '15px 0 5px' } }, [t('cryptocurrency')]),
                ...['btc', 'eth', 'sol', 'usdt'].map(crypto => {
                    let address, name;
                    switch(crypto) {
                        case 'btc': address = 'bc1q6gz3dtj9qvlxyyh3grz35x8xc7hkuj07knlemn'; name = 'BTC'; break;
                        case 'eth': address = '0xd8724d0b19d355e9817d2a468f49e8ce067e70a6'; name = 'ETH'; break;
                        case 'sol': address = '7ztAogE7SsyBw7mwVHhUr5ZcjUXQr99JoJ6oAgP99aCn'; name = 'SOL'; break;
                        case 'usdt': address = '0xd8724d0b19d355e9817d2a468f49e8ce067e70a6'; name = 'USDT'; break;
                    }
                    return el('div', { className: 'sup-row', style: { marginBottom: '5px' } }, [
                        el('img', { src: ICONS[crypto], className: 'sup-icon', style: { height: '20px', width: '20px' } }),
                        el('span', { style: { fontSize: '9px', color: '#888', width: '30px' } }, [name]),
                        el('input', { type: 'text', className: 'sup-val', readonly: true, value: address, style: { flex: 1, margin: '0 10px', background: '#222', border: '1px solid #444', color: '#fff', padding: '5px', borderRadius: '4px', fontSize: '11px' } }),
                        el('button', { className: 'sup-copy', 'data-val': address, style: { background: '#333', color: '#fff', border: '1px solid #444', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' } }, [t('copy')])
                    ]);
                }),
                el('div', { style: { textAlign: 'center', marginTop: '20px' } }, [
                    el('a', { href: 'https://www.paypal.com/donate/?business=4J4UK7ACU3DS6', target: '_blank', style: { display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#003087', color: 'white', padding: '8px 20px', borderRadius: '20px', textDecoration: 'none', fontWeight: 'bold', fontSize: '12px' } }, [
                        el('img', { src: ICONS.paypal, style: { height: '20px' } }),
                        ' PayPal'
                    ])
                ]),
                el('hr', { style: { border: '0', borderTop: '1px solid #333', margin: '15px 0' } }),
                createFooter()
            ])
        ]);

        const header = el('div', { id: 'ym-header' }, [
            el('span', { innerText: '⚡ YT Master v1.3.4', style: { fontWeight: 'bold', pointerEvents: 'none' } }),
            el('span', { innerText: '✖', style: { cursor: 'pointer', fontSize: '16px' }, onclick: toggleMenu })
        ]);

        const tabsContainer = el('div', { id: 'ym-tabs' });
        const tabs = [
            { n: t('general'), id: 'general', c: tGeneral },
            { n: t('audio'), id: 'audio', c: tAudio },
            { n: t('image'), id: 'image', c: tImage },
            { n: t('visual'), id: 'visual', c: tVisual },
            { n: t('tools'), id: 'tools', c: tTools },
            { n: t('subtitles'), id: 'subtitles', c: tSubtitles },
            { n: t('hotkeys'), id: 'hotkeys', c: tHotkeys },
            { n: t('about'), id: 'about', c: tAbout }
        ];

        tabs.forEach((t, index) => {
            tabsContainer.appendChild(el('div', {
                className: `ym-tab ${index === 0 ? 'active' : ''}`,
                innerText: t.n,
                'data-tab': t.id,
                onclick: () => switchTab(t.id)
            }));
        });

        const panel = el('div', { id: 'ym-panel' }, [header, tabsContainer, tGeneral, tAudio, tImage, tVisual, tTools, tSubtitles, tHotkeys, tAbout]);

        if (config.panelPos.left !== 'auto') {
            panel.style.left = config.panelPos.left;
            panel.style.top = config.panelPos.top;
            panel.style.right = 'auto';
            panel.style.bottom = 'auto';
        } else {
            panel.style.right = config.panelPos.right;
            panel.style.bottom = config.panelPos.bottom;
            panel.style.left = 'auto';
            panel.style.top = 'auto';
        }

        panel.style.width = config.panelPos.width;
        panel.style.height = config.panelPos.height;

        document.documentElement.appendChild(panel);

        createResizeHandles(panel);

        makeDraggable(panel, header, 'panelPos', null);
        panel.querySelectorAll('.ym-footer-drag').forEach(footer => {
            makeDraggable(panel, footer, 'panelPos', null);
        });

        setupCopyButtons();

        if (zapperActive) {
            const btn = document.getElementById('btn-zapper');
            if (btn) {
                btn.classList.add('active-btn');
                btn.innerText = '🎯 ' + t('zapperMode') + ' (ON)';
            }
        }

        updateAdblockStatus();
    }

    function makeDraggable(element, handle, configKey, clickCallback) {
        let isDragging = false, startX, startY, relativeX, relativeY;
        const onMouseDown = (e) => {
            if (['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName) || e.target.innerText === '✖') return;
            const rect = element.getBoundingClientRect();
            startX = e.clientX; startY = e.clientY;
            relativeX = e.clientX - rect.left; relativeY = e.clientY - rect.top;
            isDragging = false;
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        };
        const onMouseMove = (e) => {
            const dx = e.clientX - startX, dy = e.clientY - startY;
            if (!isDragging && Math.sqrt(dx*dx + dy*dy) > 3) {
                isDragging = true;
                element.style.bottom = 'auto'; element.style.right = 'auto';
                if (!element.style.width) element.style.width = element.offsetWidth + 'px';
            }
            if (isDragging) { e.preventDefault(); element.style.left = (e.clientX - relativeX) + 'px'; element.style.top = (e.clientY - relativeY) + 'px'; }
        };
        const onMouseUp = (e) => {
            document.removeEventListener('mousemove', onMouseMove); document.removeEventListener('mouseup', onMouseUp);
            if (isDragging && configKey) { config[configKey] = { top: element.style.top, left: element.style.left, width: element.style.width, height: element.style.height }; GM_setValue('ytMasterConfig', config); }
            else if (!isDragging && clickCallback) clickCallback();
        };
        handle.addEventListener('mousedown', onMouseDown);
    }

    function refreshInputs() {
        const ids = ['videoZoom', 'videoRotate', 'vBrightness', 'vContrast', 'vSaturate', 'vGrayscale', 'videoSpeed', 'audioBoost', 'eqBass', 'eqTreble', 'titleFontSize', 'bgOpacity'];
        ids.forEach(id => {
            if(document.getElementById('inp-'+id)) {
                document.getElementById('inp-'+id).value = config[id];
                let suffix = '%';
                if(id === 'videoRotate') suffix = '°';
                if(id === 'videoSpeed') suffix = 'x';
                if(id === 'eqBass' || id === 'eqTreble') suffix = 'dB';
                if(document.getElementById('disp-'+id)) document.getElementById('disp-'+id).innerText = config[id] + suffix;
            }
        });
        if (document.getElementById('ym-panel')) {
            const activeTab = document.querySelector('.ym-tab.active');
            const activeTabId = activeTab ? activeTab.getAttribute('data-tab') : 'general';
            document.getElementById('ym-panel').remove();
            buildUI();
            document.getElementById('ym-panel').style.display = 'flex';
            switchTab(activeTabId);
        }
    }

    function resetVisual() {
        updateConfig('themeColor', '#ff0000');
        updateConfig('titleColor', '#ffffff');
        updateConfig('textColor', '#aaaaaa');
        updateConfig('titleFontSize', 100);
        updateConfig('btnColor', '#065fd4');
        updateConfig('btnTextColor', '#ffffff');
        updateConfig('bgType', 'default');
        updateConfig('bgColor', '#000000');
        updateConfig('bgImage', '');
        updateConfig('bgOpacity', 80);
        refreshInputs();
    }

    function resetImage() {
        updateConfig('vBrightness', 100); updateConfig('vContrast', 100); updateConfig('vSaturate', 100);
        updateConfig('vGrayscale', 0); updateConfig('vSepia', 0); updateConfig('vHDR', false);
        refreshInputs();
    }

    function updateConfig(key, value) {
        config[key] = value;
        GM_setValue('ytMasterConfig', config);

        if (key === 'adblock') {
            if (adblockObserver) {
                adblockObserver.disconnect();
                adblockObserver = null;
            }
            playerUnlockAttempts = 0;
            setTimeout(initStealthAdblock, 1000);
        }

        applyLiveStyles();
        applyVideoTransforms();
        applyAudioSettings();
        if (key === 'bgType') refreshInputs();

        updateAdblockStatus();
    }

    function updateAdblockStatus() {
        const statusElement = document.getElementById('adblock-status-indicator');
        if (statusElement) {
            if (config.adblock) {
                statusElement.innerText = '🛡️ ' + (config.adblockStealth ? 'Anti-AdBlock: STEALTH MODE' : 'Anti-AdBlock: ACTIVE');
                statusElement.style.color = '#0f0';
            } else {
                statusElement.innerText = '🛡️ Anti-AdBlock: INACTIVE';
                statusElement.style.color = '#f00';
            }
        }
    }

    function createCheck(label, key) {
        return el('div', { className: 'ym-row' }, [
            el('span', {}, [label]),
            el('input', {
                type: 'checkbox',
                checked: config[key],
                onchange: (e) => updateConfig(key, e.target.checked)
            })
        ]);
    }

    function createColor(label, key) {
        return el('div', { className: 'ym-row' }, [
            el('span', {}, [label]),
            el('input', {
                type: 'color',
                value: config[key],
                oninput: (e) => updateConfig(key, e.target.value)
            })
        ]);
    }

    function createRange(label, key, min, max, suffix, step=1) {
        const display = el('b', { id: 'disp-'+key }, [config[key] + suffix]);
        return el('div', {}, [
            el('div', { className: 'ym-row' }, [
                el('span', {}, [label + ': ']),
                display
            ]),
            el('input', {
                id: 'inp-'+key,
                type: 'range',
                min: min,
                max: max,
                step: step,
                value: config[key],
                style: { width: '100%' },
                oninput: (e) => {
                    display.innerText = e.target.value + suffix;
                    updateConfig(key, e.target.value);
                }
            })
        ]);
    }

    function takeScreenshot() {
        const v = document.querySelector('video'); if(!v)return;
        const c=document.createElement('canvas');c.width=v.videoWidth;c.height=v.videoHeight;
        const ctx = c.getContext('2d'); ctx.filter = v.style.filter; ctx.drawImage(v,0,0);
        const a=document.createElement('a');a.href=c.toDataURL('image/png');a.download='screenshot_ym.png';a.click();
    }

    function togglePiP() {
        const v=document.querySelector('video');
        if(v) {
            if(document.pictureInPictureElement) {
                document.exitPictureInPicture();
            } else {
                v.requestPictureInPicture();
            }
        }
    }

    function downloadThumb() {
        const v=new URLSearchParams(location.search).get('v');
        if(v) {
            window.open(`https://img.youtube.com/vi/${v}/maxresdefault.jpg`);
        }
    }

    function toggleStealthMode() {
        config.uiHidden = !config.uiHidden;
        GM_setValue('ytMasterConfig', config);
        applyLiveStyles();
    }

    function toggleMenu() {
        const p = document.getElementById('ym-panel');
        if (!p) { buildUI(); document.getElementById('ym-panel').style.display = 'flex'; }
        else { p.style.display = p.style.display === 'none' ? 'flex' : 'none'; }
    }

    function checkButton() {
        if (!document.getElementById('ym-float-btn')) {
            const btn = el('div', { id: 'ym-float-btn', innerText: '⚙️' });
            if(config.btnPos.left !== 'auto') {
                btn.style.left = config.btnPos.left;
                btn.style.top = config.btnPos.top;
                btn.style.bottom = 'auto';
                btn.style.right = 'auto';
            } else {
                btn.style.bottom = config.btnPos.bottom;
                btn.style.right = config.btnPos.right;
            }
            document.documentElement.appendChild(btn);
            makeDraggable(btn, btn, 'btnPos', toggleMenu);
        }
    }

    document.addEventListener('keydown', function(e) {
        if (['INPUT', 'TEXTAREA'].includes(e.target.tagName) || e.target.isContentEditable) return;

        if (e.code === 'F9' || e.code === 'Insert') {
            e.preventDefault();
            toggleMenu();
            return;
        }

        if (e.shiftKey && (e.key === 'P' || e.key === 'p')) {
            e.preventDefault();
            takeScreenshot();
        }

        if (e.altKey && e.shiftKey && (e.key === 'Y' || e.key === 'y')) {
            e.preventDefault();
            toggleStealthMode();
        }

        if (e.ctrlKey && e.shiftKey) {
            switch(e.key) {
                case 'ArrowRight':
                    e.preventDefault();
                    updateConfig('videoRotate', parseInt(config.videoRotate) + 90);
                    refreshInputs();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    updateConfig('videoRotate', parseInt(config.videoRotate) - 90);
                    refreshInputs();
                    break;
                case 'ArrowUp':
                case '+':
                case '=':
                    e.preventDefault();
                    updateConfig('videoZoom', Math.min(parseInt(config.videoZoom) + 10, 300));
                    refreshInputs();
                    break;
                case 'ArrowDown':
                case '-':
                case '_':
                    e.preventDefault();
                    updateConfig('videoZoom', Math.max(parseInt(config.videoZoom) - 10, 50));
                    refreshInputs();
                    break;
                case '0':
                case ')':
                    e.preventDefault();
                    updateConfig('videoZoom', 100);
                    updateConfig('videoRotate', 0);
                    refreshInputs();
                    break;
            }
        }

        if (e.key === 'Escape' && zapperActive) {
            toggleZapper();
        }
    });

    function applyLiveStyles() {
        const root = document.documentElement.style;
        const body = document.body;
        root.setProperty('--ym-theme', config.themeColor);
        root.setProperty('--ym-title', config.titleColor);
        root.setProperty('--ym-text', config.textColor);
        root.setProperty('--ym-btn-bg', config.btnColor);
        root.setProperty('--ym-btn-txt', config.btnTextColor);
        root.setProperty('--ym-sub-color', config.subColor);
        root.setProperty('--ym-sub-bg', config.subBgColor);
        root.setProperty('--ym-sub-size', config.subSize + '%');
        root.setProperty('--ym-font-scale', config.titleFontSize / 100);

        root.setProperty('--yt-spec-text-primary', config.titleColor, 'important');
        root.setProperty('--yt-spec-text-secondary', config.textColor, 'important');

        if (config.hideShorts) body.classList.add('ym-hide-shorts'); else body.classList.remove('ym-hide-shorts');
        if (config.uiHidden) document.documentElement.classList.add('ym-stealth'); else document.documentElement.classList.remove('ym-stealth');

        if (config.bgType === 'color') {
            document.documentElement.classList.remove('ym-bg-image');
            root.setProperty('--yt-spec-base-background', config.bgColor, 'important');
            root.setProperty('--yt-spec-general-background-a', config.bgColor, 'important');
            root.setProperty('--yt-spec-general-background-b', config.bgColor, 'important');
        } else if (config.bgType === 'image') {
            document.documentElement.classList.add('ym-bg-image');
            root.setProperty('--yt-spec-base-background', 'transparent', 'important');
            root.setProperty('--yt-spec-general-background-a', 'transparent', 'important');
            root.setProperty('--yt-spec-general-background-b', 'transparent', 'important');
            root.setProperty('--ym-bg-url', `url(${config.bgImage})`);
            root.setProperty('--ym-content-opacity', config.bgOpacity / 100);
        } else {
            document.documentElement.classList.remove('ym-bg-image');
            root.removeProperty('--yt-spec-base-background');
            root.removeProperty('--yt-spec-general-background-a');
            root.removeProperty('--yt-spec-general-background-b');
        }

        if (config.adblock) {
            setTimeout(startPlayerMonitor, 3000);
        }
    }

    function applyVideoTransforms() {
        const video = document.querySelector('video'); if (!video) return;
        video.style.transform = `scale(${config.videoZoom / 100}) rotate(${config.videoRotate}deg)`;
        let filterString = `brightness(${config.vBrightness}%) contrast(${config.vContrast}%) saturate(${config.vSaturate}%) grayscale(${config.vGrayscale}%) sepia(${config.vSepia}%)`;
        if (config.vHDR) filterString += ` drop-shadow(0 0 1px rgba(255,255,255,0.3)) contrast(110%) saturate(110%)`;
        video.style.filter = filterString;
        if (video.playbackRate !== config.videoSpeed && !video.paused) video.playbackRate = config.videoSpeed;
        if (loopActive && loopStart !== null && loopEnd !== null) { if (video.currentTime >= loopEnd) video.currentTime = loopStart; }
    }

    window.addEventListener('load', function() {
        const savedTime = sessionStorage.getItem('yt-restore-time');
        const savedPlaying = sessionStorage.getItem('yt-restore-playing');

        if (savedTime) {
            setTimeout(() => {
                const video = document.querySelector('video');
                if (video) {
                    video.currentTime = parseFloat(savedTime);
                    if (savedPlaying === 'true') {
                        video.play().catch(() => {});
                    }
                }
                sessionStorage.removeItem('yt-restore-time');
                sessionStorage.removeItem('yt-restore-playing');
            }, 1500);
        }

        if (config.adblock) {
            setTimeout(startPlayerMonitor, 2000);
        }
    });

    setTimeout(() => {
        initStealthAdblock();
        applyZapperList();
        applyLiveStyles();
        checkButton();

        setInterval(() => {
            if (config.adblock && Math.random() > 0.5) {
                handleStealthAdblock();
            }
        }, getRandomInterval());
    }, 2000);

    let lastURL = '';
    new MutationObserver(() => {
        if (window.location.href !== lastURL) {
            lastURL = window.location.href;
            playerUnlockAttempts = 0;
            setTimeout(() => {
                initStealthAdblock();
                applyZapperList();
            }, 1000);
        }
    }).observe(document, { subtree: true, childList: true });

    setInterval(() => {
        applyLiveStyles();
        applyVideoTransforms();
        enforceQuality();
    }, 3000);

    setInterval(() => {
        checkButton();
        if (config.redirectShorts && location.href.includes('/shorts/')) {
            location.replace(location.href.replace('/shorts/', '/watch?v='));
        }
    }, 2000);

})();