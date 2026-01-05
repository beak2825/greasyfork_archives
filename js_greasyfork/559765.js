// ==UserScript==
// @name               Speed Input2
// @description        Speed Input for Dummy
// @version            0.7
// @run-at             document-start
// @match              https://*.kemkes.go.id/*
// @author             Fznhq
// @namespace          localhost
// @license            none
// @grant              GM.getValue
// @grant              GM.setValue
// @downloadURL https://update.greasyfork.org/scripts/559765/Speed%20Input2.user.js
// @updateURL https://update.greasyfork.org/scripts/559765/Speed%20Input2.meta.js
// ==/UserScript==

(function () {
    const $ = (q) => document.querySelector(q);

    function today() {
        const date = new Date();
        const year = date.getFullYear();
        const month = (1 + date.getMonth()).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        return day + "-" + month + "-" + year;
    }

    function setSelected(element) {
        if (element && !element.__init && !element.selected) {
            element.__init = true;
            element.selected = true;
        }
        return element;
    }

    function setInfo(element, value) {
        if (element && !element.value) {
            element.value = value;
        }
    }

    function buttonClick(element) {
        if (element && !element.__click) {
            element.__click = true;
            setTimeout(() => element.click(), 200);
        }
    }

    let check_age = false;

    async function action() {
        const path = location.pathname;

        if (path.includes("/Add")) {
            setSelected($('[name="jns_identitas"] [value="1"]'));
            setSelected($('[name="metode_deteksi_dini"] [value="dna"]'));
            setSelected($('#jkel [value="P"]'));
            setSelected($('[name="pekerjaan"] [value="Ibu rumah tangga"]'));
            setSelected($('[name="status_pernikahan"] [value="Menikah"]'));
            setSelected($('[name="status_hiv"] [value="Non ODHIV"]'));
            setSelected(
                $('[name="pendidikan_terakhir"] [value="SMA/ SMK/ Sederajat"]')
            );
            setSelected($('[name="status_ims"] [value="Tidak ada riwayat"]'));
            setSelected($('[name="riwayat_kanker"] [value="Tidak"]'));
            // setSelected($('[name="pendapatan"] [value="4"]'));
            const nik = $('[name="nik"]');
            if (nik && nik.value) GM.setValue("nik", nik.value);

            if (!check_age) {
                const age_f_sex = $('[name="usia_berhubungan"]');
                const age_f_preg = $('[name="usia_kehamilan"]');
                const age_f_birth = $('[name="usia_melahirkan"]');

                if (age_f_sex) {
                    check_age = true;

                    age_f_sex.addEventListener("blur", function () {
                        if (this.value.trim() === "") return;

                        const sex = Number(this.value);
                        const preg = Number(age_f_preg.value);
                        const birth = Number(age_f_birth.value);

                        if (preg && sex > preg)
                            alert(
                                "Umur berhubungan pertama kali lebih besar dari kehamilan."
                            );
                        else if (birth && sex > birth)
                            alert(
                                "Umur berhubungan pertama kali lebih besar dari kehamilan."
                            );
                    });

                    age_f_preg.addEventListener("blur", function () {
                        if (this.value.trim() === "") return;

                        const sex = Number(age_f_sex.value);
                        const preg = Number(this.value);
                        const birth = Number(age_f_birth.value);

                        if (sex && preg < sex) {
                            alert(
                                "Umur kehamilan lebih kecil dari berhubungan pertama kali."
                            );
                        } else if (birth && birth < preg) {
                            alert(
                                "Umur melahirkan lebih kecil dari kehamilan."
                            );
                        }
                    });

                    age_f_birth.addEventListener("blur", function () {
                        if (this.value.trim() === "") return;

                        const sex = Number(age_f_sex.value);
                        const preg = Number(age_f_preg.value);
                        const birth = Number(this.value);

                        if (preg && birth < preg)
                            alert(
                                "Umur melahirkan lebih kecil dari kehamilan."
                            );
                        else if (birth && birth < sex)
                            alert(
                                "Umur melahirkan lebih kecil dari berhubungan pertama kali."
                            );
                    });
                }
            }
        }

        if (path.includes("/spesimen")) {
            const nik = await GM.getValue("nik");
            const buttons = document.querySelectorAll("td .btn-warning");
            for (const btn of buttons) {
                const parent = btn.closest("tr");
                if (parent.innerText.includes(nik)) buttonClick(btn);
            }
        }

        if (path.includes("/VerifFaskes")) {
            const current = today();

            setSelected(
                $('[name="pengambilan_sampel"] [value="clinician-sampling"]')
            );
            setSelected($('#jenis_spesimen [value="14"]'));
            setInfo($('[name="tgl_pengambilan"]'), current);
            setInfo($('[name="tgl_kirim"]'), current);

            const lab = $('[name="lab"]');
            if (lab && lab.value != "c.215") {
                lab.value = "c.215";
                lab.dispatchEvent(new Event("change"));
            }

            const spesimen = $('[name="nomor_spesimen"]');
            if (spesimen && spesimen.value.startsWith("MC")) {
                spesimen.value = spesimen.value.replace("MC", "TMC-");
            }

            if (spesimen && spesimen.value.startsWith("TMC-")) {
                buttonClick($("form td button"));
            }
        }
    }

    window.addEventListener("load", action);
    document.addEventListener("input", action);
    document.addEventListener("change", action);
    new MutationObserver(action).observe(document, {
        subtree: true,
        childList: true,
        attributes: true,
    });
})();
