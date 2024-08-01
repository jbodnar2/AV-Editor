function saveSessionMedia(media) {
  sessionStorage.setItem("media", JSON.stringify(media));
}

function getSavedSessionMedia() {
  const saved = sessionStorage.getItem("transcripts");
  return saved ? JSON.parse(saved) : null;
}

async function getMedia() {
  const saved = getSavedSessionMedia();

  if (saved) {
    return saved;
  }

  try {
    const response = await fetch("data/media.json");

    if (!response.ok) {
      throw new Error(`Error ${response.status}, ${response.statusText}`);
    }

    const media = await response.json();
    saveSessionMedia(media);

    return media;
  } catch (error) {
    console.warn(error);
  }
}

export { getMedia };
