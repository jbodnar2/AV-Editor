import { findTrackByMode, secondsToVttTime } from "./test-helpers.js";

function downloadTranscript(event, videoElement, format) {
  event.preventDefault();
  const track = findTrackByMode(videoElement.textTracks, "showing");
  if (!track) return;

  const videoId = videoElement.id.replace(/(-[^-]*)$/, `-${track.language}`);

  const cues = Array.from(track.cues);
  let content;

  if (format === "vtt") {
    content = cues
      .map(cue => `${secondsToVttTime(cue.startTime)} --> ${secondsToVttTime(cue.endTime)}\n${cue.text}`)
      .join("\n\n");
  } else if (format === "txt") {
    content = cues.map(cue => cue.text).join(" ");
  } else if (format === "json") {
    content = JSON.stringify(
      {
        id: videoId,
        src: videoElement.src,
        title: videoElement.title,
        poster: videoElement.poster,
        track: {
          kind: track.kind,
          label: track.label,
          srclang: track.language,
          cues: Array.from(track.cues).map(cue => ({
            id: cue.id,
            start: cue.startTime,
            end: cue.endTime,
            text: cue.text,
            ...cue,
          })),
        },
      },
      null,
      2,
    );
  }

  const blob = new Blob([content], { type: format === "json" ? "application/json" : "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${videoId}.${format}`;
  link.rel = "noopener";
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  URL.revokeObjectURL(url);
  document.body.removeChild(link);
}

function addDownloadListeners(videoElement) {
  const downloadButtons = {
    json: document.querySelector("a[download='json']"),
    vtt: document.querySelector("a[download='vtt']"),
    txt: document.querySelector("a[download='txt']"),
  };

  Object.entries(downloadButtons).forEach(([format, button]) => {
    if (button) {
      button.addEventListener("click", event => downloadTranscript(event, videoElement, format));
    }
  });
}

export { addDownloadListeners };
