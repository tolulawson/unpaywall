chrome.action.onClicked.addListener((tab) => {
  if (tab.url && tab.id) {
    const url = new URL(tab.url);
    const cleanUrl = `${url.origin}${url.pathname}`;
    const archiveUrl = `https://archive.ph/o/${cleanUrl}`;
    chrome.tabs.update(tab.id, { url: archiveUrl });
  }
}); 