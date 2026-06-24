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
      if (!raw) return { completed: {}, lastPos: null };
      return JSON.parse(raw);
    } catch (e) {
      console.warn("讀取存檔失敗，使用全新存檔", e);
      return { completed: {}, lastPos: null };
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

  savePosition(x, y) {
    const data = this.load();
    data.lastPos = { x, y };
    this.save(data);
  },

  reset() {
    localStorage.removeItem(SAVE_KEY);
  }
};
