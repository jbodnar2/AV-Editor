/**
 * Fetches media data from the server and caches it in session storage.
 * - Cache, check sessionStorage to avoid hitting the server on every page load.
 *
 * @return {Promise<Object|null>} The fetched media data or null if the fetch fails.
 */
async function fetchMedia() {
  const cacheKey = "media";
  const cachedData = JSON.parse(sessionStorage.getItem(cacheKey));

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

/**
 * Extracts the media item ID from the URL.
 *
 * @return {string|null} The media item ID if it exists in the URL, otherwise null.
 */
function extractMediaItemIdFromUrl() {
  const currentUrl = new URL(window.location.href);
  const urlSearchParams = new URLSearchParams(currentUrl.search);
  return urlSearchParams.get("id");
}

/**
 * Retrieves a media item from the cache or fetches it from the server.
 * - Check localStorage for edited version of media.
 * - Check sessionStorage to avoid unnecessary hit on every page load.
 *
 * @return {Promise<Object|null>} The media item if found, null otherwise.
 */
async function getMediaItem() {
  const id = extractMediaItemIdFromUrl();

  if (!id) {
    return null;
  }

  const cacheKey = `media-item-${id}`;
  const cache = localStorage.getItem(cacheKey) || sessionStorage.getItem(cacheKey);

  if (cache === "undefined") {
    return null;
  }

  let mediaItem = JSON.parse(localStorage.getItem(cacheKey)) || JSON.parse(sessionStorage.getItem(cacheKey));

  if (!mediaItem || mediaItem === "undefined") {
    const media = await fetchMedia();
    mediaItem = media.find(item => item.id === id);
    sessionStorage.setItem(cacheKey, JSON.stringify(mediaItem));
  }

  return mediaItem;
}

export { fetchMedia, getMediaItem };
