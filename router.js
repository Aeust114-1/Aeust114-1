// 檔案：router.js
import * as controller from './modules/userController.js'; // 把所有功能引入並取名為 controller
import { serveStatic } from './modules/staticResources.js';

function router(req, res) {

    if (req.url.startsWith('/public/')) {
        serveStatic(req, res);
        return; // 處理完就結束，不要往下跑
    }


    switch (req.url) {
        case '/':
            // 首頁直接導向登入
            res.writeHead(302, { 'Location': '/login' });
            res.end();
            break;

        case '/login'://登入頁
            if (req.method === 'GET') {//顯示登入頁
                controller.showLogin(res);
            } else if (req.method === 'POST') {//處理登入邏輯
                controller.handleLogin(req, res);
            }
            break;
        
        case '/register':
            if (req.method === 'GET') {
                // 如果是用戶想看註冊表單
                controller.showRegister(res);
            } else if (req.method === 'POST') {
                // 如果是用戶送出註冊資料
                controller.handleRegister(req, res);
            }
            break;
            
            case '/dashboard':
            // 必須傳入 req 和 res，因為 userController.js 剛剛改成需要 req 了
            controller.showDashboard(req, res); 
            break;

            
         // [新增] 員工管理 API 路由
        case '/api/employees': // 對應前端 fetch 的路徑
            if (req.method === 'POST') {
                // 呼叫 controller 裡面的函式來處理新增邏輯
                controller.addEmployee(req, res);
            } else if (req.method === 'PUT') {
                // [新增] 修改
                controller.updateEmployee(req, res);
            } else if (req.method === 'DELETE') {
                // [新增] 刪除
                controller.deleteEmployee(req, res);
            }
            break;

        case '/settings':
            if (req.method === 'GET') {
                controller.showSettings(req, res);
            } else if (req.method === 'POST') {
                controller.handleSettings(req, res);
            }
            break;
        

        default://傳出錯誤頁面
            controller.Error404(res);
            break;
    }
}

export default router;