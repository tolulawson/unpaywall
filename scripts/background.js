chrome.action.onClicked.addListener((tab) => {
  if (tab.url) {
    const archiveUrl = `https://archive.ph/o/${tab.url}`;
    chrome.tabs.update(tab.id, { url: archiveUrl });
  }
}); 