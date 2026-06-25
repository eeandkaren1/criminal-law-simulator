/**
 * 存檔系統
 * 完全使用瀏覽器 localStorage，資料只存在「玩家自己的裝置」上，
 * 不會送到任何伺服器、不佔用開發者的資料庫或主機額度。
 */
const SAVE_KEY = "lawtown_save_v1";

const SaveSystem = {
  load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return { completed: {}, lastPos: {}, name: "", started: false };
      const data = JSON.parse(raw);
      if (!data.lastPos) data.lastPos = {};
      if (!data.completed) data.completed = {};
      return data;
    } catch (e) {
      console.warn("讀取存檔失敗，使用全新存檔", e);
      return { completed: {}, lastPos: {}, name: "", started: false };
    }
  },

  save(data) {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn("無法寫入存檔（可能瀏覽器隱私模式封鎖 localStorage）", e);
    }
  },

  markCompleted(levelId) {
    const data = this.load();
    data.completed[levelId] = true;
    this.save(data);
  },

  isCompleted(levelId) {
    const data = this.load();
    return !!data.completed[levelId];
  },

  // lastPos 現在依村莊分別記錄： { criminal: {x,y}, procedure: {x,y} }
  savePosition(villageKey, x, y) {
    const data = this.load();
    data.lastPos[villageKey] = { x, y };
    this.save(data);
  },

  getPosition(villageKey) {
    const data = this.load();
    return data.lastPos[villageKey] || null;
  },

  clearPosition(villageKey) {
    const data = this.load();
    if (data.lastPos && data.lastPos[villageKey]) {
      delete data.lastPos[villageKey];
      this.save(data);
    }
  },

  setName(name) {
    const data = this.load();
    data.name = name;
    data.started = true;
    this.save(data);
  },

  getName() {
    return this.load().name || "";
  },

  hasStarted() {
    return !!this.load().started;
  },

  getCompletedCount() {
    const data = this.load();
    return Object.keys(data.completed || {}).length;
  },

  getStreak() {
    // 簡化版：返回已完成關卡數作為連勝數
    return this.getCompletedCount();
  },

  reset() {
    localStorage.removeItem(SAVE_KEY);
  }
};

