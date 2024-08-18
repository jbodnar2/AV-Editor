function findTrackByMode(textTracks, mode) {
  return [...textTracks].find(track => track.mode === mode) || null;
}

function createCueElement(cue) {
  if (!cue) return null;

  const cueElement = document.createElement("div");
  cueElement.id = `cue-${cue.id}`;
  cueElement.className = "cue";
  cueElement.textContent = cue.text;

  return cueElement;
}

function addCueEventListeners(cueMap, videoElement) {
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

function addTranscript(track, transcriptElement, videoElement) {
  transcriptElement.innerHTML = "";

  if (!track) return;

  const cueMap = new Map();
  const allCuesFragment = document.createDocumentFragment();

  for (const cue of track.cues) {
    cue.id = cueMap.size;
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

  addCueEventListeners(cueMap, videoElement);
}

function appendTranscript(videoElement, transcriptElement) {
  const textTracks = videoElement.textTracks;
  if (!textTracks) return;

  const showingTrack = findTrackByMode(textTracks, "showing");
  addTranscript(showingTrack, transcriptElement, videoElement);

  textTracks.onchange = () => {
    const showingTrack = findTrackByMode(textTracks, "showing");
    if (!showingTrack) {
      addTranscript(showingTrack, transcriptElement, videoElement);
      return;
    }

    function hasCuesAddTranscript() {
      let hasCues = showingTrack.cues.length > 0;
      if (hasCues) {
        return addTranscript(showingTrack, transcriptElement, videoElement);
      }

      requestAnimationFrame(hasCuesAddTranscript);
    }

    requestAnimationFrame(hasCuesAddTranscript);
  };
}

export { appendTranscript };
