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

export { secondsToHHMMSS, findTrackByMode, secondsToVttTime };
