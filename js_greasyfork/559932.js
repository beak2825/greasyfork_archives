// ==UserScript==
// @name         Intake FR
// @namespace    http://tampermonkey.net/
// @version      1.1.25
// @description  Intkae inladen voor FR
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @connect      whisper.anzwerz.ai


// @downloadURL https://update.greasyfork.org/scripts/559932/Intake%20FR.user.js
// @updateURL https://update.greasyfork.org/scripts/559932/Intake%20FR.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('load', function() {

    function getPatientName() {

        // Pak de derde frame (index 2) uit het frameset
        const h3 = document.querySelector('h3.patient-card__name');
        if (h3){
            const patientName = h3.textContent;

            if (patientName) {
                console.log(patientName)
                return patientName.split(",")[0]
            }
        }

        return null
    }


    function storeConsultDate(){
        const datumEl = document.getElementById('frm_input_indication_date_datepicker');
        if (datumEl){
            console.log("element gevonden");
            const delen = datumEl.value.split(/[-/]/);
            const [dag, maand, jaar] = delen;
            const nieuweDatum = `${jaar}-${maand}-${dag}`;
            
            sessionStorage.setItem('consultDate', nieuweDatum);

        }
    }
    
    const patientName = getPatientName();
    storeConsultDate()
    const dateConsult = sessionStorage.getItem('consultDate');


    if (patientName === null){
        console.log("kan patiëntnaam niet vinden");
    } else if (dateConsult == null) {
        console.log("kan datum niet vinden");
        
    } else {
        console.log("haal data op")


       GM_xmlhttpRequest({
            method: "POST",
            url: "https://whisper.anzwerz.ai/api/v2/intake_fr/",
            headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': 'mijn-geheime-sleutel'
                },
            data: JSON.stringify({
                patient_name: patientName,
                date_of_consult: dateConsult
            }),
            onload: function (response) {

                const data = JSON.parse(response.responseText);
                console.log('Snowflake resultaat:', data);

                if (data.ok){
                    //aanmelding
                    const aanmelding = data.response.aanmelding_aanmelding;
                    const verwijsdatum = data.response.aanmelding_verwijsgegevens_verwijsdatum;
                    const verwijsdiagnose = data.response.aanmelding_verwijsgegevens_medische_verwijsdiagnose;  
                    
                    //anamnese
                    const patientbehoeften = data.response.anamnese_patientbehoeften;
                    const stoornissen = data.response.anamnese_stoornissen;
                    const historie = data.response.anamnese_historie;
                    const beperkingen = data.response.anamnese_beperkingen
                    const functioneringsproblemenSinds = data.response.anamnese_duur_functioneringsproblemen_aantal
                    const functioneringsproblemenEenheid = data.response.anamnese_duur_functioneringsproblemen_eenheid
                    const beloopTotNuToe = data.response.anamnese_beloop_tot_nu_toe;
                    const aangedaneZijde = data.response.anamnese_aangedane_zijde;
                    const klacht = data.response.anamnese_klacht;
                    
                    const medischeGezondheidsdeterminanten = data.response.anamnese_medische_gezondheidsdeterminanten_medisch
                    const persoonlijkeGezondheidsdeterminanten = data.response.anamnese_medische_gezondheidsdeterminanten_persoonlijk
                    const omgevingGezondheidsdeterminanten = data.response.anamnese_medische_gezondheidsdeterminanten_omgeving

                    const operatieOnderwerp = data.response.anamnese_medische_voorgeschiedenis_operatie_onderwerp
                    const operatieDatum = data.response.anamnese_medische_voorgeschiedenis_operatie_datum
                    const traumaOnderwerp = data.response.anamnese_medische_voorgeschiedenis_trauma_onderwerp
                    const traumaDatum = data.response.anamnese_medische_voorgeschiedenis_trauma_datum
                    const medicijnenOnderwerp = data.response.anamnese_medische_voorgeschiedenis_medicijnen_onderwerp
                    const medicijnenDatum = data.response.anamnese_medische_voorgeschiedenis_medicijnen_datum

                    //screening
                    const rodeVlaggenBesproken = data.response.screening_rode_vlaggen_besproken;
                    const conclusieScreening = data.response.screening_conclusie_screening;
                    const naOverlegHuisarts = data.response.screening_na_overleg_huisarts;
                    const inhoudBesproken = data.response.screening_inhoud_besproken;
                    const adviesContactOpnemenHA = data.response.screening_advies_contact_opnemen_ha;
                    const patientOnderzoeken = data.response.screening_patient_onderzoeken;

                    //onderzoek
                    const conclusieOnderzoek = data.response.onderzoek_conclusie_onderzoek;
                    const indicatieFysiotherapie = data.response.onderzoek_indicatie_fysiotherapie;
                    const chronisch = data.response.onderzoek_chronisch
                    const eersteAandoening = data.response.onderzoek_eerste_aandoening;
                    const verwachtHerstel = data.response.onderzoek_prognose_verwacht_herstel;
                    const verwachteDuurAantal = data.response.onderzoek_prognose_verwachte_duur_binnen;
                    const verwachteDuurEenheid = data.response.onderzoek_prognose_verwachte_duur_eenheid;
                    const aantalBehandelingen = data.response.onderzoek_prognose_aantal_behandelingen;

                    //behandelplan           
                    const hoofddoel = data.response.behandelplan_hoofddoel;
                    const toestemmingPatient = data.response.behandelplan_toestemming_patient;


                
                    //Aanmelding
                    const aanmeldingEl = document.getElementById('frm_input_treatment_origin');
                    if (aanmeldingEl) {

                        const aanmeldingEl = document.getElementById('frm_input_treatment_origin');


                            let dropdownDuurAanmelding = '0';
                            if (aanmeldingEl) {
                                
                                if (aanmelding) {
                                    const aanmeldingText = aanmelding.toLowerCase();
        
                                    if (aanmeldingText == 'verwijzing') {
                                        dropdownDuurAanmelding= 'send_by_referrer';
                                    } else if (aanmeldingText == 'dtf') {
                                        dropdownDuurAanmelding= 'direct_access_physiotherapy';
                                    }
                                }

                                aanmeldingEl.value = dropdownDuurAanmelding
                            }
                            aanmeldingEl.dispatchEvent(new Event('change', { bubbles: true }));
                        


                        const verwijsdatumEl = document.getElementById('frm_input_referral_date');
                        console.log(verwijsdatum)
                        console.log(verwijsdatumEl)
                        if (verwijsdatumEl && verwijsdatum) {
                            // const delen = verwijsdatum.value.split(/[-/]/);
                            // const [jaar, maand, dag] = delen;
                            // const nieuweDatum = `$${dag}-${maand}-{jaar}`;
                            // console.log(nieuweDatum)
                            verwijsdatumEl.value = verwijsdatum;
                        }

                        const verwijsdiagnoseEl = document.getElementById('frm_input_anamnesis[medical_referrerence_diagnosis');
                        console.log(verwijsdiagnoseEl)
                        if (verwijsdiagnoseEl && verwijsdiagnose) {
                            verwijsdiagnoseEl.innerHTML = verwijsdiagnose;
                            
                        }
                        
                        const rapport = {
                            aanmelding: checkveld(aanmeldingEl, data.response.aanmelding_aanmelding),
                            verwijsdatum: checkveld(verwijsdatumEl, data.response.aanmelding_verwijsgegevens_verwijsdatum),
                            verwijsdiagnose: checkveld(verwijsdiagnoseEl, data.response.aanmelding_verwijsgegevens_medische_verwijsdiagnose),
                        
                        };

                        console.log(rapport)
                        sendReport(rapport)

                    }

    ///////////////////////////////////////////////////////////////////////////////////
                
                    //Anamnese
                    
                    const patientbehoeftenEl = document.getElementById('frm_input_anamnesis[patient_needs]');
                    if (patientbehoeftenEl && patientbehoeftenEl.innerHTML == '') {

                        if (patientbehoeftenEl && patientbehoeften) {
                            patientbehoeftenEl.innerHTML = patientbehoeften;
                        }
                    
                        const stoornissenEl = document.getElementById('frm_input_anamnesis[disorders]');
                        if (stoornissenEl && stoornissen) {
                            stoornissenEl.innerHTML = stoornissen;
                        }

                        const historieEl = document.getElementById('frm_input_anamnesis[history]');
                        if (historieEl && historie) {
                            historieEl.innerHTML = historie;
                        }

                        const beperkingenEl = document.getElementById('frm_input_anamnesis[constraints]');
                        if (beperkingenEl && beperkingen) {
                            beperkingenEl.innerHTML = beperkingen;
                        }

                        const functioneringsproblemenSindsEl = document.getElementById('frm_input_anamnesis[functioning_problem_duration_value]');
                        if (functioneringsproblemenSindsEl && functioneringsproblemenSinds) {
                            console.log(functioneringsproblemenSinds)
                            functioneringsproblemenSindsEl.value = String(functioneringsproblemenSinds);
                        }
                        functioneringsproblemenSindsEl.dispatchEvent(new Event('change', { bubbles: true }));


                        const functioneringsproblemenEenheidEl = document.getElementById('frm_input_anamnesis[functioning_problem_duration_unit]');

                        let dropdownDuurKlacht = '0';
                        if (functioneringsproblemenEenheidEl) {
                            
                            if (functioneringsproblemenEenheid) {
                                const functioneringsproblemenEenheidText = functioneringsproblemenEenheid.toLowerCase();
    
                                if (functioneringsproblemenEenheidText == 'dag') {
                                    dropdownDuurKlacht = '54';
                                } else if (functioneringsproblemenEenheidText == 'dagen') {
                                    dropdownDuurKlacht = '53';
                                } else if (functioneringsproblemenEenheidText == 'week') {
                                    dropdownDuurKlacht = '52';
                                } else if (functioneringsproblemenEenheidText == 'weken') {
                                    dropdownDuurKlacht = '51';
                                } else if (functioneringsproblemenEenheidText == 'maand') {
                                dropdownDuurKlacht = '50';
                                } else if (functioneringsproblemenEenheidText == 'maanden') {
                                dropdownDuurKlacht = '49';
                                } else if (functioneringsproblemenEenheidText == 'jaar') {
                                dropdownDuurKlacht = '48';
                                } else if (functioneringsproblemenEenheidText == 'jaren') {
                                dropdownDuurKlacht = '47';
                                }
                            }

                            functioneringsproblemenEenheidEl.value = dropdownDuurKlacht
                        }
                        functioneringsproblemenEenheidEl.dispatchEvent(new Event('change', { bubbles: true }));



                        const toegenomenEl = document.getElementById('form_input_anamnesis[course_so_far]_46');
                        if (toegenomenEl && beloopTotNuToe && beloopTotNuToe == 'Toegenomen') {
                            toegenomenEl.checked = true;
                        }

                        const afgenomenEl = document.getElementById('form_input_anamnesis[course_so_far]_45');
                        if (afgenomenEl && beloopTotNuToe && beloopTotNuToe == 'Afgenomen') {
                            afgenomenEl.checked = true;
                        }

                        const nietGewijzigdEl = document.getElementById('form_input_anamnesis[course_so_far]_44');
                        if (nietGewijzigdEl && beloopTotNuToe && beloopTotNuToe == 'Niet gewijzigd') {
                            nietGewijzigdEl.checked = true;
                        }

                        const wisselendEl = document.getElementById('form_input_anamnesis[course_so_far]_43');
                        if (wisselendEl && beloopTotNuToe && beloopTotNuToe == 'Wisselend') {
                            wisselendEl.checked = true;
                        }

                        const aangedaneZijdeEl = document.getElementById('frm_input_involved_side');

                        let dropdownAangedaneZijde = '0';
                        if (aangedaneZijdeEl ) {
                            console.log(aangedaneZijde)
                            if (aangedaneZijde) {
        
                                if (aangedaneZijde == 'Geen zijde') {
                                    dropdownAangedaneZijde = 'no_side';
                                } else if (aangedaneZijde == 'Linker zijde') {
                                    dropdownAangedaneZijde = 'left_side';
                                } else if (aangedaneZijde == 'Rechter zijde') {
                                    dropdownAangedaneZijde = 'right_side';
                                } else if (aangedaneZijde == 'Beide zijdes') {
                                    dropdownAangedaneZijde = 'both_sides';
                                }
                            
                            }
                            aangedaneZijdeEl.value = dropdownAangedaneZijde
                        }
                        aangedaneZijdeEl.dispatchEvent(new Event('change', { bubbles: true }));


                        const klachtEl = document.getElementById('frm_input_complaint');

                        let dropdownKlacht = '0';
                        if (klachtEl ) {
                            
                            if (klacht) {
        
                                if (klacht == 'Chronisch ZorgNet - COPD') {
                                    dropdownKlacht = '22';
                                } else if (klacht == 'Chronisch ZorgNet - Hart') {
                                    dropdownKlacht = '23';
                                } else if (klacht == 'Chronisch ZorgNet - Osteoporose, vallen en breken') {
                                    dropdownKlacht = '21';
                                } else if (klacht == 'Chronisch ZorgNet - Perifeer Arterieel Vaatlijden') {
                                    dropdownKlacht = '20';
                                } else if (klacht == 'COPD') {
                                    dropdownKlacht = '16';
                                } else if (klacht == 'Covid-19') {
                                    dropdownKlacht = '17';
                                } else if (klacht == 'CWK') {
                                    dropdownKlacht = '1';
                                } else if (klacht == 'Duizeligheid') {
                                    dropdownKlacht = '24';
                                } else if (klacht == 'Elleboog') {
                                    dropdownKlacht = '2';
                                } else if (klacht == 'Enkel/Voet') {
                                    dropdownKlacht = '3';
                                } else if (klacht == 'Heup') {
                                    dropdownKlacht = '4';
                                } else if (klacht == 'Kaak') {
                                    dropdownKlacht = '5';
                                } else if (klacht == 'Knie') {
                                    dropdownKlacht = '6';
                                } else if (klacht == 'LWK') {
                                    dropdownKlacht = '7';
                                } else if (klacht == 'Neurologie') {
                                    dropdownKlacht = '8';
                                } else if (klacht == 'Oedeem') {
                                    dropdownKlacht = '19';
                                } else if (klacht == 'Oncologie') {
                                    dropdownKlacht = '9';
                                } else if (klacht == 'Parkinson') {
                                    dropdownKlacht = '10';
                                } else if (klacht == 'Pols/Hand') {
                                    dropdownKlacht = '11';
                                } else if (klacht == 'Psychosomatiek') {
                                    dropdownKlacht = '12';
                                } else if (klacht == 'Reumatologie') {
                                    dropdownKlacht = '13';
                                } else if (klacht == 'Schouder') {
                                    dropdownKlacht = '14';
                                } else if (klacht == 'Spierletsel') {
                                    dropdownKlacht = '18';
                                } else if (klacht == 'TWK') {
                                    dropdownKlacht = '15';

                                }
                            
                            }
                            klachtEl.value = dropdownKlacht
                        }
                        klachtEl.dispatchEvent(new Event('change', { bubbles: true }));
                    
                    // const button1 = document.querySelector('button[title="Medische voorgeschiedenis"]'); //Medische voorgeschiedenis

                    // //operatie
                    // if (button1 && operatieOnderwerp){
                    //     button1.click()
                    //     setTimeout(() => {
                    //         // code die NA de vertraging moet draaien
                    //         console.log('1 seconde later');
                    //         const button2 = document.querySelector('.js-btn-create');
                    //         button2.click()
                    //         const datumEl = document.getElementById('frm_input_medical_history_date_datepicker');

                    //         if (datumEl && operatieDatum){
                    //             datumEl.value = operatieDatum
                    //         }

                    //         const typeEl = document.getElementById('frm_input_medical_history_type');

                    //         if (typeEl) { 
                    //             console.log("operatie")
                    //             typeEl.value = "operation"
                    //         }

                    //         const onderwerpEl = document.querySelector('input[name="subject"]');
                    //         if (onderwerpEl){
                    //             onderwerpEl.value = operatieOnderwerp
                    //         }
                            
                    //     }, 1000); // 1000 ms = 1 seconde

                        
                    //     //send report
                    // }

                        //trauma
                    // if (button1 && traumaOnderwerp){
                    //     button1.click()
                    //     setTimeout(() => {
                    //         // code die NA de vertraging moet draaien
                    //         console.log('1 seconde later');
                    //     }, 1000); // 1000 ms = 1 seconde

                    //     const button2 = document.querySelector('.js-btn-create');
                    //     button2.click()
                    //     const datumEl = document.getElementById('frm_input_medical_history_date_datepicker');

                    //     if (datumEl && traumaDatum){
                    //         datumEl.value = traumaDatum
                    //     }

                    //     const typeEl = document.getElementById('frm_input_medical_history_type');

                    //     if (typeEl) { 
                    //         console.log("trauma")
                    //         typeEl.value = "trauma"
                    //     }

                    //     const onderwerpEl = document.querySelector('input[name="subject"]');
                    //     if (onderwerpEl){
                    //         onderwerpEl.value = traumaOnderwerp
                    //     }
                    //     //send report
                    // }

                    //medicijnen
                    // if (button1 && medicijnenOnderwerp){
                    //     button1.click()
                    //     setTimeout(() => {
                    //         // code die NA de vertraging moet draaien
                    //         console.log('1 seconde later');
                    //     }, 1000); // 1000 ms = 1 seconde

                    //     const button2 = document.querySelector('.js-btn-create');
                    //     button2.click()
                    //     const datumEl = document.getElementById('frm_input_medical_history_date_datepicker');

                    //     if (datumEl && medicijnenDatum){
                    //         datumEl.value = medicijnenDatum
                    //     }

                    //     const typeEl = document.getElementById('frm_input_medical_history_type');

                    //     if (typeEl) { 
                    //         console.log("medicijnen")
                    //         typeEl.value = "medication"
                    //     }

                    //     const onderwerpEl = document.querySelector('input[name="subject"]');
                    //     if (onderwerpEl){
                    //         onderwerpEl.value = medicijnenOnderwerp
                    //     }

                    //     //send report
                    // }

                    // const button3 = document.getElementById('medische_gezondheidsdeterminanten'); //Medische gezondheidsdeterminanten

                    // if (button3){
                    //     button3.click()
                    //     const medischEl = document.getElementById('frm_input_rif_modal_co-morbidity');

                    //     if (medischEl) {
                    //         medischEl.innerHTML = medischeGezondheidsdeterminanten
                    //     }

                    //     const persoonlijkEl = document.getElementById('frm_input_rif_modal_personal-context');

                    //     if (persoonlijkEl){
                    //         persoonlijkEl.innerHTML = persoonlijkeGezondheidsdeterminanten
                    //     }

                    //     const omgevingEl = document.getElementById('frm_input_rif_modal_participation-context');

                    //     if (omgevingEl){
                    //         omgevingEl.innerHTML = omgevingGezondheidsdeterminanten
                    //     }

                        
                    //     console.log("determinanten")
                    //     //send report

                    // }
                   
                        const rapport = {
                            patientbehoeften: checkveld(patientbehoeftenEl, data.response.anamnese_patientbehoeften),
                            stoornissen: checkveld(stoornissenEl,data.response.anamnese_stoornissen),
                            historie: checkveld(historieEl, data.response.anamnese_historie),
                            beperkingen: checkveld(beperkingenEl, data.response.anamnese_beperkingen),
                            functioneringsproblemen_sinds: checkveld(functioneringsproblemenSindsEl, data.response.anamnese_duur_functioneringsproblemen_sinds),
                            functioneringsproblemen_eenheid: checkveld(functioneringsproblemenEenheidEl, dropdownDuurKlacht),
                            beloop_toegenomen: checkveld(toegenomenEl, data.response.anamnese_beloop_tot_nu_toe, "Toegenomen"),
                            beloop_afgenomen: checkveld(afgenomenEl, data.response.anamnese_beloop_tot_nu_toe, "Afgenomen"),
                            beloop_niet_gewijzigd: checkveld(nietGewijzigdEl, data.response.anamnese_beloop_tot_nu_toe, "Niet gewijzigd"),
                            beloop_wisselend: checkveld(wisselendEl, data.response.anamnese_beloop_tot_nu_toe, "Wisselend"),   
                            aangedane_zijde: checkveld(aangedaneZijdeEl, dropdownAangedaneZijde),         
                            klacht: checkveld(klachtEl, dropdownKlacht), 
                        };

                        console.log(rapport)
                        sendReport(rapport)
                    }

    ///////////////////////////////////////////////////////////////////////////////////
                        
                //Screening
                // const patientOnderzoekenJaEl = document.getElementById('patient_screening_ja');
                // const patientOnderzoekenNeeEl = document.getElementById('patient_screening_nee');
                // if (patientOnderzoekenJaEl && !patientOnderzoekenJaEl.checked && patientOnderzoekenNeeEl && !patientOnderzoekenNeeEl.checked) {

                //     if (patientOnderzoeken.toLowerCase() == 'ja') {
                //         console.log("patiënt onderzoeken")
                //         patientOnderzoekenJaEl.checked = true
                //     }

                //     if (patientOnderzoeken.toLowerCase() == 'nee') {
                //         patientOnderzoekenNeeEl.checked = true
                //     }
                

                //     const rodeVlaggenBesprokenEl = document.getElementById('frm_input_anamnesis[screening][red_flags_discussed]');
                //     if (rodeVlaggenBesprokenEl && rodeVlaggenBesproken && rodeVlaggenBesproken.toLowerCase() === 'ja') {
                //         rodeVlaggenBesprokenEl.checked = true;
                //     }

                //     const conclusieScreening1El = document.getElementById('form_input_anamnesis[screening][conclusion_of_screening]_26');
                //     if (conclusieScreening1El && conclusieScreening && conclusieScreening == 'De symptomen passen in een herkenbaar profiel') {
                //         conclusieScreening1El.checked = true;
                //     }

                //     const conclusieScreening2El = document.getElementById('form_input_anamnesis[screening][conclusion_of_screening]_25');
                //     if (conclusieScreening2El && conclusieScreening && conclusieScreening == 'De symptomen passen in een herkenbaar profiel, maar er is sprake van mogelijk ernstige pathologie') {
                //         conclusieScreening2El.checked = true;
                //     }

                //     const conclusieScreening3El = document.getElementById('form_input_anamnesis[screening][conclusion_of_screening]_24');
                //     if (conclusieScreening3El && conclusieScreening && conclusieScreening == 'De symptomen passen in een herkenbaar profiel, maar kunnen beter door een andere hulpverlener behandeld worden') {
                //         conclusieScreening3El.checked = true;
                //     }

                //     const conclusieScreening4El = document.getElementById('form_input_anamnesis[screening][conclusion_of_screening]_23');
                //     if (conclusieScreening4El && conclusieScreening && conclusieScreening == 'De symptomen passen in een niet herkenbaar profiel') {
                //         conclusieScreening4El.checked = true;
                //     }

                //     const naOverlegHuisartsEl = document.getElementById('frm_input_anamnesis[screening][decided_to_do_more_examination_after_consulting_general_practitioner]');
                //     if (naOverlegHuisartsEl && naOverlegHuisarts && naOverlegHuisarts.toLowerCase() === 'ja') {
                //         naOverlegHuisartsEl.checked = true;
                //     }

                //     const inhoudBesprokenEl = document.getElementById('frm_input_anamnesis[screening][content_of_screening_form_is_discussed_with_patient]');
                //     if (inhoudBesprokenEl && inhoudBesproken && inhoudBesproken.toLowerCase() === 'ja') {
                //         inhoudBesprokenEl.checked = true;
                //     }

                //     const adviesContactOpnemenHAEl = document.getElementById('frm_input_anamnesis[screening][patient_is_advised_to_contact_general_practitioner]');
                //     if (adviesContactOpnemenHAEl && adviesContactOpnemenHA && adviesContactOpnemenHA.toLowerCase() === 'ja') {
                //         adviesContactOpnemenHAEl.checked = true;
                //     }

                    
                //     const rapport = {
                //         rode_vlaggen_besproken: checkveld(rodeVlaggenBesprokenEl,data.response.screening_rode_vlaggen_besproken,"ja"),
                //         na_overleg_huisarts: checkveld(naOverlegHuisartsEl,data.response.screening_na_overleg_huisarts,"ja"),
                //         conclusie_screening: checkveld(conclusieScreening1El,data.response.screening_conclusie_screening,"De symptomen passen in een herkenbaar profiel"),
                //         conclusie_screening: checkveld(conclusieScreening2El,data.response.screening_conclusie_screening,"De symptomen passen in een herkenbaar profiel, maar er is sprake van mogelijk ernstige pathologie"),
                //         conclusie_screening: checkveld(conclusieScreening3El,data.response.screening_conclusie_screening,"De symptomen passen in een herkenbaar profiel, maar kunnen beter door een andere hulpverlener behandeld worden"),
                //         conclusie_screening: checkveld(conclusieScreening4El,data.response.screening_conclusie_screening,"De symptomen passen in een niet herkenbaar profiel"),
                //         inhoud_besproken: checkveld(inhoudBesprokenEl,data.response.screening_inhoud_besproken,"ja"),
                //         advies_contact_opnemen_ha: checkveld(adviesContactOpnemenHAEl,data.response.screening_advies_contact_opnemen_ha,"ja"),
                //         patient_onderzoeken_ja: checkveld(patientOnderzoekenJaEl,data.response.screening_patient_onderzoeken,"ja"),
                //         patient_onderzoeken_nee: checkveld(patientOnderzoekenNeeEl,data.response.screening_patient_onderzoeken,"nee"),
                        
                      
                //     };

                //     console.log(rapport)
                //     sendReport(rapport)
                // }

    ///////////////////////////////////////////////////////////////////////////////////

                //Onderzoek

                // const verwachtHerstelEl = document.getElementById('frm_input_anamnesis[recovery_prognosis]');

                // if (verwachtHerstelEl && verwachtHerstelEl.value == ''){

                //     let dropdownHerstel = '0';
     
                //     if (verwachtHerstel) {
    
                //         if (verwachtHerstel == 'Volledig herstel') {
                //             dropdownHerstel  = '42';
                //         } else if (verwachtHerstel == 'Reductie') {
                //             dropdownHerstel  = '41';
                //         } else if (verwachtHerstel == 'Stabilisatie') {
                //             dropdownHerstel  = '40';
                //         } else if (verwachtHerstel == 'Handhaven of verminderen van progressie') {
                //             dropdownHerstel  = '39';
                //         }
                        
                //     }
                //     verwachtHerstelEl.value = dropdownHerstel 


                //     const indicatieFysiotherapieJaEl = document.getElementById('form_input_anamnesis[indication_physical_therapy]_28');
                //     if (indicatieFysiotherapieJaEl && indicatieFysiotherapie && indicatieFysiotherapie.toLowerCase() == 'ja') {
                //         indicatieFysiotherapieJaEl.checked = true;
                //     }

                //     const indicatieFysiotherapieNeeEl = document.getElementById('form_input_anamnesis[indication_physical_therapy]_27');
                //     if (indicatieFysiotherapieNeeEl && indicatieFysiotherapie && indicatieFysiotherapie.toLowerCase() == 'nee') {
                //         indicatieFysiotherapieNeeEl.checked = true;
                //     }

                //     const chronischEl = document.getElementById('frm_input_is_chronic');
                //     if (chronischEl && chronisch && chronisch.toLowerCase() === 'ja') {
                //         chronischEl.checked = true;
                //     }

                //     const eersteAandoeningEl = document.getElementById('frm_input_is_first_illness');
                //     if (eersteAandoeningEl && eersteAandoening && eersteAandoening.toLowerCase() === 'ja') {
                //         eersteAandoeningEl.checked = true;
                //     }

                //     const verwachteDuurAantalEl = document.getElementById('frm_input_anamnesis[recovery_prognosis_duration_value]');
                //     if (verwachteDuurAantalEl && verwachteDuurAantal) {
                //         verwachteDuurAantalEl.value = verwachteDuurAantal;
                //     }

                //     const verwachteDuurEenheidEl = document.getElementById('frm_input_anamnesis[recovery_prognosis_duration_unit]');
                //     let dropdownVerwachteDuur = '0';
                //     if (verwachteDuurEenheidEl) {
                        
                //         if (verwachteDuurEenheid) {
                //             const verwachteDuurEenheidText = verwachteDuurEenheid.toLowerCase();
 
                //             if (verwachteDuurEenheidText == 'dag') {
                //                 dropdownVerwachteDuur = '38';
                //             } else if (verwachteDuurEenheidText == 'dagen') {
                //                 dropdownVerwachteDuur = '37';
                //             } else if (verwachteDuurEenheidText == 'week') {
                //                 dropdownVerwachteDuur = '36';
                //             } else if (verwachteDuurEenheidText == 'weken') {
                //                 dropdownVerwachteDuur = '35';
                //             } else if (verwachteDuurEenheidText == 'maand') {
                //                dropdownVerwachteDuur = '34';
                //             } else if (verwachteDuurEenheidText == 'maanden') {
                //                dropdownVerwachteDuur = '33';
                //             } else if (verwachteDuurEenheidText == 'jaar') {
                //                dropdownVerwachteDuur = '32';
                //             } else if (verwachteDuurEenheidText == 'jaren') {
                //                dropdownVerwachteDuur = '31';
                //             }
                //         }

                //         verwachteDuurEenheidEl.value = dropdownVerwachteDuur
                //     }

                //     const aantalBehandelingenEl = document.getElementById('frm_input_anamnesis[prognosis_number_of_treatments]');
                //     if (aantalBehandelingenEl && aantalBehandelingen) {
                //         aantalBehandelingenEl.value = aantalBehandelingen;
                //     }
                   

                //     const rapport = {
                //         indicatie_fysio_niet: checkveld(indicatieFysiotherapieNeeEl,data.response.onderzoek_indicatie_fysiotherapie,"nee"),
                //         indicatie_fysio_wel: checkveld(indicatieFysiotherapieJaEl,data.response.onderzoek_indicatie_fysiotherapie,"ja"),
                //         chronisch: checkveld(chronischEl,data.response.onderzoek_chronisch,"ja"),
                //         eerste_aandoening: checkveld(eersteAandoeningEl,data.response.onderzoek_eerste_aandoening,"ja"),
                //         verwacht_herstel: checkveld(verwachtHerstelEl,dropdownHerstel),
                //         verwachte_duur_aantal: checkveld(verwachteDuurAantalEl,data.response.onderzoek_prognose_verwachte_duur_binnen),
                //         verwachte_duur_eenheid: checkveld(verwachteDuurEenheidEl,dropdownVerwachteDuur),
                //         aantal_behandelingen: checkveld(aantalBehandelingenEl,data.response.onderzoek_prognose_aantal_behandelingen)                       
                //     };
 
                //     console.log(rapport)
                //     sendReport(rapport)
                // }

    ///////////////////////////////////////////////////////////////////////////////////

                //Behandelplan
        //         const hoofddoelEl = document.getElementById('frm_input_anamnesis[intended_maingoal]');
        //         if (hoofddoelEl && hoofddoelEl.innerHTML == '') {

        //             if (hoofddoelEl && hoofddoel) {
        //                 hoofddoelEl.innerHTML = hoofddoel;
        //             }

        //             const toestemmingPatientEl = document.getElementById('frm_input_anamnesis[patient_gives_permission_according_to_treatmentplan_and_maingoal]');
        //             if (toestemmingPatientEl && toestemmingPatient && toestemmingPatient.toLowerCase() === 'ja') {
        //                 toestemmingPatientEl.checked = true;
        //             }

                    
        //             const rapport = {
        //                 hoofddoel: checkveld(hoofddoelEl, data.response.behandelplan_hoofddoel),
        //                 toestemming_patient: checkveld(toestemmingPatientEl,data.response.behandelplan_toestemming_patient, 'ja'),
        //             };

        //             console.log(rapport)
        //             sendReport(rapport)
        //         }
             }
        },
        onerror: function (err) {
                sendError(err);
            }
                
        });

    }


    function checkveld (el, input, checkboxValue=null) {
        if (!el) return { status: 'element niet gevonden', succes: false };

        if (el.tagName === 'TEXTAREA'){
            if (el.innerHTML){
                if (el.innerHTML.trim().replace(/\s+/g, '')  !== input.trim().replace(/\s+/g, '') ) return {
                    status: 'niet goed ingevuld', 
                    succes: false,
                    ingevuld: el.innerHTML.trim().replace(/\s+/g, ''),
                    opgehaald: input.trim().replace(/\s+/g, '')
                }
        }
        } else if (el.tagName === 'INPUT' && el.type === 'checkbox'){
            if (input) { 
                if (el.checked !== (input.toLowerCase() === checkboxValue.toLowerCase())) return {
                    status: 'niet goed ingevuld', 
                    succes: false,
                    ingevuld: el.checked,
                    opgehaald: input.toLowerCase(),
                    checkbox_waarde: checkboxValue.toLowerCase()
                }
            }
        } else if (el.tagName === 'INPUT' && el.type === 'date'){
            if (el.value && el.value !== input) return {
                status: 'niet goed ingevuld', 
                succes: false,
                ingevuld: el.value,
                opgehaald: input
            }
        } else if (el.tagName === 'INPUT' && el.type === 'text'){
            if (el.getAttribute('data-slider') === 'true') {
                if (el !== input) return {
                    status: 'niet goed ingevuld', 
                    succes: false,
                    ingevuld: el,
                    opgehaald: input
                }
            } else {
                if (el.value !== input) return {
                    status: 'niet goed ingevuld', 
                    succes: false,
                    ingevuld: el.value,
                    opgehaald: input
                }
            }
        } else if (el.tagName === 'SELECT') {
            if (el.value && el.value !== input) return { 
                status: 'niet goed ingevuld', 
                succes: false,
                ingevuld: el.value,
                opgehaald: input
            };
        } else if (el.tagName === 'INPUT' && el.type === 'radio') {

            if (input) { 
                if (el.checked !== (input.toLowerCase() === checkboxValue.toLowerCase())) return {
                    status: 'niet goed ingevuld', 
                    succes: false,
                    ingevuld: el.checked,
                    opgehaald: input.toLowerCase(),
                    checkbox_waarde: checkboxValue.toLowerCase()
                }
            }
        }

        return {status: 'ok', succes: true}
        
    }

    function sendReport(rapport){

        const allesOK = Object.values(rapport).every(v => v.status === 'ok' && v.succes === true);
        console.log(allesOK)

        console.log(new Date().toISOString())
        console.log(allesOK ? 'succes' : 'fouten')
        console.log(rapport)
        console.log(patientName)

        GM_xmlhttpRequest({
            method: "POST",
            url: 'https://whisper.anzwerz.ai/api/som-feedback',
            headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': 'mijn-geheime-sleutel'
                },
            data: JSON.stringify({
                timestamp: new Date().toISOString(),
                result: allesOK ? 'ok' : 'not ok',
                details: rapport,
                consult_type: 'behandeling',
                patient_number: patientName
            }),
            onload: function (response) {
                console.log(response)
            },
            onerror: function (err) {
                sendError(err);
            }
        });
    }

    function sendError(err){
        console.error("❌ Fout bij ophalen of verwerken van data:", err);
         GM_xmlhttpRequest({
            method: "POST",
            url: 'https://whisper.anzwerz.ai/api/som-feedback',
            headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': 'mijn-geheime-sleutel'
                },
            data: JSON.stringify({ error_description: err.message,
                                    error_log: err.stack,
                                    error_type: err.name
            }),
            onload: function (response) {
                    console.log(response)
                },
            onerror: function (err) {
                    console.error("Niet gelukt om error te loggen", err);
                }
        });
    }

}, false);
})();