function saveTranscripts(transcripts) {
  localStorage.setItem("transcripts", JSON.stringify(transcripts));
}

function getSavedTranscripts() {
  const saved = localStorage.getItem("transcripts");
  return saved ? JSON.parse(saved) : null;
}

async function getTranscripts(url) {
  const saved = getSavedTranscripts();

  if (saved) {
    return saved;
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error ${response.status}, ${response.statusText}`);
    }

    const transcripts = await response.json();
    saveTranscripts(transcripts);

    return transcripts;
  } catch (error) {
    console.warn(error);
  }
}

export { getTranscripts };
