// ==UserScript==
// @name         LMArena Manager
// @namespace    http://tampermonkey.net/
// @version      4.6.0
// @description  智能管理 LMArena 模型显示 - 搜索增强、自定义分组、多视图模式
// @author       LMArena Manager Team
// @match        https://lmarena.ai/*
// @match        https://web.lmarena.ai/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/563029/LMArena%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/563029/LMArena%20Manager.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'lmarena_manager_v5';
    const VERSION = '4.6.0';

    // ==================== 1. 国际化系统 ====================
    const I18N = {
        'zh-CN': {
            name: '简体中文',
            ui: {
                title: 'LMArena Manager',
                startScan: '开始扫描',
                endScan: '结束扫描',
                export: '导出',
                import: '导入',
                clearMarks: '清除标记',
                groups: '分组',
                settings: '设置',
                all: '全部',
                enabled: '已启用',
                hidden: '已隐藏',
                starred: '收藏',
                newFound: '新发现',
                searchPlaceholder: '搜索... (空格=AND, /regex/)',
                allOrgs: '所有组织',
                sortByOrg: '按组织',
                starredFirst: '收藏优先',
                nameAZ: '名称 A-Z',
                nameZA: '名称 Z-A',
                latestAdded: '最新添加',
                models: '个模型',
                multiSelect: '多选',
                show: '显示',
                hide: '隐藏',
                addToGroup: '添加至分组',
                selectAll: '全部选择',
                deselectAll: '全部取消',
                invert: '反选',
                revert: '还原',
                exitMulti: '退出多选',
                apply: '应用',
                byOrg: '按组织',
                sort: '排序',
                done: '完成',
                reset: '重置',
                moreOrgs: '更多组织',
                byType: '按类型',
                features: '特性',
                vision: '视觉',
                universal: '综合',
                t2iOnly: '仅文生图',
                i2iOnly: '仅图生图',
                displayed: '显示',
                hiddenCount: '隐藏',
                total: '总计',
                noMatch: '没有匹配的模型',
                noMatchHint: '请打开模型下拉框以触发自动扫描',
                editModel: '编辑模型',
                modelName: '模型名称',
                org: '所属组织',
                orgPlaceholder: '输入组织名',
                belongGroups: '所属分组',
                noGroupHint: '暂无分组，点击顶栏"分组"创建',
                restoreDefault: '恢复默认',
                cancel: '取消',
                save: '保存',
                confirm: '确认',
                confirmTitle: '确认操作',
                confirmMsg: '确定要执行此操作吗？',
                scanResult: '扫描结果',
                scannedCount: '本次扫描到',
                modelsText: '个模型',
                notScanned: '以下模型未被扫描到',
                allScanned: '所有模型均已扫描到',
                keepAll: '保留全部',
                deleteSelected: '删除选中',
                groupManage: '分组管理',
                newGroupName: '新分组名称',
                create: '创建',
                close: '关闭',
                noGroups: '暂无分组',
                rename: '重命名',
                delete: '删除',
                settingsTitle: '设置',
                language: '语言',
                newModelAlert: '新模型提示',
                newModelAlertDesc: '发现新模型时显示通知',
                cloudSync: 'GitHub Gist 云同步',
                gistToken: 'GitHub Token',
                gistTokenPlaceholder: '输入 GitHub Personal Access Token',
                gistId: 'Gist ID',
                gistIdPlaceholder: '留空则自动创建',
                syncNow: '立即同步',
                resetData: '重置所有数据',
                resetDataDesc: '清除所有设置和模型数据',
                resetConfirm: '确定要重置所有数据吗？此操作不可撤销！',
                exported: '已导出',
                importSuccess: '导入成功',
                importFailed: '导入失败',
                marksCleared: '已清除标记',
                applied: '已应用',
                saved: '已保存',
                restored: '已恢复默认',
                deleted: '已删除',
                renamed: '已重命名',
                groupCreated: '分组已创建',
                groupExists: '分组名称已存在',
                enterGroupName: '请输入分组名称',
                nameExists: '名称已存在',
                scanStarted: '扫描已开始，请依次打开各模式的模型下拉框',
                newModelFound: '发现新模型',
                newModelsFound: '发现 {0} 个新模型',
                defaultOrderRestored: '已恢复默认排序',
                orgOrderRestored: '已恢复默认组织顺序',
                dataReset: '数据已重置',
                addedToGroup: '已添加至分组',
                selectGroup: '选择分组',
                inputNewName: '输入新名称',
                confirmDelete: '确定删除分组"{0}"吗？',
                on: '开',
                off: '关'
            }
        },
        'en': {
            name: 'English',
            ui: {
                title: 'LMArena Manager',
                startScan: 'Start Scan',
                endScan: 'End Scan',
                export: 'Export',
                import: 'Import',
                clearMarks: 'Clear Marks',
                groups: 'Groups',
                settings: 'Settings',
                all: 'All',
                enabled: 'Enabled',
                hidden: 'Hidden',
                starred: 'Starred',
                newFound: 'New',
                searchPlaceholder: 'Search... (space=AND, /regex/)',
                allOrgs: 'All Organizations',
                sortByOrg: 'By Organization',
                starredFirst: 'Starred First',
                nameAZ: 'Name A-Z',
                nameZA: 'Name Z-A',
                latestAdded: 'Latest Added',
                models: 'models',
                multiSelect: 'Multi-Select',
                show: 'Show',
                hide: 'Hide',
                addToGroup: 'Add to Group',
                selectAll: 'Select All',
                deselectAll: 'Deselect All',
                invert: 'Invert',
                revert: 'Revert',
                exitMulti: 'Exit',
                apply: 'Apply',
                byOrg: 'By Organization',
                sort: 'Sort',
                done: 'Done',
                reset: 'Reset',
                moreOrgs: 'More Organizations',
                byType: 'By Type',
                features: 'Features',
                vision: 'Vision',
                universal: 'Universal',
                t2iOnly: 'Text-to-Image',
                i2iOnly: 'Image-to-Image',
                displayed: 'Shown',
                hiddenCount: 'Hidden',
                total: 'Total',
                noMatch: 'No matching models',
                noMatchHint: 'Please open model dropdown to trigger auto scan',
                editModel: 'Edit Model',
                modelName: 'Model Name',
                org: 'Organization',
                orgPlaceholder: 'Enter organization name',
                belongGroups: 'Groups',
                noGroupHint: 'No groups yet, click "Groups" to create',
                restoreDefault: 'Restore Default',
                cancel: 'Cancel',
                save: 'Save',
                confirm: 'Confirm',
                confirmTitle: 'Confirm',
                confirmMsg: 'Are you sure?',
                scanResult: 'Scan Result',
                scannedCount: 'Scanned',
                modelsText: 'models',
                notScanned: 'Following models were not scanned',
                allScanned: 'All models scanned successfully',
                keepAll: 'Keep All',
                deleteSelected: 'Delete Selected',
                groupManage: 'Group Management',
                newGroupName: 'New group name',
                create: 'Create',
                close: 'Close',
                noGroups: 'No groups',
                rename: 'Rename',
                delete: 'Delete',
                settingsTitle: 'Settings',
                language: 'Language',
                newModelAlert: 'New Model Alert',
                newModelAlertDesc: 'Show notification when new models found',
                cloudSync: 'GitHub Gist Sync',
                gistToken: 'GitHub Token',
                gistTokenPlaceholder: 'Enter GitHub Personal Access Token',
                gistId: 'Gist ID',
                gistIdPlaceholder: 'Leave empty to auto create',
                syncNow: 'Sync Now',
                resetData: 'Reset All Data',
                resetDataDesc: 'Clear all settings and model data',
                resetConfirm: 'Reset all data? This cannot be undone!',
                exported: 'Exported',
                importSuccess: 'Import successful',
                importFailed: 'Import failed',
                marksCleared: 'Marks cleared',
                applied: 'Applied',
                saved: 'Saved',
                restored: 'Restored to default',
                deleted: 'Deleted',
                renamed: 'Renamed',
                groupCreated: 'Group created',
                groupExists: 'Group name exists',
                enterGroupName: 'Please enter group name',
                nameExists: 'Name already exists',
                scanStarted: 'Scan started, please open model dropdowns in each mode',
                newModelFound: 'New model found',
                newModelsFound: '{0} new models found',
                defaultOrderRestored: 'Default order restored',
                orgOrderRestored: 'Default organization order restored',
                dataReset: 'Data reset',
                addedToGroup: 'Added to group',
                selectGroup: 'Select Group',
                inputNewName: 'Enter new name',
                confirmDelete: 'Delete group "{0}"?',
                on: 'On',
                off: 'Off'
            }
        },
        'zh-TW': {
            name: '繁體中文',
            ui: {
                title: 'LMArena Manager',
                startScan: '開始掃描',
                endScan: '結束掃描',
                export: '匯出',
                import: '匯入',
                clearMarks: '清除標記',
                groups: '分組',
                settings: '設定',
                all: '全部',
                enabled: '已啟用',
                hidden: '已隱藏',
                starred: '收藏',
                newFound: '新發現',
                searchPlaceholder: '搜尋... (空格=AND, /regex/)',
                allOrgs: '所有組織',
                sortByOrg: '按組織',
                starredFirst: '收藏優先',
                nameAZ: '名稱 A-Z',
                nameZA: '名稱 Z-A',
                latestAdded: '最新添加',
                models: '個模型',
                multiSelect: '多選',
                show: '顯示',
                hide: '隱藏',
                addToGroup: '添加至分組',
                selectAll: '全部選擇',
                deselectAll: '全部取消',
                invert: '反選',
                revert: '還原',
                exitMulti: '退出多選',
                apply: '套用',
                byOrg: '按組織',
                sort: '排序',
                done: '完成',
                reset: '重置',
                moreOrgs: '更多組織',
                byType: '按類型',
                features: '特性',
                vision: '視覺',
                universal: '綜合',
                t2iOnly: '僅文生圖',
                i2iOnly: '僅圖生圖',
                displayed: '顯示',
                hiddenCount: '隱藏',
                total: '總計',
                noMatch: '沒有匹配的模型',
                noMatchHint: '請打開模型下拉框以觸發自動掃描',
                editModel: '編輯模型',
                modelName: '模型名稱',
                org: '所屬組織',
                orgPlaceholder: '輸入組織名',
                belongGroups: '所屬分組',
                noGroupHint: '暫無分組，點擊頂欄「分組」創建',
                restoreDefault: '恢復預設',
                cancel: '取消',
                save: '儲存',
                confirm: '確認',
                confirmTitle: '確認操作',
                confirmMsg: '確定要執行此操作嗎？',
                scanResult: '掃描結果',
                scannedCount: '本次掃描到',
                modelsText: '個模型',
                notScanned: '以下模型未被掃描到',
                allScanned: '所有模型均已掃描到',
                keepAll: '保留全部',
                deleteSelected: '刪除選中',
                groupManage: '分組管理',
                newGroupName: '新分組名稱',
                create: '創建',
                close: '關閉',
                noGroups: '暫無分組',
                rename: '重命名',
                delete: '刪除',
                settingsTitle: '設定',
                language: '語言',
                newModelAlert: '新模型提示',
                newModelAlertDesc: '發現新模型時顯示通知',
                cloudSync: 'GitHub Gist 雲同步',
                gistToken: 'GitHub Token',
                gistTokenPlaceholder: '輸入 GitHub Personal Access Token',
                gistId: 'Gist ID',
                gistIdPlaceholder: '留空則自動創建',
                syncNow: '立即同步',
                resetData: '重置所有資料',
                resetDataDesc: '清除所有設定和模型資料',
                resetConfirm: '確定要重置所有資料嗎？此操作不可撤銷！',
                exported: '已匯出',
                importSuccess: '匯入成功',
                importFailed: '匯入失敗',
                marksCleared: '已清除標記',
                applied: '已套用',
                saved: '已儲存',
                restored: '已恢復預設',
                deleted: '已刪除',
                renamed: '已重命名',
                groupCreated: '分組已創建',
                groupExists: '分組名稱已存在',
                enterGroupName: '請輸入分組名稱',
                nameExists: '名稱已存在',
                scanStarted: '掃描已開始，請依次打開各模式的模型下拉框',
                newModelFound: '發現新模型',
                newModelsFound: '發現 {0} 個新模型',
                defaultOrderRestored: '已恢復預設排序',
                orgOrderRestored: '已恢復預設組織順序',
                dataReset: '資料已重置',
                addedToGroup: '已添加至分組',
                selectGroup: '選擇分組',
                inputNewName: '輸入新名稱',
                confirmDelete: '確定刪除分組「{0}」嗎？',
                on: '開',
                off: '關'
            }
        },
        'ja': {
            name: '日本語',
            ui: {
                title: 'LMArena Manager',
                startScan: 'スキャン開始',
                endScan: 'スキャン終了',
                export: 'エクスポート',
                import: 'インポート',
                clearMarks: 'マーク消去',
                groups: 'グループ',
                settings: '設定',
                all: 'すべて',
                enabled: '有効',
                hidden: '非表示',
                starred: 'お気に入り',
                newFound: '新規',
                searchPlaceholder: '検索... (スペース=AND, /regex/)',
                allOrgs: 'すべての組織',
                sortByOrg: '組織順',
                starredFirst: 'お気に入り優先',
                nameAZ: '名前 A-Z',
                nameZA: '名前 Z-A',
                latestAdded: '最新追加',
                models: 'モデル',
                multiSelect: '複数選択',
                show: '表示',
                hide: '非表示',
                addToGroup: 'グループに追加',
                selectAll: 'すべて選択',
                deselectAll: 'すべて解除',
                invert: '反転',
                revert: '元に戻す',
                exitMulti: '終了',
                apply: '適用',
                byOrg: '組織別',
                sort: '並び替え',
                done: '完了',
                reset: 'リセット',
                moreOrgs: 'その他の組織',
                byType: 'タイプ別',
                features: '機能',
                vision: 'ビジョン',
                universal: '汎用',
                t2iOnly: 'テキストから画像',
                i2iOnly: '画像から画像',
                displayed: '表示',
                hiddenCount: '非表示',
                total: '合計',
                noMatch: '一致するモデルがありません',
                noMatchHint: 'モデルドロップダウンを開いて自動スキャンを実行してください',
                editModel: 'モデルを編集',
                modelName: 'モデル名',
                org: '組織',
                orgPlaceholder: '組織名を入力',
                belongGroups: 'グループ',
                noGroupHint: 'グループがありません。「グループ」をクリックして作成',
                restoreDefault: 'デフォルトに戻す',
                cancel: 'キャンセル',
                save: '保存',
                confirm: '確認',
                confirmTitle: '確認',
                confirmMsg: '実行しますか？',
                scanResult: 'スキャン結果',
                scannedCount: 'スキャン済み',
                modelsText: 'モデル',
                notScanned: '以下のモデルはスキャンされませんでした',
                allScanned: 'すべてのモデルがスキャンされました',
                keepAll: 'すべて保持',
                deleteSelected: '選択を削除',
                groupManage: 'グループ管理',
                newGroupName: '新しいグループ名',
                create: '作成',
                close: '閉じる',
                noGroups: 'グループなし',
                rename: '名前変更',
                delete: '削除',
                settingsTitle: '設定',
                language: '言語',
                newModelAlert: '新規モデル通知',
                newModelAlertDesc: '新しいモデルが見つかったときに通知を表示',
                cloudSync: 'GitHub Gist 同期',
                gistToken: 'GitHub Token',
                gistTokenPlaceholder: 'GitHub Personal Access Token を入力',
                gistId: 'Gist ID',
                gistIdPlaceholder: '空白で自動作成',
                syncNow: '今すぐ同期',
                resetData: 'すべてのデータをリセット',
                resetDataDesc: 'すべての設定とモデルデータを消去',
                resetConfirm: 'すべてのデータをリセットしますか？この操作は元に戻せません！',
                exported: 'エクスポート完了',
                importSuccess: 'インポート成功',
                importFailed: 'インポート失敗',
                marksCleared: 'マーク消去完了',
                applied: '適用完了',
                saved: '保存完了',
                restored: 'デフォルトに戻しました',
                deleted: '削除完了',
                renamed: '名前変更完了',
                groupCreated: 'グループ作成完了',
                groupExists: 'グループ名が既に存在します',
                enterGroupName: 'グループ名を入力してください',
                nameExists: '名前が既に存在します',
                scanStarted: 'スキャン開始、各モードでモデルドロップダウンを開いてください',
                newModelFound: '新しいモデルを発見',
                newModelsFound: '{0} 個の新しいモデルを発見',
                defaultOrderRestored: 'デフォルト順序に戻しました',
                orgOrderRestored: 'デフォルト組織順序に戻しました',
                dataReset: 'データをリセットしました',
                addedToGroup: 'グループに追加しました',
                selectGroup: 'グループを選択',
                inputNewName: '新しい名前を入力',
                confirmDelete: 'グループ「{0}」を削除しますか？',
                on: 'オン',
                off: 'オフ'
            }
        },
        'ko': {
            name: '한국어',
            ui: {
                title: 'LMArena Manager',
                startScan: '스캔 시작',
                endScan: '스캔 종료',
                export: '내보내기',
                import: '가져오기',
                clearMarks: '마크 지우기',
                groups: '그룹',
                settings: '설정',
                all: '전체',
                enabled: '활성화됨',
                hidden: '숨김',
                starred: '즐겨찾기',
                newFound: '새로운',
                searchPlaceholder: '검색... (공백=AND, /regex/)',
                allOrgs: '모든 조직',
                sortByOrg: '조직순',
                starredFirst: '즐겨찾기 우선',
                nameAZ: '이름 A-Z',
                nameZA: '이름 Z-A',
                latestAdded: '최근 추가',
                models: '모델',
                multiSelect: '다중 선택',
                show: '표시',
                hide: '숨기기',
                addToGroup: '그룹에 추가',
                selectAll: '전체 선택',
                deselectAll: '전체 해제',
                invert: '반전',
                revert: '되돌리기',
                exitMulti: '종료',
                apply: '적용',
                byOrg: '조직별',
                sort: '정렬',
                done: '완료',
                reset: '초기화',
                moreOrgs: '더 많은 조직',
                byType: '유형별',
                features: '기능',
                vision: '비전',
                universal: '통합',
                t2iOnly: '텍스트→이미지',
                i2iOnly: '이미지→이미지',
                displayed: '표시',
                hiddenCount: '숨김',
                total: '총',
                noMatch: '일치하는 모델이 없습니다',
                noMatchHint: '모델 드롭다운을 열어 자동 스캔을 실행하세요',
                editModel: '모델 편집',
                modelName: '모델 이름',
                org: '조직',
                orgPlaceholder: '조직 이름 입력',
                belongGroups: '그룹',
                noGroupHint: '그룹이 없습니다. "그룹"을 클릭하여 생성',
                restoreDefault: '기본값 복원',
                cancel: '취소',
                save: '저장',
                confirm: '확인',
                confirmTitle: '확인',
                confirmMsg: '실행하시겠습니까?',
                scanResult: '스캔 결과',
                scannedCount: '스캔됨',
                modelsText: '모델',
                notScanned: '다음 모델은 스캔되지 않았습니다',
                allScanned: '모든 모델이 스캔되었습니다',
                keepAll: '모두 유지',
                deleteSelected: '선택 삭제',
                groupManage: '그룹 관리',
                newGroupName: '새 그룹 이름',
                create: '생성',
                close: '닫기',
                noGroups: '그룹 없음',
                rename: '이름 변경',
                delete: '삭제',
                settingsTitle: '설정',
                language: '언어',
                newModelAlert: '새 모델 알림',
                newModelAlertDesc: '새 모델 발견 시 알림 표시',
                cloudSync: 'GitHub Gist 동기화',
                gistToken: 'GitHub Token',
                gistTokenPlaceholder: 'GitHub Personal Access Token 입력',
                gistId: 'Gist ID',
                gistIdPlaceholder: '비워두면 자동 생성',
                syncNow: '지금 동기화',
                resetData: '모든 데이터 초기화',
                resetDataDesc: '모든 설정 및 모델 데이터 삭제',
                resetConfirm: '모든 데이터를 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다!',
                exported: '내보내기 완료',
                importSuccess: '가져오기 성공',
                importFailed: '가져오기 실패',
                marksCleared: '마크 지움',
                applied: '적용됨',
                saved: '저장됨',
                restored: '기본값으로 복원됨',
                deleted: '삭제됨',
                renamed: '이름 변경됨',
                groupCreated: '그룹 생성됨',
                groupExists: '그룹 이름이 이미 존재합니다',
                enterGroupName: '그룹 이름을 입력하세요',
                nameExists: '이름이 이미 존재합니다',
                scanStarted: '스캔 시작, 각 모드에서 모델 드롭다운을 열어주세요',
                newModelFound: '새 모델 발견',
                newModelsFound: '{0}개의 새 모델 발견',
                defaultOrderRestored: '기본 순서로 복원됨',
                orgOrderRestored: '기본 조직 순서로 복원됨',
                dataReset: '데이터 초기화됨',
                addedToGroup: '그룹에 추가됨',
                selectGroup: '그룹 선택',
                inputNewName: '새 이름 입력',
                confirmDelete: '그룹 "{0}"을(를) 삭제하시겠습니까?',
                on: '켜기',
                off: '끄기'
            }
        },
        'es': {
            name: 'Español',
            ui: {
                title: 'LMArena Manager',
                startScan: 'Iniciar Escaneo',
                endScan: 'Finalizar Escaneo',
                export: 'Exportar',
                import: 'Importar',
                clearMarks: 'Limpiar Marcas',
                groups: 'Grupos',
                settings: 'Ajustes',
                all: 'Todo',
                enabled: 'Habilitado',
                hidden: 'Oculto',
                starred: 'Favoritos',
                newFound: 'Nuevo',
                searchPlaceholder: 'Buscar... (espacio=AND, /regex/)',
                allOrgs: 'Todas las Organizaciones',
                sortByOrg: 'Por Organización',
                starredFirst: 'Favoritos Primero',
                nameAZ: 'Nombre A-Z',
                nameZA: 'Nombre Z-A',
                latestAdded: 'Recién Añadido',
                models: 'modelos',
                multiSelect: 'Selección Múltiple',
                show: 'Mostrar',
                hide: 'Ocultar',
                addToGroup: 'Añadir a Grupo',
                selectAll: 'Seleccionar Todo',
                deselectAll: 'Deseleccionar Todo',
                invert: 'Invertir',
                revert: 'Revertir',
                exitMulti: 'Salir',
                apply: 'Aplicar',
                byOrg: 'Por Organización',
                sort: 'Ordenar',
                done: 'Hecho',
                reset: 'Restablecer',
                moreOrgs: 'Más Organizaciones',
                byType: 'Por Tipo',
                features: 'Características',
                vision: 'Visión',
                universal: 'Universal',
                t2iOnly: 'Texto a Imagen',
                i2iOnly: 'Imagen a Imagen',
                displayed: 'Mostrado',
                hiddenCount: 'Oculto',
                total: 'Total',
                noMatch: 'No hay modelos coincidentes',
                noMatchHint: 'Abra el menú desplegable para activar el escaneo automático',
                editModel: 'Editar Modelo',
                modelName: 'Nombre del Modelo',
                org: 'Organización',
                orgPlaceholder: 'Ingrese nombre de organización',
                belongGroups: 'Grupos',
                noGroupHint: 'Sin grupos, haga clic en "Grupos" para crear',
                restoreDefault: 'Restaurar Predeterminado',
                cancel: 'Cancelar',
                save: 'Guardar',
                confirm: 'Confirmar',
                confirmTitle: 'Confirmar',
                confirmMsg: '¿Está seguro?',
                scanResult: 'Resultado del Escaneo',
                scannedCount: 'Escaneados',
                modelsText: 'modelos',
                notScanned: 'Los siguientes modelos no fueron escaneados',
                allScanned: 'Todos los modelos escaneados correctamente',
                keepAll: 'Mantener Todo',
                deleteSelected: 'Eliminar Seleccionados',
                groupManage: 'Gestión de Grupos',
                newGroupName: 'Nombre del nuevo grupo',
                create: 'Crear',
                close: 'Cerrar',
                noGroups: 'Sin grupos',
                rename: 'Renombrar',
                delete: 'Eliminar',
                settingsTitle: 'Ajustes',
                language: 'Idioma',
                newModelAlert: 'Alerta de Nuevo Modelo',
                newModelAlertDesc: 'Mostrar notificación cuando se encuentren nuevos modelos',
                cloudSync: 'Sincronización GitHub Gist',
                gistToken: 'Token de GitHub',
                gistTokenPlaceholder: 'Ingrese GitHub Personal Access Token',
                gistId: 'Gist ID',
                gistIdPlaceholder: 'Dejar vacío para crear automáticamente',
                syncNow: 'Sincronizar Ahora',
                resetData: 'Restablecer Todos los Datos',
                resetDataDesc: 'Borrar todos los ajustes y datos de modelos',
                resetConfirm: '¿Restablecer todos los datos? ¡Esta acción no se puede deshacer!',
                exported: 'Exportado',
                importSuccess: 'Importación exitosa',
                importFailed: 'Importación fallida',
                marksCleared: 'Marcas limpiadas',
                applied: 'Aplicado',
                saved: 'Guardado',
                restored: 'Restaurado a predeterminado',
                deleted: 'Eliminado',
                renamed: 'Renombrado',
                groupCreated: 'Grupo creado',
                groupExists: 'El nombre del grupo ya existe',
                enterGroupName: 'Por favor ingrese el nombre del grupo',
                nameExists: 'El nombre ya existe',
                scanStarted: 'Escaneo iniciado, abra los menús desplegables en cada modo',
                newModelFound: 'Nuevo modelo encontrado',
                newModelsFound: '{0} nuevos modelos encontrados',
                defaultOrderRestored: 'Orden predeterminado restaurado',
                orgOrderRestored: 'Orden de organización predeterminado restaurado',
                dataReset: 'Datos restablecidos',
                addedToGroup: 'Añadido al grupo',
                selectGroup: 'Seleccionar Grupo',
                inputNewName: 'Ingrese nuevo nombre',
                confirmDelete: '¿Eliminar grupo "{0}"?',
                on: 'Activado',
                off: 'Desactivado'
            }
        },
        'fr': {
            name: 'Français',
            ui: {
                title: 'LMArena Manager',
                startScan: 'Démarrer le Scan',
                endScan: 'Terminer le Scan',
                export: 'Exporter',
                import: 'Importer',
                clearMarks: 'Effacer les Marques',
                groups: 'Groupes',
                settings: 'Paramètres',
                all: 'Tout',
                enabled: 'Activé',
                hidden: 'Masqué',
                starred: 'Favoris',
                newFound: 'Nouveau',
                searchPlaceholder: 'Rechercher... (espace=ET, /regex/)',
                allOrgs: 'Toutes les Organisations',
                sortByOrg: 'Par Organisation',
                starredFirst: 'Favoris en Premier',
                nameAZ: 'Nom A-Z',
                nameZA: 'Nom Z-A',
                latestAdded: 'Récemment Ajouté',
                models: 'modèles',
                multiSelect: 'Sélection Multiple',
                show: 'Afficher',
                hide: 'Masquer',
                addToGroup: 'Ajouter au Groupe',
                selectAll: 'Tout Sélectionner',
                deselectAll: 'Tout Désélectionner',
                invert: 'Inverser',
                revert: 'Annuler',
                exitMulti: 'Quitter',
                apply: 'Appliquer',
                byOrg: 'Par Organisation',
                sort: 'Trier',
                done: 'Terminé',
                reset: 'Réinitialiser',
                moreOrgs: 'Plus d\'Organisations',
                byType: 'Par Type',
                features: 'Fonctionnalités',
                vision: 'Vision',
                universal: 'Universel',
                t2iOnly: 'Texte vers Image',
                i2iOnly: 'Image vers Image',
                displayed: 'Affiché',
                hiddenCount: 'Masqué',
                total: 'Total',
                noMatch: 'Aucun modèle correspondant',
                noMatchHint: 'Ouvrez le menu déroulant pour déclencher le scan automatique',
                editModel: 'Modifier le Modèle',
                modelName: 'Nom du Modèle',
                org: 'Organisation',
                orgPlaceholder: 'Entrez le nom de l\'organisation',
                belongGroups: 'Groupes',
                noGroupHint: 'Pas de groupes, cliquez sur "Groupes" pour créer',
                restoreDefault: 'Restaurer par Défaut',
                cancel: 'Annuler',
                save: 'Enregistrer',
                confirm: 'Confirmer',
                confirmTitle: 'Confirmer',
                confirmMsg: 'Êtes-vous sûr?',
                scanResult: 'Résultat du Scan',
                scannedCount: 'Scannés',
                modelsText: 'modèles',
                notScanned: 'Les modèles suivants n\'ont pas été scannés',
                allScanned: 'Tous les modèles ont été scannés avec succès',
                keepAll: 'Tout Garder',
                deleteSelected: 'Supprimer la Sélection',
                groupManage: 'Gestion des Groupes',
                newGroupName: 'Nom du nouveau groupe',
                create: 'Créer',
                close: 'Fermer',
                noGroups: 'Pas de groupes',
                rename: 'Renommer',
                delete: 'Supprimer',
                settingsTitle: 'Paramètres',
                language: 'Langue',
                newModelAlert: 'Alerte Nouveau Modèle',
                newModelAlertDesc: 'Afficher une notification quand de nouveaux modèles sont trouvés',
                cloudSync: 'Synchronisation GitHub Gist',
                gistToken: 'Token GitHub',
                gistTokenPlaceholder: 'Entrez le GitHub Personal Access Token',
                gistId: 'Gist ID',
                gistIdPlaceholder: 'Laisser vide pour créer automatiquement',
                syncNow: 'Synchroniser Maintenant',
                resetData: 'Réinitialiser Toutes les Données',
                resetDataDesc: 'Effacer tous les paramètres et données de modèles',
                resetConfirm: 'Réinitialiser toutes les données? Cette action est irréversible!',
                exported: 'Exporté',
                importSuccess: 'Importation réussie',
                importFailed: 'Importation échouée',
                marksCleared: 'Marques effacées',
                applied: 'Appliqué',
                saved: 'Enregistré',
                restored: 'Restauré par défaut',
                deleted: 'Supprimé',
                renamed: 'Renommé',
                groupCreated: 'Groupe créé',
                groupExists: 'Le nom du groupe existe déjà',
                enterGroupName: 'Veuillez entrer le nom du groupe',
                nameExists: 'Le nom existe déjà',
                scanStarted: 'Scan démarré, veuillez ouvrir les menus déroulants dans chaque mode',
                newModelFound: 'Nouveau modèle trouvé',
                newModelsFound: '{0} nouveaux modèles trouvés',
                defaultOrderRestored: 'Ordre par défaut restauré',
                orgOrderRestored: 'Ordre des organisations par défaut restauré',
                dataReset: 'Données réinitialisées',
                addedToGroup: 'Ajouté au groupe',
                selectGroup: 'Sélectionner un Groupe',
                inputNewName: 'Entrez un nouveau nom',
                confirmDelete: 'Supprimer le groupe "{0}"?',
                on: 'Activé',
                off: 'Désactivé'
            }
        },
        'de': {
            name: 'Deutsch',
            ui: {
                title: 'LMArena Manager',
                startScan: 'Scan Starten',
                endScan: 'Scan Beenden',
                export: 'Exportieren',
                import: 'Importieren',
                clearMarks: 'Markierungen Löschen',
                groups: 'Gruppen',
                settings: 'Einstellungen',
                all: 'Alle',
                enabled: 'Aktiviert',
                hidden: 'Versteckt',
                starred: 'Favoriten',
                newFound: 'Neu',
                searchPlaceholder: 'Suchen... (Leerzeichen=UND, /regex/)',
                allOrgs: 'Alle Organisationen',
                sortByOrg: 'Nach Organisation',
                starredFirst: 'Favoriten Zuerst',
                nameAZ: 'Name A-Z',
                nameZA: 'Name Z-A',
                latestAdded: 'Zuletzt Hinzugefügt',
                models: 'Modelle',
                multiSelect: 'Mehrfachauswahl',
                show: 'Anzeigen',
                hide: 'Verstecken',
                addToGroup: 'Zur Gruppe Hinzufügen',
                selectAll: 'Alle Auswählen',
                deselectAll: 'Alle Abwählen',
                invert: 'Umkehren',
                revert: 'Zurücksetzen',
                exitMulti: 'Beenden',
                apply: 'Anwenden',
                byOrg: 'Nach Organisation',
                sort: 'Sortieren',
                done: 'Fertig',
                reset: 'Zurücksetzen',
                moreOrgs: 'Mehr Organisationen',
                byType: 'Nach Typ',
                features: 'Funktionen',
                vision: 'Vision',
                universal: 'Universal',
                t2iOnly: 'Text zu Bild',
                i2iOnly: 'Bild zu Bild',
                displayed: 'Angezeigt',
                hiddenCount: 'Versteckt',
                total: 'Gesamt',
                noMatch: 'Keine passenden Modelle',
                noMatchHint: 'Öffnen Sie das Dropdown-Menü, um den automatischen Scan auszulösen',
                editModel: 'Modell Bearbeiten',
                modelName: 'Modellname',
                org: 'Organisation',
                orgPlaceholder: 'Organisationsname eingeben',
                belongGroups: 'Gruppen',
                noGroupHint: 'Keine Gruppen, klicken Sie auf "Gruppen" zum Erstellen',
                restoreDefault: 'Standard Wiederherstellen',
                cancel: 'Abbrechen',
                save: 'Speichern',
                confirm: 'Bestätigen',
                confirmTitle: 'Bestätigen',
                confirmMsg: 'Sind Sie sicher?',
                scanResult: 'Scan-Ergebnis',
                scannedCount: 'Gescannt',
                modelsText: 'Modelle',
                notScanned: 'Folgende Modelle wurden nicht gescannt',
                allScanned: 'Alle Modelle erfolgreich gescannt',
                keepAll: 'Alle Behalten',
                deleteSelected: 'Ausgewählte Löschen',
                groupManage: 'Gruppenverwaltung',
                newGroupName: 'Neuer Gruppenname',
                create: 'Erstellen',
                close: 'Schließen',
                noGroups: 'Keine Gruppen',
                rename: 'Umbenennen',
                delete: 'Löschen',
                settingsTitle: 'Einstellungen',
                language: 'Sprache',
                newModelAlert: 'Neues Modell Benachrichtigung',
                newModelAlertDesc: 'Benachrichtigung anzeigen, wenn neue Modelle gefunden werden',
                cloudSync: 'GitHub Gist Synchronisation',
                gistToken: 'GitHub Token',
                gistTokenPlaceholder: 'GitHub Personal Access Token eingeben',
                gistId: 'Gist ID',
                gistIdPlaceholder: 'Leer lassen für automatische Erstellung',
                syncNow: 'Jetzt Synchronisieren',
                resetData: 'Alle Daten Zurücksetzen',
                resetDataDesc: 'Alle Einstellungen und Modelldaten löschen',
                resetConfirm: 'Alle Daten zurücksetzen? Diese Aktion kann nicht rückgängig gemacht werden!',
                exported: 'Exportiert',
                importSuccess: 'Import erfolgreich',
                importFailed: 'Import fehlgeschlagen',
                marksCleared: 'Markierungen gelöscht',
                applied: 'Angewendet',
                saved: 'Gespeichert',
                restored: 'Auf Standard zurückgesetzt',
                deleted: 'Gelöscht',
                renamed: 'Umbenannt',
                groupCreated: 'Gruppe erstellt',
                groupExists: 'Gruppenname existiert bereits',
                enterGroupName: 'Bitte Gruppennamen eingeben',
                nameExists: 'Name existiert bereits',
                scanStarted: 'Scan gestartet, bitte öffnen Sie die Dropdowns in jedem Modus',
                newModelFound: 'Neues Modell gefunden',
                newModelsFound: '{0} neue Modelle gefunden',
                defaultOrderRestored: 'Standardreihenfolge wiederhergestellt',
                orgOrderRestored: 'Standard-Organisationsreihenfolge wiederhergestellt',
                dataReset: 'Daten zurückgesetzt',
                addedToGroup: 'Zur Gruppe hinzugefügt',
                selectGroup: 'Gruppe Auswählen',
                inputNewName: 'Neuen Namen eingeben',
                confirmDelete: 'Gruppe "{0}" löschen?',
                on: 'An',
                off: 'Aus'
            }
        },
        'ru': {
            name: 'Русский',
            ui: {
                title: 'LMArena Manager',
                startScan: 'Начать сканирование',
                endScan: 'Завершить сканирование',
                export: 'Экспорт',
                import: 'Импорт',
                clearMarks: 'Очистить метки',
                groups: 'Группы',
                settings: 'Настройки',
                all: 'Все',
                enabled: 'Включено',
                hidden: 'Скрыто',
                starred: 'Избранное',
                newFound: 'Новое',
                searchPlaceholder: 'Поиск... (пробел=И, /regex/)',
                allOrgs: 'Все организации',
                sortByOrg: 'По организации',
                starredFirst: 'Избранное первым',
                nameAZ: 'Имя А-Я',
                nameZA: 'Имя Я-А',
                latestAdded: 'Недавно добавленные',
                models: 'моделей',
                multiSelect: 'Множественный выбор',
                show: 'Показать',
                hide: 'Скрыть',
                addToGroup: 'Добавить в группу',
                selectAll: 'Выбрать все',
                deselectAll: 'Снять выбор',
                invert: 'Инвертировать',
                revert: 'Отменить',
                exitMulti: 'Выход',
                apply: 'Применить',
                byOrg: 'По организации',
                sort: 'Сортировка',
                done: 'Готово',
                reset: 'Сброс',
                moreOrgs: 'Больше организаций',
                byType: 'По типу',
                features: 'Функции',
                vision: 'Зрение',
                universal: 'Универсальный',
                t2iOnly: 'Текст в изображение',
                i2iOnly: 'Изображение в изображение',
                displayed: 'Показано',
                hiddenCount: 'Скрыто',
                total: 'Всего',
                noMatch: 'Нет подходящих моделей',
                noMatchHint: 'Откройте выпадающее меню для автоматического сканирования',
                editModel: 'Редактировать модель',
                modelName: 'Название модели',
                org: 'Организация',
                orgPlaceholder: 'Введите название организации',
                belongGroups: 'Группы',
                noGroupHint: 'Нет групп, нажмите "Группы" для создания',
                restoreDefault: 'Восстановить по умолчанию',
                cancel: 'Отмена',
                save: 'Сохранить',
                confirm: 'Подтвердить',
                confirmTitle: 'Подтверждение',
                confirmMsg: 'Вы уверены?',
                scanResult: 'Результат сканирования',
                scannedCount: 'Отсканировано',
                modelsText: 'моделей',
                notScanned: 'Следующие модели не были отсканированы',
                allScanned: 'Все модели успешно отсканированы',
                keepAll: 'Сохранить все',
                deleteSelected: 'Удалить выбранные',
                groupManage: 'Управление группами',
                newGroupName: 'Название новой группы',
                create: 'Создать',
                close: 'Закрыть',
                noGroups: 'Нет групп',
                rename: 'Переименовать',
                delete: 'Удалить',
                settingsTitle: 'Настройки',
                language: 'Язык',
                newModelAlert: 'Уведомление о новых моделях',
                newModelAlertDesc: 'Показывать уведомление при обнаружении новых моделей',
                cloudSync: 'Синхронизация GitHub Gist',
                gistToken: 'GitHub Token',
                gistTokenPlaceholder: 'Введите GitHub Personal Access Token',
                gistId: 'Gist ID',
                gistIdPlaceholder: 'Оставьте пустым для автоматического создания',
                syncNow: 'Синхронизировать сейчас',
                resetData: 'Сбросить все данные',
                resetDataDesc: 'Удалить все настройки и данные моделей',
                resetConfirm: 'Сбросить все данные? Это действие нельзя отменить!',
                exported: 'Экспортировано',
                importSuccess: 'Импорт успешен',
                importFailed: 'Импорт не удался',
                marksCleared: 'Метки очищены',
                applied: 'Применено',
                saved: 'Сохранено',
                restored: 'Восстановлено по умолчанию',
                deleted: 'Удалено',
                renamed: 'Переименовано',
                groupCreated: 'Группа создана',
                groupExists: 'Название группы уже существует',
                enterGroupName: 'Пожалуйста, введите название группы',
                nameExists: 'Название уже существует',
                scanStarted: 'Сканирование начато, откройте выпадающие меню в каждом режиме',
                newModelFound: 'Найдена новая модель',
                newModelsFound: 'Найдено {0} новых моделей',
                defaultOrderRestored: 'Порядок по умолчанию восстановлен',
                orgOrderRestored: 'Порядок организаций по умолчанию восстановлен',
                dataReset: 'Данные сброшены',
                addedToGroup: 'Добавлено в группу',
                selectGroup: 'Выбрать группу',
                inputNewName: 'Введите новое название',
                confirmDelete: 'Удалить группу "{0}"?',
                on: 'Вкл',
                off: 'Выкл'
            }
        }
    };

    // ==================== 2. 选择器与配置 ====================
    const SELECTORS = {
        modelOptionDropdown: '[cmdk-item][role="option"]',
        dropdownList: '[cmdk-list]',
        drawerContainer: 'div.relative.px-4',
        modelOptionDrawer: 'button.w-full',
        modelName: 'span.truncate',
        arenaButtons: '[data-arena-buttons="true"]'
    };

    const MODE_ORG_CONFIG = {
        text: {
            tier1: ['Google', 'Anthropic', 'xAI', 'OpenAI', 'Baidu', 'Z.ai', 'Alibaba', 'Moonshot', 'DeepSeek', 'Mistral', 'MiniMax'],
            tier2: ['Meituan', 'Amazon', 'Xiaomi', 'Tencent', 'Microsoft AI', 'Prime Intellect', 'Cohere', 'Nvidia', 'Ant Group', 'StepFun', 'Meta', 'Allen AI', 'Inception AI', 'IBM', '01 AI', 'NexusFlow'],
            useFolder: true
        },
        search: {
            tier1: ['Google', 'OpenAI', 'xAI', 'Anthropic', 'Perplexity', 'Diffbot'],
            tier2: [],
            useFolder: false
        },
        image: {
            tier1: ['OpenAI', 'Google', 'Tencent', 'Bytedance', 'Alibaba', 'Black Forest Labs', 'Z.ai'],
            tier2: ['Shengshu', 'Pruna', 'Microsoft AI', 'Ideogram', 'Luma AI', 'Recraft', 'Leonardo AI', 'Reve'],
            useFolder: true
        },
        code: {
            tier1: ['Anthropic', 'OpenAI', 'Google', 'xAI', 'DeepSeek', 'Z.ai', 'Moonshot', 'Alibaba', 'MiniMax'],
            tier2: ['Xiaomi', 'KwaiKAT', 'Mistral'],
            useFolder: true
        },
        video: {
            tier1: [],
            tier2: [],
            useFolder: false
        }
    };

    const getDefaultOrgOrder = (mode) => {
        const config = MODE_ORG_CONFIG[mode] || MODE_ORG_CONFIG.text;
        return [...config.tier1, ...config.tier2];
    };

    const COMPANY_RULES = [
        { patterns: [/^gemini/i, /^gemma/i, /^imagen/i], company: 'Google', icon: '🔵' },
        { patterns: [/^gpt/i, /^o3/i, /^o4/i, /^chatgpt/i, /^dall-e/i], company: 'OpenAI', icon: '🟢' },
        { patterns: [/^claude/i], company: 'Anthropic', icon: '🟤' },
        { patterns: [/^grok/i], company: 'xAI', icon: '⚫' },
        { patterns: [/^deepseek/i], company: 'DeepSeek', icon: '🐋' },
        { patterns: [/^qwen/i, /^qwq/i, /^wan/i], company: 'Alibaba', icon: '🟣' },
        { patterns: [/^glm/i], company: 'Z.ai', icon: '🔮' },
        { patterns: [/^kimi/i], company: 'Moonshot', icon: '🌙' },
        { patterns: [/^ernie/i], company: 'Baidu', icon: '🔴' },
        { patterns: [/^mistral/i, /^magistral/i, /^devstral/i], company: 'Mistral', icon: '🟠' },
        { patterns: [/^minimax/i], company: 'MiniMax', icon: '🎯' },
        { patterns: [/^longcat/i], company: 'Meituan', icon: '🐱' },
        { patterns: [/^mimo/i], company: 'Xiaomi', icon: '🍊' },
        { patterns: [/^hunyuan/i], company: 'Tencent', icon: '🐧' },
        { patterns: [/^nova/i, /^amazon/i], company: 'Amazon', icon: '📦' },
        { patterns: [/^intellect/i], company: 'Prime Intellect', icon: '🧠' },
        { patterns: [/^ibm/i, /^granite/i], company: 'IBM', icon: '💠' },
        { patterns: [/^command/i], company: 'Cohere', icon: '🟡' },
        { patterns: [/^ling/i, /^ring/i], company: 'Ant Group', icon: '🐜' },
        { patterns: [/^step/i], company: 'StepFun', icon: '👣' },
        { patterns: [/^llama/i], company: 'Meta', icon: '🔷' },
        { patterns: [/^nvidia/i, /^nemotron/i], company: 'Nvidia', icon: '💚' },
        { patterns: [/^olmo/i, /^molmo/i], company: 'Allen AI', icon: '🔬' },
        { patterns: [/^mercury/i], company: 'Inception AI', icon: '☿️' },
        { patterns: [/^ppl/i, /^perplexity/i, /^sonar/i], company: 'Perplexity', icon: '❓' },
        { patterns: [/^diffbot/i], company: 'Diffbot', icon: '🤖' },
        { patterns: [/^seedream/i, /^seededit/i], company: 'Bytedance', icon: '🎵' },
        { patterns: [/^flux/i], company: 'Black Forest Labs', icon: '🌊' },
        { patterns: [/^mai-/i, /^microsoft/i], company: 'Microsoft AI', icon: '🪟' },
        { patterns: [/^vidu/i], company: 'Shengshu', icon: '🎬' },
        { patterns: [/^recraft/i], company: 'Recraft', icon: '🎨' },
        { patterns: [/^photon/i], company: 'Luma AI', icon: '💡' },
        { patterns: [/^ideogram/i], company: 'Ideogram', icon: '✏️' },
        { patterns: [/^reve/i], company: 'Reve', icon: '💭' },
        { patterns: [/^lucid/i], company: 'Leonardo AI', icon: '🖼️' },
        { patterns: [/^kat/i], company: 'KwaiKAT', icon: '🎥' },
        { patterns: [/^yi-/i], company: '01 AI', icon: '0️⃣' },
        { patterns: [/^athene/i], company: 'NexusFlow', icon: '🔗' },
        { patterns: [/^p-image/i], company: 'Pruna', icon: '🍑' },
    ];

    const ICON_TO_ORG = {
        'zhipu': 'Z.ai',
        'zhipu ai': 'Z.ai',
        'microsoft': 'Microsoft AI',
        'qwen': 'Alibaba',
    };

    const IMAGE_TYPE_ORDER = { universal: 0, t2i: 1, i2i: 2 };

    const VIEW_MODES = {
        grid: { icon: '⊞', label: '网格' },
        compact: { icon: '⊟', label: '紧凑' },
        list: { icon: '☰', label: '列表' }
    };

    // ==================== 3. 模式检测器 ====================
    class ModeDetector {
        static detect() {
            const btnContainer = document.querySelector(SELECTORS.arenaButtons);
            if (btnContainer) {
                const buttons = btnContainer.querySelectorAll('button');
                for (const btn of buttons) {
                    if (btn.classList.contains('bg-surface-secondary')) {
                        const text = (btn.textContent || '').trim().toLowerCase();
                        if (text.includes('text')) return 'text';
                        if (text.includes('code')) return 'code';
                        if (text.includes('image')) return 'image';
                        if (text.includes('search')) return 'search';
                        if (text.includes('video')) return 'video';
                    }
                }
            }
            const url = window.location.href;
            if (url.includes('/code')) return 'code';
            if (url.includes('/search')) return 'search';
            if (url.includes('/image')) return 'image';
            if (url.includes('/video')) return 'video';
            return 'text';
        }
    }

    // ==================== 4. 数据管理 ====================
    class DataManager {
        constructor() {
            this.data = this.load();
            this.ensureDefaults();
        }

        ensureDefaults() {
            if (!this.data.models) this.data.models = {};
            if (!this.data.orgOrder) this.data.orgOrder = {};
            if (!this.data.settings) this.data.settings = {};
            if (this.data.settings.showNewAlert === undefined) this.data.settings.showNewAlert = true;
            if (this.data.settings.defaultVisible === undefined) this.data.settings.defaultVisible = true;
            if (!this.data.settings.language) this.data.settings.language = 'zh-CN';
            if (!this.data.settings.gist) this.data.settings.gist = { token: '', gistId: '' };
            if (!this.data.modelOrder) this.data.modelOrder = { text: [], search: [], image: [], code: [], video: [] };
            if (!this.data.groups) this.data.groups = {};
            ['text', 'search', 'image', 'code', 'video'].forEach(mode => {
                if (!this.data.orgOrder[mode]) {
                    this.data.orgOrder[mode] = getDefaultOrgOrder(mode);
                }
            });
        }

        load() {
            try { return JSON.parse(GM_getValue(STORAGE_KEY) || '{}'); }
            catch (e) { console.error('[LMM] Load failed:', e); return {}; }
        }

        save() { GM_setValue(STORAGE_KEY, JSON.stringify(this.data)); }
        getModel(name) { return this.data.models[name]; }
        setModel(name, data) { this.data.models[name] = { ...this.data.models[name], ...data }; this.save(); }
        deleteModels(names) { names.forEach(n => delete this.data.models[n]); this.save(); }
        getAllModels() { return Object.entries(this.data.models).map(([name, data]) => ({ name, ...data })); }

        isVisible(name) { const m = this.data.models[name]; return m ? m.visible !== false : this.data.settings.defaultVisible; }

        setVisibility(name, visible) {
            if (!this.data.models[name]) this.data.models[name] = this.analyze(name, null, 'text', {});
            this.data.models[name].visible = visible;
            this.data.models[name].isNew = false;
            this.save();
        }

        toggleStar(name) {
            if (!this.data.models[name]) return false;
            const starred = !this.data.models[name].starred;
            this.data.models[name].starred = starred;
            this.save();
            return starred;
        }

        getModelOrder(mode) { return this.data.modelOrder[mode] || []; }
        setModelOrder(mode, order) {
            if (!this.data.modelOrder) this.data.modelOrder = {};
            this.data.modelOrder[mode] = order;
            this.save();
        }

        getOrgOrder(mode) { return this.data.orgOrder[mode] || getDefaultOrgOrder(mode); }
        setOrgOrder(mode, order) {
            if (!this.data.orgOrder) this.data.orgOrder = {};
            this.data.orgOrder[mode] = order;
            this.save();
        }

        updateModel(name, updates) { if (!this.data.models[name]) return; Object.assign(this.data.models[name], updates); this.save(); }

        addModeToModel(name, mode) {
            const model = this.data.models[name];
            if (model && !model.modes.includes(mode)) { model.modes.push(mode); this.save(); }
        }

        clearNewFlags() { Object.keys(this.data.models).forEach(k => { this.data.models[k].isNew = false; }); this.save(); }
        export() { return JSON.stringify(this.data, null, 2); }
        import(json) { try { this.data = JSON.parse(json); this.ensureDefaults(); this.save(); return true; } catch { return false; } }
        resetAll() { this.data = {}; this.ensureDefaults(); this.save(); }

        getLanguage() { return this.data.settings.language || 'zh-CN'; }
        setLanguage(lang) { this.data.settings.language = lang; this.save(); }

        // 分组管理
        getGroups() { return this.data.groups || {}; }
        getGroupNames() { return Object.keys(this.data.groups || {}); }
        createGroup(name) {
            if (!this.data.groups) this.data.groups = {};
            if (!this.data.groups[name]) { this.data.groups[name] = []; this.save(); return true; }
            return false;
        }
        deleteGroup(name) {
            if (this.data.groups && this.data.groups[name]) { delete this.data.groups[name]; this.save(); return true; }
            return false;
        }
        renameGroup(oldName, newName) {
            if (this.data.groups && this.data.groups[oldName] && !this.data.groups[newName]) {
                this.data.groups[newName] = this.data.groups[oldName];
                delete this.data.groups[oldName];
                this.save();
                return true;
            }
            return false;
        }
        addToGroup(groupName, modelName) {
            if (!this.data.groups[groupName]) return false;
            if (!this.data.groups[groupName].includes(modelName)) {
                this.data.groups[groupName].push(modelName);
                this.save();
            }
            return true;
        }
        removeFromGroup(groupName, modelName) {
            if (!this.data.groups[groupName]) return false;
            const idx = this.data.groups[groupName].indexOf(modelName);
            if (idx !== -1) { this.data.groups[groupName].splice(idx, 1); this.save(); }
            return true;
        }
        getModelGroups(modelName) {
            const groups = [];
            Object.entries(this.data.groups || {}).forEach(([name, models]) => {
                if (models.includes(modelName)) groups.push(name);
            });
            return groups;
        }
        getModelsInGroup(groupName) {
            return this.data.groups[groupName] || [];
        }

        analyze(name, iconCompany, strictMode, imageFlags = {}) {
            let company = 'Other', icon = '❔';
            for (const rule of COMPANY_RULES) {
                if (rule.patterns.some(p => p.test(name))) {
                    company = rule.company;
                    icon = rule.icon;
                    break;
                }
            }
            if (company === 'Other' && iconCompany) {
                const lowerIcon = iconCompany.toLowerCase();
                for (const [key, org] of Object.entries(ICON_TO_ORG)) {
                    if (lowerIcon.includes(key)) {
                        company = org;
                        for (const rule of COMPANY_RULES) {
                            if (rule.company === org) { icon = rule.icon; break; }
                        }
                        break;
                    }
                }
                if (company === 'Other') {
                    for (const rule of COMPANY_RULES) {
                        if (rule.company.toLowerCase() === lowerIcon) {
                            company = rule.company;
                            icon = rule.icon;
                            break;
                        }
                    }
                }
            }

            // vision 字段处理
            let vision = false;
            if (strictMode === 'image') {
                const hasVision = imageFlags.vision || false;
                const hasRIU = imageFlags.riu || false;
                if (hasVision && hasRIU) vision = 'i2i';
                else if (hasVision && !hasRIU) vision = 'universal';
                else vision = 't2i';
            } else {
                vision = imageFlags.vision || false;
            }

            return {
                visible: this.data.settings.defaultVisible, company, icon, companyManual: false,
                modes: [strictMode], starred: false, isNew: true, vision
            };
        }

        reanalyze(name) {
            const model = this.data.models[name];
            if (!model) return;
            const mode = model.modes?.[0] || 'text';
            const fresh = this.analyze(name, null, mode, {});
            fresh.visible = model.visible;
            fresh.starred = model.starred;
            fresh.isNew = false;
            fresh.modes = model.modes;
            fresh.vision = model.vision;
            this.data.models[name] = fresh;
            this.save();
        }
    }

    // ==================== 5. 扫描器 ====================
    class Scanner {
        constructor(dm) {
            this.dm = dm;
            this.scanSession = { active: false, startedAt: null, scannedModels: new Set(), scannedModes: new Set() };
            this.initHistoryHook();
        }

        initHistoryHook() {
            const originalPush = history.pushState;
            const originalReplace = history.replaceState;
            const onUrlChange = () => { setTimeout(() => { this.scan(); this.applyFilters(); }, 150); };
            history.pushState = function() { originalPush.apply(this, arguments); onUrlChange(); };
            history.replaceState = function() { originalReplace.apply(this, arguments); onUrlChange(); };
            window.addEventListener('popstate', onUrlChange);
        }

        getAllContainers() {
            const result = [];
            const dropdownContainers = document.querySelectorAll('[cmdk-group-items]');
            dropdownContainers.forEach(container => {
                const options = container.querySelectorAll('[cmdk-item][role="option"]');
                if (options.length > 0) {
                    result.push({ container, options: [...options], mode: 'dropdown' });
                }
            });
            if (result.length > 0) return result;
            const drawerContainers = document.querySelectorAll('div.relative.px-4');
            drawerContainers.forEach(container => {
                const options = container.querySelectorAll('button.w-full');
                if (options.length > 0) {
                    result.push({ container, options: [...options], mode: 'drawer' });
                }
            });
            return result;
        }

        extractInfo(el, layoutMode = 'dropdown') {
            const nameEl = el.querySelector(SELECTORS.modelName);
            const name = nameEl?.textContent?.trim();
            if (!name || name.length < 2) return null;

            let iconCompany = null;
            const imgEl = el.querySelector('img[alt]');
            if (imgEl) {
                const alt = imgEl.getAttribute('alt') || '';
                iconCompany = alt.replace(/\s*icon\s*/i, '').trim() || null;
            }

            const imageFlags = {
                vision: !!el.querySelector('svg.lucide-glasses, [class*="lucide-glasses"]'),
                riu: !!el.querySelector('svg.lucide-image-up, [class*="lucide-image-up"]'),
                generation: !!el.querySelector('svg.lucide-image, [class*="lucide-image"]')
            };

            return { name, iconCompany, imageFlags };
        }

        scan() {
            const containers = this.getAllContainers();
            if (containers.length === 0) return;

            const currentMode = ModeDetector.detect();
            const newModels = [];

            containers.forEach(({ options, mode: layoutMode }) => {
                options.forEach(el => {
                    const info = this.extractInfo(el, layoutMode);
                    if (!info) return;

                    if (this.scanSession.active) {
                        this.scanSession.scannedModels.add(info.name);
                        this.scanSession.scannedModes.add(currentMode);
                    }

                    let model = this.dm.getModel(info.name);
                    if (!model) {
                        const data = this.dm.analyze(info.name, info.iconCompany, currentMode, info.imageFlags);
                        this.dm.setModel(info.name, data);
                        newModels.push(info.name);
                    } else {
                        this.dm.addModeToModel(info.name, currentMode);
                        // 更新 vision 信息
                        if (currentMode === 'image' && typeof model.vision === 'boolean') {
                            const hasVision = info.imageFlags.vision;
                            const hasRIU = info.imageFlags.riu;
                            let vision = 't2i';
                            if (hasVision && hasRIU) vision = 'i2i';
                            else if (hasVision && !hasRIU) vision = 'universal';
                            this.dm.updateModel(info.name, { vision });
                        } else if (currentMode !== 'image' && info.imageFlags.vision && model.vision === false) {
                            this.dm.updateModel(info.name, { vision: true });
                        }
                    }
                });
            });

            if (newModels.length > 0 && this.dm.data.settings.showNewAlert) {
                const t = this.getT();
                const msg = newModels.length <= 3
                ? `${t('newModelFound')}: ${newModels.slice(0, 3).join(', ')}`
                    : t('newModelsFound').replace('{0}', newModels.length);
                this.toast(msg);
            }
        }

        getT() {
            const lang = this.dm.getLanguage();
            return (key) => I18N[lang]?.ui?.[key] || I18N['zh-CN'].ui[key] || key;
        }

        startScanSession() {
            this.scanSession = { active: true, startedAt: Date.now(), scannedModels: new Set(), scannedModes: new Set() };
            this.toast(this.getT()('scanStarted'), 'info');
        }

        endScanSession() {
            if (!this.scanSession.active) return { missing: [], modes: [] };
            const allModels = this.dm.getAllModels();
            const scanned = this.scanSession.scannedModels;
            const missing = allModels.filter(m => !scanned.has(m.name)).map(m => m.name);
            const result = { missing, scannedCount: scanned.size, modes: [...this.scanSession.scannedModes] };
            this.scanSession.active = false;
            return result;
        }

        isScanActive() { return this.scanSession.active; }

        applyFilters() {
            const containers = this.getAllContainers();
            if (containers.length === 0) return;

            const currentMode = ModeDetector.detect();
            const orgOrder = this.dm.getOrgOrder(currentMode);
            const customOrder = this.dm.getModelOrder(currentMode);
            const hasCustomOrder = customOrder && customOrder.length > 0;

            containers.forEach(({ container, options, mode: layoutMode }) => {
                // 确保容器使用 flex 布局
                const parent = options[0]?.parentElement;
                if (parent) {
                    parent.style.display = 'flex';
                    parent.style.flexDirection = 'column';
                }

                options.forEach(el => {
                    const info = this.extractInfo(el, layoutMode);
                    if (!info) return;
                    const model = this.dm.getModel(info.name);
                    if (!model) return;

                    const visible = this.dm.isVisible(info.name);
                    el.style.display = visible ? '' : 'none';

                    if (visible) {
                        let order = 0;
                        if (model.starred) {
                            order = -99999 + (info.name.charCodeAt(0) || 0) * 0.001;
                        } else if (hasCustomOrder) {
                            const customIndex = customOrder.indexOf(info.name);
                            if (customIndex !== -1) {
                                order = customIndex;
                            } else {
                                order = 50000 + (info.name.charCodeAt(0) || 0) * 0.01;
                            }
                        } else {
                            let baseOrder = 10000;
                            if (currentMode === 'image' && typeof model.vision === 'string') {
                                baseOrder += (IMAGE_TYPE_ORDER[model.vision] ?? 3) * 10000;
                            }
                            const orgIndex = orgOrder.indexOf(model.company);
                            const orgScore = (orgIndex !== -1 ? orgIndex : 900) * 100;
                            order = baseOrder + orgScore + (info.name.charCodeAt(0) || 0) * 0.01;
                        }
                        // 使用 CSS order 而不是移动 DOM
                        el.style.order = Math.floor(order);
                    }
                });
            });
        }

        toast(msg, type = 'info') {
            document.querySelectorAll('.lmm-toast').forEach(t => t.remove());
            const t = document.createElement('div'); t.className = `lmm-toast lmm-toast-${type}`;
            t.innerHTML = `<span>${type === 'success' ? '✅' : type === 'warning' ? '⚠️' : 'ℹ️'}</span><span>${msg}</span><button class="lmm-toast-x">×</button>`;
            document.body.appendChild(t); t.querySelector('.lmm-toast-x').onclick = () => t.remove(); setTimeout(() => t.remove(), 4000);
        }

        startObserving() {
            let timer = null;
            const observer = new MutationObserver(() => {
                const containers = this.getAllContainers();
                if (containers.length > 0) {
                    clearTimeout(timer);
                    timer = setTimeout(() => { this.scan(); this.applyFilters(); }, 50);
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }
    }

    // ==================== 6. UI ====================
    class UI {
        constructor(dm, scanner) {
            this.dm = dm;
            this.scanner = scanner;
            this.isOpen = false;
            this.isSortMode = false;
            this.isModelSortMode = false;
            this.isTier2Expanded = false;
            this.editingModel = null;
            this.currentMode = 'all';
            this.visibleSubMode = 'text';
            this.viewMode = 'grid';
            this.filter = { search: '', org: 'all', imageType: 'all', hasVision: 'all', group: 'all' };
            this.sort = { by: 'org', order: 'asc' };
            // 多选模式
            this.isMultiSelectMode = false;
            this.selectedModels = new Set();
            this.multiSelectBackup = new Map(); // 用于还原
        }

        t(key) {
            const lang = this.dm.getLanguage();
            return I18N[lang]?.ui?.[key] || I18N['zh-CN'].ui[key] || key;
        }

        init() {
            this.injectStyles();
            this.createFab();
            this.createPanel();
            this.createEditModal();
            this.createConfirmModal();
            this.createScanResultModal();
            this.createGroupModal();
            this.createSettingsModal();
            this.createGroupSelectModal();
            this.bindShortcuts();
        }

        injectStyles() {
            GM_addStyle(`
                :root {
                    --lmm-primary: #6366f1; --lmm-primary-dark: #4f46e5;
                    --lmm-success: #22c55e; --lmm-warning: #f59e0b; --lmm-danger: #ef4444;
                    --lmm-bg: #fff; --lmm-bg2: #f8fafc; --lmm-bg3: #f1f5f9;
                    --lmm-text: #1e293b; --lmm-text2: #64748b; --lmm-border: #e2e8f0;
                }
                @media (prefers-color-scheme: dark) {
                    :root {
                        --lmm-bg: #1a1a2e; --lmm-bg2: #252540; --lmm-bg3: #2f2f4a;
                        --lmm-text: #e2e8f0; --lmm-text2: #94a3b8; --lmm-border: #3f3f5a;
                    }
                }

                .lmm-fab { position: fixed; top: 12px; right: 12px; width: 40px; height: 40px; border-radius: 10px; background: linear-gradient(135deg, var(--lmm-primary), var(--lmm-primary-dark)); color: #fff; border: none; cursor: pointer; z-index: 99990; display: flex; align-items: center; justify-content: center; font-size: 18px; box-shadow: 0 2px 10px rgba(99,102,241,0.3); transition: transform 0.15s; }
                .lmm-fab:hover { transform: scale(1.08); }
                .lmm-fab.has-new::after { content: ''; position: absolute; top: -3px; right: -3px; width: 12px; height: 12px; background: var(--lmm-danger); border-radius: 50%; border: 2px solid var(--lmm-bg); }
                .lmm-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(3px); z-index: 99995; opacity: 0; visibility: hidden; transition: all 0.2s; }
                .lmm-overlay.open { opacity: 1; visibility: visible; }

                .lmm-panel { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(0.95); width: 96vw; max-width: 1000px; height: 88vh; max-height: 720px; background: var(--lmm-bg); border-radius: 12px; z-index: 99999; display: flex; flex-direction: column; opacity: 0; visibility: hidden; transition: all 0.2s; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; color: var(--lmm-text); box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); }
                .lmm-panel.open { opacity: 1; visibility: visible; transform: translate(-50%, -50%) scale(1); }

                .lmm-header { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; border-bottom: 1px solid var(--lmm-border); background: var(--lmm-bg2); border-radius: 12px 12px 0 0; flex-wrap: nowrap; gap: 8px; flex-shrink: 0; }
                .lmm-title { display: flex; align-items: center; gap: 8px; font-weight: 600; font-size: 15px; white-space: nowrap; flex-shrink: 0; }
                .lmm-header-btns { display: flex; gap: 5px; align-items: center; margin-left: auto; flex-wrap: wrap; }
                .lmm-close { width: 28px; height: 28px; border: none; background: none; font-size: 20px; cursor: pointer; color: var(--lmm-text2); border-radius: 6px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-left: 8px; }
                .lmm-close:hover { background: var(--lmm-bg3); color: var(--lmm-danger); }

                .lmm-btn { padding: 5px 10px; border-radius: 6px; border: 1px solid var(--lmm-border); background: var(--lmm-bg); color: var(--lmm-text); cursor: pointer; font-size: 12px; display: inline-flex; align-items: center; gap: 4px; transition: all 0.15s; white-space: nowrap; flex-shrink: 0; height: 28px; box-sizing: border-box; }
                .lmm-btn:hover { background: var(--lmm-bg3); border-color: var(--lmm-primary); }
                .lmm-btn-primary { background: var(--lmm-primary); color: #fff; border-color: var(--lmm-primary); }
                .lmm-btn-primary:hover { background: var(--lmm-primary-dark); }
                .lmm-btn-danger { background: var(--lmm-danger); color: #fff; border-color: var(--lmm-danger); }
                .lmm-btn-success { background: var(--lmm-success); color: #fff; border-color: var(--lmm-success); }
                .lmm-btn.scanning { animation: lmm-pulse 1.5s infinite; }
                .lmm-btn.active { background: var(--lmm-primary); color: #fff; border-color: var(--lmm-primary); }
                .lmm-btn-icon { padding: 5px 7px; min-width: 28px; justify-content: center; }
                .lmm-btn-sm { padding: 3px 8px; height: 24px; font-size: 11px; }
                @keyframes lmm-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.6; } }

                .lmm-topbar { display: flex; gap: 5px; padding: 8px 14px; border-bottom: 1px solid var(--lmm-border); overflow-x: auto; flex-shrink: 0; flex-wrap: wrap; }
                .lmm-topbar-item { padding: 4px 8px; border-radius: 12px; border: 1px solid var(--lmm-border); background: var(--lmm-bg); font-size: 12px; cursor: pointer; white-space: nowrap; transition: all 0.15s; display: inline-flex; align-items: center; gap: 6px; height: 26px; box-sizing: border-box; }
                .lmm-topbar-item:hover { border-color: var(--lmm-primary); color: var(--lmm-primary); }
                .lmm-topbar-item.active { background: var(--lmm-primary); border-color: var(--lmm-primary); color: #fff; }
                .lmm-topbar-item .cnt { font-size: 10px; background: rgba(0,0,0,0.1); padding: 1px 5px; border-radius: 8px; }
                .lmm-topbar-item.active .cnt { background: rgba(255,255,255,0.2); }
                .lmm-topbar-sep { border-left: 1px solid var(--lmm-border); margin: 0 4px; }

                .lmm-subbar { display: flex; gap: 8px; padding: 8px 14px 0; align-items: center; flex-wrap: wrap; flex-shrink: 0; }
                .lmm-subbar-group { display: flex; background: var(--lmm-bg2); border-radius: 6px; padding: 2px; border: 1px solid var(--lmm-border); }
                .lmm-subbar-item { padding: 4px 10px; border-radius: 4px; cursor: pointer; font-size: 11px; color: var(--lmm-text2); transition: all 0.1s; }
                .lmm-subbar-item.active { background: var(--lmm-bg); color: var(--lmm-text); font-weight: 500; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }

                .lmm-toolbar { display: flex; gap: 8px; padding: 8px 14px; border-bottom: 1px solid var(--lmm-border); flex-wrap: wrap; align-items: center; flex-shrink: 0; }
                .lmm-search { flex: 1; min-width: 140px; position: relative; }
                .lmm-search-icon { position: absolute; left: 8px; top: 50%; transform: translateY(-50%); color: var(--lmm-text2); font-size: 12px; }
                .lmm-search input { width: 100%; padding: 6px 8px 6px 28px; border: 1px solid var(--lmm-border); border-radius: 6px; font-size: 12px; background: var(--lmm-bg); color: var(--lmm-text); height: 30px; box-sizing: border-box; }
                .lmm-search input::placeholder { color: var(--lmm-text2); font-size: 11px; }
                .lmm-select { padding: 4px 22px 4px 8px; border: 1px solid var(--lmm-border); border-radius: 6px; background: var(--lmm-bg); color: var(--lmm-text); font-size: 11px; cursor: pointer; appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10'%3E%3Cpath fill='%2364748b' d='M1 3l4 4 4-4'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 6px center; height: 30px; box-sizing: border-box; }
                .lmm-view-toggle { display: flex; gap: 2px; }
                .lmm-view-btn { padding: 4px 8px; border: 1px solid var(--lmm-border); background: var(--lmm-bg); cursor: pointer; font-size: 12px; transition: all 0.15s; }
                .lmm-view-btn:first-child { border-radius: 6px 0 0 6px; }
                .lmm-view-btn:last-child { border-radius: 0 6px 6px 0; }
                .lmm-view-btn:not(:first-child) { border-left: none; }
                .lmm-view-btn.active { background: var(--lmm-primary); color: #fff; border-color: var(--lmm-primary); }
                .lmm-view-btn:hover:not(.active) { background: var(--lmm-bg3); }

                .lmm-content { display: flex; flex: 1; overflow: hidden; min-height: 0; }
                .lmm-sidebar { width: 170px; border-right: 1px solid var(--lmm-border); background: var(--lmm-bg2); overflow-y: auto; padding: 8px 6px; flex-shrink: 0; }
                .lmm-content.visible-mode .lmm-sidebar { display: none; }

                .lmm-sidebar-item { display: flex; align-items: center; gap: 5px; padding: 5px 8px; border-radius: 5px; cursor: pointer; font-size: 11px; transition: all 0.1s; user-select: none; }
                .lmm-sidebar-item:hover { background: var(--lmm-bg3); }
                .lmm-sidebar-item.active { background: var(--lmm-primary); color: #fff; }
                .lmm-sidebar-item .icon { display: inline-flex; width: 1.4em; justify-content: center; flex-shrink: 0; }
                .lmm-sidebar-item .cnt { margin-left: auto; font-size: 10px; background: var(--lmm-bg); padding: 1px 5px; border-radius: 6px; color: var(--lmm-text2); }
                .lmm-sidebar-item.active .cnt { background: rgba(255,255,255,0.2); color: #fff; }
                .lmm-sidebar-item.sort-mode { cursor: grab; background: var(--lmm-bg3); }
                .lmm-sidebar-item.sort-mode:active { cursor: grabbing; }
                .lmm-sidebar-item.dragging { opacity: 0.5; background: var(--lmm-primary); color: #fff; }
                .lmm-sidebar-header { display: flex; justify-content: space-between; align-items: center; padding: 0 6px; margin: 6px 0 4px; gap: 4px; }
                .lmm-sidebar-title { font-size: 10px; font-weight: 600; text-transform: uppercase; color: var(--lmm-text2); letter-spacing: 0.3px; }
                .lmm-sidebar-btn { font-size: 10px; color: var(--lmm-primary); cursor: pointer; background: none; border: none; padding: 2px 4px; }
                .lmm-sidebar-btn.active { color: var(--lmm-success); font-weight: 600; }
                .lmm-sidebar-btn.reset { color: var(--lmm-warning); }
                .lmm-sidebar-folder { display: flex; align-items: center; gap: 5px; padding: 5px 8px; border-radius: 5px; cursor: pointer; font-size: 11px; color: var(--lmm-text2); transition: all 0.1s; }
                .lmm-sidebar-folder:hover { background: var(--lmm-bg3); color: var(--lmm-text); }
                .lmm-sidebar-folder .icon { display: inline-flex; width: 1.4em; justify-content: center; }
                .lmm-sidebar-folder .cnt { margin-left: auto; font-size: 10px; background: var(--lmm-bg); padding: 1px 5px; border-radius: 6px; color: var(--lmm-text2); }
                .lmm-sidebar-folder-content { display: none; padding-left: 8px; }
                .lmm-sidebar-folder-content.open { display: block; }

                .lmm-list { flex: 1; overflow-y: auto; padding: 10px; }
                .lmm-list-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; flex-wrap: wrap; gap: 6px; }
                .lmm-count { color: var(--lmm-text2); font-size: 12px; }
                .lmm-batch { display: flex; gap: 5px; flex-wrap: wrap; }

                .lmm-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 8px; }
                .lmm-grid.compact-view { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 6px; }
                .lmm-grid.list-view { display: flex; flex-direction: column; gap: 4px; }

                .lmm-card { display: flex; align-items: flex-start; gap: 8px; padding: 9px; border: 2px solid var(--lmm-border); border-radius: 8px; background: var(--lmm-bg); cursor: pointer; transition: all 0.15s; position: relative; }
                .lmm-card:hover { border-color: var(--lmm-primary); }
                .lmm-card.visible { border-color: var(--lmm-primary); }
                .lmm-card.hidden { opacity: 0.5; background: var(--lmm-bg3); }
                .lmm-card.new { box-shadow: inset 0 0 0 1px var(--lmm-success); }
                .lmm-card.starred { box-shadow: inset 0 0 0 1px var(--lmm-warning); }
                .lmm-card.selected { background: rgba(99,102,241,0.1); border-color: var(--lmm-primary); }

                .lmm-grid.compact-view .lmm-card { padding: 6px 8px; gap: 6px; }
                .lmm-grid.compact-view .lmm-card-name { font-size: 10px; }
                .lmm-grid.compact-view .lmm-tags { display: none; }
                .lmm-grid.compact-view .lmm-card-actions { top: 2px; right: 2px; }
                .lmm-grid.compact-view .lmm-check { width: 13px; height: 13px; font-size: 8px; }

                .lmm-grid.list-view .lmm-card { padding: 6px 10px; flex-direction: row; align-items: center; }
                .lmm-grid.list-view .lmm-card-info { display: flex; align-items: center; gap: 8px; flex-direction: row; }
                .lmm-grid.list-view .lmm-card-name { margin-bottom: 0; font-size: 12px; }
                .lmm-grid.list-view .lmm-tags { margin-left: auto; }
                .lmm-grid.list-view .lmm-card.dragging { opacity: 0.5; border-color: var(--lmm-primary); background: var(--lmm-bg3); }

                .lmm-drag-handle { cursor: grab; color: var(--lmm-text2); font-size: 12px; margin-right: 4px; }
                .lmm-check { width: 15px; height: 15px; border: 2px solid var(--lmm-border); border-radius: 3px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 9px; margin-top: 2px; }
                .lmm-check.on { background: var(--lmm-primary); border-color: var(--lmm-primary); color: #fff; }
                .lmm-card-info { flex: 1; min-width: 0; }
                .lmm-card-name { font-weight: 500; font-size: 11px; display: flex; align-items: center; gap: 4px; margin-bottom: 3px; }
                .lmm-card-name .n { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
                .lmm-tags { display: flex; flex-wrap: wrap; gap: 2px; }
                .lmm-tag { padding: 1px 4px; border-radius: 3px; font-size: 9px; background: var(--lmm-bg3); color: var(--lmm-text2); }
                .lmm-tag.org { background: #e0e7ff; color: #4338ca; }
                .lmm-tag.mode { background: #fef3c7; color: #92400e; }
                .lmm-tag.new { background: #dcfce7; color: #166534; }
                .lmm-tag.imgtype { background: #fce7f3; color: #9d174d; }
                .lmm-tag.vision { background: #e0f2fe; color: #0369a1; }
                .lmm-tag.group { background: #f0fdf4; color: #15803d; }
                @media (prefers-color-scheme: dark) {
                    .lmm-tag.org { background: #3730a3; color: #c7d2fe; }
                    .lmm-tag.mode { background: #78350f; color: #fef3c7; }
                    .lmm-tag.new { background: #166534; color: #bbf7d0; }
                    .lmm-tag.imgtype { background: #831843; color: #fbcfe8; }
                    .lmm-tag.vision { background: #0c4a6e; color: #bae6fd; }
                    .lmm-tag.group { background: #14532d; color: #bbf7d0; }
                }
                .lmm-card-actions { position: absolute; top: 4px; right: 4px; display: flex; gap: 2px; opacity: 0; transition: opacity 0.15s; }
                .lmm-card:hover .lmm-card-actions { opacity: 1; }
                .lmm-card-btn { font-size: 12px; background: var(--lmm-bg2); border: 1px solid var(--lmm-border); border-radius: 4px; padding: 2px 5px; cursor: pointer; transition: all 0.15s; }
                .lmm-card-btn:hover { background: var(--lmm-primary); color: #fff; border-color: var(--lmm-primary); }
                .lmm-card-btn.starred { color: var(--lmm-warning); }

                .lmm-footer { display: flex; justify-content: space-between; align-items: center; padding: 8px 14px; border-top: 1px solid var(--lmm-border); background: var(--lmm-bg2); border-radius: 0 0 12px 12px; font-size: 11px; color: var(--lmm-text2); flex-wrap: wrap; gap: 6px; flex-shrink: 0; }
                .lmm-stats { display: flex; gap: 12px; }
                .lmm-stat b { color: var(--lmm-text); }
                .lmm-empty { text-align: center; padding: 30px 20px; color: var(--lmm-text2); }
                .lmm-empty-icon { font-size: 32px; margin-bottom: 8px; opacity: 0.5; }
                .lmm-toast { position: fixed; top: 60px; right: 12px; display: flex; align-items: center; gap: 8px; padding: 10px 14px; background: var(--lmm-bg); border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.15); z-index: 100001; animation: lmm-in 0.25s ease; border-left: 3px solid var(--lmm-primary); font-size: 13px; max-width: 350px; }
                .lmm-toast-success { border-left-color: var(--lmm-success); }
                .lmm-toast-warning { border-left-color: var(--lmm-warning); }
                @keyframes lmm-in { from { transform: translateX(100%); opacity: 0; } }
                .lmm-toast-x { background: none; border: none; font-size: 16px; cursor: pointer; color: var(--lmm-text2); }
                .lmm-modal { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(0.95); background: var(--lmm-bg); border-radius: 10px; padding: 16px; z-index: 100002; min-width: 320px; max-width: 90vw; max-height: 80vh; overflow-y: auto; box-shadow: 0 20px 40px rgba(0,0,0,0.2); opacity: 0; visibility: hidden; transition: all 0.2s; }
                .lmm-modal.open { opacity: 1; visibility: visible; transform: translate(-50%, -50%) scale(1); }
                .lmm-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 100001; opacity: 0; visibility: hidden; transition: all 0.2s; }
                .lmm-modal-overlay.open { opacity: 1; visibility: visible; }
                .lmm-modal-title { font-size: 15px; font-weight: 600; margin-bottom: 12px; }
                .lmm-modal-body { margin-bottom: 14px; }
                .lmm-modal-footer { display: flex; justify-content: flex-end; gap: 8px; }
                .lmm-form-group { margin-bottom: 12px; }
                .lmm-form-label { display: block; font-size: 11px; font-weight: 500; margin-bottom: 4px; color: var(--lmm-text2); }
                .lmm-form-input, .lmm-form-select { width: 100%; padding: 7px 10px; border: 1px solid var(--lmm-border); border-radius: 6px; font-size: 13px; background: var(--lmm-bg); color: var(--lmm-text); box-sizing: border-box; }
                .lmm-checkbox-group { display: flex; flex-wrap: wrap; gap: 6px; }
                .lmm-checkbox-item { display: flex; align-items: center; gap: 4px; padding: 4px 8px; border: 1px solid var(--lmm-border); border-radius: 5px; font-size: 11px; cursor: pointer; transition: all 0.15s; }
                .lmm-checkbox-item:hover { border-color: var(--lmm-primary); }
                .lmm-checkbox-item.checked { background: var(--lmm-primary); color: #fff; border-color: var(--lmm-primary); }
                .lmm-scan-list { max-height: 300px; overflow-y: auto; margin: 10px 0; }
                .lmm-scan-item { display: flex; align-items: center; gap: 8px; padding: 6px 8px; border-bottom: 1px solid var(--lmm-border); font-size: 12px; }
                .lmm-scan-item:last-child { border-bottom: none; }
                .lmm-group-list { max-height: 200px; overflow-y: auto; margin: 8px 0; }
                .lmm-group-item { display: flex; align-items: center; gap: 8px; padding: 6px 8px; border: 1px solid var(--lmm-border); border-radius: 5px; margin-bottom: 4px; font-size: 12px; }
                .lmm-group-item:hover { background: var(--lmm-bg3); }
                .lmm-group-item .name { flex: 1; }
                .lmm-group-item .actions { display: flex; gap: 4px; }
                .lmm-group-item .actions button { padding: 2px 6px; font-size: 10px; }
                .lmm-switch { position: relative; width: 40px; height: 22px; background: var(--lmm-border); border-radius: 11px; cursor: pointer; transition: background 0.2s; }
                .lmm-switch.on { background: var(--lmm-primary); }
                .lmm-switch::after { content: ''; position: absolute; top: 2px; left: 2px; width: 18px; height: 18px; background: #fff; border-radius: 50%; transition: transform 0.2s; }
                .lmm-switch.on::after { transform: translateX(18px); }
                .lmm-setting-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid var(--lmm-border); }
                .lmm-setting-row:last-child { border-bottom: none; }
                .lmm-setting-info { flex: 1; }
                .lmm-setting-title { font-weight: 500; margin-bottom: 2px; }
                .lmm-setting-desc { font-size: 11px; color: var(--lmm-text2); }

                @media (max-width: 600px) {
                    .lmm-panel { width: 100vw; height: 100vh; max-width: none; max-height: none; border-radius: 0; }
                    .lmm-sidebar { display: none; }
                    .lmm-grid { grid-template-columns: 1fr; }
                }
            `);
        }

        createFab() {
            const fab = document.createElement('button');
            fab.className = 'lmm-fab';
            fab.innerHTML = '🎛️';
            fab.title = 'LMArena Manager (Ctrl+Shift+M)';
            fab.onclick = () => this.toggle();
            document.body.appendChild(fab);
            this.fab = fab;
            this.updateFabBadge();
        }

        updateFabBadge() {
            const hasNew = this.dm.getAllModels().some(m => m.isNew);
            this.fab?.classList.toggle('has-new', hasNew);
        }

        getModeCounts() {
            const models = this.dm.getAllModels();
            const groups = this.dm.getGroups();
            const counts = { all: models.length, text: 0, search: 0, image: 0, code: 0, video: 0, starred: 0, new: 0 };
            models.forEach(m => {
                if (Array.isArray(m.modes)) {
                    m.modes.forEach(mode => {
                        if (counts[mode] !== undefined) counts[mode]++;
                    });
                }
                if (m.starred) counts.starred++;
                if (m.isNew) counts.new++;
            });
            Object.keys(groups).forEach(name => {
                counts[`group_${name}`] = groups[name].length;
            });
            return counts;
        }

        createPanel() {
            const overlay = document.createElement('div');
            overlay.className = 'lmm-overlay';
            overlay.onclick = () => this.close();
            document.body.appendChild(overlay);
            this.overlay = overlay;

            const panel = document.createElement('div');
            panel.className = 'lmm-panel';
            panel.innerHTML = `
                <div class="lmm-header">
                    <div class="lmm-title"><span>🎛️</span> LMArena Manager <span style="font-size:10px;color:var(--lmm-text2)">v${VERSION}</span></div>
                    <div class="lmm-header-btns">
                        <button class="lmm-btn" id="lmm-scan-toggle">🔍 <span data-i18n="startScan"></span></button>
                        <button class="lmm-btn" id="lmm-export">📤 <span data-i18n="export"></span></button>
                        <button class="lmm-btn" id="lmm-import">📥 <span data-i18n="import"></span></button>
                        <button class="lmm-btn" id="lmm-clear-new">✨ <span data-i18n="clearMarks"></span></button>
                        <button class="lmm-btn" id="lmm-groups-btn">📁 <span data-i18n="groups"></span></button>
                        <button class="lmm-btn" id="lmm-settings">⚙️ <span data-i18n="settings"></span></button>
                    </div>
                    <button class="lmm-close" id="lmm-close">×</button>
                </div>
                <div class="lmm-topbar" id="lmm-topbar"></div>
                <div class="lmm-subbar" id="lmm-subbar" style="display:none">
                    <div class="lmm-subbar-group">
                        <div class="lmm-subbar-item" data-mode="text">Text</div>
                        <div class="lmm-subbar-item" data-mode="search">Search</div>
                        <div class="lmm-subbar-item" data-mode="image">Image</div>
                        <div class="lmm-subbar-item" data-mode="code">Code</div>
                        <div class="lmm-subbar-item" data-mode="video">Video</div>
                    </div>
                    <div style="flex:1"></div>
                    <button class="lmm-btn" id="lmm-model-sort-btn">⇅ <span data-i18n="sort"></span></button>
                    <button class="lmm-btn" id="lmm-model-sort-reset" style="display:none">↺ <span data-i18n="reset"></span></button>
                </div>
                <div class="lmm-toolbar">
                    <div class="lmm-search">
                        <span class="lmm-search-icon">🔍</span>
                        <input type="text" id="lmm-search" data-i18n-placeholder="searchPlaceholder">
                    </div>
                    <select class="lmm-select" id="lmm-org"></select>
                    <select class="lmm-select" id="lmm-sort">
                        <option value="org-asc" data-i18n="sortByOrg"></option>
                        <option value="starred-desc" data-i18n="starredFirst"></option>
                        <option value="name-asc" data-i18n="nameAZ"></option>
                        <option value="name-desc" data-i18n="nameZA"></option>
                        <option value="date-desc" data-i18n="latestAdded"></option>
                    </select>
                    <div class="lmm-view-toggle">
                        <button class="lmm-view-btn active" data-view="grid" title="Grid">⊞</button>
                        <button class="lmm-view-btn" data-view="compact" title="Compact">⊟</button>
                        <button class="lmm-view-btn" data-view="list" title="List">☰</button>
                    </div>
                </div>
                <div class="lmm-content" id="lmm-content">
                    <div class="lmm-sidebar" id="lmm-sidebar"></div>
                    <div class="lmm-list">
                        <div class="lmm-list-header">
                            <span class="lmm-count" id="lmm-count"></span>
                            <div class="lmm-batch" id="lmm-batch"></div>
                        </div>
                        <div class="lmm-grid" id="lmm-grid"></div>
                    </div>
                </div>
                <div class="lmm-footer">
                    <div class="lmm-stats">
                        <span class="lmm-stat"><span data-i18n="displayed"></span>: <b id="lmm-v">0</b></span>
                        <span class="lmm-stat"><span data-i18n="hiddenCount"></span>: <b id="lmm-h">0</b></span>
                        <span class="lmm-stat"><span data-i18n="total"></span>: <b id="lmm-t">0</b></span>
                    </div>
                    <span>Ctrl+Shift+M | / = Search</span>
                </div>
            `;
            document.body.appendChild(panel);
            this.panel = panel;
            this.bindEvents();
            this.updateI18n();
        }

        updateI18n() {
            this.panel.querySelectorAll('[data-i18n]').forEach(el => {
                el.textContent = this.t(el.dataset.i18n);
            });
            this.panel.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
                el.placeholder = this.t(el.dataset.i18nPlaceholder);
            });
            // 更新排序下拉框
            const sortSelect = this.$('#lmm-sort');
            if (sortSelect) {
                sortSelect.querySelectorAll('option').forEach(opt => {
                    if (opt.dataset.i18n) {
                        opt.textContent = '🏢 ' + this.t(opt.dataset.i18n);
                    }
                });
            }
            const scanBtn = this.$('#lmm-scan-toggle');
            if (scanBtn) {
                if (this.scanner.isScanActive()) {
                    scanBtn.innerHTML = `⏹️ <span>${this.t('endScan')}</span>`;
                } else {
                    scanBtn.innerHTML = `🔍 <span>${this.t('startScan')}</span>`;
                }
            }
        }

        createEditModal() {
            const modalOverlay = document.createElement('div');
            modalOverlay.className = 'lmm-modal-overlay';
            modalOverlay.onclick = () => this.closeEditModal();
            document.body.appendChild(modalOverlay);
            this.editModalOverlay = modalOverlay;

            const modal = document.createElement('div');
            modal.className = 'lmm-modal';
            modal.innerHTML = `
                <div class="lmm-modal-title">✏️ <span data-i18n="editModel"></span></div>
                <div class="lmm-modal-body">
                    <div class="lmm-form-group">
                        <label class="lmm-form-label" data-i18n="modelName"></label>
                        <input type="text" class="lmm-form-input" id="lmm-edit-name" readonly>
                    </div>
                    <div class="lmm-form-group">
                        <label class="lmm-form-label" data-i18n="org"></label>
                        <input type="text" class="lmm-form-input" id="lmm-edit-org" data-i18n-placeholder="orgPlaceholder">
                    </div>
                    <div class="lmm-form-group">
                        <label class="lmm-form-label" data-i18n="belongGroups"></label>
                        <div class="lmm-checkbox-group" id="lmm-edit-groups"></div>
                    </div>
                </div>
                <div class="lmm-modal-footer">
                    <button class="lmm-btn" id="lmm-edit-reset" style="margin-right:auto">↺ <span data-i18n="restoreDefault"></span></button>
                    <button class="lmm-btn" id="lmm-edit-cancel" data-i18n="cancel"></button>
                    <button class="lmm-btn lmm-btn-primary" id="lmm-edit-save" data-i18n="save"></button>
                </div>
            `;
            document.body.appendChild(modal);
            this.editModal = modal;

            modal.querySelector('#lmm-edit-cancel').onclick = () => this.closeEditModal();
            modal.querySelector('#lmm-edit-save').onclick = () => this.saveEdit();
            modal.querySelector('#lmm-edit-reset').onclick = () => this.resetEdit();
        }

        createConfirmModal() {
            const modalOverlay = document.createElement('div');
            modalOverlay.className = 'lmm-modal-overlay';
            document.body.appendChild(modalOverlay);
            this.confirmModalOverlay = modalOverlay;

            const modal = document.createElement('div');
            modal.className = 'lmm-modal';
            modal.innerHTML = `
                <div class="lmm-modal-title" id="lmm-confirm-title"></div>
                <div class="lmm-modal-body"><p id="lmm-confirm-msg"></p></div>
                <div class="lmm-modal-footer">
                    <button class="lmm-btn" id="lmm-confirm-no" data-i18n="cancel"></button>
                    <button class="lmm-btn lmm-btn-danger" id="lmm-confirm-yes" data-i18n="confirm"></button>
                </div>
            `;
            document.body.appendChild(modal);
            this.confirmModal = modal;
        }

        createScanResultModal() {
            const modalOverlay = document.createElement('div');
            modalOverlay.className = 'lmm-modal-overlay';
            document.body.appendChild(modalOverlay);
            this.scanModalOverlay = modalOverlay;

            const modal = document.createElement('div');
            modal.className = 'lmm-modal';
            modal.style.minWidth = '400px';
            modal.innerHTML = `
                <div class="lmm-modal-title">🔍 <span data-i18n="scanResult"></span></div>
                <div class="lmm-modal-body">
                    <p id="lmm-scan-summary"></p>
                    <div class="lmm-scan-list" id="lmm-scan-list"></div>
                </div>
                <div class="lmm-modal-footer">
                    <button class="lmm-btn" id="lmm-scan-keep" data-i18n="keepAll"></button>
                    <button class="lmm-btn lmm-btn-danger" id="lmm-scan-delete" data-i18n="deleteSelected"></button>
                </div>
            `;
            document.body.appendChild(modal);
            this.scanModal = modal;
        }

        createGroupModal() {
            const modalOverlay = document.createElement('div');
            modalOverlay.className = 'lmm-modal-overlay';
            modalOverlay.onclick = () => this.closeGroupModal();
            document.body.appendChild(modalOverlay);
            this.groupModalOverlay = modalOverlay;

            const modal = document.createElement('div');
            modal.className = 'lmm-modal';
            modal.style.minWidth = '360px';
            modal.innerHTML = `
                <div class="lmm-modal-title">📁 <span data-i18n="groupManage"></span></div>
                <div class="lmm-modal-body">
                    <div class="lmm-form-group">
                        <div style="display:flex;gap:6px;">
                            <input type="text" class="lmm-form-input" id="lmm-group-new-name" data-i18n-placeholder="newGroupName" style="flex:1">
                            <button class="lmm-btn lmm-btn-primary" id="lmm-group-create" data-i18n="create"></button>
                        </div>
                    </div>
                    <div class="lmm-group-list" id="lmm-group-list"></div>
                </div>
                <div class="lmm-modal-footer">
                    <button class="lmm-btn" id="lmm-group-close" data-i18n="close"></button>
                </div>
            `;
            document.body.appendChild(modal);
            this.groupModal = modal;

            modal.querySelector('#lmm-group-create').onclick = () => this.createGroup();
            modal.querySelector('#lmm-group-close').onclick = () => this.closeGroupModal();
        }

        createSettingsModal() {
            const modalOverlay = document.createElement('div');
            modalOverlay.className = 'lmm-modal-overlay';
            modalOverlay.onclick = () => this.closeSettingsModal();
            document.body.appendChild(modalOverlay);
            this.settingsModalOverlay = modalOverlay;

            const modal = document.createElement('div');
            modal.className = 'lmm-modal';
            modal.style.minWidth = '400px';
            modal.innerHTML = `
                <div class="lmm-modal-title">⚙️ <span data-i18n="settingsTitle"></span></div>
                <div class="lmm-modal-body">
                    <div class="lmm-setting-row">
                        <div class="lmm-setting-info">
                            <div class="lmm-setting-title" data-i18n="language"></div>
                        </div>
                        <select class="lmm-select" id="lmm-setting-lang" style="width:140px"></select>
                    </div>
                    <div class="lmm-setting-row">
                        <div class="lmm-setting-info">
                            <div class="lmm-setting-title" data-i18n="newModelAlert"></div>
                            <div class="lmm-setting-desc" data-i18n="newModelAlertDesc"></div>
                        </div>
                        <div class="lmm-switch" id="lmm-setting-alert"></div>
                    </div>
                    <div class="lmm-setting-row" style="flex-direction:column;align-items:stretch;gap:8px">
                        <div class="lmm-setting-title" data-i18n="cloudSync"></div>
                        <div class="lmm-form-group" style="margin:0">
                            <label class="lmm-form-label" data-i18n="gistToken"></label>
                            <input type="password" class="lmm-form-input" id="lmm-setting-gist-token" data-i18n-placeholder="gistTokenPlaceholder">
                        </div>
                        <div class="lmm-form-group" style="margin:0">
                            <label class="lmm-form-label" data-i18n="gistId"></label>
                            <input type="text" class="lmm-form-input" id="lmm-setting-gist-id" data-i18n-placeholder="gistIdPlaceholder">
                        </div>
                        <button class="lmm-btn lmm-btn-primary" id="lmm-setting-sync" style="align-self:flex-start" data-i18n="syncNow"></button>
                    </div>
                    <div class="lmm-setting-row" style="border-top:2px solid var(--lmm-danger);margin-top:12px;padding-top:12px">
                        <div class="lmm-setting-info">
                            <div class="lmm-setting-title" style="color:var(--lmm-danger)" data-i18n="resetData"></div>
                            <div class="lmm-setting-desc" data-i18n="resetDataDesc"></div>
                        </div>
                        <button class="lmm-btn lmm-btn-danger" id="lmm-setting-reset" data-i18n="reset"></button>
                    </div>
                </div>
                <div class="lmm-modal-footer">
                    <button class="lmm-btn lmm-btn-primary" id="lmm-settings-close" data-i18n="close"></button>
                </div>
            `;
            document.body.appendChild(modal);
            this.settingsModal = modal;

            // 填充语言选项
            const langSelect = modal.querySelector('#lmm-setting-lang');
            Object.entries(I18N).forEach(([code, data]) => {
                const opt = document.createElement('option');
                opt.value = code;
                opt.textContent = data.name;
                langSelect.appendChild(opt);
            });

            langSelect.onchange = () => {
                this.dm.setLanguage(langSelect.value);
                this.updateI18n();
                this.updateSettingsModalI18n();
                this.updateTopbar();
                this.updateSidebar();
                this.refresh();
            };

            modal.querySelector('#lmm-setting-alert').onclick = (e) => {
                const sw = e.currentTarget;
                sw.classList.toggle('on');
                this.dm.data.settings.showNewAlert = sw.classList.contains('on');
                this.dm.save();
            };

            modal.querySelector('#lmm-setting-sync').onclick = () => this.syncGist();

            modal.querySelector('#lmm-setting-reset').onclick = () => {
                this.closeSettingsModal();
                this.showConfirm(this.t('resetData'), this.t('resetConfirm'), () => {
                    this.dm.resetAll();
                    this.scanner.toast(this.t('dataReset'), 'success');
                    this.updateTopbar();
                    this.updateSidebar();
                    this.refresh();
                    this.updateFabBadge();
                });
            };

            modal.querySelector('#lmm-settings-close').onclick = () => this.closeSettingsModal();
        }

        updateSettingsModalI18n() {
            this.settingsModal.querySelectorAll('[data-i18n]').forEach(el => {
                el.textContent = this.t(el.dataset.i18n);
            });
            this.settingsModal.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
                el.placeholder = this.t(el.dataset.i18nPlaceholder);
            });
        }

        createGroupSelectModal() {
            const modalOverlay = document.createElement('div');
            modalOverlay.className = 'lmm-modal-overlay';
            modalOverlay.onclick = () => this.closeGroupSelectModal();
            document.body.appendChild(modalOverlay);
            this.groupSelectModalOverlay = modalOverlay;

            const modal = document.createElement('div');
            modal.className = 'lmm-modal';
            modal.style.minWidth = '300px';
            modal.innerHTML = `
                <div class="lmm-modal-title">📁 <span data-i18n="selectGroup"></span></div>
                <div class="lmm-modal-body">
                    <div class="lmm-group-list" id="lmm-group-select-list"></div>
                </div>
                <div class="lmm-modal-footer">
                    <button class="lmm-btn" id="lmm-group-select-close" data-i18n="cancel"></button>
                </div>
            `;
            document.body.appendChild(modal);
            this.groupSelectModal = modal;

            modal.querySelector('#lmm-group-select-close').onclick = () => this.closeGroupSelectModal();
        }

        async syncGist() {
            const token = this.settingsModal.querySelector('#lmm-setting-gist-token').value.trim();
            let gistId = this.settingsModal.querySelector('#lmm-setting-gist-id').value.trim();

            if (!token) {
                this.scanner.toast(this.t('gistTokenPlaceholder'), 'warning');
                return;
            }

            this.dm.data.settings.gist = { token, gistId };
            this.dm.save();

            const data = this.dm.export();
            const filename = 'lmarena-manager-data.json';

            try {
                if (gistId) {
                    // 更新现有 Gist
                    const res = await fetch(`https://api.github.com/gists/${gistId}`, {
                        method: 'PATCH',
                        headers: {
                            'Authorization': `token ${token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            files: { [filename]: { content: data } }
                        })
                    });
                    if (!res.ok) throw new Error('Update failed');
                } else {
                    // 创建新 Gist
                    const res = await fetch('https://api.github.com/gists', {
                        method: 'POST',
                        headers: {
                            'Authorization': `token ${token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            description: 'LMArena Manager Data',
                            public: false,
                            files: { [filename]: { content: data } }
                        })
                    });
                    if (!res.ok) throw new Error('Create failed');
                    const result = await res.json();
                    gistId = result.id;
                    this.settingsModal.querySelector('#lmm-setting-gist-id').value = gistId;
                    this.dm.data.settings.gist.gistId = gistId;
                    this.dm.save();
                }
                this.scanner.toast(this.t('saved'), 'success');
            } catch (e) {
                console.error('[LMM] Gist sync error:', e);
                this.scanner.toast('Sync failed: ' + e.message, 'warning');
            }
        }

        showConfirm(title, msg, onConfirm) {
            this.confirmModal.querySelector('#lmm-confirm-title').textContent = title;
            this.confirmModal.querySelector('#lmm-confirm-msg').textContent = msg;
            this.confirmModal.querySelector('#lmm-confirm-no').textContent = this.t('cancel');
            this.confirmModal.querySelector('#lmm-confirm-yes').textContent = this.t('confirm');
            this.confirmModalOverlay.classList.add('open');
            this.confirmModal.classList.add('open');

            const closeConfirm = () => {
                this.confirmModalOverlay.classList.remove('open');
                this.confirmModal.classList.remove('open');
            };

            this.confirmModal.querySelector('#lmm-confirm-yes').onclick = () => { closeConfirm(); onConfirm(); };
            this.confirmModal.querySelector('#lmm-confirm-no').onclick = closeConfirm;
            this.confirmModalOverlay.onclick = closeConfirm;
        }

        showScanResult(result) {
            const { missing, scannedCount } = result;
            this.scanModal.querySelector('#lmm-scan-summary').innerHTML = `${this.t('scannedCount')} <b>${scannedCount}</b> ${this.t('modelsText')}，${missing.length > 0 ? `${this.t('notScanned')}：` : this.t('allScanned') + ' ✓'}`;

            const list = this.scanModal.querySelector('#lmm-scan-list');
            if (missing.length > 0) {
                list.innerHTML = `<div class="lmm-scan-item" style="font-weight:500;background:var(--lmm-bg3)"><input type="checkbox" id="lmm-scan-all" checked><label for="lmm-scan-all">${this.t('selectAll')}</label></div>` + missing.map(name => `<div class="lmm-scan-item"><input type="checkbox" class="lmm-scan-check" value="${this.esc(name)}" checked><span>${this.esc(name)}</span></div>`).join('');
                list.querySelector('#lmm-scan-all').onchange = (e) => {
                    list.querySelectorAll('.lmm-scan-check').forEach(cb => cb.checked = e.target.checked);
                };
            } else {
                list.innerHTML = '';
            }

            this.scanModal.querySelector('#lmm-scan-keep').textContent = this.t('keepAll');
            this.scanModal.querySelector('#lmm-scan-delete').textContent = this.t('deleteSelected');
            this.scanModal.querySelector('#lmm-scan-delete').style.display = missing.length > 0 ? '' : 'none';
            this.scanModalOverlay.classList.add('open');
            this.scanModal.classList.add('open');

            const closeScan = () => {
                this.scanModalOverlay.classList.remove('open');
                this.scanModal.classList.remove('open');
            };

            this.scanModal.querySelector('#lmm-scan-keep').onclick = closeScan;
            this.scanModal.querySelector('#lmm-scan-delete').onclick = () => {
                const toDelete = [...list.querySelectorAll('.lmm-scan-check:checked')].map(cb => cb.value);
                if (toDelete.length > 0) {
                    this.dm.deleteModels(toDelete);
                    this.scanner.toast(`${this.t('deleted')} ${toDelete.length}`, 'success');
                    this.refresh();
                    this.updateSidebar();
                    this.updateTopbar();
                }
                closeScan();
            };
            this.scanModalOverlay.onclick = closeScan;
        }

        $(sel) { return this.panel.querySelector(sel); }
        $$(sel) { return this.panel.querySelectorAll(sel); }

        bindEvents() {
            this.$('#lmm-close').onclick = () => this.close();

            this.$('#lmm-scan-toggle').onclick = () => {
                const btn = this.$('#lmm-scan-toggle');
                if (this.scanner.isScanActive()) {
                    const result = this.scanner.endScanSession();
                    btn.innerHTML = `🔍 <span>${this.t('startScan')}</span>`;
                    btn.classList.remove('scanning', 'lmm-btn-success');
                    this.showScanResult(result);
                } else {
                    this.scanner.startScanSession();
                    btn.innerHTML = `⏹️ <span>${this.t('endScan')}</span>`;
                    btn.classList.add('scanning', 'lmm-btn-success');
                }
            };

            this.$('#lmm-export').onclick = () => {
                const blob = new Blob([this.dm.export()], { type: 'application/json' });
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = `lmarena-manager-${new Date().toISOString().slice(0,10)}.json`;
                a.click();
                this.scanner.toast(this.t('exported'), 'success');
            };

            this.$('#lmm-import').onclick = () => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.json';
                input.onchange = e => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = ev => {
                        if (this.dm.import(ev.target.result)) {
                            this.refresh();
                            this.updateSidebar();
                            this.updateTopbar();
                            this.scanner.toast(this.t('importSuccess'), 'success');
                        } else {
                            this.scanner.toast(this.t('importFailed'), 'warning');
                        }
                    };
                    reader.readAsText(file);
                };
                input.click();
            };

            this.$('#lmm-clear-new').onclick = () => {
                this.dm.clearNewFlags();
                this.refresh();
                this.updateFabBadge();
                this.scanner.toast(this.t('marksCleared'), 'success');
            };

            this.$('#lmm-groups-btn').onclick = () => this.openGroupModal();
            this.$('#lmm-settings').onclick = () => this.openSettingsModal();

            const searchInput = this.$('#lmm-search');
            searchInput.oninput = e => { this.filter.search = e.target.value; this.refresh(); };
            searchInput.onkeydown = e => {
                if (e.key === 'Enter') {
                    const firstCard = this.$('.lmm-card');
                    if (firstCard) firstCard.click();
                }
            };

            this.$('#lmm-org').onchange = e => { this.filter.org = e.target.value; this.refresh(); };
            this.$('#lmm-sort').onchange = e => {
                const [by, order] = e.target.value.split('-');
                this.sort = { by, order: order || 'asc' };
                this.refresh();
            };

            this.$$('.lmm-view-btn').forEach(btn => {
                btn.onclick = () => {
                    this.$$('.lmm-view-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    this.viewMode = btn.dataset.view;
                    this.updateGridView();
                };
            });

            this.$('#lmm-subbar').querySelectorAll('.lmm-subbar-item').forEach(item => {
                item.onclick = () => {
                    this.visibleSubMode = item.dataset.mode;
                    this.updateSubbar();
                    this.updateSidebar();
                    this.refresh();
                };
            });

            this.$('#lmm-model-sort-btn').onclick = () => {
                this.isModelSortMode = !this.isModelSortMode;
                this.updateSubbar();
                this.refresh();
            };

            this.$('#lmm-model-sort-reset').onclick = () => {
                this.dm.setModelOrder(this.visibleSubMode, []);
                this.refresh();
                this.scanner.applyFilters();
                this.scanner.toast(this.t('defaultOrderRestored'), 'success');
            };
        }

        bindShortcuts() {
            document.addEventListener('keydown', e => {
                if (e.ctrlKey && e.shiftKey && (e.key === 'M' || e.key === 'm')) {
                    e.preventDefault();
                    this.toggle();
                }
                if (e.key === 'Escape') {
                    if (this.settingsModal.classList.contains('open')) this.closeSettingsModal();
                    else if (this.groupSelectModal.classList.contains('open')) this.closeGroupSelectModal();
                    else if (this.groupModal.classList.contains('open')) this.closeGroupModal();
                    else if (this.editModal.classList.contains('open')) this.closeEditModal();
                    else if (this.confirmModal.classList.contains('open')) {
                        this.confirmModalOverlay.classList.remove('open');
                        this.confirmModal.classList.remove('open');
                    }
                    else if (this.scanModal.classList.contains('open')) {
                        this.scanModalOverlay.classList.remove('open');
                        this.scanModal.classList.remove('open');
                    }
                    else if (this.isOpen) this.close();
                }
                if (e.key === '/' && this.isOpen && !e.ctrlKey && !e.metaKey) {
                    const searchInput = this.$('#lmm-search');
                    if (document.activeElement !== searchInput) {
                        e.preventDefault();
                        searchInput.focus();
                        searchInput.select();
                    }
                }
            });
        }

        toggle() { this.isOpen ? this.close() : this.open(); }

        open() {
            this.isOpen = true;
            this.panel.classList.add('open');
            this.overlay.classList.add('open');
            this.updateI18n();
            this.updateTopbar();
            this.refresh();
            this.updateSidebar();
        }

        close() {
            // 如果在多选模式且有未保存的更改，还原
            if (this.isMultiSelectMode) {
                this.revertMultiSelectChanges();
                this.exitMultiSelectMode();
            }
            this.isOpen = false;
            this.isSortMode = false;
            this.isModelSortMode = false;
            this.updateGridView();
            this.panel.classList.remove('open');
            this.overlay.classList.remove('open');
        }

        updateGridView() {
            const grid = this.$('#lmm-grid');
            grid.classList.remove('compact-view', 'list-view');
            if (this.viewMode === 'compact') grid.classList.add('compact-view');
            else if (this.viewMode === 'list' || this.isModelSortMode) grid.classList.add('list-view');
        }

        updateTopbar() {
            const counts = this.getModeCounts();
            const groups = this.dm.getGroupNames();
            const topbar = this.$('#lmm-topbar');

            const items = [
                { key: 'all', icon: '📋', label: this.t('all'), count: counts.all },
                { key: 'text', icon: '📝', label: 'Text', count: counts.text },
                { key: 'search', icon: '🔍', label: 'Search', count: counts.search },
                { key: 'image', icon: '🎨', label: 'Image', count: counts.image },
                { key: 'code', icon: '💻', label: 'Code', count: counts.code },
                { key: 'video', icon: '🎬', label: 'Video', count: counts.video },
            ];

            let html = items.map(it => `<div class="lmm-topbar-item ${this.currentMode === it.key ? 'active' : ''}" data-mode="${it.key}">${it.icon} ${it.label} ${it.count > 0 ? `<span class="cnt">${it.count}</span>` : ''}</div>`).join('');
            html += `<div class="lmm-topbar-sep"></div>`;
            html += `<div class="lmm-topbar-item ${this.currentMode === 'visible' ? 'active' : ''}" data-mode="visible">👁️ ${this.t('enabled')}</div>`;
            html += `<div class="lmm-topbar-item ${this.currentMode === 'hidden' ? 'active' : ''}" data-mode="hidden">🙈 ${this.t('hidden')}</div>`;
            html += `<div class="lmm-topbar-item ${this.currentMode === 'starred' ? 'active' : ''}" data-mode="starred">⭐ ${this.t('starred')} ${counts.starred > 0 ? `<span class="cnt">${counts.starred}</span>` : ''}</div>`;
            html += `<div class="lmm-topbar-item ${this.currentMode === 'new' ? 'active' : ''}" data-mode="new">✨ ${this.t('newFound')} ${counts.new > 0 ? `<span class="cnt">${counts.new}</span>` : ''}</div>`;

            if (groups.length > 0) {
                html += `<div class="lmm-topbar-sep"></div>`;
                groups.forEach(name => {
                    const cnt = counts[`group_${name}`] || 0;
                    html += `<div class="lmm-topbar-item ${this.currentMode === `group_${name}` ? 'active' : ''}" data-mode="group_${name}">📁 ${this.esc(name)} ${cnt > 0 ? `<span class="cnt">${cnt}</span>` : ''}</div>`;
                });
            }

            topbar.innerHTML = html;
            topbar.querySelectorAll('.lmm-topbar-item').forEach(item => {
                item.onclick = () => {
                    this.currentMode = item.dataset.mode;
                    this.filter = { search: '', org: 'all', imageType: 'all', hasVision: 'all', group: 'all' };
                    this.$('#lmm-search').value = '';
                    this.$('#lmm-org').value = 'all';
                    this.isTier2Expanded = false;
                    this.isModelSortMode = false;
                    this.updateGridView();
                    this.updateTopbar();
                    this.updateSidebar();
                    this.updateSubbar();
                    this.refresh();
                };
            });
        }

        updateSubbar() {
            const subbar = this.$('#lmm-subbar');
            const content = this.$('#lmm-content');

            if (this.currentMode === 'visible') {
                subbar.style.display = 'flex';
                content.classList.add('visible-mode');
                subbar.querySelectorAll('.lmm-subbar-item').forEach(el => {
                    el.classList.toggle('active', el.dataset.mode === this.visibleSubMode);
                });
                const btn = this.$('#lmm-model-sort-btn');
                const resetBtn = this.$('#lmm-model-sort-reset');
                if (this.isModelSortMode) {
                    btn.innerHTML = `✓ ${this.t('sort')}`;
                    btn.classList.add('active');
                    resetBtn.style.display = '';
                    this.updateGridView();
                } else {
                    btn.innerHTML = `⇅ ${this.t('sort')}`;
                    btn.classList.remove('active');
                    resetBtn.style.display = 'none';
                    this.updateGridView();
                }
            } else {
                subbar.style.display = 'none';
                content.classList.remove('visible-mode');
            }
        }

        getModelsInCurrentMode() {
            const models = this.dm.getAllModels();
            if (this.currentMode === 'visible') {
                return models.filter(m => m.visible !== false && Array.isArray(m.modes) && m.modes.includes(this.visibleSubMode));
            }
            if (this.currentMode.startsWith('group_')) {
                const groupName = this.currentMode.substring(6);
                const groupModels = this.dm.getModelsInGroup(groupName);
                return models.filter(m => groupModels.includes(m.name));
            }
            switch (this.currentMode) {
                case 'all': return models;
                case 'starred': return models.filter(m => m.starred);
                case 'hidden': return models.filter(m => m.visible === false);
                case 'new': return models.filter(m => m.isNew);
                default: return models.filter(m => Array.isArray(m.modes) && m.modes.includes(this.currentMode));
            }
        }

        getSidebarMode() {
            if (this.currentMode === 'visible') return this.visibleSubMode;
            if (['text', 'search', 'image', 'code', 'video'].includes(this.currentMode)) return this.currentMode;
            return 'text';
        }

        collapseTier2() {
            this.isTier2Expanded = false;
            const folderContent = this.$('#lmm-tier2-content');
            const folder = this.$('#lmm-tier2-folder');
            if (folderContent) folderContent.classList.remove('open');
            if (folder) folder.querySelector('.icon').textContent = '📁';
        }

        updateSidebar() {
            if (this.currentMode === 'visible') {
                this.$('#lmm-content').classList.remove('visible-mode');
            }

            const modeModels = this.getModelsInCurrentMode();
            const sidebarMode = this.getSidebarMode();
            const orgOrder = this.dm.getOrgOrder(sidebarMode);
            const config = MODE_ORG_CONFIG[sidebarMode] || MODE_ORG_CONFIG.text;
            const showImageTypes = sidebarMode === 'image';

            const visionCount = modeModels.filter(m => m.vision === true).length;
            const showVisionFilter = visionCount > 0 && sidebarMode !== 'image';

            let html = `<div class="lmm-sidebar-header"><span class="lmm-sidebar-title">${this.t('byOrg')}</span><button class="lmm-sidebar-btn ${this.isSortMode ? 'active' : ''}" id="lmm-sort-btn">${this.isSortMode ? this.t('done') : this.t('sort')}</button>${this.isSortMode ? `<button class="lmm-sidebar-btn reset" id="lmm-sort-reset">${this.t('reset')}</button>` : ''}</div><div id="lmm-org-list"></div>`;

            if (showImageTypes) {
                html += `<div class="lmm-sidebar-header" style="margin-top:12px"><span class="lmm-sidebar-title">${this.t('byType')}</span></div><div id="lmm-image-type-list"></div>`;
            }

            if (showVisionFilter) {
                html += `<div class="lmm-sidebar-header" style="margin-top:12px"><span class="lmm-sidebar-title">${this.t('features')}</span></div><div id="lmm-vision-list"></div>`;
            }

            this.$('#lmm-sidebar').innerHTML = html;

            const orgs = {};
            modeModels.forEach(m => {
                const c = m.company || 'Other';
                if (!orgs[c]) orgs[c] = { cnt: 0, icon: m.icon || '❔' };
                orgs[c].cnt++;
            });

            const tier1 = [], tier2 = [], other = [];
            Object.entries(orgs).forEach(([name, data]) => {
                const item = { name, ...data };
                if (config.tier1.includes(name)) tier1.push(item);
                else if (config.useFolder && config.tier2.includes(name)) tier2.push(item);
                else if (name !== 'Other') other.push(item);
            });

            const sortByOrder = arr => arr.sort((a, b) => {
                const ai = orgOrder.indexOf(a.name);
                const bi = orgOrder.indexOf(b.name);
                return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
            });
            sortByOrder(tier1);
            sortByOrder(tier2);
            sortByOrder(other);

            const tier2Total = tier2.reduce((sum, c) => sum + c.cnt, 0);
            const hasOther = orgs['Other'];
            this.renderOrgList(tier1, tier2, tier2Total, hasOther, other);

            if (showImageTypes) {
                const imageTypes = { universal: 0, t2i: 0, i2i: 0 };
                modeModels.forEach(m => {
                    if (typeof m.vision === 'string' && imageTypes[m.vision] !== undefined) {
                        imageTypes[m.vision]++;
                    }
                });

                const imgTypeLabels = {
                    universal: { icon: '🔄', label: this.t('universal') },
                    t2i: { icon: '✨', label: this.t('t2iOnly') },
                    i2i: { icon: '🖼️', label: this.t('i2iOnly') }
                };

                const imgTypeList = this.$('#lmm-image-type-list');
                if (imgTypeList) {
                    imgTypeList.innerHTML = Object.entries(imageTypes)
                        .filter(([_, cnt]) => cnt > 0)
                        .map(([type, cnt]) => `<div class="lmm-sidebar-item ${this.filter.imageType === type ? 'active' : ''}" data-imgtype="${type}"><span class="icon">${imgTypeLabels[type].icon}</span> <span>${imgTypeLabels[type].label}</span> <span class="cnt">${cnt}</span></div>`)
                        .join('');

                    imgTypeList.querySelectorAll('.lmm-sidebar-item').forEach(item => {
                        item.onclick = () => {
                            imgTypeList.querySelectorAll('.lmm-sidebar-item').forEach(i => i.classList.remove('active'));
                            item.classList.add('active');
                            this.filter.imageType = item.dataset.imgtype;
                            this.collapseTier2();
                            this.refresh();
                        };
                    });
                }
            }

            if (showVisionFilter) {
                const visionList = this.$('#lmm-vision-list');
                if (visionList) {
                    visionList.innerHTML = `<div class="lmm-sidebar-item ${this.filter.hasVision === 'yes' ? 'active' : ''}" data-vision="yes"><span class="icon">👓</span> <span>${this.t('vision')}</span> <span class="cnt">${visionCount}</span></div>`;
                    visionList.querySelectorAll('.lmm-sidebar-item').forEach(item => {
                        item.onclick = () => {
                            if (item.classList.contains('active')) {
                                item.classList.remove('active');
                                this.filter.hasVision = 'all';
                            } else {
                                item.classList.add('active');
                                this.filter.hasVision = 'yes';
                            }
                            this.collapseTier2();
                            this.refresh();
                        };
                    });
                }
            }

            this.$('#lmm-sort-btn').onclick = () => this.toggleSortMode();
            if (this.isSortMode) {
                this.$('#lmm-sort-reset').onclick = () => {
                    const sidebarMode = this.getSidebarMode();
                    this.dm.setOrgOrder(sidebarMode, getDefaultOrgOrder(sidebarMode));
                    this.updateSidebar();
                    this.scanner.toast(this.t('orgOrderRestored'), 'success');
                };
            }
        }

        renderOrgList(tier1, tier2, tier2Total, hasOther, other) {
            const list = this.$('#lmm-org-list');
            const renderItem = (c, inFolder = false) => `<div class="lmm-sidebar-item ${this.isSortMode ? 'sort-mode' : ''} ${this.filter.org === c.name ? 'active' : ''}" data-org="${this.esc(c.name)}" data-in-folder="${inFolder}" ${this.isSortMode ? 'draggable="true"' : ''}>${this.isSortMode ? '<span class="lmm-drag-handle">⠿</span>' : ''}<span class="icon">${c.icon}</span><span style="flex:1;overflow:hidden;text-overflow:ellipsis">${this.esc(c.name)}</span><span class="cnt">${c.cnt}</span></div>`;

            let html = tier1.map(c => renderItem(c, false)).join('');
            if (tier2.length > 0) {
                html += `<div class="lmm-sidebar-folder" id="lmm-tier2-folder"><span class="icon">${this.isTier2Expanded ? '📂' : '📁'}</span><span>${this.t('moreOrgs')}</span><span class="cnt">${tier2Total}</span></div><div class="lmm-sidebar-folder-content ${this.isTier2Expanded ? 'open' : ''}" id="lmm-tier2-content">${tier2.map(c => renderItem(c, true)).join('')}</div>`;
            }
            other.forEach(c => html += renderItem(c, false));
            if (hasOther) html += renderItem({ name: 'Other', icon: '❔', cnt: hasOther.cnt }, false);
            list.innerHTML = html;

            const folder = this.$('#lmm-tier2-folder');
            if (folder) {
                folder.onclick = () => {
                    this.isTier2Expanded = !this.isTier2Expanded;
                    this.$('#lmm-tier2-content').classList.toggle('open', this.isTier2Expanded);
                    folder.querySelector('.icon').textContent = this.isTier2Expanded ? '📂' : '📁';
                };
            }

            list.querySelectorAll('.lmm-sidebar-item').forEach(item => {
                if (this.isSortMode) {
                    this.bindDragEvents(item);
                    item.onclick = (e) => e.preventDefault();
                } else {
                    item.onclick = (e) => {
                        if (e.target.closest('.lmm-drag-handle')) return;
                        list.querySelectorAll('.lmm-sidebar-item').forEach(i => i.classList.remove('active'));
                        item.classList.add('active');
                        this.filter.org = item.dataset.org;
                        if (item.dataset.inFolder !== 'true') {
                            this.collapseTier2();
                        }
                        this.refresh();
                    };
                }
            });
        }

        toggleSortMode() {
            this.isSortMode = !this.isSortMode;
            const sidebarMode = this.getSidebarMode();
            if (!this.isSortMode) {
                const items = this.$('#lmm-org-list').querySelectorAll('.lmm-sidebar-item[data-org]');
                const newOrder = [...items].map(i => i.dataset.org).filter(Boolean);
                this.dm.setOrgOrder(sidebarMode, newOrder);
            } else {
                if (this.$('#lmm-tier2-folder')) this.isTier2Expanded = true;
            }
            this.updateSidebar();
        }

        bindDragEvents(item) {
            item.ondragstart = (e) => {
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', item.dataset.org);
                item.classList.add('dragging');
            };
            item.ondragend = () => item.classList.remove('dragging');
            item.ondragover = (e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; };
            item.ondrop = (e) => {
                e.preventDefault();
                const from = e.dataTransfer.getData('text/plain');
                const to = item.dataset.org;
                if (from && to && from !== to) {
                    const sidebarMode = this.getSidebarMode();
                    const order = this.dm.getOrgOrder(sidebarMode);
                    const fromIdx = order.indexOf(from);
                    if (fromIdx !== -1) {
                        order.splice(fromIdx, 1);
                        const toIdx = order.indexOf(to);
                        order.splice(toIdx === -1 ? order.length : toIdx, 0, from);
                        this.dm.setOrgOrder(sidebarMode, order);
                        this.updateSidebar();
                    }
                }
            };
        }

        bindModelDragEvents(card) {
            card.setAttribute('draggable', 'true');
            card.ondragstart = (e) => {
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', card.dataset.name);
                card.classList.add('dragging');
            };
            card.ondragend = () => card.classList.remove('dragging');
            card.ondragover = (e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; };
            card.ondrop = (e) => {
                e.preventDefault();
                const from = e.dataTransfer.getData('text/plain');
                const to = card.dataset.name;
                if (from && to && from !== to) {
                    const grid = this.$('#lmm-grid');
                    const cards = Array.from(grid.children);
                    const fromCard = cards.find(c => c.dataset.name === from);
                    const toCard = cards.find(c => c.dataset.name === to);
                    if (fromCard && toCard) {
                        const fromIdx = cards.indexOf(fromCard);
                        const toIdx = cards.indexOf(toCard);
                        if (fromIdx < toIdx) grid.insertBefore(fromCard, toCard.nextSibling);
                        else grid.insertBefore(fromCard, toCard);
                        const names = Array.from(grid.children).map(el => el.dataset.name).filter(Boolean);
                        this.dm.setModelOrder(this.visibleSubMode, names);
                        this.scanner.applyFilters();
                    }
                }
            };
        }

        updateOrgFilter() {
            const modeModels = this.getModelsInCurrentMode();
            const sidebarMode = this.getSidebarMode();
            const orgOrder = this.dm.getOrgOrder(sidebarMode);
            const orgs = [...new Set(modeModels.map(m => m.company).filter(Boolean))];
            orgs.sort((a, b) => {
                if (a === 'Other') return 1;
                if (b === 'Other') return -1;
                const ai = orgOrder.indexOf(a);
                const bi = orgOrder.indexOf(b);
                return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
            });
            const sel = this.$('#lmm-org');
            const val = sel.value;
            sel.innerHTML = `<option value="all">📂 ${this.t('allOrgs')}</option>` + orgs.map(c => `<option value="${this.esc(c)}">${this.esc(c)}</option>`).join('');
            sel.value = orgs.includes(val) ? val : 'all';
        }

        matchesSearch(model, searchStr) {
            if (!searchStr) return true;
            const s = searchStr.trim();
            if (!s) return true;

            if (s.startsWith('/') && s.lastIndexOf('/') > 0) {
                const lastSlash = s.lastIndexOf('/');
                const pattern = s.substring(1, lastSlash);
                const flags = s.substring(lastSlash + 1);
                try {
                    const regex = new RegExp(pattern, flags || 'i');
                    return regex.test(model.name) || regex.test(model.company || '');
                } catch (e) { /* fallback */ }
            }

            const keywords = s.toLowerCase().split(/\s+/).filter(k => k.length > 0);
            const target = `${model.name} ${model.company || ''}`.toLowerCase();
            return keywords.every(kw => target.includes(kw));
        }

        getFiltered() {
            let models = this.getModelsInCurrentMode();

            if (this.filter.search) {
                models = models.filter(m => this.matchesSearch(m, this.filter.search));
            }
            if (this.filter.org !== 'all') models = models.filter(m => m.company === this.filter.org);
            if (this.filter.imageType !== 'all') models = models.filter(m => m.vision === this.filter.imageType);
            if (this.filter.hasVision === 'yes') models = models.filter(m => m.vision === true);

            const sidebarMode = this.getSidebarMode();
            const orgOrder = this.dm.getOrgOrder(sidebarMode);

            if (this.currentMode === 'visible') {
                const customOrder = this.dm.getModelOrder(this.visibleSubMode);
                if (customOrder.length > 0) {
                    models.sort((a, b) => {
                        let ai = customOrder.indexOf(a.name);
                        let bi = customOrder.indexOf(b.name);
                        if (ai === -1) ai = 9999;
                        if (bi === -1) bi = 9999;
                        if (ai !== bi) return ai - bi;
                        if (sidebarMode === 'image') {
                            const ta = IMAGE_TYPE_ORDER[a.vision] ?? 3;
                            const tb = IMAGE_TYPE_ORDER[b.vision] ?? 3;
                            if (ta !== tb) return ta - tb;
                        }
                        const cai = orgOrder.indexOf(a.company);
                        const cbi = orgOrder.indexOf(b.company);
                        return (cai === -1 ? 999 : cai) - (cbi === -1 ? 999 : cbi);
                    });
                    return models;
                }
                models.sort((a, b) => {
                    if (sidebarMode === 'image') {
                        const ta = IMAGE_TYPE_ORDER[a.vision] ?? 3;
                        const tb = IMAGE_TYPE_ORDER[b.vision] ?? 3;
                        if (ta !== tb) return ta - tb;
                    }
                    const ai = orgOrder.indexOf(a.company);
                    const bi = orgOrder.indexOf(b.company);
                    const c = (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
                    return c !== 0 ? c : a.name.localeCompare(b.name);
                });
                return models;
            }

            models.sort((a, b) => {
                if (this.sort.by === 'starred') {
                    if (a.starred && !b.starred) return -1;
                    if (!a.starred && b.starred) return 1;
                    return a.name.localeCompare(b.name);
                }
                let c = 0;
                if (this.sort.by === 'name') c = a.name.localeCompare(b.name);
                else if (this.sort.by === 'org') {
                    if (sidebarMode === 'image') {
                        const ta = IMAGE_TYPE_ORDER[a.vision] ?? 3;
                        const tb = IMAGE_TYPE_ORDER[b.vision] ?? 3;
                        if (ta !== tb) return ta - tb;
                    }
                    const ai = orgOrder.indexOf(a.company);
                    const bi = orgOrder.indexOf(b.company);
                    c = (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi) || a.name.localeCompare(b.name);
                }
                else if (this.sort.by === 'date') c = (b.addedAt || 0) - (a.addedAt || 0);
                return this.sort.order === 'desc' ? -c : c;
            });
            return models;
        }

        // 多选模式方法
        enterMultiSelectMode() {
            this.isMultiSelectMode = true;
            this.selectedModels.clear();
            this.multiSelectBackup.clear();
            // 备份当前所有模型的可见性
            this.getFiltered().forEach(m => {
                this.multiSelectBackup.set(m.name, this.dm.isVisible(m.name));
            });
            this.refresh();
        }

        exitMultiSelectMode() {
            this.isMultiSelectMode = false;
            this.selectedModels.clear();
            this.multiSelectBackup.clear();
            this.refresh();
        }

        revertMultiSelectChanges() {
            this.multiSelectBackup.forEach((visible, name) => {
                this.dm.setVisibility(name, visible);
            });
            this.scanner.applyFilters();
        }

        multiSelectShow() {
            this.selectedModels.forEach(name => {
                this.dm.setVisibility(name, true);
            });
            this.refresh();
            this.scanner.applyFilters();
        }

        multiSelectHide() {
            this.selectedModels.forEach(name => {
                this.dm.setVisibility(name, false);
            });
            this.refresh();
            this.scanner.applyFilters();
        }

        multiSelectAddToGroup() {
            const groups = this.dm.getGroupNames();
            if (groups.length === 0) {
                this.scanner.toast(this.t('noGroupHint'), 'warning');
                return;
            }
            this.openGroupSelectModal();
        }

        openGroupSelectModal() {
            const list = this.groupSelectModal.querySelector('#lmm-group-select-list');
            const groups = this.dm.getGroupNames();

            list.innerHTML = groups.map(name => `
                <div class="lmm-group-item" data-group="${this.esc(name)}">
                    <span class="name">📁 ${this.esc(name)}</span>
                </div>
            `).join('');

            list.querySelectorAll('.lmm-group-item').forEach(item => {
                item.onclick = () => {
                    const groupName = item.dataset.group;
                    this.selectedModels.forEach(modelName => {
                        this.dm.addToGroup(groupName, modelName);
                    });
                    this.closeGroupSelectModal();
                    this.scanner.toast(this.t('addedToGroup'), 'success');
                    this.updateTopbar();
                    this.refresh();
                };
            });

            this.groupSelectModal.querySelector('[data-i18n="selectGroup"]').textContent = this.t('selectGroup');
            this.groupSelectModal.querySelector('#lmm-group-select-close').textContent = this.t('cancel');
            this.groupSelectModalOverlay.classList.add('open');
            this.groupSelectModal.classList.add('open');
        }

        closeGroupSelectModal() {
            this.groupSelectModalOverlay.classList.remove('open');
            this.groupSelectModal.classList.remove('open');
        }

        multiSelectAll() {
            const models = this.getFiltered();
            models.forEach(m => this.selectedModels.add(m.name));
            this.refresh();
        }

        multiDeselectAll() {
            this.selectedModels.clear();
            this.refresh();
        }

        multiInvert() {
            const models = this.getFiltered();
            models.forEach(m => {
                if (this.selectedModels.has(m.name)) {
                    this.selectedModels.delete(m.name);
                } else {
                    this.selectedModels.add(m.name);
                }
            });
            this.refresh();
        }

        renderBatchButtons() {
            const batch = this.$('#lmm-batch');
            if (this.isMultiSelectMode) {
                batch.innerHTML = `
                    <button class="lmm-btn lmm-btn-sm" id="lmm-multi-show">${this.t('show')}</button>
                    <button class="lmm-btn lmm-btn-sm" id="lmm-multi-hide">${this.t('hide')}</button>
                    <button class="lmm-btn lmm-btn-sm" id="lmm-multi-add-group">${this.t('addToGroup')}</button>
                    <button class="lmm-btn lmm-btn-sm" id="lmm-multi-toggle-all">${this.selectedModels.size > 0 ? this.t('deselectAll') : this.t('selectAll')}</button>
                    <button class="lmm-btn lmm-btn-sm" id="lmm-multi-invert">${this.t('invert')}</button>
                    <button class="lmm-btn lmm-btn-sm" id="lmm-multi-revert">${this.t('revert')}</button>
                    <button class="lmm-btn lmm-btn-sm lmm-btn-primary" id="lmm-multi-exit">${this.t('exitMulti')}</button>
                `;
                batch.querySelector('#lmm-multi-show').onclick = () => this.multiSelectShow();
                batch.querySelector('#lmm-multi-hide').onclick = () => this.multiSelectHide();
                batch.querySelector('#lmm-multi-add-group').onclick = () => this.multiSelectAddToGroup();
                batch.querySelector('#lmm-multi-toggle-all').onclick = () => {
                    if (this.selectedModels.size > 0) this.multiDeselectAll();
                    else this.multiSelectAll();
                };
                batch.querySelector('#lmm-multi-invert').onclick = () => this.multiInvert();
                batch.querySelector('#lmm-multi-revert').onclick = () => {
                    this.revertMultiSelectChanges();
                    this.refresh();
                };
                batch.querySelector('#lmm-multi-exit').onclick = () => this.exitMultiSelectMode();
            } else {
                batch.innerHTML = `
                    <button class="lmm-btn" id="lmm-multi-btn">${this.t('multiSelect')}</button>
                    <button class="lmm-btn lmm-btn-primary" id="lmm-apply">✓ ${this.t('apply')}</button>
                `;
                batch.querySelector('#lmm-multi-btn').onclick = () => this.enterMultiSelectMode();
                batch.querySelector('#lmm-apply').onclick = () => {
                    this.scanner.applyFilters();
                    this.scanner.toast(this.t('applied'), 'success');
                };
            }
        }

        esc(s) {
            if (!s) return '';
            return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
        }

        getModeIcon(modes) {
            if (!Array.isArray(modes) || modes.length === 0) return '❓';
            const icons = { text: '📝', search: '🔍', image: '🎨', code: '💻', video: '🎬' };
            if (this.currentMode !== 'all' && this.currentMode !== 'visible' && !this.currentMode.startsWith('group_') && icons[this.currentMode]) return icons[this.currentMode];
            return icons[modes[0]] || '❓';
        }

        refresh() {
            const grid = this.$('#lmm-grid');
            const models = this.getFiltered();
            const sidebarMode = this.getSidebarMode();

            this.updateGridView();
            this.renderBatchButtons();

            if (models.length === 0) {
                // 根据是否为自建分组决定提示内容
                const isCustomGroup = this.currentMode.startsWith('group_');
                const hint = isCustomGroup ? '' : `<br><br>${this.t('noMatchHint')}`;
                grid.innerHTML = `<div class="lmm-empty" style="grid-column:1/-1"><div class="lmm-empty-icon">📭</div><div>${this.t('noMatch')}${hint}</div></div>`;
            } else {
                grid.innerHTML = models.map(m => {
                    const vis = m.visible !== false;
                    const dragHandle = this.isModelSortMode ? '<span class="lmm-drag-handle">⠿</span>' : '';
                    const modes = Array.isArray(m.modes) ? m.modes : ['text'];

                    const imgTypeLabels = {
                        universal: { icon: '🔄' },
                        t2i: { icon: '✨' },
                        i2i: { icon: '🖼️' }
                    };
                    const imgTypeTag = (sidebarMode === 'image' && typeof m.vision === 'string' && imgTypeLabels[m.vision])
                    ? `<span class="lmm-tag imgtype">${imgTypeLabels[m.vision].icon}</span>` : '';
                    const visionTag = m.vision === true ? `<span class="lmm-tag vision">👓</span>` : '';
                    const modelGroups = this.dm.getModelGroups(m.name);
                    const groupTags = modelGroups.slice(0, 2).map(() => `<span class="lmm-tag group">📁</span>`).join('');

                    const isSelected = this.selectedModels.has(m.name);
                    const showCheck = this.isMultiSelectMode;
                    const cardClasses = [
                        'lmm-card',
                        vis ? 'visible' : 'hidden',
                        m.isNew ? 'new' : '',
                        m.starred ? 'starred' : '',
                        isSelected ? 'selected' : ''
                    ].filter(Boolean).join(' ');

                    return `
                        <div class="${cardClasses}" data-name="${this.esc(m.name)}">
                            ${dragHandle}
                            ${showCheck ? `<div class="lmm-check ${isSelected ? 'on' : ''}">${isSelected ? '✓' : ''}</div>` : ''}
                            <div class="lmm-card-info">
                                <div class="lmm-card-name">
                                    <span>${m.icon || '❔'}</span>
                                    <span class="n" title="${this.esc(m.name)}">${this.esc(m.name)}</span>
                                </div>
                                <div class="lmm-tags">
                                    <span class="lmm-tag org">${this.esc(m.company || 'Other')}</span>
                                    <span class="lmm-tag mode">${this.getModeIcon(modes)}</span>
                                    ${imgTypeTag}
                                    ${visionTag}
                                    ${groupTags}
                                    ${m.isNew ? `<span class="lmm-tag new">${this.t('newFound')}</span>` : ''}
                                </div>
                            </div>
                            ${!this.isMultiSelectMode ? `
                            <div class="lmm-card-actions">
                                <button class="lmm-card-btn lmm-star-btn ${m.starred ? 'starred' : ''}" title="${this.t('starred')}">${m.starred ? '⭐' : '☆'}</button>
                                <button class="lmm-card-btn lmm-edit-btn" title="${this.t('editModel')}">✏️</button>
                            </div>
                            ` : ''}
                        </div>
                    `;
                }).join('');

                grid.querySelectorAll('.lmm-card').forEach(card => {
                    const name = card.dataset.name;

                    if (this.isModelSortMode) {
                        this.bindModelDragEvents(card);
                    } else if (this.isMultiSelectMode) {
                        card.onclick = () => {
                            if (this.selectedModels.has(name)) {
                                this.selectedModels.delete(name);
                            } else {
                                this.selectedModels.add(name);
                            }
                            this.refresh();
                        };
                    } else {
                        card.onclick = (e) => {
                            if (e.target.closest('.lmm-card-actions')) return;
                            const newVis = !this.dm.isVisible(name);
                            this.dm.setVisibility(name, newVis);
                            this.refresh();
                            this.updateStats();
                            this.updateFabBadge();
                        };
                        card.ondblclick = () => this.openEditModal(name);

                        const starBtn = card.querySelector('.lmm-star-btn');
                        if (starBtn) {
                            starBtn.onclick = (e) => {
                                e.stopPropagation();
                                const starred = this.dm.toggleStar(name);
                                this.refresh();
                                this.updateTopbar();
                            };
                        }

                        const editBtn = card.querySelector('.lmm-edit-btn');
                        if (editBtn) {
                            editBtn.onclick = (e) => {
                                e.stopPropagation();
                                this.openEditModal(name);
                            };
                        }
                    }
                });
            }

            this.$('#lmm-count').textContent = `${models.length} ${this.t('models')}`;
            this.updateStats();
            this.updateOrgFilter();
        }

        updateStats() {
            const modeModels = this.getModelsInCurrentMode();
            const v = modeModels.filter(m => m.visible !== false).length;
            this.$('#lmm-v').textContent = v;
            this.$('#lmm-h').textContent = modeModels.length - v;
            this.$('#lmm-t').textContent = modeModels.length;
        }

        openEditModal(name) {
            const m = this.dm.getModel(name);
            if (!m) return;
            this.editingModel = name;

            this.editModal.querySelector('[data-i18n="editModel"]').textContent = this.t('editModel');
            this.editModal.querySelector('[data-i18n="modelName"]').textContent = this.t('modelName');
            this.editModal.querySelector('[data-i18n="org"]').textContent = this.t('org');
            this.editModal.querySelector('[data-i18n="belongGroups"]').textContent = this.t('belongGroups');
            this.editModal.querySelector('[data-i18n="restoreDefault"]').textContent = this.t('restoreDefault');
            this.editModal.querySelector('#lmm-edit-cancel').textContent = this.t('cancel');
            this.editModal.querySelector('#lmm-edit-save').textContent = this.t('save');

            this.editModal.querySelector('#lmm-edit-name').value = name;
            this.editModal.querySelector('#lmm-edit-org').value = m.company === 'Other' ? '' : m.company;
            this.editModal.querySelector('#lmm-edit-org').placeholder = this.t('orgPlaceholder');

            const groupsContainer = this.editModal.querySelector('#lmm-edit-groups');
            const allGroups = this.dm.getGroupNames();
            const modelGroups = this.dm.getModelGroups(name);

            if (allGroups.length > 0) {
                groupsContainer.innerHTML = allGroups.map(g =>
                                                          `<div class="lmm-checkbox-item ${modelGroups.includes(g) ? 'checked' : ''}" data-group="${this.esc(g)}">📁 ${this.esc(g)}</div>`
                ).join('');
                groupsContainer.querySelectorAll('.lmm-checkbox-item').forEach(item => {
                    item.onclick = () => item.classList.toggle('checked');
                });
            } else {
                groupsContainer.innerHTML = `<span style="color:var(--lmm-text2);font-size:11px">${this.t('noGroupHint')}</span>`;
            }

            this.editModalOverlay.classList.add('open');
            this.editModal.classList.add('open');
        }

        closeEditModal() {
            this.editModalOverlay.classList.remove('open');
            this.editModal.classList.remove('open');
            this.editingModel = null;
        }

        saveEdit() {
            if (!this.editingModel) return;
            const company = this.editModal.querySelector('#lmm-edit-org').value.trim();

            const allGroups = this.dm.getGroupNames();
            const selectedGroups = [];
            this.editModal.querySelectorAll('#lmm-edit-groups .lmm-checkbox-item.checked').forEach(item => {
                selectedGroups.push(item.dataset.group);
            });

            allGroups.forEach(g => {
                if (selectedGroups.includes(g)) {
                    this.dm.addToGroup(g, this.editingModel);
                } else {
                    this.dm.removeFromGroup(g, this.editingModel);
                }
            });

            this.dm.updateModel(this.editingModel, { company: company || 'Other', companyManual: true });
            this.closeEditModal();
            this.refresh();
            this.updateSidebar();
            this.updateTopbar();
            this.scanner.toast(this.t('saved'), 'success');
        }

        resetEdit() {
            if (!this.editingModel) return;
            this.dm.reanalyze(this.editingModel);
            this.closeEditModal();
            this.refresh();
            this.updateSidebar();
            this.updateTopbar();
            this.scanner.toast(this.t('restored'), 'success');
        }

        openGroupModal() {
            this.renderGroupList();
            this.groupModal.querySelector('[data-i18n="groupManage"]').textContent = this.t('groupManage');
            this.groupModal.querySelector('#lmm-group-new-name').placeholder = this.t('newGroupName');
            this.groupModal.querySelector('#lmm-group-create').textContent = this.t('create');
            this.groupModal.querySelector('#lmm-group-close').textContent = this.t('close');
            this.groupModalOverlay.classList.add('open');
            this.groupModal.classList.add('open');
        }

        closeGroupModal() {
            this.groupModalOverlay.classList.remove('open');
            this.groupModal.classList.remove('open');
        }

        createGroup() {
            const input = this.groupModal.querySelector('#lmm-group-new-name');
            const name = input.value.trim();
            if (!name) {
                this.scanner.toast(this.t('enterGroupName'), 'warning');
                return;
            }
            if (this.dm.createGroup(name)) {
                input.value = '';
                this.renderGroupList();
                this.updateTopbar();
                this.scanner.toast(this.t('groupCreated'), 'success');
            } else {
                this.scanner.toast(this.t('groupExists'), 'warning');
            }
        }

        renderGroupList() {
            const list = this.groupModal.querySelector('#lmm-group-list');
            const groups = this.dm.getGroups();
            const names = Object.keys(groups);

            if (names.length === 0) {
                list.innerHTML = `<div style="color:var(--lmm-text2);text-align:center;padding:20px">${this.t('noGroups')}</div>`;
                return;
            }

            list.innerHTML = names.map(name => `
                <div class="lmm-group-item" data-group="${this.esc(name)}">
                    <span class="name">📁 ${this.esc(name)}</span>
                    <span style="color:var(--lmm-text2);font-size:10px">${groups[name].length} ${this.t('models')}</span>
                    <div class="actions">
                        <button class="lmm-btn lmm-rename-btn">${this.t('rename')}</button>
                        <button class="lmm-btn lmm-btn-danger lmm-delete-btn">${this.t('delete')}</button>
                    </div>
                </div>
            `).join('');

            list.querySelectorAll('.lmm-group-item').forEach(item => {
                const name = item.dataset.group;
                item.querySelector('.lmm-rename-btn').onclick = () => {
                    const newName = prompt(this.t('inputNewName'), name);
                    if (newName && newName.trim() && newName !== name) {
                        if (this.dm.renameGroup(name, newName.trim())) {
                            this.renderGroupList();
                            this.updateTopbar();
                            this.scanner.toast(this.t('renamed'), 'success');
                        } else {
                            this.scanner.toast(this.t('nameExists'), 'warning');
                        }
                    }
                };
                item.querySelector('.lmm-delete-btn').onclick = () => {
                    if (confirm(this.t('confirmDelete').replace('{0}', name))) {
                        this.dm.deleteGroup(name);
                        this.renderGroupList();
                        this.updateTopbar();
                        this.scanner.toast(this.t('deleted'), 'success');
                    }
                };
            });
        }

        openSettingsModal() {
            const langSelect = this.settingsModal.querySelector('#lmm-setting-lang');
            langSelect.value = this.dm.getLanguage();

            const alertSwitch = this.settingsModal.querySelector('#lmm-setting-alert');
            alertSwitch.classList.toggle('on', this.dm.data.settings.showNewAlert);

            const gist = this.dm.data.settings.gist || {};
            this.settingsModal.querySelector('#lmm-setting-gist-token').value = gist.token || '';
            this.settingsModal.querySelector('#lmm-setting-gist-id').value = gist.gistId || '';

            this.updateSettingsModalI18n();
            this.settingsModalOverlay.classList.add('open');
            this.settingsModal.classList.add('open');
        }

        closeSettingsModal() {
            this.settingsModalOverlay.classList.remove('open');
            this.settingsModal.classList.remove('open');
        }
    }

    // ==================== 初始化 ====================
    function init() {
        console.log(`[LMM] LMArena Manager v${VERSION} 启动`);
        const dm = new DataManager();
        const scanner = new Scanner(dm);
        const ui = new UI(dm, scanner);
        ui.init();
        scanner.startObserving();
        setTimeout(() => scanner.scan(), 2000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();