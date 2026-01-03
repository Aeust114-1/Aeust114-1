import dynamicR from './dynamicResources.js';//動態資源模組
import { handleRegister } from './register.js';//註冊模組
import { handleLogin } from './loginLogic.js';//登入邏輯模組
import {showSettings,handleSettings,getThemeFromCookie} from './settingmod.js';
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
export function showDashboard(req,res) {
    const currentTheme = getThemeFromCookie(req);
    const sql = 'SELECT * FROM employees ORDER BY id DESC';
    //新增的出現在最上面
    
    db.query(sql, (err, results) => {
        if (err) {
            console.error('讀取員工列表失敗:', err);
            // 發生錯誤時，也可以傳空陣列避免網頁壞掉
            return dynamicR(res, 'dashboard', 
                { adminName: "管理員", employees: [] ,theme: currentTheme}
            );
        }
        // 將資料庫撈到的 results 傳給前端
        dynamicR(res, 'dashboard', 
            { adminName: "模組化管理員", employees: results ,theme: currentTheme}
        );
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


