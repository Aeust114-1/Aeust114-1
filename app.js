const http = require('http');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring'); // 用來解析 POST 表單資料
const ejs = require('ejs');

const PORT = 3000;

// 建立伺服器
const server = http.createServer((req, res) => {
    
    // 1. 定義一個 Helper 函式來渲染 EJS 檔案
    // 因為沒有 res.render，我們要自己讀取檔案並編譯
    const render = (filename, data = {}) => {
        const filePath = path.join(__dirname, 'views', filename + '.ejs');
        
        fs.readFile(filePath, 'utf-8', (err, content) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Server Error: File not found');
                return;
            }
            // 使用 EJS 編譯 HTML
            try {
                const html = ejs.render(content, data);
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(html);
            } catch (e) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('EJS Render Error');
            }
        });
    };

    // 2. 處理路由 (Routing)
    // 取得請求的 URL 和 方法 (GET/POST)
    const { url, method } = req;

    // --- 路由: 首頁 (重導向到登入) ---
    if (url === '/' && method === 'GET') {
        res.writeHead(302, { 'Location': '/login' });
        res.end();
    }

    // --- 路由: 顯示登入頁 (GET) ---
    else if (url === '/login' && method === 'GET') {
        render('login', { error: null });
    }

    // --- 路由: 處理登入動作 (POST) ---
    else if (url === '/login' && method === 'POST') {
        // 原生 Node.js 沒有 req.body，必須手動接收資料流
        let body = '';
        
        req.on('data', chunk => {
            body += chunk.toString(); // 將資料塊組合成字串
        });

        req.on('end', () => {
            // 解析 form data (例如: email=test%40test.com&password=123)
            const formData = querystring.parse(body);
            const { email, password } = formData;

            // 驗證邏輯
            if (password !== '1234') {
                // 失敗：渲染登入頁並帶錯誤訊息
                render('login', { error: "帳號或密碼錯誤 (原生Node版)" });
            } else {
                // 成功：重導向到 dashboard
                res.writeHead(302, { 'Location': '/dashboard' });
                res.end();
            }
        });
    }

    // --- 路由: 顯示後台 (GET) ---
    else if (url === '/dashboard' && method === 'GET') {
        const mockEmployees = [
            { name: "王小明", email: "ming@ems.com", position: "前端工程師", department: "技術部", status: "Active" },
            { name: "李美華", email: "mei@ems.com", position: "人資經理", department: "HR", status: "Active" },
            { name: "張志豪", email: "chang@ems.com", position: "實習生", department: "設計部", status: "Inactive" }
        ];

        render('dashboard', { 
            adminName: "原生管理員", 
            employees: mockEmployees 
        });
    }

    // --- 404 Not Found ---
    else {
        render('error', { message: "找不到此頁面 (404)" });
    }
});

// 啟動監聽
server.listen(PORT, () => {
    console.log(`原生 Node.js 伺服器已啟動: http://localhost:${PORT}`);
});