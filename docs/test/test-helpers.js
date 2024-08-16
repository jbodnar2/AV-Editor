function formatTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return (
    `${hours.toString().padStart(2, "0")}:` +
    `${minutes.toString().padStart(2, "0")}:` +
    `${seconds.toString().padStart(2, "0")}`
  );
}

function toVTTTime(secondsWithMilliseconds) {
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

function downloadShowingCues(videoElement) {
  const track = findTrackByMode(videoElement.textTracks, "showing");
  if (!track) return;

  const cues = Array.from(track.cues);
  const content = cues
    .map(cue => `${toVTTTime(cue.startTime)} --> ${toVTTTime(cue.endTime)}\n${cue.text}`)
    .join("\n\n");

  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${track.label}.vtt`;
  link.click();
  URL.revokeObjectURL(url);
}

export { formatTime, downloadShowingCues, findTrackByMode };
