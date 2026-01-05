// ==UserScript==
// @name        FarmListExecution
// @namespace   CoordinatesGood
// @include     http://*.travian.*/build.php?tt=99&id=39*
// @include     http://*.travian.*/build.php?gid=16&tt=99*
// @version     1
// @grant       none
// @description rstrete
// @downloadURL https://update.greasyfork.org/scripts/9372/FarmListExecution.user.js
// @updateURL https://update.greasyfork.org/scripts/9372/FarmListExecution.meta.js
// ==/UserScript==

var MAX_HOURS = 4;
var MIN_HOURS = 2;
var DEFAULT_TROOP_NO = 2;

// Ejecucion inicial
addInterface();
checkPreviousState();

function updateFarmListTroops(nameObj)
{
    // Leemos nombre
    var idLista = nameObj.target.getAttribute("name");
    var value = document.getElementById(idLista).getElementsByClassName("updateTroopsTextBox")[0].value;
    
    localStorage.setItem("troopsUpdateList", idLista);
    localStorage.setItem("troopsUpdateValue", value);
    
    // Updatear tropas
    executeUpdateFarmListTroops();
}

function executeUpdateFarmListTroops()
{
    var idLista = localStorage.getItem("troopsUpdateList");
    var value = parseInt(localStorage.getItem("troopsUpdateValue"));

    // Cogemos lista
    var m_list = document.getElementById(idLista);
    
    // Cogemos filas de la lista
    var listRows = m_list.getElementsByClassName("slotRow");

    var boolMarcado = false;
    // Barremos filas y comprobamos si pueden ser atacadas las respectivas filas
    for (i = 0; i < listRows.length; i++)
    {
        if (getDatoFila(idLista, i, "attack_troops_no") != value) // Si el valor actual de esa fila es diferente al deseado
        {
            // Pulsamos boton de EDIT
			//alert(listRows[i].innerHTML);
            listRows[i].getElementsByClassName("arrow")[0].click();
            // Establecemos coordenadas, tropas TODO
            setTimeout(function(){ newFarmSetCoordinatesAndTroops(-1, -1, value); }, getRandomInt(1721, 3199));
            
			// Se ha marcado alguna, marcar para saber que el proceso es incompleto
			boolMarcado = true;
			
            updateFarmListUpdateProgress();
            break;
        }
    }
	
	// No se ha marcado ninguna, lo que significa que la lista ya esta completamente actualizada y por tanto desactivamos las variables asociadas
	if (!boolMarcado)
	{
        // Si estamos aqui es porque no quedan filas con valor diferente al deseado, restablecemos variables
        localStorage.setItem("troopsUpdateList", "-1");
        localStorage.setItem("troopsUpdateValue", "-1");
	}
}

function executeFarmList(nameObj, autoLaunch)
{
    // Leemos nombre
    var idLista = nameObj.target.getAttribute("name");

    // Cogemos lista
    var m_list = document.getElementById(idLista);
    
    // Cogemos filas de la lista
    var listRows = m_list.getElementsByClassName("slotRow");

    var marcadoCounter = 0;
    // Barremos filas y comprobamos si pueden ser atacadas las respectivas filas
    for (i = 0; i < listRows.length; i++)
    {
        // Comprobamos que satisface todos los filtros
        var marcar = villageCanBeAttacked(idLista, i);
        
        // Marcamos si es necesario
        marcarFila(idLista, i, marcar); // Marcamos casilla
        
        // En caso de haber marcado, incrementar counter.
        if (marcar)
            marcadoCounter++;
    }

    // Reportamos casillas marcadas
    document.getElementById("checkedVillagesReport" + idLista).innerHTML = marcadoCounter + " Aldeas marcadas para atacar.";
    // Si no esta activo el autolanzamiento, hemos terminado aqui
    if (!autoLaunch)
        return;

    // Ejecutamos
    var buttons = m_list.getElementsByTagName("button");
    for (i = 0; i < buttons.length; i++)
        if (buttons[i].getAttribute("type") == "submit")
            buttons[i].click();
}

// Funciona bien (verificar optimización)
function villageCanBeAttacked(idLista, nFila)
{
    //alert(getDatoFila(idLista, nFila, "village_name"));
    // Si ya esta siendo atacada, abortar.
    if (getDatoFila(idLista, nFila, "attack_on_way") == "true")
    {
        //alert("ya van tropas");
        return false;
    }

    // Si hubo bajas la ultima vez, abortar.
    if (getDatoFila(idLista, nFila, "last_raid_casualties") == "true")
    {
        //alert("hubo bajas");
        return false;
    }

    // Si esta mas lejos de la cuenta, abortar. (fixed)
    if (parseFloat(getDatoFila(idLista, nFila, "village_distance")) > parseFloat(getCVar(idLista, "max_dist")))
    {
        //alert("Distancia excede el filtro");
        return false;
    }

    // Si tiene mas habitantes de la cuenta, abortar. (fixed)
    if (parseInt(getDatoFila(idLista, nFila, "village_points")) > parseInt(getCVar(idLista, "max_points")))
    {
        //alert("Poblacion excede el filtro");
        return false;
    }

    // No es aldea natar (fixed)
    if (getDatoFila(idLista, nFila, "village_name").toLowerCase().indexOf("natar") == -1)
        if (getCVar(idLista, "only_natars")) // Variable de solo natares activa
        {
            //alert("No es natar, y se impone que lo sea");
            return false;
        }

    // Es un valle (fixed)
    if (getDatoFila(idLista, nFila, "village_name").toLowerCase().indexOf("oasis") != -1)
        if (getCVar(idLista, "no_valleys")) // No permite valles
        {
            //alert("Es un valle, y no se permiten.");
            return false;
        }

    // Si el ultimo reporte es un lleno, enviar inmediatamente
    if (getDatoFila(idLista, nFila, "last_raid_full") == "true")
    {
        //alert("reporte lleno, reenviar.");
        return true;
    }
    else // Si no es un lleno, comprobar fecha y carga
    {
        // Hora unix del ultimo ataque
        var last_raid_time = getDatoFila(idLista, nFila, "last_raid_time");
        
        
        // Nunca visitado
        if (last_raid_time == 0)
        {
            if (!getCVar(idLista, "attack_new_farms")) // En la configuracion no se permite atacar nuevas granjas
            {
                //alert("No se ha atacado antes, y no se permite.");
                return false;
            }
            else // En la configuracion se permite atacar, no se pueden realizar calculos de eficiencia sin datos por lo que se ataca directamente
            {
                //alert("No se ha atacado antes, y se impone que se haga");
                return true;
            }
        }
        
        // Hora actual
        var time_now = Math.floor(new Date().getTime() / 1000)
        
        // Diferencia en segundos
        var difference = time_now - last_raid_time;
        
        // Si la diferencia supera las 4 horas (configurable), enviar inmediatamente
        if (difference > MAX_HOURS * 3600)
        {
            //alert("tiempo maximo excedido");
            return true;
        }

        
        // Si la diferencia es inferior a la hora (configurable), no enviar directamente
        if (difference < MIN_HOURS * 3600)
        {
            //alert(last_raid_time);
            //alert(time_now);
            //alert(difference);
            //alert("Tiempo minimo no superado");
            return false;
        }
        
        // Cuantos recursos habra producido esta ciudad?
        var generated_ressources = getEstimatedResourceProductionPerHour(getDatoFila(idLista, nFila, "village_points")) / 3600 * difference;
        var number_of_troops = getDatoFila(idLista, nFila, "attack_troops_no");
        var carry_per_troop = getCarryPerUnit(getDatoFila(idLista, nFila, "attack_troops_type"));

        //alert("insuficientes recursos: "+ number_of_troops + "Rayos, cargan: " + (number_of_troops * carry_per_troop) + ";La aldea objetivo tiene " + getDatoFila(idLista, nFila, "village_points") + " y una produccion de " + getEstimatedResourceProductionPerHour(getDatoFila(idLista, nFila, "village_points")) + " por lo que ha producido " + generated_ressources + "en los " + difference + "segundos que han pasado desde el ultimo ataque, que es menos que la carga maxima.");
        // Si los recursos generados exceden o igualan la carga de las tropas designadas, enviar.
        if (generated_ressources > number_of_troops * carry_per_troop)
            return true;
    }
}

// Funciona bien (en principio, puede que haya errores)
function getCVar(idLista, confVar)
{
    // Leemos las variables directamente de los forms
    var element = document.getElementById(confVar + "Form" + idLista);
    switch (confVar)
    {
        case "attack_new_farms":
            return element.checked;
        break;
        case "only_natars":
            return element.checked;
        break;
        case "no_valleys":
            return element.checked;
        break;
        case "max_dist":
            return element.value;
        break;
        case "max_points":
            return element.value;
        break;
    }
    return false;
}

// Funciona bien (en principio, puede que haya errores)
function saveCVars()
{
    var m_lists = document.getElementsByClassName("listEntry");
    var outputString = "";
    for (i = 0; i < m_lists.length; i++)
    {
        // Leemos ID de la lista
        var listId = m_lists[i].getAttribute("id");
        // La almacenamos en la cabecera
        outputString += listId + ",";
        
        // Buscamos forms bool de dicha ID
        outputString += document.getElementById("attack_new_farmsForm" + listId).checked + ",";
        outputString += document.getElementById("only_natarsForm" + listId).checked + ",";
        outputString += document.getElementById("no_valleysForm" + listId).checked + ",";

        // Buscamos forms text de dicha ID
        var maxDistValue = document.getElementById("max_distForm" + listId).value;
        var maxPointsValue = document.getElementById("max_pointsForm" + listId).value;
        if (maxDistValue == "")
            maxDistValue = "0";
        if (maxPointsValue == "")
            maxPointsValue = "0";
        outputString += maxDistValue + ",";
        outputString += maxPointsValue;

        // Separador final
        outputString += ";";
    }

    // Eliminamos ultimo caracter
    outputString = outputString.substring(0, outputString.length - 1);

    // Guardamos
    localStorage.setItem("confSettings", outputString);
}

// Funciona bien (en principio, puede que haya errores)
function updateForms()
{
    // Leemos variable
    var outputString = localStorage.getItem("confSettings");

    if (outputString == null)
        return;
    if (outputString == "")
        return;

    // Con esto tenemos varias listas para cada idList
    var listSplit = outputString.split(";");
    
    for (i = 0; i < listSplit.length; i++)
    {
        // Lista por list y cada componente
        var secondListSplit = listSplit[i].split(",");
        
        if (secondListSplit.length == 0)
            continue;

        var listId = secondListSplit[0];
        document.getElementById("attack_new_farmsForm" + listId).checked = secondListSplit[1] == "true" ? true : false;
        document.getElementById("only_natarsForm" + listId).checked = secondListSplit[2] == "true" ? true : false;
        document.getElementById("no_valleysForm" + listId).checked = secondListSplit[3] == "true" ? true : false;
        document.getElementById("max_distForm" + listId).value = secondListSplit[4];
        document.getElementById("max_pointsForm" + listId).value = secondListSplit[5];
    }
    
}

// Funciona bien
// Devuelve produccion estimada de aldea por puntos
function getEstimatedResourceProductionPerHour(vPoints)
{
    // Parseamos int
    var vPointsInt = parseInt(vPoints);
    
    // Variable de salida
    var prodPerHour = 0;
    // Oasis
    if (vPointsInt == 0)
        prodPerHour = 100;
    else // El resto
        prodPerHour =  84.75 * Math.pow(2.71828, 0.0092 * vPointsInt);

    return prodPerHour;
}


// Funciona bien
function getCarryPerUnit(nUnit)
{
    var unitNo = parseInt(nUnit);
    switch(unitNo)
    {
        // legionario
        case 1:
            return 50;
        break;
        // Preto
        case 2:
            return 20;
        break;
        // Imperano
        case 3:
            return 50;
        break;
        // Legati
        case 4:
            return 0;
        break;
        // Imperatoris
        case 5:
            return 100;
        break;
        // Caesaris
        case 6:
            return 70;
        break;
        // Carnero
        case 7:
            return 0;
        break;
        // Cata
        case 8:
            return 0;
        break;
        // Senador
        case 9:
            return 0;
        break;
        // Colono
        case 10:
            return 3000;
        break;
        // Porra
        case 11:
            return 60;
        break;
        // Lanza
        case 12:
            return 40;
        break;
        // Hacha
        case 13:
            return 50;
        break;
        // Emisario
        case 14:
            return 0;
        break;
        // Paladin
        case 15:
            return 110;
        break;
        // Teuton
        case 16:
            return 80;
        break;
        // Ariete
        case 17:
            return 0;
        break;
        // Cata
        case 18:
            return 0;
        break;
        // Cabecilla
        case 19:
            return 0;
        break;
        // Colono
        case 20:
            return 3000;
        break;
        // Falange
        case 21:
            return 35;
        break;
        // Espada
        case 22:
            return 45;
        break;
        // Batidor
        case 23:
            return 0;
        break;
        // Rayo
        case 24:
            return 75;
        break;
        // Druida
        case 25:
            return 35;
        break;
        // Eduo
        case 26:
            return 65;
        break;
        // Ariete
        case 27:
            return 0;
        break;
        // Cata
        case 28:
            return 0;
        break;
        // Cacique
        case 29:
            return 0;
        break;
        // Colono
        case 30:
            return 3000;
        break;
    }
}

// Funciona bien
function addInterface()
{
    // Barremos listas y generamos botones
    var m_lists = document.getElementsByClassName("listEntry");
    for (i = 0; i < m_lists.length; i++)
    {
        // Leemos ID
        var listId = m_lists[i].getAttribute("id");
        
        // Form de execute farmlist
        m_lists[i].innerHTML = m_lists[i].innerHTML + "<hr><label>Raid new farms: </label><input type='checkbox' checked='false' id='attack_new_farmsForm" + listId +"' class='attack_new_farmsForm'><label>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp Only Natars: </label><input type='checkbox'  id='only_natarsForm" + listId +"' class='only_natarsForm'><label>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp No Valleys: </label><input  checked='true' type='checkbox' id='no_valleysForm" + listId +"' class='no_valleysForm'><br>"
        m_lists[i].innerHTML = m_lists[i].innerHTML + "<label>Max Distance: </label><input value='50' type='text' id='max_distForm" + listId +"' class='max_distForm' style='width:30px'><label>&nbsp&nbsp&nbsp&nbsp&nbsp&nbspMax Points: </label><input value='75' type='text' id='max_pointsForm" + listId +"' class='max_pointsForm' style='width:30px'><br>"

        // Add boton de execute farmlist
        m_lists[i].innerHTML = m_lists[i].innerHTML + "<br><input id='farmlistButton" + i + "' class='farmlistButton' name='" + listId + "' value='Execute FarmList' type='button'></input>&nbsp<label id='checkedVillagesReport" + listId +"'></label><hr>";
        
        // Add textbox para lista de farms to add
        m_lists[i].innerHTML = m_lists[i].innerHTML + "<label>Add new farms to farmlist (format: x,y | x,y | x,y ....) : </label><br>";
        m_lists[i].innerHTML = m_lists[i].innerHTML + "<input id='addFarmsTextBox" + i + "' class='addFarmsTextBox' name='" + listId + "'type='text' style='width:450px'>";
        // Add boton de Add Farms
        m_lists[i].innerHTML = m_lists[i].innerHTML + "&nbsp&nbsp<input id='addFarmsButton" + i + "' class='addFarmsButton' name='" + listId + "' value='Add Farms' type='button'></input><hr>";
    
        // Add textbox para update de tropas
        m_lists[i].innerHTML = m_lists[i].innerHTML + "<label>Update troops of all villages: </label><br>";
        m_lists[i].innerHTML = m_lists[i].innerHTML + "<input id='updateTroopsTextBox" + i + "' class='updateTroopsTextBox' name='" + listId + "'type='text' style='width:30px'>";
        // Add boton de Update Troops
        m_lists[i].innerHTML = m_lists[i].innerHTML + "&nbsp&nbsp<input id='updateTroopsButton" + i + "' class='updateTroopsButton' name='" + listId + "' value='Update Troops' type='button'></input><hr><br><br>";
    }
    
    // Add boton de reinicio de variables
    document.getElementsByClassName("options")[1].innerHTML = document.getElementsByClassName("options")[1].innerHTML + "<br><hr><input id='resetButton' class='addFarmsButton' value='Reset All Variables' type='button'></input>";
    // Y add su evento
    document.getElementById("resetButton").addEventListener("click", function(){resetAllVariables()}, false);

    // Cargamos en los formularios las variables externas
    updateForms();
    
    // Establecemos eventos de formularios de filtros
    var inputs = document.getElementsByTagName("input");
    for (i = 0; i < inputs.length; i++)
        inputs[i].addEventListener("change", function(){saveCVars()}, false);
        
    // Barremos botones y establecemos eventos (execute farmlist)
    var m_buttons = document.getElementsByClassName("farmlistButton");
    for (j = 0; j < m_buttons.length; j++)
    {
        // Add evento de click en botones de execute farmlist
        var nameObj = document.getElementById("farmlistButton" + j).getAttribute("name");
        document.getElementById("farmlistButton" + j).addEventListener("click", function(nameObj){executeFarmList(nameObj, false)}, false);
        
        // Add evento de click en botones de Add Farms
        var nameObj = document.getElementById("addFarmsButton" + j).getAttribute("name");
        document.getElementById("addFarmsButton" + j).addEventListener("click", function(nameObj){addFarmsToList(nameObj)}, false);
    }

    // Barremos botones de update troops y establecemos eventos
    var m_buttons = document.getElementsByClassName("updateTroopsButton");
    for (j = 0; j < m_buttons.length; j++)
    {
        // Add evento de click en botones
        var nameObj = document.getElementById("updateTroopsButton" + j).getAttribute("name");
        document.getElementById("updateTroopsButton" + j).addEventListener("click", function(nameObj){updateFarmListTroops(nameObj)}, false);
    }
}

function resetAllVariables()
{
    // Reiniciamos todas las variables externas
    localStorage.setItem("coordinatesString", "");
    localStorage.setItem("saveList", "");
    localStorage.setItem("confSettings", "");
    localStorage.setItem("totalElements", "");
    localStorage.setItem("troopsUpdateList", "");
    localStorage.setItem("troopsUpdateValue", "");
    
    // Recargamos website
    document.location.reload();
}

// Funciona bien (optimizar)
function addFarmsToList(nameObj)
{
    // Leemos nombre
    var idLista = nameObj.target.getAttribute("name");
    
    // Leemos input de texto
    var coordinates_string = document.getElementById(idLista).getElementsByClassName("addFarmsTextBox")[0].value;
    
    // Guardamos lista de coordenadas en variable global externa
    localStorage.setItem("coordinatesString", coordinates_string);
    // Guardamos lista a guardar en variable global externa
    localStorage.setItem("saveList", idLista);
    // Guardamos Valor total
    localStorage.setItem("totalElements", coordinates_string.split("|").length);
    
    // Ejecutamos funcion de guardado
    saveCoordinateOnList();
}

// Funciona bien (optimizar)
function checkPreviousState()
{
    var coordinates_string = localStorage.getItem("coordinatesString");
    var idLista = localStorage.getItem("saveList");
    
    // Si ambos son distintos de -1, hay un estado previo, que debemos recuperar
    if (coordinates_string != "-1" && idLista != "-1" && coordinates_string != "" && idLista != "" )
    {
        setTimeout(function(){ saveCoordinateOnList(); }, getRandomInt(1173, 2947));
        updateFarmListProgress();
    }
    else // En caso opuesto, comprobar si hay un update pendiente
    {
        var idListaUpdate = localStorage.getItem("troopsUpdateList");
        var value = parseInt(localStorage.getItem("troopsUpdateValue"));
        
        if (idListaUpdate != "-1" && value != "-1" && idListaUpdate != "" && value != "" )
        {
            setTimeout(function(){ executeUpdateFarmListTroops(); }, getRandomInt(2239, 3971));
            updateFarmListUpdateProgress();
        }
    }
}

function updateFarmListUpdateProgress()
{
    var listId = localStorage.getItem("troopsUpdateList");
    var value = parseInt(localStorage.getItem("troopsUpdateValue"));

	if (listId == "" || listId == "-1")
		return;

    // Numero de coordenadas pendientes
    var doneUpdates = 0;
    var totalElements = 0;
    // Leemos
    // Cogemos lista
    var m_list = document.getElementById(listId);
    // Cogemos filas de la lista
    var listRows = m_list.getElementsByClassName("slotRow");

    // Barremos filas y comprobamos si pueden ser atacadas las respectivas filas
    for (i = 0; i < listRows.length; i++)
    {
        if (getDatoFila(listId, i, "attack_troops_no") == value) // Si el valor coincide, lo consideramos updateado
            doneUpdates++;
        totalElements++; // Incrementamos el total siempre
    }
    
    // Construimos string
    var outputString = "Progress updating troops in list: " + doneUpdates + "/" +  totalElements + ", New troop value: " + value + ".";

    // Insertamos en la web
    var element = document.getElementById(listId).getElementsByClassName("round listTitle")[0];
    
    // Solo add si no existia ya
    if (document.getElementById("addReportUpdate") == null)
        element.innerHTML = element.innerHTML + "<hr><label id='addReportUpdate'>"+ outputString + "</label><hr>";
}

// Funciona bien
function updateFarmListProgress()
{
    var coordinateString = localStorage.getItem("coordinatesString");
    var listId = localStorage.getItem("saveList");
    var totalElements = parseInt(localStorage.getItem("totalElements"));
    
    // Numero de coordenadas pendientes
    var currentArrayLength = parseInt(coordinateString.split("|").length);
    
    // Construimos string
    var outputString = "Progress adding farms to list: " + (totalElements - currentArrayLength + 1) + "/" +  totalElements + ", next coordinate: (" + coordinateString.split("|")[0] + ")";

    // Insertamos en la web
    var element = document.getElementById(listId).getElementsByClassName("round listTitle")[0];
    
    // Solo add si no existia ya
    if (document.getElementById("addReport") == null)
        element.innerHTML = element.innerHTML + "<hr><label id='addReport'>"+ outputString + "</label><hr>";
}

// Funciona bien (optimizar)
function saveCoordinateOnList()
{
    // Updateamos progreso
    updateFarmListProgress();
    
    var coordinates_string = localStorage.getItem("coordinatesString");
    var idListaStart = localStorage.getItem("saveList");
    var idLista = idListaStart;

    // Spliteamos las coordenadas, formato: x,y | x,y | x,y | x,y....
    var coordinatesArray = coordinates_string.split("|");

    var coordX = parseInt(coordinatesArray[0].split(",")[0]);
    var coordY = parseInt(coordinatesArray[0].split(",")[1]);

    // Eliminar el primer elemento del array y guardar en nueva global
    var coordinates_string = "";
    for (i = 1; i < coordinatesArray.length; i++)
        coordinates_string += coordinatesArray[i] + "|";
        
    // Eliminamos caracter final
    coordinates_string = coordinates_string.substring(0, coordinates_string.length - 1);
    
    // Si esta vacio, hemos terminado
    if (coordinates_string == "")
    {
        coordinates_string = "-1";
        idLista = "-1";
        
        // Reiniciamos total
        localStorage.setItem("totalElements", "0");
    }

    // Guardamos lista de coordenadas en variable global externa
    localStorage.setItem("coordinatesString", coordinates_string);
    // Guardamos lista a guardar en variable global externa
    localStorage.setItem("saveList", idLista);
    
    // Una de las dos coordenadas no es numerica, abortar
    if (isNaN(coordX) || isNaN(coordY))
        return;
    
    // Ejecutar adicion (TODO)
    // Pulsamos boton de ADD
    Travian.Game.RaidList.addSlot(idListaStart.replace("list",""),'','','rallyPoint');
    // Establecemos coordenadas, tropas TODO
    setTimeout(function(){ newFarmSetCoordinatesAndTroops(coordX, coordY, DEFAULT_TROOP_NO); }, getRandomInt(1721, 3199));
}

// Funciona bien
function newFarmSetCoordinatesAndTroops(coordX, coordY, troops)
{
    // Coordenadas
	if (coordX != "-1") // Orden de no tocar
		document.getElementById("xCoordInput").value = coordX;
	if (coordY != "-1") // Orden de no tocar
		document.getElementById("yCoordInput").value = coordY;
    
    // Tropas
    document.getElementById("t4").value = parseInt(troops);
    
    // Ejecutamos guardado
    document.getElementById("save").click();
    
    // Recarga para prevenir stuck
    setTimeout(function(){ document.location.reload(); }, getRandomInt(2351, 4532));
    //var errorWindow = document.getElementById("dialogCancelButton");
    //if (errorWindow != null)
        //document.location.reload();
}

// Funciona bien
function getDatoFila(idLista, nFila, dato)
{
    // Obtenemos lista
    var m_lista = document.getElementById(idLista);
    
    // Obtenemos fila de esa lista
    var m_fila = m_lista.getElementsByClassName("slotRow")[nFila];
    
    // Obtenemos Elemento deseado
    switch (dato)
    {
        // Obtenemos casilla de village, y obtenemos el innerHtml del primer tag a (contiene el nombre)
        // TODO: Problema con nombre de oasis (sale codigo html)
        case "village_name":
            var m_villageName = m_fila.getElementsByClassName("village")[0].getElementsByTagName("a")[0].innerHTML;
            if (m_villageName.indexOf("<span") != -1) // Es un oasis, limitar
                return m_villageName.substring(0, m_villageName.indexOf("<span"));
            else
                return m_villageName;
            break;
        // Obtenemos casilla de village, y comprobamos si contiene el icono de ataque saliente, en caso negativo, false
        case "attack_on_way":
            if (m_fila.getElementsByClassName("village")[0].getElementsByClassName("attack att2")[0] == null)
                return "false";
            else
                return "true";
            break;
        // Obtenemos casilla de village points y leemos su innerhtml
        case "village_points":
            return m_fila.getElementsByClassName("ew")[0].innerHTML;
            break;
        // Obtenemos casilla de village distance y leemos su innerhtml
        case "village_distance":
            return m_fila.getElementsByClassName("distance")[0].innerHTML;
            break;
        // Obtenemos casilla de tropas y leemos la class de la imagen, nos dara el tipo de tropa (formato unitX)
        case "attack_troops_type":
            return m_fila.getElementsByClassName("troops")[0].getElementsByTagName("img")[0].getAttribute("class").replace("unit u","");
            break;
        // Obtenemos casilla de tropas y leemos el inner, nos dara el numero.
        case "attack_troops_no":
            return m_fila.getElementsByClassName("troops")[0].getElementsByClassName("troopIconAmount")[0].innerHTML;
            break;
        // Obtenemos casilla de ultimo reporte
        case "last_raid_casualties":
            if (m_fila.getElementsByClassName("lastRaid")[0].getElementsByClassName("iReport iReport2")[0] != null) // Hay report2 (amarillo) Hubo bajas.
                return "true";
            else if (m_fila.getElementsByClassName("lastRaid")[0].getElementsByClassName("iReport iReport3")[0] != null) // Hay report3 (rojo) Hubo bajas.
                return "true";
            else // No se encuentran ni amarillo ni rojo (ergo hay verde o ninguno, no bajas)
                return "false";
            break;
        // Obtenemos casilla de ultimo reporte, buscamos imagen de carga full, si no se encuentra, no hubo.
        case "last_raid_full":
            if (m_fila.getElementsByClassName("lastRaid")[0].getElementsByClassName("carry full")[0] == null)
                return "false";
            else
                return "true";
            break;
        // Leemos la hora en el formato del juego y convertimos a UNIX universal
        case "last_raid_time":
            var hourData = m_fila.getElementsByClassName("lastRaid")[0].getElementsByTagName("a")[0];
            
            // No hay reporte, no se ha visitado nunca
            if (hourData == null)
                return 0;
            
            // Lo hay, leer hora
            var hour = hourData.innerHTML;

            // Hay hoy
            var dd = "";
            var mm = "";
            var yyyy = "";
            if (hour.indexOf("hoy") != -1)
            {
                today = new Date();
                dd = today.getDate();
                mm = today.getMonth(); //January is 0!
                yyyy = today.getFullYear();

                if(dd<10) {
                    dd='0'+dd
                } 

                if(mm<10) {
                    mm='0'+mm
                } 
            }
            else if (hour.indexOf("ayer") != -1) // Hay ayer
            {
                today = new Date();
                today.setDate(today.getDate() - 1);
                
                dd = today.getDate();
                mm = today.getMonth(); //January is 0!
                yyyy = today.getFullYear();

                if(dd<10) {
                    dd='0'+dd
                } 

                if(mm<10) {
                    mm='0'+mm
                } 
            }
            else // Hay una fecha
            {
                var m_data = hour.substring(0, hour.indexOf(" "));
                var dd = m_data.substring(0, 2);
                var mm = parseInt(m_data.substring(3, 5)) - 1;
                var yyyy = 20 + m_data.substring(6, 8);
            }

            // Ahora leemos la hora en si.
            var hora = hour.substring(hour.indexOf(":") - 2, hour.indexOf(":"));
            var minuto = hour.substring(hour.indexOf(":") + 1, hour.length);
            
            // Hora en UNIX
            return (new Date(yyyy, mm, dd, hora, minuto, 0).getTime() / 1000).toFixed(0)
            break;
    }

    // Algun error
    return "null";
}

// Funciona bien
function marcarFila(idLista, nFila, marcar)
{
    // Obtenemos lista
    var m_lista = document.getElementById(idLista);
    
    // Obtenemos fila de esa lista
    var m_fila = m_lista.getElementsByClassName("slotRow")[nFila];
    
    // Obtenemos CheckBox
    var m_check = m_fila.getElementsByClassName("markSlot check")[0];
    
    // Marcamos check
    m_check.checked = marcar;
}

// Valor random (antidetectabilidad)
function getRandomInt(min, max) 
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}