/**
 * 刑法鎮 - 主遊戲程式（增強視覺版）
 * 改版重點：
 *  - 豐富的雙色彩天空（刑法村暖黃昏 / 刑訴村清晨藍）
 *  - 多層景深：遠山 → 雲朵 → 建築 → 玩家 → 地面裝飾
 *  - 法律主題裝飾物：石碑、路燈、指示牌、天秤廣場
 *  - 更多建築類型：圖書館、罪責廣場、偵查局、鐘樓
 *  - 中央法治廣場（天秤雕像）
 *  - 漂浮雲朵動畫、飛鳥
 *  - 標題畫面改為完整村景 + 進入按鈕（不擋住背景）
 */
 
const TILE = 32;
 
// ----------------------------------------------------------------
// 調色盤 - 增加兩個村莊專屬色系
// ----------------------------------------------------------------
const PALETTE = {
  // 共用
  grassA: 0x8bc16a, grassB: 0x79ad59, flower: 0xffd1dc,
  pathA: 0xe3cf9d, pathB: 0xd1b97e, pathEdge: 0xb89a5e,
  trunk: 0x6b4423, leaf: 0x4f9d5d, leafDark: 0x3d7c47,
  water: 0x6fb6c9, roofRed: 0x9c3b3b, roofRedDark: 0x7a2a2a,
  roofBlue: 0x3c5a78, roofBlueDark: 0x2c4258,
  wallCream: 0xf3e3c3, wallGrey: 0xd8dde2,
  woodDark: 0x4a3424, lantern: 0xe0563f,
  // 刑法村（暖色）
  crimSkyTop: 0xf9a825, crimSkyBot: 0xfff3e0,
  crimMountain: 0x8d6e63, crimMountain2: 0xa1887f,
  // 刑訴村（冷色）
  procSkyTop: 0x1a3a5c, procSkyBot: 0x90caf9,
  procMountain: 0x546e7a, procMountain2: 0x78909c,
  // 廣場
  plazaStone: 0xd7ccc8, plazaEdge: 0xa1887f,
  gold: 0xe8c873, stone: 0x90a4ae
};
 
// ----------------------------------------------------------------
// BootScene：生成所有紋理
// ----------------------------------------------------------------
class BootScene extends Phaser.Scene {
  constructor() { super("BootScene"); }
 
  create() {
    this.makeGrass();
    this.makePath();
    this.makeStonePath();
    this.makeTree();
    this.makeBush();
    this.makeFlowerBush();
    this.makeWater();
    this.makePlayer();
    this.makeBuilding("temple", PALETTE.roofRed, PALETTE.roofRedDark, PALETTE.wallCream);
    this.makeBuilding("court", PALETTE.roofBlue, PALETTE.roofBlueDark, PALETTE.wallGrey);
    this.makeBuilding("koban", 0x2f6fb0, 0x1f4f80, 0xffffff);
    this.makeLibrary();
    this.makeDetectiveBureau();
    this.makeClockTower();
    this.makeScalePlaza();
    this.makeStele();    // 法典石碑
    this.makeLampPost(); // 路燈
    this.makeSignPost(); // 指示牌
    this.makeGate();
    this.makeFence();
    this.makeCloud();
    this.makeBird();
    this.makeMountain("mtn_warm", PALETTE.crimMountain, PALETTE.crimMountain2);
    this.makeMountain("mtn_cool", PALETTE.procMountain, PALETTE.procMountain2);
 
    this.scene.start("TitleScene");
  }
 
  g() { return this.make.graphics({ x: 0, y: 0, add: false }); }
 
  makeGrass() {
    for (let v = 0; v < 3; v++) {
      const g = this.g();
      const cols = [PALETTE.grassA, PALETTE.grassB, 0x6aac4f];
      g.fillStyle(cols[v], 1); g.fillRect(0, 0, TILE, TILE);
      g.fillStyle(0x000000, 0.04);
      for (let i = 0; i < 10; i++) g.fillRect(Phaser.Math.Between(0, TILE-2), Phaser.Math.Between(0, TILE-2), 2, 2);
      if (v === 1) {
        g.fillStyle(PALETTE.flower, 1); g.fillRect(8,10,2,2); g.fillRect(20,18,2,2); g.fillRect(14,24,2,2);
      }
      if (v === 2) {
        g.fillStyle(0xffeb3b, 0.8); g.fillRect(6,8,2,2); g.fillRect(22,20,2,2);
        g.fillStyle(0xff80ab, 0.8); g.fillRect(16,14,2,2); g.fillRect(8,24,2,2);
      }
      g.generateTexture("grass"+v, TILE, TILE); g.destroy();
    }
  }
 
  makePath() {
    const g = this.g();
    g.fillStyle(PALETTE.pathA, 1); g.fillRect(0, 0, TILE, TILE);
    g.fillStyle(PALETTE.pathB, 1);
    for (let i = 0; i < 5; i++) g.fillRect(Phaser.Math.Between(2, TILE-6), Phaser.Math.Between(2, TILE-6), 4, 3);
    g.fillStyle(PALETTE.pathEdge, 0.5);
    g.fillRect(0, 0, TILE, 2); g.fillRect(0, TILE-2, TILE, 2);
    g.generateTexture("path", TILE, TILE); g.destroy();
  }
 
  makeStonePath() {
    const g = this.g();
    g.fillStyle(PALETTE.plazaStone, 1); g.fillRect(0, 0, TILE, TILE);
    g.lineStyle(1, PALETTE.plazaEdge, 0.6);
    g.strokeRect(2, 2, TILE-4, TILE-4);
    g.fillStyle(0xffffff, 0.1); g.fillRect(2, 2, TILE-4, 4);
    g.generateTexture("stonepath", TILE, TILE); g.destroy();
  }
 
  makeTree() {
    const g = this.g();
    g.fillStyle(PALETTE.trunk, 1); g.fillRect(13, 22, 6, 10);
    g.fillStyle(PALETTE.leafDark, 1); g.fillCircle(16, 14, 14);
    g.fillStyle(PALETTE.leaf, 1); g.fillCircle(13, 11, 11);
    g.fillStyle(0xffffff, 0.15); g.fillCircle(10, 8, 4);
    g.generateTexture("tree", 32, 32); g.destroy();
  }
 
  makeBush() {
    const g = this.g();
    g.fillStyle(PALETTE.leafDark, 1); g.fillCircle(16, 20, 11);
    g.fillStyle(PALETTE.leaf, 1); g.fillCircle(16, 17, 9);
    g.generateTexture("bush", 32, 32); g.destroy();
  }
 
  makeFlowerBush() {
    const g = this.g();
    g.fillStyle(PALETTE.leafDark, 1); g.fillCircle(16, 20, 11);
    g.fillStyle(PALETTE.leaf, 1); g.fillCircle(16, 17, 9);
    g.fillStyle(0xffb6c1, 1); g.fillCircle(12, 12, 4); g.fillCircle(20, 10, 3); g.fillCircle(16, 8, 3);
    g.generateTexture("flowerbush", 32, 32); g.destroy();
  }
 
  makeWater() {
    const g = this.g();
    g.fillStyle(PALETTE.water, 1); g.fillRect(0, 0, TILE, TILE);
    g.fillStyle(0xffffff, 0.25); g.fillRect(4,6,10,2); g.fillRect(18,18,10,2);
    g.generateTexture("water", TILE, TILE); g.destroy();
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
    g.generateTexture("player", 32, 33); g.destroy();
  }
 
  makeBuilding(key, roof, roofDark, wall) {
    const w = 100, h = 100;
    const g = this.g();
    g.fillStyle(0x000000, 0.15); g.fillEllipse(w/2, h-6, w*0.6, 10);
    if (key === "temple") this.drawTaiwanTemple(g, w, h, roof, roofDark, wall);
    else if (key === "court") this.drawTaiwanCourt(g, w, h, roof, roofDark, wall);
    else this.drawKoban(g, w, h, roof, roofDark, wall);
    g.generateTexture("b_"+key, w, h); g.destroy();
  }
 
  drawTaiwanTemple(g, w, h, roof, roofDark, wall) {
    g.fillStyle(0xb24a36, 1); g.fillRect(10, 46, w-20, h-56);
    g.fillStyle(0x8f3a29, 0.5);
    for (let r = 0; r < 4; r++) g.fillRect(10, 50+r*9, w-20, 1.5);
    g.fillStyle(0x6e1f1f, 1); g.fillRect(w/2-11, h-34, 22, 24);
    g.fillStyle(0xe8c873, 1); g.fillRect(w/2-11, h-34, 22, 24);
    g.fillStyle(0x6e1f1f, 1); g.fillRect(w/2-9, h-32, 18, 20);
    g.fillStyle(0xe8c873, 1); g.fillCircle(w/2-5, h-24, 1.6); g.fillCircle(w/2+5, h-24, 1.6);
    g.fillStyle(0xe8c873, 0.9); g.fillCircle(22, 60, 7); g.fillCircle(w-22, 60, 7);
    g.lineStyle(2, 0x6e1f1f, 1); g.strokeCircle(22, 60, 7); g.strokeCircle(w-22, 60, 7);
    g.fillStyle(roofDark, 1); g.fillRect(6, 40, w-12, 8);
    g.fillStyle(roof, 1); g.fillTriangle(w/2, 6, 10, 42, w-10, 42);
    g.fillStyle(roofDark, 1); g.fillEllipse(14, 38, 18, 7); g.fillEllipse(w-14, 38, 18, 7);
    g.fillStyle(0xe8c873, 1);
    g.fillTriangle(8, 40, 2, 24, 18, 38); g.fillTriangle(w-8, 40, w-2, 24, w-18, 38);
    g.fillRect(10, 38, w-20, 3);
    g.fillStyle(PALETTE.lantern, 1); g.fillRoundedRect(w/2-5, 44, 10, 14, 3);
    g.fillStyle(0xffe9a8, 1); g.fillRect(w/2-1, 56, 2, 4);
  }
 
  drawTaiwanCourt(g, w, h, roof, roofDark, wall) {
    g.fillStyle(wall, 1); g.fillRect(8, 40, w-16, h-50);
    g.fillStyle(0xa85c43, 1); g.fillRect(8, h-22, w-16, 12);
    g.fillStyle(0xf6f6f2, 1);
    for (let i = 0; i < 4; i++) g.fillRect(16+i*22, 46, 6, h-60);
    g.fillStyle(PALETTE.woodDark, 1); g.fillRect(w/2-10, h-32, 20, 22);
    g.fillStyle(0xffe9a8, 0.5); g.fillRect(w/2-7, h-28, 14, 12);
    g.fillStyle(0xdcebf5, 0.9); g.fillRect(14, 50, 10, 12); g.fillRect(w-24, 50, 10, 12);
    g.lineStyle(2, 0x6b6b6b, 1); g.strokeRect(14, 50, 10, 12); g.strokeRect(w-24, 50, 10, 12);
    g.fillStyle(roofDark, 1); g.fillTriangle(w/2, 6, 6, 44, w-6, 44);
    g.fillStyle(roof, 1); g.fillTriangle(w/2, 10, 12, 40, w-12, 40);
    g.fillStyle(0xffffff, 0.15); g.fillTriangle(w/2, 10, w/2-16, 36, w/2+4, 36);
    g.fillStyle(0xe8c873, 1); g.fillCircle(w/2, 24, 5);
  }
 
  drawKoban(g, w, h, roof, roofDark, wall) {
    g.fillStyle(wall, 1); g.fillRect(16, 50, w-32, h-60);
    g.fillStyle(PALETTE.woodDark, 1); g.fillRect(w/2-8, h-30, 16, 20);
    g.fillStyle(0xdcebf5, 0.9); g.fillRect(22, 56, 10, 10); g.fillRect(w-32, 56, 10, 10);
    g.fillStyle(roofDark, 1); g.fillRect(12, 42, w-24, 8);
    g.fillStyle(roof, 1); g.fillTriangle(w/2, 16, 14, 46, w-14, 46);
    g.fillStyle(0xffffff, 1); g.fillRect(w/2-16, 18, 32, 8);
  }
 
  // 圖書館：圓頂+書架紋理
  makeLibrary() {
    const w = 100, h = 100, g = this.g();
    g.fillStyle(0x000000, 0.12); g.fillEllipse(w/2, h-6, w*0.6, 10);
    // 牆
    g.fillStyle(0xf5f0e6, 1); g.fillRect(8, 40, w-16, h-50);
    // 書架線
    g.lineStyle(1.5, 0xc0a070, 0.6);
    for (let i = 0; i < 5; i++) g.strokeRect(14+i*16, 50, 12, 18);
    // 門
    g.fillStyle(0x8d5524, 1); g.fillRect(w/2-8, h-28, 16, 18);
    g.fillStyle(0xffd060, 0.4); g.fillRect(w/2-6, h-26, 12, 10);
    // 圓頂
    g.fillStyle(0x7a5c3a, 1); g.fillRect(6, 34, w-12, 8);
    g.fillStyle(0x9e7c50, 1); g.fillEllipse(w/2, 22, w-16, 30);
    g.fillStyle(0xe8c873, 1); g.fillCircle(w/2, 8, 5);
    g.generateTexture("b_library", w, h); g.destroy();
  }
 
  // 偵查局：深色威嚴外觀
  makeDetectiveBureau() {
    const w = 100, h = 100, g = this.g();
    g.fillStyle(0x000000, 0.18); g.fillEllipse(w/2, h-6, w*0.6, 10);
    // 牆身（深灰藍）
    g.fillStyle(0x37474f, 1); g.fillRect(8, 42, w-16, h-52);
    // 窗（細長搜查風）
    g.fillStyle(0xffe9a8, 0.7); g.fillRect(16, 50, 8, 14); g.fillRect(w-24, 50, 8, 14);
    g.lineStyle(1.5, 0x607d8b, 1); g.strokeRect(16, 50, 8, 14); g.strokeRect(w-24, 50, 8, 14);
    // 門（深色）
    g.fillStyle(0x1a2a3a, 1); g.fillRect(w/2-9, h-30, 18, 20);
    g.fillStyle(0x90caf9, 0.4); g.fillRect(w/2-7, h-28, 14, 10);
    // 頂部
    g.fillStyle(0x263238, 1); g.fillRect(4, 34, w-8, 10);
    g.fillStyle(0x37474f, 1); g.fillTriangle(w/2, 12, 8, 38, w-8, 38);
    // 警徽（用兩個三角形交疊畫六角星）
    g.fillStyle(0xe8c873, 1);
    g.fillTriangle(w/2, 16, w/2-7, 28, w/2+7, 28);
    g.fillTriangle(w/2, 32, w/2-7, 20, w/2+7, 20);
    g.generateTexture("b_detective", w, h); g.destroy();
  }
 
  // 鐘樓
  makeClockTower() {
    const w = 70, h = 120, g = this.g();
    // 塔身
    g.fillStyle(0xd8dde2, 1); g.fillRect(18, 40, w-36, h-50);
    // 磚紋
    g.fillStyle(0xbbb0a0, 0.3);
    for (let i = 0; i < 6; i++) g.fillRect(18, 44+i*12, w-36, 2);
    // 鐘樓上部
    g.fillStyle(0x9e9e9e, 1); g.fillRect(14, 26, w-28, 18);
    // 時鐘
    g.fillStyle(0xffffff, 1); g.fillCircle(w/2, 35, 10);
    g.lineStyle(2, 0x333333, 1); g.strokeCircle(w/2, 35, 10);
    g.lineStyle(2, 0x333333, 1);
    g.beginPath(); g.moveTo(w/2, 35); g.lineTo(w/2, 27); g.strokePath();
    g.beginPath(); g.moveTo(w/2, 35); g.lineTo(w/2+7, 35); g.strokePath();
    // 塔頂
    g.fillStyle(0x2c4258, 1); g.fillTriangle(w/2, 6, 10, 28, w-10, 28);
    g.fillStyle(0xe8c873, 1); g.fillCircle(w/2, 8, 3);
    g.generateTexture("b_clocktower", w, h); g.destroy();
  }
 
  // 中央天秤廣場雕像
  makeScalePlaza() {
    const w = 80, h = 100, g = this.g();
    // 台座
    g.fillStyle(0xd7ccc8, 1); g.fillRect(20, 60, 40, 30);
    g.fillStyle(0xa1887f, 1); g.fillRect(18, 58, 44, 5);
    // 中柱
    g.fillStyle(0x8d7460, 1); g.fillRect(w/2-3, 20, 6, 42);
    // 天秤橫桿
    g.fillStyle(0x5d4037, 1); g.fillRect(10, 22, w-20, 4);
    // 左盤
    g.lineStyle(1.5, 0x795548, 1);
    g.beginPath(); g.moveTo(14, 26); g.lineTo(10, 44); g.strokePath();
    g.beginPath(); g.moveTo(14, 26); g.lineTo(18, 44); g.strokePath();
    g.fillStyle(0xb8a080, 1); g.fillEllipse(14, 46, 18, 6);
    // 右盤
    g.beginPath(); g.moveTo(w-14, 26); g.lineTo(w-10, 44); g.strokePath();
    g.beginPath(); g.moveTo(w-14, 26); g.lineTo(w-18, 44); g.strokePath();
    g.fillStyle(0xb8a080, 1); g.fillEllipse(w-14, 46, 18, 6);
    // 頂部
    g.fillStyle(0xe8c873, 1); g.fillCircle(w/2, 18, 5);
    g.generateTexture("b_scale", w, h); g.destroy();
  }
 
  // 法典石碑
  makeStele() {
    const w = 32, h = 48, g = this.g();
    g.fillStyle(0x78909c, 1); g.fillRect(4, 8, 24, 36);
    g.fillStyle(0x607d8b, 1); g.fillRect(2, 6, 28, 6); g.fillRect(6, 40, 20, 4);
    g.fillStyle(0xeceff1, 0.6);
    g.fillRect(8, 14, 16, 2); g.fillRect(8, 18, 16, 2); g.fillRect(8, 22, 16, 2); g.fillRect(8, 26, 10, 2);
    g.generateTexture("stele", w, h); g.destroy();
  }
 
  // 路燈
  makeLampPost() {
    const w = 16, h = 40, g = this.g();
    g.fillStyle(0x546e7a, 1); g.fillRect(7, 16, 2, 22);
    g.fillStyle(0x37474f, 1); g.fillRect(4, 16, 8, 3); g.fillRect(6, 38, 4, 2);
    g.fillStyle(0xffe9a8, 0.9); g.fillCircle(8, 12, 5);
    g.fillStyle(0xffcc02, 0.7); g.fillCircle(8, 12, 3);
    g.generateTexture("lamppost", w, h); g.destroy();
  }
 
  // 指示牌
  makeSignPost() {
    const w = 32, h = 32, g = this.g();
    g.fillStyle(0x6d4c41, 1); g.fillRect(14, 10, 4, 20);
    g.fillStyle(0xffcc80, 1); g.fillRect(2, 4, 28, 12);
    g.fillStyle(0x5d4037, 0.7);
    g.fillRect(4, 7, 12, 2); g.fillRect(4, 11, 8, 2);
    g.generateTexture("signpost", w, h); g.destroy();
  }
 
  makeGate() {
    const g = this.g(), w = 80, h = 60;
    g.fillStyle(0xb33f3f, 1); g.fillRect(8, 14, 10, 44); g.fillRect(w-18, 14, 10, 44);
    g.fillStyle(0xe8c873, 1); g.fillRect(6, 10, 14, 5); g.fillRect(w-20, 10, 14, 5);
    g.fillStyle(0x7a2a2a, 1); g.fillRect(2, 20, w-4, 7);
    g.fillStyle(0xe8c873, 1); g.fillRoundedRect(w/2-16, 2, 32, 14, 3);
    g.fillStyle(0xb33f3f, 1); g.fillRect(w/2-12, 6, 24, 6);
    g.fillStyle(0x7a2a2a, 1);
    g.fillTriangle(4, 20, 0, 8, 16, 16); g.fillTriangle(w-4, 20, w, 8, w-16, 16);
    g.generateTexture("gate", w, h); g.destroy();
  }
 
  makeFence() {
    const g = this.g();
    g.fillStyle(PALETTE.woodDark, 1); g.fillRect(0, 10, 32, 4); g.fillRect(2, 0, 4, 32); g.fillRect(26, 0, 4, 32);
    g.generateTexture("fence", 32, 32); g.destroy();
  }
 
  makeCloud() {
    const g = this.g();
    g.fillStyle(0xffffff, 0.9); g.fillEllipse(30, 20, 50, 22);
    g.fillEllipse(18, 24, 30, 18); g.fillEllipse(44, 24, 30, 18);
    g.fillStyle(0xf0f0f0, 0.4); g.fillEllipse(30, 26, 50, 12);
    g.generateTexture("cloud", 70, 36); g.destroy();
  }
 
  makeBird() {
    const g = this.g();
    g.fillStyle(0x333333, 1);
    g.fillTriangle(0, 4, 8, 0, 8, 6);
    g.fillTriangle(8, 0, 16, 4, 8, 6);
    g.generateTexture("bird", 16, 8); g.destroy();
  }
 
  makeMountain(key, col1, col2) {
    const w = 160, h = 80, g = this.g();
    g.fillStyle(col1, 1); g.fillTriangle(w*0.1, h, w*0.4, h*0.15, w*0.7, h);
    g.fillStyle(col2, 1); g.fillTriangle(w*0.35, h, w*0.65, h*0.28, w*0.9, h);
    g.fillStyle(0xffffff, 0.15); g.fillTriangle(w*0.4, h*0.15, w*0.4+6, h*0.32, w*0.4-6, h*0.32);
    g.generateTexture(key, w, h); g.destroy();
  }
}
 
// ----------------------------------------------------------------
// TitleScene：完整村景 + 進入按鈕（不再擋住背景）
// ----------------------------------------------------------------
class TitleScene extends Phaser.Scene {
  constructor() { super("TitleScene"); }
 
  create() {
    const w = this.cameras.main.width, h = this.cameras.main.height;
 
    // --- 左側刑法村（暖黃昏） ---
    const leftBg = this.add.graphics();
    leftBg.fillGradientStyle(0xf9a825, 0xf9a825, 0xffe0b2, 0xffe0b2, 1);
    leftBg.fillRect(0, 0, w/2, h);
 
    // --- 右側刑訴村（清晨藍） ---
    const rightBg = this.add.graphics();
    rightBg.fillGradientStyle(0x1a3a5c, 0x1a3a5c, 0x90caf9, 0x90caf9, 1);
    rightBg.fillRect(w/2, 0, w/2, h);
 
    // 遠山
    this.add.image(w*0.12, h-40, "mtn_warm").setScale(1.2).setAlpha(0.7).setDepth(1);
    this.add.image(w*0.35, h-40, "mtn_warm").setScale(0.9).setAlpha(0.5).setDepth(1);
    this.add.image(w*0.62, h-40, "mtn_cool").setScale(1.1).setAlpha(0.7).setDepth(1);
    this.add.image(w*0.88, h-40, "mtn_cool").setScale(0.85).setAlpha(0.5).setDepth(1);
 
    // 雲朵
    [w*0.08, w*0.28, w*0.6, w*0.82].forEach((cx, i) => {
      const cld = this.add.image(cx, 30+i*10, "cloud").setScale(0.9+i*0.1).setAlpha(0.85).setDepth(2);
      this.tweens.add({ targets: cld, x: cld.x + 30, duration: 4000+i*1200, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
    });
 
    // 中央分隔線（法治大道）
    const divider = this.add.graphics().setDepth(3);
    divider.fillStyle(0xd7ccc8, 0.5); divider.fillRect(w/2-20, 0, 40, h);
 
    // 地面草皮
    for (let x = 0; x < Math.ceil(w/TILE); x++) {
      this.add.image(x*TILE, h-TILE/2, "grass0").setDisplaySize(TILE, TILE).setDepth(4);
    }
 
    // 路面
    for (let y = 0; y < 3; y++) {
      this.add.image(w/2, h - TILE*1.5 - y*TILE, "path").setDisplaySize(40, TILE).setDepth(4);
    }
 
    // 左側建築群
    this.add.image(w*0.18, h-120, "b_temple").setScale(1.15).setDepth(5);
    this.add.image(w*0.18, h-185, "gate").setScale(1.1).setDepth(5);
    this.add.image(w*0.35, h-115, "b_library").setScale(1.0).setDepth(5);
    this.add.image(w*0.08, h-95, "bush").setScale(0.9).setDepth(5);
 
    // 右側建築群
    this.add.image(w*0.82, h-120, "b_court").setScale(1.15).setDepth(5);
    this.add.image(w*0.65, h-115, "b_detective").setScale(1.0).setDepth(5);
    this.add.image(w*0.9, h-95, "bush").setScale(0.9).setDepth(5);
 
    // 中央天秤（上移）
    this.add.image(w/2, h-160, "b_scale").setScale(1.1).setDepth(6);
 
    // 裝飾
    this.add.image(w*0.26, h-50, "stele").setDepth(6);
    this.add.image(w*0.75, h-50, "stele").setDepth(6);
    this.add.image(w*0.12, h-50, "lamppost").setDepth(6);
    this.add.image(w*0.88, h-50, "lamppost").setDepth(6);
 
    // 飛鳥動畫
    const bird1 = this.add.image(-20, 60, "bird").setDepth(7);
    const bird2 = this.add.image(-50, 80, "bird").setScale(0.8).setDepth(7);
    this.tweens.add({ targets: bird1, x: w+30, duration: 7000, repeat: -1, delay: 0 });
    this.tweens.add({ targets: bird2, x: w+60, duration: 9000, repeat: -1, delay: 2000 });
 
    // 標籤
    this.add.text(w*0.25, 20, "刑法村", { fontSize: "22px", color: "#fff8e1", fontStyle: "bold", shadow: { fill: true, blur: 4, color: "#7a2a2a" } }).setOrigin(0.5).setDepth(8);
    this.add.text(w*0.25, 44, "刑法總則 / 刑法分則", { fontSize: "12px", color: "#ffe082" }).setOrigin(0.5).setDepth(8);
    this.add.text(w*0.75, 20, "刑事訴訟村", { fontSize: "22px", color: "#e3f2fd", fontStyle: "bold", shadow: { fill: true, blur: 4, color: "#1a3a5c" } }).setOrigin(0.5).setDepth(8);
    this.add.text(w*0.75, 44, "偵查 / 起訴 / 審判 / 執行", { fontSize: "12px", color: "#90caf9" }).setOrigin(0.5).setDepth(8);
 
    // 主標題（上移到畫面中段）
    this.add.text(w/2, h*0.38, "🏯 刑法鎮 LawTown", { fontSize: "18px", color: "#fff8e1", fontStyle: "bold", backgroundColor: "#00000055", padding: { x: 10, y: 5 } }).setOrigin(0.5).setDepth(9);
    this.add.text(w/2, h*0.38+28, "⚖ 法治廣場", { fontSize: "12px", color: "#e8c873" }).setOrigin(0.5).setDepth(9);
 
    // 互動按鈕
    this.makeTitleButton(w*0.25, h-60, "▶ 進入刑法村", 0xb33f3f, 0x8b1a1a, () => this.startEnter("criminal"));
    this.makeTitleButton(w*0.75, h-60, "▶ 進入刑訴村", 0x1a3a5c, 0x0d2030, () => this.startEnter("procedure"));
 
    // 提示說明
    this.add.text(w/2, h-28, "💡 點擊村莊按鈕開始冒險", { fontSize: "11px", color: "#ffffffaa", backgroundColor: "#00000033", padding: { x: 6, y: 2 } }).setOrigin(0.5).setDepth(9);
  }
 
  makeTitleButton(x, y, label, bg, bgDark, callback) {
    const btn = this.add.text(x, y, label, {
      fontSize: "14px", color: "#ffffff", backgroundColor: "#" + bg.toString(16).padStart(6, "0"),
      padding: { x: 14, y: 8 }, fixedWidth: 130
    }).setOrigin(0.5).setDepth(10).setInteractive({ cursor: "pointer" });
 
    btn.on("pointerover", () => btn.setStyle({ backgroundColor: "#" + bgDark.toString(16).padStart(6, "0") }));
    btn.on("pointerout", () => btn.setStyle({ backgroundColor: "#" + bg.toString(16).padStart(6, "0") }));
    btn.on("pointerdown", callback);
 
    // 脈衝動畫
    this.tweens.add({ targets: btn, scaleX: 1.04, scaleY: 1.04, duration: 700, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
    return btn;
  }
 
  startEnter(villageKey) {
    // 顯示HTML輸入名字overlay，再跳進村莊
    _pendingVillageKey = villageKey;
    showTitleOverlay();
  }
}
 
// ----------------------------------------------------------------
// VillageScene：豐富視覺版
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
    const isCriminal = this.villageKey === "criminal";
 
    // ── 天空背景層（gradient覆蓋整個地圖） ──
    const sky = this.add.graphics().setDepth(-10).setScrollFactor(0);
    if (isCriminal) {
      sky.fillGradientStyle(0xf9a825, 0xf9a825, 0xfff3e0, 0xfff3e0, 1);
    } else {
      sky.fillGradientStyle(0x1a3a5c, 0x1a3a5c, 0x90caf9, 0x90caf9, 1);
    }
    sky.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);
 
    // ── 遠山（ScrollFactor 0.2 產生視差感） ──
    const mtnKey = isCriminal ? "mtn_warm" : "mtn_cool";
    for (let i = 0; i < Math.ceil(mapW / 160) + 1; i++) {
      this.add.image(i*140, mapH - TILE*3, mtnKey).setScale(1.4).setAlpha(0.55).setDepth(-8).setScrollFactor(0.25);
    }
 
    // ── 雲朵（parallax） ──
    this.clouds = [];
    for (let i = 0; i < 5; i++) {
      const cld = this.add.image(Phaser.Math.Between(50, mapW-50), Phaser.Math.Between(20, 80), "cloud")
        .setAlpha(0.75).setDepth(-6).setScrollFactor(0.15 + i*0.05);
      this.clouds.push({ img: cld, speed: 0.15 + i*0.05 });
    }
 
    // ── 地面 ──
    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        const midRow = Math.floor(rows/2), midCol = Math.floor(cols/2);
        const isHRoad = (y === midRow);
        const isVRoad = (x === midCol);
        const isPlaza = (Math.abs(x - midCol) <= 1 && Math.abs(y - midRow) <= 1);
 
        let tex;
        if (isPlaza) tex = "stonepath";
        else if (isHRoad || isVRoad) tex = "path";
        else tex = (((x+y) % 5 === 0) ? "grass2" : ((x+y)%3===0 ? "grass1" : "grass0"));
 
        this.add.image(x*TILE, y*TILE, tex).setOrigin(0).setDepth(0);
      }
    }
 
    // ── 邊界樹木 ──
    for (let x = 0; x < cols; x++) {
      this.add.image(x*TILE+TILE/2, TILE/2-6, "tree").setDepth(1).setScale(0.85);
      this.add.image(x*TILE+TILE/2, mapH-TILE/2+6, "tree").setDepth(1).setScale(0.85);
    }
    for (let y = 2; y < rows-2; y++) {
      const tex = (y%3 === 0) ? "flowerbush" : "bush";
      this.add.image(TILE/2-4, y*TILE+TILE/2, tex).setDepth(1).setScale(0.7);
      this.add.image(mapW-TILE/2+4, y*TILE+TILE/2, tex).setDepth(1).setScale(0.7);
    }
 
    // ── 廣場裝飾（中央十字路口） ──
    const cx = Math.floor(cols/2)*TILE + TILE/2;
    const cy = Math.floor(rows/2)*TILE + TILE/2;
    this.add.image(cx, cy, "b_scale").setScale(0.8).setDepth(2);
    this.add.text(cx, cy+36, "法治廣場", { fontSize:"10px", color:"#e8c873", backgroundColor:"#00000066", padding:{x:3,y:1} }).setOrigin(0.5).setDepth(3);
 
    // ── 路燈（每隔幾格放一個） ──
    for (let x = 2; x < cols-2; x+=4) {
      this.add.image(x*TILE+TILE/2, (Math.floor(rows/2)-1)*TILE, "lamppost").setDepth(2);
    }
 
    // ── 石碑 & 指示牌 ──
    this.add.image(cx - TILE*3, cy + TILE*2, "stele").setDepth(2);
    this.add.image(cx + TILE*3, cy + TILE*2, "stele").setDepth(2);
    [cx-TILE*5, cx+TILE*5].forEach(sx => {
      this.add.image(sx, cy, "signpost").setDepth(2);
    });
 
    // ── 出口門 ──
    const gateX = cx;
    this.add.image(gateX, TILE*0.6, "gate").setDepth(2).setScale(1.1);
    this.exitZone = { x: gateX, y: TILE, radius: 50 };
    this.add.text(gateX, TILE*1.6, "⬆ 返回鎮口", {
      fontSize: "11px", color: "#fff", backgroundColor: "#00000088", padding: { x: 4, y: 2 }
    }).setOrigin(0.5).setDepth(3);
 
    // ── 村莊名稱 ──
    const nameStyle = isCriminal
      ? { fontSize: "16px", color: "#fff8e1", backgroundColor: "#b33f3f99", padding: { x: 10, y: 4 } }
      : { fontSize: "16px", color: "#e3f2fd", backgroundColor: "#1a3a5c99", padding: { x: 10, y: 4 } };
    this.add.text(mapW/2, 8, this.village.name, nameStyle).setOrigin(0.5, 0).setDepth(6);
 
    // ── 建築物 ──
    this.buildingSprites = [];
    this.village.buildings.forEach(b => {
      const px = b.x * TILE;
      const py = b.y * TILE;
      const tex = "b_" + b.building;
      const img = this.add.image(px, py, tex).setDepth(2).setScale(1.05);
      img.buildingData = b;
      this.buildingSprites.push(img);
 
      // 陰影
      const shadow = this.add.graphics().setDepth(1.5);
      shadow.fillStyle(0x000000, 0.12); shadow.fillEllipse(px, py+img.displayHeight*0.42, img.displayWidth*0.6, 12);
 
      // 名稱標籤
      this.add.text(px, py+img.displayHeight/2-6, b.name, {
        fontSize: "12px", color: "#000", backgroundColor: "#ffffffcc", padding: { x: 4, y: 1 }
      }).setOrigin(0.5, 0).setDepth(3);
 
      // 進度標籤
      if (b.levels) {
        const total = LEVELS[b.levels].length;
        const doneCount = LEVELS[b.levels].filter(l => SaveSystem.isCompleted(l.id)).length;
        const pctColor = doneCount === total ? "#2e7d32cc" : "#e65100cc";
        this.add.text(px+img.displayWidth/2-4, py-img.displayHeight/2+4, `${doneCount}/${total}`, {
          fontSize: "11px", color: "#fff", backgroundColor: pctColor, padding: { x: 4, y: 1 }
        }).setOrigin(1, 0).setDepth(3);
      }
    });
 
    // ── 玩家 ──
    const saved = SaveSystem.getPosition(this.villageKey);
    // 初始位置往下移，避免一進入就觸發鎮口對話框
    const startX = saved ? saved.x : gateX;
    const startY = saved ? saved.y : TILE*4.5;
    this.player = this.physics.add.sprite(startX, startY, "player").setDepth(4);
    this.player.body.setSize(20, 14).setOffset(6, 18);
    this.player.setCollideWorldBounds(true);
    this.physics.world.setBounds(0, 0, mapW, mapH);
 
    this.cameras.main.setBounds(0, 0, mapW, mapH);
    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
 
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys("W,A,S,D,E");
 
    this.promptText = this.add.text(0, 0, "", {
      fontSize: "13px", color: "#fff", backgroundColor: "#000000cc", padding: { x: 6, y: 4 }
    }).setDepth(10).setVisible(false);
 
    this.nearbyBuilding = null;
    this.nearExit = false;
    this.autoTriggeredId = null;
 
    this.createTouchControls();
    this.createTownSwitchButton();
 
    // ── 飛鳥 ──
    this.birds = [];
    for (let i = 0; i < 3; i++) {
      const brd = this.add.image(-30, Phaser.Math.Between(30,80), "bird").setDepth(-5).setScrollFactor(0.05);
      this.tweens.add({ targets: brd, x: this.cameras.main.width+60, duration: 8000+i*2000, repeat: -1, delay: i*3000, ease: "Linear" });
      this.birds.push(brd);
    }
 
    this._cloudTime = 0;
    this._saveTimer = 0;
    this._exitDialogShown = false;
  }
 
  createTownSwitchButton() {
    const isCriminal = this.villageKey === "criminal";
    const btnBg = isCriminal ? "#b33f3fcc" : "#1a3a5ccc";
    const btn = this.add.text(10, 10, "🏯 鎮口", {
      fontSize: "14px", color: "#fff", backgroundColor: btnBg, padding: { x: 8, y: 5 }
    }).setScrollFactor(0).setDepth(20).setInteractive();
    btn.on("pointerdown", () => goToTitle());
  }
 
  createTouchControls() {
    const camW = this.cameras.main.width;
    const camH = this.cameras.main.height;
    this.touchState = { up: false, down: false, left: false, right: false };
 
    // ── 虛擬搖桿：右下角，大圓盤好按 ──
    const joyRadius = 64;
    const joyBaseX = camW - joyRadius - 16;
    const joyBaseY = camH - joyRadius - 16;
 
    // 底盤（半透明大圓）
    const joyBg = this.add.graphics().setScrollFactor(0).setDepth(20);
    const drawBg = () => {
      joyBg.clear();
      joyBg.fillStyle(0x000000, 0.35); joyBg.fillCircle(joyBaseX, joyBaseY, joyRadius);
      joyBg.lineStyle(3, 0xffffff, 0.5); joyBg.strokeCircle(joyBaseX, joyBaseY, joyRadius);
      // 方向刻度提示
      joyBg.lineStyle(1.5, 0xffffff, 0.25);
      joyBg.beginPath(); joyBg.moveTo(joyBaseX, joyBaseY - joyRadius + 10); joyBg.lineTo(joyBaseX, joyBaseY + joyRadius - 10); joyBg.strokePath();
      joyBg.beginPath(); joyBg.moveTo(joyBaseX - joyRadius + 10, joyBaseY); joyBg.lineTo(joyBaseX + joyRadius - 10, joyBaseY); joyBg.strokePath();
    };
    drawBg();
 
    // 搖桿頭
    const joyKnob = this.add.graphics().setScrollFactor(0).setDepth(21);
    const drawKnob = (ox, oy) => {
      joyKnob.clear();
      joyKnob.fillStyle(0xffffff, 0.85); joyKnob.fillCircle(joyBaseX + ox, joyBaseY + oy, 26);
      joyKnob.fillStyle(0xcccccc, 0.4);  joyKnob.fillCircle(joyBaseX + ox - 6, joyBaseY + oy - 6, 10);
    };
    drawKnob(0, 0);
 
    
    // 觸控偵測區：整個右半畫面下半（含搖桿位置的大範圍，方便拇指任意觸碰）
    const zoneX = camW / 2, zoneY = camH * 0.45;
    const zone = this.add.zone(zoneX, zoneY, camW / 2, camH - zoneY)
      .setOrigin(0).setScrollFactor(0).setDepth(19).setInteractive();
 
    // 動態搖桿：按下時以觸點為新圓心（不需要精準點到圓盤）
    let activeX = joyBaseX, activeY = joyBaseY;
 
    const resetJoy = () => {
      this.touchState = { up: false, down: false, left: false, right: false };
      activeX = joyBaseX; activeY = joyBaseY;
      joyBg.clear(); drawBg();
      drawKnob(0, 0);
    };
 
    zone.on("pointerdown", (ptr) => {
      // 以按下點為新搖桿中心（動態搖桿體驗更好）
      const nx = Phaser.Math.Clamp(ptr.x, zoneX + joyRadius, camW - joyRadius);
      const ny = Phaser.Math.Clamp(ptr.y, joyRadius, camH - joyRadius);
      activeX = nx; activeY = ny;
      // 重畫底盤到新位置
      joyBg.clear();
      joyBg.fillStyle(0x000000, 0.35); joyBg.fillCircle(activeX, activeY, joyRadius);
      joyBg.lineStyle(3, 0xffffff, 0.5); joyBg.strokeCircle(activeX, activeY, joyRadius);
      joyBg.lineStyle(1.5, 0xffffff, 0.25);
      joyBg.beginPath(); joyBg.moveTo(activeX, activeY - joyRadius + 10); joyBg.lineTo(activeX, activeY + joyRadius - 10); joyBg.strokePath();
      joyBg.beginPath(); joyBg.moveTo(activeX - joyRadius + 10, activeY); joyBg.lineTo(activeX + joyRadius - 10, activeY); joyBg.strokePath();
      this._updateJoy(ptr.x, ptr.y, activeX, activeY, joyRadius, drawKnob);
    });
 
    zone.on("pointermove", (ptr) => {
      if (!ptr.isDown) return;
      this._updateJoy(ptr.x, ptr.y, activeX, activeY, joyRadius, drawKnob);
    });
 
    zone.on("pointerup",  resetJoy);
    zone.on("pointerout", resetJoy);
  }
 
  _updateJoy(px, py, bx, by, radius, drawKnob) {
    const dx = px - bx, dy = py - by;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const maxTravel = radius * 0.65;
    const clamped = Math.min(dist, maxTravel);
    const angle = Math.atan2(dy, dx);
    drawKnob(Math.cos(angle) * clamped, Math.sin(angle) * clamped);
 
    const threshold = radius * 0.18;   // 很小的死區，稍微移動就反應
    this.touchState.left  = dx < -threshold;
    this.touchState.right = dx >  threshold;
    this.touchState.up    = dy < -threshold;
    this.touchState.down  = dy >  threshold;
  }
 
  update(time) {
    const speed = 160;
    this.player.setVelocity(0);
    const left = this.cursors.left.isDown || this.wasd.A.isDown || this.touchState.left;
    const right = this.cursors.right.isDown || this.wasd.D.isDown || this.touchState.right;
    const up = this.cursors.up.isDown || this.wasd.W.isDown || this.touchState.up;
    const down = this.cursors.down.isDown || this.wasd.S.isDown || this.touchState.down;
    if (left) this.player.setVelocityX(-speed); else if (right) this.player.setVelocityX(speed);
    if (up) this.player.setVelocityY(-speed); else if (down) this.player.setVelocityY(speed);
 
    let closest = null, closestDist = 60;
    this.buildingSprites.forEach(img => {
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, img.x, img.y+10);
      if (dist < closestDist) { closest = img; closestDist = dist; }
    });
 
    const distToExit = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.exitZone.x, this.exitZone.y);
    this.nearExit = distToExit < this.exitZone.radius;
 
    if (closest && closest.buildingData.type === "quiz") {
      this.nearbyBuilding = closest.buildingData;
      this.promptText.setText(`📖 走進了「${this.nearbyBuilding.name}」……`)
        .setPosition(this.player.x-90, this.player.y-70).setVisible(true);
      if (this.autoTriggeredId !== this.nearbyBuilding.id) {
        this.autoTriggeredId = this.nearbyBuilding.id;
        openLevelMenu(this.nearbyBuilding);
      }
    } else if (this.nearExit) {
      this.nearbyBuilding = null;
      this.promptText.setText("已到達鎮口")
        .setPosition(this.player.x-60, this.player.y-70).setVisible(true);
      // 自動觸發返回鎮口確認對話框
      if (!this._exitDialogShown) {
        this._exitDialogShown = true;
        this.showExitConfirm();
      }
    } else {
      this.nearbyBuilding = null;
      this.promptText.setVisible(false);
      // 離開出口區後重設對話框狀態，下次進入可再次觸發
      this._exitDialogShown = false;
    }
    if (!closest) this.autoTriggeredId = null;
    if (Phaser.Input.Keyboard.JustDown(this.wasd.E)) this.tryInteract();
 
    if (!this._saveTimer || time - this._saveTimer > 800) {
      this._saveTimer = time;
      SaveSystem.savePosition(this.villageKey, this.player.x, this.player.y);
    }
  }
 
  tryInteract() {
    if (this.nearbyBuilding && this.nearbyBuilding.levels) openLevelMenu(this.nearbyBuilding);
    else if (this.nearExit) this.showExitConfirm();
  }

  showExitConfirm() {
    // 暫停遊戲場景
    pauseVillageScene();
    // 顯示自訂的像素風格確認對話框
    const modal = document.getElementById('exit-confirm-modal');
    if (modal) modal.classList.remove('hidden');
  }
}
 
// 遊戲在進入村莊時才初始化，避免首頁載入時就啟動 Phaser
let game;
let _pendingVillageKey = "criminal";

function initGame() {
  if (game) return;
  const gameContainer = document.getElementById('game-container');
  const containerW = gameContainer ? gameContainer.parentElement.offsetWidth : window.innerWidth;
  const containerH = window.innerHeight - 50;

  const cfg = {
    type: Phaser.AUTO,
    parent: "game-container",
    width: Math.min(containerW - 4, 900),
    height: Math.min(containerH, 520),
    pixelArt: true,
    backgroundColor: "#8bc16a",
    physics: { default: "arcade", arcade: { debug: false } },
    scene: [BootScene, TitleScene, VillageScene]
  };
  game = new Phaser.Game(cfg);
}

window.addEventListener("load", () => {
  // 首頁不自動啟動 Phaser，等使用者點擊進入
});
 
// ----------------------------------------------------------------
// HTML覆蓋層
// ----------------------------------------------------------------
function showTitleOverlay() {
  // 新版：不再使用這個函數，由首頁的 showNameInput() 處理
}

function hideTitleOverlay() {
  const overlay = document.getElementById("title-overlay");
  if (overlay) overlay.classList.add("hidden");
  const nameModal = document.getElementById("name-input-modal");
  if (nameModal) nameModal.classList.add("hidden");
}

function enterVillage(villageKey) {
  const key = villageKey || _pendingVillageKey || "criminal";
  // 支援兩種輸入框（首頁 Modal 和進入內 overlay）
  const nameInput1 = document.getElementById("player-name-input");
  const nameInput2 = document.getElementById("player-name-input-2");
  const nameInput = nameInput1 || nameInput2;
  const name = (nameInput ? nameInput.value : "").trim() || "無名旅人";
  SaveSystem.setName(name);
  // 清除上次儲存的位置，避免一進入就觸發鎮口對話框
  if (typeof SaveSystem.clearPosition === 'function') {
    SaveSystem.clearPosition(key);
  } else {
    // 直接操作 localStorage（備用）
    try {
      const raw = localStorage.getItem('lawtown_save_v1');
      if (raw) {
        const data = JSON.parse(raw);
        if (data.lastPos) { delete data.lastPos[key]; localStorage.setItem('lawtown_save_v1', JSON.stringify(data)); }
      }
    } catch(e) {}
  }
  hideTitleOverlay();

  // 切換到遊戲畫面
  const mainScreen = document.getElementById('main-screen');
  const gameScreen = document.getElementById('game-screen');
  if (mainScreen) mainScreen.classList.add('hidden');
  if (gameScreen) gameScreen.classList.remove('hidden');

  // 初始化或重啟 Phaser
  if (!game) {
    // 儲存目標村莊，等 BootScene 完成後由 TitleScene 轉到 VillageScene
    _pendingVillageKey = key;
    initGame();
    // 等待 Phaser 初始化完成，監聴 TitleScene 啟動再轉到村莊
    const waitForBoot = setInterval(() => {
      try {
        if (game && game.scene && game.scene.isActive('TitleScene')) {
          clearInterval(waitForBoot);
          game.scene.stop('TitleScene');
          game.scene.start('VillageScene', { villageKey: key });
        }
      } catch(e) { /* 等待中 */ }
    }, 150);
  } else {
    if (game.scene.isActive("VillageScene")) game.scene.stop("VillageScene");
    if (game.scene.isActive("TitleScene")) game.scene.stop("TitleScene");
    game.scene.start("VillageScene", { villageKey: key });
  }
}

function goToTitle() {
  // 返回首頁主畫面
  const mainScreen = document.getElementById('main-screen');
  const gameScreen = document.getElementById('game-screen');
  if (mainScreen) mainScreen.classList.remove('hidden');
  if (gameScreen) gameScreen.classList.add('hidden');
  if (game && game.scene.isActive("VillageScene")) game.scene.stop("VillageScene");
}
 
function pauseVillageScene() {
  if (game && game.scene.isActive("VillageScene") && !game.scene.isPaused("VillageScene"))
    game.scene.pause("VillageScene");
}
 
function resumeVillageScene() {
  if (game && game.scene.isPaused("VillageScene")) game.scene.resume("VillageScene");
}
 
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
  pauseVillageScene();
}
 
function closeLevelMenu() {
  document.getElementById("level-menu").classList.add("hidden");
  resumeVillageScene();
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
    btn.className = "quiz-option"; btn.textContent = opt;
    btn.onclick = () => answerQuiz(idx);
    optWrap.appendChild(btn);
  });
  modal.classList.remove("hidden");
  pauseVillageScene();
}
 
function answerQuiz(idx) {
  const correct = idx === currentLevel.answer;
  const resultEl = document.getElementById("quiz-result");
  resultEl.classList.remove("hidden");
  resultEl.className = correct ? "correct" : "wrong";
  resultEl.textContent = (correct ? "✅ 答對了！" : "❌ 答錯了，沒關係，看看解說：") + "\n" + currentLevel.explain;
  document.querySelectorAll(".quiz-option").forEach(b => b.disabled = true);
  if (correct) SaveSystem.markCompleted(currentLevel.id);
}
 
function closeQuiz() {
  document.getElementById("quiz-modal").classList.add("hidden");
  resumeVillageScene();
}
 
function resetSave() {
  SaveSystem.reset();
  location.reload();
}
