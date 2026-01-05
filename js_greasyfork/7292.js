// ==UserScript==
// @name           WME URComments BrazilianPortuguese List
// @description    This script is for BrazilianPortuguese comments to be used with my other script UR comments
// @namespace      RickZabel@gmail.com
// @grant          none
// @grant          GM_info
// @version        0.6.4
// @match          https://editor-beta.waze.com/*editor/*
// @match          https://www.waze.com/*editor/*
// @author         Rick Zabel '2014
// @license        MIT/BSD/X11
// @icon			data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAwCAYAAACFUvPfAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjQyQjZDNjdEODYzODExRTRBRDY0Q0I2QjA1MjU4N0EyIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjQyQjZDNjdFODYzODExRTRBRDY0Q0I2QjA1MjU4N0EyIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NDJCNkM2N0I4NjM4MTFFNEFENjRDQjZCMDUyNTg3QTIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NDJCNkM2N0M4NjM4MTFFNEFENjRDQjZCMDUyNTg3QTIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6++Bk8AAANOElEQVR42tRZCWxU1xW9M39mPB5v431fMLYJdmpjthQUVsdlS9IQQkpIIDRhl5pKQUpbKkAEpakQIhVVRUytQIGwihCaBkgItQELQosxdrDZ7Njjbbx7vM0+f3ruZDz1NmTGhEj59tOb//979553313fl9jtdvqpXbLHRVgikTz0NbdJkyYJERERUp1OJ1Wr1WJLS4tYXFxswzu7s408+XFJ2g1oSUZGhtzf318piqLKx8dHZbPZFFKpVMC9TRAEs8lk0uNe39vbaywvL7eMBP5HAz179myZxWLxxfNg3IZHRkbG5OTkpEPSkQAs1Wq1nQUFBVXt7e2twNSGMdx3yuVyQ2FhofVHBw01kCsUigA8i1m9evXc3Nzc5TExMwindow.UrcommentsBrazilianPortugueseURC_Text10]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
// @downloadURL https://update.greasyfork.org/scripts/7292/WME%20URComments%20BrazilianPortuguese%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/7292/WME%20URComments%20BrazilianPortuguese%20List.meta.js
// ==/UserScript==
/* Changelog
 * 5th update to the format
 * 0.0.1 - initial version
 */
//I will try not to update this file but please keep a external backup of your comments as the main script changes this file might have to be updated. When the custom comments file is auto updated you will loose your custom comments. By making this a separate script I can try to limit how often this would happen but be warned it will eventually happen.
//if you are using quotes in your titles or comments they must be properly escaped. example "Comment \"Comment\" Comment",
//if you wish to have blank lines in your messages use \n\n. example "Line1\n\nLine2",
//if you wish to have text on the next line with no spaces in your message use \n. example "Line1\nLine2",
//Custom Configuration: this allows your "reminder", and close as "not identified" messages to be named what ever you would like.
//the position in the list that the reminder message is at. (starting at 0 counting titles, comments, and ur status). in my list this is "4 day Follow-Up"
window.UrcommentsBrazilianPortugueseReminderPosistion = 3;

//this is the note that is added to the the reminder link  option
window.UrcommentsBrazilianPortugueseReplyInstructions = 'Para responder, por favor use o aplicativo do Waze ou vá para '; //'To reply, please either use the Waze app or go to ' - followed by the URL - superdave, rickzabel, t0cableguy 3/6/2015

//the position of the close as Not Identified message (starting at 0 counting titles, comments, and ur status). in my list this is "7th day With No Response"
window.UrcommentsBrazilianPortugueseCloseNotIdentifiedPosistion = 6;

//This is the list of Waze's default UR types. edit this list to match the titles used in your area! 
//You must have these titles in your list for the auto text insertion to work!
window.UrcommentsBrazilianPortuguesedef_names = [];
window.UrcommentsBrazilianPortuguesedef_names[6] = "Conversão incorreta"; //"Incorrect turn";
window.UrcommentsBrazilianPortuguesedef_names[7] = "Endereço incorreto"; //"Incorrect address";
window.UrcommentsBrazilianPortuguesedef_names[8] = "Instruções incorretas de rotas"; //"Incorrect route";
window.UrcommentsBrazilianPortuguesedef_names[9] = "Rotatória inexistente"; //"Missing roundabout";
window.UrcommentsBrazilianPortuguesedef_names[10] = "Erro geral no mapa"; //"General error";
window.UrcommentsBrazilianPortuguesedef_names[11] = "Curva proibida"; //"Turn not allowed";
window.UrcommentsBrazilianPortuguesedef_names[12] = "Cruzamento incorreto"; //"Incorrect junction";
window.UrcommentsBrazilianPortuguesedef_names[13] = "Ponte ou viaduto inexistente"; //"Missing bridge overpass";
window.UrcommentsBrazilianPortuguesedef_names[14] = "Sentido de condução incorreto"; //"Wrong driving direction";
window.UrcommentsBrazilianPortuguesedef_names[15] = "Saída inexistente"; //"Missing Exit";
window.UrcommentsBrazilianPortuguesedef_names[16] = "Via inexistente"; //"Missing Road";
window.UrcommentsBrazilianPortuguesedef_names[18] = "Ponto de referência inexistente"; //"Missing Landmark";
window.UrcommentsBrazilianPortuguesedef_names[19] = "Via bloqueada"; //"Blocked Road";
window.UrcommentsBrazilianPortuguesedef_names[21] = "Nome de rua faltando"; //"Missing Street Name";
window.UrcommentsBrazilianPortuguesedef_names[22] = "Sufixo ou prefixo de rua incorreto"; //"Incorrect Street Prefix or Suffix";


//below is all of the text that is displayed to the user while using the script this section is new and going to be used in the next version of the script.
window.UrcommentsBrazilianPortugueseURC_Text = [];
window.UrcommentsBrazilianPortugueseURC_Text_tooltip = [];
window.UrcommentsBrazilianPortugueseURC_USER_PROMPT = [];
window.UrcommentsBrazilianPortugueseURC_URL = [];

//zoom out links
window.UrcommentsBrazilianPortugueseURC_Text[0] = "Zoom Out 0 & Fecha UR"; //"Zoom Out 0 & Close UR"
window.UrcommentsBrazilianPortugueseURC_Text_tooltip[0] = "Menor zoom possível e fecha a janela da UR"; //"Zooms all the way out and closes the UR window"

window.UrcommentsBrazilianPortugueseURC_Text[1] = "Zoom Out 2 & Fecha UR";	//"Zoom Out 2 & Close UR"	
window.UrcommentsBrazilianPortugueseURC_Text_tooltip[1] = "Zoom out nível 2, no qual as marcações do toolbox funcionam e fecha a janela da UR"; //"Zooms out to level 2 this is where I found most of the toolbox highlighting works and closes the UR window"

window.UrcommentsBrazilianPortugueseURC_Text[2] = "Zoom Out 3 & Fecha UR"; //"Zoom Out 3 & Close UR"
window.UrcommentsBrazilianPortugueseURC_Text_tooltip[2] = "Zoom out nível 3, no qual a maioria das marcações do toolbox funciona e fecha a janela da UR"; //"Zooms out to level 3 this is where I found most of the toolbox highlighting works and closes the UR window"

window.UrcommentsBrazilianPortugueseURC_Text_tooltip[3] = "Recarrega o mapa"; //"Reload the map"

window.UrcommentsBrazilianPortugueseURC_Text_tooltip[4] = "Número de URs mostradas na tela"; //"Number of UR Shown"

//tab names - Nomes das abas
window.UrcommentsBrazilianPortugueseURC_Text[5] = "Comentários"; //"Comments"
window.UrcommentsBrazilianPortugueseURC_Text[6] = "Filtragem de URs"; //"UR Filtering"
window.UrcommentsBrazilianPortugueseURC_Text[7] = "Ajustes"; //"Settings"

//UR Filtering Tab - Aba "Filtragem de URs"
window.UrcommentsBrazilianPortugueseURC_Text[8] = "Clique aqui para Instruções"; //"Click here for Instructions"
window.UrcommentsBrazilianPortugueseURC_Text_tooltip[8] = "Instruções para filtragem de UR (em inglês)"; //"Instructions for UR filtering"
window.UrcommentsBrazilianPortugueseURC_URL[8] = "https://docs.google.com/presentation/d/1zwdKAejRbnkUll5YBfFNrlI2I3Owmb5XDIbRAf47TVU";
		
window.UrcommentsBrazilianPortugueseURC_Text[9] = "Habilitar filtragem de URs pelo URComments"; //"Enable URComments UR filtering"
window.UrcommentsBrazilianPortugueseURC_Text_tooltip[9] = "Habilita / desabilita a filtragem pelo URComments"; //"Enable or disable URComments filtering"

window.UrcommentsBrazilianPortugueseURC_Text[10] = "Habilitar os balões com as contagens de URs"; //"Enable UR pill counts"
window.UrcommentsBrazilianPortugueseURC_Text_tooltip[10] = "Habilita / desabilita os balões com contagem de URs"; //"Enable or disable the pill with UR counts"

window.UrcommentsBrazilianPortugueseURC_Text[12] = "Esconder UR em espera"; //"Hide Waiting"
window.UrcommentsBrazilianPortugueseURC_Text_tooltip[12] = "Somente são mostradas as URs que precisam de trabalho (e.g. comentário inicial, fechamento), escondendo as demais"; //"Only show UR that need work (hide inbetween states)"

window.UrcommentsBrazilianPortugueseURC_Text[13] = "Mostrar somente minhas URs"; //"Only show my UR"
window.UrcommentsBrazilianPortugueseURC_Text_tooltip[13] = "Esconde URs que não tenham comentários do editor que está logado"; //"Hide UR where there are zero comments from the logged in editor"

window.UrcommentsBrazilianPortugueseURC_Text[14] = "Mostrar URs vencidas"; //"Show others UR past reminder + close"
window.UrcommentsBrazilianPortugueseURC_Text_tooltip[14] = "Mostra URs que estouraram ambos os prazos de lembrete e fechamento"; //"Show UR that have gone past the reminder and close day settings added together"

window.UrcommentsBrazilianPortugueseURC_Text[15] = "Esconder URs com lembretes necessários"; //"Hide UR Reminders needed"
window.UrcommentsBrazilianPortugueseURC_Text_tooltip[15] = "Esconde URs que necessitam de lembretes para retorno do usuário"; //"Hide UR where reminders are needed"

window.UrcommentsBrazilianPortugueseURC_Text[16] = "Esconder URs com resposta de usuário"; //"Hide user replies"
window.UrcommentsBrazilianPortugueseURC_Text_tooltip[16] = "Esconde as URs que possuem uma resposta do usuário"; //"Hide UR with user replies"

window.UrcommentsBrazilianPortugueseURC_Text[17] = "Esconder URs a serem fechadas"; //"Hide UR close needed"
window.UrcommentsBrazilianPortugueseURC_Text_tooltip[17] = "Esconde URs vencidas que precisam ser fechadas"; //"Hide UR that need closing"

window.UrcommentsBrazilianPortugueseURC_Text[18] = "Esconder URs sem comentários"; //"Hide UR no comments"
window.UrcommentsBrazilianPortugueseURC_Text_tooltip[18] = "Esconde URs que não possuem comentários"; //"Hide UR that have zero comments"

window.UrcommentsBrazilianPortugueseURC_Text[19] = "Esconder URs sem descrição ou comentários"; //"hide 0 comments without descriptions"
window.UrcommentsBrazilianPortugueseURC_Text_tooltip[19] = "Esconde URs que não possuem descrição ou comentários"; //"Hide UR that do not have descriptions or comments"

window.UrcommentsBrazilianPortugueseURC_Text[20] = "Esconder URs com descrição e sem cometários"; //"hide 0 comments with descriptions"
window.UrcommentsBrazilianPortugueseURC_Text_tooltip[20] = "Esconde URs que tenham descrição mas não tenham comentários"; //"Hide UR that have descriptions and zero comments"

window.UrcommentsBrazilianPortugueseURC_Text[21] = "Esconder URs fechadas"; //"Hide Closed UR"
window.UrcommentsBrazilianPortugueseURC_Text_tooltip[21] = "Esconde UR fechadas"; //"Hide closed UR"

window.UrcommentsBrazilianPortugueseURC_Text[22] = "Esconder URs com tags"; //"Hide Tagged UR"
window.UrcommentsBrazilianPortugueseURC_Text_tooltip[22] = "Esconde URs que tenham tags com o estilo URO, ex. [NOTE]"; //"Hide UR that are tagged with URO stle tags ex. [NOTE]"

window.UrcommentsBrazilianPortugueseURC_Text[23] = "Dias para lembrete: "; //"Reminder days: "

window.UrcommentsBrazilianPortugueseURC_Text[24] = "Dias para fechamento: "; //"Close days: "

//settings tab - Aba "Ajustes"
window.UrcommentsBrazilianPortugueseURC_Text[25] = "Comentar automaticamente uma UR nova"; //"Auto set new UR comment"
window.UrcommentsBrazilianPortugueseURC_Text_tooltip[25] = "Envia o comentário (UR comment) automaticamente em novas URs, que ainda não tenham nenhum comentário"; //"Auto set the UR comment on new URs that do not already have comments"

window.UrcommentsBrazilianPortugueseURC_Text[26] = "Enviar lembrete na UR"; //"Auto set reminder UR comment"
window.UrcommentsBrazilianPortugueseURC_Text_tooltip[26] = "Envia automaticamente um lembrete para retorno do usuário nas URs que tenham comente um comentário e que forem mais velhas do que prazo estipulado (dias para lembrete)"; //"Auto set the UR reminder comment for URs that are older than reminder days setting and have only one comment"

window.UrcommentsBrazilianPortugueseURC_Text[27] = "Auto zoom em novas URs"; //"Auto zoom in on new UR"
window.UrcommentsBrazilianPortugueseURC_Text_tooltip[27] = "Zoom automático quando abrir URs que não possuam comentários e quando do envio de lembretes"; //"Auto zoom in when opening URs with no comments and when sending UR reminders"

window.UrcommentsBrazilianPortugueseURC_Text[28] = "Auto centralizar UR";  //"Auto center on UR"
window.UrcommentsBrazilianPortugueseURC_Text_tooltip[28] = "Centralizar o mapa, no zoom atual, quando a UR possuir comentários e quando o zoom for menor que 3"; //"Auto Center the map at the current map zoom when UR has comments and the zoom is less than 3"

window.UrcommentsBrazilianPortugueseURC_Text[29] = "Auto selecionar Aberto, Resolvido, Não Identificado"; //"Auto click open, solved, not identified"
window.UrcommentsBrazilianPortugueseURC_Text_tooltip[29] = "Omite a mensagem sobre quetões pendentes ao usuário e, dependendo dos ajustes para aquele comentário, seleciona Aberto, Resolvido, Não Identificado"; //"Suppress the message about recent pending questions to the reporter and then depending on the choice set for that comment Clicks Open, Solved, Not Identified"

window.UrcommentsBrazilianPortugueseURC_Text[30] = "Salvar automático após um comentário resolvido ou não identificado"; //"Auto save after a solved or not identified comment"
window.UrcommentsBrazilianPortugueseURC_Text_tooltip[30] = "Se a opção \"Auto selecionar Aberto, Resolvido, Não Identificado\" estiver selecionada, esta opção irá clicar o botão salvar após clicar em um comentário (URComments) e, em seguida, no botão enviar"; //"If Auto Click Open, Solved, Not Identified is also checked, this option will click the save button after clicking on a UR-Comment and then the send button"

window.UrcommentsBrazilianPortugueseURC_Text[31] = "Fechamento automático da janela de comentário"; //" Auto close comment window"
window.UrcommentsBrazilianPortugueseURC_Text_tooltip[31] = "A UR que não precisar de salvamento será fechada automaticamente após selecionar um UR-Comment e clicar em enviar"; //"For the user requests that do not require saving this will close the user request after clicking on a UR-Comment and then the send button"

window.UrcommentsBrazilianPortugueseURC_Text[32] = "Recarregar o mapa depois do comentário"; //"Auto reload map after comment"
window.UrcommentsBrazilianPortugueseURC_Text_tooltip[32] = "Recarrega o mapa depois de clicar em um UR-Comment e enviar. Isso força o UOR+ a reaplicar os filtros escolhidos. No momente isso nao se aplica a nenhuma mensagem que foi salva, pois o salvamento automaticamente já recarrega o mapa"; //"Reloads the map after clicking on a UR-Comment and then send button. This forces URO+ to re-apply the chosen URO filters. Currently this does not apply to any messages that get saved. Since saving automatically reloads the map."

window.UrcommentsBrazilianPortugueseURC_Text[33] = "Diminur zoom após comentário"; //"Auto zoom out after comment"
window.UrcommentsBrazilianPortugueseURC_Text_tooltip[33] = "Após clicar em um UR-Comment na lista e enviar na UR, o zoom do mapa volta no mesmo nível que estava anteriormente"; //"After clicking on a UR-Comment in the list and clicking send on the UR the map zoom will be set back to your previous zoom"

window.UrcommentsBrazilianPortugueseURC_Text[34] = "Ativar automaticamente a aba URcomments"; //"Auto switch to the UrComments tab"
window.UrcommentsBrazilianPortugueseURC_Text_tooltip[34] = "Passa automaticamente para a aba URComments após a pagina carregar e ao abrir uma UR. Quando a janela da UR for fechada volta a exibir a aba anterior"; //"Auto switch to the URComments tab after page load and when opening a UR, when the UR window is closed you will be switched to your previous tab"

window.UrcommentsBrazilianPortugueseURC_Text[35] = "Fechar mensagem - duplo clique (auto enviar)"; //"Close message - double click link (auto send)"
window.UrcommentsBrazilianPortugueseURC_Text_tooltip[35] = "Adiciona um link extra no comentário de fechamento que, com duplo clique coloca automaticamente o comentário na janela da UR e o envia. Então, aciona as demais opções que possam estar habilitadas"; //"Add an extra link to the close comment when double clicked will auto send the comment to the UR windows and click send, and then will launch all of the other options that are enabled"

window.UrcommentsBrazilianPortugueseURC_Text[36] = "Todos comentários - duplo clique (auto enviar)"; //"All comments - double click link (auto send)"
window.UrcommentsBrazilianPortugueseURC_Text_tooltip[36] = "Adiciona um link extra em cada comentário da lista que, quando der um clique duplo irá colocar automaticamente o comentário na janela da UR e enviará. Então, aciona as demais opções que possam estar habilitadas"; //"Add an extra link to each comment in the list that when double clicked will auto send the comment to the UR windows and click send, and then will launch all of the other options that are enabled"

window.UrcommentsBrazilianPortugueseURC_Text[37] = "Lista de comentários"; //"Comment List"
window.UrcommentsBrazilianPortugueseURC_Text_tooltip[37] = "Mostra a lista de comentários selecionada. Há suporte para um lista personalizada (custom list) ou, se preferir, pode sugerir modificações na lista dos comentários do script (em inglês - contate rickzabel @waze or @gmail) ou a lista em português-Brasil (contate Murilo-Carvalho @waze)"; //"This is shows the selected comment list, there is support for a custom list or If you would like your comment list built into the this script or have suggestions on the Comments team’s list please contact me at rickzabel @waze or @gmail"

window.UrcommentsBrazilianPortugueseURC_Text[38] = "Desabilitar botões \"Concluído\" \/ \"Próximo\" "; //"Disable done / next buttons"
window.UrcommentsBrazilianPortugueseURC_Text_tooltip[38] = "Desabilita os botões Concluído / Próximo localizados na parte inferior da janela da UR"; //"Disable the done / next button at the bottom of the new UR window"

window.UrcommentsBrazilianPortugueseURC_Text[39] = "Deixar de seguir UR após envio"; //"Unfollow UR after send"
window.UrcommentsBrazilianPortugueseURC_Text_tooltip[39] = "Deixa de seguir uma UR após o envio do comentário"; //"Unfollow UR after sending comment"

window.UrcommentsBrazilianPortugueseURC_Text[40] = "Auto envio de lembretes"; //"Auto send reminders"
window.UrcommentsBrazilianPortugueseURC_Text_tooltip[40] = "Envia automaticamente lembretes para minhas URs, se estiverem na tela"; //"Auto send reminders to my UR as they are on screen"

window.UrcommentsBrazilianPortugueseURC_Text[41] = "Substituir com o nome do editor"; //"Replace tag name with editor names"
window.UrcommentsBrazilianPortugueseURC_Text_tooltip[41] = "Quando uma UR contém o nome de um editor (normalmente, enviada pelo próprio editor) o nome nos balões é substituído pelo do editor"; //"When a UR has the logged in editors name in it replace the tag type with the editors name"

window.UrcommentsBrazilianPortugueseURC_Text[42] = "(Duplo Clique)"; //double click to close links
window.UrcommentsBrazilianPortugueseURC_Text_tooltip[42] = "Duplo Clique aqui para auto enviar -  "; //"Double click here to auto send - "

window.UrcommentsBrazilianPortugueseURC_USER_PROMPT[0] = "UR Comments - Você está com uma versão antiga do arquivo dos comentários personalizados (custom comments) ou um erro de sintaxe que está impedindo o carregamento da lista de comentários. Missing: "; //"UR Comments - You either have a older version of the custom comments file or a syntax error either will keep the custom list from loading. Missing: "

window.UrcommentsBrazilianPortugueseURC_USER_PROMPT[1] = "UR Comments - Os seguintes items estão faltando na sua lista de comentários: "; //"UR Comments - you are missing the following items from your custom comment list: "

window.UrcommentsBrazilianPortugueseURC_USER_PROMPT[2] = " Lista não pode ser encontrada. Você pode obtê-la, assim como as devidas instruções em  https://wiki.waze.com/wiki/User:Rickzabel/UrComments/"; //" List can not be found you can find the list and instructions at https://wiki.waze.com/wiki/User:Rickzabel/UrComments/"

window.UrcommentsBrazilianPortugueseURC_USER_PROMPT[3] = "URComments - Você não pode ajustar os dias para fechamento em \"0\""; //"URComments you can not set close days to zero"

window.UrcommentsBrazilianPortugueseURC_USER_PROMPT[4] = "URComments - Para usar os links com duplo clique você deve habilitar a opção de auto ajuste (autoset) no status da UR status"; //"URComments to use the double click links you must have the autoset UR status option enabled"

window.UrcommentsBrazilianPortugueseURC_USER_PROMPT[5] = "abortando FilterURs2 pois a filtragem, contagem e auto lembretes estão desabilitados"; //"aborting FilterURs2 because both filtering, counts, and auto reminders are disabled"

window.UrcommentsBrazilianPortugueseURC_USER_PROMPT[6] = "URComments: Time out no carregamento dos dados da UR, tentando novamente."; //"URComments: Loading UR data has timed out, retrying." - this message is shown across the top of the map in a orange box, length must be kept short

window.UrcommentsBrazilianPortugueseURC_USER_PROMPT[7] = "URComments: adicionando lembrete na UR: "; // "URComments: Adding reminder message to UR: " - this message is shown across the top of the map in a orange box, length must be kept short

window.UrcommentsBrazilianPortugueseURC_USER_PROMPT[8] = "Filtragem de URs pelo URComments foi desabilitada pois os filtros de URO estão ativos"; //"URComment's UR Filtering has been disabled because URO\'s UR filters are active." - this message is shown across the top of the map in a orange box, length must be kept short

window.UrcommentsBrazilianPortugueseURC_USER_PROMPT[9] = "UrComments detectou que você possui mudanças não salvas!\n\nCom a opção de salvamento automático ativada e com mudanças não salvas você não pode enviar comentários que exigem que o script efetue salvamentos. Por favor salve suas mudanças e então selecione novamente o comentário que deseja enviar"; //"UrComments has detected that you have unsaved changes!\n\nWith the Auto Save option enabled and with unsaved changes you cannot send comments that would require the script to save. Please save your changes and then re-click the comment you wish to send."

window.UrcommentsBrazilianPortugueseURC_USER_PROMPT[10] = "URComments: não pode achar a caixa de comentários! Para o correto funcionamento do script você precisa ter uma UR aberta"; //"URComments: Can not find the comment box! In order for this script to work you need to have a user request open." - this message is shown across the top of the map in a orange box, length must be kept short

window.UrcommentsBrazilianPortugueseURC_USER_PROMPT[11] = "URComments: Isto irá enviar lembretes de acordo com os dias colocados no respectivo ajuste. Somente ocorre quando estiverem na área visível. NOTA: quando usar essa função você não deve deixar nenhuma UR aberta a menos que vc tenha perguntas que necessitem de uma resposta do usuário, pois o script irá enviar os lembretes (cobranças por resposta)"; //"URComments This will send reminders at the reminder days setting. This only happens when they are in your visible area. NOTE: when using this feature you should not leave any UR open unless you had a question that needed an answer from the wazer as this script will send those reminders. " - conformation message/ question



//The comment array should follow the following format,
// "Title",     * is what will show up in the URComment tab
// "comment",   * is the comment that will be sent to the user currently 
// "URStatus"   * this is action to take when the option "Auto Click Open, Solved, Not Identified" is on. after clicking send it will click one of those choices. usage is. "Open", or "Solved",or "NotIdentified",
// to have a blank line in between comments on the list add the following without the comment marks // there is an example below after "Thanks for the reply"
// "<br>",
// "",
// "",

//BrazilianPortuguese list
window.UrcommentsBrazilianPortugueseArray2 = [			    
				"Resolvido",
                "Caro wazer, o problema foi resolvido. Aguarde a atualização do mapa internacional (INTL), que pode ser acompanhada em: http://status.waze.com/ . Os mapas do Waze são criados e mantidos pelos próprios usuários, assim como eu e você. Participe! Conheça o nosso fórum e participe dele: http://forum.wazebrasil.com ",
                "Solved",
    
                "1ª Advertência sem retorno (3 ou 7 dias sem resposta)",
                "Caro Wazer, por favor envie resposta, pois está impossível identificar o problema com os dados atuais e sem sua participação.",
                "Open",

                "2ª Advertência sem retorno (14º dia sem resposta)",
                "Fechado porque o erro não foi identificado e  faltou participação do autor do alerta. Os mapas do Waze são criados e mantidos pelos próprios usuários, assim como eu e você. Participe! Conheça o nosso fórum e participe dele: http://forum.wazebrasil.com",
                "NotIdentified",
            
				"Não identificado - enfático",
				"O alerta será fechado por falta de informações. Uma pena, pois o mapa do Waze é feito pelos seus próprios usuários e não há melhor fonte de informação do que aqueles que conhecem o local. A utilização indevida do *Alerta de erro no mapa* pode resultar em perda de pontos. Se quiser saber mais sobre como ajudar sua região com atualizações de mapas: https://www.waze.com/pt-BR/editor . Infos sobre como editar: http://goo.gl/3aI1yz",
				"NotIdentified",

				"Não identificado - enfático 2",
				"Caro Wazer, você abriu um alerta de erro no mapa, isso aciona imediatamente uma rede de editores que também são usuários como você, porém atuam voluntariamente para tornar o mapa mais correto e atualizado possível para todos os usuários. Infelizmente, com os dados atuais, não conseguimos compreender corretamente qual foi o problema encontrado. Sua participação é muito importante. Por favor, evite enviar alertas sem necessidade. Obrigado e ficamos no aguardo! Conheça nosso fórum e saiba mais: http://forum.wazebrasil.com Participe: http://www.waze.com/editor/ ",
				"NotIdentified",
       
				"Nome de rua errado",
				"Caro Wazer, qual o nome que está incorreto no mapa e qual o nome correto? Por favor, responda pelo próprio Waze, no celular, ao final desta mensagem. Aguardo seu contato por 1 dia.",
				"Open",

				"Erro na numeração da via",
				"Caro Wazer, qual via está com a numeração incorreta? Qual era o número que você procurava?",
				"Open",

                "Numeração de vias corrigida",
                "Foi corrigida a numeração da via. Aguarde a atualização do mapa intl, que demora cerca de 3 dias e pode ser acompanha em: http://status.waze.com/ Caso tenha salvo o local no histórico ou favoritos, exclua-os e faça uma nova pesquisa pelo endereço. Conheça o nosso fórum e participe dele: http://forum.wazebrasil.com",
				"Solved",    
    
                "Via bloqueada",
                "Caro Wazer, qual rua está bloqueada? Entre quais cruzamentos é o bloqueio? Por quanto tempo?", 
                "Open",
    
				"Semáforo",
				"Caro Wazer, no Waze, semáforos somente são marcados se puderem detectar o avanço de sinal vermelho e/ou puderem aferir velocidade máxima permitida. É o caso desse semáforo?",
                "Open",
    
				"Pedágio",
				"Caro Wazer, essa via já está marcada como pedagiada nesse ponto. Não há aviso no app para esse tipo de evento. Apenas é levado em conta no cálculo da rota para evitar esse tipo de via, caso assim esteja configurado no app. Caso seja sobre a pergunta se você está no trânsito, por causa da diminuição da velocidade, isso somente com o tempo, até o waze ter dados suficientes para entender que não há engarrafamento no local. Conheça o nosso fórum e participe dele: http://forum.wazebrasil.com",
				"NotIdentified",
    
				"Locais errados no Google Maps",
				"Caro Wazer, esse local já está correto no Waze. O problema está no Google Maps, o qual o Waze também usa para sugerir resultados. Prefira sempre os resultados do próprio Waze, ou mesmo do Foursquare, pois são os que menos apontam/levam para localização errada. Quando o resultado errado vem de alguma fonte externa (em geral, Google), a correção deverá ser feita diretamente no editor dessa fonte da informação. Conheça o nosso fórum e participe dele: http://forum.wazebrasil.com",
				"NotIdentified",
                
				"Erro já corrigido, mas mapa desatualizado",
                "Caro Wazer, havia uma falha que já foi corrigida. No entanto, o mapa ainda não foi compilado com a correção. Estamos aguardando a atualização do mapa intl, que pode ser acompanha em: http://status.waze.com/. Depois da compilação do mapa, talvez seja necessário forçar a atualização do mapa limpando o cache no seu aparelho (Waze > Configurações > Avançado > Transferência de dados > Atualizar mapa da minha área). Conheça o nosso fórum e participe dele: http://forum.wazebrasil.com",
                "Solved",

                "Fechamento de uma via",
                "Você sabe por quanto tempo uma via vai ficar fechada? No caso de um fechamento por poucos dias, os editores voluntários não podem ajudar muito. O tempo que vai levar para o bloqueio aparecer no mapa do aplicativo pode ser até maior que o do bloqueio em si! Quando encontrar um bloqueio por um período curto de tempo, por favor use a função Alertar > Bloqueio do aplicativo. Caso seja um bloqueio por um longo tempo, por favor responda esse alerta de erro no mapa (UR) enviando o máximo de detalhes possível. Obrigado!",
                "Open",	

				"<br>",
                "",
                "",

			    "Sinal de GPS ruim",
                "Parece que houve um problema na recepção de sinal de GPS no seu dispositivo. O sinal de GPS não cruza veículos e edifícios altos. Por favor, certifique-se de posicionar seu aparelho em local com vista direta para o céu.",
                "NotIdentified",
				
				"Rota válida",
                "Nós revisamos seu alerta de erro no mapa (UR) e não encontramos nenhum erro no mapa. Parece que o Waze lhe forneceu a rota correta. Tente se manter na rota sugerida pelo Waze na próxima vez pois, provavelmente, é a mais rápida. Caso contrário, você estará dizendo ao Waze que a rota é mais lenta e que a executada por você deve ser preferida.",
                "NotIdentified",

				"Notificação ao município",
				"Somente podemos ajudar com problemas no mapa. Esse tipo de relato tem que ser enviado para o município. Por favor continue reportando problemas do mapa caso os encontre. Obrigado!",
				"NotIdentified",

				"Usuário sem tag de pedágio (evitar pedágios)",
				"O Waze roteará pelos caminhos mais rápidos. Porém, ele não sabe se você tem um tag para pedágio (p.ex. sem parar). Logo, caso prefira não ter sugestões de rotas com pedágio, habilite essa opção em Configurações > Navegação > Evitar vias com pedágio. Obrigado!",
				"NotIdentified",

				"Retornos em U",
				"Atualmente, o Waze não lhe diz para fazer um retorno em U (\"U-turn\"). Ele irá rotear em várias conversões à esquerda/direita para criar um retorno. Esta é uma limitação da programação e não pode ser alterada pelos editores voluntários. A equipe do Waze está trabalhando em um ajuste. Obrigado!",
				"NotIdentified",
				
				"Tráfego - informações desatualizadas",
                "Waze utiliza dados de trânsito com base nas pessoas que usam o aplicativo. Os editores de mapa voluntários não podem editar as condições reportadas pelo aplicativo. No caso de um acidente ou uma lentidão recentes, o Waze ainda não tem qualquer dado dessa situação. Após a identificação da lentidão no trânsito, ele irá lembrar disso por um certo período mesmo após a situação ter se normalizado.",
                "NotIdentified",

                "Tráfego - congestionamento",
                "Para reportar um congestionamento no trânsito use o aplicativo do Waze clicando no ícone de alerta no canto inferior direito e clicando em Trânsito > Parado. Os avisos de trânsito podem ajudar a melhorar sua rota e a de outros Wazers em tempo real. Detalhes em https://wiki.waze.com/wiki/Como_Alertar#Tr.C3.A2nsito_.28Engarrafamento.29 Obrigado!",
                "NotIdentified",
				
				"Radares",
                "Este é o canal para reportar erros de navegação e de mapa. Radares deverão ser alertados através do botão \"Alerta\" do aplicativo conforme as instruções: https://wiki.waze.com/wiki/Como_Alertar#Radar . Obrigado!",
                "NotIdentified",
				
				"Restrições já incluídas",
				"Esta restrição está incluída no mapa. O Waze não roteará por essa conversão ilegal. Caso contrário, por favor envie um novo alerta de erro no mapa (UR). Obrigado!",
				"NotIdentified",
				
				"Bloqueio temporário",
				"Caro Wazer, se a rua estiver completamente bloqueada use a função Alertar > Bloqueio. Desse modo, você e outros serão roteados para contornar o bloqueio. Caso contrário, pode usar Alertar > Tráfego. Nesse caso, o Waze irá aprender que essa rota é mais lenta e irá rotear por uma mais rápida.",
				"NotIdentified",

				/*
				"Closure clean-up",
				"Due to daily changing closures we are closing out the old requests to concentrate on the newest ones. For closures that last only a few days, the volunteer map editors cannot be much help. It takes at least that long for our edits to make it to the live map! When you encounter short-term road closures in the future, please use the Report > Closure feature built into the Waze app. Thanks!",
				"NotIdentified",
				*/

				"Obrigado pela resposta",
                "Obrigado pela resposta! Esse alerta de erro no mapa (UR) será fechado. Conforme você dirige com o Waze, por favor reporte quaisquer problemas no mapa que encontrar. Dúvidas, visite nosso fórum: https://www.waze.com/forum/viewforum.php?f=298 ",
                "NotIdentified",	
				
				"Sem comunicação adicional",
                "Nenhuma resposta adicional foi recebida e o alerta de erro no mapa (UR) está sendo fechado. Conforme você dirige com o Waze, por favor reporte quaisquer problemas no mapa que encontrar. Obrigado!",
                "NotIdentified", 

				"<br>",
                "",
                "",
				
				"Ajustes de endereço",
				"Obrigado! O endereço foi ajustado. A atualização deverá aparecer nos dispositivos móveis dentro de poucos dias, mas, em raras ocasiões, poderá demorar até uma semana.",
				"Solved",				

                "Ajuste de números de casas",
                "Forçamos o Waze a re-registrar os números das casas no seu destino. Isso deve corrigir o problema. Espere 48 horas para que as mudanças apareçam no mapa em tempo real. Se tiver o local salvo nas suas buscas ou nos favoritos, remova-os e adicione-os novamente. Diga-nos se isso resolveu seu problema. Caso contrário, mande outro alerta de erro no mapa (UR). Obrigado! Dúvidas, visite nosso fórum: https://www.waze.com/forum/viewforum.php?f=298 ", 
                "Solved",
				
				"Busca de endereço",
				"Este é o canal para reportar erros de navegação e de mapa. O campo para se digitar um endereço está em outro lugar. Vide instruções: https://wiki.waze.com/wiki/Como_Navegar ",
				"NotIdentified",
				
				"Pergunta por endereço",
                "Waze não nos fornece o seu endereço de saída ou de chegada. Você poderia nos dizer qual o início da sua rota e qual o destino que você entrou no Waze? Obrigado!",
                "Open",

                "O problema parece resolvido",
                "Lembrete: O problema parece que foi resolvido. Por favor nos avise se continuar a vê-lo. Caso não responda, fecharemos essa UR. Obrigado!",
                "Open", 
 
				"Numeração (Finesko)",
				"Para um resultado mais exato na busca pela numeração, veja se este processo funciona:\n1 - Procure simplesmente \"Paulista 2000\", por exemplo, sem usar \"Rua\" ou \"Avenida\" antes;\n2 - Clique em buscar ou na lupa. Não escolha o resultado automático;\n3 - Neste exemplo, escolha o resultado no formato \"2000 Av. Paulista, São Paulo\". Este formato com o número antes indica ser do mapa do Waze mesmo.\n4 - Certifique-se de escolher os resultados do Waze mesmo. No rodapé, você pode escolher de onde vem os resultados.\n5 - Apague qualquer favorito que tenha com o endereço. Se o favorito estiver errado, ele sempre ficará errado.",
				"Open",
				
				"Resolução - vias próximas",
				"O GPS não consegue distinguir entre as vias paralelas muito próximas. Apenas quando a distância aumenta é que ele pode perceber o erro.\n\nVocê precisa cuidar para estar na via que o Waze acha que você está. Se não estiver, o melhor é cancelar a navegação e esperar ele \"te achar\" na pista certa e então reiniciar a navegação.",
				"NotIdentified",
				
				"Mapa não carrega",
				"Não é um problema do mapa. Pode ser de transmissão de dados, da instalação do APP ou do aparelho.\n\nProcure mais informações em www.waze.com/support ou pela central de ajuda nas configurações do próprio aplicativo.\n\nEste canal é para indicar erros no mapa, como conversões proibidas ou alteração de ruas.\n\nObrigado.",
				"NotIdentified",
				
				"Limpar comentário e selecionar status da UR para Aberto",
                "",
                "Open",
				
				"Incluir descrição do usuário",
                "Você reportou \"$URD\", mas o Waze não nos enviou informações o suficiente para corrigirmos o problema reportado. Por favor especifique o que houve de errado com a rota gerada pelo Waze. Poderia nos dizer qual o destino que você colocou no Waze? Obrigado!",
				"Open",
				
				"Nome de rua errado",
				"O Waze não nos enviou informações o suficiente para corrigirmos o problema reportado. Você poderia nos dizer que o nome da rua que você imagina que esteja incorreto e qual seria o nome correto? Obrigado!",
				"Open",
				
				"<br>",
                "",
                "",

                "Usuário seguiu a rota do Waze",
                "Parece que você seguiu a rota sugerida pelo Waze. Poderia nos informar o que houve de errado com essa rota?  Qual o destino que você entrou no Waze? Obrigado!",
                "Open",

                "Resposta de 48 Horas",
                "Fizemos algumas alterações no mapa. Por favor, espere mais umas 48 horas para as alterações aparecerem no mapa do aplicativo.",
                "Open",

                "Limpar o TTS Cache",
                "Por favor limpe o cache do Text-to-Speech. No campo de procura por endereços, digite cc@tts. Você verá a mensagem que o arquivo TTS foi apagado. Em poucos dias o nome das ruas atualizado será baixado no aplicativo. Obrigado!",
                "Open",

				"Pontes ou vias inexistentes",
                "As vias dessa área foram amplamente mapeadas e os editores voluntários não encontraram nada faltante no mapa. Conforme você se movimenta, o Waze deliberadamente não mostra alguns pontos ao redor para evitar uma poluição visual na tela. Se você tem certeza que alguma coisa está faltando no mapa, por favor responda esse alerta de erro no mapa (UR) com o máximo possível de informações sobre isso. Obrigado!",
                "Open",

				"Atualização manual",
                "Por favor tente estas opções. No aplicativo do Waze vá em Menu > Configurações > Config. Avançadas > Transferência de Dados > Atualizar mapa da minha área. Você também pode tentar limpar o cache do aplicativo no gerenciador do seu smartphone. Por último, tente resetar o aplicativo digitando ##@resetapp no campo de busca e clicando em procurar.", 
                "Open",

                "Pavimentar via",
                "Você pode pavimentar uma via a partir do aplicativo clicando no ícone de alerta > Erro Mapa > aba Pavimentar. Após clique em Pavimentar. Quando terminar, clique no rolo compressor > Parar pavimentação. Você pode fornecer informações sobre a nova via, tais como o nome, clicando no ícone de alerta > Erro Mapa > Via inexistente. Obrigado!",
                "Open",

                "A via foi fechada",
                "Obrigado pelo seu alerta de erro no mapa (UR). A via foi fechada.", 
                "Open",

                "Correção iniciada",
                "Começamos o processo para corrigir o problema. Obrigado pelo seu alerta de erro no mapa (UR)!",
				"Open",
				
				"<br>",
                "",
                "",


//novos avisos
"Bug do aplicativo", 
"Infelizmente, nessa situação, não há nada de errado com o mapa que possa estar provocando esses defeitos no aplicativo. Se o erro continuar, por favor reporte-o em https://support.google.com/waze/answer/6090951?hl=en",
"NotIdentified",

"<br>",
"",
"",

				//Default URs  6 through 22 are all the different types of UR that a user can submit do not change them thanks
				//"Incorrect turn", //6
                "Conversão incorreta",
				"Poderia especificar em qual conversão foi o problema? Se possível, nos diga qual o destino que você entrou no Waze. Obrigado!",
                "Open",

                //"Incorrect address", //7
				"Endereço incorreto",
                "O Waze não nos enviou informações o suficiente para corrigirmos o problema reportado. Poderia especificar qual o destino que você colocou no Waze? Qual o problema que você teve com esse endereço? Obrigado!",
				"Open",

                //"Incorrect route", //8
                "Instruções incorretas de rotas",
				"O Waze não nos enviou informações o suficiente para corrigirmos o problema reportado. Poderia nos dizer o que houve de errado com a rota que o Waze lhe deu? Qual o destino que você colocou no Waze? Obrigado!",
				"Open",
				
                //"Missing roundabout", //9
				"Rotatória inexistente",
                "Caro Wazer, por favor nos informe entre quais cruzamentos há uma rotatória. Obrigado!",
                "Open",

                //"General error", //10
                "Erro geral no mapa",
				"Caro Wazer! Não foi possível compreender o problema reportado. Poderia nos fornecer mais detalhes, por favor?",
    			"Open",

                //"Turn not allowed", //11
                "Curva proibida",
				"Poderia nos informar qual conversão é ou deveria ser proibida, assim como os nomes das ruas da interseção? Obrigado!",
                "Open",

                //"Incorrect junction", //12
                "Cruzamento incorreto",
				"O Waze não nos enviou informações o suficiente para corrigirmos o problema reportado. Poderia nos dizer o que houve de errado com a rota que o Waze lhe deu? Qual o destino que você colocou no Waze? Obrigado!",
				"Open",

                //"Missing bridge overpass", //13
                "Ponte ou viaduto inexistente",
				"Poderia nos dizer qual a ponte ou viaduto que você acredita que seja inexistente? Quando dirigindo em velocidades de rodovias, o Waze deliberadamente não mostra alguns pontos próximos para evitar poluição visual na tela. Por favor nos informe o máximo possível sobre essa erro. Obrigado!",
                "Open",

                //"Wrong driving direction", //14
				"Sentido de condução incorreto",
                "Por favor nos informe o que houve de errado com a rota que o Waze lhe deu. Poderia nos dizer qual o destino que você entrou no Waze? Obrigado",
                "Open",
			
                //"Missing Exit", //15
                "Saída inexistente",
				"Por favor nos informe o máximo de detalhes possível sobre essa saída inexistente. Obrigado!",
                "Open",

                //"Missing Road", //16
                "Via inexistente",
				"Poderia nos informar o máximo possível sobre a via que você acredita que esteja faltando? Obrigado!", 
                "Open",

                //"Missing Landmark", //18
                "Ponto de referência inexistente",
				"Caro Wazer, poderia nos dizer qual o ponto está faltando. Lembre-se que você pode adicioná-lo direto pelo aplicativo. Obrigado",
                "Open"

                /*
				//"Blocked Road", //19
                "Via bloqueada",
				"Volunteer responding,",
                "Open",

                //"Missing Street Name", //21
                "Nome de rua faltando",
				"Volunteer responding,",
                "Open",

                //"Incorrect Street Prefix or Suffix", //22
                "Sufixo ou prefixo de rua incorreto",
				"Volunteer responding,",
                "Open",


                */
				
//End of Default URs 
];
//end BrazilianPortuguese list