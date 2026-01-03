import db from '../db.js';
import querystring from 'querystring';
import dynamicR from './dynamicResources.js';
import { activeSessions, generateSessionId } from './session.js';

export function handleLogin(req, res) {
    let body = '';//因為資料是分批進來的，我們需要一個容器先把收到的碎片暫時存起來。
    req.on('data', chunk => { body += chunk.toString(); });//這個 chunk 預設是 Buffer (二進位數據)
    // chunk.toString()：把剛剛拿到的那一小塊二進位數據，強制翻譯成人類看得懂的文字 (String)，"email=test%40gmail.com&password=1234"
    //req：使用者的請求，它本身是一個「唯讀串流 (Readable Stream)」。
    //.on(...)：這是 Node.js 的「事件監聽器」。意思是：「當......發生的時候，請執行後面的動作」。
    req.on('end', function() {
        const formData = querystring.parse(body);//parse 後變成好用的物件：
        const { email, password } = formData;//同時拿出 email 和 password
        const sqlInstruction = 'SELECT * FROM users WHERE email = ? AND password = ?';// 使用 ? 是為了防止 SQL Injection (駭客攻擊)，這是安全寫法

        db.query(sqlInstruction, [email, password], function(err, results) {//callback
            if (err) {
                // 如果資料庫報錯 (例如語法錯誤或連線斷掉)
                console.error(err);
                dynamicR(res, 'login', { error: "系統錯誤，請稍後再試" });
                return;
            }

            // results 是一個陣列，如果長度大於 0，代表有找到這個人
            if (results.length > 0) {//這行就是在問：「箱子裡有東西嗎？」
                // 如果有東西 (> 0) ，代表SQL有找到人，則判定登入成功。
   const user = results[0];

            // 🔥 檢查 1：審核機制
            if (user.status === 'pending') {
                return dynamicR(res, 'login', { error: "您的帳號尚在審核中，請聯繫管理員。" });
            }

            // 🔥 檢查 2：產生 Session 並寫入職位資訊
            const sessionId = generateSessionId();
            activeSessions[sessionId] = {
                email: user.email,
                position: user.position // 關鍵：把 "A級人員" 這個身分記在通行證裡
            };
            
            console.log(`使用者 ${user.email} (${user.position}) 登入成功`);
            // ... (原本的 res.writeHead 轉址程式碼) ...
            res.writeHead(302, { 'Set-Cookie': `session_id=${sessionId}; Path=/; HttpOnly`, 'Location': '/dashboard' });
            res.end();

        } else {
            dynamicR(res, 'login', { error: "帳號或密碼錯誤" });
        }
        });
    });
}