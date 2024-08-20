function setSessionMedia(id, value) {
  sessionStorage.setItem(id, JSON.stringify(value));
}

function getSessionMedia(id) {
  try {
    // Attempt to retrieve the media data from the session storage
    const mediaData = sessionStorage.getItem(id);

    // If the media data is not found, return null
    if (!mediaData) {
      return null;
    }

    // Parse the media data from the JSON string and return it
    return JSON.parse(mediaData);
  } catch (error) {
    // If the media data cannot be parsed, log a warning and return null
    console.warn(error);
    return null;
  }
}

function secondsToHHMMSS(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return (
    `${hours.toString().padStart(2, "0")}:` +
    `${minutes.toString().padStart(2, "0")}:` +
    `${seconds.toString().padStart(2, "0")}`
  );
}

function secondsToVttTime(secondsWithMilliseconds) {
  const [totalSeconds, fractionalSeconds = "0"] = String(secondsWithMilliseconds).split(".");
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return (
    `${hours.toString().padStart(2, "0")}:` +
    `${minutes.toString().padStart(2, "0")}:` +
    `${seconds.toString().padStart(2, "0")}` +
    `.${fractionalSeconds.padEnd(3, "0")}`
  );
}

function findTrackByMode(textTracks, mode) {
  return [...textTracks].find(track => track.mode === mode) || null;
}

export { secondsToHHMMSS, findTrackByMode, secondsToVttTime, setSessionMedia, getSessionMedia };
