// 這是一個全域變數，用來暫存所有登入中的使用者
// 格式類似： { "亂碼ID_1": { email: "a@b.com" }, "亂碼ID_2": { ... } }
export const activeSessions = {};

// 產生隨機通行證 ID 的工具函式
export function generateSessionId() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
}