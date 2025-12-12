const CONTEXT_MENU_ID = "open-in-archive";

async function resolveUrl(targetUrl: string): Promise<string> {
  const controller = new AbortController();
  try {
    const response = await fetch(targetUrl, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
    });
    controller.abort();
    return response.url;
  } catch {
    return targetUrl;
  }
}

function getArchiveUrl(targetUrl: string): string {
  const url = new URL(targetUrl);
  const cleanUrl = `${url.origin}${url.pathname}`;
  return `https://archive.ph/o/${cleanUrl}`;
}

// Register context menu on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: CONTEXT_MENU_ID,
    title: "Unpaywall",
    contexts: ["link"],
  });
});

// Handle context menu click
chrome.contextMenus.onClicked.addListener(async (info) => {
  if (info.menuItemId === CONTEXT_MENU_ID && info.linkUrl) {
    const resolvedUrl = await resolveUrl(info.linkUrl);
    chrome.tabs.create({ url: getArchiveUrl(resolvedUrl) });
  }
});

// Handle toolbar icon click
chrome.action.onClicked.addListener(async (tab) => {
  if (tab.url && tab.id) {
    const resolvedUrl = await resolveUrl(tab.url);
    chrome.tabs.update(tab.id, { url: getArchiveUrl(resolvedUrl) });
  }
}); 