import http from 'http';
import router from './router.js';

const PORT = 3000;// 統一管理port
const server = http.createServer(router);

server.listen(PORT, function() {
  console.log(`伺服器已啟動！請訪問 http://localhost:${PORT}`);
  console.log('可用路由：');
  console.log(`  - http://localhost:${PORT}`);
  console.log(`  - http://localhost:${PORT}/dashboard`);
  console.log('  - 其他路徑將顯示 404 錯誤頁面');
});
