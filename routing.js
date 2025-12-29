const http = require('http');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring'); // 用來解析 POST 表單資料
const ejs = require('ejs');

http.createServer((req, res) => {
  let filePath = '';
  let fileOtherFile = '';

switch (req.url) { 
    case '/':
      filePath = '/views/login.ejs';
      break;
    case '/dashboard':
      filePath = '/views/dashboard.ejs';

    default:
      filePath = req.url;
      fileOtherFile = filePath;// 這個到底是幹嘛的
}


  const contentTypes = {
    '.html': 'text/html; charset=utf-8',        // HTML 網頁文件
    '.ejs': 'text/html; charset=utf-8',         // EJS 模板（渲染後輸出為 HTML）
    '.js': 'text/javascript; charset=utf-8',    // JavaScript 腳本文件
    '.css': 'text/css; charset=utf-8',          // CSS 樣式表文件
    '.json': 'application/json',                // JSON 資料格式
    '.png': 'image/png',                        // PNG 圖片格式
    '.jpg': 'image/jpg',                        // JPG/JPEG 圖片格式
    '.gif': 'image/gif',                        // GIF 動畫圖片
    '.svg': 'image/svg+xml',                    // SVG 向量圖形
    '.ico': 'image/x-icon'                      // 網站 favicon 圖示
  };
  const extname = (fileOtherFile === '') ? path.extname(filePath) : path.extname(fileOtherFile);
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
    fs.readFile(staticFilePath, 'utf8', (err, content) => {
      if (err) {// 讀取靜態資源失敗，回傳 404
        fs.readFile(('.' + '/views/error.ejs'), 'utf8', (err, template) => {
          const html = ejs.render(template);
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(html);
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
  console.log('  - http://localhost:3000/dashboard');
  console.log('  - 其他路徑將顯示 404 錯誤頁面');
});

