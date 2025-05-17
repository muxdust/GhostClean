function renderList(urls) {
  const list = document.getElementById("urlList");
  list.innerHTML = "";

  urls.forEach((url, index) => {
    const li = document.createElement("li");
    li.textContent = url;

    const removeBtn = document.createElement("img");
    removeBtn.src = "/icon/remove.png";
    removeBtn.alt = "Remove";
    removeBtn.style.cursor = "pointer";
    removeBtn.style.width = "16px";
    removeBtn.style.height = "16px";
    removeBtn.style.marginLeft = "8px";
    removeBtn.title = "Remove this URL";

    removeBtn.onclick = () => {
      urls.splice(index, 1);
      chrome.storage.local.set({ urls }, () => renderList(urls));
    };

    li.appendChild(removeBtn);
    list.appendChild(li);
  });
}

document.getElementById("addUrl").onclick = () => {
  const input = document.getElementById("urlInput");
  const url = input.value.trim();
  if (!url) return;
  chrome.storage.local.get({ urls: [] }, (data) => {
    if (!data.urls.includes(url)) {
      const updated = [...data.urls, url];
      chrome.storage.local.set({ urls: updated }, () => renderList(updated));
      input.value = "";
    }
  });
};

document.getElementById("cleanNow").onclick = () => {
  chrome.runtime.sendMessage({ action: "clean_now" });
};

document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get({ urls: [] }, (data) => renderList(data.urls));
});
