document.addEventListener('DOMContentLoaded', () => {
    
    // --- 功能 1: 導航欄切換效果 ---
    // 獲取所有導航按鈕
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // 移除所有按鈕的 'active' 類別
            navItems.forEach(nav => nav.classList.remove('active'));
            // 為被點擊的按鈕添加 'active' 類別（觸發 CSS 中的發光效果）
            this.classList.add('active');
        });
    });

    // --- 功能 2: 無障礙開關 (Accessibility Toggle) ---
    // 雖然圖中只是一個 UI 元素，這裡我們給它添加實際功能
    // 切換時，會增加頁面的對比度或去色
    const accessToggle = document.getElementById('accessibility-toggle');
    const body = document.body;

    accessToggle.addEventListener('change', function() {
        if(this.checked) {
            // 開啟無障礙模式：這裡示範將濾鏡設為高對比或灰階
            // 實際應用中可能會加大字體或改變配色方案
            document.documentElement.style.filter = "contrast(1.2) saturate(1.2)";
            console.log("Accessibility Mode: ON");
        } else {
            // 關閉無障礙模式：恢復原狀
            document.documentElement.style.filter = "none";
            console.log("Accessibility Mode: OFF");
        }
    });

    // --- 功能 3: 網格內容按鈕互動 ---
    const learnMoreBtns = document.querySelectorAll('.btn-learn-more');
    learnMoreBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // 防止頁面跳轉
            e.preventDefault();
            // 獲取該卡片的標題
            const cardTitle = e.target.parentElement.querySelector('h4').innerText;
            alert(`You clicked on: ${cardTitle}\n(This is a demo interaction)`);
        });
    });
});