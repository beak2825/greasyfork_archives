/**
 * LLMStream - 大模型请求和Markdown实时渲染库
 * 支持流式/非流式响应、Markdown渲染、错误处理等
 * @version 1.0.2 - 修复非流式响应解析问题
 */
class LLMStream {
  constructor(options) {
    this.url = options.url;
    this.method = options.method || 'POST';
    this.headers = options.headers || {};
    this.body = options.body || {};
    this.target = options.target;
    this.markdown = options.markdown !== undefined ? options.markdown : true;
    this.stream = options.stream !== undefined ? options.stream : true;
    this.typewriterEffect = options.typewriterEffect || false;
    this.typewriterSpeed = options.typewriterSpeed || 30;
    
    // 回调函数
    this.onChunk = options.onChunk;
    this.onComplete = options.onComplete;
    this.onError = options.onError;
    this.onStart = options.onStart;
    
    this.controller = null;
    this.content = '';
    this.targetElement = null;
    this.typewriterTimer = null;
    
    // 初始化目标元素
    if (this.target) {
      this.targetElement = typeof this.target === 'string' 
        ? document.querySelector(this.target) 
        : this.target;
      if (!this.targetElement) {
        console.error(`目标元素 ${this.target} 未找到`);
      }
    }
    
    // 动态加载Markdown渲染库
    if (this.markdown && !window.marked) {
      this.loadMarkdownLibrary();
    }
  }
  
  /**
   * 动态加载marked.js库
   */
  async loadMarkdownLibrary() {
    return new Promise((resolve, reject) => {
      if (window.marked) {
        resolve();
        return;
      }
      
      const script = document.createElement('script');
      script.src = 'https://fastly.jsdelivr.net/npm/marked/marked.min.js';
      script.onload = () => {
        console.log('Marked.js 加载成功');
        if (window.marked) {
          marked.setOptions({
            breaks: true,
            gfm: true,
            highlight: function(code, lang) {
              if (window.hljs && lang) {
                try {
                  return hljs.highlight(code, { language: lang }).value;
                } catch (e) {
                  return code;
                }
              }
              return code;
            }
          });
        }
        resolve();
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
  
  /**
   * 开始请求
   */
  async start() {
    try {
      // 确保Markdown库已加载
      if (this.markdown && !window.marked) {
        await this.loadMarkdownLibrary();
      }
      
      // 清空内容
      this.content = '';
      if (this.targetElement) {
        this.targetElement.innerHTML = '';
      }
      
      // 调用开始回调
      if (this.onStart) {
        this.onStart();
      }
      
      // 创建AbortController
      this.controller = new AbortController();
      
      // 判断是流式还是非流式
      const isStreamRequest = this.body.stream === true;
      
      console.log(`🚀 开始${isStreamRequest ? '流式' : '非流式'}请求`);
      
      if (isStreamRequest) {
        await this.startStreamRequest();
      } else {
        await this.startNormalRequest();
      }
      
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('请求已取消');
      } else {
        console.error('请求错误:', error);
        if (this.onError) {
          this.onError(error);
        }
      }
    }
  }
  
  /**
   * 流式请求
   */
  async startStreamRequest() {
    const response = await fetch(this.url, {
      method: this.method,
      headers: this.headers,
      body: JSON.stringify(this.body),
      signal: this.controller.signal
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP错误 ${response.status}: ${errorText}`);
    }
    
    await this.handleStreamResponse(response);
  }
  
  /**
   * 非流式请求
   */
  async startNormalRequest() {
    console.log('📡 发起非流式请求...');
    
    const response = await fetch(this.url, {
      method: this.method,
      headers: this.headers,
      body: JSON.stringify(this.body),
      signal: this.controller.signal
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP错误 ${response.status}: ${errorText}`);
    }
    
    // 解析JSON响应
    const data = await response.json();
    console.log('📦 收到响应数据:', data);
    
    // 提取内容（支持多种响应格式）
    let content = this.extractContent(data);
    
    console.log('📝 提取的内容:', content);
    
    if (!content) {
      console.warn('⚠️ 未能从响应中提取内容，完整响应:', JSON.stringify(data, null, 2));
      throw new Error('响应中没有找到有效内容');
    }
    
    // 使用打字机效果或直接显示
    if (this.typewriterEffect) {
      await this.typewriterRender(content);
    } else {
      this.content = content;
      this.render(this.content);
      
      if (this.onComplete) {
        this.onComplete(this.content);
      }
    }
  }
  
  /**
   * 从响应数据中提取内容（支持多种格式）
   */
  extractContent(data) {
    // 格式1: OpenAI / 通义千问格式
    if (data.choices && Array.isArray(data.choices) && data.choices.length > 0) {
      const choice = data.choices[0];
      
      // message.content (标准格式)
      if (choice.message && choice.message.content) {
        return choice.message.content;
      }
      
      // text (某些API)
      if (choice.text) {
        return choice.text;
      }
      
      // delta.content (流式格式误用)
      if (choice.delta && choice.delta.content) {
        return choice.delta.content;
      }
    }
    
    // 格式2: 直接在data下
    if (data.content) {
      return data.content;
    }
    
    // 格式3: output字段
    if (data.output) {
      if (typeof data.output === 'string') {
        return data.output;
      }
      if (data.output.content) {
        return data.output.content;
      }
      if (data.output.text) {
        return data.output.text;
      }
    }
    
    // 格式4: response字段
    if (data.response) {
      return typeof data.response === 'string' ? data.response : data.response.content;
    }
    
    // 格式5: text字段
    if (data.text) {
      return data.text;
    }
    
    // 格式6: result字段
    if (data.result) {
      return typeof data.result === 'string' ? data.result : data.result.content;
    }
    
    // 格式7: message字段
    if (data.message) {
      return typeof data.message === 'string' ? data.message : data.message.content;
    }
    
    // 格式8: 直接是字符串
    if (typeof data === 'string') {
      return data;
    }
    
    return null;
  }
  
  /**
   * 打字机效果渲染
   */
  async typewriterRender(fullContent) {
    return new Promise((resolve) => {
      let index = 0;
      this.content = '';
      
      const type = () => {
        if (index < fullContent.length) {
          const char = fullContent[index];
          this.content += char;
          this.render(this.content);
          
          if (this.onChunk) {
            this.onChunk(char, this.content);
          }
          
          index++;
          this.typewriterTimer = setTimeout(type, this.typewriterSpeed);
        } else {
          if (this.onComplete) {
            this.onComplete(this.content);
          }
          resolve();
        }
      };
      
      type();
    });
  }
  
  /**
   * 处理SSE流式响应
   */
  async handleStreamResponse(response) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';
    
    try {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          console.log('✅ 流式传输完成');
          if (this.onComplete) {
            this.onComplete(this.content);
          }
          break;
        }
        
        buffer += decoder.decode(value, { stream: true });
        
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        
        for (const line of lines) {
          if (line.startsWith('data:')) {
            const data = line.slice(5).trim();
            
            if (data === '[DONE]') {
              continue;
            }
            
            try {
              const json = JSON.parse(data);
              const delta = json.choices?.[0]?.delta?.content || '';
              
              if (delta) {
                this.content += delta;
                this.render(this.content);
                
                if (this.onChunk) {
                  this.onChunk(delta, this.content);
                }
              }
            } catch (e) {
              console.warn('JSON解析错误:', e, data);
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }
  
  /**
   * 渲染内容到目标元素
   */
  render(content) {
    if (!this.targetElement) return;
    
    if (this.markdown && window.marked) {
      this.targetElement.innerHTML = marked.parse(content);
    } else {
      this.targetElement.textContent = content;
    }
    
    this.targetElement.scrollTop = this.targetElement.scrollHeight;
  }
  
  /**
   * 停止请求
   */
  stop() {
    if (this.controller) {
      this.controller.abort();
      console.log('已停止HTTP请求');
    }
    
    if (this.typewriterTimer) {
      clearTimeout(this.typewriterTimer);
      this.typewriterTimer = null;
      console.log('已停止打字机效果');
    }
  }
  
  /**
   * 获取当前内容
   */
  getContent() {
    return this.content;
  }
  
  /**
   * 清空内容
   */
  clear() {
    this.content = '';
    if (this.targetElement) {
      this.targetElement.innerHTML = '';
    }
  }
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LLMStream;
}
if (typeof window !== 'undefined') {
  window.LLMStream = LLMStream;
}