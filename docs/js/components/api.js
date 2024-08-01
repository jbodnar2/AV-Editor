async function fetchMedia() {
  const cacheKey = "media";
  const cachedData = JSON.parse(localStorage.getItem(cacheKey)) || JSON.parse(sessionStorage.getItem(cacheKey));

  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await fetch("data/media.json");

    if (!response.ok) {
      throw new Error(`Failed to fetch media: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    sessionStorage.setItem(cacheKey, JSON.stringify(data));
    return data;
  } catch (error) {
    return null;
  }
}

function extractMediaItemIdFromUrl() {
  const currentUrl = new URL(window.location.href);
  const urlSearchParams = new URLSearchParams(currentUrl.search);
  return urlSearchParams.get("id");
}

async function getMediaItem() {
  const id = extractMediaItemIdFromUrl();

  if (!id) {
    return null;
  }

  const cacheKey = `media-item-${id}`;
  let mediaItem = JSON.parse(sessionStorage.getItem(cacheKey)) || JSON.parse(localStorage.getItem(cacheKey));

  if (!mediaItem) {
    const media = await fetchMedia();
    mediaItem = media.find(item => item.id === id);
    sessionStorage.setItem(cacheKey, JSON.stringify(mediaItem));
  }

  return mediaItem;
}

export { fetchMedia, getMediaItem };
