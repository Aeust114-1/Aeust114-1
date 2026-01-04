// 目的：員工管理的 CRUD（新增、修改、刪除）

import db from '../db.js';//匯入資料庫模組

//壹、新增人員
export function addEmployee(req, res) {
    let body = '';

    // 1. 接收前端傳來的資料片段
    req.on('data', chunk => {
        body += chunk.toString();
    });

    // 2. 資料接收完畢後執行
    req.on('end', () => {
        try {
             // 把 JSON 字串轉成物件
            const newEmployeeData = JSON.parse(body);

            // --- 這裡寫入資料庫邏輯 (例如 db.push 或 SQL INSERT) ---
            //console.log('收到新員工資料:', newEmployeeData);
            
            const { name, email,position, department, status } = newEmployeeData;
            const sql = 'INSERT INTO employees (name, email, position, department, status) VALUES (?, ?, ?, ?, ?)';
            db.query(sql, [name, email, position, department, status], (err, result) => {
                if (err) {
                    console.error('新增員工失敗:', err); // 這邊會印出具體錯誤
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ success: false, message: '資料庫錯誤' }));
                }

                console.log('成功寫入資料庫, ID:', result.insertId);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: '新增成功' }));
            });

        } catch (error) {
            // 錯誤處理
            console.error(error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: '伺服器錯誤' }));
        }
    });
}


// 貳、更新人員訊息
export function updateEmployee(req, res) {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', function()  {
        try {
            const data = JSON.parse(body);
            const { id, name, email, position, department, status } = data;
            const sql = 'UPDATE employees SET name=?, email=?, position=?, department=?, status=? WHERE id=?';
            
            db.query(sql, [name, email, position, department, status, id], function(err, result) {
                if (err) {
                    console.error(err);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ success: false, message: '資料庫錯誤' }));
                }
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: '更新成功' }));
            });
        } catch (error) {
            console.error(error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false }));
        }
    });
}

// 參、刪除人員 
export function deleteEmployee(req, res) {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', function() {
        try {
            const data = JSON.parse(body);
            const { id } = data;
            const sql = 'DELETE FROM employees WHERE id=?';
            
            db.query(sql, [id], (err, result) => {
                if (err) {
                    console.error(err);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ success: false, message: '資料庫錯誤' }));
                }
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: '刪除成功' }));
            });
        } catch (error) {
            console.error(error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false }));
        }
    });
}