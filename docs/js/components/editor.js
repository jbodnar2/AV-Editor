import { addTrack } from "./tracks.js";
import { addTranscript } from "./transcripts.js";
import { extractMediaItemIdFromUrl } from "./api.js";
import { getMediaItem } from "./api.js";
import { setLocalMediaItem } from "./store.js";

function highlightCueSegment(event, video, editorWrapper) {
  const activeCue = event.target.activeCues?.[0];

  if (!activeCue) return;

  const scrollTargetID = `cue-${activeCue.id}`;
  const scrollTarget = editorWrapper.querySelector(`#${scrollTargetID}`);

  const timeButton = scrollTarget?.querySelector(".cue-select-button");

  const isPlaying = video.paused;

  const previousCues = [...editorWrapper.querySelectorAll(".cue--focus")];

  previousCues.forEach(previousCue => {
    previousCue.classList.remove("cue--focus");
    previousCue.querySelector(".cue-select-button")?.classList.toggle("cue-select-button--playing", false);
  });

  scrollTarget?.classList.add("cue--focus");

  timeButton?.classList.toggle("cue-select-button--playing", isPlaying);

  scrollTarget?.scrollIntoView({ behavior: "smooth", block: "center" });
}

function setToTime(event, video) {
  const target = event.target.closest(".cue");

  if (!target) return;

  // NOTE: Adding a fraction of a second to the star time is done to handle Chrome / Firefox selection discrepancy,
  // cf. README.md note I
  let cueStartTime = parseFloat(target.dataset.startTime) + 0.00001;

  if (!cueStartTime) return;

  video.currentTime = parseFloat(cueStartTime);
}

function playPauseMedia(event, video, editorWrapper) {
  setToTime(event, video);

  const isPlaying = video.paused;
  editorWrapper.classList.toggle("is-playing", !isPlaying);

  if (!event.target.matches(".cue-play-button, .cue-pause-button")) return;

  isPlaying ? video.play() : video.pause();
}

function updatePlayState(event, video, editorWrapper) {
  const isPlaying = !video.paused;

  editorWrapper.classList.toggle("is-playing", isPlaying);
}

function updateLocalMediaItem(mediaItemId, mediaItem) {
  setLocalMediaItem(mediaItemId, mediaItem);
}

function showEditSuccessNotification(cueId, updatedText, previousText) {
  const notification = document.querySelector(`#cue-notification-${cueId}`);
  notification.textContent = "Edit saved 👍";
  notification.classList.add("cue-notification--success");

  setTimeout(() => {
    notification.textContent = "";
    notification.classList.remove("cue-notification--success");
  }, 2000);
}

function handleTextChange(event, media, video) {
  const cue = event.target.closest("[data-cue]");

  const cueId = cue && cue.dataset.cue;

  if (!cueId) {
    return;
  }

  const updatedText = event.target.value.trim();

  if (!updatedText) {
    return;
  }

  const mediaItemId = extractMediaItemIdFromUrl();

  if (!mediaItemId) {
    return;
  }

  getMediaItem(mediaItemId).then(mediaItem => {
    const transcript = mediaItem.transcript;
    const segment = transcript.segments[cueId];

    if (segment) {
      const previousText = segment.text.trim();

      segment.text = updatedText;

      if (!segment.edits) {
        segment.edits = [];
      }

      segment.edits.push(previousText);

      updateLocalMediaItem(mediaItemId, mediaItem);

      const track = video.textTracks[0];
      const activeCue = track.activeCues[0];

      if (activeCue) {
        activeCue.text = updatedText;
      }

      showEditSuccessNotification(cueId, updatedText, previousText);
    }
  });
}

function renderEditor(mediaData, editorWrapper) {
  const { id: itemId, video, controls } = mediaData;

  const track = video.textTracks[0];
  const cues = Array.from(video.textTracks[0].cues);

  // Add the transcript form and get the form element
  const form = addTranscript({ track, cues, itemId, editorWrapper });

  // Add event listeners for the cue change
  track.addEventListener("cuechange", event => {
    highlightCueSegment(event, video, editorWrapper);
  });

  // Add event listeners for the play and pause buttons
  editorWrapper.addEventListener("click", event => playPauseMedia(event, video, editorWrapper));

  // Add event listeners for the video events
  ["playing", "pause"].forEach(type => {
    video.addEventListener(type, event => updatePlayState(event, video, editorWrapper));
  });

  // Add event listeners to manage editing the transcript
  form.addEventListener("submit", event => event.preventDefault());
  form.addEventListener("change", event => {
    handleTextChange(event, mediaData, video);
  });

  controls.addEventListener("change", event => {
    if (!event.target.matches("#show-problems")) return;
    const isChecked = event.target.checked;

    editorWrapper.classList.toggle("show-problems", isChecked);
  });
}

export { renderEditor };
