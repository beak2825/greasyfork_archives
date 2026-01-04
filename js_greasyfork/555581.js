// ==UserScript==
// @name         SQC Auto Hold Process
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  [ALL/HOLD]수주에 대해서 보류하기 창을 띄울 수 있습니다.
// @author       김재형
// @match        https://lims3.macrogen.com/ngs/sample/retrieveQcWorkDetailForm.do*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/555581/SQC%20Auto%20Hold%20Process.user.js
// @updateURL https://update.greasyfork.org/scripts/555581/SQC%20Auto%20Hold%20Process.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ========================================
    // CONFIG
    // ========================================
    const CONFIG = {
        // OPEN_IN_NEW_TAB: true, // 더 이상 필요하지 않음
        FILTER_DELAY: 500,
        SEARCH_DELAY: 1000,
        TAB_DELAY: 500,
        COMPLETE_WAIT_DELAY: 1000,
        BUTTON_COLOR: '#ffc107',
        DEBUG: true
    };

    // ========================================
    // LIB KIT TO TAB MAPPING TABLE
    // ========================================
    const LIB_KIT_TO_TAB_MAPPING = {
        // Small RNA library
        'TruSeq Small RNA library': 'Small RNA library',
        'SMARTer Small RNA library': 'Small RNA library',
        'NEBNext Small RNA library': 'Small RNA library',
        'QIAseq miRNA Library': 'Small RNA library',

        // Total RNA library
        'TruSeq Stranded Total RNA with Ribo-Zero H/M/R': 'Total RNA library',
        'TruSeq Stranded Total RNA with Ribo-Zero H/M/R_Gold': 'Total RNA library',
        'TruSeq Stranded Total RNA with Ribo-Zero H/M/R_Globin': 'Total RNA library',
        'TruSeq Stranded Total RNA with Ribo-Zero Plant': 'Total RNA library',
        'iR-Profile_Short read library': 'Total RNA library',
        'TruSeq Stranded Total RNA (NEB Microbe)': 'Total RNA library',
        'SMARTer Stranded RNA library (Ribo-Zero)': 'Total RNA library',
        'Illumina Stranded Total RNA (Ribo-Zero Plus)': 'Total RNA library',
        'TruSeq Stranded Total RNA (No rRNA Depletion)': 'Total RNA library',
        'Illumina Stranded Total RNA (Ribo-Zero Plus_META)': 'Total RNA library',
        'Watchmaker Stranded Total RNA Polaris Depletion': 'Total RNA library',

        // mRNA library
        'TruSeq stranded mRNA': 'mRNA library',
        'Chromium Single Cell 3p RNA library v2': 'mRNA library',
        'Chromium Single Cell VDJ library v1': 'mRNA library',
        'SureSelect RNA Direct_Human': 'mRNA library',
        'SureSelect RNA Direct_Mouse': 'mRNA library',
        'Chromium Single Cell 3p RNA library v3': 'mRNA library',
        'Chromium Single Cell 5p RNA library v1': 'mRNA library',
        'Truseq Nano DNA (for cDNA)': 'mRNA library',
        'Nextera DNA XT (for cDNA)': 'mRNA library',
        'Chromium Single Cell 3p RNA library v3 FB for ADT': 'mRNA library',
        'Chromium Single Cell 3p RNA library v3 FB for HTO': 'mRNA library',
        'Chromium Single Cell 5p RNA library v1 FB for ADT': 'mRNA library',
        'Chromium Single Cell 5p RNA library v1 FB for HTO': 'mRNA library',
        'Visium Spatial Gene Expression library': 'mRNA library',
        'Chromium Next GEM Single Cell 3p RNA library v3.1': 'mRNA library',
        'Chromium Next GEM Single Cell 5p RNA library v1.1 FB for ADT': 'mRNA library',
        'Chromium Next GEM Single Cell 5p RNA library v1.1 FB for HTO': 'mRNA library',
        'Chromium Next GEM Single Cell 3p RNA library v3.1 FB for ADT': 'mRNA library',
        'Chromium Next GEM Single Cell 3p RNA library v3.1 FB for HTO': 'mRNA library',
        'Chromium Next GEM Single Cell 5p RNA library v1.1': 'mRNA library',
        'Chromium Next GEM Single Cell 5p RNA library v2': 'mRNA library',
        'Chromium Next GEM Single Cell VDJ library v2': 'mRNA library',
        'Chromium Next GEM Single Cell 5p RNA library v2 FB for ADT': 'mRNA library',
        'Chromium Next GEM Single Cell 5p RNA library v2 FB for HTO': 'mRNA library',
        'Chromium Next GEM Single Cell Multiome Gene Expression library v1': 'mRNA library',
        'Chromium Next GEM Single Cell 3p RNA LT Library v3.1': 'mRNA library',
        'Chromium Next GEM Single Cell 3p Cell Multiplexing Library': 'mRNA library',
        'Chromium Next GEM Single Cell 3p RNA HT Library v3.1': 'mRNA library',
        'Chromium Next GEM Single Cell 3p HT Cell Multiplexing Library': 'mRNA library',
        'SMARTer Stranded RNA library (PolyA)': 'mRNA library',
        'Chromium Next GEM Single Cell Fixed RNA library v1 - Human 4BC': 'mRNA library',
        'ETC': 'mRNA library',
        'SMARTer Ultra low input RNA library (PolyA_NexteraXT)': 'mRNA library',
        'Visium Spatial Gene Expression for FFPE library v2 - Human': 'mRNA library',
        'Chromium Next GEM Single Cell 3p RNA LT library v3.1 FB for ADT': 'mRNA library',
        'Chromium Next GEM Single Cell 3p RNA LT library v3.1 FB for HTO': 'mRNA library',
        'Chromium Next GEM Single Cell 3p RNA HT library v3.1 FB for ADT': 'mRNA library',
        'Chromium Next GEM Single Cell 3p RNA HT library v3.1 FB for HTO': 'mRNA library',
        'Chromium Next GEM Single Cell VDJ library v1.1': 'mRNA library',
        'Chromium Next GEM Single Cell Fixed RNA library v1 for ADT': 'mRNA library',
        'Visium Spatial Gene Expression for FFPE library v2 - Mouse': 'mRNA library',
        'BD Rhapsody Whole Transcriptome Analysis library': 'mRNA library',
        'BD Rhapsody Whole Transcriptome Analysis library_Enhanced Beads': 'mRNA library',
        'SureSelect HS2 RNA': 'mRNA library',
        'Chromium Next GEM Single Cell Fixed RNA library v1 - Human 16BC': 'mRNA library',
        'Chromium Next GEM Single Cell Fixed RNA library v1 - Mouse 1BC': 'mRNA library',
        'Chromium Next GEM Single Cell Fixed RNA library v1 - Human 1BC': 'mRNA library',
        'Chromium Next GEM Single Cell Fixed RNA library v1 - Mouse 4BC': 'mRNA library',
        'Visium Spatial Gene Expression for FFPE library v2 - Mouse (11mm)': 'mRNA library',
        'Visium Spatial Gene Expression for FFPE library v2 - Human (11mm)': 'mRNA library',
        'Visium HD Spatial Gene Expression for FFPE library v1 - Human (6.5mm)': 'mRNA library',
        'Visium HD Spatial Gene Expression for FFPE library v1 - Mouse (6.5mm)': 'mRNA library',
        'Chromium GEM-X Single Cell 3p RNA library v4': 'mRNA library',
        'Chromium GEM-X Single Cell 3p RNA library v4 FB for ADT': 'mRNA library',
        'Chromium GEM-X Single Cell 3p RNA library v4 FB for HTO': 'mRNA library',
        'Chromium GEM-X Single Cell 5p RNA library v3': 'mRNA library',
        'Chromium GEM-X Single Cell 5p RNA library v3 FB for ADT': 'mRNA library',
        'Chromium GEM-X Single Cell 5p RNA library v3 FB for HTO': 'mRNA library',
        'Chromium GEM-X Single Cell VDJ library v3': 'mRNA library',
        'Chromium Next GEM Single Cell Fixed RNA library v1 - Mouse 16BC': 'mRNA library',
        'Watchmaker Stranded mRNA': 'mRNA library',
        'Plant mRNA capture (myBaits Angiosperms-353)': 'mRNA library',
        'Chromium GEM-X Single Cell 3p RNA library v4 OCM': 'mRNA library',
        'Chromium GEM-X Single Cell VDJ library v3 for OCM': 'mRNA library',
        'Chromium GEM-X Single Cell Flex RNA library v1 - Human 1BC': 'mRNA library',
        'Chromium GEM-X Single Cell 5p RNA library v3 for OCM': 'mRNA library',
        'Visium HD Spatial 3p Gene Expression library v1 - (6.5mm)': 'mRNA library',
        'TruSeq RNA Access': 'mRNA library',

        // Modified Library
        'GBS library': 'Modified Library',
        'RAD Library': 'Modified Library',
        'Olink Explore HT': 'Modified Library',
        'Olink Reveal': 'Modified Library',

        // Amplicon DNA library
        'Metagenome Amplicon': 'Amplicon DNA library',
        'target amplicon DNA': 'Amplicon DNA library',
        '(Mybiom)Metagenome Amplicon': 'Amplicon DNA library',
        'Metagenome Amplicon (for cDNA)': 'Amplicon DNA library',
        'HiSeq Amplicon library_PET': 'Amplicon DNA library',
        '(OM)Metagenome Amplicon': 'Amplicon DNA library',
        '(VM_16S)Metagenome Amplicon': 'Amplicon DNA library',
        '(VM_HPV)Metagenome Amplicon': 'Amplicon DNA library',
        '(GM)Metagenome Amplicon': 'Amplicon DNA library',

        // Targeted DNA library
        'SureSelect Custom': 'Targeted DNA library',
        'SureSelect Custom(FFPE)': 'Targeted DNA library',
        'SureSelect Custom(cfDNA)': 'Targeted DNA library',
        'SureSelect Custom2 (Tier1 16R)': 'Targeted DNA library',
        'SureSelect Custom2 (Tier1 16R) (cfDNA)': 'Targeted DNA library',
        'SureSelect Custom2 (Tier1 16R) (FFPE)': 'Targeted DNA library',
        'SureSelect Custom3 (Tier1 96R)': 'Targeted DNA library',
        'SureSelect Custom3 (Tier1 96R) (cfDNA)': 'Targeted DNA library',
        'SureSelect Custom3 (Tier1 96R) (FFPE)': 'Targeted DNA library',
        'SureSelect Mouse': 'Targeted DNA library',
        'SureSelect Mouse(FFPE)': 'Targeted DNA library',
        'SureSelect V4-post': 'Targeted DNA library',
        'SureSelect V4-Post(FFPE)': 'Targeted DNA library',
        'SureSelect V4-Post(cfDNA)': 'Targeted DNA library',
        'SureSelect V4+UTR-post': 'Targeted DNA library',
        'SureSelect V4+UTR-post(FFPE)': 'Targeted DNA library',
        'SureSelect V4+UTR-post(cfDNA)': 'Targeted DNA library',
        'SureSelect V5-post': 'Targeted DNA library',
        'SureSelect V5-Post(FFPE)': 'Targeted DNA library',
        'SureSelect V5-Post(cfDNA)': 'Targeted DNA library',
        'SureSelect V5+UTR-post': 'Targeted DNA library',
        'SureSelect V5+UTR-post(FFPE)': 'Targeted DNA library',
        'SureSelect V5+UTR-post(cfDNA)': 'Targeted DNA library',
        'SureSelect V6-Post': 'Targeted DNA library',
        'SureSelect V6-Post(FFPE)': 'Targeted DNA library',
        'SureSelect V6-Post(cfDNA)': 'Targeted DNA library',
        'SureSelect V6+UTR-post': 'Targeted DNA library',
        'SureSelect V6+UTR-post(FFPE)': 'Targeted DNA library',
        'SureSelect V6+UTR-post(cfDNA)': 'Targeted DNA library',
        'SureSelect V6+COSMIC-post(FFPE)': 'Targeted DNA library',
        'SureSelect V6+COSMIC-post': 'Targeted DNA library',
        'SureSelect V6+COSMIC-post(cfDNA)': 'Targeted DNA library',
        'SureSelect V7-Post': 'Targeted DNA library',
        'SureSelect V7-Post(FFPE)': 'Targeted DNA library',
        'SureSelect V7-Post(cfDNA)': 'Targeted DNA library',
        'SureSelect V8-Post': 'Targeted DNA library',
        'SureSelect V8-Post(cfDNA)': 'Targeted DNA library',
        'SureSelect V8-Post(FFPE)': 'Targeted DNA library',
        'SureSelect Human Methyl-seq': 'Targeted DNA library',
        'SureSelect Mouse Methyl-seq': 'Targeted DNA library',
        'SureSelect V6-Post_HS UMI': 'Targeted DNA library',
        'SureSelect V6+UTR-post_HS UMI': 'Targeted DNA library',
        'SureSelect V7-Post_HS UMI': 'Targeted DNA library',
        'SureSelect V8-Post_HS UMI': 'Targeted DNA library',
        'Twist Custom(FFPE)': 'Targeted DNA library',
        'Twist Custom': 'Targeted DNA library',
        'Twist Human Core Exome 2.0(FFPE)': 'Targeted DNA library',
        'Twist Human Core Exome 2.0': 'Targeted DNA library',
        'Twist Human Core Exome(FFPE)': 'Targeted DNA library',
        'Twist Human Core Exome': 'Targeted DNA library',
        'Twist Human Core Exome (+RefSeq)(FFPE)': 'Targeted DNA library',
        'Twist Human Core Exome (+RefSeq)': 'Targeted DNA library',
        'Twist Human Core Exome (+RefSeq +MT)(FFPE)': 'Targeted DNA library',
        'Twist Human Core Exome (+RefSeq +MT)': 'Targeted DNA library',
        'Twist Human Methylome panel': 'Targeted DNA library',
        'myBaits Angiosperm capture (+Twist library)': 'Targeted DNA library',
        'Twist Human Core Exome 2.0 (+MT)': 'Targeted DNA library',
        'MBD enriched library': 'Targeted DNA library',
        'NEBNext Ultra II FS DNA Capture (Alliance)': 'Targeted DNA library',

        // Whole Genome library
        'TruSeq Nano DNA (350)': 'Whole Genome library',
        'TruSeq Nano DNA (550)': 'Whole Genome library',
        'TruSeq Nano DNA (LMW)': 'Whole Genome library',
        'TruSeq DNA PCR Free (350)': 'Whole Genome library',
        'TruSeq DNA PCR Free (550)': 'Whole Genome library',
        'Nextera DNA XT': 'Whole Genome library',
        'Accel Methyl-Seq DNA library': 'Whole Genome library',
        'TruSeq ChIP-seq library': 'Whole Genome library',
        'Chromium Genome library v2': 'Whole Genome library',
        'mt DNA': 'Whole Genome library',
        'bulk ATAC library': 'Whole Genome library',
        'Accel-NGS 1S PCR-plus': 'Whole Genome library',
        'Accel-NGS 1S PCR-free': 'Whole Genome library',
        'Arima-HiC': 'Whole Genome library',
        'TruSeq Nano DNA (250)': 'Whole Genome library',
        'TruSeq Nano DNA (450)': 'Whole Genome library',
        'PCR free LMW': 'Whole Genome library',
        'Chromium Next GEM Single Cell Multiome ATAC library v1': 'Whole Genome library',
        'Chromium Next GEM Single Cell ATAC library v1.1': 'Whole Genome library',
        'MGIEasy PCR-Free': 'Whole Genome library',
        'TruSeq Nano DNA (350_META)': 'Whole Genome library',
        'TruSeq DNA PCR Free (350_META)': 'Whole Genome library',
        'Accel-NGS 2S PCR-Free kit (350bp insert)': 'Whole Genome library',
        'Accel-NGS 2S PCR-Free kit (550bp insert)': 'Whole Genome library',
        'Accel-NGS 2S Plus': 'Whole Genome library',
        'Advanta Sample ID Genotyping': 'Whole Genome library',
        'TruSeq Nano DNA (550_META)': 'Whole Genome library',
        'Nextera DNA XT (META)': 'Whole Genome library',
        'Illumina DNA Library': 'Whole Genome library',
        'Illumina DNA PCR-Free': 'Whole Genome library',
        'NEB Enzymatic Methyl-seq library': 'Whole Genome library',
        'xGen cfDNA FFPE DNA library (for cfDNA)': 'Whole Genome library',
        'xGen cfDNA FFPE DNA library (for FFPE)': 'Whole Genome library',
        'Ultima TruSeq PCR free library': 'Whole Genome library',
        '(PGS)Illumina DNA Library': 'Whole Genome library',
        'Ultima TruSeq PCR plus library': 'Whole Genome library',
        'Chromium Next GEM Single Cell ATAC library v2': 'Whole Genome library',
        '192.24 GT SNP Genotyping (X9)': 'Whole Genome library',
        'ppmSeq library (cfDNA)': 'Whole Genome library',
        'ppmSeq library (gDNA)': 'Whole Genome library',
        'NEBNext Ultra II FS DNA Library': 'Whole Genome library',

        // Long Read Library
        '[3.0] PacBio Microbial Library': 'Long Read Library',
        '[3.0] PacBio HiFi Library': 'Long Read Library',
        '[3.0] PacBio Amplicon Library': 'Long Read Library',
        '[3.0] PacBio 16s full-length Library': 'Long Read Library',
        '[3.0] PacBio Iso-Seq Library': 'Long Read Library',
        '[3.0] PacBio MetaShotgun Library': 'Long Read Library',
        '[3.0] PacBio Kinnex 16S rRNA amplicons Library': 'Long Read Library',
        '[3.0] PacBio Kinnex full-length RNA Library': 'Long Read Library',
        '[3.0] PacBio Kinnex single-cell RNA Library': 'Long Read Library',
        'ONT RNA Library-cDNA': 'Long Read Library',
        '[3.0] PacBio HLA Library': 'Long Read Library',
        'ONT-LSK-114': 'Long Read Library',
        'ONT Pore-C Library (except plant)': 'Long Read Library',
        'ONT Pore-C Library (only plant)': 'Long Read Library',
        'ONT RNA Library-Direct': 'Long Read Library',
        'Plasmid library construction': 'Long Read Library',
        'ONT Microbial WGS Library': 'Long Read Library'
    };

    // ========================================
    // UTILITY FUNCTIONS
    // ========================================

    function log(message, data = null) {
        if (CONFIG.DEBUG) {
            const timestamp = new Date().toLocaleTimeString();
            console.log(`[${timestamp}] [SQC Auto Hold] ${message}`, data || '');
        }
    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function waitForElement(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            const checkElement = () => {
                const element = document.querySelector(selector);
                if (element) {
                    resolve(element);
                } else if (Date.now() - startTime > timeout) {
                    reject(new Error(`Timeout waiting for element: ${selector}`));
                } else {
                    setTimeout(checkElement, 100);
                }
            };
            checkElement();
        });
    }

    function getLibraryTab(libKit) {
        return LIB_KIT_TO_TAB_MAPPING[libKit] || null;
    }

    // ========================================
    // MODULE 1: SQC Detail Page Handler
    // ========================================

    async function initSqcDetailPage() {
        log('=== SQC Detail Page Init ===');
        injectModalStyles(); // 모달 CSS 주입
        await delay(500);
        checkAndInjectButton();
        watchCompleteButton();
        watchCompleteDateField();
        interceptCompleteButton();
        log('SQC Detail Page Init Complete');
    }

    function checkAndInjectButton() {
        try {
            const workCmplDttm = document.getElementById('workCmplDttm_value');
            const hasCompleteDate = workCmplDttm && workCmplDttm.value !== '';

            const completeButton = document.getElementById('btnWorkComplete');
            const isCompleteButtonHidden = completeButton && completeButton.style.display === 'none';

            const holdDiv = document.getElementById('holdDivNm_t');
            const isAllHold = holdDiv && holdDiv.textContent.trim() === 'ALL/HOLD';

            const existingButton = document.getElementById('btnAllHoldProcess');

            log('Check conditions:', {
                hasCompleteDate: hasCompleteDate ? workCmplDttm.value : false,
                isCompleteButtonHidden,
                isAllHold,
                alreadyExists: !!existingButton
            });

            if (hasCompleteDate && isCompleteButtonHidden && isAllHold && !existingButton) {
                log('All conditions met - Inject button');
                injectHoldButton();
            }
        } catch (error) {
            log('Error checking conditions:', error);
        }
    }

    function watchCompleteButton() {
        const completeButton = document.getElementById('btnWorkComplete');
        if (!completeButton) {
            log('Complete button not found');
            return;
        }

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    if (completeButton.style.display === 'none') {
                        log('Complete button hidden detected (MutationObserver)');
                        setTimeout(() => checkAndInjectButton(), 300);
                    }
                }
            });
        });

        observer.observe(completeButton, {
            attributes: true,
            attributeFilter: ['style']
        });

        log('Complete button MutationObserver activated');
    }

    function watchCompleteDateField() {
        const dateField = document.getElementById('workCmplDttm_value');
        if (!dateField) {
            log('Complete date field not found');
            return;
        }

        const observer = new MutationObserver(() => {
            if (dateField.value !== '') {
                log('Complete date input detected (MutationObserver):', dateField.value);
                setTimeout(() => checkAndInjectButton(), 500);
            }
        });

        observer.observe(dateField, {
            attributes: true,
            attributeFilter: ['value']
        });

        dateField.addEventListener('input', () => {
            if (dateField.value !== '') {
                log('Complete date input event:', dateField.value);
                setTimeout(() => checkAndInjectButton(), 500);
            }
        });

        log('Complete date field watch activated');
    }

    function interceptCompleteButton() {
        const completeButton = document.getElementById('btnWorkComplete');
        if (!completeButton) {
            log('Complete button not found');
            return;
        }

        completeButton.addEventListener('click', () => {
            log('Complete button click detected');
            setTimeout(() => checkAndInjectButton(), CONFIG.COMPLETE_WAIT_DELAY);
        });

        log('Complete button click listener added');
    }

    function injectHoldButton() {
        try {
            const completeButton = document.getElementById('btnWorkComplete');
            if (!completeButton) {
                log('Complete button not found');
                return;
            }

            if (document.getElementById('btnAllHoldProcess')) {
                log('Hold button already exists');
                return;
            }

            const holdButton = document.createElement('button');
            holdButton.type = 'button';
            holdButton.id = 'btnAllHoldProcess';
            holdButton.className = 'btn btn-sub size-auto bg-active';
            holdButton.textContent = '[ALL/HOLD]보류하기';
            holdButton.style.cssText = `
                background-color: ${CONFIG.BUTTON_COLOR};
                color: #000;
                border: 1px solid #ffa000;
                margin-left: 5px;
                cursor: pointer;
                font-weight: 500;
                transition: background-color 0.2s;
            `;

            holdButton.addEventListener('mouseenter', () => {
                holdButton.style.backgroundColor = '#ffb300';
            });
            holdButton.addEventListener('mouseleave', () => {
                holdButton.style.backgroundColor = CONFIG.BUTTON_COLOR;
            });

            holdButton.addEventListener('click', handleHoldButtonClick); // 비동기 함수로 변경됨

            completeButton.parentNode.insertBefore(holdButton, completeButton.nextSibling);

            log('[ALL/HOLD]Hold button injected');
        } catch (error) {
            log('Error injecting button:', error);
        }
    }

    async function handleHoldButtonClick() {
        log('=== [ALL/HOLD]Hold button clicked ===');

        try {
            const ordNoElement = document.getElementById('ordNo_t');
            if (!ordNoElement) {
                alert('Order number not found.');
                log('ordNo_t element not found');
                return;
            }
            const orderNo = ordNoElement.textContent.trim();
            log('Order No:', orderNo);

            let libKit = null;
            if (typeof window.sheets !== 'undefined' && window.sheets.length > 0) {
                const sheet = window.sheets[0];
                libKit = sheet.GetCellValue(1, 'LIB KIT');
                log('LIB KIT (IBSheet):', libKit);
            }

            if (!libKit) {
                const libKitCells = document.querySelectorAll('td');
                for (const cell of libKitCells) {
                    const text = cell.textContent.trim();
                    if (LIB_KIT_TO_TAB_MAPPING[text]) {
                        libKit = text;
                        log('LIB KIT (DOM):', libKit);
                        break;
                    }
                }
            }

            if (!libKit) {
                alert('LIB KIT information not found.');
                log('LIB KIT not found');
                return;
            }

            // GM_setValue 및 window.open 대신 모달 생성 함수 호출
            await createAndShowLibraryModal(orderNo, libKit);

        } catch (error) {
            console.error('[SQC Auto Hold Error]', error);
            alert('Error during hold process: ' + error.message);
        }
    }

    // ========================================
    // MODULE 2: Library Wait Page (MODAL)
    // ========================================

    /**
     * 모달 및 iframe 자동화 로직을 실행합니다.
     * @param {string} orderNo - 주문 번호
     * @param {string} libKit - 라이브러리 킷 이름
     */
    async function createAndShowLibraryModal(orderNo, libKit) {
        log('Creating modal for Order:', orderNo);

        // 0. 기존 모달이 있으면 제거
        const oldModal = document.getElementById('sqc-auto-modal-overlay');
        if (oldModal) {
            oldModal.remove();
        }

        // 1. 모달 DOM 요소 생성
        const overlay = document.createElement('div');
        overlay.id = 'sqc-auto-modal-overlay';
        overlay.className = 'sqc-auto-modal-overlay';

        const modal = document.createElement('div');
        modal.className = 'sqc-auto-modal-content';

        const header = document.createElement('div');
        header.className = 'sqc-auto-modal-header';
        header.innerHTML = `<span>Library Wait Automation (Ord: ${orderNo})</span>`;

        const closeButton = document.createElement('button');
        closeButton.className = 'sqc-auto-modal-close';
        closeButton.innerHTML = '&times;';
        closeButton.onclick = () => {
            overlay.remove();
            log('Modal closed by user.');
        };
        header.appendChild(closeButton);

        const body = document.createElement('div');
        body.className = 'sqc-auto-modal-body';

        const spinner = document.createElement('div');
        spinner.className = 'sqc-auto-modal-spinner';
        body.appendChild(spinner); // 스피너 우선 추가

        const iframe = document.createElement('iframe');
        iframe.id = 'sqc-library-iframe';
        iframe.style.visibility = 'hidden'; // 로드 및 자동화 완료까지 숨김
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';

        body.appendChild(iframe);
        modal.appendChild(header);
        modal.appendChild(body);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // 2. Iframe 로드 및 자동화
        const libraryUrl = 'https://lims3.macrogen.com/ngs/library/retrieveWaitForm.do?menuCd=NGS120100';
        iframe.src = libraryUrl;

        iframe.onload = async () => {
            log('Modal iframe loaded.');
            try {
                const iframeWin = iframe.contentWindow;
                const iframeDoc = iframeWin.document;

                if (!iframeWin || !iframeDoc) {
                    throw new Error('Cannot access iframe content. (Cross-origin issue?)');
                }

                log('Starting automation inside modal...');

                // 1. 탭 선택
                const targetTab = getLibraryTab(libKit);
                if (!targetTab) {
                    throw new Error(`Tab not found for LIB KIT "${libKit}"`);
                }
                log('Step 1: Select tab:', targetTab);

                // 'iframe'의 document를 context로 전달
                const tabIndex = await selectLibTab(targetTab, iframeDoc);
                if (tabIndex === -1) {
                    throw new Error(`Tab "${targetTab}" was found but its index could not be determined.`);
                }
                log(`Tab "${targetTab}" found at index: ${tabIndex}`);

                await delay(CONFIG.TAB_DELAY); // 탭 변경 대기

                // 2. 검색 폼 요소 찾기 (iframe 내부)
                log('Step 2: Accessing search form elements in modal');
                const searchTypeSelect = iframeDoc.getElementById('searchBasiSrchCd1');
                const searchInput = iframeDoc.getElementById('searchKeyword1');

                if (!searchTypeSelect) {
                    throw new Error('Modal Search Type dropdown (searchBasiSrchCd1) not found.');
                }
                if (!searchInput) {
                    throw new Error('Modal Search Input (searchKeyword1) not found.');
                }

                // 3. 검색 폼 값 설정
                searchTypeSelect.value = '04'; // Ord. #
                searchInput.value = orderNo;
                log(`Setting modal search form: Type='Ord. #' (04), Keyword='${orderNo}'`);

                // 4. 검색 버튼 클릭 (iframe 내부)
                log('Step 3: Click search button in modal');
                // 'iframe'의 document를 context로 전달
                await clickSearchButton(iframeDoc);

                // 검색 결과 로딩 대기
                await delay(CONFIG.SEARCH_DELAY);

                log('Modal automation complete.');

            } catch (err) {
                log('Error during modal automation:', err);
                alert(`Error during modal automation:\n${err.message}`);
            } finally {
                // 5. 스피너 숨기고 iframe 표시
                spinner.style.display = 'none';
                iframe.style.visibility = 'visible';
            }
        };
    }


    /**
     * 탭 이름으로 탭을 찾아 클릭하고, 해당 탭의 인덱스를 반환합니다.
     * @param {string} tabName - 클릭할 탭의 텍스트 이름
     * @param {Document} context - 검색을 수행할 document (기본값: window.document)
     * @returns {Promise<number>} - 탭의 인덱스 (0부터 시작). 찾지 못하면 -1.
     */
    async function selectLibTab(tabName, context = document) {
        log(`Select tab: "${tabName}"`);

        // 1. 페이지 전체에서 탭 이름과 정확히 일치하는 텍스트를 가진 요소를 찾습니다.
        const allPossibleTabs = Array.from(context.querySelectorAll('a, li'));
        let targetTabElement = null;

        for (const el of allPossibleTabs) {
            if (el.textContent.trim() === tabName) {
                targetTabElement = el;
                log(`Found tab element by text: "${tabName}"`, el);
                break;
            }
        }

        if (!targetTabElement) {
            throw new Error(`Tab "${tabName}" not found by text content.`);
        }

        // 2. <li> 부모 찾기
        const targetLi = targetTabElement.tagName === 'LI' ? targetTabElement : targetTabElement.closest('li');
        if (!targetLi) {
            throw new Error(`Found tab text, but element is not inside an <li>: ${targetTabElement.tagName}`);
        }

        // 3. <ul> 컨테이너 찾기
        const tabContainer = targetLi.closest('ul');
        if (!tabContainer) {
            throw new Error(`Found tab <li>, but could not find its parent <ul> container.`);
        }

        // 4. 탭 목록에서 인덱스 찾기
        const tabList = Array.from(tabContainer.querySelectorAll('li'));
        if (tabList.length === 0) {
            throw new Error('Found tab container <ul>, but it contains no <li> elements.');
        }

        const tabIndex = tabList.indexOf(targetLi);
        if (tabIndex === -1) {
            throw new Error(`Found tab <li> and container <ul>, but could not determine tab index.`);
        }

        log(`Tab index determined: ${tabIndex}`);

        // 6. 탭 클릭
        const link = targetLi.querySelector('a') || targetLi;
        link.click();
        log(`Tab clicked: "${tabName}"`);

        // 7. 인덱스 반환
        return tabIndex;
    }


    /**
     * 검색 버튼을 클릭합니다.
     * @param {Document} context - 검색을 수행할 document (기본값: window.document)
     */
    async function clickSearchButton(context = document) {
        // ID 셀렉터 (최우선)
        const searchButtonById = context.getElementById('btnSearch');
        if (searchButtonById) {
            log('Search button found by ID (btnSearch)');
            searchButtonById.click();
            log('Search button clicked');
            return;
        }

        // Fallback 셀렉터
        log('Search button ID "btnSearch" not found, trying fallback selectors...');
        const selectors = [
            'button.btn_search',
            'button.search',
            '#btnSearch', // (혹시 모르니 유지)
            'button[onclick*="search"]',
            'button[onclick*="Search"]',
            '.btn-primary'
        ];

        let searchButton = null;
        for (const selector of selectors) {
            searchButton = context.querySelector(selector);
            if (searchButton) {
                log(`Search button found (selector: ${selector})`);
                break;
            }
        }

        // 텍스트 기반 Fallback
        if (!searchButton) {
            const buttons = Array.from(context.querySelectorAll('button'));
            searchButton = buttons.find(btn => {
                const text = btn.textContent.trim();
                return text === 'Search' || text.includes('Search');
            });
            if (searchButton) {
                log('Search button found (text search)');
            }
        }

        if (!searchButton) {
            throw new Error('Search button not found');
        }

        searchButton.click();
        log('Search button clicked (fallback)');
    }


    /**
     * 모달에 필요한 CSS 스타일을 <head>에 주입합니다.
     */
    function injectModalStyles() {
        if (document.getElementById('sqc-auto-modal-styles')) {
            return; // 이미 주입됨
        }

        const style = document.createElement('style');
        style.id = 'sqc-auto-modal-styles';
        style.innerHTML = `
            .sqc-auto-modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background-color: rgba(0, 0, 0, 0.6);
                z-index: 9998;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .sqc-auto-modal-content {
                width: 90%;
                height: 90%;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }
            .sqc-auto-modal-header {
                padding: 10px 15px;
                background-color: #f1f1f1;
                border-bottom: 1px solid #ddd;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 16px;
                font-weight: bold;
                color: #333;
            }
            .sqc-auto-modal-close {
                font-size: 24px;
                font-weight: bold;
                color: #888;
                background: none;
                border: none;
                cursor: pointer;
                padding: 0 5px;
                line-height: 1;
            }
            .sqc-auto-modal-close:hover {
                color: #000;
            }
            .sqc-auto-modal-body {
                flex-grow: 1;
                position: relative;
                overflow: hidden;
            }
            .sqc-auto-modal-spinner {
                position: absolute;
                top: 50%;
                left: 50%;
                width: 50px;
                height: 50px;
                border: 5px solid #f3f3f3;
                border-top: 5px solid #3498db;
                border-radius: 50%;
                animation: sqc-spin 1s linear infinite;
                transform: translate(-50%, -50%);
                z-index: 10;
            }
            @keyframes sqc-spin {
                0% { transform: translate(-50%, -50%) rotate(0deg); }
                100% { transform: translate(-50%, -50%) rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        log('Modal CSS styles injected.');
    }

    // ========================================
    // MAIN
    // ========================================

    function init() {
        const currentUrl = window.location.href;

        if (currentUrl.includes('retrieveQcWorkDetailForm.do')) {
            log('=== Page detected: SQC Detail ===');
            initSqcDetailPage();
        }
        // 'Library Wait' 페이지에서 실행되는 로직은 제거됨
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    log('=== SQC Auto Hold Script Loaded (v1.0.5 - Modal Fix) ===');

})();