function extractMediaIdFromUrl() {
  const currentUrl = new URL(window.location.href);

  const url = new URL(currentUrl);

  const urlSearchParams = new URLSearchParams(url.search);

  return urlSearchParams.get("id");
}

async function fetchMediaData({ id = extractMediaIdFromUrl(), url = "http://localhost:3000/test/api/data/" }) {
  if (!id) return;

  const dataUrl = `${url}media-${id}.json`;

  try {
    const response = await fetch(dataUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch media: ${response.status} ${response.statusText}`);
    }

    const mediaData = await response.json();
    return mediaData;
  } catch (error) {
    return null;
  }
}

export { fetchMediaData };
