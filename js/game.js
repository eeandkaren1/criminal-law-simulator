/**
 * 刑法鎮 - 主遊戲程式
 * 使用 Phaser 3（CDN載入），純前端、可直接部署在任何靜態網站（GitHub Pages / Render Static Site）
 */

const TILE = 32;
const MAP_W = 32;
const MAP_H = 18;

class TownScene extends Phaser.Scene {
  constructor() {
    super("TownScene");
  }

  preload() {
    // 全部用程式產生的像素圖形（不依賴外部圖片資源，部署最單純）
    this.makePixelTextures();
  }

  makePixelTextures() {
    // 玩家貼圖（簡單像素小人）
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0xffe0b2, 1); g.fillRect(8, 0, 16, 16);  // 頭
    g.fillStyle(0x2b6cb0, 1); g.fillRect(6, 16, 20, 14); // 身體
    g.fillStyle(0x333333, 1); g.fillRect(6, 30, 8, 2);   // 左腳
    g.fillStyle(0x333333, 1); g.fillRect(18, 30, 8, 2);  // 右腳
    g.generateTexture("player", 32, 32);
    g.destroy();

    // 草地磚
    const grass = this.make.graphics({ x: 0, y: 0, add: false });
    grass.fillStyle(0x7cb342, 1); grass.fillRect(0, 0, TILE, TILE);
    grass.fillStyle(0x689f38, 1);
    for (let i = 0; i < 6; i++) {
      grass.fillRect(Phaser.Math.Between(2, TILE - 4), Phaser.Math.Between(2, TILE - 4), 2, 2);
    }
    grass.generateTexture("grass", TILE, TILE);
    grass.destroy();

    // 路磚
    const road = this.make.graphics({ x: 0, y: 0, add: false });
    road.fillStyle(0xd7ccc8, 1); road.fillRect(0, 0, TILE, TILE);
    road.lineStyle(1, 0xbcaaa4, 1); road.strokeRect(0, 0, TILE, TILE);
    road.generateTexture("road", TILE, TILE);
    road.destroy();
  }

  create() {
    // 背景地圖（草地 + 中央道路）
    this.groundLayer = this.add.group();
    for (let x = 0; x < MAP_W; x++) {
      for (let y = 0; y < MAP_H; y++) {
        const isRoad = (y === 4 || y === 5);
        const tex = isRoad ? "road" : "grass";
        this.add.image(x * TILE, y * TILE, tex).setOrigin(0).setDepth(0);
      }
    }

    // 村莊分區標示文字
    this.add.text(2 * TILE, 0 * TILE, "🏯 刑法村", { fontSize: "20px", color: "#3e2723", fontStyle: "bold" }).setDepth(5);
    this.add.text(20 * TILE, 0 * TILE, "⚖️ 刑事訴訟村", { fontSize: "20px", color: "#263238", fontStyle: "bold" }).setDepth(5);

    // 建築物
    this.buildingSprites = [];
    BUILDINGS.forEach(b => {
      const px = b.x * TILE;
      const py = b.y * TILE;
      const rect = this.add.rectangle(px + TILE, py + TILE, TILE * 2.4, TILE * 2.4, Phaser.Display.Color.HexStringToColor(b.color).color)
        .setStrokeStyle(2, 0x000000).setDepth(2);
      const label = this.add.text(px, py + TILE * 2.5, b.name, { fontSize: "13px", color: "#000", backgroundColor: "#ffffffaa", padding: { x: 3, y: 1 } }).setDepth(2);
      rect.buildingData = b;
      this.buildingSprites.push(rect);

      if (b.levels) {
        const total = LEVELS[b.levels].length;
        const doneCount = LEVELS[b.levels].filter(l => SaveSystem.isCompleted(l.id)).length;
        this.add.text(px + TILE * 1.5, py - 6, `${doneCount}/${total}`, { fontSize: "12px", color: "#fff", backgroundColor: "#00000088", padding: { x: 3, y: 1 } }).setDepth(3);
      }
    });

    // 玩家
    const savedPos = SaveSystem.load().lastPos;
    const startX = savedPos ? savedPos.x : 14 * TILE;
    const startY = savedPos ? savedPos.y : 9 * TILE;
    this.player = this.physics.add.sprite(startX, startY, "player").setDepth(4);
    this.player.setCollideWorldBounds(true);
    this.physics.world.setBounds(0, 0, MAP_W * TILE, MAP_H * TILE);

    this.cameras.main.setBounds(0, 0, MAP_W * TILE, MAP_H * TILE);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    // 鍵盤控制
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys("W,A,S,D,E");

    // 互動提示
    this.promptText = this.add.text(0, 0, "", { fontSize: "14px", color: "#fff", backgroundColor: "#000000cc", padding: { x: 6, y: 4 } })
      .setDepth(10).setVisible(false);

    this.nearbyBuilding = null;

    // 觸控用簡易方向按鍵（手機適用）
    this.createTouchControls();
  }

  createTouchControls() {
    const baseX = 70, baseY = this.cameras.main.height - 70;
    const mkBtn = (dx, dy, label) => {
      const btn = this.add.text(dx, dy, label, {
        fontSize: "24px", color: "#fff", backgroundColor: "#00000066", padding: { x: 10, y: 6 }
      }).setScrollFactor(0).setDepth(20).setInteractive();
      return btn;
    };
    this.touchState = { up: false, down: false, left: false, right: false };
    const up = mkBtn(baseX, baseY - 50, "↑");
    const down = mkBtn(baseX, baseY + 10, "↓");
    const left = mkBtn(baseX - 50, baseY - 20, "←");
    const right = mkBtn(baseX + 50, baseY - 20, "→");
    const interact = this.add.text(this.cameras.main.width - 90, this.cameras.main.height - 60, "互動", {
      fontSize: "18px", color: "#fff", backgroundColor: "#2e7d32cc", padding: { x: 10, y: 8 }
    }).setScrollFactor(0).setDepth(20).setInteractive();

    [["up", up], ["down", down], ["left", left], ["right", right]].forEach(([key, btn]) => {
      btn.on("pointerdown", () => this.touchState[key] = true);
      btn.on("pointerup", () => this.touchState[key] = false);
      btn.on("pointerout", () => this.touchState[key] = false);
    });
    interact.on("pointerdown", () => this.tryInteract());

    [up, down, left, right, interact].forEach(b => b.setAlpha(0.7));
  }

  update() {
    const speed = 160;
    this.player.setVelocity(0);

    const left = this.cursors.left.isDown || this.wasd.A.isDown || this.touchState.left;
    const right = this.cursors.right.isDown || this.wasd.D.isDown || this.touchState.right;
    const up = this.cursors.up.isDown || this.wasd.W.isDown || this.touchState.up;
    const down = this.cursors.down.isDown || this.wasd.S.isDown || this.touchState.down;

    if (left) this.player.setVelocityX(-speed);
    else if (right) this.player.setVelocityX(speed);
    if (up) this.player.setVelocityY(-speed);
    else if (down) this.player.setVelocityY(speed);

    // 檢查是否靠近建築
    let closest = null, closestDist = 60;
    this.buildingSprites.forEach(rect => {
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, rect.x, rect.y);
      if (dist < closestDist) { closest = rect; closestDist = dist; }
    });

    if (closest) {
      this.nearbyBuilding = closest.buildingData;
      this.promptText.setText(`按 E 或點「互動」進入：${this.nearbyBuilding.name}`)
        .setPosition(this.player.x - 90, this.player.y - 60)
        .setVisible(true);
    } else {
      this.nearbyBuilding = null;
      this.promptText.setVisible(false);
    }

    if (Phaser.Input.Keyboard.JustDown(this.wasd.E)) {
      this.tryInteract();
    }

    // 每秒存一次玩家位置（輕量、不影響效能）
    if (!this._saveTimer || this.time.now - this._saveTimer > 1000) {
      this._saveTimer = this.time.now;
      SaveSystem.savePosition(this.player.x, this.player.y);
    }
  }

  tryInteract() {
    if (this.nearbyBuilding && this.nearbyBuilding.levels) {
      openLevelMenu(this.nearbyBuilding);
    }
  }
}

const config = {
  type: Phaser.AUTO,
  parent: "game-container",
  width: Math.min(window.innerWidth - 4, 900),
  height: 480,
  pixelArt: true,
  backgroundColor: "#7cb342",
  physics: { default: "arcade", arcade: { debug: false } },
  scene: [TownScene]
};

let game;
window.addEventListener("load", () => {
  game = new Phaser.Game(config);
});

// ----------- 關卡選單 / 答題彈窗 (純HTML覆蓋層，不影響Phaser畫面區域) -----------

function openLevelMenu(building) {
  const levels = LEVELS[building.levels];
  const menu = document.getElementById("level-menu");
  const list = document.getElementById("level-list");
  document.getElementById("level-menu-title").textContent = building.name;
  list.innerHTML = "";

  levels.forEach(lv => {
    const done = SaveSystem.isCompleted(lv.id);
    const item = document.createElement("button");
    item.className = "level-item" + (done ? " done" : "");
    item.innerHTML = `<span>${done ? "✅" : "📜"} ${lv.title}</span><small>${lv.law}</small>`;
    item.onclick = () => openQuiz(lv);
    list.appendChild(item);
  });

  menu.classList.remove("hidden");
}

function closeLevelMenu() {
  document.getElementById("level-menu").classList.add("hidden");
}

let currentLevel = null;

function openQuiz(level) {
  currentLevel = level;
  document.getElementById("level-menu").classList.add("hidden");
  const modal = document.getElementById("quiz-modal");
  document.getElementById("quiz-law").textContent = level.law;
  document.getElementById("quiz-title").textContent = level.title;
  document.getElementById("quiz-story").textContent = level.story;
  document.getElementById("quiz-question").textContent = level.question;
  document.getElementById("quiz-result").classList.add("hidden");
  document.getElementById("quiz-result").textContent = "";

  const optWrap = document.getElementById("quiz-options");
  optWrap.innerHTML = "";
  level.options.forEach((opt, idx) => {
    const btn = document.createElement("button");
    btn.className = "quiz-option";
    btn.textContent = opt;
    btn.onclick = () => answerQuiz(idx);
    optWrap.appendChild(btn);
  });

  modal.classList.remove("hidden");
}

function answerQuiz(idx) {
  const correct = idx === currentLevel.answer;
  const resultEl = document.getElementById("quiz-result");
  resultEl.classList.remove("hidden");
  resultEl.className = correct ? "correct" : "wrong";
  resultEl.textContent = (correct ? "✅ 答對了！" : "❌ 答錯了，沒關係，看看解說：") + "\n" + currentLevel.explain;

  document.querySelectorAll(".quiz-option").forEach(b => b.disabled = true);

  if (correct) {
    SaveSystem.markCompleted(currentLevel.id);
  }
}

function closeQuiz() {
  document.getElementById("quiz-modal").classList.add("hidden");
  // 重新整理場景使建築上方完成數字更新
  if (game && game.scene.keys["TownScene"]) {
    game.scene.keys["TownScene"].scene.restart();
  }
}

function resetSave() {
  if (confirm("確定要重設所有進度嗎？此動作無法復原（只會清除你自己裝置上的資料）。")) {
    SaveSystem.reset();
    location.reload();
  }
}
