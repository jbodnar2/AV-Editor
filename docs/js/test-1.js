const videoElement = document.querySelector("video");
Object.assign(videoElement, {
  controls: true,
  // autoplay: true,
  muted: true,
  loop: true,
  poster: "media/images/01.jpeg",
  src: "media/audio-video/newscast.mp4",
  playbackRate: 4.0,
});

const captionsElement = document.querySelector("#captions");

function findKeyByValue(map, valueToFind) {
  if (!map || valueToFind === undefined) {
    return null;
  }

  for (const [key, value] of map.entries()) {
    if (value === valueToFind) {
      return key;
    }
  }

  return null;
}

function createCueElement(cueId, cueText) {
  const cueElement = document.createElement("div");
  Object.assign(cueElement, {
    id: `cue-${cueId}`,
    className: "cue",
    textContent: cueText,
  });
  return cueElement;
}

function addCueListeners(cueMap) {
  for (const [cue, element] of cueMap.entries()) {
    cue.onenter = () => {
      element.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
      element.classList.add("cue--current");
    };

    cue.onexit = () => {
      element.classList.remove("cue--current");
    };

    element.onclick = () => {
      videoElement.currentTime = cue.startTime;
    };
  }
}

function addTranscript(track, captionsElement) {
  captionsElement = captionsElement || document.querySelector("#captions");
  captionsElement.innerHTML = "";

  if (!track) return;

  const cueMap = new Map();
  const allCuesFragment = document.createDocumentFragment();

  if (track?.cues) {
    for (const cue of track.cues) {
      const cueElement = createCueElement(cueMap.size, cue.text);

      cueMap.set(cue, cueElement);

      allCuesFragment.appendChild(cueElement);
    }

    captionsElement.appendChild(allCuesFragment);

    const isOnCue = track.activeCues[0]?.startTime;
    if (isOnCue) {
      videoElement.currentTime = isOnCue;
      const cueElement = cueMap.get(track.activeCues[0]);
      cueElement.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
      cueElement.classList.add("cue--current");
    }

    addCueListeners(cueMap);
  }
}

videoElement.addEventListener("loadeddata", () => {
  const textTracks = videoElement.textTracks;
  if (!textTracks) return;

  const track = Array.from(textTracks).find(track => track.mode === "showing");

  addTranscript(track);

  textTracks.onchange = event => {
    const track = Array.from(textTracks).find(track => track.mode === "showing");

    const trackChangedEvent = new CustomEvent("trackChanged", {
      detail: {
        bubbles: true,
        composed: true,
        cancelable: true,
        track: track,
      },
    });

    setTimeout(() => {
      videoElement.dispatchEvent(trackChangedEvent);
    }, 100);
  };
});

videoElement.addEventListener("trackChanged", event => {
  addTranscript(event.detail.track);
});
