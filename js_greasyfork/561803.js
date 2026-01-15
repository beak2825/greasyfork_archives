// ==UserScript==
// @name         文本框优化-默认值填充
// @namespace    http://tampermonkey.net/
// @version      0.1.1
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
    GM_addStyle(".blank ,input.blank-input,.blank-container{ min-width: 600px!important; text-align: left; background-color: #fffde7; border-bottom:2px solid #ff6d00; color: red; font-weight: bold; } .container { max-width: 100%!important; }");
    document.body.style += ' margin: 0!important; max-width: 100%!important; '
    document.getElementById("name").setAttribute("value", "高亚斌");

    if (document.URL.toString().includes("1.1.1")) {
        document.getElementById("blank1").innerText = "pd.read_csv('patient_data.csv')";
        document.getElementById("blank2").innerText = "data['RiskLevel']";
        document.getElementById("blank3").innerText = "np.where";
        document.getElementById("blank4").innerText = "data['DaysInHospital']>7";
        document.getElementById("blank5").innerText = "['RiskLevel']";
        document.getElementById("blank6").innerText = "value_counts()";
        document.getElementById("blank7").innerText = "len(data)";
        document.getElementById("blank8").innerText = "len(data)";
        document.getElementById("blank9").innerText = "pd.cut";
        document.getElementById("blank10").innerText = "data['BMI']";
        document.getElementById("blank11").innerText = "bins=bmi_bins";
        document.getElementById("blank12").innerText = "labels=bmi_labels";
        document.querySelector('body > div.container > div.question-section > div.code-block > table:nth-child(4) > tbody > tr:nth-child(7) > td').innerHTML += "<b> 只求BMIRange 中高风险患者的平均值</b>";
        document.getElementById("blank13").innerText = "data.groupby";
        document.getElementById("blank14").innerText = "'BMIRange'";
        document.getElementById("blank15").innerText = "['BMIRange'].value_counts()";
        document.getElementById("blank16").innerText = "pd.cut";
        document.getElementById("blank17").innerText = "data['Age']";
        document.getElementById("blank18").innerText = "bins=age_bins";
        document.getElementById("blank19").innerText = "labels=age_labels";
        document.getElementById("blank20").innerText = "data.groupby";
        document.getElementById("blank21").innerText = "'AgeRange'";
        document.getElementById("blank22").innerText = "['AgeRange'].value_counts()";
    } else if (document.URL.toString().includes("1.1.2")) {
        document.getElementById("blank1").innerText = "pd.read_csv('sensor_data.csv')";
        document.getElementById("blank2").innerText = "data.groupby";
        document.getElementById("blank3").innerText = "'SensorType'";
        document.querySelector('body > div.container > div:nth-child(3)').innerHTML += "<b> 数量 不是 sum|unstack() 将行索引转换为列索引</b>";
        document.getElementById("blank4").innerText = "agg(['count','mean'])";
        document.getElementById("blank5").innerText = "isin(['Temperature','Humidity'])]";
        document.getElementById("blank6").innerText = "groupby(['Location','SensorType'])";
        document.getElementById("blank7").innerText = "np.where";
        document.getElementById("blank8").innerText = "data['SensorType']=='Temperature'";
        document.getElementById("blank9").innerText = "data['SensorType']=='Humidity'";
        // document.getElementById("blank10").innerText = "sum()";
        document.getElementById("blank11").innerText = "fillna";
        document.getElementById("blank12").innerText = "method='ffill'";
        document.getElementById("blank13").innerText = "fillna";
        document.getElementById("blank14").innerText = "method='bfill'";
        document.getElementById("blank15").innerText = "data.drop";
        // document.getElementById("blank16").innerText = "columns";
        document.getElementById("blank17").innerText = "cleaned_data.to_csv";
        document.getElementById("blank18").innerText = "index=False";
    } else if (document.URL.toString().includes("1.1.3")) {
        document.querySelector('#code-container > div:nth-child(7)').innerHTML += "<b> 计算总数（统计求和）</b>";
        // document.getElementById("blank1").innerText = "isnull().sum()";
        // document.getElementById("blank2").innerText = "duplicated().sum()";
        document.getElementById("blank3").innerText = "data['Age']";
        document.getElementById("blank4").innerText = "between";
        document.getElementById("blank5").innerText = "data['Income']";
        document.getElementById("blank6").innerText = "2000";
        document.getElementById("blank7").innerText = "data['LoanAmount']";
        document.getElementById("blank8").innerText = "data['Income']";
        document.getElementById("blank9").innerText = "data['CreditScore']";
        document.getElementById("blank10").innerText = "between";
        document.getElementById("blank11").innerText = "cleaned_data";
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
        document.getElementById("blank11").value = "between";
        document.getElementById("blank12").value = "data['ReviewScore']";
        document.getElementById("blank13").value = "between";
        document.querySelector('body > div:nth-child(5) > div:nth-child(15)').innerHTML += "<b> dropna不是dropnull，标准化-mean/std</b>";
        // document.getElementById("blank14").value = "data['PurchaseAmount'].mean()";
        // document.getElementById("blank15").value = "data['PurchaseAmount'].std()";
        document.getElementById("blank16").value = "data['ReviewScore'].mean()";
        document.getElementById("blank17").value = "data['ReviewScore'].std()";
        document.getElementById("blank18").value = "data.to_csv";
        document.getElementById("blank19").value = "data['PurchaseCategory']";
        document.getElementById("blank20").value = "value_counts()";
        document.getElementById("blank21").value = "data.groupby";
        document.getElementById("blank22").value = "'Gender'";
        document.getElementById("blank23").value = "cut";
        document.getElementById("blank24").value = "data['Age'],bins=bins,labels=labels";
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
        document.getElementById("blank29").value = "data['TrafficEvent'].value_counts()";
        document.getElementById("blank30").value = "groupby('Gender')";
        document.querySelector('body > table:nth-child(7) > tbody > tr:nth-child(6) > td').innerHTML += "<b> 全是mean，只有count，没有sum </b>";
        document.getElementById("blank31").value = "agg({'Speed':'mean','TravelDistance':'mean','TravelTime':'mean'})";
        document.getElementById("blank32").value = "pd.cut";
        document.getElementById("blank33").value = "data['Age']";
        document.getElementById("blank34").value = "bins=age_bins";
        document.getElementById("blank35").value = "labels=age_labels";
        document.getElementById("blank36").value = "data['AgeGroup'].value_counts()";
    } else if (document.URL.toString().includes("2.1.1")) {
        document.getElementById("blank1").value = "pd.read_csv('auto-mpg.csv')";
        document.getElementById("blank2").value = "data.head()";
        document.getElementById("blank3").value = "data";
        document.getElementById("blank4").value = "isnull()";
        document.getElementById("blank5").value = "sum()";
        document.getElementById("blank6").value = "data.dropna()";
        document.getElementById("blank7").value = "pd.to_numeric";
        document.querySelector('body > table:nth-child(5) > tbody > tr:nth-child(6) > td').innerHTML += "<b> 只对horsepower列进行缺失值处理 </b>";
        document.getElementById("blank8").value = "data.dropna(subset=['horsepower'])";
        document.getElementById("blank9").value = "scaler.fit_transform(data[numerical_features])";
        document.getElementById("blank10").value = "['cylinders','displacement','horsepower','weight','acceleration','model year','origin']";
        document.getElementById("blank11").value = "data[selected_features]";
        document.getElementById("blank12").value = "data['mpg']";
        document.getElementById("blank13").value = "train_test_split";
        document.getElementById("blank14").value = "X,y,train_size=0.8";
        document.getElementById("blank15").value = "cleaned_data.to_csv";
        document.getElementById("blank16").value = "index=False";
        CORRECT_ANSWERS.blank10 = "['cylinders','displacement','horsepower','weight','acceleration','modelyear','origin']";
    } else if (document.URL.toString().includes("2.1.2")) {
        document.getElementById("blank1").value = "pd.read_excel('大学生低碳生活行为的影响因素数据集.xlsx')";
        document.getElementById("blank2").value = "data.head()";
        document.querySelector('body > table:nth-child(5) > tbody > tr:nth-child(1) > td').innerHTML += "<b> 使用形状属性 </b>";
        document.getElementById("blank3").value = "data.shape[0]";
        document.getElementById("blank4").value = "data.dropna()";
        document.getElementById("blank5").value = "data.shape[0]";
        document.getElementById("blank6").value = "data.drop_duplicates()";
        document.getElementById("blank7").value = "scaler.fit_transform(data[numerical_features])";
        document.getElementById("blank8").value = "data[selected_features]";
        document.getElementById("blank9").value = "data['低碳行为积极性']";
        document.getElementById("blank10").value = "train_test_split";
        document.getElementById("blank11").value = "X,y,test_size=0.2";
        document.getElementById("blank12").value = "pd.concat";
        document.getElementById("blank13").value = "[X,y]";
        document.getElementById("blank14").value = "cleaned_data.to_csv";
        document.getElementById("blank15").value = "index=False";
    } else if (document.URL.toString().includes("2.1.3")) {
        document.getElementById("blank1").value = "pd.read_csv('finance数据集.csv')";
        document.getElementById("blank2").value = "print(data.head())";
        document.querySelector('body > table:nth-child(6) > tbody > tr:nth-child(1) > td').innerHTML += "<b> 箱体处理quantile </b>";
        document.getElementById("blank3").value = "data[numeric_cols].quantile";
        document.getElementById("blank4").value = "data[numeric_cols].quantile";
        document.getElementById("blank5").value = "Q3-Q1";
        document.getElementById("blank6").value = "IQR";
        document.getElementById("blank7").value = "IQR";
        document.getElementById("blank8").value = "data_cleaned.duplicated";
        document.getElementById("blank9").value = "scaler.fit_transform(data_cleaned[numeric_cols])";
        document.getElementById("blank10").value = "'SeriousDlqin2yrs'";
        document.querySelector('body > table:nth-child(10) > tbody > tr:nth-child(3) > td').innerHTML += "<b> -目标=特征 </b>";
        document.getElementById("blank11").value = "data_cleaned.drop";
        document.getElementById("blank12").value = "target_variable";
        document.getElementById("blank13").value = "data_cleaned[target_variable]";
        document.getElementById("blank14").value = "train_test_split";
        document.getElementById("blank15").value = "X,y,train_size=0.8";
        document.getElementById("blank16").value = "data_cleaned.to_csv";
        document.getElementById("blank17").value = "cleaned_file_path";
    } else if (document.URL.toString().includes("2.1.4")) {
        document.getElementById("blank1").value = "pd.read_csv('medical_data.csv',encoding='gbk')";
        document.getElementById("blank2").value = "data.info()";
        document.getElementById("blank3").value = "data.rename";
        document.getElementById("blank4").value = "columns={'病人ID':'患者ID'}";
        document.getElementById("blank5").value = "(data['诊断日期']-data['就诊日期'])";
        document.getElementById("blank6").value = "data";
        document.getElementById("blank7").value = "data['诊断延迟']";
        document.getElementById("blank8").value = "data['年龄']";
        document.getElementById("blank9").value = "data['年龄']";
        document.getElementById("blank10").value = "data.drop_duplicates";
        document.getElementById("blank11").value = "'年龄','体重','身高'";
        document.getElementById("blank12").value = "scaler.fit_transform(data[columns_to_normalize])";
        document.querySelector('body > table:nth-child(9) > tbody > tr:nth-child(11) > td').innerHTML += "<b> 表转图 </b>";
        document.getElementById("blank13").value = "treatment_outcome_distribution.plot";
        document.getElementById("blank14").value = "kind='bar'";
        document.getElementById("blank15").value = "plt.scatter";
        document.getElementById("blank16").value = "data['年龄']";
        document.getElementById("blank17").value = "data['疾病严重程度']";
        document.getElementById("blank18").value = "data.to_csv";
        document.getElementById("blank19").value = "output_path";
    } else if (document.URL.toString().includes("2.1.5")) {
        document.getElementById("blank1").value = "pd.read_csv('健康咨询客户数据集.csv')";
        document.getElementById("blank2").value = "data.info()";
        document.getElementById("blank3").value = "data.isnull().sum()";
        document.getElementById("blank4").value = "data.dropna()";
        document.getElementById("blank5").value = "pd.to_numeric";
        document.getElementById("blank6").value = "data_cleaned['Your age']";
        document.getElementById("blank7").value = "astype(int)";
        document.getElementById("blank8").value = "duplicated";
        document.getElementById("blank9").value = "data_cleaned.drop_duplicates()";
        document.getElementById("blank10").value = "'How do you describe your current level of fitness ?'";
        document.getElementById("blank11").value = "label_encoder.fit_transform(data_cleaned['How do you describe your current level of fitness ?'])";
        document.getElementById("blank12").value = "exercise_frequency_counts.plot.pie";
        document.getElementById("blank13").value = "train_test_split";
        document.querySelector('body > table:nth-child(10) > tbody > tr:nth-child(8) > td').innerHTML += "<b> 表转图，复合X,y </b>";
        document.getElementById("blank14").value = "data_filled,test_size=0.2";
        document.getElementById("blank15").value = "2.1.5.csv";
        document.getElementById("blank16").value = "data_filled.to_csv";
        document.getElementById("blank17").value = "cleaned_file_path";
    } else if (document.URL.toString().includes("2.2.1")) {
        document.getElementById("blank1").value = "pd.read_csv('finance数据集.csv')";
        document.getElementById("blank2").value = "data.head()";
        document.getElementById("blank3").value = "train_test_split";
        document.getElementById("blank4").value = "X,y,test_size=0.2";
        document.getElementById("blank5").value = "LogisticRegression(max_iter=1000)";
        document.getElementById("blank6").value = "model.fit(X_train,y_train)";
        document.getElementById("blank7").value = "dump(model,file)";
        document.getElementById("blank8").value = "model.predict(X_test)";
        document.getElementById("blank9").value = "(y_test==y_pred).mean()";
        document.querySelector('body > div.container > div.code-block > table > tbody > tr:nth-child(43) > td').innerHTML += "<b> 预测均值差 | 重采样 </b>";
        document.getElementById("blank10").value = "smote.fit_resample(X_train,y_train)";
        document.getElementById("blank11").value = "model.fit(X_resampled,y_resampled)";
        document.getElementById("blank12").value = "model.predict(X_test)";
        document.getElementById("blank13").value = "(y_test==y_pred_resampled).mean()";
    } else if (document.URL.toString().includes("2.2.2")) {
        document.getElementById("blank1").value = "pd.read_csv('auto-mpg.csv')";
        document.getElementById("blank2").value = "df.head()";
        document.getElementById("blank3").value = "pd.to_numeric";
        document.getElementById("blank4").value = "df['horsepower']";
        document.getElementById("blank5").value = "df.dropna()";
        document.querySelector('body > div.container > div.code-block > table > tbody > tr:nth-child(21) > td').innerHTML += "<b> 双[[]] </b>";
        document.getElementById("blank6").value = "df[['cylinders','displacement','horsepower','weight','acceleration','model year','origin']]";
        document.getElementById("blank7").value = "df['mpg']";
        document.getElementById("blank8").value = "train_test_split";
        document.getElementById("blank9").value = "X,y,test_size=0.2";
        document.getElementById("blank10").value = "Pipeline";
        document.getElementById("blank11").value = "StandardScaler()";
        document.getElementById("blank12").value = "LinearRegression()";
        document.getElementById("blank13").value = "pipeline.fit(X_train,y_train)";
        document.getElementById("blank14").value = "dump(pipeline,model_file)";
        document.getElementById("blank15").value = "pipeline.predict(X_test)";
        document.getElementById("blank16").value = "results_df.to_csv";
        document.getElementById("blank17").value = "RandomForestRegressor";
        document.getElementById("blank18").value = "n_estimators=100";
        document.getElementById("blank19").value = "rf_model.fit(X_train,y_train)";
        document.getElementById("blank20").value = "rf_model.predict(X_test)";
        document.getElementById("blank21").value = "results_rf_df.to_csv";
    } else if (document.URL.toString().includes("2.2.3")) {
        document.getElementById("blank1").value = "pd.read_csv('fitness analysis.csv')";
        document.getElementById("blank2").value = "df.head()";
        document.querySelector('body > div.container > div.code-block > table > tbody > tr:nth-child(21) > td').innerHTML += "<b> 双[[]]，分类 </b>";
        document.getElementById("blank3").value = "pd.get_dummies";
        document.getElementById("blank4").value = "df['Your age'].apply";
        document.getElementById("blank5").value = "train_test_split";
        document.getElementById("blank6").value = "X,y,test_size=0.2";
        document.getElementById("blank7").value = "RandomForestRegressor";
        document.getElementById("blank8").value = "n_estimators=100";
        document.getElementById("blank9").value = "rf_model.fit(X_train,y_train)";
        document.getElementById("blank10").value = "dump(rf_model,model_file)";
        document.getElementById("blank11").value = "rf_model.predict(X_test)";
        document.getElementById("blank12").value = "rf_model.score(X_train,y_train)";
        document.getElementById("blank13").value = "rf_model.score(X_test,y_test)";
        document.getElementById("blank14").value = "mean_squared_error(y_test,y_pred)";
        document.getElementById("blank15").value = "r2_score(y_test,y_pred)";
        document.getElementById("blank16").value = "xgb.XGBRegressor";
        document.getElementById("blank17").value = "n_estimators=100";
        document.getElementById("blank18").value = "xgb_model.fit(X_train,y_train)";
        document.getElementById("blank19").value = "xgb_model.predict(X_test)";
        document.getElementById("blank20").value = "xgb_model.score(X_train,y_train)";
        document.getElementById("blank21").value = "xgb_model.score(X_test,y_test)";
        document.getElementById("blank22").value = "mean_squared_error(y_test,y_pred_xgb)";
        document.getElementById("blank23").value = "r2_score(y_test,y_pred_xgb)";
    } else if (document.URL.toString().includes("2.2.4")) {
        document.getElementById("blank1").value = "pd.read_excel('大学生低碳生活行为的影响因素数据集.xlsx')";
        document.getElementById("blank2").value = "data.head()";
        document.getElementById("blank3").value = "data.drop";
        document.getElementById("blank4").value = "columns";
        document.getElementById("blank5").value = "data_cleaned.drop";
        document.getElementById("blank6").value = "columns";
        document.getElementById("blank7").value = "[target]";
        document.getElementById("blank8").value = "data_cleaned[target]";
        document.getElementById("blank9").value = "train_test_split";
        document.getElementById("blank10").value = "X,y,test_size=0.2";
        document.getElementById("blank11").value = "LinearRegression()";
        document.getElementById("blank12").value = "model.fit(X_train,y_train)";
        document.getElementById("blank13").value = "dump(model,model_filename)";
        document.getElementById("blank14").value = "model.predict(X_test)";
        document.getElementById("blank15").value = "results.to_csv";
        document.getElementById("blank16").value = "results_filename";
        document.getElementById("blank17").value = "mean_squared_error(y_test,y_pred)";
        document.getElementById("blank18").value = "r2_score(y_test,y_pred)";
        document.getElementById("blank19").value = "XGBRegressor";
        document.querySelector('body > div.container > div.code-block > table > tbody > tr:nth-child(52) > td').innerHTML += "<b> 多个参数配置 </b>";
        document.getElementById("blank20").value = "n_estimators=1000,learning_rate=0.05,max_depth=5";
        document.getElementById("blank21").value = "xgb_model.fit(X_train,y_train)";
        document.getElementById("blank22").value = "xgb_model.predict(X_test)";
        document.getElementById("blank23").value = "mean_squared_error(y_test,y_pred_xg)";
        document.getElementById("blank24").value = "r2_score(y_test,y_pred_xg)";
    } else if (document.URL.toString().includes("2.2.5")) {
        document.getElementById("blank1").value = "pd.read_csv";
        document.getElementById("blank2").value = "df.head()";
        document.getElementById("blank3").value = "pd.get_dummies";
        document.getElementById("blank4").value = "df['daily_steps']";
        document.getElementById("blank5").value = "train_test_split";
        document.getElementById("blank6").value = "X,y,test_size=0.2";
        document.getElementById("blank7").value = "df_model";
        document.getElementById("blank8").value = "DecisionTreeRegressor";
        document.getElementById("blank9").value = "df_model.fit(X_train,y_train)";
        document.getElementById("blank10").value = "dump(df_model,model_file)";
        document.getElementById("blank11").value = "df_model.predict(X_test)";
        document.getElementById("blank12").value = "results.to_csv";
        document.getElementById("blank13").value = "results_filename";
        document.querySelector('body > div.container > div.code-block > table > tbody > tr:nth-child(40) > td').innerHTML += "<b> 写结果 </b>";
        document.getElementById("blank14").value = "report_filename,'w'";
        document.getElementById("blank15").value = "mean_squared_error(y_test,y_pred)";
        document.getElementById("blank16").value = "mean_absolute_error(y_test,y_pred)";
        document.getElementById("blank17").value = "r2_score(y_test,y_pred)";
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
        document.querySelector('body > div.container > table > tbody > tr:nth-child(56) > td').innerHTML += "<b> 没[0] ,|[0, - </b>";
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