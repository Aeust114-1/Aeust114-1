document.addEventListener('DOMContentLoaded', () => {
    
    // --- DOM 元素獲取 ---
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.view-section');
    const filterGroups = document.querySelectorAll('.filter-group');
    
    // 橫幅相關
    const bannerTitle = document.getElementById('banner-title');
    const bannerSubtitle = document.getElementById('banner-subtitle');
    const bannerIcon = document.getElementById('banner-icon');

    // --- 功能 1: 導航切換 (連動內容與篩選器) ---
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // 1. 樣式切換
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');

            // 2. 獲取資料屬性
            const targetId = this.getAttribute('data-target');
            const filterGroupId = this.getAttribute('data-filter-group');
            
            const newTitle = this.getAttribute('data-title');
            const newSubtitle = this.getAttribute('data-subtitle');
            const newIconClass = this.getAttribute('data-icon');

            // 3. 更新橫幅
            bannerTitle.textContent = newTitle;
            bannerSubtitle.textContent = newSubtitle;
            bannerIcon.className = `fa-solid ${newIconClass} logo-icon`;

            // 4. 切換主要內容區塊
            sections.forEach(section => {
                if(section.id === targetId) {
                    section.style.display = 'block';
                    // 加入 fade-in 動畫 class (若 CSS 有定義)
                    section.classList.add('fade-in');
                } else {
                    section.style.display = 'none';
                    section.classList.remove('fade-in');
                }
            });

            // 5. 切換對應的左側篩選器
            switchFilterGroup(filterGroupId);
        });
    });

    // --- 輔助函數：切換篩選群組 ---
    function switchFilterGroup(groupId) {
        // 先隱藏所有篩選組
        filterGroups.forEach(group => {
            group.style.display = 'none';
            group.classList.remove('active');
        });

        // 顯示目標篩選組
        const targetGroup = document.getElementById(groupId);
        if(targetGroup) {
            targetGroup.style.display = 'flex'; // 恢復 flex 佈局
            targetGroup.classList.add('active');
            
            // 重置該組的選取狀態為 'all' (選擇性功能)
            const radioAll = targetGroup.querySelector('input[value="all"]');
            if(radioAll) {
                radioAll.checked = true;
                // 觸發一次篩選以重置顯示內容
                filterContent(targetGroup.id, 'all');
            }
        }
    }

    // --- 功能 2: 實際篩選邏輯 ---
    // 監聽所有篩選器的 radio button 變化
    const allFilterInputs = document.querySelectorAll('.filter-group input[type="radio"]');
    
    allFilterInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            // 找出是哪個篩選組被觸發
            const parentGroup = e.target.closest('.filter-group');
            const filterValue = e.target.value;
            
            if(parentGroup) {
                filterContent(parentGroup.id, filterValue);
            }
        });
    });

    function filterContent(groupId, category) {
        // 1. 判斷當前是哪個內容區塊在使用這個篩選器
        // 映射關係：filter-ai -> section-ai
        const sectionId = groupId.replace('filter-', 'section-');
        const targetSection = document.getElementById(sectionId);
        
        if(!targetSection) return;

        // 2. 獲取該區塊內所有可篩選項目
        const items = targetSection.querySelectorAll('.filter-item');

        // 3. 執行篩選
        items.forEach(item => {
            const itemCategory = item.getAttribute('data-category');
            
            if (category === 'all') {
                item.style.display = ''; // 恢復預設 (grid/flex/block)
            } else {
                if (itemCategory === category) {
                    item.style.display = ''; // 顯示匹配項
                } else {
                    item.style.display = 'none'; // 隱藏不匹配項
                }
            }
        });
    }

    // --- 功能 3: 無障礙開關 ---
    const accessToggle = document.getElementById('accessibility-toggle');
    accessToggle.addEventListener('change', function() {
        if(this.checked) {
            document.documentElement.style.filter = "contrast(1.3) saturate(1.2)";
        } else {
            document.documentElement.style.filter = "none";
        }
    });
});