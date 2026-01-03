// 檔案：modules/userController.js (新增部分)
import querystring from 'querystring'; // 記得引入
import dynamicR from './dynamicResources.js';//動態資源模組




// 輔助函式：從 Cookie 取得 theme
export function getThemeFromCookie(req) {
    if (!req.headers.cookie) return 'light'; // 沒 Cookie 就回傳預設值
    
    // Cookie 格式像這樣: "theme=dark; other=123"
    // 我們要解析它
    const cookies = querystring.parse(req.headers.cookie, '; ');
    return cookies.theme || 'light';
}

// 7. 顯示設定頁 (GET)
export function showSettings(req, res) {
    const currentTheme = getThemeFromCookie(req);
    // 把目前的 theme 傳給頁面，這樣頁面才會顯示正確的勾選狀態和顏色
    dynamicR(res, 'settings', { theme: currentTheme });
}

// 8. 處理設定儲存 (POST)
export function handleSettings(req, res) {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
        const formData = querystring.parse(body);
        const selectedTheme = formData.theme; // 拿到使用者選的 'light' 或 'dark'

        // 設定 Cookie：把 theme 存到使用者的瀏覽器裡
        // Path=/ 代表全站通用
        res.writeHead(302, {
            'Set-Cookie': `theme=${selectedTheme}; Path=/`,
            'Location': '/dashboard' // 儲存後跳轉回儀表板
        });
        res.end();
    });
}

