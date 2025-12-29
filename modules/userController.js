// 檔案：controller.js
import fs from 'fs';
import ejs from 'ejs';
import querystring from 'querystring';

// === 私有工具 (只有這裡會用到，不匯出) ===
const render = (res, filename, data = {}) => {
    const filePath = './views/' + filename + '.ejs'; // 假設模板在 views 目錄
    fs.readFile(filePath, 'utf8', (err, template) => {
        if (err) {
            console.error(err);
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('找不到頁面或模板錯誤');
            return;
        }
        try {
            const html = ejs.render(template, data);
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(html);
        } catch (e) {
            console.error(e);
            res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('EJS 渲染發生錯誤');
        }
    });
};

// === 公開功能 (匯出給 Router 呼叫) ===

// 1. 顯示登入頁 (GET)
export function showLogin(res) {
    render(res, 'login', { error: null });
}

// 2. 處理登入邏輯 (POST)
export function handleLogin(req, res) {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
        const formData = querystring.parse(body);
        const { password } = formData;

        if (password !== '1234') {
            // 失敗：留在登入頁並顯示錯誤
            render(res, 'login', { error: "帳號或密碼錯誤 (Controller版)" });
        } else {
            // 成功：跳轉
            res.writeHead(302, { 'Location': '/dashboard' });
            res.end();
        }
    });
}

// 3. 顯示儀表板 (GET)
export function showDashboard(res) {
    const mockEmployees = [
        { name: "王小明", position: "前端工程師", status: "Active" },
        { name: "李美華", position: "人資經理", status: "Active" },
        { name: "張志豪", position: "實習生", status: "Inactive" }
    ];
    render(res, 'dashboard', { adminName: "模組化管理員", employees: mockEmployees });
}

// 4. 處理 404
export function show404(res) {
    // 如果有 error.ejs 就用 render，沒有就回傳文字
    render(res, 'error', { message: "找不到此頁面 (404)" });
}