// --- Variables & Setup --- //
const video = document.querySelector("video");

Object.assign(video, {
  controls: true,
  autoplay: true,
  muted: true,
  loop: true,
  poster: "/media/images/01.jpeg",
  src: "/media/audio-video/newscast.mp4",
  playbackRate: 1.0,
});

// --- Functions --- //

function findTrackByMode(textTracks, mode) {
  for (const track of textTracks) {
    if (track.mode === mode) return track;
  }
  return null;
}

function formatTime(totalSeconds) {
  const hours = String(Math.floor(totalSeconds / 3600) % 24).padStart(2, "0");

  const minutes = String(Math.floor(totalSeconds / 60) % 60).padStart(2, "0");

  const seconds = String(Math.floor(totalSeconds % 60)).padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
}

function createCueElement(cue) {
  if (!cue) return;

  const cueElement = document.createElement("div");
  cueElement.id = `cue-${cue.id}`;
  cueElement.className = "cue";
  cueElement.textContent = cue.text;
  return cueElement;
}

function addCueEventListeners(cueMap) {
  const handleEnter = element => () => {
    element.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
    element.classList.add("cue--current");
  };

  const handleExit = element => () => element.classList.remove("cue--current");

  const handleClick = cue => () => (video.currentTime = cue.startTime);

  for (const [cue, element] of cueMap.entries()) {
    cue.onenter = handleEnter(element);
    cue.onexit = handleExit(element);
    element.onclick = handleClick(cue);
  }
}

function addTranscript(track, transcriptElement = document.querySelector("#transcript")) {
  transcriptElement.innerHTML = "";

  if (!track) return;

  const cueMap = new Map();
  const allCuesFragment = document.createDocumentFragment();

  for (const cue of track.cues) {
    const cueElement = createCueElement(cue);

    cueMap.set(cue, cueElement);

    allCuesFragment.appendChild(cueElement);
  }

  transcriptElement.setAttribute("lang", track.language);
  transcriptElement.appendChild(allCuesFragment);

  const currentCue = track.activeCues[0];
  if (currentCue) {
    video.currentTime = currentCue.startTime;
    const currentCueElement = cueMap.get(currentCue);
    currentCueElement.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
    currentCueElement.classList.add("cue--current");
  }

  addCueEventListeners(cueMap);
}

// --- Init & Event Listeners --- //

video.addEventListener("loadeddata", () => {
  const textTracks = video.textTracks;
  if (!textTracks) return;

  const showingTrack = findTrackByMode(textTracks, "showing");
  addTranscript(showingTrack);

  textTracks.onchange = () => {
    const showingTrack = findTrackByMode(textTracks, "showing");

    const trackChangedEvent = new CustomEvent("trackChanged", {
      detail: {
        track: showingTrack,
      },
    });

    setTimeout(() => {
      video.dispatchEvent(trackChangedEvent);
    }, 100);
  };
});

video.addEventListener("trackChanged", ({ detail: { track } }) => {
  addTranscript(track);
});
