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

function downloadVTT(video) {
  const track = findTrackByMode(video.textTracks, "showing");
  if (!track) return;

  const cues = Array.from(track.cues);
  const content = cues
    .map((cue, idx) => `${idx + 1}\n${toVTTTime(cue.startTime)} --> ${toVTTTime(cue.endTime)}\n${cue.text}`)
    .join("\n\n");

  const blob = new Blob([`WEBVTT\n\n${content}`], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${video.title}-${track.label}.vtt`;
  link.style.display = "none";
  document.body.appendChild(link); // Firefox requires the link to be in the body
  link.click();
  URL.revokeObjectURL(url);
  document.body.removeChild(link); // remove the link when done
}

function downloadTXT(video) {
  const track = findTrackByMode(video.textTracks, "showing");
  if (!track) return;

  const cues = Array.from(track.cues);
  const content = cues.map((cue, idx) => `${cue.text}`).join(" ");

  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${video.title}-${track.label}.txt`;
  link.style.display = "none";
  document.body.appendChild(link); // Firefox requires the link to be in the body
  link.click();
  URL.revokeObjectURL(url);
  document.body.removeChild(link); // remove the link when done
}

function downloadJSON(video) {
  const track = findTrackByMode(video.textTracks, "showing");
  if (!track) return;

  const content = JSON.stringify(
    {
      video: {
        id: video.id,
        url: video.url,
        title: video.title,
        poster: video.poster,
        track: {
          id: track.id,
          kind: track.kind,
          label: track.label,
          language: track.language,
          cues: Array.from(track.cues).map((cue, idx) => ({
            id: idx + 1,
            start: cue.startTime,
            end: cue.endTime,
            text: cue.text,
          })),
        },
      },
    },
    null,
    2,
  );

  const blob = new Blob([content], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${video.title}-${track.label}.json`;
  link.style.display = "none";
  document.body.appendChild(link); // Firefox requires the link to be in the body
  link.click();
  URL.revokeObjectURL(url);
  document.body.removeChild(link); // remove the link when done
}

export { formatTime, downloadVTT, findTrackByMode, downloadTXT, downloadJSON };
