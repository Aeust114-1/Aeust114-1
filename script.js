// 簡單的發佈按鈕啟用
        const textarea = document.querySelector('.new-post textarea');
        const btn = document.querySelector('.new-post button');
        textarea.addEventListener('input', () => {
            btn.disabled = textarea.value.trim() === '';
            btn.style.opacity = textarea.value.trim() ? '1' : '0.5';
        });

        // 點讚效果
        document.querySelectorAll('.fa-heart').forEach(icon => {
            icon.addEventListener('click', () => {
                icon.classList.toggle('liked');
                icon.classList.toggle('far');
                icon.classList.toggle('fas');
            });
        });