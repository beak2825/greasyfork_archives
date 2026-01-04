// ==UserScript==
// @name         Intake FR
// @namespace    http://tampermonkey.net/
// @version      1.1.5
// @description  Intkae inladen voor FR
// @match        *://*/*
// @grant        none


// @downloadURL https://update.greasyfork.org/scripts/559932/Intake%20FR.user.js
// @updateURL https://update.greasyfork.org/scripts/559932/Intake%20FR.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('load', function() {

    function getPatientName() {

        // Pak de derde frame (index 2) uit het frameset
        const h3 = document.querySelector('h3.patient-card__name');
        const patientName = h3.textContent;

        if (patientName) {
            console.log(patientName)
            return patientName.split(",")[0]
        }

        return null
    }


    function storeConsultDate(){
        const datumEl = document.getElementById('frm_input_indication_date_datepicker');
        if (datumEl){
            console.log("element gevonden");
            sessionStorage.setItem('consultDate', datumEl.value);

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


        fetch("https://whisper.anzwerz.ai/api/v2/intake_fr/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': 'mijn-geheime-sleutel'
            },
            body: JSON.stringify({ patient_name: patientName,
                                   date_of_consult: dateConsult
             })
        })
        .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json(); 
        })
        .then(data => {
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
                const functioneringsproblemenSinds = data.response.anamnese_duur_functioneringsproblemen_sinds
                const functioneringsproblemenEenheid = data.response.anamnese_duur_functioneringsproblemen_eenheid
                const beloopTotNuToe = data.response.anamnese_beloop_tot_nu_toe;
                const aangedaneZijde = data.response.anamnese_aangedane_zijde;
                const klacht = data.response.anamnese_klacht;

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


                const checkveld = (el, input, checkboxValue=null) => {
                    if (!el) return { status: 'element niet gevonden', succes: false };

                    if (el.tagName === 'TEXTAREA'){
                        if (el.innerHTML.trim().replace(/\s+/g, '')  !== input.trim().replace(/\s+/g, '') ) return {
                            status: 'niet goed ingevuld', 
                            succes: false,
                            ingevuld: el.innerHTML.trim().replace(/\s+/g, ''),
                            opgehaald: input.trim().replace(/\s+/g, '')
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

                //Aanmelding
                const aanmeldingEl = document.getElementById('frm_input_treatment_origin');
                if (aanmeldingEl && aanmeldingEl.value == '') {
                    if (aanmeldingEl && aanmelding) {
                        aanmeldingEl.value = aanmelding;
                    }

                    const verwijsdatumEl = document.getElementById('frm_input_referral_date_datepicker');
                    if (verwijsdatumEl && verwijsdatum) {
                        verwijsdatumEl.value = verwijsdatum;
                    }

                    const verwijsdiagnoseEl = document.querySelector('textarea[name="anamnesis[medical_refererence_diagnosis]"]');
                    console.log(verwijsdiagnoseEl)
                    if (verwijsdiagnoseEl && verwijsdiagnose) {
                        verwijsdiagnoseEl.value = verwijsdiagnose;
                        
                    }



    ////////////////////////////////////////////////////////////////////////////////////////////
                    
                    const rapport = {
                        aanmelding: checkveld(aanmeldingEl, data.response.aanmelding_aanmelding),
                        verwijsdatum: checkveld(verwijsdatumEl, data.response.aanmelding_verwijsgegevens_verwijsdatum),
                        verwijsdiagnose: checkveld(verwijsdiagnoseEl, data.response.aanmelding_verwijsgegevens_medische_verwijsdiagnose),
                    
                    };

                    const allesOK = Object.values(rapport).every(v => v.status === 'ok' && v.succes === true);

                    console.log(rapport)


                    // ✅ Stuur terug naar het systeem
                    fetch('https://whisper.anzwerz.ai/api/som-feedback', {
                        method: 'POST',
                        headers: {
                        'Content-Type': 'application/json',
                        'X-API-Key': 'mijn-geheime-sleutel'
                    },
                        body: JSON.stringify({
                            timestamp: new Date().toISOString(),
                            result: allesOK ? 'ok' : 'not ok',
                            details: rapport,
                            consult_type: 'intake - aanmelding',
                            patient_number: String(patientName)
                        })
                    })
                    .then(r => {
                        if (!r.ok) {
                            console.warn('Feedback verzenden mislukt:', r.status);
                        }
                    })
                    .catch(err => console.error('Fout bij terugsturen feedback:', err));

                }

    ///////////////////////////////////////////////////////////////////////////////////
                
                //Anamnese
                
                const patientbehoeftenEl = document.querySelector('textarea[name="anamnesis[patient_needs]"]');
                if (patientbehoeftenEl && patientbehoeftenEl.innerHTML == '') {

                    if (patientbehoeftenEl && patientbehoeften) {
                        patientbehoeftenEl.innerHTML = patientbehoeften;
                    }
                
                    const stoornissenEl = document.querySelector('textarea[name="anamnesis[disorders]"]');
                    if (stoornissenEl && stoornissen) {
                        stoornissenEl.innerHTML = stoornissen;
                    }

                    const historieEl = document.querySelector('textarea[name="anamnesis[history]"]');
                    if (historieEl && historie) {
                        historieEl.innerHTML = historie;
                    }

                    const beperkingenEl = document.querySelector('textarea[name="anamnesis[constraints]"]');
                    if (beperkingenEl && beperkingen) {
                        beperkingenEl.innerHTML = beperkingen;
                    }

                    const functioneringsproblemenSindsEl = document.getElementById('frm_input_anamnesis[functioning_problem_duration_value]');
                    if (functioneringsproblemenSindsEl && functioneringsproblemenSinds) {
                        functioneringsproblemenSindsEl.value = functioneringsproblemenSinds;
                    }


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


    ////////////////////////////////////////////////////////////////////////////////////////////
                    
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

                    const allesOK = Object.values(rapport).every(v => v.status === 'ok' && v.succes === true);

                    console.log(rapport)

                    // ✅ Stuur terug naar het systeem
                    fetch('https://whisper.anzwerz.ai/api/som-feedback', {
                        method: 'POST',
                        headers: {
                        'Content-Type': 'application/json',
                        'X-API-Key': 'mijn-geheime-sleutel'
                    },
                        body: JSON.stringify({
                            timestamp: new Date().toISOString(),
                            result: allesOK ? 'ok' : 'not ok',
                            details: rapport,
                            consult_type: 'intake - anamnese',
                            patient_number: String(patientName)
                        })
                    })
                    .then(r => {
                        if (!r.ok) {
                            console.warn('Feedback verzenden mislukt:', r.status);
                        }
                    })
                    .catch(err => console.error('Fout bij terugsturen feedback:', err));
                }

    ///////////////////////////////////////////////////////////////////////////////////
                        
                //Screening
                const patientOnderzoekenJaEl = document.getElementById('patient_screening_ja');
                const patientOnderzoekenNeeEl = document.getElementById('patient_screening_nee');
                if (patientOnderzoekenJaEl && !patientOnderzoekenJaEl.checked && patientOnderzoekenNeeEl && !patientOnderzoekenNeeEl.checked) {

                    if (patientOnderzoeken.toLowerCase() == 'ja') {
                        console.log("patiënt onderzoeken")
                        patientOnderzoekenJaEl.checked = true
                    }

                    if (patientOnderzoeken.toLowerCase() == 'nee') {
                        patientOnderzoekenNeeEl.checked = true
                    }
                

                    const rodeVlaggenBesprokenEl = document.getElementById('frm_input_anamnesis[screening][red_flags_discussed]');
                    if (rodeVlaggenBesprokenEl && rodeVlaggenBesproken && rodeVlaggenBesproken.toLowerCase() === 'ja') {
                        rodeVlaggenBesprokenEl.checked = true;
                    }

                    const conclusieScreening1El = document.getElementById('form_input_anamnesis[screening][conclusion_of_screening]_26');
                    if (conclusieScreening1El && conclusieScreening && conclusieScreening == 'De symptomen passen in een herkenbaar profiel') {
                        conclusieScreening1El.checked = true;
                    }

                    const conclusieScreening2El = document.getElementById('form_input_anamnesis[screening][conclusion_of_screening]_25');
                    if (conclusieScreening2El && conclusieScreening && conclusieScreening == 'De symptomen passen in een herkenbaar profiel, maar er is sprake van mogelijk ernstige pathologie') {
                        conclusieScreening2El.checked = true;
                    }

                    const conclusieScreening3El = document.getElementById('form_input_anamnesis[screening][conclusion_of_screening]_24');
                    if (conclusieScreening3El && conclusieScreening && conclusieScreening == 'De symptomen passen in een herkenbaar profiel, maar kunnen beter door een andere hulpverlener behandeld worden') {
                        conclusieScreening3El.checked = true;
                    }

                    const conclusieScreening4El = document.getElementById('form_input_anamnesis[screening][conclusion_of_screening]_23');
                    if (conclusieScreening4El && conclusieScreening && conclusieScreening == 'De symptomen passen in een niet herkenbaar profiel') {
                        conclusieScreening4El.checked = true;
                    }

                    const naOverlegHuisartsEl = document.getElementById('frm_input_anamnesis[screening][decided_to_do_more_examination_after_consulting_general_practitioner]');
                    if (naOverlegHuisartsEl && naOverlegHuisarts && naOverlegHuisarts.toLowerCase() === 'ja') {
                        naOverlegHuisartsEl.checked = true;
                    }

                    const inhoudBesprokenEl = document.getElementById('frm_input_anamnesis[screening][content_of_screening_form_is_discussed_with_patient]');
                    if (inhoudBesprokenEl && inhoudBesproken && inhoudBesproken.toLowerCase() === 'ja') {
                        inhoudBesprokenEl.checked = true;
                    }

                    const adviesContactOpnemenHAEl = document.getElementById('frm_input_anamnesis[screening][patient_is_advised_to_contact_general_practitioner]');
                    if (adviesContactOpnemenHAEl && adviesContactOpnemenHA && adviesContactOpnemenHA.toLowerCase() === 'ja') {
                        adviesContactOpnemenHAEl.checked = true;
                    }


    ////////////////////////////////////////////////////////////////////////////////////////////
                    
                    const rapport = {
                        rode_vlaggen_besproken: checkveld(rodeVlaggenBesprokenEl,data.response.screening_rode_vlaggen_besproken,"ja"),
                        na_overleg_huisarts: checkveld(naOverlegHuisartsEl,data.response.screening_na_overleg_huisarts,"ja"),
                        conclusie_screening: checkveld(conclusieScreening1El,data.response.screening_conclusie_screening,"De symptomen passen in een herkenbaar profiel"),
                        conclusie_screening: checkveld(conclusieScreening2El,data.response.screening_conclusie_screening,"De symptomen passen in een herkenbaar profiel, maar er is sprake van mogelijk ernstige pathologie"),
                        conclusie_screening: checkveld(conclusieScreening3El,data.response.screening_conclusie_screening,"De symptomen passen in een herkenbaar profiel, maar kunnen beter door een andere hulpverlener behandeld worden"),
                        conclusie_screening: checkveld(conclusieScreening4El,data.response.screening_conclusie_screening,"De symptomen passen in een niet herkenbaar profiel"),
                        inhoud_besproken: checkveld(inhoudBesprokenEl,data.response.screening_inhoud_besproken,"ja"),
                        advies_contact_opnemen_ha: checkveld(adviesContactOpnemenHAEl,data.response.screening_advies_contact_opnemen_ha,"ja"),
                        patient_onderzoeken_ja: checkveld(patientOnderzoekenJaEl,data.response.screening_patient_onderzoeken,"ja"),
                        patient_onderzoeken_nee: checkveld(patientOnderzoekenNeeEl,data.response.screening_patient_onderzoeken,"nee"),
                        
                      
                    };

                    const allesOK = Object.values(rapport).every(v => v.status === 'ok' && v.succes === true);

                    console.log(rapport)


                    // ✅ Stuur terug naar het systeem
                    fetch('https://whisper.anzwerz.ai/api/som-feedback', {
                        method: 'POST',
                        headers: {
                        'Content-Type': 'application/json',
                        'X-API-Key': 'mijn-geheime-sleutel'
                    },
                        body: JSON.stringify({
                            timestamp: new Date().toISOString(),
                            result: allesOK ? 'ok' : 'not ok',
                            details: rapport,
                            consult_type: 'intake - screening',
                            patient_number: String(patientName)
                        })
                    })
                    .then(r => {
                        if (!r.ok) {
                            console.warn('Feedback verzenden mislukt:', r.status);
                        }
                    })
                    .catch(err => console.error('Fout bij terugsturen feedback:', err));

                } 

    ///////////////////////////////////////////////////////////////////////////////////

                //Onderzoek

                const verwachtHerstelEl = document.getElementById('frm_input_anamnesis[recovery_prognosis]');

                if (verwachtHerstelEl && verwachtHerstelEl.value == ''){

                    let dropdownHerstel = '0';
     
                    if (verwachtHerstel) {
    
                        if (verwachtHerstel == 'Volledig herstel') {
                            dropdownHerstel  = '42';
                        } else if (aangedaneZijde == 'Reductie') {
                            dropdownHerstel  = '41';
                        } else if (aangedaneZijde == 'Stabilisatie') {
                            dropdownHerstel  = '40';
                        } else if (aangedaneZijde == 'Handhaven of verminderen progressie') {
                            dropdownHerstel  = '39';
                        }
                        
                    }
                    verwachtHerstelEl.value = dropdownHerstel 


                    const indicatieFysiotherapieJaEl = document.getElementById('form_input_anamnesis[indication_physical_therapy]_28');
                    if (indicatieFysiotherapieJaEl && indicatieFysiotherapie && indicatieFysiotherapie.toLowerCase() == 'ja') {
                        indicatieFysiotherapieJaEl.checked = true;
                    }

                    const indicatieFysiotherapieNeeEl = document.getElementById('form_input_anamnesis[indication_physical_therapy]_27');
                    if (indicatieFysiotherapieNeeEl && indicatieFysiotherapie && indicatieFysiotherapie.toLowerCase() == 'nee') {
                        indicatieFysiotherapieNeeEl.checked = true;
                    }

                    const chronischEl = document.getElementById('frm_input_is_chronic');
                    if (chronischEl && chronisch && chronisch.toLowerCase() === 'ja') {
                        chronischEl.checked = true;
                    }

                    const eersteAandoeningEl = document.getElementById('frm_input_is_first_illness');
                    if (eersteAandoeningEl && eersteAandoening && eersteAandoening.toLowerCase() === 'ja') {
                        eersteAandoeningEl.checked = true;
                    }

                    const verwachteDuurAantalEl = document.getElementById('frm_input_anamnesis[recovery_prognosis_duration_value]');
                    if (verwachteDuurAantalEl && verwachteDuurAantal) {
                        verwachteDuurAantalEl.value = verwachteDuurAantal;
                    }

                    const verwachteDuurEenheidEl = document.getElementById('frm_input_anamnesis[recovery_prognosis_duration_unit]');
                    let dropdownVerwachteDuur = '0';
                    if (verwachteDuurEenheidEl) {
                        
                        if (verwachteDuurEenheid) {
                            const verwachteDuurEenheidText = verwachteDuurEenheid.toLowerCase();
 
                            if (verwachteDuurEenheidText == 'dag') {
                                dropdownVerwachteDuur = '38';
                            } else if (verwachteDuurEenheidText == 'dagen') {
                                dropdownVerwachteDuur = '37';
                            } else if (verwachteDuurEenheidText == 'week') {
                                dropdownVerwachteDuur = '36';
                            } else if (verwachteDuurEenheidText == 'weken') {
                                dropdownVerwachteDuur = '35';
                            } else if (verwachteDuurEenheidText == 'maand') {
                               dropdownVerwachteDuur = '34';
                            } else if (verwachteDuurEenheidText == 'maanden') {
                               dropdownVerwachteDuur = '33';
                            } else if (verwachteDuurEenheidText == 'jaar') {
                               dropdownVerwachteDuur = '32';
                            } else if (verwachteDuurEenheidText == 'jaren') {
                               dropdownVerwachteDuur = '31';
                            }
                        }

                        verwachteDuurEenheidEl.value = dropdownVerwachteDuur
                    }

                    const aantalBehandelingenEl = document.getElementById('frm_input_anamnesis[prognosis_number_of_treatments]');
                    if (aantalBehandelingenEl && aantalBehandelingen) {
                        aantalBehandelingenEl.value = aantalBehandelingen;
                    }



                ////////////////////////////////////////////////////////////////////////////////////////////
                    

                    const rapport = {
                        indicatie_fysio_niet: checkveld(indicatieFysiotherapieNeeEl,data.response.onderzoek_indicatie_fysiotherapie,"nee"),
                        indicatie_fysio_wel: checkveld(indicatieFysiotherapieJaEl,data.response.onderzoek_indicatie_fysiotherapie,"ja"),
                        chronisch: checkveld(chronischEl,data.response.onderzoek_chronisch,"ja"),
                        eerste_aandoening: checkveld(eersteAandoeningEl,data.response.onderzoek_eerste_aandoening,"ja"),
                        verwacht_herstel: checkveld(verwachtHerstelEl,dropdownHerstel),
                        verwachte_duur_aantal: checkveld(verwachteDuurAantalEl,data.response.onderzoek_prognose_verwachte_duur_binnen),
                        verwachte_duur_eenheid: checkveld(verwachteDuurEenheidEl,dropdownVerwachteDuur),
                        aantal_behandelingen: checkveld(aantalBehandelingenEl,data.response.onderzoek_prognose_aantal_behandelingen)                       
                    };


                    const allesOK = Object.values(rapport).every(v => v.status === 'ok' && v.succes === true);
 
                    console.log(rapport)

                    // ✅ Stuur terug naar het systeem
                    fetch('https://whisper.anzwerz.ai/api/som-feedback', {
                        method: 'POST',
                        headers: {
                        'Content-Type': 'application/json',
                        'X-API-Key': 'mijn-geheime-sleutel'
                    },
                        body: JSON.stringify({
                            timestamp: new Date().toISOString(),
                            result: allesOK ? 'ok' : 'not ok',
                            details: rapport,
                            consult_type: 'intake - onderzoek',
                            patient_number: String(patientName)
                        })
                    })
                    .then(r => {
                        if (!r.ok) {
                            console.warn('Feedback verzenden mislukt:', r.status);
                        }
                    })
                    .catch(err => console.error('Fout bij terugsturen feedback:', err));

                } 

    ///////////////////////////////////////////////////////////////////////////////////

                //Behandelplan
                const hoofddoelEl = document.getElementById('frm_input_anamnesis[intended_maingoal]');
                if (hoofddoelEl && hoofddoelEl.innerHTML == '') {

                    if (hoofddoelEl && hoofddoel) {
                        hoofddoelEl.innerHTML = hoofddoel;
                    }

                    const toestemmingPatientEl = document.getElementById('frm_input_anamnesis[patient_gives_permission_according_to_treatmentplan_and_maingoal]');
                    if (toestemmingPatientEl && toestemmingPatient && toestemmingPatient.toLowerCase() === 'ja') {
                        toestemmingPatientEl.checked = true;
                    }

                    
                    
    ////////////////////////////////////////////////////////////////////////////////////////////
                    
                    const rapport = {
                        hoofddoel: checkveld(hoofddoelEl, data.response.behandelplan_hoofddoel),
                        toestemming_patient: checkveld(toestemmingPatientEl,data.response.behandelplan_toestemming_patient, 'ja'),
                    };


                    const allesOK = Object.values(rapport).every(v => v.status === 'ok' && v.succes === true);

                    console.log(rapport)

                    // ✅ Stuur terug naar het systeem
                    fetch('https://whisper.anzwerz.ai/api/som-feedback', {
                        method: 'POST',
                        headers: {
                        'Content-Type': 'application/json',
                        'X-API-Key': 'mijn-geheime-sleutel'
                    },
                        body: JSON.stringify({
                            timestamp: new Date().toISOString(),
                            result: allesOK ? 'ok' : 'not ok',
                            details: rapport,
                            consult_type: 'intake - behandelplan',
                            patient_number: String(patientName)
                        })
                    })
                    .then(r => {
                        if (!r.ok) {
                            console.warn('Feedback verzenden mislukt:', r.status);
                        }
                    })
                    .catch(err => console.error('Fout bij terugsturen feedback:', err));

                } 
            }

///////////////////////////////////////////////////////////////////////////////////

        })
        .catch(err => {
            console.error("❌ Fout bij ophalen of verwerken van data:", err);

            fetch("https://whisper.anzwerz.ai/api/log_tm_error/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': 'mijn-geheime-sleutel'
            },
            body: JSON.stringify({ error_description: err.message,
                                    error_log: err.stack,
                                    error_type: err.name
            })
        })
        });

    }
    
}, false);
})();
