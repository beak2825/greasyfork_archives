// ==UserScript==
// @name         mebuki-page-state
// @namespace    https://mebuki.moe/
// @version      0.1.6
// @description  めぶきちゃんねるでカタログ、またはスレッドにいる時にstateをアップデートしsubscriberに送信します
// @author       ame-chan
// @match        https://mebuki.moe/app*
// @license      MIT
// @run-at       document-idle
// ==/UserScript==
(function () {
  'use strict';
  class StateManager {
    listeners;
    state;
    /**
     * 初期状態を指定してインスタンスを作成する
     * @param {T} initialState 管理する状態の初期値
     */ constructor(initialState) {
      this.listeners = [];
      this.state = {
        ...initialState,
      };
    }
    /**
     * 現在の状態を取得する (Readonly)
     * @returns {Readonly<T>} 現在の状態オブジェクト
     */ getState() {
      return {
        ...this.state,
      };
    }
    /**
     * 状態を部分的に更新し、購読者に通知する
     * @param {Partial<T>} newState 更新したい状態のキーと値を持つオブジェクト
     * @returns {void}
     */ updateState(newState) {
      const oldState = this.state;
      this.state = {
        ...this.state,
        ...newState,
      };
      if (this.state !== oldState) {
        this.notifyListeners();
      }
    }
    /**
     * 状態の変更を購読する
     * @param {function(state): void} listener 状態変更時に呼び出すコールバック
     * @returns {function(): void} 購読解除用の関数
     */ subscribe(listener) {
      this.listeners.push(listener);
      return () => {
        this.listeners = this.listeners.filter((l) => l !== listener);
      };
    }
    /**
     * 購読者に現在の状態を通知する
     * @private
     * @returns {void}
     */ notifyListeners() {
      const currentState = this.getState();
      this.listeners.forEach((listener) => listener(currentState));
    }
  }
  const initialState = {
    isCatalogPage: false,
    isThreadPage: false,
    threadMessageCount: 0,
  };
  const stateManager = new StateManager(initialState);
  const updateState = () => {
    const threadMessageElms = document.querySelectorAll('.thread-messages > [id^="message-"]');
    const threadMessageCount = threadMessageElms.length;
    const isCatalogPage = /^\/app\/?$/.test(location.pathname);
    const currentState = stateManager.getState();
    if (threadMessageCount > 0) {
      if (
        !currentState.isThreadPage ||
        currentState.isCatalogPage ||
        currentState.threadMessageCount !== threadMessageCount
      ) {
        stateManager.updateState({
          isThreadPage: true,
          isCatalogPage: false,
          threadMessageCount,
        });
      }
    } else if (isCatalogPage) {
      if (currentState.isThreadPage || !currentState.isCatalogPage) {
        stateManager.updateState({
          isThreadPage: false,
          isCatalogPage: true,
          threadMessageCount: 0,
        });
      }
    } else {
      if (currentState.isThreadPage || currentState.isCatalogPage) {
        stateManager.updateState({
          isThreadPage: false,
          isCatalogPage: false,
          threadMessageCount: 0,
        });
      }
    }
  };
  const observer = new MutationObserver(updateState);
  updateState();
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
  window.USER_SCRIPT_MEBUKI_STATE = {
    stateManager,
    subscribe: (listener) => stateManager.subscribe(listener),
    getState: () => stateManager.getState(),
  };
})();
