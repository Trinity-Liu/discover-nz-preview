import { readSaved, storageKey, toggleSaved } from "./saved-list.mjs";

const activities = [
  { id: "demo-harbour", title: "海港灯会", category: "节庆", area: "Auckland CBD" },
  { id: "demo-football", title: "公园足球交流", category: "运动", area: "Mount Eden" },
  { id: "demo-english", title: "社区英语会话", category: "语言", area: "Newmarket" },
];
const catalog = document.querySelector("#catalog");
const saved = document.querySelector("#saved");
const status = document.querySelector("#status");

function card(activity, selected, inList = false) {
  const article = document.createElement("article");
  article.className = "card";
  const category = document.createElement("p");
  category.className = "eyebrow";
  category.textContent = activity.category;
  const title = document.createElement("h3");
  title.textContent = activity.title;
  const area = document.createElement("p");
  area.textContent = activity.area;
  const button = document.createElement("button");
  button.type = "button";
  button.dataset.id = activity.id;
  button.className = selected ? "secondary" : "";
  button.textContent = selected ? "移除收藏" : "收藏";
  button.setAttribute("aria-label", button.textContent + " " + activity.title);
  if (!inList) button.setAttribute("aria-pressed", String(selected));
  button.addEventListener("click", () => {
    try {
      toggleSaved({ id: activity.id, title:activity.title, href: "/" });
      render();
      const destination = inList ? saved.querySelector("button") ?? catalog.querySelector(`[data-id="${activity.id}"]`)
        : catalog.querySelector(`[data-id="${activity.id}"]`);
      destination?.focus();
      status.textContent = selected ? "已移除收藏。" : "已加入我的列表。";
    } catch {
      status.textContent = "此浏览器未能保存更改。";
    }
  });
  article.append(category, title, area, button);
  return article;
}

function render() {
  const ids = new Set(readSaved().map(item => item.id));
  catalog.replaceChildren(...activities.map(item => card(item, ids.has(item.id))));
  const selected = activities.filter(item => ids.has(item.id));
  if (selected.length) saved.replaceChildren(...selected.map(item => card(item, true, true)));
  else {
    const empty = document.createElement("p");
    empty.textContent = "还没有收藏活动。";
    saved.replaceChildren(empty);
  }
}

window.addEventListener("storage", event => {
  if (event.key === storageKey || event.key === null) render();
});
render();
