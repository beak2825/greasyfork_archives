// ==UserScript==
// @name        DeathByCatpcha API Wrapper
// @grant       GM_xmlhttpRequest
// ==/UserScript==


function DeathByCaptcha (dbc_user, dbc_pass) {
  this.user = dbc_user;
  this.pass = dbc_pass;

  this.balance = function balance(callback) {
    var reqUrl = 'http://api.dbcapi.me/api/user';
    var formData = new FormData();
    formData.append('username', this.user);
    formData.append('password', this.pass);

    GM_xmlhttpRequest({
      method: 'POST',
      headers: {
        'Accept': 'application/json'
      },
      data: formData,
      url: reqUrl,
      onload: function (response) {
        if (response.status === 200) {
          var balance = JSON.parse(response.responseText).balance;
          callback(null, balance);
        } else {
          callback(new Error(response.status), null);
        }
      }
    });
  };

  this.report = function report(capId, callback) {
    var reportUrl = 'http://api.dbcapi.me/api/captcha/' + capId + '/report';
    var formData = new FormData();
    formData.append('username', this.user);
    formData.append('password', this.pass);

    GM_xmlhttpRequest({
      method: 'POST',
      data: formData,
      url: reportUrl,
      onload: function (response) {
        if (response.status === 200) {
          console.log('DeathByCaptcha: captcha reported as incorrect');
          callback(null);
        } else {
          callback(new Error(response.status));
        }
      }
    });
  };

  this.solve = function solve(imgNode, callback) {

    //create base64 uri
    var canvas = document.createElement('CANVAS');
    var ctx = canvas.getContext('2d');
    canvas.height = imgNode.height;
    canvas.width = imgNode.width;
    ctx.drawImage(img, 0, 0);
    var imgB64 = canvas.toDataURL().replace(/data:image\/(png|jpg);base64,/, 'base64:');

    //create form to submit to DBC
    var formData = new FormData();
    formData.append('username', this.user);
    formData.append('password', this.pass);
    formData.append('captchafile', imgB64);

    //upload captcha to DBC
    GM_xmlhttpRequest({
      method: 'POST',
      data: formData,
      url: 'http://api.dbcapi.me/api/captcha',
      onload: function (response) {

        //return http errors
        switch (response.status) {
          case 403:
            console.error('DeathByCaptcha: 403 Forbidden - Invalid credentails or insufficient credits');
            callback(new Error(403));
            return;
          case 400:
            console.error('DeathByCaptcha: 300 Bad Request');
            callback(new Error(400));
            return;
          case 500:
            callback(new Error(500));
            console.error('DeathByCaptcha: 500 Internal Server Error');
            return;
          case 503:
            console.error('DeathByCaptcha: 503 Service Temporarily Unavailable');
            callback(new Error(503));
            return;
        }

        console.log('DeathByCaptcha: Uploaded captcha');
        console.log("DeathByCaptcha: URL - " + response.finalUrl);


        //check every 2 seconds if captcha is solved
        var pollTimer = setInterval(function () {
          GM_xmlhttpRequest({
            method: 'GET',
            headers: {
              'Accept': 'application/json'
            },
            url: capUrl,
            onload: function (response) {
              console.log('DeathByCaptcha: Checking for solved captcha.');

              if (response.status === 404) {
                clearInterval(pollTimer);
                console.log('DeathByCaptcha: Captcha ID Not Found.');
                callback(new Error(404));

              } else if (response.status === 200) {


                var solution = JSON.parse(response.responseText).text;
                var capId = JSON.parse(response.responseText).captcha;

                if (solution !== '') {
                  clearInterval(pollTimer);
                  console.log('DeathByCaptcha: Captcha solved');

                  callback(null, solution, capId);
                }
              }
            }
          });
        }, 2000);
      }
    });
  };
}