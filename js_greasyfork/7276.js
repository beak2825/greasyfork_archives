// ==UserScript==
// @name           WME URComments Dutch List
// @description    This script is to facilitate the handling of Dutch URs. To be used with the main script URComments.
// @namespace      RickZabel@gmail.com
// @grant          none
// @grant          GM_info
// @version        0.1.7
// @match https://editor-beta.waze.com/*editor*
// @match https://beta.waze.com/*editor*
// @match https://www.waze.com/*editor*
// @author         Rick Zabel '2014 
// @license        MIT/BSD/X11
// @icon			data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAwCAYAAACFUvPfAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjQyQjZDNjdEODYzODExRTRBRDY0Q0I2QjA1MjU4N0EyIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjQyQjZDNjdFODYzODExRTRBRDY0Q0I2QjA1MjU4N0EyIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NDJCNkM2N0I4NjM4MTFFNEFENjRDQjZCMDUyNTg3QTIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NDJCNkM2N0M4NjM4MTFFNEFENjRDQjZCMDUyNTg3QTIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6++Bk8AAANOElEQVR42tRZ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	
// @downloadURL https://update.greasyfork.org/scripts/7276/WME%20URComments%20Dutch%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/7276/WME%20URComments%20Dutch%20List.meta.js
// ==/UserScript==

var UrcommentsDutchVersion = GM_info.script.version; 
var UrcommentsDutchUpdateMessage = "yes"; // yes alert the user, no has a silent update.
var UrcommentsDutchVersionUpdateNotes = "URC Dutch List has been updated to " + UrcommentsDutchVersion;
UrcommentsDutchVersionUpdateNotes = UrcommentsDutchVersionUpdateNotes + "\n" + "\n-code update for WME changes\n-minor text improvements\n\n! Hope you still like it ¡";

if (UrcommentsDutchUpdateMessage === "yes") {
    if (localStorage.getItem('UrcommentsDutchVersion') !== UrcommentsDutchVersion) {
        alert(UrcommentsDutchVersionUpdateNotes);
        localStorage.setItem('UrcommentsDutchVersion', UrcommentsDutchVersion);
    }
}

/* Changelog
 * 0.1.7 - minor text improvements
 * 0.1.6 - nog meer speed limit responses toegevoegd; text improvements
 * 0.1.5 - added often used extra SL response
 * 0.1.4 - changed SL responses on request
 * 0.1.3 - added 2 new speed limit responses
 * 0.1.2 - Modified link to status update including mention of “INTL map tiles” in Solved; minor bug fixes
 * 0.1.1 - Implemented update alerts showing version info, added disabled done >next button ("Volgende aanpassingsverzoek")
 * 0.1.0 - updated code; added intructions for filtering
 * 0.0.9 - typos; changes sequence: default responses are at the bottom now; updated Turn not allowed (kruising onbekend)
 * 0.0.8 - added: Dutch titles to UR type-depending comments, "App bug" comment; Combined "Sluiten zonder reactie" met "Geen nadere reactie. Niet geïdentificeerd"; changes to the sequence based on use; Changed response to default UR "afslag niet toegestaan"; script improvement for new version; minor text improvements based on feedback
 * 0.0.7 - added: Text-to-Speech, Camera toevoegen, Turn not allowed (kruising onbekend); changed "Follow-up na 4 dagen" vervangen door "Herinnering", "7 dagen zonder reactie" door "Sluiten zonder reactie"; typos
 * 0.0.6 - added: reset comment and status, road closure or traffic jam, include user's description; improved link to BNL forum @ "7th day with no response"; minor text improvements
 * 0.0.5 - improved and new replies
 * 0.0.4 - new replies added and minor text improvements
 * 0.0.3 - fixed all the var names to rematch the new format
 * 0.0.2 - tweaks to the grouping of comments
 * 0.0.1 - initial version
 */
//Als je deze of de custom file wijzigt, zorg dan dat je een backup hebt. Het hoofdscript kan mogelijk een update bewerkstelligen in de standaard custom file, waardoor jouw persoonlijke teksten overschreven worden bij een automatische update. 
//Als je aanhalingstekens in je teksten of titels gebruikt, moet je er altijd een backslash voor zetten. Bijvoorbeeld: Dit is een \"woord\" tussen aanhalingstekens, of \"dit is een zin\" tussen aanhalingstekens.
//Voor witregels tussen alinea's,  gebruik \r\r. Bijvoorbeeld: "Alinea\r\rAlinea2",
//gebruik 1 keer \r voor alinea's zonder witregel.
//Aangepaste configuratie: Hiermee kun je de "herinnering" en "Sluiten zonder reactie" berichten noemen zoals je wil.

//De positie in de lijst verwijst naar de positie van de herinnering; start bij 0 en tel titel, tekst en status, niet de lege regels. In deze lijst is dat "Herinnering" 
window.UrcommentsDutchReminderPosistion = 9;

//Dit bericht wordt met een link toegevoegd aan de herinering. Op dit moment genereert Waze zelf de juiste link, en is deze optie uitgeschakeld in het script.
window.UrcommentsDutchReplyInstructions = 'Mocht je dit bericht niet in je mail krijgen, dan kun je deze ook beantwoorden via onderstaande URL. Log in met je Waze gegevens, klik op de gekleurde ballon in het midden van je scherm en vervolgens op gesprek (conversation).\r';

//The positie van de tekst voor het automatisch sluiten van een UR; start bij 0 en tel titel, tekst en status, niet de lege regels. In deze lijst is dat "Sluiten zonder reactie"
window.UrcommentsDutchCloseNotIdentifiedPosistion = 12;

//Deze lijst toon de standaard UR types, zoals die gekozen kunnen worden vanuit de app. De titels moeten hetzelfde zijn als de titels van de URs in jouw gebied. In principe niet veranderen dus! 
//Deze titels moeten allemaal in de lijst staan om ze automatisch te kunnen genereren!
window.UrcommentsDutchdef_names = [];
window.UrcommentsDutchdef_names[6] = "Foute afslag"; //LM4 en WME "Incorrect turn";
window.UrcommentsDutchdef_names[7] = "Foutief adres"; //LM1 Onjuist adres WME Fout adres"Incorrect address";
window.UrcommentsDutchdef_names[8] = "Incorrect route"; //"Incorrect route";
window.UrcommentsDutchdef_names[9] = "Rotonde niet aanwezig"; //LM5 WME "Missing roundabout";
window.UrcommentsDutchdef_names[10] = "Algemene kaartfout"; //app1 WME Algemene fout "General error";
window.UrcommentsDutchdef_names[11] = "Afslag niet toegestaan"; //app2 WME "Turn not allowed";
window.UrcommentsDutchdef_names[12] = "Foute kruising"; //app3 WME "Incorrect junction";
window.UrcommentsDutchdef_names[13] = "Ontbrekende brug"; //app4 Ontbrekende brug of viaduct "Missing bridge overpass";
window.UrcommentsDutchdef_names[14] = "Verkeerde instructie"; //WME app5 Foute instructie LM6 Verkeerde rijrichting "Wrong driving direction";
window.UrcommentsDutchdef_names[15] = "Ontbrekende afrit"; //WME app6 "Missing Exit";
window.UrcommentsDutchdef_names[16] = "Ontbrekende weg"; //app7 LM2 en WME Ontbrekende weg "Missing Road";
window.UrcommentsDutchdef_names[18] = "Ontbrekend herkenningspunt"; //LM3 en WME Ontbrekend herkenningspunt"Missing Landmark";
window.UrcommentsDutchdef_names[19] = "Blocked Road"; //"Blocked Road";
window.UrcommentsDutchdef_names[21] = "Missing Street Name"; //"Missing Street Name";
window.UrcommentsDutchdef_names[22] = "Incorrect Street Prefix or Suffix"; //"Incorrect Street Prefix or Suffix";
window.UrcommentsDutchdef_names[23] = "Speed Limit";  //speed limit ur type is number 23

//below is all of the text that is displayed to the user while using the script this section is new and going to be used in the next version of the script.
window.UrcommentsDutchURC_Text = [];
window.UrcommentsDutchURC_Text_tooltip = [];
window.UrcommentsDutchURC_USER_PROMPT = [];
window.UrcommentsDutchURC_URL = [];

//zoom out links
window.UrcommentsDutchURC_Text[0] = "Zoom uit 0 & sluit UR";
window.UrcommentsDutchURC_Text_tooltip[0] = "Zoomt helemaal uit en sluit de UR";

window.UrcommentsDutchURC_Text[1] = "Zoom uit 2 & sluit UR";		
window.UrcommentsDutchURC_Text_tooltip[1] = "Zoomt uit naar level 2 en sluit de UR";

window.UrcommentsDutchURC_Text[2] = "Zoom uit 3 & sluit UR";
window.UrcommentsDutchURC_Text_tooltip[2] = "Zoomt uit naar level (waar toolbox hightlighting werkt) en sluit de UR";

window.UrcommentsDutchURC_Text_tooltip[3] = "Laad de kaart opnieuw";

window.UrcommentsDutchURC_Text_tooltip[4] = "Telt het aantal URs in dit gebied";


//tab names
window.UrcommentsDutchURC_Text[5] = "Teksten";
window.UrcommentsDutchURC_Text[6] = "Filters";
window.UrcommentsDutchURC_Text[7] = "Instellingen";

//UR Filtering Tab
window.UrcommentsDutchURC_Text[8] = "Uitleg over Filters (Engels)";
window.UrcommentsDutchURC_URL[8] = "https://docs.google.com/presentation/d/1zwdKAejRbnkUll5YBfFNrlI2I3Owmb5XDIbRAf47TVU";

window.UrcommentsDutchURC_Text[9] = "Zet filters aan";
window.UrcommentsDutchURC_Text_tooltip[9] = "In- of uitschakelen van de filters";

window.UrcommentsDutchURC_Text[10] = "Laat het aantal URs zien";
window.UrcommentsDutchURC_Text_tooltip[10] = "Wel of niet laten zien van het aantal URs in het zichtbare gebied";

window.UrcommentsDutchURC_Text[12] = "Verberg URs in behandeling";
window.UrcommentsDutchURC_Text_tooltip[12] = "Laat alleen de URs zien waar actie op moet worden ondernomen";

window.UrcommentsDutchURC_Text[13] = "Alleen mijn URs";
window.UrcommentsDutchURC_Text_tooltip[13] = "Verberg URs die jij niet hebt behandeld";

window.UrcommentsDutchURC_Text[14] = "Alle URs voorbij wachttijd";
window.UrcommentsDutchURC_Text_tooltip[14] = "Laat ook URs die anderen behandelen zien, als ze langer open staan dan de ingestelde dagen voor een herinnering en afsluiten samen";

window.UrcommentsDutchURC_Text[15] = "Verberg URs voor herinnering";
window.UrcommentsDutchURC_Text_tooltip[15] = "Verberg URs die een herinnering nodig hebben";

window.UrcommentsDutchURC_Text[16] = "Verberg reacties van melder";
window.UrcommentsDutchURC_Text_tooltip[16] = "Verberg de URs waar de melder een reactie op heeft gegeven";

window.UrcommentsDutchURC_Text[17] = "Verberg URs om te sluiten";
window.UrcommentsDutchURC_Text_tooltip[17] = "Verberg URs die voorbij de wachttijd zijn om te sluiten";

window.UrcommentsDutchURC_Text[18] = "Verberg URs zonder reacties";
window.UrcommentsDutchURC_Text_tooltip[18] = "Verberg alle URs die geen nog geen reacties hebben";

window.UrcommentsDutchURC_Text[19] = "Verberg URs zonder beschrijving";
window.UrcommentsDutchURC_Text_tooltip[19] = "Verberg alleen URs zonder reacties, maar laat wel URs zien als er een beschrijving bij de melding ingegeven is ";

window.UrcommentsDutchURC_Text[20] = "Verberg URs met beschrijving";
window.UrcommentsDutchURC_Text_tooltip[20] = "Verberg alleen URs zonder reacties waarbij wel een beschrijving bij de melding ingegeven is. Laat alleen URs zien die geen enkel commentaar hebben";

window.UrcommentsDutchURC_Text[21] = "Verberg afgesloten URs";
window.UrcommentsDutchURC_Text_tooltip[21] = "Verberg afgesloten URs";

window.UrcommentsDutchURC_Text[22] = "Verberg duidings-URs";
window.UrcommentsDutchURC_Text_tooltip[22] = "Verberg URs die aangeduid zijn met een Uro-tag, zoals [NOTE]";

window.UrcommentsDutchURC_Text[23] = "Aantal dagen voor herinnering: ";
window.UrcommentsDutchURC_Text_tooltip[23] = "Aantal dagen na laatste reactie";

window.UrcommentsDutchURC_Text[24] = "Aantal dagen voor sluiten: ";
window.UrcommentsDutchURC_Text_tooltip[24] = "Aantal dagen na laatste reactie";

//settings tab
window.UrcommentsDutchURC_Text[25] = "Automatische reactie nieuwe UR";
window.UrcommentsDutchURC_Text_tooltip[25] = "Genereer automatisch de standaard tekst bij nieuwe URs";

window.UrcommentsDutchURC_Text[26] = "Automatische herinnering";
window.UrcommentsDutchURC_Text_tooltip[26] = "Genereer automatisch de standaard herinneringstekst bij URs die ouder zijn dan het aantal ingestelde dagen, met maar één reactie van een editor";

window.UrcommentsDutchURC_Text[27] = "Zoom in bij openen";
window.UrcommentsDutchURC_Text_tooltip[27] = "Zoomt automatisch in als je een UR opent";

window.UrcommentsDutchURC_Text[28] = "Centreer bij openen";
window.UrcommentsDutchURC_Text_tooltip[28] = "Centreer de kaart map als de UR reacties bevat en het zoomlevel is minder dan 3";

window.UrcommentsDutchURC_Text[29] = "Status instellen";
window.UrcommentsDutchURC_Text_tooltip[29] = "Verberg 'Melden als' en zet de status van het commentaar automatisch op open, opgelost, of niet geïdentificeerd, afhankelijk van welk commentaar je kiest";

window.UrcommentsDutchURC_Text[30] = "Automatisch bewaren na sluiten";
window.UrcommentsDutchURC_Text_tooltip[30] = "Bewaart automatisch de verandering in de status van de UR (opgelost of niet geïdentificeerd)";

window.UrcommentsDutchURC_Text[31] = "Sluit UR venster";
window.UrcommentsDutchURC_Text_tooltip[31] = "Sluit het UR-venster nadat je op 'Verzend' hebt geklikt (bij UR status 'Open')";

window.UrcommentsDutchURC_Text[32] = "Herlaad de kaart na reactie";
window.UrcommentsDutchURC_Text_tooltip[32] = "Laad de pagina opnieuw na verzenden. Indien van toepassing: dit forceert ook URO+ tot het opnieuw toepassen van de ingestelde filters. Op dit moment is dit niet nodig (Aug15), maar de optie zit er in voor als de werking van WME verandert. Het is sowieso niet van toepassing wanneer de status van URs wordt bewaard, omdat ´bewaren´ automatisch een reload tot gevolg heeft.";

window.UrcommentsDutchURC_Text[33] = "Uitzoomen na reactie";
window.UrcommentsDutchURC_Text_tooltip[33] = "Als je een tekst verzend, gaat de kaart automatisch terug naar het vorige zoom level";

window.UrcommentsDutchURC_Text[34] = "Ga terug naar tab 'Teksten'";
window.UrcommentsDutchURC_Text_tooltip[34] = "Schakelt automatisch naar de tab 'Teksten' als je een nieuwe UR opent of nadat de pagina opnieuw wordt geladen. Bij het sluiten van een UR, ga je terug naar de daarvoor geselecteerde tab";

window.UrcommentsDutchURC_Text[35] = "Dubbelklik verzenden na sluiten";
window.UrcommentsDutchURC_Text_tooltip[35] = "Dit geeft een extra link aan het einde van teksten met de status sluiten. Als je hierop dubbelklikt, wordt je tekst verzonden en worden alle ingestelde opties uitgevoerd (zoals automatisch bewaren)";

window.UrcommentsDutchURC_Text[36] = "Dubbelklik verzenden voor alle reacties";
window.UrcommentsDutchURC_Text_tooltip[36] = "Dit geeft een extra link aan het einde van elke tekst. Als je hierop dubbelklikt, wordt je tekst verzonden en worden alle ingestelde opties uitgevoerd (zoals automatisch bewaren)";

window.UrcommentsDutchURC_Text[37] = "Tekstbestand";
window.UrcommentsDutchURC_Text_tooltip[37] = "Dit toont het geselecteerde tekstbestand.";

window.UrcommentsDutchURC_Text[38] = "Schakel de knop \"Volgend aanpassingsverzoek\" uit";
window.UrcommentsDutchURC_Text_tooltip[38] = "De 'Klaar/Volgende'knop uitschakelen onderaan het UR-venster";

window.UrcommentsDutchURC_Text[39] = "UR niet volgen";
window.UrcommentsDutchURC_Text_tooltip[39] = "De UR niet volgen nadat je een commentaar hebt gegeven (je krijgt geen bericht als er een follow-up is)";

window.UrcommentsDutchURC_Text[40] = "Verzend automatisch herinneringen";
window.UrcommentsDutchURC_Text_tooltip[40] = "Verzend automatisch herinnering naar URs die jij behandelt in het zichtbare gebied";

window.UrcommentsDutchURC_Text[41] = "Vervang duiding door editor";
window.UrcommentsDutchURC_Text_tooltip[41] = "Als een UR een tag heeft uit URO, laat dan niet de tag zien, maar de naam van de editor";

window.UrcommentsDutchURC_Text[42] = "Dblklik";
window.UrcommentsDutchURC_Text_tooltip[41] = "Dubbelklik hier om het commentaar automatisch te verzenden en op te slaan";

window.UrcommentsDutchURC_Text[42] = "Geen duiding";
window.UrcommentsDutchURC_Text_tooltip[41] = "Laat geen duiding zien als UR een tag heeft uit URO";

window.UrcommentsDutchURC_USER_PROMPT[0] = "UR Comments: Je hebt een oude versie van het tekstbestand, of er is een syntax error waardoor het bestand niet laadt. Je mist: ";

window.UrcommentsDutchURC_USER_PROMPT[1] = "UR Comments: je mist de volgende tekstbestanden: ";

window.UrcommentsDutchURC_USER_PROMPT[2] = "Tekstbetand niet gevonden. Voor bestanden en instructies, zie https://wiki.waze.com/wiki/Scripts/URComments";

window.UrcommentsDutchURC_USER_PROMPT[3] = "URComments: het aantal dagen voor het sluiten van een melding mag niet 0 zijn.";

window.UrcommentsDutchURC_USER_PROMPT[4] = "URComments: Om dubbelklik links te kunnen gebruiken moet de filter 'Status instellen' zijn ingeschakeld";

window.UrcommentsDutchURC_USER_PROMPT[5] =  "Filters, tellen, en automatische herinneringen zijn uitgeschakeld";

window.UrcommentsDutchURC_USER_PROMPT[6] = "URComments: Maximale laadtijd verstreken, nieuwe poging"; //this message is shown across the top of the map in a orange box, length must be kept short

window.UrcommentsDutchURC_USER_PROMPT[7] = "URComments: Voegt herinnering toe aan URs: "; //this message is shown across the top of the map in a orange box, length must be kept short

window.UrcommentsDutchURC_USER_PROMPT[8] = "URComments: UR Filters zijn uitgeschakeld, omdat URO filters actief zijn"; //this message is shown across the top of the map in a oragne box, length must be kept short

window.UrcommentsDutchURC_USER_PROMPT[9] = "UrComments: Automatisch bewaren staat aan, maar er staan nog edits open!\r\rURComents kan alleen automatisch verzenden, sluiten en bewaren als er geen andere edits open staan. Bewaar eerst je edits en klik opnieuw de tekst aan.";

window.UrcommentsDutchURC_USER_PROMPT[10] = "URComments: Kan geen UR vinden! Dit script werkt alleen als je een UR hebt geopend"; //this message is shown across the top of the map in a orange box, length must be kept short

window.UrcommentsDutchURC_USER_PROMPT[11] = "URComments: Stuurt een herinnering op de ingestelde dag naar URs met een eerste commentaar van jou (zonder nadere reactie), in het zichtbare gebied. NOTE: Zorg dat je geen URs open laat staan die voorbij de wachttijd zijn, maar een andere reactie nodig hebben"; //confirmation message/ question

//The comment array should follow the following format,
// "Title",     * deze titel zie je staan in de lijst onder de tab "Teksten",
// "comment",   * de tekst die wordt gegenereerd,
// "URStatus"   * hoe de status wordt als de instelling "Auto Click Open, Solved, Not Identified" ingeschakeld is. Als je op "Verzend" klikt, wordt automatisch deze status gekozen,
// Voor een witregel in de lijst van teksten, voeg de volgende 3 regels toe.
// "<br>",
// "",
// "",

//Dutch list
//Het eerste gedeelte zijn de meest gebruikte teksten

window.UrcommentsDutchArray2 = [
    "Onduidelijke UR",
    "Bedankt voor je melding! Helaas kunnen we er niet uit opmaken wat het probleem is. Wat kunnen we verbeteren?",
    "Open",

    "Herhaal melder's beschrijving",
    "Bedankt voor je melding! Je schreef \"$URD\", maar we kunnen er helaas niet uit opmaken wat het probleem is. Wat kunnen we verbeteren?",
    "Open",

    "Melder volgt Waze route",
    "Bedankt voor je melding! Volgens de gegevens die wij kunnen zien volgde je de route die Waze voorstelde. Wat ging er mis?",
    "Open",

    "Herinnering", 
    "Even een herinnering. Graag ontvangen we meer informatie over je melding, zodat we de kaart verder kunnen verbeteren. Als we binnen enkele dagen geen reactie ontvangen, dan gaan we er van uit dat alles goed staat en wordt de melding gesloten.",
    "Open",

    "Sluiten zonder reactie",
    "Helaas hebben we geen verdere reactie ontvangen. We kunnen het probleem daarom op dit moment niet verbeteren en sluiten de melding. Mocht je in een volgende rit nog iets tegenkomen, ontvangen we graag een nieuwe melding.",
    "NotIdentified",

	"Opgelost",
    "Dankzij jouw melding hebben we de kaart kunnen verbeteren. Het kan enkele dagen duren voordat de verandering is doorgevoerd in de navigatiekaart (check eventueel de 'INTL map tiles' updates op status.waze.com).\rBedankt voor je hulp!",
    "Solved",
	
    "Geen nadere reactie; Opgelost",
    "We hebben geen nadere reactie ontvangen, maar gaan er van uit dat de kaart goed is aangepast en sluiten deze melding. Mocht je in een volgende rit nog iets tegenkomen, ontvangen we graag een nieuwe melding.",
    "Solved",

	"SL toegevoegd",
	"We hebben de maximumsnelheid toegevoegd volgens je melding . Het kan enkele dagen duren voordat de verandering is doorgevoerd in de navigatiekaart (check eventueel de 'INTL map tiles' updates op status.waze.com).\rBedankt voor je hulp!", 
	"Solved",

    "Bedank reactie, melding sluiten",
    "Bedankt voor je reactie! Deze melding wordt gesloten. Mocht je opnieuw problemen tegenkomen, dan ontvangen we graag een nieuwe melding.",
    "NotIdentified",

    "Reset UR commentaar en status",
    "",
    "Open",

    "<br>",
    "",
    "",

//overige teksten

    "Afslag niet toegestaan (kruising onbekend)",
    "Bedankt voor je melding! Helaas kunnen we er niet uit opmaken over welke kruising het gaat. Welke afslag is niet toegestaan en waarom niet? Kun je de straatnamen van de kruising vermelden?. Alvast bedankt!",
    "Open",

	"SL onwaarschijnlijk",
	"Dank je voor je melding. De gerapporteerde $URD lijkt onwaarschijnlijk op deze locatie. Kun je deze verifieren? Bij voorbaat dank voor je hulp!",
    "Open",

	"SL al actief, open",
    "Bedankt voor je melding! Deze snelheidslimiet is al actief op de locatie van je melding. Wat ging er mis?",
    "Open",
	
	"SL al actief, sluiten",
	"Bedankt voor je melding! Deze snelheidslimiet is al actief op de locatie van je melding. Om continu de maximumsnelheid te zien, ga naar Settings > Snelheidsmeter > Toon maximumsnelheid. We wensen je veel rijplezier met Waze!",
	"NotIdentified",

	"SL werkzaamheden",
    "Dank je voor je melding. Tijdens werkzaamheden wordt de snelheidslimiet op de kaart niet aangepast. We hebben namelijk geen mechanisme om dit terug ongedaan te maken op het (ongekende) einde van de werken. ",
    "NotIdentified",

	"SL variabel",
	"Bedankt voor je melding. Op deze plaats is een variabele snelheid van toepassing. Helaas kunnen we (nog) geen variabele snelheden verwerken en wordt alleen de maximum snelheid getoond. Deze melding wordt dan ook gesloten. Mocht je in een volgende rit nog iets tegenkomen, ontvangen we graag een nieuwe melding.",
	"NotIdentified",

    "Valide Route / gereden snelheid",
    "Bedankt voor je reactie. We hebben de route bekeken en kunnen geen afwijkingen in de kaart vinden. Waze berekent de snelste route op basis van de gemiddelde gereden snelheden en houdt daarbij rekening met tijdsspecifieke drukte, zoals spitsuur. Probeer de voorgestelde route eens een paar keer, wellicht dat die op dat tijdstip toch sneller is. Mocht dat niet zo zijn, dan leert Waze dat die route langzamer is en zal de snellere route de voorkeur krijgen.",
    "NotIdentified",
         
    "Omleidingen / Vreemde routes",
    "Bedankt voor je melding! Waze geeft (soms complexe) omleidingen als die beduidend sneller zijn om je bestemming te bereiken. Daarbij wordt rekening gehouden met gemiddelde gereden snelheden van de wegen op bepaalde tijden. Probeer de gesuggereerde route eens, wellicht dat die op dat tijdstip toch sneller is. Indien dat niet zo blijkt te zijn, leert Waze door de door jou gereden snelheid en krijgt de snellere route de voorkeur. ",
    "NotIdentified",

    "Mogelijk GPS probleem",
    "Bedankt voor je melding! We kunnen in de omgeving van je melding geen afwijkingen in de kaart vinden. Het lijkt alsof je een GPS probleem had. Het GPS signaal wordt belemmerd door voertuigen en grote gebouwen. Bij sommige toestellen verzwakt het GPS-signaal als ze ouder worden. Zorg er voor dat je toestel zo min mogelijk wordt afgeschermd en test eventueel je GPS-signaal (met een app).",
    "NotIdentified",

    "Wegafsluiting of file",
    "Als een weg is geblokkeerd door file, gebruik dan Melding (de oranje button) > File, zodat Waze leert dat er langzaam verkeer en zo mogelijk een snellere route zal zoeken. Een volledige wegafsluiting kun je aangeven via: Melding > Afsluiting. Waze houdt daar onmiddelijk rekening mee en zal jou en andere Wazers omleiden. Als het om een langerdurende afsluiting gaat, dan ontvangen we graag zoveel mogelijk details (zover je die weet), zoals duur vd afsluiting en wat er precies is afgesloten. Alvast bedankt!",
    "Open",

    "Huisnummer aanpassing",
    "Bedankt voor je melding! We hebben het huisnummer opnieuw laten registreren in Waze, waardoor het probleem verholpen zou moeten zijn. Het kan enkele dagen duren voordat de verandering is doorgevoerd in de navigatiekaart (check eventueel de updates: http://bit.ly/1zLMaoN). Het is dan wel nodig om je favorieten en eerdere zoekresultaten bij te werken. Dat kun je simpelweg doen door ze te verwijderen en opnieuw toe te voegen. Mocht je na de update nog steeds problemen ondervinden, zien we graag een nieuwe melding.",
    "Solved",

    "Foutieve locatie", 
    "Bedankt voor je reactie! Waze gebruikt gegevens uit verschillende zoekmachines; vermoedelijk leidden de coördinaten van de locatie niet naar de goede plek op de kaart. Om zelf de juiste locatie toe te voegen, ga naar Melding > Plaats. Als je een foto toevoegt, zorg dan dat er geen persoonlijke gegevens op staan. Je mag ook het juiste adres doorgeven (ev. met naam van de locatie), dan voeren wij die op de kaart in. Alvast bedankt!",
    "Open",

    "Text-To-Speech",
    "Mogelijk was er een probleem met de Text-to-Speech-cache. Type cc@tts in de zoekbalk van het navigatiemenu en klik op 'zoeken'. Je krijgt dan de melding dat de TTS cach is leeg gemaakt. Het kan handig zijn de volgende route in te laden als je wifi hebt, om een eventuele nieuwe download van straatnamen niet van je databundel af te laten gaan. Thanks!",
    "NotIdentified",

    "App bug",
    "Het lijkt een bug in the app zelf te zijn. Helaas kunnen wij daar als editors niets aan doen. Je kunt het eventueel melden via https://support.google.com/waze/answer/6276841.",
    "NotIdentified",

    "Update favorieten en geschiedenis",
    "Om correcties in een locatie te gebruiken, is het nodig je favorieten en zoekgeschiedenis bij te werken. Dat kun je simpelweg doen door ze te verwijderen en nieuwe (Waze) zoekresultaten toe te voegen. (zie het icoontje onderaan de lijst van zoekresultaten). Mocht je na de update nog steeds problemen ondervinden, dan zien we graag een nieuwe melding.",
    "NotIdentified",

    "Nieuwe weg asfalteren",
    "Bedankt voor je melding! Je kunt een nieuwe weg toevoegen door naar het menu van de meldingen te gaan en op het tabblad 'Asfalteren' te klikken. Rij over de nieuwe weg heen, klik daarna op de stoomwals en ´Asfalteren stoppen´.  Informatie over de weg kun je in een nieuwe melding kwijt (Ontbrekende weg). Alvast bedankt!",
    "Open",
    
    "Flitspaal toevoegen",
    "Bedankt voor je reactie. Je kunt een flitspaal toevoegen vanuit de app. Klik op Melding (de oranje button) > Flitspaal en kies vervolgens Snelheid, Roodlicht of Nep. Een editor zal deze flitspaal vervolgens goedkeuren. Alvast bedankt!",
    "NotIdentified",

    "Bestemming opvragen",
    "Bedankt voor je melding. Waze laat geen gegevens zien over je start- of eindpunt. Kun je aangeven wat je als bestemming hebt ingevoerd, zodat we de route kunnen controleren? Alvast bedankt!",
    "Open",

    "Kaart vernieuwen",
    "Bedankt voor je melding. Het lijkt alsof er kaartinformatie in je toestel ontbrak. Je kunt handmatig de kaart vernieuwen. Ga naar Instellingen > Scherm & Kaart > Data overdracht > Vernieuw de kaart in mijn omgeving.",
    "Open",

    "<br>",
    "",
    "",	
	
//Hierna volgen de standaard UR types 6 t/m 22 (alleen die in gebruik zijn). Deze kan de Wazer kiezen in de app of Live Map. Gelieve hierin geen veranderingen aan te brengen, thanks.

    "Foute afslag", //6
    "Bedankt voor je reactie! Wat was het probleem met deze afslag?",
    "Open",
    
    "Foutief adres", //7
    "Bedankt voor je reactie! Waze laat geen gegevens zien over je start- of eindpunt. Om welk adres gaat het en wat is het probleem met dit adres? Alvast bedankt!",
    "Open",

    "Rotonde niet aanwezig", //9
    "Bedankt voor je melding! Het is voor ons onduidelijk waar de rotonde ontbreekt. Welke wegen zijn verbonden met de rotonde? Alvast bedankt voor de info!",
    "Open",
    
    "Algemene fout", //10
    "Bedankt voor je melding! Helaas kunnen we er niet uit opmaken wat het probleem is. Wat kunnen we verbeteren?",
    "Open",

    "Afslag niet toegestaan", //11
    "Bedankt voor je melding! Kun je omschrijven waarom de afslag niet is toegestaan? Is dit een tijdelijke situatie (bijv. door wegwerkzaamheden) of is het definitief (bijv. doordat de aansluitende weg eenrichtingsverkeer is)? Alvast bedankt voor je feedback!",
    "Open",

    "Foute kruising", //12
    "Bedankt voor je melding! Helaas kunnen we er niet uit opmaken wat er mis is met de kruising. Kun je omschrijven wat er verbeterd kan worden? Indien mogelijk graag ook de straatnamen van de kruising. Alvast bedankt!",
    "Open",

    "Ontbrekende brug", //13
    "Bedankt voor je melding! Welke brug ontbreekt er? Ter info: wanneer je met hoge snelheid rijdt laat Waze bewust niet alle kaartdetails zien, zodat het beeld helder en duidelijk blijft.",
    "Open",

    "Verkeerde instructie", //14
    "Bedankt voor je melding! Helaas kunnen we er niet uit opmaken wat er verkeerd ging in de route. Wat kunnen we verbeteren?",
    "Open",

    "Ontbrekende afrit", //15
    "Bedankt voor je melding! Welke afrit ontbreekt er? Hoe meer informatie je kunt geven, zoals naam en een omschrijving van hoe de afrit ongeveer loopt, hoe beter de kaart wordt! Alvast bedankt!",
    "Open",

    "Ontbrekende weg", //16
    "Bedankt voor je melding! Welke weg ontbreekt er? Hoe meer informatie je kunt geven, zoals naam, rijrichting of andere zaken die van toepassing zijn, hoe beter de kaart wordt! Alvast bedankt!",
    "Open",

    "Ontbrekend herkenningspunt/Plaats", //18
    "Bedankt voor je melding! Je kunt zelf de juiste locatie toevoegen: ga naar Melding > Plaats. Als je een foto maakt, zorg dan dat er geen persoonlijke gegevens op staan. Je kunt ook het juiste adres doorgeven en graag zoveel mogelijk info over de locatie, dan voeren wij die op de kaart in. Alvast bedankt!",
    "Open",
	
	"Speed Limit", //23
    "Je hebt een melding mbt de maximum snelheid gemaakt. Zou je kunnen vermelden van waar tot waar deze limiet geldt? Is dit een tijdelijke wijziging (zoals bij wegwerkzaamheden), of een definitieve verandering? Alvast bedankt voor je hulp!",
    "Open"

//einde standaard URs

];
//end Dutch list                  
