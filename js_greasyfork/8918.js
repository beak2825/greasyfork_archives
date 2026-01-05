
// ==UserScript==
// @name			RatingR2
// @version			3.1
// @description		REREC, Season TI, TrExMa, RatingR2  JP/EN


// @include         http://trophymanager.com/*
// @include        http://test.trophymanager.com/*
// @exclude        http://trophymanager.com/banners*
// @exclude        http://trophymanager.com/showprofile.php*
// @include			http://trophymanager.com/players


// @exclude        http://trophymanager.com/userguide.php*
// @exclude        http://trophymanager.com/players/compare/*
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
// @grant          none
// @namespace https://greasyfork.org/users/7445
// @downloadURL https://update.greasyfork.org/scripts/8918/RatingR2.user.js
// @updateURL https://update.greasyfork.org/scripts/8918/RatingR2.meta.js
// ==/UserScript==


// @version        2.2.3
// ==/UserScript==

var rou_factor = 0.00405;

// Array to setup the weights of particular skills for each player's actual ability
// This is the direct weight to be given to each skill.
// Array maps to these skills:
//				 [Str,Sta,Pac,Mar,Tac,Wor,Pos,Pas,Cro,Tec,Hea,Fin,Lon,Set]
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

// RECb weights		Str				Sta				Pac				Mar				Tac				Wor				Pos				Pas				Cro				Tec				Hea				Fin				Lon				Set
var weightRb = [[	0.10425502	,	0.05270690	,	0.07922797	,	0.14414334	,	0.13098129	,	0.06565298	,	0.07882378	,	0.06521036	,	0.05126545	,	0.02835415	,	0.12157132	,	0.01441839	,	0.02511704	,	0.03827201	],	// DC
                [	0.07767492	,	0.04966621	,	0.11508794	,	0.11603888	,	0.12737854	,	0.07859142	,	0.06297206	,	0.03729396	,	0.10270623	,	0.06462210	,	0.09115882	,	0.01429908	,	0.02586988	,	0.03663996	],	// DL/R
                [	0.07912646	,	0.08218419	,	0.07575714	,	0.09742721	,	0.09084456	,	0.09443279	,	0.09429989	,	0.09328710	,	0.04984927	,	0.05680225	,	0.05138035	,	0.05365278	,	0.05834953	,	0.02260648	],	// DMC
                [	0.06758958	,	0.06252831	,	0.10438066	,	0.08487868	,	0.09431818	,	0.09638459	,	0.08355771	,	0.06151813	,	0.10338534	,	0.07812873	,	0.04710098	,	0.03948863	,	0.04897030	,	0.02777017	],	// DML/R
                [	0.07019060	,	0.08436285	,	0.07005993	,	0.08065215	,	0.07257608	,	0.09600631	,	0.09391245	,	0.09422462	,	0.04892337	,	0.07365420	,	0.04911960	,	0.06003775	,	0.07091136	,	0.03536873	],	// MC
                [	0.06310793	,	0.06494050	,	0.09778098	,	0.07503510	,	0.08624941	,	0.09774670	,	0.08613853	,	0.06440270	,	0.10709323	,	0.07282208	,	0.03287973	,	0.05451168	,	0.06406419	,	0.03322725	],	// ML/R
                [	0.07482750	,	0.08139013	,	0.08206359	,	0.07357471	,	0.05629950	,	0.07866100	,	0.08692191	,	0.10978375	,	0.03261238	,	0.08169690	,	0.06394532	,	0.07461892	,	0.07809555	,	0.02550885	],	// OMC
                [	0.06708128	,	0.05654600	,	0.10573966	,	0.07089103	,	0.07686034	,	0.08492192	,	0.08140713	,	0.06724862	,	0.11182687	,	0.07536522	,	0.03654650	,	0.06855354	,	0.07414925	,	0.02286263	],	// OML/R
                [	0.07601553	,	0.05186463	,	0.07664688	,	0.01300640	,	0.01135937	,	0.06444762	,	0.07666543	,	0.07462185	,	0.02694206	,	0.07825985	,	0.12889273	,	0.15342505	,	0.12907943	,	0.03877319	],	// F

                [	0.07477552	,	0.07477552	,	0.07477552	,	0.14955103	,	0.10468572	,	0.14955103	,	0.10468572	,	0.10280115	,	0.07533818	,	0.04419531	,	0.04486531	]];	// GK						

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
var positionFullNames = [
/* EN */	["Defender Center", "Defender Left", "Defender Right", "Defensive Midfielder Center", "Defensive Midfielder Left", "Defensive Midfielder Right", "Midfielder Center", "Midfielder Left", "Midfielder Right", "Offensive Midfielder Center", "Offensive Midfielder Left", "Offensive Midfielder Right", "Forward", "Goalkeeper"],
/* JP */	["ディフェンダー 中央", "ディフェンダー 左", "ディフェンダー 右", "守備的ミッドフィルダー 中央", "守備的ミッドフィルダー 左", "守備的ミッドフィルダー 右", "ミッドフィルダー 中央", "ミッドフィルダー 左", "ミッドフィルダー 右", "攻撃的ミッドフィルダー 中央", "攻撃的ミッドフィルダー 左", "攻撃的ミッドフィルダー 右", "フォワード", "ゴールキーパー"],
/* P  */	["Obrońca środkowy", "Obrońca lewy", "Obrońca prawy", "Defensywny pomocnik środkowy", "Defensywny pomocnik lewy", "Defensywny pomocnik prawy", "Pomocnik środkowy", "Pomocnik lewy", "Pomocnik prawy", "Ofensywny pomocnik środkowy", "Ofensywny pomocnik lewy", "Ofensywny pomocnik prawy", "Napastnik", "Bramkarz"],
/* D  */	["Forsvar Centralt", "Forsvar Venstre", "Forsvar Højre", "Defensiv Midtbane Centralt", "Defensiv Midtbane Venstre", "Defensiv Midtbane Højre", "Midtbane Centralt", "Midtbane Venstre", "Midtbane Højre", "Offensiv Midtbane Centralt", "Offensiv Midtbane Venstre", "Offensiv Midtbane Højre", "Angriber", "Målmand"],
/* I  */	["Difensore Centrale", "Difensore Sinistro", "Difensore Destro", "Centrocampista Difensivo Centrale", "Centrocampista Difensivo Sinistro", "Centrocampista Difensivo Destro", "Centrocampista Centrale", "Centrocampista Sinistro", "Centrocampista Destro", "Centrocampista Offensivo Centrale", "Centrocampista Offensivo Sinistro", "Centrocampista Offensivo Destro", "Attaccante", "Portiere"],
/* H  */	["Defensa Central", "Defensa Izquierdo", "Defensa Derecho", "Mediocampista Defensivo Central", "Mediocampista Defensivo Izquierdo", "Mediocampista Defensivo Derecho", "Mediocampista Central", "Mediocampista Izquierdo", "Mediocampista Derecho", "Mediocampista Ofensivo Central", "Mediocampista Ofensivo Izquierdo", "Mediocampista Ofensivo Derecho", "Delantero", "Portero"],
/* F  */	["Défenseur Central", "Défenseur Gauche", "Défenseur Droit", "Milieu défensif Central", "Milieu défensif Gauche", "Milieu défensif Droit", "Milieu Central", "Milieu Gauche", "Milieu Droit", "Milieu offensif Central", "Milieu offensif Gauche", "Milieu offensif Droit", "Attaquant", "Gardien de but"],
/* A  */	["Defender Center", "Defender Left", "Defender Right", "Defensive Midfielder Center", "Defensive Midfielder Left", "Defensive Midfielder Right", "Midfielder Center", "Midfielder Left", "Midfielder Right", "Offensive Midfielder Center", "Offensive Midfielder Left", "Offensive Midfielder Right", "Forward", "Goalkeeper"],
/* C  */	["Obrambeni Sredina", "Obrambeni Lijevo", "Obrambeni Desno", "Defenzivni vezni Sredina", "Defenzivni vezni Lijevo", "Defenzivni vezni Desno", "Vezni Sredina", "Vezni Lijevo", "Vezni Desno", "Ofenzivni vezni Sredina", "Ofenzivni vezni Lijevo", "Ofenzivni vezni Desno", "Napadač", "Golman"],
/* G  */	["Verteidiger Zentral", "Verteidiger Links", "Verteidiger Rechts", "Defensiver Mittelfeldspieler Zentral", "Defensiver Mittelfeldspieler Links", "Defensiver Mittelfeldspieler Rechts", "Mittelfeldspieler Zentral", "Mittelfeldspieler Links", "Mittelfeldspieler Rechts", "Offensiver Mittelfeldspieler Zentral", "Offensiver Mittelfeldspieler Links", "Offensiver Mittelfeldspieler Rechts", "Stürmer", "Torhüter"],
/* PO */	["Defesa Centro", "Defesa Esquerdo", "Defesa Direito", "Médio Defensivo Centro", "Médio Defensivo Esquerdo", "Médio Defensivo Direito", "Medio Centro", "Medio Esquerdo", "Medio Direito", "Medio Ofensivo Centro", "Medio Ofensivo Esquerdo", "Medio Ofensivo Direito", "Avançado", "Guarda-Redes"],
/* R  */	["Fundas Central", "Fundas Stânga", "Fundas Dreapta", "Mijlocas Defensiv Central", "Mijlocas Defensiv Stânga", "Mijlocas Defensiv Dreapta", "Mijlocas Central", "Mijlocas Stânga", "Mijlocas Dreapta", "Mijlocas Ofensiv Central", "Mijlocas Ofensiv Stânga", "Mijlocas Ofensiv Dreapta", "Atacant", "Portar"],
/* T  */	["Defans Orta", "Defans Sol", "Defans Sağ", "Defansif Ortasaha Orta", "Defansif Ortasaha Sol", "Defansif Ortasaha Sağ", "Ortasaha Orta", "Ortasaha Sol", "Ortasaha Sağ", "Ofansif Ortasaha Orta", "Ofansif Ortasaha Sol", "Ofansif Ortasaha Sağ", "Forvet", "Kaleci"],
/* RU */	["Defender Center", "Defender Left", "Defender Right", "Defensive Midfielder Center", "Defensive Midfielder Left", "Defensive Midfielder Right", "Midfielder Center", "Midfielder Left", "Midfielder Right", "Offensive Midfielder Center", "Offensive Midfielder Left", "Offensive Midfielder Right", "Forward", "Goalkeeper"],
/* CE */	["Obránce Střední", "Obránce Levý", "Obránce Pravý", "Defenzivní Záložník Střední", "Defenzivní Záložník Levý", "Defenzivní Záložník Pravý", "Záložník Střední", "Záložník Levý", "Záložník Pravý", "Ofenzivní záložník Střední", "Ofenzivní záložník Levý", "Ofenzivní záložník Pravý", "Útočník", "Gólman"],
/* HU */	["Védő , középső", "Védő , bal oldali", "Védő , jobb oldali", "Védekező Középpályás , középső", "Védekező Középpályás , bal oldali", "Védekező Középpályás , jobb oldali", "Középpályás , középső", "Középpályás , bal oldali", "Középpályás , jobb oldali", "Támadó középpályás , középső", "Támadó középpályás , bal oldali", "Támadó középpályás , jobb oldali", "Csatár", "Kapus"],
/* GE */	["მცველი ცენტრალური", "მცველი მარცხენა", "მცველი მარჯვენა", "საყრდენი ნახევარმცველი ცენტრალური", "საყრდენი ნახევარმცველი მარცხენა", "საყრდენი ნახევარმცველი მარჯვენა", "ნახევარმცველი ცენტრალური", "ნახევარმცველი მარცხენა", "ნახევარმცველი მარჯვენა", "შემტევი ნახევარმცველი ცენტრალური", "შემტევი ნახევარმცველი მარცხენა", "შემტევი ნახევარმცველი მარჯვენა", "თავდამსხმელი", "მეკარე"],
/* FI */	["Puolustaja Keski", "Puolustaja Vasen", "Puolustaja Oikea", "Puolustava Keskikenttä Keski", "Puolustava Keskikenttä Vasen", "Puolustava Keskikenttä Oikea", "Keskikenttä Keski", "Keskikenttä Vasen", "Keskikenttä Oikea", "Hyökkäävä Keskikenttä Keski", "Hyökkäävä Keskikenttä Vasen", "Hyökkäävä Keskikenttä Oikea", "Hyökkääjä", "Maalivahti"],
/* SV */	["Försvarare Central", "Försvarare Vänster", "Försvarare Höger", "Defensiv Mittfältare Central", "Defensiv Mittfältare Vänster", "Defensiv Mittfältare Höger", "Mittfältare Central", "Mittfältare Vänster", "Mittfältare Höger", "Offensiv Mittfältare Central", "Offensiv Mittfältare Vänster", "Offensiv Mittfältare Höger", "Anfallare", "Målvakt"],
/* NO */	["Forsvar Sentralt", "Forsvar Venstre", "Forsvar Høyre", "Defensiv Midtbane Sentralt", "Defensiv Midtbane Venstre", "Defensiv Midtbane Høyre", "Midtbane Sentralt", "Midtbane Venstre", "Midtbane Høyre", "Offensiv Midtbane Sentralt", "Offensiv Midtbane Venstre", "Offensiv Midtbane Høyre", "Angrep", "Keeper"],
/* SC */	["Defender Centre", "Defender Left", "Defender Richt", "Defensive Midfielder Centre", "Defensive Midfielder Left", "Defensive Midfielder Richt", "Midfielder Centre", "Midfielder Left", "Midfielder Richt", "Offensive Midfielder Centre", "Offensive Midfielder Left", "Offensive Midfielder Richt", "Forward", "Goalkeeper"],
/* VL */	["Verdediger Centraal", "Verdediger Links", "Verdediger Rechts", "Verdedigende Middenvelder Centraal", "Verdedigende Middenvelder Links", "Verdedigende Middenvelder Rechts", "Middenvelder Centraal", "Middenvelder Links", "Middenvelder Rechts", "Aanvallende Middenvelder Centraal", "Aanvallende Middenvelder Links", "Aanvallende Middenvelder Rechts", "Aanvaller", "Doelman"],
/* BR */	["Zagueiro Central", "Zagueiro Esquerdo", "Zagueiro Direito", "Volante Central", "Volante Esquerdo", "Volante Direito", "Meio-Campista Central", "Meio-Campista Esquerdo", "Meio-Campista Direito", "Meia Ofensivo Central", "Meia Ofensivo Esquerdo", "Meia Ofensivo Direito", "Atacante", "Goleiro"]]

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
		for (var i=0; i< positionFullNames.length; i++) {
			for (var j=0; j< positionFullNames[i].length; j++) {
				if (position.indexOf(positionFullNames[i][j]) == 0) return j;
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
	
	function funFix3 (i) {
		i = (Math.round(i*1000)/1000).toFixed(3);
		return i;
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
	var REREC2 = [];
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
	var SI = new String(gettr[6].getElementsByTagName("td")[0].innerHTML).replace(/,/g, "");
	var rou = gettr[8].getElementsByTagName("td")[0].innerHTML;
	rou = Math.pow(5/3, Math.LOG2E * Math.log(rou * 10)) * 0.4;
	for (var i = 0; i < positionArray.length; i++){
			var positionIndex = document.findPositionIndex(positionArray[i]);
			FP[i] = positionIndex;
			FP[i+1] = FP[i];
			if (positionIndex > -1) {
				SKs[i] = document.calculateSkill(positionIndex, skills);
				REREC2[i] = document.calculateREREC2(positionIndex, skills, SI);
			}
			if (i == 0) REREC = document.calculateREREC(positionIndex, skills, SI, rou);
	}
	
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
	var recbth = document.createElement("div");
	var recbtd = document.createElement("div");
	var ratth = document.createElement("div");
	var rattd = document.createElement("div");
	rectd.setAttribute("style", "color: gold;");
	recbtd.setAttribute("style", "color: white;");
	rattd.setAttribute("style", "color: white;");
	
	var FP2 = [FP[0], FP[1]];
	for (i = 0; i < FP.length; i++) {
		for (j = 0; 2+j <= FP[i]; j += 2) FP[i]--;
	}
	if (FP[0] != FP[1]) {
		rectd.innerHTML = REREC[0][FP[0]] + "/" + REREC[0][FP[1]];
		recbtd.innerHTML = funFix3(REREC2[0]) + "/" + funFix3(REREC2[1]);
		rattd.innerHTML = REREC[2][FP[0]] + "/" + REREC[2][FP[1]];
		var ratingR2 = rattd.innerHTML;
		var rouEffect = funFix(REREC[2][FP[0]]*1 - REREC[1][FP[0]]*1) + "/" + funFix(REREC[2][FP[1]]*1 - REREC[1][FP[1]]*1);
		var R2Pure = REREC[1][FP[0]] + "/" + REREC[1][FP[1]];
	}
	else {
		rectd.innerHTML = REREC[0][FP[0]];
		recbtd.innerHTML = funFix3(REREC2[0]);
		rattd.innerHTML = REREC[2][FP[0]];
		var ratingR2 = rattd.innerHTML;
		var rouEffect = funFix(REREC[2][FP[0]]*1 - REREC[1][FP[0]]*1);
		var R2Pure = REREC[1][FP[0]];
	}
	recbth.innerHTML = "<style=\"color: white;\">Rekomendacja";
	ratth.innerHTML = "<style=\"color: white;\">Ocena Pozycji";
	gettr[5].getElementsByTagName("th")[0].appendChild(recbth);
	gettr[5].getElementsByTagName("td")[0].appendChild(recbtd);
	gettr[8].getElementsByTagName("th")[0].appendChild(ratth);
	gettr[8].getElementsByTagName("td")[0].appendChild(rattd);
	
	var playerID = location.pathname.match(/\d+/g);
	seasonTI(playerID[0], gettr, SI);
	
	if (document.getElementsByClassName("gk")[0] == null) var peak = [4,4,6];
	else var peak = [4,3,4];
	var div_area = document.createElement('div');
	div_area.innerHTML="<div style=\"position: absolute; z-index: 1000; width: 175px; margin-top: 20px; background: #5F8D2D; padding-left: 5px; color: gold; border: 2px #333333 outset; display:inline;\"><p style=\"text-decoration: underline;\"><b>Dane Zawodnika:<\p><table style=\"margin-top: -1em; margin-bottom: 1em;\"><tr><td>PhySum: </td><td>" + phySum + " (" + Math.round(phySum/peak[0]*5) + "%)</td></tr><tr><td>TacSum: </td><td>" + tacSum + " (" + Math.round(tacSum/peak[1]*5) + "%)</td></tr><tr><td>TecSum: </td><td>" + tecSum + " (" + Math.round(tecSum/peak[2]*5) + "%)</td></tr><tr><td>AllSum: </td><td>" + allSum + " + " + remainder + " </td></tr><tr><td>&nbsp;</td></tr><tr><td>RatingR2: </td><td>" + ratingR2 + " </td></tr><tr><td>RouEffect: </td><td>" + rouEffect + " </td></tr><tr><td>Rating-Pure: </td><td>" + R2Pure + "</td></tr></table></b></div>";
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
	
	document.calculateREREC = function (positionIndex, skills, SI, rou){
		var rec = [];			// REREC
		var ratingR = [];		// RatingR2
		var ratingR2 = [];		// RatingR2 + routine
		var skillSum = 0;
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
	
	document.calculateREREC2 = function (positionIndex, skills, SI){
		if (positionIndex == 13) var weight = 48717927500;
		else var weight = 263533760000;
		var skillSum = 0;
		for (var j = 0; j < skills.length; j++) {
			skillSum += parseInt(skills[j]);
		}
		var remainder = Math.round((Math.pow(2,Math.log(weight*SI)/Math.log(Math.pow(2,7))) - skillSum)*10)/10;		// 正確な余り
		var recb = 0;
		var weightSumb = 0;
		var not20 = 0;
		
		for (i = 0; 2+i <= positionIndex; i += 2) {		// TrExMaとRECのweight表のずれ修正
			positionIndex--;
		}
		for (var i = 0; i < weightR[positionIndex].length; i++) {
			recb += skills[i] * weightRb[positionIndex][i];
			if (skills[i] != 20) {
				weightSumb += weightRb[positionIndex][i];
				not20++;
			}
		}
		if (not20 == 0) recb = 6;		// All MAX
		else recb = (recb + remainder * weightSumb / not20 - 2) / 3;
		
		return recb;
	};
	
	function seasonTI (playerID, gettr, SI) {
		var sith = document.createElement("div");
		var sitd = document.createElement("div");
		var sitd2 = document.createElement("div");
		var wage = new String(gettr[4].getElementsByTagName("span")[0].innerHTML).replace(/,/g, "");
		var today = new Date();
		var s41 = new Date("03 23 2015 10:30:00 GMT");				// season start
		var s41t = new Date("03 24 2015 00:30:00 GMT");				// first training
		var day = (today.getTime()-s41t.getTime())/1000/3600/24;
		while (day > 84-16/24) day -= 84;
		var session = Math.floor(day/7)+1;							// training sessions
		var ageMax = 20.1 + session / 12;							// max new player age
		
		var age = gettr[2].getElementsByTagName("td")[0].innerHTML;
		var yearidx = age.search(/\d\d/);
		var year = age.substr(yearidx,2);
		age = age.slice(yearidx+2);
		var month = age.replace(/\D+/g,"");
		age = year*1 + month/12;
		var check = today.getTime()-s41.getTime();
		var season = 84*24*3600*1000;
		var count = 0;
		
		while (check > season) {
			check -= season;
			count++;
		}
		
		if (document.getElementsByClassName("gk")[0] == null) var weight = 263533760000;
		else var weight = 48717927500;
		
		if (wage == 30000 || (age > 25.99 + session/12 && wage / SI < 23.4) || (playerID > 106267903 && count == 0)) {	// s41 player ID
			sitd.innerHTML = "---";
		}
		else {
			var TI1 = Math.pow(2,Math.log(weight*SI)/Math.log(Math.pow(2,7))) - Math.pow(2,Math.log(weight*wage/27.55)/Math.log(Math.pow(2,7)));
			TI1 = Math.round(TI1*10);
			if (session > 0) sitd.innerHTML = TI1 + " (" + funFix2(TI1/session) + " x " + session + ")";
			else sitd.innerHTML = TI1;
		}
		sith.innerHTML = "Season TI";
		gettr[6].getElementsByTagName("th")[0].appendChild(sith);
		gettr[6].getElementsByTagName("td")[0].appendChild(sitd);
		
		if (wage > 30000 && playerID > 105990513 && age < ageMax) {	// s41 player ID
			var TI2 = Math.pow(2,Math.log(weight*SI)/Math.log(Math.pow(2,7))) - Math.pow(2,Math.log(weight*wage/23.75)/Math.log(Math.pow(2,7)));
			TI2 = Math.round(TI2*10);
			if (month == 1) session = 0;
			if (month > 1 && session + 1 > month) session = month - 1;
			if (session > 0) sitd2.innerHTML = TI2 + " (" + funFix2(TI2/session) + " x " + session + ")";
			else sitd2.innerHTML = TI2;
			sith = document.createElement("div");
			sith.setAttribute("style", "white-space: nowrap;"); 
			sith.innerHTML = "<b>New player TI</b>";
			gettr[6].getElementsByTagName("th")[0].appendChild(sith);
			gettr[6].getElementsByTagName("td")[0].appendChild(sitd2);
		}
	}
	
	(function() {
		var playerTable = document.getElementsByClassName("skill_table zebra")[0];
		var skillArray = document.getSkills(playerTable);
		computeSK(playerTable, skillArray);
	})();
}
