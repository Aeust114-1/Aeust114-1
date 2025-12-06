// 1. 城市資料庫：把我們想標記的城市，和它的經緯度 (lat/lng) 紀錄下來
const CITIES = [
  { name: "台北", lat: 25.0330, lng: 121.5654 },
  { name: "東京", lat: 35.6762, lng: 139.6503 },
  { name: "紐約", lat: 40.7128, lng: -74.0060 },
  { name: "倫敦", lat: 51.5074, lng: -0.1278 },
  { name: "雪梨", lat: -33.8688, lng: 151.2093 },
  { name: "巴黎", lat: 48.8566, lng: 2.3522 },
  { name: "莫斯科", lat: 55.7558, lng: 37.6173 },
  { name: "南極點", lat: -90.0000, lng: 0.0000 },
  { name: "新加坡", lat: 1.3521, lng: 103.8198 },
  { name: "開普敦", lat: -33.9249, lng: 18.4241 }
];

// 預先抓好網頁上的元件 (就像記住按鈕、卡片在哪裡，方便之後操作)
const ui = {
  card: document.getElementById('weather-card'),
  closeBtn: document.getElementById('close-btn'),
  name: document.getElementById('city-name'),
  temp: document.getElementById('temperature'),
  desc: document.getElementById('weather-desc'),
  icon: document.getElementById('weather-icon'),
  wind: document.getElementById('windspeed'),
  coords: document.getElementById('coords')
};

// 2. 天氣代碼轉換：這是去查 Open-Meteo 說明書後，寫下的翻譯機
// (因為天氣資料傳回來是數字，這段程式負責把它翻譯成中文和圖示)
function getWeatherStatus(code) {
  if (code === 0) return { desc: "晴朗無雲", icon: "☀️" };
  if (code >= 1 && code <= 3) return { desc: "多雲/陰天", icon: "☁️" };
  if (code >= 45 && code <= 48) return { desc: "有霧", icon: "🌫️" };
  if (code >= 51 && code <= 55) return { desc: "毛毛雨", icon: "🌧️" };
  if (code >= 61 && code <= 65) return { desc: "下雨", icon: "☔" };
  if (code >= 71 && code <= 77) return { desc: "降雪", icon: "❄️" };
  if (code >= 80 && code <= 82) return { desc: "陣雨", icon: "🌦️" };
  if (code >= 95 && code <= 99) return { desc: "雷雨", icon: "⛈️" };
  return { desc: "未知天氣", icon: "❓" };
}

// 3. 初始化地球：用 Globe.gl 工具開始畫出地球
const world = Globe()
  (document.getElementById('globeViz'))
  .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg') // 設定地球表面的圖片
  .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png') // 設定地球表面的凹凸（山脈）
  .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png') // 設定背景是星空
  
  // --- 紅色圓點圖層（點標記）---
  .pointsData(CITIES) // 放入城市資料
  .pointAltitude(0.01) // 讓點浮起來一點點，避免被地形蓋住
  .pointColor(() => '#ff3333') // 設定點的顏色為紅色
  .pointRadius(0.8) // 設定點的大小
  .pointResolution(24) // 點的圓滑度
  .onPointClick(handleCityClick) // 當點擊紅點時，執行 handleCityClick 函式

  // --- HTML 標籤圖層（中文名稱）---
  // 這裡我們用網頁標籤取代 3D 文字，確保中文不會變問號
  .htmlElementsData(CITIES)
  .htmlLat(d => d.lat) // 告訴程式經緯度 (latitude)
  .htmlLng(d => d.lng) // 告訴程式經緯度 (longitude)
  .htmlElement(d => {
    // 為每個城市建立一個網頁標籤（<div>）
    const el = document.createElement('div');
    el.innerText = d.name; // 標籤內容就是城市名稱
    
    // 設定樣式讓它看起來像標籤
    el.style.color = '#ffcc00'; // 黃色文字
    el.style.fontSize = '14px';
    el.style.fontWeight = 'bold';
    el.style.fontFamily = 'sans-serif'; // 使用瀏覽器標準字體
    el.style.textShadow = '0px 0px 4px rgba(0,0,0,0.8)'; // 文字陰影讓它在太空中看得清楚
    el.style.cursor = 'pointer'; // 讓滑鼠移過去變成手
    el.style.pointerEvents = 'auto'; // 確保可以點擊
    el.style.transform = 'translate(-50%, -150%)'; // 讓文字稍微移到紅點上方
    
    // 綁定點擊事件，點擊文字時也執行 handleCityClick 函式
    el.onclick = () => handleCityClick(d);
    
    return el;
  });

// 自動旋轉設定：讓地球自己慢慢轉動
const controls = world.controls();
controls.autoRotate = true;
controls.autoRotateSpeed = 0.8;

// 4. 處理點擊事件：當紅點或城市名稱被點擊時，要做什麼事
function handleCityClick(city) {
  controls.autoRotate = false; // 點擊後，先讓地球停止轉動

  // 讓鏡頭在 1.2 秒內，平順地移動到你點擊的那個城市上方
  world.pointOfView({ 
    lat: city.lat, 
    lng: city.lng, 
    altitude: 1.8 // 鏡頭的高度 (數字越小越靠近)
  }, 1200);

  // 讓天氣卡片顯示出來
  ui.card.classList.remove('hidden'); 
  // 同時，先顯示「讀取中」的訊息
  ui.name.innerText = city.name;
  ui.temp.innerText = "--";
  ui.desc.innerText = "資料讀取中...";
  ui.icon.innerText = "⏳";
  ui.wind.innerText = "--";
  ui.coords.innerText = `${city.lat.toFixed(1)}, ${city.lng.toFixed(1)}`;

  // 開始去查天氣資料
  fetchWeatherData(city);
}

// 5. 抓取天氣資料：向遠方的 Open-Meteo 服務中心請求資料
async function fetchWeatherData(city) {
  try {
    // 組合出請求資料的網址，帶上城市的經緯度
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lng}&current_weather=true&timezone=auto`;
//         👆 修正：這裡加上了 /v1/
    
    // 這裡就是發出信號，請遠方的天氣資料中心把即時資料傳過來
    const res = await fetch(url);
    
    // 如果連線狀態不是 200 OK (例如 404 或 500)，代表連線本身有問題
    if (!res.ok) {
        // 嘗試讀取錯誤細節，並拋出錯誤
        const errorDetails = await res.text();
        throw new Error(`網路錯誤: 狀態碼 ${res.status}`);
    }
    
    const data = await res.json(); // 等待資料傳完後，把它變成電腦能讀懂的格式

    // 如果 API 內部回傳錯誤 (例如找不到數據)
    if (data.error === true) {
        throw new Error(`API 錯誤原因: ${data.reason}`);
    }
    
    if (!data.current_weather) throw new Error("API 未傳回天氣數據，可能是極端位置。");

    const weather = data.current_weather;
    // 呼叫我們的翻譯機，把天氣代碼變成中文和圖示
    const status = getWeatherStatus(weather.weathercode);

    // 成功！更新卡片上的訊息
    ui.temp.innerText = weather.temperature;
    ui.wind.innerText = `${weather.windspeed} km/h`;
    ui.desc.innerText = status.desc;
    ui.icon.innerText = status.icon;

  } catch (err) {
    // 失敗時，顯示詳細的錯誤訊息
    console.error("天氣資料獲取失敗:", err.message);
    ui.desc.innerText = `失敗！請檢查網路。`;
    ui.icon.innerText = "❌";
    // 在溫度框裡顯示錯誤的詳細原因
    ui.temp.innerText = `錯誤: ${err.message || '連線完全失敗'}`; 
  }
}

// 6. 關閉按鈕功能
ui.closeBtn.onclick = () => {
  ui.card.classList.add('hidden'); // 隱藏卡片
  controls.autoRotate = true; // 恢復地球旋轉
  world.pointOfView({ altitude: 2.5 }, 1500); // 鏡頭拉遠看全貌
};

// 確保如果網頁視窗大小改變了，地球的大小也會跟著調整
window.onresize = () => {
  world.width(window.innerWidth);
  world.height(window.innerHeight);
};