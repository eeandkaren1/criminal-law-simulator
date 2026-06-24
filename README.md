# 刑法鎮 LawTown 🏯⚖️

一款純前端、像素風格、可直接架在 GitHub + Render 上的法律教育闖關小遊戲。
玩家透過走進「刑法村」（刑法總則館、刑法分則館）與「刑事訴訟村」（檢察署、地方法院…）
觸發故事關卡來學習條文。**遊戲進度只存在玩家自己手機的 localStorage**，
不需要任何後端伺服器、資料庫或開發者額度。

---

## 一、技術說明

- 純 HTML + CSS + JavaScript，遊戲引擎使用 [Phaser 3](https://phaser.io/)（透過 CDN 載入，無需 npm build）
- 所有圖形（玩家、草地、道路、首頁插畫）皆用程式 / CSS 即時繪製，**沒有使用任何外部受版權保護的素材**
- 存檔：`localStorage`（`js/save.js`）
- 關卡與條文資料：`data/levels.js`（資料驅動，方便擴充）

```
lawtown/
├── index.html        ← 首頁 + 遊戲畫面 + 廣告版位
├── privacy.html       ← 隱私權政策頁
├── render.yaml         ← Render 靜態網站設定
├── css/style.css
├── js/
│   ├── game.js        ← Phaser場景、地圖、互動、答題彈窗
│   └── save.js         ← localStorage 存檔系統
└── data/levels.js      ← 所有關卡/條文資料（在此擴充全部條文）
```

---

## 二、部署到 GitHub + Render

### 1. 推上 GitHub

```bash
cd lawtown
git init
git add .
git commit -m "刑法鎮 LawTown 初版"
git branch -M main
git remote add origin https://github.com/你的帳號/lawtown.git
git push -u origin main
```

### 2. 連接 Render

1. 登入 [Render](https://render.com) → New → **Static Site**
2. 選擇剛剛 push 的 GitHub repo
3. Build Command 留空（純靜態檔案不需要 build）
4. Publish Directory 填 `.`（根目錄）
5. 部署完成後即可取得網址，例如 `https://lawtown.onrender.com`

> 因為已經附上 `render.yaml`，Render 也可以用「Infrastructure as Code / Blueprint」方式直接讀取設定自動建立。

---

## 三、設定 Google AdSense

1. 申請 Google AdSense 帳號並通過審核
2. 在 `index.html` `<head>` 內，取消註解並填入你的發布商 ID：
   ```html
   <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-你的ID" crossorigin="anonymous"></script>
   ```
3. 在兩處 `.ad-placeholder` 區塊內，取消註解 `<ins class="adsbygoogle">...` 並填入對應的 `data-ad-slot`
4. 廣告版位刻意放在「首頁區下方」與「遊戲區下方」，**不會疊加在 Phaser 遊戲畫面（`#game-container`）內**，避免違反 AdSense 政策中「廣告不可遮蔽內容」的規定

---

## 四、隱私權政策

`privacy.html` 已包含：
- 說明遊戲進度只存於玩家本機 localStorage
- 說明 Cookie 與 Google AdSense 第三方廣告追蹤
- 連結 Google 廣告設定 (adssettings.google.com) 與 aboutads.info 供使用者停用個人化廣告

請依實際公司資訊（地址、聯絡方式）補充完整，這是 Google AdSense 審核必備項目之一。

---

## 五、如何擴充「全部」刑法 / 刑事訴訟條文

目前 `data/levels.js` 內已示範各分類數則條文作為範例與架構驗證，
**尚未涵蓋全部條文**（刑法總則、分則 + 刑事訴訟法條文數量龐大，建議分批擴充並人工覆核）。

擴充方式：在對應陣列（`criminalGeneral` / `criminalSpecific` / `procedureStages` / `procedurePrinciples`）
中新增物件即可，格式如下：

```js
{
  id: "cg_999",                 // 不可重複
  law: "刑法第XX條",
  title: "關卡標題",
  npc: "NPC名稱",
  story: "故事情境（用條文包裝成案例）",
  question: "題目",
  options: ["選項A", "選項B", "選項C"],
  answer: 1,                     // 正確答案的index（從0算）
  explain: "答題後顯示的條文解說"
}
```

**重要提醒：** 請務必定期至「全國法規資料庫」(https://law.moj.gov.tw) 核對條文最新內容，
法條可能修正，AI 生成或範例內容不能保證為最新版本，正式上線前建議由具法律背景人員複核全部內容。

如果未來想新增「村莊」或「建築」，編輯 `data/levels.js` 最下方的 `BUILDINGS` 陣列即可，
`x`、`y` 是地圖格子座標，可自行調整佈局。

---

## 六、版權聲明

© 宸鑫頤意企業社 版權所有。本專案內容（不含 Phaser 引擎本身，其為獨立開源授權）僅供教育用途。
