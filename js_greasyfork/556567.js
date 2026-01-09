// ==UserScript==
// @name         Auto Fill v6.7
// @namespace    http://tampermonkey.net/
// @version      6.7.2611.1
// @description  Auto isi + submit massal harapan ekonomi ke BOS POLRI. Mode auto/manual, anti-duplikat, resume, countdown. Gunakan secara bertanggung jawab.
// @author       Jae + AI
// @match        https://bos.polri.go.id/laporan/dds-warga*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556567/Auto%20Fill%20v67.user.js
// @updateURL https://update.greasyfork.org/scripts/556567/Auto%20Fill%20v67.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const dataLaporan = [
        { nama: "Agus S.", uraian: "Harapan saya harga sembako seperti beras, minyak goreng, dan gula bisa stabil sepanjang tahun agar ibu-ibu rumah tangga tidak pusing mengatur keuangan keluarga setiap hari.", keywords: ["sembako", "harga stabil", "rumah tangga"] },
        { nama: "Siti M.", uraian: "Tolong pemerintah bantu petani bawang dan cabai dengan pupuk bersubsidi yang bener-bener sampai ke tangan kami, supaya harga di pasar tidak naik turun seperti roller coaster.", keywords: ["petani", "pupuk subsidi", "harga pangan"] },
        { nama: "Dedi K.", uraian: "Saya sebagai tukang ojek online berharap tarif minimal dinaikkan sedikit karena bahan bakar semakin mahal sementara penumpang minta potongan harga terus.", keywords: ["ojol", "tarif", "bahan bakar"] },
        { nama: "Rina W.", uraian: "UMKM kecil seperti konveksi rumahan saya susah bersaing karena bahan kain impor mahal sekali, tolong ada keringanan bea masuk atau produksi dalam negeri lebih banyak.", keywords: ["UMKM", "tekstil", "bahan baku"] },
        { nama: "Slamet H.", uraian: "Pedagang pasar tradisional mohon pasar diperbaiki dan diberi tempat parkir yang layak agar pembeli nyaman, jangan sampai kalah sama minimarket modern.", keywords: ["pasar tradisional", "fasilitas", "pedagang kecil"] },
        { nama: "Wawan P.", uraian: "Anak muda pengen buka usaha kuliner tapi modal susah, harapannya ada pinjaman KUR dengan bunga nol persen untuk pemula seperti kami.", keywords: ["KUR", "wirausaha muda", "modal usaha"] },
        { nama: "Nur A.", uraian: "Sebagai ibu buruh garmen, saya berharap upah minimum tahun depan naik cukup tinggi karena biaya sekolah anak dan kontrakan terus meningkat tiap tahun.", keywords: ["upah minimum", "buruh", "biaya hidup"] },
        { nama: "Joko T.", uraian: "Nelayan kecil seperti saya butuh solar bersubsidi yang benar-benar ada di SPBU nelayan, bukan antre bersama truk sampai tengah malam.", keywords: ["nelayan", "solar subsidi", "bahan bakar"] },
        { nama: "Tuti S.", uraian: "Tolong pemerintah awasi kartel beras dan minyak goreng, jangan sampai rakyat kecil yang selalu jadi korban saat harga tiba-tiba melonjak.", keywords: ["kartel", "sembako", "pengawasan"] },
        { nama: "Hadi M.", uraian: "Petani tebu di daerah saya berharap harga gula tidak diimpor murah terus sehingga pabrik gula mau beli tebu kami dengan harga yang layak.", keywords: ["petani tebu", "harga gula", "impor"] },
        { nama: "Lina K.", uraian: "Saya jualan kue di rumah, harapannya listrik tidak naik lagi karena oven dan mixer sangat boros, sudah untung tipis sekali.", keywords: ["UMKM kuliner", "tarif listrik", "usaha rumahan"] },
        { nama: "Budi R.", uraian: "Supir angkot berharap ada bantuan pembelian ban dan oli karena harga sparepart naik terus, sementara tarif angkot tidak boleh naik.", keywords: ["angkot", "sparepart", "tarif"] },
        { nama: "Eni P.", uraian: "Ibu-ibu PKK sangat mengharapkan pasar murah rutin tiap bulan karena itu satu-satunya saat kami bisa belanja sembako dengan harga terjangkau.", keywords: ["pasar murah", "PKK", "sembako"] },
        { nama: "Suhendra L.", uraian: "Pemuda desa ingin ada pelatihan kewirausahaan gratis dan pendampingan sampai usaha benar-benar jalan, bukan cuma seminar doang.", keywords: ["wirausaha desa", "pelatihan", "pendampingan"] },
        { nama: "Mira Y.", uraian: "Penjual sayur keliling mohon ada keringanan retribusi pasar karena kalau hujan sehari saja sudah rugi besar, belum lagi bahan bakar naik.", keywords: ["pedagang keliling", "retribusi", "sayur mayur"] },
        { nama: "Kasminah D.", uraian: "Saya berharap bansos tepat sasaran dan tidak dipotong orang tengah sehingga benar-benar membantu keluarga miskin seperti kami.", keywords: ["bansos", "tepat sasaran", "keluarga miskin"] },
        { nama: "Yanto S.", uraian: "Tukang bangunan berharap proyek pemerintah banyak di desa supaya ada lapangan kerja dan uang berputar di kampung kami.", keywords: ["proyek desa", "lapangan kerja", "tukang"] },
        { nama: "Sari W.", uraian: "Tolong ada pasar online khusus produk lokal agar kami pengrajin batik dan tenun bisa jual langsung ke konsumen tanpa tengkulak.", keywords: ["pasar online", "kerajinan", "lokal"] },
        { nama: "Rudi H.", uraian: "Petani padi berharap harga pupuk turun atau subsidi pupuk ditambah karena biaya produksi sekarang hampir sama dengan hasil panen.", keywords: ["pupuk", "petani padi", "subsidi"] },
        { nama: "Endang S.", uraian: "Karyawan swasta kontrak berharap ada jaminan kerja tetap setelah beberapa tahun agar bisa mengajukan kredit rumah atau kendaraan.", keywords: ["kontrak", "jaminan kerja", "kredit"] },
        { nama: "Wiwit K.", uraian: "Ibu rumah tangga berharap harga telur dan daging ayam tidak melonjak saat lebaran, kasihan anak-anak kalau tidak bisa makan enak.", keywords: ["harga telur", "daging ayam", "lebaran"] },
        { nama: "Parjo M.", uraian: "Sopir truk antar provinsi mohon jalan tol malam hari diberi diskon karena kami biasa jalan malam agar siang bisa istirahat.", keywords: ["tol", "sopir truk", "diskon"] },
        { nama: "Ningsih R.", uraian: "Penjahit rumahan ingin ada bantuan mesin obras dan neci modern dengan cicilan ringan supaya orderan bisa lebih cepat selesai.", keywords: ["penjahit", "mesin jahit", "UMKM"] },
        { nama: "Eko P.", uraian: "Pemuda pengangguran ingin ada BLK gratis yang mengajar skill langsung bisa kerja, bukan cuma teori berbulan-bulan.", keywords: ["BLK", "pelatihan kerja", "pemuda"] },
        { nama: "Suminah T.", uraian: "Lansia pedagang kaki lima berharap ada tempat jualan yang tetap dan tidak terus digusur demi proyek, kami juga butuh makan.", keywords: ["PKL", "tempat jualan", "lansia"] },
        { nama: "Dian S.", uraian: "Guru honorer berharap gaji kami disesuaikan UMK karena harga kebutuhan pokok sekarang sudah sangat tinggi.", keywords: ["guru honorer", "gaji", "UMK"] },
        { nama: "Sutrisno H.", uraian: "Peternak ayam potong mohon pemerintah atur impor daging supaya harga ayam lokal tidak jatuh saat panen raya.", keywords: ["peternak ayam", "impor daging", "harga lokal"] },
        { nama: "Ratih P.", uraian: "Ibu single parent ingin ada pelatihan kerja dan bantuan modal usaha kecil supaya bisa mandiri menghidupi anak-anak.", keywords: ["single parent", "pelatihan", "modal usaha"] },
        { nama: "Maman S.", uraian: "Tukang las berharap harga besi dan bahan bangunan turun karena sekarang banyak pelanggan tunda renovasi rumah.", keywords: ["bahan bangunan", "tukang las", "renovasi"] },
        { nama: "Lestari W.", uraian: "Penjual gorengan pinggir jalan mohon ada koperasi khusus UMKM kecil untuk pinjaman cepat tanpa agunan ribet.", keywords: ["gorengan", "koperasi", "pinjaman UMKM"] },
        { nama: "Herman K.", uraian: "Nelayan tradisional berharap cuaca lebih bersahabat dan harga ikan tetap stabil supaya anak bisa terus sekolah.", keywords: ["nelayan tradisional", "harga ikan", "cuaca"] },
        { nama: "Siti H.", uraian: "Saya jualan online baju anak harap pajak platform tidak terlalu tinggi karena margin kami sudah tipis sekali.", keywords: ["e-commerce", "pajak", "baju anak"] },
        { nama: "Suparman J.", uraian: "Petani kopi ingin ada program pembelian langsung oleh pemerintah dengan harga minimal agar tidak tergantung tengkulak.", keywords: ["petani kopi", "harga minimal", "tengkulak"] },
        { nama: "Yuni R.", uraian: "Buruh pabrik sepatu berharap ada bus jemputan karyawan gratis karena ongkos transport tiap hari sudah memakan gaji.", keywords: ["buruh pabrik", "transportasi", "gaji"] },
        { nama: "Ahmad F.", uraian: "Anak muda ingin pemerintah buka lapangan kerja baru di daerah, jangan sampai kami semua mengadu nasib ke Jakarta.", keywords: ["lapangan kerja", "daerah", "pemuda"] }
    ];
    const STORAGE_KEY = 'dds_v69';
    const AUTO_KEY    = 'dds_v69_running';

    let used    = new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'));
    let tersisa = dataLaporan.filter(d => !used.has(d.nama));
    let running = JSON.parse(localStorage.getItem(AUTO_KEY) || 'false');
    let stop    = false;

    // === JIKA DATA SUDAH HABIS → BERSIHKAN SEMUA & MATIKAN AUTO ===
    if (tersisa.length === 0) {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(AUTO_KEY);
        used = new Set();
        tersisa = [...dataLaporan];
        running = false;
    }

    const notif = (msg, color = '#28a745') => {
        const el = document.createElement('div');
        el.textContent = msg;
        Object.assign(el.style, {
            position:'fixed', top:'15px', right:'15px', padding:'10px 20px', background:color,
            color:'white', borderRadius:'10px', zIndex:9999999, font:'bold 15px system-ui',
            boxShadow:'0 6px 20px rgba(0,0,0,0.4)', opacity:0, transition:'all .3s'
        });
        document.body.appendChild(el);
        requestAnimationFrame(() => el.style.opacity = '1');
        setTimeout(() => el.remove(), 4000);
    };

    const saveState = (isRunning) => {
        localStorage.setItem(AUTO_KEY, JSON.stringify(isRunning));
        if (isRunning) localStorage.setItem(STORAGE_KEY, JSON.stringify([...used]));
    };

    const fullReset = () => {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(AUTO_KEY);
        running = false;
        stop = true;
        saveState(false);
    };

    const updateUI = () => {
        document.getElementById('btnAuto').textContent = `AUTO`;
        document.getElementById('btnManual').textContent = `ISI`;
        document.getElementById('count').textContent = tersisa.length;
        const disabled = running || tersisa.length === 0;
        document.getElementById('btnAuto').disabled = disabled;
        document.getElementById('btnManual').disabled = disabled;
        document.getElementById('status').textContent = running ? 'ON!' : (tersisa.length === 0 ? 'HABIS!' : 'IDLE');
        document.getElementById('status').style.color = running ? '#28a745' : (tersisa.length === 0 ? '#ffc107' : '#fff');
    };

    const isiForm = (data) => {
        $('#nama_kepala_keluarga').val(data.nama).trigger('input');
        $('input[value="harapan"]').prop('checked', true).trigger('change');
        $('input[value="keluhan"]').prop('checked', false).trigger('change');
        $('#bidang-harapan').val('EKONOMI').trigger('change');
        $('#uraian-harapan').val(data.uraian);
        $('#keyword_harapan').empty().append(data.keywords.map(k => `<option value="${k}" selected>${k}</option>`)).trigger('change');
        $('input[name="laporan_informasi[bidang]"][value="ekonomi"]').prop('checked', true).trigger('change');
        $('textarea[name="laporan_informasi[uraian]"]').val(data.uraian);
        $('#select-keyword-informasi').empty().append(data.keywords.map(k => `<option value="${k}" selected>${k}</option>`)).trigger('change');
    };

    const kirim = (autoSubmit = true) => {
        // Cek apakah data sudah habis
        if (tersisa.length === 0) {
            fullReset();
            updateUI();
            notif('SEMUA DATA SUDAH HABIS! AUTO STOP & DIBERSIHKAN', '#ffc107');
            return;
        }

        if (stop) {
            running = false; saveState(false); updateUI();
            notif('Dihentikan manual', '#dc3545');
            return;
        }

        const data = tersisa.splice(Math.floor(Math.random() * tersisa.length), 1)[0];
        used.add(data.nama);
        saveState(true);

        isiForm(data);
        updateUI();
        notif(autoSubmit ? `Terkirim: ${data.nama} (${tersisa.length} tersisa)` : 'Form terisi!', autoSubmit ? '#28a745' : '#17a2b8');

        if (autoSubmit) {
            setTimeout(() => {
                const btn = Array.from(document.querySelectorAll('button')).find(b =>
                    b.textContent.trim().includes('Simpan') && b.type === 'submit' && !b.disabled
                );
                if (btn) {
                    btn.click();
                    mulaiCountdown();
                } else {
                    notif('Tombol Simpan tidak ketemu! Retry 4 detik...', '#dc3545');
                    setTimeout(() => kirim(true), 4000);
                }
            }, 1200);
        }
    };

    const mulaiCountdown = () => {
        const ov = document.createElement('div');
        ov.innerHTML = `<div style="position:fixed;inset:0;background:rgba(0,0,0,0.95);z-index:99999999;display:flex;align-items:center;justify-content:center;cursor:default;">
            <div style="background:#fff;padding:50px 80px;border-radius:30px;text-align:center;">
                <h2 style="margin:0 0 20px;font-size:36px;color:#27ae60;">Terkirim!</h2>
                <div id="cdx" style="font-size:90px;font-weight:900;color:#27ae60;">30</div>
                <p style="margin:10px 0 0;font-size:16px;color:#555;">${tersisa.length} tersisa</p>
            </div>
        </div>`;
        document.body.appendChild(ov);
        let s = 30;
        const t = setInterval(() => {
            s--;
            document.getElementById('cdx').textContent = s < 10 ? '0'+s : s;
            if (s <= 0) {
                clearInterval(t);
                ov.remove();
                location.href = 'https://bos.polri.go.id/laporan/dds-warga/create';
            }
        }, 1000);
    };

    // === PANEL ===
    if (location.pathname.includes('/create')) {
        const panel = document.createElement('div');
        panel.innerHTML = `
            <button id="btnAuto">AUTO</button>
            <button id="btnManual">ISI</button>
            <button id="btnStop">STOP</button>
            <span id="count" style="margin-left:10px;color:#0f0;font-weight:bold;">0</span>
            <span id="status" style="margin-left:10px;color:#fff;font-weight:bold;">IDLE</span>
        `;
        Object.assign(panel.style, {
            position:'fixed', bottom:'12px', left:'50%', transform:'translateX(-50%)', zIndex:99999,
            display:'flex', gap:'10px', alignItems:'center', padding:'10px 16px',
            background:'rgba(20,20,20,0.9)', borderRadius:'30px', backdropFilter:'blur(12px)',
            fontFamily:'system-ui', fontSize:'14px', boxShadow:'0 8px 25px rgba(0,0,0,0.5)'
        });
        document.body.appendChild(panel);

        document.head.insertAdjacentHTML('beforeend', `
            <style>
                #btnAuto, #btnManual, #btnStop{padding:10px 20px;border:none;border-radius:25px;font-weight:bold;cursor:pointer;transition:.3s;}
                #btnAuto{background:#28a745;color:white;} #btnAuto:hover{background:#218838;}
                #btnManual{background:#007bff;color:white;} #btnManual:hover{background:#0056b3;}
                #btnStop{background:#dc3545;color:white;padding:10px 16px;}
                button:disabled{opacity:0.5;cursor:not-allowed!important;}
            </style>
        `);

        document.getElementById('btnAuto').onclick = () => {
            if (tersisa.length === 0) return;
            running = true; stop = false; saveState(true);
            updateUI();
            notif('AUTO LOOP DIMULAI!', '#28a745');
            kirim(true);
        };

        document.getElementById('btnManual').onclick = () => {
            if (tersisa.length === 0 || running) return;
            kirim(false);
        };

        document.getElementById('btnStop').onclick = () => {
            stop = true; running = false; saveState(false);
            updateUI();
            notif('Dihentikan manual', '#dc3545');
        };

        // RESUME KALAU SEBELUMNYA SEDANG JALAN
        if (running && tersisa.length > 0) {
            setTimeout(() => {
                notif('RESUME AUTO LOOP!', '#28a745');
                kirim(true);
            }, 1500);
        }

        updateUI();
        notif(running ? 'AUTO RESUME!' : 'DDS v6.9 SIAP!', running ? '#28a745' : '#17a2b8');
    }

    // Auto redirect ke create
    if (!location.pathname.includes('/create') && location.pathname.includes('/dds-warga')) {
        setTimeout(() => location.replace('https://bos.polri.go.id/laporan/dds-warga/create'), 800);
    }
})();