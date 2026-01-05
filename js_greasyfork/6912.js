
// ==UserScript==
// @name			TB+RatingR2
// @version			1.6
// @description		REREC, Season TI, TrExMa, RatingR2  JP/EN

// @name           ATrophyBuddy v2.2.3
// @include         http://trophymanager.com/*
// @include        http://test.trophymanager.com/*
// @exclude        http://trophymanager.com/banners*
// @exclude        http://trophymanager.com/showprofile.php*
// @include			http://trophymanager.com/players


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
// @downloadURL https://update.greasyfork.org/scripts/6912/TB%2BRatingR2.user.js
// @updateURL https://update.greasyfork.org/scripts/6912/TB%2BRatingR2.meta.js
// ==/UserScript==


// @version        2.2.3
// ==/UserScript==

var rou_factor = 0.00405;
var wage_rate = 27.55;

// NOTE: if you want to do some translate , find the key word "translate" in this script

// Array to setup the weights of particular skills for each player's actual ability
// This is the direct weight to be given to each skill.
// Array maps to these skills:
//				   [Str,Sta,Pac,Mar,Tac,Wor,Pos,Pas,Cro,Tec,Hea,Fin,Lon,Set]
var positions = [[  1,  3,  1,  1,  1,  3,  3,  2,  2,  2,  1,  3,  3,  3], // D C
				 [  2,  3,  1,  1,  1,  3,  3,  2,  2,  2,  2,  3,  3,  3], // D L
				 [  2,  3,  1,  1,  1,  3,  3,  2,  2,  2,  2,  3,  3,  3], // D R
				 [  1,  2,  2,  1,  1,  1,  1,  1,  2,  2,  1,  3,  3,  3], // DM C
				 [  2,  3,  1,  1,  1,  3,  3,  2,  2,  2,  2,  3,  3,  3], // DM L
				 [  2,  3,  1,  1,  1,  3,  3,  2,  2,  2,  2,  3,  3,  3], // DM R
				 [  2,  2,  3,  1,  1,  1,  1,  1,  3,  1,  2,  3,  3,  3], // M C 
				 [  2,  2,  1,  1,  1,  1,  1,  1,  1,  1,  2,  3,  3,  3], // M L
				 [  2,  2,  1,  1,  1,  1,  1,  1,  1,  1,  2,  3,  3,  3], // M R
				 [  2,  3,  3,  2,  2,  1,  1,  1,  3,  1,  2,  1,  1,  3], // OM C
				 [  2,  2,  1,  3,  3,  2,  2,  3,  1,  1,  2,  2,  2,  3], // OM L
				 [  2,  2,  1,  3,  3,  2,  2,  3,  1,  1,  2,  2,  2,  3], // OM R
				 [  1,  2,  2,  3,  3,  2,  2,  3,  3,  2,  1,  1,  1,  3], // F
				 [  2,  3,  2,  1,  2,  1,  2,  2,  3,  3,  3]]; // GK

// Weights need to total 100
var weights = [ [85,12, 3],  // D C
				[70,25, 5],  // D L
				[70,25, 5],  // D R
				[90,10, 0],  // DM C
				[50,40,10],  // DM L
				[50,40,10],  // DM R
				[85,12, 3],  // M C			   
				[90, 7, 3],  // M L
				[90, 7, 3],  // M R
				[90,10, 0],  // OM C
				[60,35, 5],  // OM  L
				[60,35, 5],  // OMR
				[80,18, 2],  // F
				[50,42, 8]]; // GK

var weightR2 = [[	0.51872935	,	0.29081119	,	0.57222393	,	0.89735816	,	0.84487852	,	0.50887940	,	0.50887940	,	0.13637928	,	0.05248024	,	0.09388931	,	0.57549122	,	0.00000000	,	0.00000000	,	0.00000000	],	// DC
                [	0.46087883	,	0.31034824	,	0.65619359	,	0.73200504	,	0.70343948	,	0.49831122	,	0.46654859	,	0.16635132	,	0.22496087	,	0.19697949	,	0.48253326	,	0.07310254	,	0.02834753	,	0.00000000	],	// DL/R
                [	0.43732502	,	0.31888984	,	0.53618097	,	0.63897616	,	0.59319466	,	0.51330795	,	0.53166961	,	0.32536200	,	0.06340582	,	0.27886822	,	0.49996910	,	0.18940400	,	0.07344664	,	0.00000000	],	// DMC
                [	0.42233965	,	0.32373447	,	0.62437404	,	0.54169665	,	0.51669428	,	0.49853202	,	0.47851686	,	0.26551219	,	0.22685609	,	0.32146118	,	0.45396969	,	0.23513340	,	0.09117948	,	0.00000000	],	// DML/R
                [	0.34304950	,	0.35058989	,	0.49918296	,	0.34631352	,	0.30595388	,	0.52078076	,	0.56068322	,	0.52568923	,	0.08771222	,	0.47650463	,	0.41232903	,	0.41160135	,	0.15960981	,	0.00000000	],	// MC
                [	0.37404045	,	0.33153172	,	0.62642777	,	0.33260815	,	0.30559265	,	0.50117998	,	0.47502314	,	0.28759565	,	0.33838614	,	0.44322386	,	0.40347341	,	0.41859521	,	0.16232188	,	0.00000000	],	// ML/R
                [	0.31998474	,	0.35180968	,	0.49002842	,	0.23116817	,	0.19239312	,	0.52687030	,	0.57839880	,	0.53861416	,	0.07598706	,	0.56096162	,	0.39614367	,	0.53152625	,	0.20611401	,	0.00000000	],	// OMC
                [	0.36069138	,	0.33248748	,	0.62214126	,	0.20034326	,	0.17595073	,	0.50091992	,	0.47631079	,	0.29235505	,	0.35086625	,	0.52960856	,	0.39553712	,	0.54964726	,	0.21314094	,	0.00000000	],	// OML/R
                [	0.40324698	,	0.29906901	,	0.39676419	,	0.10106757	,	0.07620466	,	0.50471883	,	0.58512049	,	0.37506253	,	0.05291339	,	0.53882195	,	0.51604535	,	0.82935839	,	0.32160667	,	0.00000000	],	// F
                [	0.45462811	,	0.30278232	,	0.45462811	,	0.90925623	,	0.45462811	,	0.90925623	,	0.45462811	,	0.45462811	,	0.30278232	,	0.15139116	,	0.15139116	]];	// GK						

// REC weights Str				   Sta				  Pac				 Mar				 Tac				 Wor				Pos				   Pas				  Cro				 Tec				Hea				   Fin				  Lon				 Set
var weightR = [[0.653962303361921,  0.330014238020285, 0.562994547223387, 0.891800163983125,  0.871069095865164,  0.454514672470839, 0.555697278549252, 0.42777598627972,  0.338218821750765, 0.134348455965202, 0.796916786677566, 0.048831870932616, 0.116363443378865, 0.282347752982916],	//DC
			   [0.565605120229193,  0.430973382039533, 0.917125432457378, 0.815702528287723,  0.99022325015212,   0.547995876625372, 0.522203232914265, 0.309928898819518, 0.837365352274204, 0.483822472259513, 0.656901420858592, 0.137582588344562, 0.163658117596413, 0.303915447383549],	//DL/R
			   [0.55838825558912,   0.603683502357502, 0.563792314670998, 0.770425088563048,  0.641965853834719,  0.675495235675077, 0.683863478201805, 0.757342915150728, 0.473070797767482, 0.494107823556837, 0.397547163237438, 0.429660916538242, 0.56364174077388,  0.224791093448809],	//DMC
			   [0.582074038075056,  0.420032202680124, 0.7887541874616,   0.726221389774063,  0.722972329840151,  0.737617252827595, 0.62234458453736,  0.466946909655194, 0.814382915598981, 0.561877829393632, 0.367446981999576, 0.360623408340649, 0.390057769678583, 0.249517737311268],	//DML/R
			   [0.578431939417021,  0.778134685048085, 0.574726322388294, 0.71400292078636,   0.635403391007978,  0.822308254446722, 0.877857040588335, 0.864265671245476, 0.433450219618618, 0.697164252367046, 0.412568516841575, 0.586627586272733, 0.617905053049757, 0.308426814834866],	//MC
			   [0.497429376361348,  0.545347364699553, 0.788280917110089, 0.578724574327427,  0.663235306043286,  0.772537143243647, 0.638706135095199, 0.538453108494387, 0.887935381275257, 0.572515970409641, 0.290549550901104, 0.476180499897665, 0.526149424898544, 0.287001645266184],	//ML/R
			   [0.656437768926678,  0.617260722143117, 0.656569986958435, 0.63741054520629,   0.55148452726771,   0.922379789905246, 0.790553566121791, 0.999688557334153, 0.426203575603164, 0.778770912265944, 0.652374065121788, 0.662264393455567, 0.73120100926333,  0.274563618133769],	//OMC
			   [0.483341947292063,  0.494773052635464, 0.799434804259974, 0.628789194186491,  0.633847969631333,  0.681354437033551, 0.671233869875345, 0.536121458625519, 0.849389745477645, 0.684067723274814, 0.389732973354501, 0.499972692291964, 0.577231818355874, 0.272773352088982],	//OML/R
			   [0.493917051093473,  0.370423904816088, 0.532148929996192, 0.0629206658586336, 0.0904950078155216, 0.415494774080483, 0.54106107545574,  0.468181146095801, 0.158106484131194, 0.461125738338018, 0.83399612271067,  0.999828328674183, 0.827171977606305, 0.253225855459207],	//F
//			   For  Rez    Vit  Ind  One  Ref Aer  Sar  Com    Deg    Aru
			   [0.5, 0.333, 0.5, 1,   0.5, 1,  0.5, 0.5, 0.333, 0.333, 0.333]]; //GK

//				DC		   DL/R		  DMC		  DML/R		  MC		  ML/R		  OMC		  OML/R		  F			  GK
var recLast = [[14.866375, 15.980742, 15.8932675, 15.5835325, 17.6955092, 16.6189141, 18.1255351, 15.6304867, 13.2762119, 15],
			   [18.95664,  22.895539, 23.1801296, 23.2813871, 26.8420884, 23.9940623, 27.8974544, 24.54323,   19.5088591, 22.3]];

				  // L	DC	R	L	DMC	R	L	MC	R	L	OMC	R	F
var	positionsAll = [[2,	0,	2,	3,	1,	3,	4,	2,	4,	4,	3,	4,	4],	// D C
					[0,	2,	1,	1,	3,	2,	2,	4,	3,	3,	4,	4,	4],	// D L
					[1,	2,	0,	2,	3,	1,	3,	4,	2,	4,	4,	3,	4],	// D R
					[3,	1,	3,	2,	0,	2,	3,	1,	3,	4,	2,	4,	3],	// DM C
					[1,	3,	2,	0,	2,	1,	1,	3,	2,	2,	4,	3,	4],	// DM L
					[2,	3,	1,	1,	2,	0,	2,	3,	1,	3,	4,	2,	4],	// DM R
					[4,	2,	4,	3,	1,	3,	2,	0,	2,	3,	1,	3,	2],	// M C
					[2,	4,	3,	1,	3,	2,	0,	2,	1,	1,	3,	2,	4],	// M L
					[3,	4,	2,	2,	3,	1,	1,	2,	0,	2,	3,	1,	4],	// M R
					[4,	3,	4,	4,	2,	4,	3,	1,	3,	2,	0,	2,	1],	// OM C
					[3,	4,	4,	2,	4,	3,	1,	3,	2,	0,	2,	1,	3],	// OM L
					[4,	4,	3,	3,	4,	2,	2,	3,	1,	1,	2,	0,	3],	// OM R
					[4,	4,	4,	4,	3,	4,	4,	2,	4,	3,	1,	3,	0]]	// F

var positionNames = ["D C", "D L", "D R", "DM C", "DM L", "DM R", "M C", "M L", "M R", "OM C", "OM L", "OM R", "F", "GK"];
//to translate
var positionFullNames = ["Defender Center", "Defender Left", "Defender Right", "Defensive Midfielder Center", "Defensive Midfielder Left", "Defensive Midfielder Right", "Midfielder Center", "Midfielder Left", "Midfielder Right", "Offensive Midfielder Center", "Offensive Midfielder Left", "Offensive Midfielder Right", "Forward", "Goalkeeper"];
var positionFullNamesJ = ["ディフェンダー 中央", "ディフェンダー 左", "ディフェンダー 右", "守備的ミッドフィルダー 中央", "守備的ミッドフィルダー 左", "守備的ミッドフィルダー 右", "ミッドフィルダー 中央", "ミッドフィルダー 左", "ミッドフィルダー 右", "攻撃的ミッドフィルダー 中央", "攻撃的ミッドフィルダー 左", "攻撃的ミッドフィルダー 右", "フォワード", "ゴールキーパー"];
var positionFullNamesP = ["Obrońca środkowy", "Obrońca lewy", "Obrońca prawy", "Defensywny pomocnik środkowy", "Defensywny pomocnik lewy", "Defensywny pomocnik prawy", "Pomocnik środkowy", "Pomocnik lewy", "Pomocnik prawy", "Ofensywny pomocnik środkowy", "Ofensywny pomocnik lewy", "Ofensywny pomocnik prawy", "Napastnik", "Bramkarz"];
var positionFullNamesD = ["Forsvar Centralt", "Forsvar Venstre", "Forsvar Højre", "Defensiv Midtbane Centralt", "Defensiv Midtbane Venstre", "Defensiv Midtbane Højre", "Midtbane Centralt", "Midtbane Venstre", "Midtbane Højre", "Offensiv Midtbane Centralt", "Offensiv Midtbane Venstre", "Offensiv Midtbane Højre", "Angriber", "Målmand"];
var positionFullNamesI = ["Difensore Centrale", "Difensore Sinistro", "Difensore Destro", "Centrocampista Difensivo Centrale", "Centrocampista Difensivo Sinistro", "Centrocampista Difensivo Destro", "Centrocampista Centrale", "Centrocampista Sinistro", "Centrocampista Destro", "Centrocampista Offensivo Centrale", "Centrocampista Offensivo Sinistro", "Centrocampista Offensivo Destro", "Attaccante", "Portiere"];
var positionFullNamesH = ["Defensa Central", "Defensa Izquierdo", "Defensa Derecho", "Mediocampista Defensivo Central", "Mediocampista Defensivo Izquierdo", "Mediocampista Defensivo Derecho", "Mediocampista Central", "Mediocampista Izquierdo", "Mediocampista Derecho", "Mediocampista Ofensivo Central", "Mediocampista Ofensivo Izquierdo", "Mediocampista Ofensivo Derecho", "Delantero", "Portero"];
var positionFullNamesF = ["Défenseur Central", "Défenseur Gauche", "Défenseur Droit", "Milieu défensif Central", "Milieu défensif Gauche", "Milieu défensif Droit", "Milieu Central", "Milieu Gauche", "Milieu Droit", "Milieu offensif Central", "Milieu offensif Gauche", "Milieu offensif Droit", "Attaquant", "Gardien de but"];
var positionFullNamesA = ["Defender Center", "Defender Left", "Defender Right", "Defensive Midfielder Center", "Defensive Midfielder Left", "Defensive Midfielder Right", "Midfielder Center", "Midfielder Left", "Midfielder Right", "Offensive Midfielder Center", "Offensive Midfielder Left", "Offensive Midfielder Right", "Forward", "Goalkeeper"];
var positionFullNamesC = ["Obrambeni Sredina", "Obrambeni Lijevo", "Obrambeni Desno", "Defenzivni vezni Sredina", "Defenzivni vezni Lijevo", "Defenzivni vezni Desno", "Vezni Sredina", "Vezni Lijevo", "Vezni Desno", "Ofenzivni vezni Sredina", "Ofenzivni vezni Lijevo", "Ofenzivni vezni Desno", "Napadač", "Golman"];
var positionFullNamesG = ["Verteidiger Zentral", "Verteidiger Links", "Verteidiger Rechts", "Defensiver Mittelfeldspieler Zentral", "Defensiver Mittelfeldspieler Links", "Defensiver Mittelfeldspieler Rechts", "Mittelfeldspieler Zentral", "Mittelfeldspieler Links", "Mittelfeldspieler Rechts", "Offensiver Mittelfeldspieler Zentral", "Offensiver Mittelfeldspieler Links", "Offensiver Mittelfeldspieler Rechts", "Stürmer", "Torhüter"];
var positionFullNamesPO = ["Defesa Centro", "Defesa Esquerdo", "Defesa Direito", "Médio Defensivo Centro", "Médio Defensivo Esquerdo", "Médio Defensivo Direito", "Medio Centro", "Medio Esquerdo", "Medio Direito", "Medio Ofensivo Centro", "Medio Ofensivo Esquerdo", "Medio Ofensivo Direito", "Avançado", "Guarda-Redes"];
var positionFullNamesR = ["Fundas Central", "Fundas Stânga", "Fundas Dreapta", "Mijlocas Defensiv Central", "Mijlocas Defensiv Stânga", "Mijlocas Defensiv Dreapta", "Mijlocas Central", "Mijlocas Stânga", "Mijlocas Dreapta", "Mijlocas Ofensiv Central", "Mijlocas Ofensiv Stânga", "Mijlocas Ofensiv Dreapta", "Atacant", "Portar"];
var positionFullNamesT = ["Defans Orta", "Defans Sol", "Defans Sağ", "Defansif Ortasaha Orta", "Defansif Ortasaha Sol", "Defansif Ortasaha Sağ", "Ortasaha Orta", "Ortasaha Sol", "Ortasaha Sağ", "Ofansif Ortasaha Orta", "Ofansif Ortasaha Sol", "Ofansif Ortasaha Sağ", "Forvet", "Kaleci"];
var positionFullNamesRU = ["Defender Center", "Defender Left", "Defender Right", "Defensive Midfielder Center", "Defensive Midfielder Left", "Defensive Midfielder Right", "Midfielder Center", "Midfielder Left", "Midfielder Right", "Offensive Midfielder Center", "Offensive Midfielder Left", "Offensive Midfielder Right", "Forward", "Goalkeeper"];
var positionFullNamesCE = ["Obránce Střední", "Obránce Levý", "Obránce Pravý", "Defenzivní Záložník Střední", "Defenzivní Záložník Levý", "Defenzivní Záložník Pravý", "Záložník Střední", "Záložník Levý", "Záložník Pravý", "Ofenzivní záložník Střední", "Ofenzivní záložník Levý", "Ofenzivní záložník Pravý", "Útočník", "Gólman"];
var positionFullNamesHU = ["Védő , középső", "Védő , bal oldali", "Védő , jobb oldali", "Védekező Középpályás , középső", "Védekező Középpályás , bal oldali", "Védekező Középpályás , jobb oldali", "Középpályás , középső", "Középpályás , bal oldali", "Középpályás , jobb oldali", "Támadó középpályás , középső", "Támadó középpályás , bal oldali", "Támadó középpályás , jobb oldali", "Csatár", "Kapus"];
var positionFullNamesGE = ["მცველი ცენტრალური", "მცველი მარცხენა", "მცველი მარჯვენა", "საყრდენი ნახევარმცველი ცენტრალური", "საყრდენი ნახევარმცველი მარცხენა", "საყრდენი ნახევარმცველი მარჯვენა", "ნახევარმცველი ცენტრალური", "ნახევარმცველი მარცხენა", "ნახევარმცველი მარჯვენა", "შემტევი ნახევარმცველი ცენტრალური", "შემტევი ნახევარმცველი მარცხენა", "შემტევი ნახევარმცველი მარჯვენა", "თავდამსხმელი", "მეკარე"];
var positionFullNamesFI = ["Puolustaja Keski", "Puolustaja Vasen", "Puolustaja Oikea", "Puolustava Keskikenttä Keski", "Puolustava Keskikenttä Vasen", "Puolustava Keskikenttä Oikea", "Keskikenttä Keski", "Keskikenttä Vasen", "Keskikenttä Oikea", "Hyökkäävä Keskikenttä Keski", "Hyökkäävä Keskikenttä Vasen", "Hyökkäävä Keskikenttä Oikea", "Hyökkääjä", "Maalivahti"];
var positionFullNamesSV = ["Försvarare Central", "Försvarare Vänster", "Försvarare Höger", "Defensiv Mittfältare Central", "Defensiv Mittfältare Vänster", "Defensiv Mittfältare Höger", "Mittfältare Central", "Mittfältare Vänster", "Mittfältare Höger", "Offensiv Mittfältare Central", "Offensiv Mittfältare Vänster", "Offensiv Mittfältare Höger", "Anfallare", "Målvakt"];
var positionFullNamesNO = ["Forsvar Sentralt", "Forsvar Venstre", "Forsvar Høyre", "Defensiv Midtbane Sentralt", "Defensiv Midtbane Venstre", "Defensiv Midtbane Høyre", "Midtbane Sentralt", "Midtbane Venstre", "Midtbane Høyre", "Offensiv Midtbane Sentralt", "Offensiv Midtbane Venstre", "Offensiv Midtbane Høyre", "Angrep", "Keeper"];
var positionFullNamesSC = ["Defender Centre", "Defender Left", "Defender Richt", "Defensive Midfielder Centre", "Defensive Midfielder Left", "Defensive Midfielder Richt", "Midfielder Centre", "Midfielder Left", "Midfielder Richt", "Offensive Midfielder Centre", "Offensive Midfielder Left", "Offensive Midfielder Richt", "Forward", "Goalkeeper"];
var positionFullNamesVL = ["Verdediger Centraal", "Verdediger Links", "Verdediger Rechts", "Verdedigende Middenvelder Centraal", "Verdedigende Middenvelder Links", "Verdedigende Middenvelder Rechts", "Middenvelder Centraal", "Middenvelder Links", "Middenvelder Rechts", "Aanvallende Middenvelder Centraal", "Aanvallende Middenvelder Links", "Aanvallende Middenvelder Rechts", "Aanvaller", "Doelman"];
var positionFullNamesBR = ["Zagueiro Central", "Zagueiro Esquerdo", "Zagueiro Direito", "Volante Central", "Volante Esquerdo", "Volante Direito", "Meio-Campista Central", "Meio-Campista Esquerdo", "Meio-Campista Direito", "Meia Ofensivo Central", "Meia Ofensivo Esquerdo", "Meia Ofensivo Direito", "Atacante", "Goleiro"];
var positionFullNamesHE = ["מגן מרכז", "מגן שמאל", "מגן ימין", "קשר אחורי מרכז", "קשר אחורי שמאל", "קשר אחורי ימין", "קשר מרכז", "קשר שמאל", "קשר ימין", "קשר קדמי מרכז", "קשר קדמי שמאל", "קשר קדמי ימין", "חלוץ", "שוער"];

if (location.href.indexOf("/players/") != -1){

	// positionIndex is the array of skill priority for this player.
	// skills is an array of skills for each user
	
	document.calculateSkill = function(positionIndex, skills) {
		
		var totSkill = 0;
		for (var i=0; i< positions[positionIndex].length; i++) {
			if (skills[i]>0) {
				totSkill += skills[i]*document.calculateSkillWeight(positions[positionIndex], weights[positionIndex], i);
			}
		}
		
		totSkill = totSkill / 200; 
		totSkill = Math.round(totSkill*1000)/1000;
		
		return totSkill;
	};
	
	document.calculateSkillWeight = function(positionWeightLevels, weights, index) {
		var weight = 0;
		weight = weights[positionWeightLevels[index]-1] / document.numberAtWeight(positionWeightLevels, positionWeightLevels[index]) * 10;
		return weight;
	};
	
	document.numberAtWeight = function(positionWeightLevels, value) {
		var count = 0;
		for (var i=0; i< positionWeightLevels.length; i++) {
			if (positionWeightLevels[i] == value) {
				count++;
			}
		}
		return count;
	};

	document.findPositionIndex = function(position) {
		var index = -1;
		for (var k=0; k< positionFullNames.length; k++) {
			if (position.indexOf(positionFullNames[k]) == 0) {
			return k;
			}
		}
		for (var k=0; k< positionFullNamesJ.length; k++) {
			if (position.indexOf(positionFullNamesJ[k]) == 0) {
			return k;
			}
		}
		for (var k=0; k< positionFullNamesP.length; k++) {
			if (position.indexOf(positionFullNamesP[k]) == 0) {
			return k;
			}
		}
		for (var k=0; k< positionFullNamesD.length; k++) {
			if (position.indexOf(positionFullNamesD[k]) == 0) {
			return k;
			}
		}
		for (var k=0; k< positionFullNamesI.length; k++) {
			if (position.indexOf(positionFullNamesI[k]) == 0) {
			return k;
			}
		}
		for (var k=0; k< positionFullNamesH.length; k++) {
			if (position.indexOf(positionFullNamesH[k]) == 0) {
			return k;
			}
		}
		for (var k=0; k< positionFullNamesF.length; k++) {
			if (position.indexOf(positionFullNamesF[k]) == 0) {
			return k;
			}
		}
		for (var k=0; k< positionFullNamesA.length; k++) {
			if (position.indexOf(positionFullNamesA[k]) == 0) {
			return k;
			}
		}
		for (var k=0; k< positionFullNamesC.length; k++) {
			if (position.indexOf(positionFullNamesC[k]) == 0) {
			return k;
			}
		}
		for (var k=0; k< positionFullNamesG.length; k++) {
			if (position.indexOf(positionFullNamesG[k]) == 0) {
			return k;
			}
		}
		for (var k=0; k< positionFullNamesPO.length; k++) {
			if (position.indexOf(positionFullNamesPO[k]) == 0) {
			return k;
			}
		}
		for (var k=0; k< positionFullNamesR.length; k++) {
			if (position.indexOf(positionFullNamesR[k]) == 0) {
			return k;
			}
		}
		for (var k=0; k< positionFullNamesT.length; k++) {
			if (position.indexOf(positionFullNamesT[k]) == 0) {
			return k;
			}
		}
		for (var k=0; k< positionFullNamesRU.length; k++) {
			if (position.indexOf(positionFullNamesRU[k]) == 0) {
			return k;
			}
		}
		for (var k=0; k< positionFullNamesCE.length; k++) {
			if (position.indexOf(positionFullNamesCE[k]) == 0) {
			return k;
			}
		}
		for (var k=0; k< positionFullNamesHU.length; k++) {
			if (position.indexOf(positionFullNamesHU[k]) == 0) {
			return k;
			}
		}
		for (var k=0; k< positionFullNamesGE.length; k++) {
			if (position.indexOf(positionFullNamesGE[k]) == 0) {
			return k;
			}
		}
		for (var k=0; k< positionFullNamesFI.length; k++) {
			if (position.indexOf(positionFullNamesFI[k]) == 0) {
			return k;
			}
		}
		for (var k=0; k< positionFullNamesSV.length; k++) {
			if (position.indexOf(positionFullNamesSV[k]) == 0) {
			return k;
			}
		}
		for (var k=0; k< positionFullNamesNO.length; k++) {
			if (position.indexOf(positionFullNamesNO[k]) == 0) {
			return k;
			}
		}
		for (var k=0; k< positionFullNamesSC.length; k++) {
			if (position.indexOf(positionFullNamesSC[k]) == 0) {
			return k;
			}
		}
		for (var k=0; k< positionFullNamesVL.length; k++) {
			if (position.indexOf(positionFullNamesVL[k]) == 0) {
			return k;
			}
		}
		for (var k=0; k< positionFullNamesBR.length; k++) {
			if (position.indexOf(positionFullNamesBR[k]) == 0) {
			return k;
			}
		}
		for (var k=0; k< positionFullNamesHE.length; k++) {
			if (position.indexOf(positionFullNamesHE[k]) == 0) {
			return k;
			}
		}
		return index;
	};
	
	document.getSkills = function(table) {
		var skillArray = [];
		var tableData = table.getElementsByTagName("td");
		if (tableData.length > 1) {
			for (var i = 0; i < 2; i++) {
				for (var j = i; j < tableData.length; j += 2) {
					if (tableData[j].innerHTML.indexOf("star.png") > 0) {
						skillArray.push(20);
					}
					else if (tableData[j].innerHTML.indexOf("star_silver.png") > 0) {
						skillArray.push(19);
					}
					else if (tableData[j].textContent.length != 0) {
						skillArray.push(tableData[j].textContent);
					}
				}
			}
		}
		return skillArray;
	};

	function funFix (i) {
		i = (Math.round(i*100)/100).toFixed(2);
		return i;
	}
	
	function funFix2 (i) {
		i = (Math.round(i*10)/10).toFixed(1);
		return i;
	}
	
	//to translate
	function siSearch (gettr) {
		for (var i = 0; i < gettr.length; i++){
			if (gettr[i].innerHTML.indexOf("スキル指数") > 0) return i;
			else if (gettr[i].innerHTML.indexOf("Skill Index") > 0) return i;
			else if (gettr[i].innerHTML.indexOf("ASI") > 0) return i;
			else if (gettr[i].innerHTML.indexOf("Evne Index (EI)") > 0) return i;
			else if (gettr[i].innerHTML.indexOf("Indice Skill (ASI)") > 0) return i;
			else if (gettr[i].innerHTML.indexOf("ASI") > 0) return i;
			else if (gettr[i].innerHTML.indexOf("Index des compétences") > 0) return i;
			else if (gettr[i].innerHTML.indexOf("Indeksi i Aftësive") > 0) return i;
			else if (gettr[i].innerHTML.indexOf("Skill Index") > 0) return i;
			else if (gettr[i].innerHTML.indexOf("Indice de Atributos") > 0) return i;
			else if (gettr[i].innerHTML.indexOf("SI") > 0) return i;
			else if (gettr[i].innerHTML.indexOf("Уровень навыков") > 0) return i;
			else if (gettr[i].innerHTML.indexOf("Index dovednostní") > 0) return i;
			else if (gettr[i].innerHTML.indexOf("مؤشر المهارة") > 0) return i;
			else if (gettr[i].innerHTML.indexOf("Képesség Index") > 0) return i;
			else if (gettr[i].innerHTML.indexOf("უნარების ინდექსი") > 0) return i;
			else if (gettr[i].innerHTML.indexOf("Taito indeksi") > 0) return i;
			else if (gettr[i].innerHTML.indexOf("Skill index") > 0) return i;
			else if (gettr[i].innerHTML.indexOf("Vaardigheden index") > 0) return i;
			else if (gettr[i].innerHTML.indexOf("Índice de habilidade") > 0) return i;
			else if (gettr[i].innerHTML.indexOf("מדד סקילים") > 0) return i;
		}
	}
	
	document.createTR = function(table, SKarray) {
		var tr = document.createElement("tr");
		var th = document.createElement("th");
		th.innerHTML = "SK1";
		tr.appendChild(th);
		var td = document.createElement("td");
		td.setAttribute("class", "align_center");
		td.innerHTML = SKarray[0];
		tr.appendChild(td);
		var th = document.createElement("th");
		th.innerHTML = "SK2";
		tr.appendChild(th);
		var td = document.createElement("td");
		td.setAttribute("class", "align_center");
		if (SKarray[1] == 0){
			td.innerHTML = "N/A";
		} else {
			td.innerHTML = SKarray[1];
		}
		tr.appendChild(td);
		table.appendChild(tr);
	};
	
	function computeSK(table, skills){
	var SKs = [0, 0];
	var REREC = [[],[],[]];
	var FP = [];
	var positionCell = document.getElementsByClassName("favposition long")[0].childNodes;
	var positionArray = [];
	if (positionCell.length == 1){
			positionArray[0] = positionCell[0].textContent;
	} else if (positionCell.length == 2){
			positionArray[0] = positionCell[0].textContent + positionCell[1].textContent;
	} else if (positionCell[1].className == "split"){
			positionArray[0] = positionCell[0].textContent + positionCell[3].textContent;
			positionArray[1] = positionCell[2].textContent + positionCell[3].textContent;
	} else if (positionCell[3].className == "f"){
			positionArray[0] = positionCell[0].textContent + positionCell[1].textContent;
			positionArray[1] = positionCell[3].textContent;
	} else {
			positionArray[0] = positionCell[0].textContent + positionCell[1].textContent;
			positionArray[1] = positionCell[0].textContent + positionCell[3].textContent;
	}
	var gettr = document.getElementsByTagName("tr");
	var trnum = siSearch(gettr);
	var rou = gettr[trnum+2].getElementsByTagName("td")[0].innerHTML;
	rou = Math.pow(5/3, Math.LOG2E * Math.log(rou * 10)) * 0.4;
	for (var i = 0; i < positionArray.length; i++){
			var positionIndex = document.findPositionIndex(positionArray[i]);
			FP[i] = positionIndex;
			FP[i+1] = FP[i];
			if (positionIndex > -1) {
				SKs[i] = document.calculateSkill(positionIndex, skills);
			}
			if (i == 0) REREC = document.calculateREREC(positionIndex, skills, gettr, trnum, rou, rou_factor);
	}
	
	var SI = new String(gettr[trnum].getElementsByTagName("td")[0].innerHTML).replace(/,/g, "");
	
	if (positionIndex == 13){
		var phySum = skills[0]*1 + skills[1]*1 + skills[2]*1 + skills[7]*1;
		var tacSum = skills[4]*1 + skills[6]*1 + skills[8]*1;
		var tecSum = skills[3]*1 + skills[5]*1 + skills[9]*1 + skills[10]*1;
		var weight = 48717927500;
	}
	else {
		var phySum = skills[0]*1 + skills[1]*1 + skills[2]*1 + skills[10]*1;
		var tacSum = skills[3]*1 + skills[4]*1 + skills[5]*1 + skills[6]*1;
		var tecSum = skills[7]*1 + skills[8]*1 + skills[9]*1 + skills[11]*1 + skills[12]*1 + skills[13]*1;
		var weight = 263533760000;
	}
	var allSum = phySum + tacSum + tecSum;
	var remainder = funFix2(Math.pow(2,Math.log(weight*SI)/Math.log(Math.pow(2,7))) - allSum);
	
	var recth = document.createElement("div");
	var rectd = document.createElement("div");
	var ratth = document.createElement("div");
	var rattd = document.createElement("div");
	rectd.setAttribute("style", "color: white;");
	rattd.setAttribute("style", "color: white;");
	
	var FP2 = [FP[0], FP[1]];
	for (i = 0; i < FP.length; i++) {
		for (j = 0; 2+j <= FP[i]; j += 2) FP[i]--;
	}
	if (FP[0] != FP[1]) {
		rectd.innerHTML = REREC[0][FP[0]] + "/" + REREC[0][FP[1]];
		rattd.innerHTML = REREC[2][FP[0]] + "/" + REREC[2][FP[1]];
		var ratingR2 = rattd.innerHTML;
		var rouEffect = funFix(REREC[2][FP[0]]*1 - REREC[1][FP[0]]*1) + "/" + funFix(REREC[2][FP[1]]*1 - REREC[1][FP[1]]*1);
		var R2Pure = REREC[1][FP[0]] + "/" + REREC[1][FP[1]];
	}
	else {
		rectd.innerHTML = REREC[0][FP[0]];
		rattd.innerHTML = REREC[2][FP[0]];
		var ratingR2 = rattd.innerHTML;
		var rouEffect = funFix(REREC[2][FP[0]]*1 - REREC[1][FP[0]]*1);
		var R2Pure = REREC[1][FP[0]];
	}
	recth.innerHTML = "<b style=\"color: gold;\">REREC</b>";
	ratth.innerHTML = "<b style=\"color: gold;\">RatingR2</b>";
	gettr[trnum-1].getElementsByTagName("th")[0].appendChild(recth);
	gettr[trnum-1].getElementsByTagName("td")[0].appendChild(rectd);
	gettr[trnum+2].getElementsByTagName("th")[0].appendChild(ratth);
	gettr[trnum+2].getElementsByTagName("td")[0].appendChild(rattd);
	
	var div_area = document.createElement('div');
	div_area.innerHTML="<div id=\"area\" style=\"position: absolute; z-index: 1000; width: 175px; margin-top: 25px; background: #5F8D2D; padding-left: 5px; text-align: middle; color: gold; border: 2px #333333 outset; display:inline;\"><p style=\"text-decoration: underline;\"><b>PlayerData+:<\p><table style=\"margin-top: -1em; margin-bottom: 1em;\"><tr><td>PhySum: </td><td>" + phySum + " </td></tr><tr><td>TacSum: </td><td>" + tacSum + " </td></tr><tr><td>TecSum: </td><td>" + tecSum + " </td></tr><tr><td>AllSum: </td><td>" + allSum + " + " + remainder + " </td></tr><tr><td>&nbsp;</td></tr><tr><td>RatingR2: </td><td>" + ratingR2 + " </td></tr><tr><td>RouEffect: </td><td>" + rouEffect + " </td></tr><tr><td>Rating-Pure: </td><td>" + R2Pure + "</td></tr></table></b></div>";
	document.getElementsByClassName("box")[0].appendChild(div_area);
	
	document.createTR(table, SKs);
	
	var hidden = document.getElementById("hidden_skill_table").getElementsByTagName("td");
	if (hidden[0].innerHTML != "") {
		var x;
		for (var i = 0; i < 4; i++) {
			x = hidden[i].getAttribute("tooltip").match(/\d+/);
			if (x < 10) x = " " + x;
			hidden[i].setAttribute("style", "white-space: nowrap;"); 
			hidden[i].innerHTML += " (" + x + "/20)";
		}
		if (positionIndex != 13) {
			var div = document.createElement("div");
			div.setAttribute("style", "position: absolute; z-index: 1000; width: 175px; margin-top: 240px; color: gold; background: #5F8D2D; padding-left: 5px; border: 2px #333333 outset; display:inline;");
			div.innerHTML = "<p style=\"text-decoration: underline;\"><b>RatingR2: All Positions</b></p>";
			var table2 = document.createElement("table");
			table2.setAttribute("border", "1");
			table2.setAttribute("bordercolor", "#6C9922");
			table2.setAttribute("style", "width: 170px; margin-bottom: 7px;");
			var tbody = document.createElement("tbody");
			tbody.setAttribute("align", "center");
			var adapt = hidden[3].getAttribute("tooltip").match(/\d+/);
			var R2all = [REREC[2][1], REREC[2][0], REREC[2][1], REREC[2][3], REREC[2][2], REREC[2][3], REREC[2][5], REREC[2][4], REREC[2][5], REREC[2][7], REREC[2][6], REREC[2][7], REREC[2][8]];
			for (var i = 0; i < 5; i++) {
				var tr = document.createElement("tr");
				for (var j = 0; j < 3; j++) {
					var num = (4-i)*3+j;
					var td = document.createElement("td");
					if (num < 12 || num == 13) {
						if (num == 13) num--;
						if (positionsAll[FP2[0]][num] > positionsAll[FP2[1]][num]) positionsAll[FP2[0]][num] = positionsAll[FP2[1]][num];
						td.innerHTML = funFix(R2all[num] * (1 - (20 - adapt) * positionsAll[FP2[0]][num] / 200));
						}
					else td.innerHTML = "";
					tr.appendChild(td);
				}
				tbody.appendChild(tr);
			}
			table2.appendChild(tbody);
			div.appendChild(table2);
			document.getElementsByClassName("box")[0].appendChild(div);
		}
	}
		
	if (positionIndex != 13) {
		var table2 = document.createElement("table");
		var tbody = document.createElement("tbody");
		table2.setAttribute("border", "1");  
		table2.setAttribute("bordercolor", "#6C9922");  
		table2.innerHTML = "<thead><tr><th></th><th>DC</th><th>DLR</th><th>DMC</th><th>DMLR</th><th>MC</th><th>MLR</th><th>OMC</th><th>OMLR</th><th>F</th></tr></thead>";
		tbody.setAttribute("align", "center");  
		var tr = document.createElement("tr");
		
		for (var i = 0; i < 3; i+=2) {
			var th = document.createElement("th");
			if (i == 0) th.innerHTML = "REC";
			else th.innerHTML = "R2";
			tr.appendChild(th);
			
			for (var j = 0; j < 9; j++) {
				var td = document.createElement("td");
				if (REREC[i][j]*1 >= 100) REREC[i][j] = funFix2(REREC[i][j]*1);
				td.innerHTML = REREC[i][j];
				tr.appendChild(td);
			}
			tbody.appendChild(tr);
			table2.appendChild(tbody);
			
			var tr = document.createElement("tr");
			var th = document.createElement("th");
			th.setAttribute("colspan", "4");  
			th.setAttribute("align", "center");  
			th.appendChild(table2);
		}
		tr.appendChild(th);
		table.appendChild(tr);
	}
	
	}
	
	document.calculateREREC = function (positionIndex, skills, gettr, num, rou, rou_factor){
		var rec = [];			// REREC
		var ratingR = [];		// RatingR2
		var ratingR2 = [];		// RatingR2 + routine
		var skillSum = 0;
		var SI = new String(gettr[num].getElementsByTagName("td")[0].innerHTML).replace(/,/g, "");
		if (positionIndex == 13) {
			var skillWeightSum = Math.pow(SI, 0.143) / 0.02979;			// GK Skillsum
			var weight = 48717927500;
		}
		else {
			var skillWeightSum = Math.pow(SI, 1/6.99194)/0.02336483;	// Other Skillsum
			var weight = 263533760000;
		}
		for (var i = 0; i < skills.length; i++) {
			skillSum += parseInt(skills[i]);
		}
		for (i = 0; 2+i <= positionIndex; i += 2) {		// TrExMaとRECのweight表のずれ修正
			positionIndex--;
		}
		skillWeightSum -= skillSum;			// REREC remainder
		var remainder = Math.round((Math.pow(2,Math.log(weight*SI)/Math.log(Math.pow(2,7))) - skillSum)*10)/10;		// RatingR2 remainder
		for (var i = 0; i < 10; i++) {
			rec[i] = 0;
			ratingR[i] = 0;
		}
		for (var j = 0; j < 9; j++) {		// All position
			var remainderWeight = 0;		// REREC remainder weight sum
			var remainderWeight2 = 0;		// RatingR2 remainder weight sum
			var not20 = 0;					// 20以外のスキル数
			if (positionIndex == 9) j = 9;	// GK
			
			for (var i = 0; i < weightR[positionIndex].length; i++) {
				rec[j] += skills[i] * weightR[j][i];
				ratingR[j] += skills[i] * weightR2[j][i];
				if (skills[i] != 20) {
					remainderWeight += weightR[j][i];
					remainderWeight2 += weightR2[j][i];
					not20 += 1;
				}
			}
			rec[j] += skillWeightSum * remainderWeight / not20;		//REREC Score
			if (positionIndex == 9) rec[j] *= 1.27;					//GK
			rec[j] = funFix((rec[j] - recLast[0][j]) / recLast[1][j]);
			ratingR[j] += remainder * remainderWeight2 / not20;
			ratingR2[j] = funFix(ratingR[j] * (1 + rou * rou_factor));
			ratingR[j] = funFix(ratingR[j]);
			if (positionIndex == 9) j = 9;		// Loop end
		}
		
		var recAndRating = [rec, ratingR, ratingR2];
		return recAndRating;
	};
	
	function seasonTI () {
		var sith = document.createElement("div");
		var sitd = document.createElement("div");
		var gettr = document.getElementsByTagName("tr");
		var trnum = siSearch(gettr);
		var SI = new String(gettr[trnum].getElementsByTagName("td")[0].innerHTML).replace(/,/g, "");
		var wage = new String(gettr[trnum-2].getElementsByTagName("span")[0].innerHTML).replace(/,/g, "");
		if (wage == 30000) {
			sitd.innerHTML = "---";
		}
		//to translate
		else {
			if (document.getElementsByClassName("favposition long")[0].innerHTML.indexOf("ゴールキーパー") > 0) {
				var weight = 48717927500;
			}
			else if (document.getElementsByClassName("favposition long")[0].innerHTML.indexOf("Goalkeeper") > 0) {
				var weight = 48717927500;
			}
			else if (document.getElementsByClassName("favposition long")[0].innerHTML.indexOf("Bramkarz") > 0) {
				var weight = 48717927500;
			}
			else if (document.getElementsByClassName("favposition long")[0].innerHTML.indexOf("Målmand") > 0) {
				var weight = 48717927500;
			}
			else if (document.getElementsByClassName("favposition long")[0].innerHTML.indexOf("Portiere") > 0) {
				var weight = 48717927500;
			}
			else if (document.getElementsByClassName("favposition long")[0].innerHTML.indexOf("Gardien de but") > 0) {
				var weight = 48717927500;
			}
			else if (document.getElementsByClassName("favposition long")[0].innerHTML.indexOf("Portero") > 0) {
				var weight = 48717927500;
			}
			else if (document.getElementsByClassName("favposition long")[0].innerHTML.indexOf("Golman") > 0) {
				var weight = 48717927500;
			}
			else if (document.getElementsByClassName("favposition long")[0].innerHTML.indexOf("Torhüter") > 0) {
				var weight = 48717927500;
			}
			else if (document.getElementsByClassName("favposition long")[0].innerHTML.indexOf("Guarda-Redes") > 0) {
				var weight = 48717927500;
			}
			else if (document.getElementsByClassName("favposition long")[0].innerHTML.indexOf("Portar") > 0) {
				var weight = 48717927500;
			}
			else if (document.getElementsByClassName("favposition long")[0].innerHTML.indexOf("Kaleci") > 0) {
				var weight = 48717927500;
			}
			else if (document.getElementsByClassName("favposition long")[0].innerHTML.indexOf("Gólman") > 0) {
				var weight = 48717927500;
			}
			else if (document.getElementsByClassName("favposition long")[0].innerHTML.indexOf("Kapus") > 0) {
				var weight = 48717927500;
			}
			else if (document.getElementsByClassName("favposition long")[0].innerHTML.indexOf("მეკარე") > 0) {
				var weight = 48717927500;
			}
			else if (document.getElementsByClassName("favposition long")[0].innerHTML.indexOf("Maalivahti") > 0) {
				var weight = 48717927500;
			}
			else if (document.getElementsByClassName("favposition long")[0].innerHTML.indexOf("Målvakt") > 0) {
				var weight = 48717927500;
			}
			else if (document.getElementsByClassName("favposition long")[0].innerHTML.indexOf("Keeper") > 0) {
				var weight = 48717927500;
			}
			else if (document.getElementsByClassName("favposition long")[0].innerHTML.indexOf("Doelman") > 0) {
				var weight = 48717927500;
			}
			else if (document.getElementsByClassName("favposition long")[0].innerHTML.indexOf("Goleiro") > 0) {
				var weight = 48717927500;
			}
			else if (document.getElementsByClassName("favposition long")[0].innerHTML.indexOf("שוער") > 0) {
				var weight = 48717927500;
			}
			else var weight = 263533760000;
			var TI = Math.pow(2,Math.log(weight*SI)/Math.log(Math.pow(2,7))) - Math.pow(2,Math.log(weight*wage/wage_rate)/Math.log(Math.pow(2,7)));
			sitd.innerHTML = Math.round(TI*10);
		}
		sith.innerHTML = "Season TI";
		gettr[trnum].getElementsByTagName("th")[0].appendChild(sith);
		gettr[trnum].getElementsByTagName("td")[0].appendChild(sitd);
	}
	
	(function() {
		var playerTable = document.getElementsByClassName("skill_table zebra")[0];
		var skillArray = document.getSkills(playerTable);
		var SKs = computeSK(playerTable, skillArray);
		seasonTI();
	})();
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Customize Section: Customize TrophyBuddy to suit your personal preferences																		///
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//																														///
var myclubid = " ";		// if myclubid = "", some functions won't work. Add your team-id like this: var myclubid = "22882" to unlock those additional features			///
var menubar = "yes";		// switch yes/no to turn the menubar on/off																///
var sidebar = "yes";		// switch yes/no to turn the sidebar on/off																///
var PlayerDataPlus = "no";	// switch yes/no to turn the PlayerDataPlus on/off															///
var PlayerDataPlusPosition = "topleft"; // you can choose between "topleft" and "bottomleft"	and "inside"											///
var hovermenu = "yes";	// switch to "yes" to bring back the old hover menu style from TM1.1	(adapted from TM Auxiliary and slightly modified)					///			
var alt_training = "no";	// switch to "yes" to show an alternate version of the training overview (adapted from TM Auxiliary and slightly modified)				///
var old_skills = "no";		// switch to "yes" to to bring back the old look of the skills on the player page (adapted from TM Auxiliary and slightly modified)			///
var bronze_stars = "yes";	// switch to "no" to to add bronze stars for skill values 18 for coaches and scouts										///
var oldpos = "no";			// switch to "yes" to to bring back the old look of player positions														///
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

YourRecentPosts = "Your Recent Posts";
GoYourRecentPosts = "Your Recent Posts";

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
		var Home = "Home";
		var CheckYourMailss = "Announcements ";
		var CheckYourMails = "Check Your Mails";
		var League = "League";
		var Cup = "League Team B";
		var Exit = "Exit";
			
		var GoCurrentBids = "See Current Bids";
		var GoSquad = "Squad Overview";
		var GoTactics = "Go to Tactics";
		var GoToYouthAcademy = "Go to Assistant Manager";
		var GoToYouthAcademyy = "Finances";	
		var GoPlayerNotes = "Youth Academy";
		var GoHireCoaches = "Zatrudnij Trenerów";
		var GoHireScouts = "Hire Scouts";
		var GoScoutReports = "Scout Reports";
		var GoTrainingOverview = "Training Overview";
		var GoTrainingTeams = "Training Teams";
		var GoForum = "Forum";
		var GoTMUserGuide = "Read the User-Guide";
		var GoTBConference = "Enter the TrophyBuddy-Conference";
		
		var GoTransferForum = "Transfer forum";
		var GoGeneralForum = "General forum";
		var GoAnnouncementForum = "Bugs forum";
		//var GoFederations = "Go to Federations";
		
		var Team = "Team";
			var CurrentBids = "Current Bids";
			var Squad = "Squad ";
			var Tactics = "Tactics";
			var YouthAcademy = "Assistant Manager";
			var YouthAcademyy = "Finances";
			var PlayerNotes = "Youth Academy";
			var PlayerNotess = "Fans";
		var Staff = "Staff";
			var HireCoaches = "Zatrudnij Trenerów";
			var HireScouts = "Hire Scouts";
			var ScoutReports = "Scout Reports";
			var MyCoaches = "Trenerzy";
			var MyScouts = "Skauci";
		var Training = "Training";
			var TrainingOverview = "Training Overview";
			var TrainingTeams = "Training Teams";
		var Community = "Community";
			var Forum = "Forum";
			var TMUserGuide = "TM-UserGuide";
			var TBConference = "TrophyBuddy";
			var TBConferencee = "Calculator";
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
// ==/UserScript==

var myurl=document.URL;





	







if (myurl.match(/playerss/))  { // hier wird geprueft, ob das die richtige Seite ist

	var check_statpage = document.URL;
	check_statpage = check_statpage.search("statistics");


		if (document.URL == ""){
		
		function embed() {
		var oldFunc = makeTable;

		makeTable = function() {

        
        
		myTable = document.createElement('table');
		myTable.className = "hover zebra";

		construct_th();
		var z=0;
		for (i=0; i<players_ar.length; i++) {
			if (players_ar[i]["fp"] != "GK" && add_me(players_ar[i]) && filter_squads()) {
				construct_tr(players_ar[i], z);
				z++;
			}
		}
		if (z == 0) {
			var myRow = myTable.insertRow(-1);
			var myCell = myRow.insertCell(-1);
			myCell.colSpan = 24;
			myCell.innerHTML = other_header;
		}
	    if (filters_ar[1] == 1) {
	        var myRow = myTable.insertRow(-1);
	        var myCell = myRow.insertCell(-1);
	        myCell.className = "splitter";
	        myCell.colSpan = "50";
	        myCell.innerHTML = gk_header;
	        construct_th(true);
	        z=0;
	        for (i=0; i<players_ar.length; i++) {
	            if (players_ar[i]["fp"] == "GK" && filter_squads()) {
	                if (!(players_ar[i]["age"] < age_min || players_ar[i]["age"] > age_max)) {
	                    construct_tr(players_ar[i], z, true);
	                    z++;
	                }
	            }
	        }
	    }
	    $e("sq").innerHTML = "";
	    $e("sq").appendChild(myTable);
	    activate_player_links($(myTable).find(""));
	    init_tooltip_by_elems($(myTable).find("["))
	    zebra();

	    };
		}

		var inject = document.createElement("script");

		inject.setAttribute("type", "text/javascript");
		inject.appendChild(document.createTextNode("(" + embed + ")()"));

		document.body.appendChild(inject);


		var load,execute,loadAndExecute;load=function(a,b,c){var d;d=document.createElement("script"),d.setAttribute("src",a),b!=null&&d.addEventListener("load",b),c!=null&&d.addEventListener("error",c),document.body.appendChild(d);return d},execute=function(a){var b,c;typeof a=="function"?b="("+a+")();":b=a,c=document.createElement("script"),c.textContent=b,document.body.appendChild(c);return c},loadAndExecute=function(a,b){return load(a,function(){return execute(b)})};

		loadAndExecute("//ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js", function() {

		    $.noConflict();
		    jQuery(document).ready(function($) {
		       // $('table.zebra th:eq(0)').click();
		  });
		});
		
		}
		else if (check_statpage != -1) {
		}
		
		else {
		
		counttables = document.getElementsByTagName("table").length;
		//alert (counttables)
		var c = 0;
		
		if (counttables == 3) {
			aux = document.getElementsByTagName("table")[1]; // holt die gesamte Tabelle
		}
		else {
			aux = document.getElementsByTagName("table")[2]; // holt die gesamte Tabelle
		}
		auxx = document.getElementsByTagName("table")[0]; // holt die gesamte Tabelle		
		pos_td = document.getElementsByTagName("strong")[1]; // holt die gesamte Tabelle
		auxspan = document.getElementsByTagName("span")[28]; // holt die gesamte Tabelle
		aux2 = document.getElementsByTagName("p")[0]; // holt die gesamte Tabelle
		aux3 = document.getElementsByTagName("p")[1]; // holt die gesamte Tabelle
		aux4 = document.getElementsByTagName("p")[2]; // holt die gesamte Tabelle
		
		if (old_skills == "yes") {
		
		var load,execute,loadAndExecute;load=function(a,b,c){var d;d=document.createElement("script"),d.setAttribute("src",a),b!=null&&d.addEventListener("load",b),c!=null&&d.addEventListener("error",c),document.body.appendChild(d);return d},execute=function(a){var b,c;typeof a=="function"?b="("+a+")();":b=a,c=document.createElement("script"),c.textContent=b,document.body.appendChild(c);return c},loadAndExecute=function(a,b){return load(a,function(){return execute(b)})};

		loadAndExecute("", function () {

		$.noConflict();
		jQuery(document).ready(function ($) {

    // Destination table
    var newskills =
      '<table id="new_skill_table">' +
      '<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>' +
      '<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>' +
      '<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>' +
      '<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>' +
      '</table>';

    // Hide current skills, insert new skills
    $('table.skill_table').toggle();
    $('table.skill_table').after(newskills);

    // Arrays for skill data
    var attributeNames = new Array();
    var attributeValues = new Array();

    // Load skill data
    $('table.skill_table tr th:nth-child(1)').each(function (index) {
      storeData($(this));
    });

    $('table.skill_table tr th:nth-child(3)').each(function (index) {
      storeData($(this));
    });

    // Inject first row of attributes
    $.each(attributeNames, function (index) {
      $('table#new_skill_table tr:eq(0) td:eq(' + index + ')').html(attributeNames[index].substr(0, 3));
      $('table#new_skill_table tr:eq(1) td:eq(' + index + ')').html(attributeValues[index]);
    });

    // Inject second row of attributes (14 attributes for non-goalies)
    if (attributeNames.length == 18) {
      $.each(attributeNames.slice(9), function (index) {
        $('table#new_skill_table tr:eq(2) td:eq(' + index + ')').html(attributeNames[index + 9].substr(0, 3));
        $('table#new_skill_table tr:eq(3) td:eq(' + index + ')').html(attributeValues[index + 9]);
      });
    }
    else {
      $.each(attributeNames.slice(7), function (index) {
        $('table#new_skill_table tr:eq(2) td:eq(' + (index + 3) + ')').html(attributeNames[index + 9].substr(0, 3));
        $('table#new_skill_table tr:eq(3) td:eq(' + (index + 3) + ')').html(attributeValues[index + 9]);
      });
    }

    // Format new skills
    $('table#new_skill_table tr td').css('text-align', 'center');
    $('table#new_skill_table tr td').css('width', '14.2%');
    $('table#new_skill_table tr:nth-child(even)').css('background-color', '#649024');
    $('table#new_skill_table tr td img').css('margin-bottom', '4px');
	$('table#new_skill_table tr:eq(0) td').css('font-weight', 'bold');
	$('table#new_skill_table tr:eq(2) td').css('font-weight', 'bold');
	
	$('span.gk:contains("Goalkeeper")').html('<span class="gk" style="font-size: 1em;">GK </span>');
	$('span.d:contains("Defender")').html('<span class="def" style="font-size: 1em;">D </span>');
	$('span.dm:contains("Defensive Midfielder")').html('<span class="dmid" style="font-size: 1em;">DM </span>');
	$('span.m:contains("Midfielder")').html('<span class="mid" style="font-size: 1em;">M </span>');
	$('span.om:contains("Offensive Midfielder")').html('<span class="omid" style="font-size: 1em;">OM </span>');
	$('span.f:contains("Forward")').html('<span class="fc" style="font-size: 1em;">F </span>');
	$('span.side:contains("Left")').html('<span class="left" style="font-size: 1em;">L</span>');
	$('span.side:contains("Center")').html('<span class="center" style="font-size: 1em;">C</span>');
	$('span.side:contains("Right")').html('<span class="right" style="font-size: 1em;">R</span>');
	
	
	// Format recommendation stars
    $('table.info_table tr td img').css('margin-bottom', '3px');
    $('table.info_table tr td img.flag').css('margin-bottom', '1px');

    // Show player details by default
    if (!$("#player_info").is(":visible")) {
      $("#player_info_arrow").click();
    }
    setClubList();

    // Store attributes to arrays
    function storeData(attribute) {

      // Only store attributes with values
      if (attribute.html() != '') {
        attributeNames.push(attribute.html());
        attributeValues.push(attribute.next().html());
      }
    }

    function sleep(ms) {
      var dt = new Date();
      dt.setTime(dt.getTime() + ms);
      while (new Date().getTime() < dt.getTime());
    }

    function setClubList() {
      // Show clubs for every line of history
      var lastClub;
      $('table.history_table div.club_name').each(function (index) {
        var currentClub = $(this).html();

        // Replace club name on dash, store club name otherwise
        if (currentClub == '-') {
          $(this).html(lastClub);
        }
        else {
          lastClub = currentClub;
        }
      });
    }
  });
});
			
	}
	else {
	
	}

	asi_check = auxx.getElementsByTagName("tr")[6].getElementsByTagName("td")[0].innerHTML;
	//alert(asi_check.search("pics"))
	if (asi_check.search("pics") != -1) {
		var zeile = 0
		var skillindex_yes = 0
	}
	else {
	
	if ( !isNaN( parseFloat(asi_check) ) ) { // ist eine Zahl
	//asi_check = asi_check.search(",") 
	//if (asi_check != -1) {
		var zeile = 0
		var skillindex_yes = 1
	}
	else {
		var zeile = 0
		var skillindex_yes = 0
	}
	}
	//	var asi = asi_check.getElementsByTagName("span")[0].innerHTML;
		
		
// fuer jeden Skill muss so geprueft werden, ob ein img-Tag oder ein span-Tag innerhalb der tabellenzelle vorliegt
	
//Strength
stae_td = aux.getElementsByTagName("tr")[zeile].getElementsByTagName("td")[0];

if(stae_td.getElementsByTagName("span").length==1) // wenn span Tag, wird der Inhalt des ersten Span-Tags ausgelesen
{
var stae = stae_td.getElementsByTagName("span")[0].innerHTML;
//alert ("span " + stae)
}
else if(stae_td.getElementsByTagName("img").length==1){ // wenn img Tag, wird das alt-Atribut des ersten img-Tags ausgelesen
var stae = stae_td.getElementsByTagName("img")[0].getAttribute("alt");
//alert ("img " + stae)
}
else{ // wenn keins von beiden, wird der Inhalt der Tabellenzelle uebernommen
var stae = aux.rows[zeile].cells[1].innerHTML;
//alert ("normal " + stae)
}
//Stamina
kon_td = aux.getElementsByTagName("tr")[zeile+1].getElementsByTagName("td")[0];

if(kon_td.getElementsByTagName("span").length==1) // wenn span Tag, wird der Inhalt des ersten Span-Tags ausgelesen
{
var kon = kon_td.getElementsByTagName("span")[0].innerHTML;
//alert ("span " + kon)
}
else if(kon_td.getElementsByTagName("img").length==1){ // wenn img Tag, wird das alt-Atribut des ersten img-Tags ausgelesen
var kon = kon_td.getElementsByTagName("img")[0].getAttribute("alt");
//alert ("img " + kon)
}
else{ // wenn keins von beiden, wird der Inhalt der Tabellenzelle uebernommen
var kon = aux.rows[zeile+1].cells[1].innerHTML;
//alert ("normal " + kon)
}

//Pace
ges_td = aux.getElementsByTagName("tr")[zeile+2].getElementsByTagName("td")[0];

if(ges_td.getElementsByTagName("span").length==1) // wenn span Tag, wird der Inhalt des ersten Span-Tags ausgelesen
{
var ges = ges_td.getElementsByTagName("span")[0].innerHTML;
//alert ("span " + ges)
}
else if(ges_td.getElementsByTagName("img").length==1){ // wenn img Tag, wird das alt-Atribut des ersten img-Tags ausgelesen
var ges = ges_td.getElementsByTagName("img")[0].getAttribute("alt");
//alert ("img " + ges)
}
else{ // wenn keins von beiden, wird der Inhalt der Tabellenzelle uebernommen
var ges = aux.rows[zeile+2].cells[1].innerHTML;
//alert ("normal " + ges)
}

//Marking
man_td = aux.getElementsByTagName("tr")[zeile+3].getElementsByTagName("td")[0];

if(man_td.getElementsByTagName("span").length==1) // wenn span Tag, wird der Inhalt des ersten Span-Tags ausgelesen
{
var man = man_td.getElementsByTagName("span")[0].innerHTML;
//alert ("span " + man)
}
else if(man_td.getElementsByTagName("img").length==1){ // wenn img Tag, wird das alt-Atribut des ersten img-Tags ausgelesen
var man = man_td.getElementsByTagName("img")[0].getAttribute("alt");
//alert ("img " + man)
}
else{ // wenn keins von beiden, wird der Inhalt der Tabellenzelle uebernommen
var man = aux.rows[zeile+3].cells[1].innerHTML;
//alert ("normal " + man)
}

//Tackling
zwe_td = aux.getElementsByTagName("tr")[zeile+4].getElementsByTagName("td")[0];

if(zwe_td.getElementsByTagName("span").length==1) // wenn span Tag, wird der Inhalt des ersten Span-Tags ausgelesen
{
var zwe = zwe_td.getElementsByTagName("span")[0].innerHTML;
//alert ("span " + zwe)
}
else if(zwe_td.getElementsByTagName("img").length==1){ // wenn img Tag, wird das alt-Atribut des ersten img-Tags ausgelesen
var zwe = zwe_td.getElementsByTagName("img")[0].getAttribute("alt");
//alert ("img " + zwe)
}
else{ // wenn keins von beiden, wird der Inhalt der Tabellenzelle uebernommen
var zwe = aux.rows[zeile+4].cells[1].innerHTML;
//alert ("normal " + zwe)
}

//Workrate
lau_td = aux.getElementsByTagName("tr")[zeile+5].getElementsByTagName("td")[0];

if(lau_td.getElementsByTagName("span").length==1) // wenn span Tag, wird der Inhalt des ersten Span-Tags ausgelesen
{
var lau = lau_td.getElementsByTagName("span")[0].innerHTML;
//alert ("span " + lau)
}
else if(lau_td.getElementsByTagName("img").length==1){ // wenn img Tag, wird das alt-Atribut des ersten img-Tags ausgelesen
var lau = lau_td.getElementsByTagName("img")[0].getAttribute("alt");
//alert ("img " + lau)
}
else{ // wenn keins von beiden, wird der Inhalt der Tabellenzelle uebernommen
var lau = aux.rows[zeile+5].cells[1].innerHTML;
//alert ("normal " + lau)
}

//Positioning
ste_td = aux.getElementsByTagName("tr")[zeile+6].getElementsByTagName("td")[0];

if(ste_td.getElementsByTagName("span").length==1) // wenn span Tag, wird der Inhalt des ersten Span-Tags ausgelesen
{
var ste = ste_td.getElementsByTagName("span")[0].innerHTML;
//alert ("span " + ste)
}
else if(ste_td.getElementsByTagName("img").length==1){ // wenn img Tag, wird das alt-Atribut des ersten img-Tags ausgelesen
var ste = ste_td.getElementsByTagName("img")[0].getAttribute("alt");
//alert ("img " + ste)
}
else{ // wenn keins von beiden, wird der Inhalt der Tabellenzelle uebernommen
var ste = aux.rows[zeile+6].cells[1].innerHTML;
//alert ("normal " + ste)
}

//Passing
pass_td = aux.getElementsByTagName("tr")[zeile].getElementsByTagName("td")[1];

if(pass_td.getElementsByTagName("span").length==1) // wenn span Tag, wird der Inhalt des ersten Span-Tags ausgelesen
{
var pass = pass_td.getElementsByTagName("span")[0].innerHTML;
//alert ("span " + pass)
}
else if(pass_td.getElementsByTagName("img").length==1){ // wenn img Tag, wird das alt-Atribut des ersten img-Tags ausgelesen
var pass = pass_td.getElementsByTagName("img")[0].getAttribute("alt");
//alert ("img " + pass)
}
else{ // wenn keins von beiden, wird der Inhalt der Tabellenzelle uebernommen
var pass = aux.rows[zeile].cells[3].innerHTML;
//alert ("normal " + pass)
}

//Crossing
fla_td = aux.getElementsByTagName("tr")[zeile+1].getElementsByTagName("td")[1];

if(fla_td.getElementsByTagName("span").length==1) // wenn span Tag, wird der Inhalt des ersten Span-Tags ausgelesen
{
var fla = fla_td.getElementsByTagName("span")[0].innerHTML;
//alert ("span " + fla)
}
else if(fla_td.getElementsByTagName("img").length==1){ // wenn img Tag, wird das alt-Atribut des ersten img-Tags ausgelesen
var fla = fla_td.getElementsByTagName("img")[0].getAttribute("alt");
//alert ("img " + fla)
}
else{ // wenn keins von beiden, wird der Inhalt der Tabellenzelle uebernommen
var fla = aux.rows[zeile+1].cells[3].innerHTML;
//alert ("normal " + fla)
}

//Technique
tec_td = aux.getElementsByTagName("tr")[zeile+2].getElementsByTagName("td")[1];

if(tec_td.getElementsByTagName("span").length==1) // wenn span Tag, wird der Inhalt des ersten Span-Tags ausgelesen
{
var tec = tec_td.getElementsByTagName("span")[0].innerHTML;
//alert ("span " + tec)
}
else if(tec_td.getElementsByTagName("img").length==1){ // wenn img Tag, wird das alt-Atribut des ersten img-Tags ausgelesen
var tec = tec_td.getElementsByTagName("img")[0].getAttribute("alt");
//alert ("img " + tec)
}
else{ // wenn keins von beiden, wird der Inhalt der Tabellenzelle uebernommen
var tec = aux.rows[zeile+2].cells[3].innerHTML;
//alert ("normal " + tec)
}

//Heading
kop_td = aux.getElementsByTagName("tr")[zeile+3].getElementsByTagName("td")[1];

if(kop_td.getElementsByTagName("span").length==1) // wenn span Tag, wird der Inhalt des ersten Span-Tags ausgelesen
{
var kop = kop_td.getElementsByTagName("span")[0].innerHTML;
//alert ("span " + kop)
}
else if(kop_td.getElementsByTagName("img").length==1){ // wenn img Tag, wird das alt-Atribut des ersten img-Tags ausgelesen
var kop = kop_td.getElementsByTagName("img")[0].getAttribute("alt");
//alert ("img " + kop)
}
else{ // wenn keins von beiden, wird der Inhalt der Tabellenzelle uebernommen
var kop = aux.rows[zeile+3].cells[3].innerHTML;
//alert ("normal " + kop)
}

//Shooting
tor_td = aux.getElementsByTagName("tr")[zeile+4].getElementsByTagName("td")[1];

if(tor_td.getElementsByTagName("span").length==1) // wenn span Tag, wird der Inhalt des ersten Span-Tags ausgelesen
{
var tor = tor_td.getElementsByTagName("span")[0].innerHTML;
//alert ("span " + tor)
}
else if(tor_td.getElementsByTagName("img").length==1){ // wenn img Tag, wird das alt-Atribut des ersten img-Tags ausgelesen
var tor = tor_td.getElementsByTagName("img")[0].getAttribute("alt");
//alert ("img " + tor)
}
else{ // wenn keins von beiden, wird der Inhalt der Tabellenzelle uebernommen
var tor = aux.rows[zeile+4].cells[3].innerHTML;
//alert ("normal " + tor)
}

//Longshots
wei_td = aux.getElementsByTagName("tr")[zeile+5].getElementsByTagName("td")[1];

if(wei_td.getElementsByTagName("span").length==1) // wenn span Tag, wird der Inhalt des ersten Span-Tags ausgelesen
{
var wei = wei_td.getElementsByTagName("span")[0].innerHTML;
//alert ("span " + wei)
}
else if(wei_td.getElementsByTagName("img").length==1){ // wenn img Tag, wird das alt-Atribut des ersten img-Tags ausgelesen
var wei = wei_td.getElementsByTagName("img")[0].getAttribute("alt");
//alert ("img " + wei)
}
else{ // wenn keins von beiden, wird der Inhalt der Tabellenzelle uebernommen
var wei = aux.rows[zeile+5].cells[3].innerHTML;
//alert ("normal " + wei)
}

//Setpieces
sta_td = aux.getElementsByTagName("tr")[zeile+6].getElementsByTagName("td")[1];

if(sta_td.getElementsByTagName("span").length==1) // wenn span Tag, wird der Inhalt des ersten Span-Tags ausgelesen
{
var sta = sta_td.getElementsByTagName("span")[0].innerHTML;
//alert ("span " + sta)
}
else if(sta_td.getElementsByTagName("img").length==1){ // wenn img Tag, wird das alt-Atribut des ersten img-Tags ausgelesen
var sta = sta_td.getElementsByTagName("img")[0].getAttribute("alt");
//alert ("img " + sta)
}
else{ // wenn keins von beiden, wird der Inhalt der Tabellenzelle uebernommen
var sta = aux.rows[zeile+6].cells[3].innerHTML;
//alert ("normal " + sta)
}



//LP, XP, ASI und Gehalt auslesen
		
		//Playername
		var name = document.title; // holt den Titel-Tag
		name = name.substring(0,name.length-20);
		//alert(name)	

		//Country
		country = document.getElementsByTagName("img")[2].getAttribute("src");
			switch (country) {
		
				case ("/pics/flags/gradient/de.png"):
					country = "Germany";
					//alert(country)
				break;

				default:
					country = "Country not included yet";
					//alert(country)
			}
		
		verein_td = auxx.getElementsByTagName("tr")[1].getElementsByTagName("td")[0];
		var verein = verein_td.getElementsByTagName("a")[0].innerHTML;
		var clubid = verein_td.getElementsByTagName("a")[0].getAttribute("href");
		clubid = clubid.substring(6,clubid.length-1);
		//alert(verein)
		//alert(clubid)

		//Routine
		var rou = auxx.rows[zeile+skillindex_yes+7].cells[1].innerHTML;
		//alert(rou)

		//Wage
		gehalt_td = auxx.getElementsByTagName("tr")[4].getElementsByTagName("td")[0];
		var gehalt = gehalt_td.getElementsByTagName("span")[0].innerHTML;
		//alert(gehalt)		
		
		//var asi = auxx.rows[5].cells[1].innerHTML;
		//asi = asi.replace("&nbsp;", "");
		//alert(asi)
		
/*		var status = auxx.rows[6].cells[1].innerHTML;
		if (status == '<img src="/pics/mini_green_check.png"> ') {
		status = "Gesund";
		//alert(status)
		}

		//status = status.substring(0,6);
		if (status == "Gesund") {
			status = status;
			//alert(status)
		}
		else if(aux.rows[7].cells[0].getElementsByTagName("img")[0].getAttribute("title") == "Dieser Spieler ist gesperrt"){
				var status = aux.rows[7].cells[0].getElementsByTagName("span")[0].innerHTML;
				alert(status)
				status = status.replace("&nbsp;", "");
				status = status.replace("&nbsp;", "");
				alert(status)
				status = 'Sperre:' + status;
		}
		else if(aux.rows[7].cells[0].getElementsByTagName("img")[0].getAttribute("title") == "Dieser Spieler ist verletzt") {
				var status = aux.rows[7].cells[0].innerHTML;
				status = status.substring(130,status.length-69);
				status = 'Verletzung:' + status;
		}
*/		
/*		alter_td = auxx.getElementsByTagName("tr")[2].getElementsByTagName("td")[0];		
		var alter = auxx.rows[2].cells[1].innerHTML;
			alter = alter.substring(24,alter.length-70);
			alter_year = alter.substring(0,2);
			alter_month = alter.substring(3,alter.length);
			alter_month = alter_month.replace("Jahre","");
			alter_month = alter_month.replace("Monate","");
			alter_month = alter_month.replace(/ /i,"");
			alter = alter_year + "-" + alter_month;
*/			//alert(alter)


		//Position
		var pos_zweinull = document.getElementsByTagName("strong")[1].getElementsByTagName("span"); // holt alle Spanelemente
		var poslength = pos_zweinull.length;
		//alert (poslength)
		if (poslength == 2) {
			var pos = document.getElementsByTagName("strong")[1].getElementsByTagName("span")[1].innerHTML;
			//alert(pos)
		}
		else if (poslength == 3) {
			var pos1 = document.getElementsByTagName("strong")[1].getElementsByTagName("span")[1].innerHTML;
			var pos2 = document.getElementsByTagName("strong")[1].getElementsByTagName("span")[2].innerHTML;
			pos = pos1 + pos2;
			//alert(pos)
		}
		else if (poslength == 5) {
			var pos1 = document.getElementsByTagName("strong")[1].getElementsByTagName("span")[1].innerHTML;
			var pos2 = document.getElementsByTagName("strong")[1].getElementsByTagName("span")[2].innerHTML;
			var pos3 = document.getElementsByTagName("strong")[1].getElementsByTagName("span")[3].innerHTML;
			var pos4 = document.getElementsByTagName("strong")[1].getElementsByTagName("span")[4].innerHTML;
			pos = pos1 + pos2 + pos3 + pos4;
			//alert(pos)
		}

		switch (pos) {
		case "Bramkarz":	pos = "GK"; break;
		
		case "Obrońca lewy": pos = "D L"; break;
		case "Obrońca środkowy": pos = "D C"; break;
		case "Obrońca prawy": pos = "D R"; break;
		case "Obrońca środkowy/prawy": pos = "D CR"; break;
		case "Obrońca prawy/środkowy": pos = "D RC"; break;
		case "Obrońca lewy/prawy": pos = "D LR"; break;
		case "Obrońca prawy/lewy": pos = "D RL"; break;
		case "Obrońca lewy/środkowy": pos = "D LC"; break;
		case "Obrońca środkowy/lewy": pos = "D CL"; break;
		
		case "Obrońca/Defensywny pomocnik lewy": pos = "D/DM L"; break;
		case "Defensywny pomocnik/Obrońca lewy": pos = "DM/D L"; break;
		case "Obrońca/Defensywny pomocnik prawy": pos = "D/DM R"; break;
		case "Defensywny pomocnik/Obrońca prawy": pos = "DM/D R"; break;
		case "Obrońca/Defensywny pomocnik środkowy": pos = "D/DM C"; break;
		case "Defensywny pomocnik/Obrońca środkowy": pos = "DM/D C"; break;
		
		case "Obrońca/Pomocnik lewy": pos = "D/M L"; break;
		case "Pomocnik/Obrońca lewy": pos = "M/D L"; break;
		case "Obrońca/Pomocnik prawy": pos = "D/M R"; break;
		case "Pomocnik/Obrońca prawy": pos = "M/D R"; break;
		case "Obrońca/Pomocnik środkowy": pos = "D/M C"; break;
		case "Pomocnik/Obrońca środkowy": pos = "M/D C"; break;
		
		case "Obrońca/Ofensywny pomocnik lewy": pos = "D/OM L"; break;
		case "Ofensywny pomocnik/Obrońca lewy": pos = "OM/D L"; break;
		case "Obrońca/Ofensywny pomocnik prawy": pos = "D/OM R"; break;
		case "Ofensywny pomocnik/Obrońca prawy": pos = "OM/D R"; break;
		case "Obrońca/Ofensywny pomocnik środkowy": pos = "D/OM C"; break;
		case "Ofensywny pomocnik/Obrońca środkowy": pos = "OM/D C"; break;
		
		case "Obrońca lewy/Napastnik": pos = "D L, F"; break; 
        case "Obrońca środkowy/Napastnik": pos = "D C, F"; break; 
        case "Obrońca prawy/Napastnik": pos = "D R, F"; break; 
        case "Napastnik/Obrońca lewy": pos = "F, D L"; break; 
        case "Napastnik/Obrońca środkowy": pos = "F, D C"; break; 
        case "Napastnik/Obrońca prawy": pos = "F, D R"; break; 
		
		case "Defensywny pomocnik lewy": pos = "DM L"; break;
		case "Defensywny pomocnik środkowy": pos = "DM C"; break;
		case "Defensywny pomocnik prawy": pos = "DM R"; break;
		case "Defensywny pomocnik lewy/środkowy": pos = "DM LC"; break;
		case "Defensywny pomocnik środkowy/lewy": pos = "DM CL"; break;
		case "Defensywny pomocnik środkowy/prawy": pos = "DM CR"; break;
		case "Defensywny pomocnik prawy/środkowy": pos = "DM RC"; break;
		case "Defensywny pomocnik lewy/prawy": pos = "DM LR"; break;
		case "Defensywny pomocnik prawy/lewy": pos = "DM RL"; break;
		
		case "Defensywny pomocnik/Pomocnik lewy": pos = "DM/M L"; break;
		case "Pomocnik/Defensywny pomocnik lewy": pos = "M/DM L"; break;
		case "Defensywny pomocnik/Pomocnik środkowy": pos = "DM/M C"; break;
		case "Pomocnik/Defensywny pomocnik środkowy": pos = "M/DM C"; break;
		case "Defensywny pomocnik/Pomocnik prawy": pos = "DM/M R"; break;
		case "Pomocnik/Defensywny pomocnik prawy": pos = "M/DM R"; break;
		
		case "Defensywny pomocnik/Ofensywny pomocnik lewy": pos = "DM/OM L"; break;
		case "Ofensywny pomocnik/Defensywny pomocnik lewy": pos = "OM/DM L"; break;
		case "Defensywny pomocnik/Ofensywny pomocnik środkowy": pos = "DM/OM C"; break;
		case "Ofensywny pomocnik/Defensywny pomocnik środkowy": pos = "OM/DM C"; break;
		case "Defensywny pomocnik/Ofensywny pomocnik prawy": pos = "DM/OM R"; break;
		case "Ofensywny pomocnik/Defensywny pomocnik prawy": pos = "OM/DM R"; break;
		
		case "Defensywny pomocnik lewy/Napastnik": pos = "DM L, F"; break;
		case "Napastnik/Defensywny pomocnik lewy": pos = "F, DM L"; break;
		case "Defensywny pomocnik środkowy/Napastnik": pos = "DM C, F"; break;
		case "Napastnik/Defensywny pomocnik środkowy": pos = "F, DM C"; break;
		case "Defensywny pomocnik prawy/Napastnik": pos = "DM R, F"; break;
		case "Napastnik/Defensywny pomocnik prawy": pos = "F, DM R"; break;
		
		case "Pomocnik lewy": pos = "M L"; break;
		case "Pomocnik środkowy": pos = "M C"; break;
		case "Pomocnik prawy": pos = "M R"; break;
		case "Pomocnik lewy/środkowy": pos = "M LC"; break;
		case "Pomocnik środkowy/lewy": pos = "M CL"; break;
		case "Pomocnik lewy/prawy": pos = "M LR"; break;
		case "Pomocnik prawy/lewy": pos = "M RL"; break;
		case "Pomocnik środkowy/prawy": pos = "M CR"; break;
		case "Pomocnik prawy/środkowy": pos = "M RC"; break;
		
		case "Pomocnik lewy/Napastnik": pos = "M L, F"; break;
		case "Pomocnik środkowy/Napastnik": pos = "M C, F"; break;
		case "Pomocnik prawy/Napastnik": pos = "M R, F"; break;
		case "Napastnik/Pomocnik lewy": pos = "F, M L"; break;
		case "Napastnik/Pomocnik środkowy": pos = "F, M C"; break;
		case "Napastnik/Pomocnik prawy": pos = "F, M R"; break;
	
		
		case "Pomocnik/Ofensywny pomocnik lewy": pos = "M/OM L"; break;
		case "Ofensywny pomocnik/Pomocnik lewy": pos = "OM/M L"; break;
		case "Pomocnik/Ofensywny pomocnik środkowy": pos = "M/OM C"; break;
		case "Ofensywny pomocnik/Pomocnik środkowy": pos = "OM/M C"; break;
		case "Pomocnik/Ofensywny pomocnik prawy": pos = "M/OM R"; break;
		case "Ofensywny pomocnik/Pomocnik prawy": pos = "OM/M R"; break;
		
		case "Ofensywny pomocnik lewy": pos = "OM L"; break;
		case "Ofensywny pomocnik środkowy": pos = "OM C"; break;
		case "Ofensywny pomocnik prawy": pos = "OM R"; break;
		case "Ofensywny pomocnik lewy/środkowy": pos = "OM LC"; break;
		case "Ofensywny pomocnik środkowy/lewy": pos = "OM CL"; break;
		case "Ofensywny pomocnik środkowy/prawy": pos = "OM CR"; break;
		case "Ofensywny pomocnik prawy/środkowy": pos = "OM RC"; break;
		case "Ofensywny pomocnik lewy/prawy": pos = "OM LR"; break
		case "Ofensywny pomocnik prawy/lewy": pos = "OM RL"; break
		
		case "Ofensywny pomocnik lewy/Napastnik": pos = "OM L, F"; break;
		case "Napastnik/Ofensywny pomocnik lewy": pos = "F, OM L "; break;
		case "Ofensywny pomocnik środkowy/Napastnik": pos = "OM C, F"; break;
		case "Napastnik/Ofensywny pomocnik środkowy": pos = "F, OM C"; break;
		case "Ofensywny pomocnik prawy/Napastnik": pos = "OM R, F"; break;
		case "Napastnik/Ofensywny pomocnik prawy": pos = "F, OM R"; break;
		
		case "Napastnik": pos = "F"; break;
		
		default: alert("TM2.0 currently only works in English. Please contact me if you want a different language version.")
		}

		//alert ("pos: " + pos)
		stae=parseInt(stae);
		kon=parseInt(kon);
		ges=parseInt(ges);
		man=parseInt(man);
		zwe=parseInt(zwe);
		lau=parseInt(lau);
		ste=parseInt(ste);
		pass=parseInt(pass);
		fla=parseInt(fla);
		tec=parseInt(tec);
		kop=parseInt(kop);
		tor=parseInt(tor);
		wei=parseInt(wei);
		sta=parseInt(sta);
		abw=parseInt(abw);
		
		// Skillsummen berechnen je nachdem wie deinen Positionen heissen
				
	switch (pos) {

		


	default:
		var skillsumme = "Unknown Position";

}

		if(typeof skillsumme_str == 'undefined')
		{
			skillsumme=parseFloat(skillsumme.toFixed(2));
		}
		else{
			skillsumme=skillsumme_str;
		}
	
	
//	Bereich zum Kopieren der Skills

/*	var div2 = document.createElement('div');
	div2.innerHTML="<div id=\"DB\" style=\"position: fixed; background-color: white; color: gray; bottom: 2px; right: 5px; height: 35px; width: 350px; -moz-opacity: .8; text-align: left; border: 2px #333333 outset; display:inline;\">" + name + "; (" + id + "); " + pos + "; " + stae + "; " + kon + "; " + ges + "; " + man + "; " + zwe + "; " + lau + "; " + ste + "; " + pass + "; " + fla + "; " + tec + "; " + kop + "; " + tor + "; " + wei + "; " + sta + "; " + skillsumme + "; " + rou + "; " + gehalt + "; " + asi + "</div>";
	document.body.appendChild(div2);
*/
//	var area_phy = stae + kon + ges + kop;
//	var area_tac = man + zwe + lau + ste;
	if ((pos == "D/DM L") || (pos == "D/DM R")) {
		var skillworou = (skillsumme1)/(1+rou_factor*rou);
		skillworou=parseFloat(skillworou.toFixed(2));
		var effect_rou = skillsumme1-skillworou;
		effect_rou=parseFloat(effect_rou.toFixed(2));
	}
	else if ((pos == "DM/M L") || (pos == "DM/M C") || (pos == "DM/M R") || (pos == "D/DM C") || (pos == "D CR") || (pos == "D LC") || (pos == "DM LC") || (pos == "DM CR") || (pos == "M CR") || (pos == "M LC") || (pos == "M/OM C") || (pos == "M/OM L") || (pos == "M/OM R") || (pos == "OM CR") || (pos == "OM LC") || (pos == "OM C, F") || (pos == "OM L, F") || (pos == "OM R, F"))  {
		var skillworou1 = (skillsumme1)/(1+rou_factor*rou);
		var skillworou2 = (skillsumme2)/(1+rou_factor*rou);
		skillworou1 = new String(skillworou1.toFixed(2));
		skillworou2 = new String(skillworou2.toFixed(2));
		var skillworou = skillworou1 + "/" + skillworou2;
		
		var effect_rou1 = skillsumme1-skillworou1;
		var effect_rou2 = skillsumme2-skillworou2;
		effect_rou1 = new String(effect_rou1.toFixed(2));
		effect_rou2 = new String(effect_rou2.toFixed(2));
		effect_rou = effect_rou1 + "/" + effect_rou2;		
	}
	else {
		var skillworou = (skillsumme)/(1+rou_factor*rou);
		skillworou=parseFloat(skillworou.toFixed(2));
		var effect_rou = skillsumme-skillworou;
		effect_rou=parseFloat(effect_rou.toFixed(2));
	}

	switch(pos) {
		case("GK"): 
		//var area_tec = "tba";
		//var area_tac = "tba";
		//var area_phy = "tba";
		var area_tec = tec + pass + sta + abw;
		var area_phy = stae + kon + ges + tor;
		var area_tac = fla + wei + kop;
		break;
		
		default:
		var area_phy = stae + kon + ges + kop; 
		var area_tac = man + zwe + lau + ste;		
		var area_tec = pass + fla + tec + tor + wei + sta;
		
	}
	var skillsum = area_phy + area_tec + area_tac;
	
	
	if (PlayerDataPlus == "yes") {
	
		if (PlayerDataPlusPosition == "topleft")  {
	
			var div_area = document.createElement('div');
			div_area.innerHTML="<div id=\"area\" style=\"position: absolute; z-index: 1000; background: #5F8D2D; color: #ff9900; top: 333px; left: 375px; width: 177px; padding-left: 5px; -moz-opacity: .8; text-align: middle; color: gold; border: 2px #275502 outset; display:inline;\"><p style=\"text-decoration: underline;\"><b>Dane Zawodnika:<\p><table style=\"margin-top: -1em; margin-left: 1em; margin-bottom: 1em;\"><tr><td>PhySum: " + area_phy + "</td><tr><td>TacSum: " + area_tac + " </td><tr><td>TecSum: " + area_tec + " </td><tr><td>AllSum: " + skillsum + "</td></tr></table></b></div>";
			document.body.appendChild(div_area);
			
		}
		else if (PlayerDataPlusPosition == "bottomleft")  {
		
			var div_area = document.createElement('div');
			div_area.innerHTML="<div id=\"area\" style=\"position: fixed; z-index: 1000; background: #5F8D2D; color: #ff9900; bottom: 10px; left: 25px; width: 250px; padding-left: 5px; -moz-opacity: .8; text-align: middle; color: gold; border: 2px #275502 outset; display:inline;\"><p style=\"text-decoration: underline;\"><b>PlayerData+:<\p><table style=\"margin-top: -1em; margin-left: 1em; margin-bottom: 1em;\"><tr><td>PhySum: " + area_phy + "</td><td>TB-Rating: " + skillsumme + " </td></tr><tr><td>TacSum: " + area_tac + " </td><td>RouEffect: " + effect_rou + " </td></tr><tr><td>TecSum: " + area_tec + " </td><td>TB-Pure: " + skillworou + "</td></tr><tr><td>AllSum: " + skillsum + "</td></tr></table></b></div>";
			document.body.appendChild(div_area);
			
		}
		else {
		
			var div_area = document.createElement('div');
			div_area.innerHTML="<div id=\"area\" style=\"position: absolute; z-index: 1000; width: 177px; margin-top: 15px; background: #5F8D2D; color: #ff9900; padding-left: 5px; -moz-opacity: .8; text-align: middle; color: gold; border: 2px #275502 outset; display:inline;\"><p style=\"text-decoration: underline;\"><b>Dane Zawodnika:<\p><table style=\"margin-top: -1em; margin-bottom: 1em;\"><tr><td>PhySum: </td><td>" + area_phy + "</td></tr><tr><td>TacSum: </td><td>" + area_tac + " </td></tr><tr><td>TecSum: </td><td>" + area_tec + " </td></tr><tr><td>AllSum: </td><td>" + skillsum + "</td></tr><tr><td>&nbsp;</td></tr><tr><td>Rating: </td><td>" + skillsumme + " </td></tr><tr><td>RouEffect: </td><td>" + effect_rou + " </td></tr><tr><td>TB-Pure: </td><td>" + skillworou + "</td></tr></table></b></div>";
			document.getElementsByTagName("div")[18].appendChild(div_area);
		
		}
	}	
	else {
	
	}
	
	/****************************************************************************************/
	/* Inject form                                        */
	/****************************************************************************************/

/*	var TMDB = document.createElement("span"); // erzeugt ein html-span-tag
	
	var Tform="<form action='http://patrick-meurer.de/tmdb/tmdb.php' target='_self' accept-charset='UTF-8' method='post' style='display:inline;'>";	

	Tform=Tform+"<input name='id' type='hidden' value='"+id+"' />";
	Tform=Tform+"<input name='name' type='hidden' value='"+name+"' />";
	Tform=Tform+"<input name='alter' type='hidden' value='"+alter+"' />";
	Tform=Tform+"<input name='clubid' type='hidden' value='"+clubid+"' />";
//	Tform=Tform+"<input name='nplayer' type='hidden' value='"+nplayer+"' />";
	Tform=Tform+"<input name='pos' type='hidden' value='"+pos+"' />";
	Tform=Tform+"<input name='skillsumme' type='hidden' value='"+skillsumme+"' />";
	Tform=Tform+"<input name='stae' type='hidden' value='"+stae+"' />";
	Tform=Tform+"<input name='kon' type='hidden' value='"+kon+"' />";
	Tform=Tform+"<input name='ges' type='hidden' value='"+ges+"' />";
	Tform=Tform+"<input name='man' type='hidden' value='"+man+"' />";
	Tform=Tform+"<input name='zwe' type='hidden' value='"+zwe+"' />";
	Tform=Tform+"<input name='lau' type='hidden' value='"+lau+"' />";
	Tform=Tform+"<input name='ste' type='hidden' value='"+ste+"' />";
	Tform=Tform+"<input name='pass' type='hidden' value='"+pass+"' />";
	Tform=Tform+"<input name='fla' type='hidden' value='"+fla+"' />";
	Tform=Tform+"<input name='tec' type='hidden' value='"+tec+"' />";
	Tform=Tform+"<input name='kop' type='hidden' value='"+kop+"' />";
	Tform=Tform+"<input name='tor' type='hidden' value='"+tor+"' />";
	Tform=Tform+"<input name='wei' type='hidden' value='"+wei+"' />";
	Tform=Tform+"<input name='sta' type='hidden' value='"+sta+"' />";
	Tform=Tform+"<input name='rou' type='hidden' value='"+rou+"' />";
	Tform=Tform+"<input name='gehalt' type='hidden' value='"+gehalt+"' />";
	Tform=Tform+"<input name='asi' type='hidden' value='"+asi+"' />";
	Tform=Tform+"<input name='status' type='hidden' value='"+status+"' />";
	Tform=Tform+"<input type='submit' name='button' value='Absenden'></form><br />";
*/	
//	alert ("Summe: " + skillsumme)
} // if showprofile
}
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
appdiv1.innerHTML = '<div id="menu" style="position: fixed; z-index: 1000; bottom: 0px; right: 85px; height: 30px; width: 150px; -moz-opacity: .8; text-align: left; border: 2px #6C9922 outset; background: url(http://www.patrick-meurer.de/tm/TrophyBuddy_menu2.png);">&nbsp;&nbsp;<span style="position:relative; top:5px;left:0px"><a href="http://trophymanager.com/club/"><img src="http://patrick-meurer.de/tm/trophybuddy/home.png" title="' + Home + '" style="height: 20px;"></a></span>&nbsp;&nbsp;<span style="position:relative; top:5px;left:0px"><a href="http://trophymanager.com/home/box"><img src="http://patrick-meurer.de/tm/trophybuddy/mail.png" title="' + CheckYourMails + '" style="height: 20px;"></a></span>&nbsp;&nbsp;<span style="position:relative; top:5px;left:0px"><a href="http://trophymanager.com/league/"><img src="http://patrick-meurer.de/tm/trophybuddy/league.png" title="' + League + '" style="height: 20px;"></a></span>&nbsp;&nbsp;&nbsp;<span style="position:relative; top:5px;left:0px"><a href="http://trophymanager.com/league/en/5/124/#pa"><img src="http://iv.pl/images/52769207023949266399.png" title="' + Cup + '" style="height: 20px;"></a></span>&nbsp;&nbsp;&nbsp;<span style="position:relative; top:5px;left:0px"><a href="http://trophymanager.com/?logout"><img src="http://patrick-meurer.de/tm/trophybuddy/logout.png" title="' + Exit + '" style="height: 20px;"></a></span></div>';
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
	appdiv.innerHTML = '<div id="tbuddy" style="position: fixed; z-index: 1000; top: 130px; left: 20px; height: 555px; width: 124px; -moz-opacity: .8; text-align: left; border: 2px #275502 outset; display:inline;"><span style="position:relative; top:0px;left:0px"><a href="http://trophymanager.com/forum/int/announcements/"><img src="http://iv.pl/images/09647191584926189472.gif" title="' + CheckYourMailss + '" style="height: 42px;"></a></span></p></p><span><a href="http://trophymanager.com/club/" target="_self" style="font-size: margin-top: 0px; padding-left: 0px;" title="' + Team + '">' + Team + '<ul style="list-style-type:disc; margin-top: 0px; padding-left: 10px;"></a></span><li><a href="http://trophymanager.com/bids/" target="_self" style="font-size: 10px; color: gold;" title="' + GoCurrentBids + '">' + CurrentBids + '</a></li><li><a href="http://trophymanager.com/club/' + myclubid + '/squad/" target="_self" style="font-size: 10px; color: gold;" title="Squad Overview">' + Squad + '</a></li><li><a href="http://trophymanager.com/tactics/" target="_self" style="font-size: 10px; color: gold;" title="Go to Tactics">' + Tactics + '</a></li><li><a href="http://trophymanager.com/assistant-manager/" target="_self" style="font-size: 10px; color: gold;" title="Go to Assistant Manager">' + YouthAcademy + '</a></li><li><a href="http://trophymanager.com/finances/" target="_self" style="font-size: 10px; color: gold;" title="Finances">' + YouthAcademyy + '</a></li><li><a href="http://trophymanager.com/youth-development/" target="_self" style="font-size: 10px; color: gold;" title="' + GoPlayerNotes + '">' + PlayerNotes + '</a></li><li><a href="http://trophymanager.com/_test_t" target="_self" style="font-size: 10px; color: gold;" title="Fans">' + PlayerNotess + '</a></li></ul></p><a href="http://trophymanager.com/teamsters/" target="_self" style="font-size: margin-top: 0px; padding-left: 0px;" title="' + Staff + '">' + Staff+ '<ul style="list-style-type:disc; margin-top: 0px; padding-left: 10px;"><li><a href="http://trophymanager.com/scouts/hire/" target="_self" style="font-size: 10px; color: gold;" title="' + GoHireScouts + '">' + HireScouts + '</a></li><li><a href="http://trophymanager.com/scouts/" target="_self" style="font-size: 10px; color: gold;" title="' + GoScoutReports + '">' + ScoutReports + '</a></li></li></ul></p><a href="http://trophymanager.com/training-overview/simple/" target="_self" style="font-size: margin-top: 0px; padding-left: 0px;" title="' + Training + '">' + Training+ '<ul style="list-style-type:disc; margin-top: 0px; padding-left: 10px;"></a><li><a href="http://trophymanager.com/training-overview/advanced/" target="_self" style="font-size: 10px; color: gold;" title="' + GoTrainingOverview + '">' + TrainingOverview + '</a></li><li><a href="http://trophymanager.com/training/" target="_self" style="font-size: 10px; color: gold;" title="' + GoTrainingTeams + '">' + TrainingTeams + '</a></li></ul></p><a href="http://trophymanager.com/forum/int/conferences/" target="_self" style="font-size: margin-top: 0px; padding-left: 0px;" title="' + Community + '">' + Community + '<ul style="list-style-type:disc; margin-top: 0px; padding-left: 10px;"></a><li><a href="http://trophymanager.com/forum/" target="_self" style="font-size: 10px; color: gold;" title="' + GoForum + '">' + Forum + '</a> ( <a href="http://trophymanager.com/forum/int/transfer/" title="' + GoTransferForum + '">T</a> | <a href="http://trophymanager.com/forum/int/general/" title="' + GoGeneralForum + '">G</a> | <a href="http://trophymanager.com/forum/int/bugs/" title="' + GoAnnouncementForum + '">B</a> )</li><li><a href="http://trophymanager.com/forum/int/recent-posts/" target="_self" style="font-size: 10px; color: gold;" title="' + GoYourRecentPosts + '">' + YourRecentPosts + '</a></li><li><a href="http://trophymanager.com/user-guide/" target="_self" style="font-size: 10px; color: gold;" title="' + GoTMUserGuide + '">' + TMUserGuide + '</a></li><li><a href="http://trophymanager.com/forum/conference/18/" target="_self" style="font-size: 10px; color: gold;" title="' + GoTBConference + '">' + TBConference + '</a></li><p></p><p></p><p></p><span style="position:relative; top:1px;left:-10px"><a href="http://trophymanager.com/free-pro/"><img src="http://iv.pl/images/55650073709049284949.gif" title="Free Pro" style="height: 22px;"></a></span></div>';
	}
}
else {
}
}
//Transferseite




