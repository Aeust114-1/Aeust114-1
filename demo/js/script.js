document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 第一部分：模擬 MySQL 資料庫回傳的 JSON 資料
    // ==========================================
    // 未來請使用 AJAX/Fetch 從您的 PHP/Node.js 後端獲取這些資料
    // ==========================================

    // 1. 來自 table: ai_projects
    const mockAiData = [
        { id: 1, title: '機器學習', description: '自動化數據分析模型與預測。', category: 'analysis', icon: 'fa-robot' },
        { id: 2, title: '神經網絡', description: '模擬人腦運作的深度運算架構。', category: 'analysis', icon: 'fa-microchip' },
        { id: 3, title: '視覺辨識', description: '高精度即時影像處理技術。', category: 'vision', icon: 'fa-eye' },
        { id: 4, title: '監控分析', description: '即時串流影像分析與警示。', category: 'vision', icon: 'fa-video' }
    ];

    // 2. 來自 table: security_logs
    const mockSecurityData = [
        { id: 101, status_text: '攔截', status_type: 'warning', ip: '192.168.1.105', level: '高', time: '10:42:01', category: 'warning' },
        { id: 102, status_text: '正常', status_type: 'success', ip: '10.0.0.52', level: '低', time: '10:40:15', category: 'normal' },
        { id: 103, status_text: '正常', status_type: 'success', ip: '172.16.0.3', level: '低', time: '10:38:22', category: 'normal' },
        { id: 104, status_text: '異常', status_type: 'warning', ip: '192.168.1.88', level: '中', time: '10:35:10', category: 'warning' }
    ];

    // 3. 來自 table: cloud_metrics
    const mockCloudData = [
        { id: 201, name: '伺服器負載 (US-East)', category: 'server', value: 75, max: 100, color: 'default' },
        { id: 202, name: '記憶體使用率', category: 'server', value: 45, max: 100, color: 'purple' },
        { id: 203, name: '資料庫連線數 (SQL)', category: 'db', value: 920, max: 1000, color: 'green' },
        { id: 204, name: 'Redis 快取命中率', category: 'db', value: 88, max: 100, color: 'green' }
    ];

    // 4. 來自 table: eco_initiatives
    const mockEcoData = [
        { 
            id: 301, 
            title: '2025 淨零碳排目標', 
            description: '我們致力於將數據中心的能源效率提升 40%，並全面採用再生能源供電。', 
            category: 'goal',
            features: ['太陽能發電板覆蓋率 80%', '智慧冷卻系統'] // JSON 陣列
        }
    ];

    // ==========================================
    // 第二部分：資料渲染邏輯 (Render Logic)
    // ==========================================

    // 初始化：將模擬資料渲染到畫面上
    // TODO: 未來在此處呼叫 fetch() API，成功後再執行 render 函數
    renderAI(mockAiData);
    renderSecurity(mockSecurityData);
    renderCloud(mockCloudData);
    renderEco(mockEcoData);

    /* --- 渲染函數 A: AI 卡片 --- */
    function renderAI(data) {
        const container = document.getElementById('container-ai');
        container.innerHTML = ''; // 清空容器

        data.forEach(item => {
            // 建立 HTML 字串，動態帶入資料
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
        container.innerHTML = '';

        data.forEach(item => {
            // 將 features 陣列轉為 li 標籤
            const featuresList = item.features.map(f => `<li><i class="fa-solid fa-check"></i> ${f}</li>`).join('');

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
            bannerTitle.textContent = newTitle;
            bannerSubtitle.textContent = newSubtitle;
            bannerIcon.className = `fa-solid ${newIconClass} logo-icon`;

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
    accessToggle.addEventListener('change', function() {
        document.documentElement.style.filter = this.checked ? "contrast(1.3) saturate(1.2)" : "none";
    });
});