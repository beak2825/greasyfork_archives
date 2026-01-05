// ==UserScript==
// @name         Smile-O-Pack
// @version      1.2
// @description  Смайлопак сгенерированный сайтом http://smile-o-pack.net/
// @include http://ponych.at/*
// @match http://ponych.at/*
// @include      http://smile-o-pack.net/*
// @match        http://smile-o-pack.net/*
// @include      https://smile-o-pack.net/*
// @match        https://smile-o-pack.net/*

// @author       Код: EeyupBrony, Dark_XSM, Dotterian
// @namespace https://greasyfork.org/users/8253
// @downloadURL https://update.greasyfork.org/scripts/7386/Smile-O-Pack.user.js
// @updateURL https://update.greasyfork.org/scripts/7386/Smile-O-Pack.meta.js
// ==/UserScript==

(function(document, fn) {
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.textContent = '(' + fn + ')(window, window.document)';
    document.body.appendChild(script); // run the script
    document.body.removeChild(script); // clean up
})(document, function(window, document) {

// Во избежание запуска в куче iframe'ов, например, в Gmail
// К сожалению, нельзя запустить это извне: после этого Опера не пробрасывает скрипт хоть ты убейся
if (window.top !== window.self) {
    return;
}

// Генерируемые данные
var data = {
    version: '1.2',
    timestamp: 'optional',
    sections: [{"id":0,"code":"хрень","icon":"0.17","name":"хрень","categories":[{"id":0,"code":"хрень","icon":"0.17","name":"хрень","smiles":[{"id":"8380","w":70,"h":70},{"id":"8382","w":70,"h":70},{"id":"8381","w":70,"h":70},{"id":"8383","w":70,"h":70},{"id":"8384","w":70,"h":70},{"id":"8385","w":70,"h":70},{"id":"8386","w":70,"h":70},{"id":"8387","w":70,"h":70},{"id":"8388","w":70,"h":70},{"id":"8389","w":70,"h":70},{"id":"8390","w":70,"h":70},{"id":"8391","w":70,"h":70},{"id":"8392","w":70,"h":70},{"id":"8393","w":70,"h":70},{"id":"7738","w":70,"h":70},{"id":"7739","w":70,"h":70},{"id":"7740","w":70,"h":70},{"id":"7741","w":70,"h":70},{"id":"7742","w":70,"h":70},{"id":"7743","w":70,"h":70},{"id":"7744","w":70,"h":70},{"id":"7746","w":70,"h":70},{"id":"7747","w":70,"h":70},{"id":"7748","w":70,"h":70},{"id":"7749","w":70,"h":70},{"id":"7750","w":70,"h":70},{"id":"7751","w":70,"h":70},{"id":"7752","w":70,"h":70},{"id":"7753","w":70,"h":70},{"id":"7754","w":70,"h":70},{"id":"7755","w":70,"h":70},{"id":"7756","w":70,"h":70},{"id":"7757","w":70,"h":70},{"id":"7758","w":70,"h":70},{"id":"7759","w":70,"h":70},{"id":"7760","w":70,"h":70},{"id":"7761","w":70,"h":70},{"id":"7762","w":70,"h":70},{"id":"7763","w":70,"h":70},{"id":"7764","w":70,"h":70},{"id":"7765","w":70,"h":70},{"id":"7766","w":70,"h":70},{"id":"7767","w":70,"h":70},{"id":"7768","w":70,"h":70},{"id":"7769","w":70,"h":70},{"id":"7770","w":70,"h":70},{"id":"7772","w":70,"h":70},{"id":"7773","w":70,"h":70},{"id":"7774","w":70,"h":70},{"id":"7775","w":70,"h":70},{"id":"7776","w":70,"h":70},{"id":"7777","w":70,"h":70},{"id":"7778","w":70,"h":70},{"id":"7779","w":70,"h":70},{"id":"7780","w":70,"h":70},{"id":"7781","w":70,"h":70},{"id":"7782","w":70,"h":70},{"id":"7783","w":70,"h":70},{"id":"7784","w":70,"h":70},{"id":"7785","w":70,"h":70},{"id":"7786","w":70,"h":70},{"id":"7787","w":70,"h":70},{"id":"7788","w":70,"h":70},{"id":"7789","w":70,"h":70},{"id":"7790","w":70,"h":70},{"id":"7791","w":70,"h":70},{"id":"7792","w":70,"h":70},{"id":"7793","w":70,"h":70},{"id":"7794","w":70,"h":70},{"id":"7795","w":70,"h":70},{"id":"7796","w":70,"h":70},{"id":"7797","w":70,"h":70},{"id":"7798","w":70,"h":70},{"id":"7799","w":70,"h":70},{"id":"7800","w":70,"h":70},{"id":"7801","w":70,"h":70},{"id":"7803","w":70,"h":70},{"id":"7804","w":70,"h":70},{"id":"7805","w":70,"h":70},{"id":"7806","w":70,"h":70},{"id":"7807","w":70,"h":70},{"id":"7808","w":70,"h":70},{"id":"7809","w":70,"h":70},{"id":"7810","w":70,"h":70},{"id":"7811","w":70,"h":70},{"id":"7812","w":70,"h":70},{"id":"7813","w":70,"h":70},{"id":"7814","w":70,"h":70},{"id":"7815","w":70,"h":70},{"id":"7816","w":70,"h":70},{"id":"7817","w":70,"h":70},{"id":"7818","w":70,"h":70},{"id":"7819","w":70,"h":70},{"id":"7820","w":70,"h":70},{"id":"7821","w":70,"h":70},{"id":"7822","w":70,"h":70},{"id":"7823","w":70,"h":70},{"id":"7824","w":70,"h":70},{"id":"7825","w":70,"h":70},{"id":"7826","w":70,"h":70},{"id":"7827","w":70,"h":70},{"id":"7828","w":70,"h":70},{"id":"7829","w":70,"h":70},{"id":"7830","w":70,"h":70},{"id":"7831","w":70,"h":70},{"id":"7832","w":70,"h":70},{"id":"7834","w":70,"h":70},{"id":"7835","w":70,"h":70},{"id":"7836","w":70,"h":70},{"id":"7837","w":70,"h":70},{"id":"7838","w":70,"h":70},{"id":"7839","w":70,"h":70},{"id":"7840","w":70,"h":70},{"id":"7841","w":70,"h":70},{"id":"7842","w":70,"h":70},{"id":"7843","w":70,"h":70},{"id":"7844","w":70,"h":70},{"id":"7845","w":70,"h":70},{"id":"7846","w":70,"h":70},{"id":"7847","w":70,"h":70},{"id":"7848","w":70,"h":70},{"id":"7849","w":70,"h":70},{"id":"7850","w":70,"h":70},{"id":"7851","w":70,"h":70},{"id":"7852","w":70,"h":70},{"id":"7853","w":70,"h":70},{"id":"7854","w":70,"h":70},{"id":"7855","w":70,"h":70},{"id":"7856","w":70,"h":70},{"id":"7857","w":70,"h":70},{"id":"7858","w":70,"h":70},{"id":"7859","w":70,"h":70},{"id":"7860","w":70,"h":70},{"id":"7861","w":70,"h":70},{"id":"7862","w":70,"h":70},{"id":"7863","w":70,"h":70},{"id":"7864","w":70,"h":70},{"id":"7865","w":70,"h":70},{"id":"7867","w":70,"h":70},{"id":"7868","w":70,"h":70},{"id":"7869","w":70,"h":70},{"id":"7870","w":70,"h":70},{"id":"7871","w":70,"h":70},{"id":"7872","w":70,"h":70},{"id":"7873","w":70,"h":70},{"id":"7874","w":70,"h":70},{"id":"7875","w":70,"h":70},{"id":"7876","w":70,"h":70},{"id":"7877","w":70,"h":70},{"id":"7878","w":70,"h":70},{"id":"7879","w":70,"h":70},{"id":"7880","w":70,"h":70},{"id":"7881","w":70,"h":70},{"id":"7882","w":70,"h":70},{"id":"7883","w":70,"h":70},{"id":"7884","w":70,"h":70},{"id":"7885","w":70,"h":70},{"id":"7886","w":70,"h":70},{"id":"7887","w":70,"h":70},{"id":"7888","w":70,"h":70},{"id":"7889","w":70,"h":70},{"id":"7890","w":70,"h":70},{"id":"7891","w":70,"h":70},{"id":"7892","w":70,"h":70},{"id":"7893","w":70,"h":70},{"id":"7894","w":70,"h":70},{"id":"7895","w":70,"h":70},{"id":"7896","w":70,"h":70},{"id":"7898","w":70,"h":70},{"id":"7899","w":70,"h":70},{"id":"7900","w":70,"h":70},{"id":"7901","w":70,"h":70},{"id":"7902","w":70,"h":70},{"id":"7903","w":70,"h":70},{"id":"7904","w":70,"h":70},{"id":"7905","w":70,"h":70},{"id":"7906","w":70,"h":70},{"id":"7907","w":70,"h":70},{"id":"7908","w":70,"h":70},{"id":"7909","w":70,"h":70},{"id":"7910","w":70,"h":70},{"id":"7911","w":70,"h":70},{"id":"7912","w":70,"h":70},{"id":"7913","w":70,"h":70},{"id":"7914","w":70,"h":70},{"id":"7915","w":70,"h":70},{"id":"7916","w":70,"h":70},{"id":"7917","w":70,"h":70},{"id":"7918","w":70,"h":70},{"id":"7919","w":70,"h":70},{"id":"7920","w":70,"h":70},{"id":"7921","w":70,"h":70},{"id":"7922","w":70,"h":70},{"id":"7923","w":70,"h":70},{"id":"7924","w":70,"h":70},{"id":"7925","w":70,"h":70},{"id":"7926","w":70,"h":70},{"id":"7927","w":70,"h":70},{"id":"7928","w":70,"h":70},{"id":"7930","w":70,"h":70},{"id":"7931","w":70,"h":70},{"id":"7932","w":70,"h":70},{"id":"7933","w":70,"h":70},{"id":"7934","w":70,"h":70},{"id":"7935","w":70,"h":70},{"id":"7936","w":70,"h":70},{"id":"7937","w":70,"h":70},{"id":"7938","w":70,"h":70},{"id":"7939","w":70,"h":70},{"id":"7940","w":70,"h":70},{"id":"7941","w":70,"h":70},{"id":"7942","w":70,"h":70},{"id":"7943","w":70,"h":70},{"id":"7944","w":70,"h":70},{"id":"7945","w":70,"h":70},{"id":"7946","w":70,"h":70},{"id":"7947","w":70,"h":70},{"id":"7948","w":70,"h":70},{"id":"7949","w":70,"h":70},{"id":"7950","w":70,"h":70},{"id":"7951","w":70,"h":70},{"id":"7952","w":70,"h":70},{"id":"7953","w":70,"h":70},{"id":"7954","w":70,"h":70},{"id":"7955","w":70,"h":70},{"id":"7956","w":70,"h":70},{"id":"7957","w":70,"h":70},{"id":"7958","w":70,"h":70},{"id":"7959","w":70,"h":70},{"id":"7961","w":70,"h":70},{"id":"7962","w":70,"h":70},{"id":"7963","w":70,"h":70},{"id":"7964","w":70,"h":70},{"id":"7965","w":70,"h":70},{"id":"7966","w":70,"h":70},{"id":"7967","w":70,"h":70},{"id":"7968","w":70,"h":70},{"id":"7969","w":70,"h":70},{"id":"7970","w":70,"h":70},{"id":"7971","w":70,"h":70},{"id":"7972","w":70,"h":70},{"id":"7973","w":70,"h":70},{"id":"7974","w":70,"h":70},{"id":"7975","w":70,"h":70},{"id":"7976","w":70,"h":70},{"id":"7977","w":70,"h":70},{"id":"7978","w":70,"h":70},{"id":"7979","w":70,"h":70},{"id":"7980","w":70,"h":70},{"id":"7981","w":70,"h":70},{"id":"7982","w":70,"h":70},{"id":"7983","w":70,"h":70},{"id":"7984","w":70,"h":70},{"id":"7985","w":70,"h":70},{"id":"7986","w":70,"h":70},{"id":"7987","w":70,"h":70},{"id":"7988","w":70,"h":70},{"id":"7989","w":70,"h":70},{"id":"7990","w":70,"h":70},{"id":"7992","w":70,"h":70},{"id":"7993","w":70,"h":70},{"id":"7994","w":70,"h":70},{"id":"7995","w":70,"h":70},{"id":"7996","w":70,"h":70},{"id":"7997","w":70,"h":70},{"id":"7998","w":70,"h":70},{"id":"7999","w":70,"h":70},{"id":"8000","w":70,"h":70},{"id":"8001","w":70,"h":70},{"id":"8002","w":70,"h":70},{"id":"8003","w":70,"h":70},{"id":"8004","w":70,"h":70},{"id":"8005","w":70,"h":70},{"id":"8006","w":70,"h":70},{"id":"8007","w":70,"h":70},{"id":"8008","w":70,"h":70},{"id":"8009","w":70,"h":70},{"id":"8010","w":70,"h":70},{"id":"8011","w":70,"h":70},{"id":"8012","w":70,"h":70},{"id":"8013","w":70,"h":70},{"id":"8014","w":70,"h":70},{"id":"8015","w":70,"h":70},{"id":"8016","w":70,"h":70},{"id":"8017","w":70,"h":70},{"id":"8018","w":70,"h":70},{"id":"8019","w":70,"h":70},{"id":"8020","w":70,"h":70},{"id":"8021","w":70,"h":70},{"id":"8022","w":70,"h":70},{"id":"8023","w":70,"h":70},{"id":"8024","w":70,"h":70},{"id":"8025","w":70,"h":70},{"id":"8026","w":70,"h":70},{"id":"8027","w":70,"h":70},{"id":"8028","w":70,"h":70},{"id":"8029","w":70,"h":70},{"id":"8030","w":70,"h":70},{"id":"8031","w":70,"h":70},{"id":"8032","w":70,"h":70},{"id":"8033","w":70,"h":70},{"id":"8034","w":70,"h":70},{"id":"8035","w":70,"h":70},{"id":"8036","w":70,"h":70},{"id":"8037","w":70,"h":70},{"id":"8038","w":70,"h":70},{"id":"8039","w":70,"h":70},{"id":"8040","w":70,"h":70},{"id":"8041","w":70,"h":70},{"id":"8042","w":70,"h":70},{"id":"8043","w":70,"h":70},{"id":"8044","w":70,"h":70},{"id":"8045","w":70,"h":70},{"id":"8047","w":70,"h":70},{"id":"8048","w":70,"h":70},{"id":"8049","w":70,"h":70},{"id":"8050","w":70,"h":70},{"id":"8051","w":70,"h":70},{"id":"8052","w":70,"h":70},{"id":"8053","w":70,"h":70},{"id":"8054","w":70,"h":70},{"id":"8055","w":70,"h":70},{"id":"8056","w":70,"h":70},{"id":"8057","w":70,"h":70},{"id":"8058","w":70,"h":70},{"id":"8059","w":70,"h":70},{"id":"8060","w":70,"h":70},{"id":"8061","w":70,"h":70},{"id":"8062","w":70,"h":70},{"id":"8063","w":70,"h":70},{"id":"8064","w":70,"h":70},{"id":"8065","w":70,"h":70},{"id":"8066","w":70,"h":70},{"id":"8067","w":70,"h":70},{"id":"8068","w":70,"h":70},{"id":"8069","w":70,"h":70},{"id":"8070","w":70,"h":70},{"id":"8071","w":70,"h":70},{"id":"8072","w":70,"h":70},{"id":"8073","w":70,"h":70},{"id":"8074","w":70,"h":70},{"id":"8075","w":70,"h":70},{"id":"8076","w":70,"h":70},{"id":"8078","w":70,"h":70},{"id":"8079","w":70,"h":70},{"id":"8080","w":70,"h":70},{"id":"8081","w":70,"h":70},{"id":"8082","w":70,"h":70},{"id":"8083","w":70,"h":70},{"id":"8084","w":70,"h":70},{"id":"8085","w":70,"h":70},{"id":"8086","w":70,"h":70},{"id":"8087","w":70,"h":70},{"id":"8088","w":70,"h":70},{"id":"8089","w":70,"h":70},{"id":"8090","w":70,"h":70},{"id":"8091","w":70,"h":70},{"id":"8092","w":70,"h":70},{"id":"8093","w":70,"h":70},{"id":"8094","w":70,"h":70},{"id":"8095","w":70,"h":70},{"id":"8096","w":70,"h":70},{"id":"8097","w":70,"h":70},{"id":"8098","w":70,"h":70},{"id":"8099","w":70,"h":70},{"id":"8100","w":70,"h":70},{"id":"8101","w":70,"h":70},{"id":"8102","w":70,"h":70},{"id":"8103","w":70,"h":70},{"id":"8104","w":70,"h":70},{"id":"8105","w":70,"h":70},{"id":"8106","w":70,"h":70},{"id":"8107","w":70,"h":70},{"id":"8108","w":70,"h":70},{"id":"8110","w":70,"h":70},{"id":"8111","w":70,"h":70},{"id":"8112","w":70,"h":70},{"id":"8113","w":70,"h":70},{"id":"8114","w":70,"h":70},{"id":"8115","w":70,"h":70},{"id":"8116","w":70,"h":70},{"id":"8117","w":70,"h":70},{"id":"8118","w":70,"h":70},{"id":"8119","w":70,"h":70},{"id":"8120","w":70,"h":70},{"id":"8121","w":70,"h":70},{"id":"8122","w":70,"h":70},{"id":"8123","w":70,"h":70},{"id":"8124","w":70,"h":70},{"id":"8125","w":70,"h":70},{"id":"8126","w":70,"h":70},{"id":"8127","w":70,"h":70},{"id":"8128","w":70,"h":70},{"id":"8129","w":70,"h":70},{"id":"8130","w":70,"h":70},{"id":"8131","w":70,"h":70},{"id":"8132","w":70,"h":70},{"id":"8133","w":70,"h":70},{"id":"8134","w":70,"h":70},{"id":"8135","w":70,"h":70},{"id":"8136","w":70,"h":70},{"id":"8137","w":70,"h":70},{"id":"8138","w":70,"h":70},{"id":"8139","w":70,"h":70},{"id":"8141","w":70,"h":70},{"id":"8142","w":70,"h":70},{"id":"8143","w":70,"h":70},{"id":"8144","w":70,"h":70},{"id":"8145","w":70,"h":70},{"id":"8146","w":70,"h":70},{"id":"8147","w":70,"h":70},{"id":"8148","w":70,"h":70},{"id":"8149","w":70,"h":70},{"id":"8150","w":70,"h":70},{"id":"8151","w":70,"h":70},{"id":"8152","w":70,"h":70},{"id":"8153","w":70,"h":70},{"id":"8154","w":70,"h":70},{"id":"8155","w":70,"h":70},{"id":"8156","w":70,"h":70},{"id":"8157","w":70,"h":70},{"id":"8158","w":70,"h":70},{"id":"8159","w":70,"h":70},{"id":"8160","w":70,"h":70},{"id":"8161","w":70,"h":70},{"id":"8162","w":70,"h":70},{"id":"8163","w":70,"h":70},{"id":"8164","w":70,"h":70},{"id":"8165","w":70,"h":70},{"id":"8166","w":70,"h":70},{"id":"8167","w":70,"h":70},{"id":"8168","w":70,"h":70},{"id":"8169","w":70,"h":70},{"id":"8170","w":70,"h":70},{"id":"8171","w":70,"h":70},{"id":"8172","w":70,"h":70},{"id":"8173","w":70,"h":70},{"id":"8174","w":70,"h":70},{"id":"8175","w":70,"h":70},{"id":"8176","w":70,"h":70},{"id":"8177","w":70,"h":70},{"id":"8178","w":70,"h":70},{"id":"8179","w":70,"h":70},{"id":"8180","w":70,"h":70},{"id":"8181","w":70,"h":70},{"id":"8182","w":70,"h":70},{"id":"8183","w":70,"h":70},{"id":"8184","w":70,"h":70},{"id":"8185","w":70,"h":70},{"id":"8186","w":70,"h":70},{"id":"8187","w":70,"h":70},{"id":"8188","w":70,"h":70},{"id":"8189","w":70,"h":70},{"id":"8190","w":70,"h":70},{"id":"8191","w":70,"h":70},{"id":"8192","w":70,"h":70},{"id":"8194","w":70,"h":70},{"id":"8195","w":70,"h":70},{"id":"8196","w":70,"h":70},{"id":"8197","w":70,"h":70},{"id":"8198","w":70,"h":70},{"id":"8199","w":70,"h":70},{"id":"8200","w":70,"h":70},{"id":"8202","w":70,"h":70},{"id":"8203","w":70,"h":70},{"id":"8204","w":70,"h":70},{"id":"8205","w":70,"h":70},{"id":"8206","w":70,"h":70},{"id":"8207","w":70,"h":70},{"id":"8208","w":70,"h":70},{"id":"8209","w":70,"h":70},{"id":"8210","w":70,"h":70},{"id":"8211","w":70,"h":70},{"id":"8212","w":70,"h":70},{"id":"8213","w":70,"h":70},{"id":"8214","w":70,"h":70},{"id":"8215","w":70,"h":70},{"id":"8216","w":70,"h":70},{"id":"8217","w":70,"h":70},{"id":"8218","w":70,"h":70},{"id":"8219","w":70,"h":70},{"id":"8220","w":70,"h":70},{"id":"8221","w":70,"h":70},{"id":"8222","w":70,"h":70},{"id":"8223","w":70,"h":70},{"id":"8224","w":70,"h":70},{"id":"8225","w":70,"h":70},{"id":"8226","w":70,"h":70},{"id":"8227","w":70,"h":70},{"id":"8228","w":70,"h":70},{"id":"8229","w":70,"h":70},{"id":"8230","w":70,"h":70},{"id":"8231","w":70,"h":70},{"id":"8232","w":70,"h":70},{"id":"8233","w":70,"h":70},{"id":"8234","w":70,"h":70},{"id":"8235","w":70,"h":70},{"id":"8236","w":70,"h":70},{"id":"8237","w":70,"h":70},{"id":"8238","w":70,"h":70},{"id":"8239","w":70,"h":70},{"id":"8240","w":70,"h":70},{"id":"8241","w":70,"h":70},{"id":"8242","w":70,"h":70},{"id":"8243","w":70,"h":70},{"id":"8244","w":70,"h":70},{"id":"8245","w":70,"h":70},{"id":"8246","w":70,"h":70},{"id":"8247","w":70,"h":70},{"id":"8248","w":70,"h":70},{"id":"8249","w":70,"h":70},{"id":"8250","w":70,"h":70},{"id":"8251","w":70,"h":70},{"id":"8252","w":70,"h":70},{"id":"8253","w":70,"h":70},{"id":"8254","w":70,"h":70},{"id":"8255","w":70,"h":70},{"id":"8256","w":70,"h":70},{"id":"8257","w":70,"h":70},{"id":"8258","w":70,"h":70},{"id":"8259","w":70,"h":70},{"id":"8260","w":70,"h":70},{"id":"8261","w":70,"h":70},{"id":"8262","w":70,"h":70},{"id":"8263","w":70,"h":70},{"id":"8264","w":70,"h":70},{"id":"8265","w":70,"h":70},{"id":"8266","w":70,"h":70},{"id":"8267","w":70,"h":70},{"id":"8268","w":70,"h":70},{"id":"8269","w":70,"h":70},{"id":"8270","w":70,"h":70},{"id":"8271","w":70,"h":70},{"id":"8272","w":70,"h":70},{"id":"8273","w":70,"h":70},{"id":"8274","w":70,"h":70},{"id":"8275","w":70,"h":70},{"id":"8276","w":70,"h":70},{"id":"8277","w":70,"h":70},{"id":"8278","w":70,"h":70},{"id":"8279","w":70,"h":70},{"id":"8280","w":70,"h":70},{"id":"8281","w":70,"h":70},{"id":"8282","w":70,"h":70},{"id":"8283","w":70,"h":70},{"id":"8284","w":70,"h":70},{"id":"8285","w":70,"h":70},{"id":"8286","w":70,"h":70},{"id":"8287","w":70,"h":70},{"id":"8288","w":70,"h":70},{"id":"8289","w":70,"h":70},{"id":"8290","w":70,"h":70},{"id":"8291","w":70,"h":70},{"id":"8292","w":70,"h":70},{"id":"8293","w":70,"h":70},{"id":"8294","w":70,"h":70},{"id":"8295","w":70,"h":70},{"id":"8296","w":70,"h":70},{"id":"8297","w":70,"h":70},{"id":"8298","w":70,"h":70},{"id":"8299","w":70,"h":70},{"id":"8300","w":70,"h":70},{"id":"8301","w":70,"h":70},{"id":"8302","w":70,"h":70},{"id":"8303","w":70,"h":70},{"id":"8304","w":70,"h":70},{"id":"8305","w":70,"h":70},{"id":"8306","w":70,"h":70},{"id":"8307","w":70,"h":70},{"id":"8308","w":70,"h":70},{"id":"8309","w":70,"h":70},{"id":"8310","w":70,"h":70},{"id":"8311","w":70,"h":70},{"id":"8312","w":70,"h":70},{"id":"8313","w":70,"h":70},{"id":"8314","w":70,"h":70},{"id":"8315","w":70,"h":70},{"id":"8316","w":70,"h":70},{"id":"8317","w":70,"h":70},{"id":"8318","w":70,"h":70},{"id":"8319","w":70,"h":70},{"id":"8320","w":70,"h":70},{"id":"8321","w":70,"h":70},{"id":"8322","w":70,"h":70},{"id":"8323","w":70,"h":70},{"id":"8324","w":70,"h":70},{"id":"8325","w":70,"h":70},{"id":"8326","w":70,"h":70},{"id":"8327","w":70,"h":70},{"id":"8328","w":70,"h":70},{"id":"8329","w":70,"h":70},{"id":"8330","w":70,"h":70},{"id":"8331","w":70,"h":70},{"id":"8332","w":70,"h":70},{"id":"8333","w":70,"h":70},{"id":"8334","w":70,"h":70},{"id":"8335","w":70,"h":70},{"id":"8336","w":70,"h":70},{"id":"8337","w":70,"h":70},{"id":"8338","w":70,"h":70},{"id":"8339","w":70,"h":70},{"id":"8340","w":70,"h":70},{"id":"8341","w":70,"h":70},{"id":"8342","w":70,"h":70},{"id":"8343","w":70,"h":70},{"id":"8344","w":70,"h":70},{"id":"8345","w":70,"h":70},{"id":"8346","w":70,"h":70},{"id":"8347","w":70,"h":70},{"id":"8348","w":70,"h":70},{"id":"8349","w":70,"h":70},{"id":"8350","w":70,"h":70},{"id":"8351","w":70,"h":70},{"id":"8352","w":70,"h":70},{"id":"8353","w":70,"h":70},{"id":"8354","w":70,"h":70},{"id":"8355","w":70,"h":70},{"id":"8356","w":70,"h":70},{"id":"8357","w":70,"h":70},{"id":"8358","w":70,"h":70},{"id":"8359","w":70,"h":70},{"id":"8360","w":70,"h":70},{"id":"8361","w":70,"h":70},{"id":"8362","w":70,"h":70},{"id":"8363","w":70,"h":70},{"id":"8364","w":70,"h":70},{"id":"8365","w":70,"h":70},{"id":"8366","w":70,"h":70},{"id":"8367","w":70,"h":70},{"id":"8368","w":70,"h":70},{"id":"8369","w":70,"h":70},{"id":"8370","w":70,"h":70},{"id":"8371","w":70,"h":70},{"id":"8372","w":70,"h":70},{"id":"8373","w":70,"h":70},{"id":"8374","w":70,"h":70},{"id":"8375","w":70,"h":70},{"id":"8376","w":70,"h":70},{"id":"8377","w":70,"h":70},{"id":"8378","w":70,"h":70},{"id":"8379","w":70,"h":70}]}]}],
    sites: ["http://ponych.at/*"]
};

// Некоторые константы
var consts = {
    host: 'smile-o-pack.net',
    generatorUrl: 'http://smile-o-pack.net/generate.php',
    packIcoUrl: 'http://smile-o-pack.net/icons/0.a',
    smileUrlTemplate: 'http://smiles.smile-o-pack.net/{{id}}.gif',
    sectionIcoUrlTemplate: 'http://smile-o-pack.net/icons/{{id}}',
    categoryIcoUrlTemplate: 'http://smile-o-pack.net/icons/{{id}}',
    prefix: 'smile-o-pack-net-'
}


/**
 * Как было бы хорошо без кастомных разделов: у всех был бы id и он был уникальный :)
 * Сейчас это уже не так, так что эта функция - попытка сделать более-менее
 * постоянный и уникальный id для разделов. В первую очередь для сохранения в localStorage,
 * так-то можно было бы и индексом обойтись
 */
function getSectionIdentity(s) {
    if (s.id != null) { // не null и не undefined
        return s.id;
    } else {
        return 'name:' + s.name;
    }
}

function getSectionIcoUrl(s) {
    if(s.icon.toString().split('.').length!=2) {
        return s.icon;
    } else {
        s.icon = s.icon.toString();
        return consts.sectionIcoUrlTemplate.replace('{{id}}', s.icon);
    }
}

function getCategoryIcoUrl(c) {
    if(c.icon.toString().split('.').length!=2) {
        return c.icon;
    } else {
        c.icon = c.icon.toString();
        return consts.categoryIcoUrlTemplate.replace('{{id}}', c.icon);
    }
}

function getSmileUrl(s) {
    if(!s.url) {
        //sid = s.id.toString().split('.');
        //console.log(aid);
        //section = data.structure[sid[0]].code;
        //category = data.structure[sid[0]].categories[sid[1]].code;
        return consts.smileUrlTemplate.replace('{{id}}',s.id);
    } else {
        return s.url;
    }
}


// Хеш для доступа к разделам не по номеру, а по 'id' или суррогатному 'id'
var sectionsById = {};
data.sections.forEach(function(s) {
    sectionsById[getSectionIdentity(s)] = s;
});


// Дополнительные hook'и для сайтов.
var sites = {
    'tabun.everypony.ru': {
        defaultEnabled: true, // по умолчанию - false: ждём, пока пользователь кликнет по иконке над текстареей
        smileType: 'HTML',
        alterHtmlSmileAttributes: function(attrs) {
            attrs.class = 'smp';
        }
    },
    'forum.everypony.ru': {
        defaultEnabled: true,
        smileType: 'BB'
    },
    'habrahabr.ru': {
        smileType: 'HTML'
    },
    'freehabr.ru': {
        smileType: 'HTML'
    }
}
sites['news.playground.ru'] = sites['pix.playground.ru'] = sites['forums.playground.ru'] = sites['www.playground.ru'] = sites['playground.ru'] = {
    smileType: 'HTML'
}


// Состояние смайлопака: по сути большая каша переменных, сгруппированная в одном месте
var state = {
    siteConfig: {}, // конфиг текущего сайта, по умолчанию, пустой
    enabled: false, // включён ли смайлопак на данном сайте
    currentTextarea: null, // textarea, к которой присосалась плашка на данный момент
    smileType: 'HTML', // тип вставляемых смайлов, по умолчанию, 'HTML', может быть 'BB'
    currentSection: null, // текущий раздел
    currentCategoryIndex: null,
    blockWrapperMaxHeight: '600px', // максимальная высота блока (пока не реализована)
    ckeClickHack: false, // в редакторе CKE клик перехватывается раньше нашего. Обрабатываем mousedown
}

var elements = {
    wrapper: null, // html-элемент, оборачивающий textarea вместе с верхней и нижней панелями
    bottomWrapper: null, // html-элемент: внешняя обёртка для всех элементов ниже текстареи
    panel: null, // html-элемент: плашка смайлопака
    panelCategories: null,
    menu: null,
    topWrapper: null, // html-элемент: кнопка, плавающая поверх textarea
    blockContainer: null, // html-элемент: обёртка для блоков категорий
    currentBlock: null,
    blockCache: {}, // html-элементы: блоки категорий со смайлами (создаются по мере надобности)
    mnuSmileType: null,
    mnuSection: null,
    btnHide: null,
    btnEnable: null,
    newTopTableRow: null, // в тех редких случаях, когда нижняя панель добавляется в новом (следующем за textarea'ей) ряду таблицы, сохраним этот новый tr тут
    newBottomTableRow: null, // в тех редких случаях, когда верхняя панель добавляется в новом ряду таблицы, сохраним этот новый tr тут
}



// Вспомогательные функции

/**
 * Выполняет функцию, когда DOM оказывается полностью загружен
 */
function domReady(fun) {
    // TODO: проверить, работает ли вообще
    // TODO: добавить поддержку старых, немощных и больных браузеров, в т.ч. IE8
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
        fun();
    } else {
        document.addEventListener('DOMContentLoaded', fun, false);
    }
}

function getElement(id) {
    return document.getElementById(consts.prefix + id);
}

function htmlEscape(str) {
    return str && str.replace(/[&<>"]/g, function(c) {
        if (c === '&') return '&amp;'
        if (c === '<') return '&lt;'
        if (c === '>') return '&gt;'
        if (c === '"') return '&quot;'
    });
}

function getLocalStorageString(key) {
    return window.localStorage ? window.localStorage[consts.prefix + key] : null;
}
function setLocalStorageStringIfPossible(key, val) {
    if (window.localStorage && typeof window.localStorage === 'object') {
        window.localStorage[consts.prefix + key] = val;
    }
}

// http://stackoverflow.com/a/442474
function getOffset(el) {
    var _x = 0;
    var _y = 0;
    while(el && el != document.body && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
    }
    return { top: _y, left: _x };
}

/**
 * Проверяет, а не стоит ли по умолчанию использовать формат HTML на этом сайте
 */
function doesSiteProbablyUseHtml() {
    if (window.ls && window.ls.settings) {
        // LiveStreet CMS
        return true;
    }
    // TODO: другие признаки
    return false;
}

/**
 * Вызывает hook для текущего сайта, если он существует
 * Первым аргументом принимает имя хука, остальные - аргументы хука
 * Возвращает результат выполнения хука
 */
function invokeHook(name /*, arguments */) {
    if (state.siteConfig[name]) {
        return state.siteConfig[name].apply(null, Array.prototype.slice.call(arguments, 1));
    }
}


/**
 * Главная функция: вставляет смайл в текущую textarea
 */
function insertSmileToCurrentTextarea(src, w, h) {
    // TODO: возможно, заставить работать под IE8
    var ta = state.currentTextarea
      , s = ta.selectionStart
      , e = ta.selectionEnd
      , smileSource;

    if (state.smileType == 'HTML') {
        // Без высоты: сама подгонится, а пользователю не надо пересчитывать пропорции
        var attrs = { src: src, width: w };
        invokeHook('alterHtmlSmileAttributes', attrs);
        smileSource = '<img ';
        for (var a in attrs) {
            smileSource += a + '="' + htmlEscape(attrs[a]) + '" ';
        }
        smileSource += '/>';
    } else /* BB */ {
        smileSource = '[IMG]' + src + '[/IMG]'
    }
    ta.value = ta.value.substr(0, s) + smileSource + ta.value.substr(e);
    ta.selectionStart = ta.selectionEnd = s + smileSource.length;
    ta.focus();
}


// Изменение состояния смайлопака (выбор раздела/типа смайлов)

function fixWidth() {
    var ta = state.currentTextarea;
    if (ta) {
        elements.topWrapper.style.width = elements.bottomWrapper.style.width = '' + ta.offsetWidth + 'px';
        var computedStyles = getComputedStyle ? getComputedStyle(ta) : ta.currentStyle;
        ['margin-top', 'margin-bottom', 'margin-left', 'margin-right', 'position', 'box-sizing'].forEach(function(a) {
            elements.topWrapper.style.setProperty(a, computedStyles.getPropertyValue(a));
            elements.bottomWrapper.style.setProperty(a, computedStyles.getPropertyValue(a));
        });
    }
}

function isTheOnlyChild(el) {
    if (!el || el == document.body || !el.parentNode) {
        return false;
    }
    var res = true;
    Array.prototype.forEach.call(el.parentNode.childNodes, function(n) {
        if (n.nodeType == 1 && n != el) res = false
    });
    return res;
}

function attachToTextarea(ta) {
    if (state.currentTextarea) {
        // detach: remove wrappers
        if (elements.topWrapper.parentNode) {
            elements.topWrapper.parentNode.removeChild(elements.topWrapper);
        }
        if (elements.bottomWrapper.parentNode) {
            elements.bottomWrapper.parentNode.removeChild(elements.bottomWrapper);
        }
        if (elements.newTopTableRow && elements.newTopTableRow.parentNode) {
            elements.newTopTableRow.parentNode.removeChild(elements.newTopTableRow);
            elements.newTopTableRow = null;
        }
        if (elements.newBottomTableRow && elements.newBottomTableRow.parentNode) {
            elements.newBottomTableRow.parentNode.removeChild(elements.newBottomTableRow);
            elements.newBottomTableRow = null;
        }
    }
    state.currentTextarea = ta;
    if (ta) {

        state.ckeClickHack = !!(/(^|\s)cke_source(\s|$)/.exec(ta.className));

        fixWidth();

        // Найдём, куда присоседиться. При этом считаем, что если textarea - единственное дитё узла, то присоседиваться надо к её родителю
        // Если присоседится надо к единственной дите, но она - дитё TD, придётся дофигачить TR
        if (!isTheOnlyChild(ta)) {

            ta.parentNode.insertBefore(elements.topWrapper, ta);
            if (ta.nextSibling) {
                ta.parentNode.insertBefore(elements.bottomWrapper, ta.nextSibling);
            } else {
                ta.parentNode.appendChild(elements.bottomWrapper);
            }

        } else if (ta.parentNode.nodeName.toUpperCase() != 'TD') {

            var n = ta.parentNode;

            n.parentNode.insertBefore(elements.topWrapper, n);
            if (n.nextSibling) {
                n.parentNode.insertBefore(elements.bottomWrapper, n.nextSibling);
            } else {
                n.parentNode.appendChild(elements.bottomWrapper);
            }


        } else {

            var topParent, bottomParent, tr = ta.parentNode.parentNode;

            elements.newTopTableRow = document.createElement('TR');
            elements.newBottomTableRow = document.createElement('TR');
            Array.prototype.forEach.call(tr.childNodes, function(td) {
                var newTopTd = document.createElement('TD')
                  , newBottomTd = document.createElement('TD');
                if (td.hasAttribute('colspan')) {
                    newTopTd.setAttribute('colspan', td.getAttribute('colspan'))
                    newBottomTd.setAttribute('colspan', td.getAttribute('colspan'))
                }
                elements.newTopTableRow.appendChild(newTopTd);
                elements.newBottomTableRow.appendChild(newBottomTd);
                if (td == ta.parentNode) {
                    topParent = newTopTd;
                    bottomParent = newBottomTd;
                }
            });

            tr.parentNode.insertBefore(elements.newTopTableRow, tr);
            if (tr.nextSibling) {
                tr.parentNode.insertBefore(elements.newBottomTableRow, tr.nextSibling);
            } else {
                tr.parentNode.appendChild(elements.newBottomTableRow);
            }

            if (topParent) {
                topParent.appendChild(elements.topWrapper);
            } // ELSE: probably, impossible
            if (bottomParent) {
                bottomParent.appendChild(elements.bottomWrapper);
            } // ELSE: probably, impossible

        }
    }
}

function setEnabled(enabled) {
    state.enabled = enabled;
    setLocalStorageStringIfPossible('enabled', enabled);
    elements.bottomWrapper.style.display = enabled ? 'block' : 'none';
    elements.btnEnable.style.display = enabled ? 'none' : 'block';
}

function setSmileType(type /* HTML/BB */) {
    state.smileType = type;
    setLocalStorageStringIfPossible('smileType', type);
    if (elements.mnuSmileType) { // null if siteConfig.smileType is set
        Array.prototype.slice.call(elements.mnuSmileType.getElementsByTagName('LI')).forEach(function(li) {
            if (li.getAttribute('data-' + consts.prefix + 'smile-type') == type) {
                li.setAttribute('class', consts.prefix + 'current');
            } else {
                li.removeAttribute('class');
            }
        });
    }
}

function setCurrentSection(id) {
    if (!sectionsById[id]) {
        // на случай, если такой раздел уже был удалён пользователем
        id = getSectionIdentity(data.sections[0]);
    }
    state.currentSection = sectionsById[id];
    setLocalStorageStringIfPossible('currentSectionId', id);
    setCurrentCategory(null);
    // быстро сносим оттуда все кнопочки
    elements.panelCategories.innerHTML = '';
    state.currentSection.categories.forEach(function(category, idx) {
        var img = document.createElement('IMG');
        img.setAttribute('src', getCategoryIcoUrl(category));
        img.setAttribute('data-' + consts.prefix + 'category-index', idx);
        img.setAttribute('title', category.name);
        img.setAttribute('alt', category.name);
        img.addEventListener('click', onCategoryIconClick);
        elements.panelCategories.appendChild(img);
    });
    if (elements.mnuSection) { // null if there is a single section only
        Array.prototype.slice.call(elements.mnuSection.getElementsByTagName('LI')).forEach(function(li) {
            if (li.getAttribute('data-' + consts.prefix + 'section-identity') == id) {
                li.setAttribute('class', consts.prefix + 'current');
            } else {
                li.removeAttribute('class');
            }
        });
    }
}

function createBlock(sectionId, categoryIndex) {
    var block = document.createElement('DIV')
        , imgTemplate = document.createElement('IMG')
        , buf = []
        , i
        , timer;

    block.addEventListener('mousedown', function(ev) {
        if (state.ckeClickHack) {
            onSmileBlockClick(ev);
        }
    });
    block.addEventListener('click', function(ev) {
        if (!state.ckeClickHack) {
            onSmileBlockClick(ev);
        }
    });
    // Для начала проставим шаблону простой src, равный однопиксельному гифу
    // Его отрисовка происходит почти мгновенно, зато лиса не будет плющить вёрстку из-за того,
    // что src пока пуст (а она это делает, даже не смотря на то, что ей размеры прописали)
    imgTemplate.setAttribute('src', 'data:image/gif;base64,R0lGODdhAQABAIABAP///+dubiwAAAAAAQABAAACAkQBADs=');
    // Теперь пробежимся по всем смайлам, создадим и добавим их в DOM
    sectionsById[sectionId].categories[categoryIndex].smiles.forEach(function(smile) {
        var img = imgTemplate.cloneNode(false);
        img.setAttribute('width', smile.w);
        img.setAttribute('height', smile.h);
        block.appendChild(img);
        // хак для уменьшения лага: оказалось, что проставление url'а картинке - длительный процесс
        // и выгоднее отложить его для скорейшего появления блока
        buf.push({ img: img, url: getSmileUrl(smile) });
    });
    // А вот теперь, запускаем проставление реальных src: по десять за раз с минимальным интервалом
    i = 0;
    timer = setInterval(function() {
        for (var j = i; j < buf.length && j < i + 10; j++) {
            buf[j].img.setAttribute('src', buf[j].url);
        }
        i = j;
        if (i >= buf.length) {
            clearInterval(timer);
        }
    }, 0);
    return block;
}

/**
 * Отображает блок со смайлами из указанной категории текущего раздела
 */
function setCurrentCategory(categoryIndex) {

    state.currentCategoryIndex = categoryIndex;

    if (categoryIndex === null) {
        elements.btnHide.style.visibility = 'hidden';
        if (elements.currentBlock) {
            elements.blockContainer.removeChild(elements.currentBlock);
            elements.currentBlock = null;
        }
        elements.blockContainer.style.display = 'none';
    } else {
        // сначала спрячем то, что уже есть
        if (elements.currentBlock) {
            elements.blockContainer.removeChild(elements.currentBlock);
        }


        var sectionId = getSectionIdentity(state.currentSection);

        // в случае, если для данного раздела ещё ни одной категории в кеше нет, надо
        // создать там пустой объект
        elements.blockCache[sectionId] = elements.blockCache[sectionId] || {};

        // если блок в кеше - пользуемя им, если пока нет - создаём
        var block = elements.blockCache[sectionId][categoryIndex];
        if (!block) {
            block = elements.blockCache[sectionId][categoryIndex] = createBlock(sectionId, categoryIndex);
        }

        elements.currentBlock = block;

        elements.blockContainer.appendChild(block);
        elements.btnHide.style.visibility = 'visible';
        elements.blockContainer.style.display = 'block';
        // TODO: проставить максимальную высоту и дать пользователю возможность ресайзить blockContainer
    }
}


// Обработчики кликов

function onSmileBlockClick(evt) {

    var img = evt.srcElement || evt.originalTarget;

    if (img.nodeName.toUpperCase() === 'IMG') {
        insertSmileToCurrentTextarea(
            img.getAttribute('src'),
            img.getAttribute('width'),
            img.getAttribute('height')
        );
    }

    return false;
}

function onCategoryIconClick() {
    var categoryIndex = this.getAttribute('data-' + consts.prefix + 'category-index');

    if (state.currentCategoryIndex === categoryIndex) {
        setCurrentCategory(null);
    } else {
        setCurrentCategory(categoryIndex);
    }
    return false;
}


/**
 * Обрабатывает событие фокуса любого фокусируемого элемента
 */
function onAnyElementFocus(evt) {
    // периодически лиса на этой строчке пишет, что permission denied
    // при этом, ловить exception бесполезно. Ну и пофик
    var target = evt.srcElement || evt.originalTarget;

    if (target && target.nodeName.toUpperCase() == 'TEXTAREA') {
        if (state.currentTextarea != target) {
            attachToTextarea(target);
        } else {
            fixWidth();
        }
    }

    return true;
}

/**
 * Создаёт DOM-модель смайлопака для последующего встраивания в документ и отображения
 */
function createElements() {
    function createElement(tag, baseId, parent, innerHTML) {
        var res = document.createElement(tag);
        if (baseId) res.setAttribute('id', consts.prefix + baseId);
        if (parent) parent.appendChild(res);
        if (innerHTML) res.innerHTML = innerHTML;
        return res;
    }

    function onBtnHideClick() {
        setCurrentCategory(null);
        return false;
    }

    function showMenu() {
        if (!state.currentTextarea) {
            return; // вообще-то, такого не будет, конечно
        }
        //elements.menu.style.display = 'block';
        document.body.appendChild(elements.menu);

        var off = getOffset(elements.panel);
        elements.menu.style.setProperty('left', (off.left + elements.panel.offsetWidth - elements.menu.offsetWidth) + 'px')
        elements.menu.style.setProperty('top', (off.top + elements.panel.offsetHeight) + 'px')

        window.setTimeout(function() {
            document.addEventListener('click', onDocumentClickWhenMenuIsShown);
        }, 0);
    }

    function hideMenu() {
        document.body.removeChild(elements.menu);
        document.removeEventListener('click', onDocumentClickWhenMenuIsShown);
    }

    function onDocumentClickWhenMenuIsShown() {
        hideMenu();
        return false;
    }

    function onMenuClick(e) {
        // не дадим событию дойти до document
        e.stopPropagation();
        return false;
    }

    function onBtnMenuClick() {
        if (elements.menu.offsetHeight > 0 || elements.menu.offsetWidth > 0) {
            hideMenu();
        } else {
            showMenu();
        }
        return false;
    }

    function onMniSmileTypeClick() {
        setSmileType(this.getAttribute('data-' + consts.prefix + 'smile-type'));
        hideMenu();
        return false;
    }

    function onMniSectionClick() {
        setCurrentSection(this.getAttribute('data-' + consts.prefix + 'section-identity'));
        hideMenu();
        return false;
    }

    function onMniTurnOffClick() {
        setEnabled(false);
        hideMenu();
        return false;
    }

    elements.topWrapper = createElement('DIV', 'top-wrapper');

    elements.btnEnable = createElement('IMG', 'btn-enable', elements.topWrapper);
    elements.btnEnable.src = consts.packIcoUrl;
    elements.btnEnable.addEventListener('click', function() { setEnabled(true) });

    elements.bottomWrapper = createElement('DIV', 'bottom-wrapper');

    elements.panel = createElement('DIV', 'panel', elements.bottomWrapper);

    var panelRight = createElement('DIV', 'panel-right', elements.panel);

    elements.btnHide = createElement('A', 'btn-hide', panelRight, 'скрыть');
    elements.btnHide.setAttribute('href', 'javascript:void(0)');
    elements.btnHide.addEventListener('click', onBtnHideClick);

    var btnMenu = createElement('A', 'btn-menu', panelRight, '&nbsp;&#9660;&nbsp;');
    btnMenu.setAttribute('href', 'javascript:void(0)');
    btnMenu.addEventListener('click', onBtnMenuClick);

    elements.menu = createElement('DIV', 'menu');
    elements.menu.addEventListener('click', onMenuClick);

    // Tипы смайлов
    if (!state.siteConfig.smileType) {

        createElement('H6', null, elements.menu, 'Тип смайлов');
        elements.mnuSmileType = createElement('UL', null, elements.menu);

        var mniSmileTypeHTML = createElement('LI', null, elements.mnuSmileType, '&lt;HTML&gt;');
        mniSmileTypeHTML.setAttribute('data-' + consts.prefix + 'smile-type', 'HTML');
        mniSmileTypeHTML.addEventListener('click', onMniSmileTypeClick);

        var mniSmileTypeBB = createElement('LI', null, elements.mnuSmileType, '[BB-Code]');
        mniSmileTypeBB.setAttribute('data-' + consts.prefix + 'smile-type', 'BB');
        mniSmileTypeBB.addEventListener('click', onMniSmileTypeClick);

    }

    // Разделы смайлопака
    if (data.sections.length > 1) {

        createElement('H6', null, elements.menu, 'Раздел');
        elements.mnuSection = createElement('UL', null, elements.menu);

        data.sections.forEach(function(s) {
            var li = createElement('LI', null, elements.mnuSection)
              , ico = getSectionIcoUrl(s);

            if (ico) {
                createElement('IMG', null, li).setAttribute('src', ico);
            }
            li.innerHTML += ' ' + s.name; // ugly :(

            li.setAttribute('data-' + consts.prefix + 'section-identity', getSectionIdentity(s));

            li.addEventListener('click', onMniSectionClick);
        });

    }

    var generatorLink = createElement('A', null, null, 'Генератор');
    generatorLink.setAttribute('href', consts.generatorUrl);
    createElement('H6', null, elements.menu).appendChild(generatorLink);

    var turnOffLink = createElement('A', null, null, 'Выключить');
    turnOffLink.setAttribute('href', 'javascript:void(0)');
    turnOffLink.addEventListener('click', onMniTurnOffClick);
    createElement('H6', null, elements.menu).appendChild(turnOffLink);


    // После меню добавим саму панель

    elements.panelCategories = createElement('DIV', 'panel-categories', elements.panel);
    elements.blockContainer = createElement('DIV', 'block-container', elements.bottomWrapper);
}

/**
 * Пробрасывает необходимые стили в документ
 */
function createStyles() {
    var style =
        '#prefix-bottom-wrapper, #prefix-bottom-wrapper *, #prefix-top-wrapper, #prefix-top-wrapper *, #prefix-menu * { margin:0; padding:0; border:none; font-size:10pt; font-family:sans-serif; color:#000; white-space:normal; } \n' +

        '#prefix-panel { background:#EEE; border-radius:2px; }                                      \n' +
        '#prefix-panel-categories { display: inline-block; }                                        \n' +
        '#prefix-panel-right { float:right; padding:7px 3px; overflow:visible; position:relative; } \n' +

        '#prefix-panel-categories IMG { margin:2px; cursor:pointer; width:25px; height:25px; }      \n' +

        '#prefix-btn-hide { visibility:hidden; color:#AAA; text-decoration:none; outline:none; }    \n' +
        '#prefix-btn-hide:hover { color:#555; text-decoration:none; }                               \n' +
        '#prefix-btn-menu { color:#AAA; text-decoration:none; outline:none; }                       \n' +
        '#prefix-btn-menu:hover { color:#555; text-decoration:none; }                               \n' +

        '#prefix-menu { display:block; position:absolute; background:#EEE; padding:5px; border-radius:2px; border:1px solid #CCC; z-index:100500; } \n' +
        '#prefix-menu H6 { white-space:nowrap; margin:5px 0; text-align:center; font-weight:bold; } \n' +
        '#prefix-menu UL { list-style:none; }                                                       \n' +

        '#prefix-menu LI { white-space:nowrap; line-height:25px; padding:2px 5px; cursor:pointer; border-radius:2px; }   \n' +
        '#prefix-menu LI:hover { background:#AAA; }                                                 \n' +

        '#prefix-menu LI.prefix-current { background:#CCC; cursor:default; }                        \n' +
        '#prefix-menu LI.prefix-current:hover { background:#CCC; cursor:default; }                  \n' +

        '#prefix-menu LI IMG { width:25px; height:25px; vertical-align:middle; }                    \n' +

        '#prefix-block-container { display:none; overflow-y:auto; position:relative; }              \n' +
        '#prefix-block-container DIV { padding:2px; }                                               \n' +
        '#prefix-block-container IMG { margin:0 2px; line-height:100%; cursor:pointer; border:1px solid #EEE; border-radius:5px; padding:2px; background:#FFF; } \n' +

        '#prefix-btn-enable { width:25px; height:25px; opacity:0.4; float:right; margin:5px 5px 0 -30px; cursor:pointer; } \n';

    var el = document.createElement('STYLE');
    el.innerHTML = style.replace(/prefix-/g, consts.prefix);
    document.head.appendChild(el);
}


function init() {
    if (window.location.host == consts.host) {
        // Вызываем заранее известную функцию, передающую данные генератору
        window.letsTalkFellowJS(data);

        return; // больше ничего делать не надо
    }

    if (data.sections.length == 0) {
        // В будущем, возможно, надо будет подгружать смайлы с сайта смайлопака, но пока это не надо,
        // выходим, если нечего показать
        return;
    }

    state.siteConfig = sites[window.location.host] || {};

    createElements();
    createStyles();

    // Проставляем сохранённые пользователем настройки
    setSmileType(getLocalStorageString('smileType') || state.siteConfig.smileType || (doesSiteProbablyUseHtml() ? 'HTML' : 'BB'));
    setCurrentSection(getLocalStorageString('currentSectionId') || state.siteConfig.defaultSection || getSectionIdentity(data.sections[0]));
    setEnabled(getLocalStorageString('enabled') == 'true' || state.siteConfig.defaultEnabled || false);

    // Присосёмся к активной TEXTAREA, если таковая есть
    if (document.activeElement &&
            document.activeElement.nodeName.toUpperCase() === 'TEXTAREA') {
        attachToTextarea(document.activeElement);
    }

    // Вот здесь - некоторая магия: приходится привязываться к двум событиям, чтобы
    // работало и в лисе и в хроме. В предельном случае, обработчик будет вызван
    // несколько раз, что, в принципе, не страшно.
    document.addEventListener('focus', onAnyElementFocus, true);
    document.addEventListener('focusin', onAnyElementFocus);

    invokeHook('onAfterInit');
}


domReady(init);

});

