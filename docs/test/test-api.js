import { getSessionMedia, setSessionMedia, extractMediaIdFromUrl } from "./test-helpers.js";

async function fetchMediaData({ id = extractMediaIdFromUrl(), url = "./api/data/" }) {
  if (!id) return;

  const cachedMedia = getSessionMedia(id);

  if (cachedMedia) {
    return cachedMedia;
  }

  const dataUrl = `${url}${id}.json`;

  try {
    const response = await fetch(dataUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch media: ${response.status} ${response.statusText}`);
    }

    const mediaData = await response.json();

    setSessionMedia(id, mediaData);

    return mediaData;
  } catch (error) {
    return null;
  }
}

export { fetchMediaData };
