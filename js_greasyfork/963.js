// ==UserScript==
// @name        Howrse_Swap_Select_v4_v3_Default_Coats
// @namespace   myHowrse
// @description Swaps the user's selected choice(s) of the v4 default coats for the v3 default coats
// @include     http://*.howrse.com/elevage/fiche/*
// @include     http://*.howrse.com/elevage/chevaux/cheval*
// @include     http://*.howrse.com/elevage/chevaux/?elevage=*
// @include     http://*.howrse.com/elevage/chevaux/rechercher*
// @include     http://*.howrse.com/dossiers/race?id=*
// @include     http://*.howrse.com/elevage/bureau/?type=havre
// @include     http://*.howrse.com/elevage/bureau/?type=pardis
// @include     http://*.howrse.com/centre/fiche?id=*
// @include     http://*.howrse.com/joueur/fiche/?id=*
// @include     http://*.howrse.com/marche/vente/*
// @author      daexion
// @version     2
// @downloadURL https://update.greasyfork.org/scripts/963/Howrse_Swap_Select_v4_v3_Default_Coats.user.js
// @updateURL https://update.greasyfork.org/scripts/963/Howrse_Swap_Select_v4_v3_Default_Coats.meta.js
// ==/UserScript==
//	Breed coat archtypes
akhalTeke = 1;	//	Akhal-Teke
americain = 1;	//	Appaloosa, Argentinean Criollo, Paint Horse, Quarter Horse
arabe = 1;	//	Arabian Horse, Shagya Arabian
curly = 1;	//	Curly
fjord = 1;	//	Fjord
frison = 1;	//	Friesian
highlandPony = 1;	//	Highland Pony
iberique = 1;	//	Barb, Canadian horse, Lusitano, Peruvian Paso, Purebred Spanish Horse
knabstrup = 1;	//	Knabstrupper
marwari = 1;	//	Marwari
mustang = 1;	//	Mustang
nokota = 1;	//	Nokota
poneyLeger = 1;	//	Connemara
poneyLourd = 1;	//	Chincoteague Pony
poneyPrimitif = 1;	//	Newfoundland Pony
poneySport = 1;	//	Australian Pony, Welsh
primitif = 1;	//	Brumby, Icelandic horse
shetland = 1;	//	Shetland
sportLeger = 1;	//	Quarter Pony, Trakehner
sportMassif = 1;	//	Hanoverian, Holsteiner, Irish Hunter, KWPN, Russian Don Horse
thoroughbred = 1;	//	Thoroughbred
tinker = 1;	//	Gypsy Vanner
trotteur = 1;	//	Hackney, Morgan, Standardbred
tenWalker = 1;	//	Tennessee Walker

if(document.URL.indexOf("/?elevage=") > 0 || document.URL.indexOf("/centre/fiche?id=") > 0 || document.URL.indexOf("joueur/fiche/?id=") > 0)
{
	setTimeout(changeBreedingFarmIcons,2000);
	setInterval(changeBreedingFarmIcons,5000);
}
else if(document.URL.indexOf("/rechercher") > 0 || document.URL.indexOf("bureau/?type") >0 || document.URL.indexOf("/affixe?id") > 0 || document.URL.indexOf("/race?id") > 0 || document.URL.indexOf("/marche/vente") > 0)
{
	changeBreedingFarmIcons();
}
else
{
//	find the game id of the horse
	if(document.URL.indexOf("&") < 0)
		if(document.URL.indexOf("#") < 0) chevalId = document.URL.substring(document.URL.indexOf("=")+1,document.URL.length);
		else chevalId = document.URL.substring(document.URL.indexOf("=")+1,document.URL.indexOf("#"));
	else
	{
		scipts = document.getElementsByTagName("script");
		i=0;
		while(scipts[i].text.indexOf("chevalId") < 0 && i < scipts.length) ++i;
		horseVars = scipts[i].text;
		firstEqual = horseVars.indexOf("=");
		firstSemi = horseVars.indexOf(";");
		chevalId = horseVars.substring(firstEqual+2,firstSemi);
	}
	GM_log(chevalId);
	howrseImg = document.getElementById("cheval-robe-"+chevalId);
//	find if the horse is a default coat or not.  Horse's with a GA (or a non-updated default coat) will have an IMG tag and use a src attribute, horse's with a default coat will use a DIV tag and a style attribute.  Since we only care about the default updated coat here, we can ignore the coat for any horse using an IMG tag for the coat.
	if(howrseImg.hasAttribute("style"))
	{
		tmpStyle = howrseImg.getAttribute("style");
		
		if(tmpStyle.indexOf("akhal-teke") > 0 && akhalTeke == 1)
		{
			subDir = "akhal-teke";
			swap = 1;
		}
		else if(tmpStyle.indexOf("americain") > 0 && americain == 1)
		{
			subDir = "americain";
			swap = 1;
		}
		else if(tmpStyle.indexOf("arabe") > 0 && arabe == 1)
		{
			subDir = "arabe";
			swap = 1;
		}
		else if(tmpStyle.indexOf("curly") > 0 && curly == 1)
		{
			subDir = "curly";
			swap = 1;
		}
		else if(tmpStyle.indexOf("fjord") > 0 && fjord == 1)
		{
			subDir = "fjord";
			swap = 1;
		}
		else if(tmpStyle.indexOf("frison") > 0 && frison == 1)
		{
			subDir = "frison";
			swap = 1;
		}
		else if(tmpStyle.indexOf("highland-pony") > 0 && highlandPony == 1)
		{
			subDir = "highland-pony";
			swap = 1;
		}
		else if(tmpStyle.indexOf("iberique") > 0 && iberique == 1)
		{
			subDir = "iberique";
			swap = 1;
		}
		else if(tmpStyle.indexOf("knabstrup") > 0 && knabstrup == 1)
		{
			subDir = "knabstrup";
			swap = 1;
		}
		else if(tmpStyle.indexOf("marwari") > 0 && marwari == 1)
		{
			subDir = "marwari";
			swap = 1;
		}
		else if(tmpStyle.indexOf("mustang") > 0 && mustang == 1)
		{
			subDir = "mustang";
			swap = 1;
		}
		else if(tmpStyle.indexOf("nokota") > 0 && nokota == 1)
		{
			subDir = "nokota";
			swap = 1;
		}
		else if(tmpStyle.indexOf("poney-leger") > 0 && poneyLeger == 1)
		{
			subDir = "poney-leger";
			swap = 1;
		}
		else if(tmpStyle.indexOf("poney-lourd") > 0 && poneyLourd == 1)
		{
			subDir = "poney-lourd";
			swap = 1;
		}
		else if(tmpStyle.indexOf("poney-primitif") > 0 && poneyPrimitif == 1)
		{
			subDir = "poney-primitif";
			swap = 1;
		}
		else if(tmpStyle.indexOf("poney-sport") > 0 && poneySport == 1)
		{
			subDir = "poney-sport";
			swap = 1;
		}
		else if(tmpStyle.indexOf("primitif") > 0 && primitif == 1)
		{
			subDir = "primitif";
			swap = 1;
		}
		else if(tmpStyle.indexOf("shetland") > 0 && shetland == 1)
		{
			subDir = "shetland";
			swap = 1;
		}
		else if(tmpStyle.indexOf("sport-leger") > 0 && sportLeger == 1)
		{
			subDir = "sport-leger";
			swap = 1;
		}
		else if(tmpStyle.indexOf("sport-massif") > 0 && sportMassif == 1)
		{
			subDir = "sport-massif";
			swap = 1;
		}
		else if(tmpStyle.indexOf("thoroughbred") > 0 && thoroughbred == 1)
		{
			subDir = "thoroughbred";
			swap = 1;
		}
		else if(tmpStyle.indexOf("tinker") > 0 && tinker == 1)
		{
			subDir = "tinker";
			swap = 1;
		}
		else if(tmpStyle.indexOf("trotteur") > 0 && trotteur == 1)
		{
			subDir = "trotteur";
			swap = 1;
		}
		else if(tmpStyle.indexOf("tennesee-walker") > 0 && tenWalker == 1)
		{
			subDir = "trotteur";
			swap = 1;
		}
		else swap = 0;
		
		if(tmpStyle.indexOf("poulain") > 0 && document.URL.indexOf("/cheval?id=") > 0) changeMareIcons();
//	This will allow the script to not attempt to change the coat file for any foal of a breed that uses generic coats for foals.
//	Without this, you end up with an invisible horse.  Opps.
		if(tmpStyle.indexOf("/generique") < 0 && swap == 1)
		{
			howrseImg.setAttribute("Id","cheval-robe-");
			howrseImg.setAttribute("style","");
			newImg = document.createElement("img");
//	Until Owlient decides to delete the old coats, we can continue to use their copy of the old coat here.

			if(tmpStyle.indexOf("adulte") < 0) subDir = subDir + "-small/";
			else subDir = subDir + "/";
			
			if(document.body.textContent.indexOf("Species: Unicorn") > 0)
				subDir = "http://www.howrse.com/media/equideo/image/chevaux/licornes/" + subDir;
			else if(document.body.textContent.indexOf("Species: Winged unicorn") > 0)
				subDir = "http://www.howrse.com/media/equideo/image/chevaux/licornes-ailees/" + subDir;
			else if(document.body.textContent.indexOf("Species: Pegasus") > 0)
				subDir = "http://www.howrse.com/media/equideo/image/chevaux/pegase/" + subDir;
			else subDir = "http://www.howrse.com/media/equideo/image/chevaux/normaux/" + subDir;
			
			if(document.body.textContent.indexOf("Coat: Ulsblakk") > 0)
				newSrc = subDir + "ubk-grand.png";
			else if(document.body.textContent.indexOf("Coat: Strawberry roan") > 0)
				newSrc = subDir + "aub-grand.png";
			else if(document.body.textContent.indexOf("Coat: Rodblakk") > 0)
				newSrc = subDir + "rbk-grand.png";
			else if(document.body.textContent.indexOf("Coat: Roan") > 0)
				newSrc = subDir + "rn-grand.png";
			else if(document.body.textContent.indexOf("Coat: Palomino Tovero") > 0)
				newSrc = subDir + "pie-tv-plm-grand.png";
			else if(document.body.textContent.indexOf("Coat: Palomino Tobiano") > 0)
				newSrc = subDir + "pie-tb-plm-grand.png";
			else if(document.body.textContent.indexOf("Coat: Palomino Spotted Blanket ") > 0)
				newSrc = subDir + "spt-plm-grand.png";
			else if(document.body.textContent.indexOf("Coat: Palomino Overo") > 0)
				newSrc = subDir + "pie-tv-plm-grand.png";
			else if(document.body.textContent.indexOf("Coat: Palomino Blanket ") > 0)
				newSrc = subDir + "bkt-plm-grand.png";
			else if(document.body.textContent.indexOf("Coat: Palomino") > 0)
				newSrc = subDir + "plm-grand.png";
			else if(document.body.textContent.indexOf("Coat: Mouse gray Tobiano") > 0)
				newSrc = subDir + "pie-tb-gr-s-grand.png";
			else if(document.body.textContent.indexOf("Coat: Mouse Gray") > 0)
				newSrc = subDir + "gr-s-grand.png";
			else if(document.body.textContent.indexOf("Coat: Liver chestnut Tovero") > 0)
				newSrc = subDir + "pie-tv-alz-b-grand.png";
			else if(document.body.textContent.indexOf("Coat: Liver chestnut Tobiano") > 0)
				newSrc = subDir + "pie-tb-alz-b-grand.png";
			else if(document.body.textContent.indexOf("Coat: Liver chestnut Spotted Blanket") > 0)
				newSrc = subDir + "spt-alz-b-grand.png";
			else if(document.body.textContent.indexOf("Coat: Liver chestnut Overo") > 0)
				newSrc = subDir + "pie-ov-alz-b-grand.png";
			else if(document.body.textContent.indexOf("Coat: Liver chestnut Blanket") > 0)
				newSrc = subDir + "bkt-alz-b-grand.png";
			else if(document.body.textContent.indexOf("Coat: Liver chestnut") > 0)
				newSrc = subDir + "alz-b-grand.png";
			else if(document.body.textContent.indexOf("Coat: Light Gray") > 0)
				newSrc = subDir + "gr-c-grand.png";
			else if(document.body.textContent.indexOf("Coat: Gulblakk") > 0)
				newSrc = subDir + "gbk-grand.png";
			else if(document.body.textContent.indexOf("Coat: Gra") > 0)
				newSrc = subDir + "gra-grand.png";
			else if(document.body.textContent.indexOf("Coat: Fleabitten Gray") > 0)
				newSrc = subDir + "gr-t-grand.png";
			else if(document.body.textContent.indexOf("Coat: Flaxen Liver chestnut") > 0)
				newSrc = subDir + "alz-b-cl-grand.png";
			else if(document.body.textContent.indexOf("Coat: Flaxen Chestnut") > 0)
				newSrc = subDir + "alz-cl-grand.png";
			else if(document.body.textContent.indexOf("Coat: Few Spots") > 0)
				newSrc = subDir + "fs-nr-grand.png";
			else if(document.body.textContent.indexOf("Coat: Dun Tobiano") > 0)
				newSrc = subDir + "pie-tb-sbl-grand.png";
			else if(document.body.textContent.indexOf("Coat: Dun Spotted Blanket") > 0)
				newSrc = subDir + "spt-sbl-grand.png";
			else if(document.body.textContent.indexOf("Coat: Dun Overo") > 0)
				newSrc = subDir + "pie-ov-sb-grand.png";
			else if(document.body.textContent.indexOf("Coat: Dun Blanket ") > 0)
				newSrc = subDir + "bkt-sbl-grand.png";
			else if(document.body.textContent.indexOf("Coat: Dun Blanket") > 0)
				newSrc = subDir + "bkt-sbl-grand.png";
			else if(document.body.textContent.indexOf("Coat: Dun") > 0)
				newSrc = subDir + "sbl-grand.png";
			else if(document.body.textContent.indexOf("Coat: Dark bay Tovero") > 0)
				newSrc = subDir + "pie-tv-bai-b-grand.png";
			else if(document.body.textContent.indexOf("Coat: Dark bay Tobiano") > 0)
				newSrc = subDir + "pie-tb-bai-b-grand.png";
			else if(document.body.textContent.indexOf("Coat: Dark bay Overo") > 0)
				newSrc = subDir + "pie-ov-bai-b-grand.png";
			else if(document.body.textContent.indexOf("Coat: Dark Bay") > 0)
				newSrc = subDir + "bai-b-grand.png";
			else if(document.body.textContent.indexOf("Coat: Dapple gray Tobiano") > 0)
				newSrc = subDir + "pie-tb-gr-pml-grand.png";
			else if(document.body.textContent.indexOf("Coat: Dapple Gray") > 0)
				newSrc = subDir + "gr-pml-grand.png";
			else if(document.body.textContent.indexOf("Coat: Cremello Tobiano") > 0)
				newSrc = subDir + "pie-tb-cml-grand.png";
			else if(document.body.textContent.indexOf("Coat: Cremello") > 0)
				newSrc = subDir + "cml-grand.png";
			else if(document.body.textContent.indexOf("Coat: Chestnut Tovero") > 0)
				newSrc = subDir + "pie-tv-alz-grand.png";
			else if(document.body.textContent.indexOf("Coat: Chestnut Tobiano") > 0)
				newSrc = subDir + "pie-tb-alz-grand.png";
			else if(document.body.textContent.indexOf("Coat: Chestnut Spotted Blanket") > 0)
				newSrc = subDir + "spt-alz-grand.png";
			else if(document.body.textContent.indexOf("Coat: Chestnut Snowflake ") > 0)
				newSrc = subDir + "sfk-alz-grand.png";
			else if(document.body.textContent.indexOf("Coat: Chestnut Snowflake") > 0)
				newSrc = subDir + "sfk-alz-grand.png";
			else if(document.body.textContent.indexOf("Coat: Chestnut Overo") > 0)
				newSrc = subDir + "pie-ov-alz-grand.png";
			else if(document.body.textContent.indexOf("Coat: Chestnut Leopard ") > 0)
				newSrc = subDir + "leo-alz-grand.png";
			else if(document.body.textContent.indexOf("Coat: Chestnut Leopard") > 0)
				newSrc = subDir + "leo-alz-grand.png";
			else if(document.body.textContent.indexOf("Coat: Chestnut Few Spots") > 0)
				newSrc = subDir + "fs-alz-grand.png";
			else if(document.body.textContent.indexOf("Coat: Chestnut Blanket ") > 0)
				newSrc = subDir + "bkt-alz-grand.png";
			else if(document.body.textContent.indexOf("Coat: Chestnut Blanket") > 0)
				newSrc = subDir + "bkt-alz-grand.png";
			else if(document.body.textContent.indexOf("Coat: Chestnut") > 0)
				newSrc = subDir + "alz-grand.png";
			else if(document.body.textContent.indexOf("Coat: Cherry Spotted Blanket") > 0)
				newSrc = subDir + "spt-bai-cer-grand.png";
			else if(document.body.textContent.indexOf("Coat: Cherry bay Tobiano") > 0)
				newSrc = subDir + "pie-tb-bai-cer-grand.png";
			else if(document.body.textContent.indexOf("Coat: Cherry Bay Overo") > 0)
				newSrc = subDir + "pie-ov-bai-cer-grand.png";
			else if(document.body.textContent.indexOf("Coat: Cherry bay Blanket") > 0)
				newSrc = subDir + "bkt-bai-cer-grand.png";
			else if(document.body.textContent.indexOf("Coat: Cherry bay") > 0)
				newSrc = subDir + "bai-cer-grand.png";
			else if(document.body.textContent.indexOf("Coat: Brunblakk") > 0)
				newSrc = subDir + "bbk-grand.png";
			else if(document.body.textContent.indexOf("Coat: Black Tovero") > 0)
				newSrc = subDir + "pie-tv-nr-grand.png";
			else if(document.body.textContent.indexOf("Coat: Black Tobiano") > 0)
				newSrc = subDir + "pie-tb-nr-grand.png";
			else if(document.body.textContent.indexOf("Coat: Black Spotted Blanket ") > 0)
				newSrc = subDir + "spt-nr-grand.png";
			else if(document.body.textContent.indexOf("Coat: Black Spotted Blanket") > 0)
				newSrc = subDir + "spt-nr-grand.png";
			else if(document.body.textContent.indexOf("Coat: Black Snowflake ") > 0)
				newSrc = subDir + "sfk-nr-grand.png";
			else if(document.body.textContent.indexOf("Coat: Black Snowflake") > 0)
				newSrc = subDir + "sfk-nr-grand.png";
			else if(document.body.textContent.indexOf("Coat: Black Overo") > 0)
				newSrc = subDir + "pie-ov-nr-grand.png";
			else if(document.body.textContent.indexOf("Coat: Black Leopard ") > 0)
				newSrc = subDir + "leo-nr-grand.png";
			else if(document.body.textContent.indexOf("Coat: Black Leopard") > 0)
				newSrc = subDir + "leo-nr-grand.png";
			else if(document.body.textContent.indexOf("Coat: Black Blanket ") > 0)
				newSrc = subDir + "bkt-nr-grand.png";
			else if(document.body.textContent.indexOf("Coat: Black Blanket") > 0)
				newSrc = subDir + "bkt-nr-grand.png";
			else if(document.body.textContent.indexOf("Coat: Black") > 0)
				newSrc = subDir + "nr-grand.png";
			else if(document.body.textContent.indexOf("Coat: Bay Tovero") > 0)
				newSrc = subDir + "pie-tv-bai-grand.png";
			else if(document.body.textContent.indexOf("Coat: Bay Tobiano") > 0)
				newSrc = subDir + "pie-tb-bai-grand.png";
			else if(document.body.textContent.indexOf("Coat: Bay Spotted Blanket ") > 0)
				newSrc = subDir + "spt-bai-grand.png";
			else if(document.body.textContent.indexOf("Coat: Bay Spotted Blanket") > 0)
				newSrc = subDir + "spt-bai-grand.png";
			else if(document.body.textContent.indexOf("Coat: Bay Snowflake ") > 0)
				newSrc = subDir + "sfk-bai-grand.png";
			else if(document.body.textContent.indexOf("Coat: Bay Snowflake") > 0)
				newSrc = subDir + "sfk.bai-grand.png";
			else if(document.body.textContent.indexOf("Coat: Bay Overo") > 0)
				newSrc = subDir + "pie-ov-bai-grand.png";
			else if(document.body.textContent.indexOf("Coat: Bay Leopard") > 0)
				newSrc = subDir + "leo-bai-grand.png";
			else if(document.body.textContent.indexOf("Coat: Bay Few Spots") > 0)
				newSrc = subDir + "fs-bai-grand.png";
			else if(document.body.textContent.indexOf("Coat: Bay Blanket ") > 0)
				newSrc = subDir + "bkt-bai-grand.png";
			else if(document.body.textContent.indexOf("Coat: Bay Blanket") > 0)
				newSrc = subDir + "bkt-alz-grand.png";
			else if(document.body.textContent.indexOf("Coat: Bay") > 0)
				newSrc = subDir + "bai-grand.png";
				
			newImg.setAttribute("src",newSrc);
			newImg.setAttribute("style",tmpStyle.substring(0,tmpStyle.indexOf("background-image:")) + tmpStyle.substring(tmpStyle.indexOf(";background-position")+1,tmpStyle.length));
		//	This sets the ID of the new element to what the div tag was so the game will correctly update the tag.  If this isn't set, the game won't do anything with the image.
			newImg.setAttribute("id","cheval-robe-"+chevalId);
			howrseImg.appendChild(newImg);
		}
	}
}

function changeBreedingFarmIcons()
{
	if(document.URL.indexOf("/?elevage=") > 0 || document.URL.indexOf("/centre/fiche?id=") > 0 || document.URL.indexOf("/rechercher") > 0 || document.URL.indexOf("/marche/vente") > 0) size = "40";
	else if(document.URL.indexOf("/race?id") > 0) size = "300";
	else size = "120";
	chevalList = document.getElementsByClassName("cheval-icone");
	for(i=0;i<chevalList.length;++i)
	{
		iconSrc = chevalList[i].getAttribute("src");
		swap = check(iconSrc);
		if(swap == 1)
		{
			if(iconSrc.indexOf("chevaux/") < 0 && iconSrc.indexOf("generique") < 0 && iconSrc.indexOf("/poney/") < 0 && iconSrc.indexOf("amazonaws") < 0)
			{
				if(iconSrc.indexOf("/licorne/") > 0)species = "licorne";
				else if(iconSrc.indexOf("ailee") > 0) species = "licorne-ailee";
				else if(iconSrc.indexOf("pegase") > 0) species = "pegase";
				else species = "normal";
				
				if(iconSrc.indexOf("adulte/") > 0)
				{
					chevalBreed = iconSrc.substring(iconSrc.indexOf("adulte/") + 7,iconSrc.indexOf(species + "/" + size));
					if(chevalBreed == "tennessee-walker/") chevalBreed = "trotteur/";
				}
				else
				{
					chevalBreed = iconSrc.substring(iconSrc.indexOf("poulain/") + 8,iconSrc.indexOf(species + "/" + size)-1);
					if(chevalBreed == "tennessee-walker") chevalBreed = "trotteur-small/";
					else chevalBreed = chevalBreed + "-small/";
				}
				chevalCoat = iconSrc.substring(iconSrc.indexOf(size + "/") + 3,iconSrc.indexOf(".png"));
				
				if(species == "licorne") species = "licornes/";
				else if(species == "licorne-ailee") species = "licornes-ailees/";
				else if (species == "normal") species = "normaux/";
				else species = "pegase/";
				
				if(size == "40") iconSrc = "http://www.howrse.com/media/equideo/image/chevaux/" + species + chevalBreed + chevalCoat + "-miniature.png";
				else iconSrc = "http://www.howrse.com/media/equideo/image/chevaux/" + species + chevalBreed + chevalCoat + "-grand.png";
				chevalList[i].setAttribute("src",iconSrc);
			}
		}
	}
}
function changeMareIcons()
{
	size = "120";
	
	chevalList = document.getElementsByTagName("img");
	for(i=0;i<chevalList.length;++i)
	{
		iconSrc = chevalList[i].getAttribute("src");
		swap = check(iconSrc);
		if(swap == 1)
		{
			if(iconSrc.indexOf("/chevauxv4/") > 0 && iconSrc.indexOf("amazonaws") < 0)
			{
				if(iconSrc.indexOf("/licorne/") > 0)species = "licorne";
				else if(iconSrc.indexOf("ailee") > 0) species = "licorne-ailee";
				else if(iconSrc.indexOf("pegase") > 0) species = "pegase";
				else species = "normal";
				
				chevalBreed = iconSrc.substring(iconSrc.indexOf("adulte/") + 7,iconSrc.indexOf(species + "/" + size));
				if(chevalBreed == "tennessee-walker/") chevalBreed = "trotteur/";
				
				chevalCoat = iconSrc.substring(iconSrc.indexOf(size + "/") + 3,iconSrc.indexOf(".png"));
				
				if(species == "licorne") species = "licornes/";
				else if(species == "licorne-ailee") species = "licornes-ailees/";
				else if (species == "normal") species = "normaux/";
				else species = "pegase/";
				
				iconSrc = "http://www.howrse.com/media/equideo/image/chevaux/" + species + chevalBreed + chevalCoat + "-grand.png";
				chevalList[i].setAttribute("src",iconSrc);
			}
		}
	}
}
function check(text)
{
	if(akhalTeke == 1 && text.indexOf("akhal-teke") > 0)
		swap = 1;
	else if(americain == 1 && text.indexOf("americain") > 0)
		swap = 1;
	else if(arabe == 1 && text.indexOf("arabe") > 0)
		swap = 1;
	else if(curly == 1 && text.indexOf("curly") > 0)
		swap = 1;
	else if(fjord == 1 && text.indexOf("fjord") > 0)
		swap = 1;
	else if(frison == 1 && text.indexOf("frison") > 0)
		swap = 1;
	else if(highlandPony == 1 && text.indexOf("highland-pony") > 0)
		swap = 1;
	else if(iberique == 1 && text.indexOf("iberique") > 0)
		swap = 1;
	else if(knabstrup == 1 && text.indexOf("knabstrup") > 0)
		swap = 1;
	else if(marwari == 1 && text.indexOf("marwari") > 0)
		swap = 1;
	else if(mustang == 1 && text.indexOf("mustang") > 0)
		swap = 1;
	else if(nokota == 1 && text.indexOf("nokota") > 0)
		swap = 1;
	else if(poneyLeger == 1 && text.indexOf("poney-leger") > 0)
		swap = 1;
	else if(poneyLourd == 1 && text.indexOf("poney-lourd") > 0)
		swap = 1;
	else if(poneyPrimitif == 1 && text.indexOf("poney-primitif") > 0)
		swap = 1;
	else if(poneySport == 1 && text.indexOf("poney-sport") > 0)
		swap = 1;
	else if(primitif == 1 && text.indexOf("primitif") > 0)
		swap = 1;
	else if(shetland == 1 && text.indexOf("shetland") > 0)
		swap = 1;
	else if(sportLeger == 1 && text.indexOf("sport-leger") > 0)
		swap = 1;
	else if(sportMassif == 1 && text.indexOf("sport-massif") > 0)
		swap = 1;
	else if(thoroughbred == 1 && text.indexOf("thoroughbred") > 0)
		swap = 1;
	else if(tinker == 1 && text.indexOf("tinker") > 0)
		swap = 1;
	else if(trotteur == 1 && text.indexOf("trotteur") > 0)
		swap = 1;
	else if(tenWalker == 1 && text.indexOf("tennesee-walker") > 0)
		swap = 1;
	else 
		swap = 0;
	
	return swap;
}