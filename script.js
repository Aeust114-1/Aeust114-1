document.addEventListener('DOMContentLoaded', () => {
    // --- DOM 元素 ---
    const fabBtn = document.getElementById('fab-btn'); // Floating Action Button
    const modal = document.getElementById('post-modal');  // 貼文彈跳視窗
    const closeModalBtn = document.getElementById('close-modal'); // 關閉彈跳視窗按鈕
    const submitPostBtn = document.getElementById('submit-post'); // 發布貼文按鈕
    const postText = document.getElementById('post-text'); // 貼文文字輸入框
    const imageUpload = document.getElementById('image-upload'); // 圖片上傳輸入框
    const imagePreviewContainer = document.getElementById('image-preview-container'); // 圖片預覽容器
    const imagePreview = document.getElementById('image-preview'); // 圖片預覽元素
    const removeImageBtn = document.getElementById('remove-image'); // 移除圖片按鈕
    const feed = document.getElementById('feed'); // 動態牆貼文容器
    
    // 導覽與頁面
    const navItems = document.querySelectorAll('.nav-item'); // 導覽列項目
    const pageSections = document.querySelectorAll('.page-section'); // 各頁面區塊
    
    // 聊天與通知
    const msgInput = document.getElementById('msg-input'); // 聊天訊息輸入框
    const sendMsgBtn = document.getElementById('send-msg-btn'); // 發送訊息按鈕
    const chatMessages = document.getElementById('chat-messages'); // 聊天訊息容器
    const notificationList = document.getElementById('notification-list'); // 通知列表容器
    const toastContainer = document.getElementById('toast-container'); // Toast 容器

    let currentImageFile = null; // 儲存目前上傳的圖片檔案 
    // ========================
    // 0. 工具函式：彈出通知 & 寫入通知頁
    // ========================
    
    // 顯示彈出卡片 (Toast)
    function showToast(title, message, iconClass = 'fa-solid fa-bell') { // 預設圖示為鈴鐺
        const toast = document.createElement('div'); // 建立 Toast 元素
        toast.classList.add('toast-card'); // 加入樣式類別
        
        toast.innerHTML = ` 
            <div class="toast-icon"><i class="${iconClass}"></i></div>
            <div class="toast-body">
                <h4>${title}</h4>
                <p>${message}</p>
            </div>
        `; // 設定內容
        
        toastContainer.appendChild(toast); // 加入到容器中

        // 動畫結束後 (4秒) 移除元素
        setTimeout(() => {
            toast.remove();
        }, 4000);
    } // showToast 結束

    // 新增到「通知頁面」列表
    function addNotificationToPage(content) {
        const div = document.createElement('div'); // 建立通知項目
        div.classList.add('noti-item'); // 加入樣式類別
        div.innerHTML = `
            <div class="avatar" style="background-color: #e7f3ff; color: #1877f2;">N</div>
            <div class="noti-content">
                <p>${content}</p>
                <span class="noti-time">剛剛</span>
            </div>
        `; // 設定內容
        // 插入到最上方
        notificationList.prepend(div); // 加入到通知列表中
    }

    // ========================
    // 1. 頁面切換邏輯
    // ========================
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault(); // 防止預設行為
            navItems.forEach(nav => nav.classList.remove('active')); // 移除所有導覽列的 active 狀態
            pageSections.forEach(section => {
                section.classList.remove('active'); // 移除所有頁面的 active 狀態
                section.classList.add('hidden'); // 隱藏所有頁面
            });
            item.classList.add('active'); // 設定目前點擊的導覽列為 active
            const targetId = item.getAttribute('data-target'); // 取得目標頁面 ID
            document.getElementById(targetId).classList.remove('hidden'); // 顯示目標頁面
            document.getElementById(targetId).classList.add('active'); // 設定目標頁面為 active
            fabBtn.style.display = (targetId === 'page-home') ? 'flex' : 'none';    // 只有在首頁顯示 FAB
        });
    });

    // ========================
    // 2. 聊天功能 (整合通知)
    // ========================
    function sendMessage() { // 發送訊息
        const text = msgInput.value.trim(); // 取得並修剪輸入內容
        if (!text) return; // 若為空則不處理

        const date = new Date(); // 取得目前時間
        const timeString = date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0'); // 格式化時間字串

        const msgDiv = document.createElement('div'); // 建立訊息元素
        msgDiv.classList.add('message', 'sent'); // 加入樣式類別
        msgDiv.innerHTML = `<p>${escapeHtml(text)}</p>`; // 設定訊息內容
        chatMessages.appendChild(msgDiv); // 加入到聊天訊息容器
        msgInput.value = ''; // 清空輸入框
        chatMessages.scrollTop = chatMessages.scrollHeight; // 滾動到底部

        // [觸發通知] 1. 彈出 Toast
        showToast('訊息已發送', `你傳送了：${text.substring(0, 10)}...`, 'fa-solid fa-paper-plane'); // 使用紙飛機圖示
        
        // [觸發通知] 2. 寫入通知頁面
        addNotificationToPage(`你對 <strong>Alice</strong> 發送了一則訊息。`); // 通知內容
    }

    sendMsgBtn.addEventListener('click', sendMessage); // 點擊發送按鈕
    msgInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); }); // 按下 Enter 鍵發送訊息

    // ========================
    // 3. 貼文功能 (整合通知)
    // ========================
    fabBtn.addEventListener('click', () => { modal.classList.add('show'); postText.focus(); }); // 開啟貼文彈跳視窗
    const closeModal = () => { modal.classList.remove('show'); resetForm(); }; // 關閉貼文彈跳視窗並重設表單
    closeModalBtn.addEventListener('click', closeModal); // 點擊關閉按鈕
    window.addEventListener('click', (e) => { if (e.target === modal) closeModal(); }); // 點擊彈跳視窗外側關閉

    imageUpload.addEventListener('change', function() { // 圖片上傳變更事件
        const file = this.files[0]; // 取得選取的檔案
        if (file) { // 若有檔案
            currentImageFile = file; // 儲存目前圖片檔案
            const reader = new FileReader(); // 建立檔案閱讀器
            reader.onload = (e) => { // 讀取完成後
                imagePreview.src = e.target.result; // 設定預覽圖片來源
                imagePreviewContainer.classList.remove('hidden'); // 顯示圖片預覽容器
            }
            reader.readAsDataURL(file);  // 以 Data URL 讀取檔案
        }
    });

    removeImageBtn.addEventListener('click', () => { // 移除圖片按鈕事件
        imageUpload.value = ''; // 清空檔案輸入框
        currentImageFile = null; // 清除目前圖片檔案
        imagePreview.src = '';   // 清空預覽圖片來源
        imagePreviewContainer.classList.add('hidden'); // 隱藏圖片預覽容器
    });

    function resetForm() { // 重設貼文表單
        postText.value = ''; // 清空文字輸入框
        imageUpload.value = ''; // 清空檔案輸入框
        currentImageFile = null; // 清除目前圖片檔案
        imagePreview.src = '';  // 清空預覽圖片來源
        imagePreviewContainer.classList.add('hidden'); // 隱藏圖片預覽容器
    }

    submitPostBtn.addEventListener('click', () => { // 發布貼文按鈕事件
        const text = postText.value.trim(); // 取得並修剪輸入內容
        if (!text && !currentImageFile) { alert('請輸入內容或上傳圖片！'); return; } // 若無內容與圖片則提示
        createPost(text, currentImageFile); // 建立新貼文
        closeModal();    
    });

    function createPost(text, imageFile) { // 建立新貼文
        const date = new Date(); // 取得目前時間
        const timeString = date.toLocaleString('zh-TW', { hour: '2-digit', minute: '2-digit' }); // 格式化時間字串
        const postDiv = document.createElement('div'); // 建立貼文元素
        postDiv.classList.add('post-card'); // 加入樣式類別
        let imageHtml = imageFile ? `<img src="${URL.createObjectURL(imageFile)}" class="post-image">` : ''; // 若有圖片則建立圖片 HTML

        postDiv.innerHTML = `
            <div class="post-header">
                <div class="user-info">
                    <div class="avatar">Me</div>
                    <div>
                        <div class="username">我</div>
                        <div style="font-size: 12px; color: #666;">${timeString}</div>
                    </div>
                </div>
            </div>
            <div class="post-content"><p>${escapeHtml(text)}</p>${imageHtml}</div>
        `; // 設定貼文內容
        feed.prepend(postDiv); // 插入到動態牆最上方

        // [觸發通知] 1. 彈出 Toast
        showToast('發文成功', '你的貼文已經發布到動態牆囉！', 'fa-solid fa-check'); // 使用勾勾圖示

        // [觸發通知] 2. 寫入通知頁面
        addNotificationToPage(`你成功發布了一則新貼文。`); // 通知內容
    }

    function escapeHtml(text) { // 避免 XSS 攻擊的簡易轉義函式
        return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); // 替換特殊字元
    }
});