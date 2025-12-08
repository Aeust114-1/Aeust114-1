const http = require('http');
const fs = require('fs');
const ejs = require('ejs');
const path = require('path');

http.createServer((req, res) => {
  let filePath = '';
  let fileOtherFile = '';

switch (req.url) { 
    case '/':
      filePath = '/views/login.ejs';
      break;
    default:
      break;
}
if (req.url.endsWith('.css') || req.url.endsWith('.js') || req.url.endsWith('.png')) { 
  
  fileOtherFile = req.url;
}

  const extname = (fileOtherFile === '') ? path.extname(filePath) : path.extname(fileOtherFile);

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
        const index3ErrPath = './error404/error404.ejs';
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

