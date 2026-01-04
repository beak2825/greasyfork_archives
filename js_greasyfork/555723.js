// ==UserScript==
// @name         机器人和犇犇搜索插件
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  在特定页面悬浮搜索框和结果表格
// @author       YYSheng
// @match        https://www.jiqirenai.com/*
// @match        https://web.apbenben.com/*
// @grant        GM_cookie
// @grant        GM_xmlhttpRequest
// @connect      jiqirenai.com
// @connect      apbenben.com
// @charset		   UTF-8
// @license      GPL License
// @downloadURL https://update.greasyfork.org/scripts/555723/%E6%9C%BA%E5%99%A8%E4%BA%BA%E5%92%8C%E7%8A%87%E7%8A%87%E6%90%9C%E7%B4%A2%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/555723/%E6%9C%BA%E5%99%A8%E4%BA%BA%E5%92%8C%E7%8A%87%E7%8A%87%E6%90%9C%E7%B4%A2%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function () {
  'use strict';
  let allSearchResults = []; // 存储所有搜索结果

  // 加载 SheetJS 库
  function loadSheetJS() {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
  loadSheetJS();

  // 机器人配置部分
  const SEARCH_API = 'https://www.jiqirenai.com/proxy/v1/es/search/product/by_oe'; // 搜索API端点
  const HOT_API = 'https://www.jiqirenai.com/proxy/api/b2b_stock/get_quantity_and_price'; // 搜索咨询次数API端点

  //犇犇配置部分
  const GETID_BB_API = 'https://api.apbenben.com/benben-dubbo-web/auth/search/getQueryId'; // 获取查询ID
  const SEARCH_BB_API = 'https://api.apbenben.com/benben-dubbo-web/auth/search/loadPartsByPage'; // 搜索结果API端点

  // 判断当前网站类型
  function getCurrentSiteType() {
    const currentUrl = window.location.href;
    if (currentUrl.includes('jiqirenai.com')) {
      return 'jiqiren';
    } else if (currentUrl.includes('apbenben.com')) {
      return 'benben';
    }
    return 'unknown';
  }

  // 创建悬浮搜索组件
  function createSearchWidget() {
    // 创建容器
    const container = document.createElement('div');
    container.id = 'search-widget-container';
    container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            background: white;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            padding: 15px;
            min-width: 300px;
            max-width: 400px;
            font-family: Arial, sans-serif;
        `;

    // 创建标题栏（包含标题和收起/展开按钮）
    const titleBar = document.createElement('div');
    titleBar.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        `;

    const title = document.createElement('h3');
    title.textContent = `搜索插件 (${getCurrentSiteType() === 'benben' ? '犇犇' : '机器人'})`;
    title.style.cssText = `
            margin: 0;
            font-size: 16px;
        `;

    const toggleButton = document.createElement('button');
    toggleButton.textContent = '收起';
    toggleButton.id = 'toggle-button';
    toggleButton.style.cssText = `
            padding: 4px 8px;
            background: #6c757d;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            font-size: 12px;
        `;

    titleBar.appendChild(title);
    titleBar.appendChild(toggleButton);
    container.appendChild(titleBar);

    // 创建内容容器
    const contentContainer = document.createElement('div');
    contentContainer.id = 'widget-content';
    contentContainer.style.cssText = `
            transition: all 0.3s ease;
        `;

    // 创建搜索框
    const searchBox = document.createElement('input');
    searchBox.type = 'text';
    searchBox.placeholder = '输入搜索关键词...';
    searchBox.id = 'search-input';
    searchBox.style.cssText = `
            width: 100%;
            padding: 8px;
            margin-bottom: 10px;
            border: 1px solid #ced4da;
            box-sizing: border-box;
        `;

    // 创建搜索按钮
    const searchButton = document.createElement('button');
    searchButton.textContent = '搜索';
    searchButton.id = 'search-button';
    searchButton.style.cssText = `
            width: 100%;
            padding: 8px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            margin-bottom: 10px;
        `;
    // 创建导出按钮
    const exportButton = document.createElement('button');
    exportButton.textContent = '导出全部结果';
    exportButton.id = 'export-button';
    exportButton.style.cssText = `
          width: 100%;
          padding: 8px;
          background: #28a745;
          color: white;
          border: none;
          border-radius: 3px;
          cursor: pointer;
          margin-bottom: 10px;
          display: none;
      `;
    // 报错容器
    const errContainer = document.createElement('div');
    errContainer.id = 'err-results';
    errContainer.style.cssText = `
            max-height: 100px;
            display: none;
        `;
    // 创建结果表格容器
    const tableContainer = document.createElement('div');
    tableContainer.id = 'search-results';
    tableContainer.style.cssText = `
            max-height: 500px;
            overflow-y: auto;
            display: none;
        `;

    // 组装内容
    contentContainer.appendChild(searchBox);
    contentContainer.appendChild(searchButton);
    contentContainer.appendChild(exportButton); // 添加导出按钮
    contentContainer.appendChild(errContainer);
    contentContainer.appendChild(tableContainer);
    container.appendChild(contentContainer);

    // 添加到页面
    document.body.appendChild(container);

    // 绑定事件
    searchButton.addEventListener('click', handleSearchKey);
    exportButton.addEventListener('click', exportAllResults); // 添加导出事件
    searchBox.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleSearchKey();
      }
    });

    // 收起/展开功能
    toggleButton.addEventListener('click', () => {
      const content = document.getElementById('widget-content');
      const results = document.getElementById('search-results');
      const err = document.getElementById('err-results');

      if (content.style.display === 'none') {
        // 展开
        content.style.display = 'block';
        toggleButton.textContent = '收起';
        container.style.minWidth = '300px';
      } else {
        // 收起
        content.style.display = 'none';
        toggleButton.textContent = '展开';
        // 隐藏搜索结果
        results.style.display = 'none';
        container.style.minWidth = '120px';
        err.style.display = 'none';
      }
    });

    return container;
  }

  // 将对象转换为查询参数字符串
  function objectToQueryString(obj) {
    const params = [];
    for (const key in obj) {
      if (obj[key] !== undefined && obj[key] !== null) {
        params.push(`${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`);
      }
    }
    return params.join('&');
  }

  // 处理多个搜索关键词
  async function handleSearchKey() {
    const query = document.getElementById('search-input').value.trim();
    console.log('2025-11-14 23:03:37 YYS:', query);
    const keyList = query.split(' ');
    console.log('2025-11-14 23:03:37 YYS:', keyList);
    const tableContainer = document.getElementById('search-results');
    const exportButton = document.getElementById('export-button');

    // 清空之前的结果
    tableContainer.innerHTML = '';
    tableContainer.style.display = 'block';
    allSearchResults = []; // 重置搜索结果数组
    exportButton.style.display = 'none'; // 隐藏导出按钮

    if (keyList.length > 1) {
      for (let i = 0; i < keyList.length; i++) {
        const singleQuery = keyList[i].trim();
        if (singleQuery) {
          // 处理每个单独的查询关键词
          console.log('处理查询关键词:', singleQuery);
          // 根据当前网站类型调用相应的搜索函数
          if (getCurrentSiteType() === 'benben') {
            await performSearchBB(singleQuery);
          } else {
            await performSearch(singleQuery);
          }
        }
      }
    } else if (query) {
      // 单个查询
      if (getCurrentSiteType() === 'benben') {
        await performSearchBB(query);
      } else {
        await performSearch(query);
      }
    } else {
      const errContainer = document.getElementById('err-results');
      errContainer.style.display = 'block';
      errContainer.innerHTML = '<p>请输入搜索关键词</p>';
    }

    // 显示导出按钮
    if (allSearchResults.length > 0) {
      exportButton.style.display = 'block';
    }
  }

  // 犇犇搜索
  async function performSearchBB(oe) {
    const errContainer = document.getElementById('err-results');
    const tableContainer = document.getElementById('search-results');

    if (!oe) {
      errContainer.style.display = 'block';
      errContainer.innerHTML = '<p>请输入搜索关键词</p>';
      return;
    }

    try {
      // 显示加载状态
      errContainer.style.display = 'block';
      errContainer.innerHTML = `<p>搜索中... (${oe})</p>`;

      // 第一步：获取查询ID
      const getIdResponse = await new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          url: GETID_BB_API,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
          },
          onload: function (response) {
            try {
              const data = JSON.parse(response.responseText);
              resolve(data);
            } catch (e) {
              reject(e);
            }
          },
          onerror: function (error) {
            reject(error);
          },
        });
      });
      console.log('2025-11-20 18:10:16 YYS:', getIdResponse);
      // 检查获取ID是否成功
      if (!getIdResponse || !getIdResponse.data) {
        errContainer.innerHTML = `<p>获取查询ID失败: ${oe}</p>`;
        return;
      }

      // 更新form对象中的动态字段
      let form = {
        brandNames: '', //品牌名称
        carTypeName: null, //车型名称
        categoryFirst: '', //一级分类名称
        categorySecond: '', //二级分类名称
        city: '广州,杭州,北京,南宁,昆明,济南,阜阳,厦门,宁波,东莞,廊坊,重庆,无锡,贵阳,长春,哈尔滨,合肥,温州,南昌,福州,成都,上海,沈阳,长沙,中山,武汉,深圳,汕头,西安,郑州,南京,佛山,北京库,苏州', //城市名称
        cityDft: '330100', //默认城市代码
        cityOthers: '', //其他城市名称
        isAttention: '', //关注
        isMargin: '', //优惠
        isOems: '', //OE码
        isPayOnline: '', //货到付款
        isPrice: '', //价格
        isPromotion: '', //优惠券
        isSearchSwap: '', //换购
        isYx: '', //验光
        key: oe, //搜索标识，使用实际的oe
        leids: ',6,8,9,16,', //搜索类型
        page: 1,
        pageSize: 1000,
        proOtherCityCodes: '330200,330300,330400,330500,330600,330700,330800,330900,331000,331100', //其他城市代码
        queryCityType: 1, //查询城市类型
        queryId: getIdResponse.data, // 使用获取到的查询ID
        queryType: 1, //查询类型
        reKey: '', //备用字段
        remark: oe, //备用字段
        stockStatus: 1, //库存状态
        supplierId: '', //供应商ID
      };

      // 第二步：执行搜索
      const searchResponse = await new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          url: SEARCH_BB_API,
          method: 'POST',
          data: JSON.stringify(form),
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
          },
          onload: function (response) {
            try {
              const productList = JSON.parse(response.responseText);
              resolve(productList);
            } catch (e) {
              reject(e);
            }
          },
          onerror: function (error) {
            reject(error);
          },
        });
      });
      console.log('2025-11-20 18:24:56 YYS:', searchResponse);

      const data = searchResponse.data;

      // 检查是否有产品数据
      if (!data.items || data.items.length === 0) {
        errContainer.innerHTML = `<p>未找到相关产品: ${oe}</p>`;
        return;
      }
      let productList = data.items.map((item) => {
        return {
          oe_number: item.oePartsNoKey || '--', //OE码
          oe_epc_name: item.cname || '--', //商品名称
          price: item.finalBatchPrice || '--', //在售价格
          enquiry_count: item.supplierImCount || '--', //最近咨询
          quality_name: item.standardManufacturerCname || '--', //商品质量
          seller_name: item.supplierAbbreviation || '--', //上架商家
          brand_name: item.manufacturerCname || '--', //品牌品质
          quantity: item.stock || '--', //剩余库存
          city_name: item.city || '--', //商品城市
          datelastupdate: item.updateTime || '--', //更新时间
        };
      });

      // 过滤productList只要商品质量为原厂件的数据，并且按照在售价格倒序
      productList = productList.sort((a, b) => b.price - a.price);

      // 再次检查是否有产品数据
      if (!productList || productList.length === 0) {
        errContainer.innerHTML = `<p>未找到相关产品: ${oe}</p>`;
        return;
      }

      // 保存搜索结果
      allSearchResults.push({
        keyword: oe,
        data: productList,
      });

      // 显示结果
      displayResults(productList, oe);
    } catch (error) {
      errContainer.innerHTML = `<p>搜索出错 (${oe}): ${error.message || error.msg || '未知错误'}</p>`;
    }
  }

  // 机器人搜索
  async function performSearch(oe) {
    const errContainer = document.getElementById('err-results');
    const tableContainer = document.getElementById('search-results');

    if (!oe) {
      errContainer.style.display = 'block';
      errContainer.innerHTML = '<p>请输入搜索关键词</p>';
      return;
    }

    // 更新form对象中的动态字段
    let form = {
      brand_ids: [], //品牌ID
      city_codes: [], //城市ID
      company_id: 341, //公司ID
      has_price: false, //是否有价格
      has_stock: true, //是否有库存
      ignore_invalid_price: false, //忽略无效价格
      insert_history: true, //插入历史
      is_current_city: false, //是否当前城市
      is_enquiry: false, //是否询价
      is_local_city: null, //是否本地城市
      keyword: null, //关键词
      make_ids: [], //厂商ID
      not_seller_id: [-1], //卖家ID
      oe: oe, //OE码（使用搜索框输入的值）
      page_number: 1, //页码
      page_size: 1000, //每页数量
      product_company_ids: [], //产品公司ID
      quality_ids: [], //质量ID
      seller_id: [], //卖家ID
      sort_city_code: '330100', //排序城市ID
      // sort_field: 'enquiry_count', //排序字段
      // sort_order: 'desc', //排序顺序
      use_default_order: true, //默认排序
    };

    try {
      // 显示加载状态
      errContainer.style.display = 'block';
      errContainer.innerHTML = `<p>搜索中... (${oe})</p>`;

      // 发起POST搜索请求，传入form对象
      const productRes = await fetch(SEARCH_API, {
        method: 'POST',
        headers: {
          Authorization: localStorage.getItem('auth._token.local'),
          'Content-Type': 'application/json',
          'x-open-key': '953F8B4DDB1E1D53390C8462F0141945',
          Device: 'pc',
          Priority: 'u=1, i',
        },
        body: JSON.stringify(form),
      });
      const productList = await productRes.json();
      // 检查是否有产品数据
      if (!productList.data || productList.data.length === 0) {
        errContainer.innerHTML = `<p>未找到相关产品: ${oe}</p>`;
        return;
      }
      //过滤productList只要商品质量为原厂件的数据，并且按照在售价格倒序
      productList.data = productList.data.sort((a, b) => b.price - a.price);
      // 检查是否有产品数据
      if (!productList.data || productList.data.length === 0) {
        errContainer.innerHTML = `<p>未找到相关产品: ${oe}</p>`;
        return;
      }
      const product_ids = productList.data
        .map((item) => {
          // 解析和格式化更新时间

          if (item.datelastupdate) {
            const date = new Date(item.datelastupdate);
            if (!isNaN(date.getTime())) {
              // 格式化为 YYYY-MM-DD HH:mm:ss
              item.datelastupdate =
                date.getFullYear() +
                '-' +
                String(date.getMonth() + 1).padStart(2, '0') +
                '-' +
                String(date.getDate()).padStart(2, '0') +
                ' ' +
                String(date.getHours()).padStart(2, '0') +
                ':' +
                String(date.getMinutes()).padStart(2, '0') +
                ':' +
                String(date.getSeconds()).padStart(2, '0');
            }
          }
          return item.product_id;
        })
        .join(',');

      const hotForm = {
        company_id: 341,
        product_ids: product_ids,
        ignore_invalid_price: 0,
      };

      // 构造带查询参数的URL
      const queryString = objectToQueryString(hotForm);
      const hotApiUrl = `${HOT_API}?${queryString}`;

      // 发起GET请求获取热度数据
      const response = await fetch(hotApiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-open-key': '953F8B4DDB1E1D53390C8462F0141945',
          Device: 'pc',
          dnt: 1,
        },
      });
      const hotList = await response.json();

      productList.data.forEach((item) => {
        const hotItem = hotList.data.find((hotItem) => hotItem.product_id === item.product_id);
        if (hotItem) {
          item.enquiry_count = hotItem.enquiry_count;
        }
      });

      // 保存搜索结果
      allSearchResults.push({
        keyword: oe,
        data: productList.data,
      });

      // 显示结果
      displayResults(productList.data, oe);
    } catch (error) {
      errContainer.innerHTML = `<p>搜索出错 (${oe}): ${error.message || error.msg}</p>`;
    }
  }

  // 导出所有结果
  function exportAllResults() {
    // 获取当前时间戳
    const now = new Date();
    const timestamp =
      now.getFullYear() +
      '-' +
      String(now.getMonth() + 1).padStart(2, '0') +
      '-' +
      String(now.getDate()).padStart(2, '0') +
      '_' +
      String(now.getHours()).padStart(2, '0') +
      ':' +
      String(now.getMinutes()).padStart(2, '0') +
      ':' +
      String(now.getSeconds()).padStart(2, '0');
    // 创建工作簿
    const wb = XLSX.utils.book_new();

    // 为每个搜索结果创建一个工作表
    allSearchResults.forEach((result) => {
      // 准备工作表数据
      const worksheetData = [
        ['OE码', '商品名称', '在售价格', '最近咨询', '商品质量', '上架商家', '品牌品质', '剩余库存', '商品城市', '更新时间'], // 表头
      ];

      // 添加数据行
      result.data.forEach((item) => {
        worksheetData.push([
          item.oe_number || '--', //OE码
          item.oe_epc_name || item.product_name || '--', //商品名称
          item.price || '--', //在售价格
          item.enquiry_count || '--', //最近咨询
          item.quality_name || '--', //商品质量
          item.seller_name || '--', //上架商家
          item.brand_name || '--', //品牌品质
          item.quantity || '--', //剩余库存
          item.city_name || '--', //商品城市
          item.datelastupdate || '--', //更新时间
        ]);
      });

      // 创建工作表
      const ws = XLSX.utils.aoa_to_sheet(worksheetData);
      // 设置列宽
      ws['!cols'] = [
        { wch: 15 }, // OE码列宽
        { wch: 20 }, // 商品名称列宽
        { wch: 10 }, // 在售价格列宽
        { wch: 10 }, // 最近咨询列宽
        { wch: 10 }, // 商品质量列宽
        { wch: 20 }, // 上架商家列宽
        { wch: 10 }, // 品牌品质列宽
        { wch: 10 }, // 剩余库存列宽
        { wch: 10 }, // 商品城市列宽
        { wch: 20 }, // 更新时间列宽
      ];

      // 添加到工作簿（使用搜索关键词作为工作表名）
      XLSX.utils.book_append_sheet(wb, ws, result.keyword.substring(0, 31)); // Excel 工作表名最多31个字符
    });

    // 导出文件，文件名包含时间戳
    XLSX.writeFile(wb, `搜索结果_${timestamp}.xlsx`);
  }

  // 显示搜索结果
  function displayResults(data, oe) {
    const errContainer = document.getElementById('err-results');
    const tableContainer = document.getElementById('search-results');

    if (!data || data.length === 0) {
      errContainer.style.display = 'block';
      errContainer.innerHTML = `<p>未找到结果: ${oe}</p>`;
      return;
    }

    // 创建表格标题
    const title = document.createElement('h4');
    title.textContent = `搜索结果: ${oe}`;
    title.style.cssText = 'margin: 10px 0 5px 0;';

    // 创建表格
    const table = document.createElement('table');
    table.style.cssText = `
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        `;

    // 表头
    const header = table.createTHead();
    const headerRow = header.insertRow();
    ['OE码', '名称', '价格', '咨询'].forEach((text) => {
      const th = document.createElement('th');
      th.textContent = text;
      th.style.cssText = `
                border: 1px solid #ddd;
                padding: 8px;
                background-color: #f2f2f2;
                text-align: left;
            `;
      headerRow.appendChild(th);
    });

    // 表体
    const tbody = table.createTBody();
    data.forEach((item) => {
      const row = tbody.insertRow();
      // OE码列
      const oeCell = row.insertCell();
      oeCell.textContent = item.oe_number || '--';
      oeCell.style.cssText = 'border: 1px solid #ddd; padding: 8px;';

      // 名称列
      const nameCell = row.insertCell();
      nameCell.textContent = item.oe_epc_name || item.product_name || '--';
      nameCell.style.cssText = 'border: 1px solid #ddd; padding: 8px;';

      // 价格列
      const descCell = row.insertCell();
      descCell.textContent = item.price || '--';
      descCell.style.cssText = 'border: 1px solid #ddd; padding: 8px;';

      // 热度列
      const hotCell = row.insertCell();
      hotCell.textContent = item.enquiry_count || '0';
      hotCell.style.cssText = 'border: 1px solid #ddd; padding: 8px;';
    });

    // 隐藏错误信息
    errContainer.style.display = 'none';

    // 添加到结果容器
    tableContainer.appendChild(title);
    tableContainer.appendChild(table);
    tableContainer.style.display = 'block';
  }

  // 初始化插件
  function init() {
    // 等待页面加载完成
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', createSearchWidget);
    } else {
      createSearchWidget();
    }
  }

  // 启动插件
  init();
})();
