
// ==UserScript==
// @name		    PanelTB
// @version			3.1
// @description		TB


// @include        http://trophymanager.com/*
// @include        http://test.trophymanager.com/*
// @exclude        http://trophymanager.com/banners*
// @exclude        http://trophymanager.com/showprofile.php*
// @include		   http://trophymanager.com/players
// @grant          none

// @exclude        http://trophymanager.com/userguide.php*
// @exclude        http://trophymanager.com/livematch.php*manual_show.php
// @exclude        http://trophymanager.com/manual_show.php*
// @exclude        http://trophymanager.com/live*
// @exclude        http://trophymanager.com/transform.php
// @exclude        http://trophymanager.com/translate
// @exclude        http://trophymanager.com/translate?*
// @exclude        http://trophymanager.com/matches/*
// @exclude        http://trophymanager.com/_test_t?h2h
// @exclude        http://trophymanager.com/_test_t?t2=*
// @exclude        http://trophymanager.com/_test_t
// @namespace https://greasyfork.org/users/7445
// @downloadURL https://update.greasyfork.org/scripts/6874/PanelTB.user.js
// @updateURL https://update.greasyfork.org/scripts/6874/PanelTB.meta.js
// ==/UserScript==





///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Customize Section: Customize TrophyBuddy to suit your personal preferences																		///
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//																														///
var myclubid = " ";		// if myclubid = "", some functions won't work. Add your team-id like this: var myclubid = "22882" to unlock those additional features			///
var myleagueB = "http://trophymanager.com/league/pl/5/50/#pa";		// 	Add the address page of the league reserves team		///
var menubar = "yes";		// switch yes/no to turn the menubar on/off																///
var sidebar = "yes";		// switch yes/no to turn the sidebar on/off																///
var hovermenu = "yes";	// switch to "yes" to bring back the old hover menu style from TM1.1	(adapted from TM Auxiliary and slightly modified)					///			
//																														///
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var language = "pl";     // choose your language, check supported languages below:

var rou_factor = 0.00405;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//												SUPPORTED LANGUAGES														///
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//																														///
//The following languages are supported right now: 																						///
//																														///
//	ar = Arabic																												///
//	da = Danish																												///																																					///
//	de = German																											///
//	en = English																												///
//	fr = French																												///
//	he = Hebrew																											///
//	hu = Hungarian																											///
//	pl = Polish																												///
//	ro = Romanian																											///
//	sl = Slovakian																											///
//																														///
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

YourRecentPosts = "Moje ostatnie posty";
GoYourRecentPosts = "Moje ostatnie posty";

switch (language) {

//ARABIC
 case "ar":
		var Home = "الصفحة الرئيسية";
		var CheckYourMails = "الرسائل";
		var League = "الدوري";
		var Cup = "الكأس";
		var Exit = "تسجيل خروج";
			
		var GoCurrentBids = "شاهد العروض الحالية";
		var GoTactics = "االخطة";
		var GoYouthAcademy = "اذهب إلى أكاديمية الشباب";
		var GoHireCoaches = "تعاقد مع مدربين جدد";
		var GoHireScouts = "تعاقد مع كشافين جدد";
		var GoMyCoaches = "اذهب الى قائمة مدربي الفريق الحاليين";
		var GoMyScouts = "اذهب الى قائمة كشافي الفريق الحاليين";
		var GoScoutReports = "تحقق من اخر تقارير الكشافه";
		var GoPlayerNotes = "تصفح ملاحظات اللاعبين";
		var GoTrainingOverview = "تصفح نتائج التدريب";
		var GoTrainingTeams = "التحكم بالانظمة التدريبية";
		var GoForum = "تصفح المنتديات";
		var GoTMUserGuide = "اقرأ دليل المستخدم";
		var GoTBConference = "منتدى تروفي بودي";
		
		var GoTransferForum = "اذهب الى منتدى الانتقالات";
		var GoGeneralForum = "اذهب الى المنتدى العالمي";
		var GoAnnouncementForum = "اذهب الى منتدى الاخبار";
		//var GoFederations = "الاتحادات";
		
	var Team = "الفريق";	
		var CurrentBids = "العروض الحالية";
		var Squad = "اللاعبين";
		var Tactics = "الخطة";
		var YouthAcademy = "الأكاديمية";
	var Staff = "الموظفون";
		var HireCoaches = "تعاقد مع مدرب";
		var HireScouts = "كشاف";
		var ScoutReports = "تقارير الكشافه";
		var MyCoaches = "المدربين";
		var MyScouts = "الكشافه";
	var Training = "التدريب";	
		var PlayerNotes = "الملاحظات";
		var TrainingOverview = "التقارير التدريبية";
		var TrainingTeams = "الأنظمة التدريبية";
	var Community = "المجتمع";
		var Forum = "المنتدى";
		var TMUserGuide = "دليل المستخدم";
		var TBConference = "منتدى تروفي بودي";
	break;

	
//DANISH
case "da":
		var Home = "Hjemme";
		var CheckYourMails = "Læs Dine Beskeder";
		var League = "Liga";
		var Cup = "Pokal";
		var Exit = "Forlad TrophyManager";

		var GoCurrentBids = "Se Bud";
		var GoTactics = "Gå til Taktik";
		var GoYouthAcademy = "Gå til Ungdomsakademi";
		var GoHireCoaches = "Hyr nye Trænere";
		var GoHireScouts = "Hyr nye Scouts";
		var GoMyCoaches = "Se dine trænere";
		var GoMyScouts = "Se dine scouts";
		var GoScoutReports = "Se scoutrapporter";
		var GoPlayerNotes = "Se spiller noter";
		var GoTrainingOverview = "Se træningsresultat";
		var GoTrainingTeams = "Ændre træningshold";
		var GoForum = "Gå til forummet";
		var GoTMUserGuide = "Læs brugermanualen";
		var GoTBConference = "Gå til TrophyBuddy-Konferencen";

		var GoTransferForum = "Gå til Transfer forummet";
		var GoGeneralForum = "Gå til Generalt forummet";
		var GoAnnouncementForum = "Gå til Announcement";
		//var GoFederations = "Gå til Konferencer";

	var Team = "Hold";
		var CurrentBids = "Nuværende Bud";
		var Squad = "Trup";
		var Tactics = "Taktik";
		var YouthAcademy = "Ungdomsakadami";
	var Staff = "Staff";
		var HireCoaches = "Hyr Trænere";
		var HireScouts = "Hyr Trænere";
		var ScoutReports = "Scout Rapporter";
		var MyCoaches = "Mine Trænere";
		var MyScouts = "Mine Scouts";
	var Training = "Træning";
		var PlayerNotes = "Spiller Noter";
		var TrainingOverview = "Trænings Overblik";
		var TrainingTeams = "Trænings Hold";
	var Community = "Community-Links";
		var Forum = "Forum";
		var TMUserGuide = "TM-Brugermanual";
		var TBConference = "TrophyBuddy-Konference";
	break;
	
	
//GERMAN	
case "de":
	var Home = "Startseite";
	var CheckYourMails = "Zum Postfach wechseln";
	var League = "Liga";
	var Cup = "Pokal";
	var Exit = "Ausloggen";
				
		var GoCurrentBids = "Laufende Transfergebote anschauen";
		var GoTactics = "Zum Taktikbereich";
		var GoSquad = "Przegląd Składu";
 		var GoYouthAcademy = "Die Jugendakademie besuchen";	
		var GoYouthAcademyy = "Go to Youth Academy";
		var GoHireCoaches = "Neue Trainer einstellen";
		var GoHireScouts = "Neue Scouts einstellen";
		var GoMyCoaches = "Sieh dir deine Trainer an";
		var GoMyScouts = "Sieh dir deine Scouts an";		
		var	GoScoutReports = "Schau dir deine Scout-Reporte an";
		var GoPlayerNotes = "Spielernotizen aufrufen";		
		var GoTrainingOverview = "Überprüfe die Trainingsergebnisse";
		var GoTrainingTeams = "Passe deine Trainingsgruppen an";
		var GoForum = "Durchstöbere die Foren";
		var GoTMUserGuide = "Lies das Handbuch";
		var GoTBConference = "Feedback geben";
		
		var GoTransferForum = "Das Transferforum besuchen";
		var GoGeneralForum = "Das Generalforum besuchen";
		var GoAnnouncementForum = "Halte Ausschau nach neuen Ankündigungen der Entwickler";
		//var GoFederations = "Föderationen besuchen";
	
	var Team = "Team";
		var CurrentBids = "Aktuelle Gebote";			
		var Squad = "Mannschaftsübersicht";
		var Tactics = "Taktiken";
		var YouthAcademy = "Jugendakademie";
		var YouthAcademyy = "Youth Academy";
	var Staff = "Mitarbeiter";
		var HireCoaches = "Trainer";
		var HireScouts = "Scouts kaufen";
		var ScoutReports = "Scout Reporte";
		var MyCoaches = "MyTrainer";
		var MyScouts = "MyScouts";
	var Training = "Training";	
		var PlayerNotes = "Spielernotizen";
		var TrainingOverview = "Trainingsübersicht";
		var TrainingTeams = "Trainingsgruppen";
	var Community = "Community-Links";	
		var Forum = "Forum";
		var TMUserGuide = "TM-Handbuch";
		var TBConference = "TrophyBuddy-Feedback";
	break;	
	
	
// ENGLISH
case "en":
		var Home = "Home";
		var CheckYourMails = "Check your mails";
		var League = "League";
		var Cup = "Cup";
		var Exit = "Exit TrophyManager";
			
		var GoCurrentBids = "See Current Bids";
		var GoTactics = "Go to Tactics";
 		var GoYouthAcademy = "Asystent-Taktyka";	
		var GoYouthAcademyy = "Go to Youth Academy";	
		var GoHireCoaches = "Hire new coaches";
		var GoHireScouts = "Hire new scouts";
		var GoMyCoaches = "Take a look at your coaches";
		var GoMyScouts = "Take a look at your scouts";
		var	GoScoutReports = "Check what you have scouted";
		var GoPlayerNotes = "See your player notes";		
		var GoTrainingOverview = "Check the training results";
		var GoTrainingTeams = "Change your training teams";
		var GoForum = "Browse forums";
		var GoTMUserGuide = "Read the User-Guide";
		var GoTBConference = "Enter the TrophyBuddy-Conference";
		
		var GoTransferForum = "Go to Transfer forum";
		var GoGeneralForum = "Go to General forum";
		var GoAnnouncementForum = "Go to Announcement forum";
		//var GoFederations = "Go to Federations";
		
	var Team = "Team";	
		var CurrentBids = "Current Bids";
		var Squad = "Squad";
		var Tactics = "Tactics";
		var YouthAcademy = "Asystent-Taktyka";
		var YouthAcademyy = "Youth Academy";
	var Staff = "Staff";
		var HireCoaches = "Hire Coaches";
		var HireScouts = "Scouts";
		var ScoutReports = "Scout Reports";
		var MyCoaches = "MyCoaches";				
		var MyScouts = "MyScouts";
	var Training = "Training";	
		var PlayerNotes = "Player Notes";
		var TrainingOverview = "Training Overview"; 
		var TrainingTeams = "Training Teams";
	var Community = "Community-Links";	
		var Forum = "Forum";
		var TMUserGuide = "TM-UserGuide";
		var TBConference = "TrophyBuddy-Conference";
	break;


//FRENCH
 case "fr":
		var Home = "Accueil";
		var CheckYourMails = "Messages";
		var League = "Tournoi";
		var Cup = "Coupe";
		var Exit = "Déconnexion";
			
		var GoCurrentBids = "Enchères en cours";
		var GoTactics = "Tactiques";
		var GoYouthAcademy = "Centre de formation";
		var GoHireCoaches = "Recruter un coach";
		var GoHireScouts = "Recruter un scout";
		var GoMyCoaches = "Coachs";
		var GoMyScouts = "Scouts";
		var GoScoutReports = "Rapports de scout";
		var GoPlayerNotes = "Notes";
		var GoTrainingOverview = "Compte rendu entraînement";
		var GoTrainingTeams = "Entraînement";
		var GoForum = "Forum";
		var GoTMUserGuide = "Manuel de jeu";
		var GoTBConference = "TrophyBuddy Conference";
		
		var GoTransferForum = "Forum des transferts";
		var GoGeneralForum = "Forum général";
		var GoAnnouncementForum = "Annonces officielles";
		//var GoFederations = "Fédérations";
		
	var Team = "Team";
		var CurrentBids = "Enchères actuelles";
		var Squad = "Équipe";
		var Tactics = "Tactiques";
		var YouthAcademy = "Centre de formation";
	var Staff = "Staff";
		var HireCoaches = "Recruter un coach";
		var HireScouts = "Recruter un scout";
		var ScoutReports = "Rapport de scout";
		var MyCoaches = "Mes coachs";
		var MyScouts = "Mes scouts";
	var Training = "Entraînement";
		var PlayerNotes = "Notes joueurs";
		var TrainingOverview = "Compte rendu d'entraînement";
		var TrainingTeams = "Equipe d'entraînement";
	var Community = "Communautés";
		var Forum = "Forum";
		var TMUserGuide = "TM-Manuel de jeu";
		var TBConference = "TrophyBuddy-Conference";
	break;	
	
	
//HEBREW
 case "he":
		var Home = "בית";
		var CheckYourMails = "בדוק את הדואר שלך";
		var League = "שפה";
		var Cup = "גביע";
		var Exit = "צא מטרופי מנג'ר";

		var GoCurrentBids = "ראה הצעות עדכניות";
		var GoTactics = "עבור לטקטיקה";
		var GoYouthAcademy = "עבור לאקדמית הנוער";
		var GoHireCoaches = "שכור מאמנים חדשים";
		var GoHireScouts = "שכור סקאוטים חדשים";
		var GoMyCoaches = "העף מבט במאמנים שלך";
		var GoMyScouts = "העף מבט בסקאוטים שלך";
		var GoScoutReports = "בדוק את תוצאות החקירה של הסקאוט";
		var GoPlayerNotes = "ראה את הערות על שחקניך";
		var GoTrainingOverview = "בדוק את תוצאות אימונייך";
		var GoTrainingTeams = "שנה את קבוצות האימון שלך";
		var GoForum = "עבור לפורום";
		var GoTMUserGuide = "קרא את המדריך-למשתמש";
		var GoTBConference = "הכנס לפורום תוכנות-עזר לטרופי";

		var GoTransferForum = "הכנס לפורום העברות";
		var GoGeneralForum = "הכנס לפורום הכללי";
		var GoAnnouncementForum = "הכנס לפורום ההודעות";
		//var GoFederations = "עבור לפדרציות";

	var Team = "קבוצה";
		var CurrentBids = "הצעות עדכניות";
		var Squad = "סגל";
		var Tactics = "טקטיקה";
		var YouthAcademy = "אקדמית נוער";
	var Staff = "צוות";
		var HireCoaches = "שכור מאמנים";
		var HireScouts = "שכור סקאוטים";
		var ScoutReports = "דוחות סקאוטים";
		var MyCoaches = "המאמנים שלי";
		var MyScouts = "הסקאוטים שלי";
	var Training = "אימונים";
		var PlayerNotes = "הערות שחקן";
		var TrainingOverview = "סקירת אימון";
		var TrainingTeams = "קבוצות אימון";
	var Community = "קשרי-קהילה";
		var Forum = "פורום";
		var TMUserGuide = "מדריך-משתמש";
		var TBConference = "פורום תוכנות-עזר";
	break;		
	

//HUNGARIAN
 case "hu":
		var Home = "Otthon";
		var CheckYourMails = "Levelek";
		var League = "Bajnokság";
		var Cup = "Kupa";
		var Exit = "Kilépés";

		var GoCurrentBids = "Aktív licitek";
		var GoTactics = "Taktika módosítása";
		var GoYouthAcademy = "Ifiakadémia meglátogatása";
		var GoHireCoaches = "Új edzö felvétele";
		var GoHireScouts = "Új megfigyelö felvétele";
		var GoMyCoaches = "Edzök igazgatása";
		var GoMyScouts = "Megfigyelök igazgatása";
		var GoScoutReports = "Jelentések böngészése";
		var GoPlayerNotes = "Játékos jegyzetek";
		var GoTrainingOverview = "Edzés áttekintés";
		var GoTrainingTeams = "Edzésprogram módosítása";
		var GoForum = "Fórum böngészés";
		var GoTMUserGuide = "TM-Kézikönyv";
		var GoTBConference = "TrophyBuddy-Szövetség";

		var GoTransferForum = "Átigazolási fórum - angol";
		var GoGeneralForum = "Globális fórum - angol";
		var GoAnnouncementForum = "Bejelentés fórum - angol";
		//var GoFederations = "Szövetségek";

	var Team = "Csapat";
		var CurrentBids = "Licitek";
		var Squad = "Keret";
		var Tactics = "Taktika";
		var YouthAcademy = "Ifiakadémia";
	var Staff = "Stáb";
		var HireCoaches = "Edzö felvétele";
		var HireScouts = "Scoutok";
		var ScoutReports = "Scout jelentések";
		var MyCoaches = "Edzöim";
		var MyScouts = "Scoutjaim";
	var Training = "Edzés";
		var PlayerNotes = "Jegyzetek";
		var TrainingOverview = "Edzés jelentés";
		var TrainingTeams = "Edzésprogramok";
	var Community = "Közösség";
		var Forum = "Fórum";
		var TMUserGuide = "TM-Ismertetö";
		var TBConference = "TrophyBuddy-Szövetség";
	break;	

	
//POLISH	
	case "pl":
		var Home = "Klub";
		var CheckYourMailss = "Ogłoszenia";
		var CheckYourMails = "Wiadomości";
		var League = "Liga";
		var LeagueB = "Liga Team B";
		var Exit = "Wyloguj";
			
		var GoCurrentBids = "Oferty transferowe";
		var GoSquad = "Przegląd Składu";
		var GoTactics = "Taktyka";
		var GoToYouthAcademy = "Asystent-Taktyka";
		var GoToYouthAcademyy = "Ekonomia";	
		var GoPlayerNotes = "Akademia Młodzieży";
		var GoHireCoaches = "Zatrudnij Trenerów";
		var GoHireScouts = "Zatrudnij Skautów";
		var GoScoutReports = "Raporty Skautów";
		var GoTrainingOverview = "Wyniki treningu";
		var GoTrainingTeams = "Ustawienie treningu";
		var GoForum = "Forum";
		var GoTMUserGuide = "Podręcznik TM";
		var GoTBConference = "Strona o TrophyBuddy";
		
		var GoTransferForum = "Pomoc forum";
		var GoGeneralForum = "General forum";
		var GoAnnouncementForum = "Bugs forum";
		//var GoFederations = "Go to Federations";
		
		var Team = "Klub";
			var CurrentBids = "Oferty transferowe";
			var Squad = "Przegląd Składu";
			var Tactics = "Taktyka";
			var YouthAcademy = "Asystent-Taktyka";
			var YouthAcademyy = "Ekonomia";
			var PlayerNotes = "Akademia Młodzieży";
			var PlayerNotess = "Fanklub";
			var PlayerNotessH = "H2H";
		var Staff = "Personel";
			var HireCoaches = "Zatrudnij Trenerów";
			var HireScouts = "Zatrudnij Skautów";
			var ScoutReports = "Raporty Skautów";
			var MyCoaches = "Trenerzy";
			var MyScouts = "Skauci";
		var Training = "Trening";
			var TrainingOverview = "Wyniki treningu";
			var TrainingTeams = "Ustawienie treningu";
		var Community = "Linki";
			var Forum = "Forum";
			var TMUserGuide = "Podręcznik TM";
			var TBConference = "TrophyBuddy";
			
	break;

	
//ROMANIAN	
	case "ro":
			var Home = "Acasă";
			var CheckYourMails = "Verifică mesajele";
			var League = "Ligă";
			var Cup = "Cupă";
			var Exit = "Ieşire";

			var GoCurrentBids = "Licitaţii";
			var GoTactics = "Tactici";
			var GoYouthAcademy = "Academia de tineret";
			var GoHireCoaches = "Angajează antrenori";
			var GoHireScouts = "Angajează scouteri";
			var GoMyCoaches = "Antrenori";
			var GoMyScouts = "Scouteri";
			var GoScoutReports = "Rapoarte";
			var GoPlayerNotes = "Notiţe";
			var GoTrainingOverview = "Vizualizare antrenament";
			var GoTrainingTeams = "Grupe de antrenament";
			var GoForum = "Citeşte forumul";
			var GoTMUserGuide = "Citeşte manualul";
			var GoTBConference = "Intră la Conferinţă TrophyBuddy";

			var GoTransferForum = "Forum transferuri";
			var GoGeneralForum = "Forum global";
			var GoAnnouncementForum = "Forum anunţuri";
			//var GoFederations = "Forum federaţii";

		var Team = "Echipa";
			var CurrentBids = "Licitaţii";
			var Squad = "Jucători";
			var Tactics = "Tactici";
			var YouthAcademy = "Academia de tineret";
		var Staff = "Staff";
			var HireCoaches = "Angajare antrenori";
			var HireScouts = "Scouteri";
			var ScoutReports = "Rapoarte";
			var MyCoaches = "Antrenorii";
			var MyScouts = "Scouterii mei";
		var Training = "Antrenament";
			var PlayerNotes = "Notiţe";
			var TrainingOverview = "Vizualizare antr.";
			var TrainingTeams = "Grupe de antr.";
		var Community = "Comunitate";
			var Forum = "Forum";
			var TMUserGuide = "Manual-TM";
			var TBConference = "Conferinţa TrophyBuddy";
	break;	
	
	
//SLOVAC	
	case "sl":
		var Home = "Doma";
		var CheckYourMails = "Pozri maily";
		var League = "Liga";
		var Cup = "Pohár";
		var Exit = "Odhlás sa z TrophyManager";

		var GoCurrentBids = "Ponuky";
		var GoTactics = "Taktia";
		var GoYouthAcademy = "Juniory";
		var GoHireCoaches = "Najať trénerov";
		var GoHireScouts = "Najať skautov";
		var GoMyCoaches = "Tréneri";
		var GoMyScouts = "Skauti";
		var GoScoutReports = "Správy skautov";
		var GoPlayerNotes = "Poznámky o hráčoch";
		var GoTrainingOverview = "Prehľad tréningu";
		var GoTrainingTeams = "Nastavenie tréningu";
		var GoForum = "Fórum";
		var GoTMUserGuide = "User-Guide fórum";
		var GoTBConference = "TrophyBuddy-Conference fórum";

		var GoTransferForum = "Transfer fórum";
		var GoGeneralForum = "General fórum";
		var GoAnnouncementForum = "Announcement fórum";
		//var GoFederations = "Federations fórum";

	var Team = "Klub";
		var CurrentBids = "Ponuky";
		var Squad = "Hráči";
		var Tactics = "Taktika";
		var YouthAcademy = "Juniory";
	var Staff = "Personál";
		var HireCoaches = "Najať trénerov";
		var HireScouts = "Skauti";
		var ScoutReports = "Správy skautov";
		var MyCoaches = "Moji tréneri";
		var MyScouts = "Moji skauti";
	var Training = "Tréning";
		var PlayerNotes = "Poznámky hráčov";
		var TrainingOverview = "Prehľad tréningu";
		var TrainingTeams = "Tréning";
	var Community = "Comunita";
		var Forum = "Fórum";
		var TMUserGuide = "TM-UserGuide";
		var TBConference = "TrophyBuddy-Conference"; 
	break;
	
}

var myurl=document.URL;




if (myurl.match(/.*/))
{
/*	
function hide (member) {
        if (document.getElementById) {
            if (document.getElementById(member).style.display = "inline") {
                document.getElementById(member).style.display = "none";
            } else {
                document.getElementById(member).style.display = "inline";
            }
        }
}
*/
/*var divswitch = document.createElement('div');
appdivswitch = document.body.appendChild(divswitch);
appdivswitch.innerHTML = '<div><a href="javascript:ToggleMenu();">Menu</a></div>';
*/

if (hovermenu == "yes") {

var load,execute,loadAndExecute;load=function(a,b,c){var d;d=document.createElement("script"),d.setAttribute("src",a),b!=null&&d.addEventListener("load",b),c!=null&&d.addEventListener("error",c),document.body.appendChild(d);return d},execute=function(a){var b,c;typeof a=="function"?b="("+a+")();":b=a,c=document.createElement("script"),c.textContent=b,document.body.appendChild(c);return c},loadAndExecute=function(a,b){return load(a,function(){return execute(b)})};

loadAndExecute("//ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js", function() {

    $.noConflict();
    jQuery(document).ready(function($) {
    $('#top_menu ul li a').bind('mouseover', function() { 
		top_menu["change"]($(this).attr('top_menu'), false);
	});
  });
});

}
else  {

}


//Menu bottom right
if (menubar == "yes") {
var div1 = document.createElement('div');
appdiv1 = document.body.appendChild(div1);
appdiv1.innerHTML = '<div id="menu" style="position: fixed; z-index: 1000; bottom: 0px; right: 85px; height: 30px; width: 150px; -moz-opacity: .8; text-align: left; border: 2px #6C9922 outset; background: url(http://www.patrick-meurer.de/tm/TrophyBuddy_menu2.png);">&nbsp;<span style="position:relative; top:5px;left:0px"><a href="http://trophymanager.com/club/"><img src="http://patrick-meurer.de/tm/trophybuddy/home.png" title="' + Home + '" style="height: 20px;"></a></span>&nbsp;&nbsp;<span style="position:relative; top:5px;left:0px"><a href="http://trophymanager.com/home/box"><img src="http://patrick-meurer.de/tm/trophybuddy/mail.png" title="' + CheckYourMails + '" style="height: 20px;"></a></span>&nbsp;&nbsp;&nbsp;<span style="position:relative; top:5px;left:0px"><a href="http://trophymanager.com/league/"><img src="http://patrick-meurer.de/tm/trophybuddy/league.png" title="' + League + '" style="height: 20px;"></a></span>&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative; top:5px;left:0px"><a href="' + myleagueB + '"><img src="http://iv.pl/images/52769207023949266399.png" title="' + LeagueB + '" style="height: 20px;"></a></span>&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative; top:5px;left:0px"><a href="http://trophymanager.com/?logout"><img src="http://patrick-meurer.de/tm/trophybuddy/logout.png" title="' + Exit + '" style="height: 20px;"></a></span></div>';
}
else {
}
/*
var TMDB = document.createElement("span"); // erzeugt ein html-span-tag
TMDB.innerHTML=Tform;
document.getElementById("lastspan").appendChild(TMDB);
*/
if (sidebar == "yes") {
	if (myclubid == "") {
	Navigationsbereich
	var div = document.createElement('div');
	//appdiv = document.body.appendChild(div);
	appdiv.innerHTML = '<div id="tbuddy" style="position: fixed; z-index: 1000; top: 150px; left: 25px; height: 500px; width: 130px; -moz-opacity: .8; text-align: left; border: 2px #333333 outset; display:inline;"><img src="http://patrick-meurer.de/tm/TrophyBuddy21.png"><li><a href="http://http://trophymanager.com/club//" target="_self" style="list-style-type:disc; margin-top: 0px; padding-left: 0px;" title="' + Team + '">' + Team + ' </a></li><li><a href="http://trophymanager.com/bids/" target="_self" style="font-size: 10px; color: gold;" title="' + GoCurrentBids + '">' + CurrentBids + '</a></li><li><a href="http://trophymanager.com/tactics/" target="_self" style="font-size: 10px; color: gold;" title="Go to Tactics">' + Tactics + '</a></li><li><a href="http://trophymanager.com/assistant-manager/" target="_self" style="font-size: 10px; color: gold;" title="' + GoYouthAcademy + '">' + YouthAcademy + '</a></li><li><a href="http://trophymanager.com/finances/" target="_self" style="font-size: 10px; color: gold;" title="' + GoYouthAcademyy + '">' + YouthAcademyy + '</a></li><li><a href="http://trophymanager.com/youth-development/" target="_self" style="font-size: 10px; color: gold;" title="' + GoPlayerNotes + '">' + PlayerNotes + '</a></li></ul><p style="text-decoration: underline;">' + Staff + '</p><ul style="list-style-type:disc; margin-top: 0px; padding-left: 20px;"><li><a href="http://trophymanager.com/coaches/hire/" target="_self" style="font-size: 10px; color: gold;" title="' + GoHireCoaches + '">' + HireCoaches + '</a> | <a href="http://trophymanager.com/scouts/hire/" target="_self" style="font-size: 10px; color: gold;" title="' + GoHireScouts + '">' + HireScouts + '</a></li><li><a href="http://trophymanager.com/scouts/" target="_self" style="font-size: 10px; color: gold;" title="' + GoScoutReports + '">' + ScoutReports + '</a></li><li><a href="http://trophymanager.com/coaches/" target="_self" style="font-size: 10px; color: gold;" titles="' + GoMyCoaches + '">' + MyCoaches + '</a> | <a href="http://trophymanager.com/scouts/" target="_self" style="font-size: 10px; color: gold;" titles="' + GoMyScouts + '">' + MyScouts + '</a></li></ul><p style="text-decoration: underline;">' + Training + '</p><ul style="list-style-type:disc; margin-top: 0px; padding-left: 20px;"><li><a href="http://trophymanager.com/training-overview/advanced/" target="_self" style="font-size: 10px; color: gold;" title="' + GoTrainingOverview + '">' + TrainingOverview + '</a></li><li><a href="http://trophymanager.com/training/" target="_self" style="font-size: 10px; color: gold;" title="' + GoTrainingTeams + '">' + TrainingTeams + '</a></li></ul><p style="text-decoration: underline;">' + Community + '</p><ul style="list-style-type:disc; margin-top: 0px; padding-left: 20px;"><li><a href="http://trophymanager.com/forum/" target="_self" style="font-size: 10px; color: gold;" title="' + GoForum + '">' + Forum + '</a> ( <a href="http://trophymanager.com/forum/pl/help/" title="' + GoTransferForum + '">P</a> | <a href="http://trophymanager.com/forum/int/general/" title="' + GoGeneralForum + '">G</a> | <a href="http://trophymanager.com/forum/int/announcements/" title="' + GoAnnouncementForum + '">A</a> )</li><li><a href="http://trophymanager.com/forum/int/recent-posts/" target="_self" style="font-size: 10px; color: gold;" title="' + GoYourRecentPosts + '">' + YourRecentPosts + '</a></li><li><a href="http://trophymanager.com/user-guide/" target="_self" style="font-size: 10px; color: gold;" title="' + GoTMUserGuide + '">' + TMUserGuide + '</a></li><li><a href="http://trophymanager.com/forum/conference/18/" target="_self" style="font-size: 10px; color: gold;" title="' + GoTBConference + '">' + TBConference + '</a></li></ul></div>';
	//appdiv.innerHTML = '<div id="tbuddy" style="position: fixed; z-index: 1000; top: 150px; left: 25px; height: 500px; width: 130px; -moz-opacity: .8; text-align: left; border: 2px #333333 outset; display:inline;"><img src="http://patrick-meurer.de/tm/TrophyBuddy21.png"><li><a href="http://trophymanager.com/club/" target="_self" style="list-style-type:disc; margin-top: 0px; padding-left: 0px;" title="' + Team + '">' + Team + ' </a></li><li><a href="http://trophymanager.com/bids/" target="_self" style="font-size: 10px; color: gold;" title="' + GoCurrentBids + '">' + CurrentBids + '</a></li><li><a href="http://trophymanager.com/tactics/" target="_self" style="font-size: 10px; color: gold;" title="Go to Tactics">' + Tactics + '</a></li><li><a href="http://trophymanager.com/assistant-manager/" target="_self" style="font-size: 10px; color: gold;" title="' + GoYouthAcademy + '">' + YouthAcademy + '</a></li><li><a href="http://trophymanager.com/finances/" target="_self" style="font-size: 10px; color: gold;" title="' + GoYouthAcademyy + '">' + YouthAcademyy + '</a></li><li><a href="http://trophymanager.com/youth-development/" target="_self" style="font-size: 10px; color: gold;" title="' + GoPlayerNotes + '>' + PlayerNotes + '</a></li></ul><p style="text-decoration: underline;">' + Staff + '</p><ul style="list-style-type:disc; margin-top: 0px; padding-left: 20px;"><li><a href="http://trophymanager.com/coaches/hire/" target="_self" style="font-size: 10px; color: gold;" title="' + GoHireCoaches + '">' + HireCoaches + '</a> | <a href="http://trophymanager.com/scouts/hire/" target="_self" style="font-size: 10px; color: gold;" title="' + GoHireScouts + '">' + HireScouts + '</a></li><li><a href="http://trophymanager.com/scouts/" target="_self" style="font-size: 10px; color: gold;" title="' + GoScoutReports + '">' + ScoutReports + '</a></li><li><a href="http://trophymanager.com/coaches/" target="_self" style="font-size: 10px; color: gold;" titles="' + GoMyCoaches + '">' + MyCoaches + '</a> | <a href="http://trophymanager.com/scouts/" target="_self" style="font-size: 10px; color: gold;" titles="' + GoMyScouts + '">' + MyScouts + '</a></li></ul><p style="text-decoration: underline;">' + Training + '</p><ul style="list-style-type:disc; margin-top: 0px; padding-left: 20px;"><li><a href="http://trophymanager.com/training-overview/advanced/" target="_self" style="font-size: 10px; color: gold;" title="' + GoTrainingOverview + '">' + TrainingOverview + '</a></li><li><a href="http://trophymanager.com/training/" target="_self" style="font-size: 10px; color: gold;" title="' + GoTrainingTeams + '">' + TrainingTeams + '</a></li></ul><p style="text-decoration: underline;">' + Community + '</p><ul style="list-style-type:disc; margin-top: 0px; padding-left: 20px;"><li><a href="http://trophymanager.com/forum/" target="_self" style="font-size: 10px; color: gold;" title="' + GoForum + '">' + Forum + '</a> ( <a href="http://trophymanager.com/forum/pl/help/" title="' + GoTransferForum + '">P</a> | <a href="http://trophymanager.com/forum/int/general/" title="' + GoGeneralForum + '">G</a> | <a href="http://trophymanager.com/forum/int/announcements/" title="' + GoAnnouncementForum + '">A</a> | <a href="http://trophymanager.com/forum/federations" title="' + GoFederations + '">F</a> )</li><li><a href="http://trophymanager.com/user-guide/" target="_self" style="font-size: 10px; color: gold;" title="' + GoTMUserGuide + '">' + TMUserGuide + '</a></li><li><a href="http://trophymanager.com/forum/conference/18/" target="_self" style="font-size: 10px; color: gold;" title="' + GoTBConference + '">' + TBConference + '</a></li></ul></div>';	
	}
	else {
	//Navigationsbereich
	var div = document.createElement('div');
	appdiv = document.body.appendChild(div);
	appdiv.innerHTML = '<div id="tbuddy" style="position: fixed; z-index: 1000; top: 130px; left: 20px; height: 555px; width: 124px; -moz-opacity: .8; text-align: left; border: 2px #275502 outset; display:inline;"><span style="position:relative; top:0px;left:0px"><a href="http://trophymanager.com/forum/int/announcements/"><img src="http://iv.pl/images/09647191584926189472.gif" title="' + CheckYourMailss + '" style="height: 42px;"></a></span></p></p><span><a href="http://trophymanager.com/club/" target="_self" style="font-size: margin-top: 0px; padding-left: 0px;" title="' + Team + '">' + Team + '<ul style="list-style-type:disc; margin-top: 0px; padding-left: 10px;"></a></span><li><a href="http://trophymanager.com/bids/" target="_self" style="font-size: 10px; color: gold;" title="' + GoCurrentBids + '">' + CurrentBids + '</a></li><li><a href="http://trophymanager.com/club/' + myclubid + '/squad/" target="_self" style="font-size: 10px; color: gold;" title="Przegląd Składu">' + Squad + '</a></li><li><a href="http://trophymanager.com/tactics/" target="_self" style="font-size: 10px; color: gold;" title="Taktyka">' + Tactics + '</a></li><li><a href="http://trophymanager.com/assistant-manager/" target="_self" style="font-size: 10px; color: gold;" title="Asystent-Taktyka">' + YouthAcademy + '</a></li><li><a href="http://trophymanager.com/finances/" target="_self" style="font-size: 10px; color: gold;" title="Ekonomia">' + YouthAcademyy + '</a></li><li><a href="http://trophymanager.com/youth-development/" target="_self" style="font-size: 10px; color: gold;" title="' + GoPlayerNotes + '">' + PlayerNotes + '</a></li><li><a href="http://trophymanager.com/_test_t" target="_self" style="font-size: 10px; color: gold;" title="Fanklub">' + PlayerNotess + '</a></li></ul></p><a href="http://trophymanager.com/teamsters/" target="_self" style="font-size: margin-top: 0px; padding-left: 0px;" title="' + Staff + '">' + Staff+ '<ul style="list-style-type:disc; margin-top: 0px; padding-left: 10px;"><li><a href="http://trophymanager.com/scouts/hire/" target="_self" style="font-size: 10px; color: gold;" title="' + GoHireScouts + '">' + HireScouts + '</a></li><li><a href="http://trophymanager.com/scouts/" target="_self" style="font-size: 10px; color: gold;" title="' + GoScoutReports + '">' + ScoutReports + '</a></li></li></ul></p><a href="http://trophymanager.com/training-overview/simple/" target="_self" style="font-size: margin-top: 0px; padding-left: 0px;" title="' + Training + '">' + Training+ '<ul style="list-style-type:disc; margin-top: 0px; padding-left: 10px;"></a><li><a href="http://trophymanager.com/training-overview/advanced/" target="_self" style="font-size: 10px; color: gold;" title="' + GoTrainingOverview + '">' + TrainingOverview + '</a></li><li><a href="http://trophymanager.com/training/" target="_self" style="font-size: 10px; color: gold;" title="' + GoTrainingTeams + '">' + TrainingTeams + '</a></li></ul></p><a href="http://trophymanager.com/forum/int/conferences/" target="_self" style="font-size: margin-top: 0px; padding-left: 0px;" title="' + Community + '">' + Community + '<ul style="list-style-type:disc; margin-top: 0px; padding-left: 10px;"></a><li><a href="http://trophymanager.com/forum/" target="_self" style="font-size: 10px; color: gold;" title="' + GoForum + '">' + Forum + '</a> ( <a href="http://trophymanager.com/forum/pl/help/" title="' + GoTransferForum + '">P</a> | <a href="http://trophymanager.com/forum/int/general/" title="' + GoGeneralForum + '">G</a> | <a href="http://trophymanager.com/forum/int/bugs/" title="' + GoAnnouncementForum + '">B</a> )</li><li><a href="http://trophymanager.com/forum/int/recent-posts/" target="_self" style="font-size: 10px; color: gold;" title="' + GoYourRecentPosts + '">' + YourRecentPosts + '</a></li><li><a href="http://trophymanager.com/user-guide/" target="_self" style="font-size: 10px; color: gold;" title="' + GoTMUserGuide + '">' + TMUserGuide + '</a></li><li><a href="http://trophymanager.com/forum/conference/18/" target="_self" style="font-size: 10px; color: gold;" title="' + GoTBConference + '">' + TBConference + '</a></li><p></p><p></p><p></p><span style="position:relative; top:1px;left:-10px"><a href="http://trophymanager.com/free-pro/matomy/"><img src="http://iv.pl/images/55650073709049284949.gif" title="free-pro" style="height: 22px;"></a></span></div>';
	}
}
else {
}
}
//Transferseite




