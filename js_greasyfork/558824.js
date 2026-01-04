// ==UserScript==
// @name         PikPak Aria2 助手
// @name:en      PikPak Aria2 Helper
// @name:zh-CN   PikPak Aria2 助手
// @namespace    https://github.com/CheerChen
// @version      0.0.1
// @description  Push PikPak files and folders to Aria2 for downloading.
// @description:en Push PikPak files and folders to Aria2 for downloading.
// @description:zh-CN 将 PikPak 文件和文件夹推送到 Aria2 进行下载。
// @author       cheerchen37
// @match        *://*mypikpak.com/*
// @require      https://unpkg.com/react@18/umd/react.production.min.js
// @require      https://unpkg.com/react-dom@18/umd/react-dom.production.min.js
// @grant        GM_xmlhttpRequest
// @connect      *
// @icon         https://www.google.com/s2/favicons?domain=mypikpak.com
// @license      MIT
// @homepage     https://github.com/CheerChen/userscripts
// @supportURL   https://github.com/CheerChen/userscripts/issues
// @downloadURL https://update.greasyfork.org/scripts/558824/PikPak%20Aria2%20%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/558824/PikPak%20Aria2%20%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const { React, ReactDOM } = window;
    const { useState, useEffect, useRef, useCallback } = React;
    const { createRoot } = ReactDOM;

    console.log("PikPak Aria2 助手已加载");

    // ==================== API Functions ====================

    // 获取认证头部信息
    function getHeader() {
        let token = "";
        let captcha = "";
        for (let i = 0; i < window.localStorage.length; i++) {
            let key = window.localStorage.key(i);
            if (key === null) continue;
            if (key && key.startsWith("credentials")) {
                let tokenData = JSON.parse(window.localStorage.getItem(key));
                token = tokenData.token_type + " " + tokenData.access_token;
                continue;
            }
            if (key && key.startsWith("captcha")) {
                let tokenData = JSON.parse(window.localStorage.getItem(key));
                captcha = tokenData.captcha_token;
            }
        }
        // deviceid 格式为 "wdi10.xxxxx..."，需要提取点号后的前32位作为 x-device-id
        let deviceId = window.localStorage.getItem("deviceid") || "";
        if (deviceId.includes(".")) {
            deviceId = deviceId.split(".")[1]?.substring(0, 32) || deviceId;
        }
        return {
            Authorization: token,
            "x-device-id": deviceId,
            "x-captcha-token": captcha
        };
    }

    // 获取文件列表
    function getList(parent_id) {
        const url = `https://api-drive.mypikpak.com/drive/v1/files?thumbnail_size=SIZE_MEDIUM&limit=500&parent_id=${parent_id}&with_audit=true&filters=%7B%22phase%22%3A%7B%22eq%22%3A%22PHASE_TYPE_COMPLETE%22%7D%2C%22trashed%22%3A%7B%22eq%22%3Afalse%7D%7D`;
        return fetch(url, {
            method: "GET",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
                ...getHeader()
            },
            redirect: "follow",
            referrerPolicy: "no-referrer"
        }).then(response => response.json());
    }

    // 获取文件下载链接
    function getDownloadUrl(fileId) {
        const url = `https://api-drive.mypikpak.com/drive/v1/files/${fileId}?`;
        return fetch(url, {
            method: "GET",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
                ...getHeader()
            },
            redirect: "follow",
            referrerPolicy: "no-referrer"
        }).then(response => response.json());
    }

    // 推送到 Aria2
    function pushToAria2(rpcUrl, data) {
        return new Promise((resolve, reject) => {
            if (typeof GM_xmlhttpRequest !== 'undefined') {
                GM_xmlhttpRequest({
                    method: "POST",
                    url: rpcUrl,
                    headers: { "Content-Type": "application/json" },
                    data: JSON.stringify(data),
                    responseType: "json",
                    onload: (res) => {
                        if (res.response) {
                            resolve(res.response);
                        } else if (res.responseText) {
                            try {
                                resolve(JSON.parse(res.responseText));
                            } catch {
                                reject(new Error("Invalid response"));
                            }
                        } else {
                            reject(new Error("Empty response"));
                        }
                    },
                    onerror: (err) => reject(new Error(err.statusText || "Network error"))
                });
            } else {
                // Fallback to fetch for same-origin requests
                fetch(rpcUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data)
                })
                    .then(res => res.json())
                    .then(resolve)
                    .catch(reject);
            }
        });
    }

    // ==================== Config Management ====================

    const CONFIG_KEY = 'pikpak-aria2-helper-config';

    const getConfig = () => {
        try {
            return JSON.parse(localStorage.getItem(CONFIG_KEY)) || {
                rpcUrl: 'http://127.0.0.1:6800/jsonrpc',
                rpcToken: '',
                downloadPath: '',
                customParams: ''
            };
        } catch {
            return {
                rpcUrl: 'http://127.0.0.1:6800/jsonrpc',
                rpcToken: '',
                downloadPath: '',
                customParams: ''
            };
        }
    };

    const setConfig = (config) => {
        localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
    };

    // ==================== Styles ====================

    const STYLES = {
        overlay: {
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 10000
        },
        modal: {
            backgroundColor: '#fff', borderRadius: '8px', padding: '24px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
            width: '90%', maxWidth: '800px', maxHeight: '80vh',
            display: 'flex', flexDirection: 'column'
        },
        header: {
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: '20px', borderBottom: '1px solid #ebeef5', paddingBottom: '16px'
        },
        button: {
            padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer'
        },
        primaryBtn: { backgroundColor: '#409eff', color: '#fff' },
        secondaryBtn: { backgroundColor: '#fff', color: '#606266', border: '1px solid #dcdfe6' },
        successBtn: { backgroundColor: '#67c23a', color: '#fff' },
        disabledBtn: { backgroundColor: '#c0c4cc', cursor: 'not-allowed', opacity: 0.6 },
        text: { primary: '#303133', secondary: '#606266', success: '#67c23a', danger: '#f56c6c', warning: '#e6a23c' },
        input: {
            width: '100%', padding: '8px 12px', border: '1px solid #dcdfe6',
            borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box'
        }
    };

    // ==================== Utility Functions ====================

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const formatBytes = (bytes, decimals = 2) => {
        if (!bytes || bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    // ==================== Components ====================

    // Toast Component
    const Toast = ({ message, type, visible }) => {
        if (!visible || !message) return null;

        const bgColors = {
            success: 'rgba(103, 194, 58, 0.9)',
            error: 'rgba(245, 108, 108, 0.9)',
            warning: 'rgba(230, 162, 60, 0.9)',
            info: 'rgba(64, 158, 255, 0.9)'
        };

        const icons = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };

        return React.createElement('div', {
            style: {
                position: 'fixed', top: '30px', left: '50%', transform: 'translateX(-50%)',
                padding: '15px 20px', backgroundColor: bgColors[type] || bgColors.info,
                color: '#fff', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                fontSize: '14px', zIndex: 10001, display: 'flex', alignItems: 'center', gap: '10px'
            }
        }, [
            React.createElement('span', { key: 'icon', style: { fontSize: '18px', fontWeight: 'bold' } }, icons[type] || icons.info),
            React.createElement('span', { key: 'msg' }, message)
        ]);
    };

    // Connection Status Component
    const ConnectionStatus = ({ status, onTest, isTesting }) => {
        const statusConfig = {
            connected: { color: '#67c23a', text: 'Aria2 连接正常' },
            disconnected: { color: '#f56c6c', text: 'Aria2 连接失败' },
            testing: { color: '#e6a23c', text: '正在测试连接...' },
            unknown: { color: '#909399', text: '连接状态未知' }
        };

        const config = statusConfig[status] || statusConfig.unknown;

        return React.createElement('div', {
            style: {
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '12px 16px', backgroundColor: '#f8f9fa', borderRadius: '8px',
                marginBottom: '16px', border: '1px solid #e9ecef'
            }
        }, [
            React.createElement('div', { key: 'indicator', style: { display: 'flex', alignItems: 'center', gap: '8px' } }, [
                React.createElement('div', {
                    key: 'dot',
                    style: {
                        width: '10px', height: '10px', borderRadius: '50%',
                        backgroundColor: config.color,
                        boxShadow: `0 0 0 2px ${config.color}33`
                    }
                }),
                React.createElement('span', { key: 'text', style: { fontSize: '14px', color: '#666' } }, config.text)
            ]),
            React.createElement('button', {
                key: 'btn',
                onClick: onTest,
                disabled: isTesting,
                style: {
                    padding: '6px 12px', fontSize: '12px', border: '1px solid #dcdfe6',
                    borderRadius: '4px', backgroundColor: '#fff', color: '#666',
                    cursor: isTesting ? 'not-allowed' : 'pointer', opacity: isTesting ? 0.6 : 1
                }
            }, isTesting ? '测试中...' : '测试连接')
        ]);
    };

    // File Item Component
    const FileItem = ({ file, selected, onSelect, status, sortBy }) => {
        const formatFileInfo = (item) => {
            switch (sortBy) {
                case 'size':
                    return item.size ? formatBytes(parseInt(item.size)) : 'N/A';
                case 'created_time':
                    return item.created_time ? new Date(item.created_time).toLocaleString() : 'N/A';
                case 'modified_time':
                    return item.modified_time ? new Date(item.modified_time).toLocaleString() : 'N/A';
                default:
                    return item.size ? formatBytes(parseInt(item.size)) : '';
            }
        };

        const statusIcons = {
            pending: '',
            downloading: '⏳',
            success: '✅',
            error: '❌'
        };

        return React.createElement('div', {
            style: {
                display: 'flex', alignItems: 'center', padding: '10px 0',
                borderBottom: '1px solid #f0f0f0'
            }
        }, [
            React.createElement('input', {
                key: 'checkbox', type: 'checkbox', checked: selected,
                onChange: (e) => onSelect(file.id, e.target.checked),
                style: { marginRight: '12px' }
            }),
            React.createElement('span', { key: 'icon', style: { marginRight: '10px', fontSize: '18px' } },
                file.kind === 'drive#folder' ? '📁' : '📄'),
            React.createElement('div', { key: 'info', style: { flex: 1, minWidth: 0 } }, [
                React.createElement('div', {
                    key: 'name',
                    style: { fontWeight: '500', color: STYLES.text.primary, wordBreak: 'break-word' }
                }, file.name)
            ]),
            React.createElement('span', {
                key: 'size',
                style: { marginLeft: '16px', fontSize: '12px', color: STYLES.text.secondary, whiteSpace: 'nowrap' }
            }, formatFileInfo(file)),
            status && React.createElement('span', {
                key: 'status',
                style: { marginLeft: '12px', fontSize: '16px' }
            }, statusIcons[status] || '')
        ]);
    };

    // Config Panel Component
    const ConfigPanel = ({ config, onConfigChange, onClose }) => {
        const [localConfig, setLocalConfig] = useState(config);
        const [connectionStatus, setConnectionStatus] = useState('unknown');
        const [isTesting, setIsTesting] = useState(false);

        const testConnection = async () => {
            if (!localConfig.rpcUrl) return;

            setIsTesting(true);
            setConnectionStatus('testing');

            try {
                const payload = {
                    jsonrpc: "2.0",
                    method: "aria2.getVersion",
                    id: 1,
                    params: localConfig.rpcToken ? [`token:${localConfig.rpcToken}`] : []
                };

                const response = await pushToAria2(localConfig.rpcUrl, payload);
                setConnectionStatus(response && response.result ? 'connected' : 'disconnected');
            } catch (error) {
                console.error('Connection test failed:', error);
                setConnectionStatus('disconnected');
            } finally {
                setIsTesting(false);
            }
        };

        const handleSave = () => {
            // Ensure path ends with /
            if (localConfig.downloadPath && !localConfig.downloadPath.endsWith('/') && !localConfig.downloadPath.endsWith('\\')) {
                localConfig.downloadPath += '/';
            }
            setConfig(localConfig);
            onConfigChange(localConfig);
            onClose();
        };

        useEffect(() => {
            if (localConfig.rpcUrl) {
                testConnection();
            }
        }, []);

        return React.createElement('div', { style: STYLES.overlay },
            React.createElement('div', { style: { ...STYLES.modal, maxWidth: '500px' } }, [
                React.createElement('div', { key: 'header', style: STYLES.header }, [
                    React.createElement('h2', { key: 'title', style: { margin: 0, fontSize: '18px', color: STYLES.text.primary } }, '配置 Aria2'),
                    React.createElement('button', {
                        key: 'close', onClick: onClose,
                        style: { background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: STYLES.text.secondary }
                    }, '×')
                ]),

                React.createElement(ConnectionStatus, {
                    key: 'status',
                    status: connectionStatus,
                    onTest: testConnection,
                    isTesting: isTesting
                }),

                React.createElement('div', { key: 'form', style: { flex: 1, overflowY: 'auto' } }, [
                    // RPC URL
                    React.createElement('div', { key: 'rpc', style: { marginBottom: '16px' } }, [
                        React.createElement('label', { key: 'label', style: { display: 'block', marginBottom: '6px', fontWeight: '500', color: STYLES.text.primary } }, 'RPC 地址'),
                        React.createElement('input', {
                            key: 'input', type: 'text', value: localConfig.rpcUrl,
                            placeholder: 'http://127.0.0.1:6800/jsonrpc',
                            onChange: (e) => setLocalConfig({ ...localConfig, rpcUrl: e.target.value }),
                            style: STYLES.input
                        }),
                        React.createElement('div', { key: 'hint', style: { fontSize: '12px', color: STYLES.text.secondary, marginTop: '4px' } },
                            'Aria2 RPC 服务地址，通常是 http://127.0.0.1:6800/jsonrpc')
                    ]),

                    // RPC Token
                    React.createElement('div', { key: 'token', style: { marginBottom: '16px' } }, [
                        React.createElement('label', { key: 'label', style: { display: 'block', marginBottom: '6px', fontWeight: '500', color: STYLES.text.primary } }, 'RPC 密钥'),
                        React.createElement('input', {
                            key: 'input', type: 'text', value: localConfig.rpcToken,
                            placeholder: '没有请留空',
                            onChange: (e) => setLocalConfig({ ...localConfig, rpcToken: e.target.value }),
                            style: STYLES.input
                        }),
                        React.createElement('div', { key: 'hint', style: { fontSize: '12px', color: STYLES.text.secondary, marginTop: '4px' } },
                            '如果 Aria2 设置了 rpc-secret，请在此填写')
                    ]),

                    // Download Path
                    React.createElement('div', { key: 'path', style: { marginBottom: '16px' } }, [
                        React.createElement('label', { key: 'label', style: { display: 'block', marginBottom: '6px', fontWeight: '500', color: STYLES.text.primary } }, '下载路径'),
                        React.createElement('input', {
                            key: 'input', type: 'text', value: localConfig.downloadPath,
                            placeholder: '/downloads/',
                            onChange: (e) => setLocalConfig({ ...localConfig, downloadPath: e.target.value }),
                            style: STYLES.input
                        }),
                        React.createElement('div', { key: 'hint', style: { fontSize: '12px', color: STYLES.text.secondary, marginTop: '4px' } },
                            '文件保存路径，例如 /downloads/ 或 D:\\Downloads\\')
                    ]),

                    // Custom Params
                    React.createElement('div', { key: 'params', style: { marginBottom: '16px' } }, [
                        React.createElement('label', { key: 'label', style: { display: 'block', marginBottom: '6px', fontWeight: '500', color: STYLES.text.primary } }, '其他参数'),
                        React.createElement('input', {
                            key: 'input', type: 'text', value: localConfig.customParams,
                            placeholder: 'user-agent=xxx;split=10',
                            onChange: (e) => setLocalConfig({ ...localConfig, customParams: e.target.value }),
                            style: STYLES.input
                        }),
                        React.createElement('div', { key: 'hint', style: { fontSize: '12px', color: STYLES.text.secondary, marginTop: '4px' } },
                            '额外参数，以分号分隔，如 user-agent=Mozilla;split=10')
                    ])
                ]),

                React.createElement('div', { key: 'footer', style: { display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #ebeef5' } }, [
                    React.createElement('button', {
                        key: 'cancel', onClick: onClose,
                        style: { ...STYLES.button, ...STYLES.secondaryBtn }
                    }, '取消'),
                    React.createElement('button', {
                        key: 'save', onClick: handleSave,
                        style: { ...STYLES.button, ...STYLES.primaryBtn }
                    }, '保存')
                ])
            ])
        );
    };

    // Main Modal Component
    const Aria2Modal = ({ isOpen, onClose }) => {
        const [files, setFiles] = useState([]);
        const [selectedFiles, setSelectedFiles] = useState(new Set());
        const [fileStatuses, setFileStatuses] = useState({});
        const [isPushing, setIsPushing] = useState(false);
        const [showConfig, setShowConfig] = useState(false);
        const [config, setConfigState] = useState(getConfig());
        const [toast, setToast] = useState({ visible: false, message: '', type: 'info' });
        const [connectionStatus, setConnectionStatus] = useState('unknown');
        const [isTesting, setIsTesting] = useState(false);
        const [progress, setProgress] = useState({ current: 0, total: 0, success: 0, failed: 0 });
        const [sortBy, setSortBy] = useState('name');
        const [sortDirection, setSortDirection] = useState('asc');

        const showToast = (message, type = 'info') => {
            setToast({ visible: true, message, type });
            setTimeout(() => setToast({ visible: false, message: '', type: 'info' }), 3000);
        };

        const testConnection = async () => {
            if (!config.rpcUrl) {
                showToast('请先配置 Aria2 RPC 地址', 'warning');
                return;
            }

            setIsTesting(true);
            setConnectionStatus('testing');

            try {
                const payload = {
                    jsonrpc: "2.0",
                    method: "aria2.getVersion",
                    id: 1,
                    params: config.rpcToken ? [`token:${config.rpcToken}`] : []
                };

                const response = await pushToAria2(config.rpcUrl, payload);
                if (response && response.result) {
                    setConnectionStatus('connected');
                    showToast('Aria2 连接成功', 'success');
                } else {
                    setConnectionStatus('disconnected');
                    showToast('Aria2 连接失败', 'error');
                }
            } catch (error) {
                setConnectionStatus('disconnected');
                showToast(`连接失败: ${error.message}`, 'error');
            } finally {
                setIsTesting(false);
            }
        };

        const sortFiles = (filesToSort) => {
            return [...filesToSort].sort((a, b) => {
                const aIsFolder = a.kind === 'drive#folder';
                const bIsFolder = b.kind === 'drive#folder';

                if (aIsFolder && !bIsFolder) return -1;
                if (!aIsFolder && bIsFolder) return 1;

                let aValue = a[sortBy];
                let bValue = b[sortBy];

                if (sortBy === 'size') {
                    aValue = parseInt(aValue || '0');
                    bValue = parseInt(bValue || '0');
                } else if (sortBy === 'created_time' || sortBy === 'modified_time') {
                    aValue = new Date(aValue).getTime();
                    bValue = new Date(bValue).getTime();
                } else {
                    aValue = aValue?.toLowerCase() || '';
                    bValue = bValue?.toLowerCase() || '';
                }

                let comparison = aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
                return sortDirection === 'asc' ? comparison : -comparison;
            });
        };

        // Load file list
        useEffect(() => {
            if (isOpen) {
                let parent_id = window.location.href.split("/").pop();
                if (parent_id === "all") parent_id = "";

                showToast('正在加载文件列表...', 'info');

                getList(parent_id).then(res => {
                    if (res.files) {
                        setFiles(sortFiles(res.files));
                        showToast('文件列表加载完成', 'success');
                    }
                }).catch(error => {
                    console.error('获取文件列表失败:', error);
                    showToast('获取文件列表失败', 'error');
                });

                // Test connection
                setTimeout(testConnection, 500);
            }
        }, [isOpen]);

        // Re-sort when sort options change
        useEffect(() => {
            setFiles(prev => sortFiles(prev));
        }, [sortBy, sortDirection]);

        const handleFileSelect = (fileId, selected) => {
            const newSelected = new Set(selectedFiles);
            if (selected) {
                newSelected.add(fileId);
            } else {
                newSelected.delete(fileId);
            }
            setSelectedFiles(newSelected);
        };

        const handleSelectAll = (selectAll) => {
            if (selectAll) {
                setSelectedFiles(new Set(files.map(f => f.id)));
            } else {
                setSelectedFiles(new Set());
            }
        };

        // Recursively get all files from selected items (including folder contents)
        const getAllFilesToPush = async () => {
            const allFiles = [];
            const foldersToProcess = [];

            // Separate files and folders
            for (const fileId of selectedFiles) {
                const file = files.find(f => f.id === fileId);
                if (!file) continue;

                if (file.kind === 'drive#folder') {
                    foldersToProcess.push({ id: file.id, name: file.name, path: file.name });
                } else {
                    allFiles.push({ ...file, path: '' });
                }
            }

            // Process folders recursively
            let processedCount = 0;
            while (foldersToProcess.length > 0) {
                const folder = foldersToProcess.shift();
                processedCount++;
                showToast(`正在扫描文件夹 (${processedCount}): ${folder.name}`, 'info');

                try {
                    const result = await getList(folder.id);
                    if (result.files) {
                        for (const file of result.files) {
                            if (file.kind === 'drive#folder') {
                                foldersToProcess.push({
                                    id: file.id,
                                    name: file.name,
                                    path: `${folder.path}/${file.name}`
                                });
                            } else {
                                allFiles.push({ ...file, path: folder.path });
                            }
                        }
                    }
                } catch (error) {
                    console.error(`Failed to get folder contents: ${folder.name}`, error);
                }
            }

            return allFiles;
        };

        // Push files to Aria2
        const pushToAria = async () => {
            if (selectedFiles.size === 0) {
                showToast('请先选择要推送的文件', 'warning');
                return;
            }

            if (!config.rpcUrl) {
                showToast('请先配置 Aria2', 'error');
                setShowConfig(true);
                return;
            }

            setIsPushing(true);
            showToast('正在获取文件列表...', 'info');

            try {
                const filesToPush = await getAllFilesToPush();
                const total = filesToPush.length;
                let success = 0;
                let failed = 0;

                setProgress({ current: 0, total, success: 0, failed: 0 });
                showToast(`准备推送 ${total} 个文件`, 'info');

                for (let i = 0; i < filesToPush.length; i++) {
                    const file = filesToPush[i];

                    try {
                        // Get download URL
                        const downloadInfo = await getDownloadUrl(file.id);

                        if (downloadInfo.error_description) {
                            throw new Error(downloadInfo.error_description);
                        }

                        // Build Aria2 request
                        const ariaData = {
                            id: Date.now(),
                            jsonrpc: "2.0",
                            method: "aria2.addUri",
                            params: [
                                [downloadInfo.web_content_link],
                                { out: downloadInfo.name }
                            ]
                        };

                        // Add download path
                        if (config.downloadPath) {
                            ariaData.params[1].dir = config.downloadPath + (file.path || '');
                        }

                        // Add custom params
                        if (config.customParams) {
                            const customParams = config.customParams.split(';');
                            customParams.forEach(param => {
                                const [key, value] = param.split('=');
                                if (key && value) {
                                    ariaData.params[1][key] = value;
                                }
                            });
                        }

                        // Add token
                        if (config.rpcToken) {
                            ariaData.params.unshift(`token:${config.rpcToken}`);
                        }

                        // Push to Aria2
                        const response = await pushToAria2(config.rpcUrl, ariaData);

                        if (response.result) {
                            success++;
                            setFileStatuses(prev => ({ ...prev, [file.id]: 'success' }));
                        } else {
                            throw new Error(response.error?.message || 'Unknown error');
                        }
                    } catch (error) {
                        failed++;
                        setFileStatuses(prev => ({ ...prev, [file.id]: 'error' }));
                        console.error(`Failed to push file: ${file.name}`, error);
                    }

                    setProgress({ current: i + 1, total, success, failed });

                    // Small delay to avoid overwhelming the server
                    if (i < filesToPush.length - 1) {
                        await delay(100);
                    }
                }

                if (failed === 0) {
                    showToast(`推送完成！成功 ${success} 个文件`, 'success');
                } else if (success === 0) {
                    showToast(`推送失败！${failed} 个文件`, 'error');
                } else {
                    showToast(`推送完成：成功 ${success}，失败 ${failed}`, 'warning');
                }
            } catch (error) {
                showToast(`推送失败: ${error.message}`, 'error');
            } finally {
                setIsPushing(false);
            }
        };

        const resetModal = () => {
            setFiles([]);
            setSelectedFiles(new Set());
            setFileStatuses({});
            setProgress({ current: 0, total: 0, success: 0, failed: 0 });
        };

        if (!isOpen) return null;

        if (showConfig) {
            return React.createElement(ConfigPanel, {
                config: config,
                onConfigChange: setConfigState,
                onClose: () => setShowConfig(false)
            });
        }

        return React.createElement('div', { style: STYLES.overlay }, [
            React.createElement(Toast, { key: 'toast', ...toast }),
            React.createElement('div', { key: 'modal', style: STYLES.modal }, [
                // Header
                React.createElement('div', { key: 'header', style: STYLES.header }, [
                    React.createElement('h2', { key: 'title', style: { margin: 0, fontSize: '18px', color: STYLES.text.primary } }, '推送到 Aria2'),
                    React.createElement('button', {
                        key: 'close',
                        onClick: () => { resetModal(); onClose(); },
                        style: { background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: STYLES.text.secondary }
                    }, '×')
                ]),

                // Connection Status
                React.createElement(ConnectionStatus, {
                    key: 'connection',
                    status: connectionStatus,
                    onTest: testConnection,
                    isTesting: isTesting
                }),

                // Toolbar
                React.createElement('div', {
                    key: 'toolbar',
                    style: {
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '6px', marginBottom: '16px'
                    }
                }, [
                    React.createElement('label', { key: 'selectall', style: { display: 'flex', alignItems: 'center', cursor: 'pointer' } }, [
                        React.createElement('input', {
                            key: 'cb', type: 'checkbox',
                            checked: selectedFiles.size === files.length && files.length > 0,
                            onChange: (e) => handleSelectAll(e.target.checked),
                            style: { marginRight: '8px' }
                        }),
                        React.createElement('span', { key: 'label' }, '全选')
                    ]),
                    React.createElement('div', { key: 'sort', style: { display: 'flex', alignItems: 'center', gap: '8px' } }, [
                        React.createElement('select', {
                            key: 'sortby', value: sortBy,
                            onChange: (e) => setSortBy(e.target.value),
                            style: { padding: '4px 8px', borderRadius: '4px', border: '1px solid #dcdfe6' }
                        }, [
                            React.createElement('option', { key: 'name', value: 'name' }, '名称'),
                            React.createElement('option', { key: 'size', value: 'size' }, '大小'),
                            React.createElement('option', { key: 'created', value: 'created_time' }, '创建时间'),
                            React.createElement('option', { key: 'modified', value: 'modified_time' }, '修改时间')
                        ]),
                        React.createElement('select', {
                            key: 'sortdir', value: sortDirection,
                            onChange: (e) => setSortDirection(e.target.value),
                            style: { padding: '4px 8px', borderRadius: '4px', border: '1px solid #dcdfe6' }
                        }, [
                            React.createElement('option', { key: 'asc', value: 'asc' }, '升序'),
                            React.createElement('option', { key: 'desc', value: 'desc' }, '降序')
                        ])
                    ])
                ]),

                // File List
                React.createElement('div', {
                    key: 'filelist',
                    style: { flex: 1, overflowY: 'auto', maxHeight: '400px' }
                }, files.map(file =>
                    React.createElement(FileItem, {
                        key: file.id,
                        file: file,
                        selected: selectedFiles.has(file.id),
                        onSelect: handleFileSelect,
                        status: fileStatuses[file.id],
                        sortBy: sortBy
                    })
                )),

                // Progress
                isPushing && React.createElement('div', {
                    key: 'progress',
                    style: { padding: '12px', backgroundColor: '#f0f9ff', borderRadius: '6px', marginTop: '16px' }
                }, `推送进度: ${progress.current}/${progress.total} (成功: ${progress.success}, 失败: ${progress.failed})`),

                // Footer
                React.createElement('div', {
                    key: 'footer',
                    style: {
                        display: 'flex', justifyContent: 'flex-end', gap: '12px',
                        marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #ebeef5'
                    }
                }, [
                    React.createElement('button', {
                        key: 'config',
                        onClick: () => setShowConfig(true),
                        style: { ...STYLES.button, ...STYLES.secondaryBtn }
                    }, '配置 Aria2'),
                    React.createElement('button', {
                        key: 'push',
                        onClick: pushToAria,
                        disabled: isPushing || selectedFiles.size === 0,
                        style: {
                            ...STYLES.button,
                            ...(isPushing || selectedFiles.size === 0 ? STYLES.disabledBtn : STYLES.primaryBtn)
                        }
                    }, isPushing ? '推送中...' : `推送到 Aria2 (${selectedFiles.size})`)
                ])
            ])
        ]);
    };

    // ==================== App Initialization ====================

    function initApp() {
        if (location.pathname === '/') return;

        const fileOperations = document.querySelector('.file-operations');
        if (fileOperations) {
            if (fileOperations.querySelector('.aria2-helper-button')) return;

            const aria2Item = document.createElement('li');
            aria2Item.className = 'icon-with-label aria2-helper-button';
            aria2Item.innerHTML = `
                <a aria-label="推送到Aria2" class="pp-link-button hover-able" href="javascript:void(0)">
                    <span class="icon-hover-able pp-icon" style="--icon-color: var(--color-secondary-text); --icon-color-hover: var(--color-primary); display: flex; flex: 0 0 24px; width: 24px; height: 24px;">
                        <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                        </svg>
                    </span>
                    <span class="label">Aria2下载</span>
                </a>
            `;

            aria2Item.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                if (!document.getElementById('pikpak-aria2-helper-modal')) {
                    const modalContainer = document.createElement('div');
                    modalContainer.id = 'pikpak-aria2-helper-modal';
                    document.body.appendChild(modalContainer);

                    const root = createRoot(modalContainer);
                    root.render(React.createElement(Aria2Modal, {
                        isOpen: true,
                        onClose: () => {
                            root.unmount();
                            document.body.removeChild(modalContainer);
                        }
                    }));
                }
            });

            const divider = fileOperations.querySelector('.divider-in-operations');
            if (divider) {
                fileOperations.insertBefore(aria2Item, divider);
            } else {
                fileOperations.appendChild(aria2Item);
            }
        } else {
            setTimeout(initApp, 1000);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initApp);
    } else {
        setTimeout(initApp, 1000);
    }

})();