// ==UserScript==
// @name         Autofill Kuesioner Dosen AIS Unmul
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Autofill semua kuesioner dosen dengan nilai yang dapat dikonfigurasi (1-5) pada halaman KHS AIS Unmul
// @author       Aris
// @match        https://ais.unmul.ac.id/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/560439/Autofill%20Kuesioner%20Dosen%20AIS%20Unmul.user.js
// @updateURL https://update.greasyfork.org/scripts/560439/Autofill%20Kuesioner%20Dosen%20AIS%20Unmul.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== KONFIGURASI ====================
    // Ubah nilai di bawah ini sesuai keinginan (1-5)
    // 1 = Sangat tidak setuju
    // 2 = Tidak setuju
    // 3 = Cukup setuju
    // 4 = Setuju
    // 5 = Sangat setuju (default)
    const DEFAULT_KUISIONER_VALUE = 5;
    // =====================================================

    // Variabel global untuk tracking kuesioner
    let kuisionerLinksList = [];

    // Fungsi untuk mendapatkan nilai kuesioner (dari storage atau default)
    function getKuisionerValue() {
        const savedValue = GM_getValue('kuisionerValue', null);
        if (savedValue !== null && savedValue >= 1 && savedValue <= 5) {
            return savedValue;
        }
        return DEFAULT_KUISIONER_VALUE;
    }

    // Fungsi untuk menyimpan nilai kuesioner
    function setKuisionerValue(value) {
        if (value >= 1 && value <= 5) {
            GM_setValue('kuisionerValue', value);
            console.log(`✅ Nilai kuesioner diset ke: ${value}`);
            return true;
        }
        console.error('❌ Nilai harus antara 1-5');
        return false;
    }

    // Fungsi untuk mengisi semua radio button dengan nilai yang dikonfigurasi
    function fillAllWithValue(value = null) {
        const nilai = value !== null ? value : getKuisionerValue();
        const allRadioButtons = document.querySelectorAll('input[type="radio"][name^="respon["]');
        
        let filledCount = 0;
        allRadioButtons.forEach(radio => {
            // Centang radio button dengan value yang sesuai
            if (radio.value === String(nilai)) {
                radio.checked = true;
                // Trigger event change untuk memastikan form validation bekerja
                radio.dispatchEvent(new Event('change', { bubbles: true }));
                radio.dispatchEvent(new Event('click', { bubbles: true }));
                filledCount++;
            }
        });
        
        const nilaiLabels = ['Sangat tidak setuju', 'Tidak setuju', 'Cukup setuju', 'Setuju', 'Sangat setuju'];
        const nilaiLabel = nilaiLabels[nilai - 1] || `Nilai ${nilai}`;
        console.log(`✅ Mengisi ${filledCount} radio button dengan nilai ${nilai} (${nilaiLabel})`);
        return filledCount;
    }

    // Fungsi untuk klik tombol Next
    function clickNext() {
        const nextBtn = document.getElementById('nextbtn');
        if (nextBtn && !nextBtn.disabled) {
            nextBtn.click();
            console.log('✅ Klik tombol Next');
            return true;
        }
        return false;
    }

    // Fungsi untuk klik tombol Back
    function clickBack() {
        const backBtn = document.getElementById('backbtn');
        if (backBtn && !backBtn.disabled) {
            backBtn.click();
            console.log('✅ Klik tombol Back');
            return true;
        }
        return false;
    }

    // Fungsi untuk submit form (klik tombol Submit)
    function submitForm(onComplete) {
        const nextBtn = document.getElementById('nextbtn');
        const nextBtnText = nextBtn ? nextBtn.textContent.trim().toLowerCase() : '';
        
        // Jika tombol berubah jadi "Submit" atau "Simpan", klik tombol tersebut
        if (nextBtn && (nextBtnText.includes('submit') || nextBtnText.includes('simpan'))) {
            nextBtn.click();
            console.log('✅ Klik tombol Submit');
            
            // Jika ada callback, tunggu sebentar lalu panggil (setelah redirect/close modal)
            if (onComplete) {
                setTimeout(() => {
                    onComplete();
                }, 2000);
            }
            return true;
        }
        
        // Fallback: coba submit form langsung
        const activeForm = document.querySelector('.form-kuisioner');
        if (activeForm) {
            activeForm.submit();
            console.log('✅ Submit form (direct)');
            
            if (onComplete) {
                setTimeout(() => {
                    onComplete();
                }, 2000);
            }
            return true;
        }
        
        console.log('❌ Tidak ditemukan tombol Submit atau form');
        return false;
    }

    // Fungsi untuk mendapatkan step saat ini
    function getCurrentStep() {
        const forms = ['form-1', 'form-2', 'form-3', 'form-4', 'form-5'];
        for (let i = 0; i < forms.length; i++) {
            const form = document.getElementById(forms[i]);
            if (form && (form.style.display === 'flex' || 
                (form.style.display !== 'none' && !form.style.display))) {
                return i + 1;
            }
        }
        return 0;
    }

    // Fungsi utama untuk autofill dan navigasi
    function autoFillAndNavigate(onComplete) {
        const currentStep = getCurrentStep();
        const nilai = getKuisionerValue();
        console.log(`🚀 Step ${currentStep}: Memulai autofill kuesioner dengan nilai ${nilai}...`);
        
        const nextBtn = document.getElementById('nextbtn');
        const nextBtnText = nextBtn ? nextBtn.textContent.trim().toLowerCase() : '';
        
        // Jika tombol sudah berubah jadi "Submit", langsung submit (step 6)
        if (nextBtn && (nextBtnText.includes('submit') || nextBtnText.includes('simpan'))) {
            console.log('📝 Step terakhir (Submit), klik tombol Submit...');
            setTimeout(() => {
                submitForm(onComplete);
            }, 500);
            return;
        }
        
        // Isi semua dengan nilai 5
        const filled = fillAllWithValue();
        
        // Jika tidak ada yang perlu diisi, mungkin sudah di step terakhir (step 6)
        if (filled === 0) {
            console.log('⚠️ Tidak ada radio button yang perlu diisi.');
            
            // Cek apakah ini step 6 (tombol Submit)
            const nextBtnCheck = document.getElementById('nextbtn');
            const nextBtnTextCheck = nextBtnCheck ? nextBtnCheck.textContent.trim().toLowerCase() : '';
            if (nextBtnCheck && (nextBtnTextCheck.includes('submit') || nextBtnTextCheck.includes('simpan'))) {
                console.log('📝 Step terakhir, klik tombol Submit...');
                setTimeout(() => {
                    submitForm(onComplete);
                }, 500);
                return;
            }
            
            // Jika belum step terakhir, tunggu dan coba lagi
            setTimeout(() => {
                autoFillAndNavigate(onComplete);
            }, 500);
            return;
        }
        
        // Tunggu sebentar untuk memastikan form ter-update
        setTimeout(() => {
            // Cek apakah ada tombol Next yang bisa diklik
            const nextBtnAfter = document.getElementById('nextbtn');
            const nextBtnTextAfter = nextBtnAfter ? nextBtnAfter.textContent.trim().toLowerCase() : '';
            
            // Cek apakah Next button masih ada dan enabled (belum berubah jadi Simpan/Submit)
            if (nextBtnAfter && !nextBtnAfter.disabled && !nextBtnTextAfter.includes('simpan') && !nextBtnTextAfter.includes('submit')) {
                // Masih bisa lanjut ke step berikutnya
                console.log(`➡️ Pindah ke step berikutnya...`);
                clickNext();
                
                // Setelah pindah step, tunggu sebentar lalu isi lagi
                setTimeout(() => {
                    autoFillAndNavigate(onComplete);
                }, 800);
            } else {
                // Next button disabled atau berubah jadi Simpan/Submit, berarti step terakhir
                console.log('📝 Step terakhir, klik tombol Submit...');
                setTimeout(() => {
                    submitForm(onComplete);
                }, 500);
            }
        }, 400);
    }

    // Fungsi untuk menunggu modal terbuka
    function waitForModal(callback, maxWait = 5000) {
        const startTime = Date.now();
        const checkInterval = setInterval(() => {
            // Cek apakah ada form kuesioner yang muncul
            const kuisionerForm = document.querySelector('.form-kuisioner');
            const modal = document.querySelector('.modal.show, .modal[style*="display: block"]');
            
            if (kuisionerForm || modal) {
                clearInterval(checkInterval);
                console.log('✅ Modal/form kuesioner ditemukan');
                callback();
            } else if (Date.now() - startTime > maxWait) {
                clearInterval(checkInterval);
                console.log('⚠️ Timeout menunggu modal');
                callback();
            }
        }, 200);
    }

    // Fungsi untuk mengambil semua link kuesioner
    function getAllKuisionerLinks() {
        const allLinks = Array.from(document.querySelectorAll('a'));
        return allLinks.filter(link => 
            (link.classList.contains('kuisioner') || 
             link.textContent.includes('Isi Kuisioner')) && 
            link.href.includes('/kuisioner/')
        );
    }

    // Fungsi untuk memproses kuesioner berikutnya
    function processNextKuisioner() {
        // Tunggu sebentar untuk memastikan halaman sudah kembali ke KHS
        setTimeout(() => {
            // Cek apakah kita kembali ke halaman KHS (bukan halaman kuesioner)
            const isKuisionerPage = window.location.href.includes('/kuisioner/');
            
            if (isKuisionerPage) {
                // Masih di halaman kuesioner, tunggu lagi
                console.log('⏳ Menunggu kembali ke halaman KHS...');
                processNextKuisioner();
                return;
            }
            
            // Ambil ulang daftar link kuesioner (karena link yang sudah diisi akan hilang)
            kuisionerLinksList = getAllKuisionerLinks();
            
            // Jika tidak ada lagi link kuesioner, berarti sudah selesai
            if (kuisionerLinksList.length === 0) {
                console.log('✅ Semua kuesioner sudah selesai diisi!');
                return;
            }
            
            console.log(`\n🔄 Memproses kuesioner berikutnya... (Tersisa: ${kuisionerLinksList.length} kuesioner)`);
            
            // Ambil link pertama (karena link yang sudah diisi akan hilang dari daftar)
            const nextLink = kuisionerLinksList[0];
            if (nextLink) {
                console.log(`🌐 Membuka kuesioner berikutnya...`);
                nextLink.click();
                
                // Tunggu modal terbuka, lalu mulai autofill
                waitForModal(() => {
                    setTimeout(() => {
                        autoFillAndNavigate(() => {
                            // Setelah submit selesai, lanjut ke kuesioner berikutnya
                            processNextKuisioner();
                        });
                    }, 500);
                });
            } else {
                console.log('❌ Link kuesioner tidak ditemukan');
            }
        }, 1500);
    }

    // Fungsi untuk autofill semua kuesioner dari halaman utama KHS
    function autoFillAllKuisioner() {
        console.log('🔍 Mencari semua link "Isi Kuisioner"...');
        
        kuisionerLinksList = getAllKuisionerLinks();
        
        if (kuisionerLinksList.length === 0) {
            console.log('❌ Tidak ditemukan link "Isi Kuisioner"');
            return;
        }
        
        console.log(`✅ Ditemukan ${kuisionerLinksList.length} link kuesioner`);
        kuisionerLinksList.forEach((link, index) => {
            console.log(`  ${index + 1}. ${link.textContent.trim()}`);
        });
        
        // Mulai proses kuesioner pertama
        const nilai = getKuisionerValue();
        console.log(`\n🚀 Memulai proses autofill ${kuisionerLinksList.length} kuesioner dengan nilai ${nilai}...`);
        
        kuisionerLinksList[0].click();
        
        // Tunggu modal/halaman terbuka, lalu autofill
        waitForModal(() => {
            setTimeout(() => {
                autoFillAndNavigate(() => {
                    // Setelah submit selesai, lanjut ke kuesioner berikutnya
                    processNextKuisioner();
                });
            }, 500);
        });
    }

    // Deteksi apakah kita di halaman kuesioner atau halaman utama KHS
    function init() {
        const isKuisionerPage = window.location.href.includes('/kuisioner/');
        
        if (isKuisionerPage) {
            // Jika di halaman kuesioner, langsung autofill
            console.log('📍 Di halaman kuesioner, mulai autofill...');
            setTimeout(() => {
                autoFillAndNavigate();
            }, 500);
        } else {
            // Jika di halaman utama KHS, tambahkan tombol untuk autofill semua
            console.log('📍 Di halaman utama KHS');
            
            // Buat container untuk tombol
            const btnContainer = document.createElement('div');
            btnContainer.style.cssText = 'position: fixed; top: 10px; right: 10px; z-index: 9999; display: flex; flex-direction: column; gap: 8px;';
            
            // Buat tombol autofill
            const autoFillBtn = document.createElement('button');
            const currentValue = getKuisionerValue();
            autoFillBtn.textContent = `🤖 Autofill Semua Kuesioner (Nilai: ${currentValue})`;
            autoFillBtn.style.cssText = 'padding: 10px 20px; background: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; box-shadow: 0 2px 10px rgba(0,0,0,0.3); white-space: nowrap;';
            autoFillBtn.onclick = function() {
                const nilai = getKuisionerValue();
                const nilaiText = ['Sangat tidak setuju', 'Tidak setuju', 'Cukup setuju', 'Setuju', 'Sangat setuju'][nilai - 1];
                if (confirm(`Apakah Anda yakin ingin mengisi semua kuesioner dengan nilai ${nilai} (${nilaiText})? Tindakan ini tidak dapat dibatalkan.`)) {
                    autoFillAllKuisioner();
                }
            };
            
            // Buat tombol setting
            const settingsBtn = document.createElement('button');
            settingsBtn.textContent = '⚙️ Ubah Nilai';
            settingsBtn.style.cssText = 'padding: 8px 20px; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 12px; box-shadow: 0 2px 5px rgba(0,0,0,0.2);';
            settingsBtn.onclick = function() {
                const nilaiBaru = prompt(`Masukkan nilai kuesioner (1-5):\n\n1 = Sangat tidak setuju\n2 = Tidak setuju\n3 = Cukup setuju\n4 = Setuju\n5 = Sangat setuju\n\nNilai saat ini: ${getKuisionerValue()}`, getKuisionerValue());
                if (nilaiBaru !== null) {
                    const numValue = parseInt(nilaiBaru);
                    if (numValue >= 1 && numValue <= 5) {
                        setKuisionerValue(numValue);
                        autoFillBtn.textContent = `🤖 Autofill Semua Kuesioner (Nilai: ${numValue})`;
                        alert(`✅ Nilai kuesioner berhasil diubah ke: ${numValue}`);
                    } else {
                        alert('❌ Nilai harus antara 1-5');
                    }
                }
            };
            
            btnContainer.appendChild(autoFillBtn);
            btnContainer.appendChild(settingsBtn);
            document.body.appendChild(btnContainer);
            console.log(`✅ Tombol autofill ditambahkan (Nilai default: ${currentValue})`);
        }
    }

    // Jalankan saat halaman siap
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose fungsi ke global scope untuk debugging
    window.autoFillKuisioner = autoFillAndNavigate;
    window.fillAllWithValue = fillAllWithValue;
    window.getKuisionerValue = getKuisionerValue;
    window.setKuisionerValue = setKuisionerValue;
    // Backward compatibility
    window.fillAllWithFive = function() { return fillAllWithValue(5); };

})();

