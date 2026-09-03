const CONTEXT_MENU_ID = "open-in-archive";
const CONTEXT_MENU_TITLE = "Open via Unpaywall";
const ARCHIVE_ORIGIN = "https://archive.ph";

function getCanonicalArticleUrl(targetUrl: string): string {
  const url = new URL(targetUrl);
  return `${url.origin}${url.pathname}`;
}

function getArchiveUrl(targetUrl: string): string {
  return `${ARCHIVE_ORIGIN}/newest/${getCanonicalArticleUrl(targetUrl)}`;
}

async function openInArchive(
  targetUrl: string,
  destination: { type: "new-tab" } | { type: "current-tab"; tabId: number },
): Promise<void> {
  const archiveUrl = getArchiveUrl(targetUrl);

  if (destination.type === "new-tab") {
    await chrome.tabs.create({ url: archiveUrl, active: true });
    return;
  }

  await chrome.tabs.update(destination.tabId, { url: archiveUrl });
}

function registerContextMenu(): void {
  chrome.contextMenus.remove(CONTEXT_MENU_ID, () => {
    void chrome.runtime.lastError;

    chrome.contextMenus.create({
      id: CONTEXT_MENU_ID,
      title: CONTEXT_MENU_TITLE,
      contexts: ["link"],
    });
  });
}

chrome.runtime.onInstalled.addListener(() => {
  registerContextMenu();
});

chrome.runtime.onStartup.addListener(() => {
  registerContextMenu();
});

registerContextMenu();

chrome.contextMenus.onClicked.addListener(async (info) => {
  if (info.menuItemId === CONTEXT_MENU_ID && info.linkUrl) {
    await openInArchive(info.linkUrl, { type: "new-tab" });
  }
});

chrome.action.onClicked.addListener(async (tab) => {
  if (tab.url && tab.id) {
    await openInArchive(tab.url, { type: "current-tab", tabId: tab.id });
  }
});
