// server.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const port = 3000; // Node.js 伺服器通常運行在 3000 port

// 1. 啟用 CORS (允許前端網頁存取這個後端)
app.use(cors());

// 2. 設定資料庫連線
// 請將這裡的資訊改成你自己的 MySQL 設定
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      // 你的 MySQL 帳號
    password: '',      // 你的 MySQL 密碼
    database: 'global_tech_db'
});

// 測試連線
db.connect(err => {
    if (err) {
        console.error('資料庫連線失敗:', err);
    } else {
        console.log('成功連接到 MySQL 資料庫');
    }
});

// 3. 建立 API 路由
// 前端會呼叫: http://localhost:3000/api?query=ai
app.get('/api', (req, res) => {
    const queryType = req.query.query;
    let sql = '';

    // 根據前端傳來的 query 參數決定要查哪張表
    switch (queryType) {
        case 'ai':
            sql = 'SELECT * FROM ai_projects';
            break;
        case 'security':
            sql = 'SELECT * FROM security_logs ORDER BY created_at DESC LIMIT 10';
            break;
        case 'cloud':
            sql = 'SELECT * FROM cloud_metrics';
            break;
        case 'eco':
            sql = 'SELECT * FROM eco_initiatives';
            break;
        default:
            return res.status(400).json({ error: '無效的查詢參數' });
    }

    // 執行 SQL 查詢
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        // 資料處理 (Data Transformation)
        // 為了符合前端 script.js 的格式，我們可能需要微調一下資料
        const processedData = results.map(row => {
            // 處理 Security 的時間與等級格式
            if (queryType === 'security') {
                const date = new Date(row.created_at);
                return {
                    ...row,
                    time: date.toLocaleTimeString('en-US', { hour12: false }), // 轉成 HH:mm:ss
                    level: row.threat_level // 對應前端欄位
                };
            }
            // 處理 Cloud 的欄位對應
            if (queryType === 'cloud') {
                return {
                    ...row,
                    name: row.metric_name,
                    value: row.current_value,
                    max: row.max_value,
                    color: row.color_theme
                };
            }
            // 處理 Eco 的 JSON 格式 (如果是字串的話需轉回物件)
            if (queryType === 'eco' && typeof row.features === 'string') {
                try {
                    return { ...row, features: JSON.parse(row.features) };
                } catch (e) {
                    return { ...row, features: [] }; // 解析失敗回傳空陣列
                }
            }
            // AI 或其他情況直接回傳
            return row;
        });

        res.json(processedData);
    });
});

// 啟動伺服器
app.listen(port, () => {
    console.log(`伺服器正在運行，請打開: http://localhost:${port}`);
});