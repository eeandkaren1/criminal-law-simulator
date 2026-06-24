/**
 * 刑法鎮 - 主遊戲程式（台灣風像素版）
 * 流程：BootScene（產生像素素材）→ TitleScene（鎮口立繪 + 選村莊，名字由HTML輸入）→ VillageScene（可走動的村莊地圖）
 */

const TILE = 32;

// ----------------------------------------------------------------
// 共用調色盤（台灣鄉村溫暖色調）
// ----------------------------------------------------------------
const PALETTE = {
  grassA: 0x8bc16a,
  grassB: 0x79ad59,
  flower: 0xffd1dc,
  pathA: 0xe3cf9d,
  pathB: 0xd1b97e,
  pathEdge: 0xb89a5e,
  trunk: 0x6b4423,
  leaf: 0x4f9d5d,
  leafDark: 0x3d7c47,
  water: 0x6fb6c9,
  roofRed: 0x9c3b3b,
  roofRedDark: 0x7a2a2a,
  roofBlue: 0x3c5a78,
  roofBlueDark: 0x2c4258,
  wallCream: 0xf3e3c3,
  wallGrey: 0xd8dde2,
  woodDark: 0x4a3424,
  lantern: 0xe0563f
};

class BootScene extends Phaser.Scene {
  constructor() { super("BootScene"); }

  create() {
    this.makeGrass();
    this.makePath();
    this.makeTree();
    this.makeBush();
    this.makeWater();
    this.makePlayer();
    this.makeBuilding("temple", PALETTE.roofRed, PALETTE.roofRedDark, PALETTE.wallCream);
    this.makeBuilding("court", PALETTE.roofBlue, PALETTE.roofBlueDark, PALETTE.wallGrey);
    this.makeBuilding("koban", 0x2f6fb0, 0x1f4f80, 0xffffff);
    this.makeGate();
    this.makeFence();

    this.scene.start("TitleScene");
  }

  g() { return this.make.graphics({ x: 0, y: 0, add: false }); }

  makeGrass() {
    for (let v = 0; v < 2; v++) {
      const g = this.g();
      g.fillStyle(v === 0 ? PALETTE.grassA : PALETTE.grassB, 1);
      g.fillRect(0, 0, TILE, TILE);
      g.fillStyle(0x000000, 0.04);
      for (let i = 0; i < 10; i++) g.fillRect(Phaser.Math.Between(0, TILE - 2), Phaser.Math.Between(0, TILE - 2), 2, 2);
      if (v === 1) {
        g.fillStyle(PALETTE.flower, 1);
        g.fillRect(8, 10, 2, 2);
        g.fillRect(20, 18, 2, 2);
        g.fillRect(14, 24, 2, 2);
      }
      g.generateTexture("grass" + v, TILE, TILE);
      g.destroy();
    }
  }

  makePath() {
    const g = this.g();
    g.fillStyle(PALETTE.pathA, 1);
    g.fillRect(0, 0, TILE, TILE);
    g.fillStyle(PALETTE.pathB, 1);
    for (let i = 0; i < 5; i++) g.fillRect(Phaser.Math.Between(2, TILE - 6), Phaser.Math.Between(2, TILE - 6), 4, 3);
    g.fillStyle(PALETTE.pathEdge, 0.5);
    g.fillRect(0, 0, TILE, 2);
    g.fillRect(0, TILE - 2, TILE, 2);
    g.generateTexture("path", TILE, TILE);
    g.destroy();
  }

  makeTree() {
    const g = this.g();
    g.fillStyle(PALETTE.trunk, 1); g.fillRect(13, 22, 6, 10);
    g.fillStyle(PALETTE.leafDark, 1); g.fillCircle(16, 14, 14);
    g.fillStyle(PALETTE.leaf, 1); g.fillCircle(13, 11, 11);
    g.fillStyle(0xffffff, 0.15); g.fillCircle(10, 8, 4);
    g.generateTexture("tree", 32, 32);
    g.destroy();
  }

  makeBush() {
    const g = this.g();
    g.fillStyle(PALETTE.leafDark, 1); g.fillCircle(16, 20, 11);
    g.fillStyle(PALETTE.leaf, 1); g.fillCircle(16, 17, 9);
    g.generateTexture("bush", 32, 32);
    g.destroy();
  }

  makeWater() {
    const g = this.g();
    g.fillStyle(PALETTE.water, 1); g.fillRect(0, 0, TILE, TILE);
    g.fillStyle(0xffffff, 0.25);
    g.fillRect(4, 6, 10, 2); g.fillRect(18, 18, 10, 2);
    g.generateTexture("water", TILE, TILE);
    g.destroy();
  }

  makePlayer() {
    const g = this.g();
    g.fillStyle(0x2b2b2b, 1); g.fillRect(9, 1, 14, 8);
    g.fillStyle(0xffd9b3, 1); g.fillRect(10, 7, 12, 9);
    g.fillStyle(0x2b2b2b, 1); g.fillRect(9, 7, 2, 4); g.fillRect(21, 7, 2, 4);
    g.fillStyle(0xf4f1ea, 1); g.fillRect(7, 16, 18, 11);
    g.fillStyle(0xb33f3f, 1); g.fillRect(7, 16, 18, 3);
    g.fillStyle(0x33547a, 1); g.fillRect(8, 27, 7, 5); g.fillRect(17, 27, 7, 5);
    g.fillStyle(0x222222, 1); g.fillRect(7, 31, 8, 2); g.fillRect(17, 31, 8, 2);
    g.generateTexture("player", 32, 33);
    g.destroy();
  }

  /**
   * 建築物素材：
   * - "temple"：台灣廟宇風格——紅磚牆、燕尾翹脊屋頂（兩端向上翹起的曲線屋脊）、金色脊飾、紅燈籠
   * - "court"：台灣常見的法院／官署建築風格——灰白牆面、紅磚牆基、對稱柱列、藍灰色四坡屋頂、三角形山頭
   * - "koban"：派出所，藍頂白牆小房子
   */
  makeBuilding(key, roof, roofDark, wall) {
    const w = 100, h = 100;
    const g = this.g();
    g.fillStyle(0x000000, 0.15); g.fillEllipse(w / 2, h - 6, w * 0.6, 10);

    if (key === "temple") {
      this.drawTaiwanTemple(g, w, h, roof, roofDark, wall);
    } else if (key === "court") {
      this.drawTaiwanCourt(g, w, h, roof, roofDark, wall);
    } else {
      this.drawKoban(g, w, h, roof, roofDark, wall);
    }

    g.generateTexture("b_" + key, w, h);
    g.destroy();
  }

  drawTaiwanTemple(g, w, h, roof, roofDark, wall) {
    // 紅磚牆身
    g.fillStyle(0xb24a36, 1); g.fillRect(10, 46, w - 20, h - 56);
    // 磚紋
    g.fillStyle(0x8f3a29, 0.5);
    for (let r = 0; r < 4; r++) g.fillRect(10, 50 + r * 9, w - 20, 1.5);
    // 朱紅廟門
    g.fillStyle(0x6e1f1f, 1); g.fillRect(w / 2 - 11, h - 34, 22, 24);
    g.fillStyle(0xe8c873, 1); g.fillRect(w / 2 - 11, h - 34, 22, 24);
    g.fillStyle(0x6e1f1f, 1);
    g.fillRect(w / 2 - 9, h - 32, 18, 20);
    g.fillStyle(0xe8c873, 1);
    g.fillCircle(w / 2 - 5, h - 24, 1.6); g.fillCircle(w / 2 + 5, h - 24, 1.6);
    // 窗（圓拱窗，廟宇常見）
    g.fillStyle(0xe8c873, 0.9);
    g.fillCircle(22, 60, 7); g.fillCircle(w - 22, 60, 7);
    g.lineStyle(2, 0x6e1f1f, 1);
    g.strokeCircle(22, 60, 7); g.strokeCircle(w - 22, 60, 7);
    // 屋頂底層（深色陰影脊）
    g.fillStyle(roofDark, 1);
    g.fillRect(6, 40, w - 12, 8);
    // 主屋頂（紅瓦斜頂）
    g.fillStyle(roof, 1);
    g.fillTriangle(w / 2, 6, 10, 42, w - 10, 42);
    // 燕尾翹脊：屋脊兩端向上翹起的弧形曲線（台灣廟宇/閣樓最具代表性的特徵）
    g.fillStyle(roofDark, 1);
    g.fillEllipse(14, 38, 18, 7);
    g.fillEllipse(w - 14, 38, 18, 7);
    g.fillStyle(0xe8c873, 1);
    g.fillTriangle(8, 40, 2, 24, 18, 38);
    g.fillTriangle(w - 8, 40, w - 2, 24, w - 18, 38);
    // 屋脊上的金色裝飾線
    g.fillStyle(0xe8c873, 1);
    g.fillRect(10, 38, w - 20, 3);
    // 紅燈籠
    g.fillStyle(PALETTE.lantern, 1);
    g.fillRoundedRect(w / 2 - 5, 44, 10, 14, 3);
    g.fillStyle(0xffe9a8, 1); g.fillRect(w / 2 - 1, 56, 2, 4);
  }

  drawTaiwanCourt(g, w, h, roof, roofDark, wall) {
    // 灰白牆身（仿西式官署建築）
    g.fillStyle(wall, 1); g.fillRect(8, 40, w - 16, h - 50);
    // 紅磚牆基
    g.fillStyle(0xa85c43, 1); g.fillRect(8, h - 22, w - 16, 12);
    // 對稱柱列
    g.fillStyle(0xf6f6f2, 1);
    for (let i = 0; i < 4; i++) g.fillRect(16 + i * 22, 46, 6, h - 60);
    // 大門
    g.fillStyle(PALETTE.woodDark, 1); g.fillRect(w / 2 - 10, h - 32, 20, 22);
    g.fillStyle(0xffe9a8, 0.5); g.fillRect(w / 2 - 7, h - 28, 14, 12);
    // 窗
    g.fillStyle(0xdcebf5, 0.9); g.fillRect(14, 50, 10, 12); g.fillRect(w - 24, 50, 10, 12);
    g.lineStyle(2, 0x6b6b6b, 1); g.strokeRect(14, 50, 10, 12); g.strokeRect(w - 24, 50, 10, 12);
    // 三角山頭（西式官署常見的pediment）
    g.fillStyle(roofDark, 1);
    g.fillTriangle(w / 2, 6, 6, 44, w - 6, 44);
    g.fillStyle(roof, 1);
    g.fillTriangle(w / 2, 10, 12, 40, w - 12, 40);
    g.fillStyle(0xffffff, 0.15);
    g.fillTriangle(w / 2, 10, w / 2 - 16, 36, w / 2 + 4, 36);
    // 國徽風小圓飾（象徵公署）
    g.fillStyle(0xe8c873, 1);
    g.fillCircle(w / 2, 24, 5);
  }

  drawKoban(g, w, h, roof, roofDark, wall) {
    g.fillStyle(wall, 1); g.fillRect(16, 50, w - 32, h - 60);
    g.fillStyle(PALETTE.woodDark, 1); g.fillRect(w / 2 - 8, h - 30, 16, 20);
    g.fillStyle(0xdcebf5, 0.9); g.fillRect(22, 56, 10, 10); g.fillRect(w - 32, 56, 10, 10);
    g.fillStyle(roofDark, 1);
    g.fillRect(12, 42, w - 24, 8);
    g.fillStyle(roof, 1);
    g.fillTriangle(w / 2, 16, 14, 46, w - 14, 46);
    g.fillStyle(0xffffff, 1);
    g.fillRect(w / 2 - 16, 18, 32, 8);
  }

  /**
   * 台灣廟宇牌樓（廟口入口意象）：紅柱、金頂、中央匾額，常見於廟口、村莊入口
   */
  makeGate() {
    const g = this.g();
    const w = 80, h = 60;
    // 兩側紅柱
    g.fillStyle(0xb33f3f, 1);
    g.fillRect(8, 14, 10, 44);
    g.fillRect(w - 18, 14, 10, 44);
    // 柱頂金飾
    g.fillStyle(0xe8c873, 1);
    g.fillRect(6, 10, 14, 5); g.fillRect(w - 20, 10, 14, 5);
    // 橫樑
    g.fillStyle(0x7a2a2a, 1);
    g.fillRect(2, 20, w - 4, 7);
    // 中央牌匾（金底紅字概念）
    g.fillStyle(0xe8c873, 1);
    g.fillRoundedRect(w / 2 - 16, 2, 32, 14, 3);
    g.fillStyle(0xb33f3f, 1);
    g.fillRect(w / 2 - 12, 6, 24, 6);
    // 頂端燕尾翹脊裝飾
    g.fillStyle(0x7a2a2a, 1);
    g.fillTriangle(4, 20, 0, 8, 16, 16);
    g.fillTriangle(w - 4, 20, w, 8, w - 16, 16);
    g.generateTexture("gate", w, h);
    g.destroy();
  }

  makeFence() {
    const g = this.g();
    g.fillStyle(PALETTE.woodDark, 1);
    g.fillRect(0, 10, 32, 4);
    g.fillRect(2, 0, 4, 32);
    g.fillRect(26, 0, 4, 32);
    g.generateTexture("fence", 32, 32);
    g.destroy();
  }
}

// ----------------------------------------------------------------
// 標題畫面：鎮口立繪，左刑法村／右刑事訴訟村。名字輸入交給HTML覆蓋層處理
// ----------------------------------------------------------------
class TitleScene extends Phaser.Scene {
  constructor() { super("TitleScene"); }

  create() {
    const w = this.cameras.main.width, h = this.cameras.main.height;

    const left = this.add.graphics();
    left.fillGradientStyle(0xffd9b3, 0xffd9b3, 0xf2a65a, 0xf2a65a, 1);
    left.fillRect(0, 0, w / 2, h);

    const right = this.add.graphics();
    right.fillGradientStyle(0xcfd9e8, 0xcfd9e8, 0x8fa3bf, 0x8fa3bf, 1);
    right.fillRect(w / 2, 0, w / 2, h);

    this.add.image(w / 2, h - 90, "path").setDisplaySize(120, 90).setAlpha(0.9);
    for (let i = 0; i < 6; i++) {
      this.add.image(w / 2 - 60 + i * 24, h - 50, "grass0").setDisplaySize(28, 28);
    }

    this.add.image(w * 0.22, h - 130, "b_temple").setScale(1.1);
    this.add.image(w * 0.22, h - 195, "gate").setScale(1.1);
    this.add.text(w * 0.22, 50, "刑法村", { fontSize: "26px", color: "#7a2a2a", fontStyle: "bold" }).setOrigin(0.5);
    this.add.text(w * 0.22, 80, "刑法總則 / 刑法分則", { fontSize: "13px", color: "#7a2a2a" }).setOrigin(0.5);

    this.add.image(w * 0.78, h - 130, "b_court").setScale(1.1);
    this.add.text(w * 0.78, 50, "刑事訴訟村", { fontSize: "26px", color: "#2c3e50", fontStyle: "bold" }).setOrigin(0.5);
    this.add.text(w * 0.78, 80, "偵查 / 起訴 / 審判 / 執行", { fontSize: "13px", color: "#2c3e50" }).setOrigin(0.5);

    this.add.text(w / 2, 20, "🏯 刑法鎮 LawTown", { fontSize: "20px", color: "#3e2723", fontStyle: "bold" })
      .setOrigin(0.5, 0).setShadow(1, 1, "#fff", 1, true, true);

    this.add.image(w * 0.1, h * 0.3, "bush").setScale(0.8);
    this.add.image(w * 0.9, h * 0.3, "bush").setScale(0.8);

    showTitleOverlay();
  }
}

// ----------------------------------------------------------------
// 村莊場景：可走動、互動建築觸發關卡
// ----------------------------------------------------------------
class VillageScene extends Phaser.Scene {
  constructor() { super("VillageScene"); }

  init(data) {
    this.villageKey = data.villageKey;
    this.village = VILLAGES[this.villageKey];
  }

  create() {
    const cols = this.village.mapCols, rows = this.village.mapRows;
    const mapW = cols * TILE, mapH = rows * TILE;

    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        const isRoad = (y === Math.floor(rows / 2)) || (x === Math.floor(cols / 2));
        const tex = isRoad ? "path" : (((x + y) % 5 === 0) ? "grass1" : "grass0");
        this.add.image(x * TILE, y * TILE, tex).setOrigin(0).setDepth(0);
      }
    }

    for (let x = 0; x < cols; x++) {
      this.add.image(x * TILE + TILE / 2, TILE / 2 - 6, "tree").setDepth(1).setScale(0.8);
      this.add.image(x * TILE + TILE / 2, mapH - TILE / 2 + 6, "tree").setDepth(1).setScale(0.8);
    }
    for (let y = 1; y < rows - 1; y++) {
      if (y % 2 === 0) {
        this.add.image(TILE / 2 - 4, y * TILE + TILE / 2, "bush").setDepth(1).setScale(0.7);
        this.add.image(mapW - TILE / 2 + 4, y * TILE + TILE / 2, "bush").setDepth(1).setScale(0.7);
      }
    }

    const gateX = Math.floor(cols / 2) * TILE + TILE / 2;
    this.add.image(gateX, TILE * 0.6, "gate").setDepth(2).setScale(1.1);
    this.exitZone = { x: gateX, y: TILE, radius: 50 };
    this.add.text(gateX, TILE * 1.6, "⬆ 返回鎮口", { fontSize: "11px", color: "#fff", backgroundColor: "#00000088", padding: { x: 4, y: 2 } })
      .setOrigin(0.5).setDepth(3);

    this.add.text(mapW / 2, 6, this.village.name, { fontSize: "16px", color: "#fff", backgroundColor: "#00000066", padding: { x: 8, y: 3 } })
      .setOrigin(0.5, 0).setDepth(6);

    this.buildingSprites = [];
    this.village.buildings.forEach(b => {
      const px = b.x * TILE;
      const py = b.y * TILE;
      const tex = "b_" + b.building;
      const img = this.add.image(px, py, tex).setDepth(2).setScale(1.05);
      img.buildingData = b;
      this.buildingSprites.push(img);

      const labelY = py + img.displayHeight / 2 - 6;
      this.add.text(px, labelY, b.name, { fontSize: "12px", color: "#000", backgroundColor: "#ffffffcc", padding: { x: 4, y: 1 } })
        .setOrigin(0.5, 0).setDepth(3);

      if (b.levels) {
        const total = LEVELS[b.levels].length;
        const doneCount = LEVELS[b.levels].filter(l => SaveSystem.isCompleted(l.id)).length;
        this.add.text(px + img.displayWidth / 2 - 4, py - img.displayHeight / 2 + 4, `${doneCount}/${total}`, {
          fontSize: "11px", color: "#fff", backgroundColor: "#2e7d32cc", padding: { x: 4, y: 1 }
        }).setOrigin(1, 0).setDepth(3);
      }
    });

    const saved = SaveSystem.getPosition(this.villageKey);
    const startX = saved ? saved.x : gateX;
    const startY = saved ? saved.y : TILE * 2.5;
    this.player = this.physics.add.sprite(startX, startY, "player").setDepth(4);
    this.player.body.setSize(20, 14).setOffset(6, 18);
    this.player.setCollideWorldBounds(true);
    this.physics.world.setBounds(0, 0, mapW, mapH);

    this.cameras.main.setBounds(0, 0, mapW, mapH);
    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys("W,A,S,D,E");

    this.promptText = this.add.text(0, 0, "", { fontSize: "13px", color: "#fff", backgroundColor: "#000000cc", padding: { x: 6, y: 4 } })
      .setDepth(10).setVisible(false);

    this.nearbyBuilding = null;
    this.nearExit = false;

    this.createTouchControls();
    this.createTownSwitchButton();
  }

  createTownSwitchButton() {
    const btn = this.add.text(10, 10, "🏯 鎮口", {
      fontSize: "14px", color: "#fff", backgroundColor: "#5d4037cc", padding: { x: 8, y: 5 }
    }).setScrollFactor(0).setDepth(20).setInteractive();
    btn.on("pointerdown", () => goToTitle());
  }

  createTouchControls() {
    const baseX = 70, baseY = this.cameras.main.height - 70;
    const mkBtn = (dx, dy, label) => this.add.text(dx, dy, label, {
      fontSize: "24px", color: "#fff", backgroundColor: "#00000066", padding: { x: 10, y: 6 }
    }).setScrollFactor(0).setDepth(20).setInteractive().setAlpha(0.75);

    this.touchState = { up: false, down: false, left: false, right: false };
    const up = mkBtn(baseX, baseY - 50, "↑");
    const down = mkBtn(baseX, baseY + 10, "↓");
    const left = mkBtn(baseX - 50, baseY - 20, "←");
    const right = mkBtn(baseX + 50, baseY - 20, "→");
    const interact = this.add.text(this.cameras.main.width - 90, this.cameras.main.height - 60, "互動", {
      fontSize: "16px", color: "#fff", backgroundColor: "#2e7d32cc", padding: { x: 10, y: 8 }
    }).setScrollFactor(0).setDepth(20).setInteractive();

    [["up", up], ["down", down], ["left", left], ["right", right]].forEach(([key, btn]) => {
      btn.on("pointerdown", () => this.touchState[key] = true);
      btn.on("pointerup", () => this.touchState[key] = false);
      btn.on("pointerout", () => this.touchState[key] = false);
    });
    interact.on("pointerdown", () => this.tryInteract());
  }

  update(time) {
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

    let closest = null, closestDist = 65;
    this.buildingSprites.forEach(img => {
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, img.x, img.y + 10);
      if (dist < closestDist) { closest = img; closestDist = dist; }
    });

    const distToExit = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.exitZone.x, this.exitZone.y);
    this.nearExit = distToExit < this.exitZone.radius;

    if (closest && closest.buildingData.type === "quiz") {
      this.nearbyBuilding = closest.buildingData;
      this.promptText.setText(`按 E 或點「互動」進入：${this.nearbyBuilding.name}`)
        .setPosition(this.player.x - 90, this.player.y - 70).setVisible(true);
    } else if (this.nearExit) {
      this.nearbyBuilding = null;
      this.promptText.setText("按 E 或點「互動」返回鎮口")
        .setPosition(this.player.x - 80, this.player.y - 70).setVisible(true);
    } else {
      this.nearbyBuilding = null;
      this.promptText.setVisible(false);
    }

    if (Phaser.Input.Keyboard.JustDown(this.wasd.E)) {
      this.tryInteract();
    }

    if (!this._saveTimer || time - this._saveTimer > 800) {
      this._saveTimer = time;
      SaveSystem.savePosition(this.villageKey, this.player.x, this.player.y);
    }
  }

  tryInteract() {
    if (this.nearbyBuilding && this.nearbyBuilding.levels) {
      openLevelMenu(this.nearbyBuilding);
    } else if (this.nearExit) {
      goToTitle();
    }
  }
}

// ----------------------------------------------------------------
// Phaser 啟動設定
// ----------------------------------------------------------------
const config = {
  type: Phaser.AUTO,
  parent: "game-container",
  width: Math.min(window.innerWidth - 4, 900),
  height: 480,
  pixelArt: true,
  backgroundColor: "#8bc16a",
  physics: { default: "arcade", arcade: { debug: false } },
  scene: [BootScene, TitleScene, VillageScene]
};

let game;
window.addEventListener("load", () => {
  game = new Phaser.Game(config);
});

// ----------------------------------------------------------------
// HTML覆蓋層：標題畫面的姓名輸入 + 選村莊
// ----------------------------------------------------------------
function showTitleOverlay() {
  const overlay = document.getElementById("title-overlay");
  if (!overlay) return;
  const savedName = SaveSystem.getName();
  document.getElementById("player-name-input").value = savedName || "";
  overlay.classList.remove("hidden");
}

function hideTitleOverlay() {
  document.getElementById("title-overlay").classList.add("hidden");
}

function enterVillage(villageKey) {
  const nameInput = document.getElementById("player-name-input");
  const name = (nameInput.value || "").trim() || "無名旅人";
  SaveSystem.setName(name);
  hideTitleOverlay();

  if (game.scene.isActive("VillageScene")) {
    game.scene.stop("VillageScene");
  }
  game.scene.stop("TitleScene");
  game.scene.start("VillageScene", { villageKey });
}

function goToTitle() {
  if (game.scene.isActive("VillageScene")) {
    game.scene.stop("VillageScene");
  }
  game.scene.start("TitleScene");
}

// ----------------------------------------------------------------
// 關卡選單 / 答題彈窗（HTML覆蓋層，不影響Phaser畫面）
// ----------------------------------------------------------------
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
  if (game && game.scene.isActive("VillageScene")) {
    const scene = game.scene.getScene("VillageScene");
    scene.scene.restart({ villageKey: scene.villageKey });
  }
}

function resetSave() {
  if (confirm("確定要重設所有進度嗎？此動作無法復原（只會清除你自己裝置上的資料）。")) {
    SaveSystem.reset();
    location.reload();
  }
}
