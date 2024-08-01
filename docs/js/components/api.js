const mediaCacheKey = "media-cache";
const itemCacheKey = "editor-cache";

async function getMedia() {
  let media = JSON.parse(localStorage.getItem(mediaCacheKey)) || JSON.parse(sessionStorage.getItem(mediaCacheKey));

  if (!media) {
    try {
      const response = await fetch("data/media.json");

      if (!response.ok) {
        throw new Error(`Error ${response.status}, ${response.statusText}`);
      }

      media = await response.json();
      sessionStorage.setItem(mediaCacheKey, JSON.stringify(media));
    } catch (error) {
      console.warn(error);
    }
  }

  return media;
}

function getMediaItemId() {
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  return params.get("id");
}

async function getMediaItem() {
  const itemId = getMediaItemId();
  let mediaItem;
  let media;

  if (!itemId) return null;

  mediaItem = JSON.parse(localStorage.getItem(itemCacheKey)) || JSON.parse(sessionStorage.getItem(itemCacheKey));
  if (mediaItem) return mediaItem;

  media = await getMedia();
  mediaItem = media.find(item => item.id === itemId);

  sessionStorage.setItem(itemCacheKey, JSON.stringify(mediaItem));

  return mediaItem;
}

export { getMedia, getMediaItem };
