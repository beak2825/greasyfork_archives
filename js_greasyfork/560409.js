// ==UserScript==
// @name         Amazon Enhancement
// @name:zh-CN   亚马逊增强工具
// @name:zh-TW   亞馬遜增強工具
// @name:ja      Amazon強化ツール
// @name:ko      아마존 개선 도구
// @name:de      Amazon Verbesserungen
// @name:fr      Améliorations Amazon
// @name:es      Mejoras en Amazon
// @name:it      Miglioramenti Amazon
// @name:pt      Melhorias na Amazon
// @name:ru      Улучшения Amazon
// @name:ar      تحسينات أمازون 
// @name:nl      Amazon Verbeteringen 
// @name:pl      Ulepszenia Amazon
// @name:tr      Amazon İyileştirmeleri
// @name:vi      Cải thiện Amazon
// @name:th      การปรับปรุง Amazon
// @name:uk      Покращення Amazon
// @namespace    http://tampermonkey.net/
// @version      2.2.2
// @description  Comprehensive Amazon improvements: filter sponsored content, remove Rufus AI, reduce CPU usage
// @description:zh-CN  亚马逊全面优化：过滤赞助商品、移除Rufus AI元素、降低CPU占用
// @description:zh-TW  亞馬遜全面優化：過濾贊助商品、移除Rufus AI元素、降低CPU占用
// @description:ja     Amazonの包括的な改善：スポンサー商品をフィルタリング、Rufus AI要素を削除、CPU使用率を低減
// @description:ko     아마존 종합 개선: 스폰서 상품 필터링, Rufus AI 요소 제거, CPU 사용량 감소
// @description:de     Umfassende Amazon-Verbesserungen: Gesponserte Inhalte filtern, Rufus AI-Elemente entfernen, CPU-Nutzung reduzieren
// @description:fr     Améliorations complètes d'Amazon : filtrer le contenu sponsorisé, supprimer les éléments Rufus AI, réduire l'utilisation du CPU
// @description:es     Mejoras integrales en Amazon: filtrar contenido patrocinado, eliminar elementos de Rufus AI, reducir uso de CPU
// @description:it     Miglioramenti completi per Amazon: filtra contenuti sponsorizzati, rimuovi elementi Rufus AI, riduci utilizzo CPU
// @description:pt     Melhorias abrangentes na Amazon: filtrar conteúdo patrocinado, remover elementos Rufus AI, reduzir uso de CPU
// @description:ru     Комплексные улучшения Amazon: фильтрация спонсорского контента, удаление элементов Rufus AI, снижение нагрузки на CPU
// @description:ar     تحسينات شاملة لأمازون: تصفية المحتوى المُعلَّن، إزالة عناصر Rufus AI، تقليل استهلاك CPU
// @description:nl     Uitgebreide Amazon-verbeteringen: gesponsorde inhoud filteren, Rufus AI-elementen verwijderen, CPU-gebruik verminderen
// @description:pl     Kompleksowe ulepszenia Amazon: filtruj treści sponsorowane, usuń elementy Rufus AI, zmniejsz zużycie CPU
// @description:tr     Kapsamlı Amazon iyileştirmeleri: sponsorlu içeriği filtrele, Rufus AI öğelerini kaldır, CPU kullanımını azalt
// @description:vi     Cải thiện toàn diện Amazon: lọc nội dung tài trợ, xóa các phần tử Rufus AI, giảm sử dụng CPU
// @description:th     การปรับปรุง Amazon อย่างครอบคลุม: กรองเนื้อหาที่ได้รับการสนับสนุน, ลบองค์ประกอบ Rufus AI, ลดการใช้ CPU
// @description:uk     Комплексні покращення Amazon: фільтрація спонсорського контенту, видалення елементів Rufus AI, зниження навантаження на CPU
// @author       aspen138
// @match        https://*.amazon.com/*
// @match        https://*.amazon.co.uk/*
// @match        https://*.amazon.ca/*
// @match        https://*.amazon.de/*
// @match        https://*.amazon.fr/*
// @match        https://*.amazon.co.jp/*
// @match        https://*.amazon.it/*
// @match        https://*.amazon.es/*
// @match        https://*.amazon.in/*
// @match        https://*.amazon.com.au/*
// @match        https://smile.amazon.com/*
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_registerMenuCommand
// @license      MIT
// @run-at       document-start
// @icon         data:image/x-icon;base64,AAABAAQAMDAAAAEAIACoJQAARgAAACAgAAABACAAqBAAAO4lAAAYGAAAAQAgAIgJAACWNgAAEBAAAAEAIABoBAAAHkAAACgAAAAwAAAAYAAAAAEAIAAAAAAAgCUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///0X///+Z////zP////P////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////w////zP///5P///8/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8k////wP//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////t////x4AAAAAAAAAAAAAAAAAAAAAAAAAAP///0L////z///////////////////////////////////////////////////////////////////////////X7///u+T//5DV//+R1f//csr//1C+//+Cz///kdX//5/Z///L6v//8vr//////////////////////////////////////////////////////////////////////////////////////+3///85AAAAAAAAAAAAAAAA////Lf////D///////////////////////////////////////////////////////////////+85f//csr//xOt//8AqP//AKj//wCn//8Ap///AKf+/wCn//8AqP//AKf//wCn//8Ap///AKj//z64//+Q1f//2PD////////////////////////////////////////////////////////////////////////////q////JAAAAAAAAAAA////zP/////////////////////////////////////////////////////y+v//kNX//xOs//8Ap///AKf//wCo//8Ap///AKf//wCo//8AqP//AKf//wCn/v8Ap///AKj//wCn//8AqP//AKf//wCn//8Ap///AKf//z64//+u4P//////////////////////////////////////////////////////////////////////vQAAAAD///9R////////////////////////////////////////////////8vr//5HV//8TrP//AKj//wCo//8AqP//AKj//wCo//8Ap///AKf//wCn//8AqP//AKf//wCo//8AqP//AKj//wCn//8Ap/7/AKf//wCo//8AqP//AKf//wCo//8Ap///KbL//67g////////////////////////5fT//////////////////////////////////////0L///+l//////////////////////////////////////////+75P//E63//wCn//8Ap///AKf//wCn/v8AqP//AKf//wCo//8psv//UL///4LQ//+R1f//kNX//5DV//+Q1f//kNX//5HV//9hw///UL7//wCo//8Ap/7/AKj//wCn//8Ap///AKj//wCn//9Qvv//5vX/////////////Ub///5DV/////////////////////////////////5b////q////////////////////////////////8vr//3LK//8AqP//AKf//wCn//8AqP//AKj//1C///+R1f//y+r////////////////////////////////////////////////////////////////////////Y7///rd///3LJ//8Trf//AKf+/wCn//8AqP//E63//7zl////////n9r//wCo///l9P///////////////////////////9v////////////////////////////////Y7///Prj//wCn//8Ap///AKf+/1C+//+t3///8vr/////////////////////////////////////////////////////////////////////////////////////////////////////////////vOX//3LK//8Ap///AKf//wCo//+t3///2O///wCn//9zyv////////////////////////////n//////////////////////////9jw//8Trf//AKf//wCn//9yyf//5fT////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////y+v//kNX//xOt//9hw////////xOt//8Trf//////////////////////////////////////////////////u+T//xOt//8AqP//csn//+X0/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////1G///8Ap///5vX////////////////////////////////////////Y7///AKj//1C+///l9f///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9jv//8Ap///Ub///2HD//+Q1f//csr//wCn//8Ap///y+r////////////////////////////////////////Y8P//ruD////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////L6v//YsP//wCn//8Ap///AKj//wCo//8Ap///2PD///////////////////////////////////////////////////////////////////////////////////////////////////Pz8/+ioqL/VlZU/x0dG/8FBQT/BQUD/x0dHP9WVlX/hoaE/9jY2P////////////////////////////////++vr7/VlZV/6Kiov/////////////////////////////////K6f//yun//8rq///l9P//////////////////////////////////////////////////////////////////////////////////////////////////oqKi/x0dHP8FBQT/BQUE/wUFBP8FBQT/BQUE/wUFBP8FBQP/BQUE/wUFBP9WVlT/5ubm/////////////////7Cwr/8FBQT/BQUE/wUFBP92dnb///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+GhoX/BQUE/wUFBP8FBQT/BQUD/wUFBP8FBQT/BQUE/wQEA/8FBQT/BQUD/wUFA/8FBQT/HR0c/7Cwr///////2dnZ/wUFBP8FBQT/BQUE/wUFBP8FBQT/Z2dm//Ly8v///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////729vf8FBQP/BQUE/wUFBP8FBQT/BQUE/wUFA/8FBQT/BQUE/wUFBP8FBQP/BQUD/wUFBP8FBQT/BQUE/wUFBP+ioqL/MjIw/wUFBP8FBQT/BQUD/wUFA/8FBQT/BQUE/0REQ//y8vL//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////zExMP8FBQT/BQUD/wUFBP8FBQT/BQUE/wUFBP8FBQP/BQUE/wUFBP8FBQT/BQUE/wUFBP8FBQT/BQUE/wUFBP8FBQT/BQUE/wUFBP8FBQT/BQUD/wUFBP8FBQT/BQUE/wUFBP8dHRv/////////////////////////////////////////////////////////////////////////////////////////////////////////////////2dnZ/wUFBP8FBQT/BQUE/wUFBP8FBQT/BQUE/wUFBP8FBQT/BQUE/wUFBP8dHRz/BQUE/wUFBP8FBQT/BQUD/wUFBP8FBQP/BQUE/wUFBP8FBQT/BQUD/wUFBP8FBQT/BQUE/wUFBP8yMjD/////////////////////////////////////////////////////////////////////////////////////////////////////////////////lJST/wUFBP8FBQT/BQUE/wUFBP8FBQT/BQUE/wUFBP8FBQT/HR0c/8zMzP///////////8zMzP8xMTD/BQUE/wUFBP8FBQT/BQUD/wUFA/8FBQT/BQUE/wUFBP8FBQT/BQUE/wUFBP/MzMz/////////////////////////////////////////////////////////////////////////////////////////////////////////////////hoaF/wUFBP8FBQT/BQUE/wUFBP8FBQT/BQUE/wUFBP8FBQP/zMzM///////////////////////y8vL/HR0c/wUFBP8FBQT/BQUE/wUFBP8FBQT/BQUE/wUFBP8FBQP/BQUE/4aGhP//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VlZV/wUFBP8EBAP/BQUD/wUFA/8FBQT/BQUE/wUFBP9FRUT/////////////////////////////////sLCv/wUFBP8FBQT/BQUE/wUFBP8FBQT/BQUE/wUFBP8FBQT/BQUE/+Xl5f//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////ZmZl/wUFA/8FBQT/BQUD/wUFBP8FBQT/BQUE/wUFBP9VVVT//////////////////////////////////////zExMP8FBQT/BQUE/wUFBP8FBQT/BQUE/wUFBP8FBQT/VlZV////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////lJST/wUFBP8FBQT/BQUE/wUFBP8FBQT/BQUE/wUFBP9WVlX//////////////////////////////////////3Z2dv8FBQT/BQUE/wUFBP8FBQT/BQUE/wUFBP8FBQT/VlZV////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////sbGw/wUFBP8FBQT/BQUE/wUFBP8FBQT/BQUE/wUFA/8dHRz//////////////////////////////////////5SUk/8FBQP/BQUE/wUFA/8FBQT/BQUE/wUFBP8FBQT/VlZU////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8vLy/wUFA/8FBQP/BQUD/wUFBP8FBQT/BQUE/wUFBP8FBQT/oqKi/////////////////////////////////5SUk/8FBQP/BQUE/wUFBP8FBQT/BQUD/wUFBP8FBQP/VlZV/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////3Z2dv8FBQT/BQUE/wUFBP8FBQT/BQUE/wUFA/8FBQT/HR0c/729vf///////////////////////////83Nzf8FBQT/BQUE/wUFBP8FBQT/BQUE/wUFBP8FBQT/VlZV/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+bm5v8dHRz/BQUD/wUFA/8FBQT/BQUE/wUFBP8EBAP/BQUE/wUFBP9WVlX/vb29//Pz8////////////83Nzf8FBQP/BQUE/wUFBP8FBQT/BQUE/wUFA/8FBQT/VlZV//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////++vr7/BQUE/wUFBP8FBQT/BQUE/wUFBP8FBQP/BQUE/wUFBP8FBQT/BQUE/wUFBP8FBQT/VlZU/0REQ/8FBQT/BQUE/wUFBP8FBQP/BQUE/wUFBP8FBQT/VVVU////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////zMzM/x0dG/8FBQT/BQUE/wUFBP8FBQT/BQUE/wUFBP8FBQP/BQUE/wUFBP8FBQT/BQUE/wUFA/8FBQT/BQUE/wUFBP8FBQT/BQUE/wUFA/8FBQP/VVVU//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////Ly8v92dnb/BQUE/wUFBP8FBQT/BQUE/wUFA/8FBQT/BQUE/wUFBP8FBQT/BQUE/wUFA/8FBQP/BQUE/wUFBP8FBQT/BQUE/wUFBP8FBQT/VlZV////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////5ubm/6Kiov9VVVT/BQUE/wUFBP8FBQT/BQUE/wUFBP8FBQT/BQUE/wUFBP8FBQT/BQUE/wUFBP8FBQT/BQUE/wUFBP8FBQP/VlZV/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9nZ2f/MzMz/lJST/5SUk/9WVlT/VlZV/zExMP8FBQT/BQUE/wUFBP8FBQT/BQUE/wUFBP8FBQT/VlZV/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8zMzP8FBQP/BQUE/wUFA/8FBQT/BAQD/wUFBP8FBQT/VlZV////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8/Pz/8zMzP/MzMz/lJST/5SUk//Z2dn//////////////////////////////////////76+vv8FBQT/BQUE/wUFBP8FBQT/BQUE/wUFBP8FBQP/VlZV/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////5WVk/8FBQT/BQUE/wUFBP8FBQT/BQUE/wUFBP9nZ2b//////////////////////////////////////5SUk/8FBQT/BQUE/wUFA/8FBQT/BQUE/wUFBP8FBQT/dnZ2/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////1ZWVP8FBQT/BQUE/wUFBP8FBQT/BQUD/wUFA/8dHRz/8/Pz/////////////////////////////////3Z2dv8FBQP/BQUE/wUFBP8FBQT/BQUE/wUFBP8FBQT/lJST/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////6Ghof8FBQT/BQUE/wUFBP8FBQT/BQUE/wUFA/8FBQT/dnZ2////////////////////////////2dnZ/x0dHP8FBQT/BQUE/wUFBP8FBQT/BQUD/wUFBP8FBQT/lJST/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+bm5v8FBQT/BQUE/wUFBP8FBQT/BQUE/wUFA/8FBQT/BAQD/zExMP+xsbD/zMzM/8zMzP+UlJP/HR0c/wUFBP8FBQT/BQUE/wUFBP8FBQT/BQUE/wUFBP8FBQT/zMzM//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////92dnb/BQUE/wUFBP8FBQT/BQUE/wUFBP8FBQT/BQUE/wUFBP8FBQT/BQUE/wUFBP8FBQT/BQUE/wUFBP8FBQT/BQUE/wUFBP8FBQT/BQUE/wUFBP8dHRv///////////////////////////////////////////////////////////////////////////n////t///////////////////////////////////////////////////////////m5ub/Hh4c/wUFBP8FBQT/BQUE/wUFBP8FBQT/BQUE/wUFBP8FBQT/BQUE/wUFBP8FBQT/BQUE/wUFBP8FBQT/BQUE/wQEA/8FBQP/BQUD/wUFBP+UlJP//////////////////////////////////////////////////////////////////////////97///+o////////////////////////////////////////////////////////////////2dnZ/x0dG/8FBQT/BQUE/wUFA/8FBQT/BQUE/wUFBP8FBQT/BQUE/wUFBP8FBQT/BQUE/wUFBP8FBQT/BQUE/wUFBP8FBQP/BQUE/0VFRP/z8/P//////////////////////////////////////////////////////////////////////////5b///9U/////////////////////////////////////////////////////////////////////9nZ2f8xMTD/BQUE/wUFBP8FBQP/BQUE/wUFBP8FBQT/BQUD/wUFBP8FBQT/BQUE/wUFBP8FBQT/BQUE/wUFBP8FBQT/VVVU//Ly8v///////////////////////////////////////////////////////////////////////////////0L///8D////z///////////////////////////////////////////////////////////////////////////lZWU/zExMP8FBQT/BQUD/wUFA/8FBQT/BQUE/wUFBP8FBQT/BQUE/wUFA/8FBQT/BQUD/zExMP+xsbD/////////////////////////////////////////////////////////////////////////////////////wwAAAAAAAAAA////MP////b////////////////////////////////////////////////////////////////////////////////Z2dn/lJST/1ZWVf9WVlX/BAQD/wUFBP8FBQT/RUVD/1ZWVf+UlJP/zMzM///////////////////////////////////////////////////////////////////////////////////////////w////JwAAAAAAAAAAAAAAAP///0v////z//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////D///8/AAAAAAAAAAAAAAAAAAAAAAAAAAD///8t////yf//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////w////yQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///0v///+f////z///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////zP///5n///9FAAAAAAAAAAAAAAAAAAAAAAAAAAD4AAAAAB8AAOAAAAAABwAAwAAAAAADAACAAAAAAAEAAIAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAgAAAAAABAADAAAAAAAMAAOAAAAAABwAA+AAAAAAfAAAoAAAAIAAAAEAAAAABACAAAAAAAIAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////Uf///5/////S///////////////////////////////////////////////////////////////////////////////////////////////////////////////P////nP///0gAAAAAAAAAAAAAAAAAAAAA////GP///7H//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////6X///8SAAAAAP///wb////P////////////////////////////////////////////////5fX//67g//+R1f//UL7//1C+//9Rv///YsT//5DU//+85f//8vr//////////////////////////////////////////////////////8P///8D////df//////////////////////////////////////////ruD//z24//8AqP//AKf//wCo//8Ap///AKj//wCo//8Ap/7/AKf//wCn//8AqP//csr//8vq/////////////////////////////////////////////////2b////S////////////////////////////////y+r//ymy//8Ap///AKj//wCo//8Ap///AKf//wCn//8Ap///AKj//wCn//8Ap///AKj//wCo//8AqP//AKj//1C////Y8P///////8rq///Y7///////////////////////w/////z/////////////////////8vr//3LJ//8AqP//AKf//wCn/v9ixP//kNT//8vq///y+v////////////////////////L6///L6v//n9r//2LE//8Trf//AKf//wCo//+u4P//vOX//z65///////////////////////w//////////////////////L6//8+uP//AKf//1C+//+t3///8/r///////////////////////////////////////////////////////////////////////+85f//UL7//wCo///Y7///AKf//8rp///////////////////////////////////Y7///E63//1C+///L6v////////////////////////////////////////////////////////////////////////////////////////P7///L6v//5fT///L6//8ps///kNT//////////////////////////////////5DU//+t3///////////////////////////////////////////////////////////////////////////////////////////////////5fX//1C+//8AqP//AKf//wCn//+Q1f//////////////////////////////////////////////////////////////////8vLy/5SUk/9FRUT/BQUE/wQEA/8yMjD/Z2dm/8zMzP////////////////+GhoX/Z2dm//Lz8////////////+X0///L6v//yun///L6//////////////////////////////////////////////////////////////Ly8v9FRUT/BQUE/wUFBP8FBQT/BQUE/wQEA/8FBQT/BQUD/3Z2dv/z8/P/dnZ2/wUFBP8FBQP/MTEw/9nZ2f//////////////////////////////////////////////////////////////////////////////////////VlZV/wUFBP8FBQT/BQUE/wUFBP8FBQT/BQUE/wUFBP8FBQT/BQUE/zIyMP8FBQT/BQUE/wUFBP8FBQT/HR0c/9nZ2f///////////////////////////////////////////////////////////////////////////+bm5v8FBQT/BQUE/wUFBP8FBQT/BQUE/wUFA/8xMTD/HR0c/wUFA/8FBQT/BQUE/wUFBP8FBQT/BQUE/wUFA/8FBQT/lJST////////////////////////////////////////////////////////////////////////////vb29/wUFBP8EBAP/BQUE/wUFBP8FBQT/dnZ2////////////oqKi/wUFBP8EBAP/BQUE/wUFBP8FBQP/BQUE/zIyMf/y8vL///////////////////////////////////////////////////////////////////////////+UlJP/BQUE/wUFBP8FBQT/BQUE/wUFBP/y8vL/////////////////Z2dm/wUFBP8FBQT/BQUE/wUFBP8FBQT/sbGw/////////////////////////////////////////////////////////////////////////////////7GxsP8FBQT/BQUD/wUFBP8FBQT/BQUD//////////////////////+9vb3/BQUE/wUFBP8FBQT/BQUE/wUFBP/m5ub/////////////////////////////////////////////////////////////////////////////////2dnZ/wUFBP8FBQT/BQUE/wUFBP8FBQT/zMzM/////////////////+bm5v8FBQT/BQUE/wUFA/8FBQT/BQUD////////////////////////////////////////////////////////////////////////////////////////////MTEw/wUFBP8FBQT/BQUE/wUFBP9FRUT/5eXl/////////////////wUFBP8FBQT/BQUE/wUFBP8FBQT////////////////////////////////////////////////////////////////////////////////////////////MzMz/BQUE/wUFA/8FBQT/BQUD/wUFBP8FBQT/dnZ2/5SUk/+9vb3/BQUE/wUFBP8FBQT/BQUE/wUFA/////////////////////////////////////////////////////////////////////////////////////////////////+wsK//HR0c/wUFBP8FBQT/BQUE/wUFBP8FBQT/BQUD/wUFBP8FBQT/BQUE/wUFBP8FBQT/BQUE///////////////////////////////////////////////////////////////////////////////////////////////////////m5ub/hoaF/zIyMP8FBQT/BQUE/wUFBP8FBQT/BQUD/wUFBP8FBQT/BQUE/wUFBP8FBQP//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+bm5v/MzMz/lJST/5SUk/9WVlX/BQUE/wQEA/8FBQT/BQUE/wUFA//////////////////////////////////////////////////////////////////////////////////////////////////y8vL/zMzM/8zMzP/Nzc3///////////////////////////8FBQT/BQUE/wUFBP8FBQT/BQUD////////////////////////////////////////////////////////////////////////////////////////////Z2dm/wUFBP8FBQT/BQUE/wUFBP/y8vL/////////////////2dnZ/wUFA/8FBQP/BQUD/wUFBP8FBQT///////////////////////////////////////////////////////////////////////////////////////////9mZmX/BQUE/wUFBP8FBQT/BQUE/3Z2dv////////////////92dnb/BQUE/wUFBP8FBQT/BQUE/wUFBP///////////////////////////////////////////////////////////////////////////////////////////7CwsP8FBQT/BQUE/wUFBP8FBQT/BQUE/zIyMP9WVlX/RUVE/wUFBP8FBQT/BQUE/wUFBP8FBQT/RUVD/////////////////////////////////////////////////////////////////////////////////////////////////1ZWVf8FBQT/BQUE/wUFBP8EBAP/BQUD/wUFBP8FBQT/BQUE/wUFBP8FBQT/BQUE/wUFBP+wsK/////////////////////////////////////////////////2////2///////////////////////////////////////////8vLy/0VFRP8FBQP/BQUE/wUFBP8FBQT/BQUE/wUFBP8FBQT/BQUE/wUFBP8FBQT/dnZ2/////////////////////////////////////////////////////8z///9+/////////////////////////////////////////////////////7Cwr/9FRUT/BQUE/wUFBP8FBQT/BQUD/wUFBP8FBQT/RUVE/7Cwr///////////////////////////////////////////////////////////b////wz////b///////////////////////////////////////////////////////////y8vL/zMzM/8zMzP/MzMz/zc3N/+bm5v///////////////////////////////////////////////////////////////9L///8GAAAAAP///yf////b///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////S////HgAAAAAAAAAAAAAAAP///wz///94////2P/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////S////cv///wkAAAAAAAAAAOAAAAeAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAHAAAADKAAAABgAAAAwAAAAAQAgAAAAAABgCQAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8G////hP///9v/////////////////////////////////////////////////////////////////////////////////////////2////4T///8GAAAAAP///wz////P///////////////////////////y+v//vOX//5DV//+C0P//YsT//5DU//+u4P//5fT////////////////////////////////////////////G////Cf///4T/////////////////////8vr//3LK//8Trf//AKj//wCn//8Ap///AKf+/wCo//8AqP//AKf//1C+///K6v//////////////////////////////////////e////9v///////////////+u4P//E6z//wCn//8AqP//AKf//wCo//8Ap///AKf//wCo//8AqP//AKf//wCo//8Ap///kNX/////////////kdX//9jw////////////z/////D//////////4LP//8Ap///AKf//wCo//8qs///csr//5DV///K6f//y+r//8rq///L6v//n9n//3LK//8TrP//AKf//5/a////////kNX//1C+////////////7f////D/////kdX//wCo//8AqP//csn//9jw///////////////////////////////////////////////////y+v//n9r//4LQ////////yun//wCn///l9P//////8P////DK6v//AKf//1C+///l9P//////////////////////////////////////////////////////////////////////////////////yun//wCn//+85f//////8P////Aps///kNX///////////////////////////////////////////////////////////////////////+g2v//KrP//2LE//+Q1P//csr//wCn//+R1f//////8P////C75P////////////////////////////+xsbD/VlZV/1VVVP9WVlX/oaGh//Ly8v/y8vL/dnZ2/7Cwr///////vOT//2HD//8Ap///AKj//wCn/v+85f//////8P////D//////////////////////////4aGhf8EBAP/BQUD/wUFBP8EBAP/BQUD/0VFRP9nZ2b/BQUE/wUFBP92dnb/////////////////2O///+b1////////////8P////D/////////////////////8vLy/wUFBP8FBQT/BQUE/wUFA/9EREP/HR0b/wUFBP8FBQT/BQUD/wUFBP8FBQT/////////////////////////////////////8P////D/////////////////////zMzM/wUFBP8FBQT/BQUE/3Z2dv//////8vLy/x0dHP8FBQT/BQUE/wUFBP+UlJP/////////////////////////////////////8P////D/////////////////////zc3N/wUFBP8FBQT/BQUE/5SUk////////////4aGhf8FBQT/BQUE/wUFBP/MzMz/////////////////////////////////////8P////D//////////////////////////x0dG/8FBQT/BQUE/0VFQ//z8/P//////76+vv8FBQT/BQUE/wUFBP/Nzc3/////////////////////////////////////8P////D//////////////////////////7CwsP8FBQP/BQUE/wUFBP8dHRv/dnZ2/3Z2dv8FBQP/BQUE/wUFBP/MzMz/////////////////////////////////////8P////D///////////////////////////////++vr7/MTEw/wUFBP8FBQP/BQUD/wUFBP8FBQT/BQUE/wUFBP/MzMz/////////////////////////////////////8P////D//////////////////////////////////////////+Xl5f/MzMz/lJST/3Z2dv8FBQT/BQUE/wUFBP/MzMz/////////////////////////////////////8P////D//////////////////////////4aGhf9WVlX/HR0b/729vf///////////7Cwr/8FBQP/BQUE/wUFBP/MzMz/////////////////////////////////////8P////D//////////////////////////2ZmZf8FBQT/BQUE/x0dHP++vr7/zMzM/0VFRP8FBQT/BQUE/wUFBP/y8vL/////////////////////////////////////8P////D//////////////////////////8zMzP8FBQT/BQUE/wUFBP8FBQT/BQUE/wUFBP8FBQT/BQUD/1ZWVP/29vb/////////////////////////////////////7f///9X///////////////////////////////+wsK//HR0c/wUFBP8FBQT/BQUE/wUFBP8FBQT/MTEw/9vb2//6+vr/////////////////////////////////////z////3v/////////////////////////////////////8vLy/76+vv+UlJP/lJST/5SUk/++vr7/////////////////////////////////////////////////////df///wn////D//////////////////////////////////////////////////////////////////////////////////////////////////////////////+9////BgAAAAD///8D////df///9L/////////////////////////////////////////////////////////////////////////////////////////z////3X///8DAAAAAIAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAABACgAAAAQAAAAIAAAAAEAIAAAAAAAQAQAAAAAAAAAAAAAAAAAAAAAAAD///8G////lv////b/////////////////////////////////////////////////////////9v///5b///8G////iv/////////////////////Y7///n9r//5DV//+Q1P//vOT/////////////////////////////////iv///+f//////////8vq//9Qvv//AKj//wCn//8Ap///AKf+/wCn//8ps///u+T////////y+v//8vr//////+f////w/////67g//8AqP//AKj//z24//+C0P//kNX//5DU//+R1f//UL7//wCn//+u4P//vOX//4LQ///////w////8Lzl//8AqP//csn//+bz///////////////////////////////////l9P//rd///9jv//8Trf//////8P////Aqs///2O//////////////////////////////////////////////Ur7//3LK//+C0P//AKf///////D////w5vX/////////////zMzM/x0dG/8FBQT/HR0b/5SUk/9WVlT/RUVD/+fu8/+i2P7/csr//3LK///////w////8P///////////////zExMP8FBQT/BQUE/0VFRP8FBQP/BQUE/wUFBP+UlJP/////////////////////8P////D///////////////8FBQT/BQUE/4aGhP//////ZmZl/wUFBP8FBQT/8vLy//////////////////////D////w////////////////VlZV/wUFBP8yMjD/5ubm/5SUk/8FBQT/BQUE///////////////////////////w////8P///////////////9nZ2f8yMjD/BQUE/wUFBP8FBQT/BQUE/wUFBP//////////////////////////8P////D////////////////m5ub/zMzM/729vf+wsK//VlZV/wUFBP8FBQT///////////////////////////D////w////////////////Z2dm/wUFBP9FRUT/2NjY/2dnZv8FBQT/HR0c///////////////////////////w////5////////////////8zMzP8FBQP/BQUE/wUFBP8FBQT/BQUE/3Z2dv//////////////////////////5////4f/////////////////////2dnZ/3Z2dv9VVVT/VlZV/6Kiov///////////////////////////////4r///8G////jf///+T/////////////////////////////////////////////////////////5P///43///8GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==
// @downloadURL https://update.greasyfork.org/scripts/560409/Amazon%20Enhancement.user.js
// @updateURL https://update.greasyfork.org/scripts/560409/Amazon%20Enhancement.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SCRIPTID = 'AmazonEnhancement';
    console.log(SCRIPTID, 'loaded on', location.href);

    // ===== CPU OPTIMIZATION =====
    const BUNDLEDINTERVAL    =     125;/* the bundled interval */
    const BACKGROUNDINTERVAL = 60*1000;/* take even longer interval on hidden tab */
    const IFRAMETIMEOUT      =  1*1000;/* amazon uses timeouts instead of intervals on iframes */

    /*
      [interval]
      tame quick intervals
    */
    if(window === top){
        /* integrate each of intervals */
        const bundle = {};/* {0: {f, interval, lastExecution}} */
        let index = 0;/* use it instead of interval id */
        let lastExecution = 0;
        /* bundle intervals */
        const originalSetInterval = window.setInterval.bind(window);
        window.setInterval = function(f, interval, ...args){
            bundle[index] = {
                f: f.bind(null, ...args),
                interval: interval,
                lastExecution: 0,
            };
            return index++;
        };
        window.clearInterval = function(id){
            delete bundle[id];
        };
        /* execute bundled intervals */
        /* a bunch of intervals does cost so much even if the processes do nothing */
        originalSetInterval(function(){
            const now = Date.now();
            if(document.hidden && now < lastExecution + BACKGROUNDINTERVAL) return;
            Object.keys(bundle).forEach(id => {
                const item = bundle[id];
                if(item === undefined) return;/* it could be occur on tiny deletion chance */
                if(now < item.lastExecution + item.interval) return;/* not yet */
                item.f();
                item.lastExecution = now;
            });
            lastExecution = now;
        }, BUNDLEDINTERVAL);
    }

    /*
      [timeout]
      tame quick timeouts on iframe ads
    */
    if(window !== top){
        const originalSetTimeout = window.setTimeout.bind(window);
        window.setTimeout = function(f, timeout, ...args){
            if(document.hidden) return;
            if(timeout < IFRAMETIMEOUT){
                timeout = IFRAMETIMEOUT;
            }
            return originalSetTimeout(f, timeout, ...args);
        };
    }

    // ===== SETTINGS MANAGEMENT =====
    const DEFAULT_MODE = 'remove';
    const DEFAULT_OPACITY = '0.3';

    let currentMode = GM_getValue('filterMode', DEFAULT_MODE);
    let currentOpacity = GM_getValue('dimOpacity', DEFAULT_OPACITY);
    let observer = null;

    // ===== REGISTER MENU COMMANDS =====
    GM_registerMenuCommand('⚙️ Filtering Sponsored Content Settings', showSettingsPopup);

    // ===== SETTINGS UI =====
    function showSettingsPopup() {
        // Remove existing popup if any
        const existing = document.getElementById('amazon-filter-popup');
        if (existing) existing.remove();

        const popup = document.createElement('div');
        popup.id = 'amazon-filter-popup';
        popup.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            z-index: 10001;
            min-width: 350px;
            font-family: Arial, sans-serif;
        `;

        popup.innerHTML = `
            <div style="margin-bottom: 20px;">
                <h2 style="margin: 0 0 10px 0; color: #232F3E; font-size: 20px;">
                    Amazon Enhancement Settings
                </h2>
                <p style="margin: 0; color: #666; font-size: 14px;">
                    Configure how sponsored content is displayed
                </p>
            </div>

            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; color: #232F3E; font-weight: bold;">
                    Filter Mode:
                </label>
                <select id="filter-mode-select" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;">
                    <option value="remove" ${currentMode === 'remove' ? 'selected' : ''}>Remove (Hide completely)</option>
                    <option value="dim" ${currentMode === 'dim' ? 'selected' : ''}>Dim (Reduce opacity)</option>
                </select>
            </div>

            <div id="opacity-container" style="margin-bottom: 20px; ${currentMode === 'remove' ? 'opacity: 0.5; pointer-events: none;' : ''}">
                <label style="display: block; margin-bottom: 8px; color: #232F3E; font-weight: bold;">
                    Dim Opacity: <span id="opacity-value">${Math.round(parseFloat(currentOpacity) * 100)}%</span>
                </label>
                <input type="range" id="opacity-slider" min="0" max="100" value="${Math.round(parseFloat(currentOpacity) * 100)}"
                    style="width: 100%; cursor: pointer;">
                <div style="display: flex; justify-content: space-between; font-size: 12px; color: #666; margin-top: 4px;">
                    <span>Invisible</span>
                    <span>Visible</span>
                </div>
            </div>

            <div style="display: flex; gap: 10px;">
                <button id="save-settings-btn" style="
                    flex: 1;
                    padding: 10px;
                    background: #FF9900;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    font-size: 14px;
                    font-weight: bold;
                    cursor: pointer;
                ">
                    Save & Apply
                </button>
                <button id="cancel-settings-btn" style="
                    flex: 1;
                    padding: 10px;
                    background: #e7e9ec;
                    color: #232F3E;
                    border: none;
                    border-radius: 4px;
                    font-size: 14px;
                    cursor: pointer;
                ">
                    Cancel
                </button>
            </div>
        `;

        // Create overlay
        const overlay = document.createElement('div');
        overlay.id = 'amazon-filter-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 10000;
        `;

        document.body.appendChild(overlay);
        document.body.appendChild(popup);

        // Event listeners
        const modeSelect = document.getElementById('filter-mode-select');
        const opacitySlider = document.getElementById('opacity-slider');
        const opacityValue = document.getElementById('opacity-value');
        const opacityContainer = document.getElementById('opacity-container');
        const saveBtn = document.getElementById('save-settings-btn');
        const cancelBtn = document.getElementById('cancel-settings-btn');

        modeSelect.addEventListener('change', (e) => {
            if (e.target.value === 'remove') {
                opacityContainer.style.opacity = '0.5';
                opacityContainer.style.pointerEvents = 'none';
            } else {
                opacityContainer.style.opacity = '1';
                opacityContainer.style.pointerEvents = 'auto';
            }
        });

        opacitySlider.addEventListener('input', (e) => {
            opacityValue.textContent = `${e.target.value}%`;
        });

        saveBtn.addEventListener('click', () => {
            const newMode = modeSelect.value;
            const newOpacity = (parseInt(opacitySlider.value) / 100).toFixed(2);

            GM_setValue('filterMode', newMode);
            GM_setValue('dimOpacity', newOpacity);

            currentMode = newMode;
            currentOpacity = newOpacity;

            closePopup();
            applySettings();

            // Show confirmation
            showNotification('Settings saved! Page will refresh...');
            setTimeout(() => location.reload(), 1000);
        });

        cancelBtn.addEventListener('click', closePopup);
        overlay.addEventListener('click', closePopup);

        function closePopup() {
            popup.remove();
            overlay.remove();
        }
    }

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #232F3E;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10002;
            font-family: Arial, sans-serif;
            animation: slideIn 0.3s ease-out;
        `;
        notification.textContent = message;

        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(400px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    // ===== RUFUS AI REMOVAL =====
    const RUFUS_EXPLICIT = [
        '#nav-flyout-rufus', '.rufus-panel-container', '.rufus-view-filler',
        '.rufus-conversation-container', '.rufus-container-peek-view',
        '.nav-rufus-content', '.rufus-panel-closed-to-peek',
        '.overflow-menu-option-container-webapp',
        '#rufus-overflow-menu-option-container-auto-minimize',
        '#rufus-overflow-menu-option-container-faq',
        '.conversation-turn-container.rufus-initial-stream-container',
        '.rufus-teaser-cx-nav-tooltip', '.rufus-sections-container',
        '#nav-rufus-disc-txt', '.rufus-error-container-inner',
        '.rufus-error-text', '.rufus-conversation-branding-update',
        '.rufus-container', '.rufus-container-default-text-style',
        '#rufus-container', '.rufus-container-main-view',
        '.rufus-error-container', '#rufus-error-container',
        '.rufus-asin-faceout-footer', '.rufus-loading-message-template',
        '.rufus-text-subsections-with-avatar-branding-update',
        '.rufus-loading-messages', '.rufus-fade-in',
        '.rufus-visibility-hidden', '.rufus-remove-section'
    ];

    const RUFUS_CATCH_ALL = '[class*="rufus"],[id*="rufus"],[data-csa-c-content-id*="rufus"],[data-csa-c-slot-id*="rufus"]';

    // ===== DIM MODE STYLES =====
    function addDimStyles() {
        const existingStyle = document.getElementById('amazon_sponsored_dimmer');
        if (existingStyle) existingStyle.remove();

        const style = document.createElement('style');
        style.id = 'amazon_sponsored_dimmer';
        style.textContent = `
            .AdHolder,
            [class*="_adPlacements"],
            [data-cel-widget*="adplacements"],
            [data-cel-widget="dp-ads-center-promo_feature_div"],
            [data-cel-widget*="desktop-dp-atf_ad-placements"],
            [class*="spSponsored"],
            [data-video-type="sponsored"],
            [id*=-advertising-],
            [data-component-type="sp-sponsored-result"],
            .sp_desktop_sponsored_label,
            .celwidget:has([data-adfeedbackdetails]):not(:has(.celwidget)),
            .celwidget:has(.s-widget-sponsored-label-text):not(:has(.celwidget)),
            #discovery-and-inspiration_feature_div,
            #sponsoredProducts2_feature_div,
            #sims-themis-sponsored-products-2_feature_div,
            #dp-ads-center-promo-dramabot_feature_div,
            #percolate-ui-ilm_div,
            [data-feature-name="sims-discoveryAndInspiration"],
            [data-csa-c-owner="CustomerReviews"],
            [data-id*="AmazonLiveDram"],
            [class*="dynamic-sponsored-behaviour-container"] {
                opacity: ${currentOpacity} !important;
            }
        `;

        const head = document.querySelector('head');
        if (head) head.appendChild(style);
    }

    // ===== REMOVE MODE LOGIC =====
    function removeUnwantedContent() {
        // Remove sponsored products
        document.querySelectorAll('[data-component-type="sp-sponsored-result"]').forEach(el => {
            const parent = el.closest('[data-asin]');
            if (parent) parent.remove();
        });

        document.querySelectorAll('.sp_desktop_sponsored_label').forEach(el => {
            const parent = el.closest('.a-carousel-container');
            if (parent) parent.remove();
        });

        document.querySelectorAll('[class*="_adPlacements"]').forEach(el => el.remove());
        document.querySelectorAll('[data-cel-widget*="adplacements"]').forEach(el => el.remove());

        document.querySelectorAll(`
            #discovery-and-inspiration_feature_div,
            #sponsoredProducts2_feature_div,
            #sims-themis-sponsored-products-2_feature_div,
            #dp-ads-center-promo-dramabot_feature_div,
            #percolate-ui-ilm_div
        `).forEach(el => el.remove());

        document.querySelectorAll('[data-cel-widget="dp-ads-center-promo_feature_div"]').forEach(el => el.remove());
        document.querySelectorAll('[data-cel-widget*="desktop-dp-atf_ad-placements"]').forEach(el => el.remove());

        document.querySelectorAll('.AdHolder').forEach(el => el.remove());
        document.querySelectorAll('[data-feature-name="sims-discoveryAndInspiration"]').forEach(el => el.remove());
        document.querySelectorAll('[data-csa-c-owner="CustomerReviews"]').forEach(el => el.remove());

        document.querySelectorAll('[class*="spSponsored"]').forEach(el => {
            const widget = el.closest('#recsWidget');
            if (widget) widget.remove();
        });

        document.querySelectorAll('[class*="dynamic-sponsored-behaviour-container"]').forEach(el => {
            const parent = el.closest('.a-carousel-container');
            if (parent) parent.remove();
        });

        document.querySelectorAll('#search .s-result-list.s-search-results > div:not([data-component-type="s-search-result"])').forEach(el => {
            if (el.querySelectorAll('.s-pagination-strip').length === 0) el.remove();
        });

        document.querySelectorAll('[data-id*="AmazonLiveDram"]').forEach(el => el.remove());

        // Remove Rufus AI elements
        const rufusSelector = [...RUFUS_EXPLICIT, RUFUS_CATCH_ALL].join(', ');
        document.querySelectorAll(rufusSelector).forEach(el => {
            if (el && el.parentNode) {
                el.style.setProperty('display', 'none', 'important');
                el.remove();
            }
        });

        // Restore full width after Rufus removal
        document.querySelectorAll('#search, .s-desktop-content, .s-main-slot, #mainResults, #resultsCol')
            .forEach(m => {
                if (m) {
                    m.style.marginRight = '0';
                    m.style.maxWidth = 'none';
                    m.style.width = '100%';
                }
            });
    }

    // ===== APPLY SETTINGS =====
    function applySettings() {
        // Stop existing observer if any
        if (observer) {
            observer.disconnect();
            observer = null;
        }

        // Remove existing dim styles
        const existingStyle = document.getElementById('amazon_sponsored_dimmer');
        if (existingStyle) existingStyle.remove();

        if (currentMode === 'dim') {
            addDimStyles();
        } else {
            observer = new MutationObserver(() => {
                removeUnwantedContent();
            });
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            removeUnwantedContent();
        }
    }

    // ===== INITIALIZE =====
    function init() {
        // Wait for body to be available
        if (!document.body) {
            setTimeout(init, 100);
            return;
        }

        applySettings();
    }

    init();
})();