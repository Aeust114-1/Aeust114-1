// 目的：動態資源管理，負責讀取 EJS 檔案、填入資料、回傳 HTML。

import fs from 'fs';
import ejs from 'ejs';

/** 這裡來解釋dynamicR這個函示的用處
 * dynamicR (Dynamic Response)的簡寫，寫全稱太麻煩就這樣命名了，
 * 這是我們自定義的通用函式，用來處理所有需要 "EJS 渲染" 的回應。
 * res - HTTP 回應物件 (Response)，讓我們可以把結果傳回給瀏覽器。
 * filename - 模板的檔案名稱 (例如 'login' 或 'dashboard')。
 * data - 要填入模板的數據。
 * 寫法 data = {} 是 ES6 的「預設參數」。
 * 如果呼叫時沒傳數據 (例如只傳了 res 和 filename)，data 就會自動變成空物件 {}。
 * 這樣是為了防止 EJS 渲染時因為 data 是 undefined 而報錯。
 */
function dynamicR(res, filename, data = {}) {

    // --- 步驟 1: 拼湊檔案路徑 ---
    // 我們告訴電腦模板放在哪裡。這裡設定所有模板都在專案根目錄的 'views' 資料夾內。
    // 如果 filename 是 'index'，這裡就會變成 './views/index.ejs'。
    const filePath = './views/' + filename + '.ejs'; 

    if (!data.theme) {
        data.theme = 'light';// 如果 controller 沒傳 theme 進來，我們就預設用 'light' (亮色)
    }

    
    // --- 步驟 2: 讀取檔案 (非同步) ---
    // 使用 fs.readFile 去硬碟撈檔案。
    // 'utf8'：這是編碼格式，確保讀出來的是我們看得懂的文字，而不是電腦的二進位亂碼。
    // callback function：「讀完後會執行這個函式」。
    fs.readFile(filePath, 'utf8', function(err, template) {
        
        // --- 步驟 3: 錯誤檢查 ---
        // 如果err有值，代表檔案讀取失敗。
        if (err) {
            console.error(err); // 給工程師看
            
            // 回傳 404 Not Found 狀態碼
            // Content-Type 設為 text/plain (純文字)，因為我們只打算回傳一句簡單的錯誤訊息。
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('找不到頁面或模板錯誤');
            
            return;
        }

        // --- 步驟 4: 渲染 HTML (把資料填進去) ---
        // ejs.render會把 template (挖好洞的 HTML) 和 data (要填入的內容) 混合在一起。
        // 產出的 html 變數就是一個完整的、沒有挖空的標準 HTML 字串。
        const html = ejs.render(template, data);

        // --- 步驟 5: 發送回應 ---
        // 設定 HTTP 標頭 (Header)：
        // 狀態碼 200：代表一切順利 (OK)。
        // charset=utf-8：確保中文不會變亂碼。
        //直接寫死 'text/html; charset=utf-8'，不須匯入副檔名字典，EJS 模板渲染後的內容本質上是 HTML，所以不需要受到 mimeTypes.js 的影響。
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(html);
    });
}

export default dynamicR;