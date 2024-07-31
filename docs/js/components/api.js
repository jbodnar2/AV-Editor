function saveMedia(media) {
  localStorage.setItem("media", JSON.stringify(media));
}

function getSavedMedia() {
  const saved = localStorage.getItem("transcripts");
  return saved ? JSON.parse(saved) : null;
}

async function getMedia() {
  const saved = getSavedMedia();

  if (saved) {
    return saved;
  }

  try {
    const response = await fetch("data/media.json");

    if (!response.ok) {
      throw new Error(`Error ${response.status}, ${response.statusText}`);
    }

    const media = await response.json();
    saveMedia(media);

    return media;
  } catch (error) {
    console.warn(error);
  }
}

export { getMedia };
