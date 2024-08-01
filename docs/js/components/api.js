function saveMediaToSession(media) {
  sessionStorage.setItem("media", JSON.stringify(media));
}

function getSavedSessionMedia() {
  const saved = sessionStorage.getItem("media");
  return saved ? JSON.parse(saved) : null;
}

function saveMediaToLocal(media) {
  localStorage.setItem("media", JSON.stringify(media));
}

function getSavedLocalMedia() {
  const saved = localStorage.getItem("media");
  return saved ? JSON.parse(saved) : null;
}

async function getMedia() {
  const saved = getSavedLocalMedia() || getSavedSessionMedia();
  console.log("saved", saved);

  if (saved) {
    return saved;
  }

  try {
    const response = await fetch("data/media.json");

    if (!response.ok) {
      throw new Error(`Error ${response.status}, ${response.statusText}`);
    }

    const media = await response.json();
    saveMediaToSession(media);

    return media;
  } catch (error) {
    console.warn(error);
  }
}

export { getMedia };
