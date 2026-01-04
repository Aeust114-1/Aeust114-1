// 目的：查重複 Email、新增使用者


import db from '../db.js';
import querystring from 'querystring';
import dynamicR from './dynamicResources.js';

export function handleRegister(req, res) {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });

    req.on('end', function() {
        const formData = querystring.parse(body);
        // 依照您的要求，只取 email 和 password
        const { email, password } = formData; 

        // 1. 檢查 Email 是否重複
        db.query('SELECT email FROM users WHERE email = ?', [email], (err, results) => {
            if (results.length > 0) {
                return dynamicR(res, 'register', { error: "此 Email 已被註冊" });
            }

            // 2. 執行註冊 (INSERT)
            // 預設 position 為 'C級人員' (或待定), status 為 'pending' (待審核)
            const sql = 'INSERT INTO users (email, password, position, status) VALUES (?, ?, ?, ?)';
            
            // 參數對應：Email, 密碼, 預設職位, 預設狀態
            db.query(sql, [email, password, 'C級人員', 'pending'], (err, result) => {
                if (err) {
                    console.error(err);
                    return dynamicR(res, 'register', { error: "註冊失敗，系統錯誤" });
                }

                // 註冊成功，導回登入頁並提示
                dynamicR(res, 'login', { error: "註冊申請已送出！請等待「A級人員」審核開通。" });
            });
        });
    });
}




