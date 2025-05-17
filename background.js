function deleteStoredUrlsHistory() {
    chrome.storage.local.get({ urls: [] }, ({ urls }) => {
      if (!urls.length) {
        console.log("[Cleaner] No URLs stored.");
        return;
      }
  
      chrome.history.search({ text: '', startTime: 0 }, (items) => {
        if (chrome.runtime.lastError) {
          console.error("[Cleaner] History search error:", chrome.runtime.lastError);
          return;
        }
  
        let deleteCount = 0;
  
        items.forEach((item) => {
          for (const baseUrl of urls) {
            if (item.url.startsWith(baseUrl)) {
              chrome.history.deleteUrl({ url: item.url }, () => {
                if (chrome.runtime.lastError) {
                  console.error("[Cleaner] Delete failed:", chrome.runtime.lastError);
                } else {
                  console.log("[Cleaner] Deleted:", item.url);
                  deleteCount++;
                }
              });
              break;
            }
          }
        });
  
        console.log(`[Cleaner] Deletion check complete. ${deleteCount} items attempted.`);
      });
    });
  }
  
  setInterval(deleteStoredUrlsHistory, 60 * 60 * 1000);
  
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "clean_now") {
      console.log("[Cleaner] Manual clean triggered.");
      deleteStoredUrlsHistory();
    }
  });
  
  chrome.runtime.onInstalled.addListener(() => {
    console.log("[Cleaner] Extension installed. Cleaning now.");
    deleteStoredUrlsHistory();
  });
  