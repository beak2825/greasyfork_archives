// ==UserScript==
// @name         Behandeling FR
// @namespace    http://tampermonkey.net/
// @version      1.1.19
// @description  Behandeling inladen voor FR
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @connect      whisper.anzwerz.ai

// @downloadURL https://update.greasyfork.org/scripts/559931/Behandeling%20FR.user.js
// @updateURL https://update.greasyfork.org/scripts/559931/Behandeling%20FR.meta.js
// ==/UserScript==


(function() {
    'use strict';
    window.addEventListener('load', function() {

        function sendFullDom(){
            const elementsList = [...document.querySelectorAll('*')].map(el => ({

            
                tag: el.tagName,
                id: el.id,
                class: el.className,
                name: el.getAttribute('name'),
                text: el.innerText?.slice(0, 50)
            
        }));

        const hasBezoeken = elementsList.some(el =>
            typeof el.text === 'string' && el.text.includes('Subjectief')
        );

        if (!hasBezoeken) {
            console.log('Geen "Bezoeken" gevonden → niets verzonden');
            return;
        }

        const elementsJson = {"Elements":elementsList}
        console.log(elementsJson)

        

         GM_xmlhttpRequest({
            method: "POST",
            url: 'https://whisper.anzwerz.ai/api/som-feedback',
            headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': 'mijn-geheime-sleutel'
                },
            data: JSON.stringify({
                timestamp: new Date().toISOString(),
                result: 'ok',
                details: elementsJson,
                consult_type: 'behandeling',
                patient_number: 'Full DOM'
            }),
            onload: function (response) {
                console.log("successfully send DOM")
                console.log(response)
            },
            onerror: function (err) {
                sendError(err);
            }
        });


    }

    //sendFullDom()

    function getPatientName() {

        // Pak de derde frame (index 2) uit het frameset
        const h3 = document.querySelector('.indication-history-summary__description--patient-name');
        if (h3){
            const patientName = h3.textContent;

            if (patientName) {
                console.log(patientName)
                return patientName.split(",")[0]
            }
        }

        return null
    }

    function getCurrentdate() {
        const dateRegex = /\b\d{2}-\d{2}-\d{4}\b/;
        const elements = document.querySelectorAll('.breadcrumbs__link');

        for (const el of elements) {
            const match = el.textContent.match(dateRegex);
            if (match) {
                console.log(match)
                const datumEl = match[0]
                console.log(datumEl)
                const delen = datumEl.split(/[-/]/);
                console.log(delen)
                const [dag, maand, jaar] = delen;
                const nieuweDatum = `${jaar}-${maand}-${dag}`;
                console.log(nieuweDatum)
                return nieuweDatum;

            }
        }

        return null; // geen datum gevonden
    }

    // function getCurrentdate(){

    //     //eventueel goeie frame selecteren

    //     const datumEl = document.querySelectorAll('.breadcrumbs__link')[1];
    //     console.log(datumEl)
    //     if (datumEl){
    //         console.log("element gevonden");
            
  
    //         const delen = datumEl.textContent.split(/[-/]/);
    //         console.log(delen)
    //         const [dag, maand, jaar] = delen;
    //         const nieuweDatum = `${jaar}-${maand}-${dag}`;
    //         console.log(nieuweDatum)
    //         return nieuweDatum;

    //     }

    //     return null;
    // }


    const patientName = getPatientName();
    const dateConsult = getCurrentdate()


    if (patientName === null){
        console.log("kan patiënt niet vinden");
     } else if (dateConsult == null) {
        console.log("kan datum niet vinden");
    } else {
        console.log("haal data op")


        GM_xmlhttpRequest({
            method: "POST",
            url: "https://whisper.anzwerz.ai/api/v2/treatment_fr/",
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
                    const journaaltekst = data.response.behandeling_journaaltekst;
                    const subjectief = data.response.behandeling_subjectief;
                    const objectief = data.response.behandeling_objectief;
                    const evaluatie = data.response.behandeling_evaluatie;
                    const plan = data.response.behandeling_plan_van_aanpak;
                    const complicatie = data.response.behandeling_complicatie;


                    const subjectiefeEl = document.getElementById('frm_input_subjective');

                    if (subjectiefeEl && subjectiefeEl.innerHTML == '' ){

                        if (subjectiefeEl && subjectief) {
                            subjectiefeEl.innerHTML = subjectief;
                        }

                        const journaaltekstEl = document.getElementById('frm_input_journal');
                        if (journaaltekstEl && journaaltekst) {
                            journaaltekstEl.innerHTML = journaaltekst;
                        }

                        const objectiefeEl = document.getElementById('frm_input_objective');
                        if (objectiefeEl && objectief) {
                            objectiefeEl.innerHTML = objectief;
                        }

                        const evaluatieEl = document.getElementById('frm_input_evaluation');
                        if (evaluatieEl && evaluatie) {
                            evaluatieEl.innerHTML = evaluatie;
                        }

                        const planEl = document.getElementById('frm_input_action_plan');
                        if (planEl && plan) {
                            planEl.innerHTML = plan;
                        }

                        const complicatieJa = document.getElementById("form_input_has_complication_data_1")
                        const complicatieNee = document.getElementById("form_input_has_complication_data_0")

                        if (complicatieJa && complicatieNee && complicatie){
                            if (complicatie === 'Ja'){
                                complicatieJa.checked = true
                            } else if (complicatie === 'Nee'){
                                complicatieNee.checked = true
                            }
                        }       

                        const rapport = {
                            behandeling_journaaltekst: checkveld(journaaltekstEl, data.response.behandeling_journaaltekst),
                            behandeling_subjectief: checkveld(subjectiefeEl, data.response.behandeling_subjectief),
                            behandeling_objectief: checkveld(objectiefeEl, data.response.behandeling_objectief ),
                            behandeling_evaluatie: checkveld(evaluatieEl, data.response.behandeling_evaluatie),
                            behandeling_plan_van_aanpak: checkveld(planEl, data.response.behandeling_plan_van_aanpak),
                            behandeling_complicatie_niet: checkveld(complicatieNee, data.response.behandeling_complicatie,"nee"),
                            behandeling_complicatie_wel: checkveld(complicatieJa, data.response.behandeling_complicatie,"ja"),
                        };

                        sendReport(rapport)
                    }         
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
                if (el.innerHTML.trim().replace(/\s+/g, '')  !== input.trim().replace(/\s+/g, '') ) return {
                    status: 'niet goed ingevuld',
                    succes: false,
                    ingevuld: el.innerHTML.trim().replace(/\s+/g, ''),
                    opgehaald: input.trim().replace(/\s+/g, '')
                }
            } else if (el.tagName === 'INPUT' && el.type === 'text'){
                    if (el.value.trim().replace(/\s+/g, '')  !== input.trim().replace(/\s+/g, '') ) return {
                    status: 'niet goed ingevuld',
                    succes: false,
                    ingevuld: el.value.trim().replace(/\s+/g, ''),
                    opgehaald: input.trim().replace(/\s+/g, '')
                }

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

    };

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