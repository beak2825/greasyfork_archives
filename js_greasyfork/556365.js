// ==UserScript==
// @name         FRIDA SV IPB - But BETTER UX
// @namespace    Violentmonkey Scripts
// @version      67.6.9
// @description  Current UX sucks, use this script instead
// @author       opqdul
// @license MIT
// @match        https://fridasv.com/mahasiswa/jadwal-kolokium*
// @match        https://fridasv.com/mahasiswa/jadwal-seminar*
// @match        https://fridasv.com/mahasiswa/kartu-kolokium*
// @match        https://fridasv.com/mahasiswa/kartu-seminar*
// @icon         https://fridasv.com/images/logo-form2.jpg
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @connect      fridasv.com
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/556365/FRIDA%20SV%20IPB%20-%20But%20BETTER%20UX.user.js
// @updateURL https://update.greasyfork.org/scripts/556365/FRIDA%20SV%20IPB%20-%20But%20BETTER%20UX.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Detect current page
    const currentURL = window.location.href;
    const isJadwalKolokium = currentURL.includes('jadwal-kolokium') && !currentURL.includes('kartu-kolokium');
    const isJadwalSeminar = currentURL.includes('jadwal-seminar') && !currentURL.includes('kartu-seminar');
    const isKartuKolokium = currentURL.includes('kartu-kolokium');
    const isKartuSeminar = currentURL.includes('kartu-seminar');

    if (!isJadwalKolokium && !isJadwalSeminar && !isKartuKolokium && !isKartuSeminar) {
        console.log('[FRIDA Enhancer] Not a target page, exiting...');
        return;
    }

    // Global state
    const CHUNK_SIZE = 200;
    const PRELOAD_THRESHOLD = 50;
    let allDataCache = [];
    let totalRecords = 0;
    let dataTableInstance = null;
    let isLoadingMore = false;
    let currentEndpoint = '';
    let currentCsrfToken = '';

    // Inject CSS
    injectCustomCSS();

    // Route to appropriate handler
    if (isKartuKolokium || isKartuSeminar) {
        const kartuType = isKartuKolokium ? 'Kolokium' : 'Seminar';
        handleKartu(kartuType);
    } else {
        const pageType = isJadwalKolokium ? 'Kolokium' : 'Seminar';
        const endpoint = isJadwalKolokium ? 'jadwal-kolokium' : 'jadwal-seminar';
        handleJadwal(pageType, endpoint);
    }

    // ============================================
    // KARTU HANDLER
    // ============================================
    function handleKartu(type) {
        console.log(`[FRIDA Enhancer] Kartu ${type} page detected`);

        const waitForReady = setInterval(() => {
            if (typeof jQuery !== 'undefined' && typeof jQuery.fn.DataTable !== 'undefined') {
                clearInterval(waitForReady);
                setTimeout(() => enhanceKartu(type), 1000);
            }
        }, 100);
    }

    function enhanceKartu(type) {
        const $table = jQuery('#datatable1');

        if ($table.length === 0) {
            console.error('[FRIDA Enhancer] Kartu table not found!');
            return;
        }

        console.log(`[FRIDA Enhancer] Enhancing Kartu ${type}...`);

        if (jQuery.fn.DataTable.isDataTable('#datatable1')) {
            $table.DataTable().destroy();
        }

        dataTableInstance = $table.DataTable({
            "responsive": true,
            "lengthChange": true,
            "aLengthMenu": [
                [10, 25, 50, 75, -1],
                [10, 25, 50, 75, "All"]
            ],
            "pageLength": 10,
            "autoWidth": false,
            "pagingType": "full_numbers",
            "language": {
                "paginate": {
                    "next": "&raquo;",
                    "previous": "&laquo;",
                    "first": "First",
                    "last": "Last"
                }
            },
            "order": [[0, 'desc']],
            "columnDefs": [
                {
                    "targets": 0,
                    "type": "date",
                    "render": function(data, type, row) {
                        if (type === 'sort' || type === 'type') {
                            return convertToSortableDate(data);
                        }
                        return data;
                    }
                },
                {
                    "targets": 1,
                    "width": "60px",
                    "className": "time-column"
                }
            ],
            "drawCallback": function() {
                setupCancelConfirmation(type);
            }
        });

        console.log(`[FRIDA Enhancer] ✓ Kartu ${type} enhanced successfully!`);
    }

    function convertToSortableDate(dateStr) {
        const months = {
            'Januari': '01', 'Februari': '02', 'Maret': '03', 'April': '04',
            'Mei': '05', 'Juni': '06', 'Juli': '07', 'Agustus': '08',
            'September': '09', 'Oktober': '10', 'November': '11', 'Desember': '12'
        };

        const match = dateStr.match(/(\d+)\s+(\w+)\s+(\d{4})/);
        if (match) {
            const day = match[1].padStart(2, '0');
            const month = months[match[2]] || '01';
            const year = match[3];
            return `${year}-${month}-${day}`;
        }
        return dateStr;
    }

    function setupCancelConfirmation(type) {
        const eventType = type.toLowerCase();

        jQuery('form[action*="/cancel/"] button[type="submit"]').off('click').on('click', function(e) {
            e.preventDefault();
            const $form = jQuery(this).closest('form');

            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    title: 'Konfirmasi',
                    text: `Yakin ingin membatalkan ${eventType} ini?`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#d33',
                    cancelButtonColor: '#6c757d',
                    confirmButtonText: 'Ya, Batalkan',
                    cancelButtonText: 'Tidak',
                    reverseButtons: true
                }).then((result) => {
                    if (result.isConfirmed) {
                        $form.submit();
                    }
                });
            } else {
                if (confirm(`Yakin ingin membatalkan ${eventType} ini?`)) {
                    $form.submit();
                }
            }
        });
    }

    // ============================================
    // JADWAL HANDLER WITH PROGRESSIVE LOADING
    // ============================================
    function handleJadwal(pageType, endpoint) {
        console.log(`[FRIDA Enhancer] ${pageType} page detected`);

        const waitForReady = setInterval(() => {
            if (typeof jQuery !== 'undefined' && typeof jQuery.fn.DataTable !== 'undefined') {
                clearInterval(waitForReady);

                setTimeout(() => {
                    startProgressiveLoading(pageType, endpoint);
                }, 1000);
            }
        }, 100);
    }

    async function startProgressiveLoading(pageType, endpoint) {
        const csrfToken = jQuery('input[name="_token"]').first().val();

        currentEndpoint = endpoint;
        currentCsrfToken = csrfToken;

        try {
            showLoadingOverlay();

            console.log(`[FRIDA Enhancer] Getting total records count...`);

            const initialResponse = await jQuery.ajax({
                url: `https://fridasv.com/mahasiswa/${endpoint}/server-side`,
                type: 'POST',
                headers: { 'X-CSRF-TOKEN': csrfToken },
                data: buildDataTablesParams(0, 1)
            });

            totalRecords = initialResponse.recordsTotal || 0;
            console.log(`[FRIDA Enhancer] Total records: ${totalRecords}`);

            await loadChunk(0, endpoint, csrfToken);

            initializeTableWithData(pageType, endpoint, csrfToken);

            setTimeout(() => {
                injectFilterUI();
                setupFilterHandlers();
            }, 1000);

            setupPaginationListener();

            hideLoadingOverlay();

        } catch (error) {
            console.error('[FRIDA Enhancer] Failed to load data:', error);
            hideLoadingOverlay();
            alert('Gagal memuat data. Silakan refresh halaman.');
        }
    }

    async function loadChunk(startIndex, endpoint, csrfToken) {
        const chunkNum = Math.floor(startIndex / CHUNK_SIZE) + 1;
        const totalChunks = Math.ceil(totalRecords / CHUNK_SIZE);

        updateLoadingProgress(`Memuat data... (${chunkNum}/${totalChunks})`, (chunkNum / totalChunks) * 100);

        console.log(`[FRIDA Enhancer] Loading chunk ${chunkNum}/${totalChunks} (${startIndex} - ${startIndex + CHUNK_SIZE})`);

        const response = await jQuery.ajax({
            url: `https://fridasv.com/mahasiswa/${endpoint}/server-side`,
            type: 'POST',
            headers: { 'X-CSRF-TOKEN': csrfToken },
            data: buildDataTablesParams(startIndex, CHUNK_SIZE)
        });

        const newData = response.data || [];
        allDataCache = allDataCache.concat(newData);

        console.log(`[FRIDA Enhancer] ✓ Loaded ${newData.length} records. Total in cache: ${allDataCache.length}`);

        return newData;
    }

    function buildDataTablesParams(start, length) {
        return {
            draw: 1,
            start: start,
            length: length,
            search: { value: '', regex: false },
            order: [{ column: 0, dir: 'asc' }],
            columns: [
                { data: 'no', searchable: true, orderable: true },
                { data: 'kehadiran', searchable: true, orderable: false },
                { data: 'tanggal', searchable: true, orderable: true },
                { data: 'waktu', searchable: true, orderable: true },
                { data: 'ruangan', searchable: true, orderable: true },
                { data: 'nama_pemrasaran', searchable: true, orderable: true },
                { data: 'nim_pemrasaran', searchable: true, orderable: true },
                { data: 'prodi', searchable: true, orderable: true },
                { data: 'judul', searchable: true, orderable: true },
                { data: 'jumlah_forum', searchable: true, orderable: false },
                { data: 'dosen_pembimbing', searchable: true, orderable: true },
                { data: 'moderator', searchable: true, orderable: true }
            ]
        };
    }

    function setupPaginationListener() {
        jQuery('#datatable1').on('page.dt', async function() {
            await checkAndLoadMore();
        });

        jQuery('#datatable1').on('length.dt', async function() {
            await checkAndLoadMore();
        });
    }

    async function checkAndLoadMore() {
        if (isLoadingMore || !dataTableInstance) return;
        if (allDataCache.length >= totalRecords) return;

        const info = dataTableInstance.page.info();
        const currentPage = info.page;
        const pageSize = info.length;

        const neededEnd = (currentPage + 1) * pageSize;
        const bufferEnd = neededEnd + PRELOAD_THRESHOLD;

        if (bufferEnd > allDataCache.length && allDataCache.length < totalRecords) {
            isLoadingMore = true;

            console.log(`[FRIDA Enhancer] Preloading next chunk... (current: ${allDataCache.length}, needed: ${bufferEnd})`);

            showMiniLoading();

            try {
                await loadChunk(allDataCache.length, currentEndpoint, currentCsrfToken);

                dataTableInstance.clear();
                dataTableInstance.rows.add(allDataCache);
                dataTableInstance.draw(false);

                populateProdiDropdown();
                updateDataTableInfo();

            } catch (error) {
                console.error('[FRIDA Enhancer] Failed to load more data:', error);
            } finally {
                hideMiniLoading();
                isLoadingMore = false;
            }
        }
    }

    function initializeTableWithData(pageType, endpoint, csrfToken) {
        const $table = jQuery('#datatable1');

        if ($table.length === 0) {
            console.error('[FRIDA Enhancer] Table not found!');
            return;
        }

        console.log(`[FRIDA Enhancer] Initializing ${pageType} table with ${allDataCache.length} records...`);

        if (jQuery.fn.DataTable.isDataTable('#datatable1')) {
            $table.DataTable().destroy();
        }

        dataTableInstance = $table.DataTable({
            "data": allDataCache,
            "responsive": true,
            "lengthChange": true,
            "aLengthMenu": [
                [10, 25, 50, 75, -1],
                [10, 25, 50, 75, "All"]
            ],
            "pageLength": 10,
            "autoWidth": false,
            "pagingType": "full_numbers",
            "scrollX": false,
            "language": {
                "paginate": {
                    "next": "&raquo;",
                    "previous": "&laquo;",
                    "first": "First",
                    "last": "Last"
                },
                "info": "Showing _START_ to _END_ of _TOTAL_ entries", // Will be customized
                "infoFiltered": "(filtered from _MAX_ entries)"
            },
            "columns": [
                { "data": "no" },
                { "data": "kehadiran" },
                { "data": "tanggal" },
                { "data": "waktu" },
                { "data": "ruangan" },
                { "data": "nama_pemrasaran" },
                { "data": "nim_pemrasaran" },
                { "data": "prodi" },
                { "data": "judul" },
                { "data": "jumlah_forum" },
                { "data": "dosen_pembimbing" },
                { "data": "moderator" }
            ],
            "columnDefs": [
                {
                    "targets": 1,
                    "orderable": false,
                    "render": function(data, type, row) {
                        const tgl = row.tanggal + ' ' + row.waktu;
                        const date = new Date(tgl);
                        const now = new Date();
                        const past = date < now;
                        const eventType = pageType.toLowerCase();

                        if (past) {
                            return `<a type="button" onclick="showAlert('pendaftaran ${eventType} sudah ditutup')"><span class="badge badge-pill button badge-secondary" style="font-size: 12px;"><i class="fas fa fa-check"></i>&ensp;Hadir</span></a>`;
                        } else if (row.nim_pemrasaran === "J0403221122") {
                            return `<a type="button" onclick="showAlert('tidak bisa menghadiri ${eventType} diri sendiri')"><span class="badge badge-pill button badge-secondary" style="font-size: 12px;"><i class="fas fa fa-check"></i>&ensp;Hadir</span></a>`;
                        } else if (row.set_bap_m === 1 || row.set_bap_d === 1 || row.set_bap_d_2 === 1) {
                            return `<a type="button" onclick="showAlert('BAP ${eventType} sudah diisi')"><span class="badge badge-pill button badge-secondary" style="font-size: 12px;"><i class="fas fa fa-check"></i>&ensp;Hadir</span></a>`;
                        } else {
                            return `<form id="submitKehadiran${row.kehadiran}" action="${endpoint}/hadir/${row.kehadiran}" method="POST" enctype="multipart/form-data">` +
                                    `<input type="hidden" name="_token" value="${csrfToken}">` +
                                    `<a href="javascript:void(0);" onclick="showConfirm('Yakin ingin menghadiri ${eventType} ini?', 'submitKehadiran${row.kehadiran}')"><span class="badge badge-pill button badge-success" style="font-size: 12px;"><i class="fas fa fa-check"></i>&ensp;Hadir</span></a>` +
                                    `</form>`;
                        }
                    }
                },
                {
                    "targets": 2,
                    "render": function(data, type, row) {
                        return new Date(data).toLocaleDateString('id-ID', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        });
                    }
                },
                {
                    "targets": 3,
                    "width": "60px",
                    "className": "time-column",
                    "render": function(data, type, row) {
                        if (!data) return '';
                        const timeParts = data.split(':');
                        if (timeParts.length >= 2) {
                            const hours = timeParts[0].padStart(2, '0');
                            const minutes = timeParts[1].padStart(2, '0');
                            return `${hours}:${minutes}`;
                        }
                        return data;
                    }
                },
                {
                    "targets": 4,
                    "render": function(data, type, row) {
                        if (!data) return '';
                        const isZoomLink = data.includes('zoom.us') ||
                                         data.includes('meet.google.com') ||
                                         (data.includes('http://') || data.includes('https://'));

                        if (isZoomLink) {
                            return `
                                <div class="room-cell zoom-room">
                                    <i class="fas fa-video zoom-icon"></i>
                                    <button class="btn-action btn-copy zoom-copy-btn" data-link="${data}" title="Copy Zoom Link">
                                        <i class="fas fa-copy"></i>
                                    </button>
                                    <button class="btn-action btn-open zoom-open-btn" data-link="${data}" title="Buka Zoom">
                                        <i class="fas fa-external-link-alt"></i>
                                    </button>
                                </div>
                            `;
                        } else {
                            return `
                                <div class="room-cell physical-room">
                                    <i class="fas fa-door-open"></i>
                                    <span>${data}</span>
                                </div>
                            `;
                        }
                    }
                },
                {
                    "targets": 7,
                    "createdCell": function(td, cellData, rowData, row, col) {
                        jQuery(td).addClass('text-container');
                    },
                    "render": function(data, type, row) {
                        return '<span class="nama-judul ellipsis">' + data + '</span><i class="fas fa-sort toggle-btn"></i>';
                    }
                },
                {
                    "targets": 8,
                    "createdCell": function(td, cellData, rowData, row, col) {
                        jQuery(td).addClass('text-container');
                    },
                    "render": function(data, type, row) {
                        return '<span class="nama-judul ellipsis">' + data + '</span><i class="fas fa-sort toggle-btn"></i>';
                    }
                },
                {
                    "targets": 9,
                    "orderable": false,
                    "createdCell": function(td, cellData, rowData, row, col) {
                        jQuery(td).css('text-align', 'center');
                    }
                }
            ],
            "drawCallback": function () {
                setupIconToggle();
                attachZoomHandlers();
                fixScrollbar();
                updateDataTableInfo();
            }
        });

        console.log(`[FRIDA Enhancer] ✓ ${pageType} table initialized!`);
    }

    // ============================================
    // UPDATE DATATABLE INFO TEXT
    // ============================================
    function updateDataTableInfo() {
        setTimeout(() => {
            const infoElement = document.querySelector('#datatable1_info');
            if (!infoElement) return;

            const info = dataTableInstance.page.info();
            const start = info.start + 1;
            const end = info.end;
            const displayed = info.recordsDisplay;
            const loaded = allDataCache.length;

            let infoText = `Showing ${start} to ${end} of ${displayed} entries`;

            // Add total count if not all data is loaded
            if (loaded < totalRecords) {
                infoText += ` <span style="color: #6c757d; font-weight: 600;">(${totalRecords.toLocaleString()} total)</span>`;
            }

            // If filtered
            if (displayed < loaded) {
                infoText = `Showing ${start} to ${end} of ${displayed} entries (filtered from ${loaded} loaded)`;
                if (loaded < totalRecords) {
                    infoText += ` <span style="color: #6c757d; font-weight: 600;">(${totalRecords.toLocaleString()} total)</span>`;
                }
            }

            infoElement.innerHTML = infoText;
        }, 50);
    }

    // ============================================
    // FILTER FUNCTIONS
    // ============================================
    function injectFilterUI() {
        const wrapper = document.querySelector('#datatable1_wrapper .row:first-child');
        if (!wrapper) return;

        const lengthDiv = wrapper.querySelector('.col-sm-12.col-md-6:first-child');
        const searchDiv = wrapper.querySelector('.col-sm-12.col-md-6:last-child');

        if (!lengthDiv || !searchDiv) return;

        lengthDiv.className = 'col-sm-12 col-md-3';
        searchDiv.className = 'col-sm-12 col-md-3';

        const filterDiv = document.createElement('div');
        filterDiv.className = 'col-sm-12 col-md-6';
        filterDiv.innerHTML = `
            <div class="dataTables_filter" id="frida-custom-filter">
                <label style="display: flex; align-items: center; gap: 6px; justify-content: center; margin-bottom: 0;">
                    <span style="font-size: 12px; font-weight: 600; white-space: nowrap;">Filter:</span>

                    <select id="filter-prodi" class="form-control form-control-sm" style="width: auto; min-width: 200px; max-width: 250px; font-size: 12px;">
                        <option value="">Semua Prodi</option>
                    </select>

                    <select id="filter-ruangan" class="form-control form-control-sm" style="width: auto; min-width: 90px; font-size: 12px;">
                        <option value="">Ruangan</option>
                        <option value="online">Online</option>
                        <option value="offline">Offline</option>
                    </select>

                    <select id="filter-status" class="form-control form-control-sm" style="width: auto; min-width: 100px; font-size: 12px;">
                        <option value="">Status</option>
                        <option value="available">Bisa Hadir</option>
                        <option value="unavailable">Tidak Bisa</option>
                    </select>

                    <button id="btn-clear-filter" class="btn btn-secondary btn-sm" style="font-size: 11px; padding: 5px 10px;" title="Reset Filter">
                        <i class="fas fa-redo"></i> Reset
                    </button>
                </label>
            </div>
        `;

        lengthDiv.insertAdjacentElement('afterend', filterDiv);

        populateProdiDropdown();

        console.log('[FRIDA Enhancer] Filter UI injected');
    }

    function populateProdiDropdown() {
        const prodiSet = new Set();

        allDataCache.forEach(row => {
            if (row.prodi) {
                prodiSet.add(row.prodi);
            }
        });

        const prodiSelect = jQuery('#filter-prodi');
        if (prodiSelect.length === 0) return;

        const currentValue = prodiSelect.val();
        prodiSelect.find('option:not([value=""])').remove();

        Array.from(prodiSet).sort().forEach(prodi => {
            prodiSelect.append(`<option value="${prodi}" title="${prodi}">${prodi}</option>`);
        });

        if (currentValue) {
            prodiSelect.val(currentValue);
        }

        console.log(`[FRIDA Enhancer] Populated ${prodiSet.size} prodi options`);
    }

    function setupFilterHandlers() {
        jQuery.fn.dataTable.ext.search.push(function(settings, data, dataIndex) {
            const row = allDataCache[dataIndex];
            if (!row) return true;

            const prodiFilter = jQuery('#filter-prodi').val();
            if (prodiFilter && prodiFilter !== '') {
                if (!row.prodi || !row.prodi.includes(prodiFilter)) {
                    return false;
                }
            }

            const ruanganFilter = jQuery('#filter-ruangan').val();
            if (ruanganFilter && ruanganFilter !== '') {
                const ruangan = row.ruangan || '';
                const isOnline = ruangan.includes('zoom.us') ||
                               ruangan.includes('meet.google.com') ||
                               ruangan.toLowerCase().includes('online') ||
                               ruangan.includes('http://') ||
                               ruangan.includes('https://');

                if (ruanganFilter === 'online' && !isOnline) return false;
                if (ruanganFilter === 'offline' && isOnline) return false;
            }

            const statusFilter = jQuery('#filter-status').val();
            if (statusFilter && statusFilter !== '') {
                const tgl = row.tanggal + ' ' + row.waktu;
                const date = new Date(tgl);
                const now = new Date();
                const past = date < now;

                const isSelf = row.nim_pemrasaran === "J0403221122";
                const bapFilled = row.set_bap_m === 1 || row.set_bap_d === 1 || row.set_bap_d_2 === 1;

                const isAvailable = !past && !isSelf && !bapFilled;

                if (statusFilter === 'available' && !isAvailable) return false;
                if (statusFilter === 'unavailable' && isAvailable) return false;
            }

            return true;
        });

        jQuery('#filter-prodi, #filter-ruangan, #filter-status').on('change', function() {
            if (dataTableInstance) {
                dataTableInstance.draw();
            }
        });

        jQuery('#btn-clear-filter').on('click', function() {
            jQuery('#filter-prodi').val('');
            jQuery('#filter-ruangan').val('');
            jQuery('#filter-status').val('');

            if (dataTableInstance) {
                dataTableInstance.draw();
                showSweetAlert('Filter direset!', 'info');
            }
        });
    }

    // ============================================
    // LOADING INDICATORS
    // ============================================
    function showLoadingOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'frida-loading-overlay';
        overlay.innerHTML = `
            <div style="text-align: center; color: white; max-width: 400px;">
                <i class="fas fa-spinner fa-spin" style="font-size: 48px; margin-bottom: 20px;"></i>
                <h3 id="loading-message">Memuat data...</h3>
                <div style="width: 100%; background: rgba(255,255,255,0.2); border-radius: 10px; overflow: hidden; height: 25px; margin-top: 15px;">
                    <div id="loading-progress-bar" style="width: 0%; height: 100%; background: linear-gradient(90deg, #28a745, #20c997); transition: width 0.3s ease;"></div>
                </div>
                <p id="loading-percentage" style="margin-top: 10px; font-size: 14px;">0%</p>
            </div>
        `;
        document.body.appendChild(overlay);
    }

    function updateLoadingProgress(message, percentage) {
        const messageEl = document.getElementById('loading-message');
        const progressBar = document.getElementById('loading-progress-bar');
        const percentageEl = document.getElementById('loading-percentage');

        if (messageEl) messageEl.textContent = message;
        if (progressBar) progressBar.style.width = percentage + '%';
        if (percentageEl) percentageEl.textContent = Math.round(percentage) + '%';
    }

    function hideLoadingOverlay() {
        const overlay = document.getElementById('frida-loading-overlay');
        if (overlay) {
            overlay.remove();
        }
    }

    function showMiniLoading() {
        const mini = document.createElement('div');
        mini.id = 'frida-mini-loading';
        mini.innerHTML = `
            <i class="fas fa-spinner fa-spin"></i> Memuat data tambahan...
        `;
        document.body.appendChild(mini);
    }

    function hideMiniLoading() {
        const mini = document.getElementById('frida-mini-loading');
        if (mini) {
            mini.remove();
        }
    }

    // ============================================
    // SHARED UTILITIES
    // ============================================
    function fixScrollbar() {
        setTimeout(() => {
            const wrapper = document.querySelector('.table-responsive');
            const table = document.querySelector('#datatable1');

            if (wrapper && table) {
                const wrapperWidth = wrapper.clientWidth;
                const tableWidth = table.scrollWidth;

                if (tableWidth <= wrapperWidth + 5) {
                    wrapper.style.overflowX = 'hidden';
                    wrapper.style.width = '100%';
                    table.style.width = '100%';
                    table.style.maxWidth = '100%';
                }
            }
        }, 100);
    }

    function attachZoomHandlers() {
        jQuery('.zoom-copy-btn').off('click').on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            const link = jQuery(this).data('link');

            if (typeof GM_setClipboard !== 'undefined') {
                GM_setClipboard(link);
                showSweetAlert('Link Zoom berhasil disalin!', 'success');
            } else {
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(link).then(() => {
                        showSweetAlert('Link Zoom berhasil disalin!', 'success');
                    }).catch(() => {
                        fallbackCopy(link);
                    });
                } else {
                    fallbackCopy(link);
                }
            }
        });

        jQuery('.zoom-open-btn').off('click').on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            const link = jQuery(this).data('link');
            window.open(link, '_blank', 'noopener,noreferrer');
            showSweetAlert('Membuka Zoom di tab baru...', 'info');
        });
    }

    function fallbackCopy(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            showSweetAlert('Link Zoom berhasil disalin!', 'success');
        } catch (err) {
            showSweetAlert('Gagal menyalin link', 'error');
        }
        document.body.removeChild(textarea);
    }

    function showSweetAlert(message, icon) {
        if (typeof Swal !== 'undefined') {
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer);
                    toast.addEventListener('mouseleave', Swal.resumeTimer);
                }
            });

            Toast.fire({
                icon: icon,
                title: message,
                customClass: {
                    popup: 'colored-toast'
                }
            });
        }
    }

    function setupIconToggle() {
        document.querySelectorAll('.text-container').forEach(container => {
            const textElement = container.querySelector('.ellipsis');
            const icon = container.querySelector('.toggle-btn');

            if (!textElement || !icon) return;

            if (textElement.scrollWidth > textElement.clientWidth) {
                icon.style.display = 'inline';
            }

            const newIcon = icon.cloneNode(true);
            icon.parentNode.replaceChild(newIcon, icon);

            newIcon.addEventListener('click', () => {
                if (textElement.classList.contains('ellipsis')) {
                    textElement.classList.remove('ellipsis');
                    textElement.classList.add('full-text');
                } else {
                    textElement.classList.remove('full-text');
                    textElement.classList.add('ellipsis');
                }
            });
        });
    }

    function injectCustomCSS() {
        const style = document.createElement('style');
        style.id = 'frida-enhancer-styles';
        style.textContent = `
            .card-body { overflow: visible !important; }
            #datatable1_wrapper { width: 100% !important; overflow: visible !important; }
            #datatable1 { width: 100% !important; max-width: 100% !important; table-layout: auto !important; }

            .table-responsive {
                overflow-x: hidden !important;
                width: 100% !important;
                -webkit-overflow-scrolling: touch !important;
            }

            #frida-loading-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.85);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 99999;
            }

            #frida-mini-loading {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                z-index: 9999;
                font-size: 14px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            }

            td.time-column,
            th.time-column {
                width: 60px !important;
                max-width: 60px !important;
                min-width: 60px !important;
                text-align: center !important;
                padding-left: 8px !important;
                padding-right: 8px !important;
                white-space: nowrap !important;
            }

            #frida-custom-filter label {
                margin-bottom: 0 !important;
            }

            #filter-prodi {
                min-width: 200px !important;
                max-width: 250px !important;
            }

            .room-cell {
                display: flex;
                align-items: center;
                gap: 6px;
                font-size: 12px;
                white-space: nowrap;
            }

            .zoom-room { flex-wrap: nowrap; }
            .zoom-icon { color: #2D8CFF; font-size: 14px; margin-right: 2px; flex-shrink: 0; }

            .physical-room { color: #28a745; font-weight: 600; }
            .physical-room i { color: #28a745; font-size: 13px; flex-shrink: 0; }
            .physical-room span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 100px; }

            .btn-action {
                padding: 4px 8px;
                font-size: 11px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                transition: all 0.2s ease;
                background: white;
                color: #555;
                border: 1px solid #ddd;
                flex-shrink: 0;
            }

            .btn-action:hover { transform: translateY(-1px); box-shadow: 0 2px 4px rgba(0,0,0,0.15); }
            .btn-action i { font-size: 10px; }
            .btn-copy:hover { background: #e3f2fd; border-color: #2D8CFF; color: #2D8CFF; }
            .btn-open:hover { background: #2D8CFF; border-color: #2D8CFF; color: white; }

            .full-text { white-space: normal !important; overflow: visible !important; max-width: none !important; }

            .colored-toast.swal2-icon-success { background-color: #28a745 !important; }
            .colored-toast.swal2-icon-error { background-color: #dc3545 !important; }
            .colored-toast.swal2-icon-info { background-color: #17a2b8 !important; }

            @media (max-width: 768px) {
                .room-cell { flex-wrap: wrap; }
                .card-body { padding: 0.5rem !important; }
                .table-responsive { overflow-x: auto !important; }

                td.time-column,
                th.time-column {
                    width: 50px !important;
                    max-width: 50px !important;
                    min-width: 50px !important;
                    font-size: 11px !important;
                }

                #filter-prodi {
                    min-width: 150px !important;
                    max-width: 200px !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

})();