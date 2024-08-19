import { findTrackByMode, secondsToVttTime } from "./test-helpers.js";

function downloadVTT(event, videoElement) {
  event.preventDefault();
  const track = findTrackByMode(videoElement.textTracks, "showing");
  if (!track) return;

  const videoId = videoElement.id.replace(/(-[^-]*)$/, `-${track.language}`);
  const format = event.target.download;

  const cues = Array.from(track.cues);
  const content = cues
    .map(cue => `${secondsToVttTime(cue.startTime)} --> ${secondsToVttTime(cue.endTime)}\n${cue.text}`)
    .join("\n\n");

  const blob = new Blob([`WEBVTT\n\n${content}`], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${videoId}.${format}`;
  link.rel = "noopener";
  link.style.display = "none";

  document.body.appendChild(link); // Firefox requires the link to be in the body
  link.click();
  URL.revokeObjectURL(url);
  document.body.removeChild(link); // remove the link when done
}

function downloadTXT(event, videoElement) {
  event.preventDefault();
  const track = findTrackByMode(videoElement.textTracks, "showing");
  if (!track) return;

  const videoId = videoElement.id.replace(/(-[^-]*)$/, `-${track.language}`);
  const format = event.target.download;

  const cues = Array.from(track.cues);
  const content = cues.map(cue => `${cue.text}`).join(" ");

  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${videoId}.${format}`;
  link.rel = "noopener";
  link.style.display = "none";
  document.body.appendChild(link); // Firefox requires the link to be in the body
  link.click();
  URL.revokeObjectURL(url);
  document.body.removeChild(link); // remove the link when done
}

function downloadJSON(event, videoElement) {
  event.preventDefault();
  const track = findTrackByMode(videoElement.textTracks, "showing");
  if (!track) return;

  const videoId = videoElement.id.replace(/(-[^-]*)$/, `-${track.language}`);
  const format = event.target.download;

  const content = JSON.stringify(
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

  const blob = new Blob([content], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${videoId}.${format}`;
  link.style.display = "none";
  link.rel = "noopener";
  document.body.appendChild(link); // Firefox requires the link to be in the body
  link.click();
  URL.revokeObjectURL(url);
  document.body.removeChild(link); // remove the link when done
}

function addDownloadListeners(
  videoElement,
  {
    btnJSON = document.querySelector?.("a[download='json']"),
    btnVTT = document.querySelector?.("a[download='vtt']"),
    btnTXT = document.querySelector?.("a[download='txt']"),
  },
) {
  if (btnJSON) btnJSON.addEventListener("click", event => downloadJSON(event, videoElement));
  if (btnVTT) btnVTT.addEventListener("click", event => downloadVTT(event, videoElement));
  if (btnTXT) btnTXT.addEventListener("click", event => downloadTXT(event, videoElement));
}

export { addDownloadListeners };
