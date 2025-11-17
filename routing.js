// ==========================================
// Node.js + EJS 網頁伺服器
// ==========================================
// 功能說明：
// 1. 提供多頁面路由（首頁、計算器、404頁面）
// 2. 支援 EJS 模板動態渲染
// 3. 處理靜態資源（CSS、JS、圖片等）
// 4. 自動錯誤處理與 404 頁面導向
// ==========================================

// ------------------------------------------
// 引入必要的 Node.js 核心模組
// ------------------------------------------

// http 模組：用於創建 HTTP 伺服器
const http = require('http');

// fs 模組 (File System)：用於讀取檔案系統中的文件
const fs = require('fs');

// ejs 模組：用於渲染 EJS 模板引擎，將動態內容嵌入 HTML
const ejs = require('ejs');

// path 模組：用於處理和解析文件路徑，提取副檔名
const path = require('path');

// ==========================================
// 創建並配置 HTTP 伺服器
// ==========================================

http.createServer((req, res) => {
  // req (request): 請求物件，包含客戶端發送的所有資訊（URL、標頭等）
  // res (response): 回應物件，用於向客戶端發送回應（HTML、狀態碼等）

  // ==========================================
  // 步驟 1: URL 路由與頁面分派
  // ==========================================

  // 宣告兩個變數來處理不同類型的請求：
  // filePath: 儲存要渲染的 EJS 模板文件路徑
  // fileOtherFile: 儲存靜態資源（CSS、JS 等）的路徑
  let filePath = '';
  let fileOtherFile = '';

  // Switch根據不同路由要寫的部分

switch (req.url) { // req.url 是用來取得使用者請求的路徑，是http模組提供的屬性
    case '/':
      // 首頁路由
      filePath = '/threas.ejs';        // 跟目錄路徑通往 index.ejs
      break;
    default: //這裡是原本要傳給其他檔案的路由
      break;
  }
if (req.url.endsWith('.css') || req.url.endsWith('.js') || req.url.endsWith('.png')) { // endsWith是用來判斷字串結尾的函式，判斷是否為.css .js .png結尾
  // 判斷是否為靜態資源請求，要求判斷是否有.css .js .png結尾的靜態資源
  fileOtherFile = req.url;             // 靜態資源路徑，如果沒有這個，那靜態資源將抓不到
  // 沒有endWith的話，靜態資源會被當成ejs頁面處理，導致錯誤，也導致fileOtherFile一直是空字串
}


  

  // ==========================================
  // 步驟 2: 判斷文件類型（提取副檔名）
  // ==========================================

  // 使用三元運算子判斷要從哪個路徑提取副檔名：
  // - 如果 fileOtherFile 是空字串 → 從 filePath 提取（代表是 EJS 頁面）
  // - 如果 fileOtherFile 有值 → 從 fileOtherFile 提取（代表是靜態資源）
  //
  // path.extname() 函數會提取文件的副檔名
  // 範例：
  //   path.extname('/index.ejs') → '.ejs'
  //   path.extname('/style.css') → '.css'
  //   path.extname('/script.js') → '.js'
  const extname = (fileOtherFile === '') ? path.extname(filePath) : path.extname(fileOtherFile);

  // ==========================================
  // 步驟 3: 定義 MIME 類型映射表
  // ==========================================

  // MIME 類型（Content-Type）告訴瀏覽器如何處理接收到的文件
  // 如果設定錯誤，可能導致：
  // - CSS 不生效（被當作純文字）
  // - JavaScript 無法執行
  // - 圖片無法顯示
  const contentTypes = {
    '.html': 'text/html; charset=utf-8',        
    '.ejs': 'text/html; charset=utf-8',         
    '.js': 'text/javascript; charset=utf-8',    
    '.css': 'text/css; charset=utf-8',          
    '.json': 'application/json',                
    '.png': 'image/png',                        // PNG 圖片格式
    '.jpg': 'image/jpg',                        // JPG/JPEG 圖片格式
    '.gif': 'image/gif',                        // GIF 動畫圖片
    '.svg': 'image/svg+xml',                    // SVG 向量圖形
    '.ico': 'image/x-icon'                      // 網站 favicon 圖示
  };

  const contentType = contentTypes[extname] || 'text/plain';

  if (extname === '.ejs') {

    fs.readFile(('.' + filePath), 'utf8', (err, template) => {
      if (err) {

        res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('錯誤：無法讀取模板文件 - ' + err.message);
        return;
      }
      const html = ejs.render(template);
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
    });

  } else {
    const staticFilePath = '.' + fileOtherFile;


    fs.readFile(staticFilePath, (err, content) => {
      if (err) {
        const index3ErrPath = './index3.ejs';
        fs.readFile(index3ErrPath, 'utf8', (errEjs, template) => { 
          if (errEjs) { 
            console.error('讀取失敗:', errEjs);
            res.end('404 - 找不到文件：'); 
          } else {
            res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });

            res.end(template);
          }
        });
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      }
    });
  }
}).listen(3000, () => {
  console.log('伺服器已啟動！請訪問 http://localhost:3000');
  console.log('可用路由：');
  console.log('  - http://localhost:3000');
  console.log('  - 其他路徑將顯示 404 錯誤頁面');
});

