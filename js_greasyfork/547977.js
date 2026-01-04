// ==UserScript==
// @name         Tombol Unduh Publikasi Tel-U
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Menambahkan tombol melayang untuk mengunduh data publikasi dari halaman PPM Telkom University sebagai file CSV.
// @author       Gemini
// @match        https://publikasi-ppm.telkomuniversity.ac.id/verifikasi-artikel-GS*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/547977/Tombol%20Unduh%20Publikasi%20Tel-U.user.js
// @updateURL https://update.greasyfork.org/scripts/547977/Tombol%20Unduh%20Publikasi%20Tel-U.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- FUNGSI UTAMA UNTUK EKSTRAKSI DAN PENGUNDUHAN DATA ---
    function runExtractionAndDownload() {
        // Fungsi untuk extract text dari element
        function extractText(element) {
            return element ? element.textContent.trim() : '';
        }

        // Fungsi untuk extract link dari element
        function extractLink(element) {
            return element && element.querySelector('a') ? element.querySelector('a').href : '';
        }

        const publications = [];
        const publicationModals = document.querySelectorAll('[id^="modal-default-"]');
        console.log(`Menemukan ${publicationModals.length} publikasi`);

        publicationModals.forEach(modal => {
            const modalId = modal.id.replace('modal-default-', '');
            const publication = {
                id: modalId, title: '', authors: '', internalAuthors: '', publicationType: '',
                journalName: '', publicationYear: '', publicationLink: '', validitasArtikel: ''
            };
            const titleElement = modal.querySelector('tr:nth-child(1) td:nth-child(2) .text-wrap');
            publication.title = extractText(titleElement);
            const authorsElement = modal.querySelector('tr:nth-child(2) td:nth-child(2) .text-wrap');
            publication.authors = extractText(authorsElement);
            const internalAuthorsElement = modal.querySelector('tr:nth-child(3) td:nth-child(2) .text-wrap');
            publication.internalAuthors = extractText(internalAuthorsElement);
            const publicationTypeId = `tipePublikasiDisp_${modalId}`;
            const publicationTypeElement = document.getElementById(publicationTypeId)?.querySelector('td:nth-child(2)');
            publication.publicationType = extractText(publicationTypeElement);
            const journalNameId = `namaJurnalDisp_${modalId}`;
            const journalNameElement = document.getElementById(journalNameId)?.querySelector('td:nth-child(2) .text-wrap');
            publication.journalName = extractText(journalNameElement);
            const pubYearId = `thnPubDisp_${modalId}`;
            const pubYearElement = document.getElementById(pubYearId)?.querySelector('td:nth-child(2)');
            publication.publicationYear = extractText(pubYearElement);
            const linkId = `tautanDisp_${modalId}`;
            const linkElement = document.getElementById(linkId)?.querySelector('td:nth-child(2) .text-wrap');
            publication.publicationLink = extractLink(linkElement);
            const validitasRadio = modal.querySelector('input[type="radio"][name="validArtikel"]:checked');
            if (validitasRadio) {
                publication.validitasArtikel = validitasRadio.value === '1' ? 'Valid' : 'Tidak Valid';
            } else {
                publication.validitasArtikel = '';
            }
            publications.push(publication);
        });

        console.log('Data Publikasi yang berhasil diekstrak:', JSON.stringify(publications, null, 2));

        if (publications.length === 0) {
            alert('Tidak ada data publikasi yang ditemukan di modal pada halaman ini.');
            return;
        }

        // --- PEMBUATAN KONTEN CSV ---
        const headers = ['ID', 'Judul Artikel', 'Penulis', 'Penulis Internal', 'Tipe Publikasi',
                         'Nama Jurnal/Conference', 'Tahun Publikasi', 'Tautan Publikasi', 'Validitas Artikel'];
        let csvContent = headers.join(',') + '\n';
        publications.forEach(pub => {
            const escapedFields = [
                pub.id, `"${pub.title.replace(/"/g, '""')}"`, `"${pub.authors.replace(/"/g, '""')}"`,
                `"${pub.internalAuthors.replace(/"/g, '""')}"`, `"${pub.publicationType.replace(/"/g, '""')}"`,
                `"${pub.journalName.replace(/"/g, '""')}"`, pub.publicationYear,
                `"${pub.publicationLink.replace(/"/g, '""')}"`, pub.validitasArtikel
            ];
            csvContent += escapedFields.join(',') + '\n';
        });

        // --- PEMBUATAN STATISTIK ---
        const journalStats = {};
        publications.forEach(pub => {
            const name = pub.journalName || '-';
            if (journalStats[name]) { journalStats[name] += 1; } else { journalStats[name] = 1; }
        });

        function extractDomain(url) {
            if (!url) return '-';
            try {
                url = url.replace(/^"|"$/g, '');
                const a = document.createElement('a'); a.href = url;
                let domain = a.hostname || '';
                if (!domain) {
                    const match = url.match(/^(?:https?:\/\/)?([^\/]+)/i);
                    domain = match ? match[1] : url;
                }
                domain = domain.replace(/^www\./i, '');
                return domain || '-';
            } catch { return url; }
        }
        const domainStats = {};
        publications.forEach(pub => {
            const domain = extractDomain(pub.publicationLink);
            if (domainStats[domain]) { domainStats[domain] += 1; } else { domainStats[domain] = 1; }
        });

        csvContent += '\nStatistik Nama Jurnal/Conference, , ,Jumlah\n';
        csvContent += 'Ranking,"Nama Jurnal/Conference",,Jumlah\n';
        Object.entries(journalStats).sort((a, b) => b[1] - a[1]).forEach(([name, count], idx) => {
            csvContent += `${idx + 1},"${name.replace(/"/g, '""')}",,${count}\n`;
        });
        csvContent += '\nStatistik Domain Web, , ,Jumlah\n';
        csvContent += 'Ranking,"Domain Web",,Jumlah\n';
        Object.entries(domainStats).sort((a, b) => b[1] - a[1]).forEach(([domain, count], idx) => {
            csvContent += `${idx + 1},"${domain.replace(/"/g, '""')}",,${count}\n`;
        });

        // --- FUNGSI BARU UNTUK MEMBACA FORM FILTER DAN MEMBUAT NAMA FILE DEFAULT ---
        function getFormValue(selector) {
            const el = document.querySelector(selector);
            return el ? (el.value || el.options?.[el.selectedIndex]?.value || '').trim() : '';
        }
        function getFormText(selector) {
            const el = document.querySelector(selector);
            return el ? (el.options?.[el.selectedIndex]?.text || '').trim() : '';
        }
        function cleanFilePart(s) {
            return (s || '').replace(/[^\w\d\- ]+/g, '').replace(/\s+/g, '_');
        }

        let tahun = getFormValue('select[name="tahun"]') || getFormText('select[name="tahun"]');
        let fakultas = getFormValue('select[name="fakultas"]') || getFormText('select[name="fakultas"]');
        let status = getFormValue('select[name="statVer"]') || getFormText('select[name="statVer"]');

        let defaultFileName = [tahun, fakultas, status].map(cleanFilePart).filter(Boolean).join('_') || 'data_publikasi';

        let fileName = prompt('Masukkan nama file untuk diunduh (tanpa ekstensi):', defaultFileName);
        if (!fileName) {
            fileName = defaultFileName;
        }
        fileName = fileName.trim() + '.csv';

        // --- PROSES PENGUNDUHAN FILE CSV ---
        const BOM = '\uFEFF'; // BOM untuk memastikan kompatibilitas UTF-8 di Excel
        const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        console.log('File CSV diunduh dengan nama: ' + fileName);

        // --- OPSI BARU UNTUK MEMBUKA WEB FILTER (TANPA LOCALSTORAGE) ---
        if (confirm('Data CSV telah diunduh.\n\nApakah Anda ingin membuka web filter eksternal?')) {
            window.open('https://atiohaidar.github.io/filter-data-verif-gs-ppm/', '_blank');
            console.log('Web filter eksternal dibuka di tab baru.');
        } else {
            console.log('Pengguna memilih untuk tidak membuka web filter.');
        }
    }

    // --- LOGIKA UNTUK MEMBUAT TOMBOL (Tidak ada perubahan di sini) ---
    function createFloatingButton() {
        if (document.getElementById('unduh-csv-button-telu')) {
            return;
        }

        const button = document.createElement('button');
        button.innerHTML = '📥 Unduh CSV';
        button.id = 'unduh-csv-button-telu';
        button.style.position = 'fixed';
        button.style.bottom = '20px';
        button.style.right = '20px';
        button.style.zIndex = '2147483647';
        button.style.padding = '12px 18px';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '8px';
        button.style.cursor = 'pointer';
        button.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
        button.style.fontSize = '16px';
        button.style.fontFamily = 'Arial, sans-serif';
        button.style.transition = 'background-color 0.3s';

        button.addEventListener('mouseover', function() {
            button.style.backgroundColor = '#45a049';
        });
        button.addEventListener('mouseout', function() {
            button.style.backgroundColor = '#4CAF50';
        });

        button.addEventListener('click', runExtractionAndDownload);
        document.body.appendChild(button);
        console.log('Tombol Unduh CSV berhasil ditambahkan ke halaman.');
    }

    // --- LOGIKA UNTUK MENJALANKAN SKRIP (Tidak ada perubahan di sini) ---
    console.log('Skrip Unduh Publikasi Tel-U aktif. Menunggu halaman siap...');
    const tryAppendButtonInterval = setInterval(() => {
        if (document.body && document.readyState === 'complete') {
            clearInterval(tryAppendButtonInterval);
            createFloatingButton();
        }
    }, 500);
})();