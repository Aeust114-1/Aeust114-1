// 檔案：router.js
import * as controller from './modules/userController.js'; // 把所有功能引入並取名為 controller

function router(req, res) {
    const { url, method } = req;

    switch (url) {
        case '/':
            // 首頁直接導向登入
            res.writeHead(302, { 'Location': '/login' });
            res.end();
            break;

        case '/login':
            if (method === 'GET') {
                controller.showLogin(res);
            } else if (method === 'POST') {
                controller.handleLogin(req, res);
            }
            break;

        case '/dashboard':
            if (method === 'GET') {
                controller.showDashboard(res);
            }
            break;

        default:
            controller.show404(res);
            break;
    }
}

export default router;