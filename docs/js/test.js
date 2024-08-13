const mediaElement = document.querySelector("video");
Object.assign(mediaElement, {
  controls: true,
  // autoplay: true,
  muted: true,
  loop: true,
  poster: "media/images/01.jpeg",
  src: "media/audio-video/newscast.mp4",
  playbackRate: "4.0",
});

const captionsElement = document.querySelector("#captions");

function findKeyByValue(map, valueToFind) {
  if (!map || valueToFind === undefined) {
    return null;
  }

  for (const [key, value] of map) {
    if (value === valueToFind) {
      return key;
    }
  }

  return null;
}

// create cuesMap
function createCueElement(cueId, textContent) {
  const cueElement = document.createElement("div");
  Object.assign(cueElement, {
    id: `cue-${cueId}`,
    className: "cue",
    textContent: textContent,
  });
  return cueElement;
}

function addCueListeners(cuesMap) {
  for (const [cue, element] of cuesMap.entries()) {
    cue.onenter = () => {
      element.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
      element.classList.add("cue--current");
    };

    cue.onexit = () => {
      element.classList.remove("cue--current");
    };

    element.onclick = () => {
      mediaElement.currentTime = cue.startTime;
    };
  }
}

mediaElement.addEventListener("loadeddata", () => {
  const textTracks = mediaElement.textTracks;
  if (!textTracks) return;

  const cuesMap = new Map();
  const allCuesFragment = document.createDocumentFragment();

  for (const track of textTracks) {
    const isShowing = track?.mode === "showing";
    const hasCues = track?.cues?.length > 0;

    if (!hasCues || !isShowing) {
      continue;
    }

    let cueCount = 0;

    for (const cue of track.cues) {
      cue.id = cueCount;

      const cueElement = createCueElement(cue.id, cue.text);

      cuesMap.set(cue, cueElement);

      allCuesFragment.appendChild(cueElement);

      cueCount++;
    }

    captionsElement.appendChild(allCuesFragment);
  }

  addCueListeners(cuesMap);

  textTracks.onchange = event => {
    Array.from(textTracks).forEach(track => {
      const isShowing = track?.mode === "showing";
      if (!isShowing) {
        captionsElement.innerHTML = "";
        return;
      }

      const cues = track.cues;

      setTimeout(() => {
        let cueCount = 0;

        for (const cue of cues) {
          cue.id = cueCount;

          const cueElement = createCueElement(cue.id, cue.text);

          cuesMap.set(cue, cueElement);

          allCuesFragment.appendChild(cueElement);

          cueCount++;
        }

        captionsElement.innerHTML = "";
        captionsElement.appendChild(allCuesFragment);

        const isOnCue = track?.activeCues[0]?.startTime;
        if (isOnCue) {
          mediaElement.currentTime = isOnCue;
          const cueElement = cuesMap.get(track?.activeCues[0]);
          cueElement.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
          cueElement.classList.add("cue--current");
        }

        addCueListeners(cuesMap);
      }, 100);
    });
  };
});
