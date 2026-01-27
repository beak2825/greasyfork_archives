// ==UserScript==
// @name         YMS Note Assistance
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Adds form templates for creating standardized Amazon notes on YMS.
// @author       @nowaratn
// @match        https://trans-logistics-eu.amazon.com/yms/shipclerk/*
// @match        https://jwmjkz3dsd.execute-api.eu-west-1.amazonaws.com*
// @require      https://unpkg.com/axios/dist/axios.min.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/562528/YMS%20Note%20Assistance.user.js
// @updateURL https://update.greasyfork.org/scripts/562528/YMS%20Note%20Assistance.meta.js
// ==/UserScript==

let nonInvType = "";
let CONTENT = "";
let department = "";

// Konfiguracja językowa i contentu
const CONFIG = {
    currentLanguage: localStorage.getItem('yms_language') || 'en',
    translations: {
        en: {
            // Etykiety
            inbound: "Inbound",
            outbound: "Outbound",
            relo: "Relo",
            defects: "Defects",
            nonInv: "Non-in",
            isavrid: "ISA/VRID",
            login: "LOGIN",
            content: "CONTENT",
            store: "STORE",
            dateUnloading: "Date of unloading",
            description: "Description",
            report: "Report",
            create: "CREATE",
            select: "-- Select --",
            department: "DEPARTMENT",
            sortType: "SORT TYPE",
            caseNumber: "CASE NUMBER",
            storeTrailer: "STORE Trailer",
            neqpType: "NEQP Type",

            // Komunikaty błędów
            errorNoISA: "ISA/VRID number not entered",
            errorNoContent: "Content not selected (CONTENT)",
            errorNoDate: "Unloading date not entered (Date of unloading)",
            errorNoDepartment: "Department not selected (DEPARTMENT)",
            errorNoVRID: "VRID / ISA number not entered",
            errorNoSortType: "Sort type not selected (SORT TYPE)",
            errorNoAssetType: "Asset type not selected (Swap-Body/Trailer) or 'Other damage'",
            errorNoDefectDesc: "Defect description not entered in 'Other damage' field",
            errorNoDefectType: "Defect type not selected from list",
            errorNoStoreTrailer: "STORE Trailer option not selected (YES/NO/EMPTY)",
            errorNoNEQPType: "NEQP Type not selected",
            errorNoTagType: "Tag type not selected (YELLOW TAGGED / RED TAGGED)",
            other_dmg: "Other defect (describe below)"
        },
        pl: {
            // Etykiety
            inbound: "Inbound",
            outbound: "Outbound",
            relo: "ReLo",
            defects: "Defects",
            nonInv: "Non-inv",
            isavrid: "ISA/VRID",
            login: "LOGIN",
            content: "ZAWARTOŚĆ",
            store: "STORE",
            dateUnloading: "Data rozładunku",
            description: "Opis",
            report: "Raport",
            create: "UTWÓRZ",
            select: "-- Wybierz --",
            department: "DZIAŁ",
            sortType: "TYP SORTOWANIA",
            caseNumber: "CASE",
            storeTrailer: "STORE trailer",
            neqpType: "Typ NEQP",

            // Komunikaty błędów
            errorNoISA: "Nie wpisano numeru ISA/VRID",
            errorNoContent: "Nie wybrano co zawiera dany Asset (CONTENT)",
            errorNoDate: "Nie wpisano dnia rozładunku Assetu (Date of unloading)",
            errorNoDepartment: "Nie wybrano działu (DEPARTMENT)",
            errorNoVRID: "Nie wpisano numeru VRID / ISA",
            errorNoSortType: "Nie wybrano typu sortowania (SORT TYPE)",
            errorNoAssetType: "Nie wybrano typu assetu (Swap-Body/Trailer) lub 'Inne uszkodzenie'",
            errorNoDefectDesc: "Nie wpisano opisu uszkodzenia w polu 'Inne uszkodzenie'",
            errorNoDefectType: "Nie wybrano typu uszkodzenia z listy",
            errorNoStoreTrailer: "Nie wybrano opcji STORE Trailer (YES/NO/EMPTY)",
            errorNoNEQPType: "Nie wybrano co zawiera dany Asset (NEQP Type)",
            errorNoTagType: "Nie wybrano typu tagu (YELLOW TAGGED / RED TAGGED)",
            other_dmg: "Inne uszkodzenie (opisz niżej)"
        }
    },

    // Edytowalne contenty
    contentOptions: {
        inbound: [
            { value: "IBVEND", desc_en: "For any inbound sellable freight that comes directly from the vendor. Use for sellable stow and for site types that do not stow goods use for IB parcels or palletize freight.", desc_pl: "Dla każdego przychodzącego towaru sprzedażnego, który pochodzi bezpośrednio od dostawcy." },
            { value: "IBUNSELL", desc_en: "Graded customer returns with a disposition unsellable.", desc_pl: "Ocenione zwroty klientów z dyspozycją niesprzedawalne." },
            { value: "IBPROBSOLV", desc_en: "Known problem solve such as unmanifested load that TOM team will update in YMS Notes to flag to DND to investigate and assist to resolve.", desc_pl: "Znane problemy do rozwiązania, takie jak niezamanifestowany ładunek." },
            { value: "IBCRET", desc_en: "This should only be used in RELO locations. Customer returns that are not graded yet.", desc_pl: "Powinno być używane tylko w lokalizacjach RELO. Zwroty klientów, które nie zostały jeszcze ocenione." },
            { value: "IBTRANS", desc_en: "One site is transferring to a second site for processing or stowing.", desc_pl: "Jedna lokalizacja przekazuje do drugiej lokalizacji w celu przetworzenia lub składowania." },
            { value: "IBUNDELIV", desc_en: "Packages being returned to Amazon that were not successfully delivered to their end destination. Brand new, unopened freight returned without successful delivery.", desc_pl: "Paczki zwracane do Amazon, które nie zostały pomyślnie dostarczone do miejsca docelowego." },
            { value: "IBMISSHIP", desc_en: "Requires \"Case xxxxxxxx\" documented in notes. When product is not able to be processed and need to be sent to another location.", desc_pl: "Wymaga \"Case xxxxxxxx\" udokumentowanego w notatkach. Gdy produkt nie może być przetworzony i musi zostać wysłany do innej lokalizacji." },
            { value: "IBREJECT", desc_en: "Requires \"Case xxxxxxxx\" documented in notes. Trailer cannot be unloaded due to unsafe product, or trailer condition is not safe to unload.", desc_pl: "Wymaga \"Case xxxxxxxx\" udokumentowanego w notatkach. Naczepa nie może być rozładowana z powodu niebezpiecznego produktu lub stan naczepy nie jest bezpieczny." },
            { value: "IBDONATE", desc_en: "Trailer loaded with contents for donation purpose.", desc_pl: "Naczepa załadowana zawartością przeznaczoną do darowizny." },
            { value: "IBFOUNDLOADED", desc_en: "To be utilized when a trailer is found loaded but was previously marked empty, and the content of the trailer is unknown.", desc_pl: "Do użycia, gdy naczepa zostanie znaleziona załadowana, ale wcześniej była oznaczona jako pusta, a zawartość naczepy jest nieznana." },
            { value: "IBEMPTY", desc_en: "Inbound Empty 3P trailer dwelling over 24 hours onsite or offsite + Case xxxxxxxx.", desc_pl: "Inbound, pusta naczepa zewnętrznego przewoźnika dwellująca ponad 24h. + Case xxxxxxxx" }

        ],
        outbound: [
            { value: "OBSCHED", desc_en: "Outbound trailer not past SDT (loading status is in progress on dock door). This applies to any trailer on time, that will be departing the yard.", desc_pl: "Naczepa wychodząca nie przekroczyła SDT (status ładowania jest w toku na bramie dokowej)." },
            { value: "OBLATE", desc_en: "Any trailer dwelling past SDT with a VRID is considered late.", desc_pl: "Każda naczepa przebywająca po SDT z VRID jest uważana za spóźnioną." },
            { value: "OBMISLOAD", desc_en: "Incorrect trailer being attached to a VRID or load (3P to AZNG or 3P to 3P or AZNG to 3P).", desc_pl: "Nieprawidłowa naczepa podłączona do VRID (3P do AZNG , 3P do 3P, AZNG do 3P)." },
            { value: "OBVRET", desc_en: "For all trailers assigned for outbound VRET loads.", desc_pl: "Dla wszystkich naczep przypisanych do ładunków wychodzących VRET." },
            { value: "OBTHO", desc_en: "THO load that was dropped off for the next driver to pick up.", desc_pl: "Ładunek THO, który został pozostawiony dla następnego kierowcy do odbioru." },
            { value: "OBRTD", desc_en: "Completed loads in the yard less than 24 hours from time of completion.", desc_pl: "Ukończone ładunki na placu krócej niż 24 godziny od czasu zakończenia." },
            { value: "OBTRANSLOAD", desc_en: "Outbound loads that need to be transloaded into the correct trailer type.", desc_pl: "Ładunki wychodzące wymagające przeładunku do odpowiedniego typu naczepy." },
            { value: "OBDEPARTED", desc_en: "Outbound loads that have been virtually departed and require further action.", desc_pl: "Ładunki wychodzące wirtualnie odjechane, wymagające dalszych działań." },
            { value: "OBRECOVERY", desc_en: "Outbound recovery loads booked and waiting to depart the yard.", desc_pl: "Zarezerwowane ładunki odzyskowe oczekujące na wyjazd z placu." },
            { value: "OBEMPTY", desc_en: "Outbound Empty 3P trailer dwelling over 24 hours onsite or offsite.", desc_pl: "Outbound, pusta naczepa zewnętrznego przewoźnika dwellująca ponad 24h." }
        ],
        relo: [
            { value: "RMVLIQ", desc_en: "Indicates the trailer is a liquidation drop trailer ready for pickup.", desc_pl: "Wskazuje, że naczepa jest naczepą likwidacyjną gotową do odbioru." },
            { value: "RMVREC", desc_en: "Indicates the trailer is a recycle drop trailer ready for pickup.", desc_pl: "Wskazuje, że naczepa jest naczepą recyklingową gotową do odbioru." },
            { value: "RMVLTL", desc_en: "Indicates the trailer is a LTL drop trailer is ready for pickup.", desc_pl: "Wskazuje, że naczepa jest naczepą LTL gotową do odbioru." },
            { value: "RMVDON", desc_en: "Indicates the trailer is a donation drop trailer ready for pickup.", desc_pl: "Wskazuje, że naczepa jest naczepą darowizny gotową do odbioru." },

            { value: "RMVLIQEMPTY", desc_en: "Indicates the trailer is an empty liquidation drop trailer.", desc_pl: "Oznacza, że przyczepa jest pustą przyczepą do załadunku odpadów." },
            { value: "RMVRECEMPTY", desc_en: "Indicates the trailer is an empty recycle drop trailer.", desc_pl: "Oznacza, że przyczepa jest pustą przyczepą do załadunku odpadów." },
            { value: "RMVLTLEMPTY", desc_en: "Indicates the trailer is an empty LTL drop trailer.", desc_pl: "Oznacza, że przyczepa jest pustą przyczepą LTL." },
            { value: "RMVDONEMPTY", desc_en: "Indicates the trailer is an empty donation drop trailer.", desc_pl: "Oznacza, że przyczepa jest pustą przyczepą do załadunku darowizn." },
        ],
        sortType: [
            { value: "TTS", desc_en: "transit-time-sensitive", desc_pl: "wrażliwy na czas tranzytu" },
            { value: "TTA", desc_en: "transit-time-agnostic", desc_pl: "niezależny od czasu tranzytu" },
            { value: "MIX", desc_en: "Mixed sorting", desc_pl: "Sortowanie mieszane" }
        ],
        neqpType: [
            { value: "NICARTS", desc_en: "GoCarts that are used for package transfers.", desc_pl: "OB Carty." },
            { value: "NIBADCARTS", desc_en: "Damaged GoCarts needing repair.", desc_pl: "Uszkodzone OB Carty." },
            { value: "NITOTES", desc_en: "Yellow (color plastic) totes that are used for package transfers.", desc_pl: "Żółte (plastikowe) pojemniki używane do przenoszenia paczek." },
            { value: "NIBADTOTES", desc_en: "Damaged Totes Needing Repair - create a SIM: https://optimus-internal.amazon.com/wims/report/05feecba-81e3-4964-b78d-2e35f01da935", desc_pl: "Uszkodzone toty wymagające naprawy - stwórz SIM: https://optimus-internal.amazon.com/wims/report/05feecba-81e3-4964-b78d-2e35f01da935" },
            { value: "NIUPP", desc_en: "Universal Plastic Pallets (UPP) are blue. Include in the notes the number pallets for (Topps (T), Bottom (B) or Sleeves (S) pallets. Example: (NIUPP T-10 pallets, B-10 pallets, S-4 pallets) ", desc_pl: "Universal Plastic Pallets (UPP) są niebieskie. Dodaj w opisie ilość palet dla (Topps (T), Bottom (B) or Sleeves (S) pallets. Przykład: (NIUPP T-10 pallets, B-10 pallets, S-4 pallets)" },
            { value: "NIBADUPP", desc_en: "Damaged UPP needing repair. VRID will automatically be scheduled within 24 hours of notes being added.", desc_pl: "Uszkodzone UPP wymagające naprawy. VRID zostanie automatycznie zaplanowany w ciągu 24h od dodania notatki." },
            { value: "NIUSPS", desc_en: "United States Postal Service (USPS) pallets are black with an orange stripe across.", desc_pl: "Palety United States Postal Service (USPS) są czarne z pomarańczowym paskiem w poprzek." },
            { value: "NIAMXL", desc_en: "Oversized 4x6 pallets meant for AMXL locations.", desc_pl: "Ponadgabarytowe palety 4x6 przeznaczone dla lokalizacji AMXL." },
            { value: "NIWOOD", desc_en: "Non-AMXL wood pallets (Good Wood).", desc_pl: "Palety drewniane inne niż AMXL (dobre)." },
            { value: "NIBADWOOD", desc_en: "Broken non-AMXL wood pallets. Case is required.", desc_pl: "Uszkodzone drewniane palety inne niż AMXL. Wymagany Case." },
            { value: "NICONSUM", desc_en: "Trailer holding consumables (Examples: corrugate, cardboard/gaylord or shuttle).", desc_pl: "Przyczepa przewożąca materiały eksploatacyjne (przykłady: kartony/gaylordy)." },
            { value: "NIRECY", desc_en: "Scrap metal, recyclable equipment.", desc_pl: "Złom, sprzęt nadający się do recyklingu." },
            { value: "NIFRESHGUPP", desc_en: "Grocery Universal Plastic Pallets (G-UPPs) are green food-grade plastic pallets exclusive to the Amazon Grocery Logistics (AGL) network.", desc_pl: "Uniwersalne palety plastikowe na artykuły spożywcze (G-UPP) to ekologiczne palety plastikowe dopuszczone do kontaktu z żywnością, dostępne wyłącznie w sieci Amazon Grocery Logistics (AGL)." },
            { value: "NITURBO", desc_en: "This will be used to identify trailers containing empty TurboTotes. Shipper account: TransferTurboTotes . Queue: roc-na-turbo-totes@amazon.com.", desc_pl: "Naczepa zawierające puste TurboTotes. Shipper account: TransferTurboTotes . Queue: roc-na-turbo-totes@amazon.com" },
            { value: "WASTE", desc_en: "Waste Management contracted lane.", desc_pl: "Trasa kontraktowa zarządzania odpadami." },
            { value: "NIEMPTY", desc_en: "Vendor Empty trailer that will be utilized by Non-inventory.", desc_pl: "Pusta naczepa z przeznaczeniem na załadunek Non-inventory." },
            { value: "EMPTYPOD", desc_en: "Empty trailer for Launch site.", desc_pl: "Pusta naczepa dla uruchamianego magazynu." },
            { value: "FULLPOD", desc_en: "Loaded trailer for Launch site.", desc_pl: "Załadowana naczepa dla uruchamianego magazynu." },
            { value: "APSTORAGE", desc_en: "Approved Non-AZNG storage trailer.", desc_pl: "Zatwierdzona przyczepa magazynowa Non-AZNG." },
            { value: "NONAPSTORAGE", desc_en: "Identified AZNG/AZNU trailer that is loaded with storage that needs to be transloaded and or offloaded by the site.", desc_pl: "Zidentyfikowano przyczepę AZNG/AZNU załadowaną materiałami magazynowymi, które należy przeładować i/lub rozładować na miejscu.." },
            { value: "LEGALHOLD", desc_en: "On hold for legal resolution, FBI hold.", desc_pl: "Wstrzymane do czasu rozstrzygnięcia kwestii prawnych, wstrzymane przez FBI." }
        ],
        defectsSwapBody: [
            { desc_en: "Bent support bearing", desc_pl: "Krzywy uchwyt na nogę" },
            { desc_en: "Bent crossbeam", desc_pl: "Wygięta poprzeczka" },
            { desc_en: "Bent support leg", desc_pl: "Krzywa noga" },
            { desc_en: "Defective crossbeam", desc_pl: "Uszkodzona poprzeczka" },
            { desc_en: "Defective hitch", desc_pl: "Uszkodzony trzpień" },
            { desc_en: "Defective ladder", desc_pl: "Uszkodzona drabina" },
            { desc_en: "Defective leg support", desc_pl: "Uszkodzone zabezpieczenie nogi" },
            { desc_en: "Defective locking handle", desc_pl: "Uszkodzona klamka blokująca" },
            { desc_en: "Defective rolldoor cable", desc_pl: "Uszkodzona linka rolety" },
            { desc_en: "Defective rolldoor handle", desc_pl: "Uszkodzona klamka rolety" },
            { desc_en: "Defective rolldoor lock", desc_pl: "Uszkodzony zamek rolety" },
            { desc_en: "Defective rolldoor panel", desc_pl: "Uszkodzony panel rolety" },
            { desc_en: "Defective rubber gasket", desc_pl: "Uszkodzona uszczelka" },
            { desc_en: "Defective support bearing", desc_pl: "Uszkodzony uchwyt na nogę" },
            { desc_en: "Defective support leg", desc_pl: "Uszkodzona noga podporowa" },
            { desc_en: "Missing hitch", desc_pl: "Brak trzpienia" },
            { desc_en: "Missing ladder", desc_pl: "Brak drabiny" },
            { desc_en: "Missing leg pin", desc_pl: "Brak zawleczki" },
            { desc_en: "Missing leg support", desc_pl: "Brak zabezpieczenia nogi" },
            { desc_en: "Missing locking handle", desc_pl: "Brak klamki blokującej" },
            { desc_en: "Missing rolldoor cable", desc_pl: "Brak linki rolety" },
            { desc_en: "Missing rolldoor handle", desc_pl: "Brak klamki rolety" },
            { desc_en: "Missing rolldoor strap", desc_pl: "Brak paska rolety" },
            { desc_en: "Missing rubber gasket", desc_pl: "Brak uszczelki" },
            { desc_en: "Missing support bearing", desc_pl: "Brak uchwytu na nogę" }
        ],
        defectsTrailer: [
            { desc_en: "Air socket", desc_pl: "Gniazda powietrza" },
            { desc_en: "Air System", desc_pl: "Układ pneumatyczny" },
            { desc_en: "Front", desc_pl: "Przód" },
            { desc_en: "Holes - punctures", desc_pl: "Dziury - wgniecenia" },
            { desc_en: "Landing Gear", desc_pl: "Nogi" },
            { desc_en: "Left side guard", desc_pl: "Osłona lewa" },
            { desc_en: "Left Sidewall", desc_pl: "Ściana - lewa" },
            { desc_en: "Lights - Left side", desc_pl: "Światła - lewe" },
            { desc_en: "Lights - Right side", desc_pl: "Światła - prawe" },
            { desc_en: "Mud flaps", desc_pl: "Błotniki" },
            { desc_en: "Rear bumper", desc_pl: "Zderzak" },
            { desc_en: "Rear lights", desc_pl: "Światła tył" },
            { desc_en: "Right side guard", desc_pl: "Osłona prawa" },
            { desc_en: "Right Sidewall", desc_pl: "Ściana - prawa" },
            { desc_en: "Roof", desc_pl: "Dach" },
            { desc_en: "Roll doors", desc_pl: "Roleta" },
            { desc_en: "Swing doors", desc_pl: "Drzwi" },
            { desc_en: "Suspension", desc_pl: "Zawieszenie" },
            { desc_en: "Wheels - Left side", desc_pl: "Koła - lewe" },
            { desc_en: "Wheels - Right side", desc_pl: "Koła - prawe" },
            { desc_en: "MOT", desc_pl: "MOT" },
            { desc_en: "Missing documents", desc_pl: "Brak dokumentów" }
        ]
    }
};

(async function() {
    'use strict';

    // Załaduj konfigurację
    loadConfig();


    function openContentManager() {
        const existing = document.getElementById("yms-content-manager");
        if (existing) existing.remove();

        const modal = document.createElement("div");
        modal.id = "yms-content-manager";
        modal.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 500px;
        max-height: 80vh;
        overflow-y: auto;
        background-color: white;
        padding: 25px;
        z-index: 10002;
        border: 3px solid #FF9900;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        font-family: Arial, sans-serif;
    `;

        const title = document.createElement("h2");
        title.textContent = "⚙️ Settings / Ustawienia";
        title.style.cssText = `
        margin: 0 0 20px 0;
        text-align: center;
        color: #333;
        font-size: 24px;
    `;
        modal.appendChild(title);

        // Sekcja wyboru języka
        const langSection = document.createElement("div");
        langSection.style.cssText = `
        margin-bottom: 25px;
        padding: 15px;
        background-color: #f8f9fa;
        border-radius: 8px;
        border: 2px solid #FF9900;
    `;

        const langLabel = document.createElement("h3");
        langLabel.textContent = "🌐 Language / Język";
        langLabel.style.cssText = `
        margin: 0 0 10px 0;
        font-size: 18px;
        color: #333;
    `;
        langSection.appendChild(langLabel);

        const langSelect = document.createElement("select");
        langSelect.style.cssText = `
        width: 100%;
        padding: 10px;
        font-size: 16px;
        border: 2px solid #ddd;
        border-radius: 5px;
        background-color: white;
        cursor: pointer;
        box-sizing: border-box;
    `;

        const langOptions = [
            { value: "en", text: "🇬🇧 English" },
            { value: "pl", text: "🇵🇱 Polski" }
        ];

        langOptions.forEach(opt => {
            const option = document.createElement("option");
            option.value = opt.value;
            option.textContent = opt.text;
            option.selected = CONFIG.currentLanguage === opt.value;
            langSelect.appendChild(option);
        });

        langSelect.addEventListener("change", () => {
            CONFIG.currentLanguage = langSelect.value;
            localStorage.setItem('yms_language', langSelect.value);

            // Pokaż komunikat o zmianie
            const message = document.createElement("div");
            message.style.cssText = `
            margin-top: 10px;
            background-color: #28a745;
            color: white;
            border-radius: 5px;
            text-align: center;
            font-weight: bold;
            font-size: 14px;
        `;
            message.textContent = langSelect.value === 'en' ? "✓ Zmieniono język! Please refresh the page.": "✓ Język zmieniony! Odśwież stronę.";

            // Usuń poprzedni komunikat jeśli istnieje
            const oldMessage = langSection.querySelector('.lang-message');
            if (oldMessage) oldMessage.remove();

            message.className = 'lang-message';
            langSection.appendChild(message);

            // Automatyczne odświeżenie po 2 sekundach
            setTimeout(() => {
                location.reload();
            }, 2000);
        });

        langSection.appendChild(langSelect);
        modal.appendChild(langSection);

        // Separator
        const separator = document.createElement("hr");
        separator.style.cssText = `
        margin: 25px 0;
        border: none;
        border-top: 2px solid #ddd;
    `;
        modal.appendChild(separator);

        // Sekcja zarządzania Content
        const contentSection = document.createElement("div");
        contentSection.style.cssText = `
        margin-bottom: 20px; display: inline-grid;
    `;

        const contentTitle = document.createElement("h3");
        contentTitle.textContent = "📋 Manage Content Options";
        contentTitle.style.cssText = `
        margin: 0 0 8px 0;
        font-size: 18px;
        color: #333;
    `;
        contentSection.appendChild(contentTitle);

        const contentSubtitle = document.createElement("h4");
        contentSubtitle.textContent = "Zarządzaj opcjami Content";
        contentSubtitle.style.cssText = `
        margin: 0 0 15px 0;
        font-size: 14px;
        color: #666;
        font-weight: normal;
    `;
        contentSection.appendChild(contentSubtitle);

        const info = document.createElement("p");
        info.textContent = "Select category to add/remove options:";
        info.style.cssText = `
        margin: 0 0 5px 0;
        font-size: 13px;
        color: #666;
    `;
        contentSection.appendChild(info);

        const infopl = document.createElement("p");
        infopl.textContent = "Wybierz kategorię aby dodać/usunąć opcje:";
        infopl.style.cssText = `
        margin: 0 0 15px 0;
        font-size: 13px;
        color: #666;
    `;
        contentSection.appendChild(infopl);

        const categories = [
            { key: "inbound", name: "Inbound", icon: "📥" },
            { key: "outbound", name: "Outbound", icon: "📤" },
            { key: "relo", name: "Relo", icon: "🔄" },
            { key: "sortType", name: "Sort Type", icon: "🔀" },
            { key: "neqpType", name: "NEQP Type (Non-INV)", icon: "📦" },
            { key: "defectsSwapBody", name: "Defects - Swap Body", icon: "🔧" },
            { key: "defectsTrailer", name: "Defects - Trailer", icon: "🚛" }
        ];

        categories.forEach(cat => {
            const catBtn = document.createElement("button");
            catBtn.textContent = `${cat.icon} ${cat.name}`;
            catBtn.style.cssText = `
            width: 100%;
            margin: 8px 0;
            background-color: #0087FF;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
            transition: background-color 0.3s;
            box-sizing: border-box;
        `;
            catBtn.addEventListener("mouseover", () => {
                catBtn.style.backgroundColor = "#006acc";
            });
            catBtn.addEventListener("mouseout", () => {
                catBtn.style.backgroundColor = "#0087FF";
            });
            catBtn.addEventListener("click", () => {
                openContentEditor(cat.key, cat.name);
            });
            contentSection.appendChild(catBtn);
        });

        modal.appendChild(contentSection);

        // Przycisk zamknij
        const closeBtn = document.createElement("button");
        closeBtn.textContent = "✖ Close / Zamknij";
        closeBtn.style.cssText = `
        width: 100%;
        background-color: #666;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        margin-top: 10px;
        font-size: 16px;
        font-weight: bold;
        transition: background-color 0.3s;
        box-sizing: border-box;
    `;
        closeBtn.addEventListener("mouseover", () => {
            closeBtn.style.backgroundColor = "#555";
        });
        closeBtn.addEventListener("mouseout", () => {
            closeBtn.style.backgroundColor = "#666";
        });
        closeBtn.addEventListener("click", () => {
            modal.remove();
        });
        modal.appendChild(closeBtn);

        document.body.appendChild(modal);
    }


    function addSettingsButtonToModal(modalElement) {
        // Sprawdź czy przycisk już istnieje
        if (modalElement.querySelector('.modal-settings-btn')) return;

        const settingsBtn = document.createElement("button");
        settingsBtn.className = "modal-settings-btn";
        settingsBtn.innerHTML = "⚙️";
        settingsBtn.title = "Manage Content / Zarządzaj Content";
        settingsBtn.style.cssText = `
        position: absolute;
        top: 0px;
        left: 10px;
        background-color: #FF9900;
        color: white;
        border: none;
        width: 40px;
        cursor: pointer;
        font-size: 20px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        z-index: 1;
    `;

        settingsBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            openContentManager();
        });

        modalElement.appendChild(settingsBtn);
    }

    function openContentEditor(category, categoryName) {
        const existing = document.getElementById("yms-content-editor");
        if (existing) existing.remove();

        const modal = document.createElement("div");
        modal.id = "yms-content-editor";
        modal.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 650px;
        max-height: 80vh;
        overflow-y: auto;
        background-color: white;
        padding: 20px;
        z-index: 10003;
        border: 3px solid #0087FF;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    `;

        const title = document.createElement("h2");
        title.textContent = `Edit ${categoryName} Content`;
        modal.appendChild(title);

        const items = CONFIG.contentOptions[category];

        // Przycisk dodawania nowej opcji
        const addNewBtn = document.createElement("button");
        addNewBtn.textContent = "➕ Add New Option / Dodaj nową opcję";
        addNewBtn.style.cssText = `
        width: 100%;
        padding: 10px;
        margin: 10px 0;
        background-color: #28a745;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    `;
        addNewBtn.addEventListener("click", () => {
            const newValue = prompt("Enter option value / Wpisz wartość opcji:");
            if (newValue && newValue.trim()) {
                const newItem = {
                    value: newValue.trim().toUpperCase(),
                    desc_en: prompt("Enter English description / Wpisz opis po angielsku:") || "",
                    desc_pl: prompt("Enter Polish description / Wpisz opis po polsku:") || ""
                };
                CONFIG.contentOptions[category].push(newItem);
                saveConfig();
                openContentEditor(category, categoryName); // Odśwież widok
            }
        });
        modal.appendChild(addNewBtn);

        const itemsContainer = document.createElement("div");
        itemsContainer.style.marginTop = "20px";

        items.forEach((item, index) => {
            const itemDiv = document.createElement("div");
            itemDiv.style.cssText = `
            border: 1px solid #ddd;
            padding: 10px;
            margin: 10px 0;
            border-radius: 5px;
            position: relative;
        `;

            const itemTitle = document.createElement("h4");
            itemTitle.textContent = item.value;
            itemTitle.style.marginTop = "0";
            itemDiv.appendChild(itemTitle);

            // Przycisk usuwania
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "🗑️";
            deleteBtn.title = "Delete / Usuń";
            deleteBtn.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background-color: #dc3545;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            padding: 5px 10px;
        `;
            deleteBtn.addEventListener("click", () => {
                if (confirm(`Delete "${item.value}"? / Usunąć "${item.value}"?`)) {
                    CONFIG.contentOptions[category].splice(index, 1);
                    saveConfig();
                    openContentEditor(category, categoryName); // Odśwież widok
                }
            });
            itemDiv.appendChild(deleteBtn);

            // English description
            const enLabel = document.createElement("label");
            enLabel.textContent = "English:";
            enLabel.style.display = "block";
            enLabel.style.marginTop = "5px";
            itemDiv.appendChild(enLabel);

            const enTextarea = document.createElement("textarea");
            enTextarea.value = item.desc_en;
            enTextarea.style.cssText = "width: 100%; height: 60px; margin-bottom: 10px;";
            enTextarea.addEventListener("change", () => {
                CONFIG.contentOptions[category][index].desc_en = enTextarea.value;
                saveConfig();
            });
            itemDiv.appendChild(enTextarea);

            // Polish description
            const plLabel = document.createElement("label");
            plLabel.textContent = "Polski:";
            plLabel.style.display = "block";
            itemDiv.appendChild(plLabel);

            const plTextarea = document.createElement("textarea");
            plTextarea.value = item.desc_pl;
            plTextarea.style.cssText = "width: 100%; height: 60px;";
            plTextarea.addEventListener("change", () => {
                CONFIG.contentOptions[category][index].desc_pl = plTextarea.value;
                saveConfig();
            });
            itemDiv.appendChild(plTextarea);

            itemsContainer.appendChild(itemDiv);
        });

        modal.appendChild(itemsContainer);

        const closeBtn = document.createElement("button");
        closeBtn.textContent = "✖ Close";
        closeBtn.style.cssText = `
        width: 100%;
        padding: 10px;
        background-color: #666;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        margin-top: 10px;
    `;
        closeBtn.addEventListener("click", () => {
            modal.remove();
        });
        modal.appendChild(closeBtn);

        document.body.appendChild(modal);
    }

    function saveConfig() {
        localStorage.setItem('yms_content_config', JSON.stringify(CONFIG.contentOptions));
    }

    function loadConfig() {
        const saved = localStorage.getItem('yms_content_config');
        if (saved) {
            try {
                CONFIG.contentOptions = JSON.parse(saved);
            } catch (e) {
                console.error("Error loading config:", e);
            }
        }
    }


    // Funkcja pomocnicza do pobierania wartości defektu w odpowiednim języku
    function getDefectValue(category, item) {
        const lang = CONFIG.currentLanguage;
        return lang === 'en' ? item.desc_en : item.desc_pl;
    }

    // Funkcja pomocnicza do pobierania wartości defektu w odpowiednim języku (do wyświetlenia)
    function getDefectDisplay(item) {
        const lang = CONFIG.currentLanguage;
        return lang === 'en' ? item.desc_en : item.desc_pl;
    }

    // Funkcja pomocnicza do pobierania wartości defektu dla raportu (zawsze EN)
    function getDefectValueForReport(item) {
        return item.desc_en;
    }

    // Funkcja pomocnicza do pobierania tłumaczenia
    function t(key) {
        return CONFIG.translations[CONFIG.currentLanguage][key] || key;
    }

    // Funkcja pomocnicza do pobierania opisu contentu
    function getContentDesc(category, value) {
        const item = CONFIG.contentOptions[category]?.find(opt => opt.value === value);
        if (!item) return '';
        return CONFIG.currentLanguage === 'en' ? item.desc_en : item.desc_pl;
    }



    let isProcessing = false;

    function addRefreshButton() {
        if (document.getElementById('refresh-order-button')) return;

        const button = document.createElement('button');
        button.id = 'refresh-order-button';
        button.innerHTML = '↻ Update Order';
        button.style.cssText = `
        position: fixed;
        bottom: 25%;
        right: 20px;
        z-index: 9999;
        background-color: #0087FF;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        transition: background-color 0.3s, transform 0.1s;
    `;

        button.addEventListener('mouseover', () => {
            if (!isProcessing) button.style.backgroundColor = '#006acc';
        });
        button.addEventListener('mouseout', () => {
            if (!isProcessing) button.style.backgroundColor = '#0087FF';
        });
        button.addEventListener('click', () => {
            if (!isProcessing) startMonitoring();
        });

        document.body.appendChild(button);
    }

    function updateButtonState(processing) {
        const button = document.getElementById('refresh-order-button');
        if (button) {
            if (processing) {
                button.style.backgroundColor = '#666666';
                button.style.cursor = 'not-allowed';
                button.innerHTML = '⏳ Processing...';
            } else {
                button.style.backgroundColor = '#0087FF';
                button.style.cursor = 'pointer';
                button.innerHTML = '↻ Update Order';
            }
        }
    }

    function findRowByAssetData(asset) {
        const rows = document.querySelectorAll('tr.ng-scope');
        for (const row of rows) {
            // Sprawdź vehicle number
            if (asset.vehicleNumber) {
                const vehicleNumber = row.querySelector('.vehicle-number-LP span');
                if (vehicleNumber && vehicleNumber.textContent.trim() === asset.vehicleNumber) {
                    return row;
                }
            }

            // Sprawdź license plate
            if (asset.licensePlate && asset.licensePlate.registrationIdentifier) {
                const licensePlate = row.querySelector('.license-plate span');
                if (licensePlate && licensePlate.textContent.includes(asset.licensePlate.registrationIdentifier)) {
                    return row;
                }
            }
        }
        return null;
    }


    function processYardData(data) {
        try {
            data.locationsSummaries.forEach(summary => {
                summary.locations.forEach(location => {
                    if (location.yardAssets?.length > 1) {
                        console.log('Processing location:', location.code);

                        const assets = location.yardAssets
                        .map(asset => ({
                            id: asset.id,
                            vehicleNumber: asset.vehicleNumber,
                            licensePlate: asset.licensePlateIdentifier,
                            arrivalTime: asset.datetimeOfArrivalAtLocation
                        }))
                        .sort((a, b) => b.arrivalTime - a.arrivalTime);

                        assets.forEach((asset, index) => {
                            setTimeout(() => {
                                addOrderInfo(asset, index, assets.length);
                            }, index * 100);
                        });
                    }
                });
            });
        } catch (error) {
            console.error('Error processing yard data:', error);
            console.error('Data structure:', data);
        }
    }


    function addOrderInfo(asset, order, totalAssets) {
        console.log(`Trying to add order info for asset ${asset.id}: ${order + 1}/${totalAssets}`);

        const row = findRowByAssetData(asset);
        if (!row) {
            console.log(`Row not found for asset ${asset.id}`);
            return;
        }

        const timeCell = row.querySelector('.col4');
        if (!timeCell) {
            console.log(`Time cell not found for asset ${asset.id}`);
            return;
        }

        const existingOrder = timeCell.querySelector('.order-indicator');
        if (existingOrder) {
            console.log(`Existing order indicator found for ${asset.id}: ${existingOrder.textContent}`);
            if (existingOrder.dataset.order === `${order}/${totalAssets}`) {
                console.log(`Order indicator already has correct value for ${asset.id}`);
                return;
            }
            existingOrder.remove();
        }

        const orderDiv = document.createElement('div');
        orderDiv.className = 'order-indicator';
        orderDiv.dataset.order = `${order}/${totalAssets}`;
        orderDiv.style.cssText = `
        font-weight: bold;
        color: ${order === 0 ? 'green' : (order === totalAssets - 1 ? 'red' : 'orange')};
        height: auto;
    `;
        orderDiv.textContent = `#${order + 1}/${totalAssets}`;
        timeCell.appendChild(orderDiv);
        console.log(`Successfully added order indicator for ${asset.id}: ${order + 1}/${totalAssets}`);
    }


    function getSecurityToken() {
        const scripts = document.getElementsByTagName('script');
        for (let script of scripts) {
            const content = script.textContent || '';
            if (content.includes('window.ymsSecurityToken')) {
                // console.log('Found token script:', content); // Debug
                const match = content.match(/window\.ymsSecurityToken\s*=\s*"([^"]+)"/);
                if (match && match[1]) {
                    const token = match[1];
                    console.log('Extracted token:', token); // Debug
                    // Sprawdź czy token jest aktualny
                    try {
                        const tokenData = JSON.parse(atob(token.split('.')[1]));
                        console.log('Token data:', tokenData); // Debug
                        const now = Math.floor(Date.now() / 1000);
                        if (tokenData.exp < now) {
                            console.warn('Token expired, needs refresh');
                            return null;
                        }
                        return token;
                    } catch (e) {
                        console.error('Error parsing token:', e);
                        return null;
                    }
                }
            }
        }
        return null;
    }

    function startMonitoring() {
        if (isProcessing) return;

        const token = getSecurityToken();
        if (!token) {
            console.error('Security token not found or expired');
            return;
        }



        // console.log('Using token:', token); // Debug

        isProcessing = true;
        updateButtonState(true);


        GM_xmlhttpRequest({
            method: "POST",
            url: "https://jwmjkz3dsd.execute-api.eu-west-1.amazonaws.com/call/getYardStateWithPendingMoves",
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0",
                "Host": "jwmjkz3dsd.execute-api.eu-west-1.amazonaws.com",
                "Accept": "application/json, text/plain, */*",
                "Accept-Language": "en-US,en;q=0.5",
                "Accept-Encoding": "gzip, deflate, br, zstd",
                "api": "getYardStateWithPendingMoves",
                "method": "POST",
                "token": token,
                "Content-Type": "application/json;charset=utf-8",
                "Origin": "https://trans-logistics-eu.amazon.com",
                "Connection": "keep-alive",
                "Referer": "https://trans-logistics-eu.amazon.com/",
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "cross-site",
                "TE": "trailers"
            },
            data: JSON.stringify({"requester":{"system":"YMSWebApp"}}),
            onload: function(response) {
                console.log('Response status:', response.status);
                console.log('Raw response:', response.responseText);

                try {
                    const data = JSON.parse(response.responseText);
                    if (data && data.locationsSummaries) {
                        processYardData(data);
                    } else {
                        console.error('Unexpected data structure:', data);
                    }
                } catch (error) {
                    console.error('Error processing response:', error);
                } finally {
                    isProcessing = false;
                    updateButtonState(false);
                }
            },
            onerror: function(error) {
                console.error('Request error:', error);
                isProcessing = false;
                updateButtonState(false);
            }
        });
    }


    // Dodaj przycisk po załadowaniu strony
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addRefreshButton);
    } else {
        addRefreshButton();
    }


    // Funkcja tworząca przycisk w okienku modalnym
    function createButton(text, onClick) {
        const button = document.createElement("button");
        button.textContent = text;
        button.addEventListener("click", onClick);
        return button;
    }

    // Funkcja tworząca okienko modalne z przyciskami
    function createModal() {
        const modal = document.getElementById("yms-annotation-modal");
        if(!document.getElementById("YMS_Assistant_id"))
        {
            const modalContent = document.createElement("div");
            modalContent.style.display = "flex";
            modalContent.id = "YMS_Assistant_id";
            modalContent.style.justifyContent = "space-around";

            // Tworzenie przycisków
            const buttons = [
                { text: "Inbound", onClick: createIbModal },
                { text: "Outbound", onClick: createObModal },
                { text: "Relo", onClick: createCRETCDModal },
                { text: "Defects", onClick: createDefectsModal },
                { text: "Non-in", onClick: createNonInvModal }
            ];

            // Tworzenie i dodawanie przycisków do okienka modalnego
            buttons.forEach(function(buttonData) {
                const button = createButton(buttonData.text, buttonData.onClick);
                modalContent.appendChild(button);
            });

            // Dodawanie okienka modalnego z przyciskami do modala
            modal.appendChild(modalContent);
        }
    }

    function createIbModal () {
        const modal_ib = document.getElementById("modal_ib_id");
        if(!modal_ib) {
            const modal_ib = document.createElement("div");
            modal_ib.id = "modal_ib_id";
            modal_ib.style.position = "fixed";
            modal_ib.style.top = "50%";
            modal_ib.style.left = "20%";
            modal_ib.style.transform = "translate(-50%, -50%)";
            modal_ib.style.width = "20%";
            modal_ib.style.backgroundColor = "white";
            modal_ib.style.padding = "20px";
            modal_ib.style.display = "flex";
            modal_ib.style.flexDirection = "column";
            modal_ib.style.alignItems = "center";
            modal_ib.style.textAlign = "center";
            modal_ib.style.zIndex = "9999";
            modal_ib.style.border = "10px silver solid";

            const title = document.createElement("h1");
            title.textContent = t('inbound') + " Asset";
            title.id = "modal_ib_idheader";
            title.style.cursor = "move";
            title.style.fontSize = "32px";
            modal_ib.appendChild(title);

            // ISA/VRID Section
            const isavridLabel = document.createElement("h3");
            isavridLabel.textContent = t('isavrid');
            modal_ib.appendChild(isavridLabel);

            const isavridInput = document.createElement("input");
            isavridInput.type = "text";
            isavridInput.name = "ISAVRID";
            modal_ib.appendChild(isavridInput);

            // STORE CHECKBOX
            const storeLabel = document.createElement("h3");
            storeLabel.textContent = t('store');
            modal_ib.appendChild(storeLabel);

            const storeCheckbox = document.createElement("input");
            storeCheckbox.type = "checkbox";
            storeCheckbox.id = "storeCheckbox_ib";
            storeCheckbox.style.marginBottom = "10px";
            storeCheckbox.checked = false;
            modal_ib.appendChild(storeCheckbox);

            const loginLabel = document.createElement("h3");
            loginLabel.textContent = t('login');
            modal_ib.appendChild(loginLabel);

            const loginInput = document.createElement("input");
            loginInput.type = "text";
            loginInput.name = "login";
            loginInput.value = document.getElementsByClassName("a-color-link a-text-bold")[0].innerText;
            modal_ib.appendChild(loginInput);

            // CONTENT Section
            const content_label = document.createElement("h3");
            content_label.textContent = t('content');
            modal_ib.appendChild(content_label);

            const neqpTypeSelect = document.createElement("select");
            neqpTypeSelect.style.width = "100%";
            neqpTypeSelect.id = "neqpTypeSelect_id";
            neqpTypeSelect.style.marginBottom = "10px";

            // Dodanie pustej opcji jako domyślnej
            const emptyOption = document.createElement("option");
            emptyOption.value = "";
            emptyOption.textContent = t('select');
            neqpTypeSelect.appendChild(emptyOption);

            // Użycie CONFIG.contentOptions zamiast statycznej tablicy
            CONFIG.contentOptions.inbound.forEach(function(opt) {
                const option = document.createElement("option");
                option.value = opt.value;
                option.textContent = opt.value;
                option.title = getContentDesc('inbound', opt.value); // Dynamiczny opis w odpowiednim języku
                neqpTypeSelect.appendChild(option);
            });

            let CONTENT = "";

            neqpTypeSelect.addEventListener('change', function() {
                CONTENT = this.value;
            });

            modal_ib.appendChild(neqpTypeSelect);

            const unloadingDateLabel = document.createElement("h3");
            unloadingDateLabel.textContent = t('dateUnloading');
            modal_ib.appendChild(unloadingDateLabel);

            const unloadingDateInput = document.createElement("input");
            unloadingDateInput.type = "text";
            unloadingDateInput.value = "n/a";
            modal_ib.appendChild(unloadingDateInput);

            const descrTextareaLabel = document.createElement("h3");
            descrTextareaLabel.textContent = t('description');
            modal_ib.appendChild(descrTextareaLabel);

            const descrTextarea = document.createElement("textarea");
            descrTextarea.style.width = "75%";
            descrTextarea.style.height = "50px";
            modal_ib.appendChild(descrTextarea);

            const reportTextareaLabel = document.createElement("h3");
            reportTextareaLabel.textContent = t('report');
            reportTextareaLabel.style.marginTop = "20px";
            modal_ib.appendChild(reportTextareaLabel);

            const reportTextarea = document.createElement("textarea");
            reportTextarea.style.width = "75%";
            reportTextarea.style.height = "100px";
            reportTextarea.style.marginBottom = "20px";
            modal_ib.appendChild(reportTextarea);

            const createButton = document.createElement("button");
            createButton.textContent = t('create');
            createButton.addEventListener("click", function() {
                const unloadingDate = unloadingDateInput.value;
                const login = loginInput.value;
                const isavrid = isavridInput.value;
                const isStoreChecked = storeCheckbox.checked;

                let report = "";

                if (isStoreChecked) {
                    // Tryb STORE - nie wymaga ISA/VRID ani CONTENT
                    report = `STORE INBOUND`;

                    // Dodaj opcjonalny CONTENT jeśli wybrano
                    if (CONTENT) {
                        report += `${CONTENT}\n`;
                    }

                    // Dodaj opcjonalny ISA/VRID jeśli wpisano
                    if (isavrid && isavrid.trim() !== "") {
                        if(CONTENT === "IBTRANS") {
                            report += `\nVRID: ${isavrid}`;
                        } else {
                            report += `\nISA: ${isavrid}`;
                        }
                    }

                    report += `\nUnloading date: ${unloadingDate}\nDescr: ${descrTextarea.value}\n${login}`;
                } else {
                    // Normalny tryb - wymagane wszystkie pola
                    if (!isavrid || isavrid.trim() === "") {
                        report = t('errorNoISA');
                    } else if (!CONTENT) {
                        report = t('errorNoContent');
                    } else if (!unloadingDate || unloadingDate.trim() === "") {
                        report = t('errorNoDate');
                    } else {
                        if(CONTENT === "IBTRANS") {
                            report = `${CONTENT}\nVRID: ${isavrid}\nUnloading date: ${unloadingDate}\nDescr: ${descrTextarea.value}\n${login}`;
                        } else {
                            report = `${CONTENT}\nISA: ${isavrid}\nUnloading date: ${unloadingDate}\nDescr: ${descrTextarea.value}\n${login}`;
                        }
                    }
                }

                reportTextarea.value = report;
            });

            modal_ib.appendChild(createButton);

            const closeButton = document.createElement("button");
            closeButton.textContent = "X";
            closeButton.style.position = "absolute";
            closeButton.style.top = "0";
            closeButton.style.right = "0";
            closeButton.style.width = "auto";
            closeButton.addEventListener("click", () => {
                clearElementContent(document.getElementById("modal_ib_id"));
                modal_ib.style.display = "none";
            });
            modal_ib.appendChild(closeButton);

            addSettingsButtonToModal(modal_ib);

            document.body.appendChild(modal_ib);
            dragElement(document.getElementById("modal_ib_id"));
        } else {
            modal_ib.style.display = "flex";
        }
    }


    // Poprawiona funkcja createObModal
    function createObModal () {
        const modal_ob = document.getElementById("modal_ob_id");
        if(!modal_ob) {
            const modal_ob = document.createElement("div");
            modal_ob.id = "modal_ob_id";
            modal_ob.style.position = "fixed";
            modal_ob.style.top = "50%";
            modal_ob.style.left = "20%";
            modal_ob.style.transform = "translate(-50%, -50%)";
            modal_ob.style.width = "20%";
            modal_ob.style.backgroundColor = "white";
            modal_ob.style.padding = "20px";
            modal_ob.style.display = "flex";
            modal_ob.style.flexDirection = "column";
            modal_ob.style.alignItems = "center";
            modal_ob.style.textAlign = "center";
            modal_ob.style.zIndex = "9999";
            modal_ob.style.border = "10px silver solid";

            const title = document.createElement("h1");
            title.textContent = t('outbound') + " Asset";
            title.id = "modal_ob_idheader";
            title.style.cursor = "move";
            title.style.fontSize = "32px";
            modal_ob.appendChild(title);

            // ISA/VRID Section
            const isavridLabel = document.createElement("h3");
            isavridLabel.textContent = t('isavrid');
            modal_ob.appendChild(isavridLabel);

            const isavridInput = document.createElement("input");
            isavridInput.type = "text";
            isavridInput.name = "ISAVRID";
            modal_ob.appendChild(isavridInput);

            // STORE CHECKBOX
            const storeLabel = document.createElement("h3");
            storeLabel.textContent = t('store');
            modal_ob.appendChild(storeLabel);

            const storeCheckbox = document.createElement("input");
            storeCheckbox.type = "checkbox";
            storeCheckbox.id = "storeCheckbox_ob";
            storeCheckbox.style.marginBottom = "10px";
            storeCheckbox.checked = false;
            modal_ob.appendChild(storeCheckbox);

            const loginLabel = document.createElement("h3");
            loginLabel.textContent = t('login');
            modal_ob.appendChild(loginLabel);

            const loginInput = document.createElement("input");
            loginInput.type = "text";
            loginInput.name = "login";
            loginInput.value = document.getElementsByClassName("a-color-link a-text-bold")[0].innerText;
            modal_ob.appendChild(loginInput);

            // CONTENT Section
            const content_label = document.createElement("h3");
            content_label.textContent = t('content');
            modal_ob.appendChild(content_label);

            const neqpTypeSelect = document.createElement("select");
            neqpTypeSelect.style.width = "100%";
            neqpTypeSelect.id = "neqpTypeSelect_ob_id";
            neqpTypeSelect.style.marginBottom = "10px";

            // Dodanie pustej opcji jako domyślnej
            const emptyOption = document.createElement("option");
            emptyOption.value = "";
            emptyOption.textContent = t('select');
            neqpTypeSelect.appendChild(emptyOption);

            // Użycie CONFIG.contentOptions zamiast statycznej tablicy
            CONFIG.contentOptions.outbound.forEach(function(opt) {
                const option = document.createElement("option");
                option.value = opt.value;
                option.textContent = opt.value;
                option.title = getContentDesc('outbound', opt.value); // Dynamiczny opis w odpowiednim języku
                neqpTypeSelect.appendChild(option);
            });

            let CONTENT_OB = "";

            neqpTypeSelect.addEventListener('change', function() {
                CONTENT_OB = this.value;
            });

            modal_ob.appendChild(neqpTypeSelect);

            const unloadingDateLabel = document.createElement("h3");
            unloadingDateLabel.textContent = t('dateUnloading');
            modal_ob.appendChild(unloadingDateLabel);

            const unloadingDateInput = document.createElement("input");
            unloadingDateInput.type = "text";
            unloadingDateInput.value = "n/a";
            modal_ob.appendChild(unloadingDateInput);

            const descrTextareaLabel = document.createElement("h3");
            descrTextareaLabel.textContent = t('description');
            modal_ob.appendChild(descrTextareaLabel);

            const descrTextarea = document.createElement("textarea");
            descrTextarea.style.width = "75%";
            descrTextarea.style.height = "50px";
            modal_ob.appendChild(descrTextarea);

            const reportTextareaLabel = document.createElement("h3");
            reportTextareaLabel.textContent = t('report');
            reportTextareaLabel.style.marginTop = "20px";
            modal_ob.appendChild(reportTextareaLabel);

            const reportTextarea = document.createElement("textarea");
            reportTextarea.style.width = "75%";
            reportTextarea.style.height = "100px";
            reportTextarea.style.marginBottom = "20px";
            modal_ob.appendChild(reportTextarea);

            const createButton = document.createElement("button");
            createButton.textContent = t('create');
            createButton.addEventListener("click", function() {
                const unloadingDate = unloadingDateInput.value;
                const login = loginInput.value;
                const isavrid = isavridInput.value;
                const isStoreChecked = storeCheckbox.checked;

                let report = "";

                if (isStoreChecked) {
                    // Tryb STORE - nie wymaga ISA/VRID ani CONTENT
                    report = `STORE OUTBOUND`;

                    // Dodaj opcjonalny CONTENT jeśli wybrano
                    if (CONTENT_OB) {
                        report += `\n${CONTENT_OB}`;
                    }

                    // Dodaj opcjonalny ISA/VRID jeśli wpisano
                    if (isavrid && isavrid.trim() !== "") {
                        report += `\nISA/VRID: ${isavrid}`;
                    }

                    report += `\nUnloading date: ${unloadingDate}\nDescr: ${descrTextarea.value}\n${login}`;
                } else {
                    // Normalny tryb - wymagane wszystkie pola
                    if (!isavrid || isavrid.trim() === "") {
                        report = t('errorNoISA');
                    } else if (!CONTENT_OB) {
                        report = t('errorNoContent');
                    } else if (!unloadingDate || unloadingDate.trim() === "") {
                        report = t('errorNoDate');
                    } else {
                        report = `${CONTENT_OB}\nISA/VRID: ${isavrid}\nUnloading date: ${unloadingDate}\nDescr: ${descrTextarea.value}\n${login}`;
                    }
                }

                reportTextarea.value = report;
            });

            modal_ob.appendChild(createButton);

            const closeButton = document.createElement("button");
            closeButton.textContent = "X";
            closeButton.style.position = "absolute";
            closeButton.style.top = "0";
            closeButton.style.right = "0";
            closeButton.style.width = "auto";
            closeButton.addEventListener("click", () => {
                clearElementContent(document.getElementById("modal_ob_id"));
                modal_ob.style.display = "none";
            });
            modal_ob.appendChild(closeButton);

            addSettingsButtonToModal(modal_ob);

            document.body.appendChild(modal_ob);
            dragElement(document.getElementById("modal_ob_id"));
        } else {
            modal_ob.style.display = "flex";
        }
    }



    // Poprawiona funkcja createCRETCDModal
    function createCRETCDModal () {
        const CRETCD = document.getElementById("CRETCD_id");
        if(!CRETCD) {
            const CRETCD = document.createElement("div");
            CRETCD.id = "CRETCD_id";
            CRETCD.style.position = "fixed";
            CRETCD.style.top = "50%";
            CRETCD.style.left = "20%";
            CRETCD.style.transform = "translate(-50%, -50%)";
            CRETCD.style.width = "20%";
            CRETCD.style.backgroundColor = "white";
            CRETCD.style.padding = "20px";
            CRETCD.style.display = "flex";
            CRETCD.style.flexDirection = "column";
            CRETCD.style.alignItems = "center";
            CRETCD.style.textAlign = "center";
            CRETCD.style.zIndex = "9999";
            CRETCD.style.border = "10px silver solid";

            const title = document.createElement("h1");
            title.textContent = t('relo') + " Asset";
            title.id = "CRETCD_idheader";
            title.style.cursor = "move";
            title.style.fontSize = "32px";
            CRETCD.appendChild(title);

            // DEPARTMENT Section
            const department_label = document.createElement("h3");
            department_label.textContent = t('department');
            CRETCD.appendChild(department_label);

            const radioButtonsContainer = document.createElement("div");
            radioButtonsContainer.style.width = "100%";
            radioButtonsContainer.style.display = "flex";
            radioButtonsContainer.style.justifyContent = "space-around";
            radioButtonsContainer.style.marginBottom = "10px";

            const radioButtonsData = [
                { label: "Customer Returns", value: "CRET" },
                { label: "Clean Decant", value: "CLEAN DECANT" }
            ];

            let department_relo = "";

            radioButtonsData.forEach(function(radioButtonData) {
                const radioButton = document.createElement("input");
                radioButton.type = "radio";
                radioButton.name = "DEPARTMENT_RELO";
                radioButton.value = radioButtonData.value;
                radioButton.style.marginLeft = "5px";

                const label = document.createElement("label");
                label.innerHTML = radioButtonData.label + "<br>";
                label.appendChild(radioButton);

                radioButtonsContainer.appendChild(label);

                radioButton.addEventListener("change", function() {
                    if (radioButton.checked) {
                        department_relo = radioButton.value;
                    }
                });
            });

            CRETCD.appendChild(radioButtonsContainer);

            // VRID/ISA Section
            const isavridLabel = document.createElement("h3");
            isavridLabel.textContent = t('isavrid');
            CRETCD.appendChild(isavridLabel);

            const isavridInput = document.createElement("input");
            isavridInput.type = "text";
            isavridInput.name = "ISAVRID";
            CRETCD.appendChild(isavridInput);

            // STORE CHECKBOX
            const storeLabel = document.createElement("h3");
            storeLabel.textContent = t('store');
            CRETCD.appendChild(storeLabel);

            const storeCheckbox = document.createElement("input");
            storeCheckbox.type = "checkbox";
            storeCheckbox.id = "storeCheckbox_relo";
            storeCheckbox.style.marginBottom = "10px";
            storeCheckbox.checked = false;
            CRETCD.appendChild(storeCheckbox);

            // CONTENT Section
            const content_label = document.createElement("h3");
            content_label.textContent = t('content');
            CRETCD.appendChild(content_label);

            const neqpTypeSelect = document.createElement("select");
            neqpTypeSelect.style.width = "100%";
            neqpTypeSelect.id = "neqpTypeSelect_relo_id";
            neqpTypeSelect.style.marginBottom = "10px";

            // Dodanie pustej opcji jako domyślnej
            const emptyOption = document.createElement("option");
            emptyOption.value = "";
            emptyOption.textContent = t('select');
            neqpTypeSelect.appendChild(emptyOption);

            // Użycie CONFIG.contentOptions zamiast statycznej tablicy
            CONFIG.contentOptions.relo.forEach(function(opt) {
                const option = document.createElement("option");
                option.value = opt.value;
                option.textContent = opt.value;
                option.title = getContentDesc('relo', opt.value); // Dynamiczny opis w odpowiednim języku
                neqpTypeSelect.appendChild(option);
            });

            let CONTENT_RELO = "";

            neqpTypeSelect.addEventListener('change', function() {
                CONTENT_RELO = this.value;
            });

            CRETCD.appendChild(neqpTypeSelect);

            // SORT TYPE Section
            const sort_label = document.createElement("h3");
            sort_label.textContent = t('sortType');
            CRETCD.appendChild(sort_label);

            const sortTypeSelect = document.createElement("select");
            sortTypeSelect.style.width = "100%";
            sortTypeSelect.id = "sortTypeSelect_id";
            sortTypeSelect.style.marginBottom = "10px";

            // Dodanie pustej opcji jako domyślnej
            const emptySortOption = document.createElement("option");
            emptySortOption.value = "";
            emptySortOption.textContent = t('select');
            sortTypeSelect.appendChild(emptySortOption);

            // Użycie CONFIG.contentOptions dla Sort Type
            CONFIG.contentOptions.sortType.forEach(function(opt) {
                const option = document.createElement("option");
                option.value = opt.value;
                option.textContent = opt.value;
                option.title = getContentDesc('sortType', opt.value); // Dynamiczny opis w odpowiednim języku
                sortTypeSelect.appendChild(option);
            });

            let sortType = "";

            sortTypeSelect.addEventListener('change', function() {
                sortType = this.value;
            });

            CRETCD.appendChild(sortTypeSelect);

            const loginLabel = document.createElement("h3");
            loginLabel.textContent = t('login');
            CRETCD.appendChild(loginLabel);

            const loginInput = document.createElement("input");
            loginInput.type = "text";
            loginInput.name = "login";
            loginInput.value = document.getElementsByClassName("a-color-link a-text-bold")[0].innerText;
            CRETCD.appendChild(loginInput);

            const unloadingDateLabel = document.createElement("h3");
            unloadingDateLabel.textContent = t('dateUnloading');
            CRETCD.appendChild(unloadingDateLabel);

            const unloadingDateInput = document.createElement("input");
            unloadingDateInput.type = "text";
            unloadingDateInput.value = "n/a";
            CRETCD.appendChild(unloadingDateInput);

            const descrTextareaLabel = document.createElement("h3");
            descrTextareaLabel.textContent = t('description');
            CRETCD.appendChild(descrTextareaLabel);

            const descrTextarea = document.createElement("textarea");
            descrTextarea.style.width = "75%";
            descrTextarea.style.height = "50px";
            CRETCD.appendChild(descrTextarea);

            const reportTextareaLabel = document.createElement("h3");
            reportTextareaLabel.textContent = t('report');
            reportTextareaLabel.style.marginTop = "20px";
            CRETCD.appendChild(reportTextareaLabel);

            const reportTextarea = document.createElement("textarea");
            reportTextarea.style.width = "75%";
            reportTextarea.style.height = "100px";
            reportTextarea.style.marginBottom = "20px";
            CRETCD.appendChild(reportTextarea);

            const createButton = document.createElement("button");
            createButton.textContent = t('create');
            createButton.addEventListener("click", function() {
                const unloadingDate = unloadingDateInput.value;
                const login = loginInput.value;
                const isavrid = isavridInput.value;
                const isStoreChecked = storeCheckbox.checked;
                const currentSortType = sortTypeSelect.value;

                let report = "";

                if (isStoreChecked) {
                    // Tryb STORE - nie wymaga innych pól
                    if (!department_relo || department_relo.trim() === "") {
                        report = t('errorNoDepartment');
                    } else {
                        report = `STORE ${department_relo}`;

                        // Dodaj opcjonalne pola jeśli wypełniono
                        if (isavrid && isavrid.trim() !== "") {
                            report += `\nVRID / ISA: ${isavrid}`;
                        }

                        if (CONTENT_RELO) {
                            report += `\nContent: ${CONTENT_RELO}`;
                        }

                        if (currentSortType) {
                            report += `\nSort Type: ${currentSortType}`;
                        }

                        report += `\nUnloading date: ${unloadingDate}\nDescr: ${descrTextarea.value}\n${login}`;
                    }
                } else {
                    // Normalny tryb - wymagane wszystkie pola
                    if (!department_relo || department_relo.trim() === "") {
                        report = t('errorNoDepartment');
                    } else if (!isavrid || isavrid.trim() === "") {
                        report = t('errorNoVRID');
                    } else if (!CONTENT_RELO) {
                        report = t('errorNoContent');
                    } else if (!currentSortType) {
                        report = t('errorNoSortType');
                    } else if (!unloadingDate || unloadingDate.trim() === "") {
                        report = t('errorNoDate');
                    } else {
                        report = `${CONTENT_RELO}\nVRID / ISA: ${isavrid}\nSort Type: ${currentSortType}\nUnloading date: ${unloadingDate}\nDescr: ${descrTextarea.value}\n${login}`;
                    }
                }

                reportTextarea.value = report;
            });

            CRETCD.appendChild(createButton);

            const closeButton = document.createElement("button");
            closeButton.textContent = "X";
            closeButton.style.position = "absolute";
            closeButton.style.top = "0";
            closeButton.style.right = "0";
            closeButton.style.width = "auto";
            closeButton.addEventListener("click", () => {
                clearElementContent(document.getElementById("CRETCD_id"));
                CRETCD.style.display = "none";
            });
            CRETCD.appendChild(closeButton);

            addSettingsButtonToModal(CRETCD);

            document.body.appendChild(CRETCD);
            dragElement(document.getElementById("CRETCD_id"));
        } else {
            CRETCD.style.display = "flex";
        }
    }



    // Poprawiona funkcja createDefectsModal
    function createDefectsModal() {
        const modalDefects = document.getElementById("modal_defects_id");
        if (!modalDefects) {
            const modalDefects = document.createElement("div");
            modalDefects.id = "modal_defects_id";
            modalDefects.style.width = "22%";
            modalDefects.style.margin = "0 auto";
            modalDefects.style.zIndex = "9999";
            modalDefects.style.backgroundColor = "#fff";
            modalDefects.style.padding = "20px";
            modalDefects.style.position = "absolute";
            modalDefects.style.top = "50%";
            modalDefects.style.left = "20%";
            modalDefects.style.transform = "translate(-50%, -50%)";
            modalDefects.style.display = "flex";
            modalDefects.style.flexDirection = "column";
            modalDefects.style.alignItems = "center";
            modalDefects.style.justifyContent = "center";
            modalDefects.style.border = "10px crimson solid";

            const defectsTitle = document.createElement("h1");
            defectsTitle.textContent = "DEFECT";
            defectsTitle.id = "modal_defects_idheader";
            defectsTitle.style.cursor = "move";
            defectsTitle.style.fontSize = "40px";
            modalDefects.appendChild(defectsTitle);

            // NOWA SEKCJA: TAG TYPE (YELLOW/RED)
            const tagTypeLabel = document.createElement("h3");
            tagTypeLabel.textContent = "TAG TYPE";
            tagTypeLabel.style.marginTop = "15px";
            tagTypeLabel.style.marginBottom = "5px";
            modalDefects.appendChild(tagTypeLabel);

            const tagTypeContainer = document.createElement("div");
            tagTypeContainer.style.display = "flex";
            tagTypeContainer.style.alignItems = "center";
            tagTypeContainer.style.justifyContent = "center";
            tagTypeContainer.style.marginBottom = "15px";

            let tagType = ""; // Zmienna do przechowania wybranego tagu

            const yellowTagRadio = document.createElement("input");
            yellowTagRadio.type = "radio";
            yellowTagRadio.name = "tagType";
            yellowTagRadio.value = "YELLOW TAGGED";
            yellowTagRadio.id = "yellowTagRadio_id";
            yellowTagRadio.style.marginRight = "5px";

            const yellowTagLabel = document.createElement("h4");
            yellowTagLabel.textContent = "YELLOW TAGGED";
            yellowTagLabel.style.margin = "0 15px 0 0";
            yellowTagLabel.style.color = "#FFA500";
            yellowTagLabel.style.fontWeight = "bold";

            const redTagRadio = document.createElement("input");
            redTagRadio.type = "radio";
            redTagRadio.name = "tagType";
            redTagRadio.value = "RED TAGGED";
            redTagRadio.id = "redTagRadio_id";
            redTagRadio.style.marginRight = "5px";

            const redTagLabel = document.createElement("h4");
            redTagLabel.textContent = "RED TAGGED";
            redTagLabel.style.margin = "0";
            redTagLabel.style.color = "#DC143C";
            redTagLabel.style.fontWeight = "bold";

            // Event listeners dla tagów
            yellowTagRadio.addEventListener("change", function() {
                if (yellowTagRadio.checked) {
                    tagType = yellowTagRadio.value;
                }
            });

            redTagRadio.addEventListener("change", function() {
                if (redTagRadio.checked) {
                    tagType = redTagRadio.value;
                }
            });

            tagTypeContainer.appendChild(yellowTagRadio);
            tagTypeContainer.appendChild(yellowTagLabel);
            tagTypeContainer.appendChild(redTagRadio);
            tagTypeContainer.appendChild(redTagLabel);

            modalDefects.appendChild(tagTypeContainer);


            const caseNumberLabel = document.createElement("h3");
            caseNumberLabel.id = "caseNumber_id";
            caseNumberLabel.textContent = "CASE NUMBER";
            modalDefects.appendChild(caseNumberLabel);

            const caseNumberInput = document.createElement("input");
            caseNumberInput.type = "text";
            caseNumberInput.id = "caseNumberInput_id";
            caseNumberInput.style.width = "auto";
            modalDefects.appendChild(caseNumberInput);

            const loginLabel = document.createElement("h3");
            loginLabel.textContent = "LOGIN";
            modalDefects.appendChild(loginLabel);

            const loginInput = document.createElement("input");
            loginInput.type = "text";
            loginInput.name = "login";
            loginInput.style.width = "auto";
            loginInput.value = document.getElementsByClassName("a-color-link a-text-bold")[0].innerText;
            modalDefects.appendChild(loginInput);


            // SEKCJA: ASSET TYPE (Swap-Body/Trailer)
            const assetTypeLabel = document.createElement("h3");
            assetTypeLabel.textContent = "ASSET TYPE";
            assetTypeLabel.style.marginBottom = "5px";
            modalDefects.appendChild(assetTypeLabel);

            const swapBodyRadio = document.createElement("input");
            swapBodyRadio.type = "radio";
            swapBodyRadio.name = "defectType";
            swapBodyRadio.value = "Swap-Body";
            swapBodyRadio.id = "swapBodyRadio_id";
            swapBodyRadio.style.marginRight = "10px";

            const swapBodyLabel = document.createElement("h4");
            swapBodyLabel.textContent = "Swap-Body";

            const trailerRadio = document.createElement("input");
            trailerRadio.type = "radio";
            trailerRadio.name = "defectType";
            trailerRadio.value = "Trailer";
            trailerRadio.id = "trailerRadio_id";
            trailerRadio.style.marginRight = "10px";

            const trailerLabel = document.createElement("h4");
            trailerLabel.textContent = "Trailer";

            const radioContainer = document.createElement("div");
            radioContainer.style.display = "flex";
            radioContainer.style.alignItems = "center";
            radioContainer.style.justifyContent = "center";
            radioContainer.style.marginBottom = "15px";
            modalDefects.appendChild(radioContainer);

            radioContainer.appendChild(swapBodyRadio);
            radioContainer.appendChild(swapBodyLabel);
            radioContainer.appendChild(trailerRadio);
            radioContainer.appendChild(trailerLabel);

            swapBodyRadio.classList.add("radio-input");
            swapBodyLabel.classList.add("radio-label");
            trailerRadio.classList.add("radio-input");
            trailerLabel.classList.add("radio-label");

            const radioStyle = ".radio-input {  } .radio-label { margin-right: 5px ; display: inline-block; }";
            const styleElement = document.createElement("style");
            styleElement.textContent = radioStyle;
            document.head.appendChild(styleElement);

            const defectListLabel = document.createElement("h3");
            defectListLabel.textContent = "Type of defect:";
            modalDefects.appendChild(defectListLabel);

            const defectListSelect = document.createElement("select");
            defectListSelect.style.marginBottom = "10px";
            defectListSelect.name = "defectListSelect";
            defectListSelect.id = "defectListSelect_id";
            modalDefects.appendChild(defectListSelect);


            swapBodyRadio.addEventListener("change", function () {
                defectListSelect.innerHTML = "";

                CONFIG.contentOptions.defectsSwapBody.forEach(function (item) {
                    const defectOption = document.createElement("option");
                    // Wartość (dla raportu) zawsze po angielsku
                    defectOption.value = getDefectValueForReport(item);
                    // Tekst wyświetlany w zależności od języka
                    defectOption.textContent = getDefectDisplay(item);
                    // Dodaj data attribute z polską wersją dla debugowania
                    defectOption.setAttribute('data-value-pl', item.desc_pl);
                    defectOption.setAttribute('data-value-en', item.desc_en);
                    defectListSelect.appendChild(defectOption);
                });
            });

            trailerRadio.addEventListener("change", function () {
                defectListSelect.innerHTML = "";

                CONFIG.contentOptions.defectsTrailer.forEach(function (item) {
                    const defectOption = document.createElement("option");
                    // Wartość (dla raportu) zawsze po angielsku
                    defectOption.value = getDefectValueForReport(item);
                    // Tekst wyświetlany w zależności od języka
                    defectOption.textContent = getDefectDisplay(item);
                    // Dodaj data attribute z polską wersją dla debugowania
                    defectOption.setAttribute('data-value-pl', item.value_pl);
                    defectOption.setAttribute('data-value-en', item.value_en);
                    defectListSelect.appendChild(defectOption);
                });
            });

            const otherRadio = document.createElement("input");
            otherRadio.type = "radio";
            otherRadio.name = "defectType";
            otherRadio.id = "otherDefect_id";
            otherRadio.value = t('other_dmg');
            modalDefects.appendChild(otherRadio);

            const otherLabel = document.createElement("label");
            otherLabel.textContent = t('other_dmg');
            modalDefects.appendChild(otherLabel);

            const otherInput = document.createElement("input");
            otherInput.type = "text";
            otherInput.id = "otherDefect_text";
            modalDefects.appendChild(otherInput);

            const reportTextareaLabel = document.createElement("h3");
            reportTextareaLabel.textContent = "Report";
            reportTextareaLabel.style.marginTop = "20px";
            modalDefects.appendChild(reportTextareaLabel);

            const reportTextarea = document.createElement("textarea");
            reportTextarea.style.width = "75%";
            reportTextarea.style.height = "100px";
            reportTextarea.style.marginBottom = "10px";
            modalDefects.appendChild(reportTextarea);

            const createButton = document.createElement("button");
            createButton.textContent = "CREATE";
            createButton.addEventListener("click", function() {
                let caseNumber = caseNumberInput.value;
                const login = loginInput.value;
                let report = "";

                // Sprawdź czy wybrano tag type
                if (!tagType || tagType.trim() === "") {
                    report = "Nie wybrano typu tagu (YELLOW TAGGED / RED TAGGED)";
                    reportTextarea.value = report;
                    return;
                }

                if (!caseNumber || caseNumber.trim() === "") {
                    caseNumber = "n/a";
                }

                // Sprawdź czy wybrano typ defektu
                const swapBodyChecked = document.getElementById("swapBodyRadio_id").checked;
                const trailerChecked = document.getElementById("trailerRadio_id").checked;
                const otherChecked = document.getElementById("otherDefect_id").checked;

                if (!swapBodyChecked && !trailerChecked && !otherChecked) {
                    report = "No asset type selected (Swap-Body/Trailer) or 'Other Damage'";
                } else if (otherChecked) {
                    const descr = document.getElementById("otherDefect_text").value;
                    if (!descr || descr.trim() === "") {
                        report = "No damage description entered in 'Other damage' field";
                    } else {
                        report = `${tagType}\nCASE NUMBER: ${caseNumber}\n${tagType} BY: ${login}\nISSUE: ${descr}`;
                    }
                } else {
                    // Swap-Body or Trailer selected
                    const descr = document.getElementById("defectListSelect_id").value;
                    if (!descr || descr.trim() === "") {
                        report = "No damage type selected from the list";
                    } else {
                        report = `${tagType}\nCASE NUMBER: ${caseNumber}\n${tagType} BY: ${login}\nISSUE: ${descr}`;
                    }
                }

                reportTextarea.value = report;
            });

            createButton.style.marginBottom = "10px";
            modalDefects.appendChild(createButton);

            const closeButton = document.createElement("button");
            closeButton.textContent = "X";
            closeButton.style.position = "absolute";
            closeButton.style.top = "0";
            closeButton.style.right = "0";
            closeButton.style.width = "auto";
            closeButton.addEventListener("click", () => {
                clearElementContent(document.getElementById("modal_defects_id"));
                modalDefects.style.display = "none";
            });
            modalDefects.appendChild(closeButton);

            addSettingsButtonToModal(modalDefects);

            document.body.appendChild(modalDefects);
            dragElement(document.getElementById("modal_defects_id"));
        } else {
            modalDefects.style.display = "flex";
        }
    }


    // Funkcja tworząca okienko modalne dla przycisku "NON-INV"
    function createNonInvModal () {
        const modal_noninv = document.getElementById("modal_noninv_id");
        if(!modal_noninv) {
            const modal_noninv = document.createElement("div");
            modal_noninv.id = "modal_noninv_id";
            modal_noninv.style.position = "fixed";
            modal_noninv.style.top = "50%";
            modal_noninv.style.left = "20%";
            modal_noninv.style.transform = "translate(-50%, -50%)";
            modal_noninv.style.width = "20%";
            modal_noninv.style.backgroundColor = "white";
            modal_noninv.style.padding = "20px";
            modal_noninv.style.display = "flex";
            modal_noninv.style.flexDirection = "column";
            modal_noninv.style.alignItems = "center";
            modal_noninv.style.textAlign = "center";
            modal_noninv.style.zIndex = "9999";
            modal_noninv.style.border = "10px silver solid";

            const title = document.createElement("h1");
            title.textContent = t('nonInv').toUpperCase();
            title.id = "modal_noninv_idheader";
            title.style.cursor = "move";
            title.style.fontSize = "32px";
            modal_noninv.appendChild(title);

            // DEPARTMENT Section
            const departmentLabel = document.createElement("h3");
            departmentLabel.textContent = t('department');
            modal_noninv.appendChild(departmentLabel);

            const radioButtonsContainer = document.createElement("div");
            radioButtonsContainer.style.width = "100%";
            radioButtonsContainer.style.display = "flex";
            radioButtonsContainer.style.justifyContent = "space-around";
            radioButtonsContainer.style.marginBottom = "10px";

            const radioButtonsData = [
                { label: "Inbound", value: "IB" },
                { label: "Outbound", value: "OB" },
                { label: "CRET", value: "CRET" },
                { label: "CD", value: "CLEAN DECANT" }
            ];

            let department = "";

            radioButtonsData.forEach(function(radioButtonData) {
                const radioButton = document.createElement("input");
                radioButton.type = "radio";
                radioButton.name = "department";
                radioButton.value = radioButtonData.value;
                radioButton.style.marginLeft = "5px";

                const label = document.createElement("label");
                label.innerHTML = radioButtonData.label + "<br>";
                label.appendChild(radioButton);

                radioButtonsContainer.appendChild(label);

                radioButton.addEventListener("change", function() {
                    if (radioButton.checked) {
                        department = radioButton.value;
                    }
                });
            });

            modal_noninv.appendChild(radioButtonsContainer);

            // STORE Trailer Section
            const storeTrailerLabel = document.createElement("h3");
            storeTrailerLabel.textContent = t('storeTrailer');
            modal_noninv.appendChild(storeTrailerLabel);

            const storeTrailerRadioContainer = document.createElement("div");
            storeTrailerRadioContainer.style.width = "50%";
            storeTrailerRadioContainer.style.display = "flex";
            storeTrailerRadioContainer.style.justifyContent = "space-around";
            storeTrailerRadioContainer.style.marginBottom = "10px";

            const storeTrailerRadioData = [
                { label: "YES", value: "YES" },
                { label: "NO", value: "NO" },
                { label: "EMPTY", value: "EMPTY" }
            ];

            let storeTrailer = "";

            storeTrailerRadioData.forEach(function(radioData) {
                const radioButton = document.createElement("input");
                radioButton.type = "radio";
                radioButton.name = "storeTrailer";
                radioButton.value = radioData.value;
                radioButton.style.marginLeft = "5px";

                const label = document.createElement("label");
                label.textContent = radioData.label;
                label.appendChild(radioButton);

                radioButton.addEventListener("change", function() {
                    if (radioButton.checked) {
                        storeTrailer = radioButton.value;
                    }
                });

                storeTrailerRadioContainer.appendChild(label);
            });

            modal_noninv.appendChild(storeTrailerRadioContainer);

            // NEQP Type Section
            const neqpTypeLabel = document.createElement("h3");
            neqpTypeLabel.textContent = t('neqpType');
            modal_noninv.appendChild(neqpTypeLabel);

            const neqpTypeSelect = document.createElement("select");
            neqpTypeSelect.style.width = "100%";
            neqpTypeSelect.id = "neqpTypeSelect_noninv_id";
            neqpTypeSelect.style.marginBottom = "10px";

            // Dodanie pustej opcji jako domyślnej
            const emptyOption = document.createElement("option");
            emptyOption.value = "";
            emptyOption.textContent = t('select');
            neqpTypeSelect.appendChild(emptyOption);

            // UŻYJ CONFIG.contentOptions zamiast statycznej tablicy
            CONFIG.contentOptions.neqpType.forEach(function(opt) {
                const option = document.createElement("option");
                option.value = opt.value;
                option.textContent = opt.value;
                option.title = getContentDesc('neqpType', opt.value); // Dynamiczny opis
                neqpTypeSelect.appendChild(option);
            });


            modal_noninv.appendChild(neqpTypeSelect);

            const unloadingDateLabel = document.createElement("h3");
            unloadingDateLabel.textContent = t('dateUnloading');
            modal_noninv.appendChild(unloadingDateLabel);

            const unloadingDateInput = document.createElement("input");
            unloadingDateInput.type = "text";
            unloadingDateInput.value = "n/a";
            modal_noninv.appendChild(unloadingDateInput);

            const loginLabel = document.createElement("h3");
            loginLabel.textContent = t('login');
            modal_noninv.appendChild(loginLabel);

            const loginInput = document.createElement("input");
            loginInput.type = "text";
            loginInput.name = "login";
            loginInput.value = document.getElementsByClassName("a-color-link a-text-bold")[0].innerText;
            modal_noninv.appendChild(loginInput);

            const descrTextareaLabel = document.createElement("h3");
            descrTextareaLabel.textContent = t('description');
            modal_noninv.appendChild(descrTextareaLabel);

            const descrTextarea = document.createElement("textarea");
            descrTextarea.style.width = "75%";
            descrTextarea.style.height = "50px";
            modal_noninv.appendChild(descrTextarea);

            const reportTextareaLabel = document.createElement("h3");
            reportTextareaLabel.textContent = t('report');
            reportTextareaLabel.style.marginTop = "20px";
            modal_noninv.appendChild(reportTextareaLabel);

            const reportTextarea = document.createElement("textarea");
            reportTextarea.style.width = "75%";
            reportTextarea.style.height = "100px";
            reportTextarea.style.marginBottom = "20px";
            modal_noninv.appendChild(reportTextarea);

            const createButton = document.createElement("button");
            createButton.textContent = t('create');
            createButton.addEventListener("click", function() {
                const neqpType = document.getElementById("neqpTypeSelect_noninv_id").value;
                const unloadingDate = unloadingDateInput.value;
                const login = loginInput.value;
                const descr = descrTextarea.value;

                let report = "";

                if (!department) {
                    report = t('errorNoDepartment');
                } else if (!storeTrailer) {
                    report = t('errorNoStoreTrailer');
                } else if (storeTrailer === "EMPTY") {
                    report = `STORE ${department}`;
                } else {
                    if (!neqpType) {
                        report = t('errorNoNEQPType');
                    } else if (!unloadingDate || unloadingDate.trim() === "") {
                        report = t('errorNoDate');
                    } else if (storeTrailer === "YES") {
                        report = `STORE ${department}\n${neqpType}\nUnloading date: ${unloadingDate}\nDescr: ${descr}\n${login}`;
                    } else if (storeTrailer === "NO") {
                        report = `${neqpType}\n${department}\nUnloading date: ${unloadingDate}\nDescr: ${descr}\n${login}`;
                    }
                }

                reportTextarea.value = report;
            });

            modal_noninv.appendChild(createButton);

            const closeButton = document.createElement("button");
            closeButton.textContent = "X";
            closeButton.style.position = "absolute";
            closeButton.style.top = "0";
            closeButton.style.right = "0";
            closeButton.style.width = "auto";
            closeButton.addEventListener("click", () => {
                clearElementContent(document.getElementById("modal_noninv_id"));
                modal_noninv.style.display = "none";
            });
            modal_noninv.appendChild(closeButton);

            addSettingsButtonToModal(modal_noninv);

            document.body.appendChild(modal_noninv);
            dragElement(document.getElementById("modal_noninv_id"));
        } else {
            modal_noninv.style.display = "flex";
        }
    }



    // Sprawdzanie, czy element o id "yms-annotation-modal" istnieje
    const checkModalExistence = setInterval(function() {
        const modal = document.getElementById("yms-annotation-modal");
        if (modal) {
            //clearInterval(checkModalExistence);
            createModal();
        }
    }, 1000); // Sprawdzanie co 1 sekundę
})();


function clearElementContent(element) {
    // Wyczyść checkboxy
    const checkboxes = element.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
        checkbox.checked = false;
    });

    // Wyczyść radiobuttony
    const radiobuttons = element.querySelectorAll('input[type="radio"]');
    radiobuttons.forEach((radiobutton) => {
        radiobutton.checked = false;
    });

    // Zresetuj wartość list rozwijanych
    const selectElements = element.querySelectorAll('select');
    selectElements.forEach((select) => {
        select.selectedIndex = 0;
        select.value = "";
    });

    // Wyczyść pola tekstowe
    const textInputs = element.querySelectorAll('input[type="text"]');
    textInputs.forEach((textInput) => {
        if(textInput.name != "login")
        {
            textInput.value = '';
        }
    });

    // Wyczyść pola textarea
    const textAreas = element.querySelectorAll('textarea');
    textAreas.forEach((textArea) => {
        textArea.value = '';
    })

    nonInvType = "";
}



function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "header")) {
        // if present, the header is where you move the DIV from:
        document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}