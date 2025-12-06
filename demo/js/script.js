document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 第一部分：從後端 API 獲取資料
    // ==========================================

    // 定義一個異步函數來載入所有資料
    async function loadAllData() {
        try {
            // 修改重點：網址改成 http://localhost:3000/api
            const API_URL = 'http://localhost:3000/api';

            // 1. 呼叫 AI 資料 API
            const aiResponse = await fetch(`${API_URL}?query=ai`);
            const aiData = await aiResponse.json();
            renderAI(aiData);

            // 2. 呼叫 資安 資料 API
            const secResponse = await fetch(`${API_URL}?query=security`);
            const secData = await secResponse.json();
            renderSecurity(secData);

            // 3. 呼叫 雲端 資料 API
            const cloudResponse = await fetch(`${API_URL}?query=cloud`);
            const cloudData = await cloudResponse.json();
            renderCloud(cloudData);

            // 4. 呼叫 永續 資料 API
            const ecoResponse = await fetch(`${API_URL}?query=eco`);
            const ecoData = await ecoResponse.json();
            renderEco(ecoData);

        } catch (error) {
            console.error('資料載入失敗:', error);
            // 貼心提示：如果是用 Node.js，錯誤通常是因為忘記啟動 server
            // alert('無法連接到後端伺服器，請確認是否已執行 "node server.js"');
        }
    }

    // 執行載入函數
    loadAllData();

    // ==========================================
    // 第二部分：資料渲染邏輯 (Render Logic)
    // ==========================================

    /* --- 渲染函數 A: AI 卡片 --- */
    function renderAI(data) {
        // ★★★ 這是新增的偵錯代碼 ★★★
        console.log('【前端收到的 AI 資料】:', data);
        
        const container = document.getElementById('container-ai');
        if (!container) return; // 防止找不到元素報錯
        
        container.innerHTML = ''; // 清空容器

        // 如果資料是空的，顯示提示
        if (data.length === 0) {
            container.innerHTML = '<p style="color:white; padding:20px;">資料庫目前沒有 AI 專案資料</p>';
            return;
        }

        data.forEach(item => {
            // 建立 HTML 字串，動態帶入資料
            // 注意：這裡使用的 item.title, item.description, item.icon 必須跟資料庫欄位一致
            const cardHtml = `
                <article class="card filter-item" data-category="${item.category}">
                    <div class="card-icon"><i class="fa-solid ${item.icon}"></i></div>
                    <h4>${item.title}</h4>
                    <p>${item.description}</p>
                    <button class="btn-learn-more" data-id="${item.id}">詳情</button>
                </article>
            `;
            container.insertAdjacentHTML('beforeend', cardHtml);
        });
        bindDynamicEvents(); // 重新綁定按鈕事件
    }

    /* --- 渲染函數 B: 資安列表 --- */
    function renderSecurity(data) {
        const container = document.getElementById('container-sec');
        if (!container) return;

        // 保留表頭，只移除 .list-item
        const items = container.querySelectorAll('.list-item');
        items.forEach(el => el.remove());

        data.forEach(item => {
            // 根據 warning/success 決定圖標與樣式
            const icon = item.status_type === 'warning' ? 'fa-triangle-exclamation' : 'fa-shield-halved';
            const levelClass = item.level === '高' || item.level === '中' ? 'level-high' : 'level-low';
            
            const rowHtml = `
                <div class="list-item filter-item ${item.status_type}" data-category="${item.category}">
                    <span class="status"><i class="fa-solid ${icon}"></i> ${item.status_text}</span>
                    <span>${item.ip}</span>
                    <span class="${levelClass}">${item.level}</span>
                    <span>${item.time}</span>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', rowHtml);
        });
    }

    /* --- 渲染函數 C: 雲端數據 --- */
    function renderCloud(data) {
        const container = document.getElementById('container-cloud');
        if (!container) return;
        
        container.innerHTML = '';

        data.forEach(item => {
            // 計算百分比
            const percent = Math.round((item.value / item.max) * 100);
            // 決定進度條顏色 class
            let colorClass = '';
            if(item.color === 'purple') colorClass = 'color-purple';
            if(item.color === 'green') colorClass = 'color-green';

            const statHtml = `
                <div class="stat-box filter-item" data-category="${item.category}">
                    <h4>${item.name}</h4>
                    <div class="progress-bar-bg">
                        <div class="progress-bar-fill ${colorClass}" style="width: ${percent}%;"></div>
                    </div>
                    <span class="stat-value">${item.value} / ${item.max} (${percent}%)</span>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', statHtml);
        });
    }

    /* --- 渲染函數 D: 永續特色 --- */
    function renderEco(data) {
        const container = document.getElementById('container-eco');
        if (!container) return;

        container.innerHTML = '';

        data.forEach(item => {
            // 將 features 陣列轉為 li 標籤
            // 如果 features 不是陣列 (例如資料庫存錯)，給一個預設空陣列避免報錯
            const features = Array.isArray(item.features) ? item.features : [];
            const featuresList = features.map(f => `<li><i class="fa-solid fa-check"></i> ${f}</li>`).join('');

            const featureHtml = `
                <div class="feature-container filter-item" data-category="${item.category}">
                    <div class="feature-text">
                        <h3>${item.title}</h3>
                        <p>${item.description}</p>
                        <ul>${featuresList}</ul>
                    </div>
                    <div class="feature-graphic">
                        <i class="fa-solid fa-seedling"></i>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', featureHtml);
        });
    }

    // ==========================================
    // 第三部分：UI 互動與篩選邏輯 (UI Logic)
    // ==========================================
    
    // --- 1. 導航切換 (連動內容與篩選器) ---
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.view-section');
    const filterGroups = document.querySelectorAll('.filter-group');
    
    const bannerTitle = document.getElementById('banner-title');
    const bannerSubtitle = document.getElementById('banner-subtitle');
    const bannerIcon = document.getElementById('banner-icon');

    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // 樣式處理
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');

            // 獲取設定資料
            const targetId = this.getAttribute('data-target');
            const filterGroupId = this.getAttribute('data-filter-group');
            const newTitle = this.getAttribute('data-title');
            const newSubtitle = this.getAttribute('data-subtitle');
            const newIconClass = this.getAttribute('data-icon');

            // 更新橫幅
            if(bannerTitle) bannerTitle.textContent = newTitle;
            if(bannerSubtitle) bannerSubtitle.textContent = newSubtitle;
            if(bannerIcon) bannerIcon.className = `fa-solid ${newIconClass} logo-icon`;

            // 切換區塊顯示
            sections.forEach(section => {
                section.style.display = (section.id === targetId) ? 'block' : 'none';
            });

            // 切換篩選器
            switchFilterGroup(filterGroupId);
        });
    });

    // 輔助：切換篩選群組
    function switchFilterGroup(groupId) {
        filterGroups.forEach(group => {
            group.style.display = 'none';
            group.classList.remove('active');
        });
        const targetGroup = document.getElementById(groupId);
        if(targetGroup) {
            targetGroup.style.display = 'flex';
            targetGroup.classList.add('active');
            // 重置篩選狀態 (選回 'all')
            const radioAll = targetGroup.querySelector('input[value="all"]');
            if(radioAll) {
                radioAll.checked = true;
                filterContent(targetGroup.id, 'all');
            }
        }
    }

    // --- 2. 篩選邏輯 ---
    const allFilterInputs = document.querySelectorAll('.filter-group input[type="radio"]');
    
    allFilterInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            const parentGroup = e.target.closest('.filter-group');
            if(parentGroup) {
                filterContent(parentGroup.id, e.target.value);
            }
        });
    });

    function filterContent(groupId, category) {
        const sectionId = groupId.replace('filter-', 'section-');
        const targetSection = document.getElementById(sectionId);
        if(!targetSection) return;

        // 重新抓取動態生成的 filter-item (因為 DOM 已經被 JS 重寫過)
        const items = targetSection.querySelectorAll('.filter-item');

        items.forEach(item => {
            const itemCategory = item.getAttribute('data-category');
            if (category === 'all') {
                item.style.display = ''; // 顯示 (flex/grid)
            } else {
                item.style.display = (itemCategory === category) ? '' : 'none';
            }
        });
    }

    // --- 3. 綁定動態生成的按鈕事件 ---
    function bindDynamicEvents() {
        const learnMoreBtns = document.querySelectorAll('.btn-learn-more');
        learnMoreBtns.forEach(btn => {
            // 移除舊事件避免重複綁定 (簡單實作)
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            
            newBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const id = e.target.getAttribute('data-id');
                alert(`正在查詢資料庫 ID: ${id} 的詳細內容...`);
            });
        });
    }

    // --- 4. 無障礙開關 ---
    const accessToggle = document.getElementById('accessibility-toggle');
    if (accessToggle) {
        accessToggle.addEventListener('change', function() {
            document.documentElement.style.filter = this.checked ? "contrast(1.3) saturate(1.2)" : "none";
        });
    }
});