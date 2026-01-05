// ==UserScript==
// @name        Adatbázisok
// @include     http://*.db.bme.hu/*
// @include     https://*.db.bme.hu/*
// @description blank
// @version 0.0.1.20141116141737
// @namespace https://greasyfork.org/users/6902
// @downloadURL https://update.greasyfork.org/scripts/6481/Adatb%C3%A1zisok.user.js
// @updateURL https://update.greasyfork.org/scripts/6481/Adatb%C3%A1zisok.meta.js
// ==/UserScript==

var kozmondas = [
	"A szerelem vak.",
	"Addig jár a korsó a kútra, míg el nem törik.",
	"Addig nyújtózkodj, ameddig a takaród ér.",
	"A hazug embert hamarabb utolérik, mint a sánta kutyát.",
	"Ajándék lónak ne nézd a fogát!",
	"Aki másnak vermet ás, maga esik bele.",
	"Bolond likból bolond szél fúj.",
	"Egy bolond százat csinál.",
	"Egy fecske nem csinál nyarat.",
	"Egyik kutya, másik eb.",
	"Éhes disznó makkal álmodik.",
	"Ha rövid a kardod, toldd meg egy lépéssel.",
	"Jó munkához idő kell.",
	"Jó pap holtig tanul.",
	"Jó tett helyébe jót várj.",
	"Jobb adni, mint kapni.",
	"Jobb félni, mint megijedni.",
	"Jobb ma egy veréb, mint holnap egy túzok.",
	"Jóból is megárt a sok.",
	"Ki korán kel, aranyat lel!",
	"Ki mint vet, úgy arat.",
	"Ki mint veti ágyát, úgy alussza álmát!",
	"Kicsi a bors, de erős.",
	"Kinek a pap, kinek a papné.",
	"Kutyából nem lesz szalonna.",
	"A lónak négy lába van, mégis megbotlik.",
	"Madarat tolláról, embert barátjáról.",
	"Más kárán tanul az okos.",
	"Minden kezdet nehéz.",
	"Minden jó, ha vége jó.",
	"Nagyobb a füstje, mint a lángja.",
	"Nagy az Isten állatkertje!",
	"Nem esik messze az alma a fájától.",
	"Nem mind arany, ami fénylik!",
	"Ne ítélj, hogy ne ítéltess.",
	"Okos enged, szamár szenved.",
	"Olcsó húsnak híg a leve.",
	"Ökör iszik magában.",
	"Pénz beszél, kutya ugat.",
	"Rossz fát tesz a tűzre.",
	"Segíts magadon, Isten is megsegít.",
	"Sok lúd disznót győz!",
	"Szegény embert még az ág is húzza.",
	"Szemet szemért, fogat fogért.",
	"Tanulj tinó, ökör lesz belőled.",
	"Tévedni emberi dolog.",
	"Többet ésszel, mint erővel.",
	"Türelem rózsát terem.",
	"Vak tyúk is talál szemet.",
	"Vak vezet világtalant.",
	"Vakok között félszemű a király.",
	"Van sütnivalója.",
	"Vén kecske is megnyalja a sót.",
	"Vér vízzé nem válik."
];
document.getElementById("site-slogan").innerHTML=kozmondas[Math.floor(Math.random() * kozmondas.length)];