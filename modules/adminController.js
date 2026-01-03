import db from '../db.js';
import dynamicR from './dynamicResources.js';
import { checkAuth } from './Authorization.js';

// 顯示審核列表
export function showAdminPanel(req, res) {
    const currentUser = checkAuth(req, res);
    if (!currentUser) return; 

    // 🔥 權限卡控：只有 A級人員 可以看
    if (currentUser.position !== 'A級人員') {
        return dynamicR(res, 'error', { message: "權限不足：此頁面僅限 A級人員 訪問" });
    }

    // 撈出所有待審核的用戶
    db.query("SELECT * FROM users WHERE status = 'pending'", (err, results) => {
        if (err) return dynamicR(res, 'error', { message: "資料庫讀取失敗" });

        dynamicR(res, 'admin', { 
            adminName: currentUser.email,
            pendingUsers: results 
        });
    });
}

// API: 核准用戶
export function approveUser(req, res) {
    const currentUser = checkAuth(req, res);
    // 雙重保險：API 也要檢查權限
    if (!currentUser || currentUser.position !== 'A級人員') return;

    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
        const { id, action } = JSON.parse(body);
        
        if (action === 'approve') {
            // 核准：變更狀態為 Active
            db.query("UPDATE users SET status = 'Active' WHERE EmailId = ?", [id], (err) => {
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({success: true}));
            });
        } else {
            // 拒絕：刪除帳號
            db.query("DELETE FROM users WHERE EmailId = ?", [id], (err) =>{
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({success: true}));
            });
        }
    });
}