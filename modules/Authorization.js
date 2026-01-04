// 檔案：modules/Authorization.js
import { activeSessions } from './session.js';
import querystring from 'querystring';
import dynamicR from './dynamicResources.js';

// (檢查權限)，只做檢查，不做資料庫查詢
export function checkAuth(req, res) {
    const cookieHeader = req.headers.cookie || '';
    // (如果req.headers.cookie是undefined，就把它當作空字串，避免程式報錯)
    const cookies = querystring.parse(cookieHeader, '; '); // 解讀：把 Cookie 字串解析成物件
    const userSessionId = cookies.session_id;// 取票：拿出最重要的 session_id



    // 如果檢查失敗，就
    if (!userSessionId || !activeSessions[userSessionId]) {
        console.log('未授權的訪問嘗試，阻擋！');
 
        // 直接交給 dynamicR 處理就好，這樣就不會重複發送導致崩潰
        dynamicR(res, 'error', { message: "您沒有權限訪問此頁面，請先登入系統！" });
        
        return false; // 回傳 false 代表「檢查沒過」
    }
    
    // 檢查通過，回傳使用者資訊
    return activeSessions[userSessionId]; 
}