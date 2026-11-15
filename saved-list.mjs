export const storageKey = "discover-nz:saved:v1";

export function readSaved() {
  try {
    const value = JSON.parse(localStorage.getItem(storageKey) ?? "[]");
    return Array.isArray(value) ? value.filter(item => item && typeof item.id === "string" &&
      typeof item.title === "string" && typeof item.href === "string" &&
      item.href.startsWith("/") && !/^\/[/\\]/.test(item.href)) : [];
  } catch {
    return [];
  }
}

export function toggleSaved(item) {
  const items = readSaved();
  const next = items.some(entry => entry.id === item.id)
    ? items.filter(entry => entry.id !== item.id)
    : [...items, item];
  localStorage.setItem(storageKey, JSON.stringify(next));
  return next;
}
