// --- Variables & Setup --- //

const videoElement = document.querySelector("video");

Object.assign(videoElement, {
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
  return [...textTracks].find(track => track.mode === mode) || null;
}

function formatTime(totalSeconds) {
  const hours = `${Math.floor(totalSeconds / 3600) % 24}`.padStart(2, "0");
  const minutes = `${Math.floor(totalSeconds / 60) % 60}`.padStart(2, "0");
  const seconds = `${Math.floor(totalSeconds % 60)}`.padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
}

function createCueElement(cue) {
  if (!cue) return null;

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

  const handleClick = cue => () => (videoElement.currentTime = cue.startTime);

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
    videoElement.currentTime = currentCue.startTime;
    const currentCueElement = cueMap.get(currentCue);
    currentCueElement.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
    currentCueElement.classList.add("cue--current");
  }

  addCueEventListeners(cueMap);
}

// --- Init & Event Listeners --- //

videoElement.addEventListener("loadeddata", () => {
  const textTracks = videoElement.textTracks;
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
      videoElement.dispatchEvent(trackChangedEvent);
    }, 100);
  };
});

videoElement.addEventListener("trackChanged", ({ detail: { track } }) => {
  addTranscript(track);
});
