// --- Variables & Setup --- //
const video = document.querySelector("video");

Object.assign(video, {
  controls: true,
  muted: true,
  loop: true,
  poster: "media/images/01.jpeg",
  src: "media/audio-video/newscast.mp4",
  playbackRate: 3.0,
});

// --- Functions --- //

function findTrackByMode(textTracks, mode) {
  for (const track of textTracks) {
    if (track.mode === mode) return track;
  }
  return null;
}

function createCueElement(cueId, cueText) {
  const cueElement = document.createElement("div");
  cueElement.id = `cue-${cueId}`;
  cueElement.className = "cue";
  cueElement.textContent = cueText;
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
    const cueElement = createCueElement(cueMap.size, cue.text);

    cueMap.set(cue, cueElement);

    allCuesFragment.appendChild(cueElement);
  }

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
