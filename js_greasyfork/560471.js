// ==UserScript==
// @name         古诗文网增强 + 古文岛重定向
// @name:zh-CN   古诗文网增强 + 古文岛重定向
// @name:zh-TW   古詩文網增強 + 古文島重定向
// @name:en      Classical Poetry Website Enhancer + Guwen Island Redirect
// @name:ja      古詩文網強化 + 古文島リダイレクト
// @name:ko      고시문망 강화 + 고문도 리다이렉트
// @name:de      Klassische Gedicht-Webseite Verbesserung + Guwen Insel Weiterleitung
// @name:fr      Améliorateur de site de poésie classique + Redirect Guwen Island
// @name:es      Mejorador de sitio de poesía clásica + Redirección de Guwen Island
// @name:it      Miglioramento sito poesia classica + Reindirizzamento Guwen Island
// @name:pt      Aprimorador do site de poesia clássica + Redirecionamento de Guwen Island
// @name:ru      Улучшатель сайта классической поэзии + Перенаправление с Guwen Island
// @name:ar      معزز موقع الشعر الكلاسيكي + إعادة توجيه من Guwen Island
// @name:nl      Klassieke poëzie website verbetering + Guwen Island doorverwijzing
// @name:pl      Ulepszacze strony poezji klasycznej + Przekierowanie z Guwen Island
// @name:tr      Klasik Şiir Sitesi Geliştirici + Guwen Island Yönlendirmesi
// @name:vi      Trình tăng cường trang thơ cổ điển + Chuyển hướng từ Guwen Island
// @name:th      เครื่องมือปรับปรุงเว็บไซต์กวีนิพนธ์คลาสสิก + การเปลี่ยนเส้นทางจาก Guwen Island
// @name:uk      Покращувач сайту класичної поезії + Перенаправлення з Guwen Island
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  增强古诗文网功能：去除广告、移除登录弹窗、自动展开内容、自动点击展开阅读全文等，并自动从古文岛重定向到古诗文网
// @description:zh-CN  增强古诗文网功能：去除广告、移除登录弹窗、自动展开内容、自动点击展开阅读全文等，并自动从古文岛重定向到古诗文网
// @description:zh-TW  增強古詩文網功能：去除廣告、移除登入彈窗、自動展開內容、自動點擊展開閱讀全文等，並自動從古文島重定向到古詩文網
// @description:en      Enhance Classical Poetry Website: remove ads, hide login popups, auto-expand content, auto-click to read full text, and auto-redirect from Guwen Island to Classical Poetry Website
// @description:ja      古詩文網の機能強化：広告削除、ログインポップアップ削除、コンテンツ自動展開、全文自動クリック読み取りなど、および古文島から古詩文網への自動リダイレクト
// @description:ko      고시문망 기능 강화: 광고 제거, 로그인 팝업 제거, 콘텐츠 자동 확장, 전체 글 자동 클릭 읽기 등, 및 고문도에서 고시문망으로 자동 리다이렉트
// @description:de      Verbesserung der klassischen Gedicht-Webseite: Entfernung von Werbung, Ausblenden von Login-Popups, automatische Inhaltserweiterung, automatisches Klicken zum Lesen des vollständigen Textes, und automatische Weiterleitung von Guwen Island zur klassischen Gedicht-Webseite
// @description:fr      Améliorer le site de poésie classique : supprimer les fenêtres publicitaires, masquer les popups de connexion, développer automatiquement le contenu, cliquer automatiquement pour lire le texte complet, et rediriger automatiquement de Guwen Island vers le site de poésie classique
// @description:es      Mejorar el sitio de poesía clásica: eliminar anuncios, ocultar ventanas emergentes de inicio de sesión, expandir contenido automáticamente, hacer clic automáticamente para leer el texto completo y redirigir automáticamente desde Guwen Island al sitio de poesía clásica
// @description:it      Migliorare il sito di poesia classica: rimuovere annunci, nascondere popup di accesso, espandere automaticamente il contenuto, fare clic automaticamente per leggere il testo completo e reindirizzare automaticamente da Guwen Island al sito di poesia classica
// @description:pt      Aprimorar o site de poesia clássica: remover anúncios, ocultar popups de login, expandir conteúdo automaticamente, clicar automaticamente para ler o texto completo e redirecionar automaticamente de Guwen Island para o site de poesia clássica
// @description:ru      Улучшить сайт классической поэзии: удалить рекламу, скрыть всплывающие окна входа, автоматически разворачивать контент, автоматически нажимать для чтения полного текста и автоматически перенаправлять с Guwen Island на сайт классической поэзии
// @description:ar      تعزيز موقع الشعر الكلاسيكي: إزالة الإعلانات، وإخفاء نوافذ تسجيل الدخول، وتوسيع المحتوى تلقائيًا، والنقر تلقائيًا لقراءة النص الكامل، وإعادة التوجيه تلقائيًا من Guwen Island إلى موقع الشعر الكلاسيكي
// @description:nl      Klassieke poëzie website verbeteren: advertenties verwijderen, inlog-popups verbergen, inhoud automatisch uitklappen, automatisch klikken om volledige tekst te lezen en automatisch doorverwijzen van Guwen Island naar de klassieke poëzie website
// @description:pl      Ulepszyć stronę poezji klasycznej: usunąć reklamy, ukryć okienka logowania, automatycznie rozwijać zawartość, automatycznie klikać, aby przeczytać pełny tekst i automatycznie przekierowywać z Guwen Island do strony poezji klasycznej
// @description:tr      Klasik şiir sitesini geliştirin: reklamları kaldırın, giriş açılır pencerelerini gizleyin, içeriği otomatik genişletin, tam metni okumak için otomatik tıklayın ve Guwen Island'dan klasik şiir sitesine otomatik yönlendirme yapın
// @description:vi      Tăng cường trang thơ cổ điển: loại bỏ quảng cáo, ẩn cửa sổ bật lên đăng nhập, tự động mở rộng nội dung, tự động nhấp để đọc toàn bộ văn bản và tự động chuyển hướng từ Guwen Island sang trang thơ cổ điển
// @description:th      ปรับปรุงเว็บไซต์กวีนิพนธ์คลาสสิก: ลบโฆษณา ซ่อนป๊อปอัพล็อกอิน ขยายเนื้อหาอัตโนมัติ คลิกอัตโนมัติเพื่ออ่านข้อความทั้งหมด และเปลี่ยนเส้นทางอัตโนมัติจาก Guwen Island ไปยังเว็บไซต์กวีนิพนธ์คลาสสิก
// @description:uk      Покращити сайт класичної поезії: видалити рекламу, приховати спливаючі вікна входу, автоматично розгортати вміст, автоматично натискати для читання повного тексту та автоматично перенаправляти з Guwen Island на сайт класичної поезії
// @author       aspen138
// @match        https://*.gushiwen.cn/*
// @match        https://www.guwendao.net/*
// @match        http://www.guwendao.net/*
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js
// @license      GPL v3.0
// @run-at       document-start
// @icon         data:image/x-icon;base64,AAABAAEAICAAAAEAIACoEAAAFgAAACgAAAAgAAAAQAAAAAEAIAAAAAAAABAAABILAAASCwAAAAAAAAAAAADi7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Hu7//i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/5PHy/+Hu7//i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/a6Oj/5vL0/+Hu7//i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4O3u/+Hu7//i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Dt7v/r9/j/tsfG/0xnY//I19f/5fLz/97s7P/g7e7/4O7v/+Du7v/h7u//4e7v/+Hu7//s+Pn/5vLz/+Du7//i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4O3u/+z5+v+rvbz/LElF/6G0s//6////6/f4/+v3+P/q9vf/6vb4/+n19//o9PX/5fLz/67Av//R3+D/6fb3/+Hu7//i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/g7e7/7Pj5/6/BwP87V1P/W3Rw/4ygn/+gs7L/uMnI/8DQ0P+9zs7/wNDQ/9jm5v+Tp6X/NlJO/1BqZv/F1NX/5/T1/+Hu7//i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Dt7v/r+Pn/r8HA/z5aVf9FYFz/RWBc/0VhXf9KZWH/TGdj/0xnY/9IY1//R2Je/zxYVP9LZWL/OFRQ/4GXlP/t+fv/4O3u/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4O3u/+v3+P+4ycj/NlJO/3qQjv/j8PH/2Obn/9nn5//Y5uf/2efo/87d3f/J2Nj/ip+d/0BbV/9CXVj/a4OA/+f09f/h7u//4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/g7u7/6fb3/8LS0v82U07/hZuZ/+/7/f/i7/D/5fHz/+Xy8//l8fL/5PHy//X///+pu7r/PVhU/0NdWf9mf3z/5vP0/+Hu7//i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Hu7//p9fb/xNTU/zdTT/+PpKL/7/v8/9/s7f/g7u7/4O3u/9/s7f/c6ur/6fX2/6G0s/89WVT/QV1Z/2Z+e//m8/T/4e7v/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4O3u/+35+v++zs7/NVJN/5Kmpf/l8vP/5PHy/+n19v/o9PX/7Pj6/+z4+v/7////q728/zxYVP9AXFj/boWD/+n29//g7u//4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4/Dx/5Knpf8+Wlb/PVlU/0diXv9XcW3/X3h1/22Fgv+AlpT/hJmX/5qtrP9qgn//Ql5Z/0JdWf9qgn//4O3u/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4e/w/+Pw8f/d6uv/cYiF/05oZP+Tp6b/orW0/6G0s/93jYv/O1dS/zlVUf9mf3z/fpSS/2uDgP9CXVn/Ql1Z/0RgXP/K2dn/5/T1/+Hu7//i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4e7v/+by9P/i7/D/1ePk/+76+//s+Pn/9v///8zb3P9EX1v/SGNf/9Hg4P/2////7vn7/3aNiv9IY1//vc7N/+j19v/g7u//4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/h7u//3uzt/+Du7//k8fL/3+zt/97r7P/l8vP/xtbW/0RfW/9MZ2P/0N/f/+Lv8P/k8fL/2efn/9Hg4P/r+Pn/4e7v/+Lv8P/g7e7/4e7v/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/j8PH/4e7v/+bz9P/u+vz/6vb4/+Tx8v/j8PH/4O3u/+Tx8v/M29z/R2Je/05oZf/V4+P/4/Dx/97r7P/i7+//4/Dx/97r7P/f7e7/4/Dx/+z4+f/n8/T/4e7v/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4O3u/+35+v+BlpT/Z398/5uvrf+6ysr/2efo/+Lv8P/p9vf/8////9/t7v9MZmL/Tmhl/+Pw8f/y/v//7vr7/+76+//t+fv/7fn7/+76+//g7e7/sMHB/8rZ2v/m8/T/4e7v/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Hu7//o9fb/u8vL/0RfW/87V1L/NlNO/zlUUP9GX1v/VGto/2V7eP98kY7/eIyK/0piXv9OZWH/lqmn/56vrv+er67/nrCu/56wrv+lt7b/l6up/2F5dv8sSkX/l6qp/+35+v/g7e7/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Tx8v/U4uP/yNjY/8XV1f/F1NT/tcXF/52vrv+Qo6H/hJiW/3+Tkf9ug4D/RmBb/0VeWv9edXL/b4WC/110cP9fdnP/W3Nv/0BbV/8xTkn/NVJN/4qfnf/m8/T/4e7v/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Xy8//o9Pb/6fX2/+n19//r9/n/7vr7/+76+//t+fr/9////8zb2/9DXlr/QV1Z/8bW1v/0////5/P1/+n19v/o9fb/0eDg/3ySkP+YrKv/7Pj6/+Pw8f/h7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4e/w/+Hu7//g7u//4O7v/+Dt7v/g7e7/4O3u/97r7P/n8/T/v8/P/0RfW/8+Wlb/q728/+n29//f7O3/4e7v/+Hu7//n9PX/6/f4/+n19//h7u//4e7v/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4O7v/+j09f+9zc3/RF9b/ztXU/+pu7v/8fz+/9/s7f/i7/D/4u/w/+Hu7//g7e7/4O7v/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/f7O3/9v///7TFxP8/Wlb/RF9b/3aNiv/b6er/4/Dx/+Hu7//i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4e7v/+Xy8/+0xcX/Vm9s/z5aVf8/W1f/O1dT/7fIyP/q9vj/4O3u/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/h7u//5fLz/7rLy/+Bl5X/VW9s/3mPjf/M29v/5vL0/+Hu7//i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/h7u//6vf4/+/7/P/c6ur/5/T1/+n19//h7u//4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/h7u//3+3u/+Tw8f/h7u//4O3u/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4e/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/4u/w/+Lv8P/i7/D/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=
// @downloadURL https://update.greasyfork.org/scripts/560471/%E5%8F%A4%E8%AF%97%E6%96%87%E7%BD%91%E5%A2%9E%E5%BC%BA%20%2B%20%E5%8F%A4%E6%96%87%E5%B2%9B%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/560471/%E5%8F%A4%E8%AF%97%E6%96%87%E7%BD%91%E5%A2%9E%E5%BC%BA%20%2B%20%E5%8F%A4%E6%96%87%E5%B2%9B%E9%87%8D%E5%AE%9A%E5%90%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ============================================
    // 重定向功能：古文岛 -> 古诗文网
    // ============================================
    function handleRedirect() {
        if (window.location.hostname.includes('guwendao.net')) {
            const newUrl = window.location.href.replace('guwendao.net', 'gushiwen.cn');
            if (newUrl !== window.location.href) {
                window.location.replace(newUrl);
                return true; // 表示正在重定向，停止后续执行
            }
        }
        return false;
    }

    // 如果正在重定向，则不执行后续代码
    if (handleRedirect()) {
        return;
    }

    // ============================================
    // 古诗文网增强功能
    // ============================================

    // 等待 DOM 加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initEnhancements);
    } else {
        initEnhancements();
    }

    function initEnhancements() {
        // 1. 阻止登录弹窗
        blockLoginPopup();

        // 2. 移除付费限制
        removePaymentRestrictions();

        // 3. 移除广告
        removeAds();

        // 4. 自动展开所有"展开阅读全文"
        autoExpandReadMore();

        // 5. 添加功能按钮
        addUtilityButtons();

        // 6. 监听动态加载的内容
        observeDynamicContent();

        console.log('[HzxScript] 古诗文网增强功能已启用');
    }

    // ============================================
    // 功能模块
    // ============================================

    // 阻止登录弹窗
    function blockLoginPopup() {
        if (typeof window.showErweima !== 'undefined') {
            window.showErweima = function() {
                console.log('[HzxScript] 登录弹窗已阻止');
            };
        }

        // 修复收藏链接
        const collectLink = document.querySelector("a[href='/user/collect.aspx'][rel='nofollow']");
        if (collectLink) {
            collectLink.href = '/user/login.aspx';
        }

        // 设置 Cookie 模拟登录状态
        setCookie('gsw2017user', 'hzxscript');

        console.log('[HzxScript] 登录弹窗已阻止');
    }

    // 移除付费限制
    function removePaymentRestrictions() {
        // 覆盖 VIP 检查函数
        window.checkSvip = function() {
            setCookie('userPlay', 'hzxscript|0|0|1|0|0|0|0|0|0|0|0');
        };

        // 移除付费弹窗
        window.showlayuiPay = function() {};

        console.log('[HzxScript] 付费限制已移除');
    }

    // 移除广告
    function removeAds() {
        $('div.abcd').remove();
        $('div.juzioncont').remove();

        console.log('[HzxScript] 广告已移除');
    }

    // 自动展开"展开阅读全文"
    function autoExpandReadMore() {
        // 常见的"展开阅读全文"选择器
        const selectors = [
            'a:contains("展开阅读全文")',
            'a:contains("阅读全文")',
            'a:contains("展开全文")',
            '.read-more',
            '.expand-text',
            'a[onclick*="展开"]',
            'a[href*="javascript"][text*="展开"]'
        ];

        // 尝试点击所有匹配的元素
        let clickCount = 0;
        selectors.forEach(selector => {
            try {
                const elements = $(selector);
                elements.each(function() {
                    const $this = $(this);
                    // 检查元素是否可见且未被点击过
                    if ($this.is(':visible') && !$this.data('auto-clicked')) {
                        $this.data('auto-clicked', true);
                        this.click();
                        clickCount++;
                    }
                });
            } catch (e) {
                console.error('[HzxScript] 选择器错误:', selector, e);
            }
        });

        // 使用原生 JavaScript 查找包含特定文本的链接
        const allLinks = document.querySelectorAll('a');
        allLinks.forEach(link => {
            const text = link.textContent.trim();
            if ((text.includes('展开') || text.includes('阅读全文') || text.includes('全文'))
                && !link.dataset.autoClicked) {
                link.dataset.autoClicked = 'true';
                try {
                    link.click();
                    clickCount++;
                } catch (e) {
                    console.error('[HzxScript] 点击失败:', e);
                }
            }
        });

        if (clickCount > 0) {
            console.log(`[HzxScript] 已自动展开 ${clickCount} 个"展开阅读全文"`);
        }
    }

    // 监听动态加载的内容
    function observeDynamicContent() {
        // 使用 MutationObserver 监听 DOM 变化
        const observer = new MutationObserver((mutations) => {
            let shouldCheck = false;

            mutations.forEach((mutation) => {
                // 检查是否有新节点添加
                if (mutation.addedNodes.length > 0) {
                    shouldCheck = true;
                }
            });

            if (shouldCheck) {
                // 延迟执行，避免频繁触发
                setTimeout(() => {
                    autoExpandReadMore();
                    removeAds(); // 同时检查并移除新出现的广告
                }, 100);
            }
        });

        // 开始观察
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        console.log('[HzxScript] 动态内容监听已启动');
    }

    // 添加功能按钮
    function addUtilityButtons() {
        const mainDiv = $('div.main3');
        if (!mainDiv.length) return;

        // 回到顶部按钮
        const backToTopBtn = createButton('回到顶部', {
            position: 'fixed',
            right: '10px',
            bottom: '10px',
            backgroundColor: '#4CAF50',
            height: '50px',
            width: '50px',
            cursor: 'pointer',
            borderRadius: '5px',
            border: 'none',
            color: 'white',
            fontSize: '12px',
            zIndex: '9999',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
        });
        backToTopBtn.onclick = () => window.scrollTo({top: 0, behavior: 'smooth'});
        mainDiv.append(backToTopBtn);

        // 全部展开/折叠按钮
        const expandBtn = createButton('全部展开', {
            position: 'fixed',
            right: '10px',
            bottom: '70px',
            backgroundColor: '#2196F3',
            height: '50px',
            width: '50px',
            cursor: 'pointer',
            borderRadius: '5px',
            border: 'none',
            color: 'white',
            fontSize: '12px',
            zIndex: '9999',
            display: 'block',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
        });

        const collapseBtn = createButton('全部折叠', {
            position: 'fixed',
            right: '10px',
            bottom: '70px',
            backgroundColor: '#FF9800',
            height: '50px',
            width: '50px',
            cursor: 'pointer',
            borderRadius: '5px',
            border: 'none',
            color: 'white',
            fontSize: '12px',
            zIndex: '9999',
            display: 'none',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
        });

        // 切换展开/折叠状态
        let isExpanded = false;
        const toggleExpand = () => {
            isExpanded = !isExpanded;
            expandBtn.style.display = isExpanded ? 'none' : 'block';
            collapseBtn.style.display = isExpanded ? 'block' : 'none';

            const links = document.getElementsByTagName('a');
            const action = isExpanded ? expandAllLinks : collapseAllLinks;

            for (let i = 0; i < links.length; i++) {
                action(links[i]);
            }
        };

        expandBtn.onclick = toggleExpand;
        collapseBtn.onclick = toggleExpand;

        mainDiv.append(expandBtn);
        mainDiv.append(collapseBtn);

        // 手动展开阅读全文按钮
        const manualExpandBtn = createButton('展开全文', {
            position: 'fixed',
            right: '10px',
            bottom: '130px',
            backgroundColor: '#9C27B0',
            height: '50px',
            width: '50px',
            cursor: 'pointer',
            borderRadius: '5px',
            border: 'none',
            color: 'white',
            fontSize: '12px',
            zIndex: '9999',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
        });
        manualExpandBtn.onclick = autoExpandReadMore;
        mainDiv.append(manualExpandBtn);

        console.log('[HzxScript] 功能按钮已添加');
    }

    // ============================================
    // 辅助函数
    // ============================================

    // 创建按钮
    function createButton(text, styles) {
        const btn = document.createElement('button');
        btn.textContent = text;
        Object.assign(btn.style, styles);
        return btn;
    }

    // 展开链接内容
    function expandAllLinks(link) {
        if (link.href.includes('javascript:ziliaoShow') ||
            link.href.includes('javascript:fanyiShow') ||
            link.href.includes('javascript:shangxiShow')) {
            try {
                eval(link.href);
            } catch (e) {
                console.error('[HzxScript] 展开失败:', e);
            }
        }
    }

    // 折叠链接内容
    function collapseAllLinks(link) {
        if (link.href.includes('javascript:ziliaoClose') ||
            link.href.includes('javascript:fanyiClose') ||
            link.href.includes('javascript:shangxiClose')) {
            try {
                eval(link.href);
            } catch (e) {
                console.error('[HzxScript] 折叠失败:', e);
            }
        }
    }

    // 设置 Cookie
    function setCookie(name, value, days = 365) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = `expires=${date.toUTCString()}`;
        document.cookie = `${name}=${value};${expires};path=/`;
    }

})();