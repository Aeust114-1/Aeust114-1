import dynamicR from './dynamicResources.js';//動態資源模組
import { handleRegister } from './register.js';//註冊模組
import { handleLogin } from './loginLogic.js';//登入邏輯模組
import { checkAuth } from './Authorization.js';
import { showSettings, handleSettings, getThemeFromCookie } from './settingmod.js';
import {addEmployee,updateEmployee,deleteEmployee} from './employrr.js'
import db from '../db.js';


// 1. 顯示登入頁 (GET)
export function showLogin(res) {
    dynamicR(res, 'login', { error: null });
}

// 2. 處理登入邏輯 (POST)
export { handleLogin };

//處理setting,顯示設定頁 (GET),處理設定儲存 (POST)
export {showSettings,handleSettings};


// 3. 顯示儀表板 (GET)
export function showDashboard(req, res) {
    
    // 1. 先呼叫檢查工具
    const currentUser = checkAuth(req, res);

    // 2. 如果檢查結果是 false，代表沒權限 (且 checkAuth 已經幫忙顯示錯誤頁面了)
    // 我們只要這裡直接 return 停住，不要往下跑就好
    if (currentUser === false) {
        return; 
    }

    // --- 3. 只有權限通過才會執行下面的資料庫查詢 ---
    console.log('授權通過，使用者:', currentUser.email);
    const currentTheme = getThemeFromCookie(req);
    const sql = 'SELECT * FROM employees ORDER BY id DESC';
    
    db.query(sql, (err, results) => {
        if (err) {
            return dynamicR(res, 'dashboard', { adminName: "管理員", employees: [], theme: currentTheme });
        }

        dynamicR(res, 'dashboard', { 
            adminName: currentUser.email, // 這裡可以顯示登入者的 Email
            currentUserPosition: currentUser.position,
            employees: results, 
            theme: currentTheme 
        });
    });
}


// 4. 處理 404
export function Error404(res) {
    // 如果有 error.ejs 就用 dynamicR，沒有就回傳文字
    dynamicR(res, 'error', { message: "找不到此頁面 (404)" });
}

export{addEmployee,updateEmployee,deleteEmployee};

// 5. 顯示註冊頁 (GET)
export function showRegister(res) {
    dynamicR(res, 'register', { error: null });
}

// 6. 處理註冊邏輯 (POST)
export { handleRegister };


