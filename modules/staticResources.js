// 目的：靜態資源管理

import fs from 'fs';
import path from 'path';
import getContentType from './mimeType.js'; // 引入 MIME 判斷

export function serveStatic(req, res) {
    // 1. 取得檔案路徑
    // 假設網址是 /public/css/style.css，我們就在專案目錄找 ./public/css/style.css
    const otherPathfile = '.' + req.url;

    // 2. 判斷副檔名
    const extname = path.extname(otherPathfile).toLowerCase();
    
    // 3. 讀取檔案
    fs.readFile(otherPathfile, function(err, content) {
        if (err) {
            if (err.code == 'ENOENT') {
                // 找不到檔案 (404)
                res.writeHead(404);
                res.end('File not found');
            } else {
                // 其他伺服器錯誤 (500)
                res.writeHead(500);
                res.end(`Server Error: ${err.code}`);
            }
        } else {
            // 4. 成功讀取，設定正確的 Content-Type 並回傳
            const contentType = getContentType(extname);
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
}