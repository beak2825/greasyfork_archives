// ==UserScript==
// @name         TradingView Tradovate 订单标签盈亏显示
// @version      1.2.0
// @description  将 TradingView Tradovate 止盈/止损挂单标签改为预计盈亏金额，并在拖动标签时实时刷新（Hook 原生渲染）。
// @match        https://www.tradingview.com/chart*
// @run-at       document-end
// @grant        none
// @namespace https://greasyfork.org/users/1550737
// @downloadURL https://update.greasyfork.org/scripts/559720/TradingView%20Tradovate%20%E8%AE%A2%E5%8D%95%E6%A0%87%E7%AD%BE%E7%9B%88%E4%BA%8F%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/559720/TradingView%20Tradovate%20%E8%AE%A2%E5%8D%95%E6%A0%87%E7%AD%BE%E7%9B%88%E4%BA%8F%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function () {
  const BOOT_MAX_RETRY = 40;
  const BOOT_INTERVAL_MS = 500;

  function waitFor(conditionFn, maxRetry = BOOT_MAX_RETRY) {
    return new Promise((resolve, reject) => {
      let attempts = 0;
      const timer = setInterval(() => {
        try {
          const result = conditionFn();
          if (result) {
            clearInterval(timer);
            resolve(result);
          } else if (++attempts >= maxRetry) {
            clearInterval(timer);
            reject(new Error('等待条件超时'));
          }
        } catch (err) {
          clearInterval(timer);
          reject(err);
        }
      }, BOOT_INTERVAL_MS);
    });
  }

  async function ensureWebpackRequire() {
    if (window.__webpack_require__) return;
    await waitFor(() => Array.isArray(window.webpackChunktradingview), 10);
    window.webpackChunktradingview.push([
      [`codex_${Date.now()}`],
      {},
      (req) => (window.__webpack_require__ = req),
    ]);
  }

  // 动态查找模块：遍历 Webpack 缓存，按特征匹配
  function findModule(predicate) {
    const cache = __webpack_require__.c;
    for (const id in cache) {
      try {
        const mod = cache[id]?.exports;
        if (mod && predicate(mod)) {
          return mod;
        }
      } catch {}
    }
    return null;
  }

  // 查找所有匹配的模块（用于调试）
  function findAllModules(predicate) {
    const results = [];
    const cache = __webpack_require__.c;
    for (const id in cache) {
      try {
        const mod = cache[id]?.exports;
        if (mod && predicate(mod)) {
          results.push({ id, mod });
        }
      } catch {}
    }
    return results;
  }

  // 模块特征定义
  const MODULE_FINDERS = {
    // tradingService: 导出 tradingService 函数
    tradingService: () => {
      const mod = findModule(m =>
        typeof m.tradingService === 'function' &&
        typeof m.waitTradingService === 'function'
      );
      return mod?.tradingService?.();
    },

    // OrderBaseItem: 导出类，prototype 有 setData/destroy/onMove
    OrderBaseItem: () => {
      const mod = findModule(m =>
        m.OrderBaseItem?.prototype?.setData &&
        m.OrderBaseItem?.prototype?.destroy &&
        typeof m.OrderBaseItem?.prototype?.onMove === 'function'
      );
      return mod?.OrderBaseItem;
    },

    // OrderItem: 导出类，prototype 有 profitLossText，且模块不含 OrderBaseItem
    OrderItem: () => {
      const mod = findModule(m =>
        m.OrderItem?.prototype?.profitLossText &&
        !m.OrderBaseItem &&
        !m.PreOrderItem
      );
      return mod?.OrderItem;
    },

    // pipsUtil: 导出 pipsToRiskInCurrency 函数
    pipsUtil: () => {
      const mod = findModule(m =>
        typeof m.pipsToRiskInCurrency === 'function' &&
        typeof m.priceToPips === 'function'
      );
      return mod;
    },

    // chartWidgetCollectionService: 用于注册图表订单
    chartWidgetCollectionService: () => {
      const mod = findModule(m =>
        typeof m.chartWidgetCollectionService === 'function'
      );
      return mod?.chartWidgetCollectionService?.();
    },
  };

  function formatMoney(amount, currency = 'USD') {
    try {
      const nf = new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency,
        maximumFractionDigits: 2,
      });
      const formatted = nf.format(Math.abs(amount));
      if (amount > 0) return `+${formatted}`;
      if (amount < 0) return `-${formatted}`.replace('--', '-');
      return formatted;
    } catch {
      const abs = Math.round(Math.abs(amount) * 100) / 100;
      const sign = amount > 0 ? '+' : amount < 0 ? '-' : '';
      return `${sign}${abs}${currency ? ` ${currency}` : ''}`.trim();
    }
  }

  function createEnhancer(tradingService, OrderBaseItem, OrderItem, pipsUtil) {
    const enhancer = window.__codexOrderEnhancer ?? { orderItems: new Set() };
    enhancer.tradingService = tradingService;

    const originalSetData = OrderBaseItem.prototype.setData;
    const originalDestroy = OrderBaseItem.prototype.destroy;
    const originalProfitLoss = OrderItem.prototype.profitLossText;

    if (!OrderBaseItem.prototype.__codexPatchedOnMove && typeof OrderBaseItem.prototype.onMove === 'function') {
      const originalOnMove = OrderBaseItem.prototype.onMove;
      OrderBaseItem.prototype.onMove = function codexOnMove(payload) {
        const res = originalOnMove.call(this, payload);
        try {
          if (typeof this.fireProfitLossChange === 'function') {
            this.fireProfitLossChange();
          }
        } catch (err) {
          console.warn('刷新拖动盈亏失败', err);
        }
        return res;
      };
      OrderBaseItem.prototype.__codexPatchedOnMove = true;
    }

    const isTradovate = () => {
      try {
        return tradingService.activeBroker?.().metainfo?.().id === 'TRADOVATE';
      } catch {
        return false;
      }
    };

    const getPositions = () => {
      try {
        return tradingService._positionService?.positions?.() ?? [];
      } catch {
        return [];
      }
    };

    const findPosition = (symbol) => {
      if (!symbol) return null;
      const lower = symbol.toLowerCase();
      return (
        getPositions().find((p) => p?.symbol?.toLowerCase?.() === lower) ||
        null
      );
    };

    const getOrderPrice = (orderItem, data) => {
      try {
        const live = orderItem.price?.();
        if (Number.isFinite(live)) return live;
      } catch {}
      const fallback = [data.limitPrice, data.stopPrice, data.price];
      return fallback.find((v) => Number.isFinite(v)) ?? null;
    };

    function calcAmount(orderItem, data, entry, trigger) {
      if (!Number.isFinite(entry) || !Number.isFinite(trigger)) return null;
      if (!Number.isFinite(data.side) || data.side === 0) return null;
      const delta = (entry - trigger) * data.side;
      if (!Number.isFinite(delta)) return null;
      const provider = orderItem._symbolDataProvider;
      const symbolInfo = provider?.symbolData?.();
      const pipValueInfo = provider?.pipValue?.();
      if (!symbolInfo || !pipValueInfo) return null;
      const pipSize =
        symbolInfo.pipSize ||
        symbolInfo.minTick ||
        (symbolInfo.minmov && symbolInfo.pricescale
          ? symbolInfo.minmov / symbolInfo.pricescale
          : 1);
      if (!pipSize || !Number.isFinite(pipSize) || pipSize === 0) return null;
      const pipValue = orderItem.isBuyDirection()
        ? pipValueInfo.buyPipValue
        : pipValueInfo.sellPipValue;
      if (!(pipValue > 0)) return null;
      const pipCount = delta / pipSize;
      const priceMagnifier = symbolInfo.priceMagnifier || 1;
      const lotSize = symbolInfo.lotSize || 1;
      const qtyInput = data.qty ?? data.qtyBySide ?? 0;
      const qty = Math.abs(qtyInput);
      if (!qty) return null;
      const amount = pipsUtil.pipsToRiskInCurrency(
        pipCount,
        qty,
        pipValue,
        priceMagnifier,
        lotSize,
      );
      return Number.isFinite(amount) ? amount : null;
    }

    function computeCustomLabel(orderItem) {
      if (!isTradovate()) return null;
      const data = orderItem.data?.();
      if (!data || (data.type !== 1 && data.type !== 3) || !data.symbol) {
        return null;
      }
      const position = findPosition(data.symbol);
      if (!position || !Number.isFinite(position.side) || position.side * (data.side ?? 0) >= 0) {
        return null;
      }
      const entry = Number.isFinite(position.avgPrice)
        ? position.avgPrice
        : position.price;
      if (!Number.isFinite(entry)) return null;
      const trigger = getOrderPrice(orderItem, data);
      if (!Number.isFinite(trigger)) return null;
      const amount = calcAmount(orderItem, data, entry, trigger);
      if (amount === null) return null;
      const currency = orderItem.currency?.() || position.currency || 'USD';
      return formatMoney(amount, currency);
    }

    OrderBaseItem.prototype.setData = function patchedSetData(data) {
      if (!this.__codexOrderRegistered) {
        this.__codexOrderRegistered = true;
        enhancer.orderItems.add(this);
      }
      return originalSetData.call(this, data);
    };

    OrderBaseItem.prototype.destroy = function patchedDestroy(...args) {
      enhancer.orderItems.delete(this);
      return originalDestroy.call(this, ...args);
    };

    OrderItem.prototype.profitLossText = function patchedProfitLoss(shorten) {
      try {
        const custom = computeCustomLabel(this);
        if (custom) return custom;
      } catch (err) {
        console.error('计算自定义订单标签失败', err);
      }
      return originalProfitLoss.call(this, shorten);
    };

    const refresh = () => {
      enhancer.orderItems.forEach((order) => {
        if (typeof order.fireProfitLossChange === 'function') {
          order.fireProfitLossChange();
        }
      });
    };

    const subscribe = (delegate) => {
      if (!delegate?.subscribe) return;
      try {
        delegate.unsubscribe(enhancer, refresh);
      } catch {}
      delegate.subscribe(enhancer, refresh);
    };

    subscribe(tradingService._positionService?.positionUpdate?.());
    subscribe(tradingService._positionService?.positionsRemoved?.());
    subscribe(tradingService._ordersService?.activeOrdersUpdated?.());
    subscribe(tradingService._ordersService?.activeOrdersRemoved?.());

    enhancer.registerFromChart = () => {
      try {
        const collection = MODULE_FINDERS.chartWidgetCollectionService();
        const chart = collection?.activeChartWidget?.value?.();
        const map = chart?.model().model()._customSourcesMap;
        map?.forEach?.((source, key) => {
          if (!key.startsWith('tradedGroup')) return;
          const main = source.items?.().main;
          if (!main || main.__codexOrderRegistered) return;
          main.__codexOrderRegistered = true;
          enhancer.orderItems.add(main);
        });
      } catch (err) {
        console.warn('注册 TradedGroup 实例失败', err);
      }
    };

    enhancer.refreshLabels = refresh;
    window.__codexOrderEnhancer = enhancer;
    enhancer.registerFromChart();
    refresh();
  }

  async function install() {
    try {
      await ensureWebpackRequire();
      await waitFor(() => window.__webpack_require__?.c, 40);

      // 动态查找所有依赖模块
      const tradingService = MODULE_FINDERS.tradingService();
      const OrderBaseItem = MODULE_FINDERS.OrderBaseItem();
      const OrderItem = MODULE_FINDERS.OrderItem();
      const pipsUtil = MODULE_FINDERS.pipsUtil();

      // 调试：输出查找结果
      console.debug('[Codex] 模块查找结果:', {
        tradingService: !!tradingService,
        OrderBaseItem: !!OrderBaseItem,
        OrderItem: !!OrderItem,
        pipsUtil: !!pipsUtil,
      });

      if (!tradingService || !OrderBaseItem || !OrderItem || !pipsUtil) {
        const missing = [];
        if (!tradingService) missing.push('tradingService');
        if (!OrderBaseItem) missing.push('OrderBaseItem');
        if (!OrderItem) missing.push('OrderItem');
        if (!pipsUtil) missing.push('pipsUtil');
        throw new Error(`关键模块不可用: ${missing.join(', ')}`);
      }

      createEnhancer(tradingService, OrderBaseItem, OrderItem, pipsUtil);
      console.info('[Codex] Tradovate 标签盈亏脚本已加载 (动态模块查找)');
    } catch (err) {
      console.error('[Codex] 安装脚本失败，将重试', err);
      setTimeout(install, 2000);
    }
  }

  install();
})();
