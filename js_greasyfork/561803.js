// ==UserScript==
// @name         文本框优化-默认值填充
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  美化
// @author       HK
// @match      https://ai.zjw.hk/*
// @run-at	     document-end
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_notification
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/561803/%E6%96%87%E6%9C%AC%E6%A1%86%E4%BC%98%E5%8C%96-%E9%BB%98%E8%AE%A4%E5%80%BC%E5%A1%AB%E5%85%85.user.js
// @updateURL https://update.greasyfork.org/scripts/561803/%E6%96%87%E6%9C%AC%E6%A1%86%E4%BC%98%E5%8C%96-%E9%BB%98%E8%AE%A4%E5%80%BC%E5%A1%AB%E5%85%85.meta.js
// ==/UserScript==

(function () {
    'use strict';
    GM_addStyle(".blank ,input.blank-input,.blank-container{ width: 360px !important} .container { max-width: 100%!important; }");
    document.body.style += ' margin: 0!important; max-width: 100%!important; '
    document.getElementById("name").setAttribute("value", "高亚斌");

    if (document.URL.toString().includes("1.1.1")) {
        document.getElementById("blank1").innerText = "pd.read_csv('patient_data.csv')";
        // document.getElementById("blank2").innerText = "data['RiskLevel']";
        // document.getElementById("blank3").innerText = "np.where";
        // document.getElementById("blank4").innerText = "data['DaysInHospital']>7";
        // document.getElementById("blank5").innerText = "['RiskLevel']";
        // document.getElementById("blank6").innerText = "value_counts()";
        // document.getElementById("blank7").innerText = "len(data)";
        document.getElementById("blank8").innerText = "len(data)";
        // document.getElementById("blank9").innerText = "pd.cut";
        // document.getElementById("blank10").innerText = "data['BMI']";
        document.getElementById("blank11").innerText = "bins=bmi_bins";
        document.getElementById("blank12").innerText = "labels=bmi_labels";
        // document.getElementById("blank13").innerText = "data.groupby";
        // document.getElementById("blank14").innerText = "'BMIRange'";
        // document.getElementById("blank15").innerText = "['BMIRange'].value_counts()";
        // document.getElementById("blank16").innerText = "pd.cut";
        // document.getElementById("blank17").innerText = "data['Age']";
        document.getElementById("blank18").innerText = "bins=age_bins";
        document.getElementById("blank19").innerText = "labels=age_labels";
        // document.getElementById("blank20").innerText = "data.groupby";
        // document.getElementById("blank21").innerText = "'AgeRange'";
        // document.getElementById("blank22").innerText = "['AgeRange'].value_counts()";
    } else if (document.URL.toString().includes("1.1.2")) {
        document.getElementById("blank1").innerText = "pd.read_csv('sensor_data.csv')";
        // document.getElementById("blank2").innerText = "data.groupby";
        // document.getElementById("blank3").innerText = "'SensorType'";
        // document.getElementById("blank4").innerText = "agg(['count','mean'])";
        // document.getElementById("blank5").innerText = "isin(['Temperature','Humidity'])]";
        // document.getElementById("blank6").innerText = "groupby(['Location','SensorType'])";
        // document.getElementById("blank7").innerText = "np.where";
        // document.getElementById("blank8").innerText = "data['SensorType']=='Temperature'";
        // document.getElementById("blank9").innerText = "data['SensorType']=='Humidity'";
        // document.getElementById("blank10").innerText = "sum()";
        // document.getElementById("blank11").innerText = "fillna";
        // document.getElementById("blank12").innerText = "method='ffill'";
        document.getElementById("blank13").innerText = "fillna";
        // document.getElementById("blank14").innerText = "method='bfill'";
        // document.getElementById("blank15").innerText = "data.drop";
        // document.getElementById("blank16").innerText = "columns";
        document.getElementById("blank17").innerText = "cleaned_data.to_csv";
        document.getElementById("blank18").innerText = "index=False";
    } else if (document.URL.toString().includes("1.1.3")) {
        // document.getElementById("blank1").innerText = "isnull().sum()";
        // document.getElementById("blank2").innerText = "duplicated().sum()";
        document.getElementById("blank3").innerText = "data['Age']";
        // document.getElementById("blank4").innerText = "between";
        document.getElementById("blank5").innerText = "data['Income']";
        document.getElementById("blank6").innerText = "2000";
        document.getElementById("blank7").innerText = "data['LoanAmount']";
        document.getElementById("blank8").innerText = "data['Income']";
        document.getElementById("blank9").innerText = "data['CreditScore']";
        // document.getElementById("blank10").innerText = "between";
        // document.getElementById("blank11").innerText = "cleaned_data";
        document.getElementById("blank12").innerText = "to_csv";
        document.getElementById("blank13").innerText = "'cleaned_credit_data.csv'";
    } else if (document.URL.toString().includes("1.1.4")) {
        document.getElementById("blank1").value = "pandas.read_csv('user_behavior_data.csv')";
        document.getElementById("blank2").value = "data.head()";
        // document.getElementById("blank3").value = "data.dropna()";
        document.getElementById("blank4").value = "['Age']";
        document.getElementById("blank5").value = "data['Age'].astype";
        document.getElementById("blank6").value = "['PurchaseAmount']";
        document.getElementById("blank7").value = "data['PurchaseAmount'].astype";
        document.getElementById("blank8").value = "['ReviewScore']";
        document.getElementById("blank9").value = "data['ReviewScore'].astype";
        document.getElementById("blank10").value = "data['Age']";
        // document.getElementById("blank11").value = "between";
        document.getElementById("blank12").value = "data['ReviewScore']";
        // document.getElementById("blank13").value = "between";
        // document.getElementById("blank14").value = "data['PurchaseAmount'].mean()";
        // document.getElementById("blank15").value = "data['PurchaseAmount'].std()";
        // document.getElementById("blank16").value = "data['ReviewScore'].mean()";
        // document.getElementById("blank17").value = "data['ReviewScore'].std()";
        document.getElementById("blank18").value = "data.to_csv";
        document.getElementById("blank19").value = "data['PurchaseCategory']";
        // document.getElementById("blank20").value = "value_counts()";
        // document.getElementById("blank21").value = "data.groupby";
        // document.getElementById("blank22").value = "'Gender'";
        document.getElementById("blank23").value = "cut";
        // document.getElementById("blank24").value = "data['Age'],bins=bins,labels=labels";
    } else if (document.URL.toString().includes("1.1.5")) {
        document.getElementById("blank1").value = "pd.read_csv('vehicle_traffic_data.csv')";
        document.getElementById("blank2").value = "data.head()";
        // document.getElementById("blank3").value = "data.dropna()";
        document.getElementById("blank4").value = "['Age']";
        document.getElementById("blank5").value = "data['Age'].astype";
        document.getElementById("blank6").value = "['Speed']";
        document.getElementById("blank7").value = "data['Speed'].astype";
        document.getElementById("blank8").value = "['TravelDistance']";
        document.getElementById("blank9").value = "data['TravelDistance'].astype";
        document.getElementById("blank10").value = "['TravelTime']";
        document.getElementById("blank11").value = "data['TravelTime'].astype";
        document.getElementById("blank12").value = "data['Age']";
        document.getElementById("blank13").value = "between";
        document.getElementById("blank14").value = "data['Speed']";
        document.getElementById("blank15").value = "between";
        document.getElementById("blank16").value = "data['TravelDistance']";
        document.getElementById("blank17").value = "between";
        document.getElementById("blank18").value = "data['TravelTime']";
        document.getElementById("blank19").value = "between";
        document.getElementById("blank20").value = "data.to_csv";
        document.getElementById("blank21").value = "data['Age']";
        document.getElementById("blank22").value = "between";
        document.getElementById("blank23").value = "data['Speed']";
        document.getElementById("blank24").value = "between";
        document.getElementById("blank25").value = "data['TravelDistance']";
        document.getElementById("blank26").value = "between";
        document.getElementById("blank27").value = "data['TravelTime']";
        document.getElementById("blank28").value = "between";
        // document.getElementById("blank29").value = "data['TrafficEvent'].value_counts()";
        // document.getElementById("blank30").value = "groupby('Gender')";
        // document.getElementById("blank31").value = "agg({'Speed':'mean','TravelDistance':'mean','TravelTime':'mean'})";
        // document.getElementById("blank32").value = "pd.cut";
        document.getElementById("blank33").value = "data['Age']";
        document.getElementById("blank34").value = "bins=age_bins";
        document.getElementById("blank35").value = "labels=age_labels";
        // document.getElementById("blank36").value = "data['AgeGroup'].value_counts()";
    } else if (document.URL.toString().includes("2.1.1")) {
        document.getElementById("blank1").value = "";
        document.getElementById("blank2").value = "";
        document.getElementById("blank3").value = "";
        document.getElementById("blank4").value = "";
        document.getElementById("blank5").value = "";
        document.getElementById("blank6").value = "";
        document.getElementById("blank7").value = "";
        document.getElementById("blank8").value = "";
        document.getElementById("blank9").value = "";
        document.getElementById("blank10").value = "";
        document.getElementById("blank11").value = "";
        document.getElementById("blank12").value = "";
        document.getElementById("blank13").value = "";
        document.getElementById("blank14").value = "";
    } else if (document.URL.toString().includes("2.1.2")) {
        document.getElementById("blank1").value = "";
        document.getElementById("blank2").value = "";
        document.getElementById("blank3").value = "";
        document.getElementById("blank4").value = "";
        document.getElementById("blank5").value = "";
        document.getElementById("blank6").value = "";
        document.getElementById("blank7").value = "";
        document.getElementById("blank8").value = "";
        document.getElementById("blank9").value = "";
        document.getElementById("blank10").value = "";
        document.getElementById("blank11").value = "";
        document.getElementById("blank12").value = "";
        document.getElementById("blank13").value = "";
        document.getElementById("blank14").value = "";
    } else if (document.URL.toString().includes("2.1.3")) {
        document.getElementById("blank1").value = "";
        document.getElementById("blank2").value = "";
        document.getElementById("blank3").value = "";
        document.getElementById("blank4").value = "";
        document.getElementById("blank5").value = "";
        document.getElementById("blank6").value = "";
        document.getElementById("blank7").value = "";
        document.getElementById("blank8").value = "";
        document.getElementById("blank9").value = "";
        document.getElementById("blank10").value = "";
        document.getElementById("blank11").value = "";
        document.getElementById("blank12").value = "";
        document.getElementById("blank13").value = "";
        document.getElementById("blank14").value = "";
    } else if (document.URL.toString().includes("2.1.4")) {
        document.getElementById("blank1").value = "";
        document.getElementById("blank2").value = "";
        document.getElementById("blank3").value = "";
        document.getElementById("blank4").value = "";
        document.getElementById("blank5").value = "";
        document.getElementById("blank6").value = "";
        document.getElementById("blank7").value = "";
        document.getElementById("blank8").value = "";
        document.getElementById("blank9").value = "";
        document.getElementById("blank10").value = "";
        document.getElementById("blank11").value = "";
        document.getElementById("blank12").value = "";
        document.getElementById("blank13").value = "";
        document.getElementById("blank14").value = "";
    } else if (document.URL.toString().includes("2.1.5")) {
        document.getElementById("blank1").value = "";
        document.getElementById("blank2").value = "";
        document.getElementById("blank3").value = "";
        document.getElementById("blank4").value = "";
        document.getElementById("blank5").value = "";
        document.getElementById("blank6").value = "";
        document.getElementById("blank7").value = "";
        document.getElementById("blank8").value = "";
        document.getElementById("blank9").value = "";
        document.getElementById("blank10").value = "";
        document.getElementById("blank11").value = "";
        document.getElementById("blank12").value = "";
        document.getElementById("blank13").value = "";
        document.getElementById("blank14").value = "";
    } else if (document.URL.toString().includes("2.2.1")) {
        document.getElementById("blank1").value = "";
        document.getElementById("blank2").value = "";
        document.getElementById("blank3").value = "";
        document.getElementById("blank4").value = "";
        document.getElementById("blank5").value = "";
        document.getElementById("blank6").value = "";
        document.getElementById("blank7").value = "";
        document.getElementById("blank8").value = "";
        document.getElementById("blank9").value = "";
        document.getElementById("blank10").value = "";
        document.getElementById("blank11").value = "";
        document.getElementById("blank12").value = "";
        document.getElementById("blank13").value = "";
        document.getElementById("blank14").value = "";
    } else if (document.URL.toString().includes("2.2.2")) {
        document.getElementById("blank1").value = "";
        document.getElementById("blank2").value = "";
        document.getElementById("blank3").value = "";
        document.getElementById("blank4").value = "";
        document.getElementById("blank5").value = "";
        document.getElementById("blank6").value = "";
        document.getElementById("blank7").value = "";
        document.getElementById("blank8").value = "";
        document.getElementById("blank9").value = "";
        document.getElementById("blank10").value = "";
        document.getElementById("blank11").value = "";
        document.getElementById("blank12").value = "";
        document.getElementById("blank13").value = "";
        document.getElementById("blank14").value = "";
    } else if (document.URL.toString().includes("2.2.3")) {
        document.getElementById("blank1").value = "";
        document.getElementById("blank2").value = "";
        document.getElementById("blank3").value = "";
        document.getElementById("blank4").value = "";
        document.getElementById("blank5").value = "";
        document.getElementById("blank6").value = "";
        document.getElementById("blank7").value = "";
        document.getElementById("blank8").value = "";
        document.getElementById("blank9").value = "";
        document.getElementById("blank10").value = "";
        document.getElementById("blank11").value = "";
        document.getElementById("blank12").value = "";
        document.getElementById("blank13").value = "";
        document.getElementById("blank14").value = "";
    } else if (document.URL.toString().includes("2.2.4")) {
        document.getElementById("blank1").value = "";
        document.getElementById("blank2").value = "";
        document.getElementById("blank3").value = "";
        document.getElementById("blank4").value = "";
        document.getElementById("blank5").value = "";
        document.getElementById("blank6").value = "";
        document.getElementById("blank7").value = "";
        document.getElementById("blank8").value = "";
        document.getElementById("blank9").value = "";
        document.getElementById("blank10").value = "";
        document.getElementById("blank11").value = "";
        document.getElementById("blank12").value = "";
        document.getElementById("blank13").value = "";
        document.getElementById("blank14").value = "";
    } else if (document.URL.toString().includes("2.2.5")) {
        document.getElementById("blank1").value = "";
        document.getElementById("blank2").value = "";
        document.getElementById("blank3").value = "";
        document.getElementById("blank4").value = "";
        document.getElementById("blank5").value = "";
        document.getElementById("blank6").value = "";
        document.getElementById("blank7").value = "";
        document.getElementById("blank8").value = "";
        document.getElementById("blank9").value = "";
        document.getElementById("blank10").value = "";
        document.getElementById("blank11").value = "";
        document.getElementById("blank12").value = "";
        document.getElementById("blank13").value = "";
        document.getElementById("blank14").value = "";
    } else if (document.URL.toString().includes("3.2.1")) {
        document.getElementById("blank1").value = "ort.InferenceSession";
        document.getElementById("blank2").value = "Image.open('img_test.jpg').convert";
        document.getElementById("blank3").value = "preprocess_image(image)";
        document.getElementById("blank4").value = "session.run";
        // document.getElementById("blank5").value = "scipy.special.softmax";
        document.querySelector('body > div.container > table > tbody > tr:nth-child(57) > td').innerHTML += "<b> 倒排提取top5，不是argmax，是argsort</b>";
        // document.getElementById("blank6").value = "np.argsort(probabilities[0])";
        // document.getElementById("blank7").value = "probabilities[0][top5_idx]";
    } else if (document.URL.toString().includes("3.2.2")) {
        document.getElementById("blank1").value = "onnxruntime.InferenceSession";
        document.getElementById("blank2").value = "Image.open('img_test.png').convert";
        document.querySelector('body > div.container > table > tbody > tr:nth-child(15) > td').innerHTML += "<b> 调用image不是Image</b>";
        document.getElementById("blank3").value = "image.resize";
        // document.getElementById("blank4").value = "np.array";
        // document.getElementById("blank5").value = "image";
        // document.getElementById("blank6").value = "np.expand_dims";
        // document.getElementById("blank7").value = "image_array";
        document.getElementById("blank8").value = "np.expand_dims";
        // document.getElementById("blank9").value = "image_array";
        // document.getElementById("blank10").value = "ort_session.get_inputs";
        document.getElementById("blank11").value = "ort_session.run";
        // document.getElementById("blank12").value = "np.argmax(ort_outs[0])";

    } else if (document.URL.toString().includes("3.2.3")) {
        // document.getElementById("blank1").value = "Image.open(image_path)";
        document.querySelector('body > div.container > table > tbody > tr:nth-child(19) > td').innerHTML += "<b> 从题目中复制</b>";
        document.getElementById("blank2").value = "'neutral':0,'happiness':1,'surprise':2,'sadness':3,'anger':4,'disgust':5,'fear':6,'contempt':7";
        document.getElementById("blank3").value = "ort.InferenceSession";
        document.querySelector('body > div.container > table > tbody > tr:nth-child(27) > td').innerHTML += "<b> 调用函数不是自己open</b>";
        // document.getElementById("blank4").value = "preprocess";
        document.getElementById("blank5").value = "ort_session.run";
        // document.getElementById("blank6").value = "ort_inputs";
        // document.getElementById("blank7").value = "np.argmax";
        // document.getElementById("blank8").value = "list(emotion_table.keys())";

    } else if (document.URL.toString().includes("3.2.4")) {
        document.getElementById("blank1").value = "ort.InferenceSession";
        document.getElementById("blank2").value = "open('labels.txt')";
        document.getElementById("blank3").value = "Image.open('flower_test.png').convert";
        document.getElementById("blank4").value = "preprocess_image(image)";
        document.getElementById("blank5").value = "session.run";
        document.getElementById("blank6").value = "scipy.special.softmax";
        document.querySelector('body > div.container > table > tbody > tr:nth-child(56) > td').innerHTML += "<b> 没[0]</b>";
        // document.getElementById("blank7").value = "np.argmax(accuracy)";
        // document.getElementById("blank8").value = "accuracy[0,predicted_idx]*100";
        // document.getElementById("blank9").value = "labels[predicted_idx]";
    } else if (document.URL.toString().includes("3.2.5")) {
        document.querySelector('input.blank:nth-child(1)').value = 'name.strip()';
        document.querySelector('input.blank:nth-child(2)').value = 'ort.InferenceSession';
        // document.querySelector('input.blank:nth-child(3)').value = 'ort_session.get_inputs';
        document.querySelector('input.blank:nth-child(4)').value = 'makedirs(result_path)';
        // document.querySelector('input.blank:nth-child(5)').value = 'cv2.imread(img_path)';
        // document.querySelector('input.blank:nth-child(6)').value = 'cv2.resize';
        document.querySelector('input.blank:nth-child(7)').value = 'image';
        // document.querySelector('input.blank:nth-child(8)').value = 'np.array';
        // document.querySelector('input.blank:nth-child(9)').value = 'np.expand_dims';
        document.querySelector('input.blank:nth-child(10)').value = 'ort_session.run';
    }
    else {

    }

})()