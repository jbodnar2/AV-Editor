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

function downloadVTT(videoElement) {
  const track = findTrackByMode(videoElement.textTracks, "showing");
  if (!track) return;

  const cues = Array.from(track.cues);
  const content = cues
    .map(
      (cue, idx) => `${idx + 1}\n${secondsToVttTime(cue.startTime)} --> ${secondsToVttTime(cue.endTime)}\n${cue.text}`,
    )
    .join("\n\n");

  const blob = new Blob([`WEBVTT\n\n${content}`], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${videoElement.id}.vtt`;
  link.style.display = "none";
  document.body.appendChild(link); // Firefox requires the link to be in the body
  link.click();
  URL.revokeObjectURL(url);
  document.body.removeChild(link); // remove the link when done
}

function downloadTXT(videoElement) {
  const track = findTrackByMode(videoElement.textTracks, "showing");
  if (!track) return;

  const cues = Array.from(track.cues);
  const content = cues.map((cue, idx) => `${cue.text}`).join(" ");

  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${videoElement.id}.txt`;
  link.style.display = "none";
  document.body.appendChild(link); // Firefox requires the link to be in the body
  link.click();
  URL.revokeObjectURL(url);
  document.body.removeChild(link); // remove the link when done
}

function downloadJSON(videoElement) {
  const track = findTrackByMode(videoElement.textTracks, "showing");
  if (!track) return;

  const content = JSON.stringify(
    {
      id: `${videoElement.id}`,
      src: videoElement.src,
      title: videoElement.title,
      poster: videoElement.poster,
      track: {
        kind: track.kind,
        label: track.label,
        srclang: track.language,
        cues: Array.from(track.cues).map((cue, idx) => ({
          id: idx + 1,
          start: cue.startTime,
          end: cue.endTime,
          text: cue.text,
          data: { ...cue.data },
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
  link.download = `${videoElement.id}.json`;
  link.style.display = "none";
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
  if (btnJSON) btnJSON.addEventListener("click", event => downloadJSON(videoElement));
  if (btnVTT) btnVTT.addEventListener("click", event => downloadVTT(videoElement));
  if (btnTXT) btnTXT.addEventListener("click", event => downloadTXT(videoElement));
}

export { addDownloadListeners };
